---
title: 5. Hooks：硬性门禁
outline: [2, 3]
---

<script setup>
import quiz from '../../quizzes/05-hooks-gates.json'
</script>

# 5. Hooks：把“必须/绝不”变成程序执行的门禁

<div class="one-liner">

**一句话讲明白**：hook 是你挂在 Claude Code 生命周期固定点上的脚本（或 HTTP / MCP 调用）。**它由程序执行，不由模型决定**：编辑前可以拦、编辑后可以自动修、想结束时可以把它拽回去先过测试。

</div>

## 为什么需要（对应哪种“乱跑”）

> 原文（best practices）：“If you keep adding emphasis to a CLAUDE.md line and Claude still misses it, that's a sign the line belongs in a hook. The reverse holds too: if you have hooks for things that are only preferences, delete them and let Claude decide.”

| “乱跑”的表现 | 用哪个 hook |
| :- | :- |
| 改了不该碰的文件（`.env`、CI 配置、lock 文件） | `PreToolUse` + exit 2 |
| 绕过你的流程直接改样式 | `PreToolUse` 返回 `"ask"`，强制弹窗 |
| 编辑后格式乱、lint 不过 | `PostToolUse` 自动 `eslint --fix` / prettier |
| 说“完成了”其实测试没过 | `Stop` + exit 2 |
| 压缩后忘了关键约定 | `SessionStart`（matcher `compact`）重新注入 |
| 想知道哪些 CLAUDE.md / rules 实际加载了 | `InstructionsLoaded` 记日志 |

**别过度**：官方提醒每个 hook 和 deny 规则都会偶尔误伤、需要人维护，“If you ever find yourself at forty of them, most are probably preferences that Claude could have weighed on its own.”

## 详细原理

### 三层结构：事件 → matcher 组 → handler

```jsonc
{
  "hooks": {
    "PreToolUse": [                       // ① 事件
      {
        "matcher": "Bash",                // ② matcher 组：只对 Bash 工具
        "hooks": [                        // ③ 一个或多个 handler
          {
            "type": "command",
            "if": "Bash(rm *)",           // 可选：再用权限规则语法过滤
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/block-rm.sh",
            "args": []
          }
        ]
      }
    ]
  }
}
```

（上面的 `//` 注释仅为说明；真实 settings 文件是严格 JSON，不能写注释。）

**五种 handler**：`command`（shell 命令，stdin 收 JSON）、`http`（POST 到 URL）、`mcp_tool`（调用已配置 MCP 服务器的工具）、`prompt`（让模型单轮判断）、`agent`（派子代理带工具核查，实验性）。官方强调：`prompt`/`agent` 是“让另一个模型决定”，**不是确定性的**；真正的强制用 `command`、`http` 或 `mcp_tool`。

**放在哪**：

| 位置 | 范围 | 可共享 |
| :- | :- | :- |
| `~/.claude/settings.json` | 你的所有项目 | 否 |
| `.claude/settings.json` | 单个项目 | 是，可提交 |
| `.claude/settings.local.json` | 单个项目 | 否 |
| 托管策略 | 组织 | 是，管理员控制 |
| 插件 `hooks/hooks.json` | 插件启用时 | 是 |
| Skill frontmatter | skill 被调用后 | 是 |
| Subagent frontmatter | 该子代理运行时 | 是 |

不同层的 hooks **合并**，不互相替换；同一个 handler 在多个 settings 文件里定义只运行一次。settings 里的 hooks 在子代理里同样触发（输入里带 `agent_id`、`agent_type`）。

### 事件一览

按节奏分三类：每会话（`SessionStart`、`SessionEnd`）、每轮（`UserPromptSubmit`、`Stop`、`StopFailure`）、每次工具调用（`PreToolUse`、`PostToolUse`）。

