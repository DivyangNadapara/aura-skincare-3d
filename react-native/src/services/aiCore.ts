import { AlarmItem, SamsungAlarmCategory } from '../types/alarm';
import { NoteItem, NoteCategory, NOTE_CATEGORIES } from '../types/note';
import { TransactionItem, ExpenseCategory, CATEGORY_ICONS } from '../types/expense';
import { VaultItem, formatBytes } from '../types/vault';
import { MainBranchTab } from '../components/BottomNav';

export interface AiActionResult {
  actionType:
    | 'ALARM_CREATED'
    | 'ALARM_UPDATED'
    | 'ALARM_TOGGLED'
    | 'ALARM_DELETED'
    | 'TRANSACTION_ADDED'
    | 'TRANSACTION_DELETED'
    | 'NOTE_CREATED'
    | 'NOTE_UPDATED'
    | 'NOTE_DELETED'
    | 'VAULT_STATUS'
    | 'VAULT_LOCKED'
    | 'VAULT_UNLOCKED'
    | 'NAVIGATED'
    | 'MATH_CALCULATED'
    | 'SYSTEM_BRIEFING'
    | 'INFO';
  badgeTitle: string;
  badgeDetails: string;
  badgeColor: string; // e.g. '#6C5CE7', '#00B894', '#FD79A8'
  targetBranch?: MainBranchTab;
}

export interface AiExecutionResponse {
  message: string;
  action?: AiActionResult;
}

export interface SystemState {
  alarms: AlarmItem[];
  notes: NoteItem[];
  transactions: TransactionItem[];
  vaultItems: VaultItem[];
  isVaultUnlocked: boolean;
  addAlarm: (data: Omit<AlarmItem, 'id'>) => AlarmItem;
  toggleAlarm: (id: string, isEnabled?: boolean) => void;
  deleteAlarm: (id: string) => boolean;
  addNote: (data: { title: string; content: string; category?: NoteCategory; isPinned?: boolean }) => NoteItem;
  updateNote: (updated: NoteItem) => void;
  deleteNote: (id: string) => boolean;
  addTransaction: (data: Omit<TransactionItem, 'id'>) => TransactionItem;
  deleteTransaction: (id: string) => boolean;
  lockVault: () => void;
  unlockVault: () => void;
  setCurrentScreen: (tab: MainBranchTab) => void;
}

