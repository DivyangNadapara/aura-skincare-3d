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
    <SafeAreaView className="flex-1 bg-[#050510]">
      <StatusBar barStyle="light-content" backgroundColor="#050510" />

      {/* ── LAYERED GRADIENT BACKGROUND ── */}
      <View className="absolute inset-0 bg-[#050510]">
        {/* Radial gradient simulation — concentric layers */}
        <View className="absolute top-1/4 left-1/2 -translate-x-[200px] -translate-y-[200px] w-[400px] h-[400px] rounded-full bg-[#0D0D1A] opacity-80" />
        <View className="absolute top-1/4 left-1/2 -translate-x-[140px] -translate-y-[140px] w-[280px] h-[280px] rounded-full bg-[#0F0F20] opacity-60" />
        <View className="absolute top-1/4 left-1/2 -translate-x-[80px] -translate-y-[80px] w-[160px] h-[160px] rounded-full bg-[#14142A] opacity-40" />
        {/* Bottom ambient glow */}
        <View className="absolute bottom-0 left-0 right-0 h-[300px] bg-[#08081A] opacity-90" />
      </View>

      {/* ── CORNER ACCENT DECORATIONS ── */}
      <View className="absolute top-12 left-6 w-8 h-[1px] bg-[#6C5CE7] opacity-30" />
      <View className="absolute top-12 left-6 w-[1px] h-8 bg-[#6C5CE7] opacity-30" />
      <View className="absolute top-12 right-6 w-8 h-[1px] bg-[#6C5CE7] opacity-30" />
      <View className="absolute top-12 right-6 w-[1px] h-8 bg-[#6C5CE7] opacity-30" />

      <View className="flex-1 justify-between pb-10">
        {/* ── TOP BAR ── */}
        <View className="px-7 pt-4 flex-row items-center justify-between z-10">
          {onBack ? (
            <TouchableOpacity
              onPress={onBack}
              activeOpacity={0.7}
              className="flex-row items-center py-2 pr-4"
            >
              <Text className="text-lg text-[#6B6B8D] mr-1">←</Text>
              <Text className="text-[11px] font-medium text-[#6B6B8D] uppercase tracking-[2px]">Back</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
          <View className="flex-row items-center">
            <View className="w-[5px] h-[5px] rounded-full bg-[#00B894] mr-2" />
            <Text className="text-[10px] text-[#3D3D5C] font-semibold uppercase tracking-[3px]">
              Encrypted
            </Text>
          </View>
        </View>

        {/* ── CENTER — GEOMETRIC LOCK ICON + HEADING + PIN DOTS ── */}
        <View className="items-center px-6 z-10">
          {/* Geometric diamond lock icon — overlapping rotated squares */}
          <View className="w-24 h-24 items-center justify-center mb-8">
            {/* Outer diamond ring */}
            <View className="absolute w-24 h-24 rounded-[20px] border border-[#1E1E3A] rotate-45" />
            {/* Middle diamond */}
            <View className="absolute w-16 h-16 rounded-[14px] border border-[#6C5CE7] opacity-30 rotate-45" />
            {/* Inner filled diamond */}
            <View className="absolute w-8 h-8 rounded-[6px] bg-[#6C5CE7] opacity-20 rotate-45" />
            {/* Lock symbol centered */}
            <Text className="text-2xl text-[#6C5CE7] font-bold">◆</Text>
          </View>

          {/* Thin accent line */}
          <View className="w-12 h-[1px] bg-[#1E1E3A] mb-6" />

          <Text className="text-[10px] text-[#3D3D5C] font-bold uppercase tracking-[5px] mb-3">
            Personal Vault
          </Text>
          <Text className="text-2xl font-bold text-[#E8E8F0] tracking-tight text-center">
            Enter Security PIN
          </Text>
          <Text className="text-[11px] text-[#3D3D5C] text-center mt-2 px-10 leading-4">
            4-digit code required to access hidden files
          </Text>

          {/* ── PIN DOTS — dramatic with glow rings ── */}
          <View className="flex-row items-center justify-center mt-10 mb-3" style={{ gap: 28 }}>
            {[0, 1, 2, 3].map((idx) => {
              const isFilled = pin.length > idx;
              const isError = hasError;
              return (
                <View key={idx} className="items-center justify-center">
                  {/* Outer glow ring */}
                  <View
                    className={`w-[22px] h-[22px] rounded-full items-center justify-center ${
                      isError
                        ? 'bg-[#FF453A]/15'
                        : isFilled
                        ? 'bg-[#6C5CE7]/15'
                        : 'bg-transparent'
                    }`}
                  >
                    {/* Middle ring */}
                    <View
                      className={`w-[16px] h-[16px] rounded-full items-center justify-center ${
                        isError
                          ? 'bg-[#FF453A]/25'
                          : isFilled
                          ? 'bg-[#6C5CE7]/25'
                          : 'bg-transparent'
                      }`}
                    >
                      {/* Inner dot */}
                      <View
                        className={`w-[10px] h-[10px] rounded-full ${
                          isError
                            ? 'bg-[#FF453A]'
                            : isFilled
                            ? 'bg-[#6C5CE7]'
                            : 'bg-[#1E1E3A]'
                        }`}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {hasError ? (
            <Text className="text-[11px] text-[#FF453A] font-semibold mt-1 tracking-wide">
              Incorrect PIN
            </Text>
          ) : (
            <Text className="text-[10px] text-[#3D3D5C] font-medium mt-1">
              Default: <Text className="text-[#6B6B8D] font-bold tracking-[2px]">1234</Text>
            </Text>
          )}
        </View>

        {/* ── NUMPAD — MINIMAL, NO BORDERS ── */}
        <View className="px-12 z-10">
          {/* Thin decorative line above numpad */}
          <View className="h-[1px] bg-[#1E1E3A] mx-8 mb-8 opacity-40" />

          {[
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
          ].map((row, rowIdx) => (
            <View key={rowIdx} className="flex-row justify-between mb-5">
              {row.map((n) => (
                <TouchableOpacity
                  key={n}
                  activeOpacity={0.3}
                  onPress={() => handleKeyPress(n)}
                  className="w-20 h-16 items-center justify-center"
                >
                  <Text className="text-[28px] font-light text-[#E8E8F0] tracking-tight">
                    {n}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* Bottom row: biometric / 0 / delete */}
          <View className="flex-row justify-between items-center">
            {/* Biometric trigger */}
            <TouchableOpacity
              activeOpacity={0.3}
              onPress={handleBiometricMock}
              className="w-20 h-16 items-center justify-center"
            >
              <View className="w-10 h-10 rounded-full border border-[#1E1E3A] items-center justify-center">
                <Text className="text-[13px] text-[#6C5CE7] font-bold">✦</Text>
              </View>
            </TouchableOpacity>

            {/* Zero */}
            <TouchableOpacity
              activeOpacity={0.3}
              onPress={() => handleKeyPress('0')}
              className="w-20 h-16 items-center justify-center"
            >
              <Text className="text-[28px] font-light text-[#E8E8F0] tracking-tight">
                0
              </Text>
            </TouchableOpacity>

            {/* Backspace */}
            <TouchableOpacity
              activeOpacity={0.3}
              onPress={handleDelete}
              className="w-20 h-16 items-center justify-center"
            >
              <Text className="text-[18px] text-[#6B6B8D]">←</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
