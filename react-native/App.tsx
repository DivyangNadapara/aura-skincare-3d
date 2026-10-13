import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import { AlarmScreen } from './src/screens/AlarmScreen';
import { NotesScreen } from './src/screens/NotesScreen';
import { SamsungBottomNav, MainBranchTab } from './src/components/BottomNav';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainBranchTab>('Alarm');

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1">
        {activeTab === 'Alarm' ? (
          <AlarmScreen />
        ) : activeTab === 'Notes' ? (
          <NotesScreen />
        ) : (
          <AlarmScreen />
        )}
      </View>
      <SamsungBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </SafeAreaView>
  );
}
