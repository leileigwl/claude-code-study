---
name: ui-prototype
description: 在任何前端视觉改动（样式、布局、颜色、间距、动效、组件外观、新页面）之前使用。先在 docs/02-design/prototypes/ 做一个可直接打开的 HTML 原型，然后停下来等用户确认，确认前不改 frontend/ 下的页面和样式代码。
when_to_use: 用户说“改一下样式/颜色/布局/按钮/手感/好看点/调 UI/做个新页面”时
argument-hint: "[原型名，例如 v29-quiz-card]"
---
最重要：**原型被用户明确回复“确认”之前，不修改 frontend/ 下任何页面或样式代码**（AGENTS.md「前端样式与页面改动（强制原型门控）」）。

1. 读 AGENTS.md 的原型门控、docs/02-design/v2-ui-design-system.md（方案 B `MOVEPOP` 暖石膏风格）和要改的组件，列出“改什么 / 不改什么”。
2. 新建或更新 `docs/02-design/prototypes/$ARGUMENTS.html`（没给名字就按现有命名用下一个版本号，如 `v29-<主题>.html`）：
   - 单文件、内联 CSS 与 JS，不引外部依赖，375px 手机宽度优先
   - 有改动对比时左右并排“现状 / 提议”；交互态（按下、加载、错误、空状态）都要能点出来
   - 触控热区 ≥ 44px，按下态沿用 V2.7 手感规范
3. 在 `docs/02-design/prototypes/README.md` 的“当前原型文件”里登记这一项，标注 **待用户确认**。
4. 回复里给出：原型路径、改动要点（3–5 条）、需要用户拍板的问题。然后**停下，等待用户回复“确认”**。要修改就迭代原型，不动源码。
5. 用户确认后：README 里改成“已确认”，再按原型改 `frontend/`，PR 描述里链接原型文件。
