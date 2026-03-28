import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo } from 'react';

// Database Types
export interface DatabaseUser {
  id: number;
  email: string;
  password: string;
  nome: string;
  cognome?: string;
  role: 'admin' | 'trainer' | 'cliente';
  created_at: string;
  last_login?: string;
  is_online: boolean;
  is_active: boolean;
  profile_pic?: string;
  stripe_customer_id?: string;
  notification_token?: string;
  preferred_language: string;
  dark_mode: boolean;
}

export interface Programma {
  id: number;
  trainer_id: number;
  cliente_id: number;
  nome: string;
  descrizione?: string;
  data_inizio?: string;
  data_fine?: string;
  is_template: boolean;
  created_at: string;
  updated_at: string;
}

export interface Esercizio {
  id: number;
  nome: string;
  categoria?: string;
  muscoli_target: string[];
  youtube_video_id?: string;
  video_url?: string;
  immagine_url?: string;
  istruzioni?: string;
  is_custom: boolean;
  created_by?: number;
}

interface DatabaseState {
  // Connection status
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Data
  users: DatabaseUser[];
  programmi: Programma[];
  esercizi: Esercizio[];
  
  // Methods
  connect: () => Promise<void>;
  disconnect: () => void;
  
  // User operations
  createUser: (userData: Partial<DatabaseUser>) => Promise<DatabaseUser>;
  updateUser: (id: number, userData: Partial<DatabaseUser>) => Promise<DatabaseUser>;
  deleteUser: (id: number) => Promise<void>;
  getUsersByRole: (role: string) => DatabaseUser[];
}

export const [DatabaseProvider, useDatabase] = createContextHook<DatabaseState>(() => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Mock data - in produzione questi verranno dal database PostgreSQL
  const [users, setUsers] = useState<DatabaseUser[]>([
    {
      id: 1,
      email: 'admin@simopagnocoaching.it',
      password: '$2b$10$hashedpassword',
      nome: 'Admin',
      role: 'admin',
      created_at: '2024-01-01T00:00:00Z',
      is_online: false,
      is_active: true,
      preferred_language: 'it',
      dark_mode: false
    },
    {
      id: 2,
      email: 'trainer@test.com',
      password: '$2b$10$hashedpassword',
      nome: 'Simone',
      cognome: 'Pagno',
      role: 'trainer',
      created_at: '2024-01-01T00:00:00Z',
      is_online: true,
      is_active: true,
      profile_pic: 'https://i.pravatar.cc/150?img=5',
      preferred_language: 'it',
      dark_mode: false
    },
    {
      id: 3,
      email: 'cliente@test.com',
      password: '$2b$10$hashedpassword',
      nome: 'Mario',
      cognome: 'Rossi',
      role: 'cliente',
      created_at: '2024-01-15T00:00:00Z',
      is_online: true,
      is_active: true,
      profile_pic: 'https://i.pravatar.cc/150?img=3',
      preferred_language: 'it',
      dark_mode: false
    }
  ]);
  
  const [programmi, setProgrammi] = useState<Programma[]>([]);
  const [esercizi, setEsercizi] = useState<Esercizio[]>([
    {
      id: 1,
      nome: 'Chest Press con Manubri',
      categoria: 'Petto',
      muscoli_target: ['Petto', 'Tricipiti'],
      youtube_video_id: 'Mqt7UKD5cwM',
      is_custom: false
    },
    {
      id: 2,
      nome: 'Rematore con Manubrio',
      categoria: 'Schiena',
      muscoli_target: ['Dorsali', 'Bicipiti'],
      youtube_video_id: 'hA5cIMNxdEU',
      is_custom: false
    }
  ]);

  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In produzione qui ci sara la connessione al database PostgreSQL
      // const response = await fetch(process.env.DATABASE_URL);
      // if (!response.ok) throw new Error('Database connection failed');
      
      // Mock connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsConnected(true);
      console.log('Database connected successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      console.error('Database connection error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    setError(null);
    console.log('Database disconnected');
  }, []);

  // User operations
  const createUser = useCallback(async (userData: Partial<DatabaseUser>): Promise<DatabaseUser> => {
    const newUser: DatabaseUser = {
      id: users.length + 1,
      email: userData.email || '',
      password: userData.password || '',
      nome: userData.nome || '',
      cognome: userData.cognome,
      role: userData.role || 'cliente',
      created_at: new Date().toISOString(),
      is_online: false,
      is_active: true,
      preferred_language: 'it',
      dark_mode: false,
      ...userData
    };
    
    setUsers(prev => [...prev, newUser]);
    return newUser;
  }, [users]);

  const updateUser = useCallback(async (id: number, userData: Partial<DatabaseUser>): Promise<DatabaseUser> => {
    const updatedUser = users.find(u => u.id === id);
    if (!updatedUser) throw new Error('User not found');
    
    const updated = { ...updatedUser, ...userData };
    setUsers(prev => prev.map(u => u.id === id ? updated : u));
    return updated;
  }, [users]);

  const deleteUser = useCallback(async (id: number): Promise<void> => {
    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  const getUsersByRole = useCallback((role: string) => {
    return users.filter(u => u.role === role);
  }, [users]);

  return useMemo(() => ({
    // Connection status
    isConnected,
    isLoading,
    error,
    
    // Data
    users,
    programmi,
    esercizi,
    
    // Methods
    connect,
    disconnect,
    
    // User operations
    createUser,
    updateUser,
    deleteUser,
    getUsersByRole
  }), [
    isConnected, isLoading, error,
    users, programmi, esercizi,
    connect, disconnect,
    createUser, updateUser, deleteUser, getUsersByRole
  ]);
});