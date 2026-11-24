---
title: 8. MCP 接入
outline: [2, 3]
---

<script setup>
import quiz from '../../quizzes/08-mcp.json'
</script>

# 8. MCP 接入：让 Claude 用上外部工具，同时不失控

<div class="one-liner">

**一句话讲明白**：MCP（Model Context Protocol）服务器给 Claude 增加内置工具之外的能力——查 issue、操作浏览器、读数据库。**接得越多，开机成本和风险面越大**：只接真正需要的，按范围放对位置，用权限规则管住它的工具。

</div>

## 为什么需要（对应哪种“乱跑”）

| 症状 | 原因 | 对策 |
| :- | :- | :- |
| Claude 改了 UI 却从不看页面效果，“看起来对”就交差 | 它没有“看到运行中应用”的手段 | 接一个浏览器类 MCP（如 Playwright）或用 `/verify` |
| 会话一开就占了大量上下文 | 接了很多用不上的服务器 | `/mcp` 关掉不用的；默认的 tool search 只加载名字 |
| 一个 MCP 工具一次返回几万 tokens | 输出没有约束 | 默认 25,000 tokens 上限，超出写入文件 |
| 团队成员各自配置不一致 | 服务器只配在个人范围 | 共享的放 `.mcp.json` 提交 |
| 第三方服务器做了危险操作 | 工具默认可调用 | 权限规则 `mcp__server__tool` 的 ask/deny |

官方的取舍建议：“If that system has a CLI, that's usually the easiest way in. With `gh` installed and signed in, for example, Claude will open pull requests and read review comments without any explanation from you… For systems without a CLI, there's MCP.”

## 详细原理

### 四种接入方式

| 传输 | 命令示例 | 适合 |
| :- | :- | :- |
| HTTP（远程，推荐） | `claude mcp add --transport http notion https://mcp.notion.com/mcp` | 托管服务 |
| SSE（远程） | `claude mcp add --transport sse <name> <url>` | 需要直接用 SSE 连接的服务器（或较早版本） |
| stdio（本地进程） | `claude mcp add playwright -- npx -y @playwright/mcp@latest` | 需要本机资源：浏览器、文件、数据库 socket |
| WebSocket（远程） | 见原文 Option 4 | — |

- stdio 不需要 `--transport`；`--` 之后是启动服务器的命令。
- 需要静态 token 的：`--header "Authorization: Bearer <token>"`；OAuth 的：添加后在会话里 `/mcp` → 选服务器 → **Authenticate**，浏览器里登录。
- `claude mcp add` 只保存配置、**不验证**凭据；`Added ...` 只代表写进去了。

### 三个范围

| 范围 | 存在哪 | 生效 | 共享 |
| :- | :- | :- | :- |
| `local`（默认） | `~/.claude.json` 中该项目的条目 | 只在当前项目 | 否 |
| `project` | 项目根 `.mcp.json` | 只在当前项目 | 是，提交到 git |
| `user` | `~/.claude.json` 顶层 `mcpServers` | 你的所有项目 | 否 |

> 注意：MCP 的 “local scope” 存在 home 目录的 `~/.claude.json`，和 settings 的 `.claude/settings.local.json` 不是一回事。

**重名优先级**：local → project → user → 插件提供的 → claude.ai connectors。用最高来源的**完整条目**，字段不跨范围合并。改范围只能删了重加。

**`.mcp.json` 格式**：

```json
{
  "mcpServers": {
    "claude-code-docs": { "type": "http", "url": "https://code.claude.com/docs/mcp" },
    "playwright": { "type": "stdio", "command": "npx", "args": ["-y", "@playwright/mcp@latest"] }
  }
}
```

可用 `${VAR}`、`${VAR:-default}` 引用环境变量（`command`、`args`、`env`、`url`、`headers` 都支持），**密钥别写死**。

**项目服务器需要你批准**：交互式会话里，`.mcp.json` 的服务器首次使用前会弹批准框；克隆下来的仓库**不能自己批准自己的服务器**。`claude mcp reset-project-choices` 重置批准记录。`-p`、SDK、云端会话不能弹框——要么在 `disabledMcpjsonServers` 里拒绝，要么 `--setting-sources` 排除项目设置，要么 `--strict-mcp-config`。

### 管理命令

```bash
claude mcp list          # 列出并显示健康状态
claude mcp get <name>    # 详情：哪个范围、错误信息
claude mcp remove <name> # 删除（远程服务器会同时删本地存的 OAuth token）
```

会话内 `/mcp`：查看状态、认证、**开关**某个服务器（记录在 `~/.claude.json` 的 `disabledMcpServers`，不删配置）。

| `claude mcp list` 状态 | 含义 |
| :- | :- |
| `✔ Connected` | 可用 |
| `! Connected · tools fetch failed` | 连上了但列不出工具，`claude mcp get` 看原因 |
| `! Needs authentication` | 需要浏览器登录或 header token |
| `✘ Failed to connect` / `✘ Connection error` | 没响应 / 连接出错 |
| `⏸ Pending approval` | `.mcp.json` 的服务器还没批准 |
| `⊘ Disabled for this project` | 被项目的禁用列表关掉 |
| `✘ Blocked by enterprise managed policy` | 组织策略禁止 |

### 上下文成本：tool search

> 原文：“Tool search keeps MCP context usage low by deferring tool definitions until Claude needs them. Only tool names and server instructions load at session start.”

- 默认开启；没有固定的每服务器工具数上限，实际上限是你的上下文预算。
- 但**每个连上的服务器仍会把工具名和说明带进每个会话**——best practices 建议关掉不用的。
- 服务器说明和预加载工具描述超过 4,096 字符会被截断；经 tool search 加载的工具描述上限 16,384 字符（`CLAUDE_CODE_MAX_MCP_DESCRIPTION_LENGTH` 可改）。

