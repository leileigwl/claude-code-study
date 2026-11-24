---
title: 9. Claude Ship 与 /ship
outline: [2, 3]
---

<script setup>
import quiz from '../../quizzes/09-claude-ship.json'
</script>

# 9. Claude Ship 与 `/ship`：PR 阶段的审查、修复与批准

<div class="one-liner">

**一句话讲明白**：**Claude Ship**（2026-11-23 上线）是团队版的三个 GitHub agent——Code Review 找问题、PR Steward 推修复、Claude Approvals 按策略报告还缺谁批准；**合不合并永远由 GitHub 分支规则和人决定**。个人仓库用本地的 `/code-review`、`/ship`、`/steward` 得到类似流程。

</div>

> ⚠️ 套餐限制：Claude Ship 三个 agent **仅限 Team 和 Enterprise**，仓库需在 GitHub（Code Review 已正式可用；PR Steward 与 Claude Approvals 是 public beta）。启用了 Zero Data Retention、HIPAA 配置或客户管理密钥（CMEK）的组织不可用。按 token 计费，走组织的 usage credits，**不在套餐包含的用量里**。

## 为什么需要（对应哪种“乱跑”）

| 症状 | 对策 |
| :- | :- |
| AI 写完就合，没人真正审过 | 审查交给“没看过实现过程”的审查者（Code Review / `/code-review`），合并留给人 |
| PR 开了之后，失败的 CI、评论来回拖好几天 | PR Steward / `/steward` 持续处理失败检查、冲突和评论 |
| 关键目录（支付、配置）和普通改动一样随便合 | Claude Approvals 按路径要求批准人数 |
| 担心 agent 自己点了合并 | Steward 设计上不批准不合并；`/ship` watch 自主时被禁止合并/批准/强推；**分支保护**是最后一道门 |

## 详细原理：团队版 Claude Ship

<ClaudeShipFlowAnim />

### 三个 agent 的分工

| Agent | 做什么 | 不做什么 | 状态 |
| :- | :- | :- | :- |
| **Code Review** | 读改动与周边代码，找逻辑错误、安全漏洞、边界问题；行内评论按严重度排序；留下检查项 **Claude Code Review** | 只读仓库、不推提交；检查项不会以失败结束；单独不批准也不阻塞 PR；不构建、不运行代码 | 正式可用 |
| **PR Steward** | 处理失败检查、合并冲突、人的评论和审查 bot 的发现（Code Review 标为 Important 的），推送修复提交 | **设计上不批准、不合并** | Public beta |
| **Claude Approvals** | 读 `.claude/approvals.yml`，报告“还需要谁批准”；策略允许时 Claude 可以提交批准评审 | 条件读不到 CI 结果；只有你在 GitHub 把它设为 required check 时才阻塞合并 | Public beta |

> 原文：“Your settings and GitHub branch rules determine what merges.”

### Code Review 细节

- **四个阶段**：Find（多个 agent 并行看 diff 和周边代码）→ Verify（核对、过滤误报）→ Rank（去重、按严重度排序）→ Post。
- **严重度**：🔴 Important（合并前应修的 bug）、🟡 Nit（小问题，不阻塞）、🟣 Pre-existing（不是本 PR 引入的已有 bug）。
- **审查级别**：Quick / Standard（默认）/ Deep，越深越贵；Owner 可按仓库单独设置。
- **何时运行**（每个仓库）：PR 打开时一次 / 每次 push（默认，最多） / 只在请求时（Manual）。草稿和 fork 的 PR 不自动审查。
- **评论命令**：`@claude review`（审一次）、`@claude review always`（订阅之后每次 push）、`@claude review once`、`@claude review stop` / `off` / `pause`（取消订阅）。
- **调整审查内容**：仓库根的 `REVIEW.md`（只给审查用：什么算 Important、跳过哪些路径、加哪些检查）+ `CLAUDE.md`（项目通用规则，违反会被标出）。`REVIEW.md` 从 base/默认分支读取，**永远不从 PR 自己的改动里读**——要保护好默认分支。

### PR Steward 细节

- **启动方式**（每个仓库）：**Manual (@claude steward)**（官方建议从这里开始）/ On / On (including drafts) / Off。
- 默认跳过：草稿、fork 来的 PR、bot 开的 PR、没有写权限的作者。
- 观察中的 PR 带标签 `claude-pr-steward-watching`；停止：去掉标签或评论 `@claude stop`。
- 以 **Claude GitHub App** 的身份行动，在云端会话里工作。
- **默认没有花费上限**，Owner 要自己设。
- 读取仓库的 `.claude/skills/steward/SKILL.md` 作为照看规则（与本地 `/steward` 共用，[第 6 章](./06-skills-commands)有模板）。

