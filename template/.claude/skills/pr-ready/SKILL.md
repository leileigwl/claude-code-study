---
name: pr-ready
description: 开 PR 之前的自检：对照规格检查范围、跑检查、整理 PR 描述。用户说“准备提 PR/收尾/可以提交了吗”时使用
allowed-tools: Bash(git status *) Bash(git diff *) Bash(git log *) Bash(npm run lint *) Bash(npm test *)
---
## 当前改动
!`git status --short`
!`git diff --stat HEAD`

## 步骤
1. **范围检查**：对照 docs/specs/ 里对应的规格（没有就问我是哪个），逐条列出“规格要求 → 是否实现 → 证据（文件:行）”。规格“范围外”的改动一律指出来，问我是否撤回。
2. **检查**：运行 `npm run lint` 和 `npm test`，贴出命令和结果摘要。失败就先修。
3. **样式改动**：如果 diff 里有 CSS/布局改动，确认 docs/02-design/prototypes/ 里有对应且已确认的原型，在 PR 描述中链接；没有就停下来告诉我。
4. **PR 描述草稿**：标题（≤ 60 字）、做了什么、为什么、如何验证（命令 + 结果）、截图/原型链接、风险。
5. 不要自己 push 或开 PR，除非我明确说“提交并开 PR”或运行 /ship。
