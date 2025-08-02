import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  Clipboard,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { generateConnectionCode, validateAndConnect } from '../services/firebaseService';

export default function PartnerConnectionScreen() {
  const navigation = useNavigation();
  const { state, dispatch } = useApp();
  const [connectionCode, setConnectionCode] = useState('');
  const [myCode, setMyCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('');

  useEffect(() => {
    // Only generate code if user doesn't have a partner
    if (!state.currentUser?.partnerId) {
      generateMyCode();
    } else {
      // User already has a partner, show connection status and redirect
      setConnectionStatus('Connected with partner! Redirecting...');
      setTimeout(() => {
        navigation.navigate('MainApp' as never);
      }, 2000);
    }
  }, [state.currentUser?.id]); // Only depend on user ID, not partnerId

  const generateMyCode = async () => {
    if (!state.currentUser?.id) return;
    
    setIsGenerating(true);
    try {
      const code = await generateConnectionCode(state.currentUser.id);
      setMyCode(code);
    } catch (error) {
      console.error('Error generating code:', error);
      Alert.alert('Error', 'Failed to generate connection code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    await Clipboard.setString(myCode);
    Alert.alert('Copied!', 'Connection code copied to clipboard');
  };

  const handleConnect = async () => {
    if (!connectionCode.trim()) {
      Alert.alert('Error', 'Please enter a connection code');
      return;
    }

    if (!state.currentUser?.id) {
      Alert.alert('Error', 'User not found');
      return;
    }

    setIsConnecting(true);
    setConnectionStatus('Connecting with partner...');
    
    try {
      const result = await validateAndConnect(connectionCode, state.currentUser.id);
      
      setConnectionStatus('Connection successful! Redirecting...');
      
      // The real-time listener will automatically update the user state
      // and trigger navigation via the useEffect above
      
      setTimeout(() => {
        navigation.navigate('MainApp' as never);
      }, 2000);
      
    } catch (error: any) {
      console.error('Connection error:', error);
      setConnectionStatus('');
      Alert.alert('Connection Failed', error.message || 'Failed to connect. Please check the code and try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Connection',
      'You can connect with your partner later from settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Skip', onPress: () => {
          // Update user state to indicate they skipped connection
          if (state.currentUser) {
            const updatedUser = { 
              ...state.currentUser,
              partnerId: null
            };
            dispatch({ 
              type: 'SET_CURRENT_USER', 
              payload: updatedUser
            });
            
            // Navigate to main app
            navigation.navigate('MainApp' as never);
          }
        }},
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Debug Info */}
      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>
          User ID: {state.currentUser?.id?.substring(0, 8)}...
        </Text>
        <Text style={styles.debugText}>
          Partner ID: {state.currentUser?.partnerId?.substring(0, 8) || 'None'}...
        </Text>
        <Text style={styles.debugText}>
          Real-time: Active
        </Text>
      </View>
      
      {/* Connection Status */}
      {connectionStatus ? (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{connectionStatus}</Text>
        </View>
      ) : null}
      
      <View style={styles.header}>
        <Ionicons name="people" size={64} color="#ef4444" />
        <Text style={styles.title}>Connect with Partner 💕</Text>
        <Text style={styles.subtitle}>
          Share your connection code with your partner to start your journey together
        </Text>
      </View>

      {/* My Connection Code */}
      <View style={styles.codeSection}>
        <Text style={styles.sectionTitle}>Your Connection Code</Text>
        <View style={styles.codeContainer}>
          <Text style={styles.codeText}>
            {isGenerating ? 'Generating...' : myCode}
          </Text>
          <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton} disabled={isGenerating}>
            <Ionicons name="copy-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
        <Text style={styles.codeHint}>
          Share this code with your partner
        </Text>
        <TouchableOpacity onPress={generateMyCode} style={styles.regenerateButton} disabled={isGenerating}>
          <Text style={styles.regenerateText}>
            {isGenerating ? 'Generating...' : 'Generate New Code'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Enter Partner's Code */}
      <View style={styles.connectSection}>
        <Text style={styles.sectionTitle}>Enter Partner's Code</Text>
        <TextInput
          value={connectionCode}
          onChangeText={setConnectionCode}
          placeholder="Enter 6-digit code"
          style={styles.input}
          maxLength={6}
          autoCapitalize="characters"
          editable={!isConnecting}
        />
        <TouchableOpacity 
          onPress={handleConnect} 
          style={[styles.connectButton, isConnecting && styles.buttonDisabled]}
          disabled={isConnecting}
        >
          <Text style={styles.connectButtonText}>
            {isConnecting ? 'Connecting...' : 'Connect'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Skip Option */}
      <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>How it works:</Text>
        <Text style={styles.instructionsText}>
          1. Share your code with your partner{'\n'}
          2. Ask them to enter your code in their app{'\n'}
          3. You'll be connected instantly!{'\n'}
          4. Start sharing memories and challenges
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  codeSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  codeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ef4444',
    letterSpacing: 2,
  },
  copyButton: {
    padding: 8,
  },
  codeHint: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  connectSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 16,
  },
  connectButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  connectButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    alignItems: 'center',
    marginBottom: 30,
  },
  skipText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
  },
  instructions: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#3b82f6',
    lineHeight: 20,
  },
  regenerateButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  regenerateText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  statusContainer: {
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    textAlign: 'center',
  },
  debugInfo: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  debugText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
}); 