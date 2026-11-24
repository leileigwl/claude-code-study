---
title: 4. Plan mode、会话、checkpoint、worktree
outline: [2, 3]
---

<script setup>
import quiz from '../../quizzes/04-plan-sessions-worktrees.json'
</script>

# 4. Plan mode、会话、checkpoint 与 worktree：先想清楚、能回退、互不打架

<div class="one-liner">

**一句话讲明白**：**plan mode** 让 Claude 先只读调研、写计划，你批准后才动手；**会话**可以命名、恢复、分叉；**checkpoint** 让你一键撤回 Claude 的文件编辑；**worktree** 让多个会话各改各的目录。四样合起来，是“范围可控 + 出错可退 + 并行不打架”。

</div>

## 为什么需要（对应哪种“乱跑”）

| 症状 | 对策 |
| :- | :- |
| 一句需求，它直接改了 20 个文件，方向还不对 | plan mode：先出计划、你审，批准后才允许编辑 |
| 改到一半发现走错路，想回到 10 分钟前 | `/rewind` 恢复代码和/或对话 |
| 想试另一种方案又怕丢掉现在的进度 | `/branch` 分叉会话 |
| 两个会话同时改同一个工作区，互相覆盖 | 每个会话一个 worktree |
| 昨天的会话找不到了 | 会话命名 + `claude --resume <名字>` |

## 详细原理

### Plan mode

> 原文：“Plan mode tells Claude to research and propose changes without making them. Claude reads files, runs shell commands to explore, and writes a plan, but does not edit your source.”

**进入**：`Shift+Tab` 循环到 plan；或在单条提示前加 `/plan`（如 `/plan fix the auth bug`）；或启动时 `claude --permission-mode plan`。
**离开**：没有批准提示时再按 `Shift+Tab`。**在批准提示上要先按 `Esc`**——在那里按 `Shift+Tab` 等于批准计划。

**计划期间 shell 命令怎么处理**（第一条适用的生效）：

1. 交互终端会话且 bypass permissions 可用：计划命令可不经分类器、不弹窗运行。
2. auto 模式可用且 `useAutoModeDuringPlan` 开启（默认开）：分类器审查除关键路径删除外的命令，批准的运行、拒绝的拦下。
3. auto 不可用或该设置关闭：内置只读命令之外的都要你批准（即使开了沙箱 auto-allow）。

**批准计划时的选项**：

| 选项 | 含义 |
| :- | :- |
| Yes, and use auto mode | 批准并进入 auto（auto 不可用时显示为 **Yes, auto-accept edits**） |
| Yes, manually approve edits | 批准，但每个编辑你逐一确认 |
| No, keep planning | 留在 plan，告诉 Claude 要改什么 |

- `Ctrl+G` 用默认编辑器**直接修改计划**再继续。
- 开启 `showClearContextOnPlanAccept` 后，会多一个“批准并清空规划上下文”的首选项。
- 批准后会话自动获得基于计划的标题（除非你已命名）。
- 计划文件在压缩后会从磁盘重新注入（[第 1 章](./01-agent-loop-context)）。
- 想让项目默认就是 plan：在 `.claude/settings.json` 设 `"permissions": { "defaultMode": "plan" }`（VS Code 扩展启动的对话不读项目设置里的起始模式）。
- 计划期间 Claude 会把调研交给内置 **Plan** 子代理，探索输出留在独立窗口。
- 模型别名 `opusplan`：plan mode 用 `opus`，执行时切到 `sonnet`。

> 最佳实践补充：需求还没想清楚时，先让 Claude **采访你**：“Interview me until you could write the spec, then write it to SPEC.md.” SPEC.md 写好后，**开一个新会话**照着它实现——干净的上下文加一份书面的完成标准。

### 会话（sessions）

