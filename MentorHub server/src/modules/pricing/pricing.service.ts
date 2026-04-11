import { prisma } from "../../lib/prisma";

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

export const PricingService = {
  createPricingTier,
  getAllPricingTiers,
  getPricingTierById,
  updatePricingTier,
  deletePricingTier,
};
