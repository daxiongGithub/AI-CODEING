import { View, Text, TouchableOpacity } from "react-native";
import type { CategoryWithSubs } from "@/types";
import { CategoryIcon } from "./CategoryIcon";

interface CategoryCardProps {
  category: CategoryWithSubs;
  /** 点击启用/停用 Badge 时触发 */
  onToggleEnabled: (id: string, currentEnabled: boolean) => void;
}

/**
 * CategoryCard — 展示组件
 * 展示一级分类卡片：图标、名称、子分类列表、启用状态 Badge。
 */
export function CategoryCard({ category, onToggleEnabled }: CategoryCardProps) {
  const { enabled, subCategories } = category;

  const subNames =
    subCategories.length > 0 ? subCategories.map((s) => s.name).join(" / ") : "无子分类";

  return (
    <View
      className={`w-full rounded-xl border border-zinc-200 px-[14px] py-[14px] ${
        enabled ? "bg-white" : "bg-zinc-50"
      }`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      {/* 顶行：图标 + 名称/信息 + 状态 */}
      <View className="flex-row items-center justify-between">
        {/* 左侧 */}
        <View className="flex-1 flex-row items-center gap-2">
          <CategoryIcon
            iconName={category.icon}
            bgToken={category.colorTokenBg}
            textToken={category.colorTokenText}
            circleSize={32}
            size={18}
          />
          <View className="flex-1">
            <Text className="text-[14px] font-semibold text-zinc-900" numberOfLines={1}>
              {category.name}
              {category.isPreset ? (
                <Text className="text-[11px] font-normal text-zinc-400">（预设）</Text>
              ) : (
                <Text className="text-[11px] font-normal text-zinc-400">（自定义）</Text>
              )}
            </Text>
            <Text className="mt-0.5 text-[11px] text-zinc-400">
              {subCategories.length} 个子分类
            </Text>
          </View>
        </View>

        {/* 右侧：状态 Badge（可点击切换） */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onToggleEnabled(category.id, enabled)}
          className={`rounded-full px-2.5 py-0.5 ${
            enabled ? "bg-emerald-50" : "bg-red-50"
          }`}
        >
          <Text
            className={`text-[12px] font-semibold ${
              enabled ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {enabled ? "启用" : "已停用"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 子分类列表 */}
      <Text className="mt-2 text-[12px] font-medium text-zinc-400" numberOfLines={2}>
        二级分类：{subNames}
      </Text>
    </View>
  );
}
