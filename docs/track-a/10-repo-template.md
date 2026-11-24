---
title: 10. 防乱跑仓库模板 + 知行快刷完整实战
outline: [2, 3]
---

<script setup>
import quiz from '../../quizzes/10-repo-template.json'
</script>

# 10. 防乱跑仓库模板 + 知行快刷完整实战：把前 9 章装进一个真实仓库

<div class="one-liner">

**一句话讲明白**：防乱跑靠的是**分层**：CLAUDE.md 和 skills 负责“告诉它该怎么做”（会判断，可能漏），settings 权限规则和 hooks 负责“程序替你拦”，git hooks 给本地快反馈，**GitHub 上设为 required 的 CI 和你本人的合并**是最后一道门。本章把这些做成一套可复制的 `template/`，再一步步装进知行快刷。

</div>

## 为什么需要（对应哪种“乱跑”）

前 9 章每章解决一种“乱跑”。真正落地时，问题是**它们要一起工作**，而且每一层都有“漏”的地方，需要下一层兜底：

| “乱跑”的表现 | 第一层（引导） | 第二层（程序强制） | 兜底 | 章 |
| :- | :- | :- | :- | :- |
| 没经你确认就改了界面样式 | CLAUDE.md / AGENTS.md 规则 + `/ui-prototype` | PreToolUse hook 对样式改动返回 `"ask"` | PR 里没有已确认原型 → `/pr-ready`、审查标出来 | 2、5、6 |
| 读了或改了 `.env`、改了 lock 文件 / CI / git hooks | CLAUDE.md Gotchas | `Read`/`Edit` deny + PreToolUse exit 2 | pre-commit 拦 `.env`；CI | 3、5 |
| 说“完成了”其实测试没过 | “完成前贴证据” | Stop hook 跑相关检查，不过就拽回去 | pre-push；CI required check | 1、5 |
| 用 `--no-verify` 或改 `core.hooksPath` 绕过 git hooks | — | `Bash(git * --no-verify*)` 等 deny 规则 | CI required check | 3 |
| 压缩后忘了约定 | CLAUDE.md 的 Compact Instructions | SessionStart(compact) hook 重新注入 | — | 1、5 |
| 一个会话里塞太多事、并行任务互相覆盖 | “一个会话一件事” | `claude --worktree <名>` 文件隔离 | git 分支 | 1、4 |
| 审查是写代码的同一个“脑子”做的 | `reviewer` 子代理 / `/code-review` 新上下文 | 子代理 `tools` 只读 | 你在 GitHub 上看 diff | 7、9 |
| PR 期间自己合并了 | steward skill 写“合并由用户完成” | `/ship` watch 自主时禁止合并/批准/强推 | 分支保护 + 不开 auto-merge | 9 |

> 原文（permissions）：“Permission rules are enforced by Claude Code, not by the model. Instructions in your prompt or CLAUDE.md shape what Claude tries to do, but they don't change these rules.”
>
> 原文（memory）：“Settings rules are enforced by the client regardless of what Claude decides to do. CLAUDE.md instructions shape Claude's behavior but are not a hard enforcement layer.”

## 详细原理：五层防线

<RepoGatesAnim />

### 第 1 层：引导（模型读、模型判断）

| 文件 | 作用 | 何时加载 | 章 |
| :- | :- | :- | :- |
| `CLAUDE.md`（或 `@AGENTS.md`） | 命令、流程、仓库特有的坑、Compact Instructions | 每次会话开始，完整加载 | 2 |
| `.claude/rules/*.md`（带 `paths`） | 只对部分目录生效的规范 | Claude 读到匹配文件时 | 2 |
| `.claude/skills/*/SKILL.md` | 可复用流程：`/feature-spec`、`/ui-prototype`、`/pr-ready`、`steward` | 描述常驻上下文，正文在调用时加载 | 6 |
| `.claude/agents/*.md` | 子代理：`explorer`、`reviewer`、`test-runner` | 被派出时，带自己的上下文 | 7 |

这一层“写得越长越容易漏”。官方的判断标准：反复强调了还会被忽略的那一行，应该搬去 hook；反过来，只是偏好的东西不要写成 hook（第 5 章）。

### 第 2 层：程序强制（Claude Code 执行，模型绕不过）

