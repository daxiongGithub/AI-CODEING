import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";

// ─── 一级分类表 ───
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  type: text("type").notNull().$type<"income" | "expense">(),
  name: text("name").notNull(),
  icon: text("icon").notNull().default("folder"),
  colorTokenBg: text("color_token_bg").notNull(),
  colorTokenText: text("color_token_text").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  isPreset: integer("is_preset", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ─── 二级分类表 ───
export const subCategories = sqliteTable("sub_categories", {
  id: text("id").primaryKey(),
  parentCategoryId: text("parent_category_id")
    .notNull()
    .references(() => categories.id),
  name: text("name").notNull(),
  icon: text("icon").notNull().default("folder"),
  sortOrder: integer("sort_order").notNull().default(0),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
});

// ─── 账目表 ───
export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  type: text("type").notNull().$type<"income" | "expense">(),
  amount: real("amount").notNull(),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
  subCategoryId: text("sub_category_id").references(() => subCategories.id),
  note: text("note"),
  date: text("date").notNull(), // YYYY-MM-DD
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
