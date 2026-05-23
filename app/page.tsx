"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  MousePointer2,
  Plus,
  FileText,
  Layers,
  Link as LinkIcon,
  CheckCircle2,
  GitBranch,
  Play,
  PlusCircle,
  MessageSquare,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import FeaturesSection from "@/components/features-section";
import Link from "next/link";

// Magnetic cursor pull for Hero CTAs
function MagneticWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 15, stiffness: 150, mass: 0.6 });
  const springY = useSpring(y, { damping: 15, stiffness: 150, mass: 0.6 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.3);
    y.set((clientY - centerY) * 0.3);
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
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Typist simulator for the workspace mockup
function TypingSimulator() {
  const words = [
    "Synthesize user feedback into Q3 strategy...",
    "Define technical specs for spatial multiplayer editor...",
    "Design minimalist and physics-based interactions...",
  ];
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullWord = words[currentWordIdx];

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText((prev) => prev.slice(0, -1));
      }, 30);
    } else {
      timer = setTimeout(() => {
        setCurrentText((prev) => fullWord.slice(0, prev.length + 1));
      }, 50);
    }

    if (!isDeleting && currentText === fullWord) {
      timer = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setCurrentWordIdx((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIdx]);

  return (
    <span className="text-xs text-foreground/90 font-mono tracking-tight">
      {currentText}
      <span className="w-1 h-3.5 bg-primary ml-0.5 inline-block animate-pulse align-middle" />
    </span>
  );
}

