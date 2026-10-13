import './style.css';

// ============================================================================
// SAMSUNG AUDIO FEEDBACK (Tactile Galaxy Synthesizer)
// ============================================================================
class SamsungAudioFeedback {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playClick(type = 'toggle') {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const now = this.ctx.currentTime;

      if (type === 'toggle') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'tap') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.03);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      } else if (type === 'save') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880.00, now + 0.06); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  }
}

const audio = new SamsungAudioFeedback();

// Toast Helper
function showToast(message) {
  let toast = document.querySelector('.toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

// ============================================================================
// APP NAVIGATION: HOME BRANCH SELECTION & ROUTING
// ============================================================================
let currentScreen = 'home'; // 'home' | 'alarm' | 'notes'

function navigateToScreen(screenName) {
  audio.playClick('tap');
  currentScreen = screenName;

  const screens = {
    home: document.getElementById('screen-home'),
    alarm: document.getElementById('screen-alarm'),
    notes: document.getElementById('screen-notes'),
  };

  Object.entries(screens).forEach(([key, el]) => {
    if (el) el.classList.toggle('active', key === screenName);
  });

  // Update bottom navigation tabs
  const bottomTabs = document.querySelectorAll('.android-tab-item');
  bottomTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.nav === screenName);
  });

  // Keep home badges synchronized
  updateHomeBadges();
}

function updateHomeBadges() {
  const activeAlarms = alarms.filter(a => a.isEnabled).length;
  const alarmBadge = document.getElementById('home-alarm-badge');
  const alarmNextTime = document.getElementById('home-alarm-next-time');
  if (alarmBadge) {
    alarmBadge.textContent = `${activeAlarms} Active`;
  }
  if (alarmNextTime) {
    alarmNextTime.textContent = activeAlarms > 0 ? 'Next: 7:30 AM (in 4h 15m)' : 'All alarms paused';
  }

  const notesBadge = document.getElementById('home-notes-badge');
  if (notesBadge) {
    notesBadge.textContent = `${notes.length} ${notes.length === 1 ? 'Note' : 'Notes'}`;
  }
}

// ============================================================================
// BRANCH 1: ALARMS & RHYTHM LOGIC
// ============================================================================
const SAMSUNG_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

let alarms = [
  {
    id: 'alarm-1',
    time: '07:30',
    period: 'AM',
    hour: 7,
    minute: 30,
    label: 'Morning Sunlight & Hydration',
    category: 'Morning Routine',
    days: [0, 1, 2, 3, 4, 5, 6],
    isEnabled: true,
    isExpanded: false,
    sound: 'Morning Flower',
    vibration: 'Basic call',
    snooze: '5 minutes, 3 times',
  },
  {
    id: 'alarm-2',
    time: '01:30',
    period: 'PM',
    hour: 1,
    minute: 30,
    label: 'Afternoon Focus & Supplements',
    category: 'Deep Work',
    days: [1, 2, 3, 4, 5],
    isEnabled: true,
    isExpanded: false,
    sound: 'Over the Horizon (Samsung Brand)',
    vibration: 'Heartbeat',
    snooze: '5 minutes, 3 times',
  },
  {
    id: 'alarm-3',
    time: '10:15',
    period: 'PM',
    hour: 10,
    minute: 15,
    label: 'Cortisol Drop & Night Protocol',
    category: 'Recovery',
    days: [0, 1, 2, 3, 4, 5, 6],
    isEnabled: false,
    isExpanded: false,
    sound: 'Homecoming',
    vibration: 'Ticktock',
    snooze: 'Off',
  },
];

let newAlarmHour = 7;
let newAlarmMin = 30;
let newAlarmPeriod = 'AM';
let newAlarmDays = [1, 2, 3, 4, 5];

function updateHeaderSubtitle() {
  const activeCount = alarms.filter(a => a.isEnabled).length;
  const subtitleEl = document.getElementById('samsung-alarm-subtitle');
  if (subtitleEl) {
    subtitleEl.textContent = activeCount === 0 ? 'All alarms off' : 'Next alarm in 4 hours 15 minutes';
  }
  updateHomeBadges();
}

