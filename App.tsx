import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import { DMSans_400Regular, DMSans_500Medium } from '@expo-google-fonts/dm-sans';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import WelcomeScreen from './screens/WelcomeScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import RhythmScreen from './screens/RhythmScreen';
import VoiceJournalScreen from './screens/VoiceJournalScreen';
import ClarityScoreScreen from './screens/ClarityScoreScreen';
import FocusLockScreen from './screens/FocusLockScreen';
import FocusPauseScreen from './screens/FocusPauseScreen';
import SettingsScreen from './screens/SettingsScreen';
import { colors, fonts } from './constants/theme';

SplashScreen.preventAutoHideAsync();

type AuthScreen = 'welcome' | 'signup' | 'login';
type Tab = 'rhythm' | 'journal' | 'clarity' | 'focus' | 'settings';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'rhythm',   label: 'Today',   icon: '◈' },
  { id: 'journal',  label: 'Journal', icon: '◎' },
  { id: 'clarity',  label: 'Clarity', icon: '∿' },
  { id: 'focus',    label: 'Focus',   icon: '⊘' },
  { id: 'settings', label: 'You',     icon: '○' },
];

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSerifDisplay_400Regular,
    DMSans_400Regular,
    DMSans_500Medium,
  });
  const [hydrated, setHydrated] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('welcome');
  const [currentTab, setCurrentTab] = useState<Tab>('rhythm');
  const [showFocusPause, setShowFocusPause] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('onboarded').then(val => {
      if (val === 'true') setOnboarded(true);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (fontsLoaded && hydrated) SplashScreen.hideAsync();
  }, [fontsLoaded, hydrated]);

  if (!fontsLoaded || !hydrated) return null;

  // Called by both SignUpScreen and LoginScreen on success.
  // Saves name (signup only), marks onboarded, transitions to main app.
  const handleAuthSuccess = async (name?: string) => {
    if (name) await AsyncStorage.setItem('user-name', name);
    await AsyncStorage.setItem('onboarded', 'true');
    setOnboarded(true);
  };

  if (!onboarded) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          {authScreen === 'welcome' && (
            <WelcomeScreen
              onBegin={() => setAuthScreen('signup')}
              onLogin={() => setAuthScreen('login')}
            />
          )}
          {authScreen === 'signup' && (
            <SignUpScreen
              onSuccess={(name) => handleAuthSuccess(name)}
              onLogin={() => setAuthScreen('login')}
            />
          )}
          {authScreen === 'login' && (
            <LoginScreen
              onSuccess={() => handleAuthSuccess()}
              onSignUp={() => setAuthScreen('signup')}
            />
          )}
        </View>
      </SafeAreaProvider>
    );
  }

  const renderScreen = () => {
    switch (currentTab) {
      case 'rhythm':   return <RhythmScreen />;
      case 'journal':  return <VoiceJournalScreen />;
      case 'clarity':  return <ClarityScoreScreen />;
      case 'focus':    return <FocusLockScreen onTestPause={() => setShowFocusPause(true)} />;
      case 'settings': return <SettingsScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <View style={styles.screenArea}>
          {renderScreen()}
        </View>

        <View style={styles.tabBarWrapper}>
          <SafeAreaView edges={['bottom']} style={styles.tabBarSafe}>
            <View style={styles.tabBar}>
              {TABS.map(tab => {
                const active = currentTab === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    style={styles.tabItem}
                    onPress={() => setCurrentTab(tab.id)}
                    activeOpacity={0.65}
                  >
                    <View style={[styles.tabDot, active && styles.tabDotActive]} />
                    <Text style={[styles.tabIcon, active && styles.tabIconActive]}>
                      {tab.icon}
                    </Text>
                    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </SafeAreaView>
        </View>

        {showFocusPause && (
          <View style={StyleSheet.absoluteFill}>
            <FocusPauseScreen
              appName="Instagram"
              pauseSeconds={30}
              onDismiss={() => setShowFocusPause(false)}
            />
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bone,
  },
  screenArea: {
    flex: 1,
  },
  tabBarWrapper: {
    backgroundColor: colors.bone,
    borderTopWidth: 0.5,
    borderTopColor: colors.stone,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 12,
  },
  tabBarSafe: {
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    height: 64,
  },
  tabItem: {
    flex: 1,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'transparent',
    marginBottom: 1,
  },
  tabDotActive: {
    backgroundColor: colors.sage,
  },
  tabIcon: {
    fontSize: 19,
    lineHeight: 22,
    color: colors.mist,
  },
  tabIconActive: {
    color: colors.night,
  },
  tabLabel: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.mist,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    fontFamily: fonts.sansMedium,
    color: colors.night,
  },
});
