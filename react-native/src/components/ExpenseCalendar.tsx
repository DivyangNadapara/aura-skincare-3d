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
    <View className="bg-[#0D0D1A] border border-[#1E1E3A] rounded-[32px] p-5 mb-5">
      {/* ── MONTH NAVIGATOR ── */}
      <View className="flex-row items-center justify-between mb-5 px-1">
        <TouchableOpacity
          onPress={onPrevMonth}
          activeOpacity={0.6}
          className="w-9 h-9 rounded-full bg-[#14142A] items-center justify-center border border-[#1E1E3A]"
        >
          <Text className="text-[#6B6B8D] text-sm font-bold">◂</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSelectDate(null)}
          activeOpacity={0.7}
          className="items-center"
        >
          <Text className="text-2xl font-extrabold text-[#E8E8F0] tracking-tight">
            {MONTH_NAMES[currentMonth]}
          </Text>
          <Text className="text-[10px] text-[#3D3D5C] font-semibold tracking-[4px] uppercase mt-1">
            {currentYear}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNextMonth}
          activeOpacity={0.6}
          className="w-9 h-9 rounded-full bg-[#14142A] items-center justify-center border border-[#1E1E3A]"
        >
          <Text className="text-[#6B6B8D] text-sm font-bold">▸</Text>
        </TouchableOpacity>
      </View>

      {/* ── WEEKDAY LABELS ── */}
      <View className="flex-row justify-between mb-3 px-0.5">
        {WEEK_DAYS.map((wd, i) => (
          <View key={i} className="flex-1 items-center">
            <Text
              className={`text-[10px] font-bold tracking-[2px] ${
                i === 0 || i === 6 ? 'text-[#3D3D5C]' : 'text-[#6B6B8D]'
              }`}
            >
              {wd}
            </Text>
          </View>
        ))}
      </View>

      {/* ── CALENDAR GRID ── */}
      <View className="flex-row flex-wrap">
        {cells.map((dayNum, idx) => {
          if (dayNum === null) {
            return <View key={idx} style={{ width: '14.285%' }} className="h-11 p-0.5" />;
          }

          const dayStr = dayNum.toString().padStart(2, '0');
          const monthStr = (currentMonth + 1).toString().padStart(2, '0');
          const cellDateStr = `${currentYear}-${monthStr}-${dayStr}`;

          const isSelected = selectedDate === cellDateStr;
          const txStatus = dateTxMap[cellDateStr];
          const hasTx = txStatus?.hasIncome || txStatus?.hasExpense;

          return (
            <View key={idx} style={{ width: '14.285%' }} className="items-center p-0.5">
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  if (isSelected) {
                    onSelectDate(null); // Deselect to show whole month
                  } else {
                    onSelectDate(cellDateStr);
                  }
                }}
                className="w-full items-center justify-center"
              >
                {/* Outer glow ring for selected state */}
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    isSelected
                      ? 'bg-[#6C5CE7]/10 border-2 border-[#6C5CE7]'
                      : hasTx
                        ? 'bg-[#14142A]'
                        : ''
                  }`}
                  style={
                    isSelected
                      ? {
                          shadowColor: '#6C5CE7',
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: 0.6,
                          shadowRadius: 10,
                          elevation: 8,
                        }
                      : undefined
                  }
                >
                  <Text
                    className={`text-[13px] font-semibold ${
                      isSelected
                        ? 'text-[#E8E8F0] font-extrabold'
                        : hasTx
                          ? 'text-[#E8E8F0]'
                          : 'text-[#6B6B8D]'
                    }`}
                  >
                    {dayNum}
                  </Text>

                  {/* Transaction indicator dots */}
                  {(txStatus?.hasIncome || txStatus?.hasExpense) && (
                    <View className="flex-row gap-[3px] mt-0.5">
                      {txStatus?.hasIncome && (
                        <View
                          className={`w-[4px] h-[4px] rounded-full ${
                            isSelected ? 'bg-[#E8E8F0]' : 'bg-[#00B894]'
                          }`}
                        />
                      )}
                      {txStatus?.hasExpense && (
                        <View
                          className={`w-[4px] h-[4px] rounded-full ${
                            isSelected ? 'bg-[#E8E8F0]' : 'bg-[#FD79A8]'
                          }`}
                        />
                      )}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* ── SELECTED DATE INDICATOR ── */}
      {selectedDate && (
        <View className="mt-4 pt-3 border-t border-[#1E1E3A] flex-row items-center justify-center">
          <View className="w-[5px] h-[5px] rounded-full bg-[#6C5CE7] mr-2" />
          <Text className="text-[11px] text-[#6B6B8D] font-medium">
            {selectedDate}
          </Text>
          <Text className="text-[11px] text-[#3D3D5C] mx-2">·</Text>
          <TouchableOpacity onPress={() => onSelectDate(null)} activeOpacity={0.7}>
            <Text className="text-[11px] text-[#6C5CE7] font-semibold">
              Show all
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
