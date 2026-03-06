import {
  View,
  Text,
  StyleSheet,
  Animated,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Rect, Circle, Line } from 'react-native-svg';
import Anthropic from '@anthropic-ai/sdk';
import { useRecordStore, AIAnalysisResult } from '../../store/recordStore';

const BG_TOP   = '#E5F5EF';
const BG_BOT   = '#D4EDE3';
const TEXT_PRI = '#1A1A1A';
const TEXT_SEC = '#6B7280';

// ── イラスト SVG ─────────────────────────────────────
function WritingIllustration() {
  return (
    <Svg width={240} height={240} viewBox="0 0 240 240" fill="none">
      {/* スマートフォン本体 */}
      <Rect x="110" y="30" width="90" height="150" rx="14" ry="14"
        stroke="#1A1A1A" strokeWidth="3" fill="white" />
      <Rect x="143" y="40" width="24" height="8" rx="4"
        stroke="#1A1A1A" strokeWidth="2" fill="none" />
      {/* 画面内テキスト行 */}
      <Path d="M125 70 Q145 67 165 70" stroke="#1A1A1A" strokeWidth="2.5"
        strokeLinecap="round" fill="none" />
      <Path d="M125 82 Q148 79 168 82" stroke="#1A1A1A" strokeWidth="2"
        strokeLinecap="round" fill="none" />
      <Circle cx="127" cy="97" r="3" fill="#1A1A1A" />
      <Line x1="134" y1="97" x2="168" y2="97" stroke="#1A1A1A" strokeWidth="2"
        strokeLinecap="round" />
      <Circle cx="127" cy="110" r="3" fill="#1A1A1A" />
      <Line x1="134" y1="110" x2="162" y2="110" stroke="#1A1A1A" strokeWidth="2"
        strokeLinecap="round" />
      <Circle cx="127" cy="123" r="3" fill="#1A1A1A" />
      <Line x1="134" y1="123" x2="165" y2="123" stroke="#1A1A1A" strokeWidth="2"
        strokeLinecap="round" />
      {/* 人物・胴体 */}
      <Path d="M95 110 C85 118 72 130 68 148" stroke="#1A1A1A" strokeWidth="3"
        strokeLinecap="round" fill="none" />
      <Circle cx="100" cy="98" r="14" stroke="#1A1A1A" strokeWidth="3" fill="white" />
      <Circle cx="110" cy="88" r="8" stroke="#1A1A1A" strokeWidth="2.5" fill="#1A1A1A" />
      <Path d="M88 115 C75 125 58 140 44 158" stroke="#1A1A1A" strokeWidth="3"
        strokeLinecap="round" fill="none" />
      <Path d="M106 114 C112 120 116 130 118 140" stroke="#1A1A1A" strokeWidth="3"
        strokeLinecap="round" fill="none" />
      <Path d="M68 148 C62 160 58 172 56 185" stroke="#1A1A1A" strokeWidth="3"
        strokeLinecap="round" fill="none" />
      <Path d="M72 150 C74 163 74 175 72 188" stroke="#1A1A1A" strokeWidth="3"
        strokeLinecap="round" fill="none" />
      <Path d="M56 185 C50 188 46 190 44 188" stroke="#1A1A1A" strokeWidth="2.5"
        strokeLinecap="round" fill="none" />
      <Path d="M72 188 C68 192 64 193 62 191" stroke="#1A1A1A" strokeWidth="2.5"
        strokeLinecap="round" fill="none" />
      {/* 鉛筆 */}
      <Path d="M85 138 L44 185" stroke="#1A1A1A" strokeWidth="3"
        strokeLinecap="round" fill="none" />
      <Path d="M78 132 L37 179" stroke="#1A1A1A" strokeWidth="3"
        strokeLinecap="round" fill="none" />
      <Path d="M85 138 L78 132 L82 126 L90 132 Z" stroke="#1A1A1A" strokeWidth="2"
        fill="#1A1A1A" />
      <Path d="M44 185 L37 179 L35 195 Z" stroke="#1A1A1A" strokeWidth="2"
        fill="#1A1A1A" />
      <Path d="M81 135 L40 182" stroke="white" strokeWidth="1.5"
        strokeLinecap="round" />
    </Svg>
  );
}

