# M5 第一部分：设置页 + 分类管理实现计划

> 对应设计稿：`docs/design/PocketBook.pen`
> Settings Screen / Categories Screen / Add Category Drawer / Icon Picker

---

## 任务清单

### Step 1 · `constants/icons.ts`
- 创建 Lucide 图标名（连字符格式）→ 组件的静态 Map（约 80 个常用图标）
- 按分类分组：`ALL / 通用 / 财务 / 餐饮 / 出行 / 购物 / 生活 / 其他`
- 导出 `ICON_MAP`、`ICON_GROUPS`、`ALL_ICON_NAMES`

### Step 2 · `components/CategoryIcon.tsx`  ← **展示组件**
- Props: `iconName`, `bgToken`, `textToken`, `size?`, `circleSize?`, `selected?`
- 圆形背景（颜色来自 `BG_TOKEN_MAP`）+ Lucide 图标（颜色来自 `TEXT_TOKEN_MAP`）
- `selected=true` 时加 2px brand 色边框

### Step 3 · `components/SegmentedControl.tsx`  ← **展示组件**
- Props: `options: string[]`, `selectedIndex`, `onChange`
- 高度 34，内边距 3，激活项白色背景 + 阴影，非激活项透明
- 字号 13，激活色 `text-orange-500`，非激活色 `text-zinc-500`
- 可选 `width` 属性（默认 220）

### Step 4 · `db/queries.ts` 追加
- 新增 `getAllCategoriesAll(type?)` — 返回所有分类（含已停用），供分类管理页使用

### Step 5 · `store/categoryStore.ts` 更新
- 新增 `allExpenseCategories: CategoryWithSubs[]`、`allIncomeCategories: CategoryWithSubs[]`
- 新增 `loadAllCategories()` 方法（调用 `getAllCategoriesAll`）
- 新增 `addCategoryWithSubs(categoryData, subList)` 方法（原子创建一级+子分类）

### Step 6 · `components/CategoryCard.tsx`  ← **展示组件**
- Props: `category: CategoryWithSubs`, `onToggleEnabled`
- 卡片结构：图标圈 + 名称/子分类数量 + 启用/已停用 Badge
- 子分类名称拼接展示（"二级分类：早餐 / 午餐 / 晚餐"）
- 停用卡片背景降至 `bg-gray-50`

### Step 7 · `components/IconPickerModal.tsx`  ← **容器组件（仅内部状态）**
- Props: `visible`, `selectedIcon`, `onConfirm(iconName)`, `onClose`
- 底部弹出 Modal（`animationType="slide"`），高度 680
- 搜索框（TextInput 过滤图标名）
- 水平 Chip 过滤器（全部 / 通用 / 财务 / 餐饮 / 出行 / 购物 / 生活）
- 4 列图标网格（FlashList）+ 每格显示圆形图标 + 名称
- 底部预览 + 确认按钮

### Step 8 · `components/AddCategoryDrawer.tsx`  ← **容器组件（使用 Store）**
- Props: `visible`, `onClose`, `initialType?: CategoryType`, `onSaved?()`
- 底部弹出 Modal，高度 ~680
- 类型切换（`SegmentedControl`）
- 一级分类：图标按钮（点击打开 `IconPickerModal`）+ 名称输入框
- 子分类列表：可动态增删的行（最多 10 条），每行同样有图标选择 + 名称输入
- 颜色自动循环分配（12 种预设 token pair）
- 保存按钮：校验名称非空 → 调用 `store.addCategoryWithSubs()` → Toast → 回调关闭

### Step 9 · `app/(tabs)/settings.tsx`
- 页面标题 "设置"（headerStyle = `$surface`，白色背景，1px 下边框）
- 菜单列表卡片（圆角 12，1px 边框）：
  - 分类管理 → `router.push('/categories')`（橙色图标背景 32px）
  - 提醒设置 → 暂不实现（蓝色图标背景，chevron）
  - 导出数据 → 暂不实现（绿色图标背景，chevron）
- 版本号区块（居中，灰色小字）

### Step 10 · `app/categories.tsx`
- Header：返回按钮（`router.back()`）+ "分类管理" + 右侧 "新增" pill 按钮
- 类型 SegmentedControl（支出分类 / 收入分类，宽 220）
- 规则提示小文字
- FlashList 展示 `allExpense/IncomeCategories`（`CategoryCard`）
- 长按卡片 → 弹 Alert：「停用」/ 「启用」按钮
  - 若分类被引用则给确认提示（调用 `isCategoryInUse`）
- 底部 `AddCategoryDrawer`

---

## 颜色 Token 说明

| 设计变量 | 实际色值 | NativeWind 类 |
|---------|---------|--------------|
| `$primary` | `#F97316` | `text-orange-500` |
| `$primary_bg` | `#FFF7ED` | `bg-orange-50` |
| `$background` | `#FAFAFA` | `bg-zinc-50` |
| `$surface` | `#FFFFFF` | `bg-white` |
| `$border` | `#E4E4E7` | `border-zinc-200` |
| `$text_main` | `#18181B` | `text-zinc-900` |
| `$text_secondary` | `#71717A` | `text-zinc-500` |
| `$bg_input` | `#F9FAFB` | `bg-gray-50` |
| `$success` | `#10B981` | `text-emerald-500` |
| `$danger` | `#EF4444` | `text-red-500` |

---

## 验收标准

- [x] 设置页正常显示三个菜单项，点击「分类管理」可跳转
- [x] 分类管理页支出/收入 Tab 切换，展示所有分类（含停用）
- [x] 点击停用分类 Badge 弹确认框，确认后状态变更
- [x] 新增分类抽屉可完整填写并保存一级 + 多个子分类
- [x] 图标选择器可搜索过滤，4 列展示，确认回填
- [x] `npx tsc --noEmit` 无类型错误