function renderSamsungAlarmCards() {
  const container = document.getElementById('alarm-cards-list');
  if (!container) return;
  container.innerHTML = '';

  alarms.forEach((alarm) => {
    const card = document.createElement('article');
    card.className = `samsung-card ${alarm.isEnabled ? 'is-active' : 'is-inactive'} ${alarm.isExpanded ? 'is-expanded' : ''}`;
    card.dataset.id = alarm.id;

    const daysHtml = SAMSUNG_DAYS.map((dayLabel, index) => {
      const isSelected = alarm.days.includes(index);
      return `<span class="samsung-day-chip ${isSelected ? 'active' : ''}">${dayLabel}</span>`;
    }).join('');

    card.innerHTML = `
      <div class="samsung-card-inner">
        <div class="card-left-info">
          <div class="samsung-time-row">
            <span class="samsung-time-digits">${alarm.time}</span>
            <span class="samsung-time-period">${alarm.period}</span>
          </div>
          <div class="samsung-card-label">${alarm.label}</div>
          <div class="samsung-days-row">
            ${daysHtml}
          </div>
        </div>

        <label class="samsung-switch" aria-label="Toggle alarm">
          <input type="checkbox" class="alarm-toggle-input" ${alarm.isEnabled ? 'checked' : ''} />
          <span class="samsung-switch-track"></span>
        </label>
      </div>

      <!-- Expandable Samsung Drawer -->
      <div class="samsung-card-drawer">
        <div class="samsung-drawer-inner">
          <div class="drawer-row">
            <span class="drawer-row-label">Category</span>
            <span class="drawer-row-val accent">${alarm.category}</span>
          </div>
          <div class="drawer-row">
            <span class="drawer-row-label">Ringtone</span>
            <span class="drawer-row-val">${alarm.sound}</span>
          </div>
          <div class="drawer-row">
            <span class="drawer-row-label">Vibration</span>
            <span class="drawer-row-val">${alarm.vibration}</span>
          </div>
          <div class="drawer-row">
            <span class="drawer-row-label">Snooze</span>
            <span class="drawer-row-val">${alarm.snooze}</span>
          </div>
          <button class="samsung-delete-btn" data-delete-id="${alarm.id}">Delete Alarm</button>
        </div>
      </div>
    `;

    // Toggle switch interaction
    const toggleInput = card.querySelector('.alarm-toggle-input');
    toggleInput?.addEventListener('change', (e) => {
      e.stopPropagation();
      audio.playClick('toggle');
      alarm.isEnabled = toggleInput.checked;
      card.classList.toggle('is-active', alarm.isEnabled);
      card.classList.toggle('is-inactive', !alarm.isEnabled);
      updateHeaderSubtitle();
      showToast(alarm.isEnabled ? `Alarm set for ${alarm.time} ${alarm.period}` : 'Alarm paused');
    });

    // Expand / collapse drawer
    const cardInner = card.querySelector('.samsung-card-inner');
    cardInner?.addEventListener('click', (e) => {
      if (e.target.closest('.samsung-switch')) return;
      audio.playClick('tap');
      alarm.isExpanded = !alarm.isExpanded;
      card.classList.toggle('is-expanded', alarm.isExpanded);
    });

    // Delete alarm button
    const deleteBtn = card.querySelector('.samsung-delete-btn');
    deleteBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      audio.playClick('tap');
      alarms = alarms.filter(a => a.id !== alarm.id);
      renderSamsungAlarmCards();
      updateHeaderSubtitle();
      showToast('Alarm deleted');
    });

    container.appendChild(card);
  });
}

function openAlarmModal() {
  audio.playClick('tap');
  document.getElementById('modal-backdrop')?.classList.add('is-open');
}

function closeAlarmModal() {
  audio.playClick('tap');
  document.getElementById('modal-backdrop')?.classList.remove('is-open');
}

