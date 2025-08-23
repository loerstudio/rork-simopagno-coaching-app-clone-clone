import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Flame, 
  Scale, 
  Ruler, 
  Calendar, 
  Bell, 
  Moon, 
  Sun,
  ChevronRight,
  Activity,
  Droplets,
  Target,
  LogOut
} from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface WorkoutToday {
  id: number;
  nome: string;
  muscoli: string[];
  esercizi: number;
  durata: number;
  completato: boolean;
}

interface Stats {
  peso: number;
  obiettivoPeso: number;
  streak: number;
  passi: number;
  acqua: number;
  acquaTarget: number;
}

export default function ClienteHomeScreen() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [workoutToday, setWorkoutToday] = useState<WorkoutToday | null>(null);
  const [showDayPicker, setShowDayPicker] = useState<boolean>(false);
  const [stats, setStats] = useState<Stats>({
    peso: 75,
    obiettivoPeso: 70,
    streak: 7,
    passi: 8432,
    acqua: 1500,
    acquaTarget: 2500
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Mock data - in produzione caricheresti da API
    setWorkoutToday({
      id: 1,
      nome: 'Upper Body Power',
      muscoli: ['Petto', 'Spalle', 'Tricipiti'],
      esercizi: 8,
      durata: 60,
      completato: false
    });
  };

  const progressoPeso = ((stats.peso - stats.obiettivoPeso) / stats.peso) * 100;
  const progressoAcqua = (stats.acqua / stats.acquaTarget) * 100;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
              Bentornato,
            </Text>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {user?.nome} 💪
            </Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Bell size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={toggleTheme}>
              {isDark ? (
                <Sun size={24} color={theme.colors.text} />
              ) : (
                <Moon size={24} color={theme.colors.text} />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.iconButton, styles.logoutButton]} 
              onPress={logout}
              testID="logout-button"
            >
              <LogOut size={20} color="#FF0000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Workout del Giorno */}
        {workoutToday && (
          <TouchableOpacity
            onPress={() => router.push('/(cliente)/workout')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#FF0000', '#CC0000']}
              style={styles.workoutCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.workoutHeader}>
                <Text style={styles.workoutLabel}>WORKOUT DI OGGI</Text>
                <View style={styles.workoutBadge}>
                  <Text style={styles.workoutBadgeText}>
                    {workoutToday.durata} MIN
                  </Text>
                </View>
              </View>
              <Text style={styles.workoutTitle}>{workoutToday.nome}</Text>
              <Text style={styles.workoutMuscles}>
                {workoutToday.muscoli.join(' • ')}
              </Text>
              <View style={styles.workoutFooter}>
                <Text style={styles.workoutExercises}>
                  {workoutToday.esercizi} esercizi
                </Text>
                <View style={styles.startButton}>
                  <Text style={styles.startButtonText}>INIZIA</Text>
                  <ChevronRight size={20} color="#FFFFFF" />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* CTA: Avvia Live Workout - selezione programma e giorno */}
        <TouchableOpacity
          testID="dashboard-avvia-live"
          style={[styles.ctaLive, { backgroundColor: theme.colors.primary }]}
          activeOpacity={0.9}
          onPress={() => setShowDayPicker(true)}
        >
          <Text style={styles.ctaLiveText}>AVVIA LIVE WORKOUT</Text>
        </TouchableOpacity>

        {/* Day Picker Modal */}
        <Modal visible={showDayPicker} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}
              >
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Scegli il giorno</Text>
              <View style={styles.daysGrid}>
                {['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato','Domenica'].map((g) => (
                  <TouchableOpacity
                    key={g}
                    testID={`pick-day-${g}`}
                    style={[styles.dayPill, { borderColor: theme.colors.border }]}
                    onPress={() => {
                      setShowDayPicker(false);
                      router.push(`/(cliente)/workout?start=1&day=${encodeURIComponent(g)}`);
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.dayPillText, { color: theme.colors.text }]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                testID="close-day-picker"
                onPress={() => setShowDayPicker(false)}
                style={styles.modalClose}
              >
                <Text style={[styles.modalCloseText, { color: theme.colors.textSecondary }]}>Chiudi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {/* Peso */}
          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: theme.colors.surface }]}
            onPress={() => router.push('/(cliente)/progressi')}
          >
            <View style={styles.statHeader}>
              <Scale size={20} color={theme.colors.primary} />
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Peso
              </Text>
            </View>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {stats.peso} kg
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${Math.min(progressoPeso, 100)}%`,
                    backgroundColor: theme.colors.success 
                  }
                ]} 
              />
            </View>
            <Text style={[styles.statTarget, { color: theme.colors.textSecondary }]}>
              Obiettivo: {stats.obiettivoPeso} kg
            </Text>
          </TouchableOpacity>

          {/* Streak */}
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.statHeader}>
              <Flame size={20} color="#FF6B00" />
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Streak
              </Text>
            </View>
            <View style={styles.streakContainer}>
              <Text style={[styles.streakValue, { color: theme.colors.text }]}>
                {stats.streak}
              </Text>
              <Flame size={32} color="#FF6B00" />
            </View>
            <Text style={[styles.statTarget, { color: theme.colors.textSecondary }]}>
              giorni consecutivi
            </Text>
          </View>
        </View>

        {/* Attività Giornaliera */}
        <View style={styles.dailyActivity}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Attività di Oggi
          </Text>
          
          <View style={[styles.activityCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.activityRow}>
              <View style={styles.activityItem}>
                <Activity size={20} color={theme.colors.primary} />
                <Text style={[styles.activityValue, { color: theme.colors.text }]}>
                  {stats.passi.toLocaleString()}
                </Text>
                <Text style={[styles.activityLabel, { color: theme.colors.textSecondary }]}>
                  Passi
                </Text>
              </View>
              
              <View style={styles.activityDivider} />
              
              <View style={styles.activityItem}>
                <Droplets size={20} color="#00A8E8" />
                <Text style={[styles.activityValue, { color: theme.colors.text }]}>
                  {(stats.acqua / 1000).toFixed(1)}L
                </Text>
                <Text style={[styles.activityLabel, { color: theme.colors.textSecondary }]}>
                  Acqua
                </Text>
              </View>
              
              <View style={styles.activityDivider} />
              
              <View style={styles.activityItem}>
                <Target size={20} color={theme.colors.success} />
                <Text style={[styles.activityValue, { color: theme.colors.text }]}>
                  2/3
                </Text>
                <Text style={[styles.activityLabel, { color: theme.colors.textSecondary }]}>
                  Pasti
                </Text>
              </View>
            </View>
            
            <View style={styles.waterProgress}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${progressoAcqua}%`,
                      backgroundColor: '#00A8E8' 
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.waterTarget, { color: theme.colors.textSecondary }]}>
                Target: {(stats.acquaTarget / 1000).toFixed(1)}L
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Azioni Rapide
          </Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}
              onPress={() => router.push('/(cliente)/progressi')}
            >
              <Ruler size={24} color={theme.colors.primary} />
              <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>
                Misure
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}
              onPress={() => router.push('/(cliente)/alimentazione')}
            >
              <Calendar size={24} color={theme.colors.primary} />
              <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>
                Piano
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 14,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
    letterSpacing: 1,
  },
  workoutBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  workoutBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  workoutMuscles: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 16,
  },
  workoutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutExercises: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  statTarget: {
    fontSize: 11,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  streakValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  dailyActivity: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  activityCard: {
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  activityItem: {
    alignItems: 'center',
    flex: 1,
  },
  activityValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  activityLabel: {
    fontSize: 12,
  },
  activityDivider: {
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginVertical: 8,
  },
  waterProgress: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  waterTarget: {
    fontSize: 11,
    marginTop: 4,
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  ctaLive: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  ctaLiveText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  dayPill: {
    width: '48%',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  dayPillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalClose: {
    marginTop: 8,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 13,
  },
});