import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import FaceIcon, { FaceType } from './FaceIcon';
import { TagIcon } from './AppIcons';
import { CompletedRecord } from '../../store/completedRecordsStore';

const { height } = Dimensions.get('window');
const TEAL = '#0F766E';
const TEXT_PRI = '#1A1A1A';
const TEXT_SEC = '#6B7280';

const FACE_TYPES: FaceType[] = [5, 4, 3, 2, 1];

export type FilterState = {
  keyword: string;
  selectedTags: string[];
  selectedMoods: FaceType[];
  selectedEmotions: string[];
};

const EMPTY_FILTER: FilterState = {
  keyword: '',
  selectedTags: [],
  selectedMoods: [],
  selectedEmotions: [],
};

const MOOD_TO_FACE: Record<CompletedRecord['moodType'], FaceType> = {
  positive: 4,
  neutral: 3,
  negative: 2,
};

export function applyFilter(records: CompletedRecord[], filter: FilterState): CompletedRecord[] {
  return records.filter((r) => {
    if (filter.keyword) {
      const kw = filter.keyword.toLowerCase();
      const inTitle = r.summaryTitle.toLowerCase().includes(kw);
      const inBody = r.detail.join(' ').toLowerCase().includes(kw);
      if (!inTitle && !inBody) return false;
    }
    if (filter.selectedTags.length > 0) {
      if (!filter.selectedTags.some((t) => r.tags.includes(t))) return false;
    }
    if (filter.selectedMoods.length > 0) {
      if (!filter.selectedMoods.includes(MOOD_TO_FACE[r.moodType])) return false;
    }
    if (filter.selectedEmotions.length > 0) {
      if (!filter.selectedEmotions.some((e) => r.emotionChips.includes(e))) return false;
    }
    return true;
  });
}

function formatDateRange(records: CompletedRecord[]): string {
  if (records.length === 0) return '記録なし';
  const times = records.map((r) => r.date.getTime());
  const min = new Date(Math.min(...times));
  const max = new Date(Math.max(...times));
  const fmt = (d: Date) => `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
  return `${fmt(min)} - ${fmt(max)}（全ての期間）`;
}

type Props = {
  visible: boolean;
  onClose: () => void;
  records: CompletedRecord[];
  onApply: (filter: FilterState) => void;
};

export default function SearchFilterModal({ visible, onClose, records, onApply }: Props) {
  const [filter, setFilter] = useState<FilterState>(EMPTY_FILTER);

  useEffect(() => {
    if (visible) setFilter(EMPTY_FILTER);
  }, [visible]);

  const allTags = Array.from(new Set(records.flatMap((r) => r.tags)));
  const allEmotions = Array.from(new Set(records.flatMap((r) => r.emotionChips)));
  const resultCount = applyFilter(records, filter).length;
  const dateRange = formatDateRange(records);

  function toggle<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>絞り込み検索</Text>
          <TouchableOpacity onPress={onClose} hitSlop={12}>
            <Ionicons name="close" size={24} color={TEXT_PRI} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
          {/* キーワード */}
          <Text style={styles.sectionLabel}>キーワード</Text>
          <View style={styles.inputRow}>
            <Ionicons name="search" size={16} color="#9CA3AF" />
            <TextInput
              style={styles.input}
              placeholder="キーワードを入力"
              placeholderTextColor="#C4CDD5"
              value={filter.keyword}
              onChangeText={(v) => setFilter({ ...filter, keyword: v })}
            />
          </View>

          {/* タグ */}
          {allTags.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>タグ</Text>
              <View style={styles.chipWrap}>
                {allTags.map((tag) => {
                  const active = filter.selectedTags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      style={[styles.tagChip, active && styles.chipActive]}
                      onPress={() => setFilter({ ...filter, selectedTags: toggle(filter.selectedTags, tag) })}
                      activeOpacity={0.8}
                    >
                      <TagIcon size={12} color={active ? TEAL : TEXT_SEC} />
                      <Text style={[styles.tagChipText, active && styles.chipTextActive]}>{tag}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          {/* 期間 */}
          <Text style={styles.sectionLabel}>期間</Text>
          <View style={styles.periodRow}>
            <Text style={styles.periodText}>{dateRange}</Text>
          </View>

          {/* 気分 */}
          <Text style={styles.sectionLabel}>気分</Text>
          <View style={styles.moodRow}>
            {FACE_TYPES.map((ft) => {
              const active = filter.selectedMoods.includes(ft);
              return (
                <TouchableOpacity
                  key={ft}
                  style={[styles.moodItem, active && styles.moodItemActive]}
                  onPress={() => setFilter({ ...filter, selectedMoods: toggle(filter.selectedMoods, ft) })}
                  activeOpacity={0.8}
                >
                  <FaceIcon type={ft} active size={44} />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 感情 */}
          {allEmotions.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>感情</Text>
              <View style={styles.chipWrap}>
                {allEmotions.map((em) => {
                  const active = filter.selectedEmotions.includes(em);
                  return (
                    <TouchableOpacity
                      key={em}
                      style={[styles.emotionChip, active && styles.chipActive]}
                      onPress={() => setFilter({ ...filter, selectedEmotions: toggle(filter.selectedEmotions, em) })}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.emotionChipText, active && styles.chipTextActive]}>{em}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
        </ScrollView>

        {/* Bottom bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={() => setFilter(EMPTY_FILTER)} activeOpacity={0.7}>
            <Text style={styles.clearText}>すべてクリア</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.applyBtn}
            activeOpacity={0.85}
            onPress={() => { onApply(filter); onClose(); }}
          >
            <LinearGradient
              colors={['#134E4A', '#14CBB4']}
              style={styles.applyBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.applyBtnText}>{resultCount}件の記録を表示</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#EFF6F4',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.88,
    paddingBottom: 32,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C4CDD5',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: TEXT_PRI,
  },
  body: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 4,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_PRI,
    marginTop: 16,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: TEXT_PRI,
    padding: 0,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  tagChipText: {
    fontSize: 14,
    color: TEXT_SEC,
  },
  emotionChip: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  emotionChipText: {
    fontSize: 14,
    color: TEXT_PRI,
  },
  chipActive: {
    backgroundColor: '#E6F4F1',
    borderColor: TEAL,
  },
  chipTextActive: {
    color: TEAL,
    fontWeight: '600',
  },
  periodRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  periodText: {
    fontSize: 15,
    color: TEXT_PRI,
  },
  moodRow: {
    flexDirection: 'row',
    gap: 8,
  },
  moodItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  moodItemActive: {
    borderColor: TEAL,
    backgroundColor: '#E6F4F1',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  clearText: {
    fontSize: 15,
    color: TEXT_PRI,
    textDecorationLine: 'underline',
  },
  applyBtn: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  applyBtnGradient: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 50,
  },
  applyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
