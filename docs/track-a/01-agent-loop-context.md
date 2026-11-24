---
title: 1. Agent 循环与上下文窗口
outline: [2, 3]
---

<script setup>
import quiz from '../../quizzes/01-agent-loop-context.json'
</script>

# 1. Agent 循环与上下文窗口：AI 为什么会“乱跑”

<div class="one-liner">

**一句话讲明白**：Claude Code 是一个“收集上下文 → 动手 → 验证”不停循环的程序；它记得的一切都挤在一个有限的上下文窗口里。窗口满了会被压缩成摘要，**只在聊天里说过的规则最先被挤掉**——这就是 AI 跑偏的第一根源。

</div>

> 核对日期：2026-11-24（Claude Ship 上线次日）。本章依据的原文页面见文末“原文链接”。

## 为什么需要懂这个（对应哪种“乱跑”）

| 你看到的症状 | 真正的原因（本章讲的机制） | 本站哪里治 |
| :- | :- | :- |
| 开头说好“别动样式”，聊到后面它还是改了 | 规则只存在于对话里，会话变长后被**压缩**成摘要，细节丢了 | 本章 + [第 2 章 CLAUDE.md](./02-claude-md-memory) + [第 5 章 hooks](./05-hooks-gates) |
| 它说“修好了”，其实测试没跑或没过 | 循环的第三阶段“验证”没有可执行的检查，只能凭“看起来完成”停下 | 本章“落地” + 第 5 章 Stop hook |
| 一个会话里做了三件事，后面越改越乱 | 旧任务的文件、输出占着窗口，挤掉了新任务需要的信息 | 本章：`/clear`、子代理 |
| 读了一个巨大的日志文件后它开始反复压缩、卡住 | 单个输出太大，压缩后又被立刻填满（thrashing） | 本章“常见坑” |
| 它遵守了一条你从没写过的规则（例如提交里加 `Co-Authored-By`） | Claude Code 自己往上下文里加的 system reminder | 本章“Claude Code 自己加的上下文” |

核心认知只有一句：**模型会判断，程序才强制**。官方最佳实践把所有指令分成两类——你写给模型读的（提示词、CLAUDE.md、skill，属于 non-deterministic），和 Claude Code 程序必须执行的（hook、deny 规则、托管设置，属于 deterministic）。本章解释为什么前者会“漂”，后面几章教你什么时候换成后者。

> 原文（best-practices）：“Non-deterministic: you write the instruction, and Claude (the model) reads it… there's no *guarantee* that it'll follow your instructions.” “Deterministic: you configure the instruction, and Claude Code (the harness) *has* to execute this.”

## 详细原理

### Agent 循环的三个阶段

> 原文：“When you give Claude a task, it works through three phases: **gather context**, **take action**, and **verify results**. These phases blend together.”

- **收集上下文（gather context）**：搜文件、读代码、跑命令看输出。
- **采取行动（take action）**：编辑、新建文件，运行命令。
- **验证结果（verify results）**：跑测试、看构建结果，不对就带着新信息回到第一阶段。

循环按任务自适应：问一个关于代码库的问题，可能只需要“收集”；修 bug 会三个阶段反复转；重构可能要大量验证。官方原话是 Claude “chaining dozens of actions together and course-correcting along the way”——**几十个动作连起来、边走边纠偏**。这也意味着：如果你没给它“对不对”的判断标准，它的纠偏方向只能靠自己猜。

官方用“修复失败的测试”举例，Claude 可能会：

1. 跑测试套件，看哪些失败
2. 读错误输出
3. 搜索相关源文件
4. 读这些文件理解代码
5. 编辑文件修复问题
6. 再跑测试验证

<AgentLoopAnim />

### 驱动循环的两样东西：模型与工具

> 原文：“The agentic loop is powered by two components: models that reason and tools that act. Claude Code is the layer around the model that provides the tools and manages the context the model sees. This surrounding layer is what the term **agentic harness** refers to.”

