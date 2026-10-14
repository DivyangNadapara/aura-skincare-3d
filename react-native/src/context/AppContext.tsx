import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AlarmItem } from '../types/alarm';
import { INITIAL_ALARMS } from '../data/mockAlarms';
import { NoteItem, NoteCategory } from '../types/note';
import { INITIAL_NOTES } from '../data/mockNotes';
import { TransactionItem, INITIAL_TRANSACTIONS } from '../types/expense';
import { VaultItem, INITIAL_VAULT_ITEMS } from '../types/vault';
import { MainBranchTab } from '../components/BottomNav';

interface AppContextType {
  // Navigation
  currentScreen: MainBranchTab;
  setCurrentScreen: (tab: MainBranchTab) => void;

  // Alarms
  alarms: AlarmItem[];
  addAlarm: (alarmData: Omit<AlarmItem, 'id'>) => AlarmItem;
  toggleAlarm: (id: string, isEnabled?: boolean) => void;
  deleteAlarm: (id: string) => boolean;

  // Notes
  notes: NoteItem[];
  addNote: (noteData: { title: string; content: string; category?: NoteCategory; isPinned?: boolean; images?: string[] }) => NoteItem;
  updateNote: (updated: NoteItem) => void;
  deleteNote: (id: string) => boolean;

  // Expenses & Cashflow
  transactions: TransactionItem[];
  addTransaction: (txData: Omit<TransactionItem, 'id'>) => TransactionItem;
  deleteTransaction: (id: string) => boolean;

  // Vault
  vaultItems: VaultItem[];
  addVaultItem: (item: VaultItem) => void;
  deleteVaultItem: (id: string) => boolean;
  isVaultUnlocked: boolean;
  unlockVault: () => void;
  lockVault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<MainBranchTab>('home');
  const [alarms, setAlarms] = useState<AlarmItem[]>(INITIAL_ALARMS);
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [transactions, setTransactions] = useState<TransactionItem[]>(INITIAL_TRANSACTIONS);
  const [vaultItems, setVaultItems] = useState<VaultItem[]>(INITIAL_VAULT_ITEMS);
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);

  // Alarm actions
  const addAlarm = (alarmData: Omit<AlarmItem, 'id'>): AlarmItem => {
    const newAlarm: AlarmItem = {
      ...alarmData,
      id: `alarm-${Date.now()}`,
    };
    setAlarms((prev) => [newAlarm, ...prev]);
    return newAlarm;
  };

  const toggleAlarm = (id: string, isEnabled?: boolean) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isEnabled: isEnabled !== undefined ? isEnabled : !a.isEnabled } : a))
    );
  };

  const deleteAlarm = (id: string): boolean => {
    let existed = false;
    setAlarms((prev) => {
      existed = prev.some((a) => a.id === id);
      return prev.filter((a) => a.id !== id);
    });
    return existed;
  };

  // Note actions
  const addNote = (noteData: {
    title: string;
    content: string;
    category?: NoteCategory;
    isPinned?: boolean;
    images?: string[];
  }): NoteItem => {
    const now = new Date();
    const dateStr = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: noteData.title,
      content: noteData.content,
      category: noteData.category || 'Quick Ideas',
      isPinned: noteData.isPinned || false,
      images: noteData.images || [],
      createdAt: dateStr,
      updatedAt: 'Just now',
    };
    setNotes((prev) => [newNote, ...prev]);
    return newNote;
  };

  const updateNote = (updated: NoteItem) => {
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
  };

  const deleteNote = (id: string): boolean => {
    let existed = false;
    setNotes((prev) => {
      existed = prev.some((n) => n.id === id);
      return prev.filter((n) => n.id !== id);
    });
    return existed;
  };

  // Transaction actions
  const addTransaction = (txData: Omit<TransactionItem, 'id'>): TransactionItem => {
    const newTx: TransactionItem = {
      ...txData,
      id: `tx-${Date.now()}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  };

  const deleteTransaction = (id: string): boolean => {
    let existed = false;
    setTransactions((prev) => {
      existed = prev.some((t) => t.id === id);
      return prev.filter((t) => t.id !== id);
    });
    return existed;
  };

  // Vault actions
  const addVaultItem = (item: VaultItem) => {
    setVaultItems((prev) => [item, ...prev]);
  };

  const deleteVaultItem = (id: string): boolean => {
    let existed = false;
    setVaultItems((prev) => {
      existed = prev.some((v) => v.id === id);
      return prev.filter((v) => v.id !== id);
    });
    return existed;
  };

  const unlockVault = () => setIsVaultUnlocked(true);
  const lockVault = () => setIsVaultUnlocked(false);

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        alarms,
        addAlarm,
        toggleAlarm,
        deleteAlarm,
        notes,
        addNote,
        updateNote,
        deleteNote,
        transactions,
        addTransaction,
        deleteTransaction,
        vaultItems,
        addVaultItem,
        deleteVaultItem,
        isVaultUnlocked,
        unlockVault,
        lockVault,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

