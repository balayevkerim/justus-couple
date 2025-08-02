import { User, Challenge, GalleryEntry, Heartbeat, SurpriseWheel } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Karim',
    deviceToken: 'mock-device-token-1',
    lastActive: new Date(),
    points: 1250,
    level: 8,
    partnerId: 'user2'
  },
  {
    id: 'user2',
    name: 'Wife',
    deviceToken: 'mock-device-token-2',
    lastActive: new Date(),
    points: 1180,
    level: 7,
    partnerId: 'user1'
  }
];

// Mock Challenges
export const mockChallenges: Challenge[] = [
  {
    id: 'challenge1',
    type: 'daily',
    prompt: 'Send a sweet morning message',
    description: 'Start your partner\'s day with love',
    points: 50,
    completedBy: ['user1'],
    timestamp: new Date(),
  },
  {
    id: 'challenge2',
    type: 'daily',
    prompt: 'Cook dinner together',
    description: 'Share a romantic cooking experience',
    points: 75,
    completedBy: [],
    timestamp: new Date(),
  },
  {
    id: 'challenge3',
    type: 'surprise',
    prompt: 'Plan a surprise date night',
    description: 'Create a magical evening for your love',
    points: 100,
    completedBy: [],
    timestamp: new Date(),
  },
  {
    id: 'challenge4',
    type: 'daily',
    prompt: 'Give 3 genuine compliments',
    description: 'Make your partner feel special',
    points: 30,
    completedBy: ['user2'],
    timestamp: new Date(),
  },
  {
    id: 'challenge5',
    type: 'surprise',
    prompt: 'Write a love letter',
    description: 'Express your feelings in writing',
    points: 80,
    completedBy: [],
    timestamp: new Date(),
  }
];

// Mock Gallery Entries
export const mockGalleryEntries: GalleryEntry[] = [
  {
    id: 'gallery1',
    userId: 'user1',
    userName: 'Karim',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    note: 'Our first date at the beach ❤️',
    date: new Date('2024-01-15'),
    likes: 2
  },
  {
    id: 'gallery2',
    userId: 'user2',
    userName: 'Wife',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    note: 'Coffee date morning ☕️',
    date: new Date('2024-01-14'),
    likes: 2
  },
  {
    id: 'gallery3',
    userId: 'user1',
    userName: 'Karim',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    note: 'Movie night with popcorn 🍿',
    date: new Date('2024-01-13'),
    likes: 2
  }
];

// Mock Heartbeats
export const mockHeartbeats: Heartbeat[] = [
  {
    id: 'heartbeat1',
    message: 'Good morning, my love! 💕',
    scheduledTime: new Date(),
    sent: true,
    type: 'love'
  },
  {
    id: 'heartbeat2',
    message: 'Time for our daily challenge! 🎯',
    scheduledTime: new Date(),
    sent: false,
    type: 'reminder'
  },
  {
    id: 'heartbeat3',
    message: 'I miss you! Can\'t wait to see you tonight 😘',
    scheduledTime: new Date(),
    sent: true,
    type: 'love'
  }
];

// Mock Surprise Wheel
export const mockSurpriseWheel: SurpriseWheel = {
  id: 'wheel1',
  title: 'Today\'s Surprise',
  options: [
    'Give a massage',
    'Cook favorite meal',
    'Watch sunset together',
    'Dance in the living room',
    'Write a poem',
    'Plan weekend getaway',
    'Give 10 kisses',
    'Share childhood story'
  ],
  lastSpun: new Date('2024-01-14')
};

// Mock Daily Scores
export const mockDailyScores = [
  { date: '2024-01-15', points: 150, challengesCompleted: 2, heartbeatsSent: 3 },
  { date: '2024-01-14', points: 120, challengesCompleted: 1, heartbeatsSent: 2 },
  { date: '2024-01-13', points: 200, challengesCompleted: 3, heartbeatsSent: 4 },
  { date: '2024-01-12', points: 80, challengesCompleted: 1, heartbeatsSent: 1 },
  { date: '2024-01-11', points: 180, challengesCompleted: 2, heartbeatsSent: 3 },
]; 