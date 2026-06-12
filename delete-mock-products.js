import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const adminSlugs = ['actros-2336', 'nusantara-edition', 'premium-heavy-truck', 'premium-heavy-weight-truck'];
  const res = await prisma.product.deleteMany({
    where: {
      slug: {
        notIn: adminSlugs
      }
    }
  });
  console.log(`Deleted ${res.count} products.`);
}
main().finally(() => prisma.$disconnect())
