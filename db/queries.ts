import { eq, desc, and, between, sum } from "drizzle-orm";
import { db } from "./client";
import { categories, subCategories, transactions } from "./schema";
import type {
  Category,
  NewCategory,
  SubCategory,
  NewSubCategory,
  Transaction,
  NewTransaction,
  CategoryWithSubs,
} from "@/types";

// ─── 账目操作 ───

export async function insertTransaction(
  data: NewTransaction,
): Promise<Transaction> {
  const result = await db.insert(transactions).values(data).returning();
  const row = result[0];
  if (!row) throw new Error("Insert transaction failed");
  return row;
}

export async function getTransactionsByDate(
  date: string,
): Promise<Transaction[]> {
  return db
    .select()
    .from(transactions)
    .where(eq(transactions.date, date))
    .orderBy(desc(transactions.createdAt));
}

export async function getTransactionsByDateRange(
  start: string,
  end: string,
): Promise<Transaction[]> {
  return db
    .select()
    .from(transactions)
    .where(between(transactions.date, start, end))
    .orderBy(desc(transactions.date), desc(transactions.createdAt));
}

export async function deleteTransaction(id: string): Promise<void> {
  await db.delete(transactions).where(eq(transactions.id, id));
}

export async function updateTransaction(
  id: string,
  data: Partial<NewTransaction>,
): Promise<void> {
  await db
    .update(transactions)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(transactions.id, id));
}

// ─── 统计查询 ───

export async function getSummaryByDateRange(
  start: string,
  end: string,
): Promise<{ totalIncome: number; totalExpense: number }> {
  const rows = await db
    .select({
      type: transactions.type,
      total: sum(transactions.amount),
    })
    .from(transactions)
    .where(between(transactions.date, start, end))
    .groupBy(transactions.type);

  let totalIncome = 0;
  let totalExpense = 0;
  for (const row of rows) {
    if (row.type === "income") totalIncome = Number(row.total ?? 0);
    if (row.type === "expense") totalExpense = Number(row.total ?? 0);
  }
  return { totalIncome, totalExpense };
}

export async function getCategoryBreakdown(
  type: "income" | "expense",
  start: string,
  end: string,
): Promise<Array<{ categoryId: string; categoryName: string; total: number }>> {
  const rows = await db
    .select({
      categoryId: transactions.categoryId,
      categoryName: categories.name,
      total: sum(transactions.amount),
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(eq(transactions.type, type), between(transactions.date, start, end)),
    )
    .groupBy(transactions.categoryId, categories.name);

  return rows.map((r) => ({
    categoryId: r.categoryId,
    categoryName: r.categoryName,
    total: Number(r.total ?? 0),
  }));
}

// ─── 分类操作 ───

export async function getAllCategories(
  type?: "income" | "expense",
): Promise<CategoryWithSubs[]> {
  const cats = await db
    .select()
    .from(categories)
    .where(
      type
        ? and(eq(categories.type, type), eq(categories.enabled, true))
        : eq(categories.enabled, true),
    )
    .orderBy(categories.sortOrder);

  const subs = await db
    .select()
    .from(subCategories)
    .where(eq(subCategories.enabled, true))
    .orderBy(subCategories.sortOrder);

  return cats.map((cat) => ({
    ...cat,
    subCategories: subs.filter((s) => s.parentCategoryId === cat.id),
  }));
}

export async function insertCategory(data: NewCategory): Promise<Category> {
  const result = await db.insert(categories).values(data).returning();
  const row = result[0];
  if (!row) throw new Error("Insert category failed");
  return row;
}

export async function insertSubCategory(
  data: NewSubCategory,
): Promise<SubCategory> {
  const result = await db.insert(subCategories).values(data).returning();
  const row = result[0];
  if (!row) throw new Error("Insert subCategory failed");
  return row;
}

export async function updateCategory(
  id: string,
  data: Partial<NewCategory>,
): Promise<void> {
  await db
    .update(categories)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(categories.id, id));
}

export async function toggleCategoryEnabled(
  id: string,
  enabled: boolean,
): Promise<void> {
  await db
    .update(categories)
    .set({ enabled, updatedAt: new Date().toISOString() })
    .where(eq(categories.id, id));
}

export async function isCategoryInUse(id: string): Promise<boolean> {
  const rows = await db
    .select({ id: transactions.id })
    .from(transactions)
    .where(eq(transactions.categoryId, id))
    .limit(1);
  return rows.length > 0;
}

export async function reorderCategories(orderedIds: string[]): Promise<void> {
  const now = new Date().toISOString();
  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(categories)
        .set({ sortOrder: index + 1, updatedAt: now })
        .where(eq(categories.id, id)),
    ),
  );
}

/**
 * 获取所有分类（含已停用），供分类管理页使用。
 * 与 getAllCategories 的区别：不过滤 enabled 字段。
 */
export async function getAllCategoriesAll(
  type?: "income" | "expense",
): Promise<CategoryWithSubs[]> {
  const cats = await db
    .select()
    .from(categories)
    .where(type ? eq(categories.type, type) : undefined)
    .orderBy(categories.sortOrder);

  const subs = await db
    .select()
    .from(subCategories)
    .orderBy(subCategories.sortOrder);

  return cats.map((cat) => ({
    ...cat,
    subCategories: subs.filter((s) => s.parentCategoryId === cat.id),
  }));
}
