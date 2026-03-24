import { Tabs } from 'expo-router';
import { Home, PieChart, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#f97316',
        tabBarInactiveTintColor: '#9ca3af',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#ffffff' },
        tabBarStyle: {
          borderTopColor: '#e5e7eb',
          backgroundColor: '#ffffff',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          headerTitle: '口袋账本',
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: '统计',
          tabBarIcon: ({ color, size }) => (
            <PieChart color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '设置',
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
