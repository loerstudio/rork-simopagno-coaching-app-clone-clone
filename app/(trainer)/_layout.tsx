import { Tabs } from 'expo-router';
import { LayoutDashboard, Users, Dumbbell, MessageCircle, Calendar } from 'lucide-react-native';
import { useTheme } from '@/providers/ThemeProvider';

export default function TrainerLayout() {
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
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="clienti"
        options={{
          title: 'Clienti',
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="programmi"
        options={{
          title: 'Programmi',
          tabBarIcon: ({ color, size }) => <Dumbbell size={size} color={color} />,
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
      <Tabs.Screen
        name="calendario"
        options={{
          title: 'Calendario',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}