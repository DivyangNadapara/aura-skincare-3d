import React, { useState, useEffect } from 'react';
import { View, StatusBar, Platform, Keyboard } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Exact hardware safe bounds for Samsung S22 (punch-hole cutout & system navigation bar)
  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 0
  );
  const bottomInset = Math.max(
    insets.bottom,
    Platform.OS === 'android' ? 12 : 8
  );

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setIsKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <View className="flex-1 bg-[#050510]" style={{ paddingTop: topInset }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#050510"
        translucent={Platform.OS === 'android'}
      />

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

      {/* Docked Bottom Navigation with dynamic keyboard hiding */}
      {!isKeyboardVisible && (
        <SamsungBottomNav
          activeTab={currentScreen}
          onTabChange={(tab) => setCurrentScreen(tab)}
          bottomInset={bottomInset}
        />
      )}
    </View>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </SafeAreaProvider>
  );
}
