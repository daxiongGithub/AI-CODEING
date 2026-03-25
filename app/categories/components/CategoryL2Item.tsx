import { View, Text } from "react-native";
import { CategoryIcon } from "@/components/CategoryIcon";
import type { SubCategory } from "@/types";

/** 二级分类列表项，已停用时显示角标 */
interface CategoryL2ItemProps {
  sub: SubCategory;
}

export function CategoryL2Item(props: CategoryL2ItemProps) {
  const { sub } = props;
  return (
    <View className="h-[44px] flex-row items-center px-3">
      <CategoryIcon
        iconName={sub.icon}
        bgToken="gray-100"
        textToken="text-gray-500"
        size={14}
        circleSize={28}
      />
      <Text className="ml-2 flex-1 text-[13px] text-text-main" numberOfLines={1}>
        {sub.name}
      </Text>
      
      {!sub.enabled && (
        <View className="rounded-sm bg-zinc-100 px-1 py-[1px]">
          <Text className="text-[10px] text-zinc-400">已停用</Text>
        </View>
      )}
    </View>
  );
}
