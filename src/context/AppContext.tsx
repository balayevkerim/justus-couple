import React, { createContext, useContext, useReducer, ReactNode, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Challenge, GalleryEntry, AppSettings } from '../types';
import { mockUsers, mockChallenges, mockGalleryEntries } from '../data/mockData';
import { subscribeToUserUpdates, subscribeToPartnerUpdates } from '../services/firebaseService';

interface AppState {
  currentUser: User | null;
  partner: User | null;
  challenges: Challenge[];
  galleryEntries: GalleryEntry[];
  settings: AppSettings;
  isLoading: boolean;
}

type AppAction =
  | { type: 'SET_CURRENT_USER'; payload: User }
  | { type: 'SET_PARTNER'; payload: User }
  | { type: 'UPDATE_CHALLENGES'; payload: Challenge[] }
  | { type: 'COMPLETE_CHALLENGE'; payload: string }
  | { type: 'ADD_GALLERY_ENTRY'; payload: GalleryEntry }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_USER_DATA' };

const initialState: AppState = {
  currentUser: null, // Start with no user logged in
  partner: mockUsers[1], // Default to second user for testing
  challenges: mockChallenges,
  galleryEntries: mockGalleryEntries,
  settings: {
    notifications: true,
    dailyReminderTime: '09:00',
    theme: 'light',
    soundEnabled: true,
  },
  isLoading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_PARTNER':
      return { ...state, partner: action.payload };
    case 'UPDATE_CHALLENGES':
      return { ...state, challenges: action.payload };
    case 'COMPLETE_CHALLENGE':
      return {
        ...state,
        challenges: state.challenges.map(challenge =>
          challenge.id === action.payload
            ? { ...challenge, completedBy: [...challenge.completedBy, state.currentUser?.id || ''] }
            : challenge
        ),
      };
    case 'ADD_GALLERY_ENTRY':
      return {
        ...state,
        galleryEntries: [action.payload, ...state.galleryEntries],
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'CLEAR_USER_DATA':
      return { ...state, currentUser: null, partner: null };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const userUnsubscribeRef = useRef<(() => void) | null>(null);
  const partnerUnsubscribeRef = useRef<(() => void) | null>(null);

  // Load user data from AsyncStorage on app start
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('currentUser');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('Loaded user from AsyncStorage:', userData);
          dispatch({ type: 'SET_CURRENT_USER', payload: userData });
        }
      } catch (error) {
        console.error('Error loading user data from AsyncStorage:', error);
      }
    };

    loadUserData();
  }, []);

  // Save user data to AsyncStorage when it changes
  useEffect(() => {
    const saveUserData = async () => {
      if (state.currentUser) {
        try {
          await AsyncStorage.setItem('currentUser', JSON.stringify(state.currentUser));
          console.log('Saved user to AsyncStorage:', state.currentUser);
        } catch (error) {
          console.error('Error saving user data to AsyncStorage:', error);
        }
      } else {
        try {
          await AsyncStorage.removeItem('currentUser');
          console.log('Removed user from AsyncStorage');
        } catch (error) {
          console.error('Error removing user data from AsyncStorage:', error);
        }
      }
    };

    saveUserData();
  }, [state.currentUser]);

  // Set up real-time listeners when user changes
  useEffect(() => {
    // Clean up previous listeners
    if (userUnsubscribeRef.current) {
      userUnsubscribeRef.current();
      userUnsubscribeRef.current = null;
    }
    if (partnerUnsubscribeRef.current) {
      partnerUnsubscribeRef.current();
      partnerUnsubscribeRef.current = null;
    }

    // Set up new listeners if user exists
    if (state.currentUser?.id) {
      console.log('Setting up real-time listeners for user:', state.currentUser.id);
      
      // Always listen to current user updates (even when partnerId is null)
      userUnsubscribeRef.current = subscribeToUserUpdates(state.currentUser.id, (userData) => {
        if (userData) {
          console.log('Real-time user update received in context:', userData);
          dispatch({ type: 'SET_CURRENT_USER', payload: userData });
          
          // If user now has a partner, set up partner listener
          if (userData.partnerId && !partnerUnsubscribeRef.current) {
            console.log('User now has partner, setting up partner listener for:', userData.partnerId);
            partnerUnsubscribeRef.current = subscribeToPartnerUpdates(userData.partnerId, (partnerData) => {
              if (partnerData) {
                console.log('Real-time partner update received in context:', partnerData);
                dispatch({ type: 'SET_PARTNER', payload: partnerData });
              }
            });
          }
        }
      });

      // Listen to partner updates if user already has a partner
      if (state.currentUser.partnerId) {
        console.log('Setting up partner listener for:', state.currentUser.partnerId);
        partnerUnsubscribeRef.current = subscribeToPartnerUpdates(state.currentUser.partnerId, (partnerData) => {
          if (partnerData) {
            console.log('Real-time partner update received in context:', partnerData);
            dispatch({ type: 'SET_PARTNER', payload: partnerData });
          }
        });
      }
    }

    // Cleanup function
    return () => {
      if (userUnsubscribeRef.current) {
        userUnsubscribeRef.current();
      }
      if (partnerUnsubscribeRef.current) {
        partnerUnsubscribeRef.current();
      }
    };
  }, [state.currentUser?.id]); // Only depend on user ID, not partnerId

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 