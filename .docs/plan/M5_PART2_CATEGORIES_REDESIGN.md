# M5 第二部分：分类管理页 左右分栏 + 新增抽屉重构

> 对应设计稿：`docs/design/PocketBookV2.pen`
> 涉及屏幕：Categories Screen / Add Category Drawer

---

## 背景与目标

当前分类管理页使用单列 `FlashList` 展示一级分类 + 子分类信息（CategoryCard）。
本次改造目标：

- 一/二级分类改为**左右分栏**，两侧均可独立滚动
- 两栏顶部分别放「添加」按钮；选中一级后方可添加二级（二级可为空）
- 添加二级时，左侧一级面板仅展示、不可切换（通过弹窗内只展示选中一级来实现）
- 「新增分类」抽屉简化为单次单个，根据上下文自适应（一级模式 / 二级模式）

---

## 涉及文件

| 文件 | 操作类型 |
|------|----------|
| `docs/design/PocketBookV2.pen` | 设计稿更新（Categories Screen + Add Category Drawer） |
| `app/categories.tsx` | 全面重构 |
| `components/AddCategoryDrawer.tsx` | 重构（双 mode 自适应） |
| `store/categoryStore.ts` | 新增 `addSubCategory` 方法 |

---

## Phase 1 · 设计稿更新（PocketBookV2.pen）

### 1-A  Categories Screen（id: kLQB4）

将页面主体内容区改为横向两栏：

**布局结构**

```
Screen (375×812)
├── Status Bar (44px)
├── Header (56px) — 返回 + "分类管理" + SegmentedControl(支出/收入)
├── Body (fill_container, direction=horizontal, 无 gap)
│   ├── Left Panel (140px wide, direction=vertical)
│   │   ├── PanelHeader (40px) — "一级分类" label  +  "+" 圆角按钮
│   │   └── L1 List (fill_container, scrollable)
│   │       └── L1Item × N (44px each)：图标圆 + 名称，选中态 primary 背景
│   ├── Divider (1px vertical, $border 色)
│   └── Right Panel (fill_container width, direction=vertical)
│       ├── PanelHeader (40px) — "二级分类" label  +  "+" 圆角按钮（无选中一级则禁用/灰色）
│       └── L2 List (fill_container, scrollable)
│           └── L2Item × N (44px each)：图标圆 + 名称
│           └── EmptyState：无选中一级 → "请先选择左侧分类" / 有选中无二级 → "暂无二级分类"
└── TabBar (TabBar 组件 ref，56px)
```

**L1Item（精简行）**
- 高度 44px，水平 padding 12px
- 左：CategoryIcon 圆（28px）
- 中：分类名称（13px，font-medium，text_main）
- 选中态：背景 `$primary_bg`（橙色浅色），左边 2px `$primary` 色竖条

**L2Item（精简行）**
- 高度 44px，水平 padding 12px
- 左：CategoryIcon 圆（28px）
- 中：名称（13px，text_main）
- 右：停用徽章（enabled=false 时显示）

**PanelHeader**
- 高度 40px，水平 padding 12px，两侧对齐（space_between）
- 左：小标题文字（12px，font-600，text_secondary）
- 右：圆角 "+" pill 按钮（橙色描边/文字，20px 高：padding 水平 8px）

---

### 1-B  Add Category Drawer（id: x3n0V）

将抽屉内容简化为单次单项添加，分两种模式：

**Mode A：新增一级分类（mode = add_l1）**

```
Drawer (375×812, overlay bg, 从底部弹出)
└── Sheet (w=375, h≈480, radius=20, bg=$surface)
    ├── Handle Bar（4×40px，居中，bg=$border，mt=12）
    ├── Title Row（h=52） — "新增一级分类" + X 关闭按钮
    ├── Type Selector Row（py=16） — SegmentedControl（支出分类/收入分类）
    ├── Form Section（px=16, gap=16）
    │   ├── 图标选择器行：圆形图标按钮（点击=打开 IconPicker）+ "点击选择图标" hint
    │   └── 名称输入行：TextInput（placeholder="分类名称，最多12字"）
    ├── Spacer
    └── Save Button（h=48，bg=$primary，text=$on_primary，radius=$radius_lg，mx=16，mb=safe）
        文字：保存
```

