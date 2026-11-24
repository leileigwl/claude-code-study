---
title: 7. Subagents 分工与边界
outline: [2, 3]
---

<script setup>
import quiz from '../../quizzes/07-subagents.json'
</script>

# 7. Subagents：分工、隔离与边界

<div class="one-liner">

**一句话讲明白**：子代理是 Claude 派出去的“专职助手”，在**自己独立的上下文窗口**里干活，干完只交回一份摘要。你可以给它限定工具（比如只读）、指定模型、甚至放进独立 worktree——这些限制由程序强制，不靠提示词。

</div>

## 为什么需要（对应哪种“乱跑”）

| 症状 | 子代理怎么帮 |
| :- | :- |
| 跑一次全量测试、读一堆日志，主对话就被塞满 | 让子代理去跑，只回失败项 |
| 让写代码的同一个“人”审查自己，总说没问题 | 审查子代理看不到实现过程，“isn't swayed by the reasoning that produced the code” |
| 想让“审查员”只看不改，它却顺手改了 | `tools: Read, Grep, Glob`，编辑工具根本不给 |
| 几件独立的调研排队做，很慢 | 并行派出多个子代理 |
| 多个并行改动互相覆盖 | `isolation: worktree` |

但官方也提醒成本：每个子代理都单独发请求、消耗同一份用量；全新的子代理要重新收集上下文，**可能比在主对话里直接做还慢**；默认是同一个（或更小的）模型，“You get parallelism or a fresh pair of eyes out of it, but not a smarter answer.”

## 详细原理

### 内置子代理

| 名称 | 模型 | 工具 | 用途 |
| :- | :- | :- | :- |
| **Explore** | 主对话的模型（主对话是 Fable 时按连接方式用 Opus 或 Fable） | 只读，禁 Write/Edit | 找文件、搜代码、探索代码库；Claude 会指定 quick / medium / very thorough |
| **Plan** | 继承主对话 | 只读 | plan mode 期间为制定计划做调研 |
| **general-purpose** | 主对话模型（按模型顺序） | 子代理可用的全部工具 | 需要探索 + 修改的复杂多步任务 |
| 其他 | — | — | `claude`（兜底）、`statusline-setup`（Sonnet）、`claude-code-guide`（Haiku）、`web-fetch`（Haiku） |

**Explore 和 Plan 启动时不加载 CLAUDE.md 和 git status 快照**，以保持调研轻快。同名的用户/项目子代理会覆盖内置的（例如自己定义一个 `model: haiku` 的 `Explore`）。

### 子代理启动时带着什么（非 fork）

- **系统提示**：子代理自己的（Markdown 正文）+ 环境信息，**不是** Claude Code 的系统提示
- **任务消息**：Claude 写的派活说明
- **CLAUDE.md 各层**（Explore、Plan、设了 `omitClaudeMd: true` 的除外）
- **git status 快照**
- **预加载的 skills**（`skills` 字段，注入完整内容）
- **兄弟名单**（有 `SendMessage` 工具时）

**不带**：你的对话历史、已调用的 skills、已读过的文件、output style、主对话的 auto memory。子代理的上下文窗口大小由**它自己的模型**决定。

> 官方建议：如果某条规则必须让子代理知道（例如“忽略 `vendor/` 目录”），在派活时的提示里重述。

### fork：带着完整对话的子代理

| | Fork | 非 fork 子代理 |
| :- | :- | :- |
| 上下文 | 完整对话历史 | 只有你给的提示 |
| 系统提示与工具 | 与父对话相同 | 来自定义文件（后台运行时会过滤） |
| 模型 | 与父对话相同 | 按子代理模型顺序 |
| 提示缓存 | 与父对话共享（更省） | 独立缓存 |

- `/subtask <任务>` 手动开 fork；fork 模式默认开启，Claude 也会自己开。
- 停止 fork：`permissions.deny` 加 `"Agent(fork)"`；或设 `CLAUDE_CODE_FORK_SUBAGENT=0` 关闭 fork 模式。

### 前台与后台

- **前台**：阻塞主对话直到完成，权限提示直接给你。
- **后台**：并行运行，你继续工作；需要权限时，提示会出现在主会话并标明是哪个子代理在问。
- 默认：从主对话派出的子代理（`web-fetch` 除外）都在**后台**启动。在交互式会话里想让 Claude 等子代理完成，要关闭 fork 模式（`CLAUDE_CODE_FORK_SUBAGENT=0`）。
- `/tasks` 查看后台工作。

