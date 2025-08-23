import { useState, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Paperclip, Mic, Check, CheckCheck } from 'lucide-react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuth } from '@/providers/AuthProvider';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'trainer';
  timestamp: string;
  read: boolean;
}

export default function ChatsScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Ciao! Come è andato l\'allenamento di oggi?',
      sender: 'trainer',
      timestamp: '10:30',
      read: true
    },
    {
      id: 2,
      text: 'Molto bene! Ho completato tutti gli esercizi',
      sender: 'me',
      timestamp: '10:32',
      read: true
    },
    {
      id: 3,
      text: 'Ottimo lavoro! Hai avuto difficoltà con qualche esercizio?',
      sender: 'trainer',
      timestamp: '10:33',
      read: true
    },
    {
      id: 4,
      text: 'Un po\' con le alzate laterali, forse il peso era troppo',
      sender: 'me',
      timestamp: '10:35',
      read: true
    },
    {
      id: 5,
      text: 'Ok, la prossima volta proviamo a ridurre di 1-2kg. Ricorda di mantenere il controllo del movimento',
      sender: 'trainer',
      timestamp: '10:36',
      read: false
    }
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: message,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.headerInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>SP</Text>
          </View>
          <View>
            <Text style={[styles.trainerName, { color: theme.colors.text }]}>
              Simone Pagno
            </Text>
            <Text style={[styles.trainerStatus, { color: theme.colors.success }]}>
              Online
            </Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.messagesContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                msg.sender === 'me' && styles.messageRowMe
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  msg.sender === 'me' 
                    ? [styles.messageBubbleMe, { backgroundColor: theme.colors.primary }]
                    : [styles.messageBubbleTrainer, { backgroundColor: theme.colors.surface }]
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    { color: msg.sender === 'me' ? '#FFFFFF' : theme.colors.text }
                  ]}
                >
                  {msg.text}
                </Text>
                <View style={styles.messageFooter}>
                  <Text
                    style={[
                      styles.messageTime,
                      { color: msg.sender === 'me' ? 'rgba(255,255,255,0.7)' : theme.colors.textSecondary }
                    ]}
                  >
                    {msg.timestamp}
                  </Text>
                  {msg.sender === 'me' && (
                    msg.read ? (
                      <CheckCheck size={14} color="rgba(255,255,255,0.7)" />
                    ) : (
                      <Check size={14} color="rgba(255,255,255,0.7)" />
                    )
                  )}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
          <TouchableOpacity style={styles.attachButton}>
            <Paperclip size={22} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="Scrivi un messaggio..."
            placeholderTextColor={theme.colors.textSecondary}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          
          {message.trim() ? (
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}
              onPress={sendMessage}
            >
              <Send size={20} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.micButton}>
              <Mic size={22} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  trainerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  trainerStatus: {
    fontSize: 12,
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageRow: {
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  messageRowMe: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  messageBubbleMe: {
    borderBottomRightRadius: 4,
  },
  messageBubbleTrainer: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  messageTime: {
    fontSize: 11,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    padding: 8,
  },
});