---
title: 学习路线
outline: [2, 3]
---

# 学习路线

<div class="one-liner">

**一句话讲明白**：先用三天把 A 路线 1–5 章读完并在自己仓库里装上权限和 hooks（这时就已经“管住”了大半）；第二周读 6–9 章补流程；第 10 章对照着把整套模板装好。B 路线当字典查，不用从头读。

</div>

## 你在哪个阶段

| 你现在 | 从哪开始 | 目标 |
| :- | :- | :- |
| 刚装好 Claude Code，还没在真实项目里用过 | B 路线 [快速入门](/track-b/getting-started) 的 Overview、Quickstart，再读 A1 | 知道它怎么工作、会话和上下文是什么 |
| 用过一阵，经常觉得它“不听话” | A1 → A2 → A3 → A5 | 规则放对层；“绝不”的事交给程序 |
| 想让它做完整功能、提 PR | A4 → A6 → A7 → A9 | 规格 → 实现 → 独立审查 → 你合并 |
| 想直接给自己的仓库装护栏 | A10，回头按需查 A3、A5 | 一套能复制的 `.claude/` |

## 推荐节奏（约 2 周，每天 1 小时）

### 第 1 阶段：地基（第 1–3 天）

| 天 | 读 | 动手（在你自己的仓库） | 完成标志 |
| :- | :- | :- | :- |
| 1 | [A1 Agent 循环与上下文](/track-a/01-agent-loop-context) | `/context all` 看开机成本 | 能说出压缩时会丢什么、怎么补 |
| 2 | [A2 CLAUDE.md 与记忆](/track-a/02-claude-md-memory) | `/init` 后删到几十行；加 `.gitignore` 三行 | `/context all` 里看得到你的 CLAUDE.md |
| 3 | [A3 settings、权限与沙箱](/track-a/03-settings-permissions-sandbox) | 写 `.claude/settings.json` 的 deny/ask/allow | 让它“读 .env”，被拒绝 |

### 第 2 阶段：门禁（第 4–6 天）

| 天 | 读 | 动手 | 完成标志 |
| :- | :- | :- | :- |
| 4 | [A4 Plan、会话、checkpoint、worktree](/track-a/04-plan-sessions-worktrees) | 用 plan mode 写一份规格；`claude --worktree` 实现 | 会用 `/rewind`，知道它撤不回什么 |
| 5–6 | [A5 Hooks](/track-a/05-hooks-gates) | 装三道门（编辑前 / 编辑后 / 结束前） | `/hooks` 里看到 4 个事件；Stop 门把它拽回去过一次 |

### 第 3 阶段：流程（第 7–10 天）

| 天 | 读 | 动手 | 完成标志 |
| :- | :- | :- | :- |
| 7 | [A6 Skills](/track-a/06-skills-commands) | 装 `/feature-spec`、`/ui-prototype`、`/pr-ready` | `/` 菜单里出现这三个 |
| 8 | [A7 Subagents](/track-a/07-subagents) | 装 `reviewer`、`test-runner` | 用 reviewer 对照规格审过一次改动 |
| 9 | [A8 MCP](/track-a/08-mcp) | `.mcp.json` 接官方文档 MCP（可选 playwright） | `/mcp` 显示已连接 |
| 10 | [A9 Claude Ship 与 /ship](/track-a/09-claude-ship) | 给 `main` 开分支保护；试一次 `/code-review` | 知道 `/ship` watch 会做什么、不会做什么 |

### 第 4 阶段：整合（第 11–14 天）

| 天 | 读 | 动手 | 完成标志 |
| :- | :- | :- | :- |
| 11–12 | [A10 防乱跑模板 + 实战](/track-a/10-repo-template) | 按第 1–7 步把模板装进仓库，CI 设为 required | 第 9 步验证清单全部通过 |
| 13–14 | 回看各章“常见坑” | 用第 8 步的节奏完整做一个小功能 | 从规格到你合并，一次走通 |

## B 路线怎么用

- **当字典**：遇到 A 路线里提到的设置键、hook 事件、命令，去 [B 路线](/track-b/) 找对应官方页，看中文概要后点原文。
- **看状态**：<span class="status-tag st-deep">已精读</span> 表示 A 路线有一章专门对照原文讲过；<span class="status-tag st-brief">概要</span> 表示只有官方摘要，需要时读原文。
- **跟进更新**：官方文档每周会变。仓库每周自动比对一次，有变化就开 issue，并记在 [更新日志](/changelog)。

## 学完你应该能做到

1. 说清楚任意一条规则该放 CLAUDE.md、settings、hook 还是 CI，以及为什么。
2. 在新仓库里 15 分钟装好护栏，并用验证清单证明它生效。
3. 让 Claude 从规格做到 PR，全程不碰受保护文件、不跳过检查、不自己合并。
4. 知道每一层的漏洞在哪里（Bash 规则可绕、hook 超时默认放行、watch 跳过 git hooks），并有下一层兜底。
