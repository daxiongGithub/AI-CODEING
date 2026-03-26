import { ScrollView } from "react-native";
import { CategoryChip } from "./CategoryChip";
import type { CategoryWithSubs } from "@/types";

export interface CategoryRowProps {
  categories: CategoryWithSubs[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
}

/**
 * CategoryRow — 一级分类单行横向滚动列表（V3: h-[68]）
 */
export function CategoryRow(props: CategoryRowProps) {
  const { categories, selectedCategoryId, onSelectCategory } = props;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="max-h-[68px] min-h-[68px] shrink-0"
      contentContainerStyle={{ gap: 8, height: 68, alignItems: "center" }}
    >
      {categories.map((cat) => (
        <CategoryChip
          key={cat.id}
          icon={cat.icon}
          name={cat.name}
          colorTokenBg={cat.colorTokenBg}
          colorTokenText={cat.colorTokenText}
          isSelected={selectedCategoryId === cat.id}
          onPress={() => onSelectCategory(cat.id)}
          size="md"
        />
      ))}
    </ScrollView>
  );
}
