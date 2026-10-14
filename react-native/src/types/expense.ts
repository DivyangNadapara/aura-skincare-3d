export type TransactionType = 'income' | 'expense';

export type ExpenseCategory =
  | 'Food & Dining'
  | 'Shopping'
  | 'Transport'
  | 'Bills & Utilities'
  | 'Health & Fitness'
  | 'Entertainment'
  | 'Salary & Work'
  | 'Investments'
  | 'Other';

export interface TransactionItem {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: ExpenseCategory;
  dateStr: string; // ISO format "YYYY-MM-DD" e.g. "2026-10-14"
  timeStr: string; // e.g. "02:30 PM"
  note?: string;
}

export const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  'Food & Dining': '◆',
  Shopping: '◇',
  Transport: '▲',
  'Bills & Utilities': '⬡',
  'Health & Fitness': '✚',
  Entertainment: '◈',
  'Salary & Work': '■',
  Investments: '▲',
  Other: '●',
};

// Initial mock transactions anchored to October 2026
export const INITIAL_TRANSACTIONS: TransactionItem[] = [
  {
    id: 'tx-1',
    title: 'Consulting Project',
    amount: 1250,
    type: 'income',
    category: 'Salary & Work',
    dateStr: '2026-10-14',
    timeStr: '02:30 PM',
    note: 'UI Architecture milestone',
  },
  {
    id: 'tx-2',
    title: 'Grocery & Organic Market',
    amount: 84.5,
    type: 'expense',
    category: 'Food & Dining',
    dateStr: '2026-10-14',
    timeStr: '11:15 AM',
    note: 'Whole foods & electrolytes',
  },
  {
    id: 'tx-3',
    title: 'Samsung Cloud & Subscriptions',
    amount: 19.99,
    type: 'expense',
    category: 'Bills & Utilities',
    dateStr: '2026-10-13',
    timeStr: '08:00 AM',
    note: 'Cloud sync server',
  },
  {
    id: 'tx-4',
    title: 'Stock Dividend Yield',
    amount: 145.2,
    type: 'income',
    category: 'Investments',
    dateStr: '2026-10-12',
    timeStr: '04:20 PM',
  },
  {
    id: 'tx-5',
    title: 'Gym & Recovery Sauna',
    amount: 60,
    type: 'expense',
    category: 'Health & Fitness',
    dateStr: '2026-10-11',
    timeStr: '07:00 PM',
  },
  {
    id: 'tx-6',
    title: 'Organic Espresso Beans',
    amount: 22.5,
    type: 'expense',
    category: 'Food & Dining',
    dateStr: '2026-10-08',
    timeStr: '09:10 AM',
  },
  {
    id: 'tx-7',
    title: 'Freelance Design Bonus',
    amount: 450,
    type: 'income',
    category: 'Salary & Work',
    dateStr: '2026-10-05',
    timeStr: '01:45 PM',
  },
];