| 事件 | 何时触发 | 能否阻止（exit 2） |
| :- | :- | :- |
| `SessionStart` | 会话开始或恢复 | 否（stderr 只给你看） |
| `Setup` | `--init-only`，或 `-p` 下 `--init`/`--maintenance` | 否 |
| `UserPromptSubmit` | 提交提示后、Claude 处理前（也包括定时任务、后台子代理回报等自动开启的轮次） | **能**，拒绝该提示 |
| `UserPromptExpansion` | 你输入的命令展开成提示时 | **能** |
| `PreToolUse` | 工具执行前 | **能**，阻止调用 |
| `PermissionRequest` | 需要权限决定时 | 否（要用 JSON `decision`） |
| `PermissionDenied` | auto 模式拒绝某调用时 | 否 |
| `PostToolUse` | 工具成功后 | 否（stderr 给 Claude） |
| `PostToolUseFailure` | 工具失败后 | 否（stderr 给 Claude） |
| `PostToolBatch` | 一批并行调用全部结束、下一次调用模型前 | **能**，停止循环 |
| `Notification` | 发通知时 | 否 |
| `MessageDisplay` | 显示助手文本时 | 否 |
| `SubagentStart` / `SubagentStop` | 子代理启动 / 结束 | 否 / **能**（阻止子代理停止） |
| `TaskCreated` / `TaskCompleted` | 通过 TaskCreate 建任务 / 标记完成 | **能** / **能** |
| `Stop` | Claude 结束回复时（用户打断不触发） | **能**，让它继续 |
| `StopFailure` | 因 API 错误结束本轮 | 否 |
| `TeammateIdle` | agent team 成员将空闲 | **能** |
| `InstructionsLoaded` | CLAUDE.md 或 `.claude/rules/*.md` 被加载 | 否 |
| `ConfigChange` | 会话中配置文件变化 | **能**（`policy_settings` 除外） |
| `CwdChanged` / `DirectoryAdded` / `FileChanged` | 工作目录变化 / 加目录 / 被监视文件变化 | 否 |
| `WorktreeCreate` / `WorktreeRemove` | 建 / 删 worktree（替换默认 git 行为） | 任何非 0 都会让操作失败 |
| `PreCompact` / `PostCompact` | 压缩前 / 后 | **能** / 否 |
| `PreModelSwitch` / `PostModelSwitch` | 切换模型前 / 后 | **能** / 否 |
| `Elicitation` / `ElicitationResult` | MCP 服务器请求用户输入 / 你回应后 | **能** / **能** |
| `SessionEnd` | 会话结束 | 否 |

### 一次工具调用里的触发顺序

<HookLifecycleAnim />

- `PreToolUse` 在权限提示之前运行；以 exit 2 拦截时，**在评估权限规则之前**就挡下了，即使有 allow 规则也没用。
- 但反过来，`PreToolUse` 返回 `"allow"` **绕不过** deny / ask 规则，也免不掉“任何模式都不自动批准”的那些提示。
- `"deny"` 在**任何**权限模式下都有效，包括 `bypassPermissions`。
- plan mode 里，hook 对文件编辑等非只读调用返回 `"allow"` 无效（`ExitPlanMode` 除外）。

### matcher 怎么写

| matcher 值 | 怎么解释 |
| :- | :- |
| `"*"`、`""` 或省略 | 全部匹配 |
| 只含字母、数字、`_`、`-`、空格、`,`、`\|` | 精确字符串或列表：`Edit\|Write`、`Edit, Write` |
| 含其他字符 | JavaScript 正则（不锚定）：`^Notebook`、`mcp__memory__.*`；`Edit.*` 会同时匹配 `NotebookEdit`，要整串匹配写 `^Edit$` |

不同事件匹配不同字段：工具类事件匹配工具名；`SessionStart` 匹配 `startup`/`resume`/`clear`/`compact`/`fork`；`PreCompact` 匹配 `manual`/`auto`；`InstructionsLoaded` 匹配 `session_start`/`nested_traversal`/`path_glob_match`/`include`/`compact`；`UserPromptSubmit`、`Stop`、`PostToolBatch` 等**不支持 matcher**。matcher 区分大小写，且匹配的是工具的**规范名**，不是界面显示的标签。

