import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Switch,
} from 'react-native';
import { colors, fonts, spacing, radius } from '../constants/theme';

type Props = {
  onTestPause: () => void;
};

type AppOption = {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
};

const PAUSE_DURATIONS = [
  { label: '30s', seconds: 30 },
  { label: '1 min', seconds: 60 },
  { label: '2 min', seconds: 120 },
  { label: '5 min', seconds: 300 },
];

export default function FocusLockScreen({ onTestPause }: Props) {
  const [apps, setApps] = useState<AppOption[]>([
    { id: 'instagram', name: 'Instagram', icon: '📷', enabled: true },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', enabled: true },
    { id: 'twitter', name: 'X / Twitter', icon: '𝕏', enabled: false },
    { id: 'youtube', name: 'YouTube', icon: '▶', enabled: false },
    { id: 'reddit', name: 'Reddit', icon: '⬆', enabled: false },
  ]);
  const [pauseDuration, setPauseDuration] = useState(30);
  const [showShortcutSteps, setShowShortcutSteps] = useState(false);

  const toggleApp = (id: string) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const enabledApps = apps.filter(a => a.enabled);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bone} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Focus{'\n'}lock.</Text>

        <Text style={styles.intro}>
          Add a mindful pause before opening distracting apps. Set it up once, feel the difference every day.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Apps to pause</Text>
          <Text style={styles.sectionSub}>Toggle apps you want to add a pause to</Text>

          <View style={styles.appList}>
            {apps.map(app => (
              <View key={app.id} style={styles.appRow}>
                <View style={styles.appIconWrap}>
                  <Text style={styles.appIconText}>{app.icon}</Text>
                </View>
                <Text style={styles.appName}>{app.name}</Text>
                <Switch
                  value={app.enabled}
                  onValueChange={() => toggleApp(app.id)}
                  trackColor={{ false: colors.stone, true: colors.sage }}
                  thumbColor={app.enabled ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Pause duration</Text>
          <Text style={styles.sectionSub}>How long before they can continue</Text>

          <View style={styles.durationRow}>
            {PAUSE_DURATIONS.map(d => (
              <TouchableOpacity
                key={d.label}
                style={[styles.durationPill, pauseDuration === d.seconds && styles.durationPillActive]}
                onPress={() => setPauseDuration(d.seconds)}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.durationLabel,
                    pauseDuration === d.seconds && styles.durationLabelActive,
                  ]}
                >
                  {d.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.testBtn}
          onPress={onTestPause}
          activeOpacity={0.85}
        >
          <Text style={styles.testBtnText}>Preview the pause screen</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.shortcutHeader}>
            <View>
              <Text style={styles.sectionLabel}>iOS Shortcut setup</Text>
              <Text style={styles.sectionSub}>Required to activate Focus Lock</Text>
            </View>
            <TouchableOpacity
              style={styles.expandBtn}
              onPress={() => setShowShortcutSteps(s => !s)}
              activeOpacity={0.7}
            >
              <Text style={styles.expandBtnText}>{showShortcutSteps ? 'Hide' : 'How?'}</Text>
            </TouchableOpacity>
          </View>

          {enabledApps.length > 0 && (
            <View style={styles.enabledAppsRow}>
              {enabledApps.map(a => (
                <View key={a.id} style={styles.enabledAppPill}>
                  <Text style={styles.enabledAppText}>{a.name}</Text>
                </View>
              ))}
            </View>
          )}

          {showShortcutSteps && (
            <View style={styles.steps}>
              {[
                'Open the Shortcuts app on your iPhone',
                'Tap + to create a new shortcut',
                'Add action: "Open App" → select Instagram (or whichever)',
                'Tap + again → search for "Open URL"',
                'Enter: chakra://pause?app=Instagram',
                'Set this shortcut as the app icon using "Add to Home Screen"',
                'Delete the original Instagram app from your home screen',
              ].map((step, i) => (
                <View key={i} style={styles.stepRow}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}

              <View style={styles.noteBox}>
                <Text style={styles.noteText}>
                  This uses iOS Shortcuts to intercept the app open and route through CHAKRA first. The pause screen appears, then they continue to the real app.
                </Text>
              </View>
            </View>
          )}
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
  intro: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.slate,
    lineHeight: 21,
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
  appList: {
    gap: 2,
    marginTop: spacing.xs,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.linen,
  },
  appIconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: colors.linen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconText: {
    fontSize: 16,
  },
  appName: {
    flex: 1,
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.night,
  },
  durationRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
    flexWrap: 'wrap',
  },
  durationPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.stone,
  },
  durationPillActive: {
    backgroundColor: colors.night,
    borderColor: colors.night,
  },
  durationLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.slate,
  },
  durationLabelActive: {
    color: colors.bone,
  },
  testBtn: {
    borderRadius: radius.md,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.night,
  },
  testBtnText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.night,
    letterSpacing: 0.2,
  },
  shortcutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  expandBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.sm,
    backgroundColor: colors.linen,
  },
  expandBtnText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.slate,
  },
  enabledAppsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  enabledAppPill: {
    backgroundColor: '#F0FAF6',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: '#9FE1CB',
  },
  enabledAppText: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.sage,
  },
  steps: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  stepRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.linen,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  stepNumberText: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    color: colors.slate,
  },
  stepText: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.dusk,
    lineHeight: 20,
  },
  noteBox: {
    backgroundColor: colors.linen,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginTop: spacing.xs,
  },
  noteText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.slate,
    lineHeight: 19,
  },
});
