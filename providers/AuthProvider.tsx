import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

export interface User {
  id: number;
  email: string;
  nome: string;
  cognome?: string;
  role: 'admin' | 'trainer' | 'cliente';
  profilePic?: string;
  isOnline: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export const [AuthProvider, useAuth] = createContextHook<AuthState>(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        navigateToRole(parsedUser.role);
      } else {
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error('Error loading user:', error);
      router.replace('/(auth)/login');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRole = (role: string) => {
    switch (role) {
      case 'cliente':
        router.replace('/(cliente)');
        break;
      case 'trainer':
        router.replace('/(trainer)');
        break;
      case 'admin':
        router.replace('/(admin)');
        break;
      default:
        router.replace('/(auth)/login');
    }
  };

  const login = async (email: string, password: string) => {
    // Mock authentication - in produzione useresti API
    const mockUsers: User[] = [
      {
        id: 1,
        email: 'cliente@test.com',
        nome: 'Mario',
        cognome: 'Rossi',
        role: 'cliente',
        isOnline: true,
        profilePic: 'https://i.pravatar.cc/150?img=3'
      },
      {
        id: 2,
        email: 'trainer@test.com',
        nome: 'Simone',
        cognome: 'Pagno',
        role: 'trainer',
        isOnline: true,
        profilePic: 'https://i.pravatar.cc/150?img=5'
      },
      {
        id: 3,
        email: 'admin@test.com',
        nome: 'Admin',
        role: 'admin',
        isOnline: true
      }
    ];

    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password') {
      setUser(foundUser);
      await AsyncStorage.setItem('user', JSON.stringify(foundUser));
      navigateToRole(foundUser.role);
    } else {
      throw new Error('Credenziali non valide');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
    router.replace('/(auth)/login');
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  };
});