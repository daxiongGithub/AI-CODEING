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
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { X, Search } from "lucide-react-native";
import { ALL_ICON_NAMES, ICON_LABELS } from "@/constants/icons";
import { TEXT_SECONDARY_COLOR } from "@/constants/theme";
import { IconCell } from "../IconCell";
import { useIconPicker, CARD_HEIGHT, FILTER_GROUPS } from "./hooks/useIconPicker";

/** 图标网格列数 */
const COLUMNS = 4;

export interface IconPickerModalProps {
  visible: boolean;
  /** 当前已选图标名 */
  selectedIcon: string;
  /** 确认选择后回调 */
  onConfirm: (iconName: string) => void;
  onClose: () => void;
}

/**
 * IconPickerModal — 底部弹出图标选择器
 * 包含搜索、分类筛选、4 列图标网格、预览 + 确认按钮。
 */
export function IconPickerModal(props: IconPickerModalProps) {
  const { visible, selectedIcon, onConfirm, onClose } = props;

  const {
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
  } = useIconPicker({ visible, selectedIcon, onClose });

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
                <Text className="text-[17px] font-semibold text-zinc-900">选择图标</Text>
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
                contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}
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
              <View className="flex-1">
                <FlashList
                  data={filteredIcons}
                  keyExtractor={(item) => item}
                  numColumns={COLUMNS}
                  estimatedItemSize={80}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 8 }}
                  renderItem={({ item }) => (
                    <IconCell
                      iconName={item}
                      // isSelected={localSelected === item}
                      onPress={() => setLocalSelected(item)}
                    />
                  )}
                />
              </View>

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
                      {ICON_LABELS[localSelected] ?? (localSelected || "folder")}
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
                  <Text className="text-[15px] font-semibold text-white">确认选择</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Pressable>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
