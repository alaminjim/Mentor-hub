import { prisma } from "../lib/prisma.js";
import { Role } from "../types/role.js";
import "dotenv/config";

async function seedingOrganizer() {
  try {
    const storeData = {
      name: process.env.ORGANIZER_NAME || "Organizer User",
      email: process.env.ORGANIZER_EMAIL,
      password: process.env.ORGANIZER_PASS || "12345678",
      role: Role.ORGANIZER,
    };

    if (!storeData.email) {
      throw new Error("ORGANIZER_EMAIL environment variable is not set");
    }

    const exits = await prisma.user.findUnique({
      where: {
        email: storeData.email,
      },
    });

    if (exits) {
      console.log("Organizer already exists");
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
        console.error("Organizer seeding failed:", err);
    } else {
        console.log("Organizer seeded successfully");
    }
  } catch (error) {
    console.log(error);
  }
}

seedingOrganizer();
