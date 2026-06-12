import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findFirst({where: {role: 'admin'}});
  if (admin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.update({
      where: {id: admin.id},
      data: {password: hashedPassword}
    });
    console.log('Admin password reset! Email:', admin.email, 'Password: admin123');
  } else {
    // create admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const newAdmin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@redline.com',
        password: hashedPassword,
        role: 'admin'
      }
    });
    console.log('Admin created! Email:', newAdmin.email, 'Password: admin123');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