function updateModalWheelDisplay() {
  const hourEl = document.getElementById('val-hour');
  const minEl = document.getElementById('val-min');
  const hPrev = document.getElementById('h-prev');
  const hNext = document.getElementById('h-next');
  const mPrev = document.getElementById('m-prev');
  const mNext = document.getElementById('m-next');

  if (hourEl) hourEl.textContent = newAlarmHour.toString().padStart(2, '0');
  if (minEl) minEl.textContent = newAlarmMin.toString().padStart(2, '0');

  const prevH = newAlarmHour === 1 ? 12 : newAlarmHour - 1;
  const nextH = newAlarmHour === 12 ? 1 : newAlarmHour + 1;
  if (hPrev) hPrev.textContent = prevH.toString().padStart(2, '0');
  if (hNext) hNext.textContent = nextH.toString().padStart(2, '0');

  const prevM = (newAlarmMin - 5 + 60) % 60;
  const nextM = (newAlarmMin + 5) % 60;
  if (mPrev) mPrev.textContent = prevM.toString().padStart(2, '0');
  if (mNext) mNext.textContent = nextM.toString().padStart(2, '0');

  const amBtn = document.getElementById('btn-period-am');
  const pmBtn = document.getElementById('btn-period-pm');
  if (amBtn && pmBtn) {
    amBtn.classList.toggle('active', newAlarmPeriod === 'AM');
    pmBtn.classList.toggle('active', newAlarmPeriod === 'PM');
  }
}

function updateModalRepeatSummary() {
  const summary = document.getElementById('repeat-summary');
  if (!summary) return;
  if (newAlarmDays.length === 7) summary.textContent = 'Every day';
  else if (newAlarmDays.length === 5 && !newAlarmDays.includes(0) && !newAlarmDays.includes(6)) summary.textContent = 'Every weekday';
  else if (newAlarmDays.length === 2 && newAlarmDays.includes(0) && newAlarmDays.includes(6)) summary.textContent = 'Weekends';
  else if (newAlarmDays.length === 0) summary.textContent = 'Never';
  else summary.textContent = `${newAlarmDays.length} days selected`;
}

function saveAlarmAction() {
  const nameInput = document.getElementById('input-alarm-name');
  const toneSelect = document.getElementById('select-alarm-tone');
  const vibrationToggle = document.getElementById('modal-vibration-toggle');

  const label = (nameInput?.value.trim()) || 'Alarm';
  const sound = toneSelect?.value || 'Over the Horizon (Samsung Brand)';
  const vibration = vibrationToggle?.checked ? 'Basic call' : 'Off';

  const newAlarm = {
    id: `alarm-${Date.now()}`,
    time: `${newAlarmHour.toString().padStart(2, '0')}:${newAlarmMin.toString().padStart(2, '0')}`,
    period: newAlarmPeriod,
    hour: newAlarmHour,
    minute: newAlarmMin,
    label,
    category: 'Morning Routine',
    days: newAlarmDays.length > 0 ? [...newAlarmDays] : [0, 1, 2, 3, 4, 5, 6],
    isEnabled: true,
    isExpanded: false,
    sound,
    vibration,
    snooze: '5 minutes, 3 times',
  };

  alarms.unshift(newAlarm);
  audio.playClick('save');
  renderSamsungAlarmCards();
  updateHeaderSubtitle();
  closeAlarmModal();
  showToast(`Alarm saved: ${newAlarm.time} ${newAlarmPeriod}`);

  if (nameInput) nameInput.value = '';
}

