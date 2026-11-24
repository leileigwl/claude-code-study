---
title: 6. Skills 与 slash commands
outline: [2, 3]
---

<script setup>
import quiz from '../../quizzes/06-skills-commands.json'
</script>

# 6. Skills 与 slash commands：把“你的流程”沉淀成可复用的命令

<div class="one-liner">

**一句话讲明白**：skill 是一个 `SKILL.md`（可带脚本和参考文件），平时只有名字和描述占上下文，用到时才加载全文。你可以 `/名字` 手动调用，也可以让 Claude 在匹配时自动调用；**有副作用的流程设成“只有你能调用”**。

</div>

## 为什么需要（对应哪种“乱跑”）

| 症状 | 原因 | 对策 |
| :- | :- | :- |
| 每次都要重新交代“改样式前先做原型、等我确认” | 流程只存在于你脑子里/聊天里 | 写成 skill，Claude 匹配到就照做 |
| CLAUDE.md 里塞了一大段发布流程，平时也占上下文 | CLAUDE.md 每个会话全量加载 | 挪进 skill，用时才加载 |
| Claude 觉得“代码看起来好了”就自己去部署/发布 | 有副作用的流程允许模型自行调用 | `disable-model-invocation: true` |
| 让它“准备 PR”，每次检查项都不一样 | 没有固定的检查清单 | `/pr-ready` skill 固定步骤 |

> 原文：“Create a skill when you keep pasting the same instructions, checklist, or multi-step procedure into chat, or when a section of CLAUDE.md has grown into a procedure rather than a fact.”

注意边界：**skill 仍然是给模型读的（non-deterministic）**。官方：“Claude skipped a rule that must hold every time: move the rule into a hook.” skill 负责“流程怎么走”，hook 负责“哪条线不能越”。

## 详细原理

### 自定义命令已经并入 skills

- `.claude/commands/deploy.md` 这种老格式**照样能用**，`/deploy` 调用；Claude 也能自动调用它（除非加 `disable-model-invocation: true`）。
- 新写的用 skill：`.claude/skills/deploy/SKILL.md`，**文件夹名就是命令名**，还能附带脚本、模板、参考文档。
- 同名时 skill 优先于 commands 文件。

### 内置命令 vs 内置（bundled）skills

内置命令执行固定逻辑；bundled skills 是“写好的提示词”，让 Claude 用工具去编排。与“管住 AI”最相关的：

| 命令 | 类型 | 作用 |
| :- | :- | :- |
| `/init` | 命令 | 生成初始 CLAUDE.md（`CLAUDE_CODE_NEW_INIT=1` 交互式，含 skills、hooks） |
| `/memory` | 命令 | 编辑 CLAUDE.md、开关 auto memory |
| `/context [all]` | 命令 | 上下文占用可视化 |
| `/compact [instructions]` / `/clear` / `/rewind` | 命令 | 压缩 / 清空 / 回退（[第 1](./01-agent-loop-context)、[4 章](./04-plan-sessions-worktrees)） |
| `/plan [description]` | 命令 | 直接进入 plan mode |
| `/permissions` / `/hooks` / `/mcp` / `/status` | 命令 | 查看与管理规则、hooks、MCP、已加载设置 |
| `/doctor [prompt-audit [path]]` | skill | 体检与修复建议；`prompt-audit` 审计指令文件 |
| `/fewer-permission-prompts` | skill | 扫描记录，把常见只读命令加进项目 allowlist |
| `/code-review`（别名 `/review`） | skill | 本地审查当前分支（[第 9 章](./09-claude-ship)） |
| `/ship`、`/steward` | skill | 开 PR、审查、照看 PR（第 9 章） |
| `/run`、`/verify`、`/run-skill-generator` | skill | 启动并实际运行应用来验证改动；记录启动配方 |
| `/loop`、`/debug`、`/batch`、`/claude-api` | skill | 循环任务、调试、批处理、Claude API 项目 |

小知识：会话开始时如果存在名为 `verify` 或 `simplify` 的（项目/个人等位置的、Claude 可调用的）skill，Claude Code 的提交指令会要求 Claude **每次提交前先运行它**（文档、测试改动除外；需 v2.1.286+，且未关闭 `includeGitInstructions`）。

### Skill 放在哪、重名谁赢

| 位置 | 路径 | 生效范围 |
| :- | :- | :- |
| Enterprise | 托管设置目录下 `.claude/skills/<name>/SKILL.md` | 组织部署的机器 |
| Personal | `~/.claude/skills/<name>/SKILL.md` | 你本机所有项目（不含 Cowork / 云端会话） |
| Project | `.claude/skills/<name>/SKILL.md` | 这个仓库，提交后团队共享 |
| Nested | `<subdir>/.claude/skills/<name>/SKILL.md` | 在该子目录或其下启动的会话；或 Claude 处理到那里的文件时 |
| Plugin | `<plugin>/skills/<name>/SKILL.md` | 插件启用处，命令为 `/插件名:skill名` |

