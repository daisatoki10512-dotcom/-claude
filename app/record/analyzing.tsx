import {
  View,
  Text,
  StyleSheet,
  Animated,
  SafeAreaView,
} from 'react-native';
import { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Rect, Circle, Line, Polyline } from 'react-native-svg';

const BG_TOP  = '#E5F5EF';
const BG_BOT  = '#D4EDE3';
const TEXT_PRI = '#1A1A1A';
const TEXT_SEC = '#6B7280';

// ── イラスト SVG ─────────────────────────────────────
function WritingIllustration() {
  return (
    <Svg width={240} height={240} viewBox="0 0 240 240" fill="none">
      {/* スマートフォン本体 */}
      <Rect x="110" y="30" width="90" height="150" rx="14" ry="14"
        stroke="#1A1A1A" strokeWidth="3" fill="white" />
      {/* カメラ穴 */}
      <Rect x="143" y="40" width="24" height="8" rx="4"
        stroke="#1A1A1A" strokeWidth="2" fill="none" />
      {/* 画面内テキスト行 */}
      <Path d="M125 70 Q145 67 165 70" stroke="#1A1A1A" strokeWidth="2.5"
        strokeLinecap="round" fill="none" />
      <Path d="M125 82 Q148 79 168 82" stroke="#1A1A1A" strokeWidth="2"
        strokeLinecap="round" fill="none" />
      {/* 箇条書き */}
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
      {/* 頭 */}
      <Circle cx="100" cy="98" r="14" stroke="#1A1A1A" strokeWidth="3" fill="white" />
      {/* お団子ヘア */}
      <Circle cx="110" cy="88" r="8" stroke="#1A1A1A" strokeWidth="2.5" fill="#1A1A1A" />
      {/* 左腕（鉛筆を持つ） */}
      <Path d="M88 115 C75 125 58 140 44 158" stroke="#1A1A1A" strokeWidth="3"
        strokeLinecap="round" fill="none" />
      {/* 右腕（画面に触れる） */}
      <Path d="M106 114 C112 120 116 130 118 140" stroke="#1A1A1A" strokeWidth="3"
        strokeLinecap="round" fill="none" />
      {/* 脚 */}
      <Path d="M68 148 C62 160 58 172 56 185" stroke="#1A1A1A" strokeWidth="3"
        strokeLinecap="round" fill="none" />
      <Path d="M72 150 C74 163 74 175 72 188" stroke="#1A1A1A" strokeWidth="3"
        strokeLinecap="round" fill="none" />
      {/* 靴 */}
      <Path d="M56 185 C50 188 46 190 44 188" stroke="#1A1A1A" strokeWidth="2.5"
        strokeLinecap="round" fill="none" />
      <Path d="M72 188 C68 192 64 193 62 191" stroke="#1A1A1A" strokeWidth="2.5"
        strokeLinecap="round" fill="none" />

      {/* 大きな鉛筆 */}
      {/* 鉛筆軸 */}
      <Path d="M85 138 L44 185" stroke="#1A1A1A" strokeWidth="3"
        strokeLinecap="round" fill="none" />
      <Path d="M78 132 L37 179" stroke="#1A1A1A" strokeWidth="3"
        strokeLinecap="round" fill="none" />
      {/* 鉛筆消しゴム側 */}
      <Path d="M85 138 L78 132 L82 126 L90 132 Z" stroke="#1A1A1A" strokeWidth="2"
        fill="#1A1A1A" />
      {/* 鉛筆先端 */}
      <Path d="M44 185 L37 179 L35 195 Z" stroke="#1A1A1A" strokeWidth="2"
        fill="#1A1A1A" />
      {/* 鉛筆の帯（中央線） */}
      <Path d="M81 135 L40 182" stroke="white" strokeWidth="1.5"
        strokeLinecap="round" />
    </Svg>
  );
}

// ── Main Screen ───────────────────────────────────────
export default function AnalyzingScreen() {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // フェードイン
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // AI分析シミュレーション（3秒後に次の画面へ）
    const timer = setTimeout(() => {
      router.replace('/record/summary');
    }, 3000);

    return () => clearTimeout(timer);
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
