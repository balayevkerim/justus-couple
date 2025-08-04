import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  deleteDoc,
  setDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { User, Challenge, GalleryEntry, Heartbeat } from '../types';

// Partner Connection Management
export const generateConnectionCode = async (userId: string) => {
  try {
    // First, check if user already has a valid code
    const existingCode = await getExistingConnectionCode(userId);
    if (existingCode) {
      return existingCode.code;
    }

    // Generate new code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Save to Firestore
    const docRef = await addDoc(collection(db, 'connectionCodes'), {
      code: code,
      userId: userId,
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      isUsed: false
    });
    
    console.log('Generated connection code:', code, 'for user:', userId);
    return code;
  } catch (error) {
    console.error('Error generating connection code:', error);
    throw error;
  }
};

export const getExistingConnectionCode = async (userId: string) => {
  try {
    const codesRef = collection(db, 'connectionCodes');
    // Simplified query - only filter by userId first
    const q = query(
      codesRef,
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    
    // Filter in memory instead of in query
    const validCode = snapshot.docs.find(doc => {
      const data = doc.data();
      return !data.isUsed && data.expiresAt.toDate() > new Date();
    });
    
    if (validCode) {
      return { id: validCode.id, ...validCode.data() } as { id: string; code: string; userId: string; createdAt: any; expiresAt: Date; isUsed: boolean };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting existing connection code:', error);
    throw error;
  }
};

export const validateAndConnect = async (enteredCode: string, currentUserId: string) => {
  try {
    console.log('Validating connection for user:', currentUserId);
    
    // Find the code in Firestore - simplified query
    const codesRef = collection(db, 'connectionCodes');
    const q = query(
      codesRef, 
      where('code', '==', enteredCode)
    );
    
    const snapshot = await getDocs(q);
    
    // Filter in memory instead of in query
    const validCode = snapshot.docs.find(doc => {
      const data = doc.data();
      return !data.isUsed && data.expiresAt.toDate() > new Date();
    });
    
    if (!validCode) {
      throw new Error('Invalid or expired code');
    }
    
    const codeData = validCode.data();
    const partnerUserId = codeData.userId;
    
    console.log('Found valid code. Partner user ID:', partnerUserId);
    
    // Prevent self-connection
    if (partnerUserId === currentUserId) {
      throw new Error('You cannot connect with yourself');
    }
    
    // Check if both users exist in Firestore, create if they don't
    const currentUserRef = doc(db, 'users', currentUserId);
    const partnerUserRef = doc(db, 'users', partnerUserId);
    
    console.log('Checking user documents...');
    console.log('Current user ref:', currentUserRef.path);
    console.log('Partner user ref:', partnerUserRef.path);
    
    const [currentUserSnap, partnerUserSnap] = await Promise.all([
      getDoc(currentUserRef),
      getDoc(partnerUserRef)
    ]);
    
    console.log('Current user exists:', currentUserSnap.exists());
    console.log('Partner user exists:', partnerUserSnap.exists());
    
    if (currentUserSnap.exists()) {
      console.log('Current user data:', currentUserSnap.data());
    }
    
    if (partnerUserSnap.exists()) {
      console.log('Partner user data:', partnerUserSnap.data());
    }
    
   /*  // Create current user if doesn't exist
    if (!currentUserSnap.exists()) {
      console.log('Creating missing user document for:', currentUserId);
      await setDoc(currentUserRef, {
        id: currentUserId,
        points: 0,
        level: 1,
        partnerId: null,
        lastActive: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
    } else {
      console.log('Current user document already exists, will update');
    } */
    
   /*  // Create partner user if doesn't exist
    if (!partnerUserSnap.exists()) {
      console.log('Creating missing user document for:', partnerUserId);
      await setDoc(partnerUserRef, {
        id: partnerUserId,
        points: 0,
        level: 1,
        partnerId: null,
        lastActive: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
    } else {
      console.log('Partner user document already exists, will update');
    } */
    
    // Update both users' partnerId
    console.log('Updating partner IDs...');
    await updateDoc(currentUserRef, {
      partnerId: partnerUserId
    });
    
    await updateDoc(partnerUserRef, {
      partnerId: currentUserId
    });
    
    // Mark code as used
    await updateDoc(doc(db, 'connectionCodes', validCode.id), {
      isUsed: true
    });
    
    console.log('Users connected successfully:', currentUserId, 'and', partnerUserId);
    return { partnerUserId };
  } catch (error) {
    console.error('Error validating and connecting:', error);
    throw error;
  }
};

export const cleanupExpiredCodes = async () => {
  try {
    const codesRef = collection(db, 'connectionCodes');
    const q = query(
      codesRef,
      where('expiresAt', '<', new Date())
    );
    
    const snapshot = await getDocs(q);
    
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    console.log('Cleaned up', snapshot.docs.length, 'expired codes');
  } catch (error) {
    console.error('Error cleaning up expired codes:', error);
    throw error;
  }
};

// User Management
export const createUser = async (userData: Partial<User>) => {
  try {
    console.log('Creating user with ID:', userData.id);
    
    // Use the user's Firebase Auth UID as the document ID
    const userRef = doc(db, 'users', userData.id!);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
    });
    
    console.log('User created successfully with ID:', userData.id);
    return userData.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, updates: Partial<User>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      lastActive: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const getUser = async (userId: string) => {
  try {
    console.log('Getting user with ID:', userId);
    const userRef = doc(db, 'users', userId);
    console.log('User document path:', userRef.path);
    
    const userSnap = await getDoc(userRef);
    console.log('User document exists:', userSnap.exists());
    
    if (userSnap.exists()) {
      const userData = { id: userSnap.id, ...userSnap.data() } as User;
      console.log('Found user data:', userData);
      return userData;
    }
    
    console.log('User document not found');
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Challenge Management
export const getDailyChallenges = async () => {
  try {
    const challengesRef = collection(db, 'challenges');
    const q = query(
      challengesRef,
      where('type', '==', 'daily'),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Challenge[];
  } catch (error) {
    console.error('Error getting challenges:', error);
    throw error;
  }
};

export const completeChallenge = async (challengeId: string, userId: string) => {
  try {
    const challengeRef = doc(db, 'challenges', challengeId);
    const challengeSnap = await getDoc(challengeRef);
    if (challengeSnap.exists()) {
      const challenge = challengeSnap.data() as Challenge;
      const completedBy = [...(challenge.completedBy || []), userId];
      await updateDoc(challengeRef, { completedBy });
      
      // Update user points
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        points: (challenge.points || 0) + (challenge.points || 0)
      });
    }
  } catch (error) {
    console.error('Error completing challenge:', error);
    throw error;
  }
};

// Gallery Management
export const addGalleryEntry = async (entry: Omit<GalleryEntry, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'gallery'), {
      ...entry,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding gallery entry:', error);
    throw error;
  }
};

export const getGalleryEntries = async (limit = 20) => {
  try {
    const galleryRef = collection(db, 'gallery');
    const q = query(galleryRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.slice(0, limit).map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as GalleryEntry[];
  } catch (error) {
    console.error('Error getting gallery entries:', error);
    throw error;
  }
};

// Heartbeat Management
export const sendHeartbeat = async (heartbeat: Omit<Heartbeat, 'id'>) => {
  try {
    const heartbeatData = {
      ...heartbeat,
      timestamp: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, 'heartbeats'), heartbeatData);
    return docRef.id;
  } catch (error) {
    console.error('Error sending heartbeat:', error);
    throw error;
  }
};

export const getHeartbeats = async (userId: string) => {
  try {
    const heartbeatsRef = collection(db, 'heartbeats');
    const q = query(
      heartbeatsRef,
      where('recipientId', '==', userId)
      // Removed orderBy to avoid composite index requirement
    );
    const querySnapshot = await getDocs(q);
    const heartbeats = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Heartbeat[];
    
    // Sort on client side by timestamp (newest first)
    return heartbeats.sort((a, b) => {
      const timestampA = a.timestamp instanceof Date ? a.timestamp : 
        (a.timestamp as any)?.toDate?.() || new Date(0);
      const timestampB = b.timestamp instanceof Date ? b.timestamp : 
        (b.timestamp as any)?.toDate?.() || new Date(0);
      return timestampB.getTime() - timestampA.getTime();
    });
  } catch (error) {
    console.error('Error getting heartbeats:', error);
    throw error;
  }
};

// Real-time heartbeat subscription
export const subscribeToHeartbeats = (userId: string, callback: (heartbeat: Heartbeat) => void) => {
  const heartbeatsRef = collection(db, 'heartbeats');
  const q = query(
    heartbeatsRef,
    where('recipientId', '==', userId)
    // Removed orderBy to avoid composite index requirement
  );
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    querySnapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const heartbeatData = { id: change.doc.id, ...change.doc.data() } as Heartbeat;
        callback(heartbeatData);
      }
    });
  }, (error) => {
    console.error('Real-time heartbeat listener error:', error);
  });
  
  return unsubscribe;
};

