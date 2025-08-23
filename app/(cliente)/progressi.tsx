import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, TrendingDown, Target, Award, Check } from 'lucide-react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ProgressiScreen() {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState<'bilancia' | 'misure' | 'grafici'>('bilancia');

  const obiettivo = {
    tipo: 'Perdita Peso',
    iniziale: 80,
    target: 70,
    attuale: 75,
    dataInizio: '01/01/2024',
    dataTarget: '01/04/2024',
    giorniRimanenti: 45
  };

  const progressPercentage = ((obiettivo.iniziale - obiettivo.attuale) / (obiettivo.iniziale - obiettivo.target)) * 100;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Progressi</Text>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'bilancia' && styles.activeTab,
              selectedTab === 'bilancia' && { backgroundColor: theme.colors.primary }
            ]}
            onPress={() => setSelectedTab('bilancia')}
          >
            <Text
              style={[
                styles.tabText,
                { color: selectedTab === 'bilancia' ? '#FFFFFF' : theme.colors.textSecondary }
              ]}
            >
              Bilancia
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'misure' && styles.activeTab,
              selectedTab === 'misure' && { backgroundColor: theme.colors.primary }
            ]}
            onPress={() => setSelectedTab('misure')}
          >
            <Text
              style={[
                styles.tabText,
                { color: selectedTab === 'misure' ? '#FFFFFF' : theme.colors.textSecondary }
              ]}
            >
              Misure
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'grafici' && styles.activeTab,
              selectedTab === 'grafici' && { backgroundColor: theme.colors.primary }
            ]}
            onPress={() => setSelectedTab('grafici')}
          >
            <Text
              style={[
                styles.tabText,
                { color: selectedTab === 'grafici' ? '#FFFFFF' : theme.colors.textSecondary }
              ]}
            >
              Grafici
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {selectedTab === 'bilancia' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Obiettivo Card */}
          <LinearGradient
            colors={['#FF0000', '#CC0000']}
            style={styles.obiettivoCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.obiettivoHeader}>
              <Target size={24} color="#FFFFFF" />
              <Text style={styles.obiettivoTipo}>{obiettivo.tipo}</Text>
            </View>
            
            <View style={styles.obiettivoStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{obiettivo.iniziale} kg</Text>
                <Text style={styles.statLabel}>Iniziale</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValueLarge}>{obiettivo.attuale} kg</Text>
                <Text style={styles.statLabel}>Attuale</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{obiettivo.target} kg</Text>
                <Text style={styles.statLabel}>Target</Text>
              </View>
            </View>

            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBg}>
                <View
                  style={[styles.progressBarFill, { width: `${progressPercentage}%` }]}
                />
              </View>
              <Text style={styles.progressText}>
                {progressPercentage.toFixed(0)}% completato
              </Text>
            </View>

            <View style={styles.obiettivoFooter}>
              <View style={styles.footerItem}>
                <TrendingDown size={16} color="#FFFFFF" />
                <Text style={styles.footerText}>
                  -5 kg
                </Text>
              </View>
              <View style={styles.footerItem}>
                <Text style={styles.footerText}>
                  {obiettivo.giorniRimanenti} giorni rimanenti
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* Milestones */}
          <View style={styles.milestonesContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Traguardi
            </Text>
            <View style={styles.milestonesList}>
              <View style={[styles.milestoneCard, { backgroundColor: theme.colors.surface }]}>
                <View style={[styles.milestoneIcon, { backgroundColor: theme.colors.success }]}>
                  <Award size={20} color="#FFFFFF" />
                </View>
                <View style={styles.milestoneInfo}>
                  <Text style={[styles.milestoneTitle, { color: theme.colors.text }]}>
                    Primo Traguardo
                  </Text>
                  <Text style={[styles.milestoneDesc, { color: theme.colors.textSecondary }]}>
                    -2 kg raggiunti!
                  </Text>
                </View>
                <Check size={24} color={theme.colors.success} />
              </View>

              <View style={[styles.milestoneCard, { backgroundColor: theme.colors.surface }]}>
                <View style={[styles.milestoneIcon, { backgroundColor: theme.colors.success }]}>
                  <Award size={20} color="#FFFFFF" />
                </View>
                <View style={styles.milestoneInfo}>
                  <Text style={[styles.milestoneTitle, { color: theme.colors.text }]}>
                    Metà Strada
                  </Text>
                  <Text style={[styles.milestoneDesc, { color: theme.colors.textSecondary }]}>
                    -5 kg raggiunti!
                  </Text>
                </View>
                <Check size={24} color={theme.colors.success} />
              </View>

              <View style={[styles.milestoneCard, { backgroundColor: theme.colors.surface, opacity: 0.6 }]}>
                <View style={[styles.milestoneIcon, { backgroundColor: theme.colors.border }]}>
                  <Award size={20} color="#FFFFFF" />
                </View>
                <View style={styles.milestoneInfo}>
                  <Text style={[styles.milestoneTitle, { color: theme.colors.text }]}>
                    Obiettivo Finale
                  </Text>
                  <Text style={[styles.milestoneDesc, { color: theme.colors.textSecondary }]}>
                    -10 kg da raggiungere
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Photo Progress */}
          <View style={styles.photoSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Foto Progressi
            </Text>
            <TouchableOpacity
              style={[styles.photoButton, { backgroundColor: theme.colors.surface }]}
            >
              <Camera size={24} color={theme.colors.primary} />
              <Text style={[styles.photoButtonText, { color: theme.colors.text }]}>
                Scatta Foto di Oggi
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {selectedTab === 'misure' && (
        <View style={styles.centerContainer}>
          <Text style={[styles.comingSoon, { color: theme.colors.textSecondary }]}>
            Tracking misure corporee in arrivo...
          </Text>
        </View>
      )}

      {selectedTab === 'grafici' && (
        <View style={styles.centerContainer}>
          <Text style={[styles.comingSoon, { color: theme.colors.textSecondary }]}>
            Grafici progressi in arrivo...
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    gap: 10,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeTab: {
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  obiettivoCard: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  obiettivoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  obiettivoTipo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  obiettivoStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statValueLarge: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  obiettivoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  milestonesContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  milestonesList: {
    gap: 12,
  },
  milestoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  milestoneIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  milestoneDesc: {
    fontSize: 14,
  },
  photoSection: {
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 30,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoon: {
    fontSize: 16,
  },
});