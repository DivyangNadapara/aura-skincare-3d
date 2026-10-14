import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import { SplashScreen } from './src/screens/SplashScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { AlarmScreen } from './src/screens/AlarmScreen';
import { NotesScreen } from './src/screens/NotesScreen';
import { ExpensesScreen } from './src/screens/ExpensesScreen';
import { VaultScreen } from './src/screens/VaultScreen';
import { AiScreen } from './src/screens/AiScreen';
import { SamsungBottomNav } from './src/components/BottomNav';
import { AppProvider, useApp } from './src/context/AppContext';

function MainAppContent() {
  const { currentScreen, setCurrentScreen } = useApp();

  return (
    <SafeAreaView className="flex-1 bg-[#050510]">
      <View className="flex-1">
        {currentScreen === 'home' ? (
          <HomeScreen onSelectBranch={(branch) => setCurrentScreen(branch)} />
        ) : currentScreen === 'alarm' ? (
          <AlarmScreen onBack={() => setCurrentScreen('home')} />
        ) : currentScreen === 'notes' ? (
          <NotesScreen onBack={() => setCurrentScreen('home')} />
        ) : currentScreen === 'expenses' ? (
          <ExpensesScreen onBack={() => setCurrentScreen('home')} />
        ) : currentScreen === 'vault' ? (
          <VaultScreen onBack={() => setCurrentScreen('home')} />
        ) : (
          <AiScreen onBack={() => setCurrentScreen('home')} />
        )}
      </View>

      {/* Floating Bottom Navigation */}
      <SamsungBottomNav
        activeTab={currentScreen}
        onTabChange={(tab) => setCurrentScreen(tab)}
      />
    </SafeAreaView>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  // Show splash screen first, then transition to app
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
