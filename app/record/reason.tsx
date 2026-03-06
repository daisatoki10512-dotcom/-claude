import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { useRecordStore } from '../../store/recordStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import RecordHeader, { SCREEN_BG } from '../../components/RecordHeader';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

// ── Colors ────────────────────────────────────────────
const BG_TOP          = '#E5F5EF';
const BG_BOT          = '#DDF0E8';
const TEXT_PRI        = '#1A1A1A';
const TEXT_SEC        = '#6B7280';
const TEAL            = '#2AA090';
const TEAL_DARK       = '#1A7063';
const CHIP_DEF_BG     = '#FFFFFF';
const CHIP_DEF_BORDER = '#E5E7EB';
const CHIP_SEL_BG     = '#FFFFFF';
const CHIP_SEL_BORDER = TEAL;
const CHIP_SEL_TEXT   = TEAL;

const TOTAL_STEPS = 8;

// ── Category Data ──────────────────────────────────────
type Category = {
  id: string;
  label: string;
  icon: string;
  items: string[];
};

const CATEGORIES: Category[] = [
  {
    id: 'relationship',
    label: '人間関係',
    icon: 'person-outline',
    items: ['家族', '友人', '恋人・パートナー', '学校関係', '職場関係', '隣人', 'オンライン・SNS', 'コミュニティ'],
  },
  {
    id: 'work',
    label: '仕事・学校',
    icon: 'briefcase-outline',
    items: ['仕事量', '締め切り', '職場の雰囲気', '上司・同僚', '給与・評価', '勉強・課題', '試験・成績', '進路'],
  },
  {
    id: 'mind',
    label: '心と体',
    icon: 'heart-outline',
    items: ['睡眠不足', '体調不良', '疲労', 'メンタル', '食欲', '運動不足', '病気・症状'],
  },
  {
    id: 'life',
    label: '生活・環境',
    icon: 'globe-outline',
    items: ['お金・経済', '住環境', '家事・育児', '交通・移動', '天気・季節', '騒音・環境', 'ひとり暮らし'],
  },
  {
    id: 'future',
    label: '将来・その他',
    icon: 'time-outline',
    items: ['将来への不安', '目標・夢', 'キャリア', '人生の変化', 'その他'],
  },
];

// ── Sub-components ────────────────────────────────────

function ReasonChip({
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
      style={[styles.chip, selected ? styles.chipSelected : styles.chipDefault]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {selected && (
        <Ionicons name="checkmark" size={14} color={CHIP_SEL_TEXT} style={styles.chipCheck} />
      )}
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function CategoryAccordion({
  category,
  isOpen,
  selectedItems,
  onToggle,
  onToggleItem,
}: {
  category: Category;
  isOpen: boolean;
  selectedItems: Set<string>;
  onToggle: () => void;
  onToggleItem: (item: string) => void;
}) {
  return (
    <View style={[styles.accordion, isOpen && styles.accordionOpen]}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={onToggle}
        activeOpacity={0.75}
      >
        <View style={styles.accordionHeaderLeft}>
          <Ionicons name={category.icon as any} size={22} color={TEXT_PRI} style={styles.categoryIcon} />
          <Text style={styles.categoryLabel}>{category.label}</Text>
        </View>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={TEXT_SEC}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.accordionBody}>
          <View style={styles.chipRow}>
            {category.items.map(item => (
              <ReasonChip
                key={item}
                label={item}
                selected={selectedItems.has(item)}
                onPress={() => onToggleItem(item)}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────
export default function ReasonScreen() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [customInput, setCustomInput] = useState('');
  const setReasons = useRecordStore(s => s.setReasons);

  const toggleCategory = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenCategory(prev => (prev === id ? null : id));
  };

  const toggleItem = (item: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  const canNext = selected.size > 0 || customInput.trim().length > 0;

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <RecordHeader current={2} />

        {/* ── スクロール領域 ────────────────────────── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* タイトル */}
          <Text style={styles.title}>なぜそのような感情に{'\n'}なっていますか？</Text>
          <Text style={styles.subtitle}>当てはまるものをすべて選択しましょう。</Text>

          {/* アコーディオンカテゴリ */}
          <View style={styles.categoryList}>
            {CATEGORIES.map(cat => (
              <CategoryAccordion
                key={cat.id}
                category={cat}
                isOpen={openCategory === cat.id}
                selectedItems={selected}
                onToggle={() => toggleCategory(cat.id)}
                onToggleItem={toggleItem}
              />
            ))}
          </View>

          {/* または */}
          <Text style={styles.orText}>または</Text>

          {/* 自分で入力 */}
          <TextInput
            style={styles.customInput}
            placeholder="自分で入力する。"
            placeholderTextColor={TEXT_SEC}
            value={customInput}
            onChangeText={setCustomInput}
            returnKeyType="done"
          />

          <View style={{ height: 32 }} />
        </ScrollView>

        {/* ── 次へボタン ───────────────────────────── */}
        <View style={styles.footer}>
          <TouchableOpacity
            disabled={!canNext}
            activeOpacity={0.85}
            onPress={() => { setReasons(Array.from(selected)); router.push('/record/event'); }}
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
    paddingTop: 12,
  },

  // Title
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: TEXT_PRI,
    lineHeight: 38,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_SEC,
    textAlign: 'center',
    marginBottom: 24,
  },

  // Category list
  categoryList: {
    gap: 10,
    marginBottom: 4,
  },

  // Accordion
  accordion: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  accordionOpen: {
    backgroundColor: '#F3F4F6',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  accordionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 24,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_PRI,
  },

  // Accordion body
  accordionBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  // Chips
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 50,
    borderWidth: 1.5,
  },
  chipDefault: {
    backgroundColor: CHIP_DEF_BG,
    borderColor: CHIP_DEF_BORDER,
  },
  chipSelected: {
    backgroundColor: CHIP_SEL_BG,
    borderColor: CHIP_SEL_BORDER,
  },
  chipCheck: {
    marginRight: 4,
  },
  chipText: {
    fontSize: 14,
    color: TEXT_PRI,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: CHIP_SEL_TEXT,
    fontWeight: '600',
  },

  // Or separator
  orText: {
    textAlign: 'center',
    fontSize: 14,
    color: TEXT_SEC,
    marginVertical: 16,
  },

  // Custom input
  customInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 15,
    color: TEXT_PRI,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  // Footer
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
