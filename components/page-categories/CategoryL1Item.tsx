import { TouchableOpacity, View, Text } from "react-native";
import clsx from "clsx";
import { CategoryIcon } from "@/components/page-categories/CategoryIcon";
import type { CategoryWithSubs } from "@/types";

/** 一级分类列表项，选中时高亮左侧边框与背景 */
interface CategoryL1ItemProps {
  category: CategoryWithSubs;
  selected: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

export function CategoryL1Item(props: CategoryL1ItemProps) {
  const { category, selected, onPress, onLongPress } = props;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      onLongPress={onLongPress}
      className="h-[44px]"
    >
      <View
        className={clsx(
          "flex-1 flex-row items-center px-3",
          selected ? "border-l-2 border-l-brand bg-bg-primary" : "border-l-0",
        )}
      >
        <CategoryIcon
          iconName={category.icon}
          bgToken={category.colorTokenBg}
          textToken={category.colorTokenText}
          size={14}
          circleSize={28}
        />
        <Text
          className="ml-2 flex-1 text-[13px] font-medium text-text-main"
          numberOfLines={1}
        >
          {category.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
