import { View, Text } from "react-native";
import { BG_TOKEN_MAP, TEXT_TOKEN_MAP, BRAND_COLOR } from "@/constants/theme";
import { ICON_MAP, ICON_LABELS } from "@/constants/icons";
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
  /** 是否在图标下方显示中文名称标签 */
  showLabel?: boolean;
}

/**
 * CategoryIcon — 展示组件
 * 圆形浅色背景 + 彩色 Lucide 图标，支持 selected 高亮和可选中文名标签。
 */
export function CategoryIcon(props: CategoryIconProps) {
  const {
    iconName,
    bgToken,
    textToken,
    size = 24,
    circleSize = 48,
    selected = false,
    showLabel = false,
  } = props;

  const bgColor = BG_TOKEN_MAP[bgToken] ?? BG_TOKEN_MAP["gray-100"];
  const iconColor = TEXT_TOKEN_MAP[textToken] ?? TEXT_TOKEN_MAP["text-gray-500"];
  const IconComponent = ICON_MAP[iconName] ?? Folder;
  const label = ICON_LABELS[iconName] ?? iconName;

  const circle = (
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
      <IconComponent size={size} color={selected ? BRAND_COLOR : iconColor} />
    </View>
  );

  if (!showLabel) return circle;

  return (
    <View style={{ alignItems: "center", gap: 4 }}>
      {circle}
      <Text
        numberOfLines={1}
        style={{
          fontSize: 10,
          color: selected ? BRAND_COLOR : (TEXT_TOKEN_MAP["text-gray-500"] ?? "#6b7280"),
          fontWeight: selected ? "600" : "400",
        }}
      >
        {label}
      </Text>
    </View>
  );
}
