import { AlarmItem } from '../types/alarm';

export const INITIAL_ALARMS: AlarmItem[] = [
  {
    id: 'alarm-1',
    time: '07:30 AM',
    hour: 7,
    minute: 30,
    period: 'AM',
    label: 'Morning Sunlight & Hydration',
    category: 'Morning Routine',
    days: [0, 1, 2, 3, 4, 5, 6], // Every day
    isEnabled: true,
    sound: 'Binaural Theta Wave (432Hz)',
    vibration: true,
    snoozeEnabled: false,
  },
  {
    id: 'alarm-2',
    time: '01:30 PM',
    hour: 1,
    minute: 30,
    period: 'PM',
    label: 'Afternoon Focus & Supplements',
    category: 'Deep Work',
    days: [0, 1, 2, 3, 4], // Mon - Fri
    isEnabled: true,
    sound: 'Solar Flare Pulse',
    vibration: true,
    snoozeEnabled: true,
  },
  {
    id: 'alarm-3',
    time: '10:15 PM',
    hour: 10,
    minute: 15,
    period: 'PM',
    label: 'Cortisol Drop & Night Protocol',
    category: 'Recovery',
    days: [0, 1, 2, 3, 4, 5, 6], // Every day active
    isEnabled: false,
    sound: 'Subtle Dawn Harmonics',
    vibration: false,
    snoozeEnabled: false,
  },
];
