import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, fonts, spacing, radius } from '../constants/theme';

type Habit = {
  id: string;
  icon: string;
  name: string;
  subtitle: string;
  done: boolean;
};

type Props = {
  navigation?: any;
};

const INITIAL_HABITS: Habit[] = [
  { id: 'wake',     icon: '☀️', name: 'Wake time',           subtitle: 'Tap to log your wake time', done: false },
  { id: 'water',    icon: '💧', name: 'Water',               subtitle: '8 glasses today',           done: false },
  { id: 'protein',  icon: '🥩', name: 'Protein meal',        subtitle: 'Tap to log your meal',      done: false },
  { id: 'exercise', icon: '🏃', name: 'Exercise',            subtitle: 'Any movement counts',       done: false },
  { id: 'screen',   icon: '📵', name: 'Screen-free morning', subtitle: 'No phone until lunch',      done: false },
  { id: 'phone',    icon: '🌙', name: 'Phone down',          subtitle: '3 hours before bed',        done: false },
  { id: 'sleep',    icon: '😴', name: 'Sleep time',          subtitle: 'Tap to log your sleep time',done: false },
];

function todayKey(): string {
  return `habits-${new Date().toISOString().slice(0, 10)}`;
}

function getTodayString(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function calcScore(habits: Habit[]): number {
  return Math.round((habits.filter(h => h.done).length / habits.length) * 100);
}

export default function RhythmScreen({ navigation }: Props = {}) {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);

  // Load today's saved habits on mount
  useEffect(() => {
    AsyncStorage.getItem(todayKey()).then(val => {
      if (val) {
        const saved: Habit[] = JSON.parse(val);
        // Merge stored done-state into the canonical habit list (preserves new habits added in future)
        setHabits(INITIAL_HABITS.map(h => {
          const match = saved.find(s => s.id === h.id);
          return match ? { ...h, done: match.done } : h;
        }));
      }
    });
  }, []);

  const toggleHabit = (id: string) => {
    setHabits(prev => {
      const next = prev.map(h => h.id === id ? { ...h, done: !h.done } : h);
      AsyncStorage.setItem(todayKey(), JSON.stringify(next));
      return next;
    });
  };

  const doneCount = habits.filter(h => h.done).length;
  const totalCount = habits.length;
  const progressPercent = `${Math.round((doneCount / totalCount) * 100)}%`;
  const progressFillStyle: any = { width: progressPercent };
  const clarityScore = calcScore(habits);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bone} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.dateText}>{getTodayString()}</Text>
            <Text style={styles.pageTitle}>Daily{'\n'}rhythm.</Text>
          </View>

          <View style={styles.scorePill}>
            <Text style={styles.scoreNumber}>{clarityScore}</Text>
            <Text style={styles.scoreLabel}>clarity</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, progressFillStyle]} />
          </View>
          <Text style={styles.progressLabel}>
            {doneCount} of {totalCount} complete
          </Text>
        </View>

        <View style={styles.habitList}>
          {habits.map(habit => (
            <TouchableOpacity
              key={habit.id}
              style={[styles.habitCard, habit.done && styles.habitCardDone]}
              onPress={() => toggleHabit(habit.id)}
              activeOpacity={0.75}
            >
              <View style={[styles.habitIcon, habit.done && styles.habitIconDone]}>
                <Text style={styles.habitIconText}>{habit.icon}</Text>
              </View>

              <View style={styles.habitInfo}>
                <Text style={styles.habitName}>{habit.name}</Text>
                <Text style={styles.habitSubtitle}>
                  {habit.done ? '✓  Done' : habit.subtitle}
                </Text>
              </View>

              <View style={[styles.checkbox, habit.done && styles.checkboxDone]}>
                {habit.done && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.bottomMessage}>
          {doneCount === 0 && 'Your day is ahead of you.'}
          {doneCount > 0 && doneCount < 7 && 'Keep your rhythm.'}
          {doneCount === 7 && 'Full rhythm. Well done.'}
        </Text>
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
  },
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
    backgroundColor: colors.sage,
    borderRadius: radius.full,
  },
  progressLabel: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.mist,
    marginTop: 6,
  },
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
    backgroundColor: '#F0FAF6',
    borderColor: '#9FE1CB',
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
    backgroundColor: '#E1F5EE',
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
  bottomMessage: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.mist,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
