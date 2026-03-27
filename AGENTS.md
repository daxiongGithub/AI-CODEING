# AGENTS.md — PocketBook AI 代理开发指令

> 本文件是面向 AI 编码代理（GitHub Copilot、Cursor、Claude 等）的项目级规范约束。
> 在任何代码生成、补全、重构任务前，必须完整阅读并遵守本文件中的所有约定。

---

## 1. 项目概述

| 属性     | 内容                                                                 |
| -------- | -------------------------------------------------------------------- |
| 项目名   | PocketBook（口袋账本）                                               |
| 平台     | iOS / Android（Expo 双端）                                           |
| 核心定位 | 本地优先、隐私至上的个人记账 App                                     |
| 当前阶段 | MVP（手动记账 + OCR 截图记账 + 统计 + CSV 导出）                     |
| 关联文档 | `docs/requirements/PRD.md` · `docs/requirements/TECH_DESIGN.md` |

---

## 2. 开发环境

| 项目     | 要求                        |
| -------- | --------------------------- |
| 操作系统 | macOS                       |
| Shell    | zsh                         |
| 包管理器 | npm（禁止使用 yarn / pnpm） |
| Node.js  | 20 LTS+                     |
| IDE      | VS Code                     |

**所有终端命令必须使用 zsh 语法，使用 npm 运行脚本。**

---

## 3. 技术栈与版本约束

以下版本约束为硬性要求，生成代码时不得使用其他版本的 API 或已废弃的接口。

| 层级       | 技术                            | 版本约束                      |
| ---------- | ------------------------------- | ----------------------------- |
| 框架       | React Native + Expo             | Expo SDK**52+**         |
| 路由       | Expo Router                     | **v4+**（文件式路由）   |
| 语言       | TypeScript                      | **5.x**，strict mode    |
| 状态管理   | Zustand                         | **5.x**                 |
| 本地存储   | expo-sqlite                     | **15+**                 |
| ORM        | drizzle-orm                     | **0.38+**               |
| ORM 迁移   | drizzle-kit                     | dev dependency                |
| 样式       | NativeWind                      | **v4+**（Tailwind CSS） |
| 图表       | react-native-gifted-charts      | **1.4+**                |
| 图标       | lucide-react-native             | latest                        |
| OCR        | react-native-mlkit-ocr          | latest                        |
| 图片选择   | expo-image-picker               | latest                        |
| 高性能列表 | @shopify/flash-list             | latest                        |
| 日期       | dayjs                           | **1.11+**               |
| CSV        | papaparse                       | **5.x**                 |
| 文件分享   | expo-sharing + expo-file-system | latest                        |

> **禁止引入上表之外的第三方状态管理库**（Redux、MobX、Jotai 等）。
> **禁止引入 moment.js**，统一使用 dayjs。

---

## 4. 目录结构约定

代码必须严格遵照以下目录结构，不得随意新增顶层目录：

