import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Check, Clock, Plus, X, BarChart3, Calendar } from 'lucide-react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width } = Dimensions.get('window');

interface Pasto {
  id: number;
  tipo: string;
  orario: string;
  calorie: number;
  proteine: number;
  carboidrati: number;
  grassi: number;
  alimenti: string[];
  completato: boolean;
}

export default function NutrizioneScreen() {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState<'piano' | 'diario' | 'grafici'>('piano');
  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [pasti, setPasti] = useState<Pasto[]>([
    {
      id: 1,
      tipo: 'Colazione',
      orario: '07:00 - 09:00',
      calorie: 450,
      proteine: 30,
      carboidrati: 55,
      grassi: 12,
      alimenti: ['Uova strapazzate (3)', 'Pane integrale (80g)', 'Avocado (50g)'],
      completato: true
    },
    {
      id: 2,
      tipo: 'Spuntino',
      orario: '10:00 - 11:00',
      calorie: 200,
      proteine: 20,
      carboidrati: 15,
      grassi: 8,
      alimenti: ['Yogurt greco (150g)', 'Mandorle (20g)'],
      completato: true
    },
    {
      id: 3,
      tipo: 'Pranzo',
      orario: '12:30 - 14:00',
      calorie: 650,
      proteine: 45,
      carboidrati: 70,
      grassi: 18,
      alimenti: ['Pollo grigliato (150g)', 'Riso basmati (100g)', 'Verdure miste (200g)'],
      completato: false
    },
    {
      id: 4,
      tipo: 'Spuntino Post-Workout',
      orario: '16:00 - 17:00',
      calorie: 250,
      proteine: 25,
      carboidrati: 30,
      grassi: 5,
      alimenti: ['Shake proteico', 'Banana (1)'],
      completato: false
    },
    {
      id: 5,
      tipo: 'Cena',
      orario: '19:30 - 21:00',
      calorie: 550,
      proteine: 40,
      carboidrati: 45,
      grassi: 20,
      alimenti: ['Salmone (150g)', 'Patate dolci (150g)', 'Insalata mista'],
      completato: false
    }
  ]);

  const totals = {
    calorie: 3000,
    proteine: 180,
    carboidrati: 350,
    grassi: 80
  };

  const consumed = pasti.reduce((acc, pasto) => {
    if (pasto.completato) {
      return {
        calorie: acc.calorie + pasto.calorie,
        proteine: acc.proteine + pasto.proteine,
        carboidrati: acc.carboidrati + pasto.carboidrati,
        grassi: acc.grassi + pasto.grassi
      };
    }
    return acc;
  }, { calorie: 0, proteine: 0, carboidrati: 0, grassi: 0 });

  const togglePasto = (id: number) => {
    setPasti(pasti.map(p => p.id === id ? { ...p, completato: !p.completato } : p));
  };

  const handleScanFood = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permesso Negato', 'Permesso camera necessario per scansionare gli alimenti');
        return;
      }
    }
    setShowScanner(true);
  };

  const captureAndAnalyze = async () => {
    setIsScanning(true);
    try {
      // Simulate AI food recognition
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI response
      const mockFoodData = {
        nome: 'Mela Rossa',
        calorie: 95,
        proteine: 0.5,
        carboidrati: 25,
        grassi: 0.3,
        porzione: '1 media (180g)'
      };
      
      setShowScanner(false);
      Alert.alert(
        'Alimento Riconosciuto',
        `${mockFoodData.nome}\n${mockFoodData.porzione}\n\nCalorie: ${mockFoodData.calorie} kcal\nProteine: ${mockFoodData.proteine}g\nCarboidrati: ${mockFoodData.carboidrati}g\nGrassi: ${mockFoodData.grassi}g`,
        [
          { text: 'Annulla', style: 'cancel' },
          { text: 'Aggiungi al Diario', onPress: () => console.log('Added to diary') }
        ]
      );
    } catch (error) {
      Alert.alert('Errore', 'Impossibile riconoscere l\'alimento. Riprova.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Nutrizione</Text>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'piano' && styles.activeTab,
              selectedTab === 'piano' && { backgroundColor: theme.colors.primary }
            ]}
            onPress={() => setSelectedTab('piano')}
          >
            <Text
              style={[
                styles.tabText,
                { color: selectedTab === 'piano' ? '#FFFFFF' : theme.colors.textSecondary }
              ]}
            >
              Piano
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'diario' && styles.activeTab,
              selectedTab === 'diario' && { backgroundColor: theme.colors.primary }
            ]}
            onPress={() => setSelectedTab('diario')}
          >
            <Text
              style={[
                styles.tabText,
                { color: selectedTab === 'diario' ? '#FFFFFF' : theme.colors.textSecondary }
              ]}
            >
              Diario
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

      {selectedTab === 'piano' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Macro Overview */}
          <LinearGradient
            colors={['#FF0000', '#CC0000']}
            style={styles.macroCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.macroTitle}>Obiettivo Giornaliero</Text>
            <Text style={styles.calorieMain}>{totals.calorie} kcal</Text>
            <View style={styles.macroGrid}>
              <View style={styles.macroItem}>
                <View style={[styles.macroCircle, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                  <Text style={styles.macroValue}>{totals.proteine}g</Text>
                </View>
                <Text style={styles.macroLabel}>Proteine</Text>
              </View>
              <View style={styles.macroItem}>
                <View style={[styles.macroCircle, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                  <Text style={styles.macroValue}>{totals.carboidrati}g</Text>
                </View>
                <Text style={styles.macroLabel}>Carboidrati</Text>
              </View>
              <View style={styles.macroItem}>
                <View style={[styles.macroCircle, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                  <Text style={styles.macroValue}>{totals.grassi}g</Text>
                </View>
                <Text style={styles.macroLabel}>Grassi</Text>
              </View>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${(consumed.calorie / totals.calorie) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {consumed.calorie} / {totals.calorie} kcal consumate
              </Text>
            </View>
          </LinearGradient>

          {/* AI Scanner Button */}
          <TouchableOpacity 
            style={[styles.scannerButton, { backgroundColor: theme.colors.surface }]}
            onPress={handleScanFood}
          >
            <Camera size={24} color={theme.colors.primary} />
            <Text style={[styles.scannerText, { color: theme.colors.text }]}>
              Scansiona Alimento con AI
            </Text>
          </TouchableOpacity>

          {/* Giorni tipo todo list */}
          <View style={styles.pastiContainer}>
            {pasti.map((pasto) => (
              <View
                key={pasto.id}
                style={[
                  styles.pastoCard,
                  { backgroundColor: theme.colors.surface },
                  pasto.completato && styles.pastoCompletato
                ]}
              >
                <View style={styles.pastoHeader}>
                  <View>
                    <Text style={[styles.pastoTipo, { color: theme.colors.text }]}>
                      {pasto.tipo}
                    </Text>
                    <View style={styles.pastoTime}>
                      <Clock size={12} color={theme.colors.textSecondary} />
                      <Text style={[styles.pastoOrario, { color: theme.colors.textSecondary }]}>
                        {pasto.orario}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.checkButton}
                    onPress={() => togglePasto(pasto.id)}
                  >
                    {pasto.completato ? (
                      <View style={[styles.checkCircle, { backgroundColor: theme.colors.success }]}>
                        <Check size={16} color="#FFFFFF" />
                      </View>
                    ) : (
                      <View style={[styles.checkCircle, { borderColor: theme.colors.border }]} />
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.pastoMacros}>
                  <View style={styles.macroSmall}>
                    <Text style={[styles.macroSmallValue, { color: theme.colors.text }]}>
                      {pasto.calorie}
                    </Text>
                    <Text style={[styles.macroSmallLabel, { color: theme.colors.textSecondary }]}>
                      kcal
                    </Text>
                  </View>
                  <View style={styles.macroSmall}>
                    <Text style={[styles.macroSmallValue, { color: theme.colors.text }]}>
                      {pasto.proteine}g
                    </Text>
                    <Text style={[styles.macroSmallLabel, { color: theme.colors.textSecondary }]}>
                      P
                    </Text>
                  </View>
                  <View style={styles.macroSmall}>
                    <Text style={[styles.macroSmallValue, { color: theme.colors.text }]}>
                      {pasto.carboidrati}g
                    </Text>
                    <Text style={[styles.macroSmallLabel, { color: theme.colors.textSecondary }]}>
                      C
                    </Text>
                  </View>
                  <View style={styles.macroSmall}>
                    <Text style={[styles.macroSmallValue, { color: theme.colors.text }]}>
                      {pasto.grassi}g
                    </Text>
                    <Text style={[styles.macroSmallLabel, { color: theme.colors.textSecondary }]}>
                      G
                    </Text>
                  </View>
                </View>

                <View style={styles.alimentiList}>
                  {pasto.alimenti.map((alimento, index) => (
                    <Text
                      key={index}
                      style={[styles.alimentoText, { color: theme.colors.textSecondary }]}
                    >
                      • {alimento}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {selectedTab === 'diario' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.diarioContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Diario Alimentare</Text>
            
            {/* Calendar View */}
            <View style={[styles.calendarCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.calendarHeader}>
                <Calendar size={20} color={theme.colors.primary} />
                <Text style={[styles.calendarTitle, { color: theme.colors.text }]}>Agosto 2025</Text>
              </View>
              <View style={styles.calendarGrid}>
                {Array.from({ length: 31 }, (_, i) => (
                  <TouchableOpacity
                    key={i + 1}
                    style={[
                      styles.calendarDay,
                      i + 1 === 23 && { backgroundColor: theme.colors.primary }
                    ]}
                  >
                    <Text style={[
                      styles.calendarDayText,
                      { color: i + 1 === 23 ? '#FFFFFF' : theme.colors.text }
                    ]}>
                      {i + 1}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Daily Summary */}
            <View style={[styles.dailySummary, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>Oggi - 23 Agosto</Text>
              <View style={styles.summaryStats}>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryValue, { color: theme.colors.text }]}>1,850</Text>
                  <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>kcal</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryValue, { color: theme.colors.text }]}>120g</Text>
                  <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Proteine</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryValue, { color: theme.colors.text }]}>180g</Text>
                  <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Carb</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryValue, { color: theme.colors.text }]}>65g</Text>
                  <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Grassi</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {selectedTab === 'grafici' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.graficiContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Grafici Nutrizionali</Text>
            
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

            {/* Calories Chart */}
            <View style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.chartHeader}>
                <BarChart3 size={20} color={theme.colors.primary} />
                <Text style={[styles.chartTitle, { color: theme.colors.text }]}>Calorie Giornaliere</Text>
              </View>
              <View style={styles.chartPlaceholder}>
                <Text style={[styles.chartPlaceholderText, { color: theme.colors.textSecondary }]}>
                  Grafico calorie ultimi 7 giorni
                </Text>
              </View>
            </View>

            {/* Macros Chart */}
            <View style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.chartHeader}>
                <BarChart3 size={20} color={theme.colors.primary} />
                <Text style={[styles.chartTitle, { color: theme.colors.text }]}>Distribuzione Macronutrienti</Text>
              </View>
              <View style={styles.chartPlaceholder}>
                <Text style={[styles.chartPlaceholderText, { color: theme.colors.textSecondary }]}>
                  Grafico a torta macronutrienti
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {/* AI Food Scanner Modal */}
      <Modal visible={showScanner} animationType="slide" presentationStyle="fullScreen">
        <SafeAreaView style={[styles.scannerContainer, { backgroundColor: '#000' }]}>
          <View style={styles.scannerHeader}>
            <TouchableOpacity onPress={() => setShowScanner(false)} style={styles.closeButton}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.scannerTitle}>Scansiona Alimento</Text>
            <View style={{ width: 24 }} />
          </View>
          
          {permission?.granted ? (
            <CameraView style={styles.camera} facing="back">
              <View style={styles.scannerOverlay}>
                <View style={styles.scannerFrame} />
                <Text style={styles.scannerInstructions}>
                  Inquadra l'alimento per identificarlo
                </Text>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={captureAndAnalyze}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Camera size={32} color="#FFFFFF" />
                  )}
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
  macroCard: {
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
  macroTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  calorieMain: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  macroLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  scannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scannerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pastiContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  pastoCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  pastoCompletato: {
    opacity: 0.7,
  },
  pastoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  pastoTipo: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  pastoTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pastoOrario: {
    fontSize: 12,
  },
  checkButton: {
    padding: 4,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pastoMacros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    marginBottom: 12,
  },
  macroSmall: {
    alignItems: 'center',
  },
  macroSmallValue: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  macroSmallLabel: {
    fontSize: 11,
  },
  alimentiList: {
    gap: 6,
  },
  alimentoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoon: {
    fontSize: 16,
  },
  diarioContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  calendarCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  calendarDay: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDayText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dailySummary: {
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
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
  scannerContainer: {
    flex: 1,
  },
  scannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeButton: {
    padding: 4,
  },
  scannerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 40,
  },
  scannerInstructions: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
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
});