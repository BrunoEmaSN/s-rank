/**
 * Seed runner: ejecuta todos los seeders o solo los indicados con --only=nombre1,nombre2
 *
 * Uso:
 *   npm run db:seed                    # ejecuta todos los seeders
 *   npm run db:seed -- --only=users    # solo el seeder "users"
 *   npm run db:seed -- --only users channels
 *
 * Requiere DATABASE_URL en el entorno (o en .env.local / .env si dotenv está instalado).
 */

try {
  const { config } = require("dotenv");
  const { resolve } = require("path");
  config({ path: resolve(process.cwd(), ".env.local") });
  config({ path: resolve(process.cwd(), ".env") });
} catch {
  // dotenv opcional: usar variables ya cargadas en el entorno
}

import { db } from "./db";
import { seedUsers } from "./seeders/01-users";
import { seedChannels } from "./seeders/02-channels";
import { seedTrophies } from "./seeders/03-trophies";
import { seedFollowsAndStats } from "./seeders/04-follows-and-stats";

type SeederName = "users" | "channels" | "trophies" | "follows-and-stats";

const SEEDERS: { name: SeederName; run: (db: typeof import("./db").db) => Promise<void> }[] = [
  { name: "users", run: seedUsers },
  { name: "channels", run: seedChannels },
  { name: "trophies", run: seedTrophies },
  { name: "follows-and-stats", run: seedFollowsAndStats },
];

async function main() {
  const argv = process.argv.slice(2);
  const onlyArg = argv.find((a) => a.startsWith("--only="));
  const onlyIdx = argv.indexOf("--only");
  const onlyNamesRaw = onlyArg
    ? onlyArg.replace("--only=", "").split(",")
    : onlyIdx >= 0 && argv[onlyIdx + 1]
      ? argv[onlyIdx + 1].split(",")
      : null;
  const onlyNames = onlyNamesRaw ? (onlyNamesRaw as SeederName[]) : null;

  const toRun = onlyNames
    ? SEEDERS.filter((s) => onlyNames.includes(s.name))
    : SEEDERS;

  if (toRun.length === 0) {
    console.log("Ningún seeder seleccionado. Usa --only=users,channels,trophies,follows-and-stats");
    process.exit(1);
  }

  console.log("Ejecutando seeders:", toRun.map((s) => s.name).join(", "));

  for (const { name, run } of toRun) {
    try {
      await run(db);
      console.log(`  ✓ ${name}`);
    } catch (err) {
      console.error(`  ✗ ${name}`, err);
      process.exit(1);
    }
  }

  console.log("Seed completado.");
  process.exit(0);
}

main();
