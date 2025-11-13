'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// Types
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface CreateCustomerResponse {
  success: boolean;
  customer?: Customer;
  error?: string;
}

// API Functions
const customerApi = {
  create: async (
    data: CreateCustomerInput
  ): Promise<CreateCustomerResponse> => {
    return apiClient.post<CreateCustomerResponse>('/api/customers', data);
  },

  getById: async (id: string): Promise<Customer> => {
    return apiClient.get<Customer>(`/api/customers/${id}`);
  },

  getByEmail: async (email: string): Promise<Customer> => {
    return apiClient.get<Customer>(`/api/customers/email/${email}`);
  },
};

// React Query Hooks

/**
 * Hook to create a new customer
 */
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customerApi.create,
    onSuccess: (data) => {
      // Invalidate and refetch customer queries
      queryClient.invalidateQueries({ queryKey: ['customers'] });

      // Optionally set the customer data in cache
      if (data.customer) {
        queryClient.setQueryData(['customer', data.customer.id], data.customer);
      }
    },
  });
}

/**
 * Hook to get customer by ID
 */
export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerApi.getById(id!),
    enabled: !!id,
  });
}

/**
 * Hook to get customer by email
 */
export function useCustomerByEmail(email: string | undefined) {
  return useQuery({
    queryKey: ['customer', 'email', email],
    queryFn: () => customerApi.getByEmail(email!),
    enabled: !!email,
  });
}
