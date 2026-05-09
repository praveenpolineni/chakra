// screens/WelcomeScreen.tsx
// This is the first screen a user sees when they open CHAKRA.
// It shows the brand, a calm headline, and one clear action.

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { colors, fonts, spacing, radius } from '../constants/theme';

// Get screen height so we can space things proportionally
const { height } = Dimensions.get('window');

export default function WelcomeScreen() {
  // This runs when user taps "Begin"
  const handleBegin = () => {
    console.log('Begin tapped — navigate to onboarding next');
    // Later: navigation.navigate('Onboarding')
  };

  // This runs when user taps "I already have an account"
  const handleLogin = () => {
    console.log('Login tapped');
    // Later: navigation.navigate('Login')
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* StatusBar controls the top bar color */}
      <StatusBar barStyle="dark-content" backgroundColor={colors.bone} />

      <View style={styles.container}>

        {/* ── TOP SECTION ── Brand mark + headline */}
        <View style={styles.topSection}>

          {/* Brand mark — small sage green icon */}
          <View style={styles.brandMark}>
            <View style={styles.brandMarkInner} />
          </View>

          {/* Main headline */}
          <Text style={styles.headline}>
            Your rhythm.{'\n'}Your clarity.{'\n'}Your life.
          </Text>

          {/* Supporting subtext */}
          <Text style={styles.subtext}>
            Build a daily rhythm that feels like yours —{'\n'}
            not someone else's system.
          </Text>
        </View>

        {/* ── BOTTOM SECTION ── Dots + buttons */}
        <View style={styles.bottomSection}>

          {/* Onboarding progress dots */}
          <View style={styles.dotsRow}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          {/* Primary button */}
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={handleBegin}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>Begin</Text>
          </TouchableOpacity>

          {/* Secondary login link */}
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={handleLogin}
            activeOpacity={0.7}
          >
            <Text style={styles.btnSecondaryText}>
              I already have an account
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
}

// ── STYLES ──
// StyleSheet.create is React Native's way of writing CSS.
// It's like CSS but written in JavaScript objects.

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bone, // warm off-white — not pure white
  },

  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,    // left/right padding
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    justifyContent: 'space-between', // pushes top and bottom apart
  },

  // ── Top section
  topSection: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: spacing.xxl,
  },

  brandMark: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.sage,     // the only green in the app
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,        // big gap before headline
  },

  brandMarkInner: {
    width: 14,
    height: 14,
    borderRadius: radius.full,
    backgroundColor: colors.bone,    // white circle inside green square
  },

  headline: {
    fontFamily: fonts.serif,          // DM Serif Display — elegant
    fontSize: 36,
    color: colors.night,
    lineHeight: 44,
    letterSpacing: -0.5,
    marginBottom: spacing.md,
  },

  subtext: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.slate,              // muted — not competing with headline
    lineHeight: 22,
  },

  // ── Bottom section
  bottomSection: {
    gap: spacing.sm,                  // space between each button
  },

  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: spacing.sm,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.stone,   // inactive dot — subtle gray
  },

  dotActive: {
    width: 18,                        // active dot is wider (pill shape)
    backgroundColor: colors.night,   // dark — stands out
    borderRadius: radius.full,
  },

  btnPrimary: {
    backgroundColor: colors.btnPrimary,   // dark button
    borderRadius: radius.md,
    paddingVertical: 17,
    alignItems: 'center',
  },

  btnPrimaryText: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.btnPrimaryText,         // light text on dark button
    letterSpacing: 0.2,
  },

  btnSecondary: {
    borderRadius: radius.md,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: colors.stone,            // very subtle border
  },

  btnSecondaryText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.slate,                  // muted — not the main action
  },
});