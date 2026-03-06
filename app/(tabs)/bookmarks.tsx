import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import FaceIcon, { FaceType } from '../../components/ui/FaceIcon';
import { useCompletedRecordsStore, CompletedRecord } from '../../store/completedRecordsStore';
import { BookmarkIcon, TagIcon } from '../../components/ui/AppIcons';
import SearchFilterModal, { FilterState, applyFilter } from '../../components/ui/SearchFilterModal';

const BG = '#E5F5EF';
const CARD_BG = '#FFFFFF';
const TEXT_PRIMARY = '#1A1A1A';
const TEXT_SECONDARY = '#6B7280';
const TEAL = '#0F766E';
const TAG_BG = '#F3F4F6';
const TAG_TEXT = '#374151';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

const MOOD_FACE_TYPE: Record<CompletedRecord['moodType'], FaceType> = {
  negative: 2,
  neutral:  3,
  positive: 4,
};

function formatDateHeader(date: Date): string {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const w = WEEKDAYS[date.getDay()];
  return `${m}/${d}（${w}）`;
}

function groupByDate(records: CompletedRecord[]) {
  const map = new Map<string, { label: string; records: CompletedRecord[] }>();
  for (const r of records) {
    const key = `${r.date.getFullYear()}-${r.date.getMonth()}-${r.date.getDate()}`;
    if (!map.has(key)) {
      map.set(key, { label: formatDateHeader(r.date), records: [] });
    }
    map.get(key)!.records.push(r);
  }
  return Array.from(map.values());
}

const TABS = ['記録', 'マーカー', '気づき'];

export default function BookmarksScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterState | null>(null);
  const { records, toggleBookmark } = useCompletedRecordsStore();

  const bookmarked = records.filter((r) => r.bookmarked);
  const filtered = activeFilter ? applyFilter(bookmarked, activeFilter) : bookmarked;
  const grouped = groupByDate(filtered);

  return (
    <SafeAreaView style={styles.safeArea}>
      <SearchFilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        records={bookmarked}
        onApply={(f) => setActiveFilter(f)}
      />

      {/* 上部固定: ヘッダー + タブ */}
      <View style={styles.stickyHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.searchBtn} activeOpacity={0.7} onPress={() => setFilterVisible(true)}>
            <Ionicons name="search" size={22} color={activeFilter ? TEAL : TEXT_PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ブックマーク</Text>
          <View style={styles.headerRight} />
        </View>

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
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {grouped.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="bookmark-outline" size={48} color="#C0C8D0" />
            <Text style={styles.emptyText}>ブックマークはありません</Text>
            <Text style={styles.emptySubText}>記録のブックマークアイコンをタップして{'\n'}保存しましょう</Text>
          </View>
        ) : (
          grouped.map((group) => (
            <View key={group.label}>
              <Text style={styles.dateHeader}>{group.label}</Text>
              {group.records.map((record) => {
                const faceType = MOOD_FACE_TYPE[record.moodType];
                const bodyText = record.detail[0] ?? '';
                const categoryChips = [...record.emotionChips, ...record.eventChips];

                return (
                  <View key={record.id} style={styles.entryCard}>
                    {/* ヘッダー行: 顔アイコン + AIサマリータイトル + ブックマーク */}
                    <View style={styles.entryHeader}>
                      <FaceIcon type={faceType} active size={48} />
                      <Text style={styles.entryTitle} numberOfLines={2}>
                        {record.summaryTitle}
                      </Text>
                      <TouchableOpacity
                        hitSlop={12}
                        onPress={() => toggleBookmark(record.id)}
                      >
                        <BookmarkIcon size={22} color={TEAL} />
                      </TouchableOpacity>
                    </View>

                    {/* 本文: AIの振り返り文（3行まで） */}
                    {!!bodyText && (
                      <Text style={styles.entryDescription} numberOfLines={3}>
                        {bodyText}
                      </Text>
                    )}

                    {/* カテゴリ: 感情 + 出来事カテゴリ */}
                    {categoryChips.length > 0 && (
                      <View style={styles.tagsRow}>
                        {categoryChips.map((chip) => (
                          <View key={chip} style={styles.tag}>
                            <Text style={styles.tagText}>{chip}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* タグ */}
                    {record.tags.length > 0 && (
                      <View style={styles.markersRow}>
                        {record.tags.map((tag) => (
                          <View key={tag} style={styles.markerItem}>
                            <TagIcon size={11} color={TEAL} />
                            <Text style={styles.markerText}>{tag}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          ))
        )}
        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchBtn: { width: 36 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: TEXT_PRIMARY },
  headerRight: { width: 36 },

  tabContainer: { paddingHorizontal: 20, paddingBottom: 16 },
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
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
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
  scrollContent: { paddingHorizontal: 20, paddingTop: 106 },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_SECONDARY,
  },
  emptySubText: {
    fontSize: 13,
    color: '#B0B8C0',
    textAlign: 'center',
  },

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
