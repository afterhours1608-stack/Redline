import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.product.findMany({
  where: { name: { in: ['actros 2336', 'Nusantara Edition', 'Premium Heavy Truck', 'Premium Heavy Weight Truck'] } },
  include: { category: true }
}).then(p => {
  console.log(p.map(x=>({name: x.name, category: x.category?.name})));
  prisma.$disconnect();
});