// ============================================================================
// BRANCH 2: NOTES & PROTOCOLS LOGIC (Create, Edit, Save, Add Images)
// ============================================================================
let notes = [
  {
    id: 'note-1',
    title: 'Morning Photobiology & Dopamine Baseline',
    content: 'View 10-15 minutes of early sunlight directly without sunglasses within 1 hour of waking. Increases daytime cortisol spike by 50% and anchors evening melatonin onset ~14 hours later.\n\nHydration stack:\n- 500ml filtered water with 1/4 tsp Himalayan salt\n- 100mg L-Theanine before espresso',
    category: 'Circadian Protocol',
    isPinned: true,
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    ],
    updatedAt: 'Today, 8:12 AM',
  },
  {
    id: 'note-2',
    title: '90-Min Ultradian Deep Work Protocol',
    content: 'Brain operates in 90-minute ultradian focus rhythms. \n1. Min 0-10: friction warmup (resist switching).\n2. Min 10-75: peak neural flow and code architecture.\n3. Min 75-90: cognitive taper; record next session anchor point.\n\nKeep phone in other room.',
    category: 'Deep Work',
    isPinned: true,
    images: [
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80',
    ],
    updatedAt: 'Yesterday, 3:45 PM',
  },
  {
    id: 'note-3',
    title: 'Sleep Architecture & Cortisol Downregulation',
    content: 'Bedroom temperature at 18.5°C (65°F). Stop caloric intake 3 hours prior to bed. Dim overhead ambient lighting after 9:00 PM; switch to red spectrum.\n\nNight stack test:\n- Magnesium L-Threonate: 140mg\n- Apigenin: 50mg',
    category: 'Recovery & Sleep',
    isPinned: false,
    images: [
      'https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=600&q=80',
    ],
    updatedAt: 'Oct 12, 10:45 PM',
  },
];

let notesFilterCategory = 'All';
let notesSearchQuery = '';
let activeEditingNoteId = null; // null if creating a new note
let activeEditingImages = [];
let activeEditingIsPinned = false;
let activeEditingCategory = 'Circadian Protocol';

