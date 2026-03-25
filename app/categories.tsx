import { View, Text, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useCategoryStore } from '@/store/categoryStore';
import { isCategoryInUse } from '@/db/queries';
import type { CategoryWithSubs, CategoryType, SubCategory } from '@/types';
import { SegmentedControl } from '@/components/SegmentedControl';
import { AddCategoryDrawer } from '@/components/AddCategoryDrawer';
import { CategoryIcon } from '@/components/CategoryIcon';
import {
  BRAND_COLOR,
  PRIMARY_BG_COLOR,
  TEXT_MAIN_COLOR,
  TEXT_SECONDARY_COLOR,
  BORDER_COLOR,
} from '@/constants/colors';

// ─── L1Item 展示组件 ───────────────────────────────────────────
function L1Item({
  category,
  selected,
  onPress,
  onLongPress,
}: {
  category: CategoryWithSubs;
  selected: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      onLongPress={onLongPress}
      style={{ height: 44 }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          backgroundColor: selected ? PRIMARY_BG_COLOR : 'transparent',
          borderLeftWidth: selected ? 2 : 0,
          borderLeftColor: BRAND_COLOR,
        }}
      >
        <CategoryIcon
          iconName={category.icon}
          bgToken={category.colorTokenBg}
          textToken={category.colorTokenText}
          size={14}
          circleSize={28}
        />
        <Text
          style={{
            marginLeft: 8,
            fontSize: 13,
            fontWeight: '500',
            color: TEXT_MAIN_COLOR,
            flex: 1,
          }}
          numberOfLines={1}
        >
          {category.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── L2Item 展示组件 ───────────────────────────────────────────
function L2Item({ sub }: { sub: SubCategory }) {
  return (
    <View
      style={{
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
      }}
    >
      <CategoryIcon
        iconName={sub.icon}
        bgToken="gray-100"
        textToken="text-gray-500"
        size={14}
        circleSize={28}
      />
      <Text
        style={{
          marginLeft: 8,
          fontSize: 13,
          color: TEXT_MAIN_COLOR,
          flex: 1,
        }}
        numberOfLines={1}
      >
        {sub.name}
      </Text>
      {!sub.enabled && (
        <View
          style={{
            backgroundColor: '#f4f4f5',
            borderRadius: 4,
            paddingHorizontal: 4,
            paddingVertical: 1,
          }}
        >
          <Text style={{ fontSize: 10, color: '#a1a1aa' }}>已停用</Text>
        </View>
      )}
    </View>
  );
}

// ─── PanelHeader 展示组件 ─────────────────────────────────────
function PanelHeader({
  title,
  onAdd,
  disabled = false,
}: {
  title: string;
  onAdd: () => void;
  disabled?: boolean;
}) {
  return (
    <View
      style={{
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
      }}
    >
      <Text style={{ fontSize: 12, fontWeight: '600', color: TEXT_SECONDARY_COLOR }}>
        {title}
      </Text>
      <TouchableOpacity
        activeOpacity={disabled ? 1 : 0.7}
        onPress={disabled ? undefined : onAdd}
        style={{
          height: 20,
          paddingHorizontal: 8,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: disabled ? '#d4d4d8' : BRAND_COLOR,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: disabled ? '#d4d4d8' : BRAND_COLOR,
          }}
        >
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── 页面主组件 ───────────────────────────────────────────────
export default function CategoriesScreen() {
  const router = useRouter();
  const {
    allExpenseCategories,
    allIncomeCategories,
    loadAllCategories,
    toggleEnabled,
  } = useCategoryStore();

  const [typeIndex, setTypeIndex] = useState(0);
  const [selectedL1Id, setSelectedL1Id] = useState<string | null>(null);
  const [drawerMode, setDrawerMode] = useState<'add_l1' | 'add_l2'>('add_l1');
  const [drawerVisible, setDrawerVisible] = useState(false);

  const currentType: CategoryType = typeIndex === 0 ? 'expense' : 'income';
  const l1Categories: CategoryWithSubs[] =
    typeIndex === 0 ? allExpenseCategories : allIncomeCategories;
  const selectedL1 = l1Categories.find((c) => c.id === selectedL1Id) ?? null;
  const l2Categories = selectedL1?.subCategories ?? [];

  useEffect(() => {
    loadAllCategories();
  }, [loadAllCategories]);

  function handleTypeChange(idx: number) {
    setTypeIndex(idx);
    setSelectedL1Id(null);
  }

  function openAddL1() {
    setDrawerMode('add_l1');
    setDrawerVisible(true);
  }

  function openAddL2() {
    if (!selectedL1Id) return;
    setDrawerMode('add_l2');
    setDrawerVisible(true);
  }

  const handleToggleEnabled = useCallback(
    async (id: string, currentEnabled: boolean) => {
      if (currentEnabled) {
        try {
          const inUse = await isCategoryInUse(id);
          if (inUse) {
            Alert.alert(
              '停用分类',
              '该分类已被账目引用。停用后将不再出现在记账页，但历史账目中仍会显示。确认停用？',
              [
                { text: '取消', style: 'cancel' },
                {
                  text: '确认停用',
                  style: 'destructive',
                  onPress: () => toggleEnabled(id, false),
                },
              ],
            );
          } else {
            Alert.alert('停用分类', '停用后该分类将不可在记账页选择。确认停用？', [
              { text: '取消', style: 'cancel' },
              {
                text: '确认',
                style: 'destructive',
                onPress: () => toggleEnabled(id, false),
              },
            ]);
          }
        } catch {
          Alert.alert('错误', '操作失败，请重试');
        }
      } else {
        toggleEnabled(id, true);
      }
    },
    [toggleEnabled],
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      {/* Header */}
      <View
        className="flex-row items-center border-b border-zinc-200 bg-white px-4"
        style={{ height: 56 }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          className="h-8 w-8 items-center justify-center"
        >
          <ChevronLeft size={20} color={TEXT_MAIN_COLOR} />
        </TouchableOpacity>
        <Text className="ml-2 text-[17px] font-semibold text-zinc-900">
          分类管理
        </Text>
        <View className="ml-auto">
          <SegmentedControl
            options={['支出', '收入']}
            selectedIndex={typeIndex}
            onChange={handleTypeChange}
          />
        </View>
      </View>

      {/* Body: 左右分栏 */}
      <View className="flex-1 flex-row">
        {/* 左栏：一级分类（140px 固定宽） */}
        <View
          style={{ width: 140, borderRightWidth: 1, borderRightColor: BORDER_COLOR }}
        >
          <PanelHeader title="一级分类" onAdd={openAddL1} />
          <ScrollView showsVerticalScrollIndicator={false}>
            {l1Categories.map((cat) => (
              <L1Item
                key={cat.id}
                category={cat}
                selected={cat.id === selectedL1Id}
                onPress={() => setSelectedL1Id(cat.id)}
                onLongPress={() => handleToggleEnabled(cat.id, cat.enabled)}
              />
            ))}
            {l1Categories.length === 0 && (
              <View className="items-center py-8">
                <Text className="text-[12px] text-zinc-400">暂无分类</Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* 右栏：二级分类（占剩余宽度） */}
        <View className="flex-1">
          <PanelHeader
            title="二级分类"
            onAdd={openAddL2}
            disabled={!selectedL1Id}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            {!selectedL1Id ? (
              <View className="items-center py-8">
                <Text className="text-[13px] text-zinc-400">请先选择左侧分类</Text>
              </View>
            ) : l2Categories.length === 0 ? (
              <View className="items-center py-8">
                <Text className="text-[13px] text-zinc-400">暂无二级分类</Text>
              </View>
            ) : (
              l2Categories.map((sub) => <L2Item key={sub.id} sub={sub} />)
            )}
          </ScrollView>
        </View>
      </View>

      {/* 新增分类抽屉 */}
      <AddCategoryDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        mode={drawerMode}
        initialType={currentType}
        parentCategory={selectedL1 ?? undefined}
        onSaved={loadAllCategories}
      />
    </SafeAreaView>
  );
}
