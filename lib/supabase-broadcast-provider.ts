"use client";

import {
  Awareness,
  applyAwarenessUpdate,
  encodeAwarenessUpdate,
  removeAwarenessStates,
} from "y-protocols/awareness";
import * as Y from "yjs";
import { createClient } from "@/lib/supabase/client";

type StatusHandler = (status: { connected: boolean }) => void;
type DestroyHandler = () => void;

export class SupabaseBroadcastProvider {
  private channel: ReturnType<ReturnType<typeof createClient>["channel"]>;
  private doc: Y.Doc;
  awareness: Awareness;
  private statusHandlers: StatusHandler[] = [];
  private destroyHandlers: DestroyHandler[] = [];
  private docUpdateHandler: (update: Uint8Array, origin: unknown) => void;
  private awarenessUpdateHandler: (
    changes: { added: number[]; updated: number[]; removed: number[] },
    origin: unknown,
  ) => void;
  private _destroyed = false;
  private _subscribed = false;
  private _pendingUser: { name: string; color: string } | null = null;

  constructor(roomCode: string, doc: Y.Doc) {
    this.doc = doc;
    this.awareness = new Awareness(doc);
    this.channel = createClient().channel(`room-${roomCode}`);

    // Broadcast local doc updates
    this.docUpdateHandler = (update: Uint8Array, origin: unknown) => {
      if (this._destroyed) return;
      if (origin === this) return;
      if (!this._subscribed) return;

      const data = Array.from(update);
      this.channel.send({
        type: "broadcast",
        event: "doc-update",
        payload: { data },
      });
    };
    this.doc.on("update", this.docUpdateHandler);

    // Broadcast local awareness changes to other tabs
    this.awarenessUpdateHandler = (
      changes: { added: number[]; updated: number[]; removed: number[] },
      origin: unknown,
    ) => {
      if (this._destroyed) return;
      if (origin === this) return;
      if (!this._subscribed) return;

      const changedClients = [
        ...changes.added,
        ...changes.updated,
        ...changes.removed,
      ];
      if (changedClients.length === 0) return;

      const update = encodeAwarenessUpdate(this.awareness, changedClients);
      this.channel.send({
        type: "broadcast",
        event: "awareness-update",
        payload: { data: Array.from(update) },
      });
    };
    this.awareness.on("update", this.awarenessUpdateHandler);

    // Listen for remote doc updates
    this.channel.on(
      "broadcast",
      { event: "doc-update" },
      (payload: { payload: { data: number[] } }) => {
        if (this._destroyed) return;
        const update = new Uint8Array(payload.payload.data);
        Y.applyUpdate(this.doc, update, this);
      },
    );

    // Listen for remote awareness updates
    this.channel.on(
      "broadcast",
      { event: "awareness-update" },
      (payload: { payload: { data: number[] } }) => {
        if (this._destroyed) return;
        const update = new Uint8Array(payload.payload.data);
        applyAwarenessUpdate(this.awareness, update, this);
      },
    );

    // Listen for peer leaving
    this.channel.on(
      "broadcast",
      { event: "awareness-leave" },
      (payload: { payload: { clientId: number } }) => {
        if (this._destroyed) return;
        removeAwarenessStates(this.awareness, [payload.payload.clientId], this);
      },
    );

    // Subscribe and track connection status
    this.channel.subscribe((status: string) => {
      if (this._destroyed) return;
      if (status === "SUBSCRIBED") {
        this._subscribed = true;
        setTimeout(() => {
          if (this._destroyed) return;
          const stateVector = Y.encodeStateVector(this.doc);
          this.channel.send({
            type: "broadcast",
            event: "sync-request",
            payload: { data: Array.from(stateVector) },
          });
          const localState = this.awareness.getLocalState();
          if (localState) {
            this._broadcastAwarenessState();
          }
          if (this._pendingUser) {
            this.awareness.setLocalStateField("user", this._pendingUser);
            this._broadcastAwarenessState();
            this._pendingUser = null;
          }
        }, 0);
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

  setUser(user: { name: string; color: string }) {
    this.awareness.setLocalStateField("user", user);
    if (this._subscribed) {
      this._broadcastAwarenessState();
    } else {
      this._pendingUser = user;
    }
  }

  private _broadcastAwarenessState() {
    const update = encodeAwarenessUpdate(this.awareness, [
      this.awareness.clientID,
    ]);
    this.channel.send({
      type: "broadcast",
      event: "awareness-update",
      payload: { data: Array.from(update) },
    });
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

    this.channel.send({
      type: "broadcast",
      event: "awareness-leave",
      payload: {
        clientId: this.awareness.clientID,
      },
    });

    this.doc.off("update", this.docUpdateHandler);
    this.awareness.off("update", this.awarenessUpdateHandler);
    this.awareness.destroy();
    createClient().removeChannel(this.channel);

    for (const handler of this.destroyHandlers) {
      handler();
    }
  }
}