**Mode B：新增二级分类（mode = add_l2）**

```
Drawer (375×812, overlay bg)
└── Sheet (w=375, h≈420, radius=20, bg=$surface)
    ├── Handle Bar
    ├── Title Row（h=52） — "添加二级分类" + X 关闭按钮
    ├── Parent Info Row（h=52，mx=16，bg=$secondary，radius=$radius_md）
    │   — 锁定展示一级分类（CategoryIcon 28px + 名称 + 右侧"一级"小 badge）
    ├── Form Section（px=16, gap=16）
    │   ├── 图标选择器行
    │   └── 名称输入行
    ├── Spacer
    └── Save Button（同 Mode A）
```

---

## Phase 2 · store/categoryStore.ts 新增方法

新增 `addSubCategory(parentId: string, subData: NewSubCategoryInput): Promise<void>`

- 调用 `insertSubCategory({ ...subData, parentCategoryId: parentId })`
- 成功后调用 `loadAllCategories()` 刷新列表
- 失败时 `set({ error: '新增二级分类失败' }); throw`

---

## Phase 3 · components/AddCategoryDrawer.tsx 重构

### Props 变更

```typescript
interface AddCategoryDrawerProps {
  visible: boolean;
  onClose: () => void;
  mode: 'add_l1' | 'add_l2';            // 新：决定弹窗内容
  initialType?: CategoryType;            // 仅 add_l1 时有效
  parentCategory?: CategoryWithSubs;    // 仅 add_l2 时需要
  onSaved?: () => void;
}
```

### 内容重构要点

- **移除**：`subItems` 批量子分类列表（`addSubItem / removeSubItem / updateSubName / updateSubIcon` 等）
- **add_l1 mode**：保留 SegmentedControl + 图标 + 名称；保存调用 `addCategory()`（category data only，subList=[]）
- **add_l2 mode**：顶部显示锁定一级分类行（`parentCategory`，只读）；表单只有图标 + 名称；保存调用 `addSubCategory(parentId, {...})`
- **校验**：
  - add_l1：名称非空 + 长度 ≤12 + 同类型不重名
  - add_l2：名称非空 + 长度 ≤12 + 同父节点不重名（与 `parentCategory.subCategories` 比对）
- **动画**：保留现有 `slideAnim` 底部滑入/滑出

---

## Phase 4 · app/categories.tsx 全面重构

### 主要状态变更

```typescript
const [selectedL1Id, setSelectedL1Id] = useState<string | null>(null);
const [drawerMode, setDrawerMode] = useState<'add_l1' | 'add_l2'>('add_l1');
const [drawerVisible, setDrawerVisible] = useState(false);
```

### 布局结构

```tsx
<SafeAreaView>
  {/* Header */}
  <HeaderBar />                   // 返回 + 标题 + SegmentedControl

  {/* Body: 左右分栏 */}
  <View className="flex-1 flex-row">
    {/* 左栏：一级分类 */}
    <View style={{ width: 140 }} className="border-r border-zinc-200">
      <PanelHeader title="一级分类" onAdd={openAddL1} />
      <ScrollView>
        {l1Categories.map(cat => <L1Item ... />)}
      </ScrollView>
    </View>

    {/* 右栏：二级分类 */}
    <View className="flex-1">
      <PanelHeader title="二级分类" onAdd={openAddL2} disabled={!selectedL1Id} />
      <ScrollView>
        {selectedL2Categories.map(sub => <L2Item ... />)}
        {/* empty state */}
      </ScrollView>
    </View>
  </View>

  {/* 新增分类抽屉 */}
  <AddCategoryDrawer
    visible={drawerVisible}
    onClose={closeDrawer}
    mode={drawerMode}
    initialType={currentType}
    parentCategory={selectedL1Category}
    onSaved={loadAllCategories}
  />
</SafeAreaView>
```

### 内联展示组件（仅在此页使用，无需单独文件）

