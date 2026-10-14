import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
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

        const fileName = asset.fileName || (isVideo ? `VID_${Date.now()}.mp4` : `IMG_${Date.now()}.jpg`);

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
          note: note.trim() || 'Imported from gallery storage',
          isFavorite: false,
        };

        onImportItem(newItem);
        setCustomName('');
        setNote('');
        onClose();
        Alert.alert('Artifact Encrypted', `"${newItem.name}" is now secured in your private vault.`);
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
        const fileName = `CAPTURE_${Date.now()}.jpg`;

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
        Alert.alert('File Encrypted', `"${newItem.name}" is now safely encrypted in your vault.`);
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
      <View className="flex-1 bg-black/85 justify-end">
        <View className="bg-[#0D0D1A] border-t border-[#1E1E3A] rounded-t-[40px] p-6 pb-10 shadow-2xl">
          {/* TOP DRAG HANDLE */}
          <View className="items-center mb-5">
            <View className="w-10 h-1 rounded-full bg-[#1E1E3A]" />
          </View>

          {/* HEADER */}
          <View className="flex-row items-center justify-between mb-5">
            <View>
              <Text className="text-[10px] font-bold tracking-[3px] uppercase text-[#6C5CE7] mb-1">
                Zero-Knowledge Storage
              </Text>
              <Text className="text-xl font-extrabold text-[#E8E8F0] tracking-tight">
                Encrypt & Hide Artifact
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              className="w-8 h-8 rounded-full bg-[#14142A] items-center justify-center border border-[#1E1E3A]"
            >
              <Text className="text-[#6B6B8D] text-sm">✕</Text>
            </TouchableOpacity>
          </View>

          {/* OPTIONAL CUSTOM LABEL */}
          <View className="mb-3">
            <Text className="text-[10px] font-bold text-[#6B6B8D] mb-1.5 uppercase tracking-[2px]">
              Artifact Alias (Optional)
            </Text>
            <TextInput
              value={customName}
              onChangeText={setCustomName}
              placeholder="e.g. Master Seed, Tax Return 2026..."
              placeholderTextColor="#3D3D5C"
              className="bg-[#14142A] border border-[#1E1E3A] rounded-2xl px-4 py-3 text-[#E8E8F0] text-sm font-sans"
            />
          </View>

          {/* OPTIONAL NOTE */}
          <View className="mb-5">
            <Text className="text-[10px] font-bold text-[#6B6B8D] mb-1.5 uppercase tracking-[2px]">
              Encrypted Note (Optional)
            </Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Private memos attached to artifact..."
              placeholderTextColor="#3D3D5C"
              className="bg-[#14142A] border border-[#1E1E3A] rounded-2xl px-4 py-2.5 text-[#E8E8F0] text-sm font-sans"
            />
          </View>

          {/* ACTION BUTTONS */}
          <View className="gap-3">
            {/* Gallery Picker */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={handlePickFromGallery}
              className="bg-[#14142A] border border-[#1E1E3A] p-4 rounded-2xl flex-row items-center justify-between active:border-[#6C5CE7]"
            >
              <View className="flex-row items-center gap-3.5">
                <View className="w-10 h-10 rounded-xl bg-[#6C5CE7]/15 items-center justify-center border border-[#6C5CE7]/30">
                  <Text className="text-base font-bold text-[#6C5CE7]">◆</Text>
                </View>
                <View>
                  <Text className="text-sm font-bold text-[#E8E8F0]">
                    Import Gallery Media
                  </Text>
                  <Text className="text-xs text-[#6B6B8D] mt-0.5">
                    Absorb private photos or videos from phone storage
                  </Text>
                </View>
              </View>
              <Text className="text-sm text-[#6B6B8D]">›</Text>
            </TouchableOpacity>

            {/* Direct Camera Capture */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={handleTakePhoto}
              className="bg-[#14142A] border border-[#1E1E3A] p-4 rounded-2xl flex-row items-center justify-between active:border-[#FD79A8]"
            >
              <View className="flex-row items-center gap-3.5">
                <View className="w-10 h-10 rounded-xl bg-[#FD79A8]/15 items-center justify-center border border-[#FD79A8]/30">
                  <Text className="text-base font-bold text-[#FD79A8]">◉</Text>
                </View>
                <View>
                  <Text className="text-sm font-bold text-[#E8E8F0]">
                    Direct Lens Capture
                  </Text>
                  <Text className="text-xs text-[#6B6B8D] mt-0.5">
                    Writes straight to enclave without camera roll entry
                  </Text>
                </View>
              </View>
              <Text className="text-sm text-[#6B6B8D]">›</Text>
            </TouchableOpacity>

            {/* Document Picker */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={handlePickDocument}
              className="bg-[#14142A] border border-[#1E1E3A] p-4 rounded-2xl flex-row items-center justify-between active:border-[#00B894]"
            >
              <View className="flex-row items-center gap-3.5">
                <View className="w-10 h-10 rounded-xl bg-[#00B894]/15 items-center justify-center border border-[#00B894]/30">
                  <Text className="text-base font-bold text-[#00B894]">■</Text>
                </View>
                <View>
                  <Text className="text-sm font-bold text-[#E8E8F0]">
                    Confidential File / PDF
                  </Text>
                  <Text className="text-xs text-[#6B6B8D] mt-0.5">
                    Contracts, spreadsheets, keys, and documents
                  </Text>
                </View>
              </View>
              <Text className="text-sm text-[#6B6B8D]">›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
