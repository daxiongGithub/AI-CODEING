import { TouchableOpacity, View, Text } from "react-native";
import { Folder } from "lucide-react-native";
import { ICON_MAP, ICON_LABELS } from "@/constants/icons";
import {
  BG_TOKEN_MAP,
  TEXT_TOKEN_MAP,
  BRAND_COLOR,
  PRIMARY_BG_COLOR,
} from "@/constants/theme";

/** 颜色对池：按图标名首字母循环分配 */
const COLOR_PAIRS = [
  { bg: PRIMARY_BG_COLOR, icon: BRAND_COLOR },
  { bg: BG_TOKEN_MAP["blue-100"]!, icon: TEXT_TOKEN_MAP["text-blue-500"]! },
  { bg: BG_TOKEN_MAP["emerald-100"]!, icon: TEXT_TOKEN_MAP["text-emerald-500"]! },
  { bg: BG_TOKEN_MAP["purple-100"]!, icon: TEXT_TOKEN_MAP["text-purple-500"]! },
  { bg: BG_TOKEN_MAP["amber-100"]!, icon: TEXT_TOKEN_MAP["text-amber-600"]! },
  { bg: BG_TOKEN_MAP["red-100"]!, icon: TEXT_TOKEN_MAP["text-red-500"]! },
  { bg: BG_TOKEN_MAP["cyan-100"]!, icon: TEXT_TOKEN_MAP["text-cyan-500"]! },
  { bg: BG_TOKEN_MAP["slate-100"]!, icon: TEXT_TOKEN_MAP["text-slate-500"]! },
];

/** 根据图标名首字母循环分配颜色对 */
function getColorPair(iconName: string) {
  const idx = iconName.charCodeAt(0) % COLOR_PAIRS.length;
  return COLOR_PAIRS[idx] ?? COLOR_PAIRS[0]!;
}

export interface IconCellProps {
  iconName: string;
  onPress: () => void;
  isSelected?: boolean;
}

/** 图标网格单元：圆形图标 + 中文名称标签 */
export function IconCell(props: IconCellProps) {
  const { iconName, isSelected = false, onPress } = props;
  const IconComponent = ICON_MAP[iconName] ?? Folder;
  const { bg, icon } = getColorPair(iconName);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="flex-1 items-center py-2"
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: bg,
          justifyContent: "center",
          alignItems: "center",
          ...(isSelected && { borderWidth: 1, borderColor: BRAND_COLOR }),
        }}
      >
        <IconComponent size={24} color={isSelected ? BRAND_COLOR : icon} />
      </View>
      <Text
        className={`mt-1 text-[10px] ${isSelected ? "font-semibold text-orange-500" : "text-zinc-500"}`}
        numberOfLines={1}
      >
        {ICON_LABELS[iconName] ?? iconName}
      </Text>
    </TouchableOpacity>
  );
}
