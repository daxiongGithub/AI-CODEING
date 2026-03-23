title: Skills 字段说明文档（Copilot / Agent 自定义）
description: 说明如何编写用于 Copilot / Agent 的 SKILL.md 与 agent 元数据字段，包含字段定义、示例与校验要点。
author: assistant
date: 2026-03-23
---

## 目的

本文为普通文档，面向需要编写或审核 SKILL.md 的人员。逐项解释常见字段（例如 `name`、`description`、`use_when`、`location` 等）、推荐写法、示例与校验要点，便于团队保持一致性。

## 目标读者

- 产品经理、设计师、文档作者、工程师、以及负责维护 agent 自定义文件的同事。

## 字段说明（常见的 YAML frontmatter）

- `name`（必填，string）
  - 含义：Skill 的内部标识，一般与文件夹名一致（小写短横）。
  - 示例：`design-requirements`

- `description`（必填，string）
  - 含义：一句话概述 Skill 的用途与触发关键词，便于检索与快速理解。
  - 写法建议：简洁，包含关键词；如含冒号请用双引号包裹。
  - 示例："Skill for generating and maintaining Design Requirements artifacts: templates, prompts, delivery checklists."

- `use_when`（可选，string）
  - 含义：描述适用场景或触发条件，帮助 agent 判断是否加载该 skill。
  - 示例："create or update design requirements, generate templates, or map requirements to design deliverables"

- `location`（可选，string）
  - 含义：Skill 文件在仓库中的相对路径，便于查阅。
  - 示例：`.ai/skills/design-requirements/SKILL.md`

## 正文结构建议（Skill 内容为普通文档正文）

- 目标（Purpose）：简短说明 Skill 目的与边界。
- 何时使用（Use cases）：列出具体场景与触发关键词，便于人工与 agent 检索。
- 输入 / 输出（Inputs / Outputs）：列出可接受的参数与产物格式。
- 示例 Prompts：至少 3 个可复现的示例，并说明输入/输出结构。
- 模板片段：可复制到项目的需求/设计模板示例（如需求项模板、设计交付清单）。
- 校验要点（Validation）：YAML 语法、命名约定、路径推荐等。
- 维护信息：版本、作者、变更记录位置。

## 示例（可直接引用到 SKILL.md 正文）

目标：为团队提供一套用于生成与维护“设计需求文档（Design Requirements）”的模板与示例 prompts，支持从需求到架构与 UI 的可追溯交付。

适用场景：当需要把产品需求映射为设计交付项、生成验收标准或准备设计交付清单时。

输入示例：`project_name`, `author`, `goals`, `user_stories`（可选）。

输出示例：标准化 Markdown 模板、结构化需求项、设计交付清单、示例 prompts。

示例 Prompts：

- 根据项目名 `<项目名>` 与目标 `<目标描述>` 生成需求文档大纲，包含功能与非功能需求，并为每条生成验收标准与唯一 ID（例如 REQ-001）。
- 为需求 `REQ-045` 生成设计交付清单，列出低/高保真产物、相关资产位置、负责人与 ETA。
- 将多条用户故事转换为 3 条 `REQ` 项，并为每条生成结构化验收标准（示例输入为多行用户故事文本）。

模板片段：

需求项模板：

```
ID: REQ-XXX
Title:
Description:
Priority: (P0/P1/P2)
Dependencies:
Acceptance Criteria:
	-
Version / Date / Author / Status:
```

设计交付清单模板：

```
Related Requirement: REQ-XXX
Deliverables:
	- Low-fidelity wireframe (source: .drawio/.fig, export: SVG/PNG)
	- High-fidelity mockup (Figma/Sketch source + exports)
	- Interactive prototype (link)
	- Assets (icons, images, SVGs)
	- Component spec (tokens, accessibility notes)
Owner:
ETA:
```

## 校验清单（Checklist）

- 若使用 YAML frontmatter：顶端包含 `---` 并确保语法正确。
- `description` 与 `use_when` 应包含便于检索的关键词（如 `design`, `requirements`, `deliverables`）。
- 提供至少 3 个示例 prompt，并在文中说明每个 prompt 的输入/输出期望。
- 在模板片段中注明建议存放路径（如 `docs/requirements/`、`docs/design/`、`docs/design/sources/`）。

## 常见写作建议与陷阱

- 使用短横命名（`design-requirements`）避免空格或特殊字符。
- `description` 若包含冒号或特殊字符请用双引号包裹，避免 YAML 解析错误。
- 不要把过多实现细节写入 description；将复杂流程放在正文示例中。

## 维护建议

- 在文档顶部注明 `Version / Date / Author`。将变更摘要记录到仓库根目录的 `changelog.md`。

---

请确认是否要我直接把 `agent-customization` 的 SKILL.md 新建到 `.ai/skills/agent-customization/SKILL.md`（我可以基于上面的示例自动生成）。