| 机制 | 文件 | 拦什么 | 漏洞（为什么还要下一层） |
| :- | :- | :- | :- |
| 权限规则 deny / ask / allow | `.claude/settings.json` | 读 `.env`、强推、`--no-verify`、改 `.githooks/` | Bash 规则匹配命令文本，换个写法（`sh -c`、绝对路径）可能绕过；不是安全边界 |
| PreToolUse hook | `protect-files.mjs` | Edit/Write 受保护文件（exit 2）；规则文件与样式改动（`"ask"`） | 只看 Edit/Write 工具，shell 里 `sed -i` 改文件看不到 → 所以还有 deny 规则和沙箱 |
| PostToolUse hook | `lint-edited.mjs` | 刚改的文件 lint 不过 | 撤销不了已发生的编辑，只能让 Claude 接着修 |
| Stop hook | `verify-before-stop.mjs` + `checks.json` | “说完成但检查没过” | 连续 8 次只想停不做事时 Claude Code 强制结束本轮 |
| SessionStart(compact) hook | `compact-reminder.mjs` + `compact-reminder.md` | 压缩后忘约定 | 只是重新注入上下文，属于“提醒” |
| 受保护路径（内置） | — | 写 `.git`、`.husky`、`.claude`、`.mcp.json` 等在 default/acceptEdits 下必弹窗 | **`.githooks/` 不在内置列表里**，要自己保护 |
| 沙箱（可选） | `/sandbox` | shell 命令的文件与网络访问 | 原生 Windows 不支持；只管 shell 命令 |

### 第 3 层：本地 git hooks（快反馈）

知行快刷用 `git config core.hooksPath .githooks`：`pre-commit` 只查暂存文件（ESLint + tsc、ruff，拦 `.env` 与 `backend/data/`），`pre-push` 跑与 CI 相同的完整闸门。它们**拦得住你和 Claude 在终端里的普通 `git commit`/`git push`**，但拦不住两种情况：

1. 显式绕过：`git commit --no-verify`、`git push --no-verify`、改 `core.hooksPath`——模板用 deny 规则挡住 Claude 的常见写法；
2. **`/ship` 的 watch**：官方原文——“During a watch, when Claude acts without a message from you, it writes its git fetches, merges, commits, and pushes in the form `git -c core.hooksPath=/dev/null push`.” 表格里写明仓库 hooks 目录里的 git hooks “don't run for Claude's fetches, merges, commits, and pushes on those turns”。husky 和 `.githooks/` 一样被跳过。

### 第 4 层：CI 设为 required status check（最后的自动化门）

所以 **CI 必须在 GitHub 分支保护里设为 required check**。它不关心提交是谁、用什么方式推的。知行快刷的 CI（`.github/workflows/ci.yml`）有两个 job，名字就是 required check 的名字：

- `backend (ruff + pytest)`
- `frontend (lint + typecheck + test + build)`

### 第 5 层：你本人合并

- `/ship` watch 在 Claude 自主行动时被禁止合并、批准、开 auto-merge、强推；PR Steward 设计上不批准不合并。
- 但 watch 用**你的** `gh`/`git` 身份，官方提醒：分支规则允许你一个人合并、PR 开着 auto-merge、你在 Claude 空闲时发消息（限制暂时解除）时，都可能促成合并。**所以不开 auto-merge**。

### 个人仓库能用哪些（套餐）

| 功能 | 谁能用 | 对单人仓库 |
| :- | :- | :- |
| 第 1–3 章的 CLAUDE.md、settings、hooks、skills、子代理、MCP | 所有套餐 | ✅ 全部可用，本章的主体 |
| `/code-review`（本地审查） | 官方：“The command works on any plan.” | ✅ |
| `/ship`、`/steward` | 官方页面没有写套餐限制；在你的会话里运行、计入你的用量 | <span class="verify">待核实：Pro/Max 上是否出现在 `/` 菜单</span> |
| Code Review（托管）、PR Steward、Claude Approvals | **仅 Team / Enterprise**（feature-availability 表：Pro/Max/Ultra 为 ✗） | ❌ 现在用不了；模板里的 `REVIEW.md`、`approvals.yml` 是为以后准备的 |

### Claude Approvals 对单人仓库的硬限制

官方 Approvals setup 的前置条件原文：“**Two people with write access, before you enforce either policy on this page.** With only one, the check can't pass on a change under `.claude/`, or where Claude's review fails or gives no result. Under the policy that keeps two people on each change, it can't pass on any change.”

另外：作者可以占一个 seat（`seats: 1` 时作者自己就够）；GitHub 本身不允许作者批准自己的 PR；observe 模式也计费；私有仓库要求 required check 需要付费 GitHub 套餐。结论：

