import { useEffect } from "react";
import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import to from "await-to-js";
import * as Crypto from "expo-crypto";

import { useCategoryStore } from "@/store/categoryStore";
import { useTransactionStore } from "@/store/transactionStore";
import { isValidAmount } from "@/utils/formatCurrency";
import { SegmentedControl } from "@/components/SegmentedControl";
import { useAddForm } from "@/components/page-add/useAddForm";
import { AmountDisplay } from "@/components/page-add/AmountDisplay";
import { CategoryRow } from "@/components/page-add/CategoryRow";
import { SubCategoryPanel } from "@/components/page-add/SubCategoryPanel";
import { DatePickerButton } from "@/components/page-add/DatePickerButton";
import { NoteInput } from "@/components/page-add/NoteInput";
import { SaveButton } from "@/components/page-add/SaveButton";

export default function AddScreen() {
  const router = useRouter();
  const { expenseCategories, incomeCategories, loadCategories } = useCategoryStore();
  const { addTransaction, isLoading, error, clearError } = useTransactionStore();
  const form = useAddForm();

  // 首次挂载时加载分类
  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  // 弹窗关闭时清除上一次的错误
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const categories = form.type === "expense" ? expenseCategories : incomeCategories;

  const selectedCategory = categories.find((c) => c.id === form.selectedCategoryId);

  // 含二级分类的一级分类：必须选到子级才能保存
  const needsSub =
    selectedCategory !== undefined && selectedCategory.subCategories.length > 0;

  const canSave =
    isValidAmount(form.parsedAmount) &&
    form.selectedCategoryId !== null &&
    (!needsSub || form.selectedSubCategoryId !== null);

  /** 触发保存并在成功后关闭弹窗 */
  const handleSave = async () => {
    if (!canSave || !form.selectedCategoryId) return;

    const id = Crypto.randomUUID();
    const now = new Date().toISOString();

    const [err] = await to(
      addTransaction({
        id,
        type: form.type,
        amount: form.parsedAmount,
        categoryId: form.selectedCategoryId,
        subCategoryId: form.selectedSubCategoryId ?? null,
        note: form.note.trim() || null,
        date: form.date,
        createdAt: now,
        updatedAt: now,
      }),
    );

    if (!err) {
      form.resetForm();
      router.back();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
      {/* 动态设置 Header 标题为分段选择器 */}
      <Stack.Screen
        options={{
          headerTitle: () => (
            <SegmentedControl
              options={["支出", "收入"]}
              selectedIndex={form.type === "expense" ? 0 : 1}
              onChange={(idx) => form.setType(idx === 0 ? "expense" : "income")}
              width={200}
            />
          ),
        }}
      />

      {/* 
        全页面使用 position 避免挤压 flex 布局。
        - style 和 contentContainerStyle 都设为 flex: 1 保证子元素撑满高度。
        - 聚焦在顶部金额时（不被键盘遮挡），页面不会发生任何位移。
        - 聚焦在底部备注时，整个视图会上推以露出输入框，是最原生的轻量体验。
      */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "position" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        {/* 金额输入 */}
        <AmountDisplay rawAmount={form.rawAmount} onChangeAmount={form.setAmount} />

        {/* catSection：占满剩余高度 */}
        <View className="flex-1 gap-2 px-4 pt-2">
          {/* 一级分类单行横向滚动 */}
          <CategoryRow
            categories={categories}
            selectedCategoryId={form.selectedCategoryId}
            onSelectCategory={form.selectCategory}
          />

          {/* 二级分类面板（flex-1 撑满剩余空间） */}
          {selectedCategory !== undefined &&
            selectedCategory.subCategories.length > 0 && (
              <SubCategoryPanel
                parentCategory={selectedCategory}
                selectedSubCategoryId={form.selectedSubCategoryId}
                onSelectSubCategory={form.selectSubCategory}
              />
            )}
        </View>

        {/* metaSection：始终固定在底部 */}
        <View className="px-4 pt-3 pb-4 gap-[10px]">
          <DatePickerButton date={form.date} onDateChange={form.setDate} />
          <NoteInput value={form.note} onChangeText={form.setNote} />
          <SaveButton
            canSave={canSave}
            isLoading={isLoading}
            onSave={() => void handleSave()}
          />
        </View>
      </KeyboardAvoidingView>

      {/* 错误提示 Toast */}
      {error !== null && (
        <View className="absolute bottom-6 left-4 right-4 bg-red-50 border border-red-200 rounded-xl p-3">
          <Text className="text-[13px] text-red-500 text-center">{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
