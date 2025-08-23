import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, User, Mail, Phone, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react-native';
import { useTheme } from '@/providers/ThemeProvider';

interface Cliente {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  telefono?: string;
  dataIscrizione: string;
  ultimoAccesso: string;
  workoutCompletati: number;
  isOnline: boolean;
  programmaAttivo?: string;
}

export default function ClientiScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCliente, setNewCliente] = useState({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    password: ''
  });

  const [clienti, setClienti] = useState<Cliente[]>([
    {
      id: 1,
      nome: 'Mario',
      cognome: 'Rossi',
      email: 'mario.rossi@email.com',
      telefono: '+39 333 123 4567',
      dataIscrizione: '15/01/2024',
      ultimoAccesso: '2 ore fa',
      workoutCompletati: 15,
      isOnline: true,
      programmaAttivo: 'Upper Body Power'
    },
    {
      id: 2,
      nome: 'Giulia',
      cognome: 'Bianchi',
      email: 'giulia.bianchi@email.com',
      dataIscrizione: '20/01/2024',
      ultimoAccesso: '1 giorno fa',
      workoutCompletati: 22,
      isOnline: false,
      programmaAttivo: 'Full Body Strength'
    },
    {
      id: 3,
      nome: 'Luca',
      cognome: 'Verdi',
      email: 'luca.verdi@email.com',
      telefono: '+39 333 987 6543',
      dataIscrizione: '10/01/2024',
      ultimoAccesso: '5 giorni fa',
      workoutCompletati: 8,
      isOnline: false
    }
  ]);

  const filteredClienti = clienti.filter(cliente =>
    `${cliente.nome} ${cliente.cognome}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addCliente = () => {
    if (!newCliente.nome || !newCliente.email) {
      Alert.alert('Errore', 'Nome ed email sono obbligatori');
      return;
    }

    const cliente: Cliente = {
      id: clienti.length + 1,
      nome: newCliente.nome,
      cognome: newCliente.cognome,
      email: newCliente.email,
      telefono: newCliente.telefono,
      dataIscrizione: new Date().toLocaleDateString('it-IT'),
      ultimoAccesso: 'Mai',
      workoutCompletati: 0,
      isOnline: false
    };

    setClienti([...clienti, cliente]);
    setNewCliente({ nome: '', cognome: '', email: '', telefono: '', password: '' });
    setShowAddModal(false);
    Alert.alert('Successo', 'Cliente aggiunto con successo!');
  };

  const deleteCliente = (id: number) => {
    Alert.alert(
      'Conferma eliminazione',
      'Sei sicuro di voler eliminare questo cliente?',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: () => setClienti(clienti.filter(c => c.id !== id))
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Clienti</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: theme.colors.surface }]}>
          <Search size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Cerca clienti..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{clienti.length}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Totali</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.statValue, { color: theme.colors.success }]}>
            {clienti.filter(c => c.isOnline).length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Online</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {clienti.filter(c => c.programmaAttivo).length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Con Programma</Text>
        </View>
      </View>

      {/* Clienti List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.clientiList}>
        {filteredClienti.map((cliente) => (
          <View key={cliente.id} style={[styles.clienteCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.clienteHeader}>
              <View style={styles.clienteInfo}>
                <View style={styles.clienteNameRow}>
                  <Text style={[styles.clienteNome, { color: theme.colors.text }]}>
                    {cliente.nome} {cliente.cognome}
                  </Text>
                  {cliente.isOnline && <View style={styles.onlineIndicator} />}
                </View>
                <Text style={[styles.clienteEmail, { color: theme.colors.textSecondary }]}>
                  {cliente.email}
                </Text>
                {cliente.telefono && (
                  <Text style={[styles.clienteTelefono, { color: theme.colors.textSecondary }]}>
                    {cliente.telefono}
                  </Text>
                )}
              </View>
              <TouchableOpacity style={styles.menuButton}>
                <MoreVertical size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.clienteStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.text }]}>
                  {cliente.workoutCompletati}
                </Text>
                <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
                  Workout
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.text }]}>
                  {cliente.dataIscrizione}
                </Text>
                <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
                  Iscrizione
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.text }]}>
                  {cliente.ultimoAccesso}
                </Text>
                <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
                  Ultimo accesso
                </Text>
              </View>
            </View>

            {cliente.programmaAttivo && (
              <View style={[styles.programmaTag, { backgroundColor: 'rgba(255, 0, 0, 0.1)' }]}>
                <Text style={[styles.programmaText, { color: theme.colors.primary }]}>
                  📋 {cliente.programmaAttivo}
                </Text>
              </View>
            )}

            <View style={styles.clienteActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Eye size={16} color={theme.colors.primary} />
                <Text style={[styles.actionText, { color: theme.colors.primary }]}>Dettagli</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Edit size={16} color={theme.colors.textSecondary} />
                <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>Modifica</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => deleteCliente(cliente.id)}
              >
                <Trash2 size={16} color="#FF6B6B" />
                <Text style={[styles.actionText, { color: '#FF6B6B' }]}>Elimina</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Cliente Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={[styles.cancelButton, { color: theme.colors.textSecondary }]}>
                Annulla
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Nuovo Cliente
            </Text>
            <TouchableOpacity onPress={addCliente}>
              <Text style={[styles.saveButton, { color: theme.colors.primary }]}>
                Salva
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Nome *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text }]}
                value={newCliente.nome}
                onChangeText={(text) => setNewCliente({ ...newCliente, nome: text })}
                placeholder="Inserisci nome"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Cognome</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text }]}
                value={newCliente.cognome}
                onChangeText={(text) => setNewCliente({ ...newCliente, cognome: text })}
                placeholder="Inserisci cognome"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Email *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text }]}
                value={newCliente.email}
                onChangeText={(text) => setNewCliente({ ...newCliente, email: text })}
                placeholder="Inserisci email"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Telefono</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text }]}
                value={newCliente.telefono}
                onChangeText={(text) => setNewCliente({ ...newCliente, telefono: text })}
                placeholder="Inserisci telefono"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Password *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text }]}
                value={newCliente.password}
                onChangeText={(text) => setNewCliente({ ...newCliente, password: text })}
                placeholder="Inserisci password"
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry
              />
            </View>
          </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  clientiList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  clienteCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  clienteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clienteInfo: {
    flex: 1,
  },
  clienteNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  clienteNome: {
    fontSize: 18,
    fontWeight: '600',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  clienteEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  clienteTelefono: {
    fontSize: 14,
  },
  menuButton: {
    padding: 4,
  },
  clienteStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  statText: {
    fontSize: 11,
  },
  programmaTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  programmaText: {
    fontSize: 12,
    fontWeight: '600',
  },
  clienteActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  cancelButton: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
  },
});