import { Tabs } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TEAL = '#2AA090';
const INACTIVE = '#9CA3AF';
const BG = '#FFFFFF';

type TabIconProps = {
  name: React.ComponentProps<typeof Ionicons>['name'];
  focused: boolean;
  label: string;
};

function TabIcon({ name, focused, label }: TabIconProps) {
  return (
    <View style={styles.tabItem}>
      <View style={styles.iconFrame}>
        <Ionicons
          name={name}
          size={24}
          color={focused ? TEAL : INACTIVE}
        />
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
            <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} label="ホーム" />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'bulb' : 'bulb-outline'} focused={focused} label="気づき" />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'bookmark' : 'bookmark-outline'} focused={focused} label="ブックマーク" />
          ),
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'document-text' : 'document-text-outline'} focused={focused} label="記録" />
          ),
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} label="マイページ" />
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
    alignItems: 'flex-start',
    gap: 8,
    width: 48,
    height: 48,
  },
  iconFrame: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 12,
  },
});
