import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import FaceIcon, { FaceType } from '../../components/ui/FaceIcon';
import { useCompletedRecordsStore, CompletedRecord } from '../../store/completedRecordsStore';
import { BookmarkIcon, TagIcon, PenIcon } from '../../components/ui/AppIcons';

const { width } = Dimensions.get('window');

const BG         = '#E5F5EF';
const CARD_BG    = '#FFFFFF';
const TEXT_PRI   = '#1A1A1A';
const TEXT_SEC   = '#6B7280';
const TEAL       = '#0F766E';
const TEAL_DARK  = '#1A7063';
const BTN_DIS_BG = '#E5E7EB';
const BTN_DIS_TX = '#9CA3AF';

const MOODS: { faceType: FaceType; label: string }[] = [
  { faceType: 1, label: 'とても辛い' },
  { faceType: 2, label: '辛い' },
  { faceType: 3, label: 'ふつう' },
  { faceType: 4, label: 'よい' },
  { faceType: 5, label: 'とても良い' },
];

// Card inner width = screen - scrollPadding(20*2) - cardPadding(16*2), split across 5 icons with 4 gaps of 8px
const MOOD_CIRCLE_SIZE = Math.floor((width - 40 - 32 - 32) / 5);
const REVIEW_CARD_WIDTH = width * 0.72;

const REVIEW_CARDS = [
  {
    id: 1,
    bg: '#7EBB9A',
    illustrationEmoji: '🌸🧑‍🌾',
    title: '昨日をふりかえりましょう',
    description: '昨日の記録にまだモヤモヤが残っている時は、もう少し深掘りしてみましょう。',
  },
  {
    id: 2,
    bg: '#8AACBE',
    illustrationEmoji: '📱✏️',
    title: '今週をふりかえりましょう',
    description: '今週は気分の浮き沈みが激しい週でした。深掘りして気分をフラットな状態を目指しましょう。',
  },
];

// ── Date helper ────────────────────────────────────────
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
function formatDateLabel(date: Date): string {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const w = WEEKDAYS[date.getDay()];
  return `今日、${m}/${d}（${w}）の記録`;
}

// ── moodType → FaceType mapping ───────────────────────
const MOOD_FACE_TYPE: Record<CompletedRecord['moodType'], FaceType> = {
  negative: 2,
  neutral:  3,
  positive: 4,
};

