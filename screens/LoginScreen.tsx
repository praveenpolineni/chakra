import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { colors, fonts, spacing, radius } from '../constants/theme';

type Props = {
  onSuccess: () => Promise<void>;
  onSignUp: () => void;
};

export default function LoginScreen({ onSuccess, onSignUp }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const handleSignIn = async () => {
    setError('');
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }
    setLoading(true);
    await onSuccess();
    setLoading(false);
  };

  const handleForgotPassword = () => {
    Alert.alert('Coming soon', 'Password reset will be available in a future update.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bone} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandMark}>
            <View style={styles.brandMarkInner} />
          </View>

          <Text style={styles.headline}>Welcome back.</Text>
          <Text style={styles.subtext}>Pick up where you left off.</Text>

          <View style={styles.inputCard}>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.mist}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                ref={passwordRef}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Your password"
                placeholderTextColor={colors.mist}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={handleForgotPassword}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          {error.length > 0 && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <TouchableOpacity
            style={[styles.btnPrimary, loading && styles.btnDisabled]}
            onPress={handleSignIn}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Text style={styles.btnPrimaryText}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={onSignUp}
            activeOpacity={0.7}
          >
            <Text style={styles.btnSecondaryText}>New to CHAKRA?</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bone,
  },
  kav: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  brandMark: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  brandMarkInner: {
    width: 14,
    height: 14,
    borderRadius: radius.full,
    backgroundColor: colors.bone,
  },
  headline: {
    fontFamily: fonts.serif,
    fontSize: 36,
    color: colors.night,
    lineHeight: 44,
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
  },
  subtext: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.slate,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.linen,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  inputRow: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  inputLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    color: colors.mist,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.night,
    paddingVertical: 2,
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.linen,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    paddingVertical: spacing.sm,
    paddingHorizontal: 2,
    marginBottom: spacing.xs,
  },
  forgotText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.mist,
    textDecorationLine: 'underline',
  },
  errorText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: '#C0392B',
    marginBottom: spacing.sm,
    paddingHorizontal: 2,
  },
  btnPrimary: {
    backgroundColor: colors.btnPrimary,
    borderRadius: radius.md,
    paddingVertical: 17,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  btnDisabled: {
    opacity: 0.55,
  },
  btnPrimaryText: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.btnPrimaryText,
    letterSpacing: 0.2,
  },
  btnSecondary: {
    borderRadius: radius.md,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: colors.stone,
  },
  btnSecondaryText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.slate,
  },
});
