export function DataStrip({ items, dark = false }: { items: [string, string][]; dark?: boolean }) {
  return (
    <div className={dark ? "border-y border-white/10 bg-navy-2/60" : "border-y border-border bg-crema"}>
      <dl className={`mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4 ${dark ? "divide-x divide-white/6" : "divide-x divide-border"}`}>
        {items.map(([num, label]) => (
          <div key={label} className="px-5 py-7 text-center">
            <dt className="sr-only">{label}</dt>
            <dd className={`font-heading text-2xl font-extrabold md:text-3xl ${dark ? "text-naranja-claro" : "text-naranja"}`}>{num}</dd>
            <dd className={`mt-1 font-heading text-[10.5px] font-bold uppercase tracking-[0.14em] ${dark ? "text-white/55" : "text-tinta-suave"}`}>{label}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
