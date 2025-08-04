import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { sendHeartbeat } from '../services/firebaseService';

const { width } = Dimensions.get('window');

const predefinedMessages = [
  {
    id: '1',
    message: 'Good morning, my love! 💕',
    type: 'love' as const,
    emoji: '🌅',
  },
  {
    id: '2',
    message: 'I miss you so much! 😘',
    type: 'love' as const,
    emoji: '💔',
  },
  {
    id: '3',
    message: 'Time for our daily challenge! 🎯',
    type: 'reminder' as const,
    emoji: '🎯',
  },
  {
    id: '4',
    message: 'Can\'t wait to see you tonight! 🌙',
    type: 'love' as const,
    emoji: '🌙',
  },
  {
    id: '5',
    message: 'You make me smile every day! 😊',
    type: 'love' as const,
    emoji: '😊',
  },
  {
    id: '6',
    message: 'Surprise! I love you! 🎉',
    type: 'surprise' as const,
    emoji: '🎉',
  },
];

export default function SendHeartbeatScreen() {
  const navigation = useNavigation();
  const { state } = useApp();
  const [selectedMessage, setSelectedMessage] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [isSending, setIsSending] = useState(false);

  const currentUser = state.currentUser;
  const partner = state.partner;

  const handleSendHeartbeat = async () => {
    if (!currentUser || !partner) {
      Alert.alert('Error', 'You need to be connected with a partner to send heartbeats.');
      return;
    }

    const message = customMessage.trim() || selectedMessage;
    if (!message) {
      Alert.alert('Error', 'Please enter a message or select a predefined one.');
      return;
    }

    setIsSending(true);

    try {
      const heartbeatData = {
        message,
        scheduledTime: new Date(),
        sent: true,
        type: 'love' as const,
        senderId: currentUser.id,
        senderName: currentUser.name || 'Unknown',
        recipientId: partner.id,
      };

      await sendHeartbeat(heartbeatData);
      
      Alert.alert(
        'Success! 💕',
        `Your heartbeat has been sent to ${partner.name}!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error sending heartbeat:', error);
      Alert.alert('Error', 'Failed to send heartbeat. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handlePredefinedMessageSelect = (message: string) => {
    setSelectedMessage(message);
    setCustomMessage(''); // Clear custom message when selecting predefined
  };

  const handleCustomMessageChange = (text: string) => {
    setCustomMessage(text);
    setSelectedMessage(''); // Clear predefined selection when typing custom
  };

  if (!partner) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#ef4444', '#dc2626']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Send Heartbeat</Text>
            <View style={styles.placeholder} />
          </View>
        </LinearGradient>

        <View style={styles.noPartnerContainer}>
          <Ionicons name="heart-outline" size={64} color="#6b7280" />
          <Text style={styles.noPartnerTitle}>No Partner Connected</Text>
          <Text style={styles.noPartnerText}>
            You need to connect with a partner to send heartbeats.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('PartnerConnection' as never)}
            style={styles.connectButton}
          >
            <Text style={styles.connectButtonText}>Connect with Partner</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#ef4444', '#dc2626']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Send Heartbeat</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Partner Info */}
        <View style={styles.partnerCard}>
          <View style={styles.partnerInfo}>
            <View style={styles.partnerAvatar}>
              <Text style={styles.partnerInitial}>
                {partner.name?.charAt(0)}
              </Text>
            </View>
            <View>
              <Text style={styles.partnerName}>{partner.name}</Text>
              <Text style={styles.partnerStatus}>Ready to receive your love 💕</Text>
            </View>
          </View>
        </View>

        {/* Predefined Messages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Messages 💬</Text>
          <View style={styles.messageGrid}>
            {predefinedMessages.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.messageCard,
                  selectedMessage === item.message && styles.selectedMessageCard,
                ]}
                onPress={() => handlePredefinedMessageSelect(item.message)}
              >
                <Text style={styles.messageEmoji}>{item.emoji}</Text>
                <Text style={styles.messageText}>{item.message}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Message */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Message ✍️</Text>
          <View style={styles.customMessageContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Write your own message..."
              value={customMessage}
              onChangeText={handleCustomMessageChange}
              multiline
              maxLength={200}
              placeholderTextColor="#9ca3af"
            />
            <Text style={styles.characterCount}>
              {customMessage.length}/200
            </Text>
          </View>
        </View>

        {/* Send Button */}
        <TouchableOpacity
          style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
          onPress={handleSendHeartbeat}
          disabled={isSending}
        >
          <LinearGradient
            colors={['#ec4899', '#ef4444']}
            style={styles.sendButtonGradient}
          >
            {isSending ? (
              <Text style={styles.sendButtonText}>Sending...</Text>
            ) : (
              <>
                <Ionicons name="heart" size={24} color="white" />
                <Text style={styles.sendButtonText}>Send Heartbeat</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingTop: 78,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  noPartnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  noPartnerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  noPartnerText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  connectButton: {
    backgroundColor: '#ec4899',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  partnerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  partnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partnerAvatar: {
    width: 48,
    height: 48,
    backgroundColor: '#ec4899',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  partnerInitial: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  partnerStatus: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  messageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  messageCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: (width - 48) / 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedMessageCard: {
    backgroundColor: '#fef3f2',
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  messageEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 16,
  },
  customMessageContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textInput: {
    fontSize: 16,
    color: '#1f2937',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 8,
  },
  sendButton: {
    marginTop: 32,
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 