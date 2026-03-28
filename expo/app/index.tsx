import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';

export default function IndexScreen() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace('/(auth)/login');
      } else {
        switch (user.role) {
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
      }
    }
  }, [user, isLoading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#FF0000" />
    </View>
  );
}