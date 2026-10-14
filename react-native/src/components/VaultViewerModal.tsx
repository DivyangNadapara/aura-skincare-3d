import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { VaultItem, formatBytes } from '../types/vault';
import { VideoView, useVideoPlayer } from 'expo-video';

interface VaultViewerModalProps {
  item: VaultItem | null;
  visible: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onRestoreToGallery: (item: VaultItem) => Promise<void>;
  onShare: (item: VaultItem) => Promise<void>;
}

export const VaultViewerModal: React.FC<VaultViewerModalProps> = ({
  item,
  visible,
  onClose,
  onDelete,
  onRestoreToGallery,
  onShare,
}) => {
  const [isRestoring, setIsRestoring] = useState(false);

  if (!item) return null;

  const handleDeleteConfirm = () => {
    Alert.alert(
      'Remove from Vault',
      `Are you sure you want to delete "${item.name}" from your private vault?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete(item.id);
            onClose();
          },
        },
      ]
    );
  };

  const handleRestore = async () => {
    try {
      setIsRestoring(true);
      await onRestoreToGallery(item);
    } catch (e: any) {
      Alert.alert('Restore Failed', e?.message || 'Could not export file to gallery.');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/95 justify-between">
        {/* HEADER BAR */}
        <View className="pt-12 px-6 pb-4 flex-row items-center justify-between border-b border-[#212433]">
          <View className="flex-1 mr-4">
            <Text className="text-base font-bold text-white" numberOfLines={1}>
              {item.name}
            </Text>
            <Text className="text-xs text-[#8E94A7] mt-0.5">
              {item.type.toUpperCase()} • {formatBytes(item.sizeBytes)} • {item.dateAdded}
            </Text>
          </View>

          <TouchableOpacity
            onPress={onClose}
            className="w-9 h-9 rounded-full bg-[#181B26] items-center justify-center border border-[#272B3B]"
          >
            <Text className="text-lg text-white font-light">✕</Text>
          </TouchableOpacity>
        </View>

        {/* MEDIA PREVIEW CONTAINER */}
        <View className="flex-1 items-center justify-center p-4">
          {item.type === 'image' ? (
            <Image
              source={{ uri: item.uri }}
              className="w-full h-full rounded-2xl"
              resizeMode="contain"
            />
          ) : item.type === 'video' ? (
            <VaultVideoPlayer uri={item.uri} />
          ) : (
            <View className="items-center justify-center bg-[#141620] p-8 rounded-3xl border border-[#212433] max-w-sm w-full">
              <View className="w-20 h-20 rounded-2xl bg-[#2C7BFE]/15 border border-[#2C7BFE]/30 items-center justify-center mb-4">
                <Text className="text-4xl">📄</Text>
              </View>
              <Text className="text-lg font-bold text-white text-center mb-1">
                {item.originalFileName || item.name}
              </Text>
              <Text className="text-xs text-[#8E94A7] text-center mb-4">
                Encrypted Document • {formatBytes(item.sizeBytes)}
              </Text>
              {item.note ? (
                <View className="bg-[#1C1F2B] p-3 rounded-xl border border-[#272B3B] w-full">
                  <Text className="text-xs text-[#5D6273] font-semibold mb-1 uppercase">Note:</Text>
                  <Text className="text-xs text-white leading-relaxed">{item.note}</Text>
                </View>
              ) : null}
            </View>
          )}
        </View>

        {/* BOTTOM ACTION TOOLBAR */}
        <View className="px-6 pb-8 pt-4 border-t border-[#212433] bg-[#0E1017]">
          <View className="flex-row items-center justify-between gap-3">
            {/* RESTORE TO GALLERY BUTTON */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleRestore}
              disabled={isRestoring}
              className="flex-1 bg-[#2C7BFE] py-3.5 px-4 rounded-2xl flex-row items-center justify-center gap-2 shadow-lg shadow-[#2C7BFE]/30"
            >
              <Text className="text-lg">📥</Text>
              <Text className="text-xs font-bold text-white">
                {isRestoring ? 'Restoring...' : 'Restore to Gallery'}
              </Text>
            </TouchableOpacity>

            {/* SHARE / EXPORT BUTTON */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onShare(item)}
              className="w-12 h-12 rounded-2xl bg-[#1C1F2B] border border-[#272B3B] items-center justify-center"
            >
              <Text className="text-lg">↗</Text>
            </TouchableOpacity>

            {/* DELETE BUTTON */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleDeleteConfirm}
              className="w-12 h-12 rounded-2xl bg-[#FF453A]/15 border border-[#FF453A]/30 items-center justify-center"
            >
              <Text className="text-base text-[#FF453A]">🗑</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-[10px] text-[#555B70] text-center mt-3 font-medium">
            "Restore to Gallery" exports the decrypted file back to your device's photo library or downloads.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const VaultVideoPlayer: React.FC<{ uri: string }> = ({ uri }) => {
  let player: any = null;
  try {
    player = useVideoPlayer(uri, (p) => {
      p.loop = true;
      p.play();
    });
  } catch (e) {}

  return (
    <View className="w-full h-80 rounded-2xl overflow-hidden bg-black items-center justify-center border border-[#272B3B]">
      {player ? (
        <VideoView
          player={player}
          style={{ width: '100%', height: '100%' }}
          allowsFullscreen
          allowsPictureInPicture
        />
      ) : (
        <View className="items-center">
          <Text className="text-3xl mb-2">🎬</Text>
          <Text className="text-xs text-[#8E94A7]">Video ready to stream</Text>
        </View>
      )}
    </View>
  );
};
