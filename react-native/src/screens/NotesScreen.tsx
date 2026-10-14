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
    <SafeAreaView className="flex-1 bg-[#050510]">
      <StatusBar barStyle="light-content" backgroundColor="#050510" />

      {/* ── AMBIENT GRADIENT MESH SIMULATION ── */}
      <View className="absolute top-0 left-0 right-0 h-96 bg-[#08081A] opacity-60" />
      <View className="absolute top-16 right-[-50px] w-64 h-64 rounded-full bg-[#FD79A8] opacity-[0.03]" />
      <View className="absolute top-48 left-[-40px] w-48 h-48 rounded-full bg-[#6C5CE7] opacity-[0.04]" />

      <View className="flex-1">
        {/* ── TOP ACTION BAR ── */}
        <View className="flex-row items-center justify-between px-6 pt-3 pb-2 z-10">
          {onBack ? (
            <TouchableOpacity
              onPress={onBack}
              activeOpacity={0.7}
              className="py-1 pr-3 flex-row items-center gap-1.5"
            >
              <Text className="text-lg text-[#6B6B8D]">←</Text>
              <Text className="text-[11px] font-semibold tracking-[2px] uppercase text-[#6B6B8D]">
                Home
              </Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}

          <TouchableOpacity
            onPress={handleCreateNew}
            activeOpacity={0.7}
            className="w-8 h-8 rounded-full bg-[#FD79A8]/15 border border-[#FD79A8]/30 items-center justify-center"
          >
            <Text className="text-lg font-light text-[#E8E8F0] leading-none">+</Text>
          </TouchableOpacity>
        </View>

        {/* ── DRAMATIC HEADER ── */}
        <View className="px-6 pt-3 pb-4">
          <View className="flex-row items-center gap-2 mb-1.5">
            <View className="w-2 h-2 rounded-full bg-[#FD79A8]" />
            <Text className="text-[10px] font-bold tracking-[3px] uppercase text-[#6B6B8D]">
              Protocols & Logs
            </Text>
          </View>
          <Text className="text-3xl font-extrabold tracking-tight text-[#E8E8F0] font-sans">
            Aesthetic Notes
          </Text>
          <Text className="text-xs text-[#6B6B8D] mt-1 font-normal tracking-wide">
            {notes.length} verified research logs and photo evidence
          </Text>
        </View>

        {/* ── SEARCH BAR ── */}
        <View className="px-5 mb-4">
          <View className="flex-row items-center bg-[#0D0D1A] rounded-2xl px-4 py-3 border border-[#1E1E3A]">
            <Text className="text-xs mr-2.5 text-[#6C5CE7]">◈</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search protocols and evidence..."
              placeholderTextColor="#3D3D5C"
              className="flex-1 text-[#E8E8F0] text-xs py-0 font-medium"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text className="text-xs text-[#6B6B8D]">✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── CATEGORY FILTER CHIPS ── */}
        <View className="mb-4 px-5">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {['All', ...NOTE_CATEGORIES].map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.75}
                  className={`px-3.5 py-1.5 rounded-2xl border ${
                    isSelected
                      ? 'bg-[#FD79A8] border-[#FD79A8]'
                      : 'bg-[#0D0D1A] border-[#1E1E3A]'
                  }`}
                >
                  <Text
                    className={`text-xs font-bold tracking-wider ${
                      isSelected ? 'text-[#050510]' : 'text-[#6B6B8D]'
                    }`}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── NOTES LIST ── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-4"
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'ios' ? 100 : 90,
          }}
        >
          {filteredNotes.length === 0 ? (
            <View className="items-center justify-center py-20 bg-[#0D0D1A] border border-[#1E1E3A] rounded-[32px] px-6">
              <View className="w-16 h-16 rounded-3xl bg-[#14142A] border border-[#1E1E3A] items-center justify-center mb-4">
                <Text className="text-2xl text-[#FD79A8]">◈</Text>
              </View>
              <Text className="text-base font-bold text-[#E8E8F0] mb-1">
                Zero Logs Found
              </Text>
              <Text className="text-xs text-[#6B6B8D] text-center max-w-xs mb-5">
                No matching notes or protocols in this category.
              </Text>
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

        {/* FLOATING ACTION BUTTON */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleCreateNew}
          className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#FD79A8] items-center justify-center shadow-2xl shadow-[#FD79A8]/40"
        >
          <Text className="text-2xl text-[#050510] font-light">+</Text>
        </TouchableOpacity>
      </View>

      {/* NOTE EDITOR MODAL */}
      <NoteEditorModal
        visible={isEditorOpen}
        note={editingNote}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
      />
    </SafeAreaView>
  );
};
