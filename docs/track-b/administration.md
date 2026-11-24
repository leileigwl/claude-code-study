---
title: 管理 · Administration
outline: [2, 3]
editLink: false
---

<!-- 本页由 scripts/gen-track-b.mjs 根据 data/llms-snapshot.txt 与 data/llms-zh-cn-snapshot.txt 生成，请勿手改。 -->

# 管理 · Administration

官方文档“Administration”分区，共 **37** 页，其中 **2** 页在 A 路线里对照原文精读过。顺序与分组跟随官方导航；中文概要取自官方简体中文索引。

- <span class="status-tag st-deep">已精读</span>：A 路线某一章把它列为“原文链接”，逐条核对过
- <span class="status-tag st-brief">概要</span>：只有官方摘要；“A 路线”一栏写“（提及）”表示章节正文引用过它

::: v-pre

## 设置与访问 · Setup and access

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **为您的组织设置 Claude Code**<br>Set up Claude Code for your organization<br>[原文](https://code.claude.com/docs/en/admin-setup) · [中文版](https://code.claude.com/docs/zh-CN/admin-setup) | 针对部署 Claude Code 的管理员的决策地图，涵盖 API 提供商、托管设置、策略执行、使用情况监控和数据处理。 | — | <span class="status-tag st-brief">概要</span> |
| **高级设置**<br>Advanced setup<br>[原文](https://code.claude.com/docs/en/setup) · [中文版](https://code.claude.com/docs/zh-CN/setup) | Claude Code 的系统要求、特定平台安装、版本管理和卸载。 | — | <span class="status-tag st-brief">概要</span> |
| **身份验证**<br>Authentication<br>[原文](https://code.claude.com/docs/en/authentication) · [中文版](https://code.claude.com/docs/zh-CN/authentication) | 登录 Claude Code 并为个人、团队和组织配置身份验证。 | — | <span class="status-tag st-brief">概要</span> |
| **部署托管设置**<br>Deploy managed settings<br>[原文](https://code.claude.com/docs/en/managed-settings) · [中文版](https://code.claude.com/docs/zh-CN/managed-settings) | 将托管设置部署到每个开发者的机器上：按操作系统的交付机制、Claude Code 如何组合托管源，以及如何验证强制执行。 | — | <span class="status-tag st-brief">概要</span> |
| **配置服务器管理的设置**<br>Configure server-managed settings<br>[原文](https://code.claude.com/docs/en/server-managed-settings) · [中文版](https://code.claude.com/docs/zh-CN/server-managed-settings) | 通过服务器交付的设置为您的组织集中配置 Claude Code，无需设备管理基础设施。 | — | <span class="status-tag st-brief">概要</span> |
| **控制组织的 MCP 服务器访问权限**<br>Control MCP server access for your organization<br>[原文](https://code.claude.com/docs/en/managed-mcp) · [中文版](https://code.claude.com/docs/zh-CN/managed-mcp) | 使用托管配置文件、托管设置、允许列表和拒绝列表，限制用户可以添加或连接的 MCP 服务器，或为每个用户提供服务器。 | [A8](/track-a/08-mcp) | <span class="status-tag st-deep">已精读</span> |
| **配置自动模式**<br>Configure auto mode<br>[原文](https://code.claude.com/docs/en/auto-mode-config) · [中文版](https://code.claude.com/docs/zh-CN/auto-mode-config) | 告诉自动模式分类器您的组织信任哪些代码库、存储桶和域，设置您自己的阻止和允许规则，并检查您的配置。 | — | <span class="status-tag st-brief">概要</span> |

## 部署 · Deployment

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **企业部署概览**<br>Enterprise deployment overview<br>[原文](https://code.claude.com/docs/en/third-party-integrations) · [中文版](https://code.claude.com/docs/zh-CN/third-party-integrations) | 了解 Claude Code 如何与各种第三方服务和基础设施集成，以满足企业部署需求。 | — | <span class="status-tag st-brief">概要</span> |
| **功能可用性**<br>Feature availability<br>[原文](https://code.claude.com/docs/en/feature-availability) · [中文版](https://code.claude.com/docs/zh-CN/feature-availability) | 比较哪些 Claude Code 功能可在各个 Anthropic 订阅套餐、Anthropic Console 以及 Amazon Bedrock 和 Google Cloud 等云提供商上使用。 | [A9](/track-a/09-claude-ship) [A10](/track-a/10-repo-template) | <span class="status-tag st-deep">已精读</span> |
| **Amazon Bedrock 上的 Claude Code**<br>Claude Code on Amazon Bedrock<br>[原文](https://code.claude.com/docs/en/amazon-bedrock) · [中文版](https://code.claude.com/docs/zh-CN/amazon-bedrock) | 了解如何通过 Amazon Bedrock 配置 Claude Code，包括设置、IAM 配置和故障排除。 | — | <span class="status-tag st-brief">概要</span> |
| **AWS 上的 Claude Platform 中的 Claude Code**<br>Claude Code on Claude Platform on AWS<br>[原文](https://code.claude.com/docs/en/claude-platform-on-aws) · [中文版](https://code.claude.com/docs/zh-CN/claude-platform-on-aws) | 配置 Claude Code 以使用 Anthropic 运营的 Claude API，支持 AWS 身份验证、IAM 访问控制和 AWS Marketplace 计费。 | — | <span class="status-tag st-brief">概要</span> |
| **在 Claude Code 中使用 Google Cloud 上的 Claude 模型（由 Anthropic 管理）**<br>Claude Code with Claude Models on Google Cloud (Anthropic managed)<br>[原文](https://code.claude.com/docs/en/claude-models-on-google-cloud-anthropic-managed) · [中文版](https://code.claude.com/docs/zh-CN/claude-models-on-google-cloud-anthropic-managed) | 配置 Claude Code，使其通过您的 Google Cloud 项目使用由 Anthropic 运行的 Claude API，并使用 Google Cloud 凭据、IAM 和 Marketplace 计费。 | — | <span class="status-tag st-brief">概要</span> |
| **Google Cloud 的 Agent Platform 上的 Claude Code**<br>Claude Code on Google Cloud's Agent Platform<br>[原文](https://code.claude.com/docs/en/google-vertex-ai) · [中文版](https://code.claude.com/docs/zh-CN/google-vertex-ai) | 了解如何通过 Google Cloud 的 Agent Platform（原 Vertex AI）配置 Claude Code，包括设置、IAM 配置和故障排除。 | — | <span class="status-tag st-brief">概要</span> |
| **Microsoft Foundry 上的 Claude Code**<br>Claude Code on Microsoft Foundry<br>[原文](https://code.claude.com/docs/en/microsoft-foundry) · [中文版](https://code.claude.com/docs/zh-CN/microsoft-foundry) | 了解如何通过 Microsoft Foundry 配置 Claude Code，包括设置、配置和故障排除。 | — | <span class="status-tag st-brief">概要</span> |
| **企业网络配置**<br>Enterprise network configuration<br>[原文](https://code.claude.com/docs/en/network-config) · [中文版](https://code.claude.com/docs/zh-CN/network-config) | 为企业环境配置 Claude Code，支持代理服务器、自定义证书颁发机构 (CA) 和相互传输层安全 (mTLS) 身份验证。 | — | <span class="status-tag st-brief">概要</span> |
| **在企业启动器后面运行 Claude Code**<br>Run Claude Code behind a corporate launcher<br>[原文](https://code.claude.com/docs/en/corporate-launcher) · [中文版](https://code.claude.com/docs/zh-CN/corporate-launcher) | 通过 CLAUDE_CODE_PROCESS_WRAPPER 或 processWrapper 设置，使用必需的启动器路由 Claude Code 从其自身二进制文件启动的进程，包括后台服务和每个代理视图会话。 | — | <span class="status-tag st-brief">概要</span> |
| **开发容器**<br>Development containers<br>[原文](https://code.claude.com/docs/en/devcontainer) · [中文版](https://code.claude.com/docs/zh-CN/devcontainer) | 在开发容器中运行 Claude Code，为您的团队提供一致、隔离的环境。 | — | <span class="status-tag st-brief">概要</span> |

## 网关 · Gateways

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **通过网关运行 Claude Code**<br>Run Claude Code through a gateway<br>[原文](https://code.claude.com/docs/en/gateways) · [中文版](https://code.claude.com/docs/zh-CN/gateways) | 通过自托管网关路由 Claude Code，实现集中式凭证管理、使用情况跟踪和成本控制。涵盖架构、Anthropic 的 Claude 应用网关以及使用其他网关产品。 | — | <span class="status-tag st-brief">概要</span> |

### Claude 应用网关 · Claude apps gateway

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **Amazon Bedrock、Claude Platform on AWS、Google Cloud 和 Microsoft Foundry 的 Claude 应用网关**<br>Claude apps gateway for Amazon Bedrock, Claude Platform on AWS, Google Cloud, and Microsoft Foundry<br>[原文](https://code.claude.com/docs/en/claude-apps-gateway) · [中文版](https://code.claude.com/docs/zh-CN/claude-apps-gateway) | 通过自托管网关在 Amazon Bedrock、Claude Platform on AWS、Google Cloud 或 Microsoft Foundry 上运行 Claude Code，支持 SSO 登录、按组模型访问和 OTLP 遥测。 | — | <span class="status-tag st-brief">概要</span> |
| **Claude 应用网关配置**<br>Claude apps gateway configuration<br>[原文](https://code.claude.com/docs/en/claude-apps-gateway-config) · [中文版](https://code.claude.com/docs/zh-CN/claude-apps-gateway-config) | 每个 gateway.yaml 选项的参考：监听器和 TLS、OIDC、会话、Postgres 存储、Amazon Bedrock、Claude Platform on AWS、Google Cloud 的 Agent Platform 和 Microsoft Foundry 上游、模型路由、托管策略和遥测。 | — | <span class="status-tag st-brief">概要</span> |
| **Claude 应用网关支出限制**<br>Claude apps gateway spend limits<br>[原文](https://code.claude.com/docs/en/claude-apps-gateway-spend-limits) · [中文版](https://code.claude.com/docs/zh-CN/claude-apps-gateway-spend-limits) | 通过 Claude 应用网关为每个开发者按天、周或月设置支出上限。使用 Admin API 设置限制，网关在每个请求上实时执行这些限制。 | — | <span class="status-tag st-brief">概要</span> |
| **Claude 应用网关部署和运维**<br>Claude apps gateway deployment and operations<br>[原文](https://code.claude.com/docs/en/claude-apps-gateway-deploy) · [中文版](https://code.claude.com/docs/zh-CN/claude-apps-gateway-deploy) | 向身份提供商注册网关，构建容器，在 Kubernetes 或 Cloud Run 上部署，并运维它：健康检查、密钥轮换、升级和安全。 | — | <span class="status-tag st-brief">概要</span> |
| **在 AWS 上部署 Claude apps gateway**<br>Deploy Claude apps gateway on AWS<br>[原文](https://code.claude.com/docs/en/claude-apps-gateway-on-aws) · [中文版](https://code.claude.com/docs/zh-CN/claude-apps-gateway-on-aws) | 在 AWS 上运行 Claude apps gateway 的完整示例：ECS Fargate 或 EKS、Amazon RDS for PostgreSQL、AWS Secrets Manager 和 IAM 角色身份验证到 Amazon Bedrock。 | — | <span class="status-tag st-brief">概要</span> |
| **在 Google Cloud 上部署 Claude apps gateway**<br>Deploy Claude apps gateway on Google Cloud<br>[原文](https://code.claude.com/docs/en/claude-apps-gateway-on-gcp) · [中文版](https://code.claude.com/docs/zh-CN/claude-apps-gateway-on-gcp) | 在 Google Cloud 上运行 Claude apps gateway 的实际示例：Cloud Run 或 GKE、Cloud SQL for PostgreSQL、Secret Manager 和 Google Cloud 的 Agent Platform 的服务账户身份验证。 | — | <span class="status-tag st-brief">概要</span> |

### 其他网关 · Other gateways

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **其他 LLM 网关**<br>Other LLM gateways<br>[原文](https://code.claude.com/docs/en/llm-gateway) · [中文版](https://code.claude.com/docs/zh-CN/llm-gateway) | 通过您的组织已运行的 LLM 网关路由 Claude Code。涵盖将 Claude Code 连接到网关、为您的组织部署网关以及 Claude Code 发送到网关的内容。 | — | <span class="status-tag st-brief">概要</span> |
| **将 Claude Code 连接到 LLM 网关**<br>Connect Claude Code to an LLM gateway<br>[原文](https://code.claude.com/docs/en/llm-gateway-connect) · [中文版](https://code.claude.com/docs/zh-CN/llm-gateway-connect) | 将 Claude Code 指向您组织的 LLM 网关。检查您的管理员是否已配置它，或自行设置基础 URL 和凭证，然后验证连接并修复网关错误。 | — | <span class="status-tag st-brief">概要</span> |
| **为您的组织推出 LLM 网关**<br>Roll out an LLM gateway for your organization<br>[原文](https://code.claude.com/docs/en/llm-gateway-rollout) · [中文版](https://code.claude.com/docs/zh-CN/llm-gateway-rollout) | 为 Claude Code 部署网关产品：配置它以转发 Claude Code 发送的内容，颁发开发者凭证，通过托管设置分发配置，并验证推出。 | — | <span class="status-tag st-brief">概要</span> |
| **Claude Code 网关兼容性指南**<br>Claude Code gateway compatibility guide<br>[原文](https://code.claude.com/docs/en/llm-gateway-protocol) · [中文版](https://code.claude.com/docs/zh-CN/llm-gateway-protocol) | 保持 LLM 网关与 Claude Code 兼容：它调用的端点、必须转发的标头和正文字段，以及删除它们时会破坏的功能。 | — | <span class="status-tag st-brief">概要</span> |

## 用量与费用 · Usage and costs

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **监控**<br>Monitoring<br>[原文](https://code.claude.com/docs/en/monitoring-usage) · [中文版](https://code.claude.com/docs/zh-CN/monitoring-usage) | 了解如何为 Claude Code 启用和配置 OpenTelemetry。 | — | <span class="status-tag st-brief">概要</span> |
| **有效管理成本**<br>Manage costs effectively<br>[原文](https://code.claude.com/docs/en/costs) · [中文版](https://code.claude.com/docs/zh-CN/costs) | 跟踪令牌使用情况，设置团队支出限制，并通过上下文管理、模型选择、扩展思考设置和预处理 hooks 来降低 Claude Code 成本。 | — | <span class="status-tag st-brief">概要</span> |
| **使用分析跟踪团队使用情况**<br>Track team usage with analytics<br>[原文](https://code.claude.com/docs/en/analytics) · [中文版](https://code.claude.com/docs/zh-CN/analytics) | 在分析仪表板中查看 Claude Code 使用指标、跟踪采用情况并衡量工程速度。 | — | <span class="status-tag st-brief">概要</span> |

## 安全与数据 · Security and data

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **安全性**<br>Security<br>[原文](https://code.claude.com/docs/en/security) · [中文版](https://code.claude.com/docs/zh-CN/security) | 了解 Claude Code 的安全防护措施和安全使用的最佳实践。 | — | <span class="status-tag st-brief">概要</span> |
| **数据使用**<br>Data usage<br>[原文](https://code.claude.com/docs/en/data-usage) · [中文版](https://code.claude.com/docs/zh-CN/data-usage) | 了解 Anthropic 对 Claude 数据使用的政策 | — | <span class="status-tag st-brief">概要</span> |
| **零数据保留**<br>Zero data retention<br>[原文](https://code.claude.com/docs/en/zero-data-retention) · [中文版](https://code.claude.com/docs/zh-CN/zero-data-retention) | 了解 Claude Code 的零数据保留 (ZDR)，适用于 Claude for Enterprise 上符合条件的账户，包括范围、禁用功能以及如何请求启用。 | — | <span class="status-tag st-brief">概要</span> |
| **为符合 HIPAA 要求的组织设置 Claude Code（本地模式）**<br>Set up Claude Code (local mode) for a HIPAA-ready organization<br>[原文](https://code.claude.com/docs/en/hipaa-setup) · [中文版](https://code.claude.com/docs/zh-CN/hipaa-setup) | 为开发人员的计算机做好准备，以便在 HIPAA 配置下运行 Claude Code（本地模式）。涵盖版本、网络访问、托管设置和本地数据。 | — | <span class="status-tag st-brief">概要</span> |

## 采用 · Adoption

| 页面 | 中文概要 | A 路线 | 状态 |
| :- | :- | :- | :- |
| **通信工具包**<br>Communications kit<br>[原文](https://code.claude.com/docs/en/communications-kit) · [中文版](https://code.claude.com/docs/zh-CN/communications-kit) | 推出公告、滴灌式营销信息和常见问题解答，用于在您的工程组织中推出 Claude Code。 | — | <span class="status-tag st-brief">概要</span> |
| **倡导者工具包**<br>Champion kit<br>[原文](https://code.claude.com/docs/en/champion-kit) · [中文版](https://code.claude.com/docs/zh-CN/champion-kit) | 工程师在内部倡导 Claude Code 的行动手册：分享什么、如何回答问题以及如何在团队中推动采用。 | — | <span class="status-tag st-brief">概要</span> |

:::
