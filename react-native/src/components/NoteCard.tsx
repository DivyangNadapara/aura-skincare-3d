import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { NoteItem } from '../types/note';

interface NoteCardProps {
  note: NoteItem;
  onPress: (note: NoteItem) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => onPress(note)}
      className="bg-[#0D0D1A] border border-[#1E1E3A] rounded-[28px] p-5 mb-4 shadow-sm"
    >
      {/* Top Meta: Category & Pin */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="px-3 py-1 rounded-full bg-[#14142A] border border-[#1E1E3A]">
          <Text className="text-[10px] font-bold tracking-[1px] uppercase text-[#6B6B8D]">
            {note.category}
          </Text>
        </View>

        {note.isPinned && (
          <View className="flex-row items-center gap-1.5">
            <View className="w-1.5 h-1.5 rounded-full bg-[#FD79A8]" />
            <Text className="text-[10px] text-[#FD79A8] font-bold uppercase tracking-[2px]">
              Pinned
            </Text>
          </View>
        )}
      </View>

      {/* Note Title */}
      <Text className="text-lg font-bold text-[#E8E8F0] mb-2 tracking-tight">
        {note.title}
      </Text>

      {/* Image Thumbnail Preview (if attached) */}
      {note.images && note.images.length > 0 && (
        <View className="flex-row gap-2 mb-3 overflow-hidden rounded-2xl">
          {note.images.slice(0, 2).map((imgUri, idx) => (
            <Image
              key={idx}
              source={{ uri: imgUri }}
              className="h-28 flex-1 rounded-2xl bg-[#14142A] border border-[#1E1E3A]"
              resizeMode="cover"
            />
          ))}
          {note.images.length > 2 && (
            <View className="w-14 h-28 rounded-2xl bg-[#14142A] border border-[#1E1E3A] items-center justify-center">
              <Text className="text-[#6C5CE7] text-xs font-bold font-mono">
                +{note.images.length - 2}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Content Preview (Truncated) */}
      <Text
        numberOfLines={3}
        className="text-xs text-[#6B6B8D] leading-relaxed mb-3.5"
      >
        {note.content}
      </Text>

      {/* Bottom Footer: Timestamp & Image Count */}
      <View className="flex-row items-center justify-between pt-3 border-t border-[#14142A]">
        <Text className="text-[10px] text-[#3D3D5C] font-mono tracking-wider">
          {note.updatedAt}
        </Text>

        {note.images && note.images.length > 0 && (
          <View className="flex-row items-center gap-1.5">
            <Text className="text-[10px] text-[#6C5CE7]">◆</Text>
            <Text className="text-[10px] text-[#6B6B8D] font-mono">
              {note.images.length} {note.images.length === 1 ? 'media' : 'media'}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
