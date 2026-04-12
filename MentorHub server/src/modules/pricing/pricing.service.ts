import { prisma } from "../../lib/prisma.js";

const createPricingTier = async (data: any) => {
  return await prisma.pricingTier.create({
    data,
  });
};

const getAllPricingTiers = async () => {
  return await prisma.pricingTier.findMany({
    orderBy: {
      price: "asc",
    },
  });
};

const getPricingTierById = async (id: string) => {
  return await prisma.pricingTier.findUnique({
    where: { id },
  });
};

const updatePricingTier = async (id: string, data: any) => {
  return await prisma.pricingTier.update({
    where: { id },
    data,
  });
};

const deletePricingTier = async (id: string) => {
  return await prisma.pricingTier.delete({
    where: { id },
  });
};

const updateUserSubscription = async (userId: string, tierName: string) => {
  // Fetch the tier first to get the discount percentage
  const tier = await prisma.pricingTier.findUnique({
    where: { name: tierName }
  });

  // Calculate discount percentage with hardcoded fallbacks for reliability
  let discountPercentage = tier?.discountPercentage || 0;
  
  if (discountPercentage === 0) {
    if (tierName.toLowerCase().includes("professional")) discountPercentage = 50;
    else if (tierName.toLowerCase().includes("master")) discountPercentage = 25;
    else if (tierName.toLowerCase().includes("essential")) discountPercentage = 10;
  }

  return await prisma.user.update({
    where: { id: userId },
    data: {
      isSubscribed: true,
      subscriptionType: tierName.toUpperCase(),
      discountPercentage: discountPercentage,
    },
  });
};

export const PricingService = {
  createPricingTier,
  getAllPricingTiers,
  getPricingTierById,
  updatePricingTier,
  deletePricingTier,
  updateUserSubscription,
};
