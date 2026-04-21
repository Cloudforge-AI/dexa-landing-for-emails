"use client";

import { useEffect, useState } from "react";
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-xl shadow-[0px_2px_6px_rgba(0,0,0,0.08)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        <a
          href="#"
          className="text-2xl font-extrabold bg-gradient-to-r from-[#0B5ED7] to-[#5DDCFF] bg-clip-text text-transparent"
        >
          DexaVision
        </a>

        <a
          href="#lead-form"
          className="cursor-pointer inline-flex items-center justify-center rounded-[10px] px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--gradient-btn)" }}
        >
          Solicitar Acceso
        </a>
      </div>
    </nav>
  );
}
