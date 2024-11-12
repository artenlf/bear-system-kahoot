import { User } from 'firebase/auth';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, nickname: string) => Promise<void>;
  resetError: () => void;
}