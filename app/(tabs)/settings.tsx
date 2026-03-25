import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronRight, Tag, Bell, Upload } from "lucide-react-native";
import { Navbar } from "@/components/Navbar";
import {
  BG_TOKEN_MAP,
  BRAND_COLOR,
  SUCCESS_COLOR,
  ACCENT_COLOR,
  PRIMARY_BG_COLOR,
  TEXT_SECONDARY_COLOR,
} from "@/constants/theme";

import type { LucideIcon } from "lucide-react-native";

interface MenuItem {
  id: string;
  label: string;
  iconBg: string;
  iconColor: string;
  Icon: React.ComponentType<{ size: number; color: string }> | LucideIcon;
  onPress: () => void;
}

export default function SettingsScreen() {
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      id: "categories",
      label: "分类管理",
      iconBg: PRIMARY_BG_COLOR,
      iconColor: BRAND_COLOR,
      Icon: Tag,
      onPress: () => router.push("/categories"),
    },
    {
      id: "reminder",
      label: "提醒设置",
      iconBg: BG_TOKEN_MAP["blue-100"]!,
      iconColor: ACCENT_COLOR,
      Icon: Bell,
      onPress: () => {},
    },
    {
      id: "export",
      label: "导出数据",
      iconBg: BG_TOKEN_MAP["emerald-100"]!,
      iconColor: SUCCESS_COLOR,
      Icon: Upload,
      onPress: () => {},
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <Navbar title="设置" />
      <ScrollView
        className="flex-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="p-4 gap-4"
      >
        {/* 菜单列表卡片 */}
        <View className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          {menuItems.map((item, idx) => (
            <View key={item.id}>
              {idx > 0 && <View className="mx-4 h-px bg-zinc-100" />}
              <TouchableOpacity
                className="h-14 flex-row items-center justify-between px-4"
                activeOpacity={0.7}
                onPress={item.onPress}
              >
                {/* 左侧 */}
                <View className="flex-row items-center gap-3">
                  <View
                    className="h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundColor: item.iconBg }}
                  >
                    <item.Icon size={18} color={item.iconColor} />
                  </View>
                  <Text className="text-[15px] text-zinc-900">
                    {item.label}
                  </Text>
                </View>
                {/* 右侧 */}
                <ChevronRight size={18} color={TEXT_SECONDARY_COLOR} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* 版本信息 */}
        <View className="items-center px-8 py-8">
          <Text className="text-[13px] font-semibold text-zinc-400">
            口袋账本 PocketBook
          </Text>
          <Text className="mt-1 text-[11px] text-zinc-300">
            v0.1.0 · 本地隐私优先
          </Text>
        </View>
        <SafeAreaView edges={["bottom"]} />
      </ScrollView>
    </View>
  );
}
