import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { createUser, getUser } from '../services/firebaseService';

export default function LoginScreen() {
  const { dispatch } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        // Sign up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Create user profile in Firestore
        const userData = {
          id: user.uid,
          email: user.email,
          name: email.split('@')[0], // Use email prefix as name
          points: 0,
          level: 1,
          partnerId: null, // No partner yet
          lastActive: new Date(),
        };
        
        console.log('LoginScreen - Sign up user data:', userData);
        console.log('LoginScreen - Firebase Auth UID:', user.uid);
        await createUser(userData);
        dispatch({ type: 'SET_CURRENT_USER', payload: userData });
        Alert.alert('Success! 💕', 'Account created! Now connect with your partner.');
      } else {
        // Sign in
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log('LoginScreen - Sign in user:', user);
        // Get user data from Firestore
        const userData = await getUser(user.uid);
        
        console.log('LoginScreen - Firebase Auth UID (sign in):', user.uid);
        
        if (userData) {
          console.log('LoginScreen - Sign in user data:', userData);
          dispatch({ type: 'SET_CURRENT_USER', payload: userData });
          Alert.alert('Welcome back! 💕', 'Successfully logged in!');
        } else {
          // User doesn't exist in Firestore, create profile
          const newUserData = {
            id: user.uid,
            email: user.email,
            name: email.split('@')[0],
            points: 0,
            level: 1,
            partnerId: null,
            lastActive: new Date(),
          };
          
          console.log('LoginScreen - Creating new user profile:', newUserData);
          await createUser(newUserData);
          dispatch({ type: 'SET_CURRENT_USER', payload: newUserData });
          Alert.alert('Profile Created', 'Welcome! Your profile has been created.');
        }
      }
    } catch (error: any) {
      let message = 'An error occurred';
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Try signing in instead.';
      } else if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email. Try signing up.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      }
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={['#ef4444', '#dc2626']}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="heart" size={48} color="#ef4444" />
            </View>
            <Text style={styles.title}>
              Just Us
            </Text>
            <Text style={styles.subtitle}>
              A love game for two 💕
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Text>
            
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              editable={!loading}
            />
            
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
              style={styles.input}
              editable={!loading}
              returnKeyType="done"
              blurOnSubmit={true}
            />
            
            <TouchableOpacity
              onPress={handleAuth}
              style={[styles.button, loading && styles.buttonDisabled]}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setIsSignUp(!isSignUp)}
              style={styles.switchButton}
              disabled={loading}
            >
              <Text style={styles.switchText}>
                {isSignUp ? 'Already have an account? Sign In' : 'New user? Create Account'}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 96,
    height: 96,
    backgroundColor: 'white',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 18,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formTitle: {
    color: '#1f2937',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#d1d5db',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
  switchButton: {
    paddingVertical: 8,
  },
  switchText: {
    color: '#ef4444',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
}); 