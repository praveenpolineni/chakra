// screens/RhythmScreen.tsx
// The Daily Rhythm Tracker — the heart of CHAKRA.
// Users check off 7 habits with one tap each.
// The Clarity Score updates live as habits are completed.

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { colors, fonts, spacing, radius } from '../constants/theme';

// ── Types ──
// A Habit is one row in the tracker
type Habit = {
  id: string;         // unique ID
  icon: string;       // emoji icon
  name: string;       // habit name shown on card
  subtitle: string;   // detail shown below name
  done: boolean;      // has the user checked this off?
};

// Navigation prop — same as WelcomeScreen
type Props = {
  navigation?: any;
};

// ── The 7 CHAKRA habits ──
// This is the starting data. All habits start as not done.
const INITIAL_HABITS: Habit[] = [
  {
    id: 'wake',
    icon: '☀️',
    name: 'Wake time',
    subtitle: 'Tap to log your wake time',
    done: false,
  },
  {
    id: 'water',
    icon: '💧',
    name: 'Water',
    subtitle: '8 glasses today',
    done: false,
  },
  {
    id: 'protein',
    icon: '🥩',
    name: 'Protein meal',
    subtitle: 'Tap to log your meal',
    done: false,
  },
  {
    id: 'exercise',
    icon: '🏃',
    name: 'Exercise',
    subtitle: 'Any movement counts',
    done: false,
  },
  {
    id: 'screen',
    icon: '📵',
    name: 'Screen-free morning',
    subtitle: 'No phone until lunch',
    done: false,
  },
  {
    id: 'phone',
    icon: '🌙',
    name: 'Phone down',
    subtitle: '3 hours before bed',
    done: false,
  },
  {
    id: 'sleep',
    icon: '😴',
    name: 'Sleep time',
    subtitle: 'Tap to log your sleep time',
    done: false,
  },
];

// ── Helper: get today's date as a readable string ──
function getTodayString(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

// ── Helper: calculate Clarity Score ──
// Simple formula: each completed habit = ~14 points (7 habits × 14 ≈ 100)
function calcScore(habits: Habit[]): number {
  const done = habits.filter(h => h.done).length;
  return Math.round((done / habits.length) * 100);
}

export default function RhythmScreen({ navigation }: Props = {}) {
  // habits is our list — useState means React watches it for changes
  // When habits changes, the screen automatically re-renders
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);

  // Toggle a habit done/undone when user taps it
  const toggleHabit = (id: string) => {
    setHabits(prev =>
      prev.map(h =>
        h.id === id ? { ...h, done: !h.done } : h
        // For each habit: if it's the one tapped, flip done. Otherwise leave it.
      )
    );
  };

  // How many habits are done?
  const doneCount = habits.filter(h => h.done).length;
  const totalCount = habits.length;

  // Progress bar width as a percentage string
  const progressPercent = `${Math.round((doneCount / totalCount) * 100)}%`;
  const progressFillStyle: any = { width: progressPercent };

  // Clarity score — recalculates every time habits changes
  const clarityScore = calcScore(habits);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bone} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Header row: title + clarity score ── */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.dateText}>{getTodayString()}</Text>
            <Text style={styles.pageTitle}>Daily{'\n'}rhythm.</Text>
          </View>

          {/* Clarity score pill — updates live */}
          <View style={styles.scorePill}>
            <Text style={styles.scoreNumber}>{clarityScore}</Text>
            <Text style={styles.scoreLabel}>clarity</Text>
          </View>
        </View>

        {/* ── Progress bar ── */}
        <View style={styles.progressSection}>
          <View style={styles.progressTrack}>
            {/* The green fill — width changes as habits are checked */}
            <View style={[styles.progressFill, progressFillStyle]} />
          </View>
          <Text style={styles.progressLabel}>
            {doneCount} of {totalCount} complete
          </Text>
        </View>

        {/* ── Habit list ── */}
        <View style={styles.habitList}>
          {habits.map(habit => (
            <TouchableOpacity
              key={habit.id}
              style={[
                styles.habitCard,
                habit.done && styles.habitCardDone, // add green tint when done
              ]}
              onPress={() => toggleHabit(habit.id)}
              activeOpacity={0.75}
            >
              {/* Icon */}
              <View style={[
                styles.habitIcon,
                habit.done && styles.habitIconDone,
              ]}>
                <Text style={styles.habitIconText}>{habit.icon}</Text>
              </View>

              {/* Name + subtitle */}
              <View style={styles.habitInfo}>
                <Text style={styles.habitName}>{habit.name}</Text>
                <Text style={styles.habitSubtitle}>
                  {habit.done ? '✓  Done' : habit.subtitle}
                </Text>
              </View>

              {/* Checkbox circle */}
              <View style={[
                styles.checkbox,
                habit.done && styles.checkboxDone,
              ]}>
                {habit.done && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Bottom message ── */}
        <Text style={styles.bottomMessage}>
          {doneCount === 0 && 'Your day is ahead of you.'}
          {doneCount > 0 && doneCount < 7 && 'Keep your rhythm.'}
          {doneCount === 7 && 'Full rhythm. Well done.'}
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ──
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bone,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },

  dateText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.mist,
    marginBottom: 4,
  },

  pageTitle: {
    fontFamily: fonts.serif,
    fontSize: 32,
    color: colors.night,
    lineHeight: 38,
    letterSpacing: -0.5,
  },

  // Clarity score pill
  scorePill: {
    backgroundColor: colors.night,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    minWidth: 56,
  },

  scoreNumber: {
    fontFamily: fonts.sansMedium,
    fontSize: 22,
    color: colors.bone,
  },

  scoreLabel: {
    fontFamily: fonts.sans,
    fontSize: 9,
    color: colors.mist,
    letterSpacing: 0.5,
    marginTop: 1,
  },

  // Progress bar
  progressSection: {
    marginBottom: spacing.lg,
  },

  progressTrack: {
    height: 3,
    backgroundColor: colors.linen,
    borderRadius: radius.full,
    overflow: 'hidden',
  },

  progressFill: {
    height: 3,
    backgroundColor: colors.sage,  // green fill
    borderRadius: radius.full,
  },

  progressLabel: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.mist,
    marginTop: 6,
  },

  // Habit cards
  habitList: {
    gap: 8,
  },

  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 0.5,
    borderColor: colors.linen,
  },

  habitCardDone: {
    backgroundColor: '#F0FAF6',   // very soft green tint
    borderColor: '#9FE1CB',       // soft green border
  },

  habitIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.linen,
    alignItems: 'center',
    justifyContent: 'center',
  },

  habitIconDone: {
    backgroundColor: '#E1F5EE',   // lighter green background
  },

  habitIconText: {
    fontSize: 16,
  },

  habitInfo: {
    flex: 1,
  },

  habitName: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.night,
  },

  habitSubtitle: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.mist,
    marginTop: 2,
  },

  // Checkbox
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.stone,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxDone: {
    backgroundColor: colors.sage,
    borderColor: colors.sage,
  },

  checkmark: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  // Bottom message
  bottomMessage: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.mist,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});