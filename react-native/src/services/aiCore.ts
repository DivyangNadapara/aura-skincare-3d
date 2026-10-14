import { AppContextType } from '../context/AppContext';
import { GeminiService } from './geminiService';

export interface AiActionResult {
  actionType:
    | 'ALARM_CREATED'
    | 'ALARM_TOGGLED'
    | 'ALARM_DELETED'
    | 'EXPENSE_LOGGED'
    | 'INCOME_LOGGED'
    | 'NOTE_CREATED'
    | 'NOTE_DELETED'
    | 'VAULT_LOCKED'
    | 'VAULT_STATUS'
    | 'SYSTEM_BRIEFING'
    | 'MATH_CALCULATED'
    | 'CONVERSATION'
    | 'INFO';
  badgeTitle: string;
  badgeDetails: string;
  badgeColor: string;
  targetBranch?: 'alarm' | 'notes' | 'expenses' | 'vault';
  meta?: any;
}

export interface AiResponse {
  message: string;
  action?: AiActionResult;
  isGemini?: boolean;
}

/**
 * Normalizes input: handles common typos, cleans spacing
 */
function normalizeInput(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\balaram\b/gi, 'alarm')
    .replace(/\balram\b/gi, 'alarm')
    .replace(/\ballarm\b/gi, 'alarm')
    .replace(/\bexpanse\b/gi, 'expense')
    .replace(/\bexpens\b/gi, 'expense')
    .replace(/\bremimber\b/gi, 'remember')
    .replace(/\bmoning\b/gi, 'morning');
}

/**
 * Robust Natural Language Time & Alarm Parser
 * Parses:
 *  - "1:am", "1:AM MORNING", "1am", "1 am morning", "at 1:am"
 *  - "6:30 am", "06:30", "6:30pm for gym"
 *  - "wake me up at 7 in the morning"
 *  - "alarm for 11 pm called sleep"
 */
function parseAlarmIntent(raw: string): {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
  label: string;
} | null {
  const norm = normalizeInput(raw).toLowerCase();

  // Check if intent is alarm creation
  const isAlarmIntent =
    norm.includes('alarm') ||
    norm.includes('wake') ||
    norm.includes('clock') ||
    norm.startsWith('set ') ||
    norm.startsWith('add ') ||
    norm.includes('remind me at');

  if (!isAlarmIntent) return null;

  let hour: number | null = null;
  let minute = 0;
  let period: 'AM' | 'PM' = 'AM';
  let label = 'Wake Anchor';

  // 1. Check for "1:am" or "1:pm" or "12:am" (colon before am/pm)
  const colonAmPmMatch = norm.match(/\b(\d{1,2}):(am|pm)\b/i);
  if (colonAmPmMatch) {
    hour = parseInt(colonAmPmMatch[1], 10);
    period = colonAmPmMatch[2].toUpperCase() as 'AM' | 'PM';
  }

  // 2. Check for standard "6:30 am" or "14:30" or "6:30"
  if (hour === null) {
    const stdMatch = norm.match(/\b(\d{1,2}):(\d{2})\s*(am|pm)?\b/i);
    if (stdMatch) {
      hour = parseInt(stdMatch[1], 10);
      minute = parseInt(stdMatch[2], 10);
      if (stdMatch[3]) {
        period = stdMatch[3].toUpperCase() as 'AM' | 'PM';
      } else if (hour >= 12) {
        period = hour === 12 ? 'PM' : 'PM';
        if (hour > 12) hour -= 12;
      } else {
        period = norm.includes('night') || norm.includes('evening') || norm.includes('pm') ? 'PM' : 'AM';
      }
    }
  }

  // 3. Check for simple "1 am", "1am", "7 pm", "8 in the morning"
  if (hour === null) {
    const simpleMatch = norm.match(/\b(\d{1,2})\s*(am|pm|a\.m\.|p\.m\.)\b/i);
    if (simpleMatch) {
      hour = parseInt(simpleMatch[1], 10);
      period = simpleMatch[2].toLowerCase().startsWith('p') ? 'PM' : 'AM';
    }
  }

  // 4. Check for "at 1 morning" or "wake me up at 1" or "alarm at 1"
  if (hour === null) {
    const atMatch = norm.match(/(?:at|for)\s+(\d{1,2})\b/i);
    if (atMatch) {
      hour = parseInt(atMatch[1], 10);
      period = norm.includes('night') || norm.includes('evening') || norm.includes('pm') ? 'PM' : 'AM';
    }
  }

  if (hour === null || isNaN(hour) || hour < 0 || hour > 24) {
    return null;
  }

  // Force period if "morning" or "night" is explicitly mentioned
  if (norm.includes('morning')) {
    period = 'AM';
  } else if (norm.includes('night') || norm.includes('evening') || norm.includes('afternoon')) {
    period = 'PM';
  }

  // Extract label
  if (norm.includes('for ')) {
    label = raw.split(/for\s+/i)[1]?.trim() || label;
  } else if (norm.includes('called ')) {
    label = raw.split(/called\s+/i)[1]?.trim() || label;
  } else if (norm.includes('morning') && !label.toLowerCase().includes('morning')) {
    label = 'Morning Routine';
  } else if (norm.includes('workout') || norm.includes('gym')) {
    label = 'Workout';
  }

  // Clean label
  label = label.replace(/[.!?,]$/, '').trim();
  if (!label) label = period === 'AM' ? 'Morning Routine' : 'Focus Session';

  return { hour, minute, period, label };
}

