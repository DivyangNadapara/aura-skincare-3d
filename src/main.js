import './style.css';

// ============================================================================
// SAMSUNG AUDIO FEEDBACK (Tactile Galaxy Click Synthesizer)
// ============================================================================
class SamsungAudioFeedback {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
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
    } catch (e) {
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
// BRANCH STATE & MULTI-BRANCH NAVIGATION
// ============================================================================
let currentBranch = 'Alarm'; // 'Alarm' | 'Notes'

function switchBranch(branchName) {
  audio.playClick('tap');
  currentBranch = branchName;

  // Update top banner buttons
  document.getElementById('branch-btn-alarm')?.classList.toggle('active', branchName === 'Alarm');
  document.getElementById('branch-btn-notes')?.classList.toggle('active', branchName === 'Notes');

  // Update views
  const alarmView = document.getElementById('view-alarm-branch');
  const notesView = document.getElementById('view-notes-branch');
  if (alarmView && notesView) {
    alarmView.classList.toggle('active', branchName === 'Alarm');
    notesView.classList.toggle('active', branchName === 'Notes');
  }

  // Update bottom navigation tabs
  const tabs = document.querySelectorAll('.samsung-tab-item');
  tabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.branch === branchName);
  });
}

// ============================================================================
// BRANCH 1: ALARM LOGIC & DATA
// ============================================================================
const SAMSUNG_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

