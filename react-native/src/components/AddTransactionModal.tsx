import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import {
  TransactionItem,
  TransactionType,
  ExpenseCategory,
  CATEGORY_ICONS,
} from '../types/expense';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (tx: Omit<TransactionItem, 'id'>) => void;
  initialDate?: string; // "YYYY-MM-DD"
}

const CATEGORIES: ExpenseCategory[] = [
  'Food & Dining',
  'Shopping',
  'Transport',
  'Bills & Utilities',
  'Health & Fitness',
  'Entertainment',
  'Salary & Work',
  'Investments',
  'Other',
];

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  visible,
  onClose,
  onSave,
  initialDate,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food & Dining');
  const [note, setNote] = useState('');

  // Date and Time pickers
  const today = new Date();
  const defaultDateStr =
    initialDate ||
    `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  
  const [dateStr, setDateStr] = useState(defaultDateStr);

  const formatCurrentTime = () => {
    const hours = today.getHours();
    const minutes = today.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hours % 12 || 12}:${minutes} ${ampm}`;
  };

  const [timeStr, setTimeStr] = useState(formatCurrentTime());

  const handleSave = () => {
    const numericAmount = parseFloat(amount.trim());
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!title.trim()) {
      alert('Please enter a description / title');
      return;
    }

    onSave({
      title: title.trim(),
      amount: numericAmount,
      type,
      category,
      dateStr: dateStr.trim() || defaultDateStr,
      timeStr: timeStr.trim() || formatCurrentTime(),
      note: note.trim() || undefined,
    });

    // Reset fields
    setAmount('');
    setTitle('');
    setNote('');
    setType('expense');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/85">
        <View className="bg-[#0D0D1A] border-t border-[#1E1E3A] rounded-t-[40px] px-6 pt-3 pb-10 max-h-[92%] shadow-2xl">
          {/* Modal Handle Bar */}
          <View className="items-center mb-4">
            <View className="w-10 h-1 rounded-full bg-[#1E1E3A]" />
          </View>

          {/* Modal Header */}
          <View className="flex-row items-center justify-between mb-5">
            <TouchableOpacity onPress={onClose} activeOpacity={0.7} className="p-1">
              <Text className="text-xs font-semibold uppercase tracking-[2px] text-[#6B6B8D]">
                Cancel
              </Text>
            </TouchableOpacity>

            <Text className="text-sm font-bold tracking-[2px] uppercase text-[#E8E8F0]">
              New Cash Record
            </Text>

            <TouchableOpacity
              onPress={handleSave}
              activeOpacity={0.7}
              className="bg-[#6C5CE7] px-4 py-1.5 rounded-full shadow-md shadow-[#6C5CE7]/30"
            >
              <Text className="text-xs font-bold uppercase tracking-[1px] text-white">
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* TYPE SWITCHER: EXPENSE vs INCOME */}
            <View className="flex-row bg-[#14142A] p-1.5 rounded-2xl mb-5 border border-[#1E1E3A]">
              <TouchableOpacity
                onPress={() => setType('expense')}
                activeOpacity={0.8}
                className={`flex-1 py-2.5 rounded-xl items-center ${
                  type === 'expense'
                    ? 'bg-[#FD79A8] shadow-md shadow-[#FD79A8]/30'
                    : ''
                }`}
              >
                <Text
                  className={`text-xs font-bold tracking-[2px] uppercase ${
                    type === 'expense' ? 'text-[#050510]' : 'text-[#6B6B8D]'
                  }`}
                >
                  ▼ Outflow / Expense
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setType('income')}
                activeOpacity={0.8}
                className={`flex-1 py-2.5 rounded-xl items-center ${
                  type === 'income'
                    ? 'bg-[#00B894] shadow-md shadow-[#00B894]/30'
                    : ''
                }`}
              >
                <Text
                  className={`text-xs font-bold tracking-[2px] uppercase ${
                    type === 'income' ? 'text-[#050510]' : 'text-[#6B6B8D]'
                  }`}
                >
                  ▲ Inflow / Income
                </Text>
              </TouchableOpacity>
            </View>

            {/* AMOUNT INPUT WITH CURRENCY */}
            <View className="bg-[#14142A] border border-[#1E1E3A] rounded-3xl p-5 mb-5 items-center">
              <Text className="text-[10px] text-[#6B6B8D] mb-1 font-bold uppercase tracking-[3px]">
                Transaction Value (USD)
              </Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor="#3D3D5C"
                keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
                className="text-5xl font-extrabold text-[#E8E8F0] text-center w-full py-1 tracking-tight"
                autoFocus
              />
            </View>

            {/* DATE & TIME ROW */}
            <View className="flex-row gap-3 mb-4">
              {/* Date Input */}
              <View className="flex-1 bg-[#14142A] border border-[#1E1E3A] rounded-2xl p-3.5">
                <Text className="text-[9px] font-bold text-[#6B6B8D] uppercase tracking-[2px] mb-1">
                  Date (YYYY-MM-DD)
                </Text>
                <TextInput
                  value={dateStr}
                  onChangeText={setDateStr}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#3D3D5C"
                  className="text-[#E8E8F0] text-xs font-mono font-bold py-0"
                />
              </View>

              {/* Time Input */}
              <View className="flex-1 bg-[#14142A] border border-[#1E1E3A] rounded-2xl p-3.5">
                <Text className="text-[9px] font-bold text-[#6B6B8D] uppercase tracking-[2px] mb-1">
                  Time
                </Text>
                <TextInput
                  value={timeStr}
                  onChangeText={setTimeStr}
                  placeholder="e.g. 02:30 PM"
                  placeholderTextColor="#3D3D5C"
                  className="text-[#E8E8F0] text-xs font-mono font-bold py-0"
                />
              </View>
            </View>

            {/* TITLE / DESCRIPTION INPUT */}
            <View className="mb-4">
              <Text className="text-[10px] font-bold text-[#6B6B8D] mb-1.5 uppercase tracking-[2px]">
                Description / Merchant
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Coffee Roastery, Client Wire, Fuel..."
                placeholderTextColor="#3D3D5C"
                className="bg-[#14142A] border border-[#1E1E3A] rounded-2xl px-4 py-3 text-[#E8E8F0] text-sm font-sans"
              />
            </View>

            {/* CATEGORY SELECTOR */}
            <View className="mb-4">
              <Text className="text-[10px] font-bold text-[#6B6B8D] mb-2 uppercase tracking-[2px]">
                Category
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setCategory(cat)}
                      activeOpacity={0.75}
                      className={`flex-row items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border ${
                        isSelected
                          ? 'bg-[#6C5CE7] border-[#6C5CE7]'
                          : 'bg-[#14142A] border-[#1E1E3A]'
                      }`}
                    >
                      <Text
                        className={`text-xs ${
                          isSelected ? 'text-white' : 'text-[#6C5CE7]'
                        }`}
                      >
                        {CATEGORY_ICONS[cat]}
                      </Text>
                      <Text
                        className={`text-xs font-bold ${
                          isSelected ? 'text-white' : 'text-[#6B6B8D]'
                        }`}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* OPTIONAL NOTE */}
            <View className="mb-6">
              <Text className="text-[10px] font-bold text-[#6B6B8D] mb-1.5 uppercase tracking-[2px]">
                Internal Memo (Optional)
              </Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Tax tags, project reference, receipt ID..."
                placeholderTextColor="#3D3D5C"
                className="bg-[#14142A] border border-[#1E1E3A] rounded-2xl px-4 py-2.5 text-[#E8E8F0] text-xs font-sans"
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