### Claude Approvals 细节

最简策略：

```yaml
# .claude/approvals.yml
version: 1
mode: observe
rules:
  - purpose: "A change takes two people, and Claude doesn't approve."
    paths: ["**"]
    verdict: { claude: comments, seats: 2 }
    advisory: [claude/code_review]
```

| 键 | 含义 |
| :- | :- |
| `version` | 必填，`1` |
| `mode` | `enforce`（默认）或 `observe`（只展示判定，通常算通过，**仍计费**） |
| `rules[].purpose` | 这条规则为什么存在 |
| `rules[].paths` | 匹配哪些改动文件 |
| `rules[].verdict` | `seats`：需要几个人（作者可以占一个）；`claude: approves / comments`：Claude 能否批准 |
| `rules[].if` / `override` | 条件（PR 的事实如改动行数、作者、目标分支，或 classifier 的回答）/ 条件满足时替换 verdict |
| `rules[].advisory` | 只运行不决定的 classifier；写 `claude/code_review` 才能保留自动 Code Review |
| `nested` | `overwrite`（默认）或 `inherit` |

**两个大坑**：

1. **加了策略文件会让自动 Code Review 停掉**——除非匹配的规则里写了 `claude/code_review`（observe 模式下也一样）。
2. **没人看也能合并的情况**：检查项不是 required；`seats: 1` 时作者自己就占满；GitHub 规则要求 1 个批准而 Claude 的批准算数；`claude: approves` 的规则本身不启动 Code Review。再叠加 auto-merge 或 merge queue，就可能**无人参与就合并**。

**强制前的前置条件**（Approvals setup 原文）：需要合格的组织与 usage credits；Claude GitHub App 已安装并关联组织；能合并到默认分支；仓库 admin 权限（私有仓库要求 required check 还需要**付费 GitHub 套餐**）；**强制任一入门策略前需要两名有写权限的人**。

**评论命令**：`@claude approvals rerun`、`@claude approve`（详见 approvals-pull-requests 页）。

### 开启与关闭顺序

在 **Organization settings > Claude Ship**（需 Owner）：

1. 开 Code Review →
2. 开 PR Steward（启动方式先选 Manual，**设好花费上限**）→
3. 开 Claude Approvals（policy 文件先 `mode: observe`）

关闭顺序相反：**先关 Approvals**（策略会在 Code Review 关掉的地方仍启动计费的审查）→ Steward → Code Review。关掉组织的 usage credits **不会**停止已开启 agent 的计费。

## 个人仓库的路线：`/code-review` → `/ship` → `/steward`

<ShipWatchAnim />

### `/code-review`：本地审查（任何套餐）

| 想审查 | 输入 |
| :- | :- |
| 当前分支 + 未提交改动 | `/code-review` |
| 最近 15 个提交 | `/code-review HEAD~15..HEAD` |
| 一个分支对另一个 | `/code-review main...my-feature` |
| 某个 PR | `/code-review 1234` |
| 某个路径 | `/code-review src/auth` |

