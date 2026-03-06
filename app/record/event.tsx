import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { useRecordStore } from '../../store/recordStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const BG_TOP      = '#E5F5EF';
const BG_BOT      = '#DDF0E8';
const TEXT_PRI    = '#1A1A1A';
const TEXT_SEC    = '#6B7280';
const TEAL        = '#2AA090';
const TEAL_DARK   = '#1A7063';
const TOTAL_STEPS = 8;
const CURRENT     = 3;

function StepDots() {
  return (
    <View style={styles.dots}>
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <View
          key={i}
          style={[styles.dot, i < CURRENT ? styles.dotActive : styles.dotInactive]}
        />
      ))}
    </View>
  );
}

export default function EventScreen() {
  const [text, setText] = useState('');
  const canNext = text.trim().length > 0;
  const setEvent = useRecordStore(s => s.setEvent);

  return (
    <LinearGradient colors={[BG_TOP, BG_BOT]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.kav}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          {/* ヘッダー */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
              <Ionicons name="chevron-back" size={24} color={TEXT_PRI} />
            </TouchableOpacity>
            <StepDots />
            <TouchableOpacity onPress={() => router.dismissAll()} hitSlop={12}>
              <Ionicons name="close" size={24} color={TEXT_PRI} />
            </TouchableOpacity>
          </View>

          {/* コンテンツ */}
          <View style={styles.content}>
            <Text style={styles.title}>どんな出来事があったか{'\n'}振り返ってみましょう</Text>
            <Text style={styles.subtitle}>
              そのとき何があったのかを整理すると{'\n'}気分の流れがつかみやすくなります。
            </Text>

            <TextInput
              style={styles.textarea}
              placeholder="どんな出来事があったか記載してください。"
              placeholderTextColor={TEXT_SEC}
              value={text}
              onChangeText={setText}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* フッター */}
          <View style={styles.footer}>
            <TouchableOpacity
              disabled={!canNext}
              activeOpacity={0.85}
              onPress={() => { setEvent(text); router.push('/record/thought'); }}
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
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe:     { flex: 1 },
  kav:      { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  dots: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  dot: { height: 6, borderRadius: 3 },
  dotActive:   { width: 24, backgroundColor: TEAL },
  dotInactive: { width: 14, backgroundColor: '#C5DDD8' },

  content: {
    flex: 1,
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
    minHeight: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  footer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
  },
  nextBtnWrapper: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  nextBtn: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 50,
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
