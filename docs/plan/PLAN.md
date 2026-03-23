# 个人记账软件 · 项目规划

> 基于 Vibe Coding 5步流程：Research → PRD → Tech Design → AGENTS.md → Build
> 创建日期：2026-03-23
> 技术栈：React Native + Expo | 本地存储 | Pencil MCP 设计

---

## 一、项目概览

| 属性     | 内容                                   |
| -------- | -------------------------------------- |
| 项目名   | PocketBook（口袋账本）                 |
| 平台     | iOS / Android（Expo 双端）             |
| 存储     | 本地存储（无需服务器）                 |
| 核心目标 | 快速记账、智能识别、借贷管理、多维统计 |

### 项目约束（已确认）

- 团队形态：1人兼职开发
- 周投入：8-12 小时 / 周
- 目标周期：8-12 周
- 发布策略：MVP 先上线核心记账，借贷放入 V2

---

## 二、核心功能模块

### 模块 A：手动记账

- 收入 / 支出 / 借入 / 借出 四类型切换
- 金额输入（数字键盘）
- 分类标签（餐饮、交通、购物、工资等，可自定义）
- 备注 + 日期选择
- 关联联系人（借贷模块）

### 模块 B：截图记账（优先OCR识别，不行就AI 识别）

- 从相册选择截图 / 拍照
- 调用设备端 OCR （备用方案：或调用 AI 接口）识别金额、商家、日期
- OCR 识别结果自动回填到记账表单（金额、日期、商家、备注）
- 识别结果必须人工审阅确认后才能提交保存
- 支持支付宝、微信支付、银行账单等截图

### 模块 C：借入 / 借出管理

- 独立的借贷台账（与普通账目分开展示）
- 记录：金额、对象、日期、备注、还款状态
- 到期提醒 / 手动标记已还
- 统计：未还总额、已还总额

### 模块 D：账目统计

- 维度：年 / 月 / 周 / 日 切换
- 图表：折线图（趋势）、饼图（分类占比）、柱状图（收支对比）
- 指标：收入合计、支出合计、结余、最大支出分类
- 支持按分类、按时间筛选

### 模块 E：基础设置

- 货币单位
- 分类管理（增删改图标）
- 数据导出（CSV）
- 数据备份 / 恢复（本地文件）

---

## 三、五步开发流程 · 执行计划

### Step 1 · 需求研究（Research）

**目标文件**：`docs/requirements/RESEARCH.md`

- [X] 调研主流记账 App：随手记、MoneyMoney、Wallet、Toshl
- [X] 总结差异化优势：截图记账 + 本地隐私 + 极简操作
- [X] 确认核心用户画像：个人理财用户，注重隐私
- [X] 记录功能 Backlog（MVP vs 后续迭代）

**关键产出**：

```
docs/requirements/RESEARCH.md
```

---

### Step 2 · 产品需求文档（PRD）

**目标文件**：`docs/requirements/PRD.md`

#### MVP 功能范围（第一版必须做）

| 优先级 | 功能              | 说明               |
| ------ | ----------------- | ------------------ |
| P0     | 手动记账（收支）  | 核心流程，最先实现 |
| P0     | 账目列表 + 日统计 | 基础展示           |
| P0     | 月统计图表        | 饼图 + 柱状图      |
| P1     | 截图记账（OCR）   | 依赖识别能力       |
| P1     | 数据导出 CSV      | 先满足可查看导出   |
| P2     | 年/周统计         | 扩展维度           |

#### 版本边界（已确认）

- MVP：手动记账、账目列表、日/月统计、截图记账（OCR 回填 + 人工确认）、CSV 导出
- V2：借入/借出管理（借贷记录、还款状态、到期提醒）

#### 界面清单（8 个核心页面）

