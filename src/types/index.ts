export interface User {
  id: string;
  name?: string;
  deviceToken?: string;
  lastActive: Date;
  points: number;
  level: number;
  partnerId: string | null;
}

export interface Challenge {
  id: string;
  type: 'daily' | 'surprise' | 'custom';
  prompt: string;
  description?: string;
  points: number;
  completedBy: string[];
  timestamp: Date;
  dueDate?: Date;
}

export interface GalleryEntry {
  id: string;
  userId: string;
  userName: string;
  imageUrl: string;
  note: string;
  date: Date;
  likes: number;
}

export interface Heartbeat {
  id: string;
  message: string;
  scheduledTime: Date;
  sent: boolean;
  type: 'love' | 'reminder' | 'surprise';
  senderId: string;
  senderName: string;
  recipientId: string;
  timestamp?: Date;
}

export interface DailyScore {
  date: string;
  points: number;
  challengesCompleted: number;
  heartbeatsSent: number;
}

export interface AppSettings {
  notifications: boolean;
  dailyReminderTime: string;
  theme: 'light' | 'dark' | 'auto';
  soundEnabled: boolean;
}

export interface SurpriseWheel {
  id: string;
  title: string;
  options: string[];
  lastSpun?: Date;
}

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
  sound?: boolean;
} 