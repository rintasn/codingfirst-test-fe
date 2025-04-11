// contexts/preferences-context.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserPreferences } from '@/lib/types';
import { api } from '@/lib/api';
import { useAuth } from './auth-context';

interface PreferencesContextType {
  preferences: UserPreferences | null;
  isLoading: boolean;
  updateTheme: (theme: 'light' | 'dark') => Promise<void>;
  updateLanguage: (language: 'english' | 'spanish' | 'indonesia') => Promise<void>;
  updateNotifications: (enabled: boolean) => Promise<void>;
  refreshPreferences: () => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efek untuk mengambil preferensi saat pengguna terautentikasi
  useEffect(() => {
    if (isAuthenticated && user) {
      // Gunakan preferensi dari data pengguna jika tersedia
      if (user.preferences) {
        setPreferences(user.preferences);
        setIsLoading(false);
      } else {
        // Jika tidak, ambil dari API
        refreshPreferences();
      }
    } else {
      setPreferences(null);
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Efek untuk menerapkan tema
  useEffect(() => {
    if (preferences) {
      // Terapkan tema ke document.documentElement
      if (preferences.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [preferences?.theme]);

  const refreshPreferences = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const { preferences: fetchedPreferences } = await api.getPreferences();
      setPreferences(fetchedPreferences);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTheme = async (theme: 'light' | 'dark') => {
    if (!isAuthenticated || !preferences) return;
    
    try {
      const { preferences: updatedPreferences } = await api.updatePreferences({ theme });
      setPreferences(updatedPreferences);
    } catch (error) {
      console.error('Error updating theme:', error);
      throw error;
    }
  };

  const updateLanguage = async (language: 'english' | 'spanish' | 'indonesia') => {
    if (!isAuthenticated || !preferences) return;
    
    try {
      const { preferences: updatedPreferences } = await api.updatePreferences({ language });
      setPreferences(updatedPreferences);
    } catch (error) {
      console.error('Error updating language:', error);
      throw error;
    }
  };

  const updateNotifications = async (notifications: boolean) => {
    if (!isAuthenticated || !preferences) return;
    
    try {
      const { preferences: updatedPreferences } = await api.updatePreferences({ notifications });
      setPreferences(updatedPreferences);
    } catch (error) {
      console.error('Error updating notifications:', error);
      throw error;
    }
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        isLoading,
        updateTheme,
        updateLanguage,
        updateNotifications,
        refreshPreferences
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};