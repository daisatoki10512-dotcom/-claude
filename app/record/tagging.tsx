import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import RecordHeader, { SCREEN_BG, HEADER_INNER_HEIGHT } from '../../components/RecordHeader';
import { useRecordStore } from '../../store/recordStore';
import { useCompletedRecordsStore } from '../../store/completedRecordsStore';
import SelectChip from '../../components/SelectChip';

// ── Colors ────────────────────────────────────────────
const TEXT_PRI  = '#1A1A1A';
const TEXT_SEC  = '#6B7280';
const WHITE     = '#FFFFFF';

const TOTAL_STEPS = 8;
const CURRENT     = 8;

const SUGGESTED_TAGS = ['理不尽', '人間関係', '仕事', '不安'];

// ── Main Screen ───────────────────────────────────────
export default function TaggingScreen() {
  const { aiResult, eventText, emotions, setTags, reset } = useRecordStore();
  const { addRecord } = useCompletedRecordsStore();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    if (!selectedTags.includes(trimmed)) {
      setSelectedTags((prev) => [...prev, trimmed]);
    }
    setInputText('');
  };

  const handleComplete = () => {
    setTags(selectedTags);
    addRecord({
      summaryTitle: (aiResult?.summaryTitle ?? eventText.slice(0, 20)) || '記録済み',
      moodLabel: aiResult?.moodLabel ?? '記録済み',
      moodType: aiResult?.moodType ?? 'neutral',
      eventText,
      detail: aiResult?.detail ?? [],
      emotionChips: aiResult?.emotionChips ?? emotions,
      eventChips: aiResult?.eventChips ?? [],
      tags: selectedTags,
    });
    reset();
    router.push('/record/complete');
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <RecordHeader current={8} />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >

          {/* ── コンテンツ ────────────────────────────── */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            {/* タイトル */}
            <Text style={styles.title}>今回の記録に{'\n'}タグをつけましょう</Text>
            <Text style={styles.subtitle}>
              タグをつけておくと、{'\n'}
              同じような気分や出来事があったときに{'\n'}
              あとから見返せます。
            </Text>

            {/* おすすめのタグ */}
            <Text style={styles.sectionLabel}>おすすめのタグ</Text>
            <View style={styles.chipRow}>
              {SUGGESTED_TAGS.map((tag) => (
                <SelectChip
                  key={tag}
                  label={tag}
                  selected={selectedTags.includes(tag)}
                  onPress={() => toggleTag(tag)}
                />
              ))}
            </View>

            {/* カスタムタグ入力 */}
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="新しくタグを作成する。"
                placeholderTextColor={TEXT_SEC}
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={addCustomTag}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.addBtn}
                onPress={addCustomTag}
                hitSlop={8}
              >
                <Ionicons name="add" size={20} color={WHITE} />
              </TouchableOpacity>
            </View>

            {/* 追加済みカスタムタグ */}
            {selectedTags.filter((t) => !SUGGESTED_TAGS.includes(t)).length > 0 && (
              <View style={styles.chipRow}>
                {selectedTags
                  .filter((t) => !SUGGESTED_TAGS.includes(t))
                  .map((tag) => (
                    <SelectChip
                      key={tag}
                      label={tag}
                      selected
                      onPress={() => toggleTag(tag)}
                    />
                  ))}
              </View>
            )}

            <View style={{ height: 120 }} />
          </ScrollView>

          {/* ── 完了ボタン（固定） ───────────────────── */}
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleComplete}
              style={styles.completeBtnWrapper}
            >
              <LinearGradient
                colors={['#134E4A', '#14CBB4']}
                style={styles.completeBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.completeBtnText}>記録を完了する</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
    paddingTop: HEADER_INNER_HEIGHT + 8,
  },

  // Title
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
    marginBottom: 32,
  },

  // Section
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_PRI,
    marginBottom: 12,
  },

  // Chips
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },

  // Input row
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: TEXT_PRI,
    paddingVertical: 14,
  },
  addBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#B0B8C1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
  },
  completeBtnWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.19,
    shadowRadius: 16,
    elevation: 5,
  },
  completeBtn: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  completeBtnText: {
    fontSize: 17,
    fontWeight: '600',
    color: WHITE,
  },
});
