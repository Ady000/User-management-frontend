import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import { AuthState, LoginData, SignupData, UpdateProfileData, User } from '@/types';

interface AuthContextType extends AuthState {
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });
  
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get('token');
      
      if (token) {
        try {
          const response = await api.get('/user/profile');
          setAuthState({
            user: response.data,
            token,
            isLoading: false,
            isAuthenticated: true,
          });
        } catch (error) {
          Cookies.remove('token');
          setAuthState({
            user: null,
            token: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } else {
        setAuthState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    initAuth();
  }, []);

  const login = async (data: LoginData) => {
    try {
      const response = await api.post('/auth/login', data);
      const { access_token, user } = response.data;
      
      Cookies.set('token', access_token, { expires: 1 }); // 1 day
      
      setAuthState({
        user,
        token: access_token,
        isLoading: false,
        isAuthenticated: true,
      });
      
      router.push('/edit-profile');
    } catch (error) {
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    try {
      await api.post('/auth/signup', data);
      router.push('/login');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      Cookies.remove('token');
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
      router.push('/login');
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      const response = await api.put('/user/profile', data);
      setAuthState((prev) => ({
        ...prev,
        user: response.data,
      }));
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};