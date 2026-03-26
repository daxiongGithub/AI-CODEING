import { View, Text } from "react-native";
import { ChevronRight, Folder } from "lucide-react-native";
import { ICON_MAP } from "@/constants/icons";
import { BRAND_COLOR, TEXT_SECONDARY_COLOR } from "@/constants/theme";
import { CategoryChip } from "./CategoryChip";
import type { CategoryWithSubs } from "@/types";

export interface SubCategoryPanelProps {
  parentCategory: CategoryWithSubs;
  selectedSubCategoryId: string | null;
  onSelectSubCategory: (id: string) => void;
}

/**
 * SubCategoryPanel — 二级分类选择面板
 * 显示一级分类面包屑（图标 → 名称 → 箭头 → "选择子分类"）+ 横向子分类列表。
 * 若当前一级分类无子分类，不渲染。
 */
export function SubCategoryPanel(props: SubCategoryPanelProps) {
  const { parentCategory, selectedSubCategoryId, onSelectSubCategory } = props;
  const { subCategories } = parentCategory;

  if (!subCategories || subCategories.length === 0) return null;

  const ParentIcon = ICON_MAP[parentCategory.icon] ?? Folder;
  const selectedSub = subCategories.find((s) => s.id === selectedSubCategoryId);

  return (
    <View className="rounded-xl bg-zinc-50 border border-zinc-50 py-[10px] px-3 gap-2">
      {/* 面包屑 Header */}
      <View className="flex-row items-center gap-1">
        <ParentIcon size={14} color={BRAND_COLOR} />
        <Text className="text-[12px] font-semibold" style={{ color: BRAND_COLOR }}>
          {parentCategory.name}
        </Text>
        <ChevronRight size={12} color={TEXT_SECONDARY_COLOR} />
        <Text className="text-[12px] text-zinc-500 flex-1" numberOfLines={1}>
          {selectedSub ? selectedSub.name : "选择子分类"}
        </Text>
      </View>

      {/* 子分类网格（一行 5 个） */}
      <View className="flex-row flex-wrap pt-3">
        {subCategories.map((sub) => (
          <View key={sub.id} className="w-1/5 mb-3 items-center">
            <CategoryChip
              icon={sub.icon}
              name={sub.name}
              colorTokenBg={parentCategory.colorTokenBg}
              colorTokenText={parentCategory.colorTokenText}
              isSelected={selectedSubCategoryId === sub.id}
              onPress={() => onSelectSubCategory(sub.id)}
              size="sm"
            />
          </View>
        ))}
      </View>
    </View>
  );
}
