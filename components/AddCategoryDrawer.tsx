import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { X, Plus, Trash2, Folder } from 'lucide-react-native';
import * as Crypto from 'expo-crypto';
import { useCategoryStore } from '@/store/categoryStore';
import type { CategoryType } from '@/types';
import { SegmentedControl } from './SegmentedControl';
import { IconPickerModal } from './IconPickerModal';
import { ICON_MAP } from '@/constants/icons';
import { BRAND_COLOR, PRIMARY_BG_COLOR, TEXT_SECONDARY_COLOR, BORDER_COLOR, EXPENSE_COLOR } from '@/constants/colors';

/** 12 种颜色 token 循环分配 */
const COLOR_TOKENS = [
  { bg: 'orange-100', text: 'text-orange-500' },
  { bg: 'blue-100', text: 'text-blue-500' },
  { bg: 'green-100', text: 'text-green-500' },
  { bg: 'purple-100', text: 'text-purple-500' },
  { bg: 'red-100', text: 'text-red-500' },
  { bg: 'yellow-100', text: 'text-yellow-600' },
  { bg: 'indigo-100', text: 'text-indigo-500' },
  { bg: 'pink-100', text: 'text-pink-500' },
  { bg: 'emerald-100', text: 'text-emerald-500' },
  { bg: 'cyan-100', text: 'text-cyan-500' },
  { bg: 'amber-100', text: 'text-amber-600' },
  { bg: 'slate-100', text: 'text-slate-500' },
];

interface SubItem {
  key: string;
  name: string;
  icon: string;
}

interface AddCategoryDrawerProps {
  visible: boolean;
  onClose: () => void;
  initialType?: CategoryType;
  onSaved?: () => void;
}

function IconButton({
  iconName,
  onPress,
  size = 24,
  circleSize = 44,
}: {
  iconName: string;
  onPress: () => void;
  size?: number;
  circleSize?: number;
}) {
  const IconComponent = ICON_MAP[iconName] ?? Folder;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        width: circleSize,
        height: circleSize,
        borderRadius: circleSize / 2,
        backgroundColor: PRIMARY_BG_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: BRAND_COLOR,
        borderStyle: 'dashed',
      }}
    >
      <IconComponent size={size} color={BRAND_COLOR} />
    </TouchableOpacity>
  );
}

/**
 * AddCategoryDrawer — 容器组件（使用 categoryStore）
 * 底部滑出抽屉，支持创建一级分类 + 批量创建子分类。
 */