重名：Enterprise > Personal > Project；你的 skill 可以替换同名的 bundled skill 或内置命令（但不替换其别名）；**`ship`、`ship-local`、`steward` 例外**——在 `/ship` 可用的环境里始终运行内置的，你的同名 skill 不会作为命令加载。

### Frontmatter 字段

所有字段可选，只有 `description` 被推荐。字段名必须一字不差（不认识的字段**静默忽略**）。

| 字段 | 作用 |
| :- | :- |
| `name` | `/` 菜单里的命令名，默认用目录名 |
| `description` | 做什么、何时用；Claude 据此判断是否调用。与 `when_to_use` 合计在列表里截断到 1,536 字符，**关键用途写在最前** |
| `when_to_use` | 触发短语、示例请求，追加在描述后 |
| `argument-hint` | 自动补全时提示参数，如 `[issue-number]` |
| `arguments` | 命名位置参数，用于 `$name` 替换 |
| `disable-model-invocation` | `true`：Claude 不能自行调用（描述也不进上下文；也不能被预加载进子代理） |
| `user-invocable` | `false`：从 `/` 菜单隐藏，只让 Claude 用（背景知识类） |
| `allowed-tools` | 调用该 skill 的**这一轮**免批准的工具；你发下一条消息即清除 |
| `disallowed-tools` | skill 生效期间移除的工具 |
| `model` / `effort` | 本轮使用的模型 / 思考强度 |
| `context: fork` + `agent` | 在一个子代理里运行（`agent` 选子代理类型） |
| `background` | 配合 fork；设 `false` 则在本轮等结果 |
| `hooks` | skill 被调用后注册、在会话剩余时间生效的 hooks |
| `paths` | 只有处理匹配文件时才激活 |
| `shell` | `!` 注入命令用 `bash`（默认）或 `powershell` |
| `metadata` / `license` / `compatibility` | 自用元数据 / Agent Skills 规范字段，Claude Code 不据此行动 |

**调用控制对照**：

| 设置 | 你能调用 | Claude 能调用 | 何时进上下文 |
| :- | :- | :- | :- |
| 默认 | 是 | 是 | 描述常驻，调用时加载全文 |
| `disable-model-invocation: true` | 是 | 不能自行调用 | 描述不在上下文，调用时加载 |
| `user-invocable: false` | 否 | 是 | 描述常驻，调用时加载 |

名字写在消息**开头**（`/deploy staging`）才直接运行；写在句中（`go ahead and /deploy to staging`）只算“允许 Claude 这条消息里运行它”。

### 参数与变量

| 写法 | 含义 |
| :- | :- |
| `$ARGUMENTS` | 全部参数；没有占位符接收时会以 `ARGUMENTS: <value>` 追加 |
| `$ARGUMENTS[0]` / `$0` | 第 1 个参数（0 起始），多词用引号包起来 |
| `$name` | `arguments` 里声明的命名参数 |
| `${CLAUDE_SKILL_DIR}` | 该 SKILL.md 所在目录，引用随 skill 附带的脚本 |
| `${CLAUDE_PROJECT_DIR}` | 项目根 |
| `${CLAUDE_SESSION_ID}` / `${CLAUDE_EFFORT}` | 会话 ID / 当前 effort |

### 动态上下文注入

在行首（或空白后）写 `` !`命令` ``：Claude Code **先运行命令**，用输出替换这一行，再把内容交给 Claude。多行用 ` ```! ` 代码块。输出不会再被二次展开。设 `"disableSkillShellExecution": true` 可禁用。

### 生命周期

- 调用后，渲染好的 SKILL.md 作为**一条消息**进入对话并在之后各轮保留（权限授予不保留）。
- 再次调用内容相同的 skill，只加一条“已加载”的提示，不重复塞内容。
- 压缩后：每个 skill 最近一次调用的前 5,000 tokens 被重新附上，总计 25,000 tokens，最旧的先丢——**最重要的指令写在开头**，SKILL.md 建议 500 行以内，细节放支持文件。

### `context: fork`：在子代理里跑

skill 内容成为子代理的任务提示，**子代理看不到你的对话历史**，所以说明必须自成一体；默认后台运行，结果完成后回到对话。只有“有明确任务”的 skill 适合 fork，纯规范类的 skill fork 出去会“没有可执行的任务、空手而归”。后台 fork 的编辑**不在 checkpoint 里**，回退靠 git。

### 用 settings 控制可见性：`skillOverrides`

| 值 | 列给 Claude | 在 `/` 菜单 |
| :- | :- | :- |
| `"on"` | 名字和描述 | 是 |
| `"name-only"` | 只有名字 | 是 |
| `"user-invocable-only"` | 隐藏 | 是 |
| `"off"` | 隐藏 | 隐藏 |

适合管理“不想改它 SKILL.md”的 skill（例如仓库里别人写的）。`/skills` 菜单可以直接切换，按 `t` 按 token 数排序。

## 落地到自己的仓库：四个 skill

本站 `template/.claude/skills/` 里有完整文件，这里说明设计意图。

### `/ui-prototype`：把“改样式先做原型”变成流程

```markdown
---
name: ui-prototype
description: 在任何视觉改动（CSS、布局、颜色、间距、动效、组件外观）之前使用。先在 docs/02-design/prototypes/ 做一个可直接打开的 HTML 原型，然后停下来等用户确认，确认前不改 web/src 里的样式。
when_to_use: 用户说“改一下样式/颜色/布局/好看点/调 UI/做个新页面外观”时
argument-hint: "[原型名，例如 v2.9-quiz-card]"
---
最重要：**原型被用户明确确认之前，不修改 web/src/ 下任何样式代码。**

