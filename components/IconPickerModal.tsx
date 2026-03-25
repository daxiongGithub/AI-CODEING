import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useState, useMemo, useRef, useEffect } from "react";
import { X, Search } from "lucide-react-native";
import { ICON_MAP, ICON_GROUPS, ALL_ICON_NAMES } from "@/constants/icons";
import {
  BG_TOKEN_MAP,
  TEXT_TOKEN_MAP,
  BRAND_COLOR,
  PRIMARY_BG_COLOR,
  TEXT_SECONDARY_COLOR,
} from "@/constants/theme";
import { Folder } from "lucide-react-native";

interface IconPickerModalProps {
  visible: boolean;
  /** 当前已选图标名 */
  selectedIcon: string;
  /** 确认选择后回调 */
  onConfirm: (iconName: string) => void;
  onClose: () => void;
}

const SCREEN_HEIGHT = Dimensions.get("window").height;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.8;

const COLUMNS = 4;

// 「全部」组包含所有图标
const ALL_GROUP = { label: "全部", icons: ALL_ICON_NAMES };
const FILTER_GROUPS = [ALL_GROUP, ...ICON_GROUPS];

// 图标展示用的颜色循环（从 constants/theme 取值，禁止硬编码十六进制）
const COLOR_PAIRS = [
  { bg: PRIMARY_BG_COLOR, icon: BRAND_COLOR },
  { bg: BG_TOKEN_MAP["blue-100"]!, icon: TEXT_TOKEN_MAP["text-blue-500"]! },
  {
    bg: BG_TOKEN_MAP["emerald-100"]!,
    icon: TEXT_TOKEN_MAP["text-emerald-500"]!,
  },
  { bg: BG_TOKEN_MAP["purple-100"]!, icon: TEXT_TOKEN_MAP["text-purple-500"]! },
  { bg: BG_TOKEN_MAP["amber-100"]!, icon: TEXT_TOKEN_MAP["text-amber-600"]! },
  { bg: BG_TOKEN_MAP["red-100"]!, icon: TEXT_TOKEN_MAP["text-red-500"]! },
  { bg: BG_TOKEN_MAP["cyan-100"]!, icon: TEXT_TOKEN_MAP["text-cyan-500"]! },
  { bg: BG_TOKEN_MAP["slate-100"]!, icon: TEXT_TOKEN_MAP["text-slate-500"]! },
];

function getColorPair(iconName: string) {
  const idx = iconName.charCodeAt(0) % COLOR_PAIRS.length;
  return COLOR_PAIRS[idx] ?? COLOR_PAIRS[0]!;
}

interface IconCellProps {
  iconName: string;
  isSelected: boolean;
  onPress: () => void;
}

function IconCell({ iconName, isSelected, onPress }: IconCellProps) {
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
        {iconName}
      </Text>
    </TouchableOpacity>
  );
}

/**
 * IconPickerModal — 底部弹出图标选择器
 * 包含搜索、分类筛选、4 列图标网格、预览 + 确认按钮。
 */