```
PocketBook/
├── app/                     # Expo Router 页面（路由即文件）
│   ├── _layout.tsx          # 根布局：DB 初始化、全局 Provider
│   ├── (tabs)/              # Tab 导航组
│   │   ├── _layout.tsx      # Tab 布局（首页/统计/设置）
│   │   ├── index.tsx        # 首页（日账目）
│   │   ├── stats.tsx        # 统计页
│   │   └── settings.tsx     # 设置页
│   ├── add.tsx              # 手动记账页（Modal）
│   ├── scan.tsx             # 截图 OCR 记账页
│   └── categories.tsx       # 分类管理页
├── components/              # 可复用 UI 组件
│   ├── IconPickerModal/        # 图标选择弹窗（目录模块）
│   │   ├── hooks/
│   │   │   └── useIconPicker.ts    # 状态、动画、过滤逻辑
│   │   └── index.tsx               # JSX 入口
│   ├── Navbar/                 # 顶部导航栏组件
│   │   └── index.tsx
│   ├── page-categories/        # 分类管理页专属组件
│   │   ├── AddCategoryDrawer.tsx   # 新建/编辑分类抽屉容器（表单、校验、提交回调）
│   │   ├── CategoryCard.tsx        # 分类展示卡片（图标、名称、快捷操作）
│   │   ├── CategoryIcon.tsx        # 分类图标展示组件（统一渲染与样式）
│   │   ├── CategoryL1Item.tsx      # 一级分类列表项（左侧列表）
│   │   ├── CategoryL2Item.tsx      # 二级分类列表项（右侧面板）
│   │   └── CategoryPanelHeader.tsx # 分类面板标题栏
│   ├── SegmentedControl.tsx    # 分段控制器（用于切换视图或筛选）
│   └── IconCell.tsx        # 图标网格单元格（纯展示）
├── store/                   # Zustand Store
│   ├── transactionStore.ts  # 账目状态与本地操作存储
│   └── categoryStore.ts     # 分类状态与本地操作存储
├── db/                      # 数据层（唯一可操作数据库的目录）
│   ├── client.ts            # expo-sqlite 实例 + Drizzle 初始化
│   ├── schema.ts            # 表定义与索引
│   ├── queries.ts           # 全部数据操作函数（唯一出口）
│   ├── seed.ts              # 预设分类种子数据
│   └── migrations/          # Drizzle 迁移文件
├── utils/                   # 纯函数工具
│   ├── dateUtils.ts         # 日期相关工具：获取今日/昨日、格式化日期、月份范围等（用于 UI 标签与查询）
│   └── formatCurrency.ts    # 金额格式化与解析：货币显示、字符串解析、合法性校验
├── constants/               # 常量（颜色 Token、预设分类）
├── types/                   # 全局 TypeScript 类型
├── assets/                  # 静态资源
├── docs/                    # 项目文档（不参与打包）
│   ├── design/              # 设计稿相关
│   ├── plan/                # 计划与里程碑
│   └── requirements/        # 需求与技术设计
├── ios/                     # iOS 原生工程目录
├── app.json                 # Expo 应用配置（图标、包名、权限等）
├── babel.config.js          # Babel 编译配置（NativeWind 等插件）
├── drizzle.config.ts        # Drizzle ORM 配置（数据库迁移路径等）
├── global.css               # 全局样式（NativeWind）
├── metro.config.js          # Metro 打包配置（支持 Tailwind 及 SVG）
├── package.json             # 项目依赖与 npm 脚本
├── tailwind.config.js       # Tailwind CSS 配置文件
└── tsconfig.json            # TypeScript 编译配置（严格模式等）
```

---

## 5. 强制规范（必须遵守）

### 5.1 数据库访问规范

- **【禁止】** 在 `app/`、`components/`、`store/` 中直接 import `db` 实例（来自 `db/client.ts`）。
- **【要求】** 所有数据库读写操作**必须**通过 `db/queries.ts` 中的函数完成。
- **【禁止】** 拼接原始 SQL 字符串；统一使用 Drizzle ORM 的类型安全查询 API。
- **【禁止】** 使用 `AsyncStorage` 存储任何结构化/业务数据，统一使用 SQLite。
- `AsyncStorage` 仅允许存储极简的 UI 偏好（如货币符号设置），且必须备注说明原因。

```typescript
// ✅ 正确：通过 queries.ts 访问数据
import { insertTransaction } from '@/db/queries';

// ❌ 错误：直接使用 db 实例
import { db } from '@/db/client';
db.insert(transactions).values(...)
```

### 5.2 TypeScript 规范

- `tsconfig.json` 必须开启 `"strict": true`，不得关闭或降级。
- **禁止使用 `any` 类型**。如需动态类型，使用 `unknown` 并做类型收窄。
- 禁止使用 `@ts-ignore`，如遇类型问题须修正类型定义而非忽略。
- 禁止使用 `@ts-expect-error`，除非有精确的注释说明场景。
- 所有函数参数和返回值必须有明确类型标注（可借助推断，但不可省略关键类型）。

```typescript
// ✅ 正确
export async function getTransactionsByDate(date: string): Promise<Transaction[]> { ... }

// ❌ 错误
export async function getTransactionsByDate(date: any) { ... }
```

### 5.3 组件拆分规范

采用 **Container / Presentational 分离**模式：

