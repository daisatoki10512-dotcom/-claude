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
import { useState } from 'react';

const { width } = Dimensions.get('window');

// デザイン画像から抽出した色
const BG = '#E5F5EF';
const CARD_BG = '#FFFFFF';
const TEXT_PRIMARY = '#1A1A1A';
const TEXT_SECONDARY = '#6B7280';
const TEAL = '#2AA090';
const BTN_DISABLED_BG = '#E5E7EB';
const BTN_DISABLED_TEXT = '#9CA3AF';

// 感情スタンプ - 画像の5段階
const MOODS = [
  {
    emoji: '😢',
    label: 'とても辛い',
    gradientColors: ['#9B7FE8', '#7C3AED'] as [string, string],
  },
  {
    emoji: '😔',
    label: '辛い',
    gradientColors: ['#7EB8F0', '#4A90D9'] as [string, string],
  },
  {
    emoji: '😐',
    label: 'ふつう',
    gradientColors: ['#5DD8C0', '#1BAE94'] as [string, string],
  },
  {
    emoji: '🙂',
    label: 'よい',
    gradientColors: ['#8DE08A', '#3FB83C'] as [string, string],
  },
  {
    emoji: '😄',
    label: 'とても良い',
    gradientColors: ['#F5D04A', '#F0A020'] as [string, string],
  },
];

const MOOD_CIRCLE_SIZE = (width - 48 - 48) / 5; // 全幅 - 左右padding - 間隔

export default function HomeScreen() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 挨拶 */}
        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>こんにちは、 だいさん</Text>
          <Text style={styles.greetingSubtitle}>
            今日を穏やかに過ごすために{'\n'}残りの時間はゆっくり過ごしましょうね。
          </Text>
        </View>

        {/* 今どんな気持ちですか？ */}
        <Text style={styles.sectionTitle}>今どんな気持ちですか？</Text>

        <View style={styles.moodCard}>
          {/* スタンプ行 */}
          <View style={styles.moodRow}>
            {MOODS.map((mood, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setSelectedMood(i)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={mood.gradientColors}
                  style={[
                    styles.moodCircle,
                    selectedMood === i && styles.moodCircleSelected,
                  ]}
                  start={{ x: 0.3, y: 0 }}
                  end={{ x: 0.7, y: 1 }}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* 記録するボタン */}
          <TouchableOpacity
            style={[
              styles.recordButton,
              selectedMood !== null && styles.recordButtonActive,
            ]}
            disabled={selectedMood === null}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.recordButtonText,
                selectedMood !== null && styles.recordButtonTextActive,
              ]}
            >
              記録する
            </Text>
          </TouchableOpacity>
        </View>

        {/* ふりかえり */}
        <Text style={styles.sectionTitle}>ふりかえり</Text>

        <View style={styles.reviewCard}>
          {/* イラスト部分（花に水やりのシルエット） */}
          <View style={styles.illustrationArea}>
            <Text style={styles.illustrationEmoji}>🌱</Text>
            <Text style={styles.illustrationEmoji2}>💧</Text>
          </View>

          <View style={styles.reviewCardContent}>
            <Text style={styles.reviewTitle}>自己理解を深めましょう！</Text>
            <Text style={styles.reviewDescription}>
              記録を続けていくと同時に、あなたの自己理解につながるコンテンツ...
            </Text>
          </View>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollView: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  // 挨拶
  greeting: {
    marginTop: 16,
    marginBottom: 28,
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 21,
    fontWeight: '400',
  },

  // セクションタイトル
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 12,
  },

  // 気持ちカード
  moodCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  moodCircle: {
    width: MOOD_CIRCLE_SIZE,
    height: MOOD_CIRCLE_SIZE,
    borderRadius: MOOD_CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodCircleSelected: {
    transform: [{ scale: 1.1 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  moodEmoji: {
    fontSize: MOOD_CIRCLE_SIZE * 0.5,
  },

  // 記録するボタン
  recordButton: {
    backgroundColor: BTN_DISABLED_BG,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
  },
  recordButtonActive: {
    backgroundColor: TEAL,
  },
  recordButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: BTN_DISABLED_TEXT,
  },
  recordButtonTextActive: {
    color: '#FFFFFF',
  },

  // ふりかえりカード
  reviewCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  illustrationArea: {
    height: 200,
    backgroundColor: '#F8FAF9',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  illustrationEmoji: {
    fontSize: 80,
  },
  illustrationEmoji2: {
    fontSize: 40,
    marginBottom: 30,
  },
  reviewCardContent: {
    padding: 20,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  reviewDescription: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 21,
  },
});
