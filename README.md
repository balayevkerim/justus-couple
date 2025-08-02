# Just Us 💕

A playful love game app for couples to enhance romance and joy through daily interactions, shared memories, and surprise messages.


Currently authentication with firebase and connect with Partner feature has been implemented, so they will be connected and can interact with each other moving forward.

## Planned Features

### 🏠 Home Dashboard
- Daily progress tracking with points and statistics
- Today's challenge display
- Interactive surprise wheel for random activities
- Partner status and activity indicators
- Quick access to main features

### 🎯 Daily Challenges
- Personalized daily tasks to strengthen your relationship
- Point-based reward system
- Progress tracking for both partners
- Challenge completion with optional notes

### 📸 Shared Gallery
- Photo and note sharing between partners
- Chronological memory timeline
- Like and comment system
- Easy photo capture and upload

### ⚙️ Settings & Customization
- Notification preferences
- Sound effects toggle
- Daily reminder scheduling
- Theme customization
- User profile management

### 🔔 Push Notifications
- Daily love reminders
- Challenge notifications
- Surprise heartbeats
- Partner activity alerts

## Tech Stack

### Frontend
- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for routing
- **Expo Vector Icons** for beautiful icons

### Backend
- **Firebase Firestore** for real-time database
- **Firebase Authentication** for user management
- **Firebase Cloud Messaging** for push notifications
- **Firebase Storage** for image uploads

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd just-us-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Enable Authentication
   - Enable Cloud Messaging
   - Get your Firebase config and update `src/config/firebase.ts`

4. **Configure Firebase**
   ```typescript
   // src/config/firebase.ts
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

5. **Run the app**
   ```bash
   # Start Expo development server
   npm start
   
   # Run on iOS
   npm run ios
   
   # Run on Android
   npm run android
   
   # Run on web
   npm run web
   ```

## Project Structure

```
just-us-app/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # App screens
│   ├── navigation/         # Navigation configuration
│   ├── context/           # React Context for state management
│   ├── services/          # Firebase and API services
│   ├── types/             # TypeScript type definitions
│   ├── data/              # Mock data and constants
│   └── config/            # Configuration files
├── assets/                # Images, fonts, etc.
├── App.tsx               # Main app component
├── babel.config.js       # Babel configuration
├── metro.config.js       # Metro bundler configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── package.json          # Dependencies and scripts
```

## Mock Data

The app comes with pre-loaded mock data for testing:

- **Users**: Karim and Wife (demo users)
- **Challenges**: 5 sample daily and surprise challenges
- **Gallery**: 3 sample photo entries
- **Heartbeats**: Sample love messages
- **Scores**: Daily progress tracking

## Firebase Collections

### Users
```typescript
{
  id: string;
  name: string;
  deviceToken?: string;
  lastActive: Date;
  points: number;
  level: number;
  partnerId: string;
}
```

### Challenges
```typescript
{
  id: string;
  type: 'daily' | 'surprise' | 'custom';
  prompt: string;
  description?: string;
  points: number;
  completedBy: string[];
  timestamp: Date;
  dueDate?: Date;
}
```

### Gallery Entries
```typescript
{
  id: string;
  userId: string;
  userName: string;
  imageUrl: string;
  note: string;
  date: Date;
  likes: number;
}
```

### Heartbeats
```typescript
{
  id: string;
  message: string;
  scheduledTime: Date;
  sent: boolean;
  type: 'love' | 'reminder' | 'surprise';
}
```

## Customization

### Adding New Challenges
1. Update the mock data in `src/data/mockData.ts`
2. Add new challenge types in `src/types/index.ts`
3. Implement challenge logic in `src/services/firebaseService.ts`

### Customizing Themes
1. Modify colors in `tailwind.config.js`
2. Update theme variables in `src/context/AppContext.tsx`
3. Apply new styles throughout the app

### Adding Features
1. Create new screens in `src/screens/`
2. Add navigation routes in `src/navigation/AppNavigator.tsx`
3. Update types in `src/types/index.ts`
4. Implement Firebase services in `src/services/firebaseService.ts`

## Deployment

### Expo Build
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

### Firebase Deployment
1. Set up Firebase hosting
2. Configure build settings
3. Deploy to Firebase

Made with ❤️ for couples who want to strengthen their relationship through playful interactions and shared memories. 