'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export interface LoginCredentials {
  email: string;
  password: string;
  callbackUrl?: string;
}

export interface LoginResponse {
  success: boolean;
  error?: string;
}

/**
 * Hook for authentication operations
 */
export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async (
      credentials: LoginCredentials
    ): Promise<LoginResponse> => {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        return { success: false, error: result.error };
      }

      return { success: true };
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await signOut({ redirect: false });
    },
    onSuccess: () => {
      router.push('/auth/login');
    },
  });

  return {
    // Session data
    session,
    user: session?.user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',

    // Login
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    // Logout
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
