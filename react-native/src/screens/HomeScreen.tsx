import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';

interface HomeScreenProps {
  onSelectBranch: (branch: 'alarm' | 'notes') => void;
  activeAlarmsCount?: number;
  notesCount?: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectBranch,
  activeAlarmsCount = 2,
  notesCount = 3,
}) => {
  return (
    <SafeAreaView className="flex-1 bg-[#000000]">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* SAMSUNG ONE UI HOME HEADER */}
        <View className="pt-4 pb-6">
          <Text className="text-sm font-semibold uppercase tracking-wider text-[#2C7BFE] mb-1 font-sans">
            Personal System
          </Text>
          <Text className="text-4xl font-extrabold tracking-tight text-white font-sans">
            Daily Rhythm
          </Text>
          <Text className="text-sm text-[#8D92A4] mt-1.5 font-normal">
            Select a branch to manage your daily routines
          </Text>
        </View>

        {/* BRANCH SELECTION CARDS */}
        <View className="mb-6">
          <Text className="text-xs font-semibold uppercase tracking-wider text-[#676D80] mb-3 font-mono">
            System Branches
          </Text>

          {/* BRANCH 1: ALARMS & RHYTHM */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => onSelectBranch('alarm')}
            className="bg-[#1C1F2B] border border-[#272B3B] active:border-[#2C7BFE] rounded-[28px] p-6 mb-4 shadow-lg shadow-black/60"
          >
            <View className="flex-row items-center justify-between mb-4">
              <View className="w-12 h-12 rounded-2xl bg-[#2C7BFE]/15 border border-[#2C7BFE]/30 items-center justify-center">
                <Text className="text-2xl">⏰</Text>
              </View>

              <View className="px-3 py-1 rounded-full bg-[#2C7BFE]/20 border border-[#2C7BFE]/40">
                <Text className="text-[11px] font-bold text-[#2C7BFE]">
                  {activeAlarmsCount} Active
                </Text>
              </View>
            </View>

            <Text className="text-xl font-bold text-white mb-1.5 font-sans">
              Alarms & Rhythm
            </Text>
            <Text className="text-xs text-[#9DA3B5] leading-relaxed mb-4">
              Configure circadian wake anchors, deep work surges, and night recovery alarms with Samsung 3-wheel precision.
            </Text>

            <View className="flex-row items-center justify-between pt-3 border-t border-[#252938]">
              <Text className="text-xs text-[#2C7BFE] font-bold">
                Next: 7:30 AM (in 4h 15m)
              </Text>
              <Text className="text-base text-white font-bold">
                →
              </Text>
            </View>
          </TouchableOpacity>

          {/* BRANCH 2: NOTES & PROTOCOLS */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => onSelectBranch('notes')}
            className="bg-[#1C1F2B] border border-[#272B3B] active:border-[#2C7BFE] rounded-[28px] p-6 mb-4 shadow-lg shadow-black/60"
          >
            <View className="flex-row items-center justify-between mb-4">
              <View className="w-12 h-12 rounded-2xl bg-[#2C7BFE]/15 border border-[#2C7BFE]/30 items-center justify-center">
                <Text className="text-2xl">📝</Text>
              </View>

              <View className="px-3 py-1 rounded-full bg-[#252838] border border-[#303548]">
                <Text className="text-[11px] font-semibold text-[#8E94A7]">
                  {notesCount} Notes
                </Text>
              </View>
            </View>

            <Text className="text-xl font-bold text-white mb-1.5 font-sans">
              Notes & Protocols
            </Text>
            <Text className="text-xs text-[#9DA3B5] leading-relaxed mb-4">
              Create, edit, and organize biohacking insights with attached image evidence, photobiology logs, and pinned routines.
            </Text>

            <View className="flex-row items-center justify-between pt-3 border-t border-[#252938]">
              <Text className="text-xs text-[#8E94A7] font-medium">
                Photo attachments enabled
              </Text>
              <Text className="text-base text-white font-bold">
                →
              </Text>
            </View>
          </TouchableOpacity>

        </View>

        {/* QUICK STATUS CARD */}
        <View className="bg-[#141620] border border-[#1E212E] rounded-[24px] p-5 mb-8">
          <View className="flex-row items-center gap-2 mb-2">
            <Text className="text-base">⚡</Text>
            <Text className="text-xs font-bold text-white uppercase tracking-wider">
              Circadian Synchronization
            </Text>
          </View>
          <Text className="text-xs text-[#8D92A4] leading-relaxed">
            Your daily branches work symbiotically: use alarms to trigger photobiology protocols, and notes to log real-time recovery metrics.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

