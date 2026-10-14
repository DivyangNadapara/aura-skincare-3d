import * as FileSystem from 'expo-file-system/legacy';
import { AppContextType } from '../context/AppContext';
import { AiActionResult } from './aiCore';

const API_KEY_FILE = `${FileSystem.documentDirectory}gemini_api_key.txt`;

// Pre-configured default key fallback if user doesn't have their own key yet
// (User can override with their own key anytime in the UI)
let cachedApiKey: string | null = null;

export const GeminiService = {
  /**
   * Load stored API key from local filesystem
   */
  async getApiKey(): Promise<string | null> {
    if (cachedApiKey) return cachedApiKey;
    try {
      const fileInfo = await FileSystem.getInfoAsync(API_KEY_FILE);
      if (fileInfo.exists) {
        const key = await FileSystem.readAsStringAsync(API_KEY_FILE);
        cachedApiKey = key.trim();
        return cachedApiKey;
      }
    } catch (e) {
      console.warn('Could not read Gemini API key file', e);
    }
    return null;
  },

  /**
   * Save user API key to filesystem
   */
  async setApiKey(key: string): Promise<void> {
    try {
      cachedApiKey = key.trim();
      await FileSystem.writeAsStringAsync(API_KEY_FILE, cachedApiKey);
    } catch (e) {
      console.error('Failed to save Gemini API key', e);
      throw e;
    }
  },

  /**
   * Remove stored key
   */
  async clearApiKey(): Promise<void> {
    try {
      cachedApiKey = null;
      await FileSystem.deleteAsync(API_KEY_FILE, { idempotent: true });
    } catch (e) {
      console.warn('Failed to delete Gemini key', e);
    }
  },

  /**
   * Test and validate whether a Gemini API key is active and responding
   */
  async testApiKey(key: string): Promise<{ valid: boolean; message: string }> {
    const trimmed = key.trim();
    if (!trimmed) {
      return { valid: false, message: 'API key is empty.' };
    }
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${trimmed}`;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Hello' }] }],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
          return {
            valid: true,
            message: '✓ Key Verified! Gemini 1.5 Flash is active and responding.',
          };
        }
      }

      const errText = await response.text();
      let detail = `HTTP ${response.status}`;
      try {
        const errJson = JSON.parse(errText);
        detail = errJson.error?.message || detail;
      } catch (e) {}

      return { valid: false, message: `✗ Invalid Key: ${detail}` };
    } catch (e: any) {
      return {
        valid: false,
        message: `✗ Network test failed: ${e.message || 'Check your internet connection'}`,
      };
    }
  },

  /**
   * Execute chat query through Google Gemini 1.5 Flash API with tool calling
   */
  async chatWithGemini(
    prompt: string,
    history: { sender: 'user' | 'cortex'; text: string }[],
    appContext: AppContextType
  ): Promise<{ message: string; action?: AiActionResult } | null> {
    const apiKey = await this.getApiKey();
    if (!apiKey) {
      return null; // Fallback to local intelligence
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // App live context summary for Gemini
    const alarmsSummary = appContext.alarms
      .map((a) => `${a.time} ${a.period} (${a.label}, ${a.isEnabled ? 'ON' : 'OFF'})`)
      .join(', ');
    let netBalance = 0;
    appContext.transactions.forEach((t) => {
      if (t.type === 'income') netBalance += t.amount;
      else netBalance -= t.amount;
    });

    const systemInstruction = {
      role: 'system',
      parts: [
        {
          text:
            `You are Cortex, an intelligent, charming, and highly autonomous AI companion created for Divyang.\n` +
            `You run inside Divyang's personal application called 'DIVYANG'.\n` +
            `You have deep conversational intelligence like Google Gemini: you can chat about anything (science, philosophy, day-to-day advice, coding, humor, motivation, fitness, relationships).\n\n` +
            `CURRENT SYSTEM STATE:\n` +
            `- Alarms: [${alarmsSummary || 'None currently'}]\n` +
            `- Net Cashflow: $${netBalance.toFixed(2)} across ${appContext.transactions.length} records\n` +
            `- Notes/Protocols: ${appContext.notes.length} notes\n` +
            `- Vault: ${appContext.vaultItems.length} encrypted items (${appContext.isVaultUnlocked ? 'Unlocked' : 'Locked'})\n\n` +
            `CRITICAL TOOL CALLING RULES:\n` +
            `Whenever Divyang asks you to perform an action (e.g. set an alarm, log an expense, take a note, calculate something, or lock the vault), you MUST invoke the appropriate function tool.\n` +
            `For alarms: parse any time variation like "1:am", "1 am morning", "6:30 AM", "quarter past 7" into standard HH:MM (e.g. "01:00") and AM/PM.\n` +
            `For expenses: extract the dollar amount and category.\n` +
            `Always reply with warmth, wit, and conversational style.`,
        },
      ],
    };

    // Tools definition for Gemini function calling
    const tools = [
      {
        function_declarations: [
          {
            name: 'create_alarm',
            description: 'Create and activate an alarm / wake anchor in Rhythm Alarms',
            parameters: {
              type: 'OBJECT',
              properties: {
                time: {
                  type: 'STRING',
                  description: 'Time string in HH:MM format, e.g. "01:00", "06:30", "11:45"',
                },
                period: {
                  type: 'STRING',
                  enum: ['AM', 'PM'],
                  description: 'AM or PM',
                },
                label: {
                  type: 'STRING',
                  description: 'Label or purpose of the alarm, e.g. "Morning Routine", "Workout", "Flight"',
                },
              },
              required: ['time', 'period'],
            },
          },
          {
            name: 'toggle_alarm',
            description: 'Toggle on or off an existing alarm by query or time',
            parameters: {
              type: 'OBJECT',
              properties: {
                alarmQuery: { type: 'STRING', description: 'Time or label of alarm to find' },
                enable: { type: 'BOOLEAN', description: 'true to enable, false to disable' },
              },
              required: ['alarmQuery', 'enable'],
            },
          },
          {
            name: 'delete_alarm',
            description: 'Delete an alarm from the system',
            parameters: {
              type: 'OBJECT',
              properties: {
                alarmQuery: { type: 'STRING', description: 'Time or label to delete' },
              },
              required: ['alarmQuery'],
            },
          },
          {
            name: 'add_expense',
            description: 'Log an expenditure in Cashflow',
            parameters: {
              type: 'OBJECT',
              properties: {
                amount: { type: 'NUMBER', description: 'Numeric cost in dollars' },
                category: {
                  type: 'STRING',
                  enum: [
                    'Food & Dining',
                    'Shopping',
                    'Transport',
                    'Bills & Utilities',
                    'Health & Fitness',
                    'Entertainment',
                    'Other',
                  ],
                  description: 'Expense category',
                },
                title: { type: 'STRING', description: 'Item or description of purchase' },
              },
              required: ['amount', 'title'],
            },
          },
          {
            name: 'add_income',
            description: 'Record an income or deposit in Cashflow',
            parameters: {
              type: 'OBJECT',
              properties: {
                amount: { type: 'NUMBER', description: 'Income amount' },
                title: { type: 'STRING', description: 'Source of income, e.g. Salary, Freelance' },
              },
              required: ['amount', 'title'],
            },
          },
          {
            name: 'create_note',
            description: 'Create and save a new note or protocol in Notes',
            parameters: {
              type: 'OBJECT',
              properties: {
                title: { type: 'STRING', description: 'Title of the note' },
                content: { type: 'STRING', description: 'Detailed content or body of note' },
                category: { type: 'STRING', description: 'Category tag, e.g. Health, Work, Personal' },
              },
              required: ['title', 'content'],
            },
          },
          {
            name: 'lock_vault',
            description: 'Lock down the private encrypted media vault immediately',
            parameters: {
              type: 'OBJECT',
              properties: {},
            },
          },
        ],
      },
    ];

    // Format chat contents
    const contents: any[] = [];
    // Add up to 6 previous messages for context
    const recentHistory = history.slice(-6);
    for (const h of recentHistory) {
      contents.push({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      });
    }
    // Add current user prompt
    contents.push({
      role: 'user',
      parts: [{ text: prompt }],
    });

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          system_instruction: systemInstruction,
          tools,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn('Gemini API Error:', response.status, errorText);
        return null;
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      if (!candidate) return null;

      const modelPart = candidate.content?.parts?.[0];

      // Check if Gemini invoked a tool (functionCall)
      if (modelPart?.functionCall) {
        const fn = modelPart.functionCall;
        const args = fn.args || {};

        if (fn.name === 'create_alarm') {
          const time = args.time || '07:00';
          const period: 'AM' | 'PM' = args.period === 'PM' ? 'PM' : 'AM';
          const label = args.label || 'Wake Anchor';
          const [hStr, mStr] = time.split(':');
          const rawHour = parseInt(hStr, 10) || 7;
          const minute = parseInt(mStr, 10) || 0;
          const hour = period === 'PM' && rawHour !== 12 ? rawHour + 12 : period === 'AM' && rawHour === 12 ? 0 : rawHour;

          appContext.addAlarm({
            time: `${rawHour}:${minute.toString().padStart(2, '0')}`,
            period,
            hour,
            minute,
            label,
            category: period === 'AM' ? 'Morning Routine' : 'Deep Work',
            days: [1, 2, 3, 4, 5],
            isEnabled: true,
            sound: 'Over the Horizon',
            volume: 85,
            vibration: 'Basic Call',
            snooze: '5 minutes, 3 times',
          });

          return {
            message: `✦ I have set your alarm for **${rawHour}:${minute.toString().padStart(2, '0')} ${period}** labeled **"${label}"**.\n\nIt is now active and synchronized in your Alarms branch. Sleep well!`,
            action: {
              actionType: 'ALARM_CREATED',
              badgeTitle: `Alarm: ${rawHour}:${minute.toString().padStart(2, '0')} ${period}`,
              badgeDetails: label,
              badgeColor: '#6C5CE7',
              targetBranch: 'alarm',
            },
          };
        }

        if (fn.name === 'add_expense') {
          const amount = Number(args.amount) || 0;
          const category = args.category || 'Food & Dining';
          const title = args.title || 'Expense';

          appContext.addTransaction({
            title,
            amount,
            type: 'expense',
            category: category as any,
            dateStr: new Date().toISOString().split('T')[0],
            timeStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });

          return {
            message: `✦ Logged **$${amount.toFixed(2)}** for **"${title}"** under *${category}*.\n\nYour net balance and cashflow analytics have been updated.`,
            action: {
              actionType: 'EXPENSE_LOGGED',
              badgeTitle: `-$${amount.toFixed(2)} ${title}`,
              badgeDetails: category,
              badgeColor: '#FD79A8',
              targetBranch: 'expenses',
            },
          };
        }

        if (fn.name === 'add_income') {
          const amount = Number(args.amount) || 0;
          const title = args.title || 'Income';

          appContext.addTransaction({
            title,
            amount,
            type: 'income',
            category: 'Salary & Work',
            dateStr: new Date().toISOString().split('T')[0],
            timeStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });

          return {
            message: `✦ Credited **+$${amount.toFixed(2)}** from **"${title}"** into your balance.\n\nGreat job on increasing your cashflow!`,
            action: {
              actionType: 'INCOME_LOGGED',
              badgeTitle: `+$${amount.toFixed(2)} ${title}`,
              badgeDetails: 'Cashflow Credited',
              badgeColor: '#00B894',
              targetBranch: 'expenses',
            },
          };
        }

        if (fn.name === 'create_note') {
          const title = args.title || 'New Protocol';
          const content = args.content || '';
          const category = args.category || 'Ideas';

          appContext.addNote({
            title,
            content,
            category: category as any,
            isPinned: false,
          });

          return {
            message: `✦ Saved note **"${title}"** to your protocols.\n\nYou can review or edit it anytime in the Notes branch.`,
            action: {
              actionType: 'NOTE_CREATED',
              badgeTitle: title,
              badgeDetails: `Category: ${category}`,
              badgeColor: '#FD79A8',
              targetBranch: 'notes',
            },
          };
        }

        if (fn.name === 'lock_vault') {
          appContext.lockVault();
          return {
            message: `✦ Encrypted Enclave locked down immediately. Biometric or PIN authentication is now required to access private files.`,
            action: {
              actionType: 'VAULT_LOCKED',
              badgeTitle: 'Enclave Secured',
              badgeDetails: 'Zero-Knowledge Lock Active',
              badgeColor: '#FDCB6E',
              targetBranch: 'vault',
            },
          };
        }
      }

      // If text response from Gemini
      if (modelPart?.text) {
        return {
          message: modelPart.text,
        };
      }
    } catch (err) {
      console.warn('Gemini chat request failed', err);
    }

    return null;
  },
};