**L1Item**（精简行）
- `TouchableOpacity`，高度 44px，横向排列
- `CategoryIcon`（28px）+ 名称文字
- 选中时：`bg-orange-50` + 左侧 2px `bg-orange-500` 竖条

**L2Item**（精简行）
- `View`，高度 44px，横向排列
- `CategoryIcon`（28px）+ 名称文字
- 若 `enabled=false`：右侧添加「已停用」badge（12px，zinc-400）

### 交互逻辑

| 用户操作 | 响应 |
|---------|------|
| 点击左栏某一级分类 | `setSelectedL1Id(id)` → 右栏自动显示其二级 |
| 点击左栏「+」 | `drawerMode='add_l1'`，`setDrawerVisible(true)` |
| 点击右栏「+」（已选中L1） | `drawerMode='add_l2'`，`setDrawerVisible(true)` |
| 点击右栏「+」（未选中L1） | 不响应（按钮显示为禁用态） |
| 切换支出/收入 SegmentedControl | 清空 `selectedL1Id`，切换分类列表 |
| 长按 L1 行 | Alert → 停用/启用（原有逻辑保留） |
| 长按 L2 行 | （后续可扩展，本次暂不实现） |

---

## Phase 5 · 验收标准

1. 分类管理页显示左右分栏，两栏均可独立滚动
2. 点击左栏一级分类，右栏更新为对应子分类
3. 左栏顶部「+」点击 → 弹出新增一级抽屉（含类型选择）
4. 右栏顶部「+」在未选中一级时灰色不可点
5. 右栏顶部「+」在已选中一级时点击 → 弹出新增二级抽屉（顶部显示选中的一级，锁定）
6. 保存一级分类后，左栏立即刷新，新分类可见
7. 保存二级分类后，右栏立即刷新，新子分类可见
8. 新增抽屉不再有批量子分类列表（旧功能移除）
9. 设计稿 PocketBookV2.pen 中 Categories Screen 和 Add Category Drawer 已更新为新布局

---

## 排除范围（本次不做）

- 长按 L2 行停用/启用（后续迭代）
- L1/L2 拖拽排序
- 编辑已有分类（名称/图标）


## 任务计划

> 说明：每个子任务完成后在 `[x]` 处打勾，并在括号内记录完成日期。
> **执行顺序：T1（设计稿）→ T2（store）→ T3（抽屉组件）→ T4（页面）**
> 设计稿确认通过后，方可开始代码变更。

---

### T1 · docs/design/PocketBookV2.pen 设计稿更新 ⬅ 第一步，必须先完成
- [x] T1-1 更新 Categories Screen（id: kLQB4）为左右分栏布局
- [x] T1-2 更新 Add Category Drawer（id: x3n0V）为双 mode 简化版（移除批量子项列表，增加 Parent Info Row）；新增 Mode B 帧（id: BDqyo，位于 x=2400, y=820）
- [x] T1-3 截图验证两个帧视觉正确，与计划文档描述一致

**验收标准**
- kLQB4 帧可见左右分栏、PanelHeader（含「+」按钮）、L1Item/L2Item、EmptyState 元素
- x3n0V 帧展示 Mode A（含 SegmentedControl，标题「新增一级分类」）和 Mode B（含 Parent Info Row，标题「添加二级分类」）两种状态
- ✅ **通过后方可开始 T2**

---

### T2 · store/categoryStore.ts 新增 `addSubCategory`
- [x] T2-1 在 `db/queries.ts` 确认 `insertSubCategory` 函数签名与参数类型
- [x] T2-2 在 `store/categoryStore.ts` 新增 `addSubCategory(parentId, subData)` action
- [x] T2-3 TypeScript 类型检查通过（`npx tsc --noEmit` 无报错）

**验收标准**
- `addSubCategory` 调用 `insertSubCategory` 写入数据库后，`loadAllCategories()` 重新拉取，store 中该父分类的 `subCategories` 包含新增项
- 失败时 store 的 `error` 字段被赋值，且 `throw` 抛出让调用方可捕获

---

