import { prisma } from "../src/lib/prisma.js";

async function main() {
  console.log("Checking DB connection...");
  try {
    const users = await prisma.user.count();
    const bookings = await prisma.booking.count();
    const tutorProfiles = await prisma.tutorProfile.count();
    const categories = await prisma.category.count();
    
    console.log("--- DB Connection Successful ---");
    console.log("Users count:", users);
    console.log("Bookings count:", bookings);
    console.log("Tutor Profiles count:", tutorProfiles);
    console.log("Categories count:", categories);
  } catch (error) {
    console.error("--- DB Connection Failed ---");
    console.error(error);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
