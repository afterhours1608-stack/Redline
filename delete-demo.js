import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const customSlugs = [
    'Premium Heavy Truck',
    'nusantara-edition',
    'Exclusive',
    'premium-heavy-weight-truck'
  ];

  const allProducts = await prisma.product.findMany();
  
  let deletedCount = 0;
  for (const product of allProducts) {
    if (!customSlugs.includes(product.slug)) {
      // Delete variants first (cascade might not be configured, just to be safe)
      await prisma.productVariant.deleteMany({
        where: { productId: product.id }
      });
      // Delete product
      await prisma.product.delete({
        where: { id: product.id }
      });
      console.log(`Deleted demo product: ${product.name}`);
      deletedCount++;
    } else {
      console.log(`Kept custom product: ${product.name}`);
    }
  }
  
  console.log(`Total demo products deleted: ${deletedCount}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
