export function DataStrip({ items }: { items: [string, string][] }) {
  return (
    <div className="border-y border-white/8 bg-navy-2/60">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-white/6 md:grid-cols-4">
        {items.map(([num, label]) => (
          <div key={label} className="px-5 py-6 text-center">
            <dt className="sr-only">{label}</dt>
            <dd className="font-heading text-xl font-extrabold text-naranja-claro md:text-2xl">{num}</dd>
            <dd className="font-mono-tech mt-1 text-[10px] uppercase tracking-[0.14em] text-tinta-suave">{label}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
