import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export type MainBranchTab = 'home' | 'alarm' | 'notes' | 'expenses' | 'vault' | 'ai';

interface BottomNavProps {
  activeTab: MainBranchTab;
  onTabChange: (tab: MainBranchTab) => void;
}

export const SamsungBottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: { id: MainBranchTab; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: '⬡' },
    { id: 'alarm', label: 'Alarms', icon: '◉' },
    { id: 'notes', label: 'Notes', icon: '◆' },
    { id: 'expenses', label: 'Cashflow', icon: '▲' },
    { id: 'vault', label: 'Vault', icon: '■' },
    { id: 'ai', label: 'AI Core', icon: '✦' },
  ];

  return (
    <View className="absolute bottom-0 left-0 right-0 pb-2 px-4">
      {/* Floating pill container with frosted glass effect */}
      <View className="flex-row items-center justify-around py-3 bg-[rgba(13,13,26,0.92)] border border-[#1E1E3A] rounded-[28px] mx-1"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.4,
          shadowRadius: 20,
          elevation: 20,
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.7}
              onPress={() => onTabChange(tab.id)}
              className="items-center justify-center flex-1 py-1"
            >
              {/* Glowing dot indicator above icon */}
              <View className="h-2 mb-2 items-center justify-center">
                {isActive && (
                  <View className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7]"
                    style={{
                      shadowColor: '#6C5CE7',
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.9,
                      shadowRadius: 6,
                      elevation: 8,
                    }}
                  />
                )}
              </View>

              {/* Icon */}
              <Text
                className={`text-[16px] mb-1 ${
                  isActive ? 'text-[#E8E8F0]' : 'text-[#3D3D5C]'
                }`}
              >
                {tab.icon}
              </Text>

              {/* Label */}
              <Text
                className={`text-[9px] tracking-[1px] uppercase ${
                  isActive
                    ? 'text-[#E8E8F0] font-bold'
                    : 'text-[#3D3D5C] font-medium'
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
