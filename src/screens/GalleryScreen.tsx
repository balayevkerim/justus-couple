import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';

export default function GalleryScreen() {
  const navigation = useNavigation();
  const { state } = useApp();

  const renderGalleryItem = (item: any) => (
    <View key={item.id} style={styles.galleryItem}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.galleryImage}
        resizeMode="cover"
      />
      <View style={styles.galleryContent}>
        <View style={styles.galleryHeader}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Text style={styles.userInitial}>
                {item.userName.charAt(0)}
              </Text>
            </View>
            <Text style={styles.userName}>{item.userName}</Text>
          </View>
          <Text style={styles.galleryDate}>
            {item.date.toLocaleDateString()}
          </Text>
        </View>
        
        <Text style={styles.galleryNote}>{item.note}</Text>
        
        <View style={styles.galleryActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart-outline" size={16} color="#6b7280" />
            <Text style={styles.actionText}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={16} color="#6b7280" />
            <Text style={styles.actionText}>Comment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            Our Memories 💕
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddGalleryEntry' as never)}
            style={styles.addButton}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.galleryContainer}>
        {state.galleryEntries.map(renderGalleryItem)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  addButton: {
    backgroundColor: '#ef4444',
    padding: 8,
    borderRadius: 20,
  },
  galleryContainer: {
    flex: 1,
  },
  galleryItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: 192,
  },
  galleryContent: {
    padding: 16,
  },
  galleryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    backgroundColor: '#ec4899',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  userInitial: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  userName: {
    color: '#1f2937',
    fontWeight: '500',
  },
  galleryDate: {
    color: '#6b7280',
    fontSize: 14,
  },
  galleryNote: {
    color: '#374151',
    fontSize: 16,
    marginBottom: 12,
  },
  galleryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: '#6b7280',
    fontSize: 14,
    marginLeft: 4,
  },
}); 