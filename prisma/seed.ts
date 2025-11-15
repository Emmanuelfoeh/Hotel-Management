import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (in reverse order of dependencies)
  console.log('🧹 Cleaning existing data...');
  await prisma.activityLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.room.deleteMany();

  // Create Staff Members (including admin)
  console.log('👥 Creating staff members...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const manager = await prisma.staff.create({
    data: {
      firstName: 'John',
      lastName: 'Manager',
      email: 'admin@hotel.com',
      phone: '+1234567890',
      role: 'MANAGER',
      password: hashedPassword,
      isActive: true,
      hireDate: new Date('2020-01-15'),
      notes: 'Hotel manager with full system access',
    },
  });

  const receptionist1 = await prisma.staff.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah@hotel.com',
      phone: '+1234567891',
      role: 'RECEPTIONIST',
      password: hashedPassword,
      isActive: true,
      hireDate: new Date('2021-03-20'),
      notes: 'Front desk receptionist - morning shift',
    },
  });

  const receptionist2 = await prisma.staff.create({
    data: {
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael@hotel.com',
      phone: '+1234567892',
      role: 'RECEPTIONIST',
      password: hashedPassword,
      isActive: true,
      hireDate: new Date('2021-06-10'),
      notes: 'Front desk receptionist - evening shift',
    },
  });

  const cleaner1 = await prisma.staff.create({
    data: {
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria@hotel.com',
      phone: '+1234567893',
      role: 'CLEANER',
      password: hashedPassword,
      isActive: true,
      hireDate: new Date('2022-01-05'),
      notes: 'Housekeeping staff - floors 1-3',
    },
  });

  const cleaner2 = await prisma.staff.create({
    data: {
      firstName: 'James',
      lastName: 'Wilson',
      email: 'james@hotel.com',
      phone: '+1234567894',
      role: 'CLEANER',
      password: hashedPassword,
      isActive: true,
      hireDate: new Date('2022-02-15'),
      notes: 'Housekeeping staff - floors 4-6',
    },
  });

  console.log('✅ Created 5 staff members');

  // Create Rooms
  console.log('🏨 Creating rooms...');
  const rooms = await Promise.all([
    // Single Rooms
    prisma.room.create({
      data: {
        name: 'Cozy Single Room',
        type: 'SINGLE',
        description:
          'Perfect for solo travelers. Features a comfortable single bed, work desk, and modern amenities.',
        price: 89.99,
        capacity: 1,
        amenities: [
          'WiFi',
          'TV',
          'Air Conditioning',
          'Work Desk',
          'Mini Fridge',
        ],
        images: ['/images/rooms/single-1.jpg'],
        status: 'AVAILABLE',
        floor: 1,
        roomNumber: '101',
      },
    }),
    prisma.room.create({
      data: {
        name: 'Modern Single Room',
        type: 'SINGLE',
        description:
          'Contemporary single room with city view and premium bedding.',
        price: 99.99,
        capacity: 1,
        amenities: [
          'WiFi',
          'TV',
          'Air Conditioning',
          'City View',
          'Coffee Maker',
        ],
        images: ['/images/rooms/single-2.jpg'],
        status: 'AVAILABLE',
        floor: 2,
        roomNumber: '201',
      },
    }),

    // Double Rooms
    prisma.room.create({
      data: {
        name: 'Deluxe Double Room',
        type: 'DOUBLE',
        description:
          'Spacious room with queen-size bed, perfect for couples or business travelers.',
        price: 149.99,
        capacity: 2,
        amenities: [
          'WiFi',
          'TV',
          'Air Conditioning',
          'Mini Bar',
          'Safe',
          'Balcony',
        ],
        images: ['/images/rooms/double-1.jpg'],
        status: 'OCCUPIED',
        floor: 2,
        roomNumber: '202',
      },
    }),
    prisma.room.create({
      data: {
        name: 'Premium Double Room',
        type: 'DOUBLE',
        description:
          'Elegant double room with king-size bed and luxury amenities.',
        price: 169.99,
        capacity: 2,
        amenities: [
          'WiFi',
          'TV',
          'Air Conditioning',
          'Mini Bar',
          'Safe',
          'Ocean View',
          'Bathtub',
        ],
        images: ['/images/rooms/double-2.jpg'],
        status: 'AVAILABLE',
        floor: 3,
        roomNumber: '301',
      },
    }),

    // Suite Rooms
    prisma.room.create({
      data: {
        name: 'Executive Suite',
        type: 'SUITE',
        description:
          'Luxurious suite with separate living area, perfect for extended stays.',
        price: 299.99,
        capacity: 3,
        amenities: [
          'WiFi',
          'TV',
          'Air Conditioning',
          'Mini Bar',
          'Safe',
          'Living Room',
          'Kitchenette',
          'Balcony',
        ],
        images: ['/images/rooms/suite-1.jpg'],
        status: 'AVAILABLE',
        floor: 4,
        roomNumber: '401',
      },
    }),
    prisma.room.create({
      data: {
        name: 'Family Suite',
        type: 'SUITE',
        description:
          'Spacious suite ideal for families with two bedrooms and living area.',
        price: 349.99,
        capacity: 4,
        amenities: [
          'WiFi',
          'TV',
          'Air Conditioning',
          'Mini Bar',
          'Safe',
          'Living Room',
          'Kitchenette',
          '2 Bathrooms',
        ],
        images: ['/images/rooms/suite-2.jpg'],
        status: 'AVAILABLE',
        floor: 4,
        roomNumber: '402',
      },
    }),

    // Deluxe Rooms
    prisma.room.create({
      data: {
        name: 'Deluxe Ocean View',
        type: 'DELUXE',
        description:
          'Premium room with stunning ocean views and luxury furnishings.',
        price: 399.99,
        capacity: 2,
        amenities: [
          'WiFi',
          'TV',
          'Air Conditioning',
          'Mini Bar',
          'Safe',
          'Ocean View',
          'Jacuzzi',
          'Premium Bedding',
        ],
        images: ['/images/rooms/deluxe-1.jpg'],
        status: 'MAINTENANCE',
        floor: 5,
        roomNumber: '501',
      },
    }),
    prisma.room.create({
      data: {
        name: 'Deluxe Penthouse',
        type: 'DELUXE',
        description:
          'Top-floor deluxe room with panoramic views and exclusive amenities.',
        price: 449.99,
        capacity: 2,
        amenities: [
          'WiFi',
          'TV',
          'Air Conditioning',
          'Mini Bar',
          'Safe',
          'Panoramic View',
          'Jacuzzi',
          'Premium Bedding',
          'Terrace',
        ],
        images: ['/images/rooms/deluxe-2.jpg'],
        status: 'AVAILABLE',
        floor: 6,
        roomNumber: '601',
      },
    }),

    // Presidential Suite
    prisma.room.create({
      data: {
        name: 'Presidential Suite',
        type: 'PRESIDENTIAL',
        description:
          'The ultimate luxury experience with multiple rooms, private terrace, and VIP services.',
        price: 999.99,
        capacity: 6,
        amenities: [
          'WiFi',
          'TV',
          'Air Conditioning',
          'Full Bar',
          'Safe',
          'Living Room',
          'Dining Room',
          'Full Kitchen',
          'Master Bedroom',
          '2 Guest Bedrooms',
          'Private Terrace',
          'Jacuzzi',
          'Butler Service',
        ],
        images: ['/images/rooms/presidential-1.jpg'],
        status: 'AVAILABLE',
        floor: 6,
        roomNumber: '602',
      },
    }),

    // Additional rooms for variety
    prisma.room.create({
      data: {
        name: 'Budget Single',
        type: 'SINGLE',
        description: 'Affordable single room with essential amenities.',
        price: 69.99,
        capacity: 1,
        amenities: ['WiFi', 'TV', 'Air Conditioning'],
        images: ['/images/rooms/single-3.jpg'],
        status: 'AVAILABLE',
        floor: 1,
        roomNumber: '102',
      },
    }),
    prisma.room.create({
      data: {
        name: 'Standard Double',
        type: 'DOUBLE',
        description: 'Comfortable double room with all standard amenities.',
        price: 129.99,
        capacity: 2,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Fridge'],
        images: ['/images/rooms/double-3.jpg'],
        status: 'OCCUPIED',
        floor: 3,
        roomNumber: '302',
      },
    }),
    prisma.room.create({
      data: {
        name: 'Business Suite',
        type: 'SUITE',
        description: 'Suite designed for business travelers with office space.',
        price: 279.99,
        capacity: 2,
        amenities: [
          'WiFi',
          'TV',
          'Air Conditioning',
          'Office Desk',
          'Meeting Area',
          'Printer',
          'Safe',
        ],
        images: ['/images/rooms/suite-3.jpg'],
        status: 'AVAILABLE',
        floor: 5,
        roomNumber: '502',
      },
    }),
  ]);

  console.log(`✅ Created ${rooms.length} rooms`);

  // Create Customers
  console.log('👤 Creating customers...');
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        firstName: 'Emma',
        lastName: 'Thompson',
        email: 'emma.thompson@email.com',
        phone: '+1555123456',
        address: '123 Main Street',
        city: 'New York',
        country: 'USA',
      },
    }),
    prisma.customer.create({
      data: {
        firstName: 'David',
        lastName: 'Chen',
        email: 'david.chen@email.com',
        phone: '+1555234567',
        address: '456 Oak Avenue',
        city: 'Los Angeles',
        country: 'USA',
      },
    }),
    prisma.customer.create({
      data: {
        firstName: 'Sophie',
        lastName: 'Martin',
        email: 'sophie.martin@email.com',
        phone: '+33612345678',
        address: '789 Rue de Paris',
        city: 'Paris',
        country: 'France',
      },
    }),
    prisma.customer.create({
      data: {
        firstName: 'James',
        lastName: 'Anderson',
        email: 'james.anderson@email.com',
        phone: '+44207123456',
        address: '321 Baker Street',
        city: 'London',
        country: 'UK',
      },
    }),
    prisma.customer.create({
      data: {
        firstName: 'Maria',
        lastName: 'Rodriguez',
        email: 'maria.rodriguez@email.com',
        phone: '+34912345678',
        address: '654 Gran Via',
        city: 'Madrid',
        country: 'Spain',
      },
    }),
    prisma.customer.create({
      data: {
        firstName: 'Yuki',
        lastName: 'Tanaka',
        email: 'yuki.tanaka@email.com',
        phone: '+81312345678',
        address: '987 Shibuya',
        city: 'Tokyo',
        country: 'Japan',
      },
    }),
    prisma.customer.create({
      data: {
        firstName: 'Oliver',
        lastName: 'Schmidt',
        email: 'oliver.schmidt@email.com',
        phone: '+49301234567',
        address: '147 Unter den Linden',
        city: 'Berlin',
        country: 'Germany',
      },
    }),
    prisma.customer.create({
      data: {
        firstName: 'Isabella',
        lastName: 'Silva',
        email: 'isabella.silva@email.com',
        phone: '+5511987654321',
        address: '258 Avenida Paulista',
        city: 'São Paulo',
        country: 'Brazil',
      },
    }),
  ]);

  console.log(`✅ Created ${customers.length} customers`);

  // Create Bookings with various statuses
  console.log('📅 Creating bookings...');

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  // Booking 1: Currently checked in (occupied room)
  const booking1 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK-2024-001',
      roomId: rooms[2].id, // Deluxe Double Room (OCCUPIED)
      customerId: customers[0].id,
      checkInDate: yesterday,
      checkOutDate: tomorrow,
      numberOfGuests: 2,
      totalAmount: 299.98,
      paymentStatus: 'PAID',
      bookingStatus: 'CHECKED_IN',
      specialRequests: 'Late checkout if possible',
      source: 'ONLINE',
      createdById: receptionist1.id,
    },
  });

  // Booking 2: Currently checked in (another occupied room)
  const booking2 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK-2024-002',
      roomId: rooms[10].id, // Standard Double (OCCUPIED)
      customerId: customers[1].id,
      checkInDate: yesterday,
      checkOutDate: nextWeek,
      numberOfGuests: 2,
      totalAmount: 909.93,
      paymentStatus: 'PAID',
      bookingStatus: 'CHECKED_IN',
      specialRequests: 'Extra pillows please',
      source: 'PHONE',
      createdById: receptionist2.id,
    },
  });

  // Booking 3: Upcoming confirmed booking
  const booking3 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK-2024-003',
      roomId: rooms[4].id, // Executive Suite
      customerId: customers[2].id,
      checkInDate: tomorrow,
      checkOutDate: nextWeek,
      numberOfGuests: 2,
      totalAmount: 1799.94,
      paymentStatus: 'PAID',
      bookingStatus: 'CONFIRMED',
      specialRequests: 'Honeymoon package',
      source: 'ONLINE',
      createdById: receptionist1.id,
    },
  });

  // Booking 4: Upcoming confirmed booking with pending payment
  const booking4 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK-2024-004',
      roomId: rooms[7].id, // Deluxe Penthouse
      customerId: customers[3].id,
      checkInDate: nextWeek,
      checkOutDate: new Date(nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000),
      numberOfGuests: 2,
      totalAmount: 1349.97,
      paymentStatus: 'PENDING',
      bookingStatus: 'CONFIRMED',
      specialRequests: 'Airport pickup required',
      source: 'MANUAL',
      createdById: manager.id,
    },
  });

  // Booking 5: Checked out (past booking)
  const booking5 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK-2024-005',
      roomId: rooms[1].id, // Modern Single Room
      customerId: customers[4].id,
      checkInDate: lastWeek,
      checkOutDate: new Date(lastWeek.getTime() + 3 * 24 * 60 * 60 * 1000),
      numberOfGuests: 1,
      totalAmount: 299.97,
      paymentStatus: 'PAID',
      bookingStatus: 'CHECKED_OUT',
      specialRequests: null,
      source: 'ONLINE',
      createdById: receptionist1.id,
    },
  });

  // Booking 6: Cancelled booking
  const booking6 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK-2024-006',
      roomId: rooms[5].id, // Family Suite
      customerId: customers[5].id,
      checkInDate: tomorrow,
      checkOutDate: new Date(tomorrow.getTime() + 5 * 24 * 60 * 60 * 1000),
      numberOfGuests: 4,
      totalAmount: 1749.95,
      paymentStatus: 'REFUNDED',
      bookingStatus: 'CANCELLED',
      specialRequests: 'Family vacation',
      source: 'ONLINE',
      createdById: receptionist2.id,
    },
  });

  // Booking 7: Past checked out booking
  const booking7 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK-2024-007',
      roomId: rooms[3].id, // Premium Double Room
      customerId: customers[6].id,
      checkInDate: lastMonth,
      checkOutDate: new Date(lastMonth.getTime() + 7 * 24 * 60 * 60 * 1000),
      numberOfGuests: 2,
      totalAmount: 1189.93,
      paymentStatus: 'PAID',
      bookingStatus: 'CHECKED_OUT',
      specialRequests: 'Business trip',
      source: 'WALKIN',
      createdById: receptionist1.id,
    },
  });

  // Booking 8: Future booking for presidential suite
  const booking8 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK-2024-008',
      roomId: rooms[8].id, // Presidential Suite
      customerId: customers[7].id,
      checkInDate: new Date(nextWeek.getTime() + 7 * 24 * 60 * 60 * 1000),
      checkOutDate: new Date(nextWeek.getTime() + 10 * 24 * 60 * 60 * 1000),
      numberOfGuests: 4,
      totalAmount: 2999.97,
      paymentStatus: 'PAID',
      bookingStatus: 'CONFIRMED',
      specialRequests: 'VIP guest - anniversary celebration',
      source: 'PHONE',
      createdById: manager.id,
    },
  });

  console.log('✅ Created 8 bookings with various statuses');

  // Create Payments for bookings
  console.log('💳 Creating payments...');
  await Promise.all([
    prisma.payment.create({
      data: {
        bookingId: booking1.id,
        amount: 299.98,
        paymentMethod: 'PAYSTACK',
        paymentStatus: 'PAID',
        transactionId: 'TXN-001-2024',
        paystackRef: 'PSK-REF-001',
        paidAt: yesterday,
      },
    }),
    prisma.payment.create({
      data: {
        bookingId: booking2.id,
        amount: 909.93,
        paymentMethod: 'CARD',
        paymentStatus: 'PAID',
        transactionId: 'TXN-002-2024',
        paidAt: yesterday,
      },
    }),
    prisma.payment.create({
      data: {
        bookingId: booking3.id,
        amount: 1799.94,
        paymentMethod: 'PAYSTACK',
        paymentStatus: 'PAID',
        transactionId: 'TXN-003-2024',
        paystackRef: 'PSK-REF-003',
        paidAt: new Date(),
      },
    }),
    prisma.payment.create({
      data: {
        bookingId: booking5.id,
        amount: 299.97,
        paymentMethod: 'PAYSTACK',
        paymentStatus: 'PAID',
        transactionId: 'TXN-005-2024',
        paystackRef: 'PSK-REF-005',
        paidAt: lastWeek,
      },
    }),
    prisma.payment.create({
      data: {
        bookingId: booking6.id,
        amount: 1749.95,
        paymentMethod: 'PAYSTACK',
        paymentStatus: 'REFUNDED',
        transactionId: 'TXN-006-2024',
        paystackRef: 'PSK-REF-006',
        paidAt: new Date(tomorrow.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.payment.create({
      data: {
        bookingId: booking7.id,
        amount: 1189.93,
        paymentMethod: 'CASH',
        paymentStatus: 'PAID',
        transactionId: 'TXN-007-2024',
        paidAt: lastMonth,
      },
    }),
    prisma.payment.create({
      data: {
        bookingId: booking8.id,
        amount: 2999.97,
        paymentMethod: 'BANK_TRANSFER',
        paymentStatus: 'PAID',
        transactionId: 'TXN-008-2024',
        paidAt: new Date(),
      },
    }),
  ]);

  console.log('✅ Created 7 payment records');

  // Create Activity Logs
  console.log('📝 Creating activity logs...');
  await Promise.all([
    prisma.activityLog.create({
      data: {
        entityType: 'BOOKING',
        entityId: booking1.id,
        action: 'CHECK_IN',
        userId: receptionist1.id,
        details: { bookingNumber: 'BK-2024-001', roomNumber: '202' },
        ipAddress: '192.168.1.100',
        createdAt: yesterday,
      },
    }),
    prisma.activityLog.create({
      data: {
        entityType: 'BOOKING',
        entityId: booking2.id,
        action: 'CHECK_IN',
        userId: receptionist2.id,
        details: { bookingNumber: 'BK-2024-002', roomNumber: '302' },
        ipAddress: '192.168.1.101',
        createdAt: yesterday,
      },
    }),
    prisma.activityLog.create({
      data: {
        entityType: 'BOOKING',
        entityId: booking3.id,
        action: 'CREATE',
        userId: receptionist1.id,
        details: { bookingNumber: 'BK-2024-003', source: 'ONLINE' },
        ipAddress: '192.168.1.100',
      },
    }),
    prisma.activityLog.create({
      data: {
        entityType: 'BOOKING',
        entityId: booking5.id,
        action: 'CHECK_OUT',
        userId: receptionist1.id,
        details: { bookingNumber: 'BK-2024-005', roomNumber: '201' },
        ipAddress: '192.168.1.100',
        createdAt: new Date(lastWeek.getTime() + 3 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.activityLog.create({
      data: {
        entityType: 'ROOM',
        entityId: rooms[6].id,
        action: 'UPDATE',
        userId: manager.id,
        details: { roomNumber: '501', status: 'MAINTENANCE' },
        ipAddress: '192.168.1.50',
      },
    }),
    prisma.activityLog.create({
      data: {
        entityType: 'STAFF',
        entityId: cleaner2.id,
        action: 'CREATE',
        userId: manager.id,
        details: { staffName: 'James Wilson', role: 'CLEANER' },
        ipAddress: '192.168.1.50',
        createdAt: new Date('2022-02-15'),
      },
    }),
  ]);

  console.log('✅ Created 6 activity log entries');

  // Create Reviews
  console.log('⭐ Creating reviews...');
  await Promise.all([
    prisma.review.create({
      data: {
        customerId: customers[0].id,
        bookingId: booking5.id,
        rating: 5,
        comment:
          'Absolutely wonderful experience! The staff was incredibly friendly and the room was spotless. Will definitely be returning on my next business trip.',
        isApproved: true,
        createdAt: new Date(lastWeek.getTime() + 4 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.review.create({
      data: {
        customerId: customers[1].id,
        bookingId: booking1.id,
        rating: 5,
        comment:
          'The perfect getaway! Beautiful location, amazing amenities, and exceptional service. My family had an unforgettable vacation here.',
        isApproved: true,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.review.create({
      data: {
        customerId: customers[2].id,
        rating: 5,
        comment:
          'Our honeymoon was magical thanks to this hotel. The romantic atmosphere and attention to detail made our stay truly special.',
        isApproved: true,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.review.create({
      data: {
        customerId: customers[3].id,
        rating: 4,
        comment:
          'Great hotel with excellent service. The room was clean and comfortable. Only minor issue was the Wi-Fi speed, but overall a fantastic stay!',
        isApproved: true,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.review.create({
      data: {
        customerId: customers[5].id,
        rating: 5,
        comment:
          'Exceeded all expectations! The presidential suite was luxurious, the spa was incredible, and the restaurant served amazing food. Highly recommend!',
        isApproved: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  console.log('✅ Created 5 approved reviews');

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Staff: 5 (1 Manager, 2 Receptionists, 2 Cleaners)`);
  console.log(`   - Rooms: ${rooms.length} (various types and statuses)`);
  console.log(`   - Customers: ${customers.length}`);
  console.log(`   - Bookings: 8 (various statuses)`);
  console.log(`   - Payments: 7`);
  console.log(`   - Activity Logs: 6`);
  console.log(`   - Reviews: 5 (all approved)`);
  console.log('\n🔑 Admin Login Credentials:');
  console.log('   Email: admin@hotel.com');
  console.log('   Password: password123');
  console.log('\n💡 All staff accounts use the same password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