| 页面           | 路由             | 描述                                          |
| -------------- | ---------------- | --------------------------------------------- |
| 首页 / 日账目  | `/`            | 今日收支卡片 + 流水列表                       |
| 记账页         | `/add`         | 底部弹窗或独立页面                            |
| 截图记账       | `/scan`        | 相机/相册选图 + 识别回填确认                  |
| 统计页         | `/stats`       | 单页 + Tab 切换（日/月/周/年），MVP 先做日/月 |
| 分类管理       | `/categories`  | 查看/新增/编辑/归档分类（从设置页入口进入）   |
| 设置           | `/settings`    | 货币、备份、分类管理入口                      |
| 借贷台账（V2） | `/lending`     | 借入/借出列表                                 |
| 添加借贷（V2） | `/lending/add` | 记录借贷详情                                  |

**关键产出**：

```
docs/requirements/PRD.md
```

---

### Step 2.1 · UI 设计 (UI Design)

**工具要求**：使用 `Pencil MCP` + `skill: pencil-ui-design`
**产出位置**：`docs/design/` 目录

利用 Pencil MCP 和 UI Design Skill，根据 PRD 生成以下核心高保真设计稿 (`.pen` 文件)，确保开发前视觉确认：

| 序号 | 页面          | 设计要素                              |
| ---- | ------------- | ------------------------------------- |
| 1    | 首页 / 日账目 | 顶部余额卡片、账目列表、底部导航Tab   |
| 2    | 记账页        | 金额大字展示、分类Grid、类型切换      |
| 3    | 统计页        | 饼图/柱状图、日期筛选、排行榜         |
| 4    | 截图记账页    | 图片预览区、OCR识别结果表单、确认按钮 |
| 5    | 分类管理/设置 | 列表项、开关、图标库                  |

**关键产出**：

- Pencil 设计文件 (`*.pen`)
- 页面截图 (`docs/design/screenshots`)

---

### Step 3 · 技术设计文档（Tech Design）

**目标文件**：`docs/design/TECH_DESIGN.md`

#### 技术栈确认

| 层       | 技术选型                         | 说明                        |
| -------- | -------------------------------- | --------------------------- |
| 框架     | React Native + Expo SDK 51+      | 跨端，快速迭代              |
| 路由     | Expo Router（文件式路由）        | 符合 Next.js 习惯           |
| 状态管理 | Zustand                          | 轻量，适合本地 App          |
| 本地存储 | expo-sqlite + drizzle-orm        | 结构化查询，类型安全        |
| 图表     | react-native-gifted-charts       | 轻量原生图表                |
| OCR 识别 | expo-camera + Google ML Kit      | 设备端识别优先              |
| 设计稿   | Pencil MCP                       | 在 VS Code 内直接生成设计图 |
| 样式     | NativeWind（TailwindCSS for RN） | 统一设计语言                |
| 图标     | @expo/vector-icons               | 内置丰富图标                |

#### 数据模型（核心表）

```sql
-- 账目表
Transaction {
  id          TEXT PRIMARY KEY,
  type        TEXT,  -- 'income' | 'expense' | 'lend_out' | 'borrow_in'
  amount      REAL,
  categoryId  TEXT,
  note        TEXT,
  date        TEXT,  -- ISO 8601
  contactName TEXT,  -- 借贷对象
  dueDate     TEXT,  -- 借贷到期日
  isPaid      INT,   -- 0 | 1
  createdAt   TEXT
}

-- 分类表
Category {
  id       TEXT PRIMARY KEY,
  name     TEXT,
  icon     TEXT,
  color    TEXT,
  type     TEXT   -- 'income' | 'expense'
}
```

#### 目录结构

```
app/
  (tabs)/
    index.tsx          # 首页（日账目）
    stats.tsx          # 统计页（Tab: 日/月/周/年）
    settings.tsx       # 设置
  add.tsx              # 记账页
  scan.tsx             # 截图记账
  categories.tsx       # 分类管理

  # V2
  lending.tsx          # 借贷台账
  lending/add.tsx      # 添加借贷

components/
  TransactionItem.tsx  # 账目行
  CategoryPicker.tsx   # 分类选择器
  AmountKeyboard.tsx   # 自定义数字键盘
  ChartCard.tsx        # 图表卡片

store/
  transactionStore.ts  # 账目状态
  categoryStore.ts     # 分类状态

db/
  schema.ts            # drizzle 表结构
  queries.ts           # 常用查询函数

utils/
  dateUtils.ts         # 周/月/年范围计算
  formatCurrency.ts    # 金额格式化
  ocrParser.ts         # OCR 结果解析
```

