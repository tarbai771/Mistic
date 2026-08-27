"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ExcalidrawBinding } from "y-excalidraw";
import type * as Y from "yjs";
import "@excalidraw/excalidraw/index.css";

const Excalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then((m) => m.Excalidraw),
  { ssr: false },
);

interface ExcalidrawBoardProps {
  doc: Y.Doc;
  provider: any;
  user?: {
    name: string;
    color: string;
  };
}

function InnerExcalidrawBoard({ doc, provider, user }: ExcalidrawBoardProps) {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const bindingRef = useRef<ExcalidrawBinding | null>(null);

  useEffect(() => {
    if (!excalidrawAPI || !doc || !provider) return;

    if (user && provider.awareness) {
      provider.setUser({
        name: user.name || "Anonymous",
        color: user.color || "#818cf8",
      });
    }

    const yElements = doc.getArray<any>("excalidraw");
    const yAssets = doc.getMap<any>("excalidraw-assets");

    const binding = new ExcalidrawBinding(
      yElements,
      yAssets,
      excalidrawAPI,
      provider.awareness,
    );

    bindingRef.current = binding;

    return () => {
      binding.destroy();
      bindingRef.current = null;
    };
  }, [excalidrawAPI, doc, provider, user]);

  const handlePointerUpdate = (payload: {
    pointer: { x: number; y: number; tool: string };
    button: string;
  }) => {
    if (!provider.awareness) return;
    provider.awareness.setLocalStateField("pointer", payload.pointer);
    provider.awareness.setLocalStateField("button", payload.button);
  };

  return (
    <div className="w-full h-full min-h-[500px] border rounded-lg overflow-hidden relative bg-background flex-1">
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        isCollaborating={true}
        onPointerUpdate={handlePointerUpdate}
        UIOptions={{
          canvasActions: {
            changeViewBackgroundColor: true,
            clearCanvas: true,
            export: { saveFileToDisk: true },
          },
        }}
      />
    </div>
  );
}

export function ExcalidrawBoard(props: ExcalidrawBoardProps) {
  if (!props.provider || !props.doc) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Connecting to canvas room...
      </div>
    );
  }

  return <InnerExcalidrawBoard {...props} />;
}