export function AddCategoryDrawer({
  visible,
  onClose,
  initialType = 'expense',
  onSaved,
}: AddCategoryDrawerProps) {
  const { addCategoryWithSubs, allExpenseCategories, allIncomeCategories, error, clearError } =
    useCategoryStore();

  const [typeIndex, setTypeIndex] = useState(initialType === 'expense' ? 0 : 1);
  const [lv1Name, setLv1Name] = useState('');
  const [lv1Icon, setLv1Icon] = useState('folder');
  const [subItems, setSubItems] = useState<SubItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // 图标选择器
  const [iconPickerTarget, setIconPickerTarget] = useState<'lv1' | string | null>(null);

  const currentType: CategoryType = typeIndex === 0 ? 'expense' : 'income';

  function resetForm() {
    setTypeIndex(initialType === 'expense' ? 0 : 1);
    setLv1Name('');
    setLv1Icon('folder');
    setSubItems([]);
    setIsSaving(false);
    clearError();
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function addSubItem() {
    if (subItems.length >= 10) {
      Alert.alert('提示', '最多添加 10 个子分类');
      return;
    }
    setSubItems((prev) => [
      ...prev,
      { key: Crypto.randomUUID(), name: '', icon: 'folder' },
    ]);
  }

  function removeSubItem(key: string) {
    setSubItems((prev) => prev.filter((s) => s.key !== key));
  }

  function updateSubName(key: string, name: string) {
    setSubItems((prev) => prev.map((s) => (s.key === key ? { ...s, name } : s)));
  }

  function updateSubIcon(key: string, icon: string) {
    setSubItems((prev) => prev.map((s) => (s.key === key ? { ...s, icon } : s)));
  }

  async function handleSave() {
    const trimmedName = lv1Name.trim();

    // 校验：名称非空
    if (!trimmedName) {
      Alert.alert('提示', '请输入分类名称');
      return;
    }
    // 校验：名称长度
    if (trimmedName.length > 12) {
      Alert.alert('提示', '分类名称不得超过 12 个字符');
      return;
    }
    // 校验：同类型下不可重名
    const existingList =
      currentType === 'expense' ? allExpenseCategories : allIncomeCategories;
    const isDuplicate = existingList.some(
      (c) => c.name.trim() === trimmedName && c.enabled,
    );
    if (isDuplicate) {
      Alert.alert('提示', '该类型下已存在同名分类，请修改名称');
      return;
    }

    // 校验子分类
    const validSubs = subItems.filter((s) => s.name.trim().length > 0);
    for (const sub of validSubs) {
      if (sub.name.trim().length > 12) {
        Alert.alert('提示', `子分类「${sub.name}」名称不得超过 12 个字符`);
        return;
      }
    }

    // 自动分配颜色 token
    const colorIdx = existingList.length % COLOR_TOKENS.length;
    const colors = COLOR_TOKENS[colorIdx] ?? COLOR_TOKENS[0]!;
    const now = new Date().toISOString();
    const categoryId = Crypto.randomUUID();

    setIsSaving(true);
    try {
      await addCategoryWithSubs(
        {
          id: categoryId,
          type: currentType,
          name: trimmedName,
          icon: lv1Icon,
          colorTokenBg: colors.bg,
          colorTokenText: colors.text,
          sortOrder: existingList.length + 1,
          enabled: true,
          isPreset: false,
          createdAt: now,
          updatedAt: now,
        },
        validSubs.map((sub, idx) => ({
          id: Crypto.randomUUID(),
          name: sub.name.trim(),
          icon: sub.icon,
          sortOrder: idx + 1,
          enabled: true,
        })),
      );
      resetForm();
      onSaved?.();
      onClose();
    } catch {
      Alert.alert('保存失败', '请稍后重试');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={handleClose}
      >
        {/* 固定黑色遮罩 */}
        <Pressable
          style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }, { backgroundColor: 'rgba(0,0,0,0.4)' }]}
          onPress={handleClose}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
          pointerEvents="box-none"
        >
          <View className="flex-1 justify-end" pointerEvents="box-none">
            <View
              className="w-full bg-white"
              style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%' }}
            >
              {/* ── 标题栏 ── */}
              <View className="flex-row items-center justify-between px-4 pt-3.5" style={{ height: 52 }}>
                <Text className="text-[18px] font-semibold text-zinc-900">新增分类</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleClose}
                  className="h-7 w-7 items-center justify-center rounded-full bg-gray-100"
                >
                  <X size={14} color="#71717a" />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={{ flexShrink: 1 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ padding: 14, gap: 12 }}
              >
                  {/* 说明文字 */}
                  <Text className="text-[12px] text-zinc-400">
                    名称必填；支持维护一级图标并批量新增子分类
                  </Text>

                  {/* 类型切换 */}
                  <View className="items-center">
                    <SegmentedControl
                      options={['支出分类', '收入分类']}
                      selectedIndex={typeIndex}
                      onChange={setTypeIndex}
                    />
                  </View>

                  {/* ── 一级分类输入行 ── */}
                  <Text className="text-[12px] font-semibold text-zinc-900">一级分类</Text>
                  <View className="flex-row overflow-hidden rounded-[10px] border border-zinc-200 bg-white" style={{ height: 44 }}>
                    {/* 图标按钮 */}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => setIconPickerTarget('lv1')}
                      className="h-full w-[44px] items-center justify-center rounded-l-[10px] bg-gray-50"
                      style={{ borderRightWidth: 1, borderRightColor: BORDER_COLOR }}
                    >
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          backgroundColor: PRIMARY_BG_COLOR,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        {(() => {
                          const Ic = ICON_MAP[lv1Icon] ?? Folder;
                          return <Ic size={14} color={BRAND_COLOR} />;
                        })()}
                      </View>
                    </TouchableOpacity>
                    {/* 名称输入 */}
                    <TextInput
                      className="flex-1 px-3 text-[13px] text-zinc-900"
                      placeholder="输入一级分类名称（最多 12 字）"
                      placeholderTextColor={TEXT_SECONDARY_COLOR}
                      value={lv1Name}
                      onChangeText={setLv1Name}
                      maxLength={12}
                    />
                  </View>

                  {/* ── 子分类区 ── */}
                  <Text className="text-[12px] font-semibold text-zinc-900">
                    子分类（保存到当前选中的一级分类，选填）
                  </Text>

                  {subItems.map((sub) => (
                    <View
                      key={sub.key}
                      className="flex-row overflow-hidden rounded-[10px] border border-zinc-200 bg-white"
                      style={{ height: 40 }}
                    >
                      {/* 图标按钮 */}
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setIconPickerTarget(sub.key)}
                        className="h-full w-[44px] items-center justify-center bg-gray-50"
                        style={{ borderRightWidth: 1, borderRightColor: BORDER_COLOR }}
                      >
                        <View
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            backgroundColor: PRIMARY_BG_COLOR,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          {(() => {
                            const Ic = ICON_MAP[sub.icon] ?? Folder;
                            return <Ic size={14} color={BRAND_COLOR} />;
                          })()}
                        </View>
                      </TouchableOpacity>
                      {/* 名称 */}
                      <TextInput
                        className="flex-1 px-3 text-[13px] text-zinc-900"
                        placeholder="子分类名称（最多 12 字）"
                        placeholderTextColor={TEXT_SECONDARY_COLOR}
                        value={sub.name}
                        onChangeText={(v) => updateSubName(sub.key, v)}
                        maxLength={12}
                      />
                      {/* 删除 */}
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => removeSubItem(sub.key)}
                        className="h-full w-10 items-center justify-center"
                      >
                        <Trash2 size={16} color={EXPENSE_COLOR} />
                      </TouchableOpacity>
                    </View>
                  ))}

                  {/* 添加子分类按钮 */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={addSubItem}
                    className="flex-row items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-zinc-300 bg-gray-50 py-2.5"
                  >
                    <Plus size={16} color={TEXT_SECONDARY_COLOR} />
                    <Text className="text-[13px] text-zinc-500">添加子分类</Text>
                  </TouchableOpacity>

                  {/* 提示文字 */}
                  <View className="flex-row items-center gap-2 rounded-[10px] bg-orange-50 px-3 py-2">
                    <Folder size={16} color={BRAND_COLOR} />
                    <Text className="flex-1 text-[12px] font-medium text-orange-500">
                      未选择图标时，系统默认使用 folder
                    </Text>
                  </View>

                  {/* 底部占位 */}
                  <View style={{ height: 8 }} />
                </ScrollView>

                {/* ── 保存按钮 ── */}
                <View className="border-t border-zinc-200 bg-white px-4 py-3.5">
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleSave}
                    disabled={isSaving}
                    className="items-center justify-center rounded-xl bg-orange-500"
                    style={{ height: 44, opacity: isSaving ? 0.6 : 1 }}
                  >
                    <Text className="text-[14px] font-semibold text-white">
                      {isSaving ? '保存中...' : '保存并创建完整层级'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* 图标选择器 */}
      <IconPickerModal
        visible={iconPickerTarget !== null}
        selectedIcon={
          iconPickerTarget === 'lv1'
            ? lv1Icon
            : (subItems.find((s) => s.key === iconPickerTarget)?.icon ?? 'folder')
        }
        onConfirm={(iconName) => {
          if (iconPickerTarget === 'lv1') {
            setLv1Icon(iconName);
          } else if (iconPickerTarget) {
            updateSubIcon(iconPickerTarget, iconName);
          }
        }}
        onClose={() => setIconPickerTarget(null)}
      />
    </>
  );
}
