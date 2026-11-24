---
title: 2. CLAUDE.md / 记忆 / .claude 目录
outline: [2, 3]
---

<script setup>
import quiz from '../../quizzes/02-claude-md-memory.json'
</script>

# 2. CLAUDE.md、记忆与 `.claude` 目录：把“项目常识”放对地方

<div class="one-liner">

**一句话讲明白**：CLAUDE.md 是你写给 Claude 的“项目常识”，每个会话开头都会读；auto memory 是 Claude 自己记的笔记；`.claude/` 目录放的是规则、设置、skills、子代理等配置。**它们都只是“建议”，不是强制**——要强制，得交给 settings 和 hooks。

</div>

## 为什么需要（对应哪种“乱跑”）

| 症状 | 原因 | 对策 |
| :- | :- | :- |
| 每次新会话都要重新解释“我们用 npm 不用 pnpm”“测试怎么跑” | 会话彼此独立，没有写下来的常识就不存在 | 写进项目 CLAUDE.md |
| CLAUDE.md 越写越长，Claude 反而不照做 | 每行都占上下文，长了“reduce adherence”；矛盾的指令会被“任选一条” | 控制在 200 行内，按路径拆到 `.claude/rules/` |
| 前端规则在改后端时也一直占着上下文 | 规则没有按路径限定 | 带 `paths:` 的 rule，碰到匹配文件才加载 |
| 你写了“绝不改 X”，它还是改了 | CLAUDE.md 是 context 不是 enforcement | 改用 deny 规则或 PreToolUse hook（[第 3](./03-settings-permissions-sandbox)、[5 章](./05-hooks-gates)） |
| 个人偏好被提交进仓库、影响别人 | 放错了层 | 放 `CLAUDE.local.md` 或 `~/.claude/CLAUDE.md` |

> 原文：“Claude treats CLAUDE.md files and auto memory as context. They aren't enforced configuration. To block an action regardless of what Claude decides, use a PreToolUse hook instead.”

## 详细原理

### CLAUDE.md 与 auto memory 的区别

| | CLAUDE.md 文件 | Auto memory |
| :- | :- | :- |
| 谁写 | 你 | Claude |
| 内容 | 指令与规则 | 学到的东西与模式 |
| 范围 | 项目、用户或组织 | 每个仓库一份，所有 worktree 共享 |
| 加载 | 每个会话 | 开启 auto memory 的会话，`MEMORY.md` 前 200 行或 25KB |
| 用途 | 编码规范、工作流、项目架构 | 你的偏好、你给过的纠正、代码里推不出来的项目背景 |

### CLAUDE.md 放在哪：四个层级

下表按**加载顺序**排列，从最广到最具体，所以项目级指令在上下文里排在用户级之后：

| 层级 | 位置 | 用途 | 和谁共享 |
| :- | :- | :- | :- |
| 托管策略 Managed policy | macOS `/Library/Application Support/ClaudeCode/CLAUDE.md`；Linux/WSL `/etc/claude-code/CLAUDE.md`；Windows `C:\Program Files\ClaudeCode\CLAUDE.md` | IT/DevOps 统一下发的组织规范 | 组织内所有用户 |
| 用户 User | `~/.claude/CLAUDE.md` | 你在所有项目的个人偏好 | 只有你（所有项目） |
| 项目 Project | `./CLAUDE.md` 或 `./.claude/CLAUDE.md` | 团队共享的项目说明 | 通过版本控制共享 |
| 本地 Local | `./CLAUDE.local.md` | 你在这个项目的私人偏好，**要加进 .gitignore** | 只有你（当前项目） |

### 加载规则（最容易误解的部分）

<ClaudeMdLayersAnim />

1. **向上找、启动即加载**：“Claude Code loads `CLAUDE.md` and `CLAUDE.local.md` from your current working directory and every directory above it.”
2. **拼接，不覆盖**：“All discovered files are concatenated into context rather than overriding each other.” 顺序从文件系统根往下到启动目录，**越靠近启动目录的越后读**；同一目录内 `CLAUDE.local.md` 排在 `CLAUDE.md` 后面。
3. **子目录按需加载**：启动目录**下面**的子目录里的 CLAUDE.md，要等 Claude 读/写/编辑该子目录里的文件（包括 `cat`、`head` 这种算“读”的 Bash 命令）才加载。
4. **矛盾会被随机处理**：“if two instructions contradict each other, Claude may pick one arbitrarily.”
5. **HTML 注释不占 tokens**：块级 `<!-- 维护者备注 -->` 注入前被去掉（代码块里的保留）。
6. **`--add-dir` 加的目录默认不读它的 CLAUDE.md**，除非设置 `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1`。