| 命令 | 作用 |
| :- | :- |
| `claude --continue` | 打开当前目录最近的会话 |
| `claude --resume` | 打开会话选择器 |
| `claude --resume <name>` / `<session-id>` | 直接恢复指定会话 |
| `claude --from-pr <number>` | 选择器只显示与该 PR 关联的会话 |
| `/resume` | 在会话内切换到另一个会话 |
| `claude -n auth-refactor` / `/rename auth-refactor` | 启动时 / 会话中命名 |
| `/branch [name]` 或 `claude --continue --fork-session` | 复制当前对话到新会话 ID，原会话不变 |
| `/clear` | 开始空上下文的新对话（旧的仍可 `/resume`） |

**恢复时带回什么**：对话历史（压缩过的从 `Conversation compacted` 处继续）、模型、`--agent` 指定的代理、权限模式（从终端用 `--continue`/`--resume <id>`/`--resume <唯一名字>` 且不带 `-p` 时）、仍有效的 `/goal`、会话级定时任务（有例外）。**不重跑**被中断的工具调用；后台 Bash 与监控任务不恢复。

**选择器快捷键**：`Space` 预览、`Ctrl+R` 重命名、`Ctrl+A` 所有项目、`Ctrl+W` 所有 worktree、`Ctrl+B` 只看当前分支、粘贴 PR 链接找创建它的会话。

**两个终端同时恢复同一个会话**：都写同一个 transcript，之后恢复可能丢消息——各自加 `--fork-session`。

transcript 以 JSONL 明文存在 `~/.claude/projects/` 下，保留期由 `cleanupPeriodDays` 控制。

### Checkpoint 与 `/rewind`

> 原文：“Claude Code automatically tracks Claude's file edits as you work.” “Every prompt you send that starts a turn creates a new checkpoint.”

- 打开回退菜单：`/rewind`（别名 `/checkpoint`、`/undo`），或输入框为空时连按两次 `Esc`。
- 每个会话保留最近 **100 个**检查点的文件快照；随会话保存，resume 后仍可 rewind；默认约 30 天后随保留期清理。

| 菜单项 | 作用 |
| :- | :- |
| Restore code and conversation | 代码和对话都回到那一点 |
| Restore conversation | 对话回退，代码保留现状 |
| Restore code | 代码回退，对话保留 |
| Summarize from here | 从这里往后压缩成摘要（腾上下文） |
| Summarize up to here | 把这里之前的压缩成摘要，之后的保留 |
| Never mind | 什么都不做 |

**限制（一定要知道）**：

| 不会被 rewind 恢复的 | 怎么办 |
| :- | :- |
| 只被 Bash 命令改过的文件（如 `sed -i`、脚本生成） | 用 git。若文件先被编辑工具改过，之后的 Bash 改动可以被撤销 |
| 子代理的编辑（后台 fork 的 skill、后台 `/code-review --fix` 也算） | 用 git。只有前台的 `context: fork` skill 例外 |
| 你在 Claude Code 外的手动修改、其他并发会话的修改 | 用 git |
| 对话中途排队发送的消息（标为 No code restore） | 选开启这一轮的那条提示来恢复 |
| 符号链接、硬链接文件 | 跳过并提示 `Restored the code, but skipped N files` |
| 远程副作用（数据库、API、部署） | 不能 checkpoint，用权限模式和规则管 |

> 原文：“Checkpoints are designed for quick, session-level recovery. For permanent version history and collaboration, continue using version control.”

### Worktree：并行会话的文件隔离

> 原文：“Running each Claude Code session in its own worktree gives it a separate copy of the files to edit.”

```bash
claude --worktree feature-auth   # 或 -w；不给名字会自动生成
```

