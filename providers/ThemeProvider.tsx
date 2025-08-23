import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

interface Theme {
  isDark: boolean;
  colors: {
    primary: string;
    primaryDark: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    white: string;
    black: string;
  };
}

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

export const [ThemeProvider, useTheme] = createContextHook<ThemeState>(() => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      } else {
        setIsDark(systemColorScheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const lightColors = {
    primary: '#FF0000',
    primaryDark: '#CC0000',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E0E0E0',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    white: '#FFFFFF',
    black: '#000000'
  };

  const darkColors = {
    primary: '#FF3333',
    primaryDark: '#CC0000',
    background: '#000000',
    surface: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#999999',
    border: '#333333',
    success: '#66BB6A',
    warning: '#FFA726',
    error: '#EF5350',
    white: '#FFFFFF',
    black: '#000000'
  };

  const theme: Theme = {
    isDark,
    colors: isDark ? darkColors : lightColors
  };

  return {
    theme,
    toggleTheme,
    isDark
  };
});