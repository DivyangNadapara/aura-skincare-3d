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
      className="bg-[#1C1F2B] border border-[#272B3B] rounded-[24px] p-5 mb-3.5 shadow-sm"
    >
      {/* Top Meta: Category & Pin */}
      <View className="flex-row items-center justify-between mb-2.5">
        <View className="px-2.5 py-1 rounded-full bg-[#252838] border border-[#31364A]">
          <Text className="text-[11px] font-semibold text-[#8E94A7]">
            {note.category}
          </Text>
        </View>

        {note.isPinned && (
          <View className="flex-row items-center gap-1">
            <Text className="text-xs">📌</Text>
            <Text className="text-[10px] text-[#2C7BFE] font-bold uppercase tracking-wider">
              Pinned
            </Text>
          </View>
        )}
      </View>

      {/* Note Title */}
      <Text className="text-lg font-bold text-white mb-2 tracking-tight">
        {note.title}
      </Text>

      {/* Image Thumbnail Preview (if attached) */}
      {note.images && note.images.length > 0 && (
        <View className="flex-row gap-2 mb-3 overflow-hidden rounded-2xl">
          {note.images.slice(0, 2).map((imgUri, idx) => (
            <Image
              key={idx}
              source={{ uri: imgUri }}
              className="h-28 flex-1 rounded-2xl bg-[#141620]"
              resizeMode="cover"
            />
          ))}
          {note.images.length > 2 && (
            <View className="w-14 h-28 rounded-2xl bg-[#252838] items-center justify-center">
              <Text className="text-white text-xs font-bold">
                +{note.images.length - 2}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Content Preview (Truncated) */}
      <Text
        numberOfLines={3}
        className="text-xs text-[#9DA3B5] leading-relaxed mb-3"
      >
        {note.content}
      </Text>

      {/* Bottom Footer: Timestamp & Image Count */}
      <View className="flex-row items-center justify-between pt-2 border-t border-[#252938]">
        <Text className="text-[11px] text-[#646A7E] font-medium">
          {note.updatedAt}
        </Text>

        {note.images && note.images.length > 0 && (
          <View className="flex-row items-center gap-1">
            <Text className="text-xs">🖼️</Text>
            <Text className="text-[11px] text-[#8E94A7] font-medium">
              {note.images.length} {note.images.length === 1 ? 'image' : 'images'}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

