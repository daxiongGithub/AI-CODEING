---
name: generate-code
description: "约束 AI 生成 TypeScript/React Native 代码时必须遵守的风格与模式规范，涵盖：await-to-js 异步错误处理、Prettier 格式化、Props 接收方式、方法注释、自定义 Hook 抽离、import type 排序。适用范围：所有 .ts / .tsx 文件的生成与重构。"
user-invocable: false
metadata:
  triggers:
    - "生成代码"
    - "写代码"
    - "重构"
    - "新建组件"
    - "新建 hook"
    - "create component"
    - "refactor"
---
> 本 skill 约束 AI 在生成代码时必须遵守的风格与模式规范。
> 适用范围：所有 `.ts` / `.tsx` 文件的生成与重构。

---

## 1. 异步错误处理：使用 `await-to-js`

所有 `async/await` + `try/catch` 场景，必须改用 `await-to-js` 的 `to()` 函数，以元组 `[err, result]` 方式处理错误，**禁止嵌套 try/catch**。

```ts
// ✅ 正确
import to from "await-to-js";

const [err, data] = await to(fetchSomething());
if (err) {
  // 处理错误
  return;
}
// 使用 data

// ❌ 禁止
try {
  const data = await fetchSomething();
} catch (e) {
  // ...
}
```

---

## 2. 代码格式化：Prettier

生成代码后必须根据以下规则格式化。优先读取项目根目录 `.prettierrc`，若不存在则使用下方默认规则：

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 90,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSameLine": false,
  "arrowParens": "always"
}
```

---

## 3. 组件 Props：先接收 props 整体，再解构

当组件 props **属性数量 > 2 个**时，必须先用整体 `props` 接收，在函数体内再解构，而不是在参数列表中直接解构。
Props 必须定义为独立的 `interface`。

```tsx
// ✅ 正确（props > 2 个）
interface UserCardProps {
  name: string;
  avatar: string;
  bio: string;
}

export function UserCard(props: UserCardProps) {
  const { name, avatar, bio } = props;
  // ...
}

// ✅ 正确（props ≤ 2 个，可直接解构）
export function Badge({ label }: { label: string }) {
  // ...
}

// ❌ 禁止（props > 2 个时直接解构）
export function UserCard({ name, avatar, bio }: UserCardProps) {
  // ...
}
```

---

## 4. 方法注释：每个方法、变量必须添加一行简短注释

所有生成的函数、方法（包括事件处理器、hooks 内部函数）都必须在定义前加一行 `/** ... */` JSDoc 注释，简短描述用途。

```ts
// ✅ 正确
/** 切换支出/收入类型，重置左栏选中项 */
function handleTypeChange(idx: number) {
  setTypeIndex(idx);
}

/** 打开新增一级分类抽屉 */
function openAddL1() {
  setDrawerMode("add_l1");
  setDrawerVisible(true);
}

// ❌ 禁止（无注释）
function handleTypeChange(idx: number) {
  setTypeIndex(idx);
}
```

---

## 5. 复杂逻辑：封装为自定义 Hook、组件、函数

根据场景选择抽离方式：

| 场景 | 抽离方式 | 存放位置 | 触发条件 |
|------|----------|----------|----------|
| 多个 `useState`/`useEffect`/异步混合 | 自定义 Hook | `./hooks/` | 逻辑复杂，必须抽离 |
| 可复用或结构较长的 JSX | 子组件 | `./components/` | 重复 ≥2 次必须；JSX >150 行建议 |
| 无 Hook 的纯逻辑（格式化/计算/校验） | 工具函数 | `utils/` | 复用 ≥2 次必须；职责单一建议 |

```ts
// ✅ Hook → index.tsx 只保留 JSX
const { typeIndex, handleTypeChange } = useCategoryPage();

// ✅ 子组件 → 页面引用，不内联
<CategoryL1Item key={item.id} {...item} onPress={() => handleSelect(item.id)} />

// ✅ 工具函数 → 调用处不内联实现
const visibleList = filterAndSortCategories(allCategories, "expense");
```

---

## 6. 逻辑清晰：避免过多嵌套的 if/else

禁止出现超过 **2 层**的 `if/else` 嵌套。使用以下策略将逻辑拍平：

### 策略一：提前 return（Guard Clause）

遇到边界条件、错误检查时，**提前 return**，而不是把主逻辑缩进在 `else` 中。

```ts
// ✅ 正确：提前 return，主逻辑不缩进
function processOrder(order: Order | null) {
  if (!order) return;
  if (!order.isPaid) return;
  if (order.items.length === 0) return;

  // 主逻辑在最外层，清晰无缩进
  fulfillOrder(order);
}

// ❌ 禁止：else 嵌套累积
function processOrder(order: Order | null) {
  if (order) {
    if (order.isPaid) {
      if (order.items.length > 0) {
        fulfillOrder(order);
      }
    }
  }
}
```

### 策略二：提取子函数

将复杂的条件分支逻辑提取为独立函数，每个函数只做一件事。

```ts
// ✅ 正确：将分支提取为函数
function getStatusLabel(status: string): string {
  if (status === "active") return "启用";
  if (status === "disabled") return "停用";
  if (status === "pending") return "待审核";
  return "未知";
}

// ❌ 禁止：if/else 链堆砌在调用处
let label;
if (status === "active") {
  label = "启用";
} else if (status === "disabled") {
  label = "停用";
} else if (status === "pending") {
  label = "待审核";
} else {
  label = "未知";
}
```

### 策略三：用对象映射替代 if/else 链

当分支是**枚举值 → 结果**的映射关系时，优先使用对象/Map 代替 `if/else` 或 `switch`。

```ts
// ✅ 正确：对象映射
const STATUS_LABEL: Record<string, string> = {
  active: "启用",
  disabled: "停用",
  pending: "待审核",
};

const label = STATUS_LABEL[status] ?? "未知";

// ❌ 禁止：多层 if/else 枚举判断
```

---

## 7. Import 顺序：`import type` 靠后排列

import 语句分组顺序如下，`import type` 必须排在普通 import 之后（紧贴普通 import 末尾，组内可集中）：

```ts
// 1. React / React Native 核心
import { useState, useCallback } from "react";
import { View, Text } from "react-native";

// 2. 第三方库
import to from "await-to-js";
import clsx from "clsx";

// 3. 项目内部模块（@/ 路径别名）
import { useCategoryStore } from "@/store/categoryStore";
import { isCategoryInUse } from "@/db/queries";
import { Navbar } from "@/components/Navbar";

// 4. import type（靠后，集中在一起）
import type { CategoryWithSubs, CategoryType } from "@/types";
```
