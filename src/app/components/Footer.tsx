"use client";

import FadeIn from "./FadeIn";

export default function Footer() {
  return (
    <footer className="bg-darkest py-10">
      <FadeIn>
        <div className="mx-auto max-w-6xl px-6 flex flex-col items-center gap-4">
          <span className="text-xl font-extrabold bg-gradient-to-r from-[#5DDCFF] to-[#0B5ED7] bg-clip-text text-transparent">
            DexaVision
          </span>
          <p className="text-sm font-medium text-white/80">
            &copy; 2026 DexaVision. Todos los derechos reservados.
          </p>
          <p className="text-xs text-white/40">
            Powered by CloudForge AI
          </p>
        </div>
      </FadeIn>
    </footer>
  );
}
