import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Vibration,
} from 'react-native';

interface VaultLockScreenProps {
  onUnlock: () => void;
  correctPin?: string;
  onBack?: () => void;
}

export const VaultLockScreen: React.FC<VaultLockScreenProps> = ({
  onUnlock,
  correctPin = '1234',
  onBack,
}) => {
  const [pin, setPin] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleKeyPress = (num: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + num;
    setPin(newPin);
    setHasError(false);

    if (newPin.length === 4) {
      if (newPin === correctPin) {
        setTimeout(() => {
          setPin('');
          onUnlock();
        }, 150);
      } else {
        try {
          Vibration.vibrate(200);
        } catch (e) {}
        setHasError(true);
        setTimeout(() => {
          setPin('');
          setHasError(false);
        }, 600);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setHasError(false);
  };

  const handleBiometricMock = () => {
    // Quick biometric unlock shortcut
    onUnlock();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#000000] justify-between pb-8">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* TOP BAR */}
      <View className="px-6 pt-3 flex-row items-center justify-between">
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            className="flex-row items-center py-2 pr-4 gap-1"
          >
            <Text className="text-xl text-white">←</Text>
            <Text className="text-sm font-semibold text-[#8D92A4]">Home</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
        <View className="bg-[#1C1F2B] px-3 py-1 rounded-full border border-[#272B3B]">
          <Text className="text-[11px] text-[#2C7BFE] font-bold">🔒 Encrypted</Text>
        </View>
      </View>

      {/* CENTER HEADING & PIN DOTS */}
      <View className="items-center px-6">
        <View className="w-20 h-20 rounded-3xl bg-[#181B26] border border-[#272B3B] items-center justify-center mb-6 shadow-xl shadow-black">
          <Text className="text-4xl">🔐</Text>
        </View>

        <Text className="text-2xl font-bold text-white tracking-tight text-center">
          Secure Personal Vault
        </Text>
        <Text className="text-xs text-[#8E94A7] text-center mt-2 px-8">
          Enter your 4-digit security PIN to unlock hidden photos, videos, and private documents
        </Text>

        {/* PIN DOTS */}
        <View className="flex-row items-center justify-center gap-5 mt-8 mb-2">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <View
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-150 ${
                  hasError
                    ? 'bg-[#FF453A] scale-110'
                    : isFilled
                    ? 'bg-[#2C7BFE] scale-110'
                    : 'bg-[#272B3B]'
                }`}
              />
            );
          })}
        </View>

        {hasError ? (
          <Text className="text-xs text-[#FF453A] font-semibold mt-2">
            Incorrect PIN. Try again.
          </Text>
        ) : (
          <Text className="text-[11px] text-[#555B70] font-medium mt-2">
            Default PIN: <Text className="text-[#8E94A7] font-bold">1234</Text>
          </Text>
        )}
      </View>

      {/* NUMPAD */}
      <View className="px-10">
        <View className="flex-row justify-between mb-4">
          {['1', '2', '3'].map((n) => (
            <TouchableOpacity
              key={n}
              activeOpacity={0.6}
              onPress={() => handleKeyPress(n)}
              className="w-20 h-20 rounded-full bg-[#141620] border border-[#212433] items-center justify-center active:bg-[#2C7BFE]/30"
            >
              <Text className="text-2xl font-semibold text-white">{n}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-row justify-between mb-4">
          {['4', '5', '6'].map((n) => (
            <TouchableOpacity
              key={n}
              activeOpacity={0.6}
              onPress={() => handleKeyPress(n)}
              className="w-20 h-20 rounded-full bg-[#141620] border border-[#212433] items-center justify-center active:bg-[#2C7BFE]/30"
            >
              <Text className="text-2xl font-semibold text-white">{n}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-row justify-between mb-4">
          {['7', '8', '9'].map((n) => (
            <TouchableOpacity
              key={n}
              activeOpacity={0.6}
              onPress={() => handleKeyPress(n)}
              className="w-20 h-20 rounded-full bg-[#141620] border border-[#212433] items-center justify-center active:bg-[#2C7BFE]/30"
            >
              <Text className="text-2xl font-semibold text-white">{n}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-row justify-between items-center">
          {/* Biometric trigger button */}
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={handleBiometricMock}
            className="w-20 h-20 rounded-full bg-[#141620]/60 border border-[#212433] items-center justify-center active:bg-[#2C7BFE]/30"
          >
            <Text className="text-2xl">⚡</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleKeyPress('0')}
            className="w-20 h-20 rounded-full bg-[#141620] border border-[#212433] items-center justify-center active:bg-[#2C7BFE]/30"
          >
            <Text className="text-2xl font-semibold text-white">0</Text>
          </TouchableOpacity>

          {/* Backspace */}
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={handleDelete}
            className="w-20 h-20 rounded-full bg-[#141620]/60 border border-[#212433] items-center justify-center active:bg-[#FF453A]/20"
          >
            <Text className="text-xl text-[#9EA3B5]">⌫</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
