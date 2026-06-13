import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const data = JSON.parse(fs.readFileSync('temp-products.json', 'utf8'));
  
  console.log(`Found ${data.length} products to import.`);
  
  for (const product of data) {
    // Check if category exists
    let category = await prisma.category.findUnique({
      where: { slug: product.category.slug }
    });
    
    if (!category) {
      category = await prisma.category.create({
        data: {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
        }
      });
      console.log(`Created category: ${category.name}`);
    }

    // Check if product exists
    const existing = await prisma.product.findUnique({
      where: { slug: product.slug }
    });
    
    if (!existing) {
      const newProduct = await prisma.product.create({
        data: {
          id: product.id,
          slug: product.slug,
          name: product.name,
          description: product.description,
          material: product.material,
          price: product.price,
          salePrice: product.salePrice,
          badge: product.badge,
          images: product.images,
          categoryId: category.id,
        }
      });
      console.log(`Imported product: ${newProduct.name}`);
      
      // Import variants
      if (product.variants && product.variants.length > 0) {
        for (const variant of product.variants) {
          await prisma.productVariant.create({
            data: {
              id: variant.id,
              productId: newProduct.id,
              size: variant.size,
              color: variant.color,
              stock: variant.stock,
              sku: variant.sku
            }
          });
        }
        console.log(`  Imported ${product.variants.length} variants for ${newProduct.name}`);
      }
    } else {
      console.log(`Product already exists: ${product.name}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
