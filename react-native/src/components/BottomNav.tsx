import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export const SamsungBottomNav: React.FC<{ activeTab?: string }> = ({ activeTab = 'Alarm' }) => {
  const tabs = [
    { id: 'Alarm', label: 'Alarm', icon: '⏰' },
    { id: 'WorldClock', label: 'World clock', icon: '🌐' },
    { id: 'Stopwatch', label: 'Stopwatch', icon: '⏱️' },
    { id: 'Timer', label: 'Timer', icon: '⏳' },
  ];

  return (
    <View className="flex-row items-center justify-around py-3.5 bg-[#0C0E14] border-t border-[#1C1F2B]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.7}
            className="items-center justify-center flex-1"
          >
            <Text className="text-lg mb-1">{tab.icon}</Text>
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
