import './style.css';

// Web Audio API Synthesizer for tactile UI clicks
class AudioFeedback {
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
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(420, now + 0.05);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'tap') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }
}

const audio = new AudioFeedback();

// Pre-built Example Alarms
const DAYS_OF_WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

let alarms = [
  {
    id: 'alarm-1',
    time: '07:30',
    period: 'AM',
    label: 'Morning Sunlight & Hydration',
    category: 'Morning Routine',
    categoryClass: 'morning',
    days: [0, 1, 2, 3, 4, 5, 6], // Every day
    isEnabled: true,
    isExpanded: false,
    sound: 'Binaural Theta Wave (432Hz)',
    vibration: 'Gradual Escalation',
    snooze: '5 min',
  },
  {
    id: 'alarm-2',
    time: '01:30',
    period: 'PM',
    label: 'Afternoon Focus & Supplements',
    category: 'Deep Work',
    categoryClass: 'deep-work',
    days: [0, 1, 2, 3, 4], // Weekdays
    isEnabled: true,
    isExpanded: false,
    sound: 'Solar Flare Pulse',
    vibration: 'Double Pulse',
    snooze: 'Disabled',
  },
  {
    id: 'alarm-3',
    time: '10:15',
    period: 'PM',
    label: 'Cortisol Drop & Night Protocol',
    category: 'Recovery',
    categoryClass: 'recovery',
    days: [0, 1, 2, 3, 4, 5, 6], // Every day active
    isEnabled: false,
    isExpanded: false,
    sound: 'Subtle Dawn Harmonics',
    vibration: 'Gentle Ripple',
    snooze: 'Disabled',
  },
];

// Modal State
let newAlarmHour = 7;
let newAlarmMin = 30;
let newAlarmPeriod = 'AM';
let newAlarmCategory = 'Morning Routine';
let newAlarmDays = [0, 1, 2, 3, 4]; // default weekdays

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
  }, 2400);
}

// Update Header Meta
function updateHeaderMeta() {
  const activeCount = alarms.filter(a => a.isEnabled).length;
  const countTag = document.getElementById('active-alarms-count');
  const routineCount = document.getElementById('routine-count');
  const nextAlarmDisplay = document.getElementById('next-alarm-display');

  if (countTag) countTag.textContent = `${activeCount} Active`;
  if (routineCount) routineCount.textContent = `${alarms.length} Schedules`;

  if (nextAlarmDisplay) {
    if (activeCount === 0) {
      nextAlarmDisplay.textContent = 'All alarms paused';
    } else {
      nextAlarmDisplay.textContent = 'Next alarm in 4h 15m';
    }
  }
}

