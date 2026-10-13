// Samsung One UI Notes Types

export type NoteCategory = 
  | 'Circadian Protocol' 
  | 'Deep Work' 
  | 'Recovery & Sleep' 
  | 'Nutrition & Biohacking' 
  | 'Quick Ideas';

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  isPinned: boolean;
  images: string[]; // URLs or base64 data URIs
  createdAt: string;
  updatedAt: string;
  colorTag?: string; // Optional custom color highlight
}

export const NOTE_CATEGORIES: NoteCategory[] = [
  'Circadian Protocol',
  'Deep Work',
  'Recovery & Sleep',
  'Nutrition & Biohacking',
  'Quick Ideas',
];

