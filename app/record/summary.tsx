import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Polyline } from 'react-native-svg';
import { useRecordStore, AIAnalysisResult } from '../../store/recordStore';
import InfoModal from '../../components/InfoModal';
import RecordHeader, { SCREEN_BG } from '../../components/RecordHeader';

// ── Colors ────────────────────────────────────────────
const BG_TOP    = '#E5F5EF';
const BG_BOT    = '#DDF0E8';
const TEXT_PRI  = '#1A1A1A';
const TEXT_SEC  = '#6B7280';
const TEAL      = '#0F766E';
const TEAL_DARK = '#134E4A';
const WHITE     = '#FFFFFF';

const TOTAL_STEPS = 8;
const CURRENT     = 7;

// ── Mood gradient by type ─────────────────────────────
const MOOD_GRADIENT: Record<AIAnalysisResult['moodType'], [string, string]> = {
  negative: ['#90B8F8', '#4A8EDF'],
  neutral:  ['#B8D4F8', '#7098D8'],
  positive: ['#90E8C8', '#2AA090'],
};

const MOOD_TEXT_COLOR: Record<AIAnalysisResult['moodType'], string> = {
  negative: '#3A6BC4',
  neutral:  '#4A6090',
  positive: '#0F766E',
};

// ── Mood face emoji by type ───────────────────────────
const MOOD_FACE: Record<AIAnalysisResult['moodType'], string> = {
  negative: '😟',
  neutral:  '😐',
  positive: '😊',
};

// ── Sub-components ────────────────────────────────────

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

function Chip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

// ── Error / Fallback ──────────────────────────────────
const FALLBACK: AIAnalysisResult = {
  moodLabel: '記録完了',
  moodType: 'neutral',
  detail: ['今日も記録してくれてありがとう。あなたの気持ちを大切にしてください。'],
  emotionChips: [],
  eventChips: [],
  insights: [
    { title: '記録を続けることが大切', body: '毎日の気持ちを記録することで、自分のパターンを知ることができます。' },
  ],
};

// ── Main Screen ───────────────────────────────────────
export default function SummaryScreen() {
  const { aiResult, analysisError } = useRecordStore();
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  // AI結果がない場合（API呼び出し中 or エラー）
  if (!aiResult && !analysisError) {
    return (
      <View style={styles.root}>
        <SafeAreaView style={[styles.safe, { alignItems: 'center', justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color={TEAL} />
          <Text style={{ color: TEXT_SEC, marginTop: 12 }}>分析中...</Text>
        </SafeAreaView>
      </View>
    );
  }

  const result = aiResult ?? FALLBACK;
  const gradientColors = MOOD_GRADIENT[result.moodType];
  const moodTextColor  = MOOD_TEXT_COLOR[result.moodType];
  const moodFace       = MOOD_FACE[result.moodType];

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <RecordHeader
          current={7}
          rightExtra={
            <TouchableOpacity hitSlop={12}>
              <Ionicons name="bookmark-outline" size={22} color={TEXT_PRI} />
            </TouchableOpacity>
          }
        />

        {/* ── スクロール領域 ────────────────────────── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* タイトル */}
          <Text style={styles.title}>今日の記録を{'\n'}言葉にしてみると</Text>
          <Text style={styles.subtitle}>
            気に入った言葉にマーカーを引くと、{'\n'}ブックマークに残せます。
            <Text
              style={styles.infoIcon}
              onPress={() => setInfoModalVisible(true)}
            > ⓘ</Text>
          </Text>

          {/* エラー通知（API失敗時） */}
          {analysisError && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={16} color="#B45309" />
              <Text style={styles.errorText}>AI分析に失敗しました。デフォルト表示でご確認ください。</Text>
            </View>
          )}

          {/* ── 今日のふりかえり ─────────────────── */}
          <Text style={styles.sectionTitle}>今日のふりかえり</Text>

          <View style={styles.card}>
            {/* 気分バッジ */}
            <View style={styles.moodBadgeWrap}>
              <LinearGradient
                colors={gradientColors}
                style={styles.moodCircle}
                start={{ x: 0.2, y: 0.1 }}
                end={{ x: 0.8, y: 0.9 }}
              >
                <Text style={styles.moodFace}>{moodFace}</Text>
              </LinearGradient>
              <Text style={[styles.moodLabel, { color: moodTextColor }]}>{result.moodLabel}</Text>
            </View>

            {/* 詳細テキスト */}
            <Text style={styles.detailLabel}>詳細</Text>
            {result.detail.map((paragraph, i) => (
              <Text key={i} style={[styles.cardBody, i < result.detail.length - 1 && { marginBottom: 12 }]}>
                {paragraph}
              </Text>
            ))}

            {/* 感情チップ */}
            {result.emotionChips.length > 0 && (
              <View style={styles.chipRow}>
                {result.emotionChips.map(e => <Chip key={e} label={e} />)}
              </View>
            )}

            {/* 出来事 */}
            {result.eventChips.length > 0 && (
              <>
                <Text style={styles.eventLabel}>出来事</Text>
                <View style={styles.chipRow}>
                  {result.eventChips.map(e => <Chip key={e} label={e} />)}
                </View>
              </>
            )}
          </View>

          {/* ── だいさんへメッセージ ──────────────── */}
          <Text style={styles.sectionTitle}>だいさんへメッセージ</Text>

          {result.insights.map((insight, i) => (
            <View key={i} style={styles.insightCard}>
              <InsightIcon />
              <View style={styles.insightBody}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightText}>{insight.body}</Text>
              </View>
            </View>
          ))}

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* ── 次へボタン（固定） ───────────────────── */}
        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/record/tagging')}
            style={styles.nextBtnWrapper}
          >
            <LinearGradient
              colors={['#134E4A', '#14CBB4']}
              style={styles.nextBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.nextBtnText}>次へ</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </SafeAreaView>

      <InfoModal
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
      />
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
  infoIcon: { color: TEAL, fontSize: 14 },

  // Error banner
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { fontSize: 12, color: '#92400E', flex: 1 },

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
  moodFace: { fontSize: 36 },
  moodLabel: {
    fontSize: 14,
    fontWeight: '600',
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
  },
  eventLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_SEC,
    marginTop: 12,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
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
    color: WHITE,
  },
});
