import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { VaultItem } from '../types/vault';

interface ImportVaultModalProps {
  visible: boolean;
  onClose: () => void;
  onImportItem: (item: VaultItem) => void;
}

export const ImportVaultModal: React.FC<ImportVaultModalProps> = ({
  visible,
  onClose,
  onImportItem,
}) => {
  const [note, setNote] = useState('');
  const [customName, setCustomName] = useState('');

  const handlePickFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow access to your media library to hide photos and videos into your vault.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const isVideo = asset.type === 'video' || (asset.mimeType && asset.mimeType.startsWith('video'));
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const timeStr = `${hours % 12 || 12}:${minutes} ${ampm}`;

        const fileName = asset.fileName || (isVideo ? `video_${Date.now()}.mp4` : `photo_${Date.now()}.jpg`);

        const newItem: VaultItem = {
          id: `vault-${Date.now()}`,
          name: customName.trim() || fileName,
          type: isVideo ? 'video' : 'image',
          uri: asset.uri,
          thumbnailUri: asset.uri,
          sizeBytes: asset.fileSize || 3500000,
          dateAdded: dateStr,
          timeAdded: timeStr,
          originalFileName: fileName,
          mimeType: asset.mimeType || (isVideo ? 'video/mp4' : 'image/jpeg'),
          note: note.trim() || 'Imported from device gallery',
          isFavorite: false,
        };

        onImportItem(newItem);
        setCustomName('');
        setNote('');
        onClose();
        Alert.alert('Vault Secured', `"${newItem.name}" is now hidden in your private vault.`);
      }
    } catch (err: any) {
      Alert.alert('Import Error', err?.message || 'Could not import media.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Camera Permission Required',
          'Please grant camera permission to capture secret photos directly into your vault.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const timeStr = `${hours % 12 || 12}:${minutes} ${ampm}`;
        const fileName = `secret_capture_${Date.now()}.jpg`;

        const newItem: VaultItem = {
          id: `vault-${Date.now()}`,
          name: customName.trim() || 'Secret Photo Capture',
          type: 'image',
          uri: asset.uri,
          thumbnailUri: asset.uri,
          sizeBytes: asset.fileSize || 2800000,
          dateAdded: dateStr,
          timeAdded: timeStr,
          originalFileName: fileName,
          mimeType: 'image/jpeg',
          note: note.trim() || 'Captured directly into secure vault',
          isFavorite: false,
        };

        onImportItem(newItem);
        setCustomName('');
        setNote('');
        onClose();
        Alert.alert('Captured into Vault', 'Photo saved directly into private vault.');
      }
    } catch (err: any) {
      Alert.alert('Camera Error', err?.message || 'Could not open camera.');
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const timeStr = `${hours % 12 || 12}:${minutes} ${ampm}`;

        const isImage = file.mimeType?.startsWith('image/') || false;
        const isVideo = file.mimeType?.startsWith('video/') || false;

        const newItem: VaultItem = {
          id: `vault-${Date.now()}`,
          name: customName.trim() || file.name,
          type: isVideo ? 'video' : isImage ? 'image' : 'document',
          uri: file.uri,
          thumbnailUri: isImage ? file.uri : undefined,
          sizeBytes: file.size || 500000,
          dateAdded: dateStr,
          timeAdded: timeStr,
          originalFileName: file.name,
          mimeType: file.mimeType || 'application/octet-stream',
          note: note.trim() || 'Document locked into vault',
          isFavorite: false,
        };

        onImportItem(newItem);
        setCustomName('');
        setNote('');
        onClose();
        Alert.alert('File Hidden', `"${newItem.name}" is now safely encrypted in your vault.`);
      }
    } catch (err: any) {
      Alert.alert('Document Error', err?.message || 'Could not pick file.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-[#181B26] border-t border-[#272B3B] rounded-t-[36px] p-6 pb-10">
          {/* HEADER */}
          <View className="flex-row items-center justify-between mb-5">
            <View>
              <Text className="text-xl font-bold text-white tracking-tight">
                Hide Files in Vault
              </Text>
              <Text className="text-xs text-[#8E94A7] mt-0.5">
                Import private photos, videos, or documents
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-[#11131C] items-center justify-center border border-[#272B3B]"
            >
              <Text className="text-white text-base">✕</Text>
            </TouchableOpacity>
          </View>

          {/* OPTIONAL CUSTOM LABEL */}
          <View className="mb-3">
            <Text className="text-[11px] font-semibold text-[#8E94A7] mb-1 uppercase tracking-wider">
              Secret Label / Title (Optional)
            </Text>
            <TextInput
              value={customName}
              onChangeText={setCustomName}
              placeholder="e.g. My Private Video, Tax Return 2026..."
              placeholderTextColor="#555B70"
              className="bg-[#11131C] border border-[#272B3B] rounded-xl px-4 py-3 text-white text-sm"
            />
          </View>

          {/* OPTIONAL NOTE */}
          <View className="mb-5">
            <Text className="text-[11px] font-semibold text-[#8E94A7] mb-1 uppercase tracking-wider">
              Secret Note (Optional)
            </Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Add encrypted notes for this file..."
              placeholderTextColor="#555B70"
              className="bg-[#11131C] border border-[#272B3B] rounded-xl px-4 py-2.5 text-white text-sm"
            />
          </View>

          {/* ACTION BUTTONS */}
          <View className="gap-3">
            {/* Gallery Picker */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={handlePickFromGallery}
              className="bg-[#1F2332] border border-[#2F3447] p-4 rounded-2xl flex-row items-center justify-between active:bg-[#2C7BFE]/20"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-11 h-11 rounded-xl bg-[#2C7BFE]/20 items-center justify-center border border-[#2C7BFE]/40">
                  <Text className="text-xl">🖼️</Text>
                </View>
                <View>
                  <Text className="text-sm font-bold text-white">
                    Hide Photos & Videos from Gallery
                  </Text>
                  <Text className="text-xs text-[#8E94A7] mt-0.5">
                    Select any picture or video from phone storage
                  </Text>
                </View>
              </View>
              <Text className="text-sm text-[#8E94A7]">›</Text>
            </TouchableOpacity>

            {/* Direct Camera Capture */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={handleTakePhoto}
              className="bg-[#1F2332] border border-[#2F3447] p-4 rounded-2xl flex-row items-center justify-between active:bg-[#30D158]/20"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-11 h-11 rounded-xl bg-[#30D158]/20 items-center justify-center border border-[#30D158]/40">
                  <Text className="text-xl">📸</Text>
                </View>
                <View>
                  <Text className="text-sm font-bold text-white">
                    Take Secret Photo Directly
                  </Text>
                  <Text className="text-xs text-[#8E94A7] mt-0.5">
                    Captures instantly into vault without saving to gallery
                  </Text>
                </View>
              </View>
              <Text className="text-sm text-[#8E94A7]">›</Text>
            </TouchableOpacity>

            {/* Document Picker */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={handlePickDocument}
              className="bg-[#1F2332] border border-[#2F3447] p-4 rounded-2xl flex-row items-center justify-between active:bg-[#FF9F0A]/20"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-11 h-11 rounded-xl bg-[#FF9F0A]/20 items-center justify-center border border-[#FF9F0A]/40">
                  <Text className="text-xl">📁</Text>
                </View>
                <View>
                  <Text className="text-sm font-bold text-white">
                    Hide Document or Any File
                  </Text>
                  <Text className="text-xs text-[#8E94A7] mt-0.5">
                    PDF, documents, spreadsheets, zip archives
                  </Text>
                </View>
              </View>
              <Text className="text-sm text-[#8E94A7]">›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
