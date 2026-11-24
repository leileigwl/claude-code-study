---
title: 使用 Claude Code 构建 · Build with Claude Code
outline: [2, 3]
editLink: false
pageClass: track-b-page
---

<!-- 本页由 scripts/gen-track-b.mjs 根据 data/llms-snapshot.txt 与 data/llms-zh-cn-snapshot.txt 生成，请勿手改。 -->

# 使用 Claude Code 构建 · Build with Claude Code

官方文档“Build with Claude Code”分区，共 **22** 页，其中 **10** 页在 A 路线里对照原文精读过。顺序与分组跟随官方导航；中文概要取自官方简体中文索引。

- <span class="status-tag st-deep">已精读</span>：A 路线某一章把它列为“原文链接”，逐条核对过
- <span class="status-tag st-brief">概要</span>：只有官方摘要；“A 路线”一栏写“（提及）”表示章节正文引用过它

::: v-pre

## Agent 与并行工作 · Agents and parallel work

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **并行运行代理**<br>Run agents in parallel<br>[原文](https://code.claude.com/docs/en/agents) · [中文版](https://code.claude.com/docs/zh-CN/agents) | 比较 Claude Code 同时处理多个任务的方式：子代理、代理视图、代理团队、动态工作流和项目。 | [A7](/track-a/07-subagents) | <span class="status-tag st-deep">已精读</span> |
| **创建自定义 subagents**<br>Create custom subagents<br>[原文](https://code.claude.com/docs/en/sub-agents) · [中文版](https://code.claude.com/docs/zh-CN/sub-agents) | 在 Claude Code 中创建和使用专门的 AI subagents，用于特定任务的工作流和改进的上下文管理。 | [A7](/track-a/07-subagents) [A10](/track-a/10-repo-template) | <span class="status-tag st-deep">已精读</span> |
| **使用 agent view 管理多个代理**<br>Manage multiple agents with agent view<br>[原文](https://code.claude.com/docs/en/agent-view) · [中文版](https://code.claude.com/docs/zh-CN/agent-view) | 从一个屏幕调度和管理多个 Claude Code 会话。Agent view 显示每个会话正在做什么以及哪些会话需要你的输入。 | — | <span class="status-tag st-brief">概要</span> |
| **协调 Claude Code 会话团队**<br>Orchestrate teams of Claude Code sessions<br>[原文](https://code.claude.com/docs/en/agent-teams) · [中文版](https://code.claude.com/docs/zh-CN/agent-teams) | 协调多个 Claude Code 实例作为一个团队一起工作，具有共享任务、代理间消息传递和集中管理。 | — | <span class="status-tag st-brief">概要</span> |
| **消息传递到您的其他 Claude Code 会话**<br>Message your other Claude Code sessions<br>[原文](https://code.claude.com/docs/en/cross-session-messaging) · [中文版](https://code.claude.com/docs/zh-CN/cross-session-messaging) | 让 Claude 列出并消息传递到您在此机器上的其他 Claude Code 会话，并到达您在其他机器或网络上的会话。 | — | <span class="status-tag st-brief">概要</span> |
| **使用动态工作流大规模编排子代理**<br>Orchestrate subagents at scale with dynamic workflows<br>[原文](https://code.claude.com/docs/en/workflows) · [中文版](https://code.claude.com/docs/zh-CN/workflows) | 动态工作流从 Claude 编写的脚本中编排许多子代理，您可以重新运行。用于代码库审计、大型迁移和交叉检查研究。 | — | <span class="status-tag st-brief">概要</span> |
| **使用 worktrees 运行并行会话**<br>Run parallel sessions with worktrees<br>[原文](https://code.claude.com/docs/en/worktrees) · [中文版](https://code.claude.com/docs/zh-CN/worktrees) | 在单独的 git worktrees 中隔离并行 Claude Code 会话，以便更改不会相互冲突。涵盖 `--worktree` 标志、子代理隔离、`.worktreeinclude`、清理和非 git VCS hooks。 | [A4](/track-a/04-plan-sessions-worktrees) [A7](/track-a/07-subagents) [A10](/track-a/10-repo-template) | <span class="status-tag st-deep">已精读</span> |

## MCP

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **连接到 MCP 服务器**<br>Connect to MCP servers<br>[原文](https://code.claude.com/docs/en/mcp-quickstart) · [中文版](https://code.claude.com/docs/zh-CN/mcp-quickstart) | 将 MCP 服务器添加到 Claude Code，验证连接，并在磁盘上找到配置。 | [A8](/track-a/08-mcp) | <span class="status-tag st-deep">已精读</span> |
| **通过 MCP 将 Claude Code 连接到工具**<br>Connect Claude Code to tools via MCP<br>[原文](https://code.claude.com/docs/en/mcp) · [中文版](https://code.claude.com/docs/zh-CN/mcp) | 了解如何使用 Model Context Protocol 将 Claude Code 连接到您的工具。 | [A8](/track-a/08-mcp) [A10](/track-a/10-repo-template) | <span class="status-tag st-deep">已精读</span> |

## Skills

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **使用 skills 扩展 Claude**<br>Extend Claude with skills<br>[原文](https://code.claude.com/docs/en/skills) · [中文版](https://code.claude.com/docs/zh-CN/skills) | 创建、管理和共享 skills 以在 Claude Code 中扩展 Claude 的功能。包括自定义命令和捆绑的 skills。 | [A6](/track-a/06-skills-commands) [A10](/track-a/10-repo-template) | <span class="status-tag st-deep">已精读</span> |

## Artifact · Artifacts

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **将会话输出作为 artifacts 共享**<br>Share session output as artifacts<br>[原文](https://code.claude.com/docs/en/artifacts) · [中文版](https://code.claude.com/docs/zh-CN/artifacts) | Artifacts 将 Claude Code 的工作转化为 claude.ai 上的实时交互式页面，您可以将其保持私密、与您的组织共享或发布到公开链接。 | — | <span class="status-tag st-brief">概要</span> |

## 自动化 · Automation

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **使用 hooks 自动化操作**<br>Automate actions with hooks<br>[原文](https://code.claude.com/docs/en/hooks-guide) · [中文版](https://code.claude.com/docs/zh-CN/hooks-guide) | 当 Claude Code 编辑文件、完成任务或需要输入时自动运行 shell 命令。格式化代码、发送通知、验证命令并强制执行项目规则。 | [A1](/track-a/01-agent-loop-context) [A5](/track-a/05-hooks-gates) [A10](/track-a/10-repo-template) | <span class="status-tag st-deep">已精读</span> |
| **使用 channels 将事件推送到运行中的会话**<br>Push events into a running session with channels<br>[原文](https://code.claude.com/docs/en/channels) · [中文版](https://code.claude.com/docs/zh-CN/channels) | 使用 channels 从 MCP 服务器将消息、警报和 webhooks 推送到您的 Claude Code 会话中。转发 CI 结果、聊天消息和监控事件，以便 Claude 在您离开时做出反应。 | — | <span class="status-tag st-brief">概要</span> |
| **按计划运行提示词**<br>Run prompts on a schedule<br>[原文](https://code.claude.com/docs/en/scheduled-tasks) · [中文版](https://code.claude.com/docs/zh-CN/scheduled-tasks) | 使用 /loop 和 cron 调度工具在 Claude Code 会话中重复运行提示词、轮询状态或设置一次性提醒。 | — | <span class="status-tag st-brief">概要</span> |
| **让 Claude 朝着目标工作**<br>Keep Claude working toward a goal<br>[原文](https://code.claude.com/docs/en/goal) · [中文版](https://code.claude.com/docs/zh-CN/goal) | 使用 /goal 设置完成条件，Claude 会持续工作直到条件满足、模型判断其不可能实现或需要修复的错误清除目标。 | — | <span class="status-tag st-brief">概要</span> |
| **以编程方式运行 Claude Code**<br>Run Claude Code programmatically<br>[原文](https://code.claude.com/docs/en/headless) · [中文版](https://code.claude.com/docs/zh-CN/headless) | 使用 Agent SDK 从 CLI、Python 或 TypeScript 以编程方式运行 Claude Code。 | — | <span class="status-tag st-brief">概要</span> |
| **从链接启动会话**<br>Launch sessions from links<br>[原文](https://code.claude.com/docs/en/deep-links) · [中文版](https://code.claude.com/docs/zh-CN/deep-links) | 从 URL 打开 Claude Code 终端会话。在运行手册、警报和仪表板中嵌入 `claude-cli://` 链接，这样点击即可在正确的仓库中打开 Claude Code，并使用正确的提示。 | — | <span class="status-tag st-brief">概要</span> |

## 指南 · Guides

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **在 monorepo 或大型代码库中设置 Claude Code**<br>Set up Claude Code in a monorepo or large codebase<br>[原文](https://code.claude.com/docs/en/large-codebases) · [中文版](https://code.claude.com/docs/zh-CN/large-codebases) | 为 monorepo 和大型单树代码库配置 Claude Code，使用嵌套的 CLAUDE.md 文件、稀疏 worktrees、代码智能和按包技能，使 Claude 专注于你正在处理的代码。 | [A2](/track-a/02-claude-md-memory) | <span class="status-tag st-deep">已精读</span> |

## 故障排除 · Troubleshooting

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **排查安装和登录问题**<br>Troubleshoot installation and login<br>[原文](https://code.claude.com/docs/en/troubleshoot-install) · [中文版](https://code.claude.com/docs/zh-CN/troubleshoot-install) | 修复安装或登录 Claude Code 时出现的命令未找到、PATH、权限、网络和身份验证错误。 | — | <span class="status-tag st-brief">概要</span> |
| **故障排除**<br>Troubleshooting<br>[原文](https://code.claude.com/docs/en/troubleshooting) · [中文版](https://code.claude.com/docs/zh-CN/troubleshooting) | 修复 Claude Code 中的高 CPU 或内存使用、挂起、自动压缩抖动和搜索问题，并找到其他问题的正确页面。 | [A1](/track-a/01-agent-loop-context) | <span class="status-tag st-deep">已精读</span> |
| **调试你的配置**<br>Debug your configuration<br>[原文](https://code.claude.com/docs/en/debug-your-config) · [中文版](https://code.claude.com/docs/zh-CN/debug-your-config) | 诊断为什么 CLAUDE.md、settings、hooks、MCP 服务器或 skills 没有生效。使用 /context、/doctor、/hooks 和 /mcp 来查看实际加载了什么。 | [A2](/track-a/02-claude-md-memory) | <span class="status-tag st-deep">已精读</span> |
| **错误参考**<br>Error reference<br>[原文](https://code.claude.com/docs/en/errors) · [中文版](https://code.claude.com/docs/zh-CN/errors) | 查找 Claude Code 运行时错误消息，了解每个错误的含义以及如何修复。 | [A2](/track-a/02-claude-md-memory)（提及） | <span class="status-tag st-brief">概要</span> |

:::