`if` 字段：一条权限规则语法（如 `"Bash(git *)"`、`"Edit(*.ts)"`），只有匹配时才启动进程；它是**尽力而为**的过滤，“use the permission system rather than a hook to enforce a hard allow or deny”。

### 输入：stdin 上的 JSON

公共字段：`session_id`、`prompt_id`、`transcript_path`、`cwd`、`permission_mode`（Manual 模式传 `"default"`）、`hook_event_name`，子代理中还有 `agent_id`/`agent_type`。工具事件另有 `tool_name`、`tool_input`、`tool_use_id`。`tool_input` 的字段按工具不同，例如：

| 工具 | 字段 |
| :- | :- |
| Bash | `command`、`description`、`timeout`、`run_in_background` |
| Write | `file_path`、`content` |
| Edit | `file_path`、`old_string`、`new_string`、`replace_all` |
| Read | `file_path`、`offset`、`limit` |

### 输出：退出码 + 可选 JSON

| 结果 | 含义 |
| :- | :- |
| **exit 0** | 成功；若 stdout 是一个合法 JSON 对象，其中字段生效。`UserPromptSubmit`、`SessionStart` 等事件的纯文本 stdout 会作为上下文加给 Claude |
| **exit 2** | 阻塞性错误：在能阻止的事件上停止动作，**stderr** 作为原因 |
| 其他退出码 | 非阻塞错误：动作继续，显示 `<hook name> hook error` |

> ⚠️ **exit 1 不会拦截**。“If your hook is meant to enforce a policy, use exit 2.”

`PreToolUse` 用 JSON 给出更细的决定：

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow | deny | ask | defer",
    "permissionDecisionReason": "原因",
    "updatedInput": { "...": "替换整个工具输入" },
    "additionalContext": "附加给 Claude 的上下文"
  }
}
```

多个 hook 同时返回时：**deny > defer > ask > allow**（最严格的生效）；所有匹配的 hook **并行**跑完再合并，一个 deny 不会阻止别的 hook 的副作用。

`Stop` 用 `{"decision": "block", "reason": "..."}` 或 exit 2 让 Claude 继续；输入里的 `stop_hook_active` 表示“已经是因为 Stop hook 在继续了”。**连续 8 次**被拽回（中间没有工具调用）后强制结束本轮，计数在 Claude 调用工具时重置；`CLAUDE_CODE_STOP_HOOK_BLOCK_CAP` 可调。

### 失败与超时（门禁最容易“漏”的地方）

- 默认超时：`command`/`http`/`mcp_tool` 600 秒（`UserPromptSubmit`、`PreModelSwitch`、`PostModelSwitch` 为 30 秒，`MessageDisplay` 10 秒）；`prompt` 30 秒；`agent` 60 秒；`SessionEnd` 全部共享 1.5 秒预算。
- **PreToolUse 超时或脚本启动失败默认不拦截**，调用继续走正常权限流程——“don't count on a stalled hook to act as a gate”。
- 解决：给策略 hook 加 `"onFailure": "block"`（需 v2.1.295+）。脚本不存在、退出码非 0/2、HTTP 非 2xx、超时都算失败。
- 用到 `${CLAUDE_PROJECT_DIR}` 等占位符时优先用 **exec 形式**（写 `args`，不经 shell，不用操心引号）；shell 形式则给占位符加双引号。

### 管理与排错工具

- `/hooks`：只读浏览所有已配置的 hooks 及来源。
- `"disableAllHooks": true`：临时全部关闭（不能关掉托管 hooks）。
- `Ctrl+O` 打开 transcript 看 hook 结果；`claude --debug-file /tmp/claude.log` 或会话中 `/debug` 看详细日志。
- 手动测试：`echo '{"tool_name":"Bash","tool_input":{"command":"ls"}}' | ./my-hook.sh; echo $?`

### 安全提示

hooks 以你的身份运行任意命令，**在沙箱之外**。仓库里提交的 hooks 会在别人机器上运行，所以 Claude Code 对“尚未信任的文件夹”里的 hooks 有专门处理（见 permissions 页 “What runs before you trust a folder”）。在陌生仓库跑 `claude -p` 前可以 `--settings '{"disableAllHooks": true}'`。

## 落地到自己的仓库：三道门

目录：

```text
.claude/
├── settings.json
└── hooks/
    ├── protect-files.mjs       # 编辑前：禁改受保护文件；样式改动强制问你
    ├── lint-edited.mjs         # 编辑后：eslint --fix
    └── verify-before-stop.mjs  # 结束前：lint + test 必须通过
