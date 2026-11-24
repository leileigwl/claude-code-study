---
title: Agent SDK
outline: [2, 3]
editLink: false
---

<!-- 本页由 scripts/gen-track-b.mjs 根据 data/llms-snapshot.txt 与 data/llms-zh-cn-snapshot.txt 生成，请勿手改。 -->

# Agent SDK

官方文档“Agent SDK”分区，共 **32** 页，其中 **0** 页在 A 路线里对照原文精读过。顺序与分组跟随官方导航；中文概要取自官方简体中文索引。

- <span class="status-tag st-deep">已精读</span>：A 路线某一章把它列为“原文链接”，逐条核对过
- <span class="status-tag st-brief">概要</span>：只有官方摘要；“A 路线”一栏写“（提及）”表示章节正文引用过它

::: v-pre

## Agent SDK

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **Agent SDK 概览**<br>Agent SDK overview<br>[原文](https://code.claude.com/docs/en/agent-sdk/overview) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/overview) | 使用 Claude Code 作为库构建生产级 AI 代理 | — | <span class="status-tag st-brief">概要</span> |
| **快速开始**<br>Quickstart<br>[原文](https://code.claude.com/docs/en/agent-sdk/quickstart) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/quickstart) | 使用 Python 或 TypeScript Agent SDK 开始构建能够自主工作的 AI 代理 | — | <span class="status-tag st-brief">概要</span> |
| **迁移到 Claude Agent SDK**<br>Migrate to Claude Agent SDK<br>[原文](https://code.claude.com/docs/en/agent-sdk/migration-guide) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/migration-guide) | 将 Claude Code TypeScript 和 Python SDK 迁移到 Claude Agent SDK 的指南 | — | <span class="status-tag st-brief">概要</span> |
| **Agent SDK 故障排除**<br>Troubleshoot the Agent SDK<br>[原文](https://code.claude.com/docs/en/agent-sdk/troubleshooting) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/troubleshooting) | 修复 Agent SDK 错误：Claude Code CLI 无法启动或退出、提示词生成器抛出异常、工具消息过大，或缺少结构化输出。 | — | <span class="status-tag st-brief">概要</span> |

## 构建 Agent · Build agents

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **配置你的代理**<br>Configure your agent<br>[原文](https://code.claude.com/docs/en/agent-sdk/configuration) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/configuration) | 配置 Agent SDK 会话：组合选项对象、设置模型、环境和限制，并找到每个功能选项的页面。 | — | <span class="status-tag st-brief">概要</span> |
| **示例**<br>Examples<br>[原文](https://code.claude.com/docs/en/agent-sdk/examples) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/examples) | 查找完整的、可运行的 Agent SDK 项目或 Claude Cookbook 中的指导食谱，以匹配您想要构建的内容。 | — | <span class="status-tag st-brief">概要</span> |

## 核心概念 · Core concepts

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **代理循环如何工作**<br>How the agent loop works<br>[原文](https://code.claude.com/docs/en/agent-sdk/agent-loop) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/agent-loop) | 了解消息生命周期、工具执行、上下文窗口和支持 SDK 代理的架构。 | — | <span class="status-tag st-brief">概要</span> |
| **在 SDK 中使用 Claude Code 功能**<br>Use Claude Code features in the SDK<br>[原文](https://code.claude.com/docs/en/agent-sdk/claude-code-features) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/claude-code-features) | 将项目说明、skills、hooks 和其他 Claude Code 功能加载到您的 SDK 代理中。 | — | <span class="status-tag st-brief">概要</span> |
| **使用会话**<br>Work with sessions<br>[原文](https://code.claude.com/docs/en/agent-sdk/sessions) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/sessions) | 会话如何保持代理对话历史记录，以及何时使用 continue、resume 和 fork 返回到之前的运行。 | — | <span class="status-tag st-brief">概要</span> |
| **将会话持久化到外部存储**<br>Persist sessions to external storage<br>[原文](https://code.claude.com/docs/en/agent-sdk/session-storage) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/session-storage) | 将 Agent SDK 会话记录镜像到您自己的对象存储、键值存储或数据库，以便其他主机可以恢复您的会话。 | — | <span class="status-tag st-brief">概要</span> |

## 输入和输出 · Input and output

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **向正在运行的 Agent 发送消息**<br>Send messages to a running agent<br>[原文](https://code.claude.com/docs/en/agent-sdk/streaming-vs-single-mode) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/streaming-vs-single-mode) | 通过流式输入向同一个 Agent SDK 会话发送后续消息和图像，读取每条回复，并中断回复以重新引导 Claude。 | — | <span class="status-tag st-brief">概要</span> |
| **处理批准和用户输入**<br>Handle approvals and user input<br>[原文](https://code.claude.com/docs/en/agent-sdk/user-input) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/user-input) | 向用户显示 Claude 的批准请求和澄清问题，然后将他们的决定返回给 SDK。 | — | <span class="status-tag st-brief">概要</span> |
| **实时流式传输响应**<br>Stream responses in real-time<br>[原文](https://code.claude.com/docs/en/agent-sdk/streaming-output) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/streaming-output) | 当文本和工具调用流入时，从 Agent SDK 获取实时响应 | — | <span class="status-tag st-brief">概要</span> |
| **从代理获取结构化输出**<br>Get structured output from agents<br>[原文](https://code.claude.com/docs/en/agent-sdk/structured-outputs) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/structured-outputs) | 使用 JSON Schema、Zod 或 Pydantic 从代理工作流返回验证的 JSON。在多轮工具使用后获取类型安全的结构化数据。 | — | <span class="status-tag st-brief">概要</span> |

## 使用工具扩展 · Extend with tools

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **为 Claude 提供自定义工具**<br>Give Claude custom tools<br>[原文](https://code.claude.com/docs/en/agent-sdk/custom-tools) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/custom-tools) | 使用 Claude Agent SDK 的进程内 MCP 服务器定义自定义工具，以便 Claude 可以调用您的函数、访问您的 API 并执行特定领域的操作。 | — | <span class="status-tag st-brief">概要</span> |
| **使用 MCP 连接外部工具**<br>Connect to external tools with MCP<br>[原文](https://code.claude.com/docs/en/agent-sdk/mcp) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/mcp) | 配置 MCP 服务器以扩展您的代理的外部工具。涵盖传输类型、大型工具集的工具搜索、身份验证和错误处理。 | — | <span class="status-tag st-brief">概要</span> |
| **使用工具搜索扩展到多个工具**<br>Scale to many tools with tool search<br>[原文](https://code.claude.com/docs/en/agent-sdk/tool-search) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/tool-search) | 通过动态发现和按需加载，将您的代理扩展到数千个工具。 | — | <span class="status-tag st-brief">概要</span> |
| **SDK 中的子代理**<br>Subagents in the SDK<br>[原文](https://code.claude.com/docs/en/agent-sdk/subagents) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/subagents) | 定义和调用子代理以隔离上下文、并行运行任务，以及在 Claude Agent SDK 应用程序中应用专门的指令。 | — | <span class="status-tag st-brief">概要</span> |

## 自定义行为 · Customize behavior

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **修改系统提示词**<br>Modifying system prompts<br>[原文](https://code.claude.com/docs/en/agent-sdk/modifying-system-prompts) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/modifying-system-prompts) | 在 `claude_code` 预设和自定义系统提示词之间进行选择，并通过 CLAUDE.md、输出样式、追加或完全自定义提示词来自定义行为。 | — | <span class="status-tag st-brief">概要</span> |
| **使用 skills 扩展 agents**<br>Extend agents with skills<br>[原文](https://code.claude.com/docs/en/agent-sdk/skills) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/skills) | 控制 Claude 在 Claude Agent SDK 会话中可以调用哪些 skills，按名称分派命令，以及编写会话发现的 skills | — | <span class="status-tag st-brief">概要</span> |
| **SDK 中的 Plugins**<br>Plugins in the SDK<br>[原文](https://code.claude.com/docs/en/agent-sdk/plugins) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/plugins) | 通过 Agent SDK 加载自定义 plugins，以向 agent 会话添加 skills、agents、hooks 和 MCP servers | — | <span class="status-tag st-brief">概要</span> |

## 控制与可观测性 · Control and observability

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **配置权限**<br>Configure permissions<br>[原文](https://code.claude.com/docs/en/agent-sdk/permissions) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/permissions) | 使用权限模式、hooks 和声明式允许/拒绝规则来控制您的代理如何使用工具。 | — | <span class="status-tag st-brief">概要</span> |
| **使用 hooks 拦截和控制代理行为**<br>Intercept and control agent behavior with hooks<br>[原文](https://code.claude.com/docs/en/agent-sdk/hooks) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/hooks) | 在代理执行的关键点使用 hooks 拦截和自定义代理行为 | — | <span class="status-tag st-brief">概要</span> |
| **使用checkpointing回滚文件更改**<br>Rewind file changes with checkpointing<br>[原文](https://code.claude.com/docs/en/agent-sdk/file-checkpointing) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/file-checkpointing) | 在agent会话期间跟踪文件更改，并将文件恢复到任何之前的状态 | — | <span class="status-tag st-brief">概要</span> |
| **追踪成本和使用情况**<br>Track cost and usage<br>[原文](https://code.claude.com/docs/en/agent-sdk/cost-tracking) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/cost-tracking) | 了解如何追踪令牌使用情况、估算成本，以及使用 Claude Agent SDK 配置 prompt caching。 | — | <span class="status-tag st-brief">概要</span> |
| **使用 OpenTelemetry 进行可观测性**<br>Observability with OpenTelemetry<br>[原文](https://code.claude.com/docs/en/agent-sdk/observability) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/observability) | 使用 OpenTelemetry 将来自 Agent SDK 的跟踪、指标和事件导出到您的可观测性后端。 | — | <span class="status-tag st-brief">概要</span> |
| **跟踪待办事项**<br>Track todos<br>[原文](https://code.claude.com/docs/en/agent-sdk/todo-tracking) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/todo-tracking) | 在 Agent SDK 会话中跟踪待办事项，并从结构化工具调用中呈现 Claude 的进度 | — | <span class="status-tag st-brief">概要</span> |

## 部署 · Deployment

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **托管 Agent SDK**<br>Hosting the Agent SDK<br>[原文](https://code.claude.com/docs/en/agent-sdk/hosting) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/hosting) | 在生产环境中部署 Agent SDK：子进程架构、会话持久化、扩展、可观测性以及针对 Docker、Kubernetes 和沙箱提供商的多租户隔离。 | — | <span class="status-tag st-brief">概要</span> |
| **安全部署 AI 代理**<br>Securely deploying AI agents<br>[原文](https://code.claude.com/docs/en/agent-sdk/secure-deployment) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/secure-deployment) | 关于使用隔离、凭证管理和网络控制来保护 Claude Code 和 Agent SDK 部署的指南 | — | <span class="status-tag st-brief">概要</span> |

## SDK 参考 · SDK references

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **Agent SDK 参考 - TypeScript**<br>Agent SDK reference - TypeScript<br>[原文](https://code.claude.com/docs/en/agent-sdk/typescript) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/typescript) | TypeScript Agent SDK 的完整 API 参考，包括所有函数、类型和接口。 | — | <span class="status-tag st-brief">概要</span> |
| **TypeScript SDK V2 session API（已移除）**<br>TypeScript SDK V2 session API (removed)<br>[原文](https://code.claude.com/docs/en/agent-sdk/typescript-v2-preview) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/typescript-v2-preview) | 已移除的 V2 TypeScript Agent SDK session API 参考，具有用于多轮对话的基于会话的 send/stream 模式。 | — | <span class="status-tag st-brief">概要</span> |
| **Agent SDK 参考 - Python**<br>Agent SDK reference - Python<br>[原文](https://code.claude.com/docs/en/agent-sdk/python) · [中文版](https://code.claude.com/docs/zh-CN/agent-sdk/python) | Python Agent SDK 的完整 API 参考，包括所有函数、类型和类。 | — | <span class="status-tag st-brief">概要</span> |

:::
