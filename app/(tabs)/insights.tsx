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

const { width } = Dimensions.get('window');
const BG = '#E5F5EF';
const CARD_BG = '#FFFFFF';
const TEXT_PRIMARY = '#1A1A1A';
const TEXT_SECONDARY = '#6B7280';
const TEAL = '#0F766E';

const newInsights = [
  {
    id: 1,
    bg: '#D4897A',        // ピンク/サーモン（画像から）
    emoji: '⚠️',
    illustrationText: '⚠️',
    title: '他人と比較するのは禁物',
    description: '他人と比較していると気分が落ち込んでいます。',
  },
  {
    id: 2,
    bg: '#7DB89A',        // グリーン（画像から）
    emoji: '🌿',
    illustrationText: '★',
    title: '小さな一歩を大切に',
    description: '毎日の積み重ねが大きな変化につながります。',
  },
];

const pastInsights = [
  {
    id: 1,
    icon: '✨',
    iconBg: '#B2E8E0',
    title: '事前準備は心の余裕に',
    description: '予定を見通せると、不安が和らぐ傾向があります。',
    date: '2025/9/21',
  },
  {
    id: 2,
    icon: '💡',
    iconBg: '#FDE8C0',
    title: '感情を言語化する力',
    description: '気持ちを言葉にすることで、心が軽くなります。',
    date: '2025/9/15',
  },
];

const CARD_WIDTH = width * 0.72;

export default function InsightsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ページタイトル */}
        <Text style={styles.pageTitle}>気づき</Text>

        {/* 新しい気づき（横スクロール） */}
        <Text style={styles.sectionTitle}>新しい気づき</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
          style={styles.horizontalScrollView}
        >
          {newInsights.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.insightCard, { width: CARD_WIDTH }]}
              activeOpacity={0.9}
            >
              {/* イラスト背景 */}
              <View style={[styles.insightIllustration, { backgroundColor: item.bg }]}>
                <Text style={styles.insightIllustrationText}>{item.illustrationText}</Text>
              </View>
              {/* テキスト部分 */}
              <View style={[styles.insightCardBody, { backgroundColor: item.bg + '22' }]}>
                <Text style={styles.insightCardTitle}>{item.title}</Text>
                <Text style={styles.insightCardDesc}>{item.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 今までの気づき */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>今までの気づき</Text>
          <TouchableOpacity style={styles.seeMoreBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-forward" size={18} color={TEXT_PRIMARY} />
          </TouchableOpacity>
        </View>

        {pastInsights.map((item) => (
          <TouchableOpacity key={item.id} style={styles.pastInsightCard} activeOpacity={0.8}>
            <View style={[styles.pastInsightIcon, { backgroundColor: item.iconBg }]}>
              <Text style={styles.pastInsightIconText}>{item.icon}</Text>
            </View>
            <View style={styles.pastInsightBody}>
              <Text style={styles.pastInsightTitle}>{item.title}</Text>
              <Text style={styles.pastInsightDesc}>{item.description}</Text>
              <Text style={styles.pastInsightDate}>{item.date}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#C0C8D0" />
          </TouchableOpacity>
        ))}

        {/* みんなはどうしてる？ */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>みんなはどうしてる？</Text>
          <TouchableOpacity style={styles.seeMoreBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-forward" size={18} color={TEXT_PRIMARY} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG },
  scrollView: { flex: 1, backgroundColor: BG },
  scrollContent: { paddingTop: 16, paddingHorizontal: 20 },

  pageTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 24,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 12,
    marginTop: 4,
  },
  seeMoreBtn: {
    marginLeft: 4,
    marginBottom: 12,
    marginTop: 4,
  },

  // 横スクロール気づきカード
  horizontalScrollView: {
    marginHorizontal: -20,
    marginBottom: 24,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  insightCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  insightIllustration: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightIllustrationText: {
    fontSize: 80,
  },
  insightCardBody: {
    backgroundColor: CARD_BG,
    padding: 16,
  },
  insightCardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 6,
  },
  insightCardDesc: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    lineHeight: 19,
  },

  // 過去の気づきカード
  pastInsightCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  pastInsightIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pastInsightIconText: { fontSize: 20 },
  pastInsightBody: { flex: 1 },
  pastInsightTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  pastInsightDesc: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    lineHeight: 18,
    marginBottom: 4,
  },
  pastInsightDate: { fontSize: 11, color: '#B0B8C0' },
});
