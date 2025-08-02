import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function ChallengesScreen() {
  const { state, dispatch } = useApp();

  const completeChallenge = (challengeId: string) => {
    dispatch({ type: 'COMPLETE_CHALLENGE', payload: challengeId });
  };

  const isCompleted = (challengeId: string) => {
    return state.challenges
      .find(c => c.id === challengeId)
      ?.completedBy.includes(state.currentUser?.id || '') || false;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Daily Challenges 🎯
        </Text>
        
        {state.challenges.map((challenge) => (
          <View
            key={challenge.id}
            style={[
              styles.challengeCard,
              isCompleted(challenge.id) && styles.completedCard
            ]}
          >
            <View style={styles.challengeHeader}>
              <View style={styles.challengeInfo}>
                <Ionicons 
                  name={challenge.type === 'daily' ? 'calendar' : 'star'} 
                  size={20} 
                  color="#ef4444" 
                />
                <Text style={styles.challengeType}>
                  {challenge.type === 'daily' ? 'Daily' : 'Special'}
                </Text>
              </View>
              <Text style={styles.challengePoints}>
                +{challenge.points} pts
              </Text>
            </View>
            
            <Text style={styles.challengeTitle}>
              {challenge.prompt}
            </Text>
            
            <Text style={styles.challengeDescription}>
              {challenge.description}
            </Text>
            
            <View style={styles.challengeFooter}>
              <Text style={styles.challengeDate}>
                Due: {challenge.dueDate?.toLocaleDateString() || 'Today'}
              </Text>
              
              <View style={styles.completionStatus}>
                {isCompleted(challenge.id) ? (
                  <View style={styles.completedStatus}>
                    <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                    <Text style={styles.completedText}>
                      Completed
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => completeChallenge(challenge.id)}
                    style={styles.completeButton}
                  >
                    <Text style={styles.completeButtonText}>Complete</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}
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
    marginBottom: 16,
  },
  challengeCard: {
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
  completedCard: {
    opacity: 0.7,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  challengeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeType: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  challengePoints: {
    color: '#ef4444',
    fontWeight: '600',
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
    marginBottom: 12,
  },
  challengeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  challengeDate: {
    color: '#6b7280',
    fontSize: 12,
  },
  completionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  completeButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  completeButtonText: {
    color: 'white',
    fontWeight: '500',
  },
}); 