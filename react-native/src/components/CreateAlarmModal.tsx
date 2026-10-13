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
import { AlarmItem, SamsungAlarmCategory, SAMSUNG_DAYS, SAMSUNG_SOUNDS, SAMSUNG_VIBRATIONS } from '../types/alarm';

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
  const [selectedMinute, setSelectedMinute] = useState(30);
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState<SamsungAlarmCategory>('Morning Routine');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon - Fri default
  const [sound, setSound] = useState(SAMSUNG_SOUNDS[0]);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [volume, setVolume] = useState(80);

  const toggleDay = (dayId: number) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId].sort((a, b) => a - b));
    }
  };

  const handleSave = () => {
    onSave({
      time: `${selectedHour}:${selectedMinute.toString().padStart(2, '0')}`,
      period,
      hour: selectedHour,
      minute: selectedMinute,
      label: label.trim() || 'Alarm',
      category,
      days: selectedDays.length > 0 ? selectedDays : [0, 1, 2, 3, 4, 5, 6],
      isEnabled: true,
      sound,
      volume,
      vibration: 'Basic call',
      snooze: '5 minutes, 3 times',
    });

    setLabel('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/85">
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View className="bg-[#12141D] border-t border-[#232736] rounded-t-[32px] max-h-[92%] pb-8 pt-3 px-6 shadow-2xl">
              
              {/* Samsung Bottom Sheet Drag Handle */}
              <View className="items-center mb-4">
                <View className="w-10 h-1.5 rounded-full bg-[#353A4D]" />
              </View>

              {/* Samsung Modal Header with Cancel and Save */}
              <View className="flex-row items-center justify-between mb-6">
                <TouchableOpacity onPress={onClose} className="py-1">
                  <Text className="text-base text-[#8E94A7] font-medium">Cancel</Text>
                </TouchableOpacity>

                <Text className="text-lg font-bold text-white">Add alarm</Text>

                <TouchableOpacity onPress={handleSave} className="py-1">
                  <Text className="text-base text-[#2C7BFE] font-bold">Save</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                
                {/* 1. SAMSUNG 3-WHEEL TIME PICKER */}
                <View className="bg-[#1A1D29] rounded-[24px] p-5 mb-5 items-center">
                  <Text className="text-xs uppercase tracking-wider text-[#7A8094] mb-4 font-medium">
                    Time
                  </Text>
                  
                  <View className="flex-row items-center justify-center space-x-4 gap-4">
                    
                    {/* Hour Stepper */}
                    <View className="items-center">
                      <TouchableOpacity
                        onPress={() => setSelectedHour((h) => (h === 12 ? 1 : h + 1))}
                        className="p-1"
                      >
                        <Text className="text-[#646A7E] text-xs">▲</Text>
                      </TouchableOpacity>
                      <Text className="text-5xl font-bold font-sans text-white tracking-tight my-1">
                        {selectedHour}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setSelectedHour((h) => (h === 1 ? 12 : h - 1))}
                        className="p-1"
                      >
                        <Text className="text-[#646A7E] text-xs">▼</Text>
                      </TouchableOpacity>
                    </View>

                    <Text className="text-3xl font-bold text-[#8E94A7] -mt-1">:</Text>

                    {/* Minute Stepper */}
                    <View className="items-center">
                      <TouchableOpacity
                        onPress={() => setSelectedMinute((m) => (m >= 55 ? 0 : m + 5))}
                        className="p-1"
                      >
                        <Text className="text-[#646A7E] text-xs">▲</Text>
                      </TouchableOpacity>
                      <Text className="text-5xl font-bold font-sans text-white tracking-tight my-1">
                        {selectedMinute.toString().padStart(2, '0')}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setSelectedMinute((m) => (m <= 0 ? 55 : m - 5))}
                        className="p-1"
                      >
                        <Text className="text-[#646A7E] text-xs">▼</Text>
                      </TouchableOpacity>
                    </View>

                    {/* AM / PM Segmented Selector (Samsung One UI) */}
                    <View className="ml-3 bg-[#252837] rounded-2xl p-1">
                      <TouchableOpacity
                        onPress={() => setPeriod('AM')}
                        className={`px-3.5 py-2 rounded-xl ${
                          period === 'AM' ? 'bg-[#2C7BFE]' : 'bg-transparent'
                        }`}
                      >
                        <Text
                          className={`text-xs font-bold ${
                            period === 'AM' ? 'text-white' : 'text-[#82889A]'
                          }`}
                        >
                          AM
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setPeriod('PM')}
                        className={`px-3.5 py-2 rounded-xl mt-1 ${
                          period === 'PM' ? 'bg-[#2C7BFE]' : 'bg-transparent'
                        }`}
                      >
                        <Text
                          className={`text-xs font-bold ${
                            period === 'PM' ? 'text-white' : 'text-[#82889A]'
                          }`}
                        >
                          PM
                        </Text>
                      </TouchableOpacity>
                    </View>

                  </View>
                </View>

                {/* 2. REPEAT DAY SELECTORS (Samsung 7-circle S M T W T F S) */}
                <View className="bg-[#1A1D29] rounded-[24px] p-4 mb-4">
                  <Text className="text-xs uppercase tracking-wider text-[#7A8094] mb-3 font-medium">
                    Repeat
                  </Text>
                  <View className="flex-row justify-between">
                    {SAMSUNG_DAYS.map((day) => {
                      const isSelected = selectedDays.includes(day.id);
                      return (
                        <TouchableOpacity
                          key={day.id}
                          onPress={() => toggleDay(day.id)}
                          className={`w-9 h-9 rounded-full items-center justify-center ${
                            isSelected ? 'bg-[#2C7BFE]' : 'bg-[#252837]'
                          }`}
                        >
                          <Text
                            className={`text-xs font-bold ${
                              isSelected ? 'text-white' : 'text-[#7D8294]'
                            }`}
                          >
                            {day.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 3. ALARM NAME (Samsung One UI text input row) */}
                <View className="bg-[#1A1D29] rounded-[24px] p-4 mb-4">
                  <Text className="text-xs uppercase tracking-wider text-[#7A8094] mb-2 font-medium">
                    Alarm name
                  </Text>
                  <TextInput
                    value={label}
                    onChangeText={setLabel}
                    placeholder="Morning Sunlight & Hydration"
                    placeholderTextColor="#5A6074"
                    className="text-white text-sm font-medium py-1"
                  />
                </View>

                {/* 4. ALARM SOUND (Samsung Tone Dropdown / Selector) */}
                <View className="bg-[#1A1D29] rounded-[24px] p-4 mb-4">
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-xs uppercase tracking-wider text-[#7A8094] font-medium">
                      Alarm sound
                    </Text>
                    <Text className="text-xs text-[#2C7BFE] font-medium">{sound}</Text>
                  </View>
                  <View className="bg-[#242737] rounded-xl overflow-hidden">
                    {SAMSUNG_SOUNDS.map((s) => (
                      <TouchableOpacity
                        key={s}
                        onPress={() => setSound(s)}
                        className={`p-3 flex-row justify-between items-center border-b border-[#2C3042] ${
                          sound === s ? 'bg-[#2C7BFE]/15' : ''
                        }`}
                      >
                        <Text
                          className={`text-xs ${
                            sound === s ? 'text-[#2C7BFE] font-bold' : 'text-[#C5C9D8]'
                          }`}
                        >
                          {s}
                        </Text>
                        {sound === s && (
                          <Text className="text-[#2C7BFE] text-xs font-bold">✓</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* 5. VIBRATION (Samsung Toggle) */}
                <View className="bg-[#1A1D29] rounded-[24px] p-4 mb-6 flex-row items-center justify-between">
                  <View>
                    <Text className="text-sm font-medium text-white">Vibration</Text>
                    <Text className="text-xs text-[#7A8094]">Basic call</Text>
                  </View>
                  <Switch
                    value={vibrationEnabled}
                    onValueChange={setVibrationEnabled}
                    trackColor={{ false: '#2E3240', true: '#2C7BFE' }}
                    thumbColor={vibrationEnabled ? '#FFFFFF' : '#8A8F9E'}
                  />
                </View>

                {/* Primary Save Button at Bottom */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleSave}
                  className="bg-[#2C7BFE] rounded-2xl py-4 items-center shadow-lg mb-4"
                >
                  <Text className="text-white font-bold text-base">
                    Save
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
