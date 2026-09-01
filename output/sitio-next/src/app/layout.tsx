import type { Metadata } from "next";
import { Overpass, Nunito } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/navbar";
import { TopBar } from "@/components/site/topbar";
import { Footer } from "@/components/site/footer";
import { WaFloat } from "@/components/site/wa-float";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://dgdesignmodeling.com"),
  title: {
    default: "Design Modeling DG — Consultoría BIM con inteligencia artificial",
    template: "%s · Design Modeling DG",
  },
  description:
    "Consultoría BIM estructural con IA aplicada con criterio: cálculo sismorresistente, coordinación de disciplinas y DG BIM Intelligence, el agente que razona sobre tu proyecto. Ecuador y Latinoamérica.",
  openGraph: {
    type: "website",
    locale: "es_EC",
    siteName: "Design Modeling DG",
    title: "Design Modeling DG — Consultoría BIM con inteligencia artificial",
    description:
      "Consultoría BIM estructural y arquitectónica con un plus: DG BIM Intelligence, nuestro software de IA. Ecuador y Latinoamérica.",
    images: [{ url: "/images/og-web.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Design Modeling DG — Consultoría BIM con inteligencia artificial",
    description:
      "Consultoría BIM estructural y arquitectónica con software propio de IA. Ecuador y Latinoamérica.",
    images: ["/images/og-web.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${overpass.variable} ${nunito.variable} bg-background text-foreground antialiased`}>
        <a href="#contenido" className="saltar-contenido">Saltar al contenido</a>
        <TopBar />
        <Navbar />
        <main id="contenido">{children}</main>
        <Footer />
        <WaFloat />
      </body>
    </html>
  );
}