内置工具大致分五类（完整清单见官方 [Tools reference](https://code.claude.com/docs/en/tools-reference)）：

| 类别 | Claude 能做什么 |
| :- | :- |
| File operations 文件操作 | 读文件、改代码、新建文件、重命名与整理 |
| Search 搜索 | 按模式找文件、用正则搜内容、探索代码库 |
| Execution 执行 | 跑 shell 命令、启动服务、跑测试、用 git |
| Web 网络 | 搜索网页、抓文档、查报错 |
| Code intelligence 代码智能 | 编辑后看到类型错误与警告、跳转定义、找引用（需安装 code intelligence 插件） |

此外还有派生子代理、向你提问等编排类工具。

### Claude 一启动就能接触到什么

在某个目录运行 `claude`，它能接触：

- **你的项目**：当前目录及子目录的文件；目录外的文件需要你许可。
- **你的终端**：你能在命令行跑的任何命令。
- **git 状态**：当前分支、未提交改动、最近提交历史。
- **CLAUDE.md**（或在没有 CLAUDE.md 时读 AGENTS.md）。
- **auto memory**：开启时，`MEMORY.md` 的前 200 行或前 25KB（以先到者为准）在会话开始时加载。
- **你配置的扩展**：MCP 服务器、skills、subagents、Chrome 集成。

### 上下文窗口里装着什么

> 原文：“Claude's context window holds your conversation history, file contents, command outputs, CLAUDE.md, auto memory, loaded skills, and system instructions. As you work, context fills up.”

官方 [Explore the context window](https://code.claude.com/docs/en/context-window) 用一个示例会话说明窗口怎么被填满（数字是示意值）：

| 阶段 | 进入上下文的内容 | 示例 tokens |
| :- | :- | -: |
| 你打字之前 | 系统提示 System prompt | 4,200 |
| 你打字之前 | 自动记忆 `MEMORY.md` | 680 |
| 你打字之前 | 环境信息 | 280 |
| 你打字之前 | MCP 工具名 | 120 |
| 你打字之前 | Skill 描述 | 450 |
| 你打字之前 | `~/.claude/CLAUDE.md` | 320 |
| 你打字之前 | 项目 CLAUDE.md | 1,800 |
| 第一条提示 | 你的提示 | 45 |
| 工作中 | 读 4 个文件（2,400 + 1,100 + 1,800 + 1,600） | 6,900 |
| 工作中 | 路径规则 `api-conventions.md`、`testing.md` | 380 + 290 |
| 工作中 | 搜索 `refreshToken`、Claude 的分析 | 600 + 800 |
| 工作中 | 两次编辑 + 两次 Prettier hook 输出 | 400 + 600 + 120 + 100 |
| 工作中 | `npm test` 输出、Claude 的改动总结 | 1,200 + 400 |
| 追问 | 你的追问、派子代理、子代理摘要、Claude 回复 | 40 + 80 + 420 + 1,200 |
| 会话末 | `!git status` 及输出、`/commit-push` skill 正文 | 180 + 620 |

`/compact` 前一共 22,225 tokens；子代理在**它自己的窗口**里另外用了 9,890。`/compact` 后剩 17,095：开机内容 + 1,725 的对话摘要 + 四个读过的文件 + skill 正文。

<ContextWindowAnim />

几个要点：

- **开机内容是固定开销**：CLAUDE.md 每一行、每个 MCP 服务器、每个 skill 描述，在**每个**会话里都占位置。
- **MCP 工具定义默认延迟加载**：“MCP tool definitions are deferred by default and loaded on demand via tool search, so only tool names and server instructions consume context until Claude uses a specific tool.”
- **Skill 只有描述常驻**，正文用到时才加载；设置 `disable-model-invocation: true` 的 skill 连描述都不进上下文（见[第 6 章](./06-skills-commands)）。
- **子代理在自己的窗口里干活**，只把摘要带回（见[第 7 章](./07-subagents)）。

### Claude Code 自己加进上下文的东西

如果 Claude 遵守了一条你没写过的规则，比如给提交加 `Co-Authored-By` 尾注，它可能来自 **system reminder**。Claude Code 会在你的消息旁边加入：

- 你的 CLAUDE.md 文件
- 你选的 output style 的说明
- “你之前编辑过的某文件在磁盘上被改了”的提示
- 提交和 PR 的署名（attribution）行

要改署名用 [`attribution`](https://code.claude.com/docs/en/settings-reference#attribution) 设置；要去掉 Claude Code 内置的提交与 PR 指令，把 [`includeGitInstructions`](https://code.claude.com/docs/en/settings-reference#includegitinstructions) 设为 `false`。**如果你的 CLAUDE.md 自己规定了提交/PR 规则，这一步很重要**，否则两套规则会打架（第 2 章“排错”也会提到）。

### 窗口满了：自动压缩（compaction）

> 原文：“Claude Code manages context automatically as you approach the limit. It compacts the conversation into a summary. The summary keeps your requests and key code snippets, but detailed instructions from early in the conversation may be lost. Put persistent rules in CLAUDE.md rather than relying on conversation history.”

**压缩后什么还在、什么会变**（官方 What survives compaction 全表）：

| 机制 | 压缩之后 |
| :- | :- |
| 系统提示与 output style | 仍然生效 |
| 项目根目录 CLAUDE.md 与无 `paths` 的规则 | 从磁盘重新注入 |
| Auto memory | 从磁盘重新注入 |
| Skill 描述 | 按当前 skills 重建并重新注入（需 v2.1.304+） |
| Git 状态快照 | 若会话开始时有，会重新读一份新的 |
| Plan mode 里写的计划 | 从磁盘重新注入 |
| 带 `paths:` 的规则 | **按需**重新加载（要等再次碰到匹配文件） |
| 子目录里的 CLAUDE.md | **按需**重新加载 |
| Claude 读过或改过的文件 | 重新读回最多 5 个，最近修改的优先；超过 5,000 tokens 的只以路径引用（显示为 `Referenced file`） |
| 调用过的 skill 正文 | 重新注入，每个 skill 上限 5,000 tokens、总计 25,000 tokens，最旧的先丢；截断保留文件开头 |
| 后台命令与后台子代理 | 继续运行；Claude Code 会提醒 Claude 哪些还在跑，避免重复启动 |
| hooks 早先加入的上下文 | **随对话一起被摘要** |
| 匹配 `compact` 来源的 SessionStart hook | 会运行，输出加进压缩后的上下文 |

由此推出三条实用结论：

1. **必须一直遵守的规则写在项目根 CLAUDE.md**（或不带 `paths` 的 rule），它会被重新注入。
2. **路径规则和子目录 CLAUDE.md 不保证压缩后立刻还在**。官方原话：“If a rule must persist across compaction, drop the `paths:` frontmatter or move it to the project-root CLAUDE.md.”
3. **skill 最重要的指令放在 `SKILL.md` 开头**，因为截断保留开头。

### 你能主动做的事（不等自动压缩）

| 做法 | 命令 | 适用场景 |
| :- | :- | :- |
| 带重点压缩 | `/compact focus on the auth bug fix` | 开始一个长的新任务前，指定摘要保留什么 |
| 只压缩一部分 | `/rewind` → 选一条消息 → **Summarize from here** 或 **Summarize up to here** | 一段冗长的调试过程想压掉，但保留开头的指令 |
| 提前压缩 | `/autocompact 500k`（接受 100K 及以上） | 不想等窗口快满才压 |
| 换任务就清空 | `/clear` | 切到不相关的工作；旧对话会“挤掉你接下来需要的文件，并在每条消息上消耗 tokens” |
| 把大量读取外包 | 让子代理去做 | 文件内容留在它的窗口，不进你的 |
| 看真实占用 | `/context`（`/context all` 看完整的 Memory files 列表） | 任何时候 |

> 自动压缩的阈值取决于模型和配置，官方在 [Model configuration](https://code.claude.com/docs/en/model-config#default-auto-compact-thresholds) 给出每个模型的默认边界。Fable 系列、Sonnet 5 及之后、Haiku 5.5、Opus 4.6 及之后、Sonnet 4.6 支持 100 万 token 窗口；“Compaction works the same way at the larger limit.”——窗口大了，压缩机制一样。

### 会话彼此独立

> 原文：“Sessions are independent. Each new session starts with a fresh context window, without the conversation history from previous sessions.”

跨会话保留东西只有两条路：你写的 CLAUDE.md、Claude 自己记的 auto memory。会话本身以 JSONL 明文存在 `~/.claude/projects/` 下，所以可以 resume、fork、rewind（[第 4 章](./04-plan-sessions-worktrees)）。

### 你也在循环里：打断与转向

- **按 `Esc`**：立即停止，正在运行的工具调用被取消，Claude 等你下一条指令。
- **直接输入纠正并回车**（不停止）：消息显示为排队；如果 Claude 正在跑工具，会在这些调用结束后、**同一轮内**读到并调整。

## 落地到自己的仓库

目标：让“必须一直遵守”的东西不依赖聊天记录；让每次任务都有可执行的“验证”。

### 第 1 步：先量一下开机成本

在你的仓库里启动 `claude`，运行：

```text
/context all
```

看 **Memory files** 列表确认哪些 CLAUDE.md 真的加载了，看各类别占了多少。MCP 服务器多、CLAUDE.md 长，都会在这里现形。

### 第 2 步：在 CLAUDE.md 里写“验证命令”和“压缩须知”

最佳实践说：“If your repo already has one of these, the single most useful line in your CLAUDE.md is the command that runs it.” 以一个 Vue + Node 项目为例（命令换成你仓库里真实存在的）：

```markdown
# Commands
- 安装：npm ci
- 前端单测（单个文件）：npx vitest run path/to/file.test.ts
- 前端全部检查：npm run lint && npm run test
- 后端测试：npm --prefix server test

# Compact Instructions
压缩时务必保留：
- 当前任务的目标与“完成标准”（哪些命令必须通过）
- 本次已修改的文件清单
- 用户明确禁止的事项（例如：未经确认不改前端样式）
```

“Compact Instructions”这一节是官方给的控制压缩内容的方式之一（另一种是 `/compact <重点>`）。

### 第 3 步：压缩后自动“提醒一遍”（SessionStart + compact）

官方 hooks 指南给了这个模式：压缩后由 `SessionStart` hook（matcher 为 `compact`）把关键信息重新注入。它的纯文本 stdout 会被加进 Claude 的上下文。放进 `.claude/settings.json`：

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "compact",
        "hooks": [
          {
            "type": "command",
            "command": "echo '提醒：改前端样式前必须先做 HTML 原型并等用户确认；完成前必须跑 npm run lint && npm run test。最近提交：' && git log --oneline -5"
          }
        ]
      }
    ]
  }
}
```

> 官方说明：“For injecting context on every session start, consider using CLAUDE.md instead.”——每次开机都要的内容放 CLAUDE.md；这个 hook 只用来**压缩后补一刀**。

### 第 4 步：养成“一个会话一件事”的节奏

1. 开新任务：`/clear`（或新开终端），必要时 `claude -n <任务名>` 给会话起名，方便之后 `claude --resume <任务名>`。
2. 长任务开工前：`/compact focus on <这次要做的事>`。
3. 需要读大量日志/跑全量测试：让子代理做，“只汇报失败的测试和错误信息”（官方原句：*Use a subagent to run the test suite and report only the failing tests with their error messages*）。
4. 收尾：要求 Claude 给出**证据**——它跑的命令和输出，而不是一句“都通过了”。

### 第 5 步：把“验证”变成程序强制

提示里说“跑完测试再结束”只是请求；要强制，用 [第 5 章](./05-hooks-gates) 的 `Stop` hook。最佳实践原文示例：

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          { "type": "command", "command": "pnpm tsc --noEmit 1>&2 || exit 2" }
        ]
      }
    ]
  }
}
```

