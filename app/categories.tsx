import { View, Text, Alert, ScrollView } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import to from "await-to-js";
import { useCategoryStore } from "@/store/categoryStore";
import { isCategoryInUse } from "@/db/queries";
import { SegmentedControl } from "@/components/SegmentedControl";
import { AddCategoryDrawer } from "@/components/page-categories/AddCategoryDrawer";
import { Navbar } from "@/components/Navbar";
import { CategoryL1Item } from "@/components/page-categories/CategoryL1Item";
import { CategoryL2Item } from "@/components/page-categories/CategoryL2Item";
import { CategoryPanelHeader } from "@/components/page-categories/CategoryPanelHeader";
import type { CategoryWithSubs, CategoryType } from "@/types";

/** 分类管理页，支持新增一/二级分类及启用/停用操作 */
export default function CategoriesScreen() {
  const { allExpenseCategories, allIncomeCategories, loadAllCategories, toggleEnabled } =
    useCategoryStore();

  const [typeIndex, setTypeIndex] = useState(0);
  const [selectedL1Id, setSelectedL1Id] = useState<string | null>(null);
  const [drawerMode, setDrawerMode] = useState<"add_l1" | "add_l2">("add_l1");
  const [drawerVisible, setDrawerVisible] = useState(false);

  const currentType: CategoryType = typeIndex === 0 ? "expense" : "income";
  const l1Categories: CategoryWithSubs[] =
    typeIndex === 0 ? allExpenseCategories : allIncomeCategories;
  const selectedL1 = l1Categories.find((c) => c.id === selectedL1Id) ?? null;
  const l2Categories = selectedL1?.subCategories ?? [];

  useEffect(() => {
    loadAllCategories();
  }, [loadAllCategories]);

  /** 切换支出/收入类型，重置左栏选中项 */
  function handleTypeChange(idx: number) {
    setTypeIndex(idx);
    setSelectedL1Id(null);
  }

  /** 打开新增一级分类抽屉 */
  function openAddL1() {
    setDrawerMode("add_l1");
    setDrawerVisible(true);
  }

  /** 打开新增二级分类抽屉，需先选中一级分类 */
  function openAddL2() {
    if (!selectedL1Id) return;
    setDrawerMode("add_l2");
    setDrawerVisible(true);
  }

  /** 切换分类启用/停用，已被账目引用时弹窗二次确认 */
  const handleToggleEnabled = useCallback(
    async (id: string, currentEnabled: boolean) => {
      if (!currentEnabled) {
        toggleEnabled(id, true);
        return;
      }

      const [err, inUse] = await to(isCategoryInUse(id));
      if (err) {
        Alert.alert("错误", "操作失败，请重试");
        return;
      }

      const message = inUse
        ? "该分类已被账目引用。停用后将不再出现在记账页，但历史账目中仍会显示。确认停用？"
        : "停用后该分类将不可在记账页选择。确认停用？";
      const confirmText = inUse ? "确认停用" : "确认";

      Alert.alert("停用分类", message, [
        { text: "取消", style: "cancel" },
        {
          text: confirmText,
          style: "destructive",
          onPress: () => toggleEnabled(id, false),
        },
      ]);
    },
    [toggleEnabled],
  );

  return (
    <View className="flex-1 bg-white">
      <Navbar
        title="分类管理"
        showBorder
        hasBack
        right={
          <SegmentedControl
            options={["支出", "收入"]}
            selectedIndex={typeIndex}
            onChange={handleTypeChange}
          />
        }
      />

      {/* Body: 左右分栏 */}
      <View className="flex-1 flex-row">
        {/* 左栏：一级分类（140px 固定宽） */}
        <View className="border-r border-border" style={{ width: 140 }}>
          <CategoryPanelHeader title="一级分类" onAdd={openAddL1} />
          <ScrollView showsVerticalScrollIndicator={false}>
            {l1Categories.map((cat) => (
              <CategoryL1Item
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
            <SafeAreaView edges={["bottom"]} />
          </ScrollView>
        </View>

        {/* 右栏：二级分类（占剩余宽度） */}
        <View className="flex-1">
          <CategoryPanelHeader
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
              l2Categories.map((sub) => <CategoryL2Item key={sub.id} sub={sub} />)
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
    </View>
  );
}
