import { TouchableOpacity, View, Text } from "react-native";
import { Folder } from "lucide-react-native";
import clsx from "clsx";
import { ICON_MAP } from "@/constants/icons";
import { BG_TOKEN_MAP, TEXT_TOKEN_MAP, BRAND_COLOR } from "@/constants/theme";

export interface CategoryChipProps {
  icon: string;
  name: string;
  /** BG_TOKEN_MAP 的 key，例如 "orange-100" */
  colorTokenBg: string;
  /** TEXT_TOKEN_MAP 的 key，例如 "text-orange-500" */
  colorTokenText: string;
  isSelected: boolean;
  onPress: () => void;
  /** md=L1（图标 48）, sm=L2（图标 44） */
  size?: "md" | "sm";
}

/**
 * CategoryChip — 分类选择芯片（圆形图标 + 名称）
 * 与 IconCell 不同：颜色由外部显式传入（来自分类数据），不自动分配。
 */
export function CategoryChip(props: CategoryChipProps) {
  const { icon, name, colorTokenBg, colorTokenText, isSelected, onPress, size = "md" } =
    props;

  const IconComponent = ICON_MAP[icon] ?? Folder;
  const bg = BG_TOKEN_MAP[colorTokenBg] ?? "#f1f5f9";
  const iconColor = TEXT_TOKEN_MAP[colorTokenText] ?? "#64748b";
  const innerIconSize = 22;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className={clsx("items-center", size === "md" ? "w-12 gap-1" : "w-14 gap-1.5")}
    >
      <View
        className={clsx(
          "w-11 h-11 rounded-full justify-center items-center",
          isSelected && "border border-brand",
        )}
        style={{ backgroundColor: bg }}
      >
        <IconComponent
          size={innerIconSize}
          color={isSelected ? BRAND_COLOR : iconColor}
        />
      </View>

      <Text
        numberOfLines={1}
        className={clsx(
          "text-[11px]",
          isSelected ? "font-semibold" : "font-normal",
        )}
        style={{ color: isSelected ? BRAND_COLOR : (TEXT_TOKEN_MAP[colorTokenText] ?? "#64748b") }}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
}