- **单人仓库不要 enforce Approvals**，也不需要它——你自己合并就是“人工批准”。
- 模板保留一份 `mode: observe` 的策略文件，等你有了 Team/Enterprise 组织和第二位协作者再用；observe 期间检查以 neutral 结束（GitHub 视为通过），不阻塞合并。

### 模板全貌

本站仓库的 [`template/`](https://github.com/leileigwl/claude-code-study/tree/main/template) 目录：

```text
template/
├── CLAUDE.md                       # 第 2 章骨架（已有 AGENTS.md 的仓库只写 @AGENTS.md）
├── REVIEW.md                       # 托管 Code Review 专用（Team/Enterprise）；本地 /code-review 不读
├── .mcp.json                       # 第 8 章：playwright（stdio）+ 官方文档 MCP（http）
├── .worktreeinclude                # 第 4 章：新 worktree 复制哪些被忽略的 .env
├── .gitignore                      # 追加：CLAUDE.local.md、settings.local.json、worktrees、.env*
├── .claude/
│   ├── settings.json               # 第 3、5、8 章合并：权限 + 4 个 hook
│   ├── compact-reminder.md         # 压缩后注入的提醒（SessionStart compact）
│   ├── approvals.yml               # Claude Approvals 入门策略，observe 模式（Team/Enterprise）
│   ├── hooks/
│   │   ├── protect-files.mjs       # PreToolUse：deny / ask / 样式改动先原型
│   │   ├── lint-edited.mjs         # PostToolUse：eslint --fix / ruff --fix（最近的包目录）
│   │   ├── verify-before-stop.mjs  # Stop：按改动路径跑 checks.json 里的检查
│   │   └── compact-reminder.mjs    # SessionStart：打印 compact-reminder.md（跨平台）
│   ├── skills/                     # feature-spec、ui-prototype、pr-ready、steward
│   └── agents/                     # explorer、reviewer、test-runner
└── examples/zhixing-quiz/          # 知行快刷专用的覆盖文件（下文逐个说明）
```

## 落地步骤：知行快刷（真实仓库）

### 先看清仓库现状（2026-11-24 从 GitHub 核对）

| 项 | 实际情况 | 对模板的影响 |
| :- | :- | :- |
| 可见性 | **公开**仓库（`leileigwl/zhixing-quiz`） | `/ship` 在公开仓库**不替你提交未提交的改动**；分支保护在 GitHub 免费套餐可用 |
| 前端 | `frontend/`：**Taro 4 + React 18**（不是 Vue），pnpm 10，Node 22；脚本 `lint`、`typecheck`、`test`（Vitest）、`test:coverage`、`check:all`、`build:h5`、`build:weapp` | 样式检测要看 `.scss` 和 `className=`/<code v-pre>style={{</code>；命令用 `pnpm --dir frontend …` |
| 后端 | `backend/`：Python 3.12 + **uv** + FastAPI；`ruff` + `pytest` | lint hook 走 `uv run ruff check --fix`；Stop 检查跑 pytest |
| 规则来源 | `AGENTS.md` 是**唯一事实来源**；`CLAUDE.md` 只有一行 `@AGENTS.md` | 不往 CLAUDE.md 加规则；压缩提醒放 `compact-reminder.md` |
| git hooks | `.githooks/pre-commit`、`.githooks/pre-push`，`bash scripts/setup-git-hooks.sh` 启用（不是 husky） | `.githooks/` 不在 Claude Code 内置受保护路径里 → 模板额外保护 |
| CI | `.github/workflows/ci.yml`：`pull_request` + push 到 `main` 触发；两个 job | 两个 job 名设为 required check |
| 原型 | `docs/02-design/prototypes/` + `README.md` 登记每个原型及“待确认/已确认” | `/ui-prototype` 要求同时登记 README |
| PR 模板 | `.github/pull_request_template.md` | `/ship` 不用仓库 PR 模板 → 先自己开 PR 再 `/ship` |
| 进行中 | PR #1（阶段 0：CI 与测试闸门）、PR #2（邮箱验证码登录，叠在 #1 上），都未合并 | CI 在 PR #1 里引入：**先合并 #1，required check 才选得到** |

### 第 0 步：前置

```bash
claude update            # /ship 需要 v2.1.330+；hook 的 onFailure 需要 v2.1.295+
claude --version
gh --version             # 2.63+，并 gh auth login
git --version            # 2.38+
node --version           # hooks 用 Node 写，仓库本来就要 Node 22
```

### 第 1 步：开一个只做“护栏”的分支

```bash
cd zhixing-quiz
git switch main && git pull
git switch -c chore/claude-code-guardrails

S=../claude-code-study/template          # 本站仓库的 template/ 路径
mkdir -p .claude
cp -r $S/.claude/hooks $S/.claude/skills $S/.claude/agents .claude/
cp $S/.mcp.json .
# 知行快刷专用覆盖：settings、Stop 检查、压缩提醒、三个改过命令的 skill、test-runner
cp -r $S/examples/zhixing-quiz/.claude/. .claude/
cp $S/examples/zhixing-quiz/.worktreeinclude .
rm .claude/approvals.yml                 # 现在不提交（见上文：单人 + 个人套餐）
cat $S/.gitignore                        # 对照追加到仓库 .gitignore（见第 6 步）
```

这一步**由你在终端里做**，不要让 Claude 做：`.claude/settings.json` 和 `.claude/hooks/` 正是 hook 之后不许它改的文件。

### 第 2 步：CLAUDE.md 保持一行，规则留在 AGENTS.md

知行快刷的规则是“CLAUDE.md 等各工具配置只做 `@AGENTS.md` 引用，不另写规则”，所以 `CLAUDE.md` **不改**。模板 `CLAUDE.md` 里有、而 AGENTS.md 已经覆盖的内容（命令、原型门控、质量闸门、何时停下来问）都不用搬。只有 Claude Code 特有的“压缩须知”走 hook：

`.claude/compact-reminder.md`（来自 `examples/zhixing-quiz/`）：

```markdown
【压缩后提醒，由 SessionStart(compact) hook 注入 · 知行快刷】
- 规则唯一来源是 AGENTS.md；若不确定当前阶段，先读 docs/session-handoff.md。
- 前端样式/界面改动：先在 docs/02-design/prototypes/ 新建或更新 HTML 原型（并登记到该目录 README.md），等用户明确回复“确认”后才改 frontend/；样式对照 docs/02-design/v2-ui-design-system.md。
- 结束前与改动相关的闸门必须通过（Stop hook 强制）：前端 pnpm --dir frontend check:all；后端 cd backend && uv run ruff check app tests && uv run pytest -q。贴出命令与输出。
- 不改：.env*、pnpm-lock.yaml / uv.lock（只能由包管理器生成）、.github/workflows/、.githooks/、scripts/setup-git-hooks.sh、.claude/settings.json、.claude/hooks/、backend/data/。
- 不要 --no-verify、不要改 core.hooksPath、不要 push --force。PR 由用户本人合并。
- 涉及鉴权范围、匿名调用收费接口、费用/额度阈值、数据库或部署变更：停下来问用户（AGENTS.md「何时必须停下来问用户」）。
```

用 `/context all` 确认 Memory files 里有 `CLAUDE.md` 和被导入的 `AGENTS.md`（第 2 章）。

### 第 3 步：`.claude/settings.json`（权限 + hooks）

`examples/zhixing-quiz/.claude/settings.json` 全文：

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(pnpm lint *)",
      "Bash(pnpm typecheck *)",
      "Bash(pnpm test *)",
      "Bash(pnpm test:coverage *)",
      "Bash(pnpm check:all *)",
      "Bash(pnpm exec vitest run *)",
      "Bash(pnpm exec eslint *)",
      "Bash(pnpm --dir frontend lint *)",
      "Bash(pnpm --dir frontend typecheck *)",
      "Bash(pnpm --dir frontend test *)",
      "Bash(pnpm --dir frontend check:all *)",
      "Bash(uv run ruff check *)",
      "Bash(uv run pytest *)",
      "Bash(git status *)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "mcp__claude-code-docs__*"
    ],
    "ask": [
      "Bash(git push *)",
      "Bash(pnpm install *)",
      "Bash(pnpm add *)",
      "Bash(pnpm remove *)",
      "Bash(uv add *)",
      "Bash(uv remove *)",
      "Bash(uv sync *)",
      "Bash(docker *)",
      "Bash(docker-compose *)",
      "mcp__playwright__*"
    ],
    "deny": [
      "Read(.env)",
      "Read(.env.*)",
      "Read(!.env.example)",
      "Read(./secrets/**)",
      "Edit(./.githooks/**)",
      "Bash(git push --force *)",
      "Bash(git push -f *)",
      "Bash(git reset --hard *)",
      "Bash(git * --no-verify*)",
      "Bash(git config core.hooksPath *)",
      "Read(./backend/data/**)",
      "Edit(./backend/data/**)"
    ]
  },
  "hooks": {
    "PreToolUse": [
      { "matcher": "Edit|Write", "hooks": [
        { "type": "command", "command": "node",
          "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/protect-files.mjs"],
          "onFailure": "block", "timeout": 30 } ] }
    ],
    "PostToolUse": [
      { "matcher": "Edit|Write", "hooks": [
        { "type": "command", "command": "node",
          "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/lint-edited.mjs"],
          "timeout": 120 } ] }
    ],
    "Stop": [
      { "hooks": [
        { "type": "command", "command": "node",
          "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/verify-before-stop.mjs"],
          "timeout": 600 } ] }
    ],
    "SessionStart": [
      { "matcher": "compact", "hooks": [
        { "type": "command", "command": "node",
          "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/compact-reminder.mjs",
                   "${CLAUDE_PROJECT_DIR}/.claude/compact-reminder.md"],
          "timeout": 10 } ] }
    ]
  }
}
```

逐条说明（为什么这样写）：

- **allow 只放可重复执行的检查**。`*` 前有空格时也匹配不带参数的命令（`Bash(pnpm lint *)` 匹配 `pnpm lint`）。`cd backend && uv run pytest -q` 能直接跑：`cd` 到工作目录内是内置只读命令，复合命令要求每段都被允许。
- **ask：会改变外部状态或依赖的**。改依赖会改 lock 文件，要你知情。`Bash(git push *)` 在 ask 里：你自己的会话里 push 前会问；而 `/ship` 自己的提交推送“Claude Code doesn't consult it”，watch 的 `git -c core.hooksPath=/dev/null push` 形式也不匹配它，所以**不妨碍 `/ship`**。
- **deny 不写 `Bash(git push *)`**：官方表格写明 deny `Bash(git push *)` 时“No watch starts”，`/ship` 也把提交推送留给你。想完全禁止 AI 推送就把它加进 deny，代价是没有 watch。
- `Read(.env)`、`Read(.env.*)` 这种**不带路径的文件名**按 gitignore 语义匹配任意深度（`backend/.env` 也算）；紧跟的 `Read(!.env.example)` 把示例文件挖出来（`!` 只对同一文件里**前面**的规则生效）。`Read` deny 同时阻止 Edit/Write 同一路径，也覆盖 `cat` 等可识别命令，但**不覆盖自己打开文件的 Python/Node 脚本**。
- `Bash(git * --no-verify*)`：`*` 匹配任意文本，可以出现在中间；deny 规则里这样写没问题（官方只对 **allow** 规则里“`*` 在子命令前”发启动警告）。拦不住 `git commit -n` 这种短写法，也拦不住 `sh -c '…'`——Bash 规则“不是安全边界”，所以还要第 4 层 CI。
- `Edit(./.githooks/**)`：`.githooks/` 不在内置受保护路径里，acceptEdits 下 Claude 可以直接改它；这条和 hook 里的 DENY 双保险。shell 里 `sed -i` 改它时，`Edit` deny 对可识别的命令也生效（第 3 章）。
- **不写 `defaultMode`**：每个人在 `~/.claude/settings.json` 或启动参数里自己选。你自己合并 PR、愿意看 diff → `acceptEdits` 合适；想无人值守跑 `/ship` watch → auto（只能放用户设置或 `--permission-mode auto`，写在项目 settings 里不生效）。
- **信任对话框**：这份文件提交后，deny 立即对所有人生效；allow 要等每个人在该文件夹接受信任对话框。

### 第 4 步：hooks 与 `checks.json`

四个脚本直接用 `template/.claude/hooks/` 的，**不需要为知行快刷改代码**——它们已经处理了这个仓库的三个特点：

1. **前后端分目录**：`lint-edited.mjs` 从被改文件往上找最近的 `package.json`（前端，跑 `npx --no-install eslint --fix`）或 `pyproject.toml`（后端，跑 `uv run --frozen ruff check --fix`）；没装依赖时静默跳过，不阻塞。
2. **Taro/React 的样式写法**：`protect-files.mjs` 把 `.scss` 文件、`.tsx` 里出现 `className=`/<code v-pre>style={{</code> 的改动都当作样式改动，返回 `"ask"`；`docs/02-design/prototypes/` 下的原型文件不受限。
3. **worktree**：官方说明 `${CLAUDE_PROJECT_DIR}` 不跟随 worktree，hook 输入 JSON 的 `cwd` 才跟随。脚本按“被改文件所在的仓库根”算相对路径，`claude --worktree` 里同样拦得住。

仓库特有的只有 Stop 检查，写在 `.claude/hooks/checks.json`：

```json
[
  { "when": "^frontend/", "cmd": "pnpm --dir frontend check:all" },
  { "when": "^backend/", "cmd": "cd backend && uv run ruff check app tests && uv run pytest -q" }
]
```

- 只改了文档 → 两条都不跑；只改了前端 → 只跑前端闸门。和 CI、`pre-push` 是同一套命令。
- `checks.json` 在 `.claude/hooks/` 下，`protect-files.mjs` 不让 AI 改它：**AI 不能自己放松门禁**。
- 后端 `pytest -q` 如果在你机器上太慢（需要 MySQL/Redis 的集成测试），把后端那条换成 `cd backend && uv run ruff check app tests`，pytest 交给 `pre-push` 和 CI。

装好后先手动测一遍（不用开 Claude）：

```bash
echo '{"cwd":"'$PWD'","tool_name":"Edit","tool_input":{"file_path":"'$PWD'/.githooks/pre-push","old_string":"a","new_string":"b"}}' \
  | node .claude/hooks/protect-files.mjs; echo "exit=$?"     # 期望 Blocked + exit=2
echo '{"cwd":"'$PWD'","tool_name":"Edit","tool_input":{"file_path":"'$PWD'/frontend/src/app.scss","old_string":"a","new_string":"b"}}' \
  | node .claude/hooks/protect-files.mjs; echo "exit=$?"     # 期望 "permissionDecision":"ask" + exit=0
echo '{"cwd":"'$PWD'"}' | node .claude/hooks/verify-before-stop.mjs; echo "exit=$?"  # 工作区干净时 exit=0
```

### 第 5 步：skills 与子代理

| 文件 | 用模板的 | 知行快刷版改了什么 |
| :- | :- | :- |
| `skills/feature-spec/SKILL.md` | ✅ 原样 | — |
| `skills/ui-prototype/SKILL.md` | — | 用 `examples/` 版：门控对象是 `frontend/`；先读 AGENTS.md 门控与 `v2-ui-design-system.md`；**登记到 prototypes/README.md 并标“待用户确认”**；44px 热区与 V2.7 手感 |
| `skills/pr-ready/SKILL.md` | — | 用 `examples/` 版：闸门命令与 CI 一致；检测 `className`/<code v-pre>style={{</code>；更新 `docs/session-handoff.md`；按 `.github/pull_request_template.md` 写描述 |
| `skills/steward/SKILL.md` | — | 用 `examples/` 版：必须通过的就是 CI 两个 job；提醒 watch 不跑 `.githooks`；鉴权/费用类意见只回复不推代码 |
| `agents/explorer.md`、`agents/reviewer.md` | ✅ 原样 | — |
| `agents/test-runner.md` | — | 用 `examples/` 版：pnpm / uv 命令 |

`steward` 这个文件夹名是 `/steward`、`/ship` watch 和 PR Steward 约定读取的位置（`.claude/skills/steward/SKILL.md`），不要改名。

### 第 6 步：`.mcp.json`、`.worktreeinclude`、`.gitignore`

`.mcp.json`（团队共享，不含任何 token）：

```json
{
  "mcpServers": {
    "playwright": { "type": "stdio", "command": "npx", "args": ["-y", "@playwright/mcp@latest"] },
    "claude-code-docs": { "type": "http", "url": "https://code.claude.com/docs/mcp" }
  }
}
```

第一次在该文件夹启动时会问你是否批准这两个服务器（项目范围的 MCP 需要批准）。settings 里已经把文档 MCP 放进 allow、playwright 放进 ask。用 playwright 对比原型：先 `pnpm --dir frontend dev:h5` 起本地页面，再让 Claude 在 375px 宽度截图与原型 HTML 对比。

`.worktreeinclude`（只有“既匹配又被 gitignore”的文件才会复制；文件不存在就跳过）：

```text
backend/.env
frontend/.env.development
frontend/.env.local
```

`.gitignore` 追加（仓库已有 `.env`、`.env.*`、`!.env.example`，只缺这三行）：

```text
CLAUDE.local.md
.claude/settings.local.json
.claude/worktrees/
```

### 第 7 步：提交护栏，并在 GitHub 上把 CI 设为 required

```bash
git add .claude .mcp.json .worktreeinclude .gitignore
git status            # 确认没有 .env、没有 settings.local.json
git commit -m "chore: Claude Code 护栏（权限、hooks、skills、子代理、MCP）"
git push -u origin chore/claude-code-guardrails
gh pr create --fill   # 或交互式 gh pr create，使用仓库 PR 模板
```

然后按这个顺序做（**先合并 PR #1**，因为 CI 在它里面；在 GitHub 网页上选 required check 时，只能搜到最近在仓库里跑过的检查）：

1. 合并 PR #1（阶段 0：CI 与测试闸门），再合并护栏 PR。
2. 给 `main` 开分支保护。公开仓库在 GitHub 免费套餐即可。命令行（GitHub REST API，用你的 `gh` 登录）：

```bash
gh api -X PUT repos/leileigwl/zhixing-quiz/branches/main/protection --input - <<'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["backend (ruff + pytest)", "frontend (lint + typecheck + test + build)"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": { "required_approving_review_count": 0 },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF
gh api -X PATCH repos/leileigwl/zhixing-quiz -F allow_auto_merge=false
```

- `required_approving_review_count: 0`：**要求走 PR，但不要求批准**。单人仓库里不能设成 1——GitHub 不允许作者批准自己的 PR，你会把自己锁在外面。
- `enforce_admins: true`：你作为管理员也必须等 CI 变绿，不能直接推 `main`。
- `strict: true`：分支必须基于最新的 `main`（`/ship` watch 会替你把 base 合并进来）。
- 也可以在网页 **Settings → Branches / Rules** 里设置同样的规则；以 [GitHub 文档](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches) 为准。

### 第 8 步：日常节奏（一个功能从想法到合并）

```bash
# ① 规划会话：只写规格，不改代码
claude -n streak-plan --permission-mode plan
> /feature-spec streak
```

```bash
# ② 实现会话：干净上下文 + 独立 worktree
claude --worktree streak
> 按 docs/specs/streak.md 实现。先给计划等我确认。
```

- 需求涉及界面 → Claude 先走 `/ui-prototype v29-streak-card`，停下等你；你在浏览器打开原型，回复“确认”后它才改 `frontend/`（hook 还会对每次样式编辑弹窗，你可以对照原型批准）。
- 每次编辑后 lint 自动修；想结束时 Stop hook 跑相关闸门。
- 读大量测试输出 → 让 `test-runner` 子代理跑，只回失败项。

```bash
# ③ 收尾
> /pr-ready
> 用 reviewer 子代理对照 docs/specs/streak.md 审查改动
```

```bash
# ④ 提交 + PR（公开仓库：/ship 不会替你提交未提交的改动，所以先自己提交）
git add -A && git status && git commit -m "feat: 连续打卡"
git push -u origin worktree-streak && gh pr create   # 用仓库 PR 模板
> /ship                  # PR 已存在：审查 + watch（处理失败检查、冲突、评论）
```

- 想先看审查发现再让它动手：在审查进行中发 “From now on, don't push code changes or reply to reviewers without asking me first. Show me the review findings and wait.”（这只是请求，不是强制）。
- watch 的提交**不经过 `.githooks`**，所以 CI required check 是它真正要过的门；steward skill 也要求它推送前先在本地跑闸门。
- ⑤ CI 全绿、原型已确认 → **你在 GitHub 上点合并**。之后 `/ship stop` 或等 watch 因 PR 合并而结束。

（`git push -u` 会改 git 设置，在 watch 运行中这样做会结束 watch，所以放在 `/ship` 之前。）

### 第 9 步：验证清单

在知行快刷里启动 `claude`，逐条确认：

| 检查 | 命令 / 做法 | 期望 |
| :- | :- | :- |
| settings 被加载 | `/status` → Setting sources | 有 project settings |
| 规则来源 | `/permissions` | 每条规则显示来自 `.claude/settings.json` |
| hooks 注册 | `/hooks` | PreToolUse、PostToolUse、Stop、SessionStart 下各有一个，来源 project |
| 记忆加载 | `/context all` | Memory files 有 CLAUDE.md、AGENTS.md |
| MCP | `/mcp` | playwright、claude-code-docs 已连接（批准后） |
| deny 生效 | “读一下 backend/.env” | Read 和 `cat` 都被拒绝 |
| 受保护文件 | “在 .githooks/pre-push 末尾加一行注释” | `Blocked:`，被拒绝 |
| 样式门控 | “把首页按钮改成圆角” | 先走 `/ui-prototype`；若直接改 `.scss`/`className` → 弹窗写着需要原型 |
| Stop 门 | 让它故意写一个失败的 Vitest 用例然后结束 | 被拽回去修，直到 `check:all` 通过 |
| 压缩提醒 | `/compact` 后问“我们的样式规则是什么” | 回答里有 compact-reminder 的内容 |
| CI 兜底 | 在测试分支推一个 lint 错误（`git push --no-verify`，**你自己**在终端里） | PR 上 CI 变红、合并按钮不可用 |

### 第 10 步（以后）：升级到团队时

当组织是 Team/Enterprise、并且有第二位有写权限的协作者时，再按第 9 章的顺序：开 Code Review → 提交 `REVIEW.md`（模板里已写好知行快刷的 Important 定义、跳过原型和 lock 文件、必查项）→ PR Steward（Manual、设花费上限）→ 单独一个 PR 提交 `examples/zhixing-quiz/.claude/approvals.yml`（`mode: observe`，保留 `advisory: [claude/code_review]`，对 CI/git hooks/AGENTS.md/鉴权代码要求两人）。observe 一段时间、判定与人一致后再删掉 `mode: observe` 并在 GitHub 设为 required check（来源选 Claude app，ID `1236702`）。

## 常见坑与排错

- **Claude 说改不了 `.claude/settings.json`** → 设计如此（hook DENY + 内置受保护路径）。门禁文件由你在编辑器里改。
- **hooks 在 Windows 上不跑** → exec 形式（写了 `args`）要求 `command` 是真正的可执行文件；`node` 可以，`npx`/`eslint` 的 `.cmd` 垫片不行。模板只用 `node` 启动脚本；脚本内部调用 `npx`/`uv` 时在 Windows 上用 shell。
- **`PreToolUse:Edit hook error … non-blocking status code`** → 脚本路径错或 Node 未安装。因为设了 `onFailure: "block"`（v2.1.295+），这时编辑会被拦而不是放行；先 `claude update` 再检查路径。
- **Stop hook 每次都跑很久** → `checks.json` 的后端命令换成只跑 ruff；或者只在 `^backend/app/` 改动时跑 pytest。
- **`/ship` 推了什么都没提交** → 公开仓库不替你提交未提交的改动；先自己在功能分支上提交。
- **`/ship` 没用仓库的 PR 模板** → 官方：要 PR 模板、草稿或别的 base 分支，先自己开 PR 再运行 `/ship`。
- **watch 推上去的提交没跑 pre-commit** → 预期行为（`core.hooksPath=/dev/null`）；靠 CI required check。
- **在 `.claude/settings.json` 写了 `"defaultMode": "auto"` 没效果** → 项目 settings 里的 auto 和 bypassPermissions 都不生效；放用户设置或用 `--permission-mode auto`。
- **加了 `approvals.yml` 后自动 Code Review 停了** → 规则里没有 `claude/code_review`；模板已写在 `advisory`。
- **队友 allow 规则不生效** → 他们还没接受信任对话框；deny 不受影响。
- **把 `Bash(git push *)` 放进 deny 后 `/ship` 不 watch 了** → 官方行为：deny push 时不启动 watch。保留 ask 即可。

## 自测题

<Quiz :data="quiz" />

## 原文链接

- Best practices（Enforce the rules that can't have exceptions）：<https://code.claude.com/docs/en/best-practices>
- Configure permissions（Bash rule limits、Read and Edit、protected paths）：<https://code.claude.com/docs/en/permissions>
- Settings / All settings：<https://code.claude.com/docs/en/settings>、<https://code.claude.com/docs/en/settings-reference>
- Hooks reference / guide：<https://code.claude.com/docs/en/hooks>、<https://code.claude.com/docs/en/hooks-guide>
- Memory（CLAUDE.md、AGENTS.md、HTML 注释会被去掉）：<https://code.claude.com/docs/en/memory>
- Skills：<https://code.claude.com/docs/en/skills>；Subagents：<https://code.claude.com/docs/en/sub-agents>
- MCP：<https://code.claude.com/docs/en/mcp>
- Worktrees（.worktreeinclude、Hook paths don't follow the worktree）：<https://code.claude.com/docs/en/worktrees>
- /ship 与 /steward（Permission rules and hooks that apply、What /ship commits and pushes）：<https://code.claude.com/docs/en/ship-command>、<https://code.claude.com/docs/en/ship-command-troubleshooting>
- 本地审查：<https://code.claude.com/docs/en/code-review-local>；Customize Code Review（REVIEW.md）：<https://code.claude.com/docs/en/code-review-customize>
- Claude Approvals / Setup（Prerequisites）/ Policy：<https://code.claude.com/docs/en/approvals>、<https://code.claude.com/docs/en/approvals-setup>、<https://code.claude.com/docs/en/approvals-policy>
- Feature availability：<https://code.claude.com/docs/en/feature-availability>
- GitHub 分支保护（非 Anthropic 文档）：<https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches>