exit 2 会阻止 Claude 结束本轮，stderr 作为原因返回给它。

## 常见坑与排错

**1. 压缩后某条规则“消失”了**
官方排查顺序：它是不是只在对话里说过？是不是写在还没重新加载的子目录 CLAUDE.md 里？是不是一条带 `paths:`、压缩后还没再碰到匹配文件的规则？前者写进 CLAUDE.md；后两者如果必须持久，去掉 `paths:` 或挪到根 CLAUDE.md。

**2. `Autocompact is thrashing: the context refilled to the limit...`**
压缩本身成功了，但某个文件或工具输出立刻又把窗口填满，连续几次后 Claude Code 停止重试。官方恢复步骤：
1. 让 Claude 分块读超大文件（指定行范围或函数）；
2. 运行带重点的 `/compact`，丢掉大输出，例如 `/compact keep only the plan and the diff`；
3. 把大文件工作交给子代理；
4. 旧对话不需要了就 `/clear`。
`/clear` 后仍复现，用 `/context` 看 `Messages` 行是否最大。

**3. 压缩后文件“只剩路径”**
超过 5,000 tokens 的文件压缩后以 `Referenced file` 形式回来，不含内容；需要时让 Claude 重新读取相关片段。

**4. 不该加的提交尾注 / PR 文案**
检查是不是 Claude Code 内置的 git 指令或 attribution（见上文 `includeGitInstructions`、`attribution`），而不是模型“自作主张”。

