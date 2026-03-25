import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { X, Folder } from "lucide-react-native";
import * as Crypto from "expo-crypto";
import { useCategoryStore } from "@/store/categoryStore";
import type { CategoryType, CategoryWithSubs } from "@/types";
import { SegmentedControl } from "./SegmentedControl";
import { IconPickerModal } from "./IconPickerModal";
import { CategoryIcon } from "./CategoryIcon";
import { ICON_MAP } from "@/constants/icons";
import {
  BRAND_COLOR,
  PRIMARY_BG_COLOR,
  TEXT_SECONDARY_COLOR,
  BORDER_COLOR,
} from "@/constants/theme";

/** 12 种颜色 token 循环分配 */
const COLOR_TOKENS = [
  { bg: "orange-100", text: "text-orange-500" },
  { bg: "blue-100", text: "text-blue-500" },
  { bg: "green-100", text: "text-green-500" },
  { bg: "purple-100", text: "text-purple-500" },
  { bg: "red-100", text: "text-red-500" },
  { bg: "yellow-100", text: "text-yellow-600" },
  { bg: "indigo-100", text: "text-indigo-500" },
  { bg: "pink-100", text: "text-pink-500" },
  { bg: "emerald-100", text: "text-emerald-500" },
  { bg: "cyan-100", text: "text-cyan-500" },
  { bg: "amber-100", text: "text-amber-600" },
  { bg: "slate-100", text: "text-slate-500" },
];

interface AddCategoryDrawerProps {
  visible: boolean;
  onClose: () => void;
  /** 决定抽屉内容：add_l1 = 新增一级分类，add_l2 = 添加二级分类 */
  mode: "add_l1" | "add_l2";
  /** 仅 add_l1 时有效，默认 expense */
  initialType?: CategoryType;
  /** 仅 add_l2 时需要，展示并锁定父级分类 */
  parentCategory?: CategoryWithSubs;
  onSaved?: () => void;
}

/**
 * AddCategoryDrawer — 容器组件（使用 categoryStore）
 * 底部滑出抽屉，双模式：add_l1 新增一级分类 / add_l2 添加二级分类。
 */
