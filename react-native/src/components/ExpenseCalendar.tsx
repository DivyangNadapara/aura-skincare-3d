import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TransactionItem } from '../types/expense';

interface ExpenseCalendarProps {
  currentYear: number;
  currentMonth: number; // 0-indexed (0 = Jan, 9 = Oct)
  selectedDate: string | null; // "YYYY-MM-DD" or null for whole month
  onSelectDate: (dateStr: string | null) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  transactions: TransactionItem[];
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const ExpenseCalendar: React.FC<ExpenseCalendarProps> = ({
  currentYear,
  currentMonth,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  transactions,
}) => {
  // Compute days in month
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Create date lookup for income/expense dots
  const dateTxMap: Record<string, { hasIncome: boolean; hasExpense: boolean }> = {};
  transactions.forEach((tx) => {
    if (!dateTxMap[tx.dateStr]) {
      dateTxMap[tx.dateStr] = { hasIncome: false, hasExpense: false };
    }
    if (tx.type === 'income') dateTxMap[tx.dateStr].hasIncome = true;
    if (tx.type === 'expense') dateTxMap[tx.dateStr].hasExpense = true;
  });

  // Build calendar matrix (42 cells: 6 weeks x 7 days)
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return (
    <View className="bg-[#141620] border border-[#232738] rounded-[28px] p-4 mb-4">
      {/* Month Navigator Header */}
      <View className="flex-row items-center justify-between mb-3 px-1">
        <TouchableOpacity
          onPress={onPrevMonth}
          className="w-8 h-8 rounded-full bg-[#1C1F2B] items-center justify-center border border-[#272B3B]"
        >
          <Text className="text-white text-xs font-bold">‹</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSelectDate(null)}
          className="items-center"
        >
          <Text className="text-base font-bold text-white">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </Text>
          <Text className="text-[10px] text-[#2C7BFE] font-medium mt-0.5">
            {selectedDate ? `Filtering: ${selectedDate} (Tap to show all)` : 'Showing Full Month'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNextMonth}
          className="w-8 h-8 rounded-full bg-[#1C1F2B] items-center justify-center border border-[#272B3B]"
        >
          <Text className="text-white text-xs font-bold">›</Text>
        </TouchableOpacity>
      </View>

      {/* Weekday Labels (S M T W T F S) */}
      <View className="flex-row justify-between mb-2 px-1">
        {WEEK_DAYS.map((wd, i) => (
          <View key={i} className="w-10 items-center">
            <Text
              className={`text-[11px] font-bold ${
                i === 0 ? 'text-[#FF453A]' : i === 6 ? 'text-[#2C7BFE]' : 'text-[#6C7182]'
              }`}
            >
              {wd}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar Days Grid */}
      <View className="flex-row flex-wrap justify-between">
        {cells.map((dayNum, idx) => {
          if (dayNum === null) {
            return <View key={idx} className="w-10 h-10 m-0.5" />;
          }

          const dayStr = dayNum.toString().padStart(2, '0');
          const monthStr = (currentMonth + 1).toString().padStart(2, '0');
          const cellDateStr = `${currentYear}-${monthStr}-${dayStr}`;

          const isSelected = selectedDate === cellDateStr;
          const txStatus = dateTxMap[cellDateStr];

          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.7}
              onPress={() => {
                if (isSelected) {
                  onSelectDate(null); // Deselect to show whole month
                } else {
                  onSelectDate(cellDateStr);
                }
              }}
              className={`w-10 h-10 m-0.5 rounded-2xl items-center justify-center ${
                isSelected
                  ? 'bg-[#2C7BFE] border border-white'
                  : 'bg-[#181B26] border border-[#202330]'
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  isSelected ? 'text-white font-extrabold' : 'text-[#CBD0E0]'
                }`}
              >
                {dayNum}
              </Text>

              {/* Transaction indicator dots */}
              <View className="flex-row gap-0.5 mt-0.5">
                {txStatus?.hasIncome && (
                  <View
                    className={`w-1 h-1 rounded-full ${
                      isSelected ? 'bg-white' : 'bg-[#30D158]'
                    }`}
                  />
                )}
                {txStatus?.hasExpense && (
                  <View
                    className={`w-1 h-1 rounded-full ${
                      isSelected ? 'bg-white' : 'bg-[#FF453A]'
                    }`}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

