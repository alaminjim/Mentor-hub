import { prisma } from "./lib/prisma";

async function main() {
  const users = await prisma.user.updateMany({
    where: {
      name: { contains: "Tommy", mode: "insensitive" }
    },
    data: {
      isSubscribed: true,
      subscriptionType: "PROFESSIONAL",
      discountPercentage: 50
    }
  });
  console.log(`Successfully force-updated ${users.count} Tommy users to PROFESSIONAL.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