**关键产出**：

```
docs/design/TECH_DESIGN.md
```

---

### Step 4 · AI 代理指令（AGENTS.md）

**目标文件**：`/AGENTS.md`（项目根目录）

要点：

- 声明技术栈与版本约束（Expo SDK、drizzle-orm 版本）
- 规定组件拆分粒度（Container / Presentational 分离）
- 声明类型安全要求（TypeScript strict mode）
- 规定 SQLite 操作必须通过 `db/queries.ts` 统一封装
- 禁止使用 AsyncStorage 存储结构化数据（用 sqlite 替代）
- macOS 环境声明，命令使用 zsh / npm

**关键产出**：

```
AGENTS.md
```

---

### Step 5 · 实现和迭代（Build）

**总里程碑规划**

| 阶段           | 目标                   | 验收标准                                       |
| -------------- | ---------------------- | ---------------------------------------------- |
| M1 · 骨架     | 项目初始化 + 路由 + DB | `npx expo start` 正常启动，DB 能读写         |
| M2 · 记账核心 | 手动记账 + 账目列表    | 能添加收支记录并在列表显示，数据持久化         |
| M3 · 统计     | 月/日图表              | 饼图、柱状图正确渲染，数据与账目一致           |
| M4 · OCR记账  | OCR 回填 + 人工确认    | 选图→识别→回填表单→人工确认→保存全流程通畅 |
| M5 · 收尾     | 设置 + 导出 + 打磨     | CSV 导出可用，交互细节完整                     |
| M6 · V2借贷   | 借入/借出台账          | 借贷记录独立展示，可标记已还                   |

---

## 四、设计图生成计划（Pencil MCP）

在完成 PRD 后，使用 Pencil MCP 依次生成以下页面设计稿，保存至 `docs/design/`：

| 序号 | 页面               | 设计重点                             |
| ---- | ------------------ | ------------------------------------ |
| 1    | 首页 / 日账目      | 顶部余额卡片、账目列表、底部导航     |
| 2    | 记账弹窗           | 金额大字展示、分类格子、类型切换     |
| 3    | 统计页（单页 Tab） | 日/月/周/年切换，MVP 聚焦日/月       |
| 4    | 分类管理           | 分类列表、新增编辑、归档状态         |
| 5    | 截图记账流程       | 选图 → 识别 → 回填表单 → 人工确认 |

**调用指令示例**（在 VS Code 中直接使用 Pencil MCP）：

```
使用 Pencil MCP 创建记账首页设计图：
- 顶部：月度预算卡片（渐变背景，显示收入/支出/结余）
- 中部：账目列表（每行含分类图标、金额、备注）
- 底部：固定导航栏（首页、统计、添加、借贷、设置）
- 右下角：浮动添加按钮（FAB）
- 风格：现代简约，主色调绿色 #10B981
```

---

## 五、下一步行动

按以下顺序执行，每完成一步再进入下一步：

```
1. [x] 生成 docs/requirements/RESEARCH.md
2. [x] 生成 docs/requirements/PRD.md  
3. [x] 执行 Step 2.1：使用 Pencil MCP + skill:pencil-ui-design 生成设计稿
4. [ ] 生成 docs/design/TECH_DESIGN.md
5. [ ] 生成项目根目录 AGENTS.md
6. [ ] 初始化 Expo 项目（M1 里程碑）
```

---

## 六、注意事项

- **隐私优先**：所有数据本地存储，不联网，不上传用户数据
- **截图 OCR**：优先使用设备端识别（ML Kit），降低隐私风险；如效果差再考虑云端 API，需告知用户
- **离线优先**：App 完全离线可用，不依赖网络
- **性能**：账目超过 10000 条时，列表需分页加载
- **存储安全**：SQLite 数据库存储在 App 沙盒内，不暴露外部访问
- **OCR 验收**：金额识别准确率目标 >=95%，识别结果必须回填表单并经过人工确认
- **性能基线**：冷启动 < 3 秒；常规账目列表滚动无明显卡顿

