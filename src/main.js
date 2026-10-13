import './style.css';

// Web Audio API Synthesizer with Samsung Galaxy Tactile UI Click
class SamsungAudioFeedback {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playClick(type = 'toggle') {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const now = this.ctx.currentTime;

      if (type === 'toggle') {
        // Samsung soft tactile switch pop
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'tap') {
        // Samsung subtle button tap
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.03);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      } else if (type === 'save') {
        // Samsung chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880.00, now + 0.06); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }
}

const audio = new SamsungAudioFeedback();

// Samsung Days sequence: Sunday through Saturday
const SAMSUNG_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// 3 Pre-built Samsung Alarms
let alarms = [
  {
    id: 'alarm-1',
    time: '7:30',
    period: 'AM',
    hour: 7,
    minute: 30,
    label: 'Morning Sunlight & Hydration',
    category: 'Morning Routine',
    days: [0, 1, 2, 3, 4, 5, 6], // Every day (Sun - Sat)
    isEnabled: true,
    isExpanded: false,
    sound: 'Morning Flower',
    vibration: 'Basic call',
    snooze: '5 minutes, 3 times',
  },
  {
    id: 'alarm-2',
    time: '1:30',
    period: 'PM',
    hour: 1,
    minute: 30,
    label: 'Afternoon Focus & Supplements',
    category: 'Deep Work',
    days: [1, 2, 3, 4, 5], // Mon - Fri (Weekdays)
    isEnabled: true,
    isExpanded: false,
    sound: 'Over the Horizon (Samsung Brand)',
    vibration: 'Heartbeat',
    snooze: '5 minutes, 3 times',
  },
  {
    id: 'alarm-3',
    time: '10:15',
    period: 'PM',
    hour: 10,
    minute: 15,
    label: 'Cortisol Drop & Night Protocol',
    category: 'Recovery',
    days: [0, 1, 2, 3, 4, 5, 6], // Every day
    isEnabled: false,
    isExpanded: false,
    sound: 'Homecoming',
    vibration: 'Ticktock',
    snooze: 'Off',
  },
];

// Modal State
let newAlarmHour = 7;
let newAlarmMin = 30;
let newAlarmPeriod = 'AM';
let newAlarmDays = [1, 2, 3, 4, 5]; // default weekdays

// Toast Helper
function showToast(message) {
  let toast = document.querySelector('.toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

// Update Header Subtitle
function updateHeaderSubtitle() {
  const activeCount = alarms.filter(a => a.isEnabled).length;
  const subtitleEl = document.getElementById('samsung-alarm-subtitle');
  if (subtitleEl) {
    if (activeCount === 0) {
      subtitleEl.textContent = 'All alarms off';
    } else {
      subtitleEl.textContent = 'Next alarm in 4 hours 15 minutes';
    }
  }
}

// Render Samsung Alarm Cards
function renderSamsungAlarmCards() {
  const container = document.getElementById('alarm-cards-list');
  if (!container) return;

  container.innerHTML = '';

  alarms.forEach((alarm) => {
    const card = document.createElement('article');
    card.className = `samsung-card ${alarm.isEnabled ? 'is-active' : 'is-inactive'} ${alarm.isExpanded ? 'is-expanded' : ''}`;
    card.dataset.id = alarm.id;

    // Render Samsung Day Chips (S M T W T F S)
    const daysHtml = SAMSUNG_DAYS.map((dayLabel, index) => {
      const isSelected = alarm.days.includes(index);
      return `<span class="samsung-day-chip ${isSelected ? 'active' : ''}">${dayLabel}</span>`;
    }).join('');

    card.innerHTML = `
      <div class="samsung-card-inner">
        <!-- Left: Time, Label, Days -->
        <div class="card-left-info">
          <div class="samsung-time-row">
            <span class="samsung-time-digits">${alarm.time}</span>
            <span class="samsung-time-period">${alarm.period}</span>
          </div>

          <div class="samsung-card-label">${alarm.label}</div>

          <div class="samsung-days-row">
            ${daysHtml}
          </div>
        </div>

        <!-- Right: Samsung One UI Switch -->
        <label class="samsung-switch" onclick="event.stopPropagation();">
          <input type="checkbox" ${alarm.isEnabled ? 'checked' : ''} class="alarm-toggle-input" data-id="${alarm.id}">
          <span class="samsung-switch-track"></span>
        </label>
      </div>

      <!-- Samsung Accordion Drawer (Tap to Edit Mode) -->
      <div class="samsung-card-drawer">
        <div class="samsung-drawer-inner">
          <div class="drawer-row">
            <span class="drawer-row-label">Alarm sound</span>
            <span class="drawer-row-val">${alarm.sound}</span>
          </div>
          <div class="drawer-row">
            <span class="drawer-row-label">Vibration</span>
            <span class="drawer-row-val accent">${alarm.vibration}</span>
          </div>
          <div class="drawer-row">
            <span class="drawer-row-label">Snooze</span>
            <span class="drawer-row-val">${alarm.snooze}</span>
          </div>
          <button class="samsung-delete-btn" data-delete-id="${alarm.id}">
            Delete
          </button>
        </div>
      </div>
    `;

    // Event: Tap Card to Expand
    const inner = card.querySelector('.samsung-card-inner');
    inner.addEventListener('click', () => {
      audio.playClick('tap');
      alarm.isExpanded = !alarm.isExpanded;
      renderSamsungAlarmCards();
    });

    // Event: Toggle Switch
    const toggleInput = card.querySelector('.alarm-toggle-input');
    toggleInput.addEventListener('change', (e) => {
      audio.playClick('toggle');
      alarm.isEnabled = e.target.checked;
      renderSamsungAlarmCards();
      updateHeaderSubtitle();
      showToast(`${alarm.label} is now ${alarm.isEnabled ? 'On' : 'Off'}`);
    });

    // Event: Delete
    const deleteBtn = card.querySelector('.samsung-delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        audio.playClick('tap');
        alarms = alarms.filter(a => a.id !== alarm.id);
        renderSamsungAlarmCards();
        updateHeaderSubtitle();
        showToast('Alarm deleted');
      });
    }

    container.appendChild(card);
  });
}

// Modal Control Functions
function openCreateModal() {
  audio.playClick('tap');
  const modal = document.getElementById('modal-backdrop');
  if (modal) modal.classList.add('is-open');
}

function closeCreateModal() {
  audio.playClick('tap');
  const modal = document.getElementById('modal-backdrop');
  if (modal) modal.classList.remove('is-open');
}

// Update Modal 3-Wheel Time Display
function updateModalWheelDisplay() {
  const hourEl = document.getElementById('val-hour');
  const minEl = document.getElementById('val-min');
  const hPrev = document.getElementById('h-prev');
  const hNext = document.getElementById('h-next');
  const mPrev = document.getElementById('m-prev');
  const mNext = document.getElementById('m-next');

  if (hourEl) hourEl.textContent = newAlarmHour.toString().padStart(2, '0');
  if (minEl) minEl.textContent = newAlarmMin.toString().padStart(2, '0');

  // Preview digits above and below (Samsung wheel effect)
  const prevH = newAlarmHour === 1 ? 12 : newAlarmHour - 1;
  const nextH = newAlarmHour === 12 ? 1 : newAlarmHour + 1;
  if (hPrev) hPrev.textContent = prevH.toString().padStart(2, '0');
  if (hNext) hNext.textContent = nextH.toString().padStart(2, '0');

  const prevM = (newAlarmMin - 5 + 60) % 60;
  const nextM = (newAlarmMin + 5) % 60;
  if (mPrev) mPrev.textContent = prevM.toString().padStart(2, '0');
  if (mNext) mNext.textContent = nextM.toString().padStart(2, '0');

  const amBtn = document.getElementById('btn-period-am');
  const pmBtn = document.getElementById('btn-period-pm');
  if (amBtn && pmBtn) {
    amBtn.classList.toggle('active', newAlarmPeriod === 'AM');
    pmBtn.classList.toggle('active', newAlarmPeriod === 'PM');
  }
}

// Save Alarm Handler
function saveAlarmAction() {
  const nameInput = document.getElementById('input-alarm-name');
  const toneSelect = document.getElementById('select-alarm-tone');
  const vibrationToggle = document.getElementById('modal-vibration-toggle');

  const label = (nameInput?.value.trim()) || 'Alarm';
  const sound = toneSelect?.value || 'Over the Horizon (Samsung Brand)';
  const vibration = vibrationToggle?.checked ? 'Basic call' : 'Off';

  const newAlarm = {
    id: `alarm-${Date.now()}`,
    time: `${newAlarmHour}:${newAlarmMin.toString().padStart(2, '0')}`,
    period: newAlarmPeriod,
    hour: newAlarmHour,
    minute: newAlarmMin,
    label,
    category: 'Morning Routine',
    days: newAlarmDays.length > 0 ? [...newAlarmDays] : [0, 1, 2, 3, 4, 5, 6],
    isEnabled: true,
    isExpanded: false,
    sound,
    vibration,
    snooze: '5 minutes, 3 times',
  };

  alarms.unshift(newAlarm);
  audio.playClick('save');
  renderSamsungAlarmCards();
  updateHeaderSubtitle();
  closeCreateModal();
  showToast(`Alarm saved: ${newAlarm.time} ${newAlarm.period}`);

  if (nameInput) nameInput.value = '';
}

// Setup Event Listeners
function setupEventListeners() {
  // Top right "+" button
  document.getElementById('btn-open-create-modal')?.addEventListener('click', openCreateModal);

  // Close modal button (Cancel on header)
  document.getElementById('btn-close-modal')?.addEventListener('click', closeCreateModal);

  // Backdrop click to close
  const modalBackdrop = document.getElementById('modal-backdrop');
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeCreateModal();
    });
  }

  // Steppers for hour & min
  document.getElementById('btn-hour-up')?.addEventListener('click', () => {
    audio.playClick('tap');
    newAlarmHour = newAlarmHour >= 12 ? 1 : newAlarmHour + 1;
    updateModalWheelDisplay();
  });
  document.getElementById('btn-hour-down')?.addEventListener('click', () => {
    audio.playClick('tap');
    newAlarmHour = newAlarmHour <= 1 ? 12 : newAlarmHour - 1;
    updateModalWheelDisplay();
  });

  document.getElementById('btn-min-up')?.addEventListener('click', () => {
    audio.playClick('tap');
    newAlarmMin = newAlarmMin >= 55 ? 0 : newAlarmMin + 5;
    updateModalWheelDisplay();
  });
  document.getElementById('btn-min-down')?.addEventListener('click', () => {
    audio.playClick('tap');
    newAlarmMin = newAlarmMin <= 0 ? 55 : newAlarmMin - 5;
    updateModalWheelDisplay();
  });

  // AM/PM buttons
  document.getElementById('btn-period-am')?.addEventListener('click', () => {
    audio.playClick('tap');
    newAlarmPeriod = 'AM';
    updateModalWheelDisplay();
  });
  document.getElementById('btn-period-pm')?.addEventListener('click', () => {
    audio.playClick('tap');
    newAlarmPeriod = 'PM';
    updateModalWheelDisplay();
  });

  // Repeat Day Buttons in Modal (S M T W T F S)
  const dayBtns = document.querySelectorAll('.samsung-day-btn');
  dayBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      audio.playClick('tap');
      const dayId = parseInt(btn.dataset.day, 10);
      if (newAlarmDays.includes(dayId)) {
        newAlarmDays = newAlarmDays.filter(d => d !== dayId);
        btn.classList.remove('active');
      } else {
        newAlarmDays.push(dayId);
        newAlarmDays.sort((a, b) => a - b);
        btn.classList.add('active');
      }

      // Update Samsung summary text
      const summary = document.getElementById('repeat-summary');
      if (summary) {
        if (newAlarmDays.length === 7) summary.textContent = 'Every day';
        else if (newAlarmDays.length === 5 && !newAlarmDays.includes(0) && !newAlarmDays.includes(6)) summary.textContent = 'Every weekday';
        else if (newAlarmDays.length === 2 && newAlarmDays.includes(0) && newAlarmDays.includes(6)) summary.textContent = 'Weekends';
        else if (newAlarmDays.length === 0) summary.textContent = 'Never';
        else summary.textContent = `${newAlarmDays.length} days selected`;
      }
    });
  });

  // Sound select listener
  const soundSelect = document.getElementById('select-alarm-tone');
  soundSelect?.addEventListener('change', (e) => {
    const label = document.getElementById('selected-sound-name');
    if (label) label.textContent = e.target.value.split(' ')[0];
  });

  // Save Buttons (Both Header & Bottom)
  document.getElementById('btn-save-alarm')?.addEventListener('click', saveAlarmAction);
  document.getElementById('btn-save-alarm-header')?.addEventListener('click', saveAlarmAction);

  // Samsung Bottom Tabs
  const bottomTabs = document.querySelectorAll('.samsung-tab-item');
  bottomTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      audio.playClick('tap');
      bottomTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      showToast(`Switched to ${tab.dataset.tab}`);
    });
  });

  // Samsung Theme Color Toggle: Samsung Blue (#2C7BFE) vs Samsung Clock Orange (#FF7700)
  const colorToggle = document.getElementById('toggle-color-theme');
  if (colorToggle) {
    colorToggle.addEventListener('click', () => {
      audio.playClick('tap');
      document.body.classList.toggle('theme-samsung-orange');
      const isOrange = document.body.classList.contains('theme-samsung-orange');
      document.getElementById('theme-color-label').textContent = isOrange ? 'Samsung Orange' : 'Samsung Blue';
    });
  }

  // Frame Mode Toggle
  const toggleFrameBtn = document.getElementById('toggle-frame-mode');
  if (toggleFrameBtn) {
    toggleFrameBtn.addEventListener('click', () => {
      document.body.classList.toggle('fullscreen-mode');
      const isFullscreen = document.body.classList.contains('fullscreen-mode');
      document.getElementById('frame-mode-text').textContent = isFullscreen ? 'Samsung Frame View' : 'Fit Screen View';
      document.getElementById('frame-mode-icon').textContent = isFullscreen ? '💻' : '📱';
      audio.playClick('tap');
    });
  }

  // Audio Toggle
  const audioToggle = document.getElementById('audio-feedback-toggle');
  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      audio.enabled = !audio.enabled;
      audioToggle.classList.toggle('active', audio.enabled);
      document.getElementById('audio-status-text').textContent = audio.enabled ? 'Galaxy Sound ON' : 'Galaxy Sound OFF';
      audio.playClick('tap');
    });
  }
}

