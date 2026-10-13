import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, LayoutAnimation, Platform, UIManager } from 'react-native';
import { AlarmItem } from '../types/alarm';
import { DayPills } from './DayPills';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AlarmCardProps {
  alarm: AlarmItem;
  onToggle: (id: string, value: boolean) => void;
  onDelete?: (id: string) => void;
}

export const AlarmCard: React.FC<AlarmCardProps> = ({ alarm, onToggle, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View
      className={`rounded-[26px] mb-3.5 transition-all overflow-hidden ${
        alarm.isEnabled
          ? 'bg-[#1C1F2B] border border-[#272B3B]'
          : 'bg-[#14161F] border border-[#1A1C25] opacity-70'
      }`}
    >
      {/* Main Clickable Card Surface */}
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={toggleExpand}
        className="p-5"
      >
        <View className="flex-row items-center justify-between">
          
          {/* Left Column: Time, Label, and Days */}
          <View className="flex-1 pr-3">
            
            {/* Digital Time & Period */}
            <View className="flex-row items-baseline mb-1">
              <Text
                className={`text-4xl font-bold font-sans tracking-tight ${
                  alarm.isEnabled ? 'text-white' : 'text-[#6C7182]'
                }`}
              >
                {alarm.time}
              </Text>
              <Text
                className={`text-sm font-semibold ml-2 uppercase ${
                  alarm.isEnabled ? 'text-[#2C7BFE]' : 'text-[#4B5061]'
                }`}
              >
                {alarm.period}
              </Text>
            </View>

            {/* Alarm Label / Purpose */}
            <Text
              className={`text-sm mb-3.5 font-normal ${
                alarm.isEnabled ? 'text-[#CBD0DF]' : 'text-[#5B6070]'
              }`}
            >
              {alarm.label}
            </Text>

            {/* Days Chips Row (Samsung S M T W T F S) */}
            <DayPills
              selectedDays={alarm.days}
              isAlarmEnabled={alarm.isEnabled}
            />
          </View>

          {/* Right Column: Samsung One UI Switch */}
          <View className="items-center justify-center pl-2">
            <Switch
              value={alarm.isEnabled}
              onValueChange={(val) => onToggle(alarm.id, val)}
              trackColor={{ false: '#2E3240', true: '#2C7BFE' }}
              thumbColor={alarm.isEnabled ? '#FFFFFF' : '#8A8F9E'}
              ios_backgroundColor="#2E3240"
            />
          </View>
        </View>
      </TouchableOpacity>

      {/* Expanded Quick Settings Drawer (Samsung Style) */}
      {isExpanded && (
        <View className="px-5 pb-5 pt-2 border-t border-[#252937] bg-[#151722]">
          <View className="flex-row justify-between items-center py-2.5">
            <Text className="text-xs text-[#82889A]">Alarm sound</Text>
            <Text className="text-xs text-[#E1E5F2] font-medium">{alarm.sound}</Text>
          </View>

          <View className="flex-row justify-between items-center py-2.5 border-t border-[#1F2230]">
            <Text className="text-xs text-[#82889A]">Vibration pattern</Text>
            <Text className="text-xs text-[#2C7BFE] font-medium">{alarm.vibration}</Text>
          </View>

          <View className="flex-row justify-between items-center py-2.5 border-t border-[#1F2230]">
            <Text className="text-xs text-[#82889A]">Snooze</Text>
            <Text className="text-xs text-[#E1E5F2] font-medium">{alarm.snooze}</Text>
          </View>

          {onDelete && (
            <TouchableOpacity
              onPress={() => onDelete(alarm.id)}
              className="mt-3 py-2.5 bg-[#FF3B30]/15 rounded-2xl items-center"
            >
              <Text className="text-xs text-[#FF453A] font-semibold">Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};
