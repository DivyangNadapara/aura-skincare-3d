import { NoteItem } from '../types/note';

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Morning Photobiology & Dopamine Baseline',
    content: 'View 10-15 minutes of early sunlight directly without sunglasses within 1 hour of waking. Increases daytime cortisol spike by 50% and anchors evening melatonin onset ~14 hours later.\n\nHydration stack:\n- 500ml filtered water\n- 1/4 tsp Himalayan pink salt\n- 100mg L-Theanine if drinking espresso.',
    category: 'Circadian Protocol',
    isPinned: true,
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    ],
    createdAt: 'Today, 7:45 AM',
    updatedAt: 'Today, 8:12 AM',
  },
  {
    id: 'note-2',
    title: '90-Min Ultradian Deep Work Protocol',
    content: 'Brain operates in 90-minute ultradian focus rhythms. \n1. First 5-10 min: frictional warmup (ignore temptation to switch tasks).\n2. Min 10-75: peak neural flow and code architecture execution.\n3. Min 75-90: cognitive fatigue taper; document next session anchor point.\n\nPhone completely off or placed in other room.',
    category: 'Deep Work',
    isPinned: true,
    images: [
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80',
    ],
    createdAt: 'Yesterday, 2:15 PM',
    updatedAt: 'Yesterday, 3:45 PM',
  },
  {
    id: 'note-3',
    title: 'Sleep Architecture & Cortisol Downregulation',
    content: 'Bedroom temperature at 18.5°C (65°F). Stop all caloric intake 3 hours prior to sleep. Dim overhead ambient lighting after 9:00 PM; switch to red/amber spectrum lamps.\n\nNight stack test:\n- Magnesium L-Threonate: 140mg\n- Apigenin: 50mg\n- Glycine: 2g.',
    category: 'Recovery & Sleep',
    isPinned: false,
    images: [
      'https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=600&q=80',
    ],
    createdAt: 'Oct 12, 10:30 PM',
    updatedAt: 'Oct 12, 10:45 PM',
  },
];

