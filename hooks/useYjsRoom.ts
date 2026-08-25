"use client";

import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import type { SupabaseBroadcastProvider } from "@/lib/supabase-broadcast-provider";

export function useYjsRoom(roomCode: string) {
  const docRef = useRef<Y.Doc | null>(null);
  const [provider, setProvider] = useState<SupabaseBroadcastProvider | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  if (!docRef.current) {
    docRef.current = new Y.Doc();
  }

  useEffect(() => {
    if (!roomCode || !docRef.current) return;

    let destroyed = false;
    let providerInstance: SupabaseBroadcastProvider | null = null;
    let persistenceInstance: any = null;

    Promise.all([
      import("@/lib/supabase-broadcast-provider"),
      import("y-indexeddb"),
    ])
      .then(([{ SupabaseBroadcastProvider }, { IndexeddbPersistence }]) => {
        if (destroyed || !docRef.current) return;

        persistenceInstance = new IndexeddbPersistence(
          `room-${roomCode}`,
          docRef.current,
        );

        providerInstance = new SupabaseBroadcastProvider(
          roomCode,
          docRef.current,
        );

        providerInstance.on("status", ({ connected: isConnected }) => {
          if (!destroyed) setConnected(isConnected);
        });

        if (!destroyed) {
          setProvider(providerInstance);
        }
      })
      .catch((err) => {
        if (!destroyed) {
          console.error("Failed to load collaboration modules:", err);
          setError(err?.message || "Failed to load collaboration module");
        }
      });

    return () => {
      destroyed = true;
      providerInstance?.destroy();
      persistenceInstance?.destroy();
      setProvider(null);
      setConnected(false);
    };
  }, [roomCode]);

  return { doc: docRef.current, provider, error, connected };
}
