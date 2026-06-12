import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  products.forEach(p => {
    console.log(`Cat: ${p.categoryId}, Name: ${p.name}`);
    console.log(`Image: ${JSON.parse(p.images)[0]}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
