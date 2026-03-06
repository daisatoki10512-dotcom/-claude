import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { router } from 'expo-router';
import { useRecordStore } from '../../store/recordStore';
import { LinearGradient } from 'expo-linear-gradient';
import RecordHeader, { SCREEN_BG } from '../../components/RecordHeader';

const TEXT_PRI  = '#1A1A1A';
const TEXT_SEC  = '#6B7280';
const TEAL      = '#14CBB4';
const TEAL_DARK = '#134E4A';

export default function ThoughtScreen() {
  const [text, setText] = useState('');
  const canNext = text.trim().length > 0;
  const setThought = useRecordStore(s => s.setThought);
  const inputRef = useRef<TextInput>(null);
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <RecordHeader current={4} />

        <View style={styles.content}>
          <Text style={styles.title}>その時、頭に浮かんだ考えは{'\n'}ありますか？</Text>
          <Text style={styles.subtitle}>
            そのとき何を感じたのかを整理すると、{'\n'}気分の流れがつかみやすくなります。
          </Text>

          <TextInput
            ref={inputRef}
            style={styles.textarea}
            placeholder="例：自分は嫌われているのかと思った。"
            placeholderTextColor={TEXT_SEC}
            value={text}
            onChangeText={setText}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.buttonWrap}>
            <TouchableOpacity
              disabled={!canNext}
              activeOpacity={0.85}
              onPress={() => { setThought(text); router.push('/record/desire'); }}
              style={styles.nextBtnWrapper}
            >
              <LinearGradient
                colors={canNext ? [TEAL_DARK, TEAL] : ['#E5E7EB', '#E5E7EB']}
                style={styles.nextBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={[styles.nextBtnText, !canNext && styles.nextBtnTextDisabled]}>
                  次へ
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SCREEN_BG },
  safe: { flex: 1 },

  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: TEXT_PRI,
    lineHeight: 38,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_SEC,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  textarea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 15,
    color: TEXT_PRI,
    height: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  buttonWrap: {
    marginTop: 32,
  },
  nextBtnWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.19,
    shadowRadius: 16,
    elevation: 5,
  },
  nextBtn: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  nextBtnText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  nextBtnTextDisabled: {
    color: '#9CA3AF',
  },
});
