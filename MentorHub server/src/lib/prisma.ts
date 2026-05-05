import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

// Check if DATABASE_URL is defined
if (!connectionString) {
  console.error("❌ DATABASE_URL is not defined in environment variables");
  console.error("Please set DATABASE_URL in your Vercel environment variables");
}

// Connection pool — keeps connections alive, prevents cold start delay
const pool = connectionString
  ? new Pool({
      connectionString,
      max: 10, // max concurrent connections
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    })
  : null;

const adapter = pool ? new PrismaPg(pool) : undefined;

const prisma = connectionString
  ? new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    })
  : (new Proxy(
      {},
      {
        get: () => {
          throw new Error(
            "DATABASE_URL is not configured. Please check your environment variables."
          );
        },
      }
    ) as PrismaClient);

// Warm-up: fire a cheap query immediately so the DB connection is ready
// before the first real request comes in — eliminates cold start delay
if (connectionString && pool) {
  (async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log("✅ Database connection established");
    } catch (e) {
      console.error("⚠️  Database warm-up failed:", e);
    }
  })();
}

export { prisma };
