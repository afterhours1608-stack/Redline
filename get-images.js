import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const categories = ['kaos-pria', 'kaos-wanita', 'kaos-anak', 'hoodie', 'topi', 'aksesori'];
  
  for (const cat of categories) {
    const products = await prisma.product.findMany({
      where: { categoryId: cat },
      select: { name: true, images: true }
    });
    if (products.length > 0) {
      const p = products[0];
      const images = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
      console.log(`Category: ${cat} -> Image: ${images[0]} (from ${p.name})`);
    } else {
      console.log(`Category: ${cat} -> No products found`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
