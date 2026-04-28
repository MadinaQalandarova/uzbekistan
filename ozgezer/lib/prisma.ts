import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Pool is lazy — doesn't connect until first query.
// If DATABASE_URL is missing we still create a client; it will only
// fail when a query is actually executed (which catalog-service guards
// against by checking hasDatabaseConfig() first).
const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://placeholder:placeholder@localhost:5432/placeholder";

const prismaClientSingleton = () => {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var prisma: undefined | PrismaClient;
}

export const prisma: PrismaClient =
  globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
