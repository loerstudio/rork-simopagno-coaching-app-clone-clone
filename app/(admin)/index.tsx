import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, UserCheck, UserX, Activity, TrendingUp, DollarSign, Settings, Shield, Database, LogOut } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function AdminDashboardScreen() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  // Mock admin stats
  const adminStats = {
    trainers: {
      totali: 25,
      attivi: 22,
      nuoviMese: 3
    },
    clienti: {
      totali: 340,
      attivi: 285,
      nuoviMese: 45
    },
    revenue: {
      mensile: 15420,
      crescita: 12.5
    },
    workout: {
      totaliMese: 1250,
      mediaGiornaliera: 42
    }
  };

  const recentTrainers = [
    { id: 1, nome: 'Marco Bianchi', email: 'marco@email.com', clienti: 15, status: 'attivo' },
    { id: 2, nome: 'Laura Rossi', email: 'laura@email.com', clienti: 22, status: 'attivo' },
    { id: 3, nome: 'Giuseppe Verdi', email: 'giuseppe@email.com', clienti: 8, status: 'sospeso' }
  ];

  const handleCreateTrainer = () => {
    Alert.alert('Crea Trainer', 'Funzionalita in sviluppo');
  };

  const handleManageTrainer = (trainerId: number) => {
    Alert.alert('Gestisci Trainer', `Gestione trainer ID: ${trainerId}`);
  };

  const handleSystemSettings = () => {
    Alert.alert('Impostazioni Sistema', 'Pannello impostazioni in sviluppo');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
              Pannello Admin
            </Text>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              Benvenuto {user?.nome} 👑
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.headerButton, { backgroundColor: theme.colors.surface }]}
              onPress={handleSystemSettings}
            >
              <Settings size={20} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.headerButton, styles.logoutButton]} 
              onPress={logout}
              testID="logout-button"
            >
              <LogOut size={20} color="#FF0000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Overview */}
        <LinearGradient
          colors={['#FF0000', '#CC0000']}
          style={styles.statsCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.statsTitle}>Panoramica Sistema</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Users size={24} color="#FFFFFF" />
              <Text style={styles.statValue}>{adminStats.trainers.totali}</Text>
              <Text style={styles.statLabel}>Trainers</Text>
            </View>
            <View style={styles.statItem}>
              <UserCheck size={24} color="#FFFFFF" />
              <Text style={styles.statValue}>{adminStats.clienti.totali}</Text>
              <Text style={styles.statLabel}>Clienti</Text>
            </View>
            <View style={styles.statItem}>
              <Activity size={24} color="#FFFFFF" />
              <Text style={styles.statValue}>{adminStats.workout.totaliMese}</Text>
              <Text style={styles.statLabel}>Workout/Mese</Text>
            </View>
            <View style={styles.statItem}>
              <DollarSign size={24} color="#FFFFFF" />
              <Text style={styles.statValue}>€{adminStats.revenue.mensile}</Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={[styles.quickStatCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.quickStatHeader}>
              <TrendingUp size={20} color={theme.colors.success} />
              <Text style={[styles.quickStatTitle, { color: theme.colors.text }]}>Crescita</Text>
            </View>
            <Text style={[styles.quickStatValue, { color: theme.colors.success }]}>
              +{adminStats.revenue.crescita}%
            </Text>
            <Text style={[styles.quickStatLabel, { color: theme.colors.textSecondary }]}>
              vs mese scorso
            </Text>
          </View>

          <View style={[styles.quickStatCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.quickStatHeader}>
              <UserCheck size={20} color={theme.colors.primary} />
              <Text style={[styles.quickStatTitle, { color: theme.colors.text }]}>Nuovi Clienti</Text>
            </View>
            <Text style={[styles.quickStatValue, { color: theme.colors.text }]}>
              {adminStats.clienti.nuoviMese}
            </Text>
            <Text style={[styles.quickStatLabel, { color: theme.colors.textSecondary }]}>
              questo mese
            </Text>
          </View>
        </View>

        {/* Trainers Management */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Gestione Trainers
            </Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleCreateTrainer}
            >
              <Text style={styles.addButtonText}>+ Nuovo</Text>
            </TouchableOpacity>
          </View>

          {recentTrainers.map((trainer) => (
            <TouchableOpacity
              key={trainer.id}
              style={[styles.trainerCard, { backgroundColor: theme.colors.surface }]}
              onPress={() => handleManageTrainer(trainer.id)}
            >
              <View style={styles.trainerInfo}>
                <Text style={[styles.trainerName, { color: theme.colors.text }]}>
                  {trainer.nome}
                </Text>
                <Text style={[styles.trainerEmail, { color: theme.colors.textSecondary }]}>
                  {trainer.email}
                </Text>
                <Text style={[styles.trainerClients, { color: theme.colors.textSecondary }]}>
                  {trainer.clienti} clienti
                </Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: trainer.status === 'attivo' ? theme.colors.success : '#FF6B6B' }
              ]}>
                <Text style={styles.statusText}>
                  {trainer.status === 'attivo' ? 'Attivo' : 'Sospeso'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* System Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Azioni Sistema
          </Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.colors.surface }]}>
              <Database size={32} color={theme.colors.primary} />
              <Text style={[styles.actionTitle, { color: theme.colors.text }]}>Database</Text>
              <Text style={[styles.actionDesc, { color: theme.colors.textSecondary }]}>
                Gestione e backup
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.colors.surface }]}>
              <Shield size={32} color={theme.colors.primary} />
              <Text style={[styles.actionTitle, { color: theme.colors.text }]}>Sicurezza</Text>
              <Text style={[styles.actionDesc, { color: theme.colors.textSecondary }]}>
                Logs e permessi
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.colors.surface }]}>
              <TrendingUp size={32} color={theme.colors.primary} />
              <Text style={[styles.actionTitle, { color: theme.colors.text }]}>Analytics</Text>
              <Text style={[styles.actionDesc, { color: theme.colors.textSecondary }]}>
                Report dettagliati
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.colors.surface }]}>
              <Settings size={32} color={theme.colors.primary} />
              <Text style={[styles.actionTitle, { color: theme.colors.text }]}>Configurazione</Text>
              <Text style={[styles.actionDesc, { color: theme.colors.textSecondary }]}>
                Impostazioni app
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  statsCard: {
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
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 30,
  },
  quickStatCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  quickStatTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  trainerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  trainerInfo: {
    flex: 1,
  },
  trainerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  trainerEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  trainerClients: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 52) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 12,
    textAlign: 'center',
  },
});