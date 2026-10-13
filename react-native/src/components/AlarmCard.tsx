import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, LayoutAnimation, Platform, UIManager } from 'react-native';
import { AlarmItem } from '../types/alarm';
import { DayPills } from './DayPills';

// Enable layout animation on Android
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

  // Category badge color schemes
  const getCategoryTheme = () => {
    switch (alarm.category) {
      case 'Morning Routine':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          text: 'text-amber-400',
        };
      case 'Deep Work':
        return {
          bg: 'bg-cyan-500/10',
          border: 'border-cyan-500/30',
          text: 'text-cyan-400',
        };
      case 'Recovery':
      default:
        return {
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/30',
          text: 'text-purple-400',
        };
    }
  };

  const categoryTheme = getCategoryTheme();

  return (
    <View
      className={`rounded-2xl mb-4 transition-all duration-200 border ${
        alarm.isEnabled
          ? 'bg-slate-900/90 border-slate-700/80 shadow-lg shadow-emerald-950/20'
          : 'bg-slate-900/40 border-slate-800/40 opacity-75'
      }`}
    >
      {/* Top Accent Glow Bar when Active */}
      {alarm.isEnabled && (
        <View className="h-0.5 w-full bg-gradient-to-r from-emerald-500/60 via-cyan-500/40 to-transparent rounded-t-2xl" />
      )}

      {/* Main Touchable Surface */}
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={toggleExpand}
        className="p-5"
      >
        {/* Top Meta Row: Category Pill & Sound hint */}
        <View className="flex-row items-center justify-between mb-3">
          <View
            className={`px-2.5 py-1 rounded-full border ${categoryTheme.bg} ${categoryTheme.border}`}
          >
            <Text className={`text-xs font-medium tracking-wide ${categoryTheme.text}`}>
              {alarm.category}
            </Text>
          </View>

          {alarm.isEnabled && (
            <View className="flex-row items-center space-x-1.5 gap-1.5">
              <View className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <Text className="text-[11px] text-slate-400 font-mono">Active</Text>
            </View>
          )}
        </View>

        {/* Middle Row: Digital Time & Interactive Toggle */}
        <View className="flex-row items-baseline justify-between mb-2">
          <View className="flex-row items-baseline">
            <Text
              className={`text-4xl font-bold tracking-tight font-sans ${
                alarm.isEnabled ? 'text-white' : 'text-slate-500'
              }`}
            >
              {alarm.time.split(' ')[0]}
            </Text>
            <Text
              className={`text-sm font-semibold ml-1.5 tracking-wider uppercase ${
                alarm.isEnabled ? 'text-emerald-400' : 'text-slate-600'
              }`}
            >
              {alarm.time.split(' ')[1]}
            </Text>
          </View>

          {/* iOS / Android Native Switch */}
          <Switch
            value={alarm.isEnabled}
            onValueChange={(val) => onToggle(alarm.id, val)}
            trackColor={{ false: '#1e293b', true: '#10b981' }}
            thumbColor={alarm.isEnabled ? '#ffffff' : '#64748b'}
            ios_backgroundColor="#1e293b"
          />
        </View>

        {/* Label & Protocol Name */}
        <Text
          className={`text-sm font-medium mb-3.5 ${
            alarm.isEnabled ? 'text-slate-200' : 'text-slate-500'
          }`}
        >
          {alarm.label}
        </Text>

        {/* Bottom Row: Days Active Pills & Expand Hint */}
        <View className="flex-row items-center justify-between pt-1 border-t border-slate-800/40">
          <DayPills
            selectedDays={alarm.days}
            isAlarmEnabled={alarm.isEnabled}
          />

          <Text className="text-xs text-slate-500">
            {isExpanded ? 'Collapse ▲' : 'Edit ▼'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Expanded Quick-Edit Drawer */}
      {isExpanded && (
        <View className="px-5 pb-5 pt-1 border-t border-slate-800/80 bg-slate-950/40 rounded-b-2xl">
          <View className="flex-row justify-between items-center py-2.5">
            <Text className="text-xs text-slate-400">Tone</Text>
            <Text className="text-xs text-slate-200 font-medium">{alarm.sound}</Text>
          </View>

          <View className="flex-row justify-between items-center py-2.5 border-t border-slate-800/40">
            <Text className="text-xs text-slate-400">Haptic Vibration</Text>
            <Text className="text-xs text-emerald-400 font-medium">
              {alarm.vibration ? 'Synchronized Pulse' : 'Off'}
            </Text>
          </View>

          <View className="flex-row justify-between items-center py-2.5 border-t border-slate-800/40">
            <Text className="text-xs text-slate-400">Snooze (5 min)</Text>
            <Text className="text-xs text-slate-300 font-medium">
              {alarm.snoozeEnabled ? 'Enabled' : 'Disabled'}
            </Text>
          </View>

          {onDelete && (
            <TouchableOpacity
              onPress={() => onDelete(alarm.id)}
              className="mt-3 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl items-center"
            >
              <Text className="text-xs text-rose-400 font-medium">Delete Alarm</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};
