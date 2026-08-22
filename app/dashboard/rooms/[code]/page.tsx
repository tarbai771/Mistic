"use client";

import { use, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ActiveRoomPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  // 1. Unwrap the params Promise
  const resolvedParams = use(params);
  const code = resolvedParams.code;

  const [roomName, setRoomName] = useState("Loading...");

  useEffect(() => {
    if (!code) return;

    const supabase = createClient();
    const cleanCode = code.trim().toLowerCase();

    async function fetchRoom() {
      const { data, error } = await supabase
        .from("rooms")
        .select("name")
        .eq("code", cleanCode)
        .maybeSingle();

      if (error) {
        console.error("Supabase Error:", error.message);
        setRoomName("Error Loading Room");
        return;
      }

      if (!data) {
        setRoomName("Room Not Found");
        return;
      }

      setRoomName(data.name);
    }

    fetchRoom();
  }, [code]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{roomName}</h1>
      <p className="text-sm font-mono text-muted-foreground">Code: {code}</p>
    </div>
  );
}
