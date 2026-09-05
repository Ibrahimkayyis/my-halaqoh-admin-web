"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowDownUp } from "lucide-react";

interface PhoneMockupProps {
  src: string;
  alt: string;
  /** true untuk screenshot panjang (360x1094, 360x970, 360x1072) */
  isTall?: boolean;
  priority?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showScrollHint?: boolean;
}

export function PhoneMockup({
  src,
  alt,
  isTall = false,
  priority = false,
  size = "xl",
  className = "",
  showScrollHint = true,
}: PhoneMockupProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Width mapping per size variant — roomy and prominent
  const sizeClasses = {
    sm: "w-[260px] sm:w-[280px] max-w-[75vw]",
    md: "w-[300px] sm:w-[340px] lg:w-[370px] max-w-[85vw]",
    lg: "w-[330px] sm:w-[380px] lg:w-[410px] xl:w-[440px] max-w-[90vw]",
    xl: "w-[330px] sm:w-[380px] lg:w-[420px] xl:w-[450px] max-w-[92vw]",
  };

  // Precise aspect-ratio matched height and scroll offsets so sides are NEVER zoomed or cropped
  let containerHeight = "138%";
  let scrollYOffset = "-27%";

  if (src.includes("dashboard_wali")) {
    // 360 x 970 -> 1:2.694 ratio fits naturally at 125% height
    containerHeight = "125%";
    scrollYOffset = "-20%";
  } else if (src.includes("dashboard_teacher")) {
    // 360 x 1094 -> 1:3.039 ratio fits naturally at 140% height
    containerHeight = "140%";
    scrollYOffset = "-28.5%";
  } else if (src.includes("input_hafalan")) {
    // 360 x 1072 -> 1:2.978 ratio fits naturally at 138% height
    containerHeight = "138%";
    scrollYOffset = "-27%";
  }

  return (
    <div className={`relative mx-auto select-none group flex flex-col items-center ${sizeClasses[size]} ${className}`}>
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute -inset-8 rounded-[4.5rem] bg-gradient-to-tr from-[#115D69]/50 via-[#14B8A6]/30 to-[#D97706]/25 blur-3xl -z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
        aria-hidden="true"
      />

      {/* Outer Phone Frame (Dark Titanium Chassis with balanced borders) */}
      <div
        className="relative w-full overflow-hidden rounded-[2.85rem] bg-[#0A0D14] p-[10px] sm:p-[12px] shadow-2xl transition-transform duration-300 group-hover:scale-[1.01]"
        style={{
          boxShadow:
            "0 0 0 1px rgba(255, 255, 255, 0.22), 0 30px 70px -15px rgba(0, 0, 0, 0.85), 0 0 60px rgba(17, 93, 105, 0.35)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Hardware side buttons */}
        <div className="absolute -left-[2px] top-28 h-12 w-[3px] rounded-l-sm bg-gray-600/90" />
        <div className="absolute -left-[2px] top-44 h-12 w-[3px] rounded-l-sm bg-gray-600/90" />
        <div className="absolute -right-[2px] top-32 h-16 w-[3px] rounded-r-sm bg-gray-600/90" />

        {/* Screen Display Container with Natural Corner Radius */}
        <div className="relative w-full overflow-hidden rounded-[2.1rem] bg-white dark:bg-slate-900 shadow-inner aspect-[9/19.5]">
          {/* Subtle Top Status Bar Strip (Protects App Header from Corner Clipping) */}
          <div className="relative z-30 h-6 w-full bg-white dark:bg-slate-900 flex items-center justify-between px-5 text-[10px] font-bold text-gray-800 dark:text-gray-200">
            <span>09:41</span>
            {/* Minimal Center Punch-Hole Camera */}
            <div className="h-2.5 w-2.5 rounded-full bg-black border border-gray-700/60 shadow-sm flex items-center justify-center">
              <div className="h-1 w-1 rounded-full bg-[#0a3540]" />
            </div>
            {/* Battery / Wifi icons mockup */}
            <div className="flex items-center gap-1 opacity-75">
              <span className="text-[9px]">5G</span>
              <div className="h-2 w-3.5 rounded-[2px] border border-current flex items-center p-[1px]">
                <div className="h-full w-2 bg-current rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* Screen Content Wrapper below status bar */}
          <div className="absolute inset-x-0 top-6 bottom-0 overflow-hidden bg-slate-50 dark:bg-slate-950">
            {isTall ? (
              <motion.div
                className="relative w-full cursor-grab active:cursor-grabbing"
                style={{
                  height: containerHeight,
                  width: "100%",
                }}
                animate={{ y: isHovered ? scrollYOffset : "0%" }}
                transition={{
                  duration: 3.5,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-cover object-top"
                  priority={priority}
                  sizes="(max-width: 768px) 92vw, 480px"
                  draggable={false}
                />
              </motion.div>
            ) : (
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover object-top"
                priority={priority}
                sizes="(max-width: 768px) 92vw, 480px"
                draggable={false}
              />
            )}

            {/* Premium Screen Glass Reflection */}
            <div
              className="pointer-events-none absolute inset-0 z-20 opacity-20 bg-gradient-to-tr from-transparent via-white/5 to-white/15"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* Scroll Helper Hint (Placed Cleanly BELOW the Phone Frame) */}
      {isTall && showScrollHint && (
        <div className="mt-3.5 flex items-center gap-1.5 rounded-full bg-black/60 dark:bg-white/10 backdrop-blur-md px-3.5 py-1 text-[11px] font-medium text-teal-100 dark:text-teal-200 border border-white/10 shadow-sm">
          <ArrowDownUp className="h-3 w-3 text-[#2DD4BF] animate-bounce" />
          <span>Arahkan kursor ke HP untuk scroll</span>
        </div>
      )}
    </div>
  );
}
