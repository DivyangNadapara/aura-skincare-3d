import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export type MainBranchTab = 'Alarm' | 'Notes' | 'WorldClock' | 'Timer';

interface BottomNavProps {
  activeTab: MainBranchTab;
  onTabChange: (tab: MainBranchTab) => void;
}

export const SamsungBottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: { id: MainBranchTab; label: string; icon: string }[] = [
    { id: 'Alarm', label: 'Alarms', icon: '⏰' },
    { id: 'Notes', label: 'Notes', icon: '📝' },
    { id: 'WorldClock', label: 'World clock', icon: '🌐' },
    { id: 'Timer', label: 'Timer', icon: '⏳' },
  ];

  return (
    <View className="flex-row items-center justify-around py-3 bg-[#0C0E14] border-t border-[#1C1F2B]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.7}
            onPress={() => onTabChange(tab.id)}
            className="items-center justify-center flex-1"
          >
            <Text className="text-lg mb-0.5">{tab.icon}</Text>
            <Text
              className={`text-[11px] font-medium ${
                isActive ? 'text-[#2C7BFE] font-bold' : 'text-[#6F7485]'
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
