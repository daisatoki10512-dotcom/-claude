import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import Svg, {
  Ellipse, Path, Rect, Circle,
} from 'react-native-svg';

const BG_TOP = '#E5F5EF';
const BG_BOT = '#D8EDE3';
const TEXT_PRI = '#1A1A1A';
const TEXT_SEC = '#6B7280';

// ── Illustration: woman on couch with cat ─────────────
function CouchIllustration() {
  return (
    <Svg width={280} height={200} viewBox="0 0 280 200">
      {/* Sofa base */}
      <Rect x={30} y={130} width={220} height={50} rx={10} fill="none" stroke="#1A1A1A" strokeWidth={2.5} />
      {/* Sofa back */}
      <Rect x={40} y={100} width={200} height={40} rx={8} fill="none" stroke="#1A1A1A" strokeWidth={2.5} />
      {/* Sofa left arm */}
      <Rect x={20} y={105} width={22} height={75} rx={8} fill="none" stroke="#1A1A1A" strokeWidth={2.5} />
      {/* Sofa right arm */}
      <Rect x={238} y={105} width={22} height={75} rx={8} fill="none" stroke="#1A1A1A" strokeWidth={2.5} />
      {/* Sofa legs */}
      <Rect x={45} y={178} width={10} height={18} rx={3} fill="#1A1A1A" />
      <Rect x={225} y={178} width={10} height={18} rx={3} fill="#1A1A1A" />

      {/* Person body (lying, head on right arm) */}
      {/* Torso */}
      <Path
        d="M80 118 Q120 110 175 115 L180 135 Q120 130 75 135 Z"
        fill="#1A1A1A"
      />
      {/* Legs */}
      <Path
        d="M75 125 Q65 128 58 135 Q55 140 60 143 Q70 138 80 135 Z"
        fill="#1A1A1A"
      />
      <Path
        d="M80 130 Q72 133 65 140 Q62 145 67 147 Q76 143 85 138 Z"
        fill="#1A1A1A"
      />
      {/* Right arm holding phone */}
      <Path
        d="M170 112 Q185 95 195 88 Q198 85 200 88 L192 108 Q182 112 172 118 Z"
        fill="#1A1A1A"
      />
      {/* Phone */}
      <Rect x={195} y={72} width={22} height={32} rx={4} fill="none" stroke="#1A1A1A" strokeWidth={2.5} />
      <Circle cx={206} cy={88} r={7} fill="none" stroke="#1A1A1A" strokeWidth={1.5} />
      <Path d="M202 88 L204 90 L210 84" stroke="#1A1A1A" strokeWidth={1.5} fill="none" strokeLinecap="round" />
      {/* Head */}
      <Circle cx={230} cy={108} r={16} fill="#1A1A1A" />
      {/* Hair bun */}
      <Circle cx={230} cy={90} r={7} fill="#1A1A1A" />
      <Path d="M223 95 Q230 89 237 95" fill="#1A1A1A" />

      {/* Cat (left side on sofa) */}
      <Ellipse cx={68} cy={122} rx={18} ry={12} fill="#1A1A1A" />
      {/* Cat head */}
      <Circle cx={56} cy={112} r={10} fill="#1A1A1A" />
      {/* Cat ears */}
      <Path d="M50 104 L46 96 L56 102 Z" fill="#1A1A1A" />
      <Path d="M62 104 L66 96 L56 102 Z" fill="#1A1A1A" />
      {/* Cat tail */}
      <Path
        d="M84 120 Q95 115 100 122 Q95 128 88 125"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth={3}
        strokeLinecap="round"
      />

      {/* Coffee cup */}
      <Path d="M228 170 L220 196 L240 196 L232 170 Z" fill="none" stroke="#1A1A1A" strokeWidth={2} />
      <Path d="M232 178 Q240 178 240 185 Q240 192 232 192" fill="none" stroke="#1A1A1A" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// ── Main Screen ───────────────────────────────────────
export default function CompleteScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // After 2.5s, fade out then go home
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        router.dismissAll();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <CouchIllustration />
        <Text style={styles.title}>お疲れ様でした！</Text>
        <Text style={styles.subtitle}>
          今日を穏やかに過ごすために{'\n'}
          残りの時間はゆっくり過ごしましょうね。
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_TOP,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: TEXT_PRI,
    marginTop: 32,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: TEXT_SEC,
    textAlign: 'center',
    lineHeight: 24,
  },
});
