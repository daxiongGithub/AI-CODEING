import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { categories, subCategories, transactions } from "@/db/schema";

/** 一级分类（查询结果模型） */
export type Category = InferSelectModel<typeof categories>;
/** 新建一级分类（插入模型） */
export type NewCategory = InferInsertModel<typeof categories>;

/** 二级分类（查询结果模型） */
export type SubCategory = InferSelectModel<typeof subCategories>;
/** 新建二级分类（插入模型） */
export type NewSubCategory = InferInsertModel<typeof subCategories>;

/** 账目记录（查询结果模型） */
export type Transaction = InferSelectModel<typeof transactions>;
/** 新建账目记录（插入模型） */
export type NewTransaction = InferInsertModel<typeof transactions>;

/** 携带子分类列表的一级分类 */
export type CategoryWithSubs = Category & {
  subCategories: SubCategory[];
};

/** 账目类型：收入 | 支出 */
export type TransactionType = "income" | "expense";
/** 分类类型：收入 | 支出 */
export type CategoryType = "income" | "expense";

/** 账目记录（含分类信息，用于首页列表展示） */
export type TransactionWithCategory = Transaction & {
  categoryName: string;
  categoryIcon: string;
  categoryColorBg: string;
  categoryColorText: string;
  subCategoryName: string | null;
};
