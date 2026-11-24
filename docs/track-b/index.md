---
title: B · 官方文档精读
outline: [2, 3]
editLink: false
---

<!-- 本页由 scripts/gen-track-b.mjs 生成，请勿手改。 -->

# B · 官方文档精读：按官方导航的全量索引

<div class="one-liner">

**一句话讲明白**：这里按官方导航列出 Claude Code 文档的**全部 221 页**。每页给出官方中文概要、原文与中文版链接、A 路线哪一章讲过它，以及精读状态。要找某个设置键、hook 事件或命令的出处，从这里点进官方原文。

</div>

## 精读进度

| 分区 | 页数 | 已精读 |
| :- | -: | -: |
| [快速入门 · Getting started](./getting-started) | 62 | 24 |
| [使用 Claude Code 构建 · Build with Claude Code](./build) | 22 | 10 |
| [插件 · Plugins](./plugins) | 31 | 0 |
| [管理 · Administration](./administration) | 37 | 2 |
| [配置 · Configuration](./configuration) | 27 | 7 |
| [参考 · Reference](./reference) | 9 | 3 |
| [Agent SDK](./agent-sdk) | 32 | 0 |
| [资源 · Resources](./resources) | 1 | 0 |
| **合计** | **221** | **46** |

另有 4 页在 A 路线正文中被引用（标“提及”）。每一页在官方中文索引里都有对应条目。

## A 路线各章精读了哪些官方页

| 章 | 官方页面（slug） |
| :- | :- |
| [1. Agent 循环与上下文窗口](/track-a/01-agent-loop-context) | `how-claude-code-works` `context-window` `best-practices` `troubleshooting` `model-config` `hooks-guide` `commands` |
| [2. CLAUDE.md / 记忆 / .claude 目录](/track-a/02-claude-md-memory) | `memory` `claude-directory` `best-practices` `large-codebases` `debug-your-config` |
| [3. settings、权限模式与沙箱](/track-a/03-settings-permissions-sandbox) | `settings` `permissions` `permission-modes` `sandboxing` `settings-reference` `settings-example` `best-practices` |
| [4. Plan mode、会话、checkpoint、worktree](/track-a/04-plan-sessions-worktrees) | `permission-modes` `sessions` `checkpointing` `worktrees` `best-practices` `how-claude-code-works` |
| [5. Hooks：硬性门禁](/track-a/05-hooks-gates) | `hooks` `hooks-guide` `permissions` `best-practices` |
| [6. Skills 与 slash commands](/track-a/06-skills-commands) | `skills` `commands` `best-practices` `context-window` |
| [7. Subagents 分工与边界](/track-a/07-subagents) | `sub-agents` `agents` `best-practices` `worktrees` |
| [8. MCP 接入](/track-a/08-mcp) | `mcp-quickstart` `mcp` `permissions` `best-practices` `managed-mcp` |
| [9. Claude Ship 与 /ship](/track-a/09-claude-ship) | `claude-ship` `code-review` `code-review-setup` `code-review-customize` `code-review-pull-requests` `code-review-costs` `code-review-troubleshooting` `pr-steward` `pr-steward-setup` `pr-steward-pull-requests` `pr-steward-security` `approvals` `approvals-setup` `approvals-policy` `approvals-github-rules` `ship-command` `ship-command-troubleshooting` `code-review-local` `feature-availability` |
| [10. 防乱跑仓库模板 + 知行快刷完整实战](/track-a/10-repo-template) | `best-practices` `permissions` `settings` `settings-reference` `hooks` `hooks-guide` `memory` `skills` `sub-agents` `mcp` `worktrees` `ship-command` `ship-command-troubleshooting` `code-review-local` `code-review-customize` `approvals` `approvals-setup` `approvals-policy` `feature-availability` |

## 数据来源与更新

- 结构与英文摘要：[`llms.txt`](https://code.claude.com/docs/llms.txt)（快照 `data/llms-snapshot.txt`，Claude Code Docs）
- 中文标题与概要：官方简体中文索引 [`_llms/zh-cn.txt`](https://code.claude.com/docs/_llms/zh-cn.txt)（快照 `data/llms-zh-cn-snapshot.txt`）
- 每周一由 GitHub Actions 运行 `scripts/sync-docs.mjs` 比对线上索引；有新增、删除或摘要改动时自动开 issue。更新快照后运行 `npm run gen:track-b` 重新生成本目录。
- 状态的判定是机械的：某章「原文链接」一节列出了该页 → 已精读。
