---
title: 3. settings、权限模式与沙箱
outline: [2, 3]
---

<script setup>
import quiz from '../../quizzes/03-settings-permissions-sandbox.json'
</script>

# 3. settings、权限模式与沙箱：给 AI 划“能做什么”的硬边界

<div class="one-liner">

**一句话讲明白**：`settings.json` 是 Claude Code **程序**强制执行的配置（不是给模型读的建议）。里面的权限规则按 **deny → ask → allow** 判定，没命中的交给**权限模式**；沙箱再在操作系统层面限制 shell 命令能碰的文件和网络。

</div>

## 为什么需要（对应哪种“乱跑”）

| 症状 | 原因 | 本章对策 |
| :- | :- | :- |
| 它读了 `.env`，把密钥写进了日志/提交 | 没有 deny 规则，读文件不需要批准 | `Read(./.env)` deny |
| 它自己 `git push` 了 | 推送不在 ask/deny 里，模式又放行了 | ask 或 deny `Bash(git push *)` |
| 一天点了一百次“允许”，最后看都不看就点 | Manual 模式下每个命令都问 | allow 常用安全命令；或 auto 模式 + 沙箱 |
| 规则写了但对队友不生效 / 对自己不生效 | 文件放错层；项目 allow 需信任对话框 | 弄清五层优先级 |
| 以为 deny 了 `curl` 就不能联网 | Bash 规则匹配命令文本，换个写法就绕过 | 沙箱的网络隔离 |

> 原文：“Permission rules are enforced by Claude Code, not by the model. Instructions in your prompt or CLAUDE.md shape what Claude tries to do, but they don't change these rules.”

## 详细原理

### settings 文件：四个文件 + 托管设置

| 范围 | 文件 | 影响谁 | 用来放 |
| :- | :- | :- | :- |
| User 用户 | `~/.claude/settings.json` | 你，本机所有项目 | 个人偏好、默认模型、你自己的权限规则 |
| Shared project 共享项目 | `.claude/settings.json` | 在这个文件夹工作的所有人（提交到 git 后） | 团队权限、hooks、插件、项目需要的环境变量 |
| Project local 项目本地 | `.claude/settings.local.json` | 只有你、只这个项目 | 个人覆盖、分享前的试验 |
| Managed 托管 | `managed-settings.json` / MDM / 服务器下发 | 组织下发到的所有人 | 安全策略与合规 |

- 安装 Claude Code **不会**自动创建任何 settings 文件。
- settings 是**严格 JSON**：`//` 注释或尾逗号都会报 Settings Error。
- 加一行 `"$schema": "https://json.schemastore.org/claude-code-settings.json"` 可获得编辑器补全。
- 大多数修改（包括 `permissions`、`hooks`）**保存即对运行中的会话生效**；`model`、`effortLevel` 等少数键只在启动时读。
- `/status` 的 `Setting sources` 一行显示实际加载了哪些文件；`claude doctor` 列出被拒绝的条目。
- “Yes, and don't ask again” 保存的规则写进**仓库根**的 `.claude/settings.local.json`（worktree 里会解析到主 checkout）。

### 优先级（高 → 低）

1. **托管设置**：你的任何文件和 `--settings` 都覆盖不了（少数安全相关键例外：更严格的低层值会被采用）。
2. **命令行**：`--settings <file-or-json>`，只对本次会话。
3. **项目本地** `.claude/settings.local.json`
4. **共享项目** `.claude/settings.json`
5. **用户** `~/.claude/settings.json`

两条关键补充：

- **列表合并，不覆盖**：同一个列表键（如 `permissions.allow`）在多个文件里会被合并。
- **deny 跨层通吃**：“If a tool is denied at any level, no other level can allow it.” 用户级 deny 也能挡住项目级 allow，反之亦然。
- 环境变量不是这个栈里的一层，每个“变量—设置键”对各有规则（例如 shell 里导出的 `ANTHROPIC_MODEL` 优先于任何文件的 `model`）。