### 写什么、怎么写

**什么时候往 CLAUDE.md 加内容**（官方四条）：Claude 第二次犯同样的错；code review 发现了它本该知道的事；你在聊天里输入了上次也输过的纠正；新同事也需要同样的背景。

**什么不该写**（best practices 的判断法）：问自己两个问题——“它读代码能发现吗？”“它真的会去看吗？”——两个都是“是”，就别写。官方推荐的 CLAUDE.md 只装：

- 如何验证工作：确切的 test、typecheck、lint 命令，**以及怎么跑单个测试文件**
- 代码里会误导人的地方：到处都是但新代码不能照抄的旧模式、看起来没用其实还在用的目录
- 仓库里看不到的决定：团队定的错误处理方式、怎么部署、什么需要迁移评审
- 你已经纠正过两次的事

**写法**：

- 具体到可验证：用“2 空格缩进”而不是“格式规范”；“提交前运行 `npm test`”而不是“记得测试”。
- 控制规模：**每个文件目标 200 行以内**。
- 结构化：用标题和列表分组。
- 一致：定期清理过时和互相矛盾的指令，或者运行 `/doctor prompt-audit` 让 Claude 帮你找（需 v2.1.283+，只出报告和建议改动，你同意前不改文件）。

### `@` 导入

- 语法 `@path/to/import`，相对路径相对于**写导入的那个文件**；最多递归 4 层。
- 路径有空格要用反斜杠转义：`@Design\ Docs/api-conventions.md`；加引号的路径**不会**被导入。
- 写在反引号里的 `@README` 不会被导入。
- **导入不省上下文**：被导入的文件和 CLAUDE.md 一起加载。
- 指向工作目录之外的导入（例如 `@~/.claude/my-project-instructions.md`）第一次会弹审批框；拒绝后就一直禁用，不再提示。

### `.claude/rules/`：按主题、按路径拆分

```text
your-project/
├── .claude/
│   ├── CLAUDE.md
│   └── rules/
│       ├── code-style.md
│       ├── testing.md
│       └── security.md
```

- 所有 `.md` 递归发现，可以分 `frontend/`、`backend/` 子目录。
- **没有 `paths`** 的规则：启动时加载，优先级等同 `.claude/CLAUDE.md`。
- **有 `paths`** 的规则：Claude 用 Read/Write/Edit 碰到匹配文件时才加载。`paths` 是 rule frontmatter 里**唯一**被读取的字段。

```markdown
---
paths:
  - "src/api/**/*.ts"
---
# API Development Rules
- All API endpoints must include input validation
```

常用 glob：

| 模式 | 匹配 |
| :- | :- |
| `**/*.ts` | 基准目录下任何位置的 `.ts` |
| `src/**/*` | `src/` 下所有文件 |
| `*.md` | 任何位置的 `.md` |
| `/*.md` | 只匹配基准目录**直接**下的 `.md` |
| `src/components/*.tsx` | 只匹配该目录直接下的 `.tsx` |

支持大括号展开 `"src/**/*.{ts,tsx}"`。基准目录：项目规则是包含 `.claude` 的那个目录；用户规则（`~/.claude/rules/`）是会话的主工作目录。frontmatter 的 YAML 解析失败时，规则会被当作“没有 paths”加载——`claude --debug` 能看到解析错误。

### AGENTS.md（和其他 AI 工具共用一份说明）

默认（**Project instructions** = `claude-md-or-agents-md`）：

| 仓库里有 | Claude 读 |
| :- | :- |
| 只有 `AGENTS.md`（工作目录及以上没有 CLAUDE.md / CLAUDE.local.md） | `AGENTS.md` |
| `AGENTS.md` + `CLAUDE.md` 或 `CLAUDE.local.md` | **只读 CLAUDE.md** |
| `CLAUDE.md` 里写了 `@AGENTS.md` | CLAUDE.md，并通过导入包含 AGENTS.md |

在 `/config` 里可改为 `claude-md-and-agents-md`（两个都读）、`claude-md`、`managed-only`。直接读取 AGENTS.md 需要 v2.1.277+。**注意**：你一旦加了 `CLAUDE.local.md`，它也“算数”，会让 Claude 不再读 AGENTS.md。最稳的写法是在 CLAUDE.md 第一行写 `@AGENTS.md`，下面写 Claude 专属内容。

### 大小限制

