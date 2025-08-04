import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Context
import { useApp } from '../context/AppContext';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ChallengesScreen from '../screens/ChallengesScreen';
import GalleryScreen from '../screens/GalleryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';
import PartnerConnectionScreen from '../screens/PartnerConnectionScreen';
import ChallengeDetailScreen from '../screens/ChallengeDetailScreen';
import AddGalleryEntryScreen from '../screens/AddGalleryEntryScreen';
import SendHeartbeatScreen from '../screens/SendHeartbeatScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ChallengeDetail" 
        component={ChallengeDetailScreen}
        options={{ title: 'Daily Challenge' }}
      />
      <Stack.Screen 
        name="SendHeartbeat" 
        component={SendHeartbeatScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function GalleryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="GalleryMain" 
        component={GalleryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="AddGalleryEntry" 
        component={AddGalleryEntryScreen}
        options={{ title: 'Add Memory' }}
      />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Challenges') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Gallery') {
            iconName = focused ? 'images' : 'images-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ef4444',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
        },
        headerStyle: {
          backgroundColor: '#ef4444',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Challenges" 
        component={ChallengesScreen}
        options={{ title: 'Daily Challenges' }}
      />
      <Tab.Screen 
        name="Gallery" 
        component={GalleryStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { state } = useApp();
  
  // Create a key based on the current state to force re-rendering
  const navigationKey = state.currentUser 
    ? (state.currentUser.partnerId !== null ? 'main' : 'connection')
    : 'login';
  
  // Determine initial route name
  const initialRouteName = state.currentUser 
    ? (state.currentUser.partnerId !== null ? 'MainApp' : 'PartnerConnection')
    : 'Login';
  
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }} 
        key={navigationKey}
        initialRouteName={initialRouteName}
      >
        {state.currentUser ? (
          // User is logged in - show both screens
          <>
            <Stack.Screen 
              name="MainApp" 
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="PartnerConnection" 
              component={PartnerConnectionScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          // User is not logged in - show login screen
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
} 