// Render Notes Cards
function renderSamsungNotesCards() {
  const container = document.getElementById('samsung-notes-cards-list');
  const countSubtitle = document.getElementById('samsung-notes-count-subtitle');
  if (!container) return;

  const filtered = notes.filter((n) => {
    const matchesCat = notesFilterCategory === 'All' || n.category === notesFilterCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(notesSearchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(notesSearchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (countSubtitle) {
    countSubtitle.textContent = `${filtered.length} ${filtered.length === 1 ? 'note' : 'notes'}`;
  }

  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: #8D92A4;">
        <div style="font-size: 32px; margin-bottom: 8px;">📝</div>
        <p style="font-size: 14px; font-weight: 600;">No notes found</p>
        <p style="font-size: 12px; color: #5B6072; margin-top: 4px;">Tap ✍️ to write your first note</p>
      </div>
    `;
    return;
  }

  filtered.forEach((note) => {
    const card = document.createElement('article');
    card.className = 'samsung-note-card';
    card.dataset.id = note.id;

    // Images gallery preview
    let imagesHtml = '';
    if (note.images && note.images.length > 0) {
      const thumbs = note.images.slice(0, 2).map(imgUrl => `
        <img src="${imgUrl}" alt="Attachment preview" class="note-thumb-preview" />
      `).join('');
      imagesHtml = `<div class="note-images-gallery">${thumbs}</div>`;
    }

    card.innerHTML = `
      <div class="note-meta-top">
        <span class="note-cat-badge">${note.category}</span>
        ${note.isPinned ? `<span class="note-pin-badge"><span>📌</span> Pinned</span>` : ''}
      </div>

      <h3 class="note-card-title">${note.title}</h3>

      ${imagesHtml}

      <p class="note-card-snippet">${note.content}</p>

      <div class="note-card-footer">
        <span>${note.updatedAt}</span>
        ${
          note.images && note.images.length > 0
            ? `<span class="note-img-count"><span>🖼️</span> ${note.images.length}</span>`
            : ''
        }
      </div>
    `;

    // Click note to EDIT
    card.addEventListener('click', () => {
      openNoteEditor(note);
    });

    container.appendChild(card);
  });

  updateHomeBadges();
}

// Open Note Editor (Create or Edit)
function openNoteEditor(noteToEdit = null) {
  audio.playClick('tap');
  const modal = document.getElementById('note-editor-backdrop');
  const titleInput = document.getElementById('editor-note-title');
  const contentInput = document.getElementById('editor-note-content');
  const titleText = document.getElementById('editor-title-text');
  const deleteBtn = document.getElementById('btn-delete-active-note');

  if (!modal) return;

  if (noteToEdit) {
    activeEditingNoteId = noteToEdit.id;
    activeEditingImages = [...(noteToEdit.images || [])];
    activeEditingIsPinned = !!noteToEdit.isPinned;
    activeEditingCategory = noteToEdit.category;
    if (titleInput) titleInput.value = noteToEdit.title;
    if (contentInput) contentInput.value = noteToEdit.content;
    if (titleText) titleText.textContent = 'Edit note';
    if (deleteBtn) deleteBtn.style.display = 'block';
  } else {
    activeEditingNoteId = null;
    activeEditingImages = [];
    activeEditingIsPinned = false;
    activeEditingCategory = 'Circadian Protocol';
    if (titleInput) titleInput.value = '';
    if (contentInput) contentInput.value = '';
    if (titleText) titleText.textContent = 'New note';
    if (deleteBtn) deleteBtn.style.display = 'none';
  }

  // Update pin button state
  updateEditorPinState();

  // Update category chips state
  const catChips = document.querySelectorAll('#editor-cat-chips .editor-cat-chip');
  catChips.forEach(chip => {
    chip.classList.toggle('active', chip.dataset.cat === activeEditingCategory);
  });

  // Render attached thumbnails
  renderEditorThumbnails();

  modal.classList.add('is-open');
}

function closeNoteEditor() {
  audio.playClick('tap');
  document.getElementById('note-editor-backdrop')?.classList.remove('is-open');
}

function updateEditorPinState() {
  const pinIcon = document.getElementById('editor-pin-icon');
  const pinLabel = document.getElementById('editor-pin-label');
  if (pinIcon) pinIcon.textContent = activeEditingIsPinned ? '📌' : '📍';
  if (pinLabel) pinLabel.textContent = activeEditingIsPinned ? 'Pinned' : 'Pin note';
}

function renderEditorThumbnails() {
  const tray = document.getElementById('editor-images-tray');
  const row = document.getElementById('editor-thumbnails-row');
  const countSpan = document.getElementById('editor-images-count');

  if (!tray || !row) return;

  if (countSpan) countSpan.textContent = activeEditingImages.length;

  if (activeEditingImages.length === 0) {
    tray.style.display = 'none';
    row.innerHTML = '';
    return;
  }

  tray.style.display = 'flex';
  row.innerHTML = '';

  activeEditingImages.forEach((imgUrl, idx) => {
    const thumbBox = document.createElement('div');
    thumbBox.className = 'thumb-card-item';
    thumbBox.innerHTML = `
      <img src="${imgUrl}" alt="Attachment preview" />
      <button class="remove-thumb-x" data-idx="${idx}" title="Remove image">✕</button>
    `;

    thumbBox.querySelector('.remove-thumb-x')?.addEventListener('click', (e) => {
      e.stopPropagation();
      audio.playClick('tap');
      activeEditingImages.splice(idx, 1);
      renderEditorThumbnails();
    });

    row.appendChild(thumbBox);
  });
}

function saveNoteAction() {
  const titleInput = document.getElementById('editor-note-title');
  const contentInput = document.getElementById('editor-note-content');

  const title = (titleInput?.value.trim()) || 'Untitled Protocol Note';
  const content = (contentInput?.value.trim()) || '';

  if (activeEditingNoteId) {
    // EDIT & SAVE EXISTING NOTE
    const existing = notes.find(n => n.id === activeEditingNoteId);
    if (existing) {
      existing.title = title;
      existing.content = content;
      existing.category = activeEditingCategory;
      existing.isPinned = activeEditingIsPinned;
      existing.images = [...activeEditingImages];
      existing.updatedAt = 'Just now';
    }
    showToast(`Note updated: "${title}"`);
  } else {
    // CREATE & SAVE NEW NOTE
    const newNote = {
      id: `note-${Date.now()}`,
      title,
      content,
      category: activeEditingCategory,
      isPinned: activeEditingIsPinned,
      images: [...activeEditingImages],
      updatedAt: 'Just now',
    };
    notes.unshift(newNote);
    showToast(`Note created: "${title}"`);
  }

  audio.playClick('save');
  renderSamsungNotesCards();
  closeNoteEditor();
}

// ============================================================================
// EVENT LISTENERS SETUP
// ============================================================================
function setupEventListeners() {
  // 1. HOME SCREEN BRANCH LAUNCH CARDS
  document.getElementById('card-launch-alarm')?.addEventListener('click', () => {
    navigateToScreen('alarm');
  });

  document.getElementById('card-launch-notes')?.addEventListener('click', () => {
    navigateToScreen('notes');
  });

  // 2. BACK TO HOME BUTTONS
  document.getElementById('btn-alarm-back-home')?.addEventListener('click', () => {
    navigateToScreen('home');
  });

  document.getElementById('btn-notes-back-home')?.addEventListener('click', () => {
    navigateToScreen('home');
  });

  // 3. ANDROID BOTTOM NAVIGATION TABS
  const bottomTabs = document.querySelectorAll('.android-tab-item');
  bottomTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const navTarget = tab.dataset.nav;
      if (navTarget) {
        navigateToScreen(navTarget);
      }
    });
  });

  // 4. ALARM MODAL ACTIONS
  document.getElementById('btn-open-create-modal')?.addEventListener('click', openAlarmModal);
  document.getElementById('btn-close-modal')?.addEventListener('click', closeAlarmModal);
  document.getElementById('modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-backdrop')) closeAlarmModal();
  });

  // 3-Wheel Time Picker Controls
  document.getElementById('btn-hour-up')?.addEventListener('click', () => {
    audio.playClick('tap');
    newAlarmHour = newAlarmHour >= 12 ? 1 : newAlarmHour + 1;
    updateModalWheelDisplay();
  });
  document.getElementById('btn-hour-down')?.addEventListener('click', () => {
    audio.playClick('tap');
    newAlarmHour = newAlarmHour <= 1 ? 12 : newAlarmHour - 1;
    updateModalWheelDisplay();
  });

  document.getElementById('btn-min-up')?.addEventListener('click', () => {
    audio.playClick('tap');
    newAlarmMin = newAlarmMin >= 55 ? 0 : newAlarmMin + 5;
    updateModalWheelDisplay();
  });
  document.getElementById('btn-min-down')?.addEventListener('click', () => {
    audio.playClick('tap');
    newAlarmMin = newAlarmMin <= 0 ? 55 : newAlarmMin - 5;
    updateModalWheelDisplay();
  });

  document.getElementById('btn-period-am')?.addEventListener('click', () => {
    audio.playClick('tap');
    newAlarmPeriod = 'AM';
    updateModalWheelDisplay();
  });
  document.getElementById('btn-period-pm')?.addEventListener('click', () => {
    audio.playClick('tap');
    newAlarmPeriod = 'PM';
    updateModalWheelDisplay();
  });

  // Alarm repeat day circles (S M T W T F S)
  document.querySelectorAll('#modal-days-bar .day-circle').forEach(btn => {
    btn.addEventListener('click', () => {
      audio.playClick('tap');
      const dayId = parseInt(btn.dataset.day, 10);
      if (newAlarmDays.includes(dayId)) {
        newAlarmDays = newAlarmDays.filter(d => d !== dayId);
        btn.classList.remove('active');
      } else {
        newAlarmDays.push(dayId);
        newAlarmDays.sort((a, b) => a - b);
        btn.classList.add('active');
      }
      updateModalRepeatSummary();
    });
  });

  document.getElementById('btn-save-alarm')?.addEventListener('click', saveAlarmAction);
  document.getElementById('btn-save-alarm-header')?.addEventListener('click', saveAlarmAction);

  // 5. NOTES BRANCH ACTIONS
  document.getElementById('btn-open-new-note')?.addEventListener('click', () => openNoteEditor(null));
  document.getElementById('fab-create-note')?.addEventListener('click', () => openNoteEditor(null));
  document.getElementById('btn-cancel-note-editor')?.addEventListener('click', closeNoteEditor);
  document.getElementById('btn-save-note')?.addEventListener('click', saveNoteAction);

  // Note editor category chips
  document.querySelectorAll('#editor-cat-chips .editor-cat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      audio.playClick('tap');
      document.querySelectorAll('#editor-cat-chips .editor-cat-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeEditingCategory = chip.dataset.cat;
    });
  });

  // Note editor pin toggle
  document.getElementById('btn-toggle-pin-note')?.addEventListener('click', () => {
    audio.playClick('tap');
    activeEditingIsPinned = !activeEditingIsPinned;
    updateEditorPinState();
  });

  // Add sample photo to note
  document.getElementById('btn-add-sample-img')?.addEventListener('click', () => {
    audio.playClick('tap');
    const curatedPhotos = [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    ];
    const nextImg = curatedPhotos[activeEditingImages.length % curatedPhotos.length];
    activeEditingImages.push(nextImg);
    renderEditorThumbnails();
    showToast('Photo attached to note');
  });

  // Native File Picker for device photos
  const fileInput = document.getElementById('note-image-file-input');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        audio.playClick('tap');
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            activeEditingImages.push(event.target.result);
            renderEditorThumbnails();
            showToast('Device image attached');
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Delete active note in editor
  document.getElementById('btn-delete-active-note')?.addEventListener('click', () => {
    if (activeEditingNoteId) {
      audio.playClick('tap');
      notes = notes.filter(n => n.id !== activeEditingNoteId);
      renderSamsungNotesCards();
      closeNoteEditor();
      showToast('Note deleted');
    }
  });

  // Notes Search Input
  const searchInput = document.getElementById('input-notes-search');
  const clearSearchBtn = document.getElementById('btn-clear-notes-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      notesSearchQuery = e.target.value;
      if (clearSearchBtn) clearSearchBtn.style.display = notesSearchQuery ? 'block' : 'none';
      renderSamsungNotesCards();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      audio.playClick('tap');
      notesSearchQuery = '';
      if (searchInput) searchInput.value = '';
      clearSearchBtn.style.display = 'none';
      renderSamsungNotesCards();
    });
  }

  // Notes Category Filter Chips
  document.querySelectorAll('#notes-filter-chips .category-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      audio.playClick('tap');
      document.querySelectorAll('#notes-filter-chips .category-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      notesFilterCategory = chip.dataset.cat;
      renderSamsungNotesCards();
    });
  });
}

// Clock Display in Samsung Status Bar
function updateClock() {
  const clock = document.getElementById('status-clock');
  if (clock) {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    clock.textContent = `${hours}:${minutes}`;
  }
}

// Init Application
document.addEventListener('DOMContentLoaded', () => {
  renderSamsungAlarmCards();
  renderSamsungNotesCards();
  updateHeaderSubtitle();
  setupEventListeners();
  updateClock();
  setInterval(updateClock, 30000);

  // Check URL parameters for direct branch navigation (e.g. testing)
  const params = new URLSearchParams(window.location.search);
  const requestedScreen = params.get('screen') || params.get('branch');
  if (requestedScreen === 'alarm') {
    navigateToScreen('alarm');
  } else if (requestedScreen === 'notes') {
    navigateToScreen('notes');
  } else {
    navigateToScreen('home');
  }

  if (params.get('openNoteEditor') === 'true') {
    navigateToScreen('notes');
    openNoteEditor(notes[0]);
  }
});
