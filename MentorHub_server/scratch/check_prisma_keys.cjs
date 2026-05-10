
const { prisma } = require('./src/lib/prisma.js');

async function main() {
  console.log('Prisma Keys:', Object.keys(prisma).filter(k => !k.startsWith('$')));
}

main().catch(console.error).finally(() => process.exit());
