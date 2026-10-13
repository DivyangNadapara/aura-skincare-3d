import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  TouchableWithoutFeedback,
} from 'react-native';
import { AlarmItem, AlarmCategory, DAYS_OF_WEEK, ALARM_SOUNDS } from '../types/alarm';

interface CreateAlarmModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (newAlarm: Omit<AlarmItem, 'id'>) => void;
}

export const CreateAlarmModal: React.FC<CreateAlarmModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [selectedHour, setSelectedHour] = useState(7);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState<AlarmCategory>('Morning Routine');
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4]);
  const [sound, setSound] = useState(ALARM_SOUNDS[0]);
  const [vibration, setVibration] = useState(true);

  const toggleDay = (dayId: number) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId].sort((a, b) => a - b));
    }
  };

  const handleSave = () => {
    const formattedHour = selectedHour.toString().padStart(2, '0');
    const formattedMinute = selectedMinute.toString().padStart(2, '0');
    const timeString = `${formattedHour}:${formattedMinute} ${period}`;

    onSave({
      time: timeString,
      hour: selectedHour,
      minute: selectedMinute,
      period,
      label: label.trim() || 'Scheduled Protocol',
      category,
      days: selectedDays.length > 0 ? selectedDays : [0, 1, 2, 3, 4, 5, 6],
      isEnabled: true,
      sound,
      vibration,
      snoozeEnabled: true,
    });

    // Reset and close
    setLabel('');
    onClose();
  };

  const categories: AlarmCategory[] = [
    'Morning Routine',
    'Deep Work',
    'Recovery',
    'Circadian Sync',
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/80">
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View className="bg-slate-900 border-t border-slate-800 rounded-t-3xl max-h-[90%] pb-8 pt-3 px-6 shadow-2xl">
              
              {/* Bottom Sheet Handle */}
              <View className="items-center mb-4">
                <View className="w-12 h-1.5 rounded-full bg-slate-700/60" />
              </View>

              {/* Modal Header */}
              <View className="flex-row items-center justify-between mb-5">
                <Text className="text-xl font-bold text-white tracking-tight">
                  Create New Alarm
                </Text>
                <TouchableOpacity
                  onPress={onClose}
                  className="w-8 h-8 rounded-full bg-slate-800 items-center justify-center"
                >
                  <Text className="text-slate-400 font-bold text-sm">✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                
                {/* 1. Time Selector Wheel / Dial */}
                <View className="bg-slate-950/80 rounded-2xl p-5 mb-5 border border-slate-800 items-center">
                  <Text className="text-xs uppercase font-mono tracking-wider text-slate-500 mb-3">
                    Target Rhythm Time
                  </Text>
                  
                  <View className="flex-row items-center justify-center space-x-3 gap-3">
                    
                    {/* Hour Stepper */}
                    <View className="items-center">
                      <TouchableOpacity
                        onPress={() => setSelectedHour((h) => (h === 12 ? 1 : h + 1))}
                        className="py-1 px-3 bg-slate-800/80 rounded-lg mb-1"
                      >
                        <Text className="text-slate-300 text-xs">▲</Text>
                      </TouchableOpacity>
                      <Text className="text-4xl font-bold font-sans text-white">
                        {selectedHour.toString().padStart(2, '0')}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setSelectedHour((h) => (h === 1 ? 12 : h - 1))}
                        className="py-1 px-3 bg-slate-800/80 rounded-lg mt-1"
                      >
                        <Text className="text-slate-300 text-xs">▼</Text>
                      </TouchableOpacity>
                    </View>

                    <Text className="text-3xl font-bold text-emerald-400 -mt-2">:</Text>

                    {/* Minute Stepper */}
                    <View className="items-center">
                      <TouchableOpacity
                        onPress={() => setSelectedMinute((m) => (m >= 55 ? 0 : m + 5))}
                        className="py-1 px-3 bg-slate-800/80 rounded-lg mb-1"
                      >
                        <Text className="text-slate-300 text-xs">▲</Text>
                      </TouchableOpacity>
                      <Text className="text-4xl font-bold font-sans text-white">
                        {selectedMinute.toString().padStart(2, '0')}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setSelectedMinute((m) => (m <= 0 ? 55 : m - 5))}
                        className="py-1 px-3 bg-slate-800/80 rounded-lg mt-1"
                      >
                        <Text className="text-slate-300 text-xs">▼</Text>
                      </TouchableOpacity>
                    </View>

                    {/* AM / PM Segmented Toggle */}
                    <View className="ml-4 bg-slate-800/90 rounded-xl p-1 border border-slate-700/60">
                      <TouchableOpacity
                        onPress={() => setPeriod('AM')}
                        className={`px-3 py-1.5 rounded-lg ${
                          period === 'AM' ? 'bg-emerald-500' : 'bg-transparent'
                        }`}
                      >
                        <Text
                          className={`text-xs font-bold ${
                            period === 'AM' ? 'text-black' : 'text-slate-400'
                          }`}
                        >
                          AM
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setPeriod('PM')}
                        className={`px-3 py-1.5 rounded-lg mt-1 ${
                          period === 'PM' ? 'bg-emerald-500' : 'bg-transparent'
                        }`}
                      >
                        <Text
                          className={`text-xs font-bold ${
                            period === 'PM' ? 'text-black' : 'text-slate-400'
                          }`}
                        >
                          PM
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* 2. Input Field for Alarm Name / Purpose */}
                <View className="mb-5">
                  <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Alarm Purpose / Protocol
                  </Text>
                  <TextInput
                    value={label}
                    onChangeText={setLabel}
                    placeholder="e.g., Morning Sunlight & Hydration"
                    placeholderTextColor="#64748b"
                    className="bg-slate-950/70 border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-4 py-3 text-sm font-medium"
                  />
                </View>

                {/* 3. Category Selection Pills */}
                <View className="mb-5">
                  <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Category Tag
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {categories.map((cat) => {
                      const isActive = category === cat;
                      return (
                        <TouchableOpacity
                          key={cat}
                          onPress={() => setCategory(cat)}
                          className={`px-3 py-1.5 rounded-full border ${
                            isActive
                              ? 'bg-emerald-500/20 border-emerald-400'
                              : 'bg-slate-800/40 border-slate-700/50'
                          }`}
                        >
                          <Text
                            className={`text-xs font-medium ${
                              isActive ? 'text-emerald-300 font-semibold' : 'text-slate-400'
                            }`}
                          >
                            {cat}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 4. Repeat Day Selectors (Mon-Sun) */}
                <View className="mb-5">
                  <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Repeat Schedule
                  </Text>
                  <View className="flex-row justify-between bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    {DAYS_OF_WEEK.map((day) => {
                      const isSelected = selectedDays.includes(day.id);
                      return (
                        <TouchableOpacity
                          key={day.id}
                          onPress={() => toggleDay(day.id)}
                          className={`w-9 h-9 rounded-full items-center justify-center border ${
                            isSelected
                              ? 'bg-emerald-500 border-emerald-400'
                              : 'bg-slate-800/60 border-slate-700/40'
                          }`}
                        >
                          <Text
                            className={`text-xs font-bold ${
                              isSelected ? 'text-black' : 'text-slate-400'
                            }`}
                          >
                            {day.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 5. Sound & Tone Dropdown / Selector */}
                <View className="mb-5">
                  <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Acoustic Wake Frequency
                  </Text>
                  <View className="bg-slate-950/70 rounded-xl border border-slate-800 overflow-hidden">
                    {ALARM_SOUNDS.slice(0, 3).map((item) => (
                      <TouchableOpacity
                        key={item}
                        onPress={() => setSound(item)}
                        className={`p-3.5 flex-row justify-between items-center border-b border-slate-800/60 ${
                          sound === item ? 'bg-emerald-500/10' : ''
                        }`}
                      >
                        <Text
                          className={`text-xs font-medium ${
                            sound === item ? 'text-emerald-300 font-semibold' : 'text-slate-300'
                          }`}
                        >
                          {item}
                        </Text>
                        {sound === item && (
                          <Text className="text-emerald-400 text-xs font-bold">✓</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* 6. Vibration Switch */}
                <View className="flex-row items-center justify-between bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 mb-6">
                  <View>
                    <Text className="text-sm font-medium text-white">Haptic Vibration</Text>
                    <Text className="text-xs text-slate-500">Gradual tactile escalation</Text>
                  </View>
                  <Switch
                    value={vibration}
                    onValueChange={setVibration}
                    trackColor={{ false: '#1e293b', true: '#10b981' }}
                    thumbColor={vibration ? '#ffffff' : '#64748b'}
                  />
                </View>

                {/* 7. Primary CTA: Save Alarm Button */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleSave}
                  className="bg-emerald-500 hover:bg-emerald-400 rounded-xl py-4 items-center shadow-lg shadow-emerald-500/20 mb-3"
                >
                  <Text className="text-black font-bold text-base tracking-wide">
                    Save Alarm
                  </Text>
                </TouchableOpacity>

              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
