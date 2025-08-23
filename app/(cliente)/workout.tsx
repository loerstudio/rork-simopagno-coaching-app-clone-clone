import { useState, useEffect, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  Modal,
  ActivityIndicator,
  Platform,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Plus, Clock, ChevronLeft, PlayCircle, ListChecks } from 'lucide-react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';


const { width, height } = Dimensions.get('window');

interface Esercizio {
  id: number;
  nome: string;
  muscoli: string[];
  serie: number;
  ripetizioni: string;
  peso?: number;
  rest: number;
  youtubeId: string;
  completato: boolean;
  note?: string;
}

interface Programma {
  id: number;
  nome: string;
  giorno: string;
  esercizi: Esercizio[];
}

export default function WorkoutScreen() {
  const { theme } = useTheme();
  const [programma, setProgramma] = useState<{ id: number; nome: string; giorni: Array<{ id: number; nome: string; esercizi: Esercizio[]; completato: boolean }>} | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null);
  const [selectedEsercizio, setSelectedEsercizio] = useState<Esercizio | null>(null);
  const [showLiveWorkout, setShowLiveWorkout] = useState(false);

  const params = useLocalSearchParams<{ start?: string; day?: string }>();

  useEffect(() => {
    loadProgramma();
  }, []);

  useEffect(() => {
    if (programma && params.start === '1') {
      const byName = typeof params.day === 'string' ? programma.giorni.find(g => g.nome === params.day) : undefined;
      const dayToStart = byName ?? programma.giorni[0];
      setSelectedDayId(dayToStart.id);
      const next = dayToStart.esercizi.find(e => !e.completato) ?? dayToStart.esercizi[0];
      startLiveWorkout(next);
    }
  }, [programma, params.start, params.day]);

  const loadProgramma = () => {
    const eserciziBase: Esercizio[] = [
        {
          id: 1,
          nome: 'Chest Press con Manubri',
          muscoli: ['Petto', 'Tricipiti'],
          serie: 4,
          ripetizioni: '12',
          peso: 25,
          rest: 90,
          youtubeId: 'Mqt7UKD5cwM',
          completato: false,
          note: 'Mantieni i gomiti a 45°'
        },
        {
          id: 2,
          nome: 'Rematore con Manubrio',
          muscoli: ['Dorsali', 'Bicipiti'],
          serie: 4,
          ripetizioni: '10',
          peso: 20,
          rest: 60,
          youtubeId: 'hA5cIMNxdEU',
          completato: false
        },
        {
          id: 3,
          nome: 'Alzate Laterali',
          muscoli: ['Spalle'],
          serie: 3,
          ripetizioni: '15',
          peso: 8,
          rest: 45,
          youtubeId: 'aQQ8xDaP_XA',
          completato: false
        },
        {
          id: 4,
          nome: 'Curl con Manubri',
          muscoli: ['Bicipiti'],
          serie: 3,
          ripetizioni: '12',
          peso: 12,
          rest: 45,
          youtubeId: 'lFAPH2liNUo',
          completato: false
        },
        {
          id: 5,
          nome: 'Overhead Tricep Extension',
          muscoli: ['Tricipiti'],
          serie: 3,
          ripetizioni: '12',
          peso: 15,
          rest: 45,
          youtubeId: 'UTsgkUsHTuU',
          completato: false
        }
    ];
    const giorniNomi = ['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì'];
    const giorni = giorniNomi.map((g, idx) => ({
      id: idx + 1,
      nome: g,
      esercizi: eserciziBase.map(e => ({ ...e, id: e.id + idx * 10, completato: false })),
      completato: false,
    }));
    setProgramma({ id: 101, nome: 'Piano Ipertrofia - A', giorni });
    setSelectedDayId(1);
  };

  const toggleCompletato = (esercizioId: number) => {
    if (!programma || selectedDayId == null) return;
    setProgramma({
      ...programma,
      giorni: programma.giorni.map(g => {
        if (g.id !== selectedDayId) return g;
        const updatedE = g.esercizi.map(e => e.id === esercizioId ? { ...e, completato: !e.completato } : e);
        return { ...g, esercizi: updatedE, completato: updatedE.every(e => e.completato) };
      })
    });
  };

  const startLiveWorkout = (esercizio: Esercizio) => {
    console.log('[Workout] startLiveWorkout', esercizio.id);
    setSelectedEsercizio(esercizio);
    setShowLiveWorkout(true);
  };

  const startLiveFromCTA = () => {
    const day = programma?.giorni.find(g => g.id === selectedDayId);
    if (!day) return;
    const next = day.esercizi.find(e => !e.completato) ?? day.esercizi[0];
    startLiveWorkout(next);
  };

  const selectedDay = useMemo(() => programma?.giorni.find(g => g.id === selectedDayId) ?? null, [programma, selectedDayId]);
  const completatiCount = selectedDay?.esercizi.filter(e => e.completato).length || 0;
  const totaleEsercizi = selectedDay?.esercizi.length || 0;
  const progressPercentage = totaleEsercizi > 0 ? (completatiCount / totaleEsercizi) * 100 : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Workout</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {programma && (
          <>
            <LinearGradient
              colors={['#FF0000', '#CC0000']}
              style={styles.progressCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={styles.progressTitle}>{programma.nome}</Text>
                  <Text style={styles.progressSubtitle}>Seleziona un giorno</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <ListChecks size={20} color="#FFFFFF" />
                </View>
              </View>
            </LinearGradient>

            <View style={styles.eserciziContainer}>
              {programma.giorni.map((g) => (
                <TouchableOpacity
                  key={g.id}
                  style={[styles.dayItem, { backgroundColor: theme.colors.surface, borderColor: g.id === selectedDayId ? theme.colors.primary : theme.colors.border }]}
                  onPress={() => setSelectedDayId(g.id)}
                  activeOpacity={0.9}
                >
                  <View style={styles.dayLeftRow}>
                    <View style={[styles.dayDot, { backgroundColor: g.completato ? theme.colors.success : theme.colors.border }]} />
                    <Text style={[styles.dayName, { color: theme.colors.text }]}>{g.nome}</Text>
                  </View>
                  <Text style={[styles.dayMeta, { color: theme.colors.textSecondary }]}>
                    {g.esercizi.length} esercizi
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedDay && (
              <>
                <TouchableOpacity
                  testID="start-live-workout"
                  activeOpacity={0.85}
                  onPress={startLiveFromCTA}
                  style={[styles.ctaStart, { backgroundColor: theme.colors.primary }]}
                >
                  <PlayCircle size={20} color="#FFFFFF" />
                  <Text style={styles.ctaStartText}>AVVIA LIVE WORKOUT</Text>
                </TouchableOpacity>

                <View style={styles.eserciziContainer}>
                  {selectedDay.esercizi.map((esercizio, index) => (
                    <TouchableOpacity
                      key={esercizio.id}
                      testID={`exercise-card-${index+1}`}
                      style={[
                        styles.esercizioCard,
                        { backgroundColor: theme.colors.surface },
                        esercizio.completato && styles.esercizioCompletato
                      ]}
                      onPress={() => startLiveWorkout(esercizio)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.esercizioLeft}>
                        <View style={styles.esercizioNumber}>
                          <Text style={[styles.esercizioNumberText, { color: theme.colors.primary }]}>
                            {index + 1}
                          </Text>
                        </View>
                        <View style={styles.esercizioInfo}>
                          <Text style={[styles.esercizioNome, { color: theme.colors.text }]}>
                            {esercizio.nome}
                          </Text>
                          <Text style={[styles.esercizioMuscoli, { color: theme.colors.textSecondary }]}>
                            {esercizio.muscoli.join(' • ')}
                          </Text>
                          <View style={styles.esercizioDetails}>
                            <Text style={[styles.esercizioDetail, { color: theme.colors.text }]}>
                              {esercizio.serie} x {esercizio.ripetizioni}
                              {esercizio.peso && ` @ ${esercizio.peso}kg`}
                            </Text>
                            <View style={styles.restBadge}>
                              <Clock size={12} color={theme.colors.textSecondary} />
                              <Text style={[styles.restText, { color: theme.colors.textSecondary }]}>
                                {esercizio.rest}s
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.checkButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          toggleCompletato(esercizio.id);
                        }}
                      >
                        {esercizio.completato ? (
                          <View style={[styles.checkCircle, { backgroundColor: theme.colors.success }]}>
                            <Check size={16} color="#FFFFFF" />
                          </View>
                        ) : (
                          <View style={[styles.checkCircle, { borderColor: theme.colors.border }]} />
                        )}
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: theme.colors.surface }]}
                  >
                    <Plus size={20} color={theme.colors.primary} />
                    <Text style={[styles.addButtonText, { color: theme.colors.text }]}>
                      Aggiungi Esercizio
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>

      {/* Live Workout Modal */}
      <Modal
        visible={showLiveWorkout}
        animationType="slide"
        presentationStyle="fullScreen"
        testID="live-workout-modal"
      >
        {selectedEsercizio && (
          <LiveWorkoutModal
            esercizio={selectedEsercizio}
            onClose={() => {
              setShowLiveWorkout(false);
              toggleCompletato(selectedEsercizio.id);
            }}
            theme={theme}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
}

// Live Workout Component
function LiveWorkoutModal({ 
  esercizio, 
  onClose, 
  theme 
}: { 
  esercizio: Esercizio; 
  onClose: () => void; 
  theme: any;
}) {
  const [currentSerie, setCurrentSerie] = useState(1);
  const [reps, setReps] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(esercizio.rest);
  const [serieData, setSerieData] = useState<Array<{ reps: number; peso: number }>>([]);
  const [storico, setStorico] = useState<Array<{ data: string; sets: Array<{ serie: number; reps: number; peso: number }> }>>([
    { data: '2025-08-20', sets: [{ serie: 1, reps: 12, peso: esercizio.peso ?? 0 }, { serie: 2, reps: 12, peso: esercizio.peso ?? 0 }, { serie: 3, reps: 12, peso: esercizio.peso ?? 0 }] },
    { data: '2025-08-13', sets: [{ serie: 1, reps: 10, peso: (esercizio.peso ?? 0) - 2 }, { serie: 2, reps: 10, peso: (esercizio.peso ?? 0) - 2 }, { serie: 3, reps: 10, peso: (esercizio.peso ?? 0) - 2 }] },
  ]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => prev - 1);
      }, 1000);
    } else if (isResting && restTimer === 0) {
      setIsResting(false);
      setRestTimer(esercizio.rest);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer, esercizio.rest]);

  const completeSerie = () => {
    const newSerieData = [...serieData, { reps, peso: esercizio.peso || 0 }];
    setSerieData(newSerieData);
    
    if (currentSerie < esercizio.serie) {
      setIsResting(true);
      setCurrentSerie(prev => prev + 1);
      setReps(0);
    } else {
      onClose();
    }
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimer(esercizio.rest);
  };

  return (
    <SafeAreaView style={[styles.liveContainer, { backgroundColor: theme.colors.background }]}>
      <View style={styles.dayBadge}>
        <Text style={[styles.dayBadgeText, { color: theme.colors.textSecondary }]}>Sessione</Text>
      </View>
      {/* Header */}
      <View style={styles.liveHeader}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <ChevronLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.liveTitle, { color: theme.colors.text }]}>{esercizio.nome}</Text>
        <View style={styles.serieIndicator}>
          <Text style={[styles.serieText, { color: theme.colors.primary }]}>
            {currentSerie}/{esercizio.serie}
          </Text>
        </View>
      </View>

      {/* Video Player */}
      {Platform.OS === 'web' ? (
        <View style={styles.videoContainer}>
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${esercizio.youtubeId}?autoplay=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.videoContainer, { alignItems: 'center', justifyContent: 'center' }]}
          activeOpacity={0.8}
          onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${esercizio.youtubeId}`)}
        >
          <Image
            source={{ uri: `https://img.youtube.com/vi/${esercizio.youtubeId}/hqdefault.jpg` }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          <View style={styles.playOverlay}>
            <PlayCircle size={56} color="#FFFFFF" />
            <Text style={styles.playOverlayText}>Apri video</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Controls */}
      <View style={styles.liveControls}>
        {isResting ? (
          <View style={styles.restContainer}>
            <Text style={[styles.restTitle, { color: theme.colors.text }]}>RIPOSO</Text>
            <Text style={[styles.restTimerText, { color: theme.colors.primary }]}>
              {restTimer}
            </Text>
            <TouchableOpacity style={styles.skipButton} onPress={skipRest}>
              <Text style={styles.skipButtonText}>SALTA RIPOSO</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Rep Counter */}
            <View style={styles.repCounter}>
              <TouchableOpacity
                style={styles.repButton}
                onPress={() => setReps(Math.max(0, reps - 1))}
              >
                <Text style={[styles.repButtonText, { color: theme.colors.primary }]}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.repDisplay}
                onPress={() => setReps(reps + 1)}
              >
                <Text style={[styles.repNumber, { color: theme.colors.text }]}>{reps}</Text>
                <Text style={[styles.repLabel, { color: theme.colors.textSecondary }]}>
                  RIPETIZIONI
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.repButton}
                onPress={() => setReps(reps + 1)}
              >
                <Text style={[styles.repButtonText, { color: theme.colors.primary }]}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Weight Display */}
            {esercizio.peso && (
              <View style={styles.weightDisplay}>
                <Text style={[styles.weightText, { color: theme.colors.text }]}>
                  {esercizio.peso} kg
                </Text>
              </View>
            )}

            {/* Complete Button */}
            <TouchableOpacity
              style={[styles.completeButton, { backgroundColor: theme.colors.primary }]}
              onPress={completeSerie}
              testID="complete-serie"
            >
              <Text style={styles.completeButtonText}>
                {currentSerie === esercizio.serie ? 'COMPLETA ESERCIZIO' : 'SERIE COMPLETATA'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Note */}
        {esercizio.note && (
          <View style={[styles.noteContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.noteText, { color: theme.colors.textSecondary }]}>
              💡 {esercizio.note}
            </Text>
          </View>
        )}
      </View>

      {/* Log Workout stile EvolutionFit */}
      <ScrollView style={styles.logContainer} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.logTitle}>Log workout</Text>
        <View style={[styles.logCard, { backgroundColor: theme.colors.surface }]}
          testID="current-session-log"
        >
          <Text style={[styles.logCardTitle, { color: theme.colors.text }]}>Sessione corrente</Text>
          {serieData.length === 0 ? (
            <Text style={[styles.logEmpty, { color: theme.colors.textSecondary }]}>Nessuna serie registrata</Text>
          ) : (
            serieData.map((s, i) => (
              <View key={i} style={styles.logRow}>
                <Text style={[styles.logCell, styles.logSerie]}>#{i + 1}</Text>
                <Text style={styles.logCell}>{s.reps} rep</Text>
                <Text style={styles.logCell}>{s.peso} kg</Text>
              </View>
            ))
          )}
        </View>

        {storico.map((sessione, idx) => (
          <View key={sessione.data + idx} style={[styles.logCard, { backgroundColor: theme.colors.surface }]}
            testID={`history-${sessione.data}`}
          >
            <Text style={[styles.logCardTitle, { color: theme.colors.text }]}>{sessione.data}</Text>
            {sessione.sets.map((s) => (
              <View key={`${sessione.data}-${s.serie}`} style={styles.logRow}>
                <Text style={[styles.logCell, styles.logSerie]}>#{s.serie}</Text>
                <Text style={styles.logCell}>{s.reps} rep</Text>
                <Text style={styles.logCell}>{s.peso} kg</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
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
  dayItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 12, borderWidth: 1, marginHorizontal: 20, marginBottom: 10 },
  dayLeftRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dayDot: { width: 10, height: 10, borderRadius: 5 },
  dayName: { fontSize: 15, fontWeight: '600' },
  dayMeta: { fontSize: 12 },
  progressCard: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  progressTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 16,
  },
  progressBarContainer: {
    gap: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  eserciziContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  esercizioCard: {
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
  esercizioCompletato: {
    opacity: 0.6,
  },
  esercizioLeft: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  esercizioNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  esercizioNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  esercizioInfo: {
    flex: 1,
  },
  esercizioNome: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  esercizioMuscoli: {
    fontSize: 12,
    marginBottom: 8,
  },
  esercizioDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  esercizioDetail: {
    fontSize: 14,
    fontWeight: '500',
  },
  ctaStart: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  ctaStartText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  restBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  restText: {
    fontSize: 11,
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.2)',
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  calendarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoon: {
    fontSize: 16,
  },
  liveContainer: {
    flex: 1,
  },
  liveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    padding: 4,
  },
  liveTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  serieIndicator: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  serieText: {
    fontSize: 14,
    fontWeight: '600',
  },
  videoContainer: {
    width: width,
    height: height * 0.4,
    backgroundColor: '#000',
  },
  playOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playOverlayText: {
    color: '#FFFFFF',
    marginTop: 8,
    fontWeight: '700',
  },

  liveControls: {
    padding: 20,
  },
  repCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  repButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  repButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  repDisplay: {
    alignItems: 'center',
  },
  repNumber: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  repLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  weightDisplay: {
    alignItems: 'center',
    marginBottom: 30,
  },
  weightText: {
    fontSize: 20,
    fontWeight: '600',
  },
  completeButton: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  restContainer: {
    alignItems: 'center',
  },
  restTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  restTimerText: {
    fontSize: 72,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  skipButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  skipButtonText: {
    color: '#FF0000',
    fontSize: 14,
    fontWeight: '600',
  },
  noteContainer: {
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
  },
  logContainer: {
    paddingHorizontal: 20,
  },
  logTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 8,
  },
  logCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  logCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  logCell: {
    fontSize: 13,
    fontWeight: '600',
  },
  logSerie: {
    width: 48,
  },
  logEmpty: {
    fontSize: 12,
  },
  dayBadge: {
    position: 'absolute',
    top: 8,
    right: 12,
  },
  dayBadgeText: {
    fontSize: 12,
  },
});