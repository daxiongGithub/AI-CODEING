import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "./schema";

const sqlite = SQLite.openDatabaseSync("pocketbook.db");

export const db = drizzle(sqlite, { schema });

/**
 * 初始化数据库：建表 + 创建索引（幂等，可重复调用）
 */
export async function initDatabase(): Promise<void> {
  sqlite.execSync(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      name TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT 'folder',
      color_token_bg TEXT NOT NULL,
      color_token_text TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      enabled INTEGER NOT NULL DEFAULT 1,
      is_preset INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  sqlite.execSync(`
    CREATE TABLE IF NOT EXISTS sub_categories (
      id TEXT PRIMARY KEY NOT NULL,
      parent_category_id TEXT NOT NULL REFERENCES categories(id),
      name TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT 'folder',
      sort_order INTEGER NOT NULL DEFAULT 0,
      enabled INTEGER NOT NULL DEFAULT 1
    )
  `);

  sqlite.execSync(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      amount REAL NOT NULL,
      category_id TEXT NOT NULL REFERENCES categories(id),
      sub_category_id TEXT REFERENCES sub_categories(id),
      note TEXT,
      date TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  sqlite.execSync(
    `CREATE INDEX IF NOT EXISTS idx_transaction_date ON transactions(date)`,
  );
  sqlite.execSync(
    `CREATE INDEX IF NOT EXISTS idx_transaction_category ON transactions(category_id)`,
  );
  sqlite.execSync(
    `CREATE INDEX IF NOT EXISTS idx_transaction_type_date ON transactions(type, date)`,
  );
  sqlite.execSync(
    `CREATE INDEX IF NOT EXISTS idx_sub_category_parent ON sub_categories(parent_category_id)`,
  );
}
