import { Tabs } from "expo-router";
import { Home, PieChart, Settings } from "lucide-react-native";
import {
  BRAND_COLOR,
  SURFACE_COLOR,
  TEXT_DISABLED_COLOR,
  BORDER_COLOR,
} from "@/constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: BRAND_COLOR,
        tabBarInactiveTintColor: TEXT_DISABLED_COLOR,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: SURFACE_COLOR },
        tabBarStyle: {
          borderTopColor: BORDER_COLOR,
          backgroundColor: SURFACE_COLOR,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "首页",
          headerTitle: "口袋账本",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "统计",
          tabBarIcon: ({ color, size }) => (
            <PieChart color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "设置",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
