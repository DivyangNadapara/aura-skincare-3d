import { AlarmItem } from '../types/alarm';

// 3 Pre-built cards formatted in Samsung One UI style
export const INITIAL_ALARMS: AlarmItem[] = [
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
    sound: 'Morning Flower',
    volume: 85,
    vibration: 'Basic call',
    snooze: '5 minutes, 3 times',
    isExpanded: false,
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
    sound: 'Over the Horizon (Samsung Brand)',
    volume: 70,
    vibration: 'Heartbeat',
    snooze: '5 minutes, 3 times',
    isExpanded: false,
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
    sound: 'Homecoming',
    volume: 50,
    vibration: 'Ticktock',
    snooze: 'Off',
    isExpanded: false,
  },
];