// Render Alarm Cards
function renderAlarmCards() {
  const container = document.getElementById('alarm-cards-list');
  if (!container) return;

  container.innerHTML = '';

  alarms.forEach((alarm) => {
    const card = document.createElement('article');
    card.className = `alarm-card ${alarm.isEnabled ? 'is-active' : 'is-inactive'} ${alarm.isExpanded ? 'is-expanded' : ''}`;
    card.dataset.id = alarm.id;

    // Render Days Pills
    const daysHtml = DAYS_OF_WEEK.map((dayLabel, index) => {
      const isHighlighted = alarm.days.includes(index);
      return `<span class="day-pill ${isHighlighted ? 'highlighted' : ''}">${dayLabel}</span>`;
    }).join('');

    card.innerHTML = `
      <div class="card-main-surface">
        
        <!-- Top Meta Row -->
        <div class="card-meta-row">
          <span class="category-tag ${alarm.categoryClass}">
            ${alarm.category}
          </span>
          ${
            alarm.isEnabled
              ? `<div class="active-pulse-indicator">
                  <span class="dot"></span>
                  <span>Active</span>
                 </div>`
              : ''
          }
        </div>

        <!-- Time & Toggle Row -->
        <div class="card-time-row">
          <div class="digital-time">
            <span>${alarm.time}</span>
            <span class="period">${alarm.period}</span>
          </div>

          <label class="switch-control" onclick="event.stopPropagation();">
            <input type="checkbox" ${alarm.isEnabled ? 'checked' : ''} class="alarm-toggle-input" data-id="${alarm.id}">
            <span class="slider round"></span>
          </label>
        </div>

        <!-- Label -->
        <div class="card-label">${alarm.label}</div>

        <!-- Footer Row -->
        <div class="card-footer-row">
          <div class="day-pills-group">
            ${daysHtml}
          </div>
          <div class="expand-hint-btn">
            <span>${alarm.isExpanded ? 'Collapse' : 'Edit'}</span>
            <span class="expand-chevron">▾</span>
          </div>
        </div>

      </div>

      <!-- Accordion Drawer (Tap to Edit Mode) -->
      <div class="card-expanded-drawer">
        <div class="drawer-inner">
          <div class="drawer-info-row">
            <span class="drawer-info-label">Acoustic Tone</span>
            <span class="drawer-info-value">${alarm.sound}</span>
          </div>
          <div class="drawer-info-row">
            <span class="drawer-info-label">Haptic Vibration</span>
            <span class="drawer-info-value" style="color: var(--emerald-light)">${alarm.vibration}</span>
          </div>
          <div class="drawer-info-row">
            <span class="drawer-info-label">Snooze Window</span>
            <span class="drawer-info-value">${alarm.snooze}</span>
          </div>
          <button class="delete-protocol-btn" data-delete-id="${alarm.id}">
            Delete Protocol
          </button>
        </div>
      </div>
    `;

    // Event: Tap Card to Expand
    const surface = card.querySelector('.card-main-surface');
    surface.addEventListener('click', () => {
      audio.playClick('tap');
      alarm.isExpanded = !alarm.isExpanded;
      renderAlarmCards();
    });

    // Event: Toggle Switch
    const toggleInput = card.querySelector('.alarm-toggle-input');
    toggleInput.addEventListener('change', (e) => {
      audio.playClick('toggle');
      alarm.isEnabled = e.target.checked;
      renderAlarmCards();
      updateHeaderMeta();
      showToast(`${alarm.label} is now ${alarm.isEnabled ? 'Active' : 'Paused'}`);
    });

    // Event: Delete Button inside drawer
    const deleteBtn = card.querySelector('.delete-protocol-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        audio.playClick('tap');
        alarms = alarms.filter(a => a.id !== alarm.id);
        renderAlarmCards();
        updateHeaderMeta();
        showToast('Protocol removed');
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

// Update Modal Time Display
function updateModalTimeDisplay() {
  const hourEl = document.getElementById('val-hour');
  const minEl = document.getElementById('val-min');
  if (hourEl) hourEl.textContent = newAlarmHour.toString().padStart(2, '0');
  if (minEl) minEl.textContent = newAlarmMin.toString().padStart(2, '0');

  const amBtn = document.getElementById('btn-period-am');
  const pmBtn = document.getElementById('btn-period-pm');
  if (amBtn && pmBtn) {
    amBtn.classList.toggle('active', newAlarmPeriod === 'AM');
    pmBtn.classList.toggle('active', newAlarmPeriod === 'PM');
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Top right "+" button to open modal
  const openModalBtn = document.getElementById('btn-open-create-modal');
  if (openModalBtn) {
    openModalBtn.addEventListener('click', openCreateModal);
  }

  // Close modal button
  const closeModalBtn = document.getElementById('btn-close-modal');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeCreateModal);
  }

  // Backdrop click to close modal
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
    updateModalTimeDisplay();
  });
  document.getElementById('btn-hour-down')?.addEventListener('click', () => {
    audio.playClick('tap');
    newAlarmHour = newAlarmHour <= 1 ? 12 : newAlarmHour - 1;
    updateModalTimeDisplay();
  });

  document.getElementById('btn-min-up')?.addEventListener('click', () => {
    audio.playClick('tap');
    newAlarmMin = newAlarmMin >= 55 ? 0 : newAlarmMin + 5;
    updateModalTimeDisplay();
  });
  document.getElementById('btn-min-down')?.addEventListener('click', () => {
    audio.playClick('tap');
    newAlarmMin = newAlarmMin <= 0 ? 55 : newAlarmMin - 5;
    updateModalTimeDisplay();
  });

  // AM/PM buttons
  document.getElementById('btn-period-am')?.addEventListener('click', () => {
    audio.playClick('tap');
    newAlarmPeriod = 'AM';
    updateModalTimeDisplay();
  });
  document.getElementById('btn-period-pm')?.addEventListener('click', () => {
    audio.playClick('tap');
    newAlarmPeriod = 'PM';
    updateModalTimeDisplay();
  });

  // Category Pills in Modal
  const categoryPills = document.querySelectorAll('.cat-pill');
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      audio.playClick('tap');
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      newAlarmCategory = pill.dataset.cat;
    });
  });

  // Repeat Day Buttons in Modal
  const dayBtns = document.querySelectorAll('.day-select-btn');
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

      // Update summary text
      const summary = document.getElementById('repeat-summary');
      if (summary) {
        if (newAlarmDays.length === 7) summary.textContent = 'Every day';
        else if (newAlarmDays.length === 5 && !newAlarmDays.includes(5) && !newAlarmDays.includes(6)) summary.textContent = 'Weekdays';
        else if (newAlarmDays.length === 2 && newAlarmDays.includes(5) && newAlarmDays.includes(6)) summary.textContent = 'Weekends';
        else if (newAlarmDays.length === 0) summary.textContent = 'Never';
        else summary.textContent = `${newAlarmDays.length} days / wk`;
      }
    });
  });

  // Save Alarm CTA
  const saveBtn = document.getElementById('btn-save-alarm');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const nameInput = document.getElementById('input-alarm-name');
      const toneSelect = document.getElementById('select-alarm-tone');
      const vibrationToggle = document.getElementById('modal-vibration-toggle');

      const label = (nameInput?.value.trim()) || 'Circadian Focus Protocol';
      const sound = toneSelect?.value || 'Binaural Theta Wave (432Hz)';
      const vibration = vibrationToggle?.checked ? 'Gradual Escalation' : 'Off';

      let catClass = 'morning';
      if (newAlarmCategory === 'Deep Work') catClass = 'deep-work';
      else if (newAlarmCategory === 'Recovery') catClass = 'recovery';
      else if (newAlarmCategory === 'Circadian Sync') catClass = 'circadian';

      const newAlarm = {
        id: `alarm-${Date.now()}`,
        time: `${newAlarmHour.toString().padStart(2, '0')}:${newAlarmMin.toString().padStart(2, '0')}`,
        period: newAlarmPeriod,
        label,
        category: newAlarmCategory,
        categoryClass: catClass,
        days: newAlarmDays.length > 0 ? [...newAlarmDays] : [0, 1, 2, 3, 4, 5, 6],
        isEnabled: true,
        isExpanded: false,
        sound,
        vibration,
        snooze: '5 min',
      };

      alarms.unshift(newAlarm);
      audio.playClick('success');
      renderAlarmCards();
      updateHeaderMeta();
      closeCreateModal();
      showToast(`Added: ${label} (${newAlarm.time} ${newAlarm.period})`);

      // Reset name input
      if (nameInput) nameInput.value = '';
    });
  }

  // Frame Mode Toggle (Responsive Fit vs Phone Frame)
  const toggleFrameBtn = document.getElementById('toggle-frame-mode');
  if (toggleFrameBtn) {
    toggleFrameBtn.addEventListener('click', () => {
      document.body.classList.toggle('fullscreen-mode');
      const isFullscreen = document.body.classList.contains('fullscreen-mode');
      document.getElementById('frame-mode-text').textContent = isFullscreen ? 'Mobile Frame View' : 'Fit Screen View';
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
      document.getElementById('audio-status-text').textContent = audio.enabled ? 'Haptic Sound ON' : 'Haptic Sound OFF';
      audio.playClick('tap');
    });
  }
}

