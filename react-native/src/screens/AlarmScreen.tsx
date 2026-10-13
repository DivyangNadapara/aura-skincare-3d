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

interface AlarmScreenProps {
  onBack?: () => void;
}

export const AlarmScreen: React.FC<AlarmScreenProps> = ({ onBack }) => {
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
    setAlarms((prev) => [newAlarm, ...prev]);
  };

  // Dynamic next alarm computation
  const nextAlarmSubtitle = useMemo(() => {
    const active = alarms.filter((a) => a.isEnabled);
    if (active.length === 0) return 'All alarms off';
    return 'Next alarm in 4 hours 15 minutes';
  }, [alarms]);

  return (
    <SafeAreaView className="flex-1 bg-[#000000]">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Main Container */}
      <View className="flex-1">
        
        {/* SAMSUNG TOP ACTION BAR */}
        <View className="flex-row items-center justify-between px-6 pt-3 pb-2">
          {onBack ? (
            <TouchableOpacity onPress={onBack} activeOpacity={0.7} className="py-1 pr-3 flex-row items-center gap-1">
              <Text className="text-xl text-white">←</Text>
              <Text className="text-sm font-semibold text-[#8D92A4]">Home</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
          
          <View className="flex-row items-center space-x-5 gap-5">
            {/* Search Icon */}
            <TouchableOpacity activeOpacity={0.7} className="p-1">
              <Text className="text-xl text-[#9EA3B5]">🔍</Text>
            </TouchableOpacity>

            {/* Plus Icon (Add Alarm) */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsModalOpen(true)}
              className="p-1"
            >
              <Text className="text-2xl font-light text-white leading-none">+</Text>
            </TouchableOpacity>

            {/* Overflow Menu (3-dots) */}
            <TouchableOpacity activeOpacity={0.7} className="p-1">
              <Text className="text-xl text-[#9EA3B5] font-bold">⋮</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SAMSUNG LARGE ONE UI HEADER */}
        <View className="px-6 pt-2 pb-6">
          <Text className="text-3xl font-bold tracking-tight text-white font-sans">
            Alarm
          </Text>
          <Text className="text-sm text-[#8D92A4] mt-1 font-normal">
            {nextAlarmSubtitle}
          </Text>
        </View>

        {/* ALARM CARD LIST SCROLLVIEW */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-4"
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'ios' ? 80 : 70,
          }}
        >
          {alarms.map((alarm) => (
            <AlarmCard
              key={alarm.id}
              alarm={alarm}
              onToggle={handleToggleAlarm}
              onDelete={handleDeleteAlarm}
            />
          ))}
        </ScrollView>
      </View>

      {/* SAMSUNG CREATE ALARM MODAL */}
      <CreateAlarmModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNewAlarm}
      />
    </SafeAreaView>
  );
};
