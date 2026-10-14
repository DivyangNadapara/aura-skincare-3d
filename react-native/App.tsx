import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import { SplashScreen } from './src/screens/SplashScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { AlarmScreen } from './src/screens/AlarmScreen';
import { NotesScreen } from './src/screens/NotesScreen';
import { ExpensesScreen } from './src/screens/ExpensesScreen';
import { SamsungBottomNav, MainBranchTab } from './src/components/BottomNav';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<MainBranchTab>('home');

  // Show splash screen first, then transition to app
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1">
        {currentScreen === 'home' ? (
          <HomeScreen onSelectBranch={(branch) => setCurrentScreen(branch)} />
        ) : currentScreen === 'alarm' ? (
          <AlarmScreen onBack={() => setCurrentScreen('home')} />
        ) : currentScreen === 'notes' ? (
          <NotesScreen onBack={() => setCurrentScreen('home')} />
        ) : (
          <ExpensesScreen onBack={() => setCurrentScreen('home')} />
        )}
      </View>

      {/* Samsung Android Bottom Navigation */}
      <SamsungBottomNav
        activeTab={currentScreen}
        onTabChange={(tab) => setCurrentScreen(tab)}
      />
    </SafeAreaView>
  );
}
