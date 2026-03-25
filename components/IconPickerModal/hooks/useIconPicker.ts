import { useState, useMemo, useRef, useEffect } from "react";
import { Animated, Dimensions } from "react-native";
import { Folder } from "lucide-react-native";
import { ICON_MAP, ICON_GROUPS, ALL_ICON_NAMES, ICON_LABELS } from "@/constants/icons";
import { BG_TOKEN_MAP, TEXT_TOKEN_MAP } from "@/constants/theme";

const SCREEN_HEIGHT = Dimensions.get("window").height;
/** 底部卡片高度，取屏幕高度 60% */
export const CARD_HEIGHT = SCREEN_HEIGHT * 0.6;

const ALL_GROUP = { label: "全部", icons: ALL_ICON_NAMES };
/** 分类过滤组列表（「全部」置首） */
export const FILTER_GROUPS = [ALL_GROUP, ...ICON_GROUPS];

interface UseIconPickerParams {
  visible: boolean;
  selectedIcon: string;
  onClose: () => void;
}

/** 管理图标选择器的全部状态、动画与派生数据 */
export function useIconPicker(params: UseIconPickerParams) {
  const { visible, selectedIcon, onClose } = params;

  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState("全部");
  const [localSelected, setLocalSelected] = useState(selectedIcon);

  const slideAnim = useRef(new Animated.Value(CARD_HEIGHT)).current;

  useEffect(() => {
    if (!visible) return;
    slideAnim.setValue(CARD_HEIGHT);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 380,
      useNativeDriver: true,
    }).start();
  }, [visible, slideAnim]);

  /** 触发关闭动画，动画结束后执行 onClose 回调 */
  function handleClose() {
    Animated.timing(slideAnim, {
      toValue: CARD_HEIGHT,
      duration: 280,
      useNativeDriver: true,
    }).start(() => onClose());
  }

  /** 每次弹出时将外部 selectedIcon 同步到内部状态 */
  function handleOpen() {
    setLocalSelected(selectedIcon);
  }

  /** 按搜索词 + 当前分类筛选图标列表，支持英文名与中文标签双向匹配 */
  const filteredIcons = useMemo(() => {
    const group = FILTER_GROUPS.find((g) => g.label === filterGroup) ?? ALL_GROUP;
    const base = group.icons;
    if (!search.trim()) return base;
    const q = search.trim().toLowerCase();
    return base.filter((name) => {
      const label = (ICON_LABELS[name] ?? "").toLowerCase();
      return name.includes(q) || label.includes(q);
    });
  }, [search, filterGroup]);

  const SelectedIcon = ICON_MAP[localSelected] ?? Folder;
  // fallback 值来自 token map，不直接使用
  const selectedBg = BG_TOKEN_MAP["orange-100"] ?? "#fff7ed";
  const selectedColor = TEXT_TOKEN_MAP["text-orange-500"] ?? "#f97316";

  return {
    search,
    setSearch,
    filterGroup,
    setFilterGroup,
    localSelected,
    setLocalSelected,
    slideAnim,
    filteredIcons,
    handleClose,
    handleOpen,
    SelectedIcon,
    selectedBg,
    selectedColor,
  };
}
