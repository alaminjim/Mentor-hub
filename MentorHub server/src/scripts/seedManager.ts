import { prisma } from "../lib/prisma.js";
import { Role } from "../types/role.js";
import "dotenv/config";

async function seedingManager() {
  try {
    const storeData = {
      name: process.env.MANAGER_NAME || "Manager Account",
      email: process.env.MANAGER_EMAIL,
      password: process.env.MANAGER_PASS || "12345678",
      role: Role.MANAGER,
    };

    if (!storeData.email) {
      throw new Error("MANAGER_EMAIL environment variable is not set");
    }

    const exits = await prisma.user.findUnique({
      where: {
        email: storeData.email,
      },
    });

    if (exits) {
      console.log("Manager already exists");
      return;
    }

    const createData = await fetch(
      "https://mentor-hub-server.vercel.app/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "https://mentor-hub-client-seven.vercel.app",
        },
        body: JSON.stringify(storeData),
      },
    );

    if (!createData.ok) {
        const err = await createData.json();
        console.error("Manager seeding failed:", err);
    } else {
        console.log("Manager seeded successfully");
    }
  } catch (error) {
    console.log(error);
  }
}

seedingManager();
