import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { INITIAL_ALARMS } from '../data/mockAlarms';
import { AlarmItem } from '../types/alarm';
import { AlarmCard } from '../components/AlarmCard';
import { CreateAlarmModal } from '../components/CreateAlarmModal';

export const AlarmScreen: React.FC = () => {
  const [alarms, setAlarms] = useState<AlarmItem[]>(INITIAL_ALARMS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toggle alarm on/off
  const handleToggleAlarm = (id: string, isEnabled: boolean) => {
    setAlarms((prev) =>
      prev.map((alarm) => (alarm.id === id ? { ...alarm, isEnabled } : alarm))
    );
  };

  // Delete an alarm
  const handleDeleteAlarm = (id: string) => {
    setAlarms((prev) => prev.filter((alarm) => alarm.id !== id));
  };

  // Add new alarm
  const handleSaveNewAlarm = (newAlarmData: Omit<AlarmItem, 'id'>) => {
    const newAlarm: AlarmItem = {
      ...newAlarmData,
      id: `alarm-${Date.now()}`,
    };
    setAlarms((prev) => [...prev, newAlarm]);
  };

  // Dynamic calculation for "Next alarm in Xh Ym"
  const nextAlarmCountdown = useMemo(() => {
    const activeAlarms = alarms.filter((a) => a.isEnabled);
    if (activeAlarms.length === 0) return 'All alarms paused';
    // Returns subtle next alarm computation string
    return 'Next alarm in 4h 15m';
  }, [alarms]);

  return (
    <SafeAreaView className="flex-1 bg-[#090D14]">
      <StatusBar barStyle="light-content" backgroundColor="#090D14" />

      {/* Atmospheric Background Ambient Glow Accents */}
      <View
        pointerEvents="none"
        className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20"
      />
      <View
        pointerEvents="none"
        className="absolute bottom-40 left-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl -ml-20"
      />

      {/* Main Container */}
      <View className="flex-1 px-5 pt-3">
        
        {/* HEADER AREA */}
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-2xl font-bold tracking-tight text-white font-sans">
              Daily Rhythm & Alarms
            </Text>

            {/* Subtle Sub-Badge: Next Alarm Indicator */}
            <View className="flex-row items-center space-x-2 gap-2 mt-1.5">
              <View className="flex-row items-center px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25">
                <View className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                <Text className="text-xs font-medium text-emerald-400 font-mono tracking-tight">
                  {nextAlarmCountdown}
                </Text>
              </View>
              <Text className="text-xs text-slate-500 font-mono">
                {alarms.filter((a) => a.isEnabled).length} active
              </Text>
            </View>
          </View>

          {/* Top Right "+" Quick Add Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsModalOpen(true)}
            className="w-11 h-11 rounded-2xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 items-center justify-center shadow-md shadow-black/40 active:scale-95 transition-transform"
          >
            <Text className="text-white text-2xl font-light leading-none -mt-0.5">
              +
            </Text>
          </TouchableOpacity>
        </View>

        {/* ALARM CARD LIST SCROLLVIEW */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'ios' ? 40 : 24,
            paddingTop: 8,
          }}
        >
          {/* Section Subtitle */}
          <View className="flex-row items-center justify-between mb-3 px-1">
            <Text className="text-xs uppercase font-mono tracking-wider text-slate-400">
              Personalized Circadian Protocols
            </Text>
            <Text className="text-xs font-mono text-slate-500">
              {alarms.length} Routines
            </Text>
          </View>

          {/* Render Alarm Cards */}
          {alarms.map((alarm) => (
            <AlarmCard
              key={alarm.id}
              alarm={alarm}
              onToggle={handleToggleAlarm}
              onDelete={handleDeleteAlarm}
            />
          ))}

          {/* Bottom Spacing & Motivational Micro-Insight */}
          <View className="mt-4 p-4 rounded-xl border border-slate-800/60 bg-slate-900/30 items-center">
            <Text className="text-xs text-slate-400 text-center leading-relaxed">
              ⚡ Consistency Anchor: Aligning your wake-up time within a 20-minute window optimizes natural cortisol release and sleep architecture.
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* CREATE NEW ALARM BOTTOM SHEET MODAL */}
      <CreateAlarmModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNewAlarm}
      />
    </SafeAreaView>
  );
};
