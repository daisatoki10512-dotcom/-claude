import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48; // 24px padding both sides

// ── Colors (from Figma) ──────────────────────────────
const TEXT_PRIMARY   = '#121715';
const TEXT_SECONDARY = '#656967';
const TEXT_GRAY      = '#4b4b4b';
const TEAL           = '#0f766e';
const TEAL_DARK      = '#115e59';
const WHITE          = '#ffffff';
const EMOTION_BG     = '#e6f3f0';
const TAG_BG         = '#f0fdfa';
const MOOD_CHIP_BG   = '#e4eceb';
const MOOD_CHIP_TEXT = '#4a5568';
const BADGE_BG       = '#ccfbf1';

// ── Sub-components ────────────────────────────────────

/** セクションタイトル */
function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

/** 感情チップ (不安、がっかり etc.) */
function EmotionChip({ label, style: chipStyle }: { label: string; style?: object }) {
  return (
    <View style={[styles.emotionChip, chipStyle]}>
      <Text style={styles.emotionChipText}>{label}</Text>
    </View>
  );
}

/** タグチップ (#理不尽 etc.) */
function TagChip({ label }: { label: string }) {
  return (
    <View style={styles.tagChip}>
      <Text style={styles.tagIcon}>#</Text>
      <Text style={styles.tagText}>{label}</Text>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────
export default function PostRecordScreen() {
  return (
    <LinearGradient
      colors={['#f0fdfa', '#eef8ef', '#ecf2e5']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* ── Header ─────────────────────────────── */}
          <View style={styles.header}>
            {/* "こんにちは、だいさん" */}
            <View style={styles.greetingRow}>
              <Text style={styles.greetingBold}>こんにちは、</Text>
              <Text style={styles.greetingBold}>だいさん</Text>
            </View>
            <Text style={styles.greetingMessage}>
              今日を穏やかに過ごすために{'\n'}残りの時間はゆっくり過ごしましょうね。
            </Text>
          </View>

          {/* ── 今日の記録セクション ─────────────────── */}
          <View style={styles.section}>
            <SectionTitle title="今日、11/9（土）の記録" />

            {/* Card 1 : AI サマリーカード */}
            <View style={styles.card}>
              {/* 上段: アイコン + タイトル + 矢印 */}
              <View style={styles.cardTopRow}>
                <View style={styles.cardTopLeft}>
                  {/* Chat face icon (placeholder) */}
                  <View style={styles.faceIcon}>
                    <Text style={styles.faceEmoji}>🤔</Text>
                  </View>
                  <Text style={styles.cardTitleSmall} numberOfLines={2}>
                    相談したいのに、予定を合わせてもらえなかった
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </View>

              {/* ボディテキスト */}
              <Text style={styles.cardBody}>
                上司の方に相談を申し込んだのに、なかなか時間が決まらないと
                「嫌われているのかな」と不安になってしまいますよね。
                勇気を出したのに、その反応はがっかりしてしまうのも当然です。
              </Text>

              {/* AIバッジ + 感情チップ */}
              <View style={styles.badgeRow}>
                <View style={styles.aiBadge}>
                  <View style={styles.aiBadgeIcon} />
                  <Text style={styles.aiBadgeText}>1</Text>
                </View>
                <View style={styles.chipsRow}>
                  <EmotionChip label="不安" />
                  <EmotionChip label="がっかり" />
                  <EmotionChip label="後悔" />
                  <EmotionChip label="職場関係" />
                </View>
              </View>

              {/* ハッシュタグ */}
              <View style={styles.tagsRow}>
                <TagChip label="理不尽" />
                <TagChip label="佐藤先輩" />
              </View>
            </View>

            {/* Card 2 : 気分ログカード */}
            <View style={styles.card}>
              {/* 上段: 気分emoji + タイトル + more */}
              <View style={styles.cardTopRow}>
                <View style={styles.cardTopLeft}>
                  <View style={styles.moodBlock}>
                    <Text style={styles.moodFaceEmoji}>😞</Text>
                    <Text style={styles.moodLabel}>モヤモヤ</Text>
                  </View>
                  <Text style={styles.cardTitleSmall} numberOfLines={2}>
                    職場の同僚との出来事に落胆と不安を感じた
                  </Text>
                </View>
                <Text style={styles.moreIcon}>•••</Text>
              </View>

              {/* ボディテキスト */}
              <Text style={styles.cardBodyGray}>
                少し不安や落胆を感じた瞬間があったようです。職場で相手にされない不安を感じたのは、
                きっと"自分の考えをちゃんと受け止めてほしい"という気持ちがあったからですね。
              </Text>

              {/* 感情チップ */}
              <View style={styles.chipsRow}>
                <View style={[styles.emotionChip, styles.moodChip]}>
                  <Text style={styles.moodChipText}>落胆</Text>
                </View>
                <View style={[styles.emotionChip, styles.moodChip]}>
                  <Text style={styles.moodChipText}>不安</Text>
                </View>
              </View>

              {/* タグ + ブックマーク */}
              <View style={styles.cardBottomRow}>
                <View style={styles.tagsRow}>
                  <TagChip label="理不尽" />
                  <TagChip label="佐藤先輩" />
                </View>
                <Text style={styles.bookmarkIcon}>🔖</Text>
              </View>
            </View>
          </View>

          {/* ── ふりかえりセクション ─────────────────── */}
          <View style={styles.section}>
            <SectionTitle title="ふりかえり" />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.reviewScroll}
            >
              {/* カード: 昨日をふりかえり */}
              <View style={styles.reviewCard}>
                <LinearGradient
                  colors={['#d1fae5', '#a7f3d0']}
                  style={styles.reviewImageArea}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.reviewIllustration}>🌱</Text>
                </LinearGradient>
                <View style={styles.reviewContent}>
                  <Text style={styles.reviewCardTitle}>昨日をふりかえりましょう</Text>
                  <Text style={styles.reviewCardBody}>
                    昨日の記録にまだモヤモヤが残っている時は、もう少し深掘りしてみましょう。
                  </Text>
                </View>
              </View>

              {/* カード: 今週をふりかえり */}
              <View style={styles.reviewCard}>
                <LinearGradient
                  colors={['#bae6fd', '#7dd3fc']}
                  style={styles.reviewImageArea}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.reviewIllustration}>📅</Text>
                </LinearGradient>
                <View style={styles.reviewContent}>
                  <Text style={styles.reviewCardTitle}>今週をふりかえりましょう</Text>
                  <Text style={styles.reviewCardBody}>
                    今週は気分の浮き沈みが激しい週でした。深掘りして気分をフラットな状態を目指しましょう。
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* ── FAB ────────────────────────────────── */}
        <LinearGradient
          colors={['#065467', '#34d3bb']}
          style={styles.fab}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity style={styles.fabInner} activeOpacity={0.85} onPress={() => router.push('/record/emotion')}>
            <Text style={styles.fabIcon}>✎</Text>
          </TouchableOpacity>
        </LinearGradient>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ── Styles ────────────────────────────────────────────
