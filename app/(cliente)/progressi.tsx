import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, TrendingDown, Target, Award, Check, Plus, X, Ruler, BarChart3 } from 'lucide-react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width } = Dimensions.get('window');

export default function ProgressiScreen() {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState<'bilancia' | 'misure' | 'grafici'>('bilancia');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showMeasureModal, setShowMeasureModal] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [permission, requestPermission] = useCameraPermissions();
  const [goals, setGoals] = useState([
    { id: 1, text: 'Perdere 10kg', completed: false, date: '2025-08-23', photos: [] },
    { id: 2, text: 'Raggiungere 15% body fat', completed: true, date: '2025-08-15', photos: ['photo1.jpg'] },
  ]);
  const [measurements, setMeasurements] = useState([
    { id: 1, date: '2025-08-23', peso: 75, altezza: 175, petto: 95, vita: 80, fianchi: 90, braccio: 35, coscia: 55 },
    { id: 2, date: '2025-08-16', peso: 76, altezza: 175, petto: 96, vita: 82, fianchi: 91, braccio: 35, coscia: 56 },
    { id: 3, date: '2025-08-09', peso: 77, altezza: 175, petto: 97, vita: 84, fianchi: 92, braccio: 36, coscia: 57 },
  ]);

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

  const addGoal = () => {
    if (newGoal.trim()) {
      const newGoalObj = {
        id: goals.length + 1,
        text: newGoal.trim(),
        completed: false,
        date: new Date().toISOString().split('T')[0],
        photos: []
      };
      setGoals([...goals, newGoalObj]);
      setNewGoal('');
      setShowAddGoal(false);
    }
  };

  const toggleGoal = (id: number) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const handleTakePhoto = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permesso Negato', 'Permesso camera necessario per scattare foto');
        return;
      }
    }
    setShowPhotoModal(true);
  };

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

          {/* Goals Section */}
          <View style={styles.goalsSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Obiettivi</Text>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => setShowAddGoal(true)}
              >
                <Plus size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            {goals.map((goal) => (
              <View key={goal.id} style={[styles.goalCard, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalInfo}>
                    <Text style={[styles.goalText, { color: theme.colors.text }]}>{goal.text}</Text>
                    <Text style={[styles.goalDate, { color: theme.colors.textSecondary }]}>{goal.date}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleGoal(goal.id)}
                  >
                    {goal.completed ? (
                      <View style={[styles.checkCircle, { backgroundColor: theme.colors.success }]}>
                        <Check size={16} color="#FFFFFF" />
                      </View>
                    ) : (
                      <View style={[styles.checkCircle, { borderColor: theme.colors.border }]} />
                    )}
                  </TouchableOpacity>
                </View>
                
                {/* Photo Widget */}
                <View style={styles.photoWidget}>
                  <Text style={[styles.photoWidgetTitle, { color: theme.colors.text }]}>Foto Progressi</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
                    <TouchableOpacity
                      style={[styles.photoCard, { backgroundColor: theme.colors.background }]}
                      onPress={() => setShowPhotoModal(true)}
                    >
                      <Camera size={24} color={theme.colors.primary} />
                      <Text style={[styles.photoCardText, { color: theme.colors.textSecondary }]}>Oggi</Text>
                    </TouchableOpacity>
                    
                    {/* Mock previous photos */}
                    <View style={[styles.photoCard, { backgroundColor: '#E0E0E0' }]}>
                      <Text style={styles.photoCardDate}>Giorno 7</Text>
                    </View>
                    <View style={[styles.photoCard, { backgroundColor: '#D0D0D0' }]}>
                      <Text style={styles.photoCardDate}>Giorno 1</Text>
                    </View>
                  </ScrollView>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {selectedTab === 'misure' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.misureContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Misure Corporee</Text>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => setShowMeasureModal(true)}
              >
                <Plus size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {measurements.map((measure) => (
              <View key={measure.id} style={[styles.measureCard, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.measureHeader}>
                  <Text style={[styles.measureDate, { color: theme.colors.text }]}>{measure.date}</Text>
                  <Text style={[styles.measureWeight, { color: theme.colors.primary }]}>{measure.peso} kg</Text>
                </View>
                <View style={styles.measureGrid}>
                  <View style={styles.measureItem}>
                    <Text style={[styles.measureLabel, { color: theme.colors.textSecondary }]}>Petto</Text>
                    <Text style={[styles.measureValue, { color: theme.colors.text }]}>{measure.petto} cm</Text>
                  </View>
                  <View style={styles.measureItem}>
                    <Text style={[styles.measureLabel, { color: theme.colors.textSecondary }]}>Vita</Text>
                    <Text style={[styles.measureValue, { color: theme.colors.text }]}>{measure.vita} cm</Text>
                  </View>
                  <View style={styles.measureItem}>
                    <Text style={[styles.measureLabel, { color: theme.colors.textSecondary }]}>Fianchi</Text>
                    <Text style={[styles.measureValue, { color: theme.colors.text }]}>{measure.fianchi} cm</Text>
                  </View>
                  <View style={styles.measureItem}>
                    <Text style={[styles.measureLabel, { color: theme.colors.textSecondary }]}>Braccio</Text>
                    <Text style={[styles.measureValue, { color: theme.colors.text }]}>{measure.braccio} cm</Text>
                  </View>
                  <View style={styles.measureItem}>
                    <Text style={[styles.measureLabel, { color: theme.colors.textSecondary }]}>Coscia</Text>
                    <Text style={[styles.measureValue, { color: theme.colors.text }]}>{measure.coscia} cm</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {selectedTab === 'grafici' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.graficiContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Grafici Progressi</Text>
            
            {/* Weight Chart */}
            <View style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.chartHeader}>
                <BarChart3 size={20} color={theme.colors.primary} />
                <Text style={[styles.chartTitle, { color: theme.colors.text }]}>Andamento Peso</Text>
              </View>
              <View style={styles.chartPlaceholder}>
                <Text style={[styles.chartPlaceholderText, { color: theme.colors.textSecondary }]}>
                  Grafico peso ultimi 30 giorni
                </Text>
              </View>
            </View>

            {/* Body Measurements Chart */}
            <View style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.chartHeader}>
                <Ruler size={20} color={theme.colors.primary} />
                <Text style={[styles.chartTitle, { color: theme.colors.text }]}>Misure Corporee</Text>
              </View>
              <View style={styles.chartPlaceholder}>
                <Text style={[styles.chartPlaceholderText, { color: theme.colors.textSecondary }]}>
                  Grafico misure ultimi 30 giorni
                </Text>
              </View>
            </View>

            {/* Goals Progress Chart */}
            <View style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.chartHeader}>
                <Target size={20} color={theme.colors.primary} />
                <Text style={[styles.chartTitle, { color: theme.colors.text }]}>Progressi Obiettivi</Text>
              </View>
              <View style={styles.chartPlaceholder}>
                <Text style={[styles.chartPlaceholderText, { color: theme.colors.textSecondary }]}>
                  Grafico completamento obiettivi
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
      {/* Add Goal Modal */}
      <Modal visible={showAddGoal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Nuovo Obiettivo</Text>
            <TextInput
              style={[styles.goalInput, { backgroundColor: theme.colors.background, color: theme.colors.text }]}
              placeholder="Inserisci il tuo obiettivo..."
              placeholderTextColor={theme.colors.textSecondary}
              value={newGoal}
              onChangeText={setNewGoal}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.border }]}
                onPress={() => {
                  setShowAddGoal(false);
                  setNewGoal('');
                }}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>Annulla</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={addGoal}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Aggiungi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Photo Modal */}
      <Modal visible={showPhotoModal} animationType="slide" presentationStyle="fullScreen">
        <SafeAreaView style={[styles.photoModalContainer, { backgroundColor: '#000' }]}>
          <View style={styles.photoModalHeader}>
            <TouchableOpacity onPress={() => setShowPhotoModal(false)} style={styles.closeButton}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.photoModalTitle}>Foto Progresso</Text>
            <View style={{ width: 24 }} />
          </View>
          
          {permission?.granted ? (
            <CameraView style={styles.camera} facing="back">
              <View style={styles.cameraOverlay}>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={() => {
                    setShowPhotoModal(false);
                    Alert.alert('Foto Salvata', 'La tua foto progresso è stata salvata!');
                  }}
                >
                  <Camera size={32} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </CameraView>
          ) : (
            <View style={styles.permissionContainer}>
              <Text style={styles.permissionText}>Permesso camera necessario</Text>
              <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                <Text style={styles.permissionButtonText}>Concedi Permesso</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* Measure Modal */}
      <Modal visible={showMeasureModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Nuove Misure</Text>
            <Text style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}>Inserisci le tue misure corporee</Text>
            
            <View style={styles.measureInputs}>
              <View style={styles.measureInputRow}>
                <Text style={[styles.measureInputLabel, { color: theme.colors.text }]}>Peso (kg)</Text>
                <TextInput
                  style={[styles.measureInput, { backgroundColor: theme.colors.background, color: theme.colors.text }]}
                  placeholder="75"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.measureInputRow}>
                <Text style={[styles.measureInputLabel, { color: theme.colors.text }]}>Petto (cm)</Text>
                <TextInput
                  style={[styles.measureInput, { backgroundColor: theme.colors.background, color: theme.colors.text }]}
                  placeholder="95"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.measureInputRow}>
                <Text style={[styles.measureInputLabel, { color: theme.colors.text }]}>Vita (cm)</Text>
                <TextInput
                  style={[styles.measureInput, { backgroundColor: theme.colors.background, color: theme.colors.text }]}
                  placeholder="80"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.border }]}
                onPress={() => setShowMeasureModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>Annulla</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => {
                  setShowMeasureModal(false);
                  Alert.alert('Misure Salvate', 'Le tue nuove misure sono state registrate!');
                }}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Salva</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  goalsSection: {
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  goalDate: {
    fontSize: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoWidget: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  photoWidgetTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  photoScroll: {
    flexDirection: 'row',
  },
  photoCard: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  photoCardText: {
    fontSize: 12,
    marginTop: 4,
  },
  photoCardDate: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  goalInput: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  photoModalContainer: {
    flex: 1,
  },
  photoModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeButton: {
    padding: 4,
  },
  photoModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  misureContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  measureCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  measureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  measureDate: {
    fontSize: 16,
    fontWeight: '600',
  },
  measureWeight: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  measureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  measureItem: {
    width: '30%',
    alignItems: 'center',
  },
  measureLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  measureValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  measureInputs: {
    gap: 12,
    marginBottom: 20,
  },
  measureInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  measureInputLabel: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  measureInput: {
    flex: 1,
    borderRadius: 8,
    padding: 8,
    textAlign: 'center',
  },
  graficiContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  chartCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  chartPlaceholder: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 8,
  },
  chartPlaceholderText: {
    fontSize: 14,
  },
});