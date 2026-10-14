import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, LayoutAnimation, Platform } from 'react-native';
import { AlarmItem } from '../types/alarm';
import { DayPills } from './DayPills';

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
      className={`rounded-[32px] mb-4 overflow-hidden border ${
        alarm.isEnabled
          ? 'bg-[#0D0D1A] border-[#1E1E3A]'
          : 'bg-[#080814] border-[#121226] opacity-60'
      }`}
    >
      {/* Active accent top bar */}
      {alarm.isEnabled && (
        <View className="h-[2px] w-20 bg-[#6C5CE7]" />
      )}

      {/* Main Clickable Card Surface */}
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={toggleExpand}
        className="p-6"
      >
        <View className="flex-row items-center justify-between">
          {/* Left Column: Time, Label, and Days */}
          <View className="flex-1 pr-3">
            {/* Digital Time & Period */}
            <View className="flex-row items-baseline mb-1.5">
              <Text
                className={`text-5xl font-extralight tracking-tighter ${
                  alarm.isEnabled ? 'text-[#E8E8F0]' : 'text-[#3D3D5C]'
                }`}
              >
                {alarm.time}
              </Text>
              <Text
                className={`text-xs font-bold tracking-[2px] ml-2.5 uppercase ${
                  alarm.isEnabled ? 'text-[#6C5CE7]' : 'text-[#2D2D44]'
                }`}
              >
                {alarm.period}
              </Text>
            </View>

            {/* Alarm Label / Purpose */}
            <Text
              className={`text-xs mb-4 font-medium tracking-wide ${
                alarm.isEnabled ? 'text-[#6B6B8D]' : 'text-[#3D3D5C]'
              }`}
            >
              {alarm.label}
            </Text>

            {/* Days Chips Row */}
            <DayPills
              selectedDays={alarm.days}
              isAlarmEnabled={alarm.isEnabled}
            />
          </View>

          {/* Right Column: Switch */}
          <View className="items-center justify-center pl-2">
            <Switch
              value={alarm.isEnabled}
              onValueChange={(val) => onToggle(alarm.id, val)}
              trackColor={{ false: '#14142A', true: '#6C5CE7' }}
              thumbColor={alarm.isEnabled ? '#FFFFFF' : '#3D3D5C'}
              ios_backgroundColor="#14142A"
            />
          </View>
        </View>
      </TouchableOpacity>

      {/* Expanded Quick Settings Drawer */}
      {isExpanded && (
        <View className="px-6 pb-6 pt-3 border-t border-[#14142A] bg-[#0A0A14]">
          <View className="flex-row justify-between items-center py-2.5">
            <Text className="text-[11px] font-bold tracking-[2px] uppercase text-[#6B6B8D]">
              Acoustic Theme
            </Text>
            <Text className="text-xs text-[#E8E8F0] font-mono">{alarm.sound}</Text>
          </View>

          <View className="flex-row justify-between items-center py-2.5 border-t border-[#121224]">
            <Text className="text-[11px] font-bold tracking-[2px] uppercase text-[#6B6B8D]">
              Tactile Haptic
            </Text>
            <Text className="text-xs text-[#6C5CE7] font-mono">{alarm.vibration}</Text>
          </View>

          <View className="flex-row justify-between items-center py-2.5 border-t border-[#121224]">
            <Text className="text-[11px] font-bold tracking-[2px] uppercase text-[#6B6B8D]">
              Snooze Rhythm
            </Text>
            <Text className="text-xs text-[#E8E8F0] font-mono">{alarm.snoozeInterval}</Text>
          </View>

          {onDelete && (
            <TouchableOpacity
              onPress={() => onDelete(alarm.id)}
              className="mt-3 py-2.5 rounded-xl bg-[#FD79A8]/10 border border-[#FD79A8]/20 items-center"
            >
              <Text className="text-xs text-[#FD79A8] font-bold uppercase tracking-[2px]">
                Erase Anchor
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};
