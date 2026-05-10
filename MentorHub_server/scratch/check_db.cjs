
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.count();
  const bookings = await prisma.booking.count();
  const tutorProfiles = await prisma.tutorProfile.count();
  const products = await prisma.product.count();
  
  console.log('--- DB Stats ---');
  console.log('Users:', users);
  console.log('Bookings:', bookings);
  console.log('Tutor Profiles:', tutorProfiles);
  console.log('Products:', products);
  
  const tommy = await prisma.user.findFirst({ where: { name: { contains: 'Tommy' } } });
  if (tommy) {
    console.log('--- Tommy Stats ---');
    console.log('ID:', tommy.id);
    const tommyBookings = await prisma.booking.count({ where: { studentId: tommy.id } });
    console.log('Tommy Bookings:', tommyBookings);
  } else {
    console.log('Tommy user not found');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
