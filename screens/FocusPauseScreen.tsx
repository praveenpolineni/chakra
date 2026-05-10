import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { colors, fonts, spacing, radius } from '../constants/theme';

type Props = {
  appName?: string;
  pauseSeconds?: number;
  onDismiss: () => void;
};

const MINDFUL_PROMPTS = [
  'Why are you opening this right now?',
  'Is there something specific you\'re looking for?',
  'Could this wait 30 minutes?',
  'What would you rather be doing?',
];

export default function FocusPauseScreen({
  appName = 'Instagram',
  pauseSeconds = 30,
  onDismiss,
}: Props) {
  const [secondsLeft, setSecondsLeft] = useState(pauseSeconds);
  const [canContinue, setCanContinue] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'in' | 'out'>('in');
  const breathAnim = useRef(new Animated.Value(1)).current;
  const breathLoop = useRef<Animated.CompositeAnimation | null>(null);

  const prompt = MINDFUL_PROMPTS[Math.floor(Math.random() * MINDFUL_PROMPTS.length)];

  useEffect(() => {
    breathLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, { toValue: 1.35, duration: 4000, useNativeDriver: true }),
        Animated.delay(800),
        Animated.timing(breathAnim, { toValue: 1, duration: 4000, useNativeDriver: true }),
        Animated.delay(800),
      ])
    );
    breathLoop.current.start();

    const phaseInterval = setInterval(() => {
      setBreathPhase(p => (p === 'in' ? 'out' : 'in'));
    }, 4800);

    return () => {
      breathLoop.current?.stop();
      clearInterval(phaseInterval);
    };
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setCanContinue(true);
      return;
    }
    const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bone} />

      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onDismiss}
          activeOpacity={0.7}
        >
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.topSection}>
          <Text style={styles.appLabel}>You're opening</Text>
          <Text style={styles.appName}>{appName}</Text>
        </View>

        <View style={styles.breathSection}>
          <Animated.View
            style={[styles.breathRingOuter, { transform: [{ scale: breathAnim }] }]}
          >
            <View style={styles.breathRingInner} />
          </Animated.View>
          <Text style={styles.breathLabel}>
            {breathPhase === 'in' ? 'breathe in' : 'breathe out'}
          </Text>
        </View>

        <View style={styles.promptSection}>
          <Text style={styles.prompt}>{prompt}</Text>
        </View>

        <View style={styles.bottomSection}>
          {!canContinue ? (
            <View style={styles.countdownWrap}>
              <Text style={styles.countdownNumber}>{secondsLeft}</Text>
              <Text style={styles.countdownLabel}>seconds</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.continueBtn}
              onPress={onDismiss}
              activeOpacity={0.85}
            >
              <Text style={styles.continueBtnText}>I'm intentional — open it</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.smallNote}>
            {canContinue
              ? 'You chose to continue. That\'s okay.'
              : 'Pause. Breathe. Decide.'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bone,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    paddingRight: spacing.md,
  },
  backBtnText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.slate,
  },
  topSection: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  appLabel: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.mist,
    marginBottom: 6,
  },
  appName: {
    fontFamily: fonts.serif,
    fontSize: 28,
    color: colors.night,
    letterSpacing: -0.5,
  },
  breathSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  breathRingOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.linen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathRingInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.stone,
    opacity: 0.6,
  },
  breathLabel: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.mist,
    marginTop: spacing.lg,
    letterSpacing: 0.5,
  },
  promptSection: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  prompt: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.night,
    textAlign: 'center',
    lineHeight: 31,
    letterSpacing: -0.3,
  },
  bottomSection: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  countdownWrap: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: 16,
    borderRadius: radius.md,
    backgroundColor: colors.linen,
  },
  countdownNumber: {
    fontFamily: fonts.serif,
    fontSize: 40,
    color: colors.night,
    lineHeight: 44,
  },
  countdownLabel: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.mist,
    marginTop: 2,
  },
  continueBtn: {
    width: '100%',
    backgroundColor: colors.night,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueBtnText: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.bone,
    letterSpacing: 0.2,
  },
  smallNote: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.mist,
    textAlign: 'center',
  },
});
