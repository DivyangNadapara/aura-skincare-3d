export type AlarmCategory = 
  | 'Morning Routine' 
  | 'Deep Work' 
  | 'Recovery' 
  | 'Circadian Sync' 
  | 'Mindfulness';

export interface AlarmItem {
  id: string;
  time: string; // e.g. "07:30 AM"
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
  label: string;
  category: AlarmCategory;
  days: number[]; // 0 = Mon, 1 = Tue, 2 = Wed, 3 = Thu, 4 = Fri, 5 = Sat, 6 = Sun
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
];

export const ALARM_SOUNDS = [
  'Binaural Theta Wave (432Hz)',
  'Subtle Dawn Harmonics',
  'Nordic Chimes',
  'Solar Flare Pulse',
  'Deep Forest Ambience',
];
