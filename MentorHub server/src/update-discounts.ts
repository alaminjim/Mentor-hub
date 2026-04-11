import { prisma } from "./lib/prisma";

async function main() {
  await prisma.pricingTier.updateMany({
    where: { name: { contains: "Essential", mode: "insensitive" } },
    data: { discountPercentage: 10 },
  });
  await prisma.pricingTier.updateMany({
    where: { name: { contains: "Master", mode: "insensitive" } },
    data: { discountPercentage: 25 },
  });
  await prisma.pricingTier.updateMany({
    where: { name: { contains: "Professional", mode: "insensitive" } },
    data: { discountPercentage: 50 },
  });
  console.log("Pricing tiers updated successfully with discount percentages!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
