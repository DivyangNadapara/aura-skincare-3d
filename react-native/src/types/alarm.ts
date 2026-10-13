// Samsung One UI Clock & Alarm Types

export type SamsungAlarmCategory = 
  | 'Morning Routine' 
  | 'Deep Work' 
  | 'Recovery' 
  | 'Work' 
  | 'Personal';

export interface AlarmItem {
  id: string;
  time: string; // e.g. "7:30"
  period: 'AM' | 'PM';
  hour: number;
  minute: number;
  label: string;
  category: SamsungAlarmCategory;
  days: number[]; // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat (Samsung standard starts Sunday)
  isEnabled: boolean;
  sound: string;
  volume: number; // 0 - 100
  vibration: string;
  snooze: string;
  isExpanded?: boolean;
}

// Samsung standard day sequence (Sunday through Saturday)
export const SAMSUNG_DAYS = [
  { id: 0, label: 'S', full: 'Sun' },
  { id: 1, label: 'M', full: 'Mon' },
  { id: 2, label: 'T', full: 'Tue' },
  { id: 3, label: 'W', full: 'Wed' },
  { id: 4, label: 'T', full: 'Thu' },
  { id: 5, label: 'F', full: 'Fri' },
  { id: 6, label: 'S', full: 'Sat' },
];

export const SAMSUNG_SOUNDS = [
  'Over the Horizon (Samsung Brand)',
  'Morning Flower',
  'Homecoming',
  'Breeze',
  'Daybreak',
];

export const SAMSUNG_VIBRATIONS = [
  'Basic call',
  'Heartbeat',
  'Ticktock',
  'Waltz',
  'Zig-zig-zig',
];
