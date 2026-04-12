import { prisma } from "../lib/prisma";
import { Role } from "../types/role";
import "dotenv/config";

async function seedingVendor() {
  try {
    const storeData = {
      name: process.env.VENDOR_NAME || "Vendor Account",
      email: process.env.VENDOR_EMAIL,
      password: process.env.VENDOR_PASS || "12345678",
      role: Role.VENDOR,
    };

    if (!storeData.email) {
      throw new Error("VENDOR_EMAIL environment variable is not set");
    }

    const exits = await prisma.user.findUnique({
      where: {
        email: storeData.email,
      },
    });

    if (exits) {
      console.log("Vendor already exists");
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
        console.error("Vendor seeding failed:", err);
    } else {
        console.log("Vendor seeded successfully");
    }
  } catch (error) {
    console.log(error);
  }
}

seedingVendor();