### 权限规则：语法

格式：`Tool` 或 `Tool(specifier)`。

| 规则 | 效果 |
| :- | :- |
| `Bash` / `Bash(*)` | 匹配所有 Bash 命令；作为 deny 会把工具从 Claude 的上下文里整个移除 |
| `Bash(npm run build)` | 只匹配这条完全相同的命令 |
| `Bash(npm run *)` | `npm run build`、`npm run test --watch`、`npm run`；不匹配 `npm install` |
| `Bash(git log * main)` | `git log --oneline main` 等 |
| `Bash(ls *)` vs `Bash(ls*)` | 前者不匹配 `lsof`（`*` 前的空格是规则的一部分），后者匹配 |
| `Read(./.env)` | 读当前目录的 `.env` |
| `Edit(/src/**/*.ts)` | 相对**设置来源**的路径（项目设置里 = 主工作目录） |
| `Read(//Users/alice/secrets/**)` | `//` 开头才是文件系统绝对路径 |
| `Read(~/Documents/*.pdf)` | `~/` 开头是 home 目录 |
| `WebFetch(domain:example.com)` | 抓取该域名 |
| `mcp__github__*` | `github` MCP 服务器的所有工具 |
| `Agent(Explore)` | 名为 Explore 的子代理 |
| `Agent(isolation:worktree)` | （deny/ask 专用）按工具输入参数匹配 |

**Bash 匹配的细节**（决定规则会不会被绕过）：

- **复合命令会拆开**：`&&`、`||`、`;`、`|`、`|&`、`&`、换行都是分隔符。allow 要求**每个子命令**都被允许；deny/ask 只要**任一子命令**命中就生效（包括子 shell、`$()`、`for` 循环体内）。
- **会剥掉的包装**：`timeout`、`time`、`nice`、`nohup`、`stdbuf`、`command`、`builtin`、zsh 的 `noglob`，以及无参数的 `xargs`；`npx`、`docker exec`、`devbox run` 等**不在**列表里。
- **前置变量赋值**：allow 只越过“已知安全”的变量；deny/ask 越过任何赋值（`FOO=bar rm -rf tmp/` 仍被 `Bash(rm *)` 拦下）。
- **拦不住的写法**（官方表）：

| 规则 | 能拦 | 拦不住 |
| :- | :- | :- |
| `Bash(curl *)` | `curl https://example.com` | `/usr/bin/curl …`、`sh -c 'curl …'` |
| `Bash(rm *)` | `rm -rf build/` | `/bin/rm -rf build/`、`bash -c 'rm -rf build/'` |
| `Bash(git push *)` | `git push origin main` | `git -C . push origin main`、`git -c push.default=current push origin main` |

所以 Bash 规则是“拦住 Claude 平常的写法”，**不是安全边界**；要真正的边界，用沙箱或 PreToolUse hook 自己检查命令文本。

**Read / Edit 规则的覆盖面**：

- `Edit` 规则覆盖所有内置编辑工具；`Read` 的 deny 尽力覆盖 Grep、Glob、`@文件` 引用；`Read` deny 还会阻止 Edit/Write 写同一路径。
- 对 `cat`、`head`、`tail`、`sed`、`tee` 等可识别的命令和重定向目标也生效；**对自己打开文件的 Python/Node 脚本无效**。
- `Write(path)`、`Glob(path)`、`Grep(path)` 带路径的规则**不会被匹配**——要用 `Edit(...)` / `Read(...)`。

### 判定流程

<PermissionFlowAnim />

- **deny → ask → allow，第一个命中的说了算**，规则写得多具体都不改变顺序。“An allow rule can't carve an exception out of a deny rule.”
- **ask 一定会问**，即使有更具体的 allow，也即使在 auto 或 bypassPermissions 模式。
- **三类都没命中**，交给权限模式。
- 与 hooks 的关系：PreToolUse hook 在权限提示之前运行；hook 的 `exit 2` 在评估规则之前就挡下调用；但 hook 返回 `"allow"` **绕不过** deny 和 ask 规则（[第 5 章](./05-hooks-gates)）。

