import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Platform,
} from 'react-native';
import { INITIAL_NOTES } from '../data/mockNotes';
import { NoteItem, NoteCategory, NOTE_CATEGORIES } from '../types/note';
import { NoteCard } from '../components/NoteCard';
import { NoteEditorModal } from '../components/NoteEditorModal';

interface NotesScreenProps {
  onBack?: () => void;
}

export const NotesScreen: React.FC<NotesScreenProps> = ({ onBack }) => {
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Filter notes by search query and category
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat =
        selectedCategory === 'All' || note.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [notes, searchQuery, selectedCategory]);

  // Open editor for new note
  const handleCreateNew = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  // Open editor for existing note
  const handleEditNote = (note: NoteItem) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  // Save note (Create or Update)
  const handleSaveNote = (savedNote: NoteItem) => {
    setNotes((prevNotes) => {
      const exists = prevNotes.some((n) => n.id === savedNote.id);
      if (exists) {
        return prevNotes.map((n) => (n.id === savedNote.id ? savedNote : n));
      } else {
        return [savedNote, ...prevNotes];
      }
    });
  };

  // Delete note
  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <SafeAreaView className="flex-1 bg-[#000000]">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View className="flex-1">
        
        {/* SAMSUNG TOP ACTION BAR */}
        <View className="flex-row items-center justify-between px-6 pt-3 pb-2">
          {onBack ? (
            <TouchableOpacity onPress={onBack} activeOpacity={0.7} className="py-1 pr-3 flex-row items-center gap-1">
              <Text className="text-xl text-white">←</Text>
              <Text className="text-sm font-semibold text-[#8D92A4]">Home</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
          <View className="flex-row items-center space-x-5 gap-5">
            <TouchableOpacity onPress={handleCreateNew} className="p-1">
              <Text className="text-2xl font-light text-white leading-none">+</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-1">
              <Text className="text-xl text-[#9EA3B5] font-bold">⋮</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SAMSUNG LARGE ONE UI HEADER */}
        <View className="px-6 pt-2 pb-4">
          <Text className="text-3xl font-bold tracking-tight text-white font-sans">
            Notes
          </Text>
          <Text className="text-sm text-[#8D92A4] mt-1 font-normal">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </Text>
        </View>

        {/* SEARCH BAR (Samsung Pill Input) */}
        <View className="px-5 mb-3">
          <View className="flex-row items-center bg-[#171A26] rounded-2xl px-4 py-2.5 border border-[#232738]">
            <Text className="text-sm mr-2 text-[#7D8294]">🔍</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search notes and protocols"
              placeholderTextColor="#5C6274"
              className="flex-1 text-white text-xs py-0 font-medium"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text className="text-xs text-[#8E94A7]">✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* CATEGORY FILTER CHIPS */}
        <View className="mb-3 px-5">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {['All', ...NOTE_CATEGORIES].map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full mr-2 ${
                  selectedCategory === cat ? 'bg-[#2C7BFE]' : 'bg-[#181A25]'
                }`}
              >
                <Text
                  className={`text-xs ${
                    selectedCategory === cat ? 'text-white font-bold' : 'text-[#82889A]'
                  }`}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* NOTES LIST */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-4"
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'ios' ? 80 : 70,
          }}
        >
          {filteredNotes.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Text className="text-3xl mb-2">📝</Text>
              <Text className="text-sm text-[#8E94A7] font-medium">No notes found</Text>
              <TouchableOpacity
                onPress={handleCreateNew}
                className="mt-3 px-4 py-2 bg-[#2C7BFE] rounded-xl"
              >
                <Text className="text-xs text-white font-bold">Create Note</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onPress={handleEditNote}
              />
            ))
          )}
        </ScrollView>

        {/* SAMSUNG FLOATING ACTION BUTTON (FAB) */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleCreateNew}
          className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#2C7BFE] items-center justify-center shadow-xl shadow-[#2C7BFE]/40"
        >
          <Text className="text-2xl text-white">✍️</Text>
        </TouchableOpacity>
      </View>

      {/* NOTE EDITOR MODAL (Create, Edit, Save, Add Images) */}
      <NoteEditorModal
        visible={isEditorOpen}
        initialNote={editingNote}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
      />
    </SafeAreaView>
  );
};