// Real-time updates subscription
export const subscribeToUserUpdates = (userId: string, callback: (userData: User | null) => void) => {
  console.log('Setting up real-time listener for user:', userId);
  
  const userRef = doc(db, 'users', userId);
  
  const unsubscribe = onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      const userData = { id: doc.id, ...doc.data() } as User;
      console.log('Real-time user update received:', userData);
      callback(userData);
    } else {
      console.log('User document no longer exists');
      callback(null);
    }
  }, (error) => {
    console.error('Real-time listener error:', error);
  });
  
  return unsubscribe;
};

export const subscribeToPartnerUpdates = (partnerId: string, callback: (partnerData: User | null) => void) => {
  console.log('Setting up real-time listener for partner:', partnerId);
  
  const partnerRef = doc(db, 'users', partnerId);
  
  const unsubscribe = onSnapshot(partnerRef, (doc) => {
    if (doc.exists()) {
      const partnerData = { id: doc.id, ...doc.data() } as User;
      console.log('Real-time partner update received:', partnerData);
      callback(partnerData);
    } else {
      console.log('Partner document no longer exists');
      callback(null);
    }
  }, (error) => {
    console.error('Real-time partner listener error:', error);
  });
  
  return unsubscribe;
};

// Legacy function for backward compatibility
export const subscribeToUpdates = (userId: string, callback: (data: any) => void) => {
  return subscribeToUserUpdates(userId, callback);
}; 