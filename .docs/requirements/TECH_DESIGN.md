# PocketBook（口袋账本）技术设计文档

> 版本：v1.0 (MVP)
> 日期：2026-03-24
> 状态：待开发
> 关联文档：[PRD.md](./PRD.md) · [RESEARCH.md](./RESEARCH.md) · [PLAN.md](../plan/PLAN.md)

---

## 1. 技术栈总览

| 层级       | 技术选型                          | 版本要求      | 选型理由                                      |
| ---------- | --------------------------------- | ------------- | --------------------------------------------- |
| 框架       | React Native + Expo               | SDK 52+       | 跨端开发，Expo 托管构建流程，降低原生配置成本 |
| 路由       | Expo Router                       | v4+           | 文件式路由，约定优于配置，支持 Tab / Stack    |
| 语言       | TypeScript                        | 5.x           | 类型安全，IDE 智能提示                        |
| 状态管理   | Zustand                           | 5.x           | 轻量无 boilerplate，完美支持 React 并发模式   |
| 本地存储   | expo-sqlite + Drizzle ORM         | expo-sqlite 15+ / drizzle-orm 0.38+ | 结构化查询，类型安全 ORM，零网络依赖 |
| 样式       | NativeWind (Tailwind CSS for RN)  | v4+           | 统一设计语言，原子化样式，与 Web Tailwind 对齐 |
| 图表       | react-native-gifted-charts        | 1.4+          | 纯 JS 实现，无原生依赖，支持饼图/柱状图/折线图 |
| 图标       | lucide-react-native               | latest        | 1685 个矢量图标，与分类体系图标一致           |
| OCR        | react-native-mlkit-ocr            | latest        | 设备端 ML Kit 文字识别，离线可用，隐私友好    |
| 图片选择   | expo-image-picker                 | latest        | 相册/相机统一 API                             |
| 日期处理   | dayjs                             | 1.11+         | 轻量（2KB），链式 API，插件化扩展             |
| ID 生成    | uuid / expo-crypto                | -             | 生成账目/分类唯一 ID                          |
| CSV 导出   | papaparse                         | 5.x           | 轻量 CSV 序列化                               |
| 文件分享   | expo-sharing + expo-file-system   | latest        | 导出文件分享到微信/邮件等                     |

---

## 2. 系统架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────┐
│                    UI Layer                      │
│  Expo Router (Tab / Stack Navigation)           │
│  NativeWind + Lucide Icons                      │
├─────────────────────────────────────────────────┤
│                 State Layer                      │
│  Zustand Stores                                 │
│  ┌──────────────┐  ┌──────────────┐             │
│  │ transaction  │  │  category    │             │
│  │    Store     │  │    Store     │             │
│  └──────┬───────┘  └──────┬───────┘             │
├─────────┼──────────────────┼────────────────────┤
│         │   Data Access    │                     │
│         └────────┬─────────┘                     │
│           db/queries.ts                          │
│           (统一数据操作层)                         │
├─────────────────────────────────────────────────┤
│               Storage Layer                      │
│   expo-sqlite + Drizzle ORM                     │
│   ┌──────────────┐  ┌──────────────┐            │
│   │ transactions │  │  categories  │            │
│   └──────────────┘  └──────────────┘            │
└─────────────────────────────────────────────────┘
         │                          │
  ┌──────┴──────┐          ┌───────┴───────┐
  │  OCR Engine │          │  File System  │
  │  ML Kit     │          │  CSV Export   │
  └─────────────┘          └───────────────┘
```

### 2.2 数据流

```
用户操作 → UI 组件 → Zustand Action → db/queries.ts → SQLite
                                          ↓
                                    Zustand State 更新
                                          ↓
                                    UI 自动重渲染
```

- **单向数据流**：UI → Store → DB → Store → UI
- **所有 DB 操作**必须通过 `db/queries.ts` 统一封装，禁止组件直接操作数据库
- **Store 职责**：缓存查询结果、管理 UI 状态、触发 DB 操作

---

## 3. 数据模型

### 3.1 数据库 Schema（Drizzle ORM）

```typescript
// db/schema.ts
import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';