let alarms = [
  {
    id: 'alarm-1',
    time: '7:30',
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
    time: '1:30',
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
          <div class="samsung-days-row">${daysHtml}</div>
        </div>

        <label class="samsung-switch" onclick="event.stopPropagation();">
          <input type="checkbox" ${alarm.isEnabled ? 'checked' : ''} class="alarm-toggle-input" data-id="${alarm.id}">
          <span class="samsung-switch-track"></span>
        </label>
      </div>

      <div class="samsung-card-drawer">
        <div class="samsung-drawer-inner">
          <div class="drawer-row">
            <span class="drawer-row-label">Alarm sound</span>
            <span class="drawer-row-val">${alarm.sound}</span>
          </div>
          <div class="drawer-row">
            <span class="drawer-row-label">Vibration</span>
            <span class="drawer-row-val accent">${alarm.vibration}</span>
          </div>
          <div class="drawer-row">
            <span class="drawer-row-label">Snooze</span>
            <span class="drawer-row-val">${alarm.snooze}</span>
          </div>
          <button class="samsung-delete-btn" data-delete-id="${alarm.id}">Delete</button>
        </div>
      </div>
    `;

    card.querySelector('.samsung-card-inner')?.addEventListener('click', () => {
      audio.playClick('tap');
      alarm.isExpanded = !alarm.isExpanded;
      renderSamsungAlarmCards();
    });

    card.querySelector('.alarm-toggle-input')?.addEventListener('change', (e) => {
      audio.playClick('toggle');
      alarm.isEnabled = e.target.checked;
      renderSamsungAlarmCards();
      updateHeaderSubtitle();
      showToast(`${alarm.label} is now ${alarm.isEnabled ? 'On' : 'Off'}`);
    });

    card.querySelector('.samsung-delete-btn')?.addEventListener('click', (e) => {
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

function saveAlarmAction() {
  const nameInput = document.getElementById('input-alarm-name');
  const toneSelect = document.getElementById('select-alarm-tone');
  const vibrationToggle = document.getElementById('modal-vibration-toggle');

  const label = (nameInput?.value.trim()) || 'Alarm';
  const sound = toneSelect?.value || 'Over the Horizon (Samsung Brand)';
  const vibration = vibrationToggle?.checked ? 'Basic call' : 'Off';

  const newAlarm = {
    id: `alarm-${Date.now()}`,
    time: `${newAlarmHour}:${newAlarmMin.toString().padStart(2, '0')}`,
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
  showToast(`Alarm saved: ${newAlarm.time} ${newAlarm.period}`);

  if (nameInput) nameInput.value = '';
}

// ============================================================================
// BRANCH 2: SAMSUNG NOTES LOGIC & DATA (Create, Edit, Save, Add Images)
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
        <img src="${imgUrl}" alt="Attachment" class="note-thumb-preview" />
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

  // Update category pills state
  const catPills = document.querySelectorAll('.editor-cat-pill');
  catPills.forEach(p => {
    p.classList.toggle('active', p.dataset.cat === activeEditingCategory);
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
    thumbBox.className = 'editor-thumb-box';
    thumbBox.innerHTML = `
      <img src="${imgUrl}" alt="Attachment preview" />
      <button class="btn-remove-thumb" data-idx="${idx}" title="Remove image">✕</button>
    `;

    thumbBox.querySelector('.btn-remove-thumb')?.addEventListener('click', (e) => {
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
  // Branch Switching Buttons in Top Banner
  document.getElementById('branch-btn-alarm')?.addEventListener('click', () => switchBranch('Alarm'));
  document.getElementById('branch-btn-notes')?.addEventListener('click', () => switchBranch('Notes'));

  // Samsung Bottom Tabs
  const bottomTabs = document.querySelectorAll('.samsung-tab-item');
  bottomTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetBranch = tab.dataset.branch;
      if (targetBranch === 'Alarm' || targetBranch === 'Notes') {
        switchBranch(targetBranch);
      } else {
        audio.playClick('tap');
        bottomTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        showToast(`${tab.querySelector('.tab-label')?.textContent} selected`);
      }
    });
  });

  // ALARM MODAL EVENTS
  document.getElementById('btn-open-create-modal')?.addEventListener('click', openAlarmModal);
  document.getElementById('btn-close-modal')?.addEventListener('click', closeAlarmModal);
  document.getElementById('modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-backdrop')) closeAlarmModal();
  });

  // Alarm steppers
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

  // Alarm repeat days
  document.querySelectorAll('.samsung-day-btn').forEach(btn => {
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

      const summary = document.getElementById('repeat-summary');
      if (summary) {
        if (newAlarmDays.length === 7) summary.textContent = 'Every day';
        else if (newAlarmDays.length === 5 && !newAlarmDays.includes(0) && !newAlarmDays.includes(6)) summary.textContent = 'Every weekday';
        else if (newAlarmDays.length === 2 && newAlarmDays.includes(0) && newAlarmDays.includes(6)) summary.textContent = 'Weekends';
        else if (newAlarmDays.length === 0) summary.textContent = 'Never';
        else summary.textContent = `${newAlarmDays.length} days selected`;
      }
    });
  });

  document.getElementById('btn-save-alarm')?.addEventListener('click', saveAlarmAction);
  document.getElementById('btn-save-alarm-header')?.addEventListener('click', saveAlarmAction);

  // NOTES BRANCH EVENTS
  document.getElementById('btn-open-new-note')?.addEventListener('click', () => openNoteEditor(null));
  document.getElementById('fab-create-note')?.addEventListener('click', () => openNoteEditor(null));
  document.getElementById('btn-cancel-note-editor')?.addEventListener('click', closeNoteEditor);
  document.getElementById('btn-save-note')?.addEventListener('click', saveNoteAction);

  // Note editor category chips
  document.querySelectorAll('.editor-cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      audio.playClick('tap');
      document.querySelectorAll('.editor-cat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeEditingCategory = pill.dataset.cat;
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

  // Real File Upload to Note (Native File Picker)
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

  // Notes Filter Chips
  document.querySelectorAll('.notes-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      audio.playClick('tap');
      document.querySelectorAll('.notes-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      notesFilterCategory = chip.dataset.cat;
      renderSamsungNotesCards();
    });
  });

  // Color theme switcher
  document.getElementById('toggle-color-theme')?.addEventListener('click', () => {
    audio.playClick('tap');
    document.body.classList.toggle('theme-samsung-orange');
    const isOrange = document.body.classList.contains('theme-samsung-orange');
    document.getElementById('theme-color-label').textContent = isOrange ? 'Samsung Orange' : 'Samsung Blue';
  });

  // Frame mode switcher
  document.getElementById('toggle-frame-mode')?.addEventListener('click', () => {
    document.body.classList.toggle('fullscreen-mode');
    const isFullscreen = document.body.classList.contains('fullscreen-mode');
    document.getElementById('frame-mode-text').textContent = isFullscreen ? 'Samsung Frame View' : 'Fit Screen View';
    document.getElementById('frame-mode-icon').textContent = isFullscreen ? '💻' : '📱';
    audio.playClick('tap');
  });

  // Audio switcher
  document.getElementById('audio-feedback-toggle')?.addEventListener('click', () => {
    audio.enabled = !audio.enabled;
    document.getElementById('audio-feedback-toggle')?.classList.toggle('active', audio.enabled);
    document.getElementById('audio-status-text').textContent = audio.enabled ? 'Galaxy Sound ON' : 'Galaxy Sound OFF';
    audio.playClick('tap');
  });
}

// Code Tabs Viewer
const CODE_SNIPPETS = {
  'note-screen': `// react-native/src/screens/NotesScreen.tsx (Samsung One UI Notes)
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, TextInput } from 'react-native';
import { INITIAL_NOTES } from '../data/mockNotes';
import { NoteItem } from '../types/note';
import { NoteCard } from '../components/NoteCard';
import { NoteEditorModal } from '../components/NoteEditorModal';

export const NotesScreen: React.FC = () => {
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleSaveNote = (savedNote: NoteItem) => {
    setNotes(prev => {
      const exists = prev.some(n => n.id === savedNote.id);
      return exists ? prev.map(n => n.id === savedNote.id ? savedNote : n) : [savedNote, ...prev];
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#000000]">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-3 pb-3">
          <Text className="text-3xl font-bold text-white font-sans">Notes</Text>
          <Text className="text-sm text-[#8D92A4] mt-1">{notes.length} notes</Text>
        </View>

        {/* Notes List */}
        <ScrollView className="flex-1 px-4">
          {notes.map(note => (
            <NoteCard key={note.id} note={note} onPress={() => { setSelectedNote(note); setIsEditorOpen(true); }} />
          ))}
        </ScrollView>

        {/* FAB ✍️ */}
        <TouchableOpacity onPress={() => { setSelectedNote(null); setIsEditorOpen(true); }} className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#2C7BFE] items-center justify-center shadow-xl">
          <Text className="text-2xl text-white">✍️</Text>
        </TouchableOpacity>
      </View>
      <NoteEditorModal visible={isEditorOpen} initialNote={selectedNote} onClose={() => setIsEditorOpen(false)} onSave={handleSaveNote} />
    </SafeAreaView>
  );
};`,

  'note-editor': `// react-native/src/components/NoteEditorModal.tsx (Create, Edit, Save, Add Images)
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { NoteItem } from '../types/note';

export const NoteEditorModal: React.FC<{ visible: boolean; initialNote: NoteItem | null; onClose: () => void; onSave: (n: NoteItem) => void }> = ({ visible, initialNote, onClose, onSave }) => {
  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');
  const [images, setImages] = useState<string[]>(initialNote?.images || []);

  const handleAddImage = (uri: string) => {
    setImages([...images, uri]);
  };

  const handleSave = () => {
    onSave({
      id: initialNote?.id || \`note-\${Date.now()}\`,
      title: title || 'Untitled Note',
      content,
      category: 'Circadian Protocol',
      isPinned: false,
      images,
      createdAt: 'Today',
      updatedAt: 'Just now',
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View className="flex-1 bg-[#090B10]">
        <View className="flex-row justify-between px-5 pt-12 pb-4 bg-[#0E1118]">
          <TouchableOpacity onPress={onClose}><Text className="text-base text-[#8D92A4]">Cancel</Text></TouchableOpacity>
          <Text className="text-base font-bold text-white">{initialNote ? 'Edit note' : 'New note'}</Text>
          <TouchableOpacity onPress={handleSave}><Text className="text-base text-[#2C7BFE] font-bold">Save</Text></TouchableOpacity>
        </View>
        <ScrollView className="flex-1 px-5 pt-4">
          <TextInput value={title} onChangeText={setTitle} placeholder="Title" placeholderTextColor="#5C6274" className="text-2xl font-bold text-white mb-3" />
          <TouchableOpacity onPress={() => handleAddImage('https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600')} className="flex-row items-center gap-1.5 py-2 mb-3">
            <Text className="text-base">📷</Text><Text className="text-xs font-semibold text-[#2C7BFE]">Add Image</Text>
          </TouchableOpacity>
          <TextInput value={content} onChangeText={setContent} placeholder="Write note..." placeholderTextColor="#535868" multiline className="text-sm text-[#D5DAE8] min-h-[300px]" />
        </ScrollView>
      </View>
    </Modal>
  );
};`,

  'note-card': `// react-native/src/components/NoteCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { NoteItem } from '../types/note';

export const NoteCard: React.FC<{ note: NoteItem; onPress: (note: NoteItem) => void }> = ({ note, onPress }) => (
  <TouchableOpacity onPress={() => onPress(note)} className="bg-[#1C1F2B] border border-[#272B3B] rounded-[24px] p-5 mb-3.5">
    <View className="flex-row justify-between mb-2">
      <Text className="text-xs text-[#8E94A7] font-semibold">{note.category}</Text>
      {note.isPinned && <Text className="text-xs text-[#2C7BFE]">📌 Pinned</Text>}
    </View>
    <Text className="text-lg font-bold text-white mb-2">{note.title}</Text>
    {note.images?.length > 0 && (
      <View className="flex-row gap-2 mb-3">
        {note.images.map((img, i) => (
          <Image key={i} source={{ uri: img }} className="h-28 flex-1 rounded-2xl" />
        ))}
      </View>
    )}
    <Text numberOfLines={3} className="text-xs text-[#9DA3B5] leading-relaxed mb-2">{note.content}</Text>
    <Text className="text-[11px] text-[#646A7E]">{note.updatedAt}</Text>
  </TouchableOpacity>
);`,

  'alarm-screen': `// react-native/src/screens/AlarmScreen.tsx (Samsung One UI Alarm)
// Alarm branch screen with One UI Header, cards, and 3-wheel time picker...`,

  'flutter-notes': `// flutter/lib/notes_screen.dart (Flutter Samsung Notes Screen)
import 'package:flutter/material.dart';

class SamsungNotesScreen extends StatefulWidget { ... }`,
};

function setupCodeTabs() {
  const codeDisplay = document.getElementById('code-display');
  const tabs = document.querySelectorAll('.tab-btn');

  function renderTab(tabKey) {
    if (codeDisplay && CODE_SNIPPETS[tabKey]) {
      codeDisplay.textContent = CODE_SNIPPETS[tabKey];
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      audio.playClick('tap');
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderTab(tab.dataset.tab);
    });
  });

  renderTab('note-screen');
}

// Clock
function updateClock() {
  const clock = document.getElementById('status-clock');
  if (clock) {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    clock.textContent = `${hours}:${minutes}`;
  }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderSamsungAlarmCards();
  renderSamsungNotesCards();
  updateHeaderSubtitle();
  setupEventListeners();
  setupCodeTabs();
  updateClock();
  setInterval(updateClock, 30000);

  // URL Params for test states
  const params = new URLSearchParams(window.location.search);
  if (params.get('branch') === 'notes') {
    switchBranch('Notes');
  }
  if (params.get('openNoteEditor') === 'true') {
    switchBranch('Notes');
    openNoteEditor(notes[0]); // open first note in edit mode
  }
});
