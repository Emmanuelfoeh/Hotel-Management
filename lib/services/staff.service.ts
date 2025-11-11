import { prisma } from '@/lib/db';
import { StaffRole } from '@/types';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

export interface CreateStaffInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole;
  password: string;
  hireDate?: Date;
  notes?: string;
  isActive?: boolean;
}

export interface UpdateStaffInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: StaffRole;
  password?: string;
  hireDate?: Date;
  notes?: string;
  isActive?: boolean;
}

export interface StaffSearchFilters {
  query?: string;
  role?: StaffRole;
  isActive?: boolean;
}

export class StaffService {
  /**
   * Hash password
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Create a new staff member
   */
  async createStaff(data: CreateStaffInput) {
    // Check if staff with email already exists
    const existingStaff = await prisma.staff.findUnique({
      where: { email: data.email },
    });

    if (existingStaff) {
      throw new Error('Staff member with this email already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(data.password);

    return await prisma.staff.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        password: hashedPassword,
        hireDate: data.hireDate,
        notes: data.notes,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        hireDate: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Get staff by ID
   */
  async getStaffById(id: string) {
    return await prisma.staff.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        hireDate: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        bookings: {
          select: {
            id: true,
            bookingNumber: true,
            bookingStatus: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });
  }

  /**
   * Get staff by email
   */
  async getStaffByEmail(email: string) {
    return await prisma.staff.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        hireDate: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Get staff by email with password (for authentication)
   */
  async getStaffByEmailWithPassword(email: string) {
    return await prisma.staff.findUnique({
      where: { email },
    });
  }

  /**
   * Get all staff with optional filters
   */
  async getStaff(filters?: StaffSearchFilters) {
    const where: Prisma.StaffWhereInput = {};

    if (filters?.query) {
      where.OR = [
        { firstName: { contains: filters.query, mode: 'insensitive' } },
        { lastName: { contains: filters.query, mode: 'insensitive' } },
        { email: { contains: filters.query, mode: 'insensitive' } },
        { phone: { contains: filters.query, mode: 'insensitive' } },
      ];
    }

    if (filters?.role) {
      where.role = filters.role;
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return await prisma.staff.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        hireDate: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Update staff member
   */
  async updateStaff(id: string, data: UpdateStaffInput) {
    const staff = await prisma.staff.findUnique({
      where: { id },
    });

    if (!staff) {
      throw new Error('Staff member not found');
    }

    // If updating email, check if new email is already in use
    if (data.email && data.email !== staff.email) {
      const existingStaff = await prisma.staff.findUnique({
        where: { email: data.email },
      });

      if (existingStaff) {
        throw new Error('Email is already in use by another staff member');
      }
    }

    const updateData: Prisma.StaffUpdateInput = {};

    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.hireDate !== undefined) updateData.hireDate = data.hireDate;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    // Hash new password if provided
    if (data.password) {
      updateData.password = await this.hashPassword(data.password);
    }

    return await prisma.staff.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        hireDate: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Delete staff member
   */
  async deleteStaff(id: string) {
    // Check if staff has created any bookings
    const bookingsCount = await prisma.booking.count({
      where: { createdById: id },
    });

    if (bookingsCount > 0) {
      throw new Error(
        'Cannot delete staff member who has created bookings. Consider deactivating instead.'
      );
    }

    // Check if staff has activity logs
    const activityLogsCount = await prisma.activityLog.count({
      where: { userId: id },
    });

    if (activityLogsCount > 0) {
      throw new Error(
        'Cannot delete staff member with activity logs. Consider deactivating instead.'
      );
    }

    return await prisma.staff.delete({
      where: { id },
    });
  }

  /**
   * Deactivate staff member
   */
  async deactivateStaff(id: string) {
    return await prisma.staff.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        hireDate: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Activate staff member
   */
  async activateStaff(id: string) {
    return await prisma.staff.update({
      where: { id },
      data: { isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        hireDate: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Verify staff credentials
   */
  async verifyCredentials(email: string, password: string) {
    const staff = await this.getStaffByEmailWithPassword(email);

    if (!staff) {
      return null;
    }

    if (!staff.isActive) {
      throw new Error('Staff account is inactive');
    }

    const isPasswordValid = await bcrypt.compare(password, staff.password);

    if (!isPasswordValid) {
      return null;
    }

    // Return staff without password
    const { password: _, ...staffWithoutPassword } = staff;
    return staffWithoutPassword;
  }

  /**
   * Change staff password
   */
  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string
  ) {
    const staff = await prisma.staff.findUnique({
      where: { id },
    });

    if (!staff) {
      throw new Error('Staff member not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      staff.password
    );

    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await this.hashPassword(newPassword);

    return await prisma.staff.update({
      where: { id },
      data: { password: hashedPassword },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        hireDate: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Get staff by role
   */
  async getStaffByRole(role: StaffRole) {
    return await prisma.staff.findMany({
      where: {
        role,
        isActive: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        hireDate: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        firstName: 'asc',
      },
    });
  }
}

export const staffService = new StaffService();
