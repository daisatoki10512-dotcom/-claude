import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

const BG = '#E5F5EF';
const CARD_BG = '#FFFFFF';
const TEXT_PRIMARY = '#1A1A1A';
const TEXT_SECONDARY = '#6B7280';
const TEAL = '#0F766E';
const TAG_BG = '#F3F4F6';
const TAG_TEXT = '#374151';

type MoodCircleProps = {
  gradientColors: [string, string];
  emoji: string;
};

function MoodCircle({ gradientColors, emoji }: MoodCircleProps) {
  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.moodCircle}
      start={{ x: 0.3, y: 0 }}
      end={{ x: 0.7, y: 1 }}
    >
      <Text style={styles.moodEmoji}>{emoji}</Text>
    </LinearGradient>
  );
}

const recordsData = [
  {
    date: '11/9（土）',
    entries: [
      {
        id: 1,
        mood: { emoji: '😔', colors: ['#7EB8F0', '#4A90D9'] as [string, string] },
        bookmarked: false,
        title: '相談したいのに、予定を合わせてもらえなかった',
        description:
          '上司の方に相談を申し込んだのに、なかなか時間が決まらないと「嫌われているのかな」と不安になってしまいますよね。勇気を出したの...',
        aiCount: 1,
        tags: ['不安', 'がっかり', '後悔', '職場関係'],
        markers: ['理不尽', '佐藤先輩'],
      },
    ],
  },
  {
    date: '11/8（金）',
    entries: [
      {
        id: 2,
        mood: { emoji: '😐', colors: ['#5DD8C0', '#1BAE94'] as [string, string] },
        bookmarked: false,
        title: '職場での頼まれごとに戸惑いを覚えた',
        description:
          '相手の意図が読み取れず、戸惑いが残ったようですね。本当はもっと明確な役割や期待を知りたかったから、不安が膨らんだのだと思いま...',
        aiCount: 0,
        tags: ['不満', '職場関係'],
        markers: ['理不尽', '佐藤先輩'],
      },
    ],
  },
];

const TABS = ['リスト', 'カレンダー'];

export default function RecordsScreen() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.searchBtn} activeOpacity={0.7}>
          <Ionicons name="search" size={22} color={TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>記録</Text>
        <View style={styles.headerRight} />
      </View>

      {/* タブ切り替え */}
      <View style={styles.tabContainer}>
        <View style={styles.tabBar}>
          {TABS.map((tab, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.tabItem, activeTab === i && styles.tabItemActive]}
              onPress={() => setActiveTab(i)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {recordsData.map((group) => (
          <View key={group.date}>
            <Text style={styles.dateHeader}>{group.date}</Text>
            {group.entries.map((entry) => (
              <TouchableOpacity
                key={entry.id}
                style={styles.entryCard}
                activeOpacity={0.9}
              >
                {/* ヘッダー行 */}
                <View style={styles.entryHeader}>
                  <MoodCircle
                    gradientColors={entry.mood.colors}
                    emoji={entry.mood.emoji}
                  />
                  <Text style={styles.entryTitle} numberOfLines={2}>
                    {entry.title}
                  </Text>
                  <Ionicons
                    name={entry.bookmarked ? 'bookmark' : 'bookmark-outline'}
                    size={22}
                    color={entry.bookmarked ? TEAL : '#C0C8D0'}
                  />
                </View>

                {/* 本文 */}
                <Text style={styles.entryDescription} numberOfLines={3}>
                  {entry.description}
                </Text>

                {/* AI返信数 */}
                {entry.aiCount > 0 && (
                  <View style={styles.aiCountBadge}>
                    <View style={styles.aiCountIcon}>
                      <Ionicons name="person" size={12} color={TEAL} />
                    </View>
                    <Text style={styles.aiCountText}>{entry.aiCount}</Text>
                  </View>
                )}

                {/* 感情タグ */}
                <View style={styles.tagsRow}>
                  {entry.tags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                {/* マーカー */}
                {entry.markers.length > 0 && (
                  <View style={styles.markersRow}>
                    {entry.markers.map((marker) => (
                      <View key={marker} style={styles.markerItem}>
                        <Ionicons name="pricetag" size={11} color={TEAL} />
                        <Text style={styles.markerText}>{marker}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
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
  searchBtn: { width: 36 },
  headerTitle: { fontSize: 17, fontWeight: '600', color: TEXT_PRIMARY },
  headerRight: { width: 36 },

  tabContainer: { paddingHorizontal: 20, marginBottom: 16 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 50,
    padding: 4,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 46,
    alignItems: 'center',
  },
  tabItemActive: {
    backgroundColor: CARD_BG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: { fontSize: 13, fontWeight: '500', color: TEXT_SECONDARY },
  tabTextActive: { color: TEXT_PRIMARY, fontWeight: '600' },

  scrollView: { flex: 1, backgroundColor: BG },
  scrollContent: { paddingHorizontal: 20 },
  dateHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 10,
    marginTop: 4,
  },
  entryCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 16,
    gap: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  moodCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  moodEmoji: { fontSize: 26 },
  entryTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    lineHeight: 22,
  },
  entryDescription: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    lineHeight: 20,
  },
  aiCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E0F5F0',
    alignSelf: 'flex-start',
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  aiCountIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiCountText: { fontSize: 13, fontWeight: '600', color: TEAL },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    backgroundColor: TAG_BG,
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagText: { fontSize: 12, color: TAG_TEXT, fontWeight: '500' },
  markersRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  markerItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  markerText: { fontSize: 12, color: TEAL, fontWeight: '500' },
});
