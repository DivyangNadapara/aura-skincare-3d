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
    const formattedHour = (hours % 12 || 12).toString().padStart(2, '0');
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const [timeStr, setTimeStr] = useState(formatCurrentTime());

  const handleSave = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      amount: parsedAmount,
      type,
      category,
      dateStr: dateStr || defaultDateStr,
      timeStr: timeStr || formatCurrentTime(),
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
      <View className="flex-1 justify-end bg-black/75">
        <View className="bg-[#141620] border-t border-[#252838] rounded-t-[34px] px-6 pt-3 pb-8 max-h-[90%]">
          {/* Modal Handle Bar */}
          <View className="items-center mb-3">
            <View className="w-10 h-1 rounded-full bg-[#35394B]" />
          </View>

          {/* Modal Header */}
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={onClose} className="p-1">
              <Text className="text-sm font-semibold text-[#8D92A4]">Cancel</Text>
            </TouchableOpacity>

            <Text className="text-base font-bold text-white">Add Transaction</Text>

            <TouchableOpacity onPress={handleSave} className="p-1">
              <Text className="text-sm font-bold text-[#2C7BFE]">Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* TYPE SWITCHER: EXPENSE vs INCOME */}
            <View className="flex-row bg-[#0A0C12] p-1 rounded-2xl mb-4 border border-[#1E2230]">
              <TouchableOpacity
                onPress={() => setType('expense')}
                className={`flex-1 py-2.5 rounded-xl items-center ${
                  type === 'expense' ? 'bg-[#FF453A]' : ''
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    type === 'expense' ? 'text-white' : 'text-[#82889A]'
                  }`}
                >
                  💸 Expense
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setType('income')}
                className={`flex-1 py-2.5 rounded-xl items-center ${
                  type === 'income' ? 'bg-[#30D158]' : ''
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    type === 'income' ? 'text-white' : 'text-[#82889A]'
                  }`}
                >
                  💰 Income
                </Text>
              </TouchableOpacity>
            </View>

            {/* AMOUNT INPUT WITH CURRENCY */}
            <View className="bg-[#1C1F2B] border border-[#272B3B] rounded-2xl p-4 mb-4 items-center">
              <Text className="text-xs text-[#82889A] mb-1 font-semibold uppercase tracking-wider">
                Amount ($)
              </Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor="#4C5163"
                keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
                className="text-3xl font-extrabold text-white text-center w-full py-1"
                autoFocus
              />
            </View>

            {/* DATE & TIME ROW */}
            <View className="flex-row gap-3 mb-4">
              {/* Date Input */}
              <View className="flex-1 bg-[#1C1F2B] border border-[#272B3B] rounded-2xl p-3">
                <Text className="text-[10px] font-bold text-[#8E94A7] uppercase tracking-wider mb-1">
                  📅 Date (YYYY-MM-DD)
                </Text>
                <TextInput
                  value={dateStr}
                  onChangeText={setDateStr}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#535767"
                  className="text-white text-xs font-bold py-0"
                />
              </View>

              {/* Time Input */}
              <View className="flex-1 bg-[#1C1F2B] border border-[#272B3B] rounded-2xl p-3">
                <Text className="text-[10px] font-bold text-[#8E94A7] uppercase tracking-wider mb-1">
                  ⏰ Time
                </Text>
                <TextInput
                  value={timeStr}
                  onChangeText={setTimeStr}
                  placeholder="e.g. 02:30 PM"
                  placeholderTextColor="#535767"
                  className="text-white text-xs font-bold py-0"
                />
              </View>
            </View>

            {/* TITLE / DESCRIPTION INPUT */}
            <View className="mb-4">
              <Text className="text-xs font-semibold text-[#8E94A7] mb-1.5 uppercase tracking-wider">
                Title / Short Name
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Grocery, Coffee, Salary, Client Pay"
                placeholderTextColor="#535767"
                className="bg-[#1C1F2B] border border-[#272B3B] text-white rounded-2xl px-4 py-3 text-sm font-medium"
              />
            </View>

            {/* CATEGORY SELECTOR */}
            <View className="mb-4">
              <Text className="text-xs font-semibold text-[#8E94A7] mb-2 uppercase tracking-wider">
                Category
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row"
              >
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setCategory(cat)}
                      className={`flex-row items-center px-3.5 py-2 rounded-xl mr-2 border ${
                        isSelected
                          ? 'bg-[#2C7BFE] border-[#2C7BFE]'
                          : 'bg-[#1C1F2B] border-[#272B3B]'
                      }`}
                    >
                      <Text className="mr-1.5 text-xs">{CATEGORY_ICONS[cat]}</Text>
                      <Text
                        className={`text-xs font-semibold ${
                          isSelected ? 'text-white font-bold' : 'text-[#8E94A7]'
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
              <Text className="text-xs font-semibold text-[#8E94A7] mb-1.5 uppercase tracking-wider">
                Note (Optional)
              </Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Additional details or tag..."
                placeholderTextColor="#535767"
                className="bg-[#1C1F2B] border border-[#272B3B] text-white rounded-2xl px-4 py-3 text-xs"
              />
            </View>

            {/* SAVE BUTTON */}
            <TouchableOpacity
              onPress={handleSave}
              className={`py-4 rounded-2xl items-center ${
                type === 'income' ? 'bg-[#30D158]' : 'bg-[#2C7BFE]'
              }`}
            >
              <Text className="text-white font-bold text-base">
                Confirm {type === 'income' ? 'Income' : 'Expense'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
