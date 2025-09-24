import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppwriteUser {
  $id: string;
  name: string;
  email: string;
  $createdAt: string;
  $updatedAt: string;
}

interface AuthState {
  user: AppwriteUser | null;
  isAuthenticated: boolean;
  token?: string | null;
  setAuth: (user: AppwriteUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      setAuth: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false, token: null }),
    }),
    {
      name: 'feed2dev-auth',
    }
  )
);