export function AddCategoryDrawer({
  visible,
  onClose,
  mode,
  initialType = "expense",
  parentCategory,
  onSaved,
}: AddCategoryDrawerProps) {
  const {
    addCategory,
    addSubCategory,
    allExpenseCategories,
    allIncomeCategories,
    clearError,
  } = useCategoryStore();

  const [typeIndex, setTypeIndex] = useState(initialType === "expense" ? 0 : 1);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("folder");
  const [isSaving, setIsSaving] = useState(false);
  const [iconPickerVisible, setIconPickerVisible] = useState(false);

  const currentType: CategoryType = typeIndex === 0 ? "expense" : "income";
  const CARD_HEIGHT = mode === "add_l1" ? 480 : 420;
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
  }, [visible, slideAnim, CARD_HEIGHT]);

  // 每次打开时同步 initialType
  useEffect(() => {
    if (visible) {
      setTypeIndex(initialType === "expense" ? 0 : 1);
    }
  }, [visible, initialType]);

  function resetForm() {
    setName("");
    setIcon("folder");
    setIsSaving(false);
    clearError();
  }

  function handleClose() {
    Animated.timing(slideAnim, {
      toValue: CARD_HEIGHT,
      duration: 280,
      useNativeDriver: true,
    }).start(() => {
      resetForm();
      onClose();
    });
  }

  async function handleSave() {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert("提示", "请输入分类名称");
      return;
    }
    if (trimmedName.length > 12) {
      Alert.alert("提示", "分类名称不得超过 12 个字符");
      return;
    }

    if (mode === "add_l1") {
      const existingList =
        currentType === "expense" ? allExpenseCategories : allIncomeCategories;
      const isDuplicate = existingList.some((c) => c.name.trim() === trimmedName);
      if (isDuplicate) {
        Alert.alert("提示", "该类型下已存在同名分类，请修改名称");
        return;
      }
      const colorIdx = existingList.length % COLOR_TOKENS.length;
      const colors = COLOR_TOKENS[colorIdx] ?? COLOR_TOKENS[0]!;
      const now = new Date().toISOString();
      setIsSaving(true);
      try {
        await addCategory({
          id: Crypto.randomUUID(),
          type: currentType,
          name: trimmedName,
          icon,
          colorTokenBg: colors.bg,
          colorTokenText: colors.text,
          sortOrder: existingList.length + 1,
          enabled: true,
          isPreset: false,
          createdAt: now,
          updatedAt: now,
        });
        resetForm();
        onSaved?.();
        onClose();
      } catch {
        Alert.alert("保存失败", "请稍后重试");
      } finally {
        setIsSaving(false);
      }
    } else {
      // add_l2 mode
      if (!parentCategory) {
        Alert.alert("错误", "未选择一级分类");
        return;
      }
      const isDuplicate = parentCategory.subCategories.some(
        (s) => s.name.trim() === trimmedName,
      );
      if (isDuplicate) {
        Alert.alert("提示", "该父分类下已存在同名子分类，请修改名称");
        return;
      }
      setIsSaving(true);
      try {
        await addSubCategory(parentCategory.id, {
          id: Crypto.randomUUID(),
          name: trimmedName,
          icon,
          sortOrder: parentCategory.subCategories.length + 1,
          enabled: true,
        });
        resetForm();
        onSaved?.();
        onClose();
      } catch {
        Alert.alert("保存失败", "请稍后重试");
      } finally {
        setIsSaving(false);
      }
    }
  }

  const IconComponent = ICON_MAP[icon] ?? Folder;
  const canSave = name.trim().length > 0 && !isSaving;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}>
        {/* 遮罩层 */}
        <Pressable className="absolute inset-0" onPress={handleClose} />
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: "flex-end" }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Pressable onPress={() => {}}>
            <Animated.View
              className="w-full bg-white"
              style={{
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                height: CARD_HEIGHT,
                transform: [{ translateY: slideAnim }],
              }}
            >
              {/* Handle Bar */}
              <View className="items-center pt-3">
                <View
                  style={{
                    width: 40,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: BORDER_COLOR,
                  }}
                />
              </View>

              {/* Title Row */}
              <View
                className="flex-row items-center justify-between px-4"
                style={{ height: 52 }}
              >
                <Text className="text-[18px] font-semibold text-zinc-900">
                  {mode === "add_l1" ? "新增一级分类" : "添加二级分类"}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleClose}
                  className="h-7 w-7 items-center justify-center rounded-full bg-gray-100"
                >
                  <X size={14} color="#71717a" />
                </TouchableOpacity>
              </View>

              {/* Type Selector (add_l1 only) */}
              {mode === "add_l1" && (
                <View
                  className="items-center"
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: BORDER_COLOR,
                  }}
                >
                  <SegmentedControl
                    options={["支出分类", "收入分类"]}
                    selectedIndex={typeIndex}
                    onChange={setTypeIndex}
                  />
                </View>
              )}

              {/* Parent Info Row (add_l2 only) */}
              {mode === "add_l2" && parentCategory && (
                <View
                  className="mx-4 flex-row items-center rounded-xl px-3"
                  style={{
                    height: 52,
                    backgroundColor: PRIMARY_BG_COLOR,
                    marginTop: 4,
                  }}
                >
                  <CategoryIcon
                    iconName={parentCategory.icon}
                    bgToken={parentCategory.colorTokenBg}
                    textToken={parentCategory.colorTokenText}
                    size={14}
                    circleSize={28}
                  />
                  <Text
                    className="ml-2.5 flex-1 text-[14px] font-medium text-zinc-900"
                    numberOfLines={1}
                  >
                    {parentCategory.name}
                  </Text>
                  <View
                    style={{
                      backgroundColor: BRAND_COLOR,
                      borderRadius: 4,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: "600", color: "#fff" }}>
                      一级
                    </Text>
                  </View>
                </View>
              )}

              {/* Form Section */}
              <View style={{ paddingHorizontal: 16, gap: 16, marginTop: 20 }}>
                {/* Icon Selector Row */}
                <View className="flex-row items-center gap-3">
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setIconPickerVisible(true)}
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 26,
                      backgroundColor: PRIMARY_BG_COLOR,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 1.5,
                      borderColor: BRAND_COLOR,
                      borderStyle: "dashed",
                    }}
                  >
                    <IconComponent size={24} color={BRAND_COLOR} />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 13, color: TEXT_SECONDARY_COLOR }}>
                    点击选择图标
                  </Text>
                </View>

                {/* Name Input */}
                <View
                  className="overflow-hidden rounded-[10px] border border-zinc-200 bg-white"
                  style={{ height: 44 }}
                >
                  <TextInput
                    className="flex-1 px-3 text-[14px] text-zinc-900"
                    placeholder="分类名称，最多 12 字"
                    placeholderTextColor={TEXT_SECONDARY_COLOR}
                    value={name}
                    onChangeText={setName}
                    maxLength={12}
                  />
                </View>
              </View>

              {/* Spacer */}
              <View style={{ flex: 1 }} />

              {/* Save Button */}
              <View style={{ paddingHorizontal: 16, paddingBottom: 32 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleSave}
                  disabled={!canSave}
                  className="items-center justify-center rounded-xl bg-orange-500"
                  style={{ height: 48, opacity: canSave ? 1 : 0.5 }}
                >
                  <Text className="text-[15px] font-semibold text-white">
                    {isSaving ? "保存中..." : "保存"}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Pressable>
        </KeyboardAvoidingView>
      </View>

      {/* 图标选择器：在 Modal 外层渲染，叠加在抽屉上方 */}
      <IconPickerModal
        visible={iconPickerVisible}
        selectedIcon={icon}
        onConfirm={(iconName) => {
          setIcon(iconName);
        }}
        onClose={() => setIconPickerVisible(false)}
      />
    </Modal>
  );
}
