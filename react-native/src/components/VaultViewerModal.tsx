import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
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
      'Permanent Deletion',
      `Erase "${item.name}" from your encrypted vault? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Erase',
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
      Alert.alert('Export Failed', e?.message || 'Could not export artifact to gallery.');
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
      <View className="flex-1 bg-[#050510]/98 justify-between">
        {/* ── HEADER BAR ── */}
        <View className="pt-12 px-6 pb-4 flex-row items-center justify-between border-b border-[#1E1E3A]">
          <View className="flex-1 mr-4">
            <Text className="text-base font-bold text-[#E8E8F0]" numberOfLines={1}>
              {item.name}
            </Text>
            <Text className="text-[11px] text-[#6B6B8D] font-mono mt-0.5 tracking-wider uppercase">
              {item.type} • {formatBytes(item.sizeBytes)} • {item.dateAdded}
            </Text>
          </View>

          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            className="w-9 h-9 rounded-full bg-[#14142A] items-center justify-center border border-[#1E1E3A]"
          >
            <Text className="text-base text-[#6B6B8D] font-light">✕</Text>
          </TouchableOpacity>
        </View>

        {/* ── MEDIA PREVIEW CONTAINER ── */}
        <View className="flex-1 items-center justify-center p-4">
          {item.type === 'image' ? (
            <Image
              source={{ uri: item.uri }}
              className="w-full h-full rounded-3xl"
              resizeMode="contain"
            />
          ) : item.type === 'video' ? (
            <VaultVideoPlayer uri={item.uri} />
          ) : (
            <View className="items-center justify-center bg-[#0D0D1A] p-8 rounded-[36px] border border-[#1E1E3A] max-w-sm w-full shadow-2xl">
              <View className="w-20 h-20 rounded-3xl bg-[#6C5CE7]/15 border border-[#6C5CE7]/30 items-center justify-center mb-5">
                <Text className="text-3xl text-[#6C5CE7]">■</Text>
              </View>
              <Text className="text-base font-bold text-[#E8E8F0] text-center mb-1">
                {item.originalFileName || item.name}
              </Text>
              <Text className="text-xs text-[#6B6B8D] font-mono text-center mb-5 uppercase tracking-wider">
                Encrypted Document • {formatBytes(item.sizeBytes)}
              </Text>
              {item.note ? (
                <View className="bg-[#14142A] p-4 rounded-2xl border border-[#1E1E3A] w-full">
                  <Text className="text-[10px] text-[#6C5CE7] font-bold tracking-[2px] uppercase mb-1">
                    Cipher Note
                  </Text>
                  <Text className="text-xs text-[#E8E8F0] leading-relaxed">
                    {item.note}
                  </Text>
                </View>
              ) : null}
            </View>
          )}
        </View>

        {/* ── BOTTOM ACTION TOOLBAR ── */}
        <View className="px-6 pb-8 pt-4 border-t border-[#1E1E3A] bg-[#0A0A14]">
          <View className="flex-row items-center justify-between gap-3">
            {/* RESTORE TO GALLERY BUTTON */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleRestore}
              disabled={isRestoring}
              className="flex-1 bg-[#00B894] py-3.5 px-4 rounded-2xl flex-row items-center justify-center gap-2 shadow-lg shadow-[#00B894]/30"
            >
              <Text className="text-sm font-bold text-[#050510]">↑</Text>
              <Text className="text-xs font-bold uppercase tracking-[2px] text-[#050510]">
                {isRestoring ? 'Decrypting...' : 'Restore to Gallery'}
              </Text>
            </TouchableOpacity>

            {/* SHARE / EXPORT BUTTON */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onShare(item)}
              className="w-12 h-12 rounded-2xl bg-[#14142A] border border-[#1E1E3A] items-center justify-center"
            >
              <Text className="text-base text-[#6C5CE7]">↗</Text>
            </TouchableOpacity>

            {/* DELETE BUTTON */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleDeleteConfirm}
              className="w-12 h-12 rounded-2xl bg-[#FD79A8]/10 border border-[#FD79A8]/25 items-center justify-center"
            >
              <Text className="text-base text-[#FD79A8]">✕</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-[10px] text-[#3D3D5C] text-center mt-3 font-mono tracking-wider">
            RESTORE TO GALLERY WRITES DECRYPTED BYTES TO NATIVE PHOTO ROLL
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
    <View className="w-full h-80 rounded-3xl overflow-hidden bg-black items-center justify-center border border-[#1E1E3A]">
      {player ? (
        <VideoView
          player={player}
          style={{ width: '100%', height: '100%' }}
          allowsFullscreen
          allowsPictureInPicture
        />
      ) : (
        <View className="items-center">
          <Text className="text-2xl text-[#6C5CE7] mb-2">▲</Text>
          <Text className="text-xs text-[#6B6B8D] font-mono">Stream Ready</Text>
        </View>
      )}
    </View>
  );
};
