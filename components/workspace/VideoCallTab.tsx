"use client";

import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface VideoCallTabProps {
  roomCode: string;
  user?: { id?: string; name?: string };
}

export function VideoCallTab({ roomCode, user }: VideoCallTabProps) {
  const [token, setToken] = useState<string>("");
  const username = user?.name || `User-${Math.floor(Math.random() * 1000)}`;

  useEffect(() => {
    let isMounted = true;

    async function fetchToken() {
      try {
        const res = await fetch(
          `/api/livekit/token?room=${encodeURIComponent(
            roomCode,
          )}&username=${encodeURIComponent(username)}`,
        );
        const data = await res.json();
        if (isMounted && data.token) {
          setToken(data.token);
        }
      } catch (err) {
        console.error("Failed to fetch LiveKit token:", err);
      }
    }

    fetchToken();

    return () => {
      isMounted = false;
    };
  }, [roomCode, username]);

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-2">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Connecting to video room...
        </p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      className="h-full w-full flex flex-col justify-between rounded-lg overflow-hidden border border-border bg-background"
    >
      <MyVideoConference />
      <RoomAudioRenderer />
      <ControlBar />
    </LiveKitRoom>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: false },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100% - 60px)" }}
      className="p-4"
    >
      <ParticipantTile />
    </GridLayout>
  );
}