### 定义自己的子代理

**位置与优先级**：

| 位置 | 范围 | 优先级 |
| :- | :- | :- |
| 托管设置 | 组织 | 1（最高） |
| `--agents` CLI 参数（JSON） | 当前会话 | 2 |
| `.claude/agents/` | 当前项目 | 3 |
| `~/.claude/agents/` | 你的所有项目 | 4 |
| 插件 `agents/` | 插件启用处 | 5（最低） |

目录递归扫描，可以分子文件夹；身份只看 `name` 字段。项目子代理从当前目录往上找到仓库根，重名时**离工作目录最近**的胜出。

**Frontmatter 字段**（只有 `name`、`description` 必填；驼峰命名，拼错静默忽略）：

| 字段 | 作用 |
| :- | :- |
| `name` | 唯一标识（≤256 字符，不能含 `:`）；hooks 收到的 `agent_type` |
| `description` | 何时委派给它；写“use proactively”可鼓励主动委派 |
| `tools` | 允许的工具（不写则继承全部）。`Agent(worker, researcher)` 限定它能再派哪些子代理 |
| `disallowedTools` | 从继承/指定列表中去掉的工具；带说明符如 `Bash(git push *)` 也会**去掉整个工具** |
| `model` | `sonnet` / `opus` / `haiku` / `fable` / 完整模型 ID / `inherit` |
| `permissionMode` | `default` `acceptEdits` `auto` `dontAsk` `bypassPermissions` `plan`（见下方限制） |
| `maxTurns` | 最大轮数，到了返回“部分结果” |
| `autoCompactWindow` | 单独降低它的自动压缩窗口（≥100000，需 v2.1.296+） |
| `skills` | 启动时预加载的 skills（注入全文） |
| `mcpServers` | 它能用的 MCP 服务器（引用名或内联定义） |
| `hooks` | 只在它运行时生效的 hooks |
| `memory` | 持久记忆：`user` → `~/.claude/agent-memory/<name>/`；`project` → `.claude/agent-memory/<name>/`；`local` → `.claude/agent-memory-local/<name>/` |
| `background` | `true`：即使 Claude 想等也放后台 |
| `effort` | 思考强度 |
| `isolation` | `worktree`：在临时 git worktree 里运行 |
| `omitClaudeMd` | `true`：不加载用户/项目/本地 CLAUDE.md |
| `color` / `initialPrompt` / `experimental` | 显示颜色 / 作为主会话代理时的首条提示 / 实验选项 |

**模型选择顺序**：调用时传的 `model` 参数 → 定义里的 `model` → `CLAUDE_CODE_SUBAGENT_MODEL` 环境变量 → 主对话（或上一级子代理）的模型。

**`permissionMode` 的重要限制**：主对话在 `bypassPermissions`、`acceptEdits` 或 `auto` 时，子代理**沿用主对话的模式**，你写的 `permissionMode` 被忽略；主对话在 `plan` 时子代理也保持 plan。只有主对话在 `default`/`dontAsk` 时才用你设的值。**所以“限制子代理能做什么”要靠 `tools`，而不是 `permissionMode`。**

### 并行与汇总

<SubagentFanoutAnim />

- 并发上限默认 **20**（`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`）；一个 session 里总共派多少没有上限。
- 子代理可以再派子代理，默认最多往下 **3 层**（`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`；设 `1` 关闭嵌套）；到达深度上限后除 fork 外不再给 `Agent` 工具。
- 子代理描述合计超过 15,000 tokens 时启动会警告——描述写短。
- 每次调用都是新实例；要接着之前的工作，让 Claude **resume** 那个子代理（用 general-purpose 或自定义子代理，Explore/Plan 可能不给可恢复的 ID）。

### 怎么调用

| 方式 | 写法 |
| :- | :- |
| 自然语言 | “Use the test-runner subagent to fix failing tests” |
| @ 提及（这一次一定用它） | `@"code-reviewer (agent)" look at the auth changes` 或 `@agent-code-reviewer` |
| 整个会话就是它 | `claude --agent code-reviewer`；或 settings 里 `"agent": "code-reviewer"` |

