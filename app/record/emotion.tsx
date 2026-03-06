import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { useRecordStore } from '../../store/recordStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import RecordHeader, { SCREEN_BG, HEADER_INNER_HEIGHT } from '../../components/RecordHeader';
import SelectChip from '../../components/SelectChip';

// ── Colors ────────────────────────────────────────────
const TEXT_PRI  = '#1A1A1A';
const TEXT_SEC  = '#6B7280';

// ── Data ──────────────────────────────────────────────
const POSITIVE_EMOTIONS = [
  '嬉しい', '楽しい', '幸せ', '面白い',
  '穏やか', 'ワクワク', '誇り',
  '感謝', '安心', '満足', '爽やか',
];

const NEGATIVE_EMOTIONS = [
  '不安', '悲しい', '怒り', '緊張',
  'イライラ', '憂鬱', '焦り', 'がっかり',
  '罪悪感', '疲労', '孤独', '苦しい',
  '虚しい', '不満', '恐怖', '辛い', '退屈',
];

const TOTAL_STEPS = 8;

// ── Main Screen ───────────────────────────────────────
export default function EmotionScreen() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [customInput, setCustomInput] = useState('');
  const [customEmotions, setCustomEmotions] = useState<string[]>([]);
  const setEmotions = useRecordStore(s => s.setEmotions);

  const toggle = (label: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    setCustomEmotions(prev => [...prev, trimmed]);
    setSelected(prev => new Set(prev).add(trimmed));
    setCustomInput('');
  };

  const canNext = selected.size > 0;

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <RecordHeader current={1} onBack={() => router.back()} onClose={() => router.back()} />

        {/* ── スクロール領域 ────────────────────────── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* タイトル */}
          <Text style={styles.title}>今どんな感情を{'\n'}抱いていますか？</Text>
          <Text style={styles.subtitle}>当てはまるものをすべて選択しましょう。</Text>

          {/* ポジティブ */}
          <Text style={styles.categoryLabel}>ポジティブ</Text>
          <View style={styles.chipRow}>
            {POSITIVE_EMOTIONS.map(e => (
              <SelectChip key={e} label={e} selected={selected.has(e)} onPress={() => toggle(e)} />
            ))}
          </View>

          {/* ネガティブ */}
          <Text style={styles.categoryLabel}>ネガティブ</Text>
          <View style={styles.chipRow}>
            {NEGATIVE_EMOTIONS.map(e => (
              <SelectChip key={e} label={e} selected={selected.has(e)} onPress={() => toggle(e)} />
            ))}
          </View>

          {/* カスタム感情 */}
          {customEmotions.length > 0 && (
            <>
              <Text style={styles.categoryLabel}>作成した感情</Text>
              <View style={styles.chipRow}>
                {customEmotions.map(e => (
                  <SelectChip key={e} label={e} selected={selected.has(e)} onPress={() => toggle(e)} />
                ))}
              </View>
            </>
          )}

          {/* 感情を作成する入力 */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="新しく感情を作成する。"
              placeholderTextColor={TEXT_SEC}
              value={customInput}
              onChangeText={setCustomInput}
              onSubmitEditing={addCustom}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={[styles.addBtn, customInput.trim().length > 0 && styles.addBtnActive]}
              onPress={addCustom}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={22} color={customInput.trim().length > 0 ? '#FFFFFF' : TEXT_SEC} />
            </TouchableOpacity>
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>

        {/* ── 次へボタン ───────────────────────────── */}
        <View style={styles.footer}>
          <TouchableOpacity
            disabled={!canNext}
            activeOpacity={0.85}
            onPress={() => { setEmotions(Array.from(selected)); router.push('/record/reason'); }}
            style={styles.nextBtnWrapper}
          >
            <LinearGradient
              colors={canNext ? ['#134E4A', '#14CBB4'] : ['#E5E7EB', '#E5E7EB']}
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

      </SafeAreaView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SCREEN_BG },
  safe: { flex: 1 },

  // Scroll
  scroll: {
    paddingHorizontal: 20,
    paddingTop: HEADER_INNER_HEIGHT + 12,
  },

  // Title
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT_PRI,
    lineHeight: 40,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_SEC,
    textAlign: 'center',
    marginBottom: 28,
  },

  // Category
  categoryLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_PRI,
    marginBottom: 12,
    marginTop: 4,
  },

  // Chips
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },

  // Custom input
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: TEXT_PRI,
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnActive: {
    backgroundColor: '#0F766E',
  },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
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