// Code Tabs Viewer
const CODE_SNIPPETS = {
  screen: `// react-native/src/screens/AlarmScreen.tsx (Samsung One UI 6 / 7)
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import { INITIAL_ALARMS } from '../data/mockAlarms';
import { AlarmItem } from '../types/alarm';
import { AlarmCard } from '../components/AlarmCard';
import { CreateAlarmModal } from '../components/CreateAlarmModal';
import { SamsungBottomNav } from '../components/BottomNav';

export const AlarmScreen: React.FC = () => {
  const [alarms, setAlarms] = useState<AlarmItem[]>(INITIAL_ALARMS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleAlarm = (id: string, isEnabled: boolean) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, isEnabled } : a));
  };

  return (
    <SafeAreaView className="flex-1 bg-[#000000]">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View className="flex-1">
        {/* Samsung Top Action Bar */}
        <View className="flex-row items-center justify-between px-6 pt-3 pb-2">
          <View />
          <View className="flex-row items-center space-x-5 gap-5">
            <TouchableOpacity><Text className="text-xl text-[#9EA3B5]">🔍</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setIsModalOpen(true)}><Text className="text-2xl font-light text-white leading-none">+</Text></TouchableOpacity>
            <TouchableOpacity><Text className="text-xl text-[#9EA3B5] font-bold">⋮</Text></TouchableOpacity>
          </View>
        </View>

        {/* Samsung One UI Header */}
        <View className="px-6 pt-2 pb-6">
          <Text className="text-3xl font-bold tracking-tight text-white font-sans">Alarm</Text>
          <Text className="text-sm text-[#8D92A4] mt-1 font-normal">Next alarm in 4 hours 15 minutes</Text>
        </View>

        {/* Alarm Cards List */}
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4">
          {alarms.map(alarm => (
            <AlarmCard key={alarm.id} alarm={alarm} onToggle={handleToggleAlarm} />
          ))}
        </ScrollView>

        {/* Samsung Bottom Navigation Bar (4 Tabs) */}
        <SamsungBottomNav activeTab="Alarm" />
      </View>
      <CreateAlarmModal visible={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={a => setAlarms([ { ...a, id: \`alarm-\${Date.now()}\` }, ...alarms ])} />
    </SafeAreaView>
  );
};`,

  card: `// react-native/src/components/AlarmCard.tsx (Samsung One UI 6 / 7)
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { AlarmItem } from '../types/alarm';
import { DayPills } from './DayPills';

export const AlarmCard: React.FC<{ alarm: AlarmItem; onToggle: (id: string, val: boolean) => void }> = ({ alarm, onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View className={\`rounded-[26px] mb-3.5 transition-all overflow-hidden \${alarm.isEnabled ? 'bg-[#1C1F2B] border border-[#272B3B]' : 'bg-[#14161F] border border-[#1A1C25] opacity-70'}\`}>
      <TouchableOpacity activeOpacity={0.88} onPress={() => setIsExpanded(!isExpanded)} className="p-5">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <View className="flex-row items-baseline mb-1">
              <Text className={\`text-4xl font-bold font-sans tracking-tight \${alarm.isEnabled ? 'text-white' : 'text-[#6C7182]'}\`}>{alarm.time}</Text>
              <Text className={\`text-sm font-semibold ml-2 uppercase \${alarm.isEnabled ? 'text-[#2C7BFE]' : 'text-[#4B5061]'}\`}>{alarm.period}</Text>
            </View>
            <Text className={\`text-sm mb-3.5 font-normal \${alarm.isEnabled ? 'text-[#CBD0DF]' : 'text-[#5B6070]'}\`}>{alarm.label}</Text>
            <DayPills selectedDays={alarm.days} isAlarmEnabled={alarm.isEnabled} />
          </View>
          <Switch value={alarm.isEnabled} onValueChange={v => onToggle(alarm.id, v)} trackColor={{ false: '#2E3240', true: '#2C7BFE' }} thumbColor={alarm.isEnabled ? '#FFFFFF' : '#8A8F9E'} />
        </View>
      </TouchableOpacity>
    </View>
  );
};`,

  modal: `// react-native/src/components/CreateAlarmModal.tsx (Samsung 3-Wheel Picker)
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { AlarmItem, SAMSUNG_DAYS, SAMSUNG_SOUNDS } from '../types/alarm';

export const CreateAlarmModal: React.FC<{ visible: boolean; onClose: () => void; onSave: (alarm: Omit<AlarmItem, 'id'>) => void }> = ({ visible, onClose, onSave }) => {
  const [selectedHour, setSelectedHour] = useState(7);
  const [selectedMinute, setSelectedMinute] = useState(30);
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [label, setLabel] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/85">
        <View className="bg-[#12141D] border-t border-[#232736] rounded-t-[32px] max-h-[92%] pb-8 pt-3 px-6">
          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity onPress={onClose}><Text className="text-base text-[#8E94A7]">Cancel</Text></TouchableOpacity>
            <Text className="text-lg font-bold text-white">Add alarm</Text>
            <TouchableOpacity onPress={() => onSave({ time: \`\${selectedHour}:\${selectedMinute.toString().padStart(2, '0')}\`, period, hour: selectedHour, minute: selectedMinute, label: label || 'Alarm', category: 'Morning Routine', days: selectedDays, isEnabled: true, sound: 'Morning Flower', volume: 80, vibration: 'Basic call', snooze: '5 min' })}><Text className="text-base text-[#2C7BFE] font-bold">Save</Text></TouchableOpacity>
          </View>
          {/* Samsung 3-Wheel Time Picker */}
          <View className="bg-[#1A1D29] rounded-[24px] p-5 mb-5 items-center">
            <Text className="text-5xl font-bold text-white">{selectedHour} : {selectedMinute.toString().padStart(2, '0')} {period}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};`,

  nav: `// react-native/src/components/BottomNav.tsx (Samsung 4 Tabs)
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export const SamsungBottomNav: React.FC<{ activeTab?: string }> = ({ activeTab = 'Alarm' }) => {
  const tabs = [
    { id: 'Alarm', label: 'Alarm', icon: '⏰' },
    { id: 'WorldClock', label: 'World clock', icon: '🌐' },
    { id: 'Stopwatch', label: 'Stopwatch', icon: '⏱️' },
    { id: 'Timer', label: 'Timer', icon: '⏳' },
  ];

  return (
    <View className="flex-row items-center justify-around py-3.5 bg-[#0C0E14] border-t border-[#1C1F2B]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity key={tab.id} className="items-center justify-center flex-1">
            <Text className="text-lg mb-1">{tab.icon}</Text>
            <Text className={\`text-[11px] \${isActive ? 'text-[#2C7BFE] font-bold' : 'text-[#6F7485]'}\`}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};`,

  flutter: `// flutter/lib/alarm_screen.dart (Samsung One UI 6 / 7 for Flutter)
import 'package:flutter/material.dart';

class SamsungAlarmScreen extends StatefulWidget {
  const SamsungAlarmScreen({Key? key}) : super(key: key);
  @override
  State<SamsungAlarmScreen> createState() => _SamsungAlarmScreenState();
}

class _SamsungAlarmScreenState extends State<SamsungAlarmScreen> {
  static const Color samsungBlue = Color(0xFF2C7BFE);
  static const Color samsungBgBlack = Color(0xFF000000);
  static const Color samsungCardBg = Color(0xFF1C1F2B);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: samsungBgBlack,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Samsung Top Action Bar
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                IconButton(icon: const Icon(Icons.search, color: Color(0xFF9EA3B5)), onPressed: () {}),
                IconButton(icon: const Icon(Icons.add, color: Colors.white), onPressed: () {}),
                IconButton(icon: const Icon(Icons.more_vert, color: Color(0xFF9EA3B5)), onPressed: () {}),
              ],
            ),
            // Large Samsung Header
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 24.0),
              child: Text('Alarm', style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold)),
            ),
            // Alarm list and bottom navigation...
          ],
        ),
      ),
    );
  }
}`,
};