**5. 换模型后第一轮特别慢**
官方专门有一页 [prompt caching](https://code.claude.com/docs/en/prompt-caching) 解释“why a model switch triggers a slow uncached turn”。长任务中途尽量别来回切模型。

**6. 往 CLAUDE.md 加“IMPORTANT”也不管用**
官方：要么文件太长、那一行被淹没；要么这是一条不允许例外的规则——那它属于 hook。

## 自测题

<Quiz :data="quiz" />

> 题目同时导出在仓库 `quizzes/01-agent-loop-context.json`，可导入“知行快刷”。

## 原文链接

- How Claude Code works：<https://code.claude.com/docs/en/how-claude-code-works>
- Explore the context window：<https://code.claude.com/docs/en/context-window>
- Best practices：<https://code.claude.com/docs/en/best-practices>
- Troubleshooting（thrashing）：<https://code.claude.com/docs/en/troubleshooting#auto-compaction-stops-with-a-thrashing-error>
- Model configuration（auto-compact 窗口）：<https://code.claude.com/docs/en/model-config>
- Hooks guide（压缩后重新注入）：<https://code.claude.com/docs/en/hooks-guide#re-inject-context-after-compaction>
- Commands（`/context`、`/compact`、`/clear`、`/rewind`）：<https://code.claude.com/docs/en/commands>
