import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useApp } from '../context/AppContext';

export default function ChallengeDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { state, dispatch } = useApp();
  const [note, setNote] = useState('');

  const challengeId = (route.params as any)?.challengeId;
  const challenge = state.challenges.find(c => c.id === challengeId);

  if (!challenge) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="trophy-outline" size={64} color="#6b7280" />
        <Text style={styles.emptyText}>No active challenges</Text>
      </View>
    );
  }

  const isCompleted = challenge.completedBy.includes(state.currentUser?.id || '');

  const handleComplete = () => {
    if (isCompleted) {
      Alert.alert('Already Completed', 'You have already completed this challenge!');
      return;
    }

    dispatch({ type: 'COMPLETE_CHALLENGE', payload: challenge.id });
    Alert.alert('Challenge Completed! 🎉', 'Great job! Points added to your score.');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Challenge Header */}
        <View style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <View style={styles.challengeIcon}>
              <Ionicons name="trophy" size={24} color="white" />
            </View>
            <View style={styles.challengeInfo}>
              <Text style={styles.challengeType}>
                {challenge.type === 'daily' ? 'Daily Challenge' : 'Special Challenge'}
              </Text>
              <Text style={styles.challengePoints}>
                +{challenge.points} points
              </Text>
            </View>
          </View>
          
          <Text style={styles.challengeTitle}>
            {challenge.prompt}
          </Text>
          
          <Text style={styles.challengeDescription}>
            {challenge.description}
          </Text>
        </View>

        {/* Progress Section */}
        <View style={styles.progressCard}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <View style={styles.progressRow}>
            <Text style={styles.progressText}>
              {challenge.completedBy.length}/2 completed
            </Text>
            <View style={styles.progressAvatars}>
              {state.currentUser && (
                <View style={[
                  styles.avatar,
                  challenge.completedBy.includes(state.currentUser.id) && styles.completedAvatar
                ]}>
                  <Text style={styles.avatarText}>
                    {state.currentUser.name.charAt(0)}
                  </Text>
                </View>
              )}
              {state.partner && (
                <View style={[
                  styles.avatar,
                  challenge.completedBy.includes(state.partner.id) && styles.completedAvatar
                ]}>
                  <Text style={styles.avatarText}>
                    {state.partner.name.charAt(0)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Note Section */}
        <View style={styles.noteCard}>
          <Text style={styles.sectionTitle}>Add a Note (Optional)</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Share your thoughts about this challenge..."
            multiline
            numberOfLines={4}
            style={styles.noteInput}
          />
        </View>

        {/* Complete Button */}
        <TouchableOpacity
          onPress={handleComplete}
          style={[
            styles.completeButton,
            isCompleted && styles.completedButton
          ]}
          disabled={isCompleted}
        >
          <Text style={[
            styles.completeButtonText,
            isCompleted && styles.completeButtonText
          ]}>
            {isCompleted ? 'Completed ✓' : 'Mark as Complete'}
          </Text>
        </TouchableOpacity>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb-outline" size={24} color="#3b82f6" />
            <View style={styles.tipsContent}>
              <Text style={styles.tipsTitle}>Tips</Text>
              <Text style={styles.tipsText}>
                • Take your time with this challenge{'\n'}
                • Be creative and thoughtful{'\n'}
                • Share your experience with your partner{'\n'}
                • Have fun and enjoy the process!
              </Text>
            </View>
          </View>
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
  emptyContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 18,
    marginTop: 16,
  },
  content: {
    padding: 16,
  },
  challengeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  challengeIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#ef4444',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeType: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  challengePoints: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: 18,
  },
  challengeTitle: {
    color: '#1f2937',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  challengeDescription: {
    color: '#6b7280',
    fontSize: 16,
    lineHeight: 24,
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    color: '#1f2937',
    fontWeight: '600',
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressText: {
    color: '#6b7280',
  },
  progressAvatars: {
    flexDirection: 'row',
  },
  avatar: {
    width: 32,
    height: 32,
    backgroundColor: '#d1d5db',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  completedAvatar: {
    backgroundColor: '#10b981',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  noteCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    color: '#1f2937',
    textAlignVertical: 'top',
  },
  completeButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  completedButton: {
    backgroundColor: '#10b981',
  },
  completeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  tipsCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipsContent: {
    marginLeft: 12,
    flex: 1,
  },
  tipsTitle: {
    color: '#1e40af',
    fontWeight: '500',
    marginBottom: 4,
  },
  tipsText: {
    color: '#3b82f6',
    fontSize: 14,
  },
}); 