function setupCodeTabs() {
  const codeDisplay = document.getElementById('code-display');
  const tabs = document.querySelectorAll('.tab-btn');

  function renderTab(tabKey) {
    if (codeDisplay && CODE_SNIPPETS[tabKey]) {
      codeDisplay.textContent = CODE_SNIPPETS[tabKey];
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      audio.playClick('tap');
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderTab(tab.dataset.tab);
    });
  });

  renderTab('screen');
}

// Live Clock for Phone Status Bar
function updateClock() {
  const clock = document.getElementById('status-clock');
  if (clock) {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    clock.textContent = `${hours}:${minutes}`;
  }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  renderSamsungAlarmCards();
  updateHeaderSubtitle();
  setupEventListeners();
  setupCodeTabs();
  updateClock();
  setInterval(updateClock, 30000);

  // Check URL parameters for preview states
  const params = new URLSearchParams(window.location.search);
  if (params.get('openModal') === 'true') {
    openCreateModal();
    updateModalWheelDisplay();
  }
  if (params.get('expandCard')) {
    const idx = parseInt(params.get('expandCard'), 10);
    if (alarms[idx]) {
      alarms[idx].isExpanded = true;
      renderSamsungAlarmCards();
    }
  }
  if (params.get('theme') === 'orange') {
    document.body.classList.add('theme-samsung-orange');
    const label = document.getElementById('theme-color-label');
    if (label) label.textContent = 'Samsung Orange';
  }
});
