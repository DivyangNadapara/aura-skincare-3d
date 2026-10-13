# Daily Rhythm & Alarms — Mobile Screen Experience

A modern, distraction-free mobile screen for an **Alarm and Circadian Rhythm Schedule** section designed with deep dark slate/black backgrounds and high-contrast vibrant emerald green and electric cyan accents.

---

## 📱 Architecture & Code Structure

### 1. React Native (Expo + NativeWind / Tailwind CSS)
Production-ready modular component files located in [`react-native/src/`](file:///c:/Users/BAPS/.gemini/antigravity/scratch/aura-skincare-3d/react-native/src/):
- **[`AlarmScreen.tsx`](file:///c:/Users/BAPS/.gemini/antigravity/scratch/aura-skincare-3d/react-native/src/screens/AlarmScreen.tsx)**: Main screen layout with safe area insets, ambient glow mesh, header, dynamic sub-badge countdown, and scrollable card list.
- **[`AlarmCard.tsx`](file:///c:/Users/BAPS/.gemini/antigravity/scratch/aura-skincare-3d/react-native/src/components/AlarmCard.tsx)**: Elevated `rounded-2xl` cards with distinct active/inactive states (bright white vs dimmed slate), interactive toggle switch, and tap-to-expand edit drawer.
- **[`CreateAlarmModal.tsx`](file:///c:/Users/BAPS/.gemini/antigravity/scratch/aura-skincare-3d/react-native/src/components/CreateAlarmModal.tsx)**: Bottom sheet modal featuring digital time steppers, AM/PM control, purpose input, category pills, repeat day selectors (Mon-Sun), and "Save Alarm" CTA.
- **[`DayPills.tsx`](file:///c:/Users/BAPS/.gemini/antigravity/scratch/aura-skincare-3d/react-native/src/components/DayPills.tsx)**: Circular `M T W T F S S` day indicator pills with active highlights.
- **[`types/alarm.ts`](file:///c:/Users/BAPS/.gemini/antigravity/scratch/aura-skincare-3d/react-native/src/types/alarm.ts)**: Strict TypeScript interfaces for circadian protocols, categories, and repeat schedules.
- **[`data/mockAlarms.ts`](file:///c:/Users/BAPS/.gemini/antigravity/scratch/aura-skincare-3d/react-native/src/data/mockAlarms.ts)**: Pre-built cards (Morning Protocol 07:30 AM, Afternoon Focus 01:30 PM, Wind Down 10:15 PM).

### 2. Flutter Implementation
- **[`flutter/lib/alarm_screen.dart`](file:///c:/Users/BAPS/.gemini/antigravity/scratch/aura-skincare-3d/flutter/lib/alarm_screen.dart)**: Equivalent Flutter implementation using `Scaffold`, `showModalBottomSheet`, and custom dark theme widgets.

### 3. Interactive Live Browser Simulator
- Built in [`index.html`](file:///c:/Users/BAPS/.gemini/antigravity/scratch/aura-skincare-3d/index.html), [`src/main.js`](file:///c:/Users/BAPS/.gemini/antigravity/scratch/aura-skincare-3d/src/main.js), and [`src/style.css`](file:///c:/Users/BAPS/.gemini/antigravity/scratch/aura-skincare-3d/src/style.css).
- Features realistic flagship phone bezel, dynamic island, tactile Web Audio click synthesizer, active/inactive card states, working bottom sheet modal, and code tabs.

---

## 🚀 Running the Live Preview
```bash
npm run dev
```
Open the local URL in your browser to test all toggles, card expansions, and alarm creation interactively!
