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
import RecordHeader, { SCREEN_BG, HEADER_INNER_HEIGHT } from '../../components/RecordHeader';
import FaceIcon, { FaceType } from '../../components/ui/FaceIcon';

// ── Colors ────────────────────────────────────────────
const TEXT_PRI  = '#1A1A1A';
const TEXT_SEC  = '#6B7280';
const TEAL      = '#0F766E';
const WHITE     = '#FFFFFF';
const MARKER_BG = '#B2F0E8';

// ── Mood label color by type ──────────────────────────
const MOOD_TEXT_COLOR: Record<AIAnalysisResult['moodType'], string> = {
  negative: '#3A6BC4',
  neutral:  '#4A6090',
  positive: '#0F766E',
};

// ── Highlight helpers ─────────────────────────────────
type Highlight = { start: number; end: number };

function buildSegments(text: string, highlights: Highlight[]) {
  const sorted = [...highlights].sort((a, b) => a.start - b.start);
  const segs: { text: string; highlighted: boolean }[] = [];
  let pos = 0;
  for (const h of sorted) {
    const s = Math.max(h.start, pos);
    const e = h.end;
    if (s > pos) segs.push({ text: text.slice(pos, s), highlighted: false });
    if (e > s)   segs.push({ text: text.slice(s, e),   highlighted: true  });
    pos = Math.max(pos, e);
  }
  if (pos < text.length) segs.push({ text: text.slice(pos), highlighted: false });
  return segs;
}

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

// ── Fallback ──────────────────────────────────────────
const FALLBACK: AIAnalysisResult = {
  summaryTitle: '記録完了',
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
  const { aiResult, analysisError, moodFaceType } = useRecordStore();
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [pendingSel, setPendingSel] = useState<Highlight | null>(null);

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
  const moodTextColor = MOOD_TEXT_COLOR[result.moodType];
  const detailText = result.detail.join('\n\n');
  const segments = buildSegments(detailText, highlights);

  const faceType: FaceType = moodFaceType ?? (
    result.moodType === 'positive' ? 4 : result.moodType === 'negative' ? 2 : 3
  );

  const hasSelection = pendingSel !== null && pendingSel.end > pendingSel.start;

  function applyMarker() {
    if (!pendingSel) return;
    setHighlights(prev => [...prev, pendingSel!]);
    setPendingSel(null);
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <RecordHeader
          current={7}
          rightExtra={
            <TouchableOpacity hitSlop={12}>
              <Ionicons name="bookmark-outline" size={32} color={TEXT_PRI} />
            </TouchableOpacity>
          }
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>今日の記録を{'\n'}言葉にしてみると</Text>
          <Text style={styles.subtitle}>
            気に入った言葉にマーカーを引くと、{'\n'}ブックマークに残せます。
            <Text style={styles.infoIcon} onPress={() => setInfoModalVisible(true)}> ⓘ</Text>
          </Text>

          {analysisError && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={16} color="#B45309" />
              <Text style={styles.errorText}>AI分析に失敗しました。デフォルト表示でご確認ください。</Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>今日のふりかえり</Text>

          <View style={styles.card}>
            {/* 気分: ホームで選択した FaceIcon */}
            <View style={styles.moodBadgeWrap}>
              <FaceIcon type={faceType} active size={72} />
              <Text style={[styles.moodLabel, { color: moodTextColor }]}>{result.moodLabel}</Text>
            </View>

            <Text style={styles.detailLabel}>詳細</Text>

            {/* 選択ポップアップ — 選択中のみ表示 */}
            {hasSelection && (
              <View style={styles.selectionPopup}>
                <TouchableOpacity style={styles.popupItem} onPress={applyMarker} activeOpacity={0.8}>
                  <Text style={styles.popupItemText}>マーカー</Text>
                </TouchableOpacity>
                <View style={styles.popupSep} />
                <TouchableOpacity style={styles.popupItem} onPress={() => setPendingSel(null)} activeOpacity={0.8}>
                  <Text style={styles.popupItemText}>コピー</Text>
                </TouchableOpacity>
                <View style={styles.popupSep} />
                <TouchableOpacity style={styles.popupItem} onPress={() => setPendingSel(null)} activeOpacity={0.8}>
                  <Ionicons name="chevron-forward" size={16} color={WHITE} />
                </TouchableOpacity>
              </View>
            )}

            {/* ハイライト付きテキスト (selectable) */}
            <Text
              selectable
              style={styles.cardBody}
              onSelectionChange={(e) => {
                const { start, end } = e.nativeEvent.selection;
                if (end > start) setPendingSel({ start, end });
                else setPendingSel(null);
              }}
            >
              {segments.map((seg, i) =>
                seg.highlighted
                  ? <Text key={i} style={styles.markerSpan}>{seg.text}</Text>
                  : <Text key={i}>{seg.text}</Text>
              )}
            </Text>

            {/* マーカークリア */}
            {highlights.length > 0 && (
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => setHighlights([])}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={14} color={TEAL} />
                <Text style={styles.clearBtnText}>マーカーをクリア</Text>
              </TouchableOpacity>
            )}

            {/* 感情チップ */}
            {result.emotionChips.length > 0 && (
              <View style={styles.chipRow}>
                {result.emotionChips.map(e => <Chip key={e} label={e} />)}
              </View>
            )}

            {result.eventChips.length > 0 && (
              <>
                <Text style={styles.eventLabel}>出来事</Text>
                <View style={styles.chipRow}>
                  {result.eventChips.map(e => <Chip key={e} label={e} />)}
                </View>
              </>
            )}
          </View>

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

  scroll: {
    paddingHorizontal: 20,
    paddingTop: HEADER_INNER_HEIGHT + 8,
  },

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

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_PRI,
    marginBottom: 12,
  },

  moodBadgeWrap: {
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '600',
  },

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

  // Selection popup
  selectionPopup: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  popupItem: {
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  popupItemText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
  popupSep: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },

  cardBody: {
    fontSize: 15,
    color: TEXT_PRI,
    lineHeight: 26,
  },
  markerSpan: {
    backgroundColor: MARKER_BG,
  },

  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  clearBtnText: {
    fontSize: 12,
    color: TEAL,
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
  insightBody: { flex: 1, gap: 6 },
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
