import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';

export default function AddGalleryEntryScreen() {
  const navigation = useNavigation();
  const { state, dispatch } = useApp();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const handleAddPhoto = () => {
    // In a real app, you'd use expo-image-picker here
    // For demo purposes, we'll use a placeholder image
    setSelectedImage('https://via.placeholder.com/400x300');
  };

  const handleRemovePhoto = () => {
    setSelectedImage(null);
  };

  const handleSave = () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please add a photo first');
      return;
    }

    const newEntry = {
      id: Date.now().toString(),
      userId: state.currentUser?.id || '',
      userName: state.currentUser?.name || '',
      imageUrl: selectedImage,
      note: note || 'No note added',
      date: new Date(),
      likes: 0,
    };

    dispatch({ type: 'ADD_GALLERY_ENTRY', payload: newEntry });
    Alert.alert('Success! 💕', 'Memory added to gallery!');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Add Memory 📸
        </Text>
        
        {/* Photo Section */}
        <View style={styles.photoCard}>
          <Text style={styles.sectionTitle}>Photo</Text>
          
          {selectedImage ? (
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.selectedImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={handleRemovePhoto}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Remove Photo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleAddPhoto}
              style={styles.addPhotoButton}
            >
              <View style={styles.addPhotoContent}>
                <Ionicons name="camera" size={48} color="#6b7280" />
                <Text style={styles.addPhotoText}>
                  Tap to add photo
                </Text>
                <Text style={styles.addPhotoSubtext}>
                  Capture a special moment
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Note Section */}
        <View style={styles.noteCard}>
          <Text style={styles.sectionTitle}>Note</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Write a note about this memory..."
            multiline
            numberOfLines={4}
            style={styles.noteInput}
          />
          <Text style={styles.noteHint}>
            Optional: Add a description or feeling
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          style={[
            styles.saveButton,
            !selectedImage && styles.saveButtonDisabled
          ]}
          disabled={!selectedImage}
        >
          <Text style={[
            styles.saveButtonText,
            !selectedImage && styles.saveButtonTextDisabled
          ]}>
            Save Memory
          </Text>
        </TouchableOpacity>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb-outline" size={24} color="#7c3aed" />
            <View style={styles.tipsContent}>
              <Text style={styles.tipsTitle}>Tips for Great Memories</Text>
              <Text style={styles.tipsText}>
                • Take photos during special moments{'\n'}
                • Write heartfelt notes{'\n'}
                • Capture both of you together{'\n'}
                • Don't forget the little things
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
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
  },
  photoCard: {
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
    marginBottom: 12,
  },
  photoContainer: {
    alignItems: 'center',
  },
  selectedImage: {
    width: '100%',
    height: 192,
    borderRadius: 8,
    marginBottom: 12,
  },
  removeButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  addPhotoButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 32,
    alignItems: 'center',
  },
  addPhotoContent: {
    alignItems: 'center',
  },
  addPhotoText: {
    color: '#6b7280',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 8,
  },
  addPhotoSubtext: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 4,
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
  noteHint: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  saveButtonTextDisabled: {
    color: '#9ca3af',
  },
  tipsCard: {
    backgroundColor: '#faf5ff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e9d5ff',
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
    color: '#581c87',
    fontWeight: '500',
    marginBottom: 4,
  },
  tipsText: {
    color: '#7c3aed',
    fontSize: 14,
  },
}); 