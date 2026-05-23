"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Magnetic effect component for premium CTA pull
function MagneticButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.6 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Calculate distance and pull factor
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    // Pull factor caps the movement so it feels "magnetic" but anchored
    x.set(distanceX * 0.35);
    y.set(distanceY * 0.35);
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

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Docs", href: "#docs" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-[#0B0B0C]/70 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-6 md:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-primary">
              Mistic
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative py-2 text-[0.875rem] font-medium text-muted-foreground transition-colors duration-200 hover:text-white"
                onMouseEnter={() => setHoveredLink(link.name)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {link.name}
                {hoveredLink === link.name && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 h-[1.5px] w-full bg-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Launch App CTA (Magnetic) */}
          <div className="hidden md:block">
            <MagneticButton>
              <Link
                href="/app"
                className="group relative flex h-9 items-center justify-center gap-1.5 overflow-hidden rounded-full border border-border bg-[#121214] px-4 text-xs font-semibold text-white transition-all duration-300 hover:border-primary hover:shadow-[0_0_12px_rgba(139,92,246,0.2)]"
              >
                <span>Launch App</span>
                <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
              </Link>
            </MagneticButton>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center p-2 text-muted-foreground hover:text-white md:hidden"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      {/* Mobile navigation side drawer */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-x-0 top-16 z-40 border-b border-border bg-[#0B0B0C]/95 py-6 px-6 backdrop-blur-lg md:hidden"
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-muted-foreground hover:text-white transition-colors py-2"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/app"
              onClick={() => setIsOpen(false)}
              className="mt-2 flex h-10 w-full items-center justify-center gap-1.5 rounded-full border border-primary bg-primary/10 text-sm font-semibold text-white hover:bg-primary transition-all duration-300"
            >
              <span>Launch App</span>
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </motion.div>
      )}
    </>
  );
}
