import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Polyline } from 'react-native-svg';

// ── Colors ────────────────────────────────────────────
const BG_TOP    = '#E5F5EF';
const BG_BOT    = '#DDF0E8';
const TEXT_PRI  = '#1A1A1A';
const TEXT_SEC  = '#6B7280';
const TEAL      = '#2AA090';
const TEAL_DARK = '#1A7063';
const WHITE     = '#FFFFFF';

const TOTAL_STEPS = 8;
const CURRENT     = 7;

// ── Sub-components ────────────────────────────────────

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

/** 気分アイコン（青いグラデーション円 + 悲しい顔） */
function MoodBadge() {
  return (
    <View style={styles.moodBadgeWrap}>
      <LinearGradient
        colors={['#90B8F8', '#4A8EDF']}
        style={styles.moodCircle}
        start={{ x: 0.2, y: 0.1 }}
        end={{ x: 0.8, y: 0.9 }}
      >
        {/* 悲しい顔 */}
        <Svg width={36} height={36} viewBox="0 0 36 36" fill="none">
          <Circle cx="12" cy="14" r="2.5" fill="#2A5DB0" />
          <Circle cx="24" cy="14" r="2.5" fill="#2A5DB0" />
          <Path
            d="M12 24C14 21 22 21 24 24"
            stroke="#2A5DB0" strokeWidth="2.5" strokeLinecap="round" fill="none"
          />
        </Svg>
      </LinearGradient>
      <Text style={styles.moodLabel}>悪い気分</Text>
    </View>
  );
}

/** インサイトカードのアイコン */
function InsightIcon() {
  return (
    <View style={styles.insightIcon}>
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Polyline points="22 12 18 12 15 21 9 3 6 12 2 12"
          stroke={WHITE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}

/** 感情/出来事チップ */
function Chip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────
export default function SummaryScreen() {
  return (
    <LinearGradient colors={[BG_TOP, BG_BOT]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>

        {/* ── ヘッダー ─────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color={TEXT_PRI} />
          </TouchableOpacity>
          <StepDots />
          <View style={styles.headerRight}>
            <TouchableOpacity hitSlop={12}>
              <Ionicons name="bookmark-outline" size={22} color={TEXT_PRI} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.dismissAll()} hitSlop={12}>
              <Ionicons name="close" size={24} color={TEXT_PRI} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── スクロール領域 ────────────────────────── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* タイトル */}
          <Text style={styles.title}>今日の記録を{'\n'}言葉にしてみると</Text>
          <Text style={styles.subtitle}>
            気に入った言葉にマーカーを引くと、{'\n'}ブックマークに残せます。
            <Text style={styles.infoIcon}> ⓘ</Text>
          </Text>

          {/* ── 今日のふりかえり ─────────────────── */}
          <Text style={styles.sectionTitle}>今日のふりかえり</Text>

          <View style={styles.card}>
            <MoodBadge />

            <Text style={styles.detailLabel}>詳細</Text>
            <Text style={styles.cardBody}>
              上司の方に相談を申し込んだのに、なかなか時間が決まらないと「嫌われているのかな」
              と不安になってしまいますよね。勇気を出したのに、その反応はがっかりしてしまうのも当然です。
            </Text>
            <Text style={styles.cardBody}>
              でも、そう感じるのは、あなたが今の状況を良くしたいと真剣に思っている証拠ですよ。
              もしかしたら上司の方は、単に多忙で余裕がないだけかもしれません。
            </Text>
            <Text style={styles.cardBodyFade}>
              「もう一度伝えたい」と思えるその強さを、ぜひ大切にしてください。
            </Text>

            {/* 感情チップ */}
            <View style={styles.chipRow}>
              <Chip label="不安" />
              <Chip label="がっかり" />
              <Chip label="疲労" />
            </View>

            {/* 出来事 */}
            <Text style={styles.eventLabel}>出来事</Text>
            <View style={styles.chipRow}>
              <Chip label="職場関係" />
            </View>
          </View>

          {/* ── だいさんへメッセージ ──────────────── */}
          <Text style={styles.sectionTitle}>だいさんへメッセージ</Text>

          <View style={styles.insightCard}>
            <InsightIcon />
            <View style={styles.insightBody}>
              <Text style={styles.insightTitle}>不安の裏にある「前向きな力」</Text>
              <Text style={styles.insightText}>
                不安や後悔を感じながらも、心の奥には「あきらめずに解決したい」という強いエネルギーがあります。
                その前向きな気持ちがあれば、きっと次はベストなタイミングが見つかるはずですよ。
              </Text>
            </View>
          </View>

          <View style={styles.insightCard}>
            <InsightIcon />
            <View style={styles.insightBody}>
              <Text style={styles.insightTitle}>「待ち時間」に不安が膨らむ傾向</Text>
              <Text style={styles.insightText}>
                過去の記録を見ると、相手からの反応を待っている時に「自分のせいかも」と不安が強まる傾向があるようです。
                そんな時は「今は相手が考える時間」と割り切って、自分にご褒美をあげるのがあなたの「お守り」でしたね。
              </Text>
            </View>
          </View>

          <View style={styles.insightCard}>
            <InsightIcon />
            <View style={styles.insightBody}>
              <Text style={styles.insightTitle}>「リマインド」が解決の鍵かも？</Text>
              <Text style={styles.insightText}>
                以前、同じように予定が合わずモヤモヤした時、一言「お忙しいところすみません」と再送したことで、
                「忘れてた、ありがとう！」とスムーズに解決したことがありましたよ。あの時と同じように、
                あなたの「もう一度伝えたい」という素直な気持ちに従ってみることが、今の霧を晴らすヒントになりそうです。
              </Text>
            </View>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* ── 次へボタン（固定） ───────────────────── */}
        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => { /* TODO: 次のステップへ */ }}
            style={styles.nextBtnWrapper}
          >
            <LinearGradient
              colors={[TEAL_DARK, TEAL]}
              style={styles.nextBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.nextBtnText}>次へ</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_SEC,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  infoIcon: {
    color: TEAL,
    fontSize: 14,
  },

  // Section
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_PRI,
    marginBottom: 12,
  },

  // Mood badge
  moodBadgeWrap: {
    alignItems: 'center',
    marginBottom: 12,
  },
  moodCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A6BC4',
  },

  // Card
  card: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: TEAL,
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 15,
    color: TEXT_PRI,
    lineHeight: 26,
    marginBottom: 12,
  },
  cardBodyFade: {
    fontSize: 15,
    color: TEXT_SEC,
    lineHeight: 26,
    marginBottom: 16,
  },
  eventLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_SEC,
    marginTop: 8,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    backgroundColor: '#E5F5EF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  chipText: {
    fontSize: 13,
    color: TEXT_PRI,
    fontWeight: '500',
  },

  // Insight cards
  insightCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  insightBody: {
    flex: 1,
    gap: 6,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_PRI,
    lineHeight: 22,
  },
  insightText: {
    fontSize: 14,
    color: TEXT_SEC,
    lineHeight: 22,
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
    color: WHITE,
  },
});