### 输出限制

| 项 | 默认 |
| :- | :- |
| 转录视图警告阈值 | 单次输出超过 10,000 tokens |
| 最大输出 | 25,000 tokens（`MAX_MCP_OUTPUT_TOKENS` 调整） |
| 超出后 | 结果存成文件，对话里只放文件路径，Claude 需要时再读 |
| 文本结果字符上限（前台） | 超过 50,000 字符也存成文件 |
| 启动超时 | `MCP_TIMEOUT`（例如 `MCP_TIMEOUT=10000 claude` 为 10 秒） |

### 权限

| 规则 | 匹配 |
| :- | :- |
| `mcp__puppeteer` 或 `mcp__puppeteer__*` | 该服务器所有工具 |
| `mcp__puppeteer__puppeteer_navigate` | 某一个工具 |
| `mcp__*`（deny/ask） | 所有服务器的所有工具 |

- MCP 工具的 allow 规则**不要带说明符**（括号），否则匹配不到；settings 文件里带括号的 `mcp__` 规则会被跳过。
- 服务器名里的 `.`、空格会变成 `_`：`my.server` → `mcp__my_server__*`。
- 服务器作者可以把某个工具标为 `requiresUserInteraction`，那么**每次调用都弹窗**，即使在 auto / bypassPermissions。
- 本地 stdio MCP 服务器**在沙箱之外**运行（[第 3 章](./03-settings-permissions-sandbox)）。
- hooks 可以用 matcher `mcp__<server>__.*` 针对 MCP 工具（[第 5 章](./05-hooks-gates)）。

### 其他能力（了解即可）

- MCP prompts 变成命令：`/servername:promptname (MCP)`。
- MCP resources 可以 `@` 引用。
- 服务器可以“elicitation”向你要输入（对应 `Elicitation` hook）。
- `claude mcp serve`：把 Claude Code 本身当 MCP 服务器（见原文 “Use Claude Code as an MCP server”）。
- 组织可以用托管配置限制/下发服务器（[Managed MCP](https://code.claude.com/docs/en/managed-mcp)）。

## 落地到自己的仓库

### 第 1 步：先盘点，能用 CLI 就不用 MCP

| 需求 | 建议 |
| :- | :- |
| GitHub PR / issue | 装 `gh` 并 `gh auth login`；`/ship` 也依赖它（[第 9 章](./09-claude-ship)） |
| 看 H5 页面实际效果、点一点 | Playwright MCP（本地 stdio）或 `/verify` / Chrome 集成 |
| 查 Claude Code 文档 | 官方 docs MCP：`https://code.claude.com/docs/mcp`（无需登录） |
| 数据库 | 只在确有需要时接，且用只读账号 |

### 第 2 步：团队共享的 `.mcp.json`

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },
    "claude-code-docs": {
      "type": "http",
      "url": "https://code.claude.com/docs/mcp"
    }
  }
}
```

或用命令生成：

```bash
claude mcp add --scope project playwright -- npx -y @playwright/mcp@latest
claude mcp add --scope project --transport http claude-code-docs https://code.claude.com/docs/mcp
```

需要个人 token 的（例如 GitHub 的远程 MCP，用细粒度 PAT）放 **local 或 user 范围**，不要进 `.mcp.json`：

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/ \
  --header "Authorization: Bearer YOUR_GITHUB_PAT"
```

### 第 3 步：用权限规则管住它

`.claude/settings.json` 增加：

```json
{
  "permissions": {
    "allow": ["mcp__claude-code-docs__*"],
    "ask": ["mcp__playwright__*"]
  }
}
```

文档查询放行；浏览器操作每次问（熟悉后再放宽）。

### 第 4 步：把“看效果”写进流程

在 `/ui-prototype` 或 `/pr-ready` 里加一句（[第 6 章](./06-skills-commands)）：

```text
样式改动完成后，用 playwright 打开 http://localhost:5173 对应页面，在 375px 宽度截图，与原型 docs/02-design/prototypes/<名>.html 对比，列出差异。
```

### 第 5 步：验证

```bash
claude mcp list
```

会话里 `/mcp` 看状态、`/context` 看占用，然后：

```text
Use the claude-code-docs server to look up what MCP_TIMEOUT does
```

## 常见坑与排错

- **`✘ Failed to connect`（npx 类）** → 首次要下载包，等一会再 `claude mcp list`。
- **`! Needs authentication`** → `/mcp` 里 Authenticate；或改用 `--header`。
- **`⏸ Pending approval`** → 交互式运行 `claude` 批准；`-p` 里不会弹框。
- **队友那边没有这个服务器** → 你加在了 local 范围；用 `--scope project` 重加并提交 `.mcp.json`。
- **权限规则不生效** → 服务器名特殊字符被替换成 `_`；allow 规则不要带括号。
- **工具输出把上下文撑爆** → 降低 `MAX_MCP_OUTPUT_TOKENS`，或让子代理去调用。
- **stdio 服务器在会话里掉线** → 见 mcp 页 “Automatic reconnection / Stdio servers that exit or fail to start”，会话里可以 `/mcp` 手动重连。

## 自测题

<Quiz :data="quiz" />

## 原文链接

- Connect to MCP servers（quickstart）：<https://code.claude.com/docs/en/mcp-quickstart>
- Connect Claude Code to tools via MCP（完整参考）：<https://code.claude.com/docs/en/mcp>
- Configure permissions（MCP 规则）：<https://code.claude.com/docs/en/permissions#mcp>
- Best practices（Connect the tools Claude needs）：<https://code.claude.com/docs/en/best-practices>
- Managed MCP：<https://code.claude.com/docs/en/managed-mcp>