// ─── 一级分类表 ───
export const categories = sqliteTable('categories', {
  id:             text('id').primaryKey(),
  type:           text('type').notNull(),           // 'income' | 'expense'
  name:           text('name').notNull(),
  icon:           text('icon').notNull().default('folder'),
  colorTokenBg:   text('color_token_bg').notNull(), // e.g. 'orange-100'
  colorTokenText: text('color_token_text').notNull(),// e.g. 'text-orange-500'
  sortOrder:      integer('sort_order').notNull().default(0),
  enabled:        integer('enabled').notNull().default(1),  // 0=停用, 1=启用
  isPreset:       integer('is_preset').notNull().default(0),// 0=自定义, 1=预设
  createdAt:      text('created_at').notNull(),
  updatedAt:      text('updated_at').notNull(),
});

// ─── 二级分类表 ───
export const subCategories = sqliteTable('sub_categories', {
  id:               text('id').primaryKey(),
  parentCategoryId: text('parent_category_id').notNull()
                      .references(() => categories.id),
  name:             text('name').notNull(),
  icon:             text('icon').notNull().default('folder'),
  sortOrder:        integer('sort_order').notNull().default(0),
  enabled:          integer('enabled').notNull().default(1),
});

// ─── 账目表 ───
export const transactions = sqliteTable('transactions', {
  id:              text('id').primaryKey(),
  type:            text('type').notNull(),          // 'income' | 'expense'
  amount:          real('amount').notNull(),
  categoryId:      text('category_id').notNull()
                     .references(() => categories.id),
  subCategoryId:   text('sub_category_id')
                     .references(() => subCategories.id),
  note:            text('note'),                    // 最长 50 字
  date:            text('date').notNull(),           // ISO 8601 日期 'YYYY-MM-DD'
  createdAt:       text('created_at').notNull(),
  updatedAt:       text('updated_at').notNull(),
});
```

### 3.2 索引设计

```typescript
// db/schema.ts (续)
import { index } from 'drizzle-orm/sqlite-core';

// 账目按日期查询（首页列表、统计筛选）
export const idxTransactionDate = index('idx_transaction_date')
  .on(transactions.date);

// 账目按分类统计
export const idxTransactionCategory = index('idx_transaction_category')
  .on(transactions.categoryId);

// 账目按类型+日期（收支统计）
export const idxTransactionTypeDate = index('idx_transaction_type_date')
  .on(transactions.type, transactions.date);

// 二级分类按父分类查询
export const idxSubCategoryParent = index('idx_sub_category_parent')
  .on(subCategories.parentCategoryId);