export class AiCommandEngine {
  public static execute(prompt: string, state: SystemState): AiExecutionResponse {
    const raw = prompt.trim();
    const lower = raw.toLowerCase();

    // ─────────────────────────────────────────────────────────────
    // 1. SYSTEM BRIEFING / OVERVIEW OF ENTIRE APP
    // ─────────────────────────────────────────────────────────────
    if (
      lower.includes('briefing') ||
      lower.includes('status') ||
      lower.includes('summary of everything') ||
      lower.includes('overview') ||
      (lower.includes('how') && lower.includes('doing')) ||
      lower.includes('system check')
    ) {
      const activeAlarms = state.alarms.filter((a) => a.isEnabled);
      let income = 0;
      let expenses = 0;
      state.transactions.forEach((t) => {
        if (t.type === 'income') income += t.amount;
        else expenses += t.amount;
      });
      const net = income - expenses;
      const totalVaultStorage = state.vaultItems.reduce((acc, v) => acc + v.sizeBytes, 0);

      const msg = `✦ **Autonomous System Diagnostic Complete**\n\n` +
        `• **Circadian Anchors**: ${activeAlarms.length} active alarm(s) set. Next scheduled wake time is ${activeAlarms[0]?.time || 'None'} ${activeAlarms[0]?.period || ''}.\n` +
        `• **Financial Balance**: Net cashflow is **${net >= 0 ? '+' : '-'}$${Math.abs(net).toFixed(2)}** (Inflow: +$${income.toFixed(2)} | Outflow: -$${expenses.toFixed(2)} across ${state.transactions.length} records).\n` +
        `• **Protocols & Notes**: ${state.notes.length} verified logs stored, with ${state.notes.filter((n) => n.isPinned).length} pinned.\n` +
        `• **Encrypted Enclave**: ${state.vaultItems.length} hidden artifact(s) utilizing ${formatBytes(totalVaultStorage)} of storage (${state.isVaultUnlocked ? 'Unlocked' : 'Locked'}).\n\n` +
        `All four branches are synchronized and operational.`;

      return {
        message: msg,
        action: {
          actionType: 'SYSTEM_BRIEFING',
          badgeTitle: 'Full System Diagnostic',
          badgeDetails: '4 Branches Synchronized',
          badgeColor: '#6C5CE7',
        },
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 2. ALARM COMMANDS: CREATE, TOGGLE, DELETE, LIST
    // ─────────────────────────────────────────────────────────────
    // CREATE ALARM: e.g. "set alarm at 6:30 AM", "alarm for 7 am", "wake me up at 8:15 pm for workout"
    const alarmTimeMatch = lower.match(/(?:set|create|add|wake\s+me\s+up\s+at|alarm\s+at|alarm\s+for)\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
    if (alarmTimeMatch || ((lower.includes('alarm') || lower.includes('wake')) && lower.match(/\b\d{1,2}(?::\d{2})?\s*(am|pm)\b/i))) {
      const match = alarmTimeMatch || lower.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i);
      if (match) {
        let hour = parseInt(match[1], 10);
        let minute = match[2] ? parseInt(match[2], 10) : 0;
        let period: 'AM' | 'PM' = (match[3]?.toUpperCase() as 'AM' | 'PM') || (hour < 12 ? 'AM' : 'PM');

        // Extract custom label if provided
        let label = 'Wake Anchor';
        if (lower.includes('for ')) {
          label = raw.split(/for\s+/i)[1]?.trim() || label;
        } else if (lower.includes('called ')) {
          label = raw.split(/called\s+/i)[1]?.trim() || label;
        } else if (lower.includes('label ')) {
          label = raw.split(/label\s+/i)[1]?.trim() || label;
        }

        const formattedTime = `${hour}:${minute.toString().padStart(2, '0')}`;
        const newAlarm = state.addAlarm({
          time: formattedTime,
          period,
          hour: period === 'PM' && hour !== 12 ? hour + 12 : period === 'AM' && hour === 12 ? 0 : hour,
          minute,
          label,
          category: hour < 10 && period === 'AM' ? 'Morning Routine' : 'Deep Work',
          days: [1, 2, 3, 4, 5],
          isEnabled: true,
          sound: 'Over the Horizon (Samsung Brand)',
          volume: 85,
          vibration: 'Basic Call',
          snooze: '5 minutes, 3 times',
        });

        return {
          message: `✦ I have set an autonomous wake anchor for **${formattedTime} ${period}** labeled **"${label}"**.\n\nIt is now active in your Rhythm Alarms branch and scheduled for weekdays.`,
          action: {
            actionType: 'ALARM_CREATED',
            badgeTitle: `Alarm Set: ${formattedTime} ${period}`,
            badgeDetails: label,
            badgeColor: '#6C5CE7',
            targetBranch: 'alarm',
          },
        };
      }
    }

    // TOGGLE / TURN OFF ALL ALARMS OR SPECIFIC ALARM
    if (lower.includes('turn off all alarms') || lower.includes('disable all alarms')) {
      state.alarms.forEach((a) => state.toggleAlarm(a.id, false));
      return {
        message: `✦ All ${state.alarms.length} alarms have been deactivated.`,
        action: {
          actionType: 'ALARM_TOGGLED',
          badgeTitle: 'All Alarms Deactivated',
          badgeDetails: `${state.alarms.length} anchors turned off`,
          badgeColor: '#FD79A8',
          targetBranch: 'alarm',
        },
      };
    }

    if (lower.includes('turn on all alarms') || lower.includes('enable all alarms')) {
      state.alarms.forEach((a) => state.toggleAlarm(a.id, true));
      return {
        message: `✦ All ${state.alarms.length} alarms are now enabled.`,
        action: {
          actionType: 'ALARM_TOGGLED',
          badgeTitle: 'All Alarms Activated',
          badgeDetails: `${state.alarms.length} anchors enabled`,
          badgeColor: '#00B894',
          targetBranch: 'alarm',
        },
      };
    }

    // DELETE ALARM
    if (lower.includes('delete alarm') || lower.includes('remove alarm')) {
      if (state.alarms.length > 0) {
        const deleted = state.alarms[0];
        state.deleteAlarm(deleted.id);
        return {
          message: `✦ Erased alarm anchor: **${deleted.time} ${deleted.period}** ("${deleted.label}").`,
          action: {
            actionType: 'ALARM_DELETED',
            badgeTitle: `Alarm Erased: ${deleted.time} ${deleted.period}`,
            badgeDetails: deleted.label,
            badgeColor: '#FD79A8',
            targetBranch: 'alarm',
          },
        };
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 3. EXPENSES & CASHFLOW: INSERT, CALCULATE, ANALYZE, DELETE
    // ─────────────────────────────────────────────────────────────
    // EXPENSE: e.g. "spent $45 on dinner", "bought coffee for $6.50", "paid $120 for electric bill", "expense 50 food"
    const expenseMatch = lower.match(/(?:spent|paid|bought|expense|outflow|cost)\s+\$?([0-9]+(?:\.[0-9]{1,2})?)/i) ||
      lower.match(/\$?([0-9]+(?:\.[0-9]{1,2})?)\s+(?:on|for)\s+(.+)/i);

    if (expenseMatch && !lower.includes('income') && !lower.includes('earned') && !lower.includes('salary') && !lower.includes('received')) {
      const amount = parseFloat(expenseMatch[1]);
      let description = 'Daily Expense';

      if (lower.includes(' on ')) {
        description = raw.split(/\s+on\s+/i)[1]?.trim() || description;
      } else if (lower.includes(' for ')) {
        description = raw.split(/\s+for\s+/i)[1]?.trim() || description;
      }

      // Smart category detection
      let category: ExpenseCategory = 'Other';
      if (/food|dinner|lunch|breakfast|coffee|grocer|sushi|meal|burger|snack|restaurant/i.test(description)) {
        category = 'Food & Dining';
      } else if (/shop|shoes|clothes|amazon|buy|mall/i.test(description)) {
        category = 'Shopping';
      } else if (/uber|lyft|gas|fuel|bus|train|flight|transport/i.test(description)) {
        category = 'Transport';
      } else if (/bill|utility|electric|wifi|internet|phone|water|rent/i.test(description)) {
        category = 'Bills & Utilities';
      } else if (/gym|fitness|protein|vitamin|health|doctor|medicine/i.test(description)) {
        category = 'Health & Fitness';
      } else if (/movie|game|netflix|spotify|entertainment/i.test(description)) {
        category = 'Entertainment';
      }

      const now = new Date();
      const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const timeStr = `${hours % 12 || 12}:${minutes} ${ampm}`;

      const tx = state.addTransaction({
        title: description.charAt(0).toUpperCase() + description.slice(1),
        amount,
        type: 'expense',
        category,
        dateStr,
        timeStr,
        note: 'Logged via Autonomous AI Core',
      });

      return {
        message: `✦ Logged outflow of **-$${amount.toFixed(2)}** for **"${tx.title}"** under category **[${category}]**.\n\n` +
          `• Timestamp: ${dateStr} • ${timeStr}\n` +
          `• Your monthly cashflow analytics and calendar dots have been updated.`,
        action: {
          actionType: 'TRANSACTION_ADDED',
          badgeTitle: `Expense Logged: -$${amount.toFixed(2)}`,
          badgeDetails: `${tx.title} • ${category}`,
          badgeColor: '#FD79A8',
          targetBranch: 'expenses',
        },
      };
    }

    // INCOME: e.g. "got paid $2500", "income $1200 freelancing", "earned $300 dividend"
    const incomeMatch = lower.match(/(?:income|earned|paid\s+me|received|salary|deposit|wire)\s+\$?([0-9]+(?:\.[0-9]{1,2})?)/i) ||
      lower.match(/got\s+paid\s+\$?([0-9]+(?:\.[0-9]{1,2})?)/i);

    if (incomeMatch) {
      const amount = parseFloat(incomeMatch[1]);
      let description = 'Client / Work Payment';
      if (lower.includes('for ')) {
        description = raw.split(/for\s+/i)[1]?.trim() || description;
      } else if (lower.includes('from ')) {
        description = raw.split(/from\s+/i)[1]?.trim() || description;
      }

      const now = new Date();
      const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const timeStr = `${hours % 12 || 12}:${minutes} ${ampm}`;

      const tx = state.addTransaction({
        title: description.charAt(0).toUpperCase() + description.slice(1),
        amount,
        type: 'income',
        category: lower.includes('invest') || lower.includes('dividend') ? 'Investments' : 'Salary & Work',
        dateStr,
        timeStr,
        note: 'Income recorded via AI Core',
      });

      return {
        message: `✦ Recorded cash inflow of **+$${amount.toFixed(2)}** from **"${tx.title}"**.\n\n` +
          `• Timestamp: ${dateStr} • ${timeStr}\n` +
          `• Net cash balance augmented.`,
        action: {
          actionType: 'TRANSACTION_ADDED',
          badgeTitle: `Income Added: +$${amount.toFixed(2)}`,
          badgeDetails: tx.title,
          badgeColor: '#00B894',
          targetBranch: 'expenses',
        },
      };
    }

    // ANALYZE SPENDING / CALCULATE CASHFLOW
    if (lower.includes('spending') || lower.includes('expenses') || lower.includes('how much have i spent') || lower.includes('savings rate')) {
      let income = 0;
      let expenses = 0;
      const categoryMap: Record<string, number> = {};

      state.transactions.forEach((t) => {
        if (t.type === 'income') {
          income += t.amount;
        } else {
          expenses += t.amount;
          categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
        }
      });

      const net = income - expenses;
      const savingsRate = income > 0 ? Math.round((net / income) * 100) : 0;
      const topCat = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];

      return {
        message: `✦ **Financial Cashflow Breakdown**\n\n` +
          `• **Total Inflow**: +$${income.toFixed(2)}\n` +
          `• **Total Outflow**: -$${expenses.toFixed(2)}\n` +
          `• **Net Balance**: ${net >= 0 ? '+' : '-'}$${Math.abs(net).toFixed(2)}\n` +
          `• **Savings Rate**: ${savingsRate}%\n` +
          (topCat ? `• **Highest Expense Sector**: ${topCat[0]} ($${topCat[1].toFixed(2)})\n` : '') +
          `• **Active Records**: ${state.transactions.length} transactions indexed.`,
        action: {
          actionType: 'TRANSACTION_ADDED',
          badgeTitle: `Net Cash: $${net.toFixed(2)}`,
          badgeDetails: `${savingsRate}% Savings Rate`,
          badgeColor: '#00B894',
          targetBranch: 'expenses',
        },
      };
    }

    // DELETE LAST TRANSACTION
    if (lower.includes('delete last transaction') || lower.includes('remove last expense')) {
      if (state.transactions.length > 0) {
        const deleted = state.transactions[0];
        state.deleteTransaction(deleted.id);
        return {
          message: `✦ Erased transaction: **${deleted.title}** (${deleted.type === 'income' ? '+' : '-'}$${deleted.amount.toFixed(2)}).`,
          action: {
            actionType: 'TRANSACTION_DELETED',
            badgeTitle: `Transaction Removed`,
            badgeDetails: `${deleted.title} • $${deleted.amount.toFixed(2)}`,
            badgeColor: '#FD79A8',
            targetBranch: 'expenses',
          },
        };
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 4. NOTES & PROTOCOLS: INSERT, SEARCH, UPDATE, DELETE
    // ─────────────────────────────────────────────────────────────
    // ADD NOTE: e.g. "add note: morning cold plunge 3 minutes", "create note called workout routine..."
    const noteMatch = lower.match(/(?:add|create|new|save|write)\s+note(?:\s*:\s*|\s+called\s+|\s+about\s+|\s+)(.+)/i);
    if (noteMatch || (lower.startsWith('note:') || lower.startsWith('protocol:'))) {
      const fullText = noteMatch ? noteMatch[1].trim() : raw.replace(/^(?:note|protocol):\s*/i, '').trim();
      const parts = fullText.split(/[-–—:]\s+/);
      const title = parts[0]?.trim() || 'Quick Protocol';
      const content = parts.length > 1 ? parts.slice(1).join(' - ').trim() : fullText;

      let category: NoteCategory = 'Quick Ideas';
      if (/circadian|sun|sleep|melatonin|light/i.test(fullText)) category = 'Circadian Protocol';
      else if (/work|deep|focus|code|study/i.test(fullText)) category = 'Deep Work';
      else if (/recover|bath|sauna|relax|nap/i.test(fullText)) category = 'Recovery & Sleep';
      else if (/nutrition|diet|fast|protein|vitamin|water|supplement/i.test(fullText)) category = 'Nutrition & Biohacking';

      const newNote = state.addNote({
        title: title.charAt(0).toUpperCase() + title.slice(1),
        content,
        category,
        isPinned: lower.includes('pin') || lower.includes('important'),
      });

      return {
        message: `✦ Created new protocol entry: **"${newNote.title}"**.\n\n` +
          `• Sector: [${category}]\n` +
          `• Content: "${content}"\n` +
          `• Status: ${newNote.isPinned ? '📌 Pinned' : 'Logged in database'}`,
        action: {
          actionType: 'NOTE_CREATED',
          badgeTitle: `Protocol Created: ${newNote.title}`,
          badgeDetails: category,
          badgeColor: '#FD79A8',
          targetBranch: 'notes',
        },
      };
    }

    // SEARCH NOTES
    if (lower.includes('search note') || lower.includes('find note') || lower.includes('show notes about')) {
      const query = lower.replace(/.*(?:search|find|show\s+notes\s+about)\s+/i, '').trim();
      const results = state.notes.filter(
        (n) => n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query)
      );

      if (results.length === 0) {
        return {
          message: `✦ Zero protocol logs matched query: "${query}".`,
        };
      }

      const listStr = results.map((r, i) => `${i + 1}. **${r.title}** (${r.category}): "${r.content.slice(0, 60)}..."`).join('\n');
      return {
        message: `✦ Found **${results.length}** matching protocol(s) for "${query}":\n\n${listStr}`,
        action: {
          actionType: 'NOTE_CREATED',
          badgeTitle: `${results.length} Notes Located`,
          badgeDetails: `Query: ${query}`,
          badgeColor: '#6C5CE7',
          targetBranch: 'notes',
        },
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 5. VAULT COMMANDS: STATUS, LOCK, TELEMETRY
    // ─────────────────────────────────────────────────────────────
    if (lower.includes('vault') || lower.includes('secret') || lower.includes('lock')) {
      if (lower.includes('lock')) {
        state.lockVault();
        return {
          message: `✦ Encrypted Enclave has been **LOCKED**. Security PIN will be required to re-access sensitive artifacts.`,
          action: {
            actionType: 'VAULT_LOCKED',
            badgeTitle: 'Vault Sealed',
            badgeDetails: 'AES-256 Lockdown Engaged',
            badgeColor: '#FD79A8',
            targetBranch: 'vault',
          },
        };
      }

      const totalSize = state.vaultItems.reduce((acc, v) => acc + v.sizeBytes, 0);
      const photoCount = state.vaultItems.filter((i) => i.type === 'image').length;
      const videoCount = state.vaultItems.filter((i) => i.type === 'video').length;
      const docCount = state.vaultItems.filter((i) => i.type === 'document').length;

      return {
        message: `✦ **Encrypted Enclave Telemetry**\n\n` +
          `• Total Artifacts: **${state.vaultItems.length}**\n` +
          `• Occupied Storage: **${formatBytes(totalSize)}**\n` +
          `• Breakdown: ${photoCount} Photos, ${videoCount} Videos, ${docCount} Documents\n` +
          `• Enclave Security State: **${state.isVaultUnlocked ? 'UNLOCKED' : 'LOCKED'}**`,
        action: {
          actionType: 'VAULT_STATUS',
          badgeTitle: `Vault: ${state.vaultItems.length} Files`,
          badgeDetails: formatBytes(totalSize),
          badgeColor: '#6C5CE7',
          targetBranch: 'vault',
        },
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 6. DIRECT NAVIGATION COMMANDS
    // ─────────────────────────────────────────────────────────────
    if (lower.includes('go to ') || lower.includes('open ') || lower.includes('show ')) {
      if (lower.includes('alarm') || lower.includes('clock')) {
        state.setCurrentScreen('alarm');
        return {
          message: `✦ Opening **Circadian Alarms** branch.`,
          action: {
            actionType: 'NAVIGATED',
            badgeTitle: 'Navigated to Alarms',
            badgeDetails: 'Circadian Clocks Screen',
            badgeColor: '#6C5CE7',
            targetBranch: 'alarm',
          },
        };
      }
      if (lower.includes('note') || lower.includes('protocol')) {
        state.setCurrentScreen('notes');
        return {
          message: `✦ Opening **Aesthetic Protocols** branch.`,
          action: {
            actionType: 'NAVIGATED',
            badgeTitle: 'Navigated to Notes',
            badgeDetails: 'Research & Protocols Screen',
            badgeColor: '#FD79A8',
            targetBranch: 'notes',
          },
        };
      }
      if (lower.includes('expense') || lower.includes('cash') || lower.includes('calendar') || lower.includes('finance')) {
        state.setCurrentScreen('expenses');
        return {
          message: `✦ Opening **Cashflow & Expenses** branch.`,
          action: {
            actionType: 'NAVIGATED',
            badgeTitle: 'Navigated to Cashflow',
            badgeDetails: 'Monthly Calendar & Ledger',
            badgeColor: '#00B894',
            targetBranch: 'expenses',
          },
        };
      }
      if (lower.includes('vault') || lower.includes('secret')) {
        state.setCurrentScreen('vault');
        return {
          message: `✦ Opening **Secret Media Vault** branch.`,
          action: {
            actionType: 'NAVIGATED',
            badgeTitle: 'Navigated to Vault',
            badgeDetails: 'Encrypted Media Sandbox',
            badgeColor: '#6C5CE7',
            targetBranch: 'vault',
          },
        };
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 7. MATHEMATICAL COMPUTATIONS & FINANCIAL UTILITY
    // ─────────────────────────────────────────────────────────────
    // e.g. "calculate 15% tip on 145", "what is 2500 - 840", "tip on 82"
    const tipMatch = lower.match(/(?:tip|tip\s+on)\s+(?:of\s+)?(?:(\d+)%\s+on\s+)?\$?(\d+(?:\.\d+)?)/i);
    if (tipMatch) {
      const pct = tipMatch[1] ? parseFloat(tipMatch[1]) : 18;
      const bill = parseFloat(tipMatch[2]);
      const tip = (bill * pct) / 100;
      const total = bill + tip;
      return {
        message: `✦ **Tip & Bill Computation**\n\n` +
          `• Bill Base: **$${bill.toFixed(2)}**\n` +
          `• Tip (${pct}%): **$${tip.toFixed(2)}**\n` +
          `• Total Payable: **$${total.toFixed(2)}**`,
        action: {
          actionType: 'MATH_CALCULATED',
          badgeTitle: `Total: $${total.toFixed(2)}`,
          badgeDetails: `Tip: $${tip.toFixed(2)} (${pct}%)`,
          badgeColor: '#00B894',
        },
      };
    }

    const simpleMathMatch = lower.match(/(?:calculate|what\s+is|math)\s+([0-9\.\s\+\-\*\/\(\)]+)/i);
    if (simpleMathMatch) {
      try {
        const sanitized = simpleMathMatch[1].replace(/[^0-9\.\+\-\*\/\(\)\s]/g, '');
        // eslint-disable-next-line no-eval
        const result = Function(`'use strict'; return (${sanitized})`)();
        if (typeof result === 'number' && !isNaN(result)) {
          return {
            message: `✦ Computation result: **${sanitized.trim()} = ${result.toLocaleString()}**`,
            action: {
              actionType: 'MATH_CALCULATED',
              badgeTitle: `Result: ${result}`,
              badgeDetails: sanitized.trim(),
              badgeColor: '#6C5CE7',
            },
          };
        }
      } catch (e) {}
    }

    // ─────────────────────────────────────────────────────────────
    // 8. GENERAL INTELLIGENCE ASSISTANCE
    // ─────────────────────────────────────────────────────────────
    return {
      message: `✦ Command received: **"${raw}"**.\n\n` +
        `I am your autonomous neural operating core with full write & delete control over:\n` +
        `• ⏰ **Alarms**: "Set alarm at 6:30 AM", "Turn off all alarms"\n` +
        `• 💳 **Cashflow**: "Spent $45 on Dinner", "Got paid $2500", "Analyze spending"\n` +
        `• 📝 **Protocols**: "Add note: Cold Plunge 3min at 50F", "Find notes about retinol"\n` +
        `• 🔐 **Vault**: "Show vault status", "Lock vault"\n` +
        `• ⚡ **System**: "System briefing", "Calculate 20% tip on $85"\n\n` +
        `Give me any instruction and I will execute it automatically.`,
      action: {
        actionType: 'INFO',
        badgeTitle: 'Autonomous Agent Ready',
        badgeDetails: 'Full System Access Granted',
        badgeColor: '#6C5CE7',
      },
    };
  }
}

