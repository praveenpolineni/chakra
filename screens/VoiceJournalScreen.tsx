import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
} from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { transcribeAudio } from '../services/transcribe';
import { getReflection } from '../services/reflect';
import { colors, fonts, spacing, radius } from '../constants/theme';

const STORAGE_KEY = 'journal-entries';

// 'transcribing' and 'reflecting' are distinct so the UI can show step-specific labels
type RecordingState = 'idle' | 'recording' | 'transcribing' | 'reflecting' | 'done' | 'error';

type Entry = {
  id: string;
  date: string;
  duration: string;
  transcript: string;
  summary: string;
};

function formatSeconds(s: number): string {
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getTodayString(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export default function VoiceJournalScreen() {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(val => {
      if (val) setEntries(JSON.parse(val));
    });
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      pulseLoop.current?.stop();
    };
  }, []);

  const startPulse = () => {
    pulseLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.18, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    pulseLoop.current.start();
  };

  const stopPulse = () => {
    pulseLoop.current?.stop();
    Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  };

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setElapsed(0);
      setRecordingState('recording');
      startPulse();

      timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
    } catch {
      // mic permission denied or hardware issue — stay idle
    }
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    stopPulse();

    // Capture URI before unloading — getURI() returns null after unload
    const uri = recordingRef.current.getURI();

    try {
      await recordingRef.current.stopAndUnloadAsync();
    } catch {}
    recordingRef.current = null;

    if (!uri) {
      setRecordingState('idle');
      return;
    }

    // Step 1 — Whisper transcription
    setRecordingState('transcribing');
    let transcriptText = '';
    try {
      transcriptText = await transcribeAudio(uri);
    } catch (err) {
      console.error('Transcription failed:', err);
      setRecordingState('error');
      return;
    }
    setTranscript(transcriptText);

    // Step 2 — Claude reflection
    setRecordingState('reflecting');
    let reflectionText = '';
    try {
      reflectionText = await getReflection(transcriptText);
    } catch (err) {
      console.error('Reflection failed:', err);
      // Transcript succeeded — still show result, just without the reflection
      reflectionText = '';
    }
    setSummary(reflectionText);
    setRecordingState('done');
  };

  const handleRecordPress = () => {
    if (recordingState === 'idle' || recordingState === 'error') startRecording();
    else if (recordingState === 'recording') stopRecording();
  };

  const saveAndReset = () => {
    const newEntry: Entry = {
      id: Date.now().toString(),
      date: `Today · ${formatSeconds(elapsed)}`,
      duration: formatSeconds(elapsed),
      transcript,
      summary,
    };
    setEntries(prev => {
      const updated = [newEntry, ...prev];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    setTranscript('');
    setSummary('');
    setElapsed(0);
    setRecordingState('idle');
  };

  const isRecording = recordingState === 'recording';
  const isProcessing = recordingState === 'transcribing' || recordingState === 'reflecting';
  const isDone = recordingState === 'done';
  const isError = recordingState === 'error';

  const recordHintLabel = () => {
    if (recordingState === 'transcribing') return 'Transcribing...';
    if (recordingState === 'reflecting')   return 'Reflecting...';
    if (isDone)                            return 'Recording complete';
    if (isError)                           return 'Something went wrong';
    if (isRecording)                       return formatSeconds(elapsed);
    return 'Tap to record';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bone} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.dateText}>{getTodayString()}</Text>
        <Text style={styles.pageTitle}>Voice{'\n'}journal.</Text>

        <View style={styles.recordSection}>
          <Animated.View style={[styles.recordRing, { transform: [{ scale: pulseAnim }] }]}>
            <TouchableOpacity
              style={[
                styles.recordBtn,
                isRecording && styles.recordBtnActive,
                isError && styles.recordBtnError,
              ]}
              onPress={handleRecordPress}
              activeOpacity={0.8}
              disabled={isProcessing || isDone}
            >
              {isProcessing ? (
                <View style={styles.processingDot} />
              ) : isRecording ? (
                <View style={styles.stopSquare} />
              ) : (
                <View style={styles.micShape}>
                  <View style={styles.micBody} />
                  <View style={styles.micBase} />
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>

          <Text style={[styles.recordHint, isError && styles.recordHintError]}>
            {recordHintLabel()}
          </Text>

          {isError && (
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => setRecordingState('idle')}
              activeOpacity={0.7}
            >
              <Text style={styles.retryBtnText}>Tap to try again</Text>
            </TouchableOpacity>
          )}
        </View>

        {isDone && (
          <View style={styles.resultCard}>
            <View style={styles.resultSection}>
              <Text style={styles.resultLabel}>Transcript</Text>
              <Text style={styles.resultText}>{transcript}</Text>
            </View>

            {summary.length > 0 && (
              <>
                <View style={styles.divider} />
                <View style={styles.resultSection}>
                  <Text style={styles.resultLabel}>Reflection</Text>
                  <Text style={styles.summaryText}>{summary}</Text>
                </View>
              </>
            )}

            <TouchableOpacity style={styles.saveBtn} onPress={saveAndReset} activeOpacity={0.85}>
              <Text style={styles.saveBtnText}>Save entry</Text>
            </TouchableOpacity>
          </View>
        )}

        {entries.length > 0 ? (
          <View style={styles.entriesSection}>
            <Text style={styles.sectionLabel}>Past entries</Text>
            {entries.map(entry => (
              <View key={entry.id} style={styles.entryCard}>
                <Text style={styles.entryDate}>{entry.date}</Text>
                {entry.summary.length > 0 && (
                  <Text style={styles.entrySummary}>{entry.summary}</Text>
                )}
                <Text style={styles.entryTranscript} numberOfLines={2}>
                  {entry.transcript}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          !isDone && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Your first entry will appear here.</Text>
            </View>
          )
        )}
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
    marginBottom: spacing.xl,
  },
  recordSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  recordRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.linen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  recordBtn: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.night,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordBtnActive: {
    backgroundColor: '#C0392B',
  },
  recordBtnError: {
    backgroundColor: colors.stone,
  },
  micShape: {
    alignItems: 'center',
  },
  micBody: {
    width: 16,
    height: 22,
    borderRadius: 8,
    backgroundColor: colors.bone,
  },
  micBase: {
    width: 24,
    height: 3,
    backgroundColor: colors.bone,
    borderRadius: 2,
    marginTop: 4,
  },
  stopSquare: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: colors.bone,
  },
  processingDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.bone,
    opacity: 0.6,
  },
  recordHint: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.slate,
    letterSpacing: 0.2,
  },
  recordHintError: {
    color: '#C0392B',
  },
  retryBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  retryBtnText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.mist,
    textDecorationLine: 'underline',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 0.5,
    borderColor: colors.linen,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  resultSection: {
    gap: 6,
  },
  resultLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    color: colors.mist,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  resultText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.dusk,
    lineHeight: 22,
  },
  summaryText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.night,
    lineHeight: 21,
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.linen,
  },
  saveBtn: {
    backgroundColor: colors.night,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  saveBtnText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.bone,
    letterSpacing: 0.2,
  },
  entriesSection: {
    gap: spacing.sm,
  },
  sectionLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    color: colors.mist,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 0.5,
    borderColor: colors.linen,
    gap: 4,
  },
  entryDate: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.mist,
  },
  entrySummary: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.night,
  },
  entryTranscript: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.slate,
    lineHeight: 18,
  },
  emptyState: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.mist,
  },
});