1. 读当前相关组件，列出“改什么 / 不改什么”。
2. 新建 `docs/02-design/prototypes/$ARGUMENTS.html`：单文件、内联 CSS、375px 优先、现在/提议并排。
3. 回复：原型路径、改动要点、需要你拍板的问题。
4. **停下，等用户回复“确认”**。
5. 确认后才改源码，并在 PR 描述里链接原型。
```

- 允许 Claude 自动调用（不设 `disable-model-invocation`），因为我们**希望**它在你说“改好看点”时主动走这个流程。
- “最重要”的一句放在第一行，压缩后也能保住。
- 它是软约束；硬约束是[第 5 章](./05-hooks-gates)的 PreToolUse 对样式改动返回 `"ask"`。两层叠加：流程引导 + 越线时一定问你。

### `/feature-spec`：开工前先写规格

`disable-model-invocation: true`——只有你说开工时才运行；`allowed-tools: Read Grep Glob`，让它这一轮自由读代码。产出 `docs/specs/<名字>.md`，固定包含“范围外”和“完成标准”两节，这是之后防止范围蔓延的依据。

### `/pr-ready`：提 PR 前的固定检查

```markdown
---
name: pr-ready
description: 开 PR 之前的自检：对照规格检查范围、跑检查、整理 PR 描述。用户说“准备提 PR/收尾/可以提交了吗”时使用
allowed-tools: Bash(git status *) Bash(git diff *) Bash(git log *) Bash(npm run lint *) Bash(npm test *)
---
## 当前改动
!`git status --short`
!`git diff --stat HEAD`
...
```

用 `` !`git diff --stat HEAD` `` 把真实改动注入进来，Claude 不用猜；第一步是“对照规格逐条核对，范围外的改动指出来”。

### `steward`：给 `/steward`、`/ship` 的 watch 和 PR Steward 的规则

`.claude/skills/steward/SKILL.md` 不是给你调用的命令（同名的内置 `/steward` 会优先），而是官方约定的“照看 PR 规则文件”：watch 和 PR Steward 都会读它（[第 9 章](./09-claude-ship)）。

### 验证

```text
/skills                 # 看是否列出、token 数、可见性
What skills are available?
/feature-spec streak    # 手动调用
帮我把首页按钮调好看一点   # 观察是否自动走 /ui-prototype
```

## 常见坑与排错

- **skill 不触发** → 描述里要有用户会说的关键词；`/skill-name` 都不认，可能是名字里有非法字符；设了 `paths` 的要检查文件是否在基准目录内。
- **frontmatter 写错** → YAML 解析失败时 skill 照样加载但元数据为空：`/name` 能用，Claude 却无法按描述匹配。`claude --debug` 或 `claude plugin validate .claude/skills` 查。
- **触发太频繁** → 描述写得更具体，或加 `disable-model-invocation: true`。
- **前几轮照做、后面不照做** → 必须每次都遵守的规则挪进 hook；判断类指引写成覆盖整个任务的说法（“每次编辑后都跑测试”）；压缩后重新调用一次 skill。
- **描述被截断** → skill 太多时列表预算不够，`/doctor` 看开销，`skillListingBudgetFraction` 可调。
- **描述里的 `<branch>` 显示成 `&lt;branch&gt;`** → 用 `[branch]` 或 `argument-hint`。
- **项目 skill 的 `allowed-tools` 很宽** → 即使在未信任文件夹的 `-p` 运行里也会生效，审查别人仓库的 skill 再运行。

## 自测题

<Quiz :data="quiz" />

## 原文链接

- Extend Claude with skills：<https://code.claude.com/docs/en/skills>
- Commands（内置命令与 bundled skills）：<https://code.claude.com/docs/en/commands>
- Best practices（Put team procedures in skills）：<https://code.claude.com/docs/en/best-practices>
- Explore the context window（压缩后 skill 正文）：<https://code.claude.com/docs/en/context-window>
