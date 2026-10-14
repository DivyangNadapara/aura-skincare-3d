import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { AiCommandEngine, AiActionResult } from '../services/aiCore';
import { GeminiService } from '../services/geminiService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'cortex';
  text: string;
  timestamp: string;
  action?: AiActionResult;
  isGemini?: boolean;
}

const QUICK_PROMPTS = [
  '⏰ Set alarm at 1:AM morning',
  '💬 How should I organize my day?',
  '💳 Spent $45 on Dinner',
  '📝 Note: Cold Plunge 3min at 50F',
  '✦ System Briefing',
  '⚡ Tell me a joke',
  '💰 Got paid $2500',
  '📊 Financial intelligence tips',
];

export const AiScreen: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const app = useApp();
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [keySaveMessage, setKeySaveMessage] = useState('');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'cortex',
      text:
        `✦ **Cortex Neural Intelligence Ready**\n\n` +
        `I am your personal AI companion & autonomous operator. I can hold **real, deep conversations** and manage your **entire application**:\n\n` +
        `• **Circadian Alarms**: "Set alarm at 1:AM morning", "Turn off morning alarm"\n` +
        `• **Cashflow & Ledger**: "Spent $45 on Dinner", "Received $2500 salary", "How to save money?"\n` +
        `• **Protocols & Notes**: "Note: Retinol 0.5% every Tuesday", "Search notes for fitness"\n` +
        `• **Secret Enclave**: "Lock vault", "Vault status"\n` +
        `• **Conversational Chat**: Ask me anything — philosophy, jokes, productivity, coding, life!\n\n` +
        `Tap **[✦ Gemini API]** at the top to connect your Google Gemini key for live web-scale LLM reasoning, or chat right away!`,
      timestamp: 'Active',
      action: {
        actionType: 'SYSTEM_BRIEFING',
        badgeTitle: 'Dual-Engine Intelligence Active',
        badgeDetails: 'Full System R/W Authority',
        badgeColor: '#6C5CE7',
      },
    },
  ]);

  const scrollViewRef = useRef<ScrollView>(null);

  // Check stored API key on mount
  useEffect(() => {
    (async () => {
      const key = await GeminiService.getApiKey();
      if (key) {
        setHasApiKey(true);
        setApiKeyInput(key);
      }
    })();
  }, []);

  const formatNow = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || inputText).trim();
    if (!prompt || isThinking) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: formatNow(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    try {
      const history = messages.map((m) => ({ sender: m.sender, text: m.text }));
      const response = await AiCommandEngine.executeAsync(prompt, app, history);

      const aiMsg: ChatMessage = {
        id: `cortex-${Date.now()}`,
        sender: 'cortex',
        text: response.message,
        timestamp: formatNow(),
        action: response.action,
        isGemini: response.isGemini,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const fallback = AiCommandEngine.executeLocal(prompt, app);
      setMessages((prev) => [
        ...prev,
        {
          id: `cortex-${Date.now()}`,
          sender: 'cortex',
          text: fallback.message,
          timestamp: formatNow(),
          action: fallback.action,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSaveApiKey = async () => {
    const cleaned = apiKeyInput.trim();
    if (!cleaned) {
      await GeminiService.clearApiKey();
      setHasApiKey(false);
      setKeySaveMessage('API key removed. Running on Local Neural Cortex.');
      setTimeout(() => setKeySaveMessage(''), 3000);
      return;
    }

    try {
      await GeminiService.setApiKey(cleaned);
      setHasApiKey(true);
      setKeySaveMessage('✓ Google Gemini API Key saved successfully!');
      setTimeout(() => {
        setKeySaveMessage('');
        setIsApiKeyModalOpen(false);
      }, 1500);
    } catch (e) {
      setKeySaveMessage('Failed to save key. Please try again.');
    }
  };

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
  }, [messages, isThinking]);

  // Aggregate live stats for telemetry bar
  const activeAlarmsCount = app.alarms.filter((a) => a.isEnabled).length;
  let netBalance = 0;
  app.transactions.forEach((t) => {
    if (t.type === 'income') netBalance += t.amount;
    else netBalance -= t.amount;
  });

  return (
    <View className="flex-1 bg-[#050510]">
      {/* ── AMBIENT CYBERNETIC LIGHTING ── */}
      <View className="absolute top-0 left-0 right-0 h-96 bg-[#08081A] opacity-80" />
      <View className="absolute top-12 left-1/2 -translate-x-32 w-64 h-64 rounded-full bg-[#6C5CE7] opacity-[0.06]" />
      <View className="absolute top-36 right-[-40px] w-48 h-48 rounded-full bg-[#00B894] opacity-[0.03]" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        {/* ── TOP ACTION BAR ── */}
        <View className="flex-row items-center justify-between px-4 pt-2 pb-2 z-10 border-b border-[#14142A]">
          {onBack ? (
            <TouchableOpacity
              onPress={onBack}
              activeOpacity={0.7}
              className="py-1 pr-2 flex-row items-center gap-1"
            >
              <Text className="text-base text-[#6B6B8D]">←</Text>
              <Text className="text-[10px] font-semibold tracking-[1px] uppercase text-[#6B6B8D]">
                Home
              </Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}

          {/* ENGINE STATUS & GEMINI KEY PILL */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsApiKeyModalOpen(true)}
            className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border ${
              hasApiKey
                ? 'bg-[#6C5CE7]/15 border-[#6C5CE7]/40'
                : 'bg-[#0D0D1A] border-[#1E1E3A]'
            }`}
          >
            <View
              className={`w-1.5 h-1.5 rounded-full ${
                hasApiKey ? 'bg-[#00B894]' : 'bg-[#6C5CE7]'
              }`}
            />
            <Text
              className={`text-[9px] font-bold tracking-[1px] uppercase ${
                hasApiKey ? 'text-[#00B894]' : 'text-[#6C5CE7]'
              }`}
            >
              {hasApiKey ? '✦ Gemini 1.5 Flash' : '⚡ Local + Gemini API'}
            </Text>
          </TouchableOpacity>

          {/* CLEAR STREAM BUTTON */}
          <TouchableOpacity
            onPress={() => setMessages(messages.slice(0, 1))}
            activeOpacity={0.7}
            className="py-1 px-2"
          >
            <Text className="text-[9px] font-bold tracking-[1px] uppercase text-[#3D3D5C]">
              Clear
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── TELEMETRY CAPSULE BAR ── */}
        <View className="flex-row items-center justify-between px-4 py-2 bg-[#0A0A16] border-b border-[#14142A]">
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
              {app.notes.length} Notes
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
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              className={`mb-4 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* SENDER LABEL & TIME */}
              <View className="flex-row items-center gap-1.5 mb-1 px-2">
                <Text className="text-[10px] font-bold tracking-[2px] uppercase text-[#6B6B8D]">
                  {msg.sender === 'user'
                    ? 'Divyang'
                    : msg.isGemini
                    ? '✦ Gemini 1.5'
                    : '✦ Cortex Core'}
                </Text>
                <Text className="text-[9px] text-[#3D3D5C] font-mono">
                  {msg.timestamp}
                </Text>
              </View>

              {/* MESSAGE BUBBLE */}
              <View
                className={`max-w-[92%] p-4 rounded-3xl ${
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

          {/* THINKING INDICATOR */}
          {isThinking && (
            <View className="items-start mb-4">
              <View className="flex-row items-center gap-1.5 mb-1 px-2">
                <Text className="text-[10px] font-bold tracking-[2px] uppercase text-[#6C5CE7]">
                  {hasApiKey ? '✦ Gemini Reasoning...' : '✦ Cortex Thinking...'}
                </Text>
              </View>
              <View className="bg-[#0D0D1A] border border-[#1E1E3A] px-4 py-3 rounded-3xl rounded-tl-md flex-row items-center gap-2.5">
                <ActivityIndicator size="small" color="#6C5CE7" />
                <Text className="text-xs text-[#6B6B8D]">
                  Parsing intent & executing across branches...
                </Text>
              </View>
            </View>
          )}
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
              placeholder="Chat like Gemini or command app (e.g. Set alarm, Chat)..."
              placeholderTextColor="#3D3D5C"
              returnKeyType="send"
              autoCapitalize="sentences"
              autoCorrect={false}
              className="flex-1 text-[#E8E8F0] text-sm py-1 font-sans"
            />
            <TouchableOpacity
              onPress={() => handleSend()}
              activeOpacity={0.7}
              disabled={!inputText.trim() || isThinking}
              className={`w-9 h-9 rounded-full items-center justify-center ${
                inputText.trim() && !isThinking ? 'bg-[#6C5CE7]' : 'bg-[#1E1E3A]'
              }`}
            >
              <Text className="text-white text-xs font-bold">▲</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* ── GEMINI API KEY CONFIGURATION MODAL ── */}
      <Modal visible={isApiKeyModalOpen} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/85">
          <View className="bg-[#0D0D1A] border-t border-[#1E1E3A] rounded-t-[36px] p-6 pb-10 shadow-2xl">
            {/* Modal Handle */}
            <View className="items-center mb-4">
              <View className="w-10 h-1 rounded-full bg-[#1E1E3A]" />
            </View>

            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-2">
                <Text className="text-lg text-[#6C5CE7]">✦</Text>
                <Text className="text-base font-extrabold text-[#E8E8F0]">
                  Google Gemini 1.5 Flash
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsApiKeyModalOpen(false)}
                activeOpacity={0.7}
                className="p-1"
              >
                <Text className="text-xs text-[#6B6B8D] font-semibold uppercase">Close</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-xs text-[#6B6B8D] leading-relaxed mb-4">
              Connect your free Google Gemini API key to unlock full conversational depth, natural language chatting, and autonomous multi-branch tool calling.
            </Text>

            <View className="bg-[#14142A] border border-[#1E1E3A] rounded-2xl px-4 py-3 mb-4">
              <Text className="text-[10px] font-bold uppercase tracking-[2px] text-[#6C5CE7] mb-1">
                Gemini API Key
              </Text>
              <TextInput
                value={apiKeyInput}
                onChangeText={setApiKeyInput}
                placeholder="AIzaSy..."
                placeholderTextColor="#3D3D5C"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                className="text-sm text-[#E8E8F0] py-1 font-mono"
              />
            </View>

            {keySaveMessage ? (
              <Text className="text-xs text-[#00B894] font-medium mb-3 text-center">
                {keySaveMessage}
              </Text>
            ) : null}

            {/* Action buttons */}
            <View className="flex-row items-center gap-3">
              <TouchableOpacity
                onPress={handleSaveApiKey}
                activeOpacity={0.8}
                className="flex-1 bg-[#6C5CE7] py-3.5 rounded-2xl items-center justify-center shadow-lg shadow-[#6C5CE7]/30"
              >
                <Text className="text-xs font-bold text-white uppercase tracking-[1px]">
                  {apiKeyInput.trim() ? 'Save Gemini Key' : 'Use Local Cortex'}
                </Text>
              </TouchableOpacity>

              {hasApiKey && (
                <TouchableOpacity
                  onPress={async () => {
                    await GeminiService.clearApiKey();
                    setHasApiKey(false);
                    setApiKeyInput('');
                    setKeySaveMessage('API Key removed.');
                    setTimeout(() => setKeySaveMessage(''), 2000);
                  }}
                  activeOpacity={0.7}
                  className="px-4 py-3.5 rounded-2xl bg-[#1E1E3A] items-center justify-center"
                >
                  <Text className="text-xs font-semibold text-[#FD79A8]">Remove</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text className="text-[10px] text-[#3D3D5C] text-center mt-4">
              Get a free key from ai.google.dev (Free tier available, no credit card required)
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};