| 类型     | 位置            | 职责                                                      |
| -------- | --------------- | --------------------------------------------------------- |
| 页面组件 | `app/`        | 路由、数据加载、Store 订阅，**不包含复杂 JSX 结构** |
| 容器组件 | `components/` | 组合展示组件，处理交互回调逻辑                            |
| 展示组件 | `components/` | 纯 UI，**只通过 props 接收数据**，不直接访问 Store  |

```typescript
// ✅ 展示组件：只接收 props，无副作用
export function TransactionItem({ icon, amount, categoryName }: TransactionItemProps) {
  return <View>...</View>;
}

// ❌ 错误：展示组件内直接调用 store/db
export function TransactionItem({ id }: { id: string }) {
  const tx = useTransactionStore(s => s.find(id)); // 不允许
}
```

### 5.4 命名规范

| 类型         | 命名规则               | 示例                             |
| ------------ | ---------------------- | -------------------------------- |
| 组件文件     | PascalCase             | `TransactionItem.tsx`          |
| 工具函数文件 | camelCase              | `dateUtils.ts`                 |
| Store 文件   | camelCase + Store 后缀 | `transactionStore.ts`          |
| 类型/接口    | PascalCase             | `Transaction`, `NewCategory` |
| 常量         | SCREAMING_SNAKE_CASE   | `MAX_AMOUNT`, `DEFAULT_ICON` |
| 自定义 Hook  | use 前缀 + PascalCase  | `useTransactions()`            |

### 5.5 导出规范

- 优先使用**命名导出**（`export function`、`export const`）。
- 每个组件文件只导出**一个主组件**（工具文件可多导出）。
- 禁止在组件文件中使用 `export default`（Expo Router 页面文件除外）。

```typescript
// ✅ 正确（工具/组件文件）
export function formatCurrency(amount: number): string { ... }

// ✅ 正确（Expo Router 页面，必须默认导出）
export default function HomeScreen() { ... }
```

### 5.6 样式规范

- 使用 **NativeWind（Tailwind CSS）** 类名编写样式，禁止在业务组件中使用 `StyleSheet.create`。
- 颜色 Token 统一来自 `constants/colors.ts`，禁止在组件中硬编码十六进制颜色值。
- 主色调为橙色系：`orange-500`（`#f97316`）作为品牌主色。

```tsx
// ✅ 正确：NativeWind 类名
<View className="flex-1 bg-white px-4 py-3">

// ❌ 错误：硬编码颜色
<View style={{ backgroundColor: '#f97316', padding: 12 }}>
```

---

## 6. 关键业务规则

### 6.1 金额约束

- 金额必须为正数（`amount > 0`）。
- 最大单笔金额：`999999.99`。
- 保留最多 2 位小数。
- 金额为 0 或为空时，保存按钮必须禁用，不得写入数据库。

### 6.2 分类规则

- 分类分为**一级分类**和**二级分类**两级，不支持三级。
- 若选中的一级分类存在二级分类，用户**必须选择到二级分类**才能保存账目。
- 若一级分类无二级分类，则一级分类本身为最终分类。
- **已被账目引用的分类不可物理删除**，只允许停用（`enabled = 0`）。
- 停用的分类在记账页**不可选择**，但已有历史账目中的分类名称和图标仍正常显示。
- 同类型下（income/expense）一级分类名称不可重复。
- 同父节点下二级分类名称不可重复。
- 分类名称长度：1-12 字符，去首尾空格后判重。

### 6.3 OCR 流程规则

- OCR 识别结果**必须**回填到可编辑表单，不得直接写入数据库。
- 用户必须主动点击「确认保存」后才能入库。
- OCR 失败时降级为手动输入，不得崩溃或阻塞用户。

### 6.4 数据隐私规则

- **禁止**任何形式的网络请求（除非用户明确授权 OCR 云端降级）。
- **禁止**访问通讯录、位置、麦克风等无关权限。
- 仅在用户主动触发截图记账时申请相册/相机权限。

---

## 7. 性能要求

| 指标         | 目标值                                |
| ------------ | ------------------------------------- |
| 冷启动时间   | < 1.5 秒（生产包）                    |
| 列表滚动     | 1000 条以下无卡顿                     |
| 分页加载     | 超过 1000 条必须分页（pageSize = 50） |
| OCR 识别耗时 | 目标 < 3 秒，过程显示 Loading         |

