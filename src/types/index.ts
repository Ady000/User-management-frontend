export interface User {
    _id: string;
    username: string;
    email: string;
    name: string;
    birthDate: string;
    gender: 'male' | 'female' | 'other';
    description?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
  }
  
  export interface SignupData {
    username: string;
    email: string;
    password: string;
    name: string;
    birthDate: string;
    gender: 'male' | 'female' | 'other';
    description?: string;
  }
  
  export interface LoginData {
    username: string;
    password: string;
  }
  
  export interface UpdateProfileData {
    username?: string;
    email?: string;
    name?: string;
    birthDate?: string;
    gender?: 'male' | 'female' | 'other';
    description?: string;
  }