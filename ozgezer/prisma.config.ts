import { defineConfig } from "prisma/config";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.js",
  },
  datasource: {
    // Migratsiya uchun DIRECT_URL (PgBouncer bypass), runtime uchun DATABASE_URL
    url:
      process.env.DIRECT_URL ??
      process.env.DATABASE_URL ??
      "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },
});
