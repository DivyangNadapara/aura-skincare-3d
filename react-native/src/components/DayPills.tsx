import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DAYS_OF_WEEK } from '../types/alarm';

interface DayPillsProps {
  selectedDays: number[];
  isAlarmEnabled?: boolean;
  interactive?: boolean;
  onToggleDay?: (dayId: number) => void;
}

export const DayPills: React.FC<DayPillsProps> = ({
  selectedDays,
  isAlarmEnabled = true,
  interactive = false,
  onToggleDay,
}) => {
  return (
    <View className="flex-row items-center space-x-1.5 gap-1.5">
      {DAYS_OF_WEEK.map((day) => {
        const isSelected = selectedDays.includes(day.id);

        // Visual pill classes based on selection and alarm state
        let pillBg = 'bg-slate-800/40 border-slate-700/40';
        let textColor = 'text-slate-500';

        if (isSelected) {
          if (isAlarmEnabled) {
            pillBg = 'bg-emerald-500/15 border-emerald-500/40';
            textColor = 'text-emerald-400 font-semibold';
          } else {
            pillBg = 'bg-slate-800/80 border-slate-700/60';
            textColor = 'text-slate-400 font-medium';
          }
        }

        const pillContent = (
          <View
            key={day.id}
            className={`w-6 h-6 rounded-full items-center justify-center border ${pillBg}`}
          >
            <Text className={`text-[11px] ${textColor}`}>{day.label}</Text>
          </View>
        );

        if (interactive && onToggleDay) {
          return (
            <TouchableOpacity
              key={day.id}
              activeOpacity={0.7}
              onPress={() => onToggleDay(day.id)}
            >
              {pillContent}
            </TouchableOpacity>
          );
        }

        return pillContent;
      })}
    </View>
  );
};
