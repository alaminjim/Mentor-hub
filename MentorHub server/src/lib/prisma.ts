import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const connectionString = `${process.env.DATABASE_URL}`;

// Connection pool — keeps connections alive, prevents cold start delay
const pool = new Pool({
  connectionString,
  max: 10,            // max concurrent connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

// Warm-up: fire a cheap query immediately so the DB connection is ready
// before the first real request comes in — eliminates cold start delay
(async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connection established");
  } catch (e) {
    console.error("⚠️  Database warm-up failed:", e);
  }
})();

export { prisma };
