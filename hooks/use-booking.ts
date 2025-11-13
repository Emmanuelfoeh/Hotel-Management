'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// Types
export interface CreateBookingInput {
  roomId: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalAmount: number;
  specialRequests?: string;
}

export interface BookingResponse {
  success: boolean;
  booking?: {
    id: string;
    bookingNumber: string;
  };
  payment?: {
    authorizationUrl: string;
    reference: string;
  };
  error?: string;
}

export interface BookingLookupInput {
  bookingNumber: string;
  email: string;
}

export interface BookingLookupResponse {
  success: boolean;
  booking?: any; // Full booking with room, customer, and payments
  error?: string;
}

// API Functions
const bookingApi = {
  create: async (data: CreateBookingInput): Promise<BookingResponse> => {
    return apiClient.post<BookingResponse>('/api/bookings/public', data);
  },

  lookup: async (data: BookingLookupInput): Promise<BookingLookupResponse> => {
    return apiClient.post<BookingLookupResponse>('/api/bookings/lookup', data);
  },

  getByReference: async (reference: string) => {
    return apiClient.get(`/api/bookings/reference/${reference}`);
  },

  resendConfirmation: async (bookingNumber: string) => {
    return apiClient.post('/api/bookings/resend-confirmation', {
      bookingNumber,
    });
  },
};

/**
 * Hook to create a public booking
 */
export function useCreateBooking() {
  return useMutation({
    mutationFn: bookingApi.create,
  });
}

/**
 * Hook to lookup booking by number and email
 */
export function useBookingLookup() {
  return useMutation({
    mutationFn: bookingApi.lookup,
  });
}

/**
 * Hook to get booking by payment reference
 */
export function useBookingByReference(reference: string | null) {
  return useQuery({
    queryKey: ['booking', 'reference', reference],
    queryFn: () => bookingApi.getByReference(reference!),
    enabled: !!reference,
  });
}

/**
 * Hook to resend booking confirmation
 */
export function useResendConfirmation() {
  return useMutation({
    mutationFn: bookingApi.resendConfirmation,
  });
}