- 列表组件必须使用 `@shopify/flash-list` 的 `FlashList`，禁止使用原生 `FlatList`（大列表场景）。
- 图表组件必须用 `React.memo` 包裹，避免父组件无关更新触发重渲染。
- 统计查询必须在 DB 层用 SQL 聚合完成，禁止将原始记录全量加载到 JS 侧再计算。

---

## 8. 错误处理规范

- 所有 `async` 函数必须使用 `await-to-js` 的 `to()` 函数处理错误，**禁止使用 `try/catch`**。
- 错误不得静默吞掉，必须更新 Store 中的 `error` 状态。
- DB 操作失败时，必须更新 Store 中的 `error` 状态，并在 UI 层显示 Toast 提示。
- 网络不可用时（OCR 云端降级场景）必须给用户明确提示，并提供手动输入出口。

```typescript
// ✅ 正确：await-to-js + guard clause
import to from "await-to-js";

async function addTransaction(data: NewTransaction) {
  set({ isLoading: true });
  const [err] = await to(insertTransaction(data));
  if (err) {
    set({ error: "保存失败，请重试", isLoading: false });
    return;
  }
  set({ transactions: [...], isLoading: false });
}

// ❌ 禁止：try/catch
async function addTransaction(data: NewTransaction) {
  try {
    await insertTransaction(data);
  } catch (e) {
    set({ error: "保存失败，请重试" });
  }
}
```

---

## 9. 禁止事项速查

| 编号 | 禁止行为                                             |
| ---- | ---------------------------------------------------- |
| B-01 | 在非 `db/queries.ts` 文件中直接操作 `db` 实例    |
| B-02 | 使用 `AsyncStorage` 存储账目、分类等结构化业务数据 |
| B-03 | 使用 `any` 类型                                    |
| B-04 | 在展示组件中直接访问 Store 或数据库                  |
| B-05 | 拼接原始 SQL 字符串（存在 SQL 注入风险）             |
| B-06 | 在组件中硬编码颜色十六进制值                         |
| B-07 | 使用 `moment.js`                                   |
| B-08 | 使用 Redux、MobX 等其他状态管理库                    |
| B-09 | 使用 `yarn` 或 `pnpm`；统一使用 `npm`          |
| B-10 | 发起任何网络请求（OCR 降级场景除外，且需用户授权）   |
| B-11 | 在没有确认弹窗的情况下物理删除已被引用的分类         |
| B-12 | 金额为 0 或空时写入数据库                            |

---

## 10. 常用命令参考

```bash
# 启动开发服务器
npx expo start

# iOS 模拟器
npx expo run:ios

# Android 模拟器
npx expo run:android

# TypeScript 类型检查
npx tsc --noEmit

# 生成 Drizzle 迁移文件
npx drizzle-kit generate

# 推送 Schema 变更（开发阶段）
npx drizzle-kit push

# 安装依赖
npm install

# 清理缓存重启
npx expo start --clear
```

---

## 11. 里程碑与验收标准

| 里程碑     | 验收标准                                                      |
| ---------- | ------------------------------------------------------------- |
| M1 · 骨架 | `npx expo start` 正常启动；DB 初始化成功；22 条预设分类入库 |
| M2 · 记账 | 完成一笔收支录入，首页列表可见该数据，重启后数据持久化        |
| M3 · 统计 | 统计页饼图/柱状图正确渲染，数据与首页账目一致                 |
| M4 · OCR  | 选图 → 识别 → 回填 → 人工确认 → 保存全流程通畅            |
| M5 · 收尾 | CSV 导出可用；分类管理完整；交互细节（Toast/Loading）完整     |

---

## 12. 文档索引

| 文档                                 | 说明                                   |
| ------------------------------------ | -------------------------------------- |
| `docs/requirements/RESEARCH.md`    | 竞品调研与差异化分析                   |
| `docs/requirements/PRD.md`         | 产品需求文档（功能详细定义）           |
| `docs/requirements/TECH_DESIGN.md` | 技术设计文档（架构/数据模型/组件设计） |
| `docs/plan/PLAN.md`                | 项目整体规划与进度跟踪                 |