```

### 3.3 数据约束

| 字段               | 约束                                       |
| ------------------ | ------------------------------------------ |
| `amount`           | > 0，最大 999999.99，最多 2 位小数         |
| `note`             | 可选，最长 50 字符                         |
| `date`             | ISO 8601 格式 `YYYY-MM-DD`                |
| `category.name`    | 1-12 字符，去首尾空格后同类型不可重名      |
| `subCategory.name` | 1-12 字符，去首尾空格后同父节点不可重名    |
| `icon`             | Lucide 图标名字符串，默认 `folder`         |

### 3.4 V2 扩展字段（当前不建表，预留设计）

```
-- V2: 借贷管理
LendingRecord {
  id            TEXT PRIMARY KEY,
  type          TEXT,      -- 'lend_out' | 'borrow_in'
  amount        REAL,
  contactName   TEXT,      -- 借贷对象
  note          TEXT,
  date          TEXT,      -- ISO 8601
  dueDate       TEXT,      -- 到期日
  isPaid        INTEGER,   -- 0 | 1
  createdAt     TEXT,
  updatedAt     TEXT,
}
```

---

## 4. 目录结构

```
PocketBook/
├── app/                           # Expo Router 页面
│   ├── _layout.tsx                # 根布局（全局 Provider、DB 初始化）
│   ├── (tabs)/                    # Tab 导航组
│   │   ├── _layout.tsx            # Tab 导航布局（首页/统计/设置）
│   │   ├── index.tsx              # 首页（日账目列表 + 月度卡片）
│   │   ├── stats.tsx              # 统计页（日/月 Tab，饼图+柱状图）
│   │   └── settings.tsx           # 设置页（货币、导出、关于）
│   ├── add.tsx                    # 手动记账页（Stack Modal）
│   ├── scan.tsx                   # 截图 OCR 记账页
│   └── categories.tsx             # 分类管理页
│
├── components/                    # 可复用组件
│   ├── TransactionItem.tsx        # 账目列表行
│   ├── TransactionList.tsx        # 按日分组的账目列表
│   ├── SummaryCard.tsx            # 月度收支概览卡片
│   ├── CategoryPicker.tsx         # 分类网格选择器（含二级）
│   ├── CategoryItem.tsx           # 单个分类图标项
│   ├── AmountKeyboard.tsx         # 自定义数字键盘
│   ├── ChartCard.tsx              # 图表容器（饼图/柱状图）
│   ├── TypeTabs.tsx               # 收入/支出切换 Tab
│   ├── DateNavigator.tsx          # 日期前后切换控件
│   └── IconPicker.tsx             # Lucide 图标选择器（搜索+网格）
│
├── store/                         # Zustand 状态管理
│   ├── transactionStore.ts        # 账目 CRUD + 列表/统计查询
│   └── categoryStore.ts           # 分类 CRUD + 排序/启停管理
│
├── db/                            # 数据层
│   ├── client.ts                  # expo-sqlite 实例创建 + Drizzle 初始化
│   ├── schema.ts                  # Drizzle 表定义 + 索引
│   ├── queries.ts                 # 统一数据操作函数（CRUD）
│   ├── seed.ts                    # 预设分类初始化数据
│   └── migrations/                # Drizzle 迁移文件（版本升级时）
│
├── utils/                         # 工具函数
│   ├── dateUtils.ts               # 日/周/月/年范围计算
│   ├── formatCurrency.ts          # 金额格式化（¥1,234.56）
│   ├── ocrParser.ts               # OCR 识别结果解析 → 表单字段映射
│   ├── csvExporter.ts             # 账目 → CSV 序列化 + 分享
│   └── validation.ts              # 表单校验规则
│
├── constants/                     # 常量定义
│   ├── colors.ts                  # NativeWind 色值 Token 映射
│   └── presetCategories.ts        # 预设分类常量（18 支出 + 4 收入）
│
├── types/                         # TypeScript 类型
│   └── index.ts                   # 全局类型（Transaction, Category 等）
│
├── assets/                        # 静态资源
│   └── images/                    # 启动图、图标等
│
├── docs/                          # 项目文档（不参与打包）
├── drizzle.config.ts              # Drizzle ORM 配置
├── tailwind.config.js             # NativeWind/Tailwind 配置
├── tsconfig.json                  # TypeScript 配置（strict: true）
├── app.json                       # Expo 应用配置
└── package.json
```

---

## 5. 核心模块设计

### 5.1 数据库初始化与迁移

```typescript
// db/client.ts
import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

const expo = SQLite.openDatabaseSync('pocketbook.db');
export const db = drizzle(expo, { schema });
```

**初始化流程**（在 `app/_layout.tsx` 中执行）：

```
App 启动
  → 打开 / 创建 SQLite 数据库
  → 执行 Drizzle 迁移（createTable if not exists）
  → 检查 categories 表是否为空
    → 空 → 执行 seed.ts 插入 22 条预设分类
  → 标记 DB 就绪，渲染子路由
```

**迁移策略**：
- MVP 阶段使用 `drizzle-orm/migrator` 的 push 模式，直接同步 schema
- V2 及后续版本引入正式迁移文件，保证老用户数据安全升级

### 5.2 数据操作层（db/queries.ts）

所有数据库读写操作统一在此文件封装，Store 和组件禁止直接调用 `db` 实例。

```typescript
// db/queries.ts 核心函数签名

