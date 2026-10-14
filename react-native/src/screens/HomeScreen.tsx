import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';

import { useApp } from '../context/AppContext';

interface HomeScreenProps {
  onSelectBranch: (branch: 'alarm' | 'notes' | 'expenses' | 'vault' | 'ai') => void;
  activeAlarmsCount?: number;
  notesCount?: number;
  balanceAmount?: number;
  vaultCount?: number;
}

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 5) return 'Deep Night';
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectBranch,
  activeAlarmsCount: propAlarmsCount,
  notesCount: propNotesCount,
  balanceAmount: propBalanceAmount,
  vaultCount: propVaultCount,
}) => {
  const app = useApp();
  const greeting = getGreeting();

  // Reactive counts from live shared app context
  const activeAlarmsCount = propAlarmsCount !== undefined ? propAlarmsCount : app.alarms.filter((a) => a.isEnabled).length;
  const notesCount = propNotesCount !== undefined ? propNotesCount : app.notes.length;
  const vaultCount = propVaultCount !== undefined ? propVaultCount : app.vaultItems.length;

  let computedBalance = 0;
  app.transactions.forEach((t) => {
    if (t.type === 'income') computedBalance += t.amount;
    else computedBalance -= t.amount;
  });
  const balanceAmount = propBalanceAmount !== undefined ? propBalanceAmount : computedBalance;

  return (
    <SafeAreaView className="flex-1 bg-[#050510]">
      <StatusBar barStyle="light-content" backgroundColor="#050510" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* DRAMATIC HEADER — Gradient mesh background simulation */}
        {/* ═══════════════════════════════════════════════════════ */}
        <View className="pt-14 pb-10 px-7">
          {/* Subtle gradient overlay layers */}
          <View className="absolute top-0 left-0 right-0 bottom-0 bg-[#0A0A18] opacity-60 rounded-b-[60px]" />
          <View className="absolute top-10 right-0 w-48 h-48 bg-[#6C5CE7] opacity-[0.04] rounded-full" />
          <View className="absolute top-20 left-[-40px] w-32 h-32 bg-[#FD79A8] opacity-[0.03] rounded-full" />

          {/* Greeting */}
          <Text className="text-[11px] font-medium tracking-[4px] uppercase text-[#6B6B8D] mb-3">
            {greeting}
          </Text>

          {/* App name — creative wide-spaced typography */}
          <View className="flex-row items-baseline mb-2">
            <Text className="text-[38px] font-extralight tracking-[14px] text-[#E8E8F0]">
              DIV
            </Text>
            <Text className="text-[38px] font-bold tracking-[14px] text-[#6C5CE7]">
              YANG
            </Text>
          </View>

          {/* Thin accent line */}
          <View className="flex-row items-center mt-3 gap-3">
            <View className="w-8 h-[1.5px] bg-[#6C5CE7] rounded-full" />
            <Text className="text-[10px] tracking-[3px] uppercase text-[#3D3D5C] font-medium">
              Personal System
            </Text>
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* BRANCH CARDS — Each wildly different                   */}
        {/* ═══════════════════════════════════════════════════════ */}
        <View className="px-5 pb-6">

          {/* ─── CARD 1: ALARM — Wide hero card with GIANT time ─── */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onSelectBranch('alarm')}
            className="mb-5"
          >
            <View className="bg-[#0D0D1A] border border-[#1E1E3A] rounded-[32px] overflow-hidden">
              {/* Inner glow layer */}
              <View className="absolute top-0 left-0 right-0 h-24 bg-[#6C5CE7] opacity-[0.04] rounded-t-[32px]" />

              <View className="p-7">
                {/* Top row: label + pulsing dot */}
                <View className="flex-row items-center justify-between mb-5">
                  <View className="flex-row items-center gap-2.5">
                    <View className="w-2 h-2 rounded-full bg-[#6C5CE7]" />
                    <Text className="text-[10px] font-bold tracking-[3px] uppercase text-[#6B6B8D]">
                      Wake Anchor
                    </Text>
                  </View>
                  <View className="px-3 py-1.5 rounded-full bg-[#6C5CE7]/10 border border-[#6C5CE7]/20">
                    <Text className="text-[10px] font-bold text-[#6C5CE7] tracking-wider">
                      {activeAlarmsCount} ACTIVE
                    </Text>
                  </View>
                </View>

                {/* GIANT TIME DISPLAY */}
                <View className="flex-row items-baseline mb-1">
                  <Text className="text-[72px] font-extralight text-[#E8E8F0] leading-none tracking-tighter">
                    07
                  </Text>
                  <Text className="text-[72px] font-extralight text-[#6C5CE7] leading-none mx-1">
                    :
                  </Text>
                  <Text className="text-[72px] font-extralight text-[#E8E8F0] leading-none tracking-tighter">
                    30
                  </Text>
                  <Text className="text-[18px] font-medium text-[#3D3D5C] ml-3 mb-2">
                    AM
                  </Text>
                </View>

                {/* Subtitle row */}
                <View className="flex-row items-center justify-between mt-2">
                  <Text className="text-[12px] text-[#6B6B8D] font-normal">
                    Next alarm in 4h 15m
                  </Text>
                  <Text className="text-[16px] text-[#3D3D5C] font-light">
                    ▸
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* ─── ROW: Notes (compact) + Expenses (balance) ─── */}
          <View className="flex-row gap-4 mb-5">

            {/* ─── CARD 2: NOTES — Compact with stacked preview lines ─── */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => onSelectBranch('notes')}
              className="flex-1"
            >
              <View className="bg-[#0D0D1A] border border-[#1E1E3A] rounded-[28px] overflow-hidden">
                {/* Left accent bar */}
                <View className="absolute left-0 top-5 bottom-5 w-[3px] bg-[#FD79A8] rounded-full" />

                <View className="p-6 pl-7">
                  {/* Header */}
                  <View className="flex-row items-center gap-2 mb-4">
                    <Text className="text-[14px] text-[#FD79A8] font-bold">◆</Text>
                    <Text className="text-[10px] font-bold tracking-[2px] uppercase text-[#6B6B8D]">
                      Notes
                    </Text>
                  </View>

                  {/* Simulated note preview lines */}
                  <View className="mb-4 gap-2.5">
                    <View className="flex-row items-center gap-2">
                      <View className="w-1.5 h-1.5 rounded-full bg-[#FD79A8] opacity-80" />
                      <View className="h-[6px] w-[80%] bg-[#1A1A35] rounded-full" />
                    </View>
                    <View className="flex-row items-center gap-2">
                      <View className="w-1.5 h-1.5 rounded-full bg-[#FD79A8] opacity-50" />
                      <View className="h-[6px] w-[60%] bg-[#14142A] rounded-full" />
                    </View>
                    <View className="flex-row items-center gap-2">
                      <View className="w-1.5 h-1.5 rounded-full bg-[#FD79A8] opacity-30" />
                      <View className="h-[6px] w-[70%] bg-[#14142A] rounded-full" />
                    </View>
                  </View>

                  {/* Count */}
                  <View className="flex-row items-baseline gap-1.5">
                    <Text className="text-[28px] font-bold text-[#E8E8F0] leading-none">
                      {notesCount}
                    </Text>
                    <Text className="text-[10px] text-[#3D3D5C] font-medium tracking-wider uppercase">
                      entries
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {/* ─── CARD 3: EXPENSES — Giant balance number ─── */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => onSelectBranch('expenses')}
              className="flex-1"
            >
              <View className="bg-[#0D0D1A] border border-[#1E1E3A] rounded-[28px] overflow-hidden">
                {/* Subtle top glow */}
                <View className="absolute top-0 left-0 right-0 h-16 bg-[#00B894] opacity-[0.04] rounded-t-[28px]" />

                <View className="p-6">
                  {/* Header */}
                  <View className="flex-row items-center gap-2 mb-4">
                    <Text className="text-[14px] text-[#00B894] font-bold">▲</Text>
                    <Text className="text-[10px] font-bold tracking-[2px] uppercase text-[#6B6B8D]">
                      Cashflow
                    </Text>
                  </View>

                  {/* Mini sparkline decoration (styled Views) */}
                  <View className="flex-row items-end gap-[3px] mb-4 h-8">
                    <View className="w-[4px] h-[8px] bg-[#00B894] opacity-20 rounded-full" />
                    <View className="w-[4px] h-[14px] bg-[#00B894] opacity-30 rounded-full" />
                    <View className="w-[4px] h-[10px] bg-[#00B894] opacity-25 rounded-full" />
                    <View className="w-[4px] h-[18px] bg-[#00B894] opacity-40 rounded-full" />
                    <View className="w-[4px] h-[12px] bg-[#00B894] opacity-30 rounded-full" />
                    <View className="w-[4px] h-[22px] bg-[#00B894] opacity-50 rounded-full" />
                    <View className="w-[4px] h-[16px] bg-[#00B894] opacity-35 rounded-full" />
                    <View className="w-[4px] h-[28px] bg-[#00B894] opacity-70 rounded-full" />
                  </View>

                  {/* HUGE balance amount */}
                  <View className="flex-row items-baseline">
                    <Text className="text-[13px] font-light text-[#00B894] mr-0.5">
                      $
                    </Text>
                    <Text className="text-[26px] font-bold text-[#E8E8F0] leading-none tracking-tight">
                      {Math.floor(balanceAmount).toLocaleString()}
                    </Text>
                  </View>
                  <Text className="text-[10px] text-[#3D3D5C] font-medium mt-1 tracking-wider uppercase">
                    Balance
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* ─── CARD 4: VAULT — Mysterious dark card ─── */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onSelectBranch('vault')}
            className="mb-5"
          >
            <View className="bg-[#08081A] border border-[#12122A] rounded-[32px] overflow-hidden">
              <View className="p-7">
                <View className="flex-row items-center justify-between">
                  {/* Left side: keyhole decoration + text */}
                  <View className="flex-1">
                    {/* Keyhole decorative element */}
                    <View className="mb-5 items-start">
                      <View className="w-10 h-10 rounded-full border-2 border-[#FDCB6E]/15 items-center justify-center">
                        <View className="w-4 h-4 rounded-full border border-[#FDCB6E]/25 items-center justify-center">
                          <View className="w-1.5 h-1.5 rounded-full bg-[#FDCB6E] opacity-40" />
                        </View>
                      </View>
                      {/* Key shaft */}
                      <View className="w-[2px] h-4 bg-[#FDCB6E]/10 self-center mt-[-2px]" />
                    </View>

                    <Text className="text-[10px] font-bold tracking-[3px] uppercase text-[#3D3D5C] mb-2">
                      Secret Vault
                    </Text>
                    <Text className="text-[16px] font-semibold text-[#6B6B8D]">
                      {vaultCount} items secured
                    </Text>
                  </View>

                  {/* Right side: PIN indicator */}
                  <View className="items-center gap-2">
                    <View className="flex-row gap-1.5">
                      <View className="w-2 h-2 rounded-full bg-[#FDCB6E] opacity-30" />
                      <View className="w-2 h-2 rounded-full bg-[#FDCB6E] opacity-30" />
                      <View className="w-2 h-2 rounded-full bg-[#FDCB6E] opacity-30" />
                      <View className="w-2 h-2 rounded-full bg-[#FDCB6E] opacity-30" />
                    </View>
                    <Text className="text-[9px] tracking-[2px] uppercase text-[#3D3D5C] font-medium">
                      PIN
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          {/* ─── CARD 5: NEURAL AI CORE — Autonomous Orchestrator (NEW) ─── */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onSelectBranch('ai')}
            className="mb-5"
          >
            <View className="bg-[#0A0D1F] border border-[#6C5CE7]/40 rounded-[32px] overflow-hidden shadow-2xl shadow-[#6C5CE7]/20">
              {/* Violet ambient glow */}
              <View className="absolute top-0 right-0 w-48 h-48 bg-[#6C5CE7] opacity-[0.08] rounded-full" />
              <View className="h-[2px] w-24 bg-[#6C5CE7]" />

              <View className="p-7">
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center gap-2">
                    <View className="w-2 h-2 rounded-full bg-[#00B894]" />
                    <Text className="text-[10px] font-bold tracking-[3px] uppercase text-[#00B894]">
                      Autonomous Core
                    </Text>
                  </View>
                  <View className="px-3 py-1 rounded-full bg-[#6C5CE7]/20 border border-[#6C5CE7]/40">
                    <Text className="text-[10px] font-bold text-[#E8E8F0] tracking-[1px] uppercase">
                      4 Hooks Ready
                    </Text>
                  </View>
                </View>

                <Text className="text-2xl font-extrabold text-[#E8E8F0] mb-1.5 font-sans">
                  Neural Cortex AI
                </Text>
                <Text className="text-xs text-[#6B6B8D] leading-relaxed mb-4">
                  Natural language controller commanding all 4 branches: insert alarms, log cashflow, create protocols, and analyze telemetry.
                </Text>

                <View className="flex-row items-center justify-between pt-3 border-t border-[#1E1E3A]">
                  <Text className="text-xs text-[#6C5CE7] font-bold uppercase tracking-[1px]">
                    ✦ Open Command Terminal
                  </Text>
                  <Text className="text-base text-white font-bold">
                    →
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

        </View>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SYSTEM STATUS FOOTER                                   */}
        {/* ═══════════════════════════════════════════════════════ */}
        <View className="px-7 pb-10">
          <View className="flex-row items-center gap-2 mb-2">
            <View className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7] opacity-50" />
            <Text className="text-[9px] tracking-[3px] uppercase text-[#3D3D5C] font-medium">
              System Sync
            </Text>
          </View>
          <Text className="text-[11px] text-[#3D3D5C] leading-relaxed font-light">
            All branches synchronized and operational.
          </Text>
        </View>

        {/* Bottom padding for nav clearance */}
        <View className="h-24" />

      </ScrollView>
    </SafeAreaView>
  );
};
