import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { colors, fonts, spacing, radius } from '../constants/theme';

type DayData = {
  day: string;
  score: number;
  isToday: boolean;
};

type HabitStat = {
  icon: string;
  name: string;
  pct: number;
};

const WEEK_DATA: DayData[] = [
  { day: 'M', score: 71, isToday: false },
  { day: 'T', score: 57, isToday: false },
  { day: 'W', score: 86, isToday: false },
  { day: 'T', score: 43, isToday: false },
  { day: 'F', score: 100, isToday: false },
  { day: 'S', score: 57, isToday: false },
  { day: 'S', score: 71, isToday: true },
];

const HABIT_STATS: HabitStat[] = [
  { icon: '☀️', name: 'Wake time', pct: 86 },
  { icon: '💧', name: 'Water', pct: 71 },
  { icon: '🥩', name: 'Protein meal', pct: 57 },
  { icon: '🏃', name: 'Exercise', pct: 86 },
  { icon: '📵', name: 'Screen-free morning', pct: 43 },
  { icon: '🌙', name: 'Phone down', pct: 71 },
  { icon: '😴', name: 'Sleep time', pct: 100 },
];

const BAR_MAX_HEIGHT = 88;
const weekAvg = Math.round(WEEK_DATA.reduce((s, d) => s + d.score, 0) / WEEK_DATA.length);
const todayScore = WEEK_DATA.find(d => d.isToday)?.score ?? 0;

function getTrend(): string {
  const recent = WEEK_DATA.slice(-3).reduce((s, d) => s + d.score, 0) / 3;
  const earlier = WEEK_DATA.slice(0, 4).reduce((s, d) => s + d.score, 0) / 4;
  if (recent > earlier + 5) return 'trending up';
  if (recent < earlier - 5) return 'trending down';
  return 'holding steady';
}

export default function ClarityScoreScreen() {
  const trend = getTrend();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bone} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Clarity{'\n'}score.</Text>

        <View style={styles.scoreHero}>
          <Text style={styles.scoreNumber}>{todayScore}</Text>
          <View style={styles.scoreRight}>
            <Text style={styles.scoreOutOf}>/ 100</Text>
            <Text style={styles.scoreSubtext}>today</Text>
            <View style={styles.trendBadge}>
              <Text style={styles.trendText}>{trend}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>This week</Text>
          <Text style={styles.weekAvg}>Weekly average: {weekAvg}</Text>

          <View style={styles.chart}>
            {WEEK_DATA.map((d, i) => {
              const barHeight = Math.max(4, (d.score / 100) * BAR_MAX_HEIGHT);
              return (
                <View key={i} style={styles.barColumn}>
                  <Text style={[styles.barScore, d.isToday && styles.barScoreToday]}>
                    {d.score}
                  </Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { height: barHeight },
                        d.isToday && styles.barFillToday,
                      ]}
                    />
                  </View>
                  <Text style={[styles.dayLabel, d.isToday && styles.dayLabelToday]}>
                    {d.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Habit breakdown</Text>
          <Text style={styles.breakdownSubtext}>7-day completion rate</Text>

          <View style={styles.habitList}>
            {HABIT_STATS.map((h, i) => (
              <View key={i} style={styles.habitRow}>
                <Text style={styles.habitIcon}>{h.icon}</Text>
                <View style={styles.habitMeta}>
                  <View style={styles.habitLabelRow}>
                    <Text style={styles.habitName}>{h.name}</Text>
                    <Text style={styles.habitPct}>{h.pct}%</Text>
                  </View>
                  <View style={styles.habitTrack}>
                    <View style={[styles.habitFill, { width: `${h.pct}%` as any }]} />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightLabel}>7-day insight</Text>
          <Text style={styles.insightText}>
            {trend === 'trending up'
              ? 'Your clarity is building. The last 3 days are your strongest this week.'
              : trend === 'trending down'
              ? 'Slight dip in the last few days. Check your sleep and screen-free habit.'
              : 'You\'re consistent. Minor fluctuations, but the overall pattern is solid.'}
          </Text>
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
    marginBottom: spacing.sm,
  },
  scoreHero: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  scoreNumber: {
    fontFamily: fonts.serif,
    fontSize: 80,
    color: colors.night,
    lineHeight: 86,
    letterSpacing: -2,
  },
  scoreRight: {
    paddingBottom: 10,
    gap: 2,
  },
  scoreOutOf: {
    fontFamily: fonts.sans,
    fontSize: 18,
    color: colors.slate,
  },
  scoreSubtext: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.mist,
  },
  trendBadge: {
    backgroundColor: colors.linen,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  trendText: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.slate,
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
  weekAvg: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.slate,
    marginBottom: spacing.sm,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: BAR_MAX_HEIGHT + 48,
    paddingTop: 24,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    justifyContent: 'flex-end',
  },
  barScore: {
    fontFamily: fonts.sans,
    fontSize: 10,
    color: colors.mist,
    marginBottom: 2,
  },
  barScoreToday: {
    color: colors.sage,
    fontFamily: fonts.sansMedium,
  },
  barTrack: {
    width: 28,
    height: BAR_MAX_HEIGHT,
    backgroundColor: colors.linen,
    borderRadius: radius.sm,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: colors.stone,
    borderRadius: radius.sm,
  },
  barFillToday: {
    backgroundColor: colors.sage,
  },
  dayLabel: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.mist,
  },
  dayLabelToday: {
    fontFamily: fonts.sansMedium,
    color: colors.night,
  },
  breakdownSubtext: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.slate,
  },
  habitList: {
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  habitIcon: {
    fontSize: 18,
    width: 28,
    textAlign: 'center',
  },
  habitMeta: {
    flex: 1,
    gap: 5,
  },
  habitLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  habitName: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.dusk,
  },
  habitPct: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.night,
  },
  habitTrack: {
    height: 3,
    backgroundColor: colors.linen,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  habitFill: {
    height: 3,
    backgroundColor: colors.sage,
    borderRadius: radius.full,
  },
  insightCard: {
    backgroundColor: colors.night,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  insightLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    color: colors.mist,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  insightText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.bone,
    lineHeight: 22,
  },
});
