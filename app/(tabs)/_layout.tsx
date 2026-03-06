import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import {
  HomeIcon,
  InsightsIcon,
  BookmarkTabIcon,
  RecordsIcon,
  MyPageIcon,
} from '../../components/ui/AppIcons';

const TEAL    = '#0F766E';
const INACTIVE = '#9CA3AF';
const BG      = '#FFFFFF';

type TabIconProps = {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  focused: boolean;
  label: string;
};

function TabIcon({ Icon, focused, label }: TabIconProps) {
  return (
    <View style={styles.tabItem}>
      <View style={styles.iconFrame}>
        <Icon size={28} color={focused ? TEAL : INACTIVE} />
      </View>
      <Text
        style={[styles.tabLabel, { color: focused ? TEAL : INACTIVE }]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={HomeIcon} focused={focused} label="ホーム" />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={InsightsIcon} focused={focused} label="気づき" />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={BookmarkTabIcon} focused={focused} label="ブックマーク" />
          ),
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={RecordsIcon} focused={focused} label="記録" />
          ),
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={MyPageIcon} focused={focused} label="マイページ" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: BG,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    height: 82,
    paddingTop: 6,
    paddingBottom: 6,
    paddingHorizontal: 24,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: 48,
    height: 48,
  },
  iconFrame: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 12,
  },
});
