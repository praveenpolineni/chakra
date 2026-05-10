import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, fonts, spacing, radius } from '../constants/theme';

const STORAGE_KEY = 'settings';

const WAKE_TIMES = ['5:00', '5:30', '6:00', '6:30', '7:00', '7:30', '8:00'];

type Settings = {
  name: string;
  wakeGoal: string;
  morningNotif: boolean;
  eveningNotif: boolean;
  weeklyReport: boolean;
};

const DEFAULTS: Settings = {
  name: '',
  wakeGoal: '6:30',
  morningNotif: true,
  eveningNotif: true,
  weeklyReport: false,
};

export default function SettingsScreen() {
  const [hydrated, setHydrated] = useState(false);
  const [name, setName] = useState(DEFAULTS.name);
  const [wakeGoal, setWakeGoal] = useState(DEFAULTS.wakeGoal);
  const [morningNotif, setMorningNotif] = useState(DEFAULTS.morningNotif);
  const [eveningNotif, setEveningNotif] = useState(DEFAULTS.eveningNotif);
  const [weeklyReport, setWeeklyReport] = useState(DEFAULTS.weeklyReport);
  const [showWakePicker, setShowWakePicker] = useState(false);

  // Load saved settings on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(val => {
      if (val) {
        const s: Partial<Settings> = JSON.parse(val);
        if (s.name        !== undefined) setName(s.name);
        if (s.wakeGoal    !== undefined) setWakeGoal(s.wakeGoal);
        if (s.morningNotif !== undefined) setMorningNotif(s.morningNotif);
        if (s.eveningNotif !== undefined) setEveningNotif(s.eveningNotif);
        if (s.weeklyReport !== undefined) setWeeklyReport(s.weeklyReport);
      }
      setHydrated(true);
    });
  }, []);

  // Write to storage whenever any setting changes — guarded by hydrated so
  // we never overwrite good stored data with defaults during the initial render
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ name, wakeGoal, morningNotif, eveningNotif, weeklyReport })
    );
  }, [hydrated, name, wakeGoal, morningNotif, eveningNotif, weeklyReport]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bone} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.pageTitle}>Profile &{'\n'}settings.</Text>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Your name</Text>
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
            placeholder="What should we call you?"
            placeholderTextColor={colors.mist}
            returnKeyType="done"
            autoCorrect={false}
          />
          <Text style={styles.inputHint}>Used only in your journal summaries</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Wake goal</Text>
          <Text style={styles.sectionSub}>Target wake time for your daily rhythm</Text>

          <TouchableOpacity
            style={styles.wakeSelector}
            onPress={() => setShowWakePicker(s => !s)}
            activeOpacity={0.8}
          >
            <Text style={styles.wakeSelectorTime}>{wakeGoal}</Text>
            <Text style={styles.wakeSelectorLabel}>AM</Text>
            <Text style={styles.wakeSelectorChevron}>{showWakePicker ? '∧' : '∨'}</Text>
          </TouchableOpacity>

          {showWakePicker && (
            <View style={styles.wakeGrid}>
              {WAKE_TIMES.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.wakePill, wakeGoal === t && styles.wakePillActive]}
                  onPress={() => { setWakeGoal(t); setShowWakePicker(false); }}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.wakePillText, wakeGoal === t && styles.wakePillTextActive]}>
                    {t} AM
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Notifications</Text>

          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleTitle}>Morning check-in</Text>
              <Text style={styles.toggleSub}>Daily nudge when you wake up</Text>
            </View>
            <Switch
              value={morningNotif}
              onValueChange={setMorningNotif}
              trackColor={{ false: colors.stone, true: colors.sage }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleTitle}>Evening reflection</Text>
              <Text style={styles.toggleSub}>Reminder to log your day at 9 PM</Text>
            </View>
            <Switch
              value={eveningNotif}
              onValueChange={setEveningNotif}
              trackColor={{ false: colors.stone, true: colors.sage }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleTitle}>Weekly clarity report</Text>
              <Text style={styles.toggleSub}>Sunday summary of your week</Text>
            </View>
            <Switch
              value={weeklyReport}
              onValueChange={setWeeklyReport}
              trackColor={{ false: colors.stone, true: colors.sage }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Privacy</Text>

          <View style={styles.privacyNote}>
            <View style={styles.lockIcon}>
              <View style={styles.lockBody} />
              <View style={styles.lockShackle} />
            </View>
            <Text style={styles.privacyText}>
              All your data — habits, journal entries, scores — stays on your device. Nothing is sent to any server.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.dangerBtn}
            activeOpacity={0.8}
            onPress={async () => {
              await AsyncStorage.multiRemove(['onboarded', 'journal-entries', 'settings']);
              const todayKey = `habits-${new Date().toISOString().slice(0, 10)}`;
              await AsyncStorage.removeItem(todayKey);
              setName(DEFAULTS.name);
              setWakeGoal(DEFAULTS.wakeGoal);
              setMorningNotif(DEFAULTS.morningNotif);
              setEveningNotif(DEFAULTS.eveningNotif);
              setWeeklyReport(DEFAULTS.weeklyReport);
            }}
          >
            <Text style={styles.dangerBtnText}>Clear all data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.brandMark}>
            <View style={styles.brandMarkInner} />
          </View>
          <Text style={styles.footerText}>CHAKRA</Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bone,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  pageTitle: {
    fontFamily: fonts.serif,
    fontSize: 32,
    color: colors.night,
    lineHeight: 38,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 0.5,
    borderColor: colors.linen,
    gap: spacing.sm,
  },
  sectionLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    color: colors.mist,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  sectionSub: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.slate,
  },
  nameInput: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    color: colors.night,
    borderBottomWidth: 1,
    borderBottomColor: colors.stone,
    paddingVertical: spacing.sm,
    paddingHorizontal: 0,
  },
  inputHint: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.mist,
  },
  wakeSelector: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    paddingVertical: spacing.sm,
  },
  wakeSelectorTime: {
    fontFamily: fonts.serif,
    fontSize: 36,
    color: colors.night,
    letterSpacing: -1,
  },
  wakeSelectorLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    color: colors.slate,
  },
  wakeSelectorChevron: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.mist,
    marginLeft: 'auto' as any,
  },
  wakeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  wakePill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.stone,
  },
  wakePillActive: {
    backgroundColor: colors.night,
    borderColor: colors.night,
  },
  wakePillText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.slate,
  },
  wakePillTextActive: {
    color: colors.bone,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  toggleInfo: {
    flex: 1,
    paddingRight: spacing.md,
    gap: 2,
  },
  toggleTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.night,
  },
  toggleSub: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.mist,
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.linen,
  },
  privacyNote: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    backgroundColor: colors.linen,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  lockIcon: {
    width: 18,
    alignItems: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  lockBody: {
    width: 13,
    height: 10,
    borderRadius: 3,
    backgroundColor: colors.slate,
  },
  lockShackle: {
    width: 8,
    height: 6,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderWidth: 2,
    borderColor: colors.slate,
    borderBottomWidth: 0,
    marginBottom: -1,
  },
  privacyText: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.slate,
    lineHeight: 19,
  },
  dangerBtn: {
    borderRadius: radius.md,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0C4C4',
    backgroundColor: '#FDF5F5',
  },
  dangerBtnText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: '#C0392B',
  },
  footer: {
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.lg,
  },
  brandMark: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandMarkInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.bone,
  },
  footerText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.night,
    letterSpacing: 2,
  },
  versionText: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.mist,
  },
});