// ─── 账目操作 ───
export async function insertTransaction(data: NewTransaction): Promise<Transaction>;
export async function getTransactionsByDate(date: string): Promise<Transaction[]>;
export async function getTransactionsByDateRange(
  start: string, end: string
): Promise<Transaction[]>;
export async function deleteTransaction(id: string): Promise<void>;
export async function updateTransaction(
  id: string, data: Partial<NewTransaction>
): Promise<void>;

// ─── 统计查询 ───
export async function getSummaryByDateRange(
  start: string, end: string
): Promise<{ totalIncome: number; totalExpense: number }>;
export async function getCategoryBreakdown(
  type: 'income' | 'expense', start: string, end: string
): Promise<Array<{ categoryId: string; categoryName: string; total: number }>>;

// ─── 分类操作 ───
export async function getAllCategories(
  type?: 'income' | 'expense'
): Promise<CategoryWithSubs[]>;
export async function insertCategory(data: NewCategory): Promise<Category>;
export async function insertSubCategory(data: NewSubCategory): Promise<SubCategory>;
export async function updateCategory(
  id: string, data: Partial<NewCategory>
): Promise<void>;
export async function toggleCategoryEnabled(
  id: string, enabled: boolean
): Promise<void>;
export async function isCategoryInUse(id: string): Promise<boolean>;
export async function reorderCategories(
  orderedIds: string[]
): Promise<void>;
```

### 5.3 状态管理（Zustand Store）

#### transactionStore.ts

```typescript
interface TransactionState {
  // 状态
  todayTransactions: Transaction[];
  currentDateTransactions: Transaction[];
  monthlySummary: { totalIncome: number; totalExpense: number; balance: number };

  // 操作
  addTransaction: (data: NewTransaction) => Promise<void>;
  loadTransactionsByDate: (date: string) => Promise<void>;
  loadMonthlySummary: (year: number, month: number) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}
```

#### categoryStore.ts

```typescript
interface CategoryState {
  // 状态
  expenseCategories: CategoryWithSubs[];
  incomeCategories: CategoryWithSubs[];

  // 操作
  loadCategories: () => Promise<void>;
  addCategory: (data: NewCategory, subs?: NewSubCategory[]) => Promise<void>;
  toggleEnabled: (id: string) => Promise<void>;
  updateCategory: (id: string, data: Partial<NewCategory>) => Promise<void>;
  reorder: (type: 'income' | 'expense', orderedIds: string[]) => Promise<void>;
}
```

### 5.4 OCR 识别流程

```
用户选图（相册/相机）
  → expo-image-picker 获取图片 URI
  → react-native-mlkit-ocr 识别文字
  → ocrParser.ts 解析识别结果
      ├─ 提取金额（正则匹配: /[¥￥$]?\s*[\d,]+\.?\d{0,2}/）
      ├─ 提取日期（正则匹配常见日期格式）
      ├─ 提取商户名（取最长非数字行文本）
      └─ 匹配分类（关键词 → categoryId，未匹配 → "其他"）
  → 回填到记账表单（金额、日期、备注、分类）
  → 用户人工审阅修正
  → 确认保存（复用 insertTransaction）
