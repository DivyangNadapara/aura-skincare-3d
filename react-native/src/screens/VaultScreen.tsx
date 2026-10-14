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

import { useApp } from '../context/AppContext';

interface VaultScreenProps {
  onBack?: () => void;
}

export const VaultScreen: React.FC<VaultScreenProps> = ({ onBack }) => {
  const app = useApp();
  const isUnlocked = app.isVaultUnlocked;
  const setIsUnlocked = (unlocked: boolean) => {
    if (unlocked) app.unlockVault();
    else app.lockVault();
  };
  const vaultItems = app.vaultItems;
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
    app.addVaultItem(newItem);
  };

  const handleDeleteItem = (id: string) => {
    app.deleteVaultItem(id);
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
    <View className="flex-1 bg-[#050510]">
      {/* ── AMBIENT GRADIENT MESH SIMULATION ── */}
      <View className="absolute top-0 left-0 right-0 h-96 bg-[#08081A] opacity-60" />
      <View className="absolute top-16 right-[-60px] w-64 h-64 rounded-full bg-[#6C5CE7] opacity-[0.04]" />
      <View className="absolute top-48 left-[-40px] w-48 h-48 rounded-full bg-[#00B894] opacity-[0.03]" />

      <View className="flex-1">
        {/* ── TOP ACTION BAR ── */}
        <View className="flex-row items-center justify-between px-5 pt-2 pb-2 z-10">
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

          <View className="flex-row items-center gap-3">
            {/* Lock Button */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsUnlocked(false)}
              className="flex-row items-center gap-1.5 bg-[#0D0D1A] px-3.5 py-1.5 rounded-full border border-[#1E1E3A]"
            >
              <View className="w-1.5 h-1.5 rounded-full bg-[#FD79A8]" />
              <Text className="text-[10px] font-bold tracking-[2px] uppercase text-[#FD79A8]">
                Lock
              </Text>
            </TouchableOpacity>

            {/* Add / Import Button */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsImportModalOpen(true)}
              className="w-8 h-8 rounded-full bg-[#6C5CE7]/15 border border-[#6C5CE7]/30 items-center justify-center"
            >
              <Text className="text-lg font-light text-[#E8E8F0] leading-none">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── DRAMATIC HEADER ── */}
        <View className="px-6 pt-3 pb-5">
          <View className="flex-row items-center gap-2 mb-1.5">
            <View className="w-2 h-2 rounded-full bg-[#00B894]" />
            <Text className="text-[10px] font-bold tracking-[3px] uppercase text-[#6B6B8D]">
              Encrypted Enclave
            </Text>
          </View>
          <Text className="text-3xl font-extrabold tracking-tight text-[#E8E8F0] font-sans">
            Secret Vault
          </Text>
          <Text className="text-xs text-[#6B6B8D] mt-1 font-normal tracking-wide">
            Zero-knowledge sandbox for private media & confidential files
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-4"
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'ios' ? 100 : 90,
          }}
        >
          {/* ── VAULT STORAGE HERO CARD ── */}
          <View className="bg-[#0D0D1A] border border-[#1E1E3A] rounded-[32px] p-6 mb-5 overflow-hidden shadow-2xl shadow-black">
            {/* Ambient card glow */}
            <View className="absolute top-0 right-0 w-40 h-40 bg-[#6C5CE7] opacity-[0.06] rounded-full" />
            <View className="absolute top-0 left-0 h-[2px] w-24 bg-[#6C5CE7]" />

            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-[10px] font-bold uppercase tracking-[3px] text-[#6B6B8D]">
                Occupied Storage
              </Text>
              <View className="bg-[#00B894]/10 border border-[#00B894]/25 px-2.5 py-0.5 rounded-full">
                <Text className="text-[10px] font-bold tracking-[1px] uppercase text-[#00B894]">
                  AES-256
                </Text>
              </View>
            </View>

            <View className="flex-row items-baseline gap-2 mb-2">
              <Text className="text-5xl font-extrabold tracking-tighter text-[#E8E8F0]">
                {formatBytes(totalStorageBytes).split(' ')[0]}
              </Text>
              <Text className="text-xl font-bold text-[#6C5CE7]">
                {formatBytes(totalStorageBytes).split(' ')[1] || 'B'}
              </Text>
            </View>

            <Text className="text-xs text-[#6B6B8D] mb-5">
              {vaultItems.length} personal artifacts protected from system gallery
            </Text>

            {/* Quick action button to encrypt new files */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsImportModalOpen(true)}
              className="bg-[#6C5CE7] py-3.5 rounded-2xl flex-row items-center justify-center gap-2 shadow-lg shadow-[#6C5CE7]/30"
            >
              <Text className="text-sm text-white font-bold">＋</Text>
              <Text className="text-xs font-bold text-white uppercase tracking-[2px]">
                Encrypt New Artifact
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── CATEGORY FILTER PILLS ── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-5"
            contentContainerStyle={{ gap: 8 }}
          >
            {[
              { id: 'all' as const, label: `All (${counts.all})`, icon: '⬡' },
              { id: 'image' as const, label: `Photos (${counts.image})`, icon: '◆' },
              { id: 'video' as const, label: `Videos (${counts.video})`, icon: '▲' },
              { id: 'document' as const, label: `Docs (${counts.document})`, icon: '■' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  activeOpacity={0.7}
                  className={`flex-row items-center gap-1.5 px-4 py-2.5 rounded-2xl border ${
                    isActive
                      ? 'bg-[#6C5CE7] border-[#6C5CE7]'
                      : 'bg-[#0D0D1A] border-[#1E1E3A]'
                  }`}
                >
                  <Text
                    className={`text-xs ${
                      isActive ? 'text-white' : 'text-[#6B6B8D]'
                    }`}
                  >
                    {tab.icon}
                  </Text>
                  <Text
                    className={`text-xs font-bold tracking-wider ${
                      isActive ? 'text-white' : 'text-[#6B6B8D]'
                    }`}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* ── VAULT ITEMS LIST ── */}
          {filteredItems.length === 0 ? (
            <View className="items-center justify-center py-16 bg-[#0D0D1A] border border-[#1E1E3A] rounded-[32px] px-6">
              <View className="w-16 h-16 rounded-3xl bg-[#14142A] border border-[#1E1E3A] items-center justify-center mb-4">
                <Text className="text-2xl text-[#6C5CE7]">◈</Text>
              </View>
              <Text className="text-base font-bold text-[#E8E8F0] mb-1">
                Zero Artifacts Stored
              </Text>
              <Text className="text-xs text-[#6B6B8D] text-center max-w-xs mb-5 leading-relaxed">
                Import private photos, high-res videos, or seed documents into this isolated encrypted sector.
              </Text>
              <TouchableOpacity
                onPress={() => setIsImportModalOpen(true)}
                className="bg-[#14142A] px-5 py-2.5 rounded-xl border border-[#1E1E3A]"
              >
                <Text className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider">
                  + Import File
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.75}
                onPress={() => setSelectedItem(item)}
                className="bg-[#0D0D1A] border border-[#1E1E3A] rounded-[24px] p-4 mb-3 flex-row items-center justify-between"
              >
                <View className="flex-row items-center flex-1 pr-3">
                  {/* THUMBNAIL / GLYPH */}
                  {item.type === 'image' && item.thumbnailUri ? (
                    <Image
                      source={{ uri: item.thumbnailUri }}
                      className="w-12 h-12 rounded-2xl mr-3 bg-[#14142A] border border-[#1E1E3A]"
                      resizeMode="cover"
                    />
                  ) : item.type === 'video' ? (
                    <View className="w-12 h-12 rounded-2xl bg-[#FD79A8]/10 border border-[#FD79A8]/20 items-center justify-center mr-3">
                      <Text className="text-sm font-bold text-[#FD79A8]">▲</Text>
                    </View>
                  ) : (
                    <View className="w-12 h-12 rounded-2xl bg-[#6C5CE7]/10 border border-[#6C5CE7]/20 items-center justify-center mr-3">
                      <Text className="text-sm font-bold text-[#6C5CE7]">■</Text>
                    </View>
                  )}

                  {/* DETAILS */}
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-[#E8E8F0] mb-0.5" numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text className="text-[11px] text-[#6B6B8D] font-mono">
                      {formatBytes(item.sizeBytes)} • {item.dateAdded} • {item.timeAdded}
                    </Text>
                    {item.note ? (
                      <Text className="text-[10px] text-[#3D3D5C] mt-0.5" numberOfLines={1}>
                        "{item.note}"
                      </Text>
                    ) : null}
                  </View>
                </View>

                {/* RESTORE ACTION PILL */}
                <View className="items-end">
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleRestoreToGallery(item)}
                    className="bg-[#00B894]/10 border border-[#00B894]/25 px-3 py-1.5 rounded-xl"
                  >
                    <Text className="text-[10px] font-bold tracking-wider uppercase text-[#00B894]">
                      ↑ Restore
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
          className="absolute bottom-4 right-4 w-14 h-14 rounded-full bg-[#6C5CE7] items-center justify-center shadow-2xl shadow-[#6C5CE7]/50"
        >
          <Text className="text-2xl text-white font-light">+</Text>
        </TouchableOpacity>
      </View>

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
    </View>
  );
};
