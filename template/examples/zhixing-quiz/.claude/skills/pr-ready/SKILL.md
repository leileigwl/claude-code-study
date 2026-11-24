---
name: pr-ready
description: 开 PR 之前的自检：对照规格检查范围、跑与 CI 相同的闸门、按仓库 PR 模板整理描述。用户说“准备提 PR/收尾/可以提交了吗”时使用
allowed-tools: Bash(git status *) Bash(git diff *) Bash(git log *) Bash(pnpm --dir frontend check:all *) Bash(uv run ruff check *) Bash(uv run pytest *)
---
## 当前改动
!`git status --short`
!`git diff --stat HEAD`

## 步骤
1. **范围检查**：对照 docs/specs/ 或 openspec/ 里对应的规格（没有就问我是哪个），逐条列出“要求 → 是否实现 → 证据（文件:行）”。范围外的改动全部指出来，问我是否撤回。
2. **闸门**（与 .github/workflows/ci.yml 一致，改了哪边就跑哪边）：
   - 前端：`pnpm --dir frontend check:all`
   - 后端：`cd backend && uv run ruff check app tests && uv run pytest -q`
   贴出命令与结果摘要；失败先修。不许降低覆盖率阈值、关 lint 规则或跳过测试。
3. **样式改动**：diff 里有 `.scss`、`className`、`style={{` 等改动时，确认 docs/02-design/prototypes/ 里有对应且 README 标为“已确认”的原型，没有就停下来告诉我。
4. **交接**：按 AGENTS.md 要求更新 docs/session-handoff.md。
5. **PR 描述草稿**：按 .github/pull_request_template.md 的结构写（做了什么、为什么、如何验证、原型链接、风险）。
6. 不要自己 push 或开 PR，除非我明确说“提交并开 PR”或运行 /ship。