```

**OCR 解析规则 (`utils/ocrParser.ts`)**：

| 字段   | 提取策略                                                    |
| ------ | ----------------------------------------------------------- |
| 金额   | 正则匹配金额模式，取最大数值（排除订单号等长数字串）        |
| 日期   | 匹配 `YYYY-MM-DD`、`YYYY/MM/DD`、`MM月DD日` 等格式         |
| 商户名 | 提取「商户」「收款方」关键词后的文本，或取最长非纯数字行    |
| 分类   | 关键词映射表：`{餐饮: ['餐', '饭', '食'], 交通: ['打车', '地铁']}` |

**降级策略**：
- ML Kit 离线识别失败 → 提示用户手动输入
- 识别结果置信度过低 → 仅填充高置信度字段，其余留空由用户补充

### 5.5 CSV 导出

```typescript
// utils/csvExporter.ts
export async function exportToCSV(
  startDate: string,
  endDate: string
): Promise<void> {
  // 1. 查询日期范围内的全部账目（JOIN 分类名）
  // 2. papaparse 转换为 CSV 字符串
  //    列：日期, 类型, 分类, 二级分类, 金额, 备注
  // 3. expo-file-system 写入临时文件
  // 4. expo-sharing 调用系统分享 Sheet
}
```

CSV 列定义：

| 列名     | 字段            | 说明              |
| -------- | --------------- | ----------------- |
| 日期     | date            | YYYY-MM-DD        |
| 类型     | type            | 收入 / 支出       |
| 一级分类 | categoryName    | 分类中文名        |
| 二级分类 | subCategoryName | 可为空            |
| 金额     | amount          | 保留 2 位小数     |
| 备注     | note            | 可为空            |

---

## 6. 路由与导航设计

### 6.1 导航结构

```
RootLayout (app/_layout.tsx)
├── TabLayout (app/(tabs)/_layout.tsx)
│   ├── Tab: 首页     → (tabs)/index.tsx
│   ├── Tab: 统计     → (tabs)/stats.tsx
│   └── Tab: 设置     → (tabs)/settings.tsx
├── Stack: 记账页     → app/add.tsx         (Modal 模式弹出)
├── Stack: 截图记账   → app/scan.tsx        (Push 进入)
└── Stack: 分类管理   → app/categories.tsx  (Push 进入)
```

### 6.2 底部 Tab 栏

| 位置 | 标签   | 图标         | 路由               |
| ---- | ------ | ------------ | ------------------ |
| 左   | 首页   | `home`       | `(tabs)/index`     |
| 中左 | 统计   | `pie-chart`  | `(tabs)/stats`     |
| 中央 | 记账   | `plus`（FAB）| `add`（Modal）     |
| 中右 | —      | —            | MVP 隐藏，V2 借贷  |
| 右   | 设置   | `settings`   | `(tabs)/settings`  |

- 中央 FAB 按钮点击后弹出选项：「手动记账」/ 「截图记账」
- MVP 阶段 Tab 栏仅显示 3 个 Tab + 中央 FAB

### 6.3 页面间数据传递

| 场景                        | 方式                                          |
| --------------------------- | --------------------------------------------- |
| 首页 → 记账页              | `router.push('/add')`，无需传参               |
| 截图记账 → 记账页          | `router.push('/add?prefill=...')`，URL 参数传 OCR 结果 |
| 记账完成 → 首页            | `router.back()` + Store 自动刷新              |
| 设置 → 分类管理            | `router.push('/categories')`                  |
| 分类管理 → 记账页          | `router.back()` + Store 自动刷新分类列表      |

---

## 7. UI 组件拆分

### 7.1 组件层级划分

采用 **Container / Presentational** 分离模式：

- **页面组件**（`app/` 下）：负责路由、数据加载、Store 订阅
- **容器组件**（如 `TransactionList`）：组合多个展示组件，处理交互逻辑
- **展示组件**（如 `TransactionItem`、`CategoryItem`）：纯 UI 渲染，通过 props 接收数据

### 7.2 核心组件接口

```typescript
// TransactionItem.tsx
interface TransactionItemProps {
  icon: string;           // Lucide 图标名
  iconBgColor: string;    // 背景色 Token
  iconTextColor: string;  // 图标颜色 Token
  categoryName: string;
  note?: string;
  amount: number;
  type: 'income' | 'expense';
}

// CategoryPicker.tsx
interface CategoryPickerProps {
  type: 'income' | 'expense';
  selectedCategoryId?: string;
  selectedSubCategoryId?: string;
  onSelect: (categoryId: string, subCategoryId?: string) => void;
}

