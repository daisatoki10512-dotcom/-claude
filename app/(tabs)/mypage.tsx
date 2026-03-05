import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const BG = '#E5F5EF';
const CARD_BG = '#FFFFFF';
const TEXT_PRIMARY = '#1A1A1A';
const TEXT_SECONDARY = '#6B7280';

// マイページ4グリッドカード（画像から配色を抽出）
const profileCards = [
  {
    id: 1,
    label: '強み',
    emoji: '🏋️',
    colors: ['#C27030', '#A05020'] as [string, string],
  },
  {
    id: 2,
    label: '価値観',
    emoji: '🔺',
    colors: ['#3A7EC2', '#2060A0'] as [string, string],
  },
  {
    id: 3,
    label: 'ストレス要因',
    emoji: '🤹',
    colors: ['#D42878', '#B01060'] as [string, string],
  },
  {
    id: 4,
    label: '思考',
    emoji: '🧘',
    colors: ['#7040C0', '#5020A0'] as [string, string],
  },
];

// 今週の気持ちデータ（画像から）
const moodChart = [
  { emoji: '😄', colors: ['#F5D04A', '#F0A020'] as [string, string], dotDay: 0, dotPos: 0.15 },
  { emoji: '🙂', colors: ['#8DE08A', '#3FB83C'] as [string, string], dotDay: -1, dotPos: -1 },
  { emoji: '😐', colors: ['#5DD8C0', '#1BAE94'] as [string, string], dotDay: 4, dotPos: 0.6 },
  { emoji: '😔', colors: ['#7EB8F0', '#4A90D9'] as [string, string], dotDay: 5, dotPos: 0.8 },
  { emoji: '😢', colors: ['#9B7FE8', '#7C3AED'] as [string, string], dotDay: 4, dotPos: 0.57 },
];

const DAYS = ['日', '月', '火', '水', '木', '金', '土'];
const CARD_WIDTH = (width - 40 - 10) / 2;
const CHART_WIDTH = width - 40 - 32 - 40; // カード内幅 - 絵文字列幅

export default function MyPageScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>マイページ</Text>
        <TouchableOpacity style={styles.settingsBtn} activeOpacity={0.7}>
          <Ionicons name="settings-outline" size={22} color={TEXT_PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* だいさんについて */}
        <Text style={styles.sectionTitle}>だいさんについて</Text>

        <View style={styles.profileGrid}>
          {profileCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={{ width: CARD_WIDTH }}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={card.colors}
                style={styles.profileCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.profileCardEmoji}>{card.emoji}</Text>
                <Text style={styles.profileCardLabel}>{card.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* 今週の気持ち */}
        <Text style={[styles.sectionTitle, { marginTop: 8 }]}>今週の気持ち</Text>

        <View style={styles.chartCard}>
          {/* 各感情の行 */}
          {moodChart.map((mood, rowIndex) => (
            <View key={rowIndex} style={styles.chartRow}>
              {/* 絵文字サークル */}
              <LinearGradient
                colors={mood.colors}
                style={styles.chartMoodCircle}
                start={{ x: 0.3, y: 0 }}
                end={{ x: 0.7, y: 1 }}
              >
                <Text style={styles.chartMoodEmoji}>{mood.emoji}</Text>
              </LinearGradient>

              {/* ライン */}
              <View style={styles.chartLine}>
                <View style={styles.chartLineBar} />
                {/* ドット */}
                {mood.dotDay >= 0 && (
                  <View
                    style={[
                      styles.chartDot,
                      {
                        left: `${mood.dotPos * 100}%` as any,
                        backgroundColor: mood.colors[1],
                      },
                    ]}
                  />
                )}
              </View>
            </View>
          ))}

          {/* X軸ラベル */}
          <View style={styles.chartXAxis}>
            <View style={{ width: 32 }} />
            <View style={styles.chartDaysRow}>
              {DAYS.map((day) => (
                <Text key={day} style={styles.chartDayLabel}>{day}</Text>
              ))}
            </View>
          </View>
          <Text style={styles.chartDateRange}>11/3 〜 11/9</Text>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: BG,
  },
  headerLeft: { width: 36 },
  headerTitle: { fontSize: 17, fontWeight: '600', color: TEXT_PRIMARY },
  settingsBtn: { width: 36, alignItems: 'flex-end' },

  scrollView: { flex: 1, backgroundColor: BG },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 12,
  },

  // プロフィールグリッド
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  profileCard: {
    width: '100%',
    aspectRatio: 1.4,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'flex-end',
  },
  profileCardEmoji: {
    fontSize: 42,
    marginBottom: 8,
  },
  profileCardLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // 気持ちチャート
  chartCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  chartMoodCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartMoodEmoji: { fontSize: 18 },
  chartLine: {
    flex: 1,
    height: 2,
    position: 'relative',
    justifyContent: 'center',
  },
  chartLineBar: {
    height: 1.5,
    backgroundColor: '#E5E7EB',
    width: '100%',
  },
  chartDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: -5,
    top: 0,
  },
  chartXAxis: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -8,
  },
  chartDaysRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 8,
  },
  chartDayLabel: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    textAlign: 'center',
  },
  chartDateRange: {
    fontSize: 11,
    color: '#B0B8C0',
    textAlign: 'center',
    marginTop: 8,
  },
});
