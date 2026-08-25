"use client";

import * as Y from "yjs";
import { createClient } from "@/lib/supabase/client";

type StatusHandler = (status: { connected: boolean }) => void;
type DestroyHandler = () => void;

interface AwarenessState {
  user?: { name: string; color: string };
  [key: string]: unknown;
}

class BroadcastAwareness {
  private states = new Map<number, AwarenessState>();
  localClientId: number;
  private updateHandlers: Array<() => void> = [];

  constructor() {
    this.localClientId = Math.floor(Math.random() * 2 ** 31);
  }

  getStates() {
    return this.states;
  }

  setLocalStateField(field: string, value: unknown) {
    const current = this.states.get(this.localClientId) || {};
    this.states.set(this.localClientId, { ...current, [field]: value });
    this.emitUpdate();
  }

  getLocalState(): AwarenessState | undefined {
    return this.states.get(this.localClientId);
  }

  on(event: string, handler: () => void) {
    if (event === "update") {
      this.updateHandlers.push(handler);
    }
  }

  off(event: string, handler: () => void) {
    if (event === "update") {
      this.updateHandlers = this.updateHandlers.filter((h) => h !== handler);
    }
  }

  private emitUpdate() {
    for (const handler of this.updateHandlers) {
      handler();
    }
  }

  receiveUpdate(clientId: number, state: AwarenessState | null) {
    if (state === null) {
      this.states.delete(clientId);
    } else {
      this.states.set(clientId, state);
    }
    this.emitUpdate();
  }

  destroy() {
    this.states.clear();
    this.updateHandlers = [];
  }
}

export class SupabaseBroadcastProvider {
  private channel: ReturnType<ReturnType<typeof createClient>["channel"]>;
  private doc: Y.Doc;
  awareness: BroadcastAwareness;
  private statusHandlers: StatusHandler[] = [];
  private destroyHandlers: DestroyHandler[] = [];
  private docUpdateHandler: (update: Uint8Array, origin: unknown) => void;
  private _destroyed = false;
  private _subscribed = false;

  constructor(roomCode: string, doc: Y.Doc) {
    this.doc = doc;
    this.awareness = new BroadcastAwareness();
    this.channel = createClient().channel(`room-${roomCode}`);

    // Broadcast local doc updates
    this.docUpdateHandler = (update: Uint8Array, origin: unknown) => {
      if (this._destroyed) return;
      if (origin === this) return; // Skip updates from this provider
      if (!this._subscribed) return; // Wait for WebSocket connection

      // Convert Uint8Array to regular array for JSON serialization
      const data = Array.from(update);
      this.channel.send({
        type: "broadcast",
        event: "doc-update",
        payload: { data },
      });

      // Also broadcast awareness
      const localState = this.awareness.getLocalState();
      if (localState) {
        this.channel.send({
          type: "broadcast",
          event: "awareness-update",
          payload: {
            clientId: this.awareness.localClientId,
            state: localState,
          },
        });
      }
    };
    this.doc.on("update", this.docUpdateHandler);

    // Listen for remote updates
    this.channel.on(
      "broadcast",
      { event: "doc-update" },
      (payload: { payload: { data: number[] } }) => {
        if (this._destroyed) return;
        const update = new Uint8Array(payload.payload.data);
        Y.applyUpdate(this.doc, update, this);
      },
    );

    // Listen for remote awareness
    this.channel.on(
      "broadcast",
      { event: "awareness-update" },
      (payload: { payload: { clientId: number; state: AwarenessState } }) => {
        if (this._destroyed) return;
        this.awareness.receiveUpdate(
          payload.payload.clientId,
          payload.payload.state,
        );
      },
    );

    // Listen for peer leaving
    this.channel.on(
      "broadcast",
      { event: "awareness-leave" },
      (payload: { payload: { clientId: number } }) => {
        if (this._destroyed) return;
        this.awareness.receiveUpdate(payload.payload.clientId, null);
      },
    );

    // Subscribe and track connection status
    this.channel.subscribe((status: string) => {
      if (this._destroyed) return;
      if (status === "SUBSCRIBED") {
        this._subscribed = true;
        // Send current doc state to sync with existing peers
        const stateVector = Y.encodeStateVector(this.doc);
        this.channel.send({
          type: "broadcast",
          event: "sync-request",
          payload: { data: Array.from(stateVector) },
        });
        this.emitStatus(true);
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        this.emitStatus(false);
      }
    });

    // Handle sync requests from new peers
    this.channel.on(
      "broadcast",
      { event: "sync-request" },
      (payload: { payload: { data: number[] } }) => {
        if (this._destroyed) return;
        const remoteVector = new Uint8Array(payload.payload.data);
        const diff = Y.encodeStateAsUpdate(this.doc, remoteVector);
        if (diff.length > 1) {
          // More than just the empty byte
          this.channel.send({
            type: "broadcast",
            event: "doc-update",
            payload: { data: Array.from(diff) },
          });
        }
      },
    );
  }

  private emitStatus(connected: boolean) {
    for (const handler of this.statusHandlers) {
      handler({ connected });
    }
  }

  on(event: string, handler: StatusHandler | DestroyHandler) {
    if (event === "status") {
      this.statusHandlers.push(handler as StatusHandler);
    } else if (event === "destroy") {
      this.destroyHandlers.push(handler as DestroyHandler);
    }
  }

  off(event: string, handler: StatusHandler | DestroyHandler) {
    if (event === "status") {
      this.statusHandlers = this.statusHandlers.filter((h) => h !== handler);
    } else if (event === "destroy") {
      this.destroyHandlers = this.destroyHandlers.filter((h) => h !== handler);
    }
  }

  destroy() {
    if (this._destroyed) return;
    this._destroyed = true;
    this._subscribed = false;

    // Notify peers we're leaving
    this.channel.send({
      type: "broadcast",
      event: "awareness-leave",
      payload: {
        clientId: this.awareness.localClientId,
      },
    });

    this.doc.off("update", this.docUpdateHandler);
    this.awareness.destroy();
    createClient().removeChannel(this.channel);

    for (const handler of this.destroyHandlers) {
      handler();
    }
  }
}
