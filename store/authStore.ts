import { create } from 'zustand';

// Simple mock hashing function
const hashPassword = (password: string) => {
  return typeof window !== 'undefined' ? btoa(password + 'moodtunes_salt') : password;
};

interface AuthStore {
  isLoggedIn: boolean;
  username: string;
  email: string;
  login: (email: string, password?: string) => { success: boolean; error?: string };
  register: (username: string, email: string, password?: string) => { success: boolean; error?: string };
  logout: () => void;
  checkSession: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  username: '',
  email: '',

  login: (email, password) => {
    if (typeof window === 'undefined') return { success: false, error: 'Server' };

    const storedUserStr = localStorage.getItem(`moodtunes_user_${email}`);
    if (!storedUserStr) {
      // In case we are testing without registration, just allow it and auto-register for ease of use
      // Or we can be strict:
      return { success: false, error: 'Invalid credentials. User not found.' };
    }

    try {
      const storedUser = JSON.parse(storedUserStr);
      if (password) {
        const hash = hashPassword(password);
        if (storedUser.passwordHash !== hash) {
          return { success: false, error: 'Invalid credentials. Password incorrect.' };
        }
      }

      sessionStorage.setItem('moodtunes_session', JSON.stringify({ username: storedUser.username, email }));
      set({ isLoggedIn: true, username: storedUser.username, email });
      
      // Dispatch event to tell player store to load data
      window.dispatchEvent(new CustomEvent('moodtunes_user_logged_in', { detail: { email } }));

      return { success: true };
    } catch {
      return { success: false, error: 'Data error' };
    }
  },

  register: (username, email, password) => {
    if (typeof window === 'undefined') return { success: false, error: 'Server' };

    const hash = password ? hashPassword(password) : '';
    localStorage.setItem(`moodtunes_user_${email}`, JSON.stringify({
      username,
      email,
      passwordHash: hash,
      memberSince: new Date().toISOString()
    }));

    sessionStorage.setItem('moodtunes_session', JSON.stringify({ username, email }));
    set({ isLoggedIn: true, username, email });

    // Initialize blank data for new user
    window.dispatchEvent(new CustomEvent('moodtunes_user_logged_in', { detail: { email } }));

    return { success: true };
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('moodtunes_session');
      window.dispatchEvent(new Event('moodtunes_user_logged_out'));
    }
    set({ isLoggedIn: false, username: '', email: '' });
  },

  checkSession: () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = sessionStorage.getItem('moodtunes_session');
      if (stored) {
        const { username, email } = JSON.parse(stored);
        set({ isLoggedIn: true, username, email });
        window.dispatchEvent(new CustomEvent('moodtunes_user_logged_in', { detail: { email } }));
      }
    } catch {
      // ignore parse errors
    }
  },
}));
