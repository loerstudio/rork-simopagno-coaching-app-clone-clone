import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Activity, TrendingUp, MessageCircle, Calendar, Eye, AlertTriangle, LogOut, Settings } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ClienteStats {
  id: number;
  nome: string;
  ultimoAccesso: string;
  workoutCompletati: number;
  isOnline: boolean;
  isAllenandosi: boolean;
}

export default function TrainerDashboardScreen() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  const clientiStats: ClienteStats[] = [
    {
      id: 1,
      nome: 'Mario Rossi',
      ultimoAccesso: '2 ore fa',
      workoutCompletati: 15,
      isOnline: true,
      isAllenandosi: true
    },
    {
      id: 2,
      nome: 'Giulia Bianchi',
      ultimoAccesso: '1 giorno fa',
      workoutCompletati: 22,
      isOnline: false,
      isAllenandosi: false
    },
    {
      id: 3,
      nome: 'Luca Verdi',
      ultimoAccesso: '5 giorni fa',
      workoutCompletati: 8,
      isOnline: false,
      isAllenandosi: false
    }
  ];

  const stats = {
    clientiTotali: 12,
    clientiAttivi: 8,
    workoutSettimana: 45,
    messaggiNonLetti: 3
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
              Bentornato,
            </Text>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {user?.nome} 💪
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={[styles.headerButton, { backgroundColor: theme.colors.surface }]}>
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
          <Text style={styles.statsTitle}>Panoramica</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Users size={24} color="#FFFFFF" />
              <Text style={styles.statValue}>{stats.clientiTotali}</Text>
              <Text style={styles.statLabel}>Clienti Totali</Text>
            </View>
            <View style={styles.statItem}>
              <Activity size={24} color="#FFFFFF" />
              <Text style={styles.statValue}>{stats.clientiAttivi}</Text>
              <Text style={styles.statLabel}>Attivi</Text>
            </View>
            <View style={styles.statItem}>
              <TrendingUp size={24} color="#FFFFFF" />
              <Text style={styles.statValue}>{stats.workoutSettimana}</Text>
              <Text style={styles.statLabel}>Workout/Settimana</Text>
            </View>
            <View style={styles.statItem}>
              <MessageCircle size={24} color="#FFFFFF" />
              <Text style={styles.statValue}>{stats.messaggiNonLetti}</Text>
              <Text style={styles.statLabel}>Messaggi</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Clienti in Allenamento */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Clienti in Allenamento
          </Text>
          {clientiStats.filter(c => c.isAllenandosi).length > 0 ? (
            clientiStats.filter(c => c.isAllenandosi).map(cliente => (
              <View key={cliente.id} style={[styles.clienteCard, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.clienteInfo}>
                  <View style={styles.clienteHeader}>
                    <Text style={[styles.clienteNome, { color: theme.colors.text }]}>
                      {cliente.nome}
                    </Text>
                    <View style={styles.liveIndicator}>
                      <View style={styles.liveDot} />
                      <Text style={styles.liveText}>LIVE</Text>
                    </View>
                  </View>
                  <Text style={[styles.clienteStats, { color: theme.colors.textSecondary }]}>
                    {cliente.workoutCompletati} workout completati
                  </Text>
                </View>
                <TouchableOpacity style={styles.watchButton}>
                  <Eye size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                Nessun cliente si sta allenando
              </Text>
            </View>
          )}
        </View>

        {/* Clienti Inattivi */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Attenzione Richiesta
          </Text>
          {clientiStats.filter(c => c.ultimoAccesso.includes('giorni')).map(cliente => (
            <View key={cliente.id} style={[styles.alertCard, { backgroundColor: theme.colors.surface }]}>
              <AlertTriangle size={20} color="#FF6B00" />
              <View style={styles.alertInfo}>
                <Text style={[styles.clienteNome, { color: theme.colors.text }]}>
                  {cliente.nome}
                </Text>
                <Text style={[styles.alertText, { color: '#FF6B00' }]}>
                  Inattivo da {cliente.ultimoAccesso}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Azioni Rapide
          </Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}>
              <Users size={24} color={theme.colors.primary} />
              <Text style={[styles.actionText, { color: theme.colors.text }]}>Nuovo Cliente</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}>
              <Activity size={24} color={theme.colors.primary} />
              <Text style={[styles.actionText, { color: theme.colors.text }]}>Nuovo Programma</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}>
              <Calendar size={24} color={theme.colors.primary} />
              <Text style={[styles.actionText, { color: theme.colors.text }]}>Calendario</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}>
              <MessageCircle size={24} color={theme.colors.primary} />
              <Text style={[styles.actionText, { color: theme.colors.text }]}>Chat</Text>
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
  greeting: {
    fontSize: 14,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
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
    fontSize: 24,
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  clienteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  clienteInfo: {
    flex: 1,
  },
  clienteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  clienteNome: {
    fontSize: 16,
    fontWeight: '600',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF0000',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FF0000',
  },
  clienteStats: {
    fontSize: 14,
  },
  watchButton: {
    padding: 8,
  },
  emptyState: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  alertInfo: {
    flex: 1,
  },
  alertText: {
    fontSize: 14,
    marginTop: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    width: (width - 52) / 2,
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
});