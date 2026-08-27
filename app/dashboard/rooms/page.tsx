"use client";

import { LogIn, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

function generateRoomCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const segment = () =>
    Array.from(
      { length: 4 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
  return `${segment()}-${segment()}`;
}

export default function CreateRoomPage() {
  const router = useRouter();

  // State for Join Room
  const [joinCode, setJoinCode] = useState("");

  // State for Create Room
  const [roomCode, setRoomCode] = useState(generateRoomCode());
  const [creating, setCreating] = useState(false);

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    const cleanCode = joinCode.trim().toLowerCase();
    router.push(`/dashboard/rooms/${cleanCode}`);
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) return;

    try {
      setCreating(true);
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("You must be logged in to create a room.");

      const cleanCode = roomCode.trim().toLowerCase();

      const displayName =
        user.user_metadata?.display_name ||
        user.user_metadata?.username ||
        "User";

      const defaultRoomName = `${displayName}'s Room`;

      const { error } = await supabase.from("rooms").insert({
        code: cleanCode,
        name: defaultRoomName,
        created_by: user.id,
      });

      if (error) {
        if (error.code === "23505") {
          alert("This room code already exists. Click refresh for a new code.");
          return;
        }
        throw error;
      }

      router.push(`/dashboard/rooms/${cleanCode}`);
    } catch (err: any) {
      alert(err.message || "Failed to create room.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-4 space-y-6">
      {/* Join Room Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogIn className="w-5 h-5" />
            Join Existing Room
          </CardTitle>
          <CardDescription>
            Enter an 8-character room code to enter a workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoinRoom} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="join-code">Room Code</Label>
              <Input
                id="join-code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="e.g. psij-uioh"
                required
                className="font-mono text-sm"
              />
            </div>
            <Button type="submit" variant="secondary" className="w-full">
              Join Room
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Create Room Card */}
      <Card>
        <CardHeader>
          <CardTitle>Create Room</CardTitle>
          <CardDescription>
            Generate a code to start your room workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateRoom} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="room-code">Room Code</Label>
              <div className="flex gap-2">
                <Input
                  id="room-code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  placeholder="e.g. psij-uioh"
                  required
                  className="font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setRoomCode(generateRoomCode())}
                  title="Generate new code"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button type="submit" disabled={creating} className="w-full">
              {creating ? "Creating..." : "Launch Room"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
