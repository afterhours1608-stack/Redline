import { PrismaClient } from '@prisma/client';

let prisma;

try {
  prisma = new PrismaClient();
} catch (error) {
  console.error("Prisma Client Initialization Error:", error);
  // Provide a proxy that throws an error only when a query is actually made
  prisma = new Proxy({}, {
    get: (target, prop) => {
      return () => {
        throw new Error(`Prisma Initialization Failed: ${error.message}`);
      }
    }
  });
}

export default prisma;
