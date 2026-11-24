<!--
维护提示（第 2 章）：这里只写 Claude 读代码推不出来的东西，控制在几十行。
“绝不能做”的事不写在这里，写进 .claude/settings.json 的 deny 和 .claude/hooks/（程序强制）。
如果仓库已有 AGENTS.md 作为唯一事实来源（知行快刷就是），本文件只写一行 @AGENTS.md，
把下面各节里 AGENTS.md 还没有的内容合并进 AGENTS.md，不要两边各写一份。
-->

# 项目一句话
H5 刷题应用：前端（frontend/）+ 后端（backend/）。<改成你的>

# Commands
- 前端一键检查：pnpm --dir frontend check:all   <改成你的：如 npm run lint && npm test>
- 前端单个测试：pnpm --dir frontend exec vitest run <path>
- 后端检查：cd backend && uv run ruff check app tests && uv run pytest -q
- 后端单个测试：cd backend && uv run pytest -q tests/<file>.py

# Workflow
- 每个任务一个分支、一个 PR；不直接提交到 main；PR 由我本人合并
- 新功能先 /feature-spec 写规格，再开新会话（最好 claude --worktree <名>）按规格实现
- 任何前端样式/界面改动：先用 /ui-prototype 在 docs/02-design/prototypes/ 做 HTML 原型，等我回复“确认”后才改前端代码
- 完成前贴出你运行的检查命令和输出作为证据，不要只说“都通过了”
- 修 bug 先写能复现的失败用例再修

# Gotchas
- 生产 API 地址必须来自环境变量，缺失或是占位域名时构建直接报错（fail-fast），不要加默认值兜底
- 不要为了让检查变绿而降低覆盖率阈值、关 lint 规则或跳过测试

# Compact Instructions
压缩时务必保留：当前任务目标与完成标准（哪些命令必须通过）、本次已修改的文件清单、
我明确禁止的事项、正在等我确认的原型或决定。