### 默认不问的东西

| 工具类型 | 例子 | Manual 下要批准吗 | “不再询问”的范围 |
| :- | :- | :- | :- |
| 只读 | 读文件、Grep | 否（工作目录和附加目录内） | — |
| Bash | shell 执行 | 是，内置只读命令除外 | 按仓库 + 命令永久 |
| 文件修改 | 编辑/写文件 | 是（Claude 自己的计划文件、auto memory 等除外） | 到会话结束 |
| Web fetch | WebFetch | 是，预批准的文档域名除外 | 按仓库 + 域名永久 |
| Web search | WebSearch | 是 | 按仓库永久 |

### 六种权限模式

| 模式（配置值） | 不问就能做的 | 适合 |
| :- | :- | :- |
| `default`（界面叫 **Manual**，也接受 `manual`） | 工作目录内读文件、无需批准的动作（如启动子代理） | 敏感工作、陌生代码 |
| `acceptEdits` | 读、改文件，以及 `mkdir` `touch` `rm` `rmdir` `mv` `cp` `sed`（限工作目录/附加目录） | 你事后用 git diff 审查 |
| `plan` | 读，以及（auto 可用时）分类器批准的命令；**不改源码** | 先探索再动手 |
| `auto` | 全部，后台分类器检查 | 长任务、减少打扰 |
| `dontAsk` | 工作目录内读与预批准工具；**其余一律拒绝** | 锁死的 CI 与脚本 |
| `bypassPermissions` | 全部 | **只用于隔离的容器/虚拟机** |

**哪种模式启动**（按顺序取第一个适用的）：`--permission-mode`/`--dangerously-skip-permissions` → settings 的 `permissions.defaultMode` → 内置默认。内置默认：`claude -p` 和 Agent SDK 是 `default`；终端与 VS Code 在 v2.1.283+ 是 `auto`（更早版本仅 Pro/Max/Ultra/Team 套餐为 auto）；任一 settings 把 `disableAutoMode` 设为 `"disable"` 时是 `default`。

**一个容易踩的坑**：在 `.claude/settings.json` 或 `.claude/settings.local.json` 里写 `"defaultMode": "auto"` **不生效**；写 `"bypassPermissions"` 也不生效，会以 Manual 启动。其他值（如 `plan`）可以写在项目里。

**切换**：CLI 里 `Shift+Tab` 循环；从 auto 按一次先到 `default`，之后 `default → acceptEdits → plan`；`dontAsk` 不在循环里，只能用 `--permission-mode dontAsk`。

**auto 模式的分类器默认会拦**（best practices 列举）：`curl | bash`、生产部署与迁移、强推覆盖别人的工作、敏感数据发往外部、看起来是被读到的内容“带着走”的动作。连续 3 次（或总计 20 次）被拦后会退回询问。官方警告：“Auto mode is a classifier model judging each action rather than a hard rule… your "never" rules belong in deny rules or hooks.”

**任何模式都不会自动批准**：显式 ask 规则命中的工具；需要用户交互的工具（如 `AskUserQuestion`）；识别出的关键路径 `rm`/`rmdir`（如 `rm -rf ~`）；开启 `blockReadsOutsideWorkingDirectories` 时的目录外读取等。

### 受保护路径（对你的仓库很关键）

以下目录在 `default`/`acceptEdits` 下写入会弹窗、`auto` 下交给分类器、`dontAsk` 下拒绝、`bypassPermissions` 下允许，**allow 规则也无法预批准**：

`.git`、`.config/git`、`.vscode`、`.idea`、**`.husky`**、`.cargo`、`.devcontainer`、`.yarn`、`.mvn`、`.claude`（`.claude/worktrees/` 等少数例外）

