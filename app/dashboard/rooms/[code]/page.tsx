"use client";

import { Edit3, FileText, Folder, Video } from "lucide-react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useYjsRoom } from "@/hooks/useYjsRoom";
import { createClient } from "@/lib/supabase/client";

const VideoCallTab = dynamic(
  () =>
    import("@/components/workspace/VideoCallTab").then((m) => m.VideoCallTab),
  { ssr: false },
);

const CollaborativeEditor = dynamic(
  () =>
    import("@/components/workspace/CollaborativeEditor").then(
      (m) => m.CollaborativeEditor,
    ),
  { ssr: false },
);

// Dynamically import Excalidraw Board
const ExcalidrawBoard = dynamic(
  () =>
    import("@/components/workspace/ExcalidrawBoard").then(
      (m) => m.ExcalidrawBoard,
    ),
  { ssr: false },
);

const CURSOR_COLORS = [
  "#f87171",
  "#fb923c",
  "#fbbf24",
  "#a3e635",
  "#34d399",
  "#22d3ee",
  "#818cf8",
  "#c084fc",
];

export default function ActiveRoomPage() {
  const params = useParams();
  const code = (params?.code as string) ?? "";

  const [activeTab, setActiveTab] = useState<
    "call" | "canvas" | "notes" | "files"
  >("notes");
  const [userInfo, setUserInfo] = useState<{
    name: string;
    color: string;
  } | null>(null);

  const { doc, provider, error, connected } = useYjsRoom(code);

  useEffect(() => {
    const supabase = createClient();
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const name =
          user.user_metadata?.display_name ||
          user.user_metadata?.username ||
          user.email?.split("@")[0] ||
          "Anonymous";
        const randomColor =
          CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];
        setUserInfo({ name, color: randomColor });
      }
    }
    getUser();
  }, []);

  if (!code) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading workspace code...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r bg-sidebar p-4 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="px-2 py-1">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Workspace
            </h2>
            <p className="text-sm font-mono font-bold truncate mt-1">
              Code: {code}
            </p>
          </div>

          <nav className="space-y-1">
            <Button
              variant={activeTab === "call" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveTab("call")}
            >
              <Video className="w-4 h-4" />
              Call
            </Button>
            <Button
              variant={activeTab === "canvas" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveTab("canvas")}
            >
              <Edit3 className="w-4 h-4" />
              Canvas
            </Button>

            <Button
              variant={activeTab === "notes" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveTab("notes")}
            >
              <FileText className="w-4 h-4" />
              Notes
            </Button>

            <Button
              variant={activeTab === "files" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveTab("files")}
            >
              <Folder className="w-4 h-4" />
              File Sharing
            </Button>
          </nav>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 p-6 bg-background overflow-hidden flex flex-col">
        {activeTab === "call" && (
          <VideoCallTab roomCode={code} user={userInfo ?? undefined} />
        )}

        {activeTab === "canvas" && doc && (
          <ExcalidrawBoard
            doc={doc}
            provider={provider}
            user={userInfo ?? undefined}
          />
        )}

        {activeTab === "notes" && doc && (
          <CollaborativeEditor
            doc={doc}
            provider={provider}
            error={error}
            connected={connected}
            user={userInfo ?? undefined}
          />
        )}
      </main>
    </div>
  );
}
