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

interface ExpensesScreenProps {
  onBack?: () => void;
}

export const ExpensesScreen: React.FC<ExpensesScreenProps> = ({ onBack }) => {
  const [transactions, setTransactions] = useState<TransactionItem[]>(
    INITIAL_TRANSACTIONS
  );
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
    const tx: TransactionItem = {
      ...newTx,
      id: `tx-${Date.now()}`,
    };
    setTransactions((prev) => [tx, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <SafeAreaView className="flex-1 bg-[#000000]">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View className="flex-1">
        {/* TOP ACTION BAR */}
        <View className="flex-row items-center justify-between px-6 pt-3 pb-2">
          {onBack ? (
            <TouchableOpacity
              onPress={onBack}
              activeOpacity={0.7}
              className="py-1 pr-3 flex-row items-center gap-1"
            >
              <Text className="text-xl text-white">←</Text>
              <Text className="text-sm font-semibold text-[#8D92A4]">Home</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}

          <View className="flex-row items-center space-x-5 gap-5">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsModalOpen(true)}
              className="p-1"
            >
              <Text className="text-2xl font-light text-white leading-none">+</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} className="p-1">
              <Text className="text-xl text-[#9EA3B5] font-bold">⋮</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ONE UI HEADER */}
        <View className="px-6 pt-2 pb-4">
          <Text className="text-3xl font-bold tracking-tight text-white font-sans">
            Expenses & Income
          </Text>
          <Text className="text-sm text-[#8D92A4] mt-1 font-normal">
            Financial rhythm & daily cashflow
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-4"
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'ios' ? 80 : 70,
          }}
        >
          {/* ── ADVANCED CALCULATION SUMMARY CARD ── */}
          <View className="bg-[#181B26] border border-[#272B3B] rounded-[28px] p-5 mb-4 shadow-lg shadow-black/80">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-xs font-semibold uppercase tracking-wider text-[#82889A]">
                {selectedDate ? `Net Balance (${selectedDate})` : 'Monthly Net Balance'}
              </Text>
              <View
                className={`px-2.5 py-0.5 rounded-full ${
                  summary.savingsRate >= 0 ? 'bg-[#30D158]/20' : 'bg-[#FF453A]/20'
                }`}
              >
                <Text
                  className={`text-[11px] font-bold ${
                    summary.savingsRate >= 0 ? 'text-[#30D158]' : 'text-[#FF453A]'
                  }`}
                >
                  {summary.savingsRate}% Saved
                </Text>
              </View>
            </View>

            {/* Total Balance Amount */}
            <Text className="text-4xl font-extrabold text-white mb-4">
              ${summary.netBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>

            {/* Income & Expense Split Chips */}
            <View className="flex-row items-center justify-between bg-[#11131C] p-3 rounded-2xl border border-[#202330]">
              {/* Income */}
              <View className="flex-1">
                <Text className="text-[11px] text-[#8E94A7] font-semibold mb-0.5">
                  ↓ Total Income
                </Text>
                <Text className="text-base font-bold text-[#30D158]">
                  +${summary.income.toFixed(2)}
                </Text>
              </View>

              {/* Vertical divider */}
              <View className="w-[1px] h-8 bg-[#2A2E3D] mx-3" />

              {/* Expense */}
              <View className="flex-1">
                <Text className="text-[11px] text-[#8E94A7] font-semibold mb-0.5">
                  ↑ Total Expenses
                </Text>
                <Text className="text-base font-bold text-[#FF453A]">
                  -${summary.expenses.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* ── INTERACTIVE MONTHLY CALENDAR ── */}
          <ExpenseCalendar
            currentYear={currentYear}
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onSelectDate={(date) => setSelectedDate(date)}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            transactions={transactions}
          />

          {/* ── SELECTED DATE ACTIVE FILTER BANNER ── */}
          {selectedDate && (
            <View className="flex-row items-center justify-between bg-[#2C7BFE]/15 border border-[#2C7BFE]/40 rounded-2xl px-4 py-2.5 mb-4">
              <View className="flex-row items-center gap-2">
                <Text className="text-base">📅</Text>
                <Text className="text-xs font-semibold text-[#8EB7FF]">
                  Filtered for: <Text className="font-bold text-white">{selectedDate}</Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedDate(null)}
                className="bg-[#2C7BFE]/30 px-2.5 py-1 rounded-full"
                activeOpacity={0.7}
              >
                <Text className="text-[11px] font-bold text-[#8EB7FF]">Show Month ✕</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── EXPENSE CATEGORY ANALYTICS BAR ── */}
          {categoryBreakdown.length > 0 && (
            <View className="bg-[#141620] border border-[#212433] rounded-[24px] p-4 mb-5">
              <Text className="text-xs font-bold text-[#8E94A7] uppercase tracking-wider mb-3">
                Expense Breakdown
              </Text>
              {categoryBreakdown.map((item) => (
                <View key={item.category} className="mb-2.5">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-xs font-medium text-white">
                      {CATEGORY_ICONS[item.category]} {item.category}
                    </Text>
                    <Text className="text-xs font-semibold text-[#8D92A4]">
                      ${item.amount.toFixed(2)} ({item.percentage}%)
                    </Text>
                  </View>
                  {/* Progress bar */}
                  <View className="h-1.5 bg-[#252837] rounded-full overflow-hidden">
                    <View
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                      className="h-full bg-[#2C7BFE] rounded-full"
                    />
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* ── TRANSACTION LIST HEADER & TYPE FILTER CHIPS ── */}
          <View className="flex-row items-center justify-between mb-3 mt-1">
            <Text className="text-xs font-bold text-[#82889A] uppercase tracking-wider">
              {selectedDate ? `Transactions (${selectedDate})` : 'Monthly Records'}
            </Text>

            <View className="flex-row gap-1 bg-[#12141D] p-1 rounded-xl border border-[#212433]">
              {(['all', 'expense', 'income'] as const).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setFilterType(tab)}
                  className={`px-2.5 py-1 rounded-lg ${
                    filterType === tab ? 'bg-[#2C7BFE]' : ''
                  }`}
                >
                  <Text
                    className={`text-[10px] font-bold uppercase ${
                      filterType === tab ? 'text-white' : 'text-[#82889A]'
                    }`}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── TRANSACTION CARDS ── */}
          {filteredTransactions.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Text className="text-3xl mb-2">💳</Text>
              <Text className="text-sm text-[#8E94A7] font-medium">
                No transactions for this selection
              </Text>
              {selectedDate && (
                <TouchableOpacity
                  onPress={() => setSelectedDate(null)}
                  className="mt-3 bg-[#1C1F2B] px-4 py-2 rounded-xl border border-[#272B3B]"
                >
                  <Text className="text-xs text-[#2C7BFE] font-bold">
                    View Entire Month
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            filteredTransactions.map((tx) => (
              <View
                key={tx.id}
                className="bg-[#1C1F2B] border border-[#272B3B] rounded-2xl p-4 mb-3 flex-row items-center justify-between shadow-sm shadow-black"
              >
                <View className="flex-row items-center flex-1 pr-3">
                  <View
                    className={`w-11 h-11 rounded-2xl items-center justify-center mr-3 border ${
                      tx.type === 'income'
                        ? 'bg-[#30D158]/15 border-[#30D158]/30'
                        : 'bg-[#FF453A]/15 border-[#FF453A]/30'
                    }`}
                  >
                    <Text className="text-xl">
                      {CATEGORY_ICONS[tx.category] || '📦'}
                    </Text>
                  </View>

                  <View className="flex-1">
                    <Text className="text-sm font-bold text-white mb-0.5">
                      {tx.title}
                    </Text>
                    <Text className="text-[11px] text-[#82889A]">
                      {tx.category} • 📅 {tx.dateStr} • ⏰ {tx.timeStr}
                    </Text>
                    {tx.note ? (
                      <Text className="text-[10px] text-[#5D6273] mt-0.5" numberOfLines={1}>
                        "{tx.note}"
                      </Text>
                    ) : null}
                  </View>
                </View>

                {/* Amount and delete button */}
                <View className="items-end">
                  <Text
                    className={`text-base font-extrabold ${
                      tx.type === 'income' ? 'text-[#30D158]' : 'text-[#FF453A]'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </Text>

                  <TouchableOpacity
                    onPress={() => handleDeleteTransaction(tx.id)}
                    className="mt-1 px-1.5 py-0.5"
                  >
                    <Text className="text-[10px] text-[#6E7385] font-semibold">
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* FLOATING ACTION BUTTON TO ADD TRANSACTION */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setIsModalOpen(true)}
          className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#2C7BFE] items-center justify-center shadow-xl shadow-[#2C7BFE]/40"
        >
          <Text className="text-2xl text-white font-light">+</Text>
        </TouchableOpacity>
      </View>

      {/* ADD TRANSACTION MODAL */}
      <AddTransactionModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTransaction}
        initialDate={selectedDate || undefined}
      />
    </SafeAreaView>
  );
};