// AmountKeyboard.tsx
interface AmountKeyboardProps {
  value: string;          // 当前金额字符串
  onChange: (value: string) => void;
  onConfirm: () => void;
}

// SummaryCard.tsx
interface SummaryCardProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  period: string;         // e.g. "2026年3月"
}

// IconPicker.tsx
interface IconPickerProps {
  selectedIcon: string;
  onSelect: (iconName: string) => void;
}
```

---

## 8. 性能设计

### 8.1 列表性能

- 使用 `FlashList`（`@shopify/flash-list`）替代 `FlatList`，支持大列表高性能渲染
- 首页列表默认加载最近 30 天数据，下拉加载更多（分页 pageSize = 50）
- 列表项固定高度（`estimatedItemSize`），减少布局计算

### 8.2 数据库查询优化

- 高频查询字段建立索引（`date`、`categoryId`、`type+date`）
- 统计查询使用 SQL 聚合函数（`SUM`、`GROUP BY`），避免全量数据加载到内存
- 分类数据启动时一次性加载到 Store 缓存，后续变更时增量更新

### 8.3 启动优化

- 数据库初始化 + 种子数据在 `_layout.tsx` 中用 `SplashScreen.preventAutoHideAsync()` 阻塞
- 完成后调用 `SplashScreen.hideAsync()` 显示首屏
- 目标冷启动时间 < 1.5 秒

### 8.4 内存管理

- 图表组件使用 `React.memo` 避免无关重渲染
- OCR 图片处理完成后立即释放 URI 引用
- 大数据量统计查询在 DB 层完成聚合，不传输原始记录到 JS 侧

---

## 9. 安全与隐私

### 9.1 数据安全

- SQLite 数据库存储在 App 沙盒目录，系统级隔离，其他应用无法访问
- 不使用 AsyncStorage 存储结构化或敏感数据
- CSV 导出文件写入临时目录，分享完成后清理

### 9.2 隐私保护

- **无网络请求**：App 完全离线运行，不收集、不上传任何用户数据
- **最小权限原则**：
  - 仅在 OCR 截图记账时申请相册/相机权限
  - 不申请通讯录、位置、麦克风等无关权限
- OCR 识别完全在设备端执行（ML Kit 本地模型）

### 9.3 输入校验

- 金额校验：正数、≤ 999999.99、最多 2 位小数
- 备注长度：≤ 50 字符
- 分类名称：1-12 字符，去首尾空格后判重
- 防止 SQL 注入：使用 Drizzle ORM 参数化查询，禁止拼接原始 SQL

---

## 10. 预设分类种子数据

### 10.1 数据结构（db/seed.ts）

启动时检查 `categories` 表是否为空，为空则写入以下预设数据：

**支出分类（18 项）**

| name     | icon              | colorTokenBg   | colorTokenText    | sortOrder |
| -------- | ----------------- | -------------- | ----------------- | --------- |
| 餐饮     | utensils          | orange-100     | text-orange-500   | 1         |
| 购物     | shopping-bag      | blue-100       | text-blue-500     | 2         |
| 交通     | bus               | green-100      | text-green-500    | 3         |
| 娱乐     | gamepad-2         | purple-100     | text-purple-500   | 4         |
| 居住     | home              | yellow-100     | text-yellow-600   | 5         |
| 医疗     | heart-pulse       | red-100        | text-red-500      | 6         |
| 教育     | graduation-cap    | indigo-100     | text-indigo-500   | 7         |
| 旅行     | plane             | cyan-100       | text-cyan-500     | 8         |
| 数码     | smartphone        | slate-100      | text-slate-500    | 9         |
| 运动     | dumbbell          | emerald-100    | text-emerald-500  | 10        |
| 宠物     | cat               | amber-100      | text-amber-600    | 11        |
| 水电燃气 | zap               | yellow-100     | text-yellow-600   | 12        |
| 通讯网费 | wifi              | sky-100        | text-sky-500      | 13        |
| 美容美发 | scissors          | pink-100       | text-pink-500     | 14        |
| 汽车养护 | car               | slate-100      | text-slate-500    | 15        |
| 书籍学习 | book-open         | indigo-100     | text-indigo-500   | 16        |
| 亲子宝贝 | baby              | rose-100       | text-rose-500     | 17        |
| 其他     | more-horizontal   | gray-100       | text-gray-500     | 18        |

**收入分类（4 项）**

| name | icon         | colorTokenBg   | colorTokenText    | sortOrder |
| ---- | ------------ | -------------- | ----------------- | --------- |
| 工资 | banknote     | orange-100     | text-orange-500   | 1         |
| 理财 | trending-up  | red-100        | text-red-500      | 2         |
| 兼职 | briefcase    | blue-100       | text-blue-500     | 3         |
| 礼金 | gift         | pink-100       | text-pink-500     | 4         |

---

## 11. 构建与开发环境

### 11.1 开发环境

| 项目         | 要求                         |
| ------------ | ---------------------------- |
| 操作系统     | macOS                        |
| Node.js      | 20 LTS+                     |
| 包管理器     | npm                          |
| Shell        | zsh                          |
| IDE          | VS Code + Expo Tools 扩展   |
| 模拟器       | iOS Simulator (Xcode 16+)   |
| 真机调试     | Expo Go / Development Build |

### 11.2 关键命令

```bash
# 初始化项目
npx create-expo-app PocketBook --template tabs
cd PocketBook

