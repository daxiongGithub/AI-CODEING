import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { categories, subCategories, transactions } from "@/db/schema";

export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

export type SubCategory = InferSelectModel<typeof subCategories>;
export type NewSubCategory = InferInsertModel<typeof subCategories>;

export type Transaction = InferSelectModel<typeof transactions>;
export type NewTransaction = InferInsertModel<typeof transactions>;

export type CategoryWithSubs = Category & {
  subCategories: SubCategory[];
};

export type TransactionType = "income" | "expense";
export type CategoryType = "income" | "expense";
