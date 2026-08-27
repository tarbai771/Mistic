"use client";

import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { Markdown } from "@tiptap/markdown";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from "lucide-react";
import { useEffect } from "react";
import type * as Y from "yjs";
import { Toggle } from "@/components/ui/toggle";
import type { SupabaseBroadcastProvider } from "@/lib/supabase-broadcast-provider";

interface CollaborativeEditorProps {
  doc: Y.Doc;
  provider: SupabaseBroadcastProvider | null;
  error?: string | null;
  connected?: boolean;
  user?: { name: string; color: string };
}

function CollaborativeTiptap({
  doc,
  provider,
  user,
}: {
  doc: Y.Doc;
  provider: SupabaseBroadcastProvider;
  user: { name: string; color: string };
}) {
  const editor = useEditor({
    immediatelyRender: true,
    extensions: [
      StarterKit,
      Markdown,
      Collaboration.configure({ document: doc, field: "tiptap" }),
      CollaborationCursor.configure({ provider, user }),
    ],
  });

  useEffect(() => {
    provider.setUser(user);
  }, [provider, user]);

  const handleExportMarkdown = () => {
    if (!editor) return;
    const markdown = editor.getMarkdown();
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "note.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!editor) return null;

  return (
    <div className="flex flex-col h-full bg-background rounded-xl border-4 border-muted focus-within:border-secondary transition-colors">
      <div className="flex items-center gap-1 border-b p-2 bg-muted/40 flex-wrap">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="w-4 h-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="w-4 h-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="w-4 h-4" />
        </Toggle>

        <div className="w-px h-6 bg-border mx-1" />

        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 1 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 className="w-4 h-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="w-4 h-4" />
        </Toggle>

        <div className="w-px h-6 bg-border mx-1" />

        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          <List className="w-4 h-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          <ListOrdered className="w-4 h-4" />
        </Toggle>

        <div className="w-px h-6 bg-border mx-1" />
        <Toggle size="sm" onPressedChange={handleExportMarkdown}>
          Export MD
        </Toggle>
      </div>

      <div className="flex-1 p-4 overflow-y-auto cursor-text flex flex-col">
        <EditorContent
          editor={editor}
          className="prose dark:prose-invert max-w-none focus:outline-none flex-1 [&_.tiptap]:min-h-full [&_.tiptap]:outline-none [&_.ProseMirror]:outline-none"
        />
      </div>
    </div>
  );
}

export function CollaborativeEditor({
  doc,
  provider,
  error,
  connected,
  user,
}: CollaborativeEditorProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-sm">
        <p className="text-destructive font-medium">Connection failed</p>
        <p className="text-muted-foreground">{error}</p>
        <p className="text-muted-foreground text-xs">
          Check your network or try reloading the page.
        </p>
      </div>
    );
  }

  if (!provider || !doc) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm gap-2">
        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        Initializing sync module...
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm gap-2">
        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        Connecting to workspace...
      </div>
    );
  }

  const resolvedUser = user ?? {
    name: "Anonymous",
    color: "#818cf8",
  };

  return (
    <CollaborativeTiptap doc={doc} provider={provider} user={resolvedUser} />
  );
}