# 安装核心依赖
npm install zustand drizzle-orm expo-sqlite
npm install nativewind tailwindcss
npm install react-native-gifted-charts react-native-svg
npm install lucide-react-native
npm install dayjs papaparse uuid
npm install expo-image-picker expo-sharing expo-file-system
npm install react-native-mlkit-ocr
npm install @shopify/flash-list

# 安装开发依赖
npm install -D drizzle-kit
npm install -D @types/papaparse @types/uuid

# 启动开发
npx expo start

# 生成 Drizzle 迁移
npx drizzle-kit generate

# 类型检查
npx tsc --noEmit
```

### 11.3 TypeScript 配置要求

```jsonc
// tsconfig.json 关键配置
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

## 12. 里程碑技术任务分解

### M1 · 骨架（项目初始化 + 路由 + DB）

| 任务                                     | 产出                        |
| ---------------------------------------- | --------------------------- |
| `create-expo-app` 初始化                 | 项目骨架                    |
| 配置 NativeWind + Tailwind               | 样式系统就绪                |
| 配置 Expo Router Tab 导航                | 3 Tab + 中央 FAB 占位       |
| 配置 expo-sqlite + Drizzle ORM           | DB 连接就绪                 |
| 创建 schema.ts（categories + transactions）| 表结构定义                 |
| 创建 seed.ts + 执行预设分类写入          | 22 条预设分类入库           |
| 验收：`npx expo start` 正常启动 + DB 读写 | ✅                         |

### M2 · 记账核心（手动记账 + 账目列表）

| 任务                                     | 产出                        |
| ---------------------------------------- | --------------------------- |
| 实现 AmountKeyboard 组件                 | 数字键盘 UI                 |
| 实现 CategoryPicker 组件（含二级分类）   | 分类选择网格                |
| 实现 add.tsx 记账页完整流程              | 表单提交 → DB 写入          |
| 实现 TransactionItem + TransactionList   | 首页列表渲染                |
| 实现 SummaryCard 月度概览                | 首页顶部卡片                |
| 实现 transactionStore                    | 状态管理就绪                |
| 验收：完成一笔收支录入并在首页展示       | ✅                         |

### M3 · 统计（月/日图表）

| 任务                                     | 产出                        |
| ---------------------------------------- | --------------------------- |
| 实现统计查询函数（getSummary / getBreakdown）| queries.ts 统计接口      |
| 实现 ChartCard（饼图 + 柱状图）         | 图表渲染组件                |
| 实现 stats.tsx 日/月 Tab 切换            | 统计页完整                  |
| 实现 DateNavigator 日期切换              | 左右翻页切换月份/日期       |
| 验收：统计数据与账目一致，图表正确渲染   | ✅                         |

