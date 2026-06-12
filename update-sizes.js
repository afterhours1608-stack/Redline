import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({ 
    include: { variants: true, category: true } 
  });
  
  for (const product of products) {
    // Only update apparel categories (Kaos, Hoodie)
    const catSlug = product.category ? product.category.slug : product.categoryId;
    const isApparel = catSlug && (catSlug.includes('kaos') || catSlug.includes('hoodie'));
    
    if (isApparel) {
      const sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
      const defaultColor = product.variants[0]?.color || 'Hitam';
      
      // Check if it already has all sizes, or if it only has 'All Size'
      const currentSizes = product.variants.map(v => v.size);
      
      if (currentSizes.includes('All Size') || currentSizes.length < 7) {
        // Delete existing variants
        await prisma.productVariant.deleteMany({
          where: { productId: product.id }
        });
        
        // Create new variants
        for (const size of sizes) {
          await prisma.productVariant.create({
            data: {
              productId: product.id,
              size: size,
              color: defaultColor,
              stock: 10,
              sku: `${product.slug}-${size}`.toUpperCase()
            }
          });
        }
        console.log(`Updated sizes for ${product.name} (S to 4XL)`);
      }
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
