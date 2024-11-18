import { auth } from '@/config/firebase';
import { AuthState } from '@/types/auth.types';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { create } from 'zustand';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      set({ user, isAuthenticated: true });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });
      await signOut(auth);
      set({ user: null, isAuthenticated: false });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  register: async (email: string, password: string, nickname: string) => {
    try {
      set({ loading: true, error: null });
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      if (user) {
        await updateProfile(user, {
          displayName: nickname
        });

        const updatedUser = auth.currentUser;
        set({
          user: updatedUser,
          isAuthenticated: true,
          error: null
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },

  resetError: () => set({ error: null })
}));

onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({
    user,
    isAuthenticated: !!user,
    loading: false
  });
});