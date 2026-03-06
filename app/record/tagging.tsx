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
import { useRecordStore } from '../../store/recordStore';

// ── Colors ────────────────────────────────────────────
const BG_TOP    = '#E5F5EF';
const BG_BOT    = '#DDF0E8';
const TEXT_PRI  = '#1A1A1A';
const TEXT_SEC  = '#6B7280';
const TEAL      = '#2AA090';
const TEAL_DARK = '#1A7063';
const WHITE     = '#FFFFFF';

const TOTAL_STEPS = 8;
const CURRENT     = 8;

const SUGGESTED_TAGS = ['理不尽', '人間関係', '仕事', '不安'];

// ── Step dots ─────────────────────────────────────────
function StepDots() {
  return (
    <View style={styles.dots}>
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i < CURRENT ? styles.dotActive : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
}

// ── Tag chip ──────────────────────────────────────────
function TagChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Ionicons
        name="pricetag"
        size={13}
        color={selected ? TEAL : TEXT_PRI}
        style={{ marginRight: 4 }}
      />
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ── Main Screen ───────────────────────────────────────
export default function TaggingScreen() {
  const { setTags, reset } = useRecordStore();

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
    reset();
    router.dismissAll();
  };

  return (
    <LinearGradient colors={[BG_TOP, BG_BOT]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* ── ヘッダー ─────────────────────────────── */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
              <Ionicons name="chevron-back" size={24} color={TEXT_PRI} />
            </TouchableOpacity>
            <StepDots />
            <TouchableOpacity onPress={() => router.dismissAll()} hitSlop={12}>
              <Ionicons name="close" size={24} color={TEXT_PRI} />
            </TouchableOpacity>
          </View>

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
                <TagChip
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
                    <TagChip
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
                colors={[TEAL_DARK, TEAL]}
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
    </LinearGradient>
  );
}

// ── Styles ────────────────────────────────────────────
const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe:     { flex: 1 },

  // Header
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

  // Scroll
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
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
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: WHITE,
  },
  chipSelected: {
    borderColor: TEAL,
    backgroundColor: WHITE,
  },
  chipText: {
    fontSize: 14,
    color: TEXT_PRI,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: TEAL,
    fontWeight: '600',
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
    borderRadius: 50,
    overflow: 'hidden',
  },
  completeBtn: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 50,
  },
  completeBtnText: {
    fontSize: 17,
    fontWeight: '600',
    color: WHITE,
  },
});
