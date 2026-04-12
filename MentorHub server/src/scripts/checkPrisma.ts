import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
console.log('ProductBookmark exists:', !!prisma.productBookmark);
process.exit(0);