### 分类管理业务规则（MVP）

- 已被账目引用的分类不可硬删除，只允许归档
- 分类支持启用/停用状态，停用后不可用于新建账目
- 同类型分类名称不允许重名（收入与收入不可重名，支出与支出不可重名）
- 分类保留排序字段 `sortOrder`，列表按排序展示

---

## 七、预设分类体系

> 图标库：[Lucide Icons](https://lucide.dev/)，与 NativeWind 配色系统对齐。
> 用户可在「分类管理」页面对以下预设进行增删改，自定义颜色与图标。

### 支出类目（18 项）

| 分类     | Lucide 图标         | 背景色                         | 示例场景                       |
| -------- | ------------------- | ------------------------------ | ------------------------------ |
| 餐饮     | `utensils`        | orange-100 / text-orange-500   | 早餐、午餐、晚餐、外卖、咖啡   |
| 购物     | `shopping-bag`    | blue-100 / text-blue-500       | 服饰、家居、数码配件、电商购物 |
| 交通     | `bus`             | green-100 / text-green-500     | 地铁/公交、打车、停车、加油    |
| 娱乐     | `gamepad-2`       | purple-100 / text-purple-500   | 电影、游戏、演出、KTV          |
| 居住     | `home`            | yellow-100 / text-yellow-600   | 房租、物业、水电维修、家装     |
| 医疗     | `heart-pulse`     | red-100 / text-red-500         | 诊疗、购药、体检、保险缴费     |
| 教育     | `graduation-cap`  | indigo-100 / text-indigo-500   | 学费、课程、资料、培训         |
| 旅行     | `plane`           | cyan-100 / text-cyan-500       | 机票、住宿、餐饮、景点门票     |
| 数码     | `smartphone`      | slate-100 / text-slate-500     | 手机配件、订阅、软件、维修     |
| 运动     | `dumbbell`        | emerald-100 / text-emerald-500 | 健身房、器材、课程、运动装备   |
| 宠物     | `cat`             | amber-100 / text-amber-600     | 饮食、医疗、洗护、用品         |
| 水电燃气 | `zap`             | yellow-100 / text-yellow-600   | 水费、电费、燃气费、取暖费     |
| 通讯网费 | `wifi`            | sky-100 / text-sky-500         | 宽带、手机流量、固话、数字服务 |
| 美容美发 | `scissors`        | pink-100 / text-pink-500       | 发型、护肤、美甲、美容课程     |
| 汽车养护 | `car`             | slate-100 / text-slate-500     | 保养、维修、加油、保险         |
| 书籍学习 | `book-open`       | indigo-100 / text-indigo-500   | 书籍、电子书、课程资料         |
| 亲子宝贝 | `baby`            | rose-100 / text-rose-500       | 尿布、奶粉、玩具、教育用品     |
| 其他     | `more-horizontal` | gray-100 / text-gray-500       | 临时支出、杂项、小额支出       |

### 收入类目（4 项）

| 分类 | Lucide 图标     | 背景色                       | 说明                 |
| ---- | --------------- | ---------------------------- | -------------------- |
| 工资 | `banknote`    | orange-100 / text-orange-500 | 月薪、年终奖、绩效   |
| 理财 | `trending-up` | red-100 / text-red-500       | 基金、股票、利息收益 |
| 兼职 | `briefcase`   | blue-100 / text-blue-500     | 外包、副业、临时工作 |
| 礼金 | `gift`        | pink-100 / text-pink-500     | 红包、人情收入、赠礼 |

### 通用 UI 图标

| 用途         | Lucide 图标   | 说明                           |
| ------------ | ------------- | ------------------------------ |
| 底栏 · 首页 | `home`      | Tab 导航                       |
| 底栏 · 统计 | `pie-chart` | Tab 导航                       |
| 底栏 · 记账 | `plus`      | 中央 FAB 按钮，主色 orange-500 |
| 底栏 · 借贷 | `wallet`    | Tab 导航                       |
| 底栏 · 设置 | `settings`  | Tab 导航                       |
| 截图记账入口 | `scan-line` | 记账页右上角或首页快捷入口     |
