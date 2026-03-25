import { View } from "react-native";
import { BG_TOKEN_MAP, TEXT_TOKEN_MAP, BRAND_COLOR } from "@/constants/theme";
import { ICON_MAP } from "@/constants/icons";
import { Folder } from "lucide-react-native";

interface CategoryIconProps {
  /** lucide kebab-case 图标名，如 'utensils'、'shopping-bag' */
  iconName: string;
  /** 背景色 token，如 'orange-100' */
  bgToken: string;
  /** 图标色 token，如 'text-orange-500' */
  textToken: string;
  /** 图标尺寸（px），默认 24 */
  size?: number;
  /** 圆形容器直径（px），默认 48 */
  circleSize?: number;
  /** 是否显示品牌色选中边框 */
  selected?: boolean;
}

/**
 * CategoryIcon — 展示组件
 * 圆形浅色背景 + 彩色 Lucide 图标，支持 selected 高亮状态。
 */
export function CategoryIcon({
  iconName,
  bgToken,
  textToken,
  size = 24,
  circleSize = 48,
  selected = false,
}: CategoryIconProps) {
  const bgColor = BG_TOKEN_MAP[bgToken] ?? "#f3f4f6";
  const iconColor = TEXT_TOKEN_MAP[textToken] ?? "#6b7280";

  const IconComponent = ICON_MAP[iconName] ?? Folder;

  return (
    <View
      style={{
        width: circleSize,
        height: circleSize,
        borderRadius: circleSize / 2,
        backgroundColor: bgColor,
        justifyContent: "center",
        alignItems: "center",
        ...(selected && {
          borderWidth: 2,
          borderColor: BRAND_COLOR,
        }),
      }}
    >
      <IconComponent size={size} color={iconColor} />
    </View>
  );
}
