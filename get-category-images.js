import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const categories = ['kaos-pria', 'kaos-wanita', 'kaos-anak', 'hoodie', 'topi', 'aksesori'];
  
  for (const cat of categories) {
    const product = await prisma.product.findFirst({
      where: { categoryId: cat },
      select: { name: true, frontImage: true }
    });
    if (product) {
      console.log(`Category: ${cat} -> Image: ${product.frontImage} (from ${product.name})`);
    } else {
      console.log(`Category: ${cat} -> No products found`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
