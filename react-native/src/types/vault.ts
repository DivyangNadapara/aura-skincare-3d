export type VaultMediaType = 'image' | 'video' | 'document' | 'other';

export interface VaultItem {
  id: string;
  name: string;
  type: VaultMediaType;
  uri: string;
  thumbnailUri?: string;
  sizeBytes: number;
  dateAdded: string; // ISO or readable
  timeAdded: string;
  originalFileName: string;
  mimeType?: string;
  note?: string;
  isFavorite?: boolean;
}

export const INITIAL_VAULT_ITEMS: VaultItem[] = [
  {
    id: 'vault-1',
    name: 'Personal ID & Passport',
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop',
    thumbnailUri: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=300&auto=format&fit=crop',
    sizeBytes: 2450000,
    dateAdded: '2026-10-14',
    timeAdded: '09:15 AM',
    originalFileName: 'IMG_20261014_passport.jpg',
    mimeType: 'image/jpeg',
    note: 'Encrypted copy of identification document',
    isFavorite: true,
  },
  {
    id: 'vault-2',
    name: 'Private Trip Memories',
    type: 'video',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=300&auto=format&fit=crop',
    sizeBytes: 15400000,
    dateAdded: '2026-10-13',
    timeAdded: '08:42 PM',
    originalFileName: 'VID_20261013_private_sunset.mp4',
    mimeType: 'video/mp4',
    note: 'Sunset video clip hidden from device gallery',
    isFavorite: true,
  },
  {
    id: 'vault-3',
    name: 'Financial Ledger & Crypto Keys',
    type: 'document',
    uri: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    sizeBytes: 84000,
    dateAdded: '2026-10-12',
    timeAdded: '11:20 AM',
    originalFileName: 'recovery_passphrase_backup.pdf',
    mimeType: 'application/pdf',
    note: 'Important seed phrases & financial records',
    isFavorite: false,
  },
  {
    id: 'vault-4',
    name: 'Confidential Contract Agreement',
    type: 'document',
    uri: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    sizeBytes: 320000,
    dateAdded: '2026-10-10',
    timeAdded: '04:05 PM',
    originalFileName: 'nda_signed_confidential.pdf',
    mimeType: 'application/pdf',
    note: 'Private legal agreement',
    isFavorite: false,
  },
];

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

