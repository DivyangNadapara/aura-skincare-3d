import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SAMSUNG_DAYS } from '../types/alarm';

interface DayPillsProps {
  selectedDays: number[];
  isAlarmEnabled?: boolean;
  interactive?: boolean;
  onToggleDay?: (dayId: number) => void;
  accentColor?: string; // Samsung Blue (#2C7BFE) or Samsung Orange (#FF7700)
}

export const DayPills: React.FC<DayPillsProps> = ({
  selectedDays,
  isAlarmEnabled = true,
  interactive = false,
  onToggleDay,
  accentColor = '#2C7BFE', // Samsung One UI signature blue
}) => {
  return (
    <View className="flex-row items-center space-x-2 gap-2">
      {SAMSUNG_DAYS.map((day) => {
        const isSelected = selectedDays.includes(day.id);

        let pillBg = 'bg-[#252834]';
        let textColor = 'text-[#6C7182]';

        if (isSelected) {
          if (isAlarmEnabled) {
            pillBg = 'bg-[#2C7BFE]';
            textColor = 'text-white font-bold';
          } else {
            pillBg = 'bg-[#313543]';
            textColor = 'text-[#8E93A4] font-medium';
          }
        }

        const pill = (
          <View
            key={day.id}
            className={`w-7 h-7 rounded-full items-center justify-center ${pillBg}`}
          >
            <Text className={`text-xs ${textColor}`}>{day.label}</Text>
          </View>
        );

        if (interactive && onToggleDay) {
          return (
            <TouchableOpacity
              key={day.id}
              activeOpacity={0.7}
              onPress={() => onToggleDay(day.id)}
            >
              {pill}
            </TouchableOpacity>
          );
        }

        return pill;
      })}
    </View>
  );
};
