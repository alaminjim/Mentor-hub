import "dotenv/config";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Error on server: ", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
