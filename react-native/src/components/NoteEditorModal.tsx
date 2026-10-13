import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { NoteItem, NoteCategory, NOTE_CATEGORIES } from '../types/note';

interface NoteEditorModalProps {
  visible: boolean;
  initialNote: NoteItem | null; // null if creating a new note
  onClose: () => void;
  onSave: (note: NoteItem) => void;
  onDelete?: (id: string) => void;
}

export const NoteEditorModal: React.FC<NoteEditorModalProps> = ({
  visible,
  initialNote,
  onClose,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoteCategory>('Circadian Protocol');
  const [isPinned, setIsPinned] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title);
      setContent(initialNote.content);
      setCategory(initialNote.category);
      setIsPinned(initialNote.isPinned);
      setImages(initialNote.images || []);
    } else {
      setTitle('');
      setContent('');
      setCategory('Circadian Protocol');
      setIsPinned(false);
      setImages([]);
    }
    setShowImageInput(false);
    setNewImageUrl('');
  }, [initialNote, visible]);

  // Add an image (via URL or simulated upload)
  const handleAddImage = () => {
    if (!newImageUrl.trim()) {
      // Default curated sample images if input is empty
      const sampleImages = [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      ];
      const randomSample = sampleImages[images.length % sampleImages.length];
      setImages([...images, randomSample]);
    } else {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
    setShowImageInput(false);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Empty Note', 'Please provide a title or content before saving.');
      return;
    }

    const noteToSave: NoteItem = {
      id: initialNote ? initialNote.id : `note-${Date.now()}`,
      title: title.trim() || 'Untitled Note',
      content: content.trim(),
      category,
      isPinned,
      images,
      createdAt: initialNote ? initialNote.createdAt : 'Just now',
      updatedAt: 'Just now',
    };

    onSave(noteToSave);
    onClose();
  };

  const isEditing = !!initialNote;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-[#090B10]">
        
        {/* SAMSUNG ONE UI EDITOR HEADER */}
        <View className="flex-row items-center justify-between px-5 pt-12 pb-4 border-b border-[#1E212E] bg-[#0E1118]">
          <TouchableOpacity onPress={onClose} className="py-2 pr-4">
            <Text className="text-base text-[#8D92A4]">Cancel</Text>
          </TouchableOpacity>

          <Text className="text-base font-bold text-white">
            {isEditing ? 'Edit note' : 'New note'}
          </Text>

          <TouchableOpacity onPress={handleSave} className="py-2 pl-4">
            <Text className="text-base text-[#2C7BFE] font-bold">Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5 pt-4">
          
          {/* Note Title Input */}
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor="#5C6274"
            className="text-2xl font-bold text-white mb-3 py-1 font-sans"
          />

          {/* Category Selector Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row mb-4 max-h-10"
          >
            {NOTE_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full mr-2 border ${
                  category === cat
                    ? 'bg-[#2C7BFE] border-[#2C7BFE]'
                    : 'bg-[#1A1D28] border-[#292D3E]'
                }`}
              >
                <Text
                  className={`text-xs ${
                    category === cat ? 'text-white font-bold' : 'text-[#82889A]'
                  }`}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Action Tools Bar: Add Image & Pin Toggle */}
          <View className="flex-row items-center justify-between py-2.5 px-4 mb-4 bg-[#141722] rounded-2xl border border-[#222636]">
            <View className="flex-row items-center gap-4">
              {/* Add Image Button */}
              <TouchableOpacity
                onPress={() => setShowImageInput(!showImageInput)}
                className="flex-row items-center gap-1.5"
              >
                <Text className="text-base">📷</Text>
                <Text className="text-xs font-semibold text-[#2C7BFE]">
                  Add Image
                </Text>
              </TouchableOpacity>

              {/* Pin Note Toggle */}
              <TouchableOpacity
                onPress={() => setIsPinned(!isPinned)}
                className="flex-row items-center gap-1.5"
              >
                <Text className="text-base">{isPinned ? '📌' : '📍'}</Text>
                <Text
                  className={`text-xs font-semibold ${
                    isPinned ? 'text-[#2C7BFE]' : 'text-[#82889A]'
                  }`}
                >
                  {isPinned ? 'Pinned' : 'Pin note'}
                </Text>
              </TouchableOpacity>
            </View>

            {isEditing && onDelete && (
              <TouchableOpacity
                onPress={() => {
                  onDelete(initialNote.id);
                  onClose();
                }}
              >
                <Text className="text-xs font-semibold text-[#FF453A]">
                  Delete
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Image URL Input Bar (When Toggled) */}
          {showImageInput && (
            <View className="p-3 mb-4 bg-[#171A26] rounded-2xl border border-[#2B3042]">
              <Text className="text-xs text-[#8E94A7] mb-2 font-medium">
                Enter image URL or tap Add to attach sample image:
              </Text>
              <TextInput
                value={newImageUrl}
                onChangeText={setNewImageUrl}
                placeholder="https://images.unsplash.com/..."
                placeholderTextColor="#5C6274"
                className="bg-[#0F111A] text-white text-xs px-3 py-2 rounded-xl mb-2.5 border border-[#272B3C]"
              />
              <View className="flex-row justify-end gap-2">
                <TouchableOpacity
                  onPress={() => setShowImageInput(false)}
                  className="px-3 py-1.5 bg-[#252837] rounded-xl"
                >
                  <Text className="text-xs text-[#A0A5B8]">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddImage}
                  className="px-4 py-1.5 bg-[#2C7BFE] rounded-xl"
                >
                  <Text className="text-xs text-white font-bold">Attach</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Attached Images Grid Gallery */}
          {images.length > 0 && (
            <View className="mb-4">
              <Text className="text-xs uppercase font-medium text-[#7D8294] mb-2">
                Attached Images ({images.length})
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row gap-3"
              >
                {images.map((imgUri, idx) => (
                  <View key={idx} className="relative mr-3">
                    <Image
                      source={{ uri: imgUri }}
                      className="w-36 h-36 rounded-2xl bg-[#171A26]"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/75 items-center justify-center border border-white/20"
                    >
                      <Text className="text-white text-xs font-bold leading-none">
                        ✕
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Multiline Body Content Input */}
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Write your note, protocol insights, daily routines..."
            placeholderTextColor="#535868"
            multiline
            textAlignVertical="top"
            className="text-sm text-[#D5DAE8] min-h-[320px] leading-relaxed py-2 font-sans"
          />

        </ScrollView>
      </View>
    </Modal>
  );
};
