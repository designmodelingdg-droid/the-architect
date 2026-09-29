// Valida que Keystatic lee TODO el contenido sin error. Se corre con:
//   node --experimental-strip-types scripts/validar-contenido.mts
import { createReader } from "@keystatic/core/reader";
import config from "../keystatic.config.ts";
const reader = createReader(process.cwd(), config);
let errores = 0, total = 0;
for (const [nombre, col] of Object.entries(reader.collections)) {
  const slugs = await col.list();
  for (const slug of slugs) {
    total++;
    try { const e = await col.read(slug); if (!e) throw new Error("vacío"); }
    catch (err) { errores++; console.log(`  ✗ ${nombre}/${slug}: ${(err as Error).message.split("\n")[0]}`); }
  }
  console.log(`${nombre}: ${slugs.length}`);
}
for (const [nombre, s] of Object.entries(reader.singletons)) {
  total++;
  try { const e = await s.read(); if (!e) throw new Error("vacío"); console.log(`${nombre}: ok`); }
  catch (err) { errores++; console.log(`  ✗ ${nombre}: ${(err as Error).message.split("\n")[0]}`); }
}
console.log(`\n${total} entradas, ${errores} con error`);
process.exit(errores ? 1 : 0);
