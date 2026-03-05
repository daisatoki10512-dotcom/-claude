import { Tabs } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  Platform,
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
      <Ionicons
        name={name}
        size={24}
        color={focused ? TEAL : INACTIVE}
      />
      <Text style={[styles.tabLabel, { color: focused ? TEAL : INACTIVE }]}>
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
    height: Platform.OS === 'ios' ? 83 : 60,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    paddingTop: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
});
