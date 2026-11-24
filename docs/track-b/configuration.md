---
title: 配置 · Configuration
outline: [2, 3]
editLink: false
---

<!-- 本页由 scripts/gen-track-b.mjs 根据 data/llms-snapshot.txt 与 data/llms-zh-cn-snapshot.txt 生成，请勿手改。 -->

# 配置 · Configuration

官方文档“Configuration”分区，共 **27** 页，其中 **7** 页在 A 路线里对照原文精读过。顺序与分组跟随官方导航；中文概要取自官方简体中文索引。

- <span class="status-tag st-deep">已精读</span>：A 路线某一章把它列为“原文链接”，逐条核对过
- <span class="status-tag st-brief">概要</span>：只有官方摘要；“A 路线”一栏写“（提及）”表示章节正文引用过它

::: v-pre

## 设置 · Settings

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **设置文件和优先级**<br>Settings files and precedence<br>[原文](https://code.claude.com/docs/en/settings) · [中文版](https://code.claude.com/docs/zh-CN/settings) | 更改 Claude Code 设置，选择键所属的作用域，验证更改，并了解当键在多个位置设置时 Claude Code 使用哪个值。 | [A3](/track-a/03-settings-permissions-sandbox) [A10](/track-a/10-repo-template) | <span class="status-tag st-deep">已精读</span> |
| **所有设置**<br>All settings<br>[原文](https://code.claude.com/docs/en/settings-reference) · [中文版](https://code.claude.com/docs/zh-CN/settings-reference) | Claude Code settings.json 键的参考：每个键的放置位置、类型和默认值，以及可直接粘贴的示例，并附有键索引。 | [A3](/track-a/03-settings-permissions-sandbox) [A10](/track-a/10-repo-template) [A1](/track-a/01-agent-loop-context)（提及） | <span class="status-tag st-deep">已精读</span> |
| **示例设置文件**<br>Example settings files<br>[原文](https://code.claude.com/docs/en/settings-example) · [中文版](https://code.claude.com/docs/zh-CN/settings-example) | 为开发者、团队和组织提供的现实 settings.json 文件：复制一个，保留你想要的键，并更改值。 | [A3](/track-a/03-settings-permissions-sandbox) | <span class="status-tag st-deep">已精读</span> |

## 权限和沙箱隔离 · Permissions and sandboxing

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **配置权限**<br>Configure permissions<br>[原文](https://code.claude.com/docs/en/permissions) · [中文版](https://code.claude.com/docs/zh-CN/permissions) | 通过细粒度权限规则、模式和托管策略来控制 Claude Code 可以访问和执行的操作。 | [A3](/track-a/03-settings-permissions-sandbox) [A5](/track-a/05-hooks-gates) [A8](/track-a/08-mcp) [A10](/track-a/10-repo-template) | <span class="status-tag st-deep">已精读</span> |
| **选择权限模式**<br>Choose a permission mode<br>[原文](https://code.claude.com/docs/en/permission-modes) · [中文版](https://code.claude.com/docs/zh-CN/permission-modes) | 控制 Claude 在采取行动前是否需要征求您的同意。在 CLI 中使用 Shift+Tab 切换权限模式，在 VS Code 中使用模式指示器，或在 Desktop 中使用模式选择器。 | [A3](/track-a/03-settings-permissions-sandbox) [A4](/track-a/04-plan-sessions-worktrees) | <span class="status-tag st-deep">已精读</span> |
| **自动模式分类器请求费用**<br>Auto mode classifier request charges<br>[原文](https://code.claude.com/docs/en/auto-mode-classifier-billing) · [中文版](https://code.claude.com/docs/zh-CN/auto-mode-classifier-billing) | 解决 Claude Code 通知说此会话不符合自动模式免费分类器请求条件的问题：它的含义、为什么出现，以及该怎么做。 | — | <span class="status-tag st-brief">概要</span> |
| **配置沙箱化的 Bash 工具**<br>Configure the sandboxed Bash tool<br>[原文](https://code.claude.com/docs/en/sandboxing) · [中文版](https://code.claude.com/docs/zh-CN/sandboxing) | 使用内置沙箱限制 Claude Code 的 shell 命令可以访问的文件和网络主机。启用沙箱、设置边界，并修复它导致的问题。 | [A3](/track-a/03-settings-permissions-sandbox) | <span class="status-tag st-deep">已精读</span> |
| **选择沙箱环境**<br>Choose a sandbox environment<br>[原文](https://code.claude.com/docs/en/sandbox-environments) · [中文版](https://code.claude.com/docs/zh-CN/sandbox-environments) | 比较 Claude Code 沙箱选项：内置沙箱化 Bash 工具、沙箱运行时、开发容器、Docker 和虚拟机。为您的威胁模型选择合适的隔离方案。 | — | <span class="status-tag st-brief">概要</span> |

## 环境 · Environments

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **配置云环境**<br>Configure cloud environments<br>[原文](https://code.claude.com/docs/en/cloud-environments) · [中文版](https://code.claude.com/docs/zh-CN/cloud-environments) | 为 Claude Code 云端会话配置云环境：网络访问级别、环境变量、设置脚本和环境缓存。 | — | <span class="status-tag st-brief">概要</span> |

### 自托管环境 · Self-hosted environments

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **自托管环境**<br>Self-hosted environments<br>[原文](https://code.claude.com/docs/en/self-hosted-environments) · [中文版](https://code.claude.com/docs/zh-CN/self-hosted-environments) | 在您控制的基础设施上运行 Claude Code 云会话：设置自托管环境、部署运行器，并将会话路由到您自己的计算资源。 | — | <span class="status-tag st-brief">概要</span> |
| **自托管环境快速入门**<br>Self-hosted environments quickstart<br>[原文](https://code.claude.com/docs/en/self-hosted-environments-quickstart) · [中文版](https://code.claude.com/docs/zh-CN/self-hosted-environments-quickstart) | 设置您的第一个自托管环境：安装 Claude Code、创建环境、启动运行器，并将会话路由到该环境。 | — | <span class="status-tag st-brief">概要</span> |
| **将自托管环境部署到生产环境**<br>Deploy self-hosted environments to production<br>[原文](https://code.claude.com/docs/en/self-hosted-environments-deploy) · [中文版](https://code.claude.com/docs/zh-CN/self-hosted-environments-deploy) | 在生产环境中运行自托管运行器：安全加固、网络出站流量控制、git 凭证、Kubernetes 和 Compose 配方以及故障排除。 | — | <span class="status-tag st-brief">概要</span> |
| **在自托管环境中自定义会话**<br>Customize sessions in self-hosted environments<br>[原文](https://code.claude.com/docs/en/self-hosted-environments-configuration) · [中文版](https://code.claude.com/docs/zh-CN/self-hosted-environments-configuration) | 使用包装脚本在自托管环境会话中自定义每个会话的凭据、生命周期 hook 和按需运行程序生成。 | — | <span class="status-tag st-brief">概要</span> |
| **端到端测试自托管环境**<br>Test self-hosted environments end to end<br>[原文](https://code.claude.com/docs/en/self-hosted-environments-testing) · [中文版](https://code.claude.com/docs/zh-CN/self-hosted-environments-testing) | 从 CI 验证自托管运行器镜像：使用 CLI 分派会话，通过 Stop hook 读取 Claude 的回复，并编写完整循环脚本。 | — | <span class="status-tag st-brief">概要</span> |
| **自托管环境参考**<br>Self-hosted environments reference<br>[原文](https://code.claude.com/docs/en/self-hosted-environments-reference) · [中文版](https://code.claude.com/docs/zh-CN/self-hosted-environments-reference) | 自托管运行器和编排器的参考：CLI 标志、环境变量和 Prometheus 指标。 | — | <span class="status-tag st-brief">概要</span> |
| **在自托管环境中验证会话身份**<br>Verify session identity in self-hosted environments<br>[原文](https://code.claude.com/docs/en/self-hosted-environments-identity) · [中文版](https://code.claude.com/docs/zh-CN/self-hosted-environments-identity) | 验证 CLAUDE_CODE_SESSION_ACCESS_TOKEN JWT，以便网络上的服务可以信任来自自托管环境中会话的请求。 | — | <span class="status-tag st-brief">概要</span> |

## 模型与回复 · Model and responses

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **模型配置**<br>Model configuration<br>[原文](https://code.claude.com/docs/en/model-config) · [中文版](https://code.claude.com/docs/zh-CN/model-config) | 配置 Claude Code 使用的模型、工作量级别、扩展上下文和自动压缩窗口 | [A1](/track-a/01-agent-loop-context) | <span class="status-tag st-deep">已精读</span> |
| **使用快速模式加快响应速度**<br>Speed up responses with fast mode<br>[原文](https://code.claude.com/docs/en/fast-mode) · [中文版](https://code.claude.com/docs/zh-CN/fast-mode) | 通过使用 `/fast` 切换快速模式，在 Claude Code 中获得更快的 Opus 和 Fable 响应。 | — | <span class="status-tag st-brief">概要</span> |
| **使用顾问工具升级困难决策**<br>Escalate hard decisions with the advisor tool<br>[原文](https://code.claude.com/docs/en/advisor) · [中文版](https://code.claude.com/docs/zh-CN/advisor) | 将您的主模型与更强大的顾问模型配对，Claude 在任务期间的关键时刻咨询该模型。 | — | <span class="status-tag st-brief">概要</span> |
| **使用 Code Mode 通过代码运行工具调用**<br>Run tool calls from code with Code Mode<br>[原文](https://code.claude.com/docs/en/code-mode) · [中文版](https://code.claude.com/docs/zh-CN/code-mode) | 试用 Code Mode，这是一项实验性功能，Claude 会在其中编写 JavaScript，在一个步骤中进行多次工具调用。 | — | <span class="status-tag st-brief">概要</span> |
| **输出样式**<br>Output styles<br>[原文](https://code.claude.com/docs/en/output-styles) · [中文版](https://code.claude.com/docs/zh-CN/output-styles) | 通过内置输出样式（如简洁或解释性）或自定义样式来改变 Claude Code 的角色、语气和响应格式。 | — | <span class="status-tag st-brief">概要</span> |

## 界面 · Interface

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **为 Claude Code 配置您的终端**<br>Configure your terminal for Claude Code<br>[原文](https://code.claude.com/docs/en/terminal-config) · [中文版](https://code.claude.com/docs/zh-CN/terminal-config) | 修复 Shift+Enter 以插入新行、在 Claude 完成时获得终端铃声、配置 tmux、匹配颜色主题，以及在 Claude Code CLI 中启用 Vim 模式。 | — | <span class="status-tag st-brief">概要</span> |
| **全屏渲染**<br>Fullscreen rendering<br>[原文](https://code.claude.com/docs/en/fullscreen) · [中文版](https://code.claude.com/docs/zh-CN/fullscreen) | 启用更流畅、无闪烁的渲染模式，支持鼠标操作，在长对话中保持稳定的内存使用。 | — | <span class="status-tag st-brief">概要</span> |
| **使用 Claude Code 与屏幕阅读器**<br>Use Claude Code with a screen reader<br>[原文](https://code.claude.com/docs/en/accessibility) · [中文版](https://code.claude.com/docs/zh-CN/accessibility) | 为 VoiceOver 和 NVDA 等屏幕阅读器设置 Claude Code，以及屏幕放大镜、减少动画和色盲友好主题的设置。 | — | <span class="status-tag st-brief">概要</span> |
| **语音听写**<br>Voice dictation<br>[原文](https://code.claude.com/docs/en/voice-dictation) · [中文版](https://code.claude.com/docs/zh-CN/voice-dictation) | 在 Claude Code CLI 中使用按住录音或点击录音的语音听写功能来说出你的提示词。 | — | <span class="status-tag st-brief">概要</span> |
| **自定义你的状态行**<br>Customize your status line<br>[原文](https://code.claude.com/docs/en/statusline) · [中文版](https://code.claude.com/docs/zh-CN/statusline) | 配置自定义状态栏以监控 Claude Code 中的上下文窗口使用情况、成本和 git 状态 | — | <span class="status-tag st-brief">概要</span> |
| **自定义快捷键**<br>Customize keyboard shortcuts<br>[原文](https://code.claude.com/docs/en/keybindings) · [中文版](https://code.claude.com/docs/zh-CN/keybindings) | 使用快捷键配置文件在 Claude Code 中自定义快捷键。 | — | <span class="status-tag st-brief">概要</span> |

:::
