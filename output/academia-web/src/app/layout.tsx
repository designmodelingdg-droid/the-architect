import type { Metadata } from "next";
import { Overpass, Nunito } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/navbar";
import { TopBar } from "@/components/site/topbar";
import { Footer } from "@/components/site/footer";
import { ChatWidget } from "@/components/site/chat-widget";
import { ScrollSuave } from "@/components/site/scroll-suave";
import { DatosEstructurados } from "@/components/site/datos-estructurados";
import { DOMINIO, NOMBRE } from "@/lib/site";

const overpass = Overpass({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-overpass",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});

const DESCRIPCION =
  "Escuela online de BIM, ingeniería estructural e inteligencia artificial aplicada. Másteres, diplomados, especializaciones y cursos en Revit, Robot, ETABS, SAP2000 y CYPE, con clases en vivo, título universitario internacional y docentes que ejercen. Latinoamérica, España y Estados Unidos.";

export const metadata: Metadata = {
  metadataBase: new URL(DOMINIO),
  title: {
    default: `${NOMBRE} — Escuela online de BIM, estructuras e IA`,
    template: `%s · ${NOMBRE}`,
  },
  description: DESCRIPCION,
  alternates: { canonical: "./", types: { "text/markdown": "/index.md" } },
  openGraph: {
    type: "website",
    locale: "es_EC",
    siteName: NOMBRE,
    title: `${NOMBRE} — Escuela online de BIM, estructuras e IA`,
    description: DESCRIPCION,
    images: [{ url: "/images/og-academy.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${NOMBRE} — Escuela online de BIM, estructuras e IA`,
    description: DESCRIPCION,
    images: ["/images/og-academy.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${overpass.variable} ${nunito.variable} bg-background text-foreground antialiased`}>
        <DatosEstructurados />
        <ScrollSuave />
        <a href="#contenido" className="saltar-contenido">Saltar al contenido</a>
        <TopBar />
        <Navbar />
        <main id="contenido">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
