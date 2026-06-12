import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.product.updateMany({
    where: { name: { in: ['actros 2336', 'Nusantara Edition', 'Premium Heavy Truck', 'Premium Heavy Weight Truck'] } },
    data: { createdAt: new Date() }
  });
  console.log('Updated createdAt for uploaded products');
}

main().finally(() => prisma.$disconnect());
