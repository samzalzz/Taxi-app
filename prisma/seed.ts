import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding test accounts...');

  // Clean up existing test accounts
  await prisma.user.deleteMany({
    where: {
      email: {
        in: ['client@taxi-leblanc.fr', 'chauffeur@taxi-leblanc.fr', 'admin@taxi-leblanc.fr'],
      },
    },
  });

  // 1. CLIENT account
  const clientPassword = await bcryptjs.hash('ClientPass123!', 10);
  const client = await prisma.user.create({
    data: {
      email: 'client@taxi-leblanc.fr',
      name: 'Client Test',
      phone: '+33 6 00 00 00 01',
      passwordHash: clientPassword,
      role: 'CLIENT',
    },
  });
  console.log('✓ CLIENT account created:', client.email);

  // 2. DRIVER account + Driver record + Vehicle
  const driverPassword = await bcryptjs.hash('DriverPass123!', 10);
  const driver = await prisma.user.create({
    data: {
      email: 'chauffeur@taxi-leblanc.fr',
      name: 'Chauffeur Test',
      phone: '+33 6 00 00 00 02',
      passwordHash: driverPassword,
      role: 'DRIVER',
    },
  });
  console.log('✓ DRIVER account created:', driver.email);

  // Create Driver record
  const driverRecord = await prisma.driver.create({
    data: {
      userId: driver.id,
      licenseNumber: 'DL123456789FR',
      licenseExpiryDate: new Date('2030-12-31'),
      status: 'OFFLINE',
    },
  });
  console.log('✓ Driver record created');

  // Create Vehicle for driver
  const vehicle = await prisma.vehicle.create({
    data: {
      driverId: driverRecord.id,
      type: 'BERLINE',
      brand: 'Peugeot',
      model: '308',
      year: 2022,
      color: 'Noir',
      plateNumber: 'AB-123-CD',
      capacity: 4,
    },
  });
  console.log('✓ Vehicle created:', vehicle.plateNumber);

  // Link vehicle to driver
  await prisma.driver.update({
    where: { id: driverRecord.id },
    data: { vehicleId: vehicle.id },
  });
  console.log('✓ Vehicle linked to driver');

  // 3. ADMIN account
  const adminPassword = await bcryptjs.hash('AdminPass123!', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@taxi-leblanc.fr',
      name: 'Admin Test',
      phone: '+33 6 00 00 00 03',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✓ ADMIN account created:', admin.email);

  console.log('\n✅ Seed completed!\n');
  console.log('Test Accounts:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('CLIENT  │ client@taxi-leblanc.fr       │ ClientPass123!');
  console.log('DRIVER  │ chauffeur@taxi-leblanc.fr    │ DriverPass123!');
  console.log('ADMIN   │ admin@taxi-leblanc.fr        │ AdminPass123!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
