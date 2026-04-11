import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe('DROP TABLE "bookmarks" CASCADE;');
  console.log('Dropped bookmarks table');
}

main().catch(console.error).finally(()=>prisma.$disconnect());