export function IconPickerModal({
  visible,
  selectedIcon,
  onConfirm,
  onClose,
}: IconPickerModalProps) {
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState("全部");
  const [localSelected, setLocalSelected] = useState(selectedIcon);

  // 卡片滑入动画
  const slideAnim = useRef(new Animated.Value(CARD_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(CARD_HEIGHT);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 380,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  function handleClose() {
    Animated.timing(slideAnim, {
      toValue: CARD_HEIGHT,
      duration: 280,
      useNativeDriver: true,
    }).start(() => onClose());
  }

  // 同步外部 selectedIcon
  const handleOpen = () => setLocalSelected(selectedIcon);

  const filteredIcons = useMemo(() => {
    const group =
      FILTER_GROUPS.find((g) => g.label === filterGroup) ?? ALL_GROUP;
    const base = group.icons;
    if (!search.trim()) return base;
    const q = search.toLowerCase().trim();
    return base.filter((name) => name.includes(q));
  }, [search, filterGroup]);

  // 每行 COLUMNS 个，用 FlatList numColumns
  const SelectedIcon = ICON_MAP[localSelected] ?? Folder;
  const selectedBg = BG_TOKEN_MAP["orange-100"] ?? "#fff7ed";
  const selectedColor = TEXT_TOKEN_MAP["text-orange-500"] ?? "#f97316";

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onShow={handleOpen}
      onRequestClose={handleClose}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}>
        {/* 遮罩层：绝对定位，不参与滚动布局 */}
        <Pressable className="absolute inset-0" onPress={handleClose} />
        {/* 内容区：独立于遮罩，居底 */}
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: "flex-end" }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Pressable onPress={() => {}} className="w-full">
            <Animated.View
              className="w-full bg-white"
              style={{
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                height: CARD_HEIGHT,
                transform: [{ translateY: slideAnim }],
              }}
            >
              {/* ── 标题栏 ── */}
              <View
                className="flex-row items-center justify-between border-b border-zinc-200 px-4"
                style={{ height: 56 }}
              >
                <Text className="text-[17px] font-semibold text-zinc-900">
                  选择图标
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleClose}
                  className="h-8 w-8 items-center justify-center rounded-full bg-gray-100"
                >
                  <X size={16} color={TEXT_SECONDARY_COLOR} />
                </TouchableOpacity>
              </View>

              {/* ── 搜索框 ── */}
              <View className="flex-row items-center gap-2 px-4 pt-3">
                <View
                  className="flex-1 flex-row items-center gap-2 rounded-[10px] bg-gray-100 px-3"
                  style={{ height: 36 }}
                >
                  <Search size={15} color={TEXT_SECONDARY_COLOR} />
                  <TextInput
                    className="flex-1 text-[13px] text-zinc-900"
                    placeholder={`搜索图标名称（共 ${ALL_ICON_NAMES.length} 个）`}
                    placeholderTextColor={TEXT_SECONDARY_COLOR}
                    value={search}
                    onChangeText={setSearch}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* ── 分类 Chip 过滤器 ── */}
              <FlatList
                data={FILTER_GROUPS}
                keyExtractor={(item) => item.label}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ height: 48, flexGrow: 0, flexShrink: 0 }}
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  gap: 8,
                }}
                renderItem={({ item }) => {
                  const isActive = filterGroup === item.label;
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => setFilterGroup(item.label)}
                      className={`rounded-full px-3 ${isActive ? "bg-orange-500" : "bg-gray-100"}`}
                      style={{ height: 28, justifyContent: "center" }}
                    >
                      <Text
                        className={`text-[12px] font-semibold ${isActive ? "text-white" : "text-zinc-500"}`}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />

              {/* ── 图标网格（FlashList，大列表必须用） ── */}
              <FlashList
                data={filteredIcons}
                keyExtractor={(item) => item}
                numColumns={COLUMNS}
                estimatedItemSize={80}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 8,
                  paddingBottom: 8,
                }}
                renderItem={({ item }) => (
                  <IconCell
                    iconName={item}
                    isSelected={localSelected === item}
                    onPress={() => setLocalSelected(item)}
                  />
                )}
                style={{ flex: 1 }}
              />

              {/* ── 底部预览 + 确认 ── */}
              <View
                className="flex-row items-center justify-between border-t border-zinc-200 px-4"
                style={{ height: 80 }}
              >
                {/* 已选预览 */}
                <View className="flex-row items-center gap-2.5">
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: selectedBg,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <SelectedIcon size={22} color={selectedColor} />
                  </View>
                  <View>
                    <Text className="text-[11px] text-zinc-400">已选图标</Text>
                    <Text className="text-[13px] font-semibold text-zinc-900">
                      {localSelected || "folder"}
                    </Text>
                  </View>
                </View>

                {/* 确认按钮 */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    onConfirm(localSelected || "folder");
                    handleClose();
                  }}
                  className="items-center justify-center rounded-[10px] bg-orange-500"
                  style={{ width: 120, height: 44 }}
                >
                  <Text className="text-[15px] font-semibold text-white">
                    确认选择
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Pressable>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
