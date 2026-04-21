import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "DexaVision — Diagnostico Dental con IA",
  description:
    "Plataforma de deteccion de caries dental con Inteligencia Artificial. Analisis instantaneo con clasificacion ICDAS II para dentistas y pacientes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col font-[family-name:var(--font-inter)]">
        {children}
      </body>
    </html>
  );
}
