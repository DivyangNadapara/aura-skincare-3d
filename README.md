# Samsung One UI 6 / 7 — Clock & Alarm Design System

A mobile screen for an **Alarm and Circadian Rhythm Schedule** section built strictly according to **Samsung One UI 6 / 7 Clock design language** with pure AMOLED pitch black (`#000000`), Samsung card containers (`#1C1F2B`), signature Samsung Blue (`#2C7BFE`) and Samsung Clock Orange (`#FF7700`) accents.

---

## 📱 Samsung One UI Design Features

1. **Top Action Bar**:
   - Search icon (`🔍`), Add Alarm (`+`), Overflow Menu (`⋮`)
2. **Samsung Viewing Area Header**:
   - Large One UI title: **"Alarm"**
   - Subtitle: **"Next alarm in 4 hours 15 minutes"** (or *"All alarms off"*)
3. **Samsung Alarm Cards**:
   - `rounded-[26px]` container with subtle `#252937` borders
   - Bold digital numerals with AM/PM
   - `S M T W T F S` circular chips with Samsung Blue/Orange active fill
   - Smooth Samsung One UI oval switch
   - Tap-to-expand drawer with "Alarm sound", "Vibration", "Snooze", and "Delete"
4. **Samsung 3-Wheel Time Picker**:
   - Horizontal rounded selector band
   - Scrolling columns for Hour, Minute, and AM/PM
5. **Samsung 4-Tab Bottom Navigation Bar**:
   - `Alarm` (Active with blue/orange glow)
   - `World clock`
   - `Stopwatch`
   - `Timer`
   - Centered home navigation pill indicator

---

## 📦 Code Structure

- **React Native (Expo + NativeWind / Tailwind CSS)**:
  - [`react-native/src/screens/AlarmScreen.tsx`](file:///c:/Users/BAPS/.gemini/antigravity/scratch/aura-skincare-3d/react-native/src/screens/AlarmScreen.tsx)
  - [`react-native/src/components/AlarmCard.tsx`](file:///c:/Users/BAPS/.gemini/antigravity/scratch/aura-skincare-3d/react-native/src/components/AlarmCard.tsx)
  - [`react-native/src/components/CreateAlarmModal.tsx`](file:///c:/Users/BAPS/.gemini/antigravity/scratch/aura-skincare-3d/react-native/src/components/CreateAlarmModal.tsx)
  - [`react-native/src/components/DayPills.tsx`](file:///c:/Users/BAPS/.gemini/antigravity/scratch/aura-skincare-3d/react-native/src/components/DayPills.tsx)
  - [`react-native/src/components/BottomNav.tsx`](file:///c:/Users/BAPS/.gemini/antigravity/scratch/aura-skincare-3d/react-native/src/components/BottomNav.tsx)
  - [`react-native/src/types/alarm.ts`](file:///c:/Users/BAPS/.gemini/antigravity/scratch/aura-skincare-3d/react-native/src/types/alarm.ts)
  - [`react-native/src/data/mockAlarms.ts`](file:///c:/Users/BAPS/.gemini/antigravity/scratch/aura-skincare-3d/react-native/src/data/mockAlarms.ts)
- **Flutter**:
  - [`flutter/lib/alarm_screen.dart`](file:///c:/Users/BAPS/.gemini/antigravity/scratch/aura-skincare-3d/flutter/lib/alarm_screen.dart)
- **Interactive Web Simulator**:
  - [`index.html`](file:///c:/Users/BAPS/.gemini/antigravity/scratch/aura-skincare-3d/index.html)
  - [`src/style.css`](file:///c:/Users/BAPS/.gemini/antigravity/scratch/aura-skincare-3d/src/style.css)
  - [`src/main.js`](file:///c:/Users/BAPS/.gemini/antigravity/scratch/aura-skincare-3d/src/main.js)

---

## 🚀 Run & Test Live

```powershell
npm run dev
```
Open in browser to test toggles, the 3-wheel picker, card expansion, and switch between Samsung Blue and Samsung Clock Orange!
