---
applyTo: "**"
---
# PocketBook — GitHub Copilot 全局指令

> 本文件由 GitHub Copilot 自动读取，适用于当前工作区的所有对话。
> 完整的项目规范请参阅根目录 `AGENTS.md`。

## 项目身份

这是 **PocketBook（口袋账本）** —— 一款 React Native + Expo 的本地优先个人记账 App。

## 核心技术栈

- **框架**：Expo SDK 52+ / Expo Router v4+
- **语言**：TypeScript 5.x（strict: true，禁止 any）
- **状态**：Zustand 5.x
- **数据库**：expo-sqlite 15+ + Drizzle ORM 0.38+
- **样式**：NativeWind v4+（Tailwind CSS）
- **图标**：lucide-react-native
- **包管理**：npm（禁止 yarn / pnpm）
- **环境**：macOS / zsh

## 最重要的三条规则

1. **所有数据库操作必须通过 `db/queries.ts`**，禁止在组件/Store 中直接用 `db` 实例
2. **禁止使用 `AsyncStorage` 存储业务数据**，统一用 SQLite
3. **禁止使用 `any` 类型**，启用 strict mode

## 完整规范

详见 [`AGENTS.md`](../../AGENTS.md) — 包含禁止事项速查表、组件拆分规范、业务规则等。
