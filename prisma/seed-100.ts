import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding 100 reservations...');

  // 1. Create test accounts
  let client, driver, admin;

  try {
    // Delete only test accounts
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['client@taxi-leblanc.fr', 'chauffeur@taxi-leblanc.fr', 'admin@taxi-leblanc.fr'],
        },
      },
    });

    const clientPassword = await bcryptjs.hash('ClientPass123!', 10);
    client = await prisma.user.create({
      data: {
        email: 'client@taxi-leblanc.fr',
        name: 'Client Test',
        phone: '+33 6 00 00 00 01',
        passwordHash: clientPassword,
        role: 'CLIENT',
      },
    });
    console.log('✓ CLIENT account:', client.email);

    const driverPassword = await bcryptjs.hash('DriverPass123!', 10);
    driver = await prisma.user.create({
      data: {
        email: 'chauffeur@taxi-leblanc.fr',
        name: 'Chauffeur Test',
        phone: '+33 6 00 00 00 02',
        passwordHash: driverPassword,
        role: 'DRIVER',
      },
    });
    console.log('✓ DRIVER account:', driver.email);

    const adminPassword = await bcryptjs.hash('AdminPass123!', 10);
    admin = await prisma.user.create({
      data: {
        email: 'admin@taxi-leblanc.fr',
        name: 'Admin Test',
        phone: '+33 6 00 00 00 03',
        passwordHash: adminPassword,
        role: 'ADMIN',
      },
    });
    console.log('✓ ADMIN account:', admin.email);

    // 2. Create Driver record
    const driverRecord = await prisma.driver.create({
      data: {
        userId: driver.id,
        licenseNumber: 'DL123456789FR',
        licenseExpiryDate: new Date('2030-12-31'),
        status: 'AVAILABLE',
      },
    });
    console.log('✓ DRIVER record created');

    // 3. Create Vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        driverId: driverRecord.id,
        brand: 'Peugeot',
        model: '308',
        plateNumber: 'AB-123-CD',
        year: 2022,
        type: 'BERLINE',
        capacity: 4,
        color: 'Noir',
      },
    });
    console.log('✓ VEHICLE created:', vehicle.plateNumber);

    // 4. Create 100 Bookings with mixed statuses
    console.log('📝 Creating 100 bookings...');

    const statuses = ['PENDING', 'CONFIRMED', 'DRIVER_ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    const vehicleTypes = ['BERLINE', 'SUV', 'VAN', 'PREMIUM'];

    const cities = [
      { name: 'Paris', lat: 48.8566, lng: 2.3522 },
      { name: 'Versailles', lat: 48.8011, lng: 2.1298 },
      { name: 'Boulogne-Billancourt', lat: 48.8355, lng: 2.2399 },
      { name: 'Saint-Denis', lat: 48.9356, lng: 2.3567 },
      { name: 'Créteil', lat: 48.7805, lng: 2.4567 },
      { name: 'Nanterre', lat: 48.8950, lng: 2.2211 },
      { name: 'Issy-les-Moulineaux', lat: 48.8260, lng: 2.2710 },
      { name: 'Clamart', lat: 48.8030, lng: 2.2375 },
    ];

    for (let i = 0; i < 100; i++) {
      const statusIdx = i % statuses.length;
      const status = statuses[statusIdx];
      const vehicleType = vehicleTypes[i % vehicleTypes.length];

      const pickupCity = cities[i % cities.length];
      const dropoffCity = cities[(i + 1) % cities.length];

      const distance = Math.floor(Math.random() * 50) + 5; // 5-55 km
      const duration = Math.floor(distance * 2.5); // ~2.5 min per km

      let basePrice = 5;
      let pricePerKm = 1.5;

      if (vehicleType === 'SUV') {
        basePrice = 8;
        pricePerKm = 2;
      } else if (vehicleType === 'VAN') {
        basePrice = 10;
        pricePerKm = 2.5;
      } else if (vehicleType === 'PREMIUM') {
        basePrice = 15;
        pricePerKm = 3.5;
      }

      const totalPrice = basePrice + (distance * pricePerKm);

      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - Math.floor(i / 10)); // Spread over 10 days

      await prisma.booking.create({
        data: {
          clientId: client.id,
          driverId: status !== 'PENDING' && status !== 'CANCELLED' ? driverRecord.id : null,
          vehicleId: status !== 'PENDING' && status !== 'CANCELLED' ? vehicle.id : null,
          pickupAddress: `${Math.random().toString(36).substring(7)}, ${pickupCity.name}`,
          pickupCity: pickupCity.name,
          pickupLat: pickupCity.lat + (Math.random() - 0.5) * 0.05,
          pickupLng: pickupCity.lng + (Math.random() - 0.5) * 0.05,
          dropoffAddress: `${Math.random().toString(36).substring(7)}, ${dropoffCity.name}`,
          dropoffCity: dropoffCity.name,
          dropoffLat: dropoffCity.lat + (Math.random() - 0.5) * 0.05,
          dropoffLng: dropoffCity.lng + (Math.random() - 0.5) * 0.05,
          distance,
          estimatedDuration: duration,
          passengers: Math.floor(Math.random() * 3) + 1,
          luggage: Math.random() > 0.5,
          requestedVehicleType: vehicleType as any,
          basePrice,
          price: totalPrice,
          pricePerKm,
          status: status as any,
          confirmedAt: status !== 'PENDING' ? new Date(createdAt.getTime() + 60000) : null,
          pickupAt: ['IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(status) ? new Date(createdAt.getTime() + 300000) : null,
          dropoffAt: status === 'COMPLETED' ? new Date(createdAt.getTime() + 300000 + duration * 60000) : null,
          cancelledAt: status === 'CANCELLED' ? new Date(createdAt.getTime() + 120000) : null,
          createdAt,
        },
      });

      if ((i + 1) % 20 === 0) {
        console.log(`  ✓ ${i + 1}/100 bookings created`);
      }
    }

    console.log('✅ All 100 bookings created!');

    // 5. Create some Notifications
    console.log('🔔 Creating notifications...');
    const notificationTypes = [
      'BOOKING_CONFIRMED',
      'DRIVER_ARRIVED',
      'TRIP_STARTED',
      'TRIP_COMPLETED',
      'NEW_MESSAGE',
    ];

    for (let i = 0; i < 30; i++) {
      await prisma.notification.create({
        data: {
          userId: client.id,
          type: notificationTypes[i % notificationTypes.length] as any,
          title: 'Notification test',
          message: `Notification de test #${i + 1}`,
          read: i % 3 === 0,
        },
      });
    }
    console.log('✓ 30 notifications created');

    // 6. Create some Conversations
    console.log('💬 Creating conversations...');
    const bookings = await prisma.booking.findMany({
      where: {
        clientId: client.id,
        driverId: driverRecord.id,
      },
      take: 10,
    });

    for (const booking of bookings) {
      const conversation = await prisma.conversation.create({
        data: {
          bookingId: booking.id,
          type: 'RIDE',
          participants: {
            create: [
              { userId: client.id },
              { userId: driver.id },
            ],
          },
        },
      });

      // Add some messages
      for (let j = 0; j < 3; j++) {
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            senderId: j % 2 === 0 ? client.id : driver.id,
            content: `Message de test #${j + 1}`,
            type: 'TEXT',
          },
        });
      }
    }
    console.log('✓ 10 conversations with messages created');

    // 7. Create Reviews
    console.log('⭐ Creating reviews...');
    const completedBookings = await prisma.booking.findMany({
      where: {
        status: 'COMPLETED',
        clientId: client.id,
      },
      take: 20,
    });

    for (const booking of completedBookings) {
      await prisma.review.create({
        data: {
          bookingId: booking.id,
          reviewerId: client.id,
          revieweeId: driver.id,
          role: 'CLIENT',
          overallRating: Math.floor(Math.random() * 5) + 1,
          punctualityRating: Math.floor(Math.random() * 5) + 1,
          cleanlinessRating: Math.floor(Math.random() * 5) + 1,
          politenessRating: Math.floor(Math.random() * 5) + 1,
          safetyRating: Math.floor(Math.random() * 5) + 1,
          comment: 'Très bon service!',
        },
      });
    }
    console.log('✓ 20 reviews created');

    // 8. Create some Complaints
    console.log('📋 Creating complaints...');
    const categories = [
      'DRIVER_BEHAVIOR',
      'VEHICLE_CONDITION',
      'PRICING_DISPUTE',
      'LATE_PICKUP',
      'ROUTE_DEVIATION',
    ];

    for (let i = 0; i < 10; i++) {
      await prisma.complaint.create({
        data: {
          complainantId: client.id,
          againstId: i % 2 === 0 ? driver.id : undefined,
          category: categories[i % categories.length] as any,
          description: `Réclamation de test #${i + 1}`,
          status: i % 2 === 0 ? 'OPEN' : 'RESOLVED',
          resolvedAt: i % 2 === 0 ? undefined : new Date(),
        },
      });
    }
    console.log('✓ 10 complaints created');

    console.log('✅ DATABASE SEEDED SUCCESSFULLY!');
    console.log('');
    console.log('📊 Summary:');
    console.log('  • 3 users (1 client, 1 driver, 1 admin)');
    console.log('  • 1 vehicle');
    console.log('  • 100 bookings (mixed statuses)');
    console.log('  • 30 notifications');
    console.log('  • 10 conversations with messages');
    console.log('  • 20 reviews');
    console.log('  • 10 complaints');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