- 默认位置 `.claude/worktrees/<name>/`，新分支 `worktree-<name>`；**把 `.claude/worktrees/` 加进 .gitignore**。
- 默认从远端默认分支（通常 `main`）拉出（`worktree.baseRef: "fresh"`）；设 `"head"` 则从你当前的 `HEAD` 拉出，带上未推送的提交。不能设成分支名。
- `claude --worktree "#1234"` 或 PR/MR 链接：从该 PR 的 head 建 worktree。
- worktree 是全新 checkout：依赖要重新装；`.env` 这类 gitignored 文件用 **`.worktreeinclude`**（gitignore 语法）自动复制。
- 会话中也可以让 Claude “work in a worktree”，它用 `EnterWorktree` 工具创建/切换。
- **hooks 路径不跟随**：`${CLAUDE_PROJECT_DIR}` 仍指向启动时的项目根；hook 输入 JSON 里的 `cwd` 才是 worktree 路径。
- **隔离是强制的**：处于 worktree 隔离时，Claude Code 拦截目标在主 checkout 的 Edit/Write、工作目录在主 checkout 的命令、把 git 重定向到主 checkout（`git -C`、`--git-dir`、`GIT_DIR` 等）的命令；但不追踪 `cp`、重定向这种不跑 git 的写入。
- **退出清理**：干净的未命名会话自动删 worktree 和分支；有改动会问你保留还是删除；保留后用退出时打印的 `claude --worktree <name> --resume` 回来。`-p` 运行不清理。
- **子代理也能用 worktree**：frontmatter 写 `isolation: worktree`；无改动结束时自动删除，有改动的等周期清扫。

## 落地到自己的仓库

### 第 1 步：一个功能 = 规划会话 + 实现会话

```bash
claude -n quiz-streak-plan --permission-mode plan
```

```text
我想给刷题页加“连续打卡”功能，还没想清楚。先采访我，直到能写出规格，然后写到 docs/specs/streak.md。
不要改任何源码。
```

审完 `docs/specs/streak.md` 后，新开实现会话（干净的上下文）：

```bash
claude --worktree streak
```

```text
按 docs/specs/streak.md 实现。先给出计划等我确认。完成标准：npm run lint && npm run test 通过，并贴出命令输出。
```

### 第 2 步：仓库里放好 worktree 相关文件

`.gitignore`：

```text
.claude/worktrees/
```

`.worktreeinclude`（项目根，gitignore 语法；只会复制“既匹配又被 gitignore”的文件）：

```text
.env.local
server/.env
```

如果子代理需要基于你正在做的分支工作，在 `.claude/settings.json`：

```json
{ "worktree": { "baseRef": "head" } }
```

### 第 3 步：把 rewind 当“撤销”，把 git 当“存档”

- 小步：每完成一个可验证的步骤就让 Claude 提交一次（在分支上）。
- 走错了：先 `/rewind` → Restore code；如果中间有 Bash 生成的文件或子代理的改动，用 `git status` / `git restore` 收尾。
- 想试另一条路：`/branch try-other-approach`，不满意就 `/resume <原会话名>` 回去。

## 常见坑与排错

- **`Can only use --worktree in a git repository`** → 只在 git 仓库里可用；非 git VCS 要用 `WorktreeCreate`/`WorktreeRemove` hooks 替代。
- **交互运行 `--worktree` 报信任错误** → 先在该目录普通运行一次 `claude` 接受信任对话框。
- **新 worktree 里跑不起来** → 依赖没装、`.env` 没复制；补 `.worktreeinclude`、让 Claude 先装依赖。
- **Git LFS 文件在 worktree 里是指针文件** → worktrees 页 Troubleshooting 有专门条目。
- **Claude 没有 `EnterWorktree` 工具** → 检查是否开了 `permissions.blockWritesOutsideWorkingDirectories`，开启后两个 worktree 工具会被移除，改用 `claude --worktree` 启动。
- **rewind 后“回滚的消息又回来了”** → 退出前要先发一条新提示，rewind 后的对话才会被保存。
- **恢复会话时权限模式不对** → 见 sessions 页 “Permission mode on resume” 的例外情况。

## 自测题

<Quiz :data="quiz" />

## 原文链接

- Choose a permission mode（plan mode 一节）：<https://code.claude.com/docs/en/permission-modes#analyze-before-you-edit-with-plan-mode>
- Manage sessions：<https://code.claude.com/docs/en/sessions>
- Checkpointing：<https://code.claude.com/docs/en/checkpointing>
- Run parallel sessions with worktrees：<https://code.claude.com/docs/en/worktrees>
- Best practices（Brainstorm with Claude first）：<https://code.claude.com/docs/en/best-practices>
- How Claude Code works（Work with sessions）：<https://code.claude.com/docs/en/how-claude-code-works>