### T3 · components/AddCategoryDrawer.tsx 重构为双模式
- [x] T3-1 修改 Props 接口：新增 `mode`（`'add_l1' | 'add_l2'`）、`parentCategory?`、`onSaved?`；移除旧 `categoryType` prop（由 `initialType` 替代）
- [x] T3-2 移除批量子分类块（`subItems` 状态、`addSubItem`、`removeSubItem`、`updateSubName`、`updateSubIcon` 函数及对应 JSX）
- [x] T3-3 add_l1 mode：保留 SegmentedControl + 图标选择器 + 名称输入；保存调用 `addCategory()`
- [x] T3-4 add_l2 mode：顶部渲染锁定一级分类行（CategoryIcon + 名称 + "一级" badge，只读）；保存调用 `addSubCategory()`
- [x] T3-5 校验逻辑：add_l1 同类型不重名；add_l2 同父节点不重名
- [x] T3-6 动画保留现有 `slideAnim` 底部滑入/滑出
- [x] T3-7 TypeScript 严格模式检查通过

**验收标准**
- 传入 `mode='add_l1'` 时，抽屉标题为「新增一级分类」，含 SegmentedControl，无父分类行
- 传入 `mode='add_l2'` 时，抽屉标题为「添加二级分类」，顶部固定展示 `parentCategory`（不可点击），无 SegmentedControl
- 名称超过 12 字时，保存按钮禁用并提示
- 重名时，点击保存提示错误，不写库
- 保存成功后触发 `onSaved?.()`，抽屉自动关闭

---

### T4 · app/categories.tsx 全面重构为左右分栏
- [x] T4-1 增加本地状态：`selectedL1Id`、`drawerMode`、`drawerVisible`
- [x] T4-2 替换 FlashList 单列布局为 `flex-row` 双栏布局（左宽 140px + 右 flex-1）
- [x] T4-3 实现左栏：PanelHeader（"一级分类"+ 「+」按钮）+ L1 列表（含选中态高亮）
- [x] T4-4 实现右栏：PanelHeader（"二级分类"+ 「+」按钮，disabled 逻辑）+ L2 列表 + EmptyState
- [x] T4-5 切换 SegmentedControl 时清空 `selectedL1Id`
- [x] T4-6 长按 L1 行保留停用/启用 Alert 逻辑
- [x] T4-7 接入重构后的 `AddCategoryDrawer`（传入 `mode`、`parentCategory`、`onSaved`）
- [x] T4-8 移除旧 `CategoryCard` 引用（若已无其他页面使用可保留文件，但此页不再导入）
- [x] T4-9 TypeScript 严格模式检查通过

**验收标准**
- 左栏宽固定 140px，右栏占剩余宽度，两栏均可独立垂直滚动
- 点击左栏行 → 右栏立即更新，选中行有橙色左边框 + 浅橙背景
- 未选中左栏时：右栏显示「请先选择左侧分类」，右栏「+」按钮灰色、不可触发
- 已选中左栏、无二级分类时：右栏显示「暂无二级分类」，右栏「+」按钮正常可点
- 左栏「+」→ 弹出 add_l1 抽屉；右栏「+」（有选中）→ 弹出 add_l2 抽屉
- 保存完毕后列表自动刷新，新增项可见

---

### 整体验收 Checklist

| # | 验收项 | 状态 |
|---|--------|------|
| 1 | T1 设计稿截图通过确认，kLQB4 / x3n0V 两帧已更新 | ✅ |
| 2 | `npx tsc --noEmit` 零报错 | ✅ |
| 3 | 左右分栏在 iPhone 15 模拟器正常渲染 | ⬜ |
| 4 | 点击左栏切换，右栏正确联动 | ⬜ |
| 5 | add_l1 抽屉可保存新一级分类，列表刷新 | ⬜ |
| 6 | add_l2 抽屉显示正确父分类（只读），可保存新二级分类，列表刷新 | ⬜ |
| 7 | 右栏「+」在无选中时不可触发 | ⬜ |
| 8 | 重名校验有效（add_l1 同类型，add_l2 同父节点） | ⬜ |
| 9 | 名称 >12 字时无法保存 | ⬜ |
| 10 | 旧批量子分类 UI 已移除 | ✅ |
