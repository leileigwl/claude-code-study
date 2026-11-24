---
title: 插件 · Plugins
outline: [2, 3]
editLink: false
---

<!-- 本页由 scripts/gen-track-b.mjs 根据 data/llms-snapshot.txt 与 data/llms-zh-cn-snapshot.txt 生成，请勿手改。 -->

# 插件 · Plugins

官方文档“Plugins”分区，共 **31** 页，其中 **0** 页在 A 路线里对照原文精读过。顺序与分组跟随官方导航；中文概要取自官方简体中文索引。

- <span class="status-tag st-deep">已精读</span>：A 路线某一章把它列为“原文链接”，逐条核对过
- <span class="status-tag st-brief">概要</span>：只有官方摘要；“A 路线”一栏写“（提及）”表示章节正文引用过它

::: v-pre

## 插件 · Plugins

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **插件概览**<br>Plugins overview<br>[原文](https://code.claude.com/docs/en/plugins/overview) · [中文版](https://code.claude.com/docs/zh-CN/plugins/overview) | 了解什么是 Claude Code 插件，何时需要使用插件而不是独立的 skill 或 MCP 服务器，以及应该阅读哪个页面来安装或创建插件。 | — | <span class="status-tag st-brief">概要</span> |

## 使用插件 · Use plugins

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **安装和管理插件**<br>Install and manage plugins<br>[原文](https://code.claude.com/docs/en/plugins/install) · [中文版](https://code.claude.com/docs/zh-CN/plugins/install) | 从任何使用的界面上的市场安装 Claude Code 插件，选择安装范围，以及稍后更新或删除它们。 | — | <span class="status-tag st-brief">概要</span> |
| **Anthropic 的插件市场**<br>Anthropic's marketplaces<br>[原文](https://code.claude.com/docs/en/plugins/anthropic-marketplaces) · [中文版](https://code.claude.com/docs/zh-CN/plugins/anthropic-marketplaces) | Anthropic 为 Claude Code 提供的官方和社区插件市场：它们的名称、仓库、如何添加每个市场，以及在哪里浏览它们的插件。 | — | <span class="status-tag st-brief">概要</span> |
| **代码智能插件**<br>Code intelligence plugins<br>[原文](https://code.claude.com/docs/en/plugins/code-intelligence) · [中文版](https://code.claude.com/docs/zh-CN/plugins/code-intelligence) | 安装语言服务器插件，使 Claude 在编辑后能看到类型错误并通过符号导航代码，并回答 LSP 插件推荐对话框。 | — | <span class="status-tag st-brief">概要</span> |
| **插件安全和信任**<br>Plugin security and trust<br>[原文](https://code.claude.com/docs/en/plugins/security) · [中文版](https://code.claude.com/docs/zh-CN/plugins/security) | 在安装插件之前决定是否信任它，从插件在您的机器上可以做什么，到如何审查和删除它。 | — | <span class="status-tag st-brief">概要</span> |

## 创建插件 · Create plugins

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **创建 Claude Code 插件**<br>Create a Claude Code plugin<br>[原文](https://code.claude.com/docs/en/plugins/create) · [中文版](https://code.claude.com/docs/zh-CN/plugins/create) | 从空目录构建您的第一个 Claude Code 插件，在没有市场的情况下测试它，并转换现有的 .claude/ 设置。 | — | <span class="status-tag st-brief">概要</span> |
| **向插件添加组件**<br>Add components to a plugin<br>[原文](https://code.claude.com/docs/en/plugins/components) · [中文版](https://code.claude.com/docs/zh-CN/plugins/components) | 向 Claude Code 插件添加 skill、hook、MCP 服务器和其他组件类型，并为每种类型提供可通过验证的示例。 | — | <span class="status-tag st-brief">概要</span> |
| **插件依赖**<br>Plugin dependencies<br>[原文](https://code.claude.com/docs/en/plugins/dependencies) · [中文版](https://code.claude.com/docs/zh-CN/plugins/dependencies) | 声明你的插件所依赖的其他插件，使用版本范围如 ^1.2，并了解 Claude Code 如何安装、解析和修剪它们。 | — | <span class="status-tag st-brief">概要</span> |
| **使用 evals 测试插件**<br>Test plugins with evals<br>[原文](https://code.claude.com/docs/en/plugin-evals) · [中文版](https://code.claude.com/docs/zh-CN/plugin-evals) | 为您的 Claude Code 插件编写 eval 用例，使用 claude plugin eval 运行它们，对结果进行评分，与无插件基线进行比较，并在 CI 中基于分数进行门控。 | — | <span class="status-tag st-brief">概要</span> |
| **发布和分发插件**<br>Publish and distribute a plugin<br>[原文](https://code.claude.com/docs/en/plugins/publish) · [中文版](https://code.claude.com/docs/zh-CN/plugins/publish) | 通过您自己的市场或 Anthropic 的目录发布 Claude Code 插件，包括发布前检查清单以及用户如何获取更新。 | — | <span class="status-tag st-brief">概要</span> |
| **测量插件成本和使用情况**<br>Measure plugin cost and usage<br>[原文](https://code.claude.com/docs/en/plugins/measure) · [中文版](https://code.claude.com/docs/zh-CN/plugins/measure) | 测量 Claude Code 插件的令牌成本，了解人们是否仍在使用它，并为组织范围的插件问题选择遥测事件。 | — | <span class="status-tag st-brief">概要</span> |
| **从您的 CLI 推荐您的插件**<br>Recommend your plugin from your CLI<br>[原文](https://code.claude.com/docs/en/plugins/cli-hints) · [中文版](https://code.claude.com/docs/zh-CN/plugins/cli-hints) | 通过从您的 CLI 或 SDK 发出 claude-code-hint 标签，提示 Claude Code 用户安装您的官方市场插件。 | — | <span class="status-tag st-brief">概要</span> |

## mod · Mods

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **Mods 概览**<br>Mods overview<br>[原文](https://code.claude.com/docs/en/plugins/mods/overview) · [中文版](https://code.claude.com/docs/zh-CN/plugins/mods/overview) | 使用 mod 向 Claude Code 添加窗格、命令和工具调用规则。了解 mod 可以做什么、如何创建或安装 mod，以及 mod 在哪里运行。 | — | <span class="status-tag st-brief">概要</span> |
| **创建一个 mod**<br>Create a mod<br>[原文](https://code.claude.com/docs/en/plugins/mods/create) · [中文版](https://code.claude.com/docs/zh-CN/plugins/mods/create) | 让 Claude 从描述中编写一个 Claude Code mod，或者自己编写一个来计算工具调用并添加命令。学习重新加载和验证循环。 | — | <span class="status-tag st-brief">概要</span> |
| **mod 参考**<br>Mods reference<br>[原文](https://code.claude.com/docs/en/plugins/mods/reference) · [中文版](https://code.claude.com/docs/zh-CN/plugins/mods/reference) | Claude Code mod 的完整参考：hook 模块布局、事件、mods API 方法、渲染位置、按使用入口划分的元素、限制和设置。 | — | <span class="status-tag st-brief">概要</span> |

### 构建 · Build

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **使用 mod 在界面中绘制**<br>Draw in the interface with a mod<br>[原文](https://code.claude.com/docs/en/plugins/mods/interface) · [中文版](https://code.claude.com/docs/zh-CN/plugins/mods/interface) | 从 Claude Code mod 中绘制窗格、输入框上方的条带、按钮和文本字段，处理按键和输入，并在重绘和会话之间保持状态。 | — | <span class="status-tag st-brief">概要</span> |
| **mod 界面元素图库**<br>Interface gallery for mods<br>[原文](https://code.claude.com/docs/en/plugins/mods/gallery) · [中文版](https://code.claude.com/docs/zh-CN/plugins/mods/gallery) | 查看 Claude Code mod 可以绘制的界面元素，例如文本、按钮、输入框、Markdown、代码和 diff，并附有示例代码和终端截图。 | — | <span class="status-tag st-brief">概要</span> |
| **使用 mod 响应事件**<br>React to events with a mod<br>[原文](https://code.claude.com/docs/en/plugins/mods/events) · [中文版](https://code.claude.com/docs/zh-CN/plugins/mods/events) | 从 mod 处理 Claude Code 事件：观察、重写或回答工具调用、提示和轮次，过滤 hook 处理的事件，并为其他 mod 做计划。 | — | <span class="status-tag st-brief">概要</span> |
| **使用 mods API**<br>Use the mods API<br>[原文](https://code.claude.com/docs/en/plugins/mods/api) · [中文版](https://code.claude.com/docs/zh-CN/plugins/mods/api) | 从 Claude Code mod 调用 mods API 来添加命令和工具、调用模型、在计时器上运行工作、向其他会话发送消息，以及访问文件和网络。 | — | <span class="status-tag st-brief">概要</span> |

### 测试与故障排除 · Test and troubleshoot

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **测试 mod**<br>Test a mod<br>[原文](https://code.claude.com/docs/en/plugins/mods/test) · [中文版](https://code.claude.com/docs/zh-CN/plugins/mods/test) | 为 Claude Code mod 编写自动化测试，该测试可以触发事件、存根 Claude Code 的答案、按下按钮，无需会话、登录或网络。 | — | <span class="status-tag st-brief">概要</span> |
| **排查 mod 问题**<br>Troubleshoot a mod<br>[原文](https://code.claude.com/docs/en/plugins/mods/troubleshoot) · [中文版](https://code.claude.com/docs/zh-CN/plugins/mods/troubleshoot) | 了解为什么 Claude Code mod 不起作用：将症状或消息与其原因匹配，查找拒绝消息，并阅读调试日志。 | — | <span class="status-tag st-brief">概要</span> |

## 运营市场 · Run a marketplace

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **创建一个 marketplace**<br>Create a marketplace<br>[原文](https://code.claude.com/docs/en/plugins/create-marketplace) · [中文版](https://code.claude.com/docs/zh-CN/plugins/create-marketplace) | 从 marketplace.json 文件构建一个 plugin marketplace，并在托管之前在本地测试它。 | — | <span class="status-tag st-brief">概要</span> |
| **托管和维护一个 marketplace**<br>Host and maintain a marketplace<br>[原文](https://code.claude.com/docs/en/plugins/host-marketplace) · [中文版](https://code.claude.com/docs/zh-CN/plugins/host-marketplace) | 发布一个插件 marketplace，让用户可以通过它来访问，授予对私有 marketplace 的访问权限，并在推送更新和重命名后不会破坏安装。 | — | <span class="status-tag st-brief">概要</span> |
| **为您的组织推荐插件**<br>Recommend plugins for your org<br>[原文](https://code.claude.com/docs/en/plugins/relevance) · [中文版](https://code.claude.com/docs/zh-CN/plugins/relevance) | 向 marketplace 插件条目添加相关性块，以便当用户的工作匹配时 Claude Code 会建议安装这些插件，并在托管设置中将 marketplace 列入允许列表。 | — | <span class="status-tag st-brief">概要</span> |

## 管理组织的插件 · Manage plugins for your organization

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **为您的组织管理 Claude Code plugins**<br>Manage Claude Code plugins for your organization<br>[原文](https://code.claude.com/docs/en/plugins/org) · [中文版](https://code.claude.com/docs/zh-CN/plugins/org) | 通过托管设置控制 Claude Code 在组织中每台机器上安装和允许的 plugins。 | — | <span class="status-tag st-brief">概要</span> |
| **为您的组织管理 mods**<br>Manage mods for your organization<br>[原文](https://code.claude.com/docs/en/plugins/mods/admin) · [中文版](https://code.claude.com/docs/zh-CN/plugins/mods/admin) | 使用托管设置控制 Claude Code mods：停止用户安装的 mods、仅允许您自己的 mods、查看 mod 可以执行的操作，以及使用您自己的 mod 强制执行策略。 | — | <span class="status-tag st-brief">概要</span> |

## 故障排除 · Troubleshooting

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **排查插件问题**<br>Troubleshoot plugins<br>[原文](https://code.claude.com/docs/en/plugins/troubleshooting) · [中文版](https://code.claude.com/docs/zh-CN/plugins/troubleshooting) | 修复 Claude Code 中的插件错误。找到您看到的确切消息，按照 /plugin 运行、安装和组织策略的阶段分组。 | — | <span class="status-tag st-brief">概要</span> |
| **插件加载参考**<br>Plugin loading reference<br>[原文](https://code.claude.com/docs/en/plugins/loading) · [中文版](https://code.claude.com/docs/zh-CN/plugins/loading) | 追踪 Claude Code 从何处加载每个插件，哪个设置文件决定是否加载，以及为什么更新没有产生任何变化。 | — | <span class="status-tag st-brief">概要</span> |

## 参考 · Reference

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **插件 manifest 参考**<br>Plugin manifest reference<br>[原文](https://code.claude.com/docs/en/plugins/manifest-reference) · [中文版](https://code.claude.com/docs/zh-CN/plugins/manifest-reference) | plugin.json 参考：各字段的类型和默认值、接受的路径形式，以及 userConfig 和环境变量的 schema。 | — | <span class="status-tag st-brief">概要</span> |
| **市场参考**<br>Marketplace reference<br>[原文](https://code.claude.com/docs/en/plugins/marketplace-reference) · [中文版](https://code.claude.com/docs/zh-CN/plugins/marketplace-reference) | marketplace.json 字段、插件条目以及插件和市场源对象的参考，包括每项的有效位置。 | — | <span class="status-tag st-brief">概要</span> |
| **插件命令参考**<br>Plugin commands reference<br>[原文](https://code.claude.com/docs/en/plugins/cli-reference) · [中文版](https://code.claude.com/docs/zh-CN/plugins/cli-reference) | claude plugin shell 命令、会话中的 /plugin 和 /reload-plugins 的参考，以及在一个会话中加载插件的标志。 | — | <span class="status-tag st-brief">概要</span> |

:::
