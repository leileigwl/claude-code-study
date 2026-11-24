---
title: 更新日志
---

# 更新日志

本站内容的变化，以及它跟进的官方文档变化。官方文档的比对由仓库里的 `scripts/sync-docs.mjs` 每周一自动运行（GitHub Actions），发现新增、删除或摘要改动的页面时会开一个 issue；处理完的变化记在这里。

时间均为北京时间（UTC+8）。

## 2026-11-24 · v0.1.0 首次发布

**文档快照**：`data/llms-snapshot.txt`（英文索引）与 `data/llms-zh-cn-snapshot.txt`（官方简体中文索引），取自 `https://code.claude.com/docs/llms.txt`，2026-11-24。A 路线所有结论按同日下载的官方页面核对。

**A · 落地实战**

- 第 1–9 章：Agent 循环与上下文、CLAUDE.md 与记忆、settings/权限/沙箱、plan/会话/checkpoint/worktree、hooks、skills、subagents、MCP、Claude Ship 与 `/ship`，每章附自测题。
- 第 10 章：防乱跑仓库模板 + 知行快刷完整实战（五层防线、单人仓库对 Claude Approvals 的限制、`/ship` watch 跳过本地 git hooks 所以 CI 必须是 required check）。
- 9 个分步动画（共享 StepPlayer / FlowStage 播放器）。

**模板 `template/`**

- `.claude/settings.json` 合并第 3、5、8 章：权限 deny/ask/allow、4 个 hook（PreToolUse、PostToolUse、Stop、SessionStart compact）。
- hooks 支持 worktree（按文件所在仓库根计算路径）、前后端分目录仓库、Windows（只用 `node` 启动）。
- 新增 `CLAUDE.md`、`compact-reminder.md`、`.mcp.json`、`.worktreeinclude`、`REVIEW.md`、`.claude/approvals.yml`（observe）、`.gitignore` 追加项，以及 `examples/zhixing-quiz/` 覆盖文件。

**B · 官方文档精读**

- 由 `scripts/gen-track-b.mjs` 按官方导航生成 8 个分区页，每页列出官方条目、中文概要、原文链接、对应 A 路线章节和精读状态。

**工具**

- `scripts/sync-docs.mjs`（比对官方 llms.txt）、`scripts/build-quizzes.mjs`（合并为 `quizzes/all.json`）。
- GitHub Actions：`deploy.yml`（构建并发布到 GitHub Pages）、`sync-docs.yml`（每周比对并开 issue）。

**官方侧值得注意的变化（本次快照里已包含）**

- Claude Ship（官方文档已收录）：Code Review（正式可用）、PR Steward 与 Claude Approvals（public beta），仅 Team / Enterprise。
- 本地 `/ship`、`/steward` 需要 Claude Code v2.1.330+。
