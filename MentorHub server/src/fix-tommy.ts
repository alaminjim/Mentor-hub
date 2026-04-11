import { prisma } from "./lib/prisma";

async function main() {
  const users = await prisma.user.findMany({
    where: {
      name: { contains: "TOMMY", mode: "insensitive" }
    }
  });
  console.log("Found Users:", JSON.stringify(users, null, 2));

  if (users.length > 0) {
    const updated = await prisma.user.update({
      where: { id: users[0]!.id },
      data: {
        isSubscribed: true,
        subscriptionType: "PROFESSIONAL",
        discountPercentage: 50
      }
    });
    console.log("Successfully updated user:", updated.name);
  } else {
    console.log("No user with name TOMMY found.");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