- 启动时加载的 CLAUDE.md：只要不超过 4 MiB 就**整份**给 Claude；超过 4 MiB 整份跳过。
- 按需加载的文件（子目录 CLAUDE.md、按需的 rules、带 paths 的 rules）有每个文件的字符上限：200K 窗口为 40,000 字符；1M 窗口在 Opus 4.6 / Sonnet 4.6 上为 200,000、在更新模型上为 150,000。超过只给开头，并提示 Claude 用 Read 读剩下的（v2.1.309 起生效）。用 `wc -m` 查字符数。

### Auto memory（Claude 自己记的笔记）

- 默认在本地会话开启；`/memory` 里开关（写入 `~/.claude/settings.json` 的 `autoMemoryEnabled`）；单个项目关闭可在项目设置写 `"autoMemoryEnabled": false`；环境变量 `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`。
- 四种类型（frontmatter 的 `type`）：`user`（你的角色与偏好）、`feedback`（你的纠正）、`project`（代码和 git 里推不出的进行中工作、截止日期、决定）、`reference`（外部信息在哪，例如 issue tracker）。
- 不记能从代码推出来的东西，也不记 CLAUDE.md 已经写了的东西。
- 存储：`~/.claude/projects/<project>/memory/`，`MEMORY.md` 是索引（每条一行），其余是主题文件按需读取。同一 git 仓库的所有 worktree 和子目录共享一份；**只在本机**，不跨机器、不进云端会话。
- 你说“记住总是用 pnpm”，Claude 存进 auto memory；要进 CLAUDE.md 得明说“add this to CLAUDE.md”。

### `.claude` 目录全景：改什么去哪个文件

| 你想 | 改这里 | 范围 |
| :- | :- | :- |
| 给项目背景和约定 | `CLAUDE.md` | 项目或全局 |
| 允许/禁止某些工具调用 | `settings.json` 的 `permissions` 或 `hooks` | 项目或全局 |
| 工具调用前后跑脚本 | `settings.json` 的 `hooks` | 项目或全局 |
| 设置会话环境变量 | `settings.json` 的 `env` | 项目或全局 |
| 个人覆盖、不进 git | `settings.local.json` | 仅项目 |
| 用 `/name` 调用的流程 | `skills/<name>/SKILL.md` | 项目或全局 |
| 专门的子代理 | `agents/*.md` | 项目或全局 |
| 用脚本编排大量子代理 | `workflows/*.js` | 项目或全局 |
| 接外部工具（MCP） | `.mcp.json` | 仅项目 |
| 改回复格式 | `output-styles/*.md` | 项目或全局 |

还有两个容易漏的项目根文件：`.mcp.json`（团队共享的 MCP 服务器）、`.worktreeinclude`（新建 worktree 时要复制过去的 gitignored 文件，如 `.env`）。

各类文件 frontmatter 字段（详见对应章节）：

| 文件 | 字段 |
| :- | :- |
| `skills/<name>/SKILL.md` | `name` `description` `when_to_use` `argument-hint` `arguments` `disable-model-invocation` `user-invocable` `allowed-tools` `disallowed-tools` `model` `effort` `context` `agent` `background` `hooks` `paths` `shell` `metadata` `license` `compatibility` |
| `commands/*.md` | 除 `name`、`paths` 外的 skill 字段 |
| `agents/*.md` | `name` `description` `tools` `disallowedTools` `model` `permissionMode` `maxTurns` `autoCompactWindow` `skills` `mcpServers` `hooks` `memory` `background` `effort` `isolation` `color` `initialPrompt` `omitClaudeMd` `experimental` |
| `output-styles/*.md` | `name` `description` `keep-coding-instructions` `force-for-plugin` |
| `rules/*.md` | `paths` |

## 落地到自己的仓库

### 第 1 步：生成初稿，然后做减法

```text
/init
```

`/init` 会分析代码库生成 CLAUDE.md；已有时只提改进建议不覆盖。官方说“From there the work is mostly removing lines.” 想要多阶段交互（同时问要不要建 skills、hooks），先设 `CLAUDE_CODE_NEW_INIT=1`。

### 第 2 步：按“四层”分工

| 内容 | 放哪 |
| :- | :- |
| 构建/测试命令、仓库特有的坑、团队决定 | `./CLAUDE.md`（提交） |
| 只对 `src/` 前端生效的规范 | `.claude/rules/frontend.md`（带 `paths`，提交） |
| 你自己的本地地址、测试账号 | `./CLAUDE.local.md`（加 .gitignore） |
| 你所有项目通用的习惯（回复用中文、提交信息格式） | `~/.claude/CLAUDE.md` |
| “绝不能做”的事 | **不放这里**，放 `.claude/settings.json` 的 deny / hooks |

