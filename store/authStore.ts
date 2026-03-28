import { create } from 'zustand';

interface AuthStore {
  isLoggedIn: boolean;
  username: string;
  email: string;
  login: (username: string, email: string) => void;
  logout: () => void;
  checkSession: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  username: '',
  email: '',

  login: (username, email) => {
    sessionStorage.setItem('auth', JSON.stringify({ username, email }));
    set({ isLoggedIn: true, username, email });
  },

  logout: () => {
    sessionStorage.removeItem('auth');
    set({ isLoggedIn: false, username: '', email: '' });
  },

  checkSession: () => {
    try {
      const stored = sessionStorage.getItem('auth');
      if (stored) {
        const { username, email } = JSON.parse(stored);
        set({ isLoggedIn: true, username, email });
      }
    } catch {
      // ignore parse errors
    }
  },
}));