// React Native Code Tabs Viewer
const CODE_SNIPPETS = {
  screen: `// react-native/src/screens/AlarmScreen.tsx
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import { INITIAL_ALARMS } from '../data/mockAlarms';
import { AlarmItem } from '../types/alarm';
import { AlarmCard } from '../components/AlarmCard';
import { CreateAlarmModal } from '../components/CreateAlarmModal';

export const AlarmScreen: React.FC = () => {
  const [alarms, setAlarms] = useState<AlarmItem[]>(INITIAL_ALARMS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleAlarm = (id: string, isEnabled: boolean) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, isEnabled } : a));
  };

  const handleSaveNewAlarm = (newAlarmData: Omit<AlarmItem, 'id'>) => {
    const newAlarm: AlarmItem = { ...newAlarmData, id: \`alarm-\${Date.now()}\` };
    setAlarms(prev => [...prev, newAlarm]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#090D14]">
      <StatusBar barStyle="light-content" backgroundColor="#090D14" />
      <View className="flex-1 px-5 pt-3">
        {/* Header Area */}
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-2xl font-bold tracking-tight text-white">Daily Rhythm & Alarms</Text>
            <View className="flex-row items-center space-x-2 gap-2 mt-1.5">
              <View className="flex-row items-center px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25">
                <View className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                <Text className="text-xs font-medium text-emerald-400 font-mono">Next alarm in 4h 15m</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={() => setIsModalOpen(true)} className="w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700 items-center justify-center">
            <Text className="text-white text-2xl font-light">+</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Cards */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {alarms.map(alarm => (
            <AlarmCard key={alarm.id} alarm={alarm} onToggle={handleToggleAlarm} />
          ))}
        </ScrollView>
      </View>
      <CreateAlarmModal visible={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveNewAlarm} />
    </SafeAreaView>
  );
};`,

  card: `// react-native/src/components/AlarmCard.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { AlarmItem } from '../types/alarm';
import { DayPills } from './DayPills';

export const AlarmCard: React.FC<{ alarm: AlarmItem; onToggle: (id: string, val: boolean) => void }> = ({ alarm, onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View className={\`rounded-2xl mb-4 border transition-all \${alarm.isEnabled ? 'bg-slate-900/90 border-slate-700/80 shadow-lg' : 'bg-slate-900/40 border-slate-800/40 opacity-75'}\`}>
      {alarm.isEnabled && <View className="h-0.5 w-full bg-gradient-to-r from-emerald-500/60 to-transparent rounded-t-2xl" />}
      <TouchableOpacity activeOpacity={0.88} onPress={() => setIsExpanded(!isExpanded)} className="p-5">
        <View className="flex-row items-center justify-between mb-3">
          <View className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <Text className="text-xs font-medium text-emerald-400">{alarm.category}</Text>
          </View>
        </View>
        <View className="flex-row items-baseline justify-between mb-2">
          <View className="flex-row items-baseline">
            <Text className={\`text-4xl font-bold \${alarm.isEnabled ? 'text-white' : 'text-slate-500'}\`}>{alarm.time.split(' ')[0]}</Text>
            <Text className={\`text-sm font-semibold ml-1.5 \${alarm.isEnabled ? 'text-emerald-400' : 'text-slate-600'}\`}>{alarm.time.split(' ')[1]}</Text>
          </View>
          <Switch value={alarm.isEnabled} onValueChange={v => onToggle(alarm.id, v)} trackColor={{ false: '#1e293b', true: '#10b981' }} thumbColor={alarm.isEnabled ? '#ffffff' : '#64748b'} />
        </View>
        <Text className={\`text-sm font-medium mb-3.5 \${alarm.isEnabled ? 'text-slate-200' : 'text-slate-500'}\`}>{alarm.label}</Text>
        <DayPills selectedDays={alarm.days} isAlarmEnabled={alarm.isEnabled} />
      </TouchableOpacity>
    </View>
  );
};`,

  modal: `// react-native/src/components/CreateAlarmModal.tsx
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { AlarmItem, DAYS_OF_WEEK } from '../types/alarm';

export const CreateAlarmModal: React.FC<{ visible: boolean; onClose: () => void; onSave: (alarm: Omit<AlarmItem, 'id'>) => void }> = ({ visible, onClose, onSave }) => {
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(30);
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [label, setLabel] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/80">
        <View className="bg-slate-900 border-t border-slate-800 rounded-t-3xl max-h-[90%] pb-8 pt-3 px-6">
          <View className="items-center mb-4"><View className="w-12 h-1.5 rounded-full bg-slate-700/60" /></View>
          <Text className="text-xl font-bold text-white mb-4">Create New Alarm</Text>
          <TextInput value={label} onChangeText={setLabel} placeholder="Alarm Name / Purpose" placeholderTextColor="#64748b" className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 mb-4" />
          <TouchableOpacity onPress={() => onSave({ time: \`\${hour}:\${minute} \${period}\`, hour, minute, period, label: label || 'Protocol', category: 'Morning Routine', days: selectedDays, isEnabled: true, sound: 'Binaural Theta Wave', vibration: true })} className="bg-emerald-500 rounded-xl py-4 items-center">
            <Text className="text-black font-bold text-base">Save Alarm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};`,

  pills: `// react-native/src/components/DayPills.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { DAYS_OF_WEEK } from '../types/alarm';

export const DayPills: React.FC<{ selectedDays: number[]; isAlarmEnabled?: boolean }> = ({ selectedDays, isAlarmEnabled = true }) => (
  <View className="flex-row items-center space-x-1.5 gap-1.5">
    {DAYS_OF_WEEK.map(day => {
      const isSelected = selectedDays.includes(day.id);
      const bg = isSelected ? (isAlarmEnabled ? 'bg-emerald-500/15 border-emerald-500/40' : 'bg-slate-800 border-slate-700') : 'bg-slate-800/40 border-slate-700/40';
      const text = isSelected ? (isAlarmEnabled ? 'text-emerald-400 font-semibold' : 'text-slate-400') : 'text-slate-500';
      return (
        <View key={day.id} className={\`w-6 h-6 rounded-full items-center justify-center border \${bg}\`}>
          <Text className={\`text-[11px] \${text}\`}>{day.label}</Text>
        </View>
      );
    })}
  </View>
);`,

  types: `// react-native/src/types/alarm.ts
export type AlarmCategory = 'Morning Routine' | 'Deep Work' | 'Recovery' | 'Circadian Sync' | 'Mindfulness';

export interface AlarmItem {
  id: string;
  time: string; // e.g. "07:30 AM"
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
  label: string;
  category: AlarmCategory;
  days: number[]; // 0 = Mon, ..., 6 = Sun
  isEnabled: boolean;
  sound: string;
  vibration: boolean;
  snoozeEnabled?: boolean;
}

export const DAYS_OF_WEEK = [
  { id: 0, label: 'M', full: 'Mon' },
  { id: 1, label: 'T', full: 'Tue' },
  { id: 2, label: 'W', full: 'Wed' },
  { id: 3, label: 'T', full: 'Thu' },
  { id: 4, label: 'F', full: 'Fri' },
  { id: 5, label: 'S', full: 'Sat' },
  { id: 6, label: 'S', full: 'Sun' },
];`,
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
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    clock.textContent = `${hours}:${minutes}`;
  }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  renderAlarmCards();
  updateHeaderMeta();
  setupEventListeners();
  setupCodeTabs();
  updateClock();
  setInterval(updateClock, 30000);

  // Check URL parameters for preview states
  const params = new URLSearchParams(window.location.search);
  if (params.get('openModal') === 'true') {
    openCreateModal();
  }
  if (params.get('expandCard')) {
    const idx = parseInt(params.get('expandCard'), 10);
    if (alarms[idx]) {
      alarms[idx].isExpanded = true;
      renderAlarmCards();
    }
  }
});
