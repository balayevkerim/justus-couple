import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { state, dispatch } = useApp();
  const [notifications, setNotifications] = useState(state.settings.notifications);
  const [soundEnabled, setSoundEnabled] = useState(state.settings.soundEnabled);

  const handleSettingChange = (setting: string, value: any) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [setting]: value } });
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              dispatch({ type: 'CLEAR_USER_DATA' });
              console.log('User signed out successfully');
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const settingsItems = [
    {
      title: 'Notifications',
      description: 'Get daily reminders and updates',
      type: 'switch',
      value: notifications,
      onValueChange: (value: boolean) => {
        setNotifications(value);
        handleSettingChange('notifications', value);
      },
    },
    {
      title: 'Sound Effects',
      description: 'Play sounds for interactions',
      type: 'switch',
      value: soundEnabled,
      onValueChange: (value: boolean) => {
        setSoundEnabled(value);
        handleSettingChange('soundEnabled', value);
      },
    },
  ];

  const renderSettingItem = (item: any) => (
    <View key={item.title} style={styles.settingItem}>
      <View style={styles.settingContent}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>
            {item.title}
          </Text>
          <Text style={styles.settingDescription}>
            {item.description}
          </Text>
        </View>
        {item.type === 'switch' && (
          <Switch
            value={item.value}
            onValueChange={item.onValueChange}
            trackColor={{ false: '#d1d5db', true: '#ef4444' }}
            thumbColor={item.value ? '#ffffff' : '#f3f4f6'}
          />
        )}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Settings ⚙️
        </Text>
        
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileInitial}>
                {state.currentUser?.name?.charAt(0) || 'U'}
              </Text>
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>
                {state.currentUser?.name}
              </Text>
              <Text style={styles.profileLevel}>
                Level {state.currentUser?.level}
              </Text>
              <Text style={styles.profilePoints}>
                {state.currentUser?.points} points
              </Text>
            </View>
          </View>
        </View>

        {/* Partner Connection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Partner
          </Text>
          
          {state.currentUser?.partnerId ? (
            <TouchableOpacity style={styles.supportItem}>
              <View style={styles.supportContent}>
                <Ionicons name="people" size={24} color="#10b981" />
                <Text style={styles.supportText}>Connected with Partner</Text>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.supportItem}
              onPress={() => navigation.navigate('PartnerConnection' as never)}
            >
              <View style={styles.supportContent}>
                <Ionicons name="people-outline" size={24} color="#ef4444" />
                <Text style={styles.supportText}>Connect with Partner</Text>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            App Settings
          </Text>
          {settingsItems.map(renderSettingItem)}
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Support
          </Text>
          
          <TouchableOpacity style={styles.supportItem}>
            <View style={styles.supportContent}>
              <Ionicons name="help-circle-outline" size={24} color="#6b7280" />
              <Text style={styles.supportText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.supportItem}>
            <View style={styles.supportContent}>
              <Ionicons name="information-circle-outline" size={24} color="#6b7280" />
              <Text style={styles.supportText}>About Just Us</Text>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <View style={styles.signOutContent}>
            <Ionicons name="log-out-outline" size={24} color="#dc2626" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 64,
    height: 64,
    backgroundColor: '#ec4899',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInitial: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    color: '#1f2937',
    fontWeight: '600',
    fontSize: 18,
  },
  profileLevel: {
    color: '#6b7280',
    fontSize: 14,
  },
  profilePoints: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  settingItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    color: '#1f2937',
    fontWeight: '500',
    fontSize: 16,
  },
  settingDescription: {
    color: '#6b7280',
    fontSize: 14,
  },
  supportItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  supportContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportText: {
    color: '#1f2937',
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
  signOutButton: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  signOutContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signOutText: {
    color: '#dc2626',
    fontWeight: '500',
    marginLeft: 12,
  },
}); 