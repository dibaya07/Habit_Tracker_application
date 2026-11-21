import React from "react";

export default function BackgroundGraphics() {
  return (
    <>
      {/* Architectural Dot Matrix Backdrop with Smooth Radial Edge Fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(24,63,46,0.13)_1.2px,transparent_1.2px)] dark:bg-[radial-gradient(rgba(47,225,150,0.14)_1.2px,transparent_1.2px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_85%_72%_at_50%_38%,#000_48%,transparent_100%)] z-0"
      />

      {/* Multi-Layered Luminous Ambient Aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[920px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(47,225,150,0.28)_0%,rgba(16,185,129,0.08)_48%,transparent_72%)] dark:bg-[radial-gradient(circle,rgba(47,225,150,0.2)_0%,rgba(16,185,129,0.06)_50%,transparent_75%)] blur-2xl z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-28 -left-24 w-80 h-80 rounded-full bg-emerald-300/25 dark:bg-emerald-500/12 blur-3xl z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-32 -right-24 w-80 h-80 rounded-full bg-teal-300/25 dark:bg-teal-400/10 blur-3xl z-0"
      />

      {/* Subtle Concentric Orbital Rings Framing Centerpiece */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-8 left-1/2 -translate-x-1/2 w-[560px] sm:w-[760px] h-[560px] sm:h-[760px] rounded-full border border-emerald-600/10 dark:border-emerald-400/10 z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-24 left-1/2 -translate-x-1/2 w-[380px] sm:w-[540px] h-[380px] sm:h-[540px] rounded-full border border-emerald-600/10 dark:border-emerald-400/10 z-0"
      />
    </>
  );
}