// ── Claude API でAI分析を実行 ─────────────────────────
async function runAnalysis(
  emotions: string[],
  reasons: string[],
  eventText: string,
  thoughtText: string,
  desireText: string,
): Promise<AIAnalysisResult> {
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('EXPO_PUBLIC_ANTHROPIC_API_KEY が設定されていません');

  const client = new Anthropic({ apiKey });

  const userContent = [
    emotions.length  ? `【感情】${emotions.join('、')}` : '',
    reasons.length   ? `【理由】${reasons.join('、')}` : '',
    eventText.trim() ? `【出来事】${eventText.trim()}` : '',
    thoughtText.trim() ? `【考えたこと】${thoughtText.trim()}` : '',
    desireText.trim() ? `【本当の望み】${desireText.trim()}` : '',
  ].filter(Boolean).join('\n');

  const message = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 2048,
    thinking: { type: 'adaptive' },
    system: `あなたは感情日記アプリの共感的なAIカウンセラーです。
ユーザーが今日記録した感情・出来事・思考・望みをもとに、温かくて共感的な振り返りと、パーソナライズされたインサイトを生成してください。
日本語で応答し、必ず以下のJSON形式のみで返してください（説明やマークダウン不要）。

{
  "summaryTitle": "記録内容を20文字以内で端的に要約したタイトル（例: 上司に相談できなかった、友達と喧嘩してしまった）",
  "moodLabel": "気分の一言ラベル（例: 悪い気分、モヤモヤ、嬉しい）",
  "moodType": "negative | neutral | positive",
  "detail": ["段落1（共感的なふりかえり）", "段落2（気持ちの意味付け）", "段落3（前向きな視点）"],
  "emotionChips": ["感情ラベル1", "感情ラベル2"],
  "eventChips": ["出来事カテゴリ（例: 職場関係、家族、体調）"],
  "insights": [
    { "title": "インサイトタイトル1", "body": "詳細説明1" },
    { "title": "インサイトタイトル2", "body": "詳細説明2" },
    { "title": "インサイトタイトル3", "body": "詳細説明3" }
  ]
}`,
    messages: [{ role: 'user', content: userContent || '（記録なし）' }],
  });

  // テキストブロックのみ抽出
  const textBlock = message.content.find(b => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') throw new Error('AIから応答テキストがありません');

  // JSONをパース（コードブロックが含まれる場合も対応）
  const raw = textBlock.text.replace(/```json\n?|\n?```/g, '').trim();
  const parsed = JSON.parse(raw) as AIAnalysisResult;
  return parsed;
}

// ── Main Screen ───────────────────────────────────────
export default function AnalyzingScreen() {
  const opacity = useRef(new Animated.Value(0)).current;
  const { emotions, reasons, eventText, thoughtText, desireText, setAIResult, setAnalysisError } =
    useRecordStore();

  useEffect(() => {
    // フェードイン
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // AI 分析を実行
    runAnalysis(emotions, reasons, eventText, thoughtText, desireText)
      .then(result => {
        setAIResult(result);
        router.replace('/record/summary');
      })
      .catch(err => {
        console.error('AI分析エラー:', err);
        setAnalysisError(err instanceof Error ? err.message : String(err));
        // エラーでもサマリー画面へ（フォールバック表示）
        router.replace('/record/summary');
      });
  }, []);

  return (
    <LinearGradient colors={[BG_TOP, BG_BOT]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <Animated.View style={[styles.container, { opacity }]}>
          <WritingIllustration />
          <Text style={styles.title}>今日も自分の気持ちと{'\n'}向き合いましたね！</Text>
          <Text style={styles.subtitle}>
            あなたの記録をもとに、{'\n'}言葉をまとめています。
          </Text>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe:     { flex: 1 },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: TEXT_PRI,
    textAlign: 'center',
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 15,
    color: TEXT_SEC,
    textAlign: 'center',
    lineHeight: 24,
  },
});
