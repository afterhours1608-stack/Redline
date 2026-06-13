import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { variants: true, category: true }
  });
  
  fs.writeFileSync('temp-products.json', JSON.stringify(products, null, 2));
  console.log(`Exported ${products.length} products`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
