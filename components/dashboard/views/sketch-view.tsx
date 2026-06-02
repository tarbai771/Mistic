"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Square,
  Circle,
  PenTool,
  Trash2,
  Undo2,
  Sparkles,
  MousePointer2,
  Palette,
  Eye,
  Settings,
  Grid,
} from "lucide-react";

type ShapeType = "pen" | "rect" | "circle";
type DrawingElement = {
  id: string;
  type: ShapeType;
  points: { x: number; y: number }[];
  color: string;
  width: number;
};

export default function SketchView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<ShapeType>("pen");
  const [color, setColor] = useState("#FFFFFF");
  const [width, setWidth] = useState(2);
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentElement, setCurrentElement] = useState<DrawingElement | null>(null);

  // Simulated multiplayer drawing state
  const [multiplayerCursor, setMultiplayerCursor] = useState({ x: 300, y: 200, name: "Chloe", color: "#8B5CF6" });

  const colors = [
    { name: "White", value: "#FFFFFF" },
    { name: "Primary", value: "#8B5CF6" },
    { name: "Emerald", value: "#10B981" },
    { name: "Coral", value: "#F87171" },
  ];

  // Initialize Canvas & redraw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI displays
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    redraw();
  }, [elements]);

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear with grid backdrop
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw dots grid
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    const dotSpacing = 24;
    for (let x = 0; x < canvas.width; x += dotSpacing) {
      for (let y = 0; y < canvas.height; y += dotSpacing) {
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }

    // Draw all completed elements
    elements.forEach((el) => {
      ctx.strokeStyle = el.color;
      ctx.lineWidth = el.width;
      ctx.beginPath();

      if (el.type === "pen" && el.points.length > 0) {
        ctx.moveTo(el.points[0].x, el.points[0].y);
        for (let i = 1; i < el.points.length; i++) {
          ctx.lineTo(el.points[i].x, el.points[i].y);
        }
        ctx.stroke();
      } else if (el.type === "rect" && el.points.length >= 2) {
        const start = el.points[0];
        const end = el.points[1];
        ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
      } else if (el.type === "circle" && el.points.length >= 2) {
        const start = el.points[0];
        const end = el.points[1];
        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });

    // Draw current active drawing element
    if (currentElement) {
      ctx.strokeStyle = currentElement.color;
      ctx.lineWidth = currentElement.width;
      ctx.beginPath();

      if (currentElement.type === "pen" && currentElement.points.length > 0) {
        ctx.moveTo(currentElement.points[0].x, currentElement.points[0].y);
        for (let i = 1; i < currentElement.points.length; i++) {
          ctx.lineTo(currentElement.points[i].x, currentElement.points[i].y);
        }
        ctx.stroke();
      } else if (currentElement.type === "rect" && currentElement.points.length >= 2) {
        const start = currentElement.points[0];
        const end = currentElement.points[1];
        ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
      } else if (currentElement.type === "circle" && currentElement.points.length >= 2) {
        const start = currentElement.points[0];
        const end = currentElement.points[1];
        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  // Simulate multiplayer cursor & automated drawings
  useEffect(() => {
    let angle = 0;
    const interval = setInterval(() => {
      angle += 0.05;
      const radius = 80;
      const centerX = 360;
      const centerY = 220;
      
      const newX = centerX + Math.cos(angle * 1.5) * radius;
      const newY = centerY + Math.sin(angle * 1.1) * radius;
      
      setMultiplayerCursor((prev) => ({
        ...prev,
        x: newX,
        y: newY,
      }));

      // Occasionally add a random shape drawn by Chloe
      if (Math.random() < 0.02) {
        const randomType = Math.random() > 0.5 ? "circle" : "rect";
        const newEl: DrawingElement = {
          id: Math.random().toString(),
          type: randomType,
          points: [
            { x: newX - 20, y: newY - 20 },
            { x: newX + 20, y: newY + 20 },
          ],
          color: "#8B5CF6",
          width: 1.5,
        };
        setElements((prev) => [...prev, newEl]);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coord = getCoordinates(e);
    setIsDrawing(true);
    setCurrentElement({
      id: Math.random().toString(),
      type: tool,
      points: [coord],
      color,
      width,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentElement) return;
    const coord = getCoordinates(e);
    
    let updatedPoints = [...currentElement.points];
    if (tool === "pen") {
      updatedPoints.push(coord);
    } else {
      // For shapes, update the second coordinate
      updatedPoints[1] = coord;
    }

    setCurrentElement({
      ...currentElement,
      points: updatedPoints,
    });
    redraw();
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentElement) return;
    setIsDrawing(false);
    setElements((prev) => [...prev, currentElement]);
    setCurrentElement(null);
  };

  const handleClear = () => {
    setElements([]);
  };

  const handleUndo = () => {
    setElements((prev) => prev.slice(0, -1));
  };

  return (
    <div className="h-full flex flex-col bg-[#0B0B0C] text-foreground font-sans relative select-none">
      {/* Top utility menu */}
      <div className="flex items-center justify-between border-b border-border bg-[#0C0C0E]/90 px-6 py-3 z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded text-[10px] font-bold text-primary font-mono uppercase tracking-wider">
            <Sparkles className="size-3" />
            <span>Excalidraw Live Canvas</span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">Sync active (2 Players)</span>
        </div>

        {/* Toolbar Center Selection */}
        <div className="flex items-center bg-[#121214] border border-border p-0.5 rounded-full select-none gap-0.5 shadow-lg relative z-20">
          {[
            { id: "pen", icon: PenTool, label: "Pen" },
            { id: "rect", icon: Square, label: "Rectangle" },
            { id: "circle", icon: Circle, label: "Circle" },
          ].map((t) => {
            const ToolIcon = t.icon;
            const active = tool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTool(t.id as ShapeType)}
                className={`relative px-3 py-1.5 rounded-full transition-colors flex items-center justify-center ${
                  active ? "text-white" : "text-muted-foreground hover:text-white"
                }`}
                title={t.label}
              >
                {active && (
                  <motion.span
                    layoutId="active-tool"
                    className="absolute inset-0 bg-[#1E1E22] rounded-full border border-white/5"
                    transition={{ type: "spring", stiffness: 400, damping: 40 }}
                  />
                )}
                <ToolIcon className="size-4 relative z-10" />
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={elements.length === 0}
            className="p-2 rounded border border-border bg-[#121214] text-muted-foreground hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Undo"
          >
            <Undo2 className="size-3.5" />
          </button>
          
          <button
            onClick={handleClear}
            disabled={elements.length === 0}
            className="p-2 rounded border border-border bg-[#121214] text-muted-foreground hover:text-red-400 hover:border-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Clear all"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Main Drawing Stage Area */}
      <div className="flex-1 relative overflow-hidden bg-[#0A0A0B] cursor-crosshair">
        {/* Draw dots grid backdrop explicitly behind canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="absolute inset-0 w-full h-full z-10"
        />

        {/* Live Multiplayer Cursors Floating Overlay */}
        <motion.div
          animate={{ x: multiplayerCursor.x, y: multiplayerCursor.y }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="absolute pointer-events-none z-20"
        >
          <div className="flex flex-col items-start gap-1">
            <MousePointer2 className="size-4 text-emerald-400 fill-emerald-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] rotate-90" />
            <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-lg border border-emerald-400/20 font-mono">
              {multiplayerCursor.name} (Drawing...)
            </span>
          </div>
        </motion.div>

        {/* Float Sidebar Configuration Panel */}
        <div className="absolute bottom-6 left-6 z-20 flex flex-col bg-[#121214] border border-border p-4 rounded-xl shadow-2xl gap-4 font-mono select-none w-52">
          {/* Color Selector */}
          <div>
            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider block mb-2 flex items-center gap-1">
              <Palette className="size-3 text-primary" /> Colors
            </span>
            <div className="flex gap-2">
              {colors.map((c) => {
                const active = color === c.value;
                return (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.value)}
                    className={`size-6 rounded-full border flex items-center justify-center transition-transform hover:scale-110 ${
                      active ? "border-primary" : "border-border"
                    }`}
                    style={{ backgroundColor: c.value === "#FFFFFF" ? "#FFFFFF" : c.value }}
                    title={c.name}
                  >
                    {active && <span className="size-1.5 rounded-full bg-black/80" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Stroke Width Selector */}
          <div>
            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider block mb-2 flex items-center gap-1">
              <Settings className="size-3 text-primary" /> Stroke Width
            </span>
            <div className="flex gap-1.5">
              {[1, 2, 4].map((w) => {
                const active = width === w;
                return (
                  <button
                    key={w}
                    onClick={() => setWidth(w)}
                    className={`flex-1 rounded border text-[10px] py-1 text-center transition-colors font-bold ${
                      active
                        ? "bg-primary border-primary/20 text-white font-black"
                        : "border-border text-muted-foreground hover:text-white"
                    }`}
                  >
                    {w}px
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Small Bottom Status overlay */}
        <div className="absolute bottom-6 right-6 z-20 bg-[#121214] border border-border px-3 py-1.5 rounded-full text-[10px] text-muted-foreground font-mono flex items-center gap-2">
          <Grid className="size-3 text-primary animate-pulse" />
          <span>Interactive Canvas Ready. Click & Drag to Draw.</span>
        </div>
      </div>
    </div>
  );
}
