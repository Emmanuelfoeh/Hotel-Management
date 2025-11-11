import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

export interface CreateCustomerInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface UpdateCustomerInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface CustomerSearchFilters {
  query?: string;
}

export class CustomerService {
  /**
   * Create a new customer
   */
  async createCustomer(data: CreateCustomerInput) {
    // Check if customer with email already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: data.email },
    });

    if (existingCustomer) {
      throw new Error('Customer with this email already exists');
    }

    return await prisma.customer.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country,
      },
    });
  }

  /**
   * Get customer by ID
   */
  async getCustomerById(id: string) {
    return await prisma.customer.findUnique({
      where: { id },
      include: {
        bookings: {
          include: {
            room: true,
            payments: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  /**
   * Get customer by email
   */
  async getCustomerByEmail(email: string) {
    return await prisma.customer.findUnique({
      where: { email },
      include: {
        bookings: {
          include: {
            room: true,
            payments: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  /**
   * Get all customers with optional search
   */
  async getCustomers(filters?: CustomerSearchFilters) {
    const where: Prisma.CustomerWhereInput = {};

    if (filters?.query) {
      where.OR = [
        { firstName: { contains: filters.query, mode: 'insensitive' } },
        { lastName: { contains: filters.query, mode: 'insensitive' } },
        { email: { contains: filters.query, mode: 'insensitive' } },
        { phone: { contains: filters.query, mode: 'insensitive' } },
      ];
    }

    return await prisma.customer.findMany({
      where,
      include: {
        bookings: {
          select: {
            id: true,
            bookingNumber: true,
            bookingStatus: true,
            checkInDate: true,
            checkOutDate: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Update customer
   */
  async updateCustomer(id: string, data: UpdateCustomerInput) {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    // If updating email, check if new email is already in use
    if (data.email && data.email !== customer.email) {
      const existingCustomer = await prisma.customer.findUnique({
        where: { email: data.email },
      });

      if (existingCustomer) {
        throw new Error('Email is already in use by another customer');
      }
    }

    const updateData: Prisma.CustomerUpdateInput = {};

    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.country !== undefined) updateData.country = data.country;

    return await prisma.customer.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Delete customer
   */
  async deleteCustomer(id: string) {
    // Check if customer has any bookings
    const bookingsCount = await prisma.booking.count({
      where: { customerId: id },
    });

    if (bookingsCount > 0) {
      throw new Error('Cannot delete customer with existing bookings');
    }

    return await prisma.customer.delete({
      where: { id },
    });
  }

  /**
   * Get customer booking history
   */
  async getCustomerBookingHistory(customerId: string) {
    return await prisma.booking.findMany({
      where: { customerId },
      include: {
        room: true,
        payments: true,
      },
      orderBy: {
        checkInDate: 'desc',
      },
    });
  }

  /**
   * Search customers by name, email, or phone
   */
  async searchCustomers(query: string) {
    return await prisma.customer.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get customer statistics
   */
  async getCustomerStats(customerId: string) {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        bookings: {
          include: {
            payments: true,
          },
        },
      },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    const totalBookings = customer.bookings.length;
    const completedBookings = customer.bookings.filter(
      (b) => b.bookingStatus === 'CHECKED_OUT'
    ).length;
    const cancelledBookings = customer.bookings.filter(
      (b) => b.bookingStatus === 'CANCELLED'
    ).length;
    const totalSpent = customer.bookings
      .filter((b) => b.paymentStatus === 'PAID')
      .reduce((sum, b) => sum + Number(b.totalAmount), 0);

    return {
      totalBookings,
      completedBookings,
      cancelledBookings,
      totalSpent,
    };
  }
}

export const customerService = new CustomerService();
