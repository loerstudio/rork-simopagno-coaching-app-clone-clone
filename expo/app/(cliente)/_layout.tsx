import { Tabs } from 'expo-router';
import { Home, Dumbbell, Apple, TrendingUp, MessageCircle } from 'lucide-react-native';
import { useTheme } from '@/providers/ThemeProvider';

export default function ClienteLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workout',
          tabBarIcon: ({ color, size }) => <Dumbbell size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="alimentazione"
        options={{
          title: 'Nutrizione',
          tabBarIcon: ({ color, size }) => <Apple size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="progressi"
        options={{
          title: 'Progressi',
          tabBarIcon: ({ color, size }) => <TrendingUp size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}