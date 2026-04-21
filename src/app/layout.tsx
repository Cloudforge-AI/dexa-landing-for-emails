import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "DexaVision — Diagnóstico Dental con IA",
  description:
    "Plataforma de detección de caries dental con Inteligencia Artificial. Análisis instantáneo con clasificación ICDAS II para dentistas y pacientes.",
  icons: {
    icon: "/dexa_alternative_landinglogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${figtree.variable} antialiased`}>
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
