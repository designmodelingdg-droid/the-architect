import type { ReactNode } from "react";

/* El editor no lleva la barra ni el pie del sitio: es una herramienta, no una página. */
export const metadata = { title: { absolute: "Editor · Design Modeling Academy" }, robots: { index: false, follow: false } };

export default function KeystaticLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
