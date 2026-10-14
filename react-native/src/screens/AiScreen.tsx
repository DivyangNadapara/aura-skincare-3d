import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { AiCommandEngine, AiActionResult } from '../services/aiCore';

interface ChatMessage {
  id: string;
  sender: 'user' | 'cortex';
  text: string;
  timestamp: string;
  action?: AiActionResult;
}

const QUICK_PROMPTS = [
  '✦ System Briefing',
  '⏰ Set alarm at 6:30 AM',
  '💳 Spent $45 on Dinner',
  '📝 Note: Cold Plunge 3min at 50F',
  '📊 Analyze spending',
  '🔒 Lock vault',
  '💰 Got paid $2500',
  '⚡ Calculate 18% tip on $140',
];

export const AiScreen: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const app = useApp();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'cortex',
      text:
        `✦ **Neural Cortex Initialized**\n\n` +
        `I have autonomous read, write, and deletion control over the **entire application**:\n\n` +
        `• **Alarms**: Set, update, turn off, or erase wake anchors.\n` +
        `• **Cashflow**: Log expenses, record income, analyze burn rate, calculate savings.\n` +
        `• **Protocols**: Create notes, attach research logs, search entries, toggle pins.\n` +
        `• **Vault**: Inspect encrypted storage telemetry or lock down the enclave.\n\n` +
        `Type any instruction below or tap a quick command capsule to execute.`,
      timestamp: 'Active',
      action: {
        actionType: 'SYSTEM_BRIEFING',
        badgeTitle: 'Autonomous Agent Hooked',
        badgeDetails: 'Full System R/W Authority',
        badgeColor: '#6C5CE7',
      },
    },
  ]);

  const scrollViewRef = useRef<ScrollView>(null);

  const formatNow = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = (textToSend?: string) => {
    const prompt = (textToSend || inputText).trim();
    if (!prompt) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: formatNow(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Execute through autonomous engine
    setTimeout(() => {
      const response = AiCommandEngine.execute(prompt, app);
      const aiMsg: ChatMessage = {
        id: `cortex-${Date.now()}`,
        sender: 'cortex',
        text: response.message,
        timestamp: formatNow(),
        action: response.action,
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 200);
  };

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
  }, [messages]);

  // Aggregate live stats for telemetry bar
  const activeAlarmsCount = app.alarms.filter((a) => a.isEnabled).length;
  let netBalance = 0;
  app.transactions.forEach((t) => {
    if (t.type === 'income') netBalance += t.amount;
    else netBalance -= t.amount;
  });

  return (
    <SafeAreaView className="flex-1 bg-[#050510]">
      <StatusBar barStyle="light-content" backgroundColor="#050510" />

      {/* ── AMBIENT CYBERNETIC LIGHTING ── */}
      <View className="absolute top-0 left-0 right-0 h-96 bg-[#08081A] opacity-80" />
      <View className="absolute top-12 left-1/2 -translate-x-32 w-64 h-64 rounded-full bg-[#6C5CE7] opacity-[0.06]" />
      <View className="absolute top-36 right-[-40px] w-48 h-48 rounded-full bg-[#00B894] opacity-[0.03]" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        {/* ── TOP ACTION BAR ── */}
        <View className="flex-row items-center justify-between px-6 pt-3 pb-2 z-10 border-b border-[#14142A]">
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

          {/* TELEMETRY STATUS PILL */}
          <View className="flex-row items-center gap-2 bg-[#0D0D1A] px-3.5 py-1.5 rounded-full border border-[#1E1E3A]">
            <View className="w-1.5 h-1.5 rounded-full bg-[#00B894]" />
            <Text className="text-[10px] font-bold tracking-[2px] uppercase text-[#00B894]">
              Autonomous • 4 Hooks
            </Text>
          </View>

          {/* CLEAR STREAM BUTTON */}
          <TouchableOpacity
            onPress={() => setMessages(messages.slice(0, 1))}
            activeOpacity={0.7}
            className="py-1 px-2"
          >
            <Text className="text-[10px] font-bold tracking-[1px] uppercase text-[#3D3D5C]">
              Clear
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── TELEMETRY CAPSULE BAR ── */}
        <View className="flex-row items-center justify-between px-5 py-2.5 bg-[#0A0A16] border-b border-[#14142A]">
          <TouchableOpacity
            onPress={() => app.setCurrentScreen('alarm')}
            className="flex-row items-center gap-1"
          >
            <Text className="text-xs text-[#6C5CE7]">◉</Text>
            <Text className="text-[10px] text-[#6B6B8D] font-mono">
              {activeAlarmsCount} Anchors
            </Text>
          </TouchableOpacity>

          <View className="w-[1px] h-3 bg-[#1E1E3A]" />

          <TouchableOpacity
            onPress={() => app.setCurrentScreen('expenses')}
            className="flex-row items-center gap-1"
          >
            <Text className="text-xs text-[#00B894]">▲</Text>
            <Text className="text-[10px] text-[#6B6B8D] font-mono">
              ${netBalance.toFixed(0)} Net
            </Text>
          </TouchableOpacity>

          <View className="w-[1px] h-3 bg-[#1E1E3A]" />

          <TouchableOpacity
            onPress={() => app.setCurrentScreen('notes')}
            className="flex-row items-center gap-1"
          >
            <Text className="text-xs text-[#FD79A8]">◆</Text>
            <Text className="text-[10px] text-[#6B6B8D] font-mono">
              {app.notes.length} Protocols
            </Text>
          </TouchableOpacity>

          <View className="w-[1px] h-3 bg-[#1E1E3A]" />

          <TouchableOpacity
            onPress={() => app.setCurrentScreen('vault')}
            className="flex-row items-center gap-1"
          >
            <Text className="text-xs text-[#FDCB6E]">■</Text>
            <Text className="text-[10px] text-[#6B6B8D] font-mono">
              {app.vaultItems.length} Enclave
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── MESSAGES FEED ── */}
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          className="flex-1 px-4 pt-3"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              className={`mb-4 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* SENDER LABEL & TIME */}
              <View className="flex-row items-center gap-1.5 mb-1 px-2">
                <Text className="text-[10px] font-bold tracking-[2px] uppercase text-[#6B6B8D]">
                  {msg.sender === 'user' ? 'Operator' : '✦ Cortex Core'}
                </Text>
                <Text className="text-[9px] text-[#3D3D5C] font-mono">
                  {msg.timestamp}
                </Text>
              </View>

              {/* MESSAGE BUBBLE */}
              <View
                className={`max-w-[90%] p-4 rounded-3xl ${
                  msg.sender === 'user'
                    ? 'bg-[#14142A] border border-[#6C5CE7]/30 rounded-tr-md'
                    : 'bg-[#0D0D1A] border border-[#1E1E3A] rounded-tl-md shadow-xl'
                }`}
              >
                <Text className="text-sm text-[#E8E8F0] leading-relaxed font-sans">
                  {msg.text}
                </Text>

                {/* EMBEDDED ACTION EXECUTION CARD */}
                {msg.action && (
                  <View className="mt-3.5 pt-3 border-t border-[#1E1E3A]">
                    <View
                      className="p-3 rounded-2xl bg-[#14142A] border flex-row items-center justify-between"
                      style={{ borderColor: msg.action.badgeColor + '40' }}
                    >
                      <View className="flex-row items-center gap-2.5 flex-1 pr-2">
                        <View
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: msg.action.badgeColor }}
                        />
                        <View className="flex-1">
                          <Text className="text-xs font-bold text-[#E8E8F0]" numberOfLines={1}>
                            {msg.action.badgeTitle}
                          </Text>
                          <Text className="text-[10px] text-[#6B6B8D] font-mono" numberOfLines={1}>
                            {msg.action.badgeDetails}
                          </Text>
                        </View>
                      </View>

                      {msg.action.targetBranch && (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => app.setCurrentScreen(msg.action!.targetBranch!)}
                          className="px-2.5 py-1 rounded-lg"
                          style={{ backgroundColor: msg.action.badgeColor + '20' }}
                        >
                          <Text
                            className="text-[10px] font-bold uppercase tracking-wider"
                            style={{ color: msg.action.badgeColor }}
                          >
                            Open →
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* ── QUICK PROMPT CAPSULES ── */}
        <View className="py-2 border-t border-[#14142A] bg-[#070714]">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          >
            {QUICK_PROMPTS.map((prompt) => (
              <TouchableOpacity
                key={prompt}
                activeOpacity={0.75}
                onPress={() => handleSend(prompt)}
                className="bg-[#0D0D1A] border border-[#1E1E3A] px-3.5 py-2 rounded-2xl active:border-[#6C5CE7]"
              >
                <Text className="text-xs text-[#6B6B8D] font-medium tracking-wide">
                  {prompt}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── COMMAND INPUT BAR ── */}
        <View className="p-3 bg-[#0D0D1A] border-t border-[#1E1E3A]">
          <View className="flex-row items-center bg-[#14142A] border border-[#1E1E3A] rounded-3xl px-4 py-2">
            <Text className="text-[#6C5CE7] text-base mr-2">✦</Text>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSend()}
              placeholder="Command entire app (e.g. Set alarm, Log expense)..."
              placeholderTextColor="#3D3D5C"
              returnKeyType="send"
              className="flex-1 text-[#E8E8F0] text-sm py-1 font-sans"
            />
            <TouchableOpacity
              onPress={() => handleSend()}
              activeOpacity={0.7}
              disabled={!inputText.trim()}
              className={`w-9 h-9 rounded-full items-center justify-center ${
                inputText.trim() ? 'bg-[#6C5CE7]' : 'bg-[#1E1E3A]'
              }`}
            >
              <Text className="text-white text-xs font-bold">▲</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
