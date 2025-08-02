import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { mockSurpriseWheel, mockDailyScores } from '../data/mockData';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const { state } = useApp();
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const currentUser = state.currentUser;
  const partner = state.partner;
  const todayScore = mockDailyScores[0];

  // Check if user has a partner
  const hasPartner = currentUser?.partnerId && partner;

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const randomIndex = Math.floor(Math.random() * mockSurpriseWheel.options.length);
    const result = mockSurpriseWheel.options[randomIndex];
    
    setTimeout(() => {
      setLastResult(result);
      setIsSpinning(false);
      Alert.alert('Surprise! 🎉', result, [{ text: 'OK' }]);
    }, 2000);
  };

  const getCurrentChallenge = () => {
    return state.challenges.find(challenge => 
      challenge.type === 'daily' && 
      !challenge.completedBy.includes(currentUser?.id || '')
    );
  };

  const currentChallenge = getCurrentChallenge();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#ef4444', '#dc2626']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>
              Welcome back, {currentUser?.name}! 💕
            </Text>
            <Text style={styles.levelText}>
              Level {currentUser?.level} • {currentUser?.points} points
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings' as never)}
            style={styles.settingsButton}
          >
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Today's Score */}
      <View style={styles.scoreCard}>
        <Text style={styles.cardTitle}>
          Today's Progress 📊
        </Text>
        <View style={styles.scoreRow}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreNumber}>
              {todayScore.points}
            </Text>
            <Text style={styles.scoreLabel}>Points</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreNumber, { color: '#d946ef' }]}>
              {todayScore.challengesCompleted}
            </Text>
            <Text style={styles.scoreLabel}>Challenges</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreNumber, { color: '#10b981' }]}>
              {todayScore.heartbeatsSent}
            </Text>
            <Text style={styles.scoreLabel}>Heartbeats</Text>
          </View>
        </View>
      </View>

      {/* Daily Challenge */}
      {currentChallenge && (
        <TouchableOpacity
          onPress={() => navigation.navigate('ChallengeDetail' as never)}
          style={styles.challengeCard}
        >
          <View style={styles.challengeContent}>
            <View style={styles.challengeText}>
              <Text style={styles.challengeTitle}>
                Today's Challenge 🎯
              </Text>
              <Text style={styles.challengeDescription}>
                {currentChallenge.prompt}
              </Text>
              <Text style={styles.challengePoints}>
                +{currentChallenge.points} points
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#6b7280" />
          </View>
        </TouchableOpacity>
      )}

      {/* Surprise Wheel */}
      <View style={styles.wheelCard}>
        <Text style={styles.cardTitle}>
          Surprise Wheel 🎡
        </Text>
        <TouchableOpacity
          onPress={spinWheel}
          disabled={isSpinning}
          style={[
            styles.wheelButton,
            isSpinning && styles.wheelButtonDisabled
          ]}
        >
          {isSpinning ? (
            <Text style={styles.wheelButtonText}>Spinning...</Text>
          ) : (
            <View style={styles.wheelContent}>
              <Ionicons name="refresh" size={32} color="white" />
              <Text style={styles.wheelButtonText}>
                Spin for Surprise!
              </Text>
            </View>
          )}
        </TouchableOpacity>
        {lastResult && (
          <Text style={styles.lastResult}>
            Last: {lastResult}
          </Text>
        )}
      </View>

      {/* Partner Status */}
      <View style={styles.partnerCard}>
        <Text style={styles.cardTitle}>
          {hasPartner ? `${partner?.name} 💝` : 'Connect with Partner 💕'}
        </Text>
        {hasPartner ? (
          <View style={styles.partnerContent}>
            <View style={styles.partnerInfo}>
              <View style={styles.partnerAvatar}>
                <Text style={styles.partnerInitial}>
                  {partner?.name?.charAt(0)}
                </Text>
              </View>
              <View>
                <Text style={styles.partnerName}>
                  Level {partner?.level}
                </Text>
                <Text style={styles.partnerPoints}>
                  {partner?.points} points
                </Text>
              </View>
            </View>
            <View style={styles.partnerStatus}>
              <View style={styles.onlineIndicator}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Online</Text>
              </View>
              <Text style={styles.lastActive}>
                Last active: 2m ago
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.noPartnerContent}>
            <Ionicons name="people-outline" size={48} color="#6b7280" />
            <Text style={styles.noPartnerText}>
              Connect with your partner to start sharing memories and challenges together!
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('PartnerConnection' as never)}
              style={styles.connectPartnerButton}
            >
              <Text style={styles.connectPartnerButtonText}>Connect Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.cardTitle}>
          Quick Actions ⚡
        </Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Gallery' as never)}
            style={styles.actionButton}
          >
            <Ionicons name="images-outline" size={24} color="#ef4444" />
            <Text style={styles.actionText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Challenges' as never)}
            style={styles.actionButton}
          >
            <Ionicons name="trophy-outline" size={24} color="#ef4444" />
            <Text style={styles.actionText}>Challenges</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  levelText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  settingsButton: {
    padding: 8,
  },
  scoreCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  scoreLabel: {
    color: '#6b7280',
    fontSize: 14,
  },
  challengeCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  challengeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  challengeText: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  challengeDescription: {
    color: '#6b7280',
    fontSize: 14,
  },
  challengePoints: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  wheelCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  wheelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 128,
    borderRadius: 64,
    marginHorizontal: 32,
    backgroundColor: '#ec4899',
  },
  wheelButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  wheelContent: {
    alignItems: 'center',
  },
  wheelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  lastResult: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
    marginTop: 8,
  },
  partnerCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  partnerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    color: '#1f2937',
    fontWeight: '500',
  },
  partnerPoints: {
    color: '#6b7280',
    fontSize: 14,
  },
  partnerStatus: {
    alignItems: 'flex-end',
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    backgroundColor: '#10b981',
    borderRadius: 4,
    marginRight: 4,
  },
  onlineText: {
    color: '#10b981',
    fontSize: 14,
  },
  lastActive: {
    color: '#6b7280',
    fontSize: 12,
  },
  noPartnerContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noPartnerText: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
    lineHeight: 22,
  },
  connectPartnerButton: {
    backgroundColor: '#ec4899',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  connectPartnerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionText: {
    color: '#1f2937',
    fontWeight: '500',
    marginTop: 4,
  },
}); 