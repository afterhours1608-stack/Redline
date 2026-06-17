import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Adding paymentProof column to Order...');
    await prisma.$executeRawUnsafe('ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentProof" TEXT;');
    
    console.log('Creating PaymentMethod table...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "PaymentMethod" (
        "id" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "accountNumber" TEXT,
        "accountName" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
      );
    `);

    // Seed data
    console.log('Seeding payment methods...');
    const methods = [
      { id: 'qris', type: 'qris', name: 'QRIS', isActive: true },
      { id: 'tf-bca', type: 'bank', name: 'Transfer BCA', isActive: true },
      { id: 'tf-mandiri', type: 'bank', name: 'Transfer Mandiri', isActive: true },
      { id: 'tf-bni', type: 'bank', name: 'Transfer BNI', isActive: true },
      { id: 'tf-bri', type: 'bank', name: 'Transfer BRI', isActive: false },
      { id: 'ew-gopay', type: 'ewallet', name: 'GoPay', isActive: true },
      { id: 'ew-ovo', type: 'ewallet', name: 'OVO', isActive: true },
      { id: 'ew-dana', type: 'ewallet', name: 'Dana', isActive: true },
      { id: 'ew-shopeepay', type: 'ewallet', name: 'ShopeePay', isActive: false },
      { id: 'cod', type: 'cod', name: 'Cash on Delivery (COD)', isActive: true }
    ];

    for (const m of methods) {
      await prisma.$executeRawUnsafe(`
        INSERT INTO "PaymentMethod" ("id", "type", "name", "isActive") 
        VALUES ('${m.id}', '${m.type}', '${m.name}', ${m.isActive})
        ON CONFLICT ("id") DO NOTHING;
      `);
    }

    console.log('Database updated successfully!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

main();
