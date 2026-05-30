import "dotenv/config";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    console.log("[Server] Starting initialization...");
    if (!process.env.DATABASE_URL) {
      console.warn("[Server] WARNING: DATABASE_URL is not set!");
    }

    await prisma.$connect();
    console.log("[Server] Database connected successfully");

    app.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`[Server] Success: Server is running on port ${PORT}`);
      console.log(`[Server] Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("[Server] FATAL ERROR during startup:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
