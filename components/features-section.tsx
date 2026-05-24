"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Phone,
  Video,
  VideoOff,
  Mic,
  MicOff,
  UserPlus,
  Activity,
  MousePointer2,
  Square,
  Circle as CircleIcon,
  ArrowRight,
  Edit2,
  Trash2,
  FileText,
  Check,
  Lock,
  Unlock,
  UploadCloud,
  Layers,
  ArrowUpRight,
  Code,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Strict Physics Preset
const SPRING_PHYSICS = { stiffness: 300, damping: 30 };

// -------------------------------------------------------------
// MAGNETIC WRAPPER FOR PRECISE MICRO-INTERACTION
// -------------------------------------------------------------
function MagneticItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING_PHYSICS);
  const springY = useSpring(y, SPRING_PHYSICS);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.35);
    y.set((clientY - centerY) * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={cn("relative z-10", className)}
    >
      {children}
    </motion.div>
  );
}

// -------------------------------------------------------------
// 1. FLUID COMMUNICATION PLAYGROUND
// -------------------------------------------------------------
interface Participant {
  id: string;
  name: string;
  role: string;
  isSpeaking: boolean;
  avatarColor: string;
  isMuted: boolean;
  isVideoOff: boolean;
}

function FluidCommunicationPlayground() {
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: "1",
      name: "Marcus",
      role: "Backend Dev",
      isSpeaking: true,
      avatarColor: "bg-indigo-500",
      isMuted: false,
      isVideoOff: false,
    },
    {
      id: "2",
      name: "Sarah",
      role: "Lead Designer",
      isSpeaking: false,
      avatarColor: "bg-emerald-500",
      isMuted: true,
      isVideoOff: false,
    },
    {
      id: "3",
      name: "You (Host)",
      role: "Frontend Lead",
      isSpeaking: false,
      avatarColor: "bg-primary",
      isMuted: false,
      isVideoOff: false,
    },
  ]);

  const [myMuted, setMyMuted] = useState(false);
  const [myVideoOff, setMyVideoOff] = useState(false);
  const [jitter, setJitter] = useState(12);
  const [bitrate, setBitrate] = useState(1420);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Simulate telemetric fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setJitter(
        Math.max(8, Math.min(24, Math.round(jitter + (Math.random() * 4 - 2)))),
      );
      setBitrate(
        Math.max(
          1200,
          Math.min(1600, Math.round(bitrate + (Math.random() * 40 - 20))),
        ),
      );

      // Simulate other speaker voice waves
      setParticipants((prev) =>
        prev.map((p) => {
          if (p.id === "1" && !p.isMuted) {
            return { ...p, isSpeaking: Math.random() > 0.35 };
          }
          if (p.id === "2" && !p.isMuted) {
            return { ...p, isSpeaking: Math.random() > 0.8 };
          }
          return p;
        }),
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [jitter, bitrate]);

  const toggleMyMute = () => {
    setMyMuted(!myMuted);
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === "3"
          ? {
              ...p,
              isMuted: !myMuted,
              isSpeaking: !myMuted ? false : p.isSpeaking,
            }
          : p,
      ),
    );
  };

  const toggleMyVideo = () => {
    setMyVideoOff(!myVideoOff);
    setParticipants((prev) =>
      prev.map((p) => (p.id === "3" ? { ...p, isVideoOff: !myVideoOff } : p)),
    );
  };

  const handleAddGuest = () => {
    if (participants.length >= 4) return;
    const newGuest: Participant = {
      id: "4",
      name: "Devon",
      role: "QA Engineer",
      isSpeaking: false,
      avatarColor: "bg-amber-500",
      isMuted: false,
      isVideoOff: false,
    };
    setParticipants((prev) => [...prev, newGuest]);
    setShowInviteModal(true);
    setTimeout(() => setShowInviteModal(false), 2000);
  };

  const handleRemoveGuest = () => {
    setParticipants((prev) => prev.filter((p) => p.id !== "4"));
  };

  return (
    <div className="flex flex-col h-full justify-between gap-4">
      {/* Playground Header: Telemetry */}
      <div className="flex justify-between items-center bg-[#0B0B0C] border border-border px-3 py-1.5 rounded text-[10px] font-mono text-muted-foreground select-none">
        <span>VOIP PIPELINE: SECURE_TLS_V1.3</span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            <span>JITTER: {jitter}ms</span>
          </span>
          <span>VIDEO FEED: {bitrate}kbps</span>
          <span>LOSS: 0.00%</span>
        </span>
      </div>

      {/* Main Grid View */}
      <div className="flex-1 grid grid-cols-2 gap-3 min-h-55">
        <AnimatePresence>
          {participants.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={cn(
                "relative rounded-lg border bg-[#0B0B0C] p-4 flex flex-col justify-between overflow-hidden transition-all duration-300",
                p.isSpeaking && !p.isMuted
                  ? "border-primary/40 shadow-[0_0_12px_rgba(139,92,246,0.08)]"
                  : "border-border",
              )}
            >
              {/* Voice active ring */}
              {p.isSpeaking && !p.isMuted && (
                <div className="absolute inset-0 bg-primary/2 pointer-events-none border border-primary/20 rounded-lg animate-pulse" />
              )}

              <div className="flex justify-between items-start z-10">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white tracking-tight">
                    {p.name}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider">
                    {p.role}
                  </span>
                </div>
                <span
                  className={cn(
                    "text-[8px] font-mono px-1.5 py-0.5 rounded border uppercase",
                    p.isMuted
                      ? "bg-destructive/10 border-destructive/20 text-destructive"
                      : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                  )}
                >
                  {p.isMuted ? "MUTED" : "LIVE"}
                </span>
              </div>

              {/* Central representation (minimal camera mock or avatar) */}
              <div className="flex-1 flex items-center justify-center my-3 relative">
                {p.isVideoOff ? (
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <div
                      className={cn(
                        "size-10 rounded-full flex items-center justify-center text-xs font-mono font-bold text-white shadow-lg",
                        p.avatarColor,
                      )}
                    >
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-[8px] font-mono text-muted-foreground uppercase">
                      Camera Disabled
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-full max-h-20 rounded border border-border/40 bg-[#121214] flex items-center justify-center overflow-hidden relative select-none">
                    {/* Simulated live visual stream */}
                    <div className="absolute inset-0 bg-[radial-gradient(#1e1e24_1px,transparent_1px)] bg-size-[12px_12px] h-full w-full flex justify-center items-center">
                      {/* Pulsing signal waveform for speaking */}
                      {p.isSpeaking && !p.isMuted ? (
                        <div className="flex items-center gap-0.5 z-10">
                          <motion.span
                            animate={{ height: [4, 18, 4] }}
                            transition={{ repeat: Infinity, duration: 0.6 }}
                            className="w-0.5 bg-primary"
                          />
                          <motion.span
                            animate={{ height: [4, 28, 4] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.5,
                              delay: 0.1,
                            }}
                            className="w-0.5 bg-primary"
                          />
                          <motion.span
                            animate={{ height: [4, 22, 4] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.7,
                              delay: 0.2,
                            }}
                            className="w-0.5 bg-primary"
                          />
                          <motion.span
                            animate={{ height: [4, 12, 4] }}
                            transition={{ repeat: Infinity, duration: 0.4 }}
                            className="w-0.5 bg-primary"
                          />
                        </div>
                      ) : (
                        <Activity className="size-4 text-muted-foreground/30" />
                      )}
                    </div>

                    <span className="absolute bottom-1 right-1.5 text-[8px] font-mono text-muted-foreground/70">
                      1080P // OPUS
                    </span>
                  </div>
                )}
              </div>

              {/* Micro diagnostic bar */}
              <div className="flex justify-between items-center text-[8px] font-mono text-muted-foreground/80 pt-1.5 border-t border-border/40 z-10">
                <span>RSSI: -45dBm</span>
                {p.id === "4" && (
                  <button
                    onClick={handleRemoveGuest}
                    className="hover:text-destructive hover:underline cursor-pointer transition-colors"
                  >
                    DISCONNECT
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Control Dashboard Panel */}
      <div className="flex items-center justify-between border-t border-border pt-3">
        <div className="flex gap-2">
          {/* Mute toggle button */}
          <button
            onClick={toggleMyMute}
            className={cn(
              "p-2.5 rounded-full border transition-all duration-300 flex items-center justify-center cursor-pointer",
              myMuted
                ? "bg-destructive/10 border-destructive/30 text-destructive"
                : "bg-[#121214] border-border text-muted-foreground hover:text-white hover:border-white/20",
            )}
            title={myMuted ? "Unmute Mic" : "Mute Mic"}
          >
            {myMuted ? (
              <MicOff className="size-4" />
            ) : (
              <Mic className="size-4" />
            )}
          </button>

          {/* Video toggle button */}
          <button
            onClick={toggleMyVideo}
            className={cn(
              "p-2.5 rounded-full border transition-all duration-300 flex items-center justify-center cursor-pointer",
              myVideoOff
                ? "bg-destructive/10 border-destructive/30 text-destructive"
                : "bg-[#121214] border-border text-muted-foreground hover:text-white hover:border-white/20",
            )}
            title={myVideoOff ? "Enable Video" : "Disable Video"}
          >
            {myVideoOff ? (
              <VideoOff className="size-4" />
            ) : (
              <Video className="size-4" />
            )}
          </button>
        </div>

        {/* Magnetic Invitation button */}
        <MagneticItem>
          <button
            onClick={handleAddGuest}
            disabled={participants.length >= 4}
            className={cn(
              "inline-flex h-9 items-center justify-center gap-1.5 rounded-full border px-4 text-xs font-semibold transition-all duration-300",
              participants.length >= 4
                ? "bg-border/20 border-border/40 text-muted-foreground/40 cursor-not-allowed"
                : "bg-primary border-primary text-white hover:scale-[1.03] hover:shadow-[0_0_12px_rgba(139,92,246,0.3)]",
            )}
          >
            <UserPlus className="size-3.5" />
            <span>Invite Guest</span>
          </button>
        </MagneticItem>
      </div>

      {/* Screen Invitation success tooltip */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-16 right-4 bg-[#0B0B0C] border border-primary/30 p-2.5 rounded text-[10px] font-mono text-primary shadow-lg"
          >
            ✨ Devon connected to Active pipeline
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// -------------------------------------------------------------
// 2. INFINITE CANVAS PLAYGROUND (SVG SKETCH MOCKUP)
// -------------------------------------------------------------
interface SketchedElement {
  id: string;
  type: "box" | "circle" | "arrow" | "text";
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
}

function InfiniteCanvasPlayground() {
  const [elements, setElements] = useState<SketchedElement[]>([
    {
      id: "1",
      type: "box",
      x: 40,
      y: 40,
      width: 130,
      height: 60,
      label: "Client Client-Router",
    },
    {
      id: "2",
      type: "circle",
      x: 230,
      y: 40,
      width: 70,
      height: 60,
      label: "Redis Sync",
    },
    {
      id: "3",
      type: "arrow",
      x: 175,
      y: 70,
      width: 50,
      height: 0,
      label: "WS Feed",
    },
    {
      id: "4",
      type: "text",
      x: 40,
      y: 140,
      width: 250,
      height: 30,
      label: "//* Sketched layout draft v1",
    },
  ]);
  const [selectedTool, setSelectedTool] = useState<
    "box" | "circle" | "arrow" | "select" | "text"
  >("select");
  const [coords, setCoords] = useState({ x: 180, y: 85 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedTool === "select" || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    const newElem: SketchedElement = {
      id: Date.now().toString(),
      type: selectedTool,
      x: x - 40,
      y: y - 25,
      width: selectedTool === "arrow" ? 60 : 90,
      height: 50,
      label:
        selectedTool === "box"
          ? "New Block"
          : selectedTool === "circle"
            ? "New Node"
            : selectedTool === "text"
              ? "Comment over the layout"
              : "Link",
    };

    setElements((prev) => [...prev, newElem]);
    setSelectedTool("select"); // Reset to select tool
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCoords({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    });
  };

  const clearCanvas = () => {
    setElements([]);
  };

  return (
    <div className="flex flex-col h-full justify-between gap-3 relative select-none">
      {/* Playground Header */}
      <div className="flex justify-between items-center bg-[#0B0B0C] border border-border px-3 py-1.5 rounded text-[10px] font-mono text-muted-foreground">
        <span>EXCALIDRAW LITE v2.0.4</span>
        <span>
          X: {coords.x}px // Y: {coords.y}px
        </span>
      </div>

      {/* Sketched Whiteboard Canvas */}
      <div
        ref={containerRef}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        className={cn(
          "flex-1 border border-border/80 bg-[#0B0B0C] rounded-lg relative overflow-hidden transition-all duration-300 min-h-55",
          selectedTool !== "select" ? "cursor-crosshair" : "cursor-default",
        )}
        style={{
          backgroundImage:
            "radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        {/* Render SVG Sketched elements (Excalidraw aesthetic) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <AnimatePresence>
            {elements.map((el) => {
              if (el.type === "box") {
                return (
                  <motion.g
                    key={el.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {/* Wobbly Box Outline using path */}
                    <path
                      d={`M ${el.x} ${el.y} 
                          Q ${el.x + el.width * 0.5} ${el.y - 1} ${el.x + el.width} ${el.y} 
                          Q ${el.x + el.width + 1} ${el.y + el.height * 0.5} ${el.x + el.width} ${el.y + el.height} 
                          Q ${el.x + el.width * 0.5} ${el.y + el.height + 1.5} ${el.x} ${el.y + el.height} 
                          Q ${el.x - 1.5} ${el.y + el.height * 0.5} ${el.x} ${el.y}`}
                      stroke="rgba(255, 255, 255, 0.75)"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <path
                      d={`M ${el.x + 2} ${el.y + 1} 
                          Q ${el.x + el.width * 0.5 + 2} ${el.y - 0.5} ${el.x + el.width - 2} ${el.y + 1} 
                          Q ${el.x + el.width - 0.5} ${el.y + el.height * 0.5} ${el.x + el.width - 1.5} ${el.y + el.height - 2} 
                          Q ${el.x + el.width * 0.5} ${el.y + el.height + 0.5} ${el.x + 2} ${el.y + el.height - 1} 
                          Q ${el.x + 0.5} ${el.y + el.height * 0.5} ${el.x + 2} ${el.y + 1}`}
                      stroke="rgba(139, 92, 246, 0.35)"
                      strokeWidth="1"
                      fill="none"
                    />
                    {el.label && (
                      <text
                        x={el.x + el.width / 2}
                        y={el.y + el.height / 2 + 4}
                        fill="#F9FAFB"
                        textAnchor="middle"
                        className="text-[10px] font-mono select-none"
                      >
                        {el.label}
                      </text>
                    )}
                  </motion.g>
                );
              }

              if (el.type === "circle") {
                const rx = el.width / 2;
                const ry = el.height / 2;
                const cx = el.x + rx;
                const cy = el.y + ry;
                return (
                  <motion.g
                    key={el.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {/* Wobbly Circle path */}
                    <path
                      d={`M ${cx - rx} ${cy} 
                          C ${cx - rx} ${cy - ry - 2} ${cx + rx + 1} ${cy - ry + 1} ${cx + rx} ${cy} 
                          C ${cx + rx - 1} ${cy + ry + 1} ${cx - rx - 2} ${cy + ry - 1} ${cx - rx} ${cy}`}
                      stroke="rgba(16, 185, 129, 0.75)"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    {el.label && (
                      <text
                        x={cx}
                        y={cy + 4}
                        fill="#10B981"
                        textAnchor="middle"
                        className="text-[9px] font-mono select-none"
                      >
                        {el.label}
                      </text>
                    )}
                  </motion.g>
                );
              }

              if (el.type === "arrow") {
                const endX = el.x + el.width;
                return (
                  <motion.g
                    key={el.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Wobbly Arrow shaft and head */}
                    <path
                      d={`M ${el.x} ${el.y} Q ${el.x + el.width * 0.5} ${el.y - 3} ${endX} ${el.y}`}
                      stroke="rgba(245, 158, 11, 0.8)"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <path
                      d={`M ${endX - 6} ${el.y - 4} L ${endX} ${el.y} L ${endX - 7} ${el.y + 3}`}
                      stroke="rgba(245, 158, 11, 0.8)"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    {el.label && (
                      <text
                        x={el.x + el.width / 2}
                        y={el.y - 6}
                        fill="rgba(245, 158, 11, 0.8)"
                        textAnchor="middle"
                        className="text-[8px] font-mono select-none"
                      >
                        {el.label}
                      </text>
                    )}
                  </motion.g>
                );
              }

              if (el.type === "text") {
                return (
                  <motion.g
                    key={el.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <text
                      x={el.x}
                      y={el.y}
                      fill="#8E9196"
                      className="text-[10px] font-mono select-none italic"
                    >
                      {el.label}
                    </text>
                  </motion.g>
                );
              }
              return null;
            })}
          </AnimatePresence>
        </svg>

        {/* Gliding Mock Multi-user Cursors */}
        <motion.div
          animate={{
            x: [110, 240, 160, 80, 110],
            y: [55, 130, 80, 160, 55],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute z-20 pointer-events-none"
        >
          <MousePointer2 className="size-3 text-indigo-400 fill-indigo-400" />
          <span className="ml-2.5 bg-indigo-500 text-white text-[8px] font-mono px-1 py-0.2 rounded border border-indigo-400/20">
            Alex
          </span>
        </motion.div>

        <motion.div
          animate={{
            x: [280, 60, 180, 230, 280],
            y: [120, 50, 140, 60, 120],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute z-20 pointer-events-none"
        >
          <MousePointer2 className="size-3 text-emerald-400 fill-emerald-400" />
          <div className="flex flex-col items-start ml-2.5">
            <span className="bg-emerald-500 text-white text-[8px] font-mono px-1 py-0.2 rounded border border-emerald-400/20">
              Chloe
            </span>
            <div className="bg-[#121214] border border-emerald-400/30 rounded text-[7px] text-emerald-400 font-mono px-1 py-0.5 mt-0.5 select-none shadow">
              "Redis node added!"
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sketched drawing toolbar */}
      <div className="flex justify-between items-center pt-2.5 border-t border-border">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedTool("select")}
            className={cn(
              "px-2.5 py-1.5 text-[9px] font-mono border rounded transition-all duration-300 cursor-pointer",
              selectedTool === "select"
                ? "bg-primary/10 border-primary/40 text-primary"
                : "bg-[#121214] border-border text-muted-foreground hover:text-white",
            )}
          >
            SELECT
          </button>
          <button
            onClick={() => setSelectedTool("box")}
            className={cn(
              "p-1.5 border rounded transition-all duration-300 cursor-pointer flex items-center justify-center",
              selectedTool === "box"
                ? "bg-primary/10 border-primary/40 text-primary"
                : "bg-[#121214] border-border text-muted-foreground hover:text-white",
            )}
            title="Sketch Box"
          >
            <Square className="size-3.5" />
          </button>
          <button
            onClick={() => setSelectedTool("circle")}
            className={cn(
              "p-1.5 border rounded transition-all duration-300 cursor-pointer flex items-center justify-center",
              selectedTool === "circle"
                ? "bg-[#10B981]/10 border-[#10B981]/40 text-[#10B981]"
                : "bg-[#121214] border-border text-muted-foreground hover:text-white",
            )}
            title="Sketch Circle"
          >
            <CircleIcon className="size-3.5" />
          </button>
          <button
            onClick={() => setSelectedTool("arrow")}
            className={cn(
              "p-1.5 border rounded transition-all duration-300 cursor-pointer flex items-center justify-center",
              selectedTool === "arrow"
                ? "bg-[#F59E0B]/10 border-[#F59E0B]/40 text-[#F59E0B]"
                : "bg-[#121214] border-border text-muted-foreground hover:text-white",
            )}
            title="Sketch Link Arrow"
          >
            <ArrowRight className="size-3.5" />
          </button>
          <button
            onClick={() => setSelectedTool("text")}
            className={cn(
              "px-2.5 py-1.5 text-[9px] font-mono border rounded transition-all duration-300 cursor-pointer",
              selectedTool === "text"
                ? "bg-[#28b3cb]/10 border-[#28b3cb]/40 text-[#28b3cb]"
                : "bg-[#121214] border-border text-muted-foreground hover:text-white",
            )}
            title="Sketch Text"
          >
            Text
          </button>
        </div>

        <button
          onClick={clearCanvas}
          className="p-1.5 border border-border bg-[#121214] hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive text-muted-foreground rounded transition-all duration-300 cursor-pointer flex items-center justify-center"
          title="Clear Board"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 3. GHOST-WRITING EDITOR PLAYGROUND
// -------------------------------------------------------------
function GhostWritingEditorPlayground() {
  const [text, setText] = useState(`# Q3 Roadmap & Architecture Specifications

## Core Objectives
1. **Fluid Pipelines:** Transition B2B syncing to spatial multithreading.
2. **Zero-Lag Whiteboarding:** Enhance Excalidraw vector optimization layers.

- [x] Initial design system scoping
- [ ] Spatial graph rendering integration
- [ ] Connect files to decentralized vault zone
`);

  const [isPreview, setIsPreview] = useState(false);
  const [peerFocused, setPeerFocused] = useState(false);

  // Helper to parse simple markdown to HTML representation
  const renderMockMarkdown = (mdStr: string) => {
    // Helper to handle inline bolding
    const renderSpans = (text: string) => {
      // Splits by ** but keeps the delimiter in the array
      const parts = text.split(/(\*\*.*?\*\*)/g);

      return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-bold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      });
    };

    return mdStr.split("\n").map((line, idx) => {
      if (line.startsWith("# ")) {
        return (
          <h2
            key={idx}
            className="text-sm font-extrabold text-white mt-2 mb-1 tracking-tight border-b border-border/40 pb-1"
          >
            {line.slice(2)}
          </h2>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h3
            key={idx}
            className="text-xs font-bold text-indigo-400 mt-2 mb-1 tracking-tight"
          >
            {line.slice(3)}
          </h3>
        );
      }
      const numberedMatch = line.match(/^(\d+\.\s+)(.*)/);

      if (numberedMatch) {
        const [_, prefix, content] = numberedMatch;
        return (
          <div
            key={idx}
            className="pl-4 text-[10px] text-muted-foreground leading-relaxed flex items-start gap-1 font-mono"
          >
            {/* The number (prefix) remains mono and indigo */}
            <span className="text-indigo-400">{prefix}</span>

            {/* The content is parsed for bold tags and switched to sans-serif for better readability */}
            <span className="font-sans">{renderSpans(content)}</span>
          </div>
        );
      }
      if (line.startsWith("- [x] ")) {
        return (
          <div
            key={idx}
            className="pl-4 text-[10px] text-emerald-400 leading-relaxed flex items-center gap-1.5 font-mono"
          >
            <Check className="size-3 stroke-3" />
            <span className="line-through text-muted-foreground/60">
              {line.slice(6)}
            </span>
          </div>
        );
      }
      if (line.startsWith("- [ ] ")) {
        return (
          <div
            key={idx}
            className="pl-4 text-[10px] text-muted-foreground leading-relaxed flex items-center gap-1.5 font-mono"
          >
            <span className="size-2 rounded border border-border inline-block" />
            <span>{line.slice(6)}</span>
          </div>
        );
      }
      if (line.trim() === "") {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p
          key={idx}
          className="text-[10px] text-muted-foreground leading-relaxed font-sans"
        >
          {renderSpans(line)}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-full justify-between gap-3 relative">
      {/* Playground Header */}
      <div className="flex justify-between items-center bg-[#0B0B0C] border border-border px-3 py-1.5 rounded text-[10px] font-mono text-muted-foreground">
        <span>COLLAB EDITOR: /DOCS/ROADMAP.MD</span>
        <span className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
          <span>ALEX EDITING</span>
        </span>
      </div>

      {/* Editor Body Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 min-h-55">
        {/* Left Side: Interactive Raw Editor */}
        <div className="border border-border rounded-lg bg-[#0B0B0C] p-3 flex flex-col justify-between relative overflow-hidden">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setPeerFocused(true)}
            onBlur={() => setPeerFocused(false)}
            className="w-full flex-1 bg-transparent resize-none outline-none border-none text-[10px] font-mono text-foreground leading-relaxed h-40 select-text placeholder-muted-foreground/50"
            placeholder="Type your markdown spec..."
          />

          {/* Interactive Peer Cursors floating inside Editor */}
          <div className="absolute top-16 left-28 pointer-events-none flex flex-col items-start z-20">
            {/* Live pulsing cursor line */}
            <div className="flex items-center gap-0.5">
              <span className="w-0.5 h-3.5 bg-indigo-500 animate-pulse" />
              <span className="bg-indigo-500 text-white text-[8px] font-mono px-1 py-0.2 rounded border border-indigo-400/20 shadow-md scale-90">
                Alex
              </span>
            </div>
          </div>

          <div className="absolute bottom-2 right-2.5 text-[8px] font-mono text-muted-foreground/60 select-none">
            {text.length} CHARS // {text.split(/\s+/).filter(Boolean).length}{" "}
            WORDS
          </div>
        </div>

        {/* Right Side: Markdown Styled Preview */}
        <div className="border border-border rounded-lg bg-[#121214] p-3 overflow-y-auto flex flex-col justify-between h-52.5 max-h-52.5">
          <div className="flex-1 overflow-y-auto select-none pr-1">
            {renderMockMarkdown(text)}
          </div>
          <div className="text-[8px] font-mono text-muted-foreground border-t border-border/40 pt-1 flex justify-between items-center select-none">
            <span>MARKDOWN COMPILED</span>
            <span className="text-emerald-400">ACTIVE SYNC</span>
          </div>
        </div>
      </div>

      {/* Telemetry bar & Peer status */}
      <div className="flex justify-between items-center pt-2 border-t border-border">
        <span className="text-[9px] font-mono text-muted-foreground">
          {peerFocused
            ? "✨ Presencing Active: 3 collaborators locked in"
            : "👥 Devon & Chloe are review-monitoring..."}
        </span>
        <button
          onClick={() => setIsPreview(!isPreview)}
          className="px-2.5 py-1 text-[9px] font-mono border border-border bg-[#121214] text-muted-foreground hover:text-white rounded transition-colors cursor-pointer select-none"
        >
          {isPreview ? "RAW SOURCE" : "PREVIEW READY"}
        </button>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 4. THE DROP-ZONE PLAYGROUND
// -------------------------------------------------------------
interface VaultAsset {
  id: string;
  name: string;
  size: string;
  type: string;
  sha: string;
}

function DropZonePlayground() {
  const [vaultAssets, setVaultAssets] = useState<VaultAsset[]>([
    {
      id: "1",
      name: "auth_token.pem",
      size: "2.4 KB",
      type: "Keyfile",
      sha: "8f3c24d9b...882a",
    },
    {
      id: "2",
      name: "canvas_layout.json",
      size: "48 KB",
      type: "JSON Spec",
      sha: "f7d24a8bc...390a",
    },
  ]);

  const [draggedOver, setDraggedOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [activeSha, setActiveSha] = useState<string>(
    "SYSTEM ENCRYPT PIPELINE ACTIVE...",
  );
  const [vaultLocked, setVaultLocked] = useState(false);

  // Drag target bounding coordinates helper
  const vaultTargetRef = useRef<HTMLDivElement>(null);

  const simulateSecureUpload = (
    fileName: string,
    fileSize: string,
    fileType: string,
  ) => {
    if (uploadProgress !== null || vaultLocked) {
      if (vaultLocked) {
        setActiveSha("ACCESS DENIED // VAULT PROTOCOL LOCKED");
      }
      return;
    }

    setUploadProgress(0);
    setActiveSha("GENERATING INTEGRITY HASH...");

    // Generate random SHA-256 string
    const hexChars = "0123456789abcdef";
    let hash = "";
    for (let i = 0; i < 32; i++)
      hash += hexChars[Math.floor(Math.random() * 16)];

    // Increment progress
    let p = 0;
    const interval = setInterval(() => {
      p += 20;
      setUploadProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          const newAsset: VaultAsset = {
            id: Date.now().toString(),
            name: fileName,
            size: fileSize,
            type: fileType,
            sha: `${hash.slice(0, 9)}...${hash.slice(-4)}`,
          };
          setVaultAssets((prev) => [newAsset, ...prev]);
          setUploadProgress(null);
          setActiveSha(`VAULT SECURED // SHA: ${hash.toUpperCase()}`);
        }, 300);
      }
    }, 150);
  };

  const handleDragEnd = (
    event: any,
    info: any,
    assetName: string,
    assetSize: string,
    assetType: string,
  ) => {
    setDraggedOver(false);

    if (!vaultTargetRef.current) return;
    const targetRect = vaultTargetRef.current.getBoundingClientRect();
    const dropX =
      event.clientX ||
      (event.changedTouches && event.changedTouches[0].clientX);
    const dropY =
      event.clientY ||
      (event.changedTouches && event.changedTouches[0].clientY);

    // Check if drop is inside vault target boundaries
    if (
      dropX >= targetRect.left &&
      dropX <= targetRect.right &&
      dropY >= targetRect.top &&
      dropY <= targetRect.bottom
    ) {
      simulateSecureUpload(assetName, assetSize, assetType);
    }
  };

  const clearVault = () => {
    setVaultAssets([]);
    setActiveSha("VAULT VACATED // SYSTEM READY");
  };

  return (
    <div className="flex flex-col h-full justify-between gap-3 relative">
      {/* Playground Header */}
      <div className="flex justify-between items-center bg-[#0B0B0C] border border-border px-3 py-1.5 rounded text-[10px] font-mono text-muted-foreground select-none">
        <span>ENCRYPTION TYPE: AES-GCM-256</span>
        <span>INTEGRITY PIPELINE: DIRECT</span>
      </div>

      {/* Main vault split editor */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-55">
        {/* Left Side: Draggable Asset cards */}
        <div className="border border-border bg-[#0B0B0C] p-3 rounded-lg flex flex-col justify-between">
          <span className="text-[9px] font-mono text-muted-foreground uppercase select-none">
            Asset Tray (Drag items to Vault)
          </span>

          <div className="flex flex-col gap-2 mt-2">
            {/* Draggable Mock File 1 */}
            <motion.div
              drag
              dragSnapToOrigin
              onDragStart={() => setDraggedOver(true)}
              onDragEnd={(e, info) =>
                handleDragEnd(
                  e,
                  info,
                  "api_contract.yaml",
                  "12 KB",
                  "YAML Pipeline",
                )
              }
              className="bg-[#121214] border border-border hover:border-primary/50 p-2 rounded cursor-grab active:cursor-grabbing text-left flex items-center justify-between transition-all select-none group"
            >
              <div className="flex items-center gap-2">
                <FileText className="size-3.5 text-primary" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white leading-tight">
                    api_contract.yaml
                  </span>
                  <span className="text-[8px] font-mono text-muted-foreground">
                    YAML Spec • 12 KB
                  </span>
                </div>
              </div>
              <span className="text-[8px] font-mono text-primary/70 bg-primary/5 border border-primary/20 px-1 py-0.2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                DRAG ME
              </span>
            </motion.div>

            {/* Draggable Mock File 2 */}
            <motion.div
              drag
              dragSnapToOrigin
              onDragStart={() => setDraggedOver(true)}
              onDragEnd={(e, info) =>
                handleDragEnd(
                  e,
                  info,
                  "brand_vector.svg",
                  "310 KB",
                  "Vector Design",
                )
              }
              className="bg-[#121214] border border-border hover:border-emerald-500/50 p-2 rounded cursor-grab active:cursor-grabbing text-left flex items-center justify-between transition-all select-none group"
            >
              <div className="flex items-center gap-2">
                <FileText className="size-3.5 text-emerald-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white leading-tight">
                    brand_vector.svg
                  </span>
                  <span className="text-[8px] font-mono text-muted-foreground">
                    SVG Asset • 310 KB
                  </span>
                </div>
              </div>
              <span className="text-[8px] font-mono text-emerald-400/70 bg-emerald-500/5 border border-emerald-500/20 px-1 py-0.2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                DRAG ME
              </span>
            </motion.div>

            {/* Draggable Mock File 3 */}
            <motion.div
              drag
              dragSnapToOrigin
              onDragStart={() => setDraggedOver(true)}
              onDragEnd={(e, info) =>
                handleDragEnd(
                  e,
                  info,
                  "secrets_env.key",
                  "1.1 KB",
                  "Key Secret",
                )
              }
              className="bg-[#121214] border border-border hover:border-amber-500/50 p-2 rounded cursor-grab active:cursor-grabbing text-left flex items-center justify-between transition-all select-none group"
            >
              <div className="flex items-center gap-2">
                <FileText className="size-3.5 text-amber-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white leading-tight">
                    secrets_env.key
                  </span>
                  <span className="text-[8px] font-mono text-muted-foreground">
                    Encrypted • 1.1 KB
                  </span>
                </div>
              </div>
              <span className="text-[8px] font-mono text-amber-400/70 bg-amber-500/5 border border-amber-500/20 px-1 py-0.2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                DRAG ME
              </span>
            </motion.div>
          </div>

          <div className="text-[8px] font-mono text-muted-foreground/60 border-t border-border/40 pt-1.5 mt-2 select-none">
            Spring Physics active on release
          </div>
        </div>

        {/* Right Side: Drop Vault Target */}
        <div
          ref={vaultTargetRef}
          className={cn(
            "border rounded-lg p-3 flex flex-col justify-between transition-all duration-300 relative select-none",
            draggedOver
              ? "border-primary bg-primary/2 shadow-[0_0_16px_rgba(139,92,246,0.1)] scale-[1.01]"
              : vaultLocked
                ? "border-destructive/40 bg-destructive/2"
                : "border-dashed border-border/80 bg-[#121214]",
          )}
        >
          {/* Target Overlay Lock Indicator */}
          <div
            className="absolute top-2 right-2 cursor-pointer"
            onClick={() => setVaultLocked(!vaultLocked)}
          >
            {vaultLocked ? (
              <Lock className="size-3.5 text-destructive animate-pulse" />
            ) : (
              <Unlock className="size-3.5 text-muted-foreground hover:text-white transition-colors" />
            )}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center p-3">
            {uploadProgress !== null ? (
              <div className="w-full max-w-30 flex flex-col items-center gap-2">
                <UploadCloud className="size-6 text-primary animate-bounce" />
                <div className="w-full bg-[#0B0B0C] border border-border h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="bg-primary h-full"
                  />
                </div>
                <span className="text-[9px] font-mono text-primary">
                  ENCRYPTING: {uploadProgress}%
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <UploadCloud
                  className={cn(
                    "size-6 transition-transform duration-300",
                    draggedOver
                      ? "text-primary scale-110"
                      : "text-muted-foreground/45",
                  )}
                />
                <span className="text-[10px] font-mono text-white font-bold uppercase tracking-tight">
                  VAULT DROP ZONE
                </span>
                <span className="text-[8px] font-mono text-muted-foreground/80 max-w-30">
                  {vaultLocked
                    ? "VAULT COMPROMISED OR LOCKED"
                    : "DROP CARD INSIDE BOUNDARIES"}
                </span>
              </div>
            )}
          </div>

          {/* List of successfully secured vault items */}
          <div className="border-t border-border/60 pt-2 flex flex-col gap-1.5 max-h-21.25 overflow-y-auto">
            <span className="text-[8px] font-mono text-muted-foreground uppercase flex justify-between">
              <span>SECURED ARCHIVES ({vaultAssets.length})</span>
              {vaultAssets.length > 0 && (
                <button
                  onClick={clearVault}
                  className="text-destructive hover:underline cursor-pointer"
                >
                  VACATE
                </button>
              )}
            </span>

            <div className="flex flex-col gap-1">
              <AnimatePresence>
                {vaultAssets.map((asset) => (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-[#0B0B0C] border border-border/80 px-2 py-1 rounded text-[8px] font-mono flex items-center justify-between text-muted-foreground"
                  >
                    <span className="text-foreground font-semibold flex items-center gap-1">
                      <Check className="size-2.5 text-emerald-400 shrink-0" />
                      {asset.name}
                    </span>
                    <span>SHA: {asset.sha}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal log output */}
      <div className="border border-border/80 bg-[#0B0B0C] px-3 py-1.5 rounded text-[8px] font-mono text-muted-foreground select-text text-left max-h-10.5 overflow-y-auto">
        <span className="text-primary font-bold mr-1">// CONSOLE LOG:</span>
        {activeSha}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MAIN BESPOKE FEATURES SECTION COMPONENT
// -------------------------------------------------------------
interface FeatureDetail {
  id: number;
  title: string;
  description: string;
  badge: string;
  telemetry: string;
}

export default function FeaturesSection() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const features: FeatureDetail[] = [
    {
      id: 0,
      title: "Fluid Communication",
      description:
        "High-fidelity video workflows and screen sharing engineered with raw spatial panner grids.",
      badge: "VoIP PIPELINE",
      telemetry: "OPUS AUDIO • 1080P60 VIDEO • DIRECT WEBRTC",
    },
    {
      id: 1,
      title: "Infinite Canvas",
      description:
        "Unbounded architectural sketching sandbox powered by wobbly-vector geometry layers.",
      badge: "WHITEBOARD PREVIEW",
      telemetry: "EXCALIDRAW CORE • DRAFT VECTOR SHAPES • MULTIPLAYER",
    },
    {
      id: 2,
      title: "Ghost-Writing Editor",
      description:
        "Distraction-free collaborative markdown sync with active peer tracking indicators.",
      badge: "DOCUMENT ENGINE",
      telemetry: "MARKDOWN SYNTAX • LIVE CURSOR SYNC • PEER TELEMETRY",
    },
    {
      id: 3,
      title: "The Drop-Zone",
      description:
        "Encrypted direct vault pipelines for binary resources, keys, and asset deployment.",
      badge: "VAULT PROTOCOL",
      telemetry: "AES-GCM-256 CIPHER • SHA-256 INTEGRITY LOGS • DIRECT DROP",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 md:py-28 px-6 md:px-8 border-b border-border bg-[#0B0B0C] relative w-full overflow-hidden"
    >
      {/* Viewport animation trigger container */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-7xl"
      >
        {/* Header block with extreme minimal aesthetic */}
        <div className="flex flex-col items-start text-left mb-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-mono font-bold tracking-widest text-primary uppercase mb-4">
            <Sparkles className="size-3" />
            <span>Modular Workspace Architectures</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Features engineered for raw, spatial precision.
          </h2>
          <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
            Most collaborative software forces rigid layout hierarchies. Mistic
            breaks the container open, connecting visual planning with
            cryptographic vaults.
          </p>
        </div>

        {/* Bespoke Split Control Center */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* LEFT SIDE: Asymmetric Selector Tabs (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              {features.map((feat) => {
                const isActive = activeTab === feat.id;
                return (
                  <div
                    key={feat.id}
                    onClick={() => setActiveTab(feat.id)}
                    className={cn(
                      "relative p-5 rounded-lg border text-left cursor-pointer transition-all duration-300 select-none group",
                      isActive
                        ? "border-primary/30 bg-[#121214] shadow-[0_4px_24px_rgba(139,92,246,0.02)]"
                        : "border-border bg-transparent hover:border-white/10 hover:bg-[#121214]/25",
                    )}
                  >
                    {/* Tab spring layout projection bar */}
                    {isActive && (
                      <motion.div
                        layoutId="active-selector-bar"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg"
                        transition={SPRING_PHYSICS}
                      />
                    )}

                    <div className="flex justify-between items-center select-none">
                      <span
                        className={cn(
                          "text-[9px] font-mono tracking-wider font-bold uppercase",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground/60",
                        )}
                      >
                        {feat.badge}
                      </span>
                      <span className="text-[9px] font-mono text-muted-foreground/40 font-semibold group-hover:text-muted-foreground transition-colors">
                        0{feat.id + 1}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mt-2.5 tracking-tight group-hover:text-primary transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-sans">
                      {feat.description}
                    </p>

                    {/* Expandable telemetry data panel */}
                    <div className="mt-3.5 pt-3 border-t border-border/40 overflow-hidden">
                      <span className="text-[8px] font-mono text-muted-foreground/80 tracking-tight block uppercase">
                        TELEMETRY: {feat.telemetry}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick status bar */}
            <div className="hidden lg:flex items-center gap-3 border border-border bg-[#121214] rounded-lg px-4 py-3.5 select-none font-mono text-[9px] text-muted-foreground">
              <Users className="size-3.5 text-primary shrink-0" />
              <span>SPATIAL REAL-TIME ENGINE STATUS:</span>
              <span className="text-emerald-400 font-bold ml-auto flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                STABLE
              </span>
            </div>
          </div>

          {/* RIGHT SIDE: Interactive Playground Viewport (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="border border-border bg-[#121214] rounded-xl shadow-2xl flex flex-col justify-between overflow-hidden relative flex-1 h-full min-h-115 p-5">
              {/* Playground Outer Window Header */}
              <div className="flex justify-between items-center border-b border-border pb-3 select-none">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/60" />
                  <span className="text-[10px] text-muted-foreground font-mono ml-3 border border-border bg-[#0B0B0C] px-2 py-0.5 rounded flex items-center gap-1.5">
                    <Code className="size-3 text-primary" />
                    <span>interactive_viewport.mist</span>
                  </span>
                </div>
                <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider">
                  PLAYGROUND MOCKUP
                </span>
              </div>

              {/* Dynamic Playground container */}
              <div className="flex-1 py-4 relative flex flex-col justify-between min-h-75">
                <AnimatePresence mode="wait">
                  {activeTab === 0 && (
                    <motion.div
                      key="telecom-playground"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      className="w-full h-full flex flex-col justify-between"
                    >
                      <FluidCommunicationPlayground />
                    </motion.div>
                  )}

                  {activeTab === 1 && (
                    <motion.div
                      key="canvas-playground"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      className="w-full h-full flex flex-col justify-between"
                    >
                      <InfiniteCanvasPlayground />
                    </motion.div>
                  )}

                  {activeTab === 2 && (
                    <motion.div
                      key="editor-playground"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      className="w-full h-full flex flex-col justify-between"
                    >
                      <GhostWritingEditorPlayground />
                    </motion.div>
                  )}

                  {activeTab === 3 && (
                    <motion.div
                      key="drop-playground"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      className="w-full h-full flex flex-col justify-between"
                    >
                      <DropZonePlayground />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Playground Window Footer */}
              <div className="flex justify-between items-center border-t border-border pt-3 select-none">
                <span className="text-[9px] font-mono text-muted-foreground uppercase">
                  ACTIVE PIPELINE: 0{activeTab + 1} // SYNC ENGINE READY
                </span>
                <span className="text-[9px] font-mono text-muted-foreground uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                  MISTIC CORE synced
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
