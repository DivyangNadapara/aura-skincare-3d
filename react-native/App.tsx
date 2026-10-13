import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { AlarmScreen } from './src/screens/AlarmScreen';
import { NotesScreen } from './src/screens/NotesScreen';
import { SamsungBottomNav, MainBranchTab } from './src/components/BottomNav';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<MainBranchTab>('home');

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1">
        {currentScreen === 'home' ? (
          <HomeScreen onSelectBranch={(branch) => setCurrentScreen(branch)} />
        ) : currentScreen === 'alarm' ? (
          <AlarmScreen onBack={() => setCurrentScreen('home')} />
        ) : (
          <NotesScreen onBack={() => setCurrentScreen('home')} />
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
