---
title: 快速入门 · Getting started
outline: [2, 3]
editLink: false
---

<!-- 本页由 scripts/gen-track-b.mjs 根据 data/llms-snapshot.txt 与 data/llms-zh-cn-snapshot.txt 生成，请勿手改。 -->

# 快速入门 · Getting started

官方文档“Getting started”分区，共 **62** 页，其中 **24** 页在 A 路线里对照原文精读过。顺序与分组跟随官方导航；中文概要取自官方简体中文索引。

- <span class="status-tag st-deep">已精读</span>：A 路线某一章把它列为“原文链接”，逐条核对过
- <span class="status-tag st-brief">概要</span>：只有官方摘要；“A 路线”一栏写“（提及）”表示章节正文引用过它

::: v-pre

## 入门 · Getting started

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **概述**<br>Overview<br>[原文](https://code.claude.com/docs/en/overview) · [中文版](https://code.claude.com/docs/zh-CN/overview) | Claude Code 是一个代理编码工具，可以读取你的代码库、编辑文件、运行命令，并与你的开发工具集成。可在终端、IDE、桌面应用和浏览器中使用。 | — | <span class="status-tag st-brief">概要</span> |
| **快速入门**<br>Quickstart<br>[原文](https://code.claude.com/docs/en/quickstart) · [中文版](https://code.claude.com/docs/zh-CN/quickstart) | 在终端中安装 Claude Code，完成登录，并使用 CLI 探索您的代码库、进行第一次代码更改。 | — | <span class="status-tag st-brief">概要</span> |
| **更新日志**<br>Claude Code changelog<br>[原文](https://code.claude.com/docs/en/changelog) · [中文版](https://code.claude.com/docs/zh-CN/changelog) | Release notes for Claude Code, including new features, improvements, and bug fixes by version.（官方暂无中文摘要，此为英文原文） | — | <span class="status-tag st-brief">概要</span> |

## 核心概念 · Core concepts

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **Claude Code 如何工作**<br>How Claude Code works<br>[原文](https://code.claude.com/docs/en/how-claude-code-works) · [中文版](https://code.claude.com/docs/zh-CN/how-claude-code-works) | 了解代理循环、内置工具以及 Claude Code 如何与您的项目交互。 | [A1](/track-a/01-agent-loop-context) [A4](/track-a/04-plan-sessions-worktrees) | <span class="status-tag st-deep">已精读</span> |
| **扩展 Claude Code**<br>Extend Claude Code<br>[原文](https://code.claude.com/docs/en/features-overview) · [中文版](https://code.claude.com/docs/zh-CN/features-overview) | 了解何时使用 CLAUDE.md、Skills、subagents、hooks、MCP 和 plugins。 | — | <span class="status-tag st-brief">概要</span> |
| **探索 .claude 目录**<br>Explore the .claude directory<br>[原文](https://code.claude.com/docs/en/claude-directory) · [中文版](https://code.claude.com/docs/zh-CN/claude-directory) | Claude Code 读取 CLAUDE.md、settings.json、hooks、skills、commands、subagents、workflows、rules 和自动内存的位置。探索项目中的 .claude 目录和主目录中的 ~/.claude。 | [A2](/track-a/02-claude-md-memory) | <span class="status-tag st-deep">已精读</span> |
| **探索上下文窗口**<br>Explore the context window<br>[原文](https://code.claude.com/docs/en/context-window) · [中文版](https://code.claude.com/docs/zh-CN/context-window) | Claude Code 上下文窗口在会话期间如何填充的交互式模拟。查看自动加载的内容、每个文件读取的成本以及规则和 hooks 何时触发。 | [A1](/track-a/01-agent-loop-context) [A6](/track-a/06-skills-commands) | <span class="status-tag st-deep">已精读</span> |
| **Claude Code 如何使用提示缓存**<br>How Claude Code uses prompt caching<br>[原文](https://code.claude.com/docs/en/prompt-caching) · [中文版](https://code.claude.com/docs/zh-CN/prompt-caching) | 了解为什么在 Claude Code 中切换模型会触发一个缓慢的未缓存轮次、`/compact` 的成本，以及如何检查提示缓存命中率。 | [A1](/track-a/01-agent-loop-context)（提及） | <span class="status-tag st-brief">概要</span> |

## 使用 Claude Code · Use Claude Code

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **Claude 如何记住您的项目**<br>How Claude remembers your project<br>[原文](https://code.claude.com/docs/en/memory) · [中文版](https://code.claude.com/docs/zh-CN/memory) | 使用 CLAUDE.md 或 AGENTS.md 文件为 Claude 提供持久指令，并让 Claude 通过自动记忆自动积累学习。 | [A2](/track-a/02-claude-md-memory) [A10](/track-a/10-repo-template) | <span class="status-tag st-deep">已精读</span> |
| **管理会话**<br>Manage sessions<br>[原文](https://code.claude.com/docs/en/sessions) · [中文版](https://code.claude.com/docs/zh-CN/sessions) | 命名、恢复、分支和在 Claude Code 对话之间切换。涵盖 `--continue`、`--resume`、`--from-pr`、`/resume` 选择器、会话命名、导出文本记录和文本记录存储位置。 | [A4](/track-a/04-plan-sessions-worktrees) | <span class="status-tag st-deep">已精读</span> |
| **常见工作流程**<br>Common workflows<br>[原文](https://code.claude.com/docs/en/common-workflows) · [中文版](https://code.claude.com/docs/zh-CN/common-workflows) | 使用 Claude Code 探索代码库、修复错误、重构、测试和其他日常任务的分步指南。 | — | <span class="status-tag st-brief">概要</span> |
| **提示词库**<br>Prompt library<br>[原文](https://code.claude.com/docs/en/prompt-library) · [中文版](https://code.claude.com/docs/zh-CN/prompt-library) | 复制粘贴提示词到 Claude Code，按任务和角色标记。 | — | <span class="status-tag st-brief">概要</span> |
| **Claude Code 最佳实践**<br>Best practices for Claude Code<br>[原文](https://code.claude.com/docs/en/best-practices) · [中文版](https://code.claude.com/docs/zh-CN/best-practices) | 充分发挥 Claude Code 的作用：告诉 Claude 它看不到的信息，给它一个可以运行的检查，并强制执行不允许例外的规则。 | [A1](/track-a/01-agent-loop-context) [A2](/track-a/02-claude-md-memory) [A3](/track-a/03-settings-permissions-sandbox) [A4](/track-a/04-plan-sessions-worktrees) [A5](/track-a/05-hooks-gates) [A6](/track-a/06-skills-commands) [A7](/track-a/07-subagents) [A8](/track-a/08-mcp) [A10](/track-a/10-repo-template) | <span class="status-tag st-deep">已精读</span> |

## 平台与集成 · Platforms and integrations

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **平台和集成**<br>Platforms and integrations<br>[原文](https://code.claude.com/docs/en/platforms) · [中文版](https://code.claude.com/docs/zh-CN/platforms) | 选择在哪里运行 Claude Code 以及连接什么工具。比较 CLI、Desktop、VS Code、JetBrains、Web 以及 Chrome、Slack 和 CI/CD 等集成。 | — | <span class="status-tag st-brief">概要</span> |
| **使用 Remote Control 从任何设备继续本地会话**<br>Continue local sessions from any device with Remote Control<br>[原文](https://code.claude.com/docs/en/remote-control) · [中文版](https://code.claude.com/docs/zh-CN/remote-control) | 使用 Remote Control 从您的手机、平板电脑或任何浏览器继续本地 Claude Code 会话。适用于 claude.ai/code 和 Claude 移动应用。 | — | <span class="status-tag st-brief">概要</span> |
| **让 Claude 通过 Projects 协调持续进行的工作**<br>Let Claude coordinate ongoing work with Projects<br>[原文](https://code.claude.com/docs/en/claude-projects) · [中文版](https://code.claude.com/docs/zh-CN/claude-projects) | 在一个对话中为 Claude 提供一组相关工作，让它协调共享存储库、说明和内存的并行云会话。 | — | <span class="status-tag st-brief">概要</span> |
| **Claude Code 移动版**<br>Claude Code on mobile<br>[原文](https://code.claude.com/docs/en/mobile) · [中文版](https://code.claude.com/docs/zh-CN/mobile) | 从您的手机使用 Claude 应用程序启动、监控和指导 Claude Code 任务，支持 iOS 和 Android。 | — | <span class="status-tag st-brief">概要</span> |
| **在 Chrome 中使用 Claude Code**<br>Use Claude Code with Chrome<br>[原文](https://code.claude.com/docs/en/chrome) · [中文版](https://code.claude.com/docs/zh-CN/chrome) | 将 Claude Code 连接到 Chrome 浏览器，以测试网络应用、使用控制台日志进行调试、自动填充表单以及从网页中提取数据。 | — | <span class="status-tag st-brief">概要</span> |
| **让 Claude 从 CLI 使用您的计算机**<br>Let Claude use your computer from the CLI<br>[原文](https://code.claude.com/docs/en/computer-use) · [中文版](https://code.claude.com/docs/zh-CN/computer-use) | 在 Claude Code CLI 中启用 computer use，使 Claude 能够在 macOS 上打开应用、点击、输入和查看您的屏幕。测试原生应用、调试视觉问题，以及自动化仅限 GUI 的工具，无需离开您的终端。 | — | <span class="status-tag st-brief">概要</span> |
| **在 VS Code 中使用 Claude Code**<br>Use Claude Code in VS Code<br>[原文](https://code.claude.com/docs/en/vs-code) · [中文版](https://code.claude.com/docs/zh-CN/vs-code) | 安装和配置 VS Code 的 Claude Code 扩展。获得 AI 编码协助，包括内联 diff、@-提及、计划审查和快捷键。 | — | <span class="status-tag st-brief">概要</span> |
| **JetBrains IDEs**<br>[原文](https://code.claude.com/docs/en/jetbrains) · [中文版](https://code.claude.com/docs/zh-CN/jetbrains) | 在 JetBrains IDE（包括 IntelliJ、PyCharm、WebStorm 等）中使用 Claude Code | — | <span class="status-tag st-brief">概要</span> |
| **Slack 中的 Claude Code**<br>Claude Code in Slack<br>[原文](https://code.claude.com/docs/en/slack) · [中文版](https://code.claude.com/docs/zh-CN/slack) | 从 Slack 委派编码任务。此早期版本仅在未连接到 Claude Tag 的工作区中回应来自 Pro、Max 和 Ultra 账户的提及。 | — | <span class="status-tag st-brief">概要</span> |
| **Claude Tag**<br>[原文](https://code.claude.com/docs/en/claude-tag) · [中文版](https://code.claude.com/docs/zh-CN/claude-tag) | 通过 Claude Tag 将 Claude 引入您团队的 Slack 频道，并在 claude.com 上查找其设置和使用文档。 | — | <span class="status-tag st-brief">概要</span> |

### 云端 Claude Code · Claude Code in the cloud

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **在云中开始使用 Claude Code**<br>Get started with Claude Code in the cloud<br>[原文](https://code.claude.com/docs/en/web-quickstart) · [中文版](https://code.claude.com/docs/zh-CN/web-quickstart) | 从浏览器或手机在云中运行 Claude Code。连接 GitHub 仓库、提交任务，并在无需本地设置的情况下审查 PR。 | — | <span class="status-tag st-brief">概要</span> |
| **在云端使用 Claude Code**<br>Use Claude Code in the cloud<br>[原文](https://code.claude.com/docs/en/claude-code-on-the-web) · [中文版](https://code.claude.com/docs/zh-CN/claude-code-on-the-web) | 从浏览器、手机、桌面应用或终端在云端运行 Claude Code 会话，使用 `--cloud` 和 `--teleport` 移动会话，以及自动修复 Pull Request。 | — | <span class="status-tag st-brief">概要</span> |
| **共享云端会话或 Remote Control 会话**<br>Share a cloud or Remote Control session<br>[原文](https://code.claude.com/docs/en/share-sessions) · [中文版](https://code.claude.com/docs/zh-CN/share-sessions) | 了解共享的 Claude Code 会话的接收者可以查看哪些内容，选择谁可以打开链接，以及如何停止共享。 | — | <span class="status-tag st-brief">概要</span> |
| **使用定时任务自动化工作**<br>Automate work with scheduled tasks<br>[原文](https://code.claude.com/docs/en/routines) · [中文版](https://code.claude.com/docs/zh-CN/routines) | 让 Claude Code 自动运行。创建定时任务（原名 Routine），使其在云端按计划、通过 API 调用或响应 GitHub 事件运行。 | — | <span class="status-tag st-brief">概要</span> |

### 桌面版 Claude Code · Claude Code on desktop

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **开始使用桌面应用**<br>Get started with the desktop app<br>[原文](https://code.claude.com/docs/en/desktop-quickstart) · [中文版](https://code.claude.com/docs/zh-CN/desktop-quickstart) | 安装 Claude 桌面应用，打开 Code 选项卡，并在您计算机上的项目文件夹中开始您的第一个 Claude Code 会话。 | — | <span class="status-tag st-brief">概要</span> |
| **桌面应用**<br>Desktop application<br>[原文](https://code.claude.com/docs/en/desktop) · [中文版](https://code.claude.com/docs/zh-CN/desktop) | 充分利用 Claude Code Desktop：使用 Git 隔离的并行会话、拖放窗格布局、集成终端和文件编辑器、侧边聊天、计算机使用、从手机 Dispatch 会话、可视化 diff 审查、应用预览、PR 监控、连接器和企业配置。 | — | <span class="status-tag st-brief">概要</span> |
| **Linux 上的 Claude Desktop（测试版）**<br>Claude Desktop on Linux (beta)<br>[原文](https://code.claude.com/docs/en/desktop-linux) · [中文版](https://code.claude.com/docs/zh-CN/desktop-linux) | 在 Ubuntu 和 Debian 上安装和更新 Claude 桌面应用 | — | <span class="status-tag st-brief">概要</span> |
| **Claude Code Desktop 在 WSL 中**<br>Claude Code Desktop in WSL<br>[原文](https://code.claude.com/docs/en/desktop-wsl) · [中文版](https://code.claude.com/docs/zh-CN/desktop-wsl) | 在 Windows 上的 WSL 2 发行版内运行 Code 会话 | — | <span class="status-tag st-brief">概要</span> |
| **在 Claude Code Desktop 中安排定期任务**<br>Schedule recurring tasks in Claude Code Desktop<br>[原文](https://code.claude.com/docs/en/desktop-scheduled-tasks) · [中文版](https://code.claude.com/docs/zh-CN/desktop-scheduled-tasks) | 在 Claude Code Desktop 中设置定期任务，以定期自动运行 Claude 进行日常代码审查、依赖项审计或早晨简报。 | — | <span class="status-tag st-brief">概要</span> |
| **在模拟器中测试 iOS 应用**<br>Test iOS apps in the simulator<br>[原文](https://code.claude.com/docs/en/desktop-ios-simulator) · [中文版](https://code.claude.com/docs/zh-CN/desktop-ios-simulator) | Claude Code Desktop 在 Claude 构建、运行或检查应用时，会在 iOS Simulator 窗格中打开您的应用。 | — | <span class="status-tag st-brief">概要</span> |

## 代码审查与 Pull Request · Code review and pull requests

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **Claude Ship**<br>[原文](https://code.claude.com/docs/en/claude-ship) · [中文版](https://code.claude.com/docs/zh-CN/claude-ship) | 了解用于 GitHub Pull Request 的 Claude Ship Agent：Code Review、PR Steward 和 Claude Approvals | [A9](/track-a/09-claude-ship) | <span class="status-tag st-deep">已精读</span> |
| **Claude Code 与 GitHub Enterprise Server**<br>Claude Code with GitHub Enterprise Server<br>[原文](https://code.claude.com/docs/en/github-enterprise-server) · [中文版](https://code.claude.com/docs/zh-CN/github-enterprise-server) | 将 Claude Code 连接到自托管的 GitHub Enterprise Server 实例，用于云会话、代码审查和插件市场。 | — | <span class="status-tag st-brief">概要</span> |

### Code Review

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **Code Review**<br>[原文](https://code.claude.com/docs/en/code-review) · [中文版](https://code.claude.com/docs/zh-CN/code-review) | 使用 Code Review 捕获 GitHub Pull Request 中的错误：Claude 审查每项更改、验证其发现，并发布内联评论。适用于 Team 和 Enterprise 套餐 | [A9](/track-a/09-claude-ship) | <span class="status-tag st-deep">已精读</span> |
| **设置 Code Review**<br>Set up Code Review<br>[原文](https://code.claude.com/docs/en/code-review-setup) · [中文版](https://code.claude.com/docs/zh-CN/code-review-setup) | 为您的 Claude 组织启用 Code Review：连接 GitHub、安装 Claude GitHub App、选择仓库，并设置审查的运行时机 | [A9](/track-a/09-claude-ship) | <span class="status-tag st-deep">已精读</span> |
| **自定义 Code Review**<br>Customize Code Review<br>[原文](https://code.claude.com/docs/en/code-review-customize) · [中文版](https://code.claude.com/docs/zh-CN/code-review-customize) | 使用 REVIEW.md 和 CLAUDE.md 调整 Code Review 在您的 Pull Request 上标记的内容：重新校准严重程度、跳过路径、添加检查项，并查看适用的是哪个副本。 | [A9](/track-a/09-claude-ship) [A10](/track-a/10-repo-template) | <span class="status-tag st-deep">已精读</span> |
| **阅读和请求 Pull Request 上的审查**<br>Read and request reviews on a pull request<br>[原文](https://code.claude.com/docs/en/code-review-pull-requests) · [中文版](https://code.claude.com/docs/zh-CN/code-review-pull-requests) | 阅读 GitHub Pull Request 上的 Code Review 发现，回复或忽略这些发现，并使用 `@claude review` 请求审查。 | [A9](/track-a/09-claude-ship) | <span class="status-tag st-deep">已精读</span> |
| **Code Review 费用和用量**<br>Code Review costs and usage<br>[原文](https://code.claude.com/docs/en/code-review-costs) · [中文版](https://code.claude.com/docs/zh-CN/code-review-costs) | 估算并限制您的组织在 Claude Code Review 上的支出：审查如何通过使用额度计费、哪些因素影响费用，以及在哪里跟踪用量。 | [A9](/track-a/09-claude-ship) | <span class="status-tag st-deep">已精读</span> |
| **Code Review 故障排除**<br>Troubleshoot Code Review<br>[原文](https://code.claude.com/docs/en/code-review-troubleshooting) · [中文版](https://code.claude.com/docs/zh-CN/code-review-troubleshooting) | 修复未启动、失败或因预算原因被跳过的 Code Review，查找缺失的发现项，并解决设置和 `REVIEW.md` 问题。 | [A9](/track-a/09-claude-ship) | <span class="status-tag st-deep">已精读</span> |

### PR 管理员 · PR Steward

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **PR Steward**<br>[原文](https://code.claude.com/docs/en/pr-steward) · [中文版](https://code.claude.com/docs/zh-CN/pr-steward) | 让 PR Steward 向您的 GitHub Pull Request 推送修复，处理失败的检查、合并冲突和审查反馈 | [A9](/track-a/09-claude-ship) | <span class="status-tag st-deep">已精读</span> |
| **设置 PR Steward**<br>Set up PR Steward<br>[原文](https://code.claude.com/docs/en/pr-steward-setup) · [中文版](https://code.claude.com/docs/zh-CN/pr-steward-setup) | 为您的 Claude 组织启用 PR Steward：要求审查、添加仓库、设置支出限额，并选择它何时启动以及为哪些作者工作 | [A9](/track-a/09-claude-ship) | <span class="status-tag st-deep">已精读</span> |
| **在 Pull Request 上使用 PR Steward**<br>Work with PR Steward on a pull request<br>[原文](https://code.claude.com/docs/en/pr-steward-pull-requests) · [中文版](https://code.claude.com/docs/zh-CN/pr-steward-pull-requests) | 了解 PR Steward 会在您的 GitHub Pull Request 上添加哪些内容，如何向它提供指令，如何通过评论或标签启动或停止它，以及如何限制它为您执行的操作 | [A9](/track-a/09-claude-ship) | <span class="status-tag st-deep">已精读</span> |
| **PR Steward 可以访问哪些内容**<br>What PR Steward can access<br>[原文](https://code.claude.com/docs/en/pr-steward-security) · [中文版](https://code.claude.com/docs/zh-CN/pr-steward-security) | 查看 PR Steward 使用的 GitHub 身份、权限和仓库，其会话运行的位置，以及限制批准和合并的因素 | [A9](/track-a/09-claude-ship) | <span class="status-tag st-deep">已精读</span> |
| **PR Steward 故障排除**<br>Troubleshoot PR Steward<br>[原文](https://code.claude.com/docs/en/pr-steward-troubleshooting) · [中文版](https://code.claude.com/docs/zh-CN/pr-steward-troubleshooting) | 修复 PR Steward 在 GitHub Pull Request 上未启动、已停止或已暂停的问题，并解决 Owner 在设置过程中看到的消息 | — | <span class="status-tag st-brief">概要</span> |

### Claude 批准 · Claude Approvals

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **Claude Approvals**<br>[原文](https://code.claude.com/docs/en/approvals) · [中文版](https://code.claude.com/docs/zh-CN/approvals) | 通过策略文件和 Pull Request 检查，设置 GitHub 仓库中某个路径需要多少人审批，以及 Claude 可以在哪些地方审批 | [A9](/track-a/09-claude-ship) [A10](/track-a/10-repo-template) | <span class="status-tag st-deep">已精读</span> |
| **设置 Claude Approvals**<br>Set up Claude Approvals<br>[原文](https://code.claude.com/docs/en/approvals-setup) · [中文版](https://code.claude.com/docs/zh-CN/approvals-setup) | 在 GitHub 仓库中启用 Claude Approvals：从观察模式开始，强制执行策略，将检查设为必需，限制其花费，以及将其关闭 | [A9](/track-a/09-claude-ship) [A10](/track-a/10-repo-template) | <span class="status-tag st-deep">已精读</span> |
| **在 Pull Request 上使用 Claude Approvals**<br>Work with Claude Approvals on a pull request<br>[原文](https://code.claude.com/docs/en/approvals-pull-requests) · [中文版](https://code.claude.com/docs/zh-CN/approvals-pull-requests) | 了解 Claude Approvals 检查标题的含义及后续操作，使用评论命令，并处理来自 Claude 和来自 fork 的 Pull Request | — | <span class="status-tag st-brief">概要</span> |
| **Claude Approvals 与您的 GitHub 规则**<br>Claude Approvals and your GitHub rules<br>[原文](https://code.claude.com/docs/en/approvals-github-rules) · [中文版](https://code.claude.com/docs/zh-CN/approvals-github-rules) | 了解 Claude Approvals 检查如何与必需审查、CODEOWNERS 和合并队列协同工作、哪些内容可以在无人参与的情况下合并，以及谁可以更改策略 | [A9](/track-a/09-claude-ship) | <span class="status-tag st-deep">已精读</span> |
| **Claude Approvals 策略文件参考**<br>Claude Approvals policy file reference<br>[原文](https://code.claude.com/docs/en/approvals-policy) · [中文版](https://code.claude.com/docs/zh-CN/approvals-policy) | Claude Approvals 策略文件 `.claude/approvals.yml` 的参考：其键、规则如何组合、审批如何计数，以及一个示例策略。 | [A9](/track-a/09-claude-ship) [A10](/track-a/10-repo-template) | <span class="status-tag st-deep">已精读</span> |
| **Claude Approvals 分类器**<br>Claude Approvals classifiers<br>[原文](https://code.claude.com/docs/en/approvals-classifiers) · [中文版](https://code.claude.com/docs/zh-CN/approvals-classifiers) | 让 Claude Approvals 规则依据 Code Review 的回答或您定义的问题来决定。添加分类器、读取其回答，并限制一次运行的费用。 | — | <span class="status-tag st-brief">概要</span> |
| **Claude Approvals 故障排除**<br>Troubleshoot Claude Approvals<br>[原文](https://code.claude.com/docs/en/approvals-troubleshooting) · [中文版](https://code.claude.com/docs/zh-CN/approvals-troubleshooting) | 修复未出现或未通过的 Claude Approvals 检查、被 Approvals 拒绝的策略文件，以及未给出答案的分类器 | — | <span class="status-tag st-brief">概要</span> |

### /ship 和 /steward · /ship and /steward

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **使用 /ship 和 /steward 让 Pull Request 做好合并准备**<br>Get a pull request ready with /ship and /steward<br>[原文](https://code.claude.com/docs/en/ship-command) · [中文版](https://code.claude.com/docs/zh-CN/ship-command) | 运行 `/ship` 来创建 GitHub Pull Request、获取审查，并让 Claude 处理反馈和失败的检查；或运行 `/steward`，对已打开的 Pull Request 跳过审查。 | [A9](/track-a/09-claude-ship) [A10](/track-a/10-repo-template) | <span class="status-tag st-deep">已精读</span> |
| **排除 /ship 和 /steward 的故障**<br>Troubleshoot /ship and /steward<br>[原文](https://code.claude.com/docs/en/ship-command-troubleshooting) · [中文版](https://code.claude.com/docs/zh-CN/ship-command-troubleshooting) | 查找 `/ship` 或 `/steward` 的消息或症状：命令缺失、未提交或推送任何内容、监视未启动，或监视已停止。 | [A9](/track-a/09-claude-ship) [A10](/track-a/10-repo-template) | <span class="status-tag st-deep">已精读</span> |

### 按需审查 · On-demand reviews

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **使用 /code-review 在本地审查**<br>Review locally with /code-review<br>[原文](https://code.claude.com/docs/en/code-review-local) · [中文版](https://code.claude.com/docs/zh-CN/code-review-local) | 在 Claude Code 会话中运行 `/code-review`，查找分支变更中的 bug，将审查指向 Pull Request 或路径，并让 Claude 应用修复。 | [A9](/track-a/09-claude-ship) [A10](/track-a/10-repo-template) | <span class="status-tag st-deep">已精读</span> |
| **使用 Ultrareview 查找错误**<br>Find bugs with ultrareview<br>[原文](https://code.claude.com/docs/en/ultrareview) · [中文版](https://code.claude.com/docs/zh-CN/ultrareview) | 使用 /code-review ultra 在云中运行深度多代理代码审查，在合并前查找和验证错误。 | [A9](/track-a/09-claude-ship)（提及） | <span class="status-tag st-brief">概要</span> |

### 安全扫描 · Security scans

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **在 Claude 编写代码时捕获安全问题**<br>Catch security issues as Claude writes code<br>[原文](https://code.claude.com/docs/en/security-guidance) · [中文版](https://code.claude.com/docs/zh-CN/security-guidance) | 安装 security-guidance 插件，让 Claude 在编写代码时自动审查其代码更改中的漏洞，并在同一会话中修复这些问题。 | — | <span class="status-tag st-brief">概要</span> |
| **扫描代码库中的漏洞**<br>Scan your codebase for vulnerabilities<br>[原文](https://code.claude.com/docs/en/claude-security) · [中文版](https://code.claude.com/docs/zh-CN/claude-security) | 安装 Claude Security plugin 以在 Claude Code 会话中扫描代码库中的漏洞，并将发现的问题转化为您可以审查和应用的补丁。 | — | <span class="status-tag st-brief">概要</span> |

### 在您自己的 CI 中运行 Claude · Run Claude in your own CI

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **Claude Code GitHub Actions**<br>[原文](https://code.claude.com/docs/en/github-actions) · [中文版](https://code.claude.com/docs/zh-CN/github-actions) | 在 GitHub Actions 工作流中运行 Claude Code，响应 @claude 提及、自动化任务并将 issue 转换为拉取请求 | — | <span class="status-tag st-brief">概要</span> |
| **通过云提供商使用 Claude Code GitHub Actions**<br>Use Claude Code GitHub Actions with cloud providers<br>[原文](https://code.claude.com/docs/en/github-actions-cloud-providers) · [中文版](https://code.claude.com/docs/zh-CN/github-actions-cloud-providers) | 通过 Amazon Bedrock、Google Cloud 的 Agent Platform 或 Microsoft Foundry 而不是 Claude API 运行 Claude Code GitHub Actions | — | <span class="status-tag st-brief">概要</span> |
| **Claude Code GitLab CI/CD**<br>[原文](https://code.claude.com/docs/en/gitlab-ci-cd) · [中文版](https://code.claude.com/docs/zh-CN/gitlab-ci-cd) | 了解如何将 Claude Code 集成到您的 GitLab CI/CD 开发工作流中 | — | <span class="status-tag st-brief">概要</span> |

:::
