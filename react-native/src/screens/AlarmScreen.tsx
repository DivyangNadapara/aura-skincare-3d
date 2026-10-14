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

import { useApp } from '../context/AppContext';

interface AlarmScreenProps {
  onBack?: () => void;
}

export const AlarmScreen: React.FC<AlarmScreenProps> = ({ onBack }) => {
  const app = useApp();
  const alarms = app.alarms;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleAlarm = (id: string, isEnabled: boolean) => {
    app.toggleAlarm(id, isEnabled);
  };

  const handleDeleteAlarm = (id: string) => {
    app.deleteAlarm(id);
  };

  const handleSaveNewAlarm = (newAlarmData: Omit<AlarmItem, 'id'>) => {
    app.addAlarm(newAlarmData);
  };

  // Dynamic next alarm computation
  const nextAlarmSubtitle = useMemo(() => {
    const active = alarms.filter((a) => a.isEnabled);
    if (active.length === 0) return 'All wake anchors inactive';
    return 'Next wake anchor in 4h 15m';
  }, [alarms]);

  return (
    <SafeAreaView className="flex-1 bg-[#050510]">
      <StatusBar barStyle="light-content" backgroundColor="#050510" />

      {/* ── AMBIENT GRADIENT MESH SIMULATION ── */}
      <View className="absolute top-0 left-0 right-0 h-96 bg-[#08081A] opacity-60" />
      <View className="absolute top-16 right-[-50px] w-64 h-64 rounded-full bg-[#6C5CE7] opacity-[0.05]" />
      <View className="absolute top-48 left-[-40px] w-48 h-48 rounded-full bg-[#FD79A8] opacity-[0.02]" />

      <View className="flex-1">
        {/* ── TOP ACTION BAR ── */}
        <View className="flex-row items-center justify-between px-6 pt-3 pb-2 z-10">
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

          <TouchableOpacity
            onPress={() => setIsModalOpen(true)}
            activeOpacity={0.7}
            className="w-8 h-8 rounded-full bg-[#6C5CE7]/15 border border-[#6C5CE7]/30 items-center justify-center"
          >
            <Text className="text-lg font-light text-[#E8E8F0] leading-none">+</Text>
          </TouchableOpacity>
        </View>

        {/* ── DRAMATIC HEADER ── */}
        <View className="px-6 pt-3 pb-5">
          <View className="flex-row items-center gap-2 mb-1.5">
            <View className="w-2 h-2 rounded-full bg-[#6C5CE7]" />
            <Text className="text-[10px] font-bold tracking-[3px] uppercase text-[#6B6B8D]">
              Circadian Anchors
            </Text>
          </View>
          <Text className="text-3xl font-extrabold tracking-tight text-[#E8E8F0] font-sans">
            Rhythm Clocks
          </Text>
          <Text className="text-xs text-[#6B6B8D] mt-1 font-mono tracking-wide">
            {nextAlarmSubtitle}
          </Text>
        </View>

        {/* ── ALARMS LIST ── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-4"
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'ios' ? 100 : 90,
          }}
        >
          {alarms.length === 0 ? (
            <View className="items-center justify-center py-20 bg-[#0D0D1A] border border-[#1E1E3A] rounded-[32px] px-6">
              <View className="w-16 h-16 rounded-3xl bg-[#14142A] border border-[#1E1E3A] items-center justify-center mb-4">
                <Text className="text-2xl text-[#6C5CE7]">◉</Text>
              </View>
              <Text className="text-base font-bold text-[#E8E8F0] mb-1">
                Zero Anchors Set
              </Text>
              <Text className="text-xs text-[#6B6B8D] text-center max-w-xs mb-5">
                Set wake rhythms or deep work surges to stabilize your sleep homeostasis.
              </Text>
            </View>
          ) : (
            alarms.map((alarm) => (
              <AlarmCard
                key={alarm.id}
                alarm={alarm}
                onToggle={handleToggleAlarm}
                onDelete={handleDeleteAlarm}
              />
            ))
          )}
        </ScrollView>

        {/* FLOATING ACTION BUTTON */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setIsModalOpen(true)}
          className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#6C5CE7] items-center justify-center shadow-2xl shadow-[#6C5CE7]/50"
        >
          <Text className="text-2xl text-white font-light">+</Text>
        </TouchableOpacity>
      </View>

      {/* CREATE ALARM MODAL */}
      <CreateAlarmModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNewAlarm}
      />
    </SafeAreaView>
  );
};