export default function Home() {
  const [workspaceLogs, setWorkspaceLogs] = useState<string[]>([
    "Chloe connected to canvas",
    "Alex edited System Goals block",
    "Devon completed Review Task #42",
  ]);
  const [email, setEmail] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [draggedCardPos, setDraggedCardPos] = useState({ x: 0, y: 0 });

  const featureRef = useRef<HTMLDivElement>(null);

  // Real-time workspace activities generator
  useEffect(() => {
    const actions = [
      "Alex dragged card to In Progress",
      "Chloe left comment: 'Love the minimalist feel!'",
      "Devon added new bidirectional connection",
      "Alex connected database node",
      "Chloe created workspace roadmap",
      "Devon marked Task #18 as review",
    ];
    const interval = setInterval(() => {
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      setWorkspaceLogs((prev) => [randomAction, prev[0], prev[1]].slice(0, 3));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail("");
    }, 1500);
  };

  return (
    <main className="flex-1 bg-[#0B0B0C] overflow-hidden text-foreground">
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 px-6 md:px-8 border-b border-border/60">
        {/* Subtle grid backdrop (very light, low contrast to avoid cheap trope) */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e1e24_1px,transparent_1px)] bg-size-[32px_32px] opacity-25 pointer-events-none" />

        <div className="mx-auto max-w-7xl flex flex-col items-center text-center">
          {/* Release Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-8 hover:bg-primary/10 transition-colors cursor-pointer"
          >
            <Sparkles className="size-3.5" />
            <Link href="/app">
              <span>Mistic v1.0 is officially live</span>
            </Link>
            <ArrowRight className="size-3" />
          </motion.div>

          {/* Understated Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.05]"
          >
            Where chaotic workflows become{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-indigo-400">
              magic.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed"
          >
            A spatial multiplayer canvas that unites ideas, relational notes,
            and visual task management. Designed specifically for product teams
            that reject linear boundaries.
          </motion.p>

          {/* CTAs (Magnetic CTAs) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <MagneticWrapper>
              <a
                href="#cta"
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-primary px-7 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(139,92,246,0.4)]"
              >
                <span>Request Early Access</span>
                <ArrowRight className="size-4" />
              </a>
            </MagneticWrapper>

            <MagneticWrapper>
              <a
                href="#features"
                className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-[#121214] px-7 text-sm font-medium text-white transition-all duration-300 hover:border-white/20 hover:bg-[#18181c]"
              >
                <span>See Features</span>
              </a>
            </MagneticWrapper>
          </motion.div>

          {/* Workspace Mockup Simulator */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl mt-16 md:mt-24 rounded-xl border border-border bg-[#121214] shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden relative"
          >
            {/* Window bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-[#0C0C0E]/90 select-none">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56] opacity-70" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E] opacity-70" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F] opacity-70" />
                <span className="text-[11px] text-muted-foreground font-mono ml-4 flex items-center gap-1.5 bg-[#1A1A1E] px-2.5 py-0.5 rounded border border-border">
                  <FileText className="size-3 text-primary" />
                  <span>q3_growth_sprint.mist</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-1.5">
                  <span className="w-5 h-5 rounded-full border border-[#121214] bg-primary flex items-center justify-center text-[9px] font-bold text-white shadow-md">
                    A
                  </span>
                  <span className="w-5 h-5 rounded-full border border-[#121214] bg-emerald-500 flex items-center justify-center text-[9px] font-bold text-white shadow-md">
                    C
                  </span>
                  <span className="w-5 h-5 rounded-full border border-[#121214] bg-amber-500 flex items-center justify-center text-[9px] font-bold text-white shadow-md">
                    D
                  </span>
                </div>
                <div className="h-4 w-px bg-border" />
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  <span>3 Players Online</span>
                </span>
              </div>
            </div>

            {/* Simulated Interactive Workspace Canvas */}
            <div className="w-full min-h-95 p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 text-left relative bg-[#0E0E10]">
              {/* Cursors animations */}
              <motion.div
                animate={{
                  x: [180, 520, 240, 680, 180],
                  y: [90, 260, 110, 80, 90],
                }}
                transition={{
                  duration: 16,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute pointer-events-none z-30"
              >
                <div className="flex flex-col items-start gap-1">
                  <MousePointer2 className="size-4 text-primary fill-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                  <span className="bg-primary text-white text-[9px] font-semibold px-1.5 py-0.5 rounded shadow-lg border border-primary/20">
                    Alex
                  </span>
                </div>
              </motion.div>

              <motion.div
                animate={{
                  x: [400, 120, 480, 290, 400],
                  y: [220, 90, 60, 260, 220],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute pointer-events-none z-30"
              >
                <div className="flex flex-col items-start gap-1">
                  <MousePointer2 className="size-4 text-emerald-400 fill-emerald-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                  <span className="bg-emerald-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded shadow-lg border border-emerald-400/20">
                    Chloe
                  </span>
                </div>
              </motion.div>

              {/* Grid Layout Elements */}
              <div className="lg:col-span-3 flex flex-col gap-5">
                {/* 1. Document block with real-time text simulator */}
                <div className="border border-border bg-[#121214] p-4.5 rounded-lg flex flex-col gap-2 relative">
                  <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                    Strategy Spec
                  </span>
                  <h3 className="text-sm font-semibold text-white">
                    Project Scope & Objectives
                  </h3>
                  <div className="bg-[#0B0B0C] p-3 rounded border border-border/80 flex items-center min-h-11.5">
                    <TypingSimulator />
                  </div>
                </div>

                {/* 2. Drag & Drop Task Interactive Element */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Left Column: Tasks backlog */}
                  <div className="border border-border bg-[#121214] p-4 rounded-lg flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-muted-foreground tracking-tight uppercase">
                        Product Backlog
                      </span>
                      <PlusCircle className="size-4 text-muted-foreground hover:text-white transition-colors cursor-pointer" />
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="bg-[#18181c] p-2.5 rounded border border-border text-xs flex flex-col gap-1.5">
                        <span className="font-semibold text-white">
                          Optimize bundler configuration
                        </span>
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                          <span className="bg-emerald-500/10 text-emerald-400 py-0.5 px-1.5 rounded">
                            v1.1
                          </span>
                          <span>Priority</span>
                        </div>
                      </div>

                      {/* Draggable Card */}
                      <motion.div
                        drag
                        dragConstraints={{
                          left: -10,
                          right: 280,
                          top: -120,
                          bottom: 120,
                        }}
                        onDrag={(event, info) => {
                          setDraggedCardPos({
                            x: info.point.x,
                            y: info.point.y,
                          });
                        }}
                        className="bg-primary/10 p-2.5 rounded border border-primary/30 text-xs flex flex-col gap-1.5 cursor-grab active:cursor-grabbing hover:border-primary/60 transition-colors shadow-sm relative group"
                      >
                        <div className="absolute top-1 right-1 bg-primary text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full scale-70 group-hover:scale-80 transition-transform">
                          Drag Me
                        </div>
                        <span className="font-semibold text-white">
                          Implement spatial graph rendering
                        </span>
                        <div className="flex justify-between items-center text-[10px] text-primary font-medium">
                          <span>Multiplayer</span>
                          <span className="bg-primary/20 text-white font-mono py-0.5 px-1.5 rounded text-[8px]">
                            MISTIC
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Right Column: In Progress board */}
                  <div className="border border-border bg-[#121214] p-4 rounded-lg flex flex-col gap-3 relative overflow-hidden">
                    <span className="text-xs font-bold text-muted-foreground tracking-tight uppercase">
                      In Progress
                    </span>

                    <div className="flex flex-col gap-2">
                      <div className="bg-[#18181c] p-2.5 rounded border border-border text-xs flex flex-col gap-1.5">
                        <span className="font-semibold text-white">
                          Refinement of typography sheets
                        </span>
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                          <span className="bg-amber-500/10 text-amber-400 py-0.5 px-1.5 rounded">
                            Active
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="size-3 text-muted-foreground" /> 2
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-[#121214] to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Right Side: Activity timeline */}
              <div className="border border-border bg-[#121214] p-4 rounded-lg flex flex-col gap-4">
                <span className="text-xs font-bold text-muted-foreground tracking-tight uppercase">
                  Real-Time Alignment
                </span>

                <div className="flex flex-col gap-3.5 h-50 overflow-hidden">
                  <AnimatePresence initial={false}>
                    {workspaceLogs.map((log, idx) => (
                      <motion.div
                        key={log + idx}
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 25,
                        }}
                        className="bg-[#18181c] border border-border/80 p-2.5 rounded text-[11px] leading-snug text-muted-foreground flex items-start gap-2.5"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span className="text-foreground/90 font-medium">
                          {log}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="mt-auto pt-4 border-t border-border/60 flex flex-col gap-1.5 text-[10px] text-muted-foreground font-mono">
                  <div>Draggable card X: {Math.round(draggedCardPos.x)}</div>
                  <div>Draggable card Y: {Math.round(draggedCardPos.y)}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. THE SOCIAL PROOF SECTION */}
      <section className="py-12 border-b border-border/60 bg-[#0C0C0E]/50 overflow-hidden relative w-full">
        <div className="mx-auto max-w-7xl px-6 md:px-8 mb-4">
          <p className="text-center text-[10px] md:text-xs font-bold tracking-widest text-muted-foreground/60 uppercase">
            Loved by product builders at global companies
          </p>
        </div>

        {/* Custom Infinite CSS Marquee */}
        <div className="relative flex overflow-x-hidden w-full select-none">
          <div className="animate-marquee whitespace-nowrap flex gap-16 text-lg md:text-2xl font-bold tracking-tight text-muted-foreground/35 uppercase py-4">
            <span>Stripe</span>
            <span>Linear</span>
            <span>Vercel</span>
            <span>Figma</span>
            <span>OpenAI</span>
            <span>Chronicle</span>
            <span>Retool</span>
            <span>Scale AI</span>
            <span>Ramp</span>
            <span>Railway</span>
          </div>

          <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex gap-16 text-lg md:text-2xl font-bold tracking-tight text-muted-foreground/35 uppercase py-4">
            <span>Stripe</span>
            <span>Linear</span>
            <span>Vercel</span>
            <span>Figma</span>
            <span>OpenAI</span>
            <span>Chronicle</span>
            <span>Retool</span>
            <span>Scale AI</span>
            <span>Ramp</span>
            <span>Railway</span>
          </div>

          {/* Gradients to mask the scrolling edges */}
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-linear-to-r from-[#0B0B0C] to-transparent pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-linear-to-l from-[#0B0B0C] to-transparent pointer-events-none" />
        </div>
      </section>

      {/* 3. CORE FEATURE SECTION (BESPOKE PLAYGROUNDS) */}
      <FeaturesSection />

      {/* 4. THE CALL TO ACTION (CTA) SECTION */}
      <section
        id="cta"
        className="relative py-24 md:py-36 px-6 md:px-8 border-b border-border/60 bg-[#0B0B0C] overflow-hidden"
      >
        {/* Subtle glow ring to focus the B2B action block */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-primary/5 rounded-full filter blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-4xl flex flex-col items-center text-center relative z-10">
          <span className="text-xs font-extrabold text-primary tracking-widest uppercase mb-4">
            JOIN THE SPRINT
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Experience the magic.
          </h2>
          <p className="text-muted-foreground max-w-lg mb-10 text-sm md:text-base leading-relaxed">
            Standard workflow dashboards build borders. Mistic breaks them down.
            Secure early beta access and unify your strategic workspace today.
          </p>

          {/* Email Capture Bar */}
          <form onSubmit={handleEmailSubmit} className="w-full max-w-md">
            <div
              className={`flex h-12 w-full items-center rounded-full border bg-[#121214] pl-5 pr-1.5 transition-all duration-300 ${
                isEmailFocused
                  ? "border-primary/50 shadow-[0_0_24px_rgba(139,92,246,0.15)] bg-[#141417]"
                  : "border-border"
              }`}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                placeholder="Enter your work email"
                required
                disabled={isSubmitting || isSubmitted}
                className="flex-1 bg-transparent text-sm text-white placeholder-muted-foreground outline-none border-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className="flex h-9 items-center justify-center gap-1 rounded-full bg-primary px-5 text-xs font-bold text-white transition-all duration-300 hover:bg-primary/95 disabled:bg-primary/50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Syncing...</span>
                ) : isSubmitted ? (
                  <span>Secured!</span>
                ) : (
                  <>
                    <span>Get Access</span>
                    <ArrowRight className="size-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Success messages */}
          <AnimatePresence>
            {isSubmitted && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xs font-semibold text-emerald-400 mt-4"
              >
                ✨ Thank you! We've reserved your early access spot. Check your
                inbox soon.
              </motion.p>
            )}
          </AnimatePresence>

          <p className="text-[10px] text-muted-foreground/60 mt-5 font-medium select-none">
            No credit card required. Free early-stage access for verified
            product teams.
          </p>
        </div>
      </section>
    </main>
  );
}