- `--fix`：审查后把发现应用到工作区（经过你的权限模式）；`--comment`：把发现作为行内评论发到 GitHub PR。
- 在终端里作为**后台子代理**运行，有自己的上下文；**遵循 CLAUDE.md，不读 REVIEW.md**。
- 后台 `--fix` 的编辑不在 checkpoint 里，回退用 git。
- `/review` 是别名；`/code-review ultra` 是云端多代理深度审查 [ultrareview](https://code.claude.com/docs/en/ultrareview)（需 claude.ai 账号登录）。

### `/ship` 与 `/steward`

**前置**：Claude Code **v2.1.330+**；GitHub CLI **2.63+** 且 `gh auth login`；git **2.38+**；只能在本地终端 CLI 运行（云端会话没有）；原生 Windows 上不启动 watch；会话处于 `bypassPermissions` 时不启动 watch；想无人值守就用 auto 模式（其他模式会在每个提示处等你）。官方文档没有写明 `/ship` 的套餐限制——它在你自己的会话里运行、计入你自己的用量。<span class="verify">待核实：个人 Pro/Max 套餐下 `/ship` 是否可用，以你本机 `/` 菜单为准；缺失时按 troubleshooting 页排查（含“跳过 feature-flag 获取的会话不可用”）。</span>

**`/ship` 四步**：

1. **Pull request**：可替你提交未提交的改动、推送分支、开 PR（以你的身份）。在默认分支上会新建分支。**不弹确认框**，提交前和推送前各有一行以 “Esc to cancel” 结尾的提示，几秒后继续。取消在推送前、提交已发生时，用 `git reset HEAD~1` 撤销提交保留文件。
2. **Review**：用 `/code-review` 审查。
3. **Watch**：持续处理失败检查、合并冲突、评审意见和它自己的审查发现，推送修复。
4. **Merge**：就绪后**你自己合并**。

`/steward` 跳过前两步，直接对你已开的 PR 开始 watch（PR 必须是你的、分支已在本地 checkout）。

**它不会提交未提交改动的情况**：分支已有 PR；仓库是**公开**的；未提交文件名像密钥（如 `.env`）——私有仓库里此时什么都不提交不推送。要草稿 PR、别的 base 分支、PR 模板、GitHub Enterprise 或 fork，先自己开 PR 再运行 `/ship`。

**watch 期间在 auto 模式下不询问就会做的**：处理它判断为问题的审查发现、可发一条总结评论、推提交、把 base 分支合并进来、处理并重跑失败检查、回复评论并 resolve、重新请求审查。默认读你和有写权限者的评论（github.com 上也读 Claude bot 的）；要读别的 bot：`/steward +my-lint-bot`。

**Claude 自主行动时被阻止的**：合并 PR、批准 PR、开启 auto-merge、强推；`gh`/`git` 命令限于一个短名单；不需要的工具（connectors、WebFetch、WebSearch）被拒绝。`/ship terms` 查看完整限制。

**官方警告：限制并不覆盖一切**：

| 情况 | 结果 |
| :- | :- |
| PR 开着 auto-merge | 检查和评审满足后 GitHub 自动合并，Claude 推的修复可能促成它。`gh pr merge --disable-auto <number>` 关闭 |
| 你在 Claude 空闲时发了一条消息 | 回答你的那一轮**限制解除**，auto 模式下可能被允许合并 |
| 你把会话转到后台（如按 `←`） | watch 结束，但进行中的工作可能在后台**无这些限制**继续 |
| 分支规则允许你一个人合并 | watch 用你的 `gh`/`git` 身份，可能促成合并 |

**watch 期间会在你电脑上运行的代码**：base 分支（合并进来时，包括会自动运行的脚本）、别人推到你分支的提交、你分支里的程序（例如测试）、你的 Claude Code hooks、仓库的 `.claude/skills/steward/SKILL.md`。所以：“Run a watch only where you trust everyone who can merge to the base branch or push to your branch.”

**结束 watch**：PR 合并或关闭、PR Steward 打标签、7 天到期；按 `Esc` 或 `Ctrl+C`（一次就可能结束，无确认）；切分支或改 git 设置（如 `git push -u`）；会话结束、转后台、开另一个 watch 或带任务的 `/loop`、`/clear`、`/resume`、`/branch`；错误、拒绝提示、用量上限。主动停止 `/ship stop`；查看 `/tasks`（显示为 `/steward --tend` 开头的定时任务）。

**参数**：`/ship low|medium|high|xhigh|max`（审查 effort，默认 `high`）、`/ship 41` 或 PR 链接、`+botname`、`stop`、`terms`；组合时 effort 放最前：`/ship low 41 +my-lint-bot`。

**和你的 settings / hooks 的关系**：

| 设置 | `/ship` 自己的提交与推送 | watch 期间 |
| :- | :- | :- |
| deny `Bash(git push *)` | `/ship` 把这些步骤留给你 | **不启动 watch** |
| ask `Bash(git push *)` | 不检查 | 不匹配 watch 用的 `git -c core.hooksPath=/dev/null push` 形式，不弹窗 |
| ask `Bash(git *)` | 不检查 | 匹配，每次都等你（auto 下也是） |
| auto 分类器、PreToolUse 等工具 hooks | 不运行 | 不作用于 Claude Code 自己运行的 `gh`/`git` 命令 |
| 仓库 git hooks（husky 等） | 运行 | watch 自主轮次里 Claude 的 fetch/merge/commit/push **不运行**它们 |

最后一行对你很重要：**watch 推上去的提交不会经过本地 husky**，所以 CI（GitHub Actions）必须作为 required check 兜底。

## 落地到自己的仓库

### 个人仓库（你现在的情况）

1. GitHub 上给 `main` 开**分支保护**：要求 PR、要求 CI（lint + test）作为 required status check、禁止强推。（私有仓库的部分规则可能需要付费 GitHub 套餐，以 GitHub 页面为准。）**不要开 auto-merge。**
2. 仓库里放 `.claude/skills/steward/SKILL.md`（[第 6 章](./06-skills-commands)模板）：写清必须通过的检查、不许改的目录、样式改动必须先有原型、合并由你来。
3. 日常节奏：

```text
/pr-ready            # 自检：范围、检查、PR 描述（第 6 章的 skill）
/ship                # 开 PR + 审查 + watch
```

想先看审查发现再让它改，在审查进行中就说：

```text
From now on, don't push code changes or reply to reviewers without asking me first. Show me the review findings and wait.
```

（这只是对 Claude 的请求，Claude Code 不强制；要强制就用 ask `Bash(git *)`，watch 每一步都会等你。）

4. 你在 GitHub 上看完，**自己点合并**。

### 团队仓库（Team / Enterprise）

1. Owner 在 **Organization settings > Claude Ship** 开 Code Review，先选一个仓库、审查级别 Standard、运行时机先设 Manual 或“PR 打开时一次”控制成本。
2. 仓库根加 `REVIEW.md`：

```markdown
# Review instructions
## What Important means here
只有会导致行为错误、数据泄露或无法回滚的问题才标 Important。
## Skip
- docs/02-design/prototypes/**（HTML 原型，不审）
- **/*.snap
## Always check
- 生产 API 地址必须来自环境变量，缺失时直接报错
- 新增接口必须有输入校验
```

3. 开 PR Steward，启动方式 **Manual (@claude steward)**，**设花费上限**。
4. 加 `.claude/approvals.yml`，`mode: observe`，保留 `advisory: [claude/code_review]`；观察一段时间、判定与人一致后再改 `enforce` 并在 GitHub 设为 required check。
5. 永远不要组合“auto-merge + 不要求人的策略”。

## 常见坑与排错

- **`/ship` 不在 `/` 菜单** → `claude update` 后重启（新功能可能要第二次启动才出现）；`/status` 检查是否有 `disableBundledSkills` 或 `skillOverrides` 的 `ship-local: off`；跳过 feature-flag 获取的会话（如设了 `DISABLE_TELEMETRY` 或用第三方 provider）没有 `/ship`。
- **`/ship is turned off right now`** → 按提示运行 `/login`。
- **`GitHub CLI (gh) isn't installed / isn't signed in`** → 安装并 `gh auth login`。
- **`/ship` 什么都没提交** → 公开仓库、已有 PR、或有像密钥的文件名；见 troubleshooting 页。
- **你自己的 `ship`/`steward` skill 不加载了** → 这些名字保留给内置命令。
- **加了 approvals.yml 后 Code Review 不自动跑了** → 规则里加 `claude/code_review`。
- **PR Steward 没启动** → 草稿、fork、bot 开的 PR、或作者无写权限会被跳过；或仓库设成了 Manual。
- **Code Review 没有 check run** → code-review-troubleshooting 页 “No check run appears on the test pull request”。

## 自测题

<Quiz :data="quiz" />

## 原文链接

- Claude Ship：<https://code.claude.com/docs/en/claude-ship>
- Code Review / Setup / Customize / Pull requests / Costs / Troubleshoot：<https://code.claude.com/docs/en/code-review>、<https://code.claude.com/docs/en/code-review-setup>、<https://code.claude.com/docs/en/code-review-customize>、<https://code.claude.com/docs/en/code-review-pull-requests>、<https://code.claude.com/docs/en/code-review-costs>、<https://code.claude.com/docs/en/code-review-troubleshooting>
- PR Steward / Setup / Pull requests / Security：<https://code.claude.com/docs/en/pr-steward>、<https://code.claude.com/docs/en/pr-steward-setup>、<https://code.claude.com/docs/en/pr-steward-pull-requests>、<https://code.claude.com/docs/en/pr-steward-security>
- Claude Approvals / Setup / Policy / GitHub rules：<https://code.claude.com/docs/en/approvals>、<https://code.claude.com/docs/en/approvals-setup>、<https://code.claude.com/docs/en/approvals-policy>、<https://code.claude.com/docs/en/approvals-github-rules>
- /ship 与 /steward：<https://code.claude.com/docs/en/ship-command>、<https://code.claude.com/docs/en/ship-command-troubleshooting>
- 本地审查 /code-review：<https://code.claude.com/docs/en/code-review-local>
- Feature availability（套餐对照）：<https://code.claude.com/docs/en/feature-availability>