### 第 3 步：一个可直接用的骨架

`CLAUDE.md`（控制在几十行；下面是通用示例，知行快刷的真实结构——Taro + React 前端、Python + uv 后端、`AGENTS.md` 为唯一规则来源——见[第 10 章](./10-repo-template)）：

```markdown
<!-- 维护提示：这里只写 Claude 读代码推不出来的东西；硬规则放 .claude/settings.json -->
# 项目一句话
H5 刷题应用：Vue 3 前端（/web）+ Node 后端（/server）。

# Commands
- 安装：npm ci
- 前端检查：npm run lint && npm run test
- 单个测试文件：npx vitest run <path>
- 后端测试：npm --prefix server test

# Workflow
- 每个任务一个分支、一个 PR；不直接提交到 main
- 完成前给出你运行的命令和输出作为证据
- 改动前端样式（CSS/布局/视觉）前，先在 docs/02-design/prototypes/ 做 HTML 原型并等我确认

# Gotchas
- 生产环境 API 地址必须来自环境变量，缺失时要直接报错（fail-fast），不要回退到默认值

# Compact Instructions
压缩时保留：当前任务目标与完成标准、已修改文件清单、我禁止的事项
```

`.claude/rules/frontend.md`：

```markdown
---
paths:
  - "web/src/**/*.{vue,ts,css}"
---
- 新组件参照 web/src/components/ 里已有组件的写法
- 视觉改动必须先有已确认的原型（见 CLAUDE.md Workflow）
```

`.gitignore` 追加：

```text
CLAUDE.local.md
.claude/settings.local.json
.claude/worktrees/
```

### 第 4 步：验证真的加载了

```text
/context all     # 看 Memory files 列表
/memory          # 打开、编辑记忆文件，开关 auto memory
```

要追踪按需加载，用 `InstructionsLoaded` hook 记日志（见[第 5 章](./05-hooks-gates)）。

## 常见坑与排错

**Claude 不照 CLAUDE.md 做**（官方排查清单）：
1. `/context all` 看 Memory files 里有没有它；没有就是 Claude 看不到。
2. 出现 `Instruction file not loaded` 提示，查[错误参考](https://code.claude.com/docs/en/errors#instruction-file-not-loaded)。
3. 子目录 CLAUDE.md 不会出现在 Memory files 里（按需加载）；测试新的子目录文件时，**从 shell 创建**，再让 Claude 读那个子目录里的文件。
4. 指令写得更具体。
5. 检查多份文件之间的矛盾。
6. 检查是否和 Claude Code 内置指令冲突（提交/PR 规则 → `includeGitInstructions`、`attribution`）。
7. 必须在固定时刻发生的事（每次提交前、每次编辑后）→ 写成 hook。

> 补充：CLAUDE.md 是作为**系统提示之后的一条用户消息**送达的，不是系统提示本身。需要系统提示级别的指令用 `--append-system-prompt`（适合脚本场景）。

**AGENTS.md 没被读**：大概率是路径上存在 CLAUDE.md / `.claude/CLAUDE.md` / CLAUDE.local.md；或版本低于 v2.1.277；或 `/config` 里 Project instructions 是 `claude-md` / `managed-only`。

**子目录 CLAUDE.md 后半截被忽略**：超过按需加载的字符上限（200K 窗口 40,000 字符），拆分成多个 rules 文件。

**worktree 里没有我的 CLAUDE.local.md**：gitignored 文件只在创建它的 worktree 里。官方建议改为从 home 目录导入：`@~/.claude/my-project-instructions.md`。

**monorepo 里加载了别的团队的 CLAUDE.md**：在 `.claude/settings.local.json` 里用 `claudeMdExcludes`（glob 匹配绝对路径，各层数组合并；托管 CLAUDE.md 排除不了）。

## 自测题

<Quiz :data="quiz" />

## 原文链接

- How Claude remembers your project（memory）：<https://code.claude.com/docs/en/memory>
- Explore the .claude directory：<https://code.claude.com/docs/en/claude-directory>
- Best practices（Keep CLAUDE.md short / Scope rules）：<https://code.claude.com/docs/en/best-practices>
- Large codebases（嵌套 CLAUDE.md）：<https://code.claude.com/docs/en/large-codebases>
- Debug your configuration：<https://code.claude.com/docs/en/debug-your-config>