/**
 * Conversational dialogue generator with Gemini-style personality
 */
function getConversationalResponse(
  norm: string,
  raw: string,
  state: AppContextType
): { message: string; action?: AiActionResult } | null {
  // GREETINGS & CASUAL
  if (/^(hi|hello|hey|yo|greetings|good\s+morning|good\s+evening|sup|what's\s+up)\b/i.test(norm)) {
    const activeAlarms = state.alarms.filter((a) => a.isEnabled).length;
    let net = 0;
    state.transactions.forEach((t) => (net += t.type === 'income' ? t.amount : -t.amount));

    return {
      message:
        `✦ **Greetings, Divyang!**\n\n` +
        `I am **Cortex**, your personal AI companion & autonomous system orchestrator.\n\n` +
        `Here is your quick status right now:\n` +
        `• **Circadian Rhythm**: ${activeAlarms} active wake anchor(s) scheduled.\n` +
        `• **Cashflow Net**: **$${net.toFixed(2)}** in ledger.\n` +
        `• **Vault Security**: ${state.isVaultUnlocked ? 'Enclave Unlocked' : 'Enclave Fully Encrypted'}.\n\n` +
        `What can we tackle today? We can chat, manage routines, log spending, brainstorm protocols, or solve anything you need!`,
      action: {
        actionType: 'CONVERSATION',
        badgeTitle: 'Cortex Active',
        badgeDetails: 'System Ready',
        badgeColor: '#6C5CE7',
      },
    };
  }

  // IDENTITY & CAPABILITIES
  if (norm.includes('who are you') || norm.includes('what are you') || norm.includes('what can you do')) {
    return {
      message:
        `✦ **I am Cortex** — Divyang's Personal AI Intelligence.\n\n` +
        `Unlike standard scripted bots, I operate with **full conversational depth** and **autonomous executive control** over your entire application:\n\n` +
        `• ⏰ **Alarms & Wake Anchors**: Tell me "Set alarm at 1:AM morning" or "Turn off morning alarm".\n` +
        `• 💳 **Cashflow & Finances**: Say "Spent $45 on Dinner" or "Analyze my spending".\n` +
        `• 📝 **Notes & Protocols**: Tell me "Note: Retinol 0.5% every Tuesday" or "Find notes about work".\n` +
        `• 🔐 **Encrypted Enclave**: Command "Lock vault" or "Vault security status".\n` +
        `• 🧠 **General Knowledge & Chat**: Ask me anything about coding, science, philosophy, fitness, or life!\n` +
        `• ✦ **Gemini Powered**: You can also connect your own Google Gemini API key using the button in the top bar to unlock live web-scale LLM reasoning!`,
      action: {
        actionType: 'INFO',
        badgeTitle: 'Autonomous Intelligence',
        badgeDetails: 'Full System Authority',
        badgeColor: '#6C5CE7',
      },
    };
  }

  // HUMOR / JOKES
  if (norm.includes('joke') || norm.includes('make me laugh') || norm.includes('funny')) {
    const jokes = [
      `Why do programmers prefer dark mode?\n\nBecause light attracts bugs. And in your app, we keep things at pitch-black \`#050510\` for maximum bug defense! ⚡`,
      `There are 10 types of people in the world:\n\nThose who understand binary, and those who let Cortex set their alarms at 1:00 AM!`,
      `Why did the JavaScript developer wear glasses?\n\nBecause they didn't C#!\n\n*(Luckily, your application is built with pristine TypeScript!)*`,
    ];
    const picked = jokes[Math.floor(Math.random() * jokes.length)];
    return {
      message: `✦ Here is one for you:\n\n${picked}`,
      action: {
        actionType: 'CONVERSATION',
        badgeTitle: 'Neural Humor',
        badgeDetails: 'Generated Joke',
        badgeColor: '#FD79A8',
      },
    };
  }

  // PRODUCTIVITY & WAKING UP
  if (norm.includes('wake up') || norm.includes('morning routine') || norm.includes('sleep') || norm.includes('tired')) {
    return {
      message:
        `✦ **Circadian Optimization Protocol for Divyang**:\n\n` +
        `1. **Consistent Wake Anchors**: Waking at the exact same hour every day sets your master suprachiasmatic clock. Setting an alarm (even at 1:00 AM or 6:30 AM) builds neurological predictability.\n` +
        `2. **Lux Photon Blast**: Within 20 minutes of waking, get 10,000+ lux of sunlight or bright daylight into your eyes to suppress melatonin and trigger a healthy cortisol spike.\n` +
        `3. **Delay Caffeine 90 Minutes**: Let your adenosine clear naturally first. Drinking coffee immediately after waking leads to the dreaded 2:00 PM afternoon crash.\n` +
        `4. **Thermal Reset**: A 2-minute cold shower increases baseline dopamine by 250% for up to 3 hours.\n\n` +
        `Would you like me to set a wake anchor for tomorrow morning?`,
      action: {
        actionType: 'CONVERSATION',
        badgeTitle: 'Circadian Intelligence',
        badgeDetails: 'Bio-Optimization Protocol',
        badgeColor: '#00B894',
        targetBranch: 'alarm',
      },
    };
  }

  // MONEY & FINANCIAL STRATEGY
  if (norm.includes('money') || norm.includes('budget') || norm.includes('save') || norm.includes('wealth')) {
    let income = 0;
    let expenses = 0;
    state.transactions.forEach((t) => {
      if (t.type === 'income') income += t.amount;
      else expenses += t.amount;
    });
    const net = income - expenses;
    const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

    return {
      message:
        `✦ **Financial Intelligence Telemetry**:\n\n` +
        `Based on your active records in Cashflow:\n` +
        `• **Total Inflow**: +$${income.toFixed(2)}\n` +
        `• **Total Outflow**: -$${expenses.toFixed(2)}\n` +
        `• **Net Retained**: **$${net.toFixed(2)}**\n` +
        `• **Savings Velocity**: **${savingsRate}%**\n\n` +
        `**Golden Rules of Capital Accumulation**:\n` +
        `1. *Pay yourself first*: Automate 20% of all incoming revenue into index funds before paying discretionary expenses.\n` +
        `2. *Track daily micro-burn*: Small \$15 recurring purchases compound to \$5,475/year.\n` +
        `3. *Asymmetric upside*: Direct spare capital into high-leverage personal skills.\n\n` +
        `You can tell me anytime: *"Spent $30 on Coffee"* or *"Received $2500 Salary"* and I'll track it automatically!`,
      action: {
        actionType: 'CONVERSATION',
        badgeTitle: 'Financial Intelligence',
        badgeDetails: `Savings Velocity: ${savingsRate}%`,
        badgeColor: '#00B894',
        targetBranch: 'expenses',
      },
    };
  }

  // MOTIVATION & MINDSET
  if (norm.includes('motivat') || norm.includes('inspire') || norm.includes('quote') || norm.includes('lazy')) {
    return {
      message:
        `✦ **Daily Spark for Divyang**:\n\n` +
        `> *"We do not rise to the level of our expectations, we fall to the level of our training and systems."*\n\n` +
        `Discipline is choosing between what you want **now** and what you want **most**.\n` +
        `Your personal system is loaded and ready. Let's execute today!`,
      action: {
        actionType: 'CONVERSATION',
        badgeTitle: 'Mindset Protocol',
        badgeDetails: 'Daily Focus',
        badgeColor: '#6C5CE7',
      },
    };
  }

  return null;
}

export class AiCommandEngine {
  /**
   * Synchronous alias
   */
  static execute(prompt: string, state: AppContextType): AiResponse {
    return this.executeLocal(prompt, state);
  }

  /**
   * Main entry point: tries Gemini API first if configured,
   * otherwise falls back to enhanced Local Neural Cortex.
   */
  static async executeAsync(
    prompt: string,
    state: AppContextType,
    history: { sender: 'user' | 'cortex'; text: string }[] = []
  ): Promise<AiResponse> {
    // 1. Try real Google Gemini 1.5 Flash API first
    try {
      const geminiResult = await GeminiService.chatWithGemini(prompt, history, state);
      if (geminiResult) {
        return {
          message: geminiResult.message,
          action: geminiResult.action,
          isGemini: true,
        };
      }
    } catch (e) {
      console.warn('Gemini dispatch skipped, running local intelligence', e);
    }

    // 2. Execute Local Resilient Neural Cortex
    return this.executeLocal(prompt, state);
  }

  /**
   * Synchronous / offline intelligent engine with resilient NLU
   */
  static executeLocal(prompt: string, state: AppContextType): AiResponse {
    const raw = prompt.trim();
    const norm = normalizeInput(raw);
    const lower = norm.toLowerCase();

    // ─────────────────────────────────────────────────────────────
    // 1. ALARM COMMANDS: CREATE ("SET ALARAM AT 1:AM MORNING")
    // ─────────────────────────────────────────────────────────────
    const alarmData = parseAlarmIntent(raw);
    if (alarmData) {
      const formattedTime = `${alarmData.hour}:${alarmData.minute.toString().padStart(2, '0')}`;
      const hour24 =
        alarmData.period === 'PM' && alarmData.hour !== 12
          ? alarmData.hour + 12
          : alarmData.period === 'AM' && alarmData.hour === 12
          ? 0
          : alarmData.hour;

      state.addAlarm({
        time: formattedTime,
        period: alarmData.period,
        hour: hour24,
        minute: alarmData.minute,
        label: alarmData.label,
        category: alarmData.period === 'AM' ? 'Morning Routine' : 'Focus Session',
        days: [1, 2, 3, 4, 5],
        isEnabled: true,
        sound: 'Over the Horizon (Samsung Brand)',
        volume: 85,
        vibration: 'Basic Call',
        snooze: '5 minutes, 3 times',
      });

      return {
        message:
          `✦ **Alarm Successfully Scheduled!**\n\n` +
          `I have set your wake anchor for **${formattedTime} ${alarmData.period}** labeled **"${alarmData.label}"**.\n\n` +
          `It is active and synchronized into your **Alarms** branch.`,
        action: {
          actionType: 'ALARM_CREATED',
          badgeTitle: `Alarm Set: ${formattedTime} ${alarmData.period}`,
          badgeDetails: alarmData.label,
          badgeColor: '#6C5CE7',
          targetBranch: 'alarm',
        },
      };
    }

    // TOGGLE / TURN OFF ALARM
    if (
      lower.includes('turn off') ||
      lower.includes('disable') ||
      lower.includes('deactivate') ||
      lower.includes('turn on') ||
      lower.includes('enable')
    ) {
      const isEnable = lower.includes('turn on') || lower.includes('enable');
      if (state.alarms.length > 0) {
        const target = state.alarms[0];
        state.toggleAlarm(target.id, isEnable);
        return {
          message: `✦ Wake anchor **${target.time} ${target.period}** (${target.label}) is now **${isEnable ? 'ACTIVE' : 'MUTED'}**.`,
          action: {
            actionType: 'ALARM_TOGGLED',
            badgeTitle: `Alarm ${isEnable ? 'Enabled' : 'Disabled'}`,
            badgeDetails: `${target.time} ${target.period}`,
            badgeColor: isEnable ? '#00B894' : '#6B6B8D',
            targetBranch: 'alarm',
          },
        };
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 2. EXPENSES & CASHFLOW COMMANDS
    // ─────────────────────────────────────────────────────────────
    const expenseMatch = lower.match(/(?:spent|paid|bought|cost|charge|purchase)\s+\$?(\d+(?:\.\d{1,2})?)\s+(?:on|for)\s+(.+)/i);
    const simpleExpenseMatch = lower.match(/(?:spent|paid|bought)\s+\$?(\d+(?:\.\d{1,2})?)/i);

    if (expenseMatch || simpleExpenseMatch) {
      const amount = parseFloat(expenseMatch ? expenseMatch[1] : simpleExpenseMatch![1]);
      let item = expenseMatch ? expenseMatch[2].trim() : 'Daily Expense';
      item = item.replace(/[.!?,]$/, '');

      let category: any = 'Other';
      const itemLower = item.toLowerCase();
      if (/food|coffee|lunch|dinner|breakfast|burger|pizza|starbucks|grocery|groceries|eat/i.test(itemLower)) {
        category = 'Food & Dining';
      } else if (/uber|taxi|gas|fuel|train|bus|metro|flight/i.test(itemLower)) {
        category = 'Transport';
      } else if (/shoes|clothes|shirt|amazon|gadget|watch|buy/i.test(itemLower)) {
        category = 'Shopping';
      } else if (/rent|wifi|electricity|water|bill|subscription|netflix/i.test(itemLower)) {
        category = 'Bills & Utilities';
      } else if (/gym|protein|supplement|doctor|medicine|workout/i.test(itemLower)) {
        category = 'Health & Fitness';
      }

      state.addTransaction({
        title: item.charAt(0).toUpperCase() + item.slice(1),
        amount,
        type: 'expense',
        category,
        dateStr: new Date().toISOString().split('T')[0],
        timeStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });

      return {
        message:
          `✦ **Expenditure Recorded!**\n\n` +
          `Deducted **-$${amount.toFixed(2)}** for **"${item}"** categorized under *${category}*.\n\n` +
          `Your Cashflow balance and analytics have been updated.`,
        action: {
          actionType: 'EXPENSE_LOGGED',
          badgeTitle: `-$${amount.toFixed(2)} ${item}`,
          badgeDetails: category,
          badgeColor: '#FD79A8',
          targetBranch: 'expenses',
        },
      };
    }

    // INCOME: "received $2500 salary", "got paid 1500"
    const incomeMatch = lower.match(/(?:earned|received|got\s+paid|deposit|income|salary)\s+\$?(\d+(?:\.\d{1,2})?)/i);
    if (incomeMatch) {
      const amount = parseFloat(incomeMatch[1]);
      const title = lower.includes('salary') ? 'Monthly Salary' : lower.includes('freelance') ? 'Freelance Client' : 'Inflow Deposit';

      state.addTransaction({
        title,
        amount,
        type: 'income',
        category: 'Salary & Work',
        dateStr: new Date().toISOString().split('T')[0],
        timeStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });

      return {
        message:
          `✦ **Inflow Credited!**\n\n` +
          `Added **+$${amount.toFixed(2)}** (${title}) to your liquid balance.\n\n` +
          `Your financial runway has been recalculated.`,
        action: {
          actionType: 'INCOME_LOGGED',
          badgeTitle: `+$${amount.toFixed(2)} ${title}`,
          badgeDetails: 'Cashflow Credited',
          badgeColor: '#00B894',
          targetBranch: 'expenses',
        },
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 3. NOTES & PROTOCOLS
    // ─────────────────────────────────────────────────────────────
    if (
      lower.startsWith('note:') ||
      lower.startsWith('note ') ||
      lower.startsWith('remember ') ||
      lower.startsWith('write down ') ||
      lower.includes('add note')
    ) {
      let body = raw
        .replace(/^note:\s*/i, '')
        .replace(/^note\s+/i, '')
        .replace(/^remember\s+/i, '')
        .replace(/^write down\s+/i, '')
        .replace(/^add note\s+/i, '')
        .trim();

      const parts = body.split(/[:\n-]/);
      const title = parts[0]?.trim() || 'New Protocol';
      const content = parts.slice(1).join(' ').trim() || body;

      state.addNote({
        title,
        content,
        category: 'Protocols',
        isPinned: false,
      });

      return {
        message:
          `✦ **Note Encrypted & Stored!**\n\n` +
          `Created entry **"${title}"**.\n\n` +
          `You can view and edit it anytime in the **Notes** branch.`,
        action: {
          actionType: 'NOTE_CREATED',
          badgeTitle: title,
          badgeDetails: 'Stored in Protocols',
          badgeColor: '#FD79A8',
          targetBranch: 'notes',
        },
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 4. VAULT COMMANDS
    // ─────────────────────────────────────────────────────────────
    if (lower.includes('lock vault') || lower.includes('lock the vault') || lower.includes('lock down')) {
      state.lockVault();
      return {
        message: `✦ **Enclave Secured!**\n\nYour Secret Vault has been locked down. Biometric or PIN authorization is required to access private media.`,
        action: {
          actionType: 'VAULT_LOCKED',
          badgeTitle: 'Enclave Locked',
          badgeDetails: 'AES-256 Lockdown Engaged',
          badgeColor: '#FDCB6E',
          targetBranch: 'vault',
        },
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 5. SYSTEM BRIEFING & TELEMETRY
    // ─────────────────────────────────────────────────────────────
    if (lower.includes('briefing') || lower.includes('system status') || lower.includes('overview') || lower.includes('daily summary')) {
      const activeAlarms = state.alarms.filter((a) => a.isEnabled);
      let income = 0;
      let expenses = 0;
      state.transactions.forEach((t) => {
        if (t.type === 'income') income += t.amount;
        else expenses += t.amount;
      });
      const net = income - expenses;

      return {
        message:
          `✦ **System Briefing & Live Diagnostics**\n\n` +
          `• **Circadian Anchors**: ${activeAlarms.length} active wake anchor(s). Next scheduled: ${activeAlarms[0]?.time || 'None'} ${activeAlarms[0]?.period || ''}.\n` +
          `• **Cashflow**: Net total **$${net.toFixed(2)}** (+$${income.toFixed(2)} inflow | -$${expenses.toFixed(2)} burn).\n` +
          `• **Protocols**: ${state.notes.length} notes logged.\n` +
          `• **Secret Enclave**: ${state.vaultItems.length} private items (${state.isVaultUnlocked ? 'Unlocked' : 'Locked'}).\n\n` +
          `All system branches are synchronized and operational.`,
        action: {
          actionType: 'SYSTEM_BRIEFING',
          badgeTitle: 'Full Diagnostic',
          badgeDetails: '4 Branches Synchronized',
          badgeColor: '#6C5CE7',
        },
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 6. MATH & CALCULATIONS
    // ─────────────────────────────────────────────────────────────
    const mathMatch = lower.match(/(?:calculate|what is|compute|solve)\s+([0-9+\-*/().\s%]+)/i);
    if (mathMatch) {
      try {
        const expression = mathMatch[1].replace(/%/g, '*0.01');
        // eslint-disable-next-line no-eval
        const result = Function(`'use strict'; return (${expression})`)();
        if (typeof result === 'number' && !isNaN(result)) {
          return {
            message: `✦ Computation result:\n\n**${mathMatch[1].trim()} = ${result.toLocaleString()}**`,
            action: {
              actionType: 'MATH_CALCULATED',
              badgeTitle: `Result: ${result}`,
              badgeDetails: mathMatch[1].trim(),
              badgeColor: '#6C5CE7',
            },
          };
        }
      } catch (e) {}
    }

    // ─────────────────────────────────────────────────────────────
    // 7. CONVERSATIONAL INTELLIGENCE (CHAT LIKE GEMINI)
    // ─────────────────────────────────────────────────────────────
    const conversational = getConversationalResponse(lower, raw, state);
    if (conversational) {
      return conversational;
    }

    // ─────────────────────────────────────────────────────────────
    // 8. DYNAMIC INTELLIGENT FALLBACK (NO GENERIC "COMMAND RECEIVED")
    // ─────────────────────────────────────────────────────────────
    return {
      message:
        `✦ I am on it, Divyang! Regarding: **"${raw}"**.\n\n` +
        `I am your autonomous neural operating core. I can chat, discuss ideas, or command any part of your app:\n\n` +
        `• ⏰ **Set an alarm**: *"Set alarm at 1:AM morning"*, *"Wake me up at 6:30"*.\n` +
        `• 💳 **Track cash**: *"Spent $25 on groceries"*, *"Received $1200 salary"*.\n` +
        `• 📝 **Take notes**: *"Note: Read Chapter 4 of Deep Work"*.\n` +
        `• 🔐 **Secure vault**: *"Lock vault"*.\n` +
        `• 💬 **Chat & Learn**: Ask me anything or tap **[✦ Gemini API]** at the top to connect your personal Google Gemini API key!`,
      action: {
        actionType: 'CONVERSATION',
        badgeTitle: 'Cortex Reasoning',
        badgeDetails: 'Ready for Next Prompt',
        badgeColor: '#6C5CE7',
      },
    };
  }
}
