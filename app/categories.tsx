import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { ChevronLeft, Plus } from 'lucide-react-native';
import { useCategoryStore } from '@/store/categoryStore';
import { isCategoryInUse } from '@/db/queries';
import type { CategoryWithSubs, CategoryType } from '@/types';
import { SegmentedControl } from '@/components/SegmentedControl';
import { CategoryCard } from '@/components/CategoryCard';
import { AddCategoryDrawer } from '@/components/AddCategoryDrawer';
import { BRAND_COLOR, PRIMARY_BG_COLOR, TEXT_MAIN_COLOR } from '@/constants/colors';

export default function CategoriesScreen() {
  const router = useRouter();
  const {
    allExpenseCategories,
    allIncomeCategories,
    loadAllCategories,
    toggleEnabled,
    isLoading,
  } = useCategoryStore();

  const [typeIndex, setTypeIndex] = useState(0);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const currentType: CategoryType = typeIndex === 0 ? 'expense' : 'income';
  const categories: CategoryWithSubs[] =
    typeIndex === 0 ? allExpenseCategories : allIncomeCategories;

  useEffect(() => {
    loadAllCategories();
  }, [loadAllCategories]);

  const handleToggleEnabled = useCallback(
    async (id: string, currentEnabled: boolean) => {
      if (currentEnabled) {
        // 要停用——检查是否被引用
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
        // 要启用——直接处理
        toggleEnabled(id, true);
      }
    },
    [toggleEnabled],
  );

  return (
    <SafeAreaView className="flex-1 bg-zinc-50" edges={['top', 'bottom']}>
      {/* 标题栏 */}
      <View
        className="flex-row items-center justify-between border-b border-zinc-200 bg-white px-4"
        style={{ height: 56 }}
      >
        {/* 返回按鈕 */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          className="h-[30px] w-[72px] items-center justify-start flex-row"
        >
          <ChevronLeft size={20} color={TEXT_MAIN_COLOR} />
        </TouchableOpacity>

        {/* 标题 */}
        <Text className="text-[17px] font-semibold text-zinc-900">分类管理</Text>

        {/* 新增按鈕 */}
        <View className="w-[72px] items-end">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setDrawerVisible(true)}
            className="h-[30px] flex-row items-center justify-center gap-1 rounded-full px-2.5"
            style={{ backgroundColor: PRIMARY_BG_COLOR }}
          >
            <Plus size={14} color={BRAND_COLOR} />
            <Text style={{ fontSize: 12, fontWeight: '600', color: BRAND_COLOR }}>新增</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 类型 Tab切换 */}
      <View className="items-center bg-white py-3">
        <SegmentedControl
          options={['支出分类', '收入分类']}
          selectedIndex={typeIndex}
          onChange={setTypeIndex}
        />
      </View>

      {/* 说明文字 */}
      <View className="px-4 py-1">
        <Text className="text-[11px] text-zinc-400">
          支持两级分类（一级 / 二级）；已使用分类仅可停用不可删除
        </Text>
      </View>

      {/* 分类列表 */}
      <FlashList
        data={categories}
        keyExtractor={(item) => item.id}
        estimatedItemSize={90}
        renderItem={({ item }) => (
          <View className="px-4 py-1.5">
            <CategoryCard
              category={item}
              onToggleEnabled={handleToggleEnabled}
            />
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-16">
            <Text className="text-[14px] text-zinc-400">
              {isLoading ? '加载中...' : '暂无分类'}
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 8, paddingTop: 4 }}
      />

      {/* 新增分类抽屉 */}
      <AddCategoryDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        initialType={currentType}
        onSaved={loadAllCategories}
      />
    </SafeAreaView>
  );
}