### M4 · OCR 记账（截图识别 + 人工确认）

| 任务                                     | 产出                        |
| ---------------------------------------- | --------------------------- |
| 集成 expo-image-picker（相册/相机）      | 选图功能                    |
| 集成 react-native-mlkit-ocr              | OCR 识别能力                |
| 实现 ocrParser.ts（金额/日期/商户解析）  | 解析规则                    |
| 实现 scan.tsx 识别确认页                 | OCR → 回填 → 确认 → 保存  |
| 验收：选图 → 识别 → 回填 → 保存 全流程  | ✅                         |

### M5 · 收尾（设置 + 导出 + 分类管理 + 打磨）

| 任务                                     | 产出                        |
| ---------------------------------------- | --------------------------- |
| 实现 csvExporter.ts + 导出分享           | CSV 导出                    |
| 实现 categories.tsx 分类管理页           | 分类增删改查 + 启停         |
| 实现 IconPicker 图标选择器               | 1685 图标搜索选择           |
| 实现 settings.tsx 设置页                 | 货币设置 + 导出入口         |
| 交互打磨（Toast、Loading、防抖等）       | 体验优化                    |
| 验收：全功能可用，交互细节完整           | ✅                         |

---

## 13. 技术风险与应对

| 风险                                  | 影响   | 应对方案                                               |
| ------------------------------------- | ------ | ------------------------------------------------------ |
| ML Kit OCR 对中文支付截图识别率不足   | 高     | 内置关键词正则兜底；降级为纯手动输入；V2 考虑云端 API  |
| NativeWind v4 与 Expo SDK 兼容性问题  | 中     | 锁定已验证版本组合；备选 StyleSheet 手写               |
| Drizzle ORM 在 expo-sqlite 上的兼容性 | 中     | 参考官方 Expo 集成文档；备选直接使用 expo-sqlite raw API |
| react-native-gifted-charts 功能局限   | 低     | 饼图/柱状图已满足 MVP；V2 可切换 Victory Native        |
| 大数据量（>10000 条）性能             | 低     | 分页加载 + FlashList + DB 索引优化                     |

---

## 14. 测试策略

### MVP 阶段

- **手动测试为主**：功能验收依赖模拟器 / 真机手动测试
- **类型检查**：`tsc --noEmit` 作为 CI 门禁
- **关键路径冒烟测试**：
  1. 添加一笔支出 → 首页列表可见
  2. 添加一笔收入 → 月度统计正确
  3. 选图 OCR → 金额回填正确
  4. CSV 导出 → 文件可正常打开

### V2+ 阶段（计划）

- 引入 Jest + React Native Testing Library 进行组件单元测试
- DB 查询函数使用内存 SQLite 进行集成测试
- E2E 测试使用 Maestro

---

## 15. 约定与规范

### 15.1 代码规范

- TypeScript `strict: true`，不允许 `any` 类型
- 组件文件使用 PascalCase 命名（如 `TransactionItem.tsx`）
- 工具函数文件使用 camelCase 命名（如 `dateUtils.ts`）
- 导出函数优先使用命名导出（`export function`），避免默认导出
- 每个组件文件只导出一个主组件

### 15.2 数据访问规范

- **禁止**组件直接 import `db` 实例，必须通过 `db/queries.ts`
- **禁止**使用 AsyncStorage 存储结构化数据（统一使用 SQLite）
- Store 中的异步操作必须处理错误并更新错误状态

### 15.3 Git 规范

- 分支命名：`feat/xxx`、`fix/xxx`、`chore/xxx`
- Commit 格式：`type(scope): message`（如 `feat(add): implement amount keyboard`）
- 每个里程碑完成后打 Tag（`v0.1.0-m1`、`v0.2.0-m2`...）