以及文件：`.gitconfig`、`.gitmodules`、各种 shell rc（`.bashrc`、`.zshrc`…）、`.npmrc`、`.yarnrc`、`.pre-commit-config.yaml`、`lefthook.yml`、`.mcp.json`、`.claude.json` 等。

> 也就是说：**用 husky 管 git hooks 的仓库，Claude 改 `.husky/` 默认就得过你这一关**。

### 工作目录与信任

- 默认只能访问启动目录；扩展用 `--add-dir`、`/add-dir`、或 settings 的 `additionalDirectories`。附加目录只给**文件访问权**，大部分 `.claude/` 配置不会从那里加载。
- `permissions.blockReadsOutsideWorkingDirectories` / `blockWritesOutsideWorkingDirectories` 设为 `true`：文件工具在**任何模式**下都拒绝目录外读/写（写的那个键不限制 shell 命令，要配合沙箱）。
- **工作区信任**：项目 `.claude/settings.json` 的 `allow` 与 `additionalDirectories` 要等你接受信任对话框才生效；deny 立即生效。`claude -p` 和 SDK 不弹信任框——在陌生仓库跑 `claude -p` 前，官方建议 `--setting-sources user` 或 `--bare`，或 `--settings '{"disableAllHooks": true}'`。

### 沙箱：操作系统级的边界

> 原文：“The Bash sandbox is a boundary that the operating system enforces around the shell commands Claude runs on your machine.”

| 访问 | 默认 | 用什么改 |
| :- | :- | :- |
| 写 | 工作目录、每用户临时目录、附加目录；受保护路径仍禁止写 | `sandbox.filesystem.allowWrite` |
| 读 | 机器上大部分位置，**包括** `~/.ssh`、`~/.aws/credentials` | `sandbox.filesystem.denyRead`、`credentials` |
| 网络 | 没有直连出口；经本机代理按允许域名放行，允许列表初始为空 | `sandbox.network.allowedDomains` |
| 环境变量 | 继承 Claude Code 的（含其中的密钥） | `credentials`、`CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` |

- **默认关闭**；`/sandbox` 打开面板（Mode / Overrides / Config 三个标签），选择会存进 `.claude/settings.local.json`。
- 平台：macOS 用内置 Seatbelt；Linux/WSL2 需 `bubblewrap` 与 `socat`；**原生 Windows 不支持**（命令不沙箱运行）。
- **只管 shell 命令**：Read/Edit/WebFetch 等内置工具、hooks、本地 MCP 服务器都在沙箱外，它们由权限规则管。
- 两种沙箱模式：**auto-allow**（沙箱内的命令不问直接跑，但 deny 规则、关键路径 rm、内容型 ask 规则如 `Bash(git push *)` 仍生效）；**regular permissions**（照常走权限流程）。
- **逃生口**：命令在沙箱里失败后，Claude 可请求“不沙箱重试”，走正常权限流程。设 `"allowUnsandboxedCommands": false`（严格沙箱模式）关闭此口。
- 不读代理变量的工具（普通 `ssh`、多数数据库驱动）即使目标域名被允许也连不上；UDP、QUIC、`ping` 出不去。
- 沙箱与权限规则互补：`Read`/`Edit` deny 和 `WebFetch(domain:)` 规则会被合并进沙箱配置。

## 落地到自己的仓库

