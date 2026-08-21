import { WA_MSG } from "@/lib/site";
import { MessageCircle } from "lucide-react";

export function WaFloat() {
  return (
    <a
      href={WA_MSG("Hola, quiero información sobre consultoría BIM")}
      target="_blank"
      rel="noopener"
      className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-heading text-sm font-bold text-white shadow-xl shadow-black/25 transition-transform hover:-translate-y-0.5"
    >
      <MessageCircle className="size-4" aria-hidden />
      Contactar a un asesor
    </a>
  );
}
