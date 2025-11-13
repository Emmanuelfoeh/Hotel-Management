import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding staff members...');

  // Create Manager
  const managerPassword = await bcrypt.hash('Manager123!', 10);
  const manager = await prisma.staff.upsert({
    where: { email: 'manager@hotel.com' },
    update: {},
    create: {
      firstName: 'John',
      lastName: 'Manager',
      email: 'manager@hotel.com',
      phone: '+1234567890',
      role: 'MANAGER',
      password: managerPassword,
      isActive: true,
      hireDate: new Date(),
    },
  });
  console.log('✅ Created Manager:', manager.email);

  // Create Receptionist
  const receptionistPassword = await bcrypt.hash('Reception123!', 10);
  const receptionist = await prisma.staff.upsert({
    where: { email: 'receptionist@hotel.com' },
    update: {},
    create: {
      firstName: 'Jane',
      lastName: 'Receptionist',
      email: 'receptionist@hotel.com',
      phone: '+1234567891',
      role: 'RECEPTIONIST',
      password: receptionistPassword,
      isActive: true,
      hireDate: new Date(),
    },
  });
  console.log('✅ Created Receptionist:', receptionist.email);

  // Create Cleaner
  const cleanerPassword = await bcrypt.hash('Cleaner123!', 10);
  const cleaner = await prisma.staff.upsert({
    where: { email: 'cleaner@hotel.com' },
    update: {},
    create: {
      firstName: 'Bob',
      lastName: 'Cleaner',
      email: 'cleaner@hotel.com',
      phone: '+1234567892',
      role: 'CLEANER',
      password: cleanerPassword,
      isActive: true,
      hireDate: new Date(),
    },
  });
  console.log('✅ Created Cleaner:', cleaner.email);

  console.log('\n📋 Login Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Manager:');
  console.log('  Email: manager@hotel.com');
  console.log('  Password: Manager123!');
  console.log('');
  console.log('Receptionist:');
  console.log('  Email: receptionist@hotel.com');
  console.log('  Password: Reception123!');
  console.log('');
  console.log('Cleaner:');
  console.log('  Email: cleaner@hotel.com');
  console.log('  Password: Cleaner123!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding staff:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
