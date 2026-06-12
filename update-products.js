import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.product.updateMany({
    where: { name: 'actros 2336' },
    data: { badge: 'Terlaris', price: 135000 }
  });
  
  await prisma.product.updateMany({
    where: { name: 'Nusantara Edition' },
    data: { badge: 'Baru', price: 145000 }
  });
  
  await prisma.product.updateMany({
    where: { name: 'Premium Heavy Truck' },
    data: { badge: 'Limited', price: 155000 }
  });
  
  await prisma.product.updateMany({
    where: { name: 'Premium Heavy Weight Truck' },
    data: { badge: 'Sale', price: 150000, salePrice: 125000 }
  });

  console.log('Updated original products');
}

main().finally(() => prisma.$disconnect());
