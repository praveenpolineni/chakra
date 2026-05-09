// App.tsx
// Now App.tsx does two things:
// 1. Loads fonts
// 2. Sets up navigation between screens

import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useFonts, DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import { DMSans_400Regular, DMSans_500Medium } from '@expo-google-fonts/dm-sans';
import * as SplashScreen from 'expo-splash-screen';

import WelcomeScreen from './screens/WelcomeScreen';
import RhythmScreen from './screens/RhythmScreen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSerifDisplay_400Regular,
    DMSans_400Regular,
    DMSans_500Medium,
  });
  const [screen, setScreen] = useState<'welcome' | 'rhythm'>('welcome');

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {screen === 'welcome' ? (
        <WelcomeScreen onBegin={() => setScreen('rhythm')} />
      ) : (
        <RhythmScreen />
      )}
    </View>
  );
}