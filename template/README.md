# 防乱跑仓库模板

配合学习站 [第 10 章](https://leileigwl.github.io/claude-code-study/track-a/10-repo-template) 使用。每个文件都标了来自哪一章、是“引导”还是“程序强制”。

| 文件 | 类型 | 章 |
| :- | :- | :- |
| `CLAUDE.md` | 引导（模型读） | 2 |
| `.claude/compact-reminder.md` + `hooks/compact-reminder.mjs` | 压缩后重新注入 | 1、5 |
| `.claude/settings.json` | 程序强制：权限 deny/ask/allow + 4 个 hook | 3、5、8 |
| `.claude/hooks/protect-files.mjs` | PreToolUse：受保护文件 exit 2；规则文件与样式改动 `"ask"` | 5 |
| `.claude/hooks/lint-edited.mjs` | PostToolUse：eslint / ruff 自动修复 | 5 |
| `.claude/hooks/verify-before-stop.mjs`（+ 可选 `checks.json`） | Stop：相关检查不过不许结束 | 5 |
| `.claude/skills/{feature-spec,ui-prototype,pr-ready,steward}` | 可复用流程 | 6、9 |
| `.claude/agents/{explorer,reviewer,test-runner}.md` | 子代理 | 7 |
| `.mcp.json` | 团队共享 MCP（无 token） | 8 |
| `.worktreeinclude` | 新 worktree 复制被忽略的本地文件 | 4 |
| `.gitignore` | 追加到你的 .gitignore | 2、4 |
| `REVIEW.md` | 托管 Code Review 专用（Team/Enterprise） | 9 |
| `.claude/approvals.yml` | Claude Approvals 入门策略，observe（Team/Enterprise；单人仓库勿 enforce） | 9、10 |
| `examples/zhixing-quiz/` | 知行快刷（Taro+React / pnpm / Python+uv）的覆盖文件 | 10 |

复制时由你本人在终端里操作：hook 装好后，`.claude/settings.json` 和 `.claude/hooks/` 就不允许 AI 修改了。
