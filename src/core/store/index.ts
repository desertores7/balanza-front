import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'
import { clearTokenCache } from '../lib/apiClient'

interface User {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  activeUser: number;
  role: string;
  companyUuid: string;
  imgProfile?: {
    url: string;
  }; // Objeto que contiene la URL de la imagen del usuario
}

interface AuthState {
  // Estados
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  
  // Estado temporal para flujo de reset de contraseña
  resetEmail: string | null;
  codeResetPassword: string | null;
  // Acciones
  setAuth: (token: string, refreshToken: string, user: User, rememberMe?: boolean) => void;
  logout: () => void;
  setResetEmail: (email: string) => void;
  setCodeResetPassword: (code: string) => void;
  clearResetEmail: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Estados iniciales
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      rememberMe: false,
      resetEmail: null,
      codeResetPassword: null,
      error: null,

      // Acciones
      setAuth: (token: string, refreshToken: string, user: User, rememberMe = false) => {
        // ✅ Limpiar cache del apiClient para forzar actualización
        clearTokenCache();
        
        set({
          token,
          refreshToken,
          user,
          isAuthenticated: true,
          rememberMe,
        });

        // Si rememberMe es true, guardar en cookies con expiración de 30 días
        if (rememberMe) {
          const cookieOptions = { expires: 30, secure: true, sameSite: 'strict' as const };
          Cookies.set('token', token, cookieOptions);
          Cookies.set('refresh_token', refreshToken, cookieOptions);
          Cookies.set('user', JSON.stringify(user), cookieOptions);
        } else {
          // Si no quiere recordar, solo guardar en localStorage (sesión)
          localStorage.setItem('token', token);
          localStorage.setItem('refresh_token', refreshToken);
          localStorage.setItem('user', JSON.stringify(user));
        }
      },


      logout: () => {
        // ✅ Limpiar cache del apiClient
        clearTokenCache();
        
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          rememberMe: false,
          resetEmail: null,
        });

        // Limpiar cookies y localStorage
        Cookies.remove('token');
        Cookies.remove('refresh_token');
        Cookies.remove('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
      },

      // Guardar email para proceso de reset de contraseña
      setResetEmail: (email: string) => {
        set({ resetEmail: email });
      },

      // Guardar código para proceso de reset de contraseña
      setCodeResetPassword: (code: string) => {
        set({ codeResetPassword: code });
      },

      // Limpiar email después de completar el reset
      clearResetEmail: () => {
        set({ resetEmail: null });
      },

    }),
    {
      name: 'auth-storage', // nombre del localStorage
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        rememberMe: state.rememberMe,
        resetEmail: state.resetEmail, // Persistir email temporal
        codeResetPassword: state.codeResetPassword // Persistir código temporal
      })
    }
  )
);

// Selectores útiles
export const useAuth = () => {
  const store = useAuthStore();
  return {
    token: store.token,
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    rememberMe: store.rememberMe,
    resetEmail: store.resetEmail,
    codeResetPassword: store.codeResetPassword,
    setAuth: store.setAuth,
    logout: store.logout,
    setResetEmail: store.setResetEmail,
    setCodeResetPassword: store.setCodeResetPassword,
    clearResetEmail: store.clearResetEmail,
  };
};