import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OS Comercial IA — Motor Comercial B2B",
  description:
    "Motor de ejecución comercial con IA para equipos de ventas B2B en LATAM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-sans">{children}</body>
    </html>
  );
}