const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe:     { flex: 1 },
  scroll:   { paddingHorizontal: 24, paddingTop: 24 },

  // Header
  header: { marginBottom: 32, gap: 4 },
  greetingRow: { flexDirection: 'row', flexWrap: 'wrap' },
  greetingBold: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    lineHeight: 39,
  },
  greetingMessage: {
    fontSize: 16,
    fontWeight: '400',
    color: TEXT_SECONDARY,
    lineHeight: 25.6,
    marginTop: 4,
  },

  // Section
  section:      { marginBottom: 32, gap: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: TEXT_PRIMARY, lineHeight: 28 },

  // Cards
  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTopLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },

  // Face icon (Card 1)
  faceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  faceEmoji: { fontSize: 26 },

  cardTitleSmall: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    lineHeight: 25.6,
  },
  chevron: { fontSize: 22, color: TEXT_SECONDARY, marginTop: 4 },

  // Body text
  cardBody: {
    fontSize: 15,
    fontWeight: '400',
    color: TEXT_PRIMARY,
    lineHeight: 24,
  },
  cardBodyGray: {
    fontSize: 14,
    fontWeight: '400',
    color: TEXT_GRAY,
    lineHeight: 22.4,
  },

  // AI badge
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BADGE_BG,
    borderRadius: 43.5,
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 4,
  },
  aiBadgeIcon: {
    width: 14,
    height: 14,
    borderRadius: 27,
    backgroundColor: TEAL,
  },
  aiBadgeText: {
    fontSize: 14,
    fontWeight: '510',
    color: TEXT_PRIMARY,
    lineHeight: 22.4,
  },

  // Chips
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  emotionChip: {
    backgroundColor: EMOTION_BG,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 3,
  },
  emotionChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: TEXT_PRIMARY,
    lineHeight: 19.2,
  },
  moodChip: { backgroundColor: MOOD_CHIP_BG },
  moodChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: MOOD_CHIP_TEXT,
    lineHeight: 19.2,
  },

  // Tags
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TAG_BG,
    borderRadius: 42,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 2,
  },
  tagIcon: { fontSize: 12, color: TEAL_DARK, fontWeight: '400' },
  tagText:  { fontSize: 12, color: TEAL_DARK, lineHeight: 13.2 },

  // Card 2 mood block
  moodBlock: { alignItems: 'center', width: 40, flexShrink: 0 },
  moodFaceEmoji: { fontSize: 36 },
  moodLabel: { fontSize: 10, color: '#718096', lineHeight: 14, textAlign: 'center' },

  moreIcon: { fontSize: 16, color: TEXT_PRIMARY, letterSpacing: 2 },
  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bookmarkIcon: { fontSize: 32 },

  // Review (ふりかえり)
  reviewScroll: { gap: 12, paddingBottom: 4 },
  reviewCard: {
    width: CARD_WIDTH * 0.82,
    backgroundColor: WHITE,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  reviewImageArea: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewIllustration: { fontSize: 72 },
  reviewContent: {
    backgroundColor: WHITE,
    padding: 16,
    gap: 4,
  },
  reviewCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    lineHeight: 28,
  },
  reviewCardBody: {
    fontSize: 14,
    fontWeight: '400',
    color: TEXT_SECONDARY,
    lineHeight: 22.4,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 68.57,
    shadowColor: '#065467',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: { fontSize: 26, color: WHITE },
});
