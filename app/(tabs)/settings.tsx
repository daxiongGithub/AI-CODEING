import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronRight, Tag, Bell, Upload } from 'lucide-react-native';
import {
  BRAND_COLOR,
  INCOME_COLOR,
  PRIMARY_BG_COLOR,
  BLUE_BG_COLOR,
  BLUE_COLOR,
  EMERALD_BG_COLOR,
  TEXT_SECONDARY_COLOR,
} from '@/constants/colors';

interface MenuItem {
  id: string;
  label: string;
  iconBg: string;
  iconColor: string;
  Icon: React.ComponentType<{ size: number; color: string }>;
  onPress: () => void;
}

export default function SettingsScreen() {
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      id: 'categories',
      label: '分类管理',
      iconBg: PRIMARY_BG_COLOR,
      iconColor: BRAND_COLOR,
      Icon: Tag,
      onPress: () => router.push('/categories'),
    },
    {
      id: 'reminder',
      label: '提醒设置',
      iconBg: BLUE_BG_COLOR,
      iconColor: BLUE_COLOR,
      Icon: Bell,
      onPress: () => {},
    },
    {
      id: 'export',
      label: '导出数据',
      iconBg: EMERALD_BG_COLOR,
      iconColor: INCOME_COLOR,
      Icon: Upload,
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-zinc-50" edges={['top', 'bottom']}>
      {/* 标题栏 */}
      <View
        className="items-center justify-center border-b border-zinc-200 bg-white"
        style={{ height: 56 }}
      >
        <Text className="text-[22px] font-bold text-zinc-900">设置</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 16 }}
      >
        {/* 菜单列表卡片 */}
        <View className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          {menuItems.map((item, idx) => (
            <View key={item.id}>
              {idx > 0 && <View className="mx-4 h-px bg-zinc-100" />}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={item.onPress}
                className="flex-row items-center justify-between px-4"
                style={{ height: 56 }}
              >
                {/* 左侧 */}
                <View className="flex-row items-center gap-3">
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      backgroundColor: item.iconBg,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <item.Icon size={18} color={item.iconColor} />
                  </View>
                  <Text className="text-[15px] text-zinc-900">{item.label}</Text>
                </View>
                {/* 右侧 */}
                <ChevronRight size={18} color={TEXT_SECONDARY_COLOR} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* 版本信息 */}
        <View className="items-center px-8 py-8">
          <Text className="text-[13px] font-semibold text-zinc-400">口袋账本 PocketBook</Text>
          <Text className="mt-1 text-[11px] text-zinc-300">v0.1.0 · 本地隐私优先</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
