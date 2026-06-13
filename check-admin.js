import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

async function checkAdmin() {
  const users = await prisma.user.findMany();
  console.log('Total Users:', users.length);
  const admin = users.find(u => u.email === 'admin@redline.com');
  if (admin) {
    console.log('Admin user found:', admin.email);
  } else {
    console.log('Admin user NOT found!');
    console.log('All users:', users.map(u => u.email));
  }
}

checkAdmin()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