```

用 Node 写脚本，Windows/macOS/Linux 都能跑，也不依赖 `jq`。这三个文件就在本站仓库的 `template/.claude/hooks/` 里，可直接复制。

### 门 1：编辑前（PreToolUse）

```js
#!/usr/bin/env node
// .claude/hooks/protect-files.mjs
import { readFileSync } from 'node:fs'
import { relative, sep } from 'node:path'

const input = JSON.parse(readFileSync(0, 'utf8'))
const ti = input.tool_input || {}
const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd()
const rel = relative(root, ti.file_path || '').split(sep).join('/')

const DENY = [
  /(^|\/)\.env(\..*)?$/,
  /(^|\/)package-lock\.json$/,
  /^\.github\/workflows\//,
  /^\.husky\//,
  /^\.claude\/settings\.json$/,
  /^\.claude\/hooks\//
]
for (const re of DENY) {
  if (re.test(rel)) {
    process.stderr.write(`Blocked: ${rel} 是受保护文件。如确需修改，请停下来让用户本人修改。\n`)
    process.exit(2)
  }
}

const text = [ti.old_string, ti.new_string, ti.content].filter(Boolean).join('\n')
const isStyleFile = /\.(css|scss|sass|less)$/.test(rel)
const touchesVueStyle = /\.vue$/.test(rel) && /<style|:style=|\bclass=/.test(text)
if (isStyleFile || touchesVueStyle) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'ask',
      permissionDecisionReason: `样式改动（${rel}）：需先有经你确认的 HTML 原型。已确认才批准。`
    }
  }))
}
process.exit(0)
```

- 第一段 exit 2：直接拦，原因交给 Claude，让它换做法或停下来问你。
- 第二段 `"ask"`：不拒绝，而是**强制弹窗**——在 auto 模式下也会把这次调用送到权限提示，而不是交给分类器决定。
- 注意它只管 Edit/Write 工具。Claude 仍可能用 shell 改文件，所以 `.env` 同时要有 `Read`/`Edit` deny 规则（[第 3 章](./03-settings-permissions-sandbox)），更强的限制靠沙箱。

### 门 2：编辑后（PostToolUse）

```js
#!/usr/bin/env node
// .claude/hooks/lint-edited.mjs
import { readFileSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const input = JSON.parse(readFileSync(0, 'utf8'))
const file = input.tool_input?.file_path
if (!file || !/\.(js|mjs|cjs|ts|tsx|vue)$/.test(file) || !existsSync(file)) process.exit(0)

const r = spawnSync('npx', ['--no-install', 'eslint', '--fix', file], { encoding: 'utf8' })
if (r.status !== 0) {
  process.stderr.write(`ESLint 仍报错（${file}）：\n${(r.stdout || '') + (r.stderr || '')}`.slice(0, 4000))
  process.exit(2) // PostToolUse 的 exit 2：把错误给 Claude 看，让它接着修
}
process.exit(0)
```

### 门 3：结束前（Stop）

```js
#!/usr/bin/env node
// .claude/hooks/verify-before-stop.mjs
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

JSON.parse(readFileSync(0, 'utf8') || '{}')
const sh = (cmd) => spawnSync(cmd, { shell: true, encoding: 'utf8' })

if (!sh('git status --porcelain').stdout.trim()) process.exit(0) // 没改文件就不检查

for (const cmd of ['npm run lint --silent', 'npm test --silent']) {
  const r = sh(cmd)
  if (r.status !== 0) {
    process.stderr.write(`“${cmd}” 未通过，修好再结束：\n${(r.stdout + r.stderr).slice(-4000)}`)
    process.exit(2)
  }
}
process.exit(0)
```

这里没有在 `stop_hook_active` 为真时提前放行：只要 Claude 还在调用工具修问题，就继续把关；如果它连续 8 次只想停而不做事，Claude Code 的上限会结束本轮，不会死循环。测试很慢的仓库，把 `npm test` 换成更快的检查（例如只跑 typecheck 或改动相关的测试）。

### 注册：`.claude/settings.json`

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "node",
            "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/protect-files.mjs"],
            "onFailure": "block",
            "timeout": 30
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "node",
            "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/lint-edited.mjs"],
            "timeout": 120
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node",
            "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/verify-before-stop.mjs"],
            "timeout": 600
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "matcher": "compact",
        "hooks": [
          { "type": "command", "command": "cat \"${CLAUDE_PROJECT_DIR}\"/.claude/compact-reminder.md" }
        ]
      }
    ]
  }
}
```

`onFailure: "block"` 只放在门 1：脚本坏了宁可拦住编辑也不放行；Claude Code 版本低于 v2.1.295 时该字段无效，请先 `claude update`。

### 验证这三道门

1. `/hooks`：确认三个事件下都有，来源是 project settings。
2. 让 Claude “在 .env 里加一行注释” → 应看到 `Blocked:` 并被拒绝。
3. 让 Claude “把按钮颜色改成红色” → 应弹出权限提示，原因写着需要原型。
4. 让 Claude 故意写一处 lint 错误 → 编辑后它收到 ESLint 输出并自行修复。
5. 让 Claude 改一处会让测试失败的代码并结束 → 它被拽回去修，直到测试通过。

## 常见坑与排错

- **hook 根本没触发** → `/hooks` 看是否出现在正确事件下；matcher 区分大小写；skill frontmatter 里的 hook 要等 skill 被调用后才出现。
- **`/hooks` 显示没配置** → JSON 不合法（尾逗号、注释）；文件位置不对；或组织设了 `allowManagedHooksOnly`。
- **`PreToolUse:Bash hook error: … Failed with non-blocking status code`** → 脚本没以 0/2 退出，或路径错误（`No such file or directory`），这时门禁**没起作用**。
- **JSON 输出没效果** → shell 配置文件（`.zshrc` 等）在 JSON 前打印了内容；或字段放错层级（`permissionDecision` 必须在 `hookSpecificOutput` 里）。
- **Stop hook 撞到上限** → 见 hooks-guide “Stop hook hits the block cap”。
- **macOS/Linux 上 `.sh` 不运行** → `chmod +x`；用 Node 脚本 + exec 形式可以回避。
- **多个 hook 都改写 `updatedInput`** → 不会合并、谁生效不确定，避免这样设计。

## 自测题

<Quiz :data="quiz" />

## 原文链接

- Hooks reference：<https://code.claude.com/docs/en/hooks>
- Automate actions with hooks（指南与示例）：<https://code.claude.com/docs/en/hooks-guide>
- Configure permissions（Extend permissions with hooks）：<https://code.claude.com/docs/en/permissions#extend-permissions-with-hooks>
- Best practices（Enforce steps with hooks / Stop hook）：<https://code.claude.com/docs/en/best-practices>