### 限制子代理的使用

- 禁用某个：`permissions.deny` 里写 `"Agent(Explore)"`。
- 完全不让委派：deny `Agent` 工具本身。
- 只去掉 Explore/Plan：`CLAUDE_CODE_DISABLE_EXPLORE_PLAN_AGENTS=1`。

### 子代理 vs 主对话 vs skill

| 用主对话 | 用子代理 | 用 skill |
| :- | :- | :- |
| 需要频繁来回、反复打磨 | 产生大量你不需要的输出 | 想复用一段提示/流程，**在主对话上下文里**运行 |
| 规划、实现、测试共享大量上下文 | 需要强制特定的工具限制 | |
| 快速的小改动；在意延迟 | 工作独立、能用摘要交付 | |

问一个关于当前对话内容的小问题，用 `/btw`，它没有工具权限、答案也不进历史。

## 落地到自己的仓库：三个角色

`template/.claude/agents/` 里有完整文件。

### reviewer：只读、对照规格、跳过风格

```markdown
---
name: reviewer
description: 对照规格审查已改动的文件，只报告影响正确性的缺口。实现完一个功能、提 PR 之前使用。
tools: Read, Grep, Glob
model: inherit
---
你在审查一段不是你写的代码。对照给你的规格文件（docs/specs/ 下），逐条检查：
1. 每条验收标准是否实现，给出证据（文件:行）。
2. 列出的边界情况是否有测试。
3. 是否有规格“范围外”的改动——全部列出。
4. 是否有未经原型确认的样式改动。
只报告影响正确性或越界的问题；跳过代码风格。
```

“跳过风格”这句不能省。官方原话：“A reviewer that's asked to find problems will always find *something*. If you fix every finding, you end up with extra abstraction layers and tests for cases that can't happen.”

### test-runner：便宜的模型，只回失败

`model: haiku`、`tools: Read, Grep, Glob, Bash`；只返回失败的测试名、断言、文件行号，最多 30 行。全量测试的几千行输出留在它的窗口里。

### explorer：只读调研，返回 25 行以内摘要

改动陌生模块前先派它，拿到文件清单、数据流和波及面，主对话保持干净。

### 用法示例

```text
用 explorer 子代理调研 web/src/pages/quiz 的数据流，再给我实现计划。
```

```text
实现完了。用 reviewer 子代理对照 docs/specs/streak.md 审查这次 diff，并用 test-runner 跑一遍 npm test。
```

### 需要并行改代码时

```markdown
---
name: refactorer
description: 在很多文件上做机械式重构
isolation: worktree
---
在所有受影响文件中应用要求的重构，然后跑测试并汇报结果。
```

配合 `"worktree": { "baseRef": "head" }`，让子代理基于你当前分支的进度（[第 4 章](./04-plan-sessions-worktrees)）。

## 常见坑与排错

- **子代理不知道项目规则** → Explore/Plan 不读 CLAUDE.md；自定义子代理会读，但不会知道你在对话里说的话。派活时把关键约束写进提示。
- **设了 `permissionMode: plan` 子代理还是改了文件** → 主对话在 acceptEdits/auto/bypass 时会被忽略；改用 `tools` 限制。
- **`disallowedTools: Bash(git push *)` 把整个 Bash 拿走了** → 设计如此；要细粒度限制用 hooks 或权限规则。
- **子代理的修改 `/rewind` 撤不回** → 用 git。
- **子代理文件没加载** → frontmatter 不合法或字段拼错；`claude --debug` 后在 `~/.claude/debug/<session-id>.txt` 搜 `does not recognize or apply`；同目录重名只加载一个。
- **结果太长把主对话塞满** → 在描述和提示里要求“简短摘要”。
- **`Concurrent subagent limit reached`** → 同时运行到 20 个了，等一些结束。

## 自测题

<Quiz :data="quiz" />

## 原文链接

- Create custom subagents：<https://code.claude.com/docs/en/sub-agents>
- Run agents in parallel（各种并行方式对比）：<https://code.claude.com/docs/en/agents>
- Best practices（Know what subagents cost）：<https://code.claude.com/docs/en/best-practices>
- Worktrees（Isolate subagents with worktrees）：<https://code.claude.com/docs/en/worktrees#isolate-subagents-with-worktrees>
