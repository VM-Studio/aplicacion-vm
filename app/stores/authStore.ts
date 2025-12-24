import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { signIn, signOut, getSession } from '@/app/actions/auth';

export interface User {
  id: string;
  username: string;
  email?: string;
  nombre_completo?: string;
  rol: 'admin' | 'cliente';
  cliente_id?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        error: null 
      }),

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await signIn(email, password);
          
          if (result.success && result.user) {
            set({ 
              user: result.user, 
              isAuthenticated: true, 
              isLoading: false 
            });
            return true;
          }
          
          set({ 
            error: result.error || 'Error al iniciar sesión', 
            isLoading: false 
          });
          return false;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Error al iniciar sesión", 
            isLoading: false 
          });
          return false;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await signOut();
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Error al cerrar sesión",
            isLoading: false
          });
        }
      },

      checkSession: async () => {
        set({ isLoading: true });
        try {
          const result = await getSession();
          
          if (result.success && result.user) {
            set({ 
              user: result.user, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } else {
            set({ 
              user: null, 
              isAuthenticated: false, 
              isLoading: false 
            });
          }
        } catch {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
