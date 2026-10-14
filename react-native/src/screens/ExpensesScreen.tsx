import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import {
  TransactionItem,
  INITIAL_TRANSACTIONS,
  CATEGORY_ICONS,
  ExpenseCategory,
} from '../types/expense';
import { AddTransactionModal } from '../components/AddTransactionModal';
import { ExpenseCalendar } from '../components/ExpenseCalendar';

// ── Category color map for breakdown bars ──
const CATEGORY_COLORS: Partial<Record<ExpenseCategory, string>> = {
  Food: '#FD79A8',
  Transport: '#6C5CE7',
  Shopping: '#FDCB6E',
  Entertainment: '#00B894',
  Health: '#74B9FF',
  Bills: '#E17055',
  Education: '#A29BFE',
  Travel: '#55EFC4',
  Salary: '#00B894',
  Freelance: '#6C5CE7',
  Investment: '#FDCB6E',
  Gift: '#FD79A8',
  Other: '#636E72',
};

import { useApp } from '../context/AppContext';

interface ExpensesScreenProps {
  onBack?: () => void;
}

export const ExpensesScreen: React.FC<ExpensesScreenProps> = ({ onBack }) => {
  const app = useApp();
  const transactions = app.transactions;
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calendar view state (defaults to October 2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed: 9 = October
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // "YYYY-MM-DD" or null

  const handlePrevMonth = () => {
    setSelectedDate(null);
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setSelectedDate(null);
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  // Transactions scoped to the active calendar month or specific selected date
  const monthPrefix = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
  
  const scopedTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (selectedDate) {
        return tx.dateStr === selectedDate;
      }
      return tx.dateStr.startsWith(monthPrefix);
    });
  }, [transactions, selectedDate, monthPrefix]);

  // Advanced financial calculations scoped to current calendar selection
  const summary = useMemo(() => {
    let income = 0;
    let expenses = 0;

    scopedTransactions.forEach((tx) => {
      if (tx.type === 'income') {
        income += tx.amount;
      } else {
        expenses += tx.amount;
      }
    });

    const netBalance = income - expenses;
    const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

    return {
      income,
      expenses,
      netBalance,
      savingsRate,
    };
  }, [scopedTransactions]);

  // Category breakdown calculations for expenses
  const categoryBreakdown = useMemo(() => {
    const map: Partial<Record<ExpenseCategory, number>> = {};
    scopedTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });

    const totalExp = summary.expenses || 1;
    return Object.entries(map).map(([cat, amt]) => ({
      category: cat as ExpenseCategory,
      amount: amt,
      percentage: Math.round((amt / totalExp) * 100),
    }));
  }, [scopedTransactions, summary.expenses]);

  // Scoped & type-filtered transactions list
  const filteredTransactions = useMemo(() => {
    if (filterType === 'all') return scopedTransactions;
    return scopedTransactions.filter((t) => t.type === filterType);
  }, [scopedTransactions, filterType]);

  const handleAddTransaction = (newTx: Omit<TransactionItem, 'id'>) => {
    app.addTransaction(newTx);
  };

  const handleDeleteTransaction = (id: string) => {
    app.deleteTransaction(id);
  };

  return (
    <View className="flex-1 bg-[#050510]">
      <View className="flex-1">
        {/* ── TOP ACTION BAR ── */}
        <View className="flex-row items-center justify-between px-5 pt-2 pb-1">
          {onBack ? (
            <TouchableOpacity
              onPress={onBack}
              activeOpacity={0.6}
              className="py-1 pr-3 flex-row items-center gap-1.5"
            >
              <Text className="text-lg text-[#6B6B8D]">◂</Text>
              <Text className="text-[11px] font-semibold text-[#6B6B8D] uppercase tracking-[2px]">Back</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}

          <View className="flex-row items-center gap-5">
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setIsModalOpen(true)}
              className="p-1"
            >
              <Text className="text-2xl font-light text-[#6C5CE7] leading-none">+</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.6} className="p-1">
              <Text className="text-lg text-[#3D3D5C] font-bold">⋮</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── SCREEN TITLE ── */}
        <View className="px-6 pt-1 pb-5">
          <Text className="text-[10px] font-bold text-[#6C5CE7] uppercase tracking-[4px] mb-1">
            Finance
          </Text>
          <Text className="text-3xl font-extrabold tracking-tight text-[#E8E8F0]">
            Cash Flow
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-4"
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'ios' ? 90 : 80,
          }}
        >
          {/* ══════════════════════════════════════════════════════════════
              HERO BALANCE CARD
              ══════════════════════════════════════════════════════════════ */}
          <View className="bg-[#0D0D1A] border border-[#1E1E3A] rounded-[36px] p-6 mb-5">
            {/* Top label row */}
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-[10px] font-bold uppercase tracking-[3px] text-[#3D3D5C]">
                {selectedDate ? 'Day Balance' : 'Net Balance'}
              </Text>
              <View
                className={`px-3 py-1 rounded-full border ${
                  summary.savingsRate >= 0
                    ? 'bg-[#00B894]/8 border-[#00B894]/20'
                    : 'bg-[#FD79A8]/8 border-[#FD79A8]/20'
                }`}
              >
                <Text
                  className={`text-[10px] font-extrabold tracking-[1px] ${
                    summary.savingsRate >= 0 ? 'text-[#00B894]' : 'text-[#FD79A8]'
                  }`}
                >
                  {summary.savingsRate >= 0 ? '▲' : '▼'} {Math.abs(summary.savingsRate)}%
                </Text>
              </View>
            </View>

            {/* HERO AMOUNT — massive, dominating */}
            <Text
              className="text-[52px] font-extrabold text-[#E8E8F0] mb-6"
              style={{ letterSpacing: -2, lineHeight: 58 }}
            >
              ${summary.netBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>

            {/* Income & Expense split — two elegant columns with accent bars */}
            <View className="flex-row">
              {/* Income column */}
              <View className="flex-1 flex-row">
                <View className="w-[3px] rounded-full bg-[#00B894] mr-3" />
                <View>
                  <Text className="text-[10px] font-bold uppercase tracking-[2px] text-[#3D3D5C] mb-1">
                    Income
                  </Text>
                  <Text className="text-lg font-extrabold text-[#00B894]">
                    +${summary.income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                </View>
              </View>

              {/* Expense column */}
              <View className="flex-1 flex-row">
                <View className="w-[3px] rounded-full bg-[#FD79A8] mr-3" />
                <View>
                  <Text className="text-[10px] font-bold uppercase tracking-[2px] text-[#3D3D5C] mb-1">
                    Expenses
                  </Text>
                  <Text className="text-lg font-extrabold text-[#FD79A8]">
                    -${summary.expenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ══════════════════════════════════════════════════════════════
              INTERACTIVE MONTHLY CALENDAR
              ══════════════════════════════════════════════════════════════ */}
          <ExpenseCalendar
            currentYear={currentYear}
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onSelectDate={(date) => setSelectedDate(date)}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            transactions={transactions}
          />

          {/* ══════════════════════════════════════════════════════════════
              SELECTED DATE FILTER BANNER
              ══════════════════════════════════════════════════════════════ */}
          {selectedDate && (
            <View className="flex-row items-center justify-between bg-[#6C5CE7]/8 border border-[#6C5CE7]/20 rounded-2xl px-4 py-3 mb-5">
              <View className="flex-row items-center gap-2.5">
                <View className="w-2 h-2 rounded-full bg-[#6C5CE7]" />
                <Text className="text-[11px] font-semibold text-[#A29BFE]">
                  Filtered: <Text className="font-bold text-[#E8E8F0]">{selectedDate}</Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedDate(null)}
                className="bg-[#6C5CE7]/15 px-3 py-1.5 rounded-full"
                activeOpacity={0.6}
              >
                <Text className="text-[10px] font-bold text-[#A29BFE] tracking-[1px]">CLEAR</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ══════════════════════════════════════════════════════════════
              CATEGORY BREAKDOWN — colored dots + horizontal bars
              ══════════════════════════════════════════════════════════════ */}
          {categoryBreakdown.length > 0 && (
            <View className="bg-[#0D0D1A] border border-[#1E1E3A] rounded-[28px] p-5 mb-6">
              <Text className="text-[10px] font-bold text-[#3D3D5C] uppercase tracking-[3px] mb-4">
                Breakdown
              </Text>
              {categoryBreakdown.map((item) => {
                const barColor = CATEGORY_COLORS[item.category] || '#6C5CE7';
                return (
                  <View key={item.category} className="mb-3.5">
                    <View className="flex-row items-center justify-between mb-1.5">
                      <View className="flex-row items-center gap-2.5">
                        {/* Colored dot indicator */}
                        <View
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: barColor }}
                        />
                        <Text className="text-[12px] font-semibold text-[#E8E8F0]">
                          {item.category}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Text className="text-[12px] font-extrabold text-[#E8E8F0]">
                          ${item.amount.toFixed(0)}
                        </Text>
                        <Text className="text-[10px] font-bold text-[#3D3D5C]">
                          {item.percentage}%
                        </Text>
                      </View>
                    </View>
                    {/* Styled horizontal bar */}
                    <View className="h-[5px] bg-[#14142A] rounded-full overflow-hidden">
                      <View
                        style={{
                          width: `${Math.min(item.percentage, 100)}%`,
                          backgroundColor: barColor,
                          opacity: 0.85,
                        }}
                        className="h-full rounded-full"
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TRANSACTION LIST HEADER & FILTER PILLS
              ══════════════════════════════════════════════════════════════ */}
          <View className="flex-row items-center justify-between mb-4 mt-1">
            <Text className="text-[10px] font-bold text-[#3D3D5C] uppercase tracking-[3px]">
              Records
            </Text>

            <View className="flex-row gap-2">
              {(['all', 'expense', 'income'] as const).map((tab) => {
                const isActive = filterType === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setFilterType(tab)}
                    activeOpacity={0.6}
                    className={`px-3.5 py-1.5 rounded-full border ${
                      isActive
                        ? 'bg-[#6C5CE7]/15 border-[#6C5CE7]/40'
                        : 'bg-transparent border-[#1E1E3A]'
                    }`}
                    style={
                      isActive
                        ? {
                            shadowColor: '#6C5CE7',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 4,
                          }
                        : undefined
                    }
                  >
                    <Text
                      className={`text-[10px] font-bold uppercase tracking-[1px] ${
                        isActive ? 'text-[#A29BFE]' : 'text-[#3D3D5C]'
                      }`}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ══════════════════════════════════════════════════════════════
              TRANSACTION CARDS — minimal, thin accent line design
              ══════════════════════════════════════════════════════════════ */}
          {filteredTransactions.length === 0 ? (
            <View className="items-center justify-center py-16">
              <Text className="text-3xl text-[#1E1E3A] mb-3">◇</Text>
              <Text className="text-[12px] text-[#3D3D5C] font-medium">
                No transactions found
              </Text>
              {selectedDate && (
                <TouchableOpacity
                  onPress={() => setSelectedDate(null)}
                  className="mt-4 bg-[#14142A] px-5 py-2.5 rounded-full border border-[#1E1E3A]"
                  activeOpacity={0.6}
                >
                  <Text className="text-[10px] text-[#6C5CE7] font-bold uppercase tracking-[2px]">
                    View Month
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            filteredTransactions.map((tx) => {
              const isIncome = tx.type === 'income';
              const accentColor = isIncome ? '#00B894' : '#FD79A8';

              return (
                <View
                  key={tx.id}
                  className="flex-row mb-2.5 rounded-2xl overflow-hidden bg-[#0D0D1A] border border-[#1E1E3A]"
                >
                  {/* Thin left accent line */}
                  <View
                    className="w-[3px]"
                    style={{ backgroundColor: accentColor }}
                  />

                  {/* Content area */}
                  <View className="flex-1 flex-row items-center justify-between px-4 py-3.5">
                    <View className="flex-1 pr-3">
                      <Text className="text-[13px] font-bold text-[#E8E8F0] mb-0.5">
                        {tx.title}
                      </Text>
                      <View className="flex-row items-center gap-1.5">
                        <Text className="text-[10px] text-[#3D3D5C] font-medium">
                          {tx.category}
                        </Text>
                        <Text className="text-[8px] text-[#1E1E3A]">●</Text>
                        <Text className="text-[10px] text-[#3D3D5C] font-medium">
                          {tx.dateStr}
                        </Text>
                      </View>
                    </View>

                    {/* Amount + delete */}
                    <View className="items-end">
                      <Text
                        className={`text-[15px] font-extrabold ${
                          isIncome ? 'text-[#00B894]' : 'text-[#FD79A8]'
                        }`}
                        style={{ letterSpacing: -0.5 }}
                      >
                        {isIncome ? '+' : '-'}${tx.amount.toFixed(2)}
                      </Text>

                      <TouchableOpacity
                        onPress={() => handleDeleteTransaction(tx.id)}
                        className="mt-1 px-1.5 py-0.5"
                        activeOpacity={0.5}
                      >
                        <Text className="text-[9px] text-[#3D3D5C] font-semibold">
                          Remove
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* ── FLOATING ACTION BUTTON ── */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsModalOpen(true)}
          className="absolute bottom-4 right-4 w-14 h-14 rounded-full bg-[#6C5CE7] items-center justify-center"
          style={{
            shadowColor: '#6C5CE7',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 16,
            elevation: 12,
          }}
        >
          <Text className="text-2xl text-white font-light leading-none">+</Text>
        </TouchableOpacity>
      </View>

      {/* ADD TRANSACTION MODAL */}
      <AddTransactionModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTransaction}
        initialDate={selectedDate || undefined}
      />
    </View>
  );
};
