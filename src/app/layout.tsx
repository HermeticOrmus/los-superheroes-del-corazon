import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Club de los Superhéroes del Corazón",
    template: "%s | Superhéroes del Corazón",
  },
  description:
    "Únete al equipo secreto internacional de niños que están cambiando el mundo desde el corazón. Misiones mensuales, retos familiares y poderes increíbles te esperan.",
  keywords: [
    "club niños",
    "desarrollo emocional",
    "inteligencia emocional niños",
    "actividades familiares",
    "educación del corazón",
  ],
  authors: [{ name: "Los Superhéroes del Corazón" }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://lossuperheroesdelcorazon.com",
    siteName: "Club de los Superhéroes del Corazón",
    title: "Club de los Superhéroes del Corazón",
    description:
      "Donde los niños descubren que su mayor superpoder está dentro de su propio corazón",
  },
};

import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