### 第 1 步：一份团队共享的 `.claude/settings.json`

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test *)",
      "Bash(npx vitest run *)",
      "Bash(git status *)",
      "Bash(git diff *)",
      "Bash(git log *)"
    ],
    "ask": [
      "Bash(git push *)",
      "Bash(npm install *)",
      "Bash(npm publish *)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./server/.env)",
      "Read(./secrets/**)",
      "Bash(git push --force *)",
      "Bash(git reset --hard *)"
    ]
  }
}
```

要点：

- allow 只放**只读或可重复执行的检查命令**；把会改变外部世界的（push、install、publish）放 ask。
- `*` 放在子命令后面：`Bash(git log *)` 只放行 `git log`；`Bash(git *)` 会放行所有 git 子命令（包括可以执行程序的 `-c`）。
- 这份文件提交到仓库后，**deny 立刻对所有人生效**，allow 要等每个人接受信任对话框。

### 第 2 步：个人层面的设置

`~/.claude/settings.json`（你自己所有项目）：

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "deny": ["Read(~/.ssh/**)", "Read(~/.aws/**)"]
  }
}
```

注意 user 设置里写 `Read(/secrets/**)` 会解析成 `~/.claude/secrets/**`；要对每个项目生效用 `//` 或 `~/`。

### 第 3 步（可选）：开沙箱换“少打扰”

在 macOS / Linux / WSL2：

```text
/sandbox
```

选 auto-allow 后，沙箱内命令不再逐条问。想一次性试用而不写文件：

```bash
claude --settings '{"sandbox": {"enabled": true, "allowUnsandboxedCommands": false}}'
```

需要的网络域名写进 settings：

```json
{
  "sandbox": {
    "enabled": true,
    "network": { "allowedDomains": ["registry.npmjs.org", "github.com"] }
  }
}
```

### 第 4 步：选一个默认模式

- 你在仓库里会**自己合并 PR**、愿意事后看 diff：`acceptEdits` + 上面的 ask/deny 足够。
- 想让 Claude 先说清楚再动手：项目 settings 写 `"permissions": { "defaultMode": "plan" }`（plan 可以写在项目里）。
- 想跑 auto：只能放用户设置或用 `--permission-mode auto`；auto 不是硬规则，**“绝不”的事仍要写 deny**。
- 不要在你的真实机器上用 `bypassPermissions`。

### 第 5 步：验证

```text
/permissions     # 看每条规则来自哪个文件
/status          # 看加载了哪些 settings 文件
```

然后故意让 Claude 做一件被 deny 的事（“读一下 .env”），确认 Read 工具和 `cat .env` 都被拒绝。

## 常见坑与排错

- **项目里设了 `"defaultMode": "auto"` 不生效** → 设计如此，只能放用户设置或用参数。
- **allow 了 `Bash(npm *)` 但 `npm test &&` 还是弹窗** → `&&` 后面为空的命令被视为无法解析，不拆分匹配。
- **`Grep(docs/**)` deny 没用** → 改成 `Read(docs/**)`。
- **user 设置里的 `/path` 规则不起作用** → 单斜杠锚定在设置来源（user 设置 = `~/.claude/`），用 `//` 或 `~/`。
- **队友说 allow 规则没生效** → 他们还没接受信任对话框；或者文件不是严格 JSON。
- **沙箱里 `ssh`/数据库客户端连不上允许的主机** → 这些工具不走代理变量，见 sandboxing 页“A database client or other non-HTTP tool fails…”。
- **`git` 在沙箱里报 `index.lock`/`unable to unlink old`** → sandboxing 页 Troubleshooting 有专门条目。
- **Claude 改 `.husky/pre-commit` 总要弹窗** → 受保护路径，allow 规则也预批准不了；这是好事，别绕。

## 自测题

<Quiz :data="quiz" />

## 原文链接

- Settings files and precedence：<https://code.claude.com/docs/en/settings>
- Configure permissions：<https://code.claude.com/docs/en/permissions>
- Choose a permission mode：<https://code.claude.com/docs/en/permission-modes>
- Configure the sandboxed Bash tool：<https://code.claude.com/docs/en/sandboxing>
- All settings（键的完整参考）：<https://code.claude.com/docs/en/settings-reference>
- Example settings files：<https://code.claude.com/docs/en/settings-example>
- Best practices（Enforce the rules that can't have exceptions）：<https://code.claude.com/docs/en/best-practices>
