import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
  Platform,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {
  VaultItem,
  VaultMediaType,
  INITIAL_VAULT_ITEMS,
  formatBytes,
} from '../types/vault';
import { VaultLockScreen } from '../components/VaultLockScreen';
import { VaultViewerModal } from '../components/VaultViewerModal';
import { ImportVaultModal } from '../components/ImportVaultModal';

interface VaultScreenProps {
  onBack?: () => void;
}

export const VaultScreen: React.FC<VaultScreenProps> = ({ onBack }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [vaultItems, setVaultItems] = useState<VaultItem[]>(INITIAL_VAULT_ITEMS);
  const [activeTab, setActiveTab] = useState<'all' | VaultMediaType>('all');
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Filtered items based on active tab
  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return vaultItems;
    return vaultItems.filter((i) => i.type === activeTab);
  }, [vaultItems, activeTab]);

  // Aggregate storage metrics
  const totalStorageBytes = useMemo(() => {
    return vaultItems.reduce((acc, curr) => acc + curr.sizeBytes, 0);
  }, [vaultItems]);

  const counts = useMemo(() => {
    return {
      all: vaultItems.length,
      image: vaultItems.filter((i) => i.type === 'image').length,
      video: vaultItems.filter((i) => i.type === 'video').length,
      document: vaultItems.filter((i) => i.type === 'document').length,
    };
  }, [vaultItems]);

  // Handlers
  const handleImportItem = (newItem: VaultItem) => {
    setVaultItems((prev) => [newItem, ...prev]);
  };

  const handleDeleteItem = (id: string) => {
    setVaultItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Restore file to default phone gallery / storage
  const handleRestoreToGallery = async (item: VaultItem) => {
    try {
      let targetUri = item.uri;

      // If it's a remote URL, download it first to local cache
      if (item.uri.startsWith('http://') || item.uri.startsWith('https://')) {
        const ext = item.type === 'video' ? 'mp4' : item.type === 'image' ? 'jpg' : 'pdf';
        const fileUri = `${FileSystem.cacheDirectory}restore_${Date.now()}.${ext}`;
        const downloadRes = await FileSystem.downloadAsync(item.uri, fileUri);
        targetUri = downloadRes.uri;
      }

      const isShareAvailable = await Sharing.isAvailableAsync();
      if (isShareAvailable) {
        await Sharing.shareAsync(targetUri, {
          dialogTitle: `Restore "${item.name}" to Photos / Gallery`,
          mimeType: item.mimeType || (item.type === 'video' ? 'video/mp4' : item.type === 'image' ? 'image/jpeg' : 'application/octet-stream'),
          UTI: item.type === 'image' ? 'public.image' : item.type === 'video' ? 'public.movie' : 'public.item',
        });
      } else {
        Alert.alert(
          'Restored to Device',
          `"${item.name}" is stored at: ${targetUri}`
        );
      }
    } catch (err: any) {
      console.warn('Restore failed:', err);
      Alert.alert('Restore Note', err?.message || 'Could not export file.');
    }
  };

  // Share / Export via system sheet
  const handleShare = async (item: VaultItem) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Sharing Unavailable', 'Sharing is not supported on this platform.');
        return;
      }

      let targetUri = item.uri;
      if (item.uri.startsWith('http://') || item.uri.startsWith('https://')) {
        const ext = item.type === 'video' ? 'mp4' : item.type === 'image' ? 'jpg' : 'pdf';
        const fileUri = `${FileSystem.cacheDirectory}share_${Date.now()}.${ext}`;
        const downloadRes = await FileSystem.downloadAsync(item.uri, fileUri);
        targetUri = downloadRes.uri;
      }

      await Sharing.shareAsync(targetUri, {
        dialogTitle: `Share ${item.name}`,
      });
    } catch (e: any) {
      Alert.alert('Share Failed', e?.message || 'Could not share file.');
    }
  };

  // If locked, show VaultLockScreen
  if (!isUnlocked) {
    return (
      <VaultLockScreen
        onUnlock={() => setIsUnlocked(true)}
        onBack={onBack}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#000000]">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* TOP ACTION BAR */}
      <View className="flex-row items-center justify-between px-6 pt-3 pb-2">
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            className="py-1 pr-3 flex-row items-center gap-1"
          >
            <Text className="text-xl text-white">←</Text>
            <Text className="text-sm font-semibold text-[#8D92A4]">Home</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <View className="flex-row items-center gap-4">
          {/* Lock Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsUnlocked(false)}
            className="flex-row items-center gap-1 bg-[#1C1F2B] px-3 py-1.5 rounded-full border border-[#272B3B]"
          >
            <Text className="text-xs">🔒</Text>
            <Text className="text-xs font-semibold text-[#8D92A4]">Lock</Text>
          </TouchableOpacity>

          {/* Add / Import Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsImportModalOpen(true)}
            className="p-1"
          >
            <Text className="text-2xl font-light text-white leading-none">+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ONE UI HEADER */}
      <View className="px-6 pt-2 pb-4">
        <Text className="text-3xl font-bold tracking-tight text-white font-sans">
          Secret Vault
        </Text>
        <Text className="text-sm text-[#8D92A4] mt-1 font-normal">
          Encrypted sandbox for private videos, photos & files
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4"
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? 90 : 80,
        }}
      >
        {/* ── VAULT STORAGE SUMMARY CARD ── */}
        <View className="bg-[#181B26] border border-[#272B3B] rounded-[28px] p-5 mb-4 shadow-lg shadow-black/80">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-xs font-semibold uppercase tracking-wider text-[#82889A]">
              Vault Capacity & Storage
            </Text>
            <View className="bg-[#2C7BFE]/20 px-2.5 py-0.5 rounded-full">
              <Text className="text-[11px] font-bold text-[#2C7BFE]">
                AES Encrypted
              </Text>
            </View>
          </View>

          <Text className="text-3xl font-extrabold text-white mb-1">
            {formatBytes(totalStorageBytes)}
          </Text>
          <Text className="text-xs text-[#8E94A7] mb-4">
            {vaultItems.length} personal files hidden from gallery
          </Text>

          {/* Quick action pill to hide files */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsImportModalOpen(true)}
            className="bg-[#2C7BFE] py-3 rounded-2xl flex-row items-center justify-center gap-2"
          >
            <Text className="text-base text-white">+</Text>
            <Text className="text-xs font-bold text-white uppercase tracking-wider">
              Hide New File or Photo
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── CATEGORY FILTER TABS ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
          contentContainerStyle={{ gap: 8 }}
        >
          <TouchableOpacity
            onPress={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl border ${
              activeTab === 'all'
                ? 'bg-[#2C7BFE] border-[#2C7BFE]'
                : 'bg-[#141620] border-[#212433]'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === 'all' ? 'text-white' : 'text-[#82889A]'
              }`}
            >
              All Files ({counts.all})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('image')}
            className={`px-4 py-2 rounded-xl border ${
              activeTab === 'image'
                ? 'bg-[#2C7BFE] border-[#2C7BFE]'
                : 'bg-[#141620] border-[#212433]'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === 'image' ? 'text-white' : 'text-[#82889A]'
              }`}
            >
              🖼️ Photos ({counts.image})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('video')}
            className={`px-4 py-2 rounded-xl border ${
              activeTab === 'video'
                ? 'bg-[#2C7BFE] border-[#2C7BFE]'
                : 'bg-[#141620] border-[#212433]'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === 'video' ? 'text-white' : 'text-[#82889A]'
              }`}
            >
              🎬 Videos ({counts.video})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('document')}
            className={`px-4 py-2 rounded-xl border ${
              activeTab === 'document'
                ? 'bg-[#2C7BFE] border-[#2C7BFE]'
                : 'bg-[#141620] border-[#212433]'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === 'document' ? 'text-white' : 'text-[#82889A]'
              }`}
            >
              📄 Docs ({counts.document})
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* ── VAULT ITEMS LIST ── */}
        {filteredItems.length === 0 ? (
          <View className="items-center justify-center py-16">
            <Text className="text-4xl mb-3">🛡️</Text>
            <Text className="text-base font-bold text-white mb-1">
              No files in this category
            </Text>
            <Text className="text-xs text-[#8E94A7] text-center max-w-xs mb-4">
              Tap the button below to hide photos, videos, or private documents from your device.
            </Text>
            <TouchableOpacity
              onPress={() => setIsImportModalOpen(true)}
              className="bg-[#1C1F2B] px-5 py-2.5 rounded-xl border border-[#272B3B]"
            >
              <Text className="text-xs font-bold text-[#2C7BFE]">+ Hide Files</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.75}
              onPress={() => setSelectedItem(item)}
              className="bg-[#181B26] border border-[#272B3B] rounded-2xl p-3.5 mb-3 flex-row items-center justify-between shadow-sm shadow-black"
            >
              <View className="flex-row items-center flex-1 pr-3">
                {/* THUMBNAIL / ICON */}
                {item.type === 'image' && item.thumbnailUri ? (
                  <Image
                    source={{ uri: item.thumbnailUri }}
                    className="w-13 h-13 w-[52px] h-[52px] rounded-xl mr-3 bg-[#202330]"
                    resizeMode="cover"
                  />
                ) : item.type === 'video' ? (
                  <View className="w-[52px] h-[52px] rounded-xl bg-[#2C7BFE]/15 border border-[#2C7BFE]/30 items-center justify-center mr-3">
                    <Text className="text-2xl">🎬</Text>
                  </View>
                ) : (
                  <View className="w-[52px] h-[52px] rounded-xl bg-[#FF9F0A]/15 border border-[#FF9F0A]/30 items-center justify-center mr-3">
                    <Text className="text-2xl">📄</Text>
                  </View>
                )}

                {/* DETAILS */}
                <View className="flex-1">
                  <Text className="text-sm font-bold text-white mb-0.5" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text className="text-[11px] text-[#8E94A7]">
                    {formatBytes(item.sizeBytes)} • 📅 {item.dateAdded} • {item.timeAdded}
                  </Text>
                  {item.note ? (
                    <Text className="text-[10px] text-[#555B70] mt-0.5" numberOfLines={1}>
                      "{item.note}"
                    </Text>
                  ) : null}
                </View>
              </View>

              {/* QUICK RESTORE OR ARROW */}
              <View className="items-end">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleRestoreToGallery(item)}
                  className="bg-[#2C7BFE]/15 border border-[#2C7BFE]/30 px-2.5 py-1 rounded-lg mb-1"
                >
                  <Text className="text-[10px] font-bold text-[#2C7BFE]">
                    📥 Restore
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* FLOATING ACTION BUTTON */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setIsImportModalOpen(true)}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#2C7BFE] items-center justify-center shadow-xl shadow-[#2C7BFE]/40"
      >
        <Text className="text-2xl text-white font-light">+</Text>
      </TouchableOpacity>

      {/* VIEWER MODAL */}
      <VaultViewerModal
        item={selectedItem}
        visible={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onDelete={handleDeleteItem}
        onRestoreToGallery={handleRestoreToGallery}
        onShare={handleShare}
      />

      {/* IMPORT MODAL */}
      <ImportVaultModal
        visible={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportItem={handleImportItem}
      />
    </SafeAreaView>
  );
};
