import { prisma } from "./lib/prisma";

async function main() {
  const user = await prisma.user.updateMany({
    where: { 
      OR: [
        { name: "TOMMY STUDENT" },
        { email: "student@gmail.com" } // Common test email, adjusting just in case
      ]
    },
    data: {
      isSubscribed: true,
      subscriptionType: "PROFESSIONAL",
      discountPercentage: 50
    }
  });
  console.log(`Force updated ${user.count} user(s) to PROFESSIONAL status.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