// ── Today's record card ────────────────────────────────
function TodayRecordCard({ record, onToggleBookmark }: { record: CompletedRecord; onToggleBookmark: () => void }) {
  const faceType = MOOD_FACE_TYPE[record.moodType];
  const bodyText = record.detail[0] ?? '';
  const categoryChips = [...record.emotionChips, ...record.eventChips];

  return (
    <View style={styles.recordCard}>
      {/* Top row: mood icon + AI summary title + bookmark */}
      <View style={styles.recordTopRow}>
        <FaceIcon type={faceType} active size={48} />

        <Text style={styles.recordTitle} numberOfLines={2}>
          {record.summaryTitle}
        </Text>

        <TouchableOpacity hitSlop={12} onPress={onToggleBookmark}>
          <BookmarkIcon size={20} color={record.bookmarked ? TEAL : TEXT_SEC} />
        </TouchableOpacity>
      </View>

      {/* AI body text (3 lines max) */}
      {!!bodyText && (
        <Text style={styles.recordBody} numberOfLines={3}>{bodyText}</Text>
      )}

      {/* Category chips: emotions + event categories */}
      {categoryChips.length > 0 && (
        <View style={styles.chipRow}>
          {categoryChips.map((chip) => (
            <View key={chip} style={styles.chip}>
              <Text style={styles.chipText}>{chip}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Tags */}
      {record.tags.length > 0 && (
        <View style={styles.tagRow}>
          {record.tags.map((tag) => (
            <View key={tag} style={styles.tagItem}>
              <TagIcon size={12} color={TEAL} />
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}


// ── Main Screen ────────────────────────────────────────
export default function HomeScreen() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const { records, toggleBookmark } = useCompletedRecordsStore();

  const today = new Date();
  const todayRecord = records.find((r) => {
    return (
      r.date.getFullYear() === today.getFullYear() &&
      r.date.getMonth() === today.getMonth() &&
      r.date.getDate() === today.getDate()
    );
  }) ?? null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 挨拶 ─────────────────────────────────── */}
        <View style={styles.greetingRow}>
          <View style={styles.greeting}>
            <Text style={styles.greetingTitle}>こんにちは、 だいさん</Text>
            <Text style={styles.greetingSubtitle}>
              今日を穏やかに過ごすために{'\n'}残りの時間はゆっくり過ごしましょうね。
            </Text>
          </View>
          <TouchableOpacity
            style={styles.chatBtn}
            activeOpacity={0.8}
            onPress={() => router.push('/chat')}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={22} color={TEAL} />
          </TouchableOpacity>
        </View>

        {/* ── 今日の記録 or 気持ち選択 ───────────────── */}
        {todayRecord ? (
          <>
            <Text style={styles.sectionTitle}>{formatDateLabel(today)}</Text>
            <TodayRecordCard record={todayRecord} onToggleBookmark={() => toggleBookmark(todayRecord.id)} />
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>今どんな気持ちですか？</Text>
            <View style={styles.moodCard}>
              <View style={styles.moodIconsFrame}>
              <View style={styles.moodRow}>
                {MOODS.map((mood, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setSelectedMood(i)}
                    activeOpacity={0.8}
                    style={[
                      styles.moodItem,
                      selectedMood === i && styles.moodItemSelected,
                    ]}
                  >
                    <FaceIcon
                      type={mood.faceType}
                      active={selectedMood === null || selectedMood === i}
                      size={MOOD_CIRCLE_SIZE}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              </View>
              <TouchableOpacity
                style={styles.recordBtnWrapper}
                disabled={selectedMood === null}
                activeOpacity={0.8}
                onPress={() => router.push('/record/emotion')}
              >
                <LinearGradient
                  colors={selectedMood !== null ? ['#134E4A', '#14CBB4'] : ['#E5E7EB', '#E5E7EB']}
                  style={styles.recordBtn}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text
                    style={[
                      styles.recordButtonText,
                      selectedMood !== null && styles.recordButtonTextActive,
                    ]}
                  >
                    記録する
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* ── ふりかえり ────────────────────────────── */}
        <Text style={styles.sectionTitle}>ふりかえり</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.reviewScrollView}
          contentContainerStyle={styles.reviewScrollContent}
          snapToInterval={REVIEW_CARD_WIDTH + 12}
          snapToAlignment="start"
          decelerationRate="fast"
        >
          {REVIEW_CARDS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.reviewCard, { width: REVIEW_CARD_WIDTH, backgroundColor: item.bg }]}
              activeOpacity={0.9}
            >
              <View style={[styles.reviewIllustration, { backgroundColor: item.bg }]}>
                <Text style={styles.reviewIllustrationEmoji}>{item.illustrationEmoji}</Text>
              </View>
              <View style={styles.reviewCardBody}>
                <Text style={styles.reviewCardTitle}>{item.title}</Text>
                <Text style={styles.reviewCardDesc}>{item.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── FAB (記録ボタン) — 初回記録後のみ表示 ────── */}
      {todayRecord && <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => router.push('/record/emotion')}
      >
        <LinearGradient
          colors={[TEAL_DARK, TEAL]}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="pencil" size={24} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>}
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  scroll: { flex: 1, backgroundColor: BG },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },

  // Greeting
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 28,
  },
  greeting: { flex: 1 },
  chatBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5F5EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#C5DDD8',
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT_PRI,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: TEXT_SEC,
    lineHeight: 21,
  },

  // Section title
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_PRI,
    marginBottom: 12,
  },

  // Mood card — matches Figma spec:
  // width:354, height:206, padding:16, border-radius:20, box-shadow:0 2px 16px 0 rgba(0,0,0,0.04)
  moodCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 16,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  moodIconsFrame: {
    paddingVertical: 32,
    width: '100%',
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  moodItem: {
    borderRadius: MOOD_CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodItemSelected: {
    transform: [{ scale: 1.12 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  recordBtnWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.19,
    shadowRadius: 16,
    elevation: 5,
  },
  recordBtn: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  recordButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: BTN_DIS_TX,
  },
  recordButtonTextActive: { color: '#FFFFFF' },

  // Today's record card
  recordCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 16,
    gap: 8,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  recordTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  recordTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_PRI,
    lineHeight: 24,
  },
  recordBody: {
    fontSize: 14,
    color: TEXT_PRI,
    lineHeight: 22,
  },
  bookmarkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: TEAL,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  bookmarkBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  chipText: {
    fontSize: 13,
    color: TEXT_PRI,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 13,
    color: TEAL,
    fontWeight: '500',
  },

  // Review section
  reviewScrollView: {
    marginHorizontal: -20,
    marginBottom: 28,
  },
  reviewScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  reviewCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  reviewIllustration: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewIllustrationEmoji: { fontSize: 72 },
  reviewCardBody: {
    backgroundColor: 'rgba(255,255,255,0.82)',
    padding: 16,
  },
  reviewCardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: TEXT_PRI,
    marginBottom: 6,
  },
  reviewCardDesc: {
    fontSize: 13,
    color: TEXT_SEC,
    lineHeight: 19,
  },

  // FAB
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 96,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fabGradient: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
