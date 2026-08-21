import type { Metadata } from "next";
import { Overpass, Nunito } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/navbar";
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
    default: "Design Modeling DG — Consultoría BIM estructural",
    template: "%s · Design Modeling DG",
  },
  description:
    "Consultoría BIM para proyectos estructurales y arquitectónicos en Ecuador y Latinoamérica. Cálculo estructural, coordinación BIM y DG BIM Intelligence, nuestra plataforma propia.",
  openGraph: {
    type: "website",
    locale: "es_EC",
    siteName: "Design Modeling DG",
    title: "Design Modeling DG — Consultoría BIM estructural",
    description:
      "Ingeniería estructural y BIM para proyectos que no admiten sorpresas. Diez años resolviendo en el modelo lo que a otros les aparece en obra.",
    images: [{ url: "/images/dm-hero.jpg", width: 1920, height: 1097 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${overpass.variable} ${nunito.variable} bg-background text-foreground antialiased`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WaFloat />
      </body>
    </html>
  );
}
