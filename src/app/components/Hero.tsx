"use client";

import Image from "next/image";
import FadeIn from "./FadeIn";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg pt-32 pb-24 sm:pt-40 sm:pb-32">
      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--gradient-deco)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full opacity-15 blur-3xl"
        style={{ background: "var(--gradient-deco)" }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Text */}
          <FadeIn className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-darkest sm:text-5xl lg:text-6xl">
              Detecta caries dental con{" "}
              <span className="bg-gradient-to-r from-[#0B5ED7] to-[#5DDCFF] bg-clip-text text-transparent">
                Inteligencia Artificial
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-gray sm:text-xl lg:mx-0 mx-auto">
              Análisis instantáneo con clasificación ICDAS II. Para dentistas y
              pacientes.
            </p>

            <a
              href="#lead-form"
              className="cursor-pointer mt-10 inline-flex items-center justify-center rounded-[10px] px-8 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl"
              style={{ background: "var(--gradient-cta)" }}
            >
              Solicitar Acceso Anticipado
            </a>
          </FadeIn>

          {/* Hero image */}
          <FadeIn delay={200} className="flex-1 flex justify-center">
            <Image
              src="/dexa_alternative_landinglogo.png"
              alt="DexaVision - Análisis dental con IA"
              width={400}
              height={600}
              priority
              className="w-full max-w-sm rounded-2xl shadow-2xl lg:max-w-md"
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
