import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export type MainBranchTab = 'home' | 'alarm' | 'notes' | 'expenses' | 'vault' | 'ai';

interface BottomNavProps {
  activeTab: MainBranchTab;
  onTabChange: (tab: MainBranchTab) => void;
  bottomInset?: number;
}

export const SamsungBottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  bottomInset = 12,
}) => {
  const tabs: { id: MainBranchTab; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: '⬡' },
    { id: 'alarm', label: 'Alarm', icon: '◉' },
    { id: 'notes', label: 'Notes', icon: '◆' },
    { id: 'expenses', label: 'Cash', icon: '▲' },
    { id: 'vault', label: 'Vault', icon: '■' },
    { id: 'ai', label: '✦ AI', icon: '✦' },
  ];

  return (
    <View
      className="bg-[#080816] border-t border-[#14142A] px-2 pt-2"
      style={{
        paddingBottom: Math.max(bottomInset, 8),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 16,
      }}
    >
      <View className="flex-row items-center justify-between">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.7}
              onPress={() => onTabChange(tab.id)}
              className={`items-center justify-center flex-1 py-1 rounded-2xl ${
                isActive ? 'bg-[#14142A]' : ''
              }`}
            >
              {/* Glowing dot indicator */}
              <View className="h-1.5 mb-1 items-center justify-center">
                {isActive && (
                  <View
                    className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7]"
                    style={{
                      shadowColor: '#6C5CE7',
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.9,
                      shadowRadius: 6,
                      elevation: 6,
                    }}
                  />
                )}
              </View>

              {/* Icon */}
              <Text
                className={`text-[15px] mb-0.5 ${
                  isActive ? 'text-[#E8E8F0] font-bold' : 'text-[#4A4A6A]'
                }`}
              >
                {tab.icon}
              </Text>

              {/* Label */}
              <Text
                numberOfLines={1}
                className={`text-[9px] uppercase tracking-[0.5px] ${
                  isActive
                    ? 'text-[#6C5CE7] font-bold'
                    : 'text-[#4A4A6A] font-medium'
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
