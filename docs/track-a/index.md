---
title: A · 总览：为什么 AI 会“乱跑”
outline: [2, 3]
---

# A · 落地实战总览：为什么 AI 会“乱跑”，怎么管住它

<div class="one-liner">

**一句话讲明白**：AI 在仓库里“乱跑”，几乎都不是模型“坏”，而是三件事没管好——**它看到了什么**（上下文）、**它被允许做什么**（权限与门禁）、**谁来验收**（检查与合并）。A 路线 10 章就按这三件事，从原理讲到一个真实仓库能直接用的模板。

</div>

## “乱跑”的四种典型表现

| 表现 | 根因 | 主要在哪几章解决 |
| :- | :- | :- |
| 忘了你说过的规则，越聊越偏 | 上下文窗口有限，长会话被压缩；规则写在聊天里而不是文件里 | 1、2、4 |
| 改了不该碰的文件、执行了危险命令 | 权限没配；只靠 CLAUDE.md 里一句“不要” | 3、5、8 |
| 说“完成了”其实没测、没过 lint | 完成标准没有被程序强制 | 1、5、7 |
| 一个功能越做越大，最后自己合并了 | 没有规格、没有独立审查、合并权没收回 | 4、6、7、9、10 |

## 一个贯穿全路线的区分：建议 vs 强制

> 原文（permissions）：“Permission rules are enforced by Claude Code, not by the model. Instructions in your prompt or CLAUDE.md shape what Claude tries to do, but they don't change these rules.”

| 类型 | 是谁执行 | 例子 | 适合放 |
| :- | :- | :- | :- |
| **建议**（模型读、模型判断） | Claude | CLAUDE.md、`.claude/rules/`、skills、子代理的提示词 | 流程、约定、偏好、仓库常识 |
| **强制**（程序执行） | Claude Code | settings 的 deny/ask/allow、hooks、受保护路径、沙箱、子代理的 `tools` 限制 | “必须”和“绝不” |
| **兜底**（仓库外） | git / GitHub | git hooks、CI required check、分支保护、你本人合并 | 谁推的都要过的门 |

每章的“落地”部分都会告诉你：这件事该放在哪一类。

## 10 章一览

| 章 | 一句话 | 落地产物（都在 `template/` 里） |
| :- | :- | :- |
| [1. Agent 循环与上下文窗口](./01-agent-loop-context) | 它“收集上下文 → 动手 → 验证”循环，一切都挤在一个有限窗口里 | CLAUDE.md 的 Commands / Compact Instructions；SessionStart(compact) |
| [2. CLAUDE.md / 记忆 / .claude 目录](./02-claude-md-memory) | 项目常识放 CLAUDE.md，个人的放 local/user 层，硬规则不放这里 | `CLAUDE.md`、`.gitignore` 追加 |
| [3. settings、权限模式与沙箱](./03-settings-permissions-sandbox) | deny → ask → allow，程序强制；沙箱是操作系统级边界 | `.claude/settings.json` 的 `permissions` |
| [4. Plan mode、会话、checkpoint、worktree](./04-plan-sessions-worktrees) | 先想清楚、能回退、并行不打架 | `.worktreeinclude`；规划/实现分会话 |
| [5. Hooks：硬性门禁](./05-hooks-gates) | 编辑前拦、编辑后修、结束前验 | 4 个 Node hook 脚本 + 注册 |
| [6. Skills 与 slash commands](./06-skills-commands) | 把你的流程沉淀成 `/命令` | `/feature-spec`、`/ui-prototype`、`/pr-ready`、`steward` |
| [7. Subagents](./07-subagents) | 独立上下文的专职助手，工具可限 | `explorer`、`reviewer`、`test-runner` |
| [8. MCP 接入](./08-mcp) | 接外部工具，同时控制成本与风险 | `.mcp.json` + MCP 权限规则 |
| [9. Claude Ship 与 /ship](./09-claude-ship) | PR 阶段的审查、修复、批准；合并永远是人 | `REVIEW.md`、`approvals.yml`（observe）、steward skill |
| [10. 防乱跑仓库模板 + 知行快刷实战](./10-repo-template) | 把前 9 章装进一个真实仓库，并说清每层的漏洞 | 完整 `template/` + `examples/zhixing-quiz/` |

## 怎么读

- **第一次读**：按顺序 1 → 10。1–3 章是地基，后面每章都会引用。
- **只想先用上**：直接看[第 10 章](./10-repo-template)，复制模板，回头再按需读对应章节。
- **每章结尾的自测题**：答案和解析都带官方原文出处；全部题目也在仓库的 `quizzes/` 目录。
- **遇到红字** <span class="verify">待核实</span>：表示官方文档没有写清、需要你在自己环境里确认的点，汇总在仓库的 `PROGRESS.md`。

## 动画怎么看

所有动画共用一个播放器：**每步只讲一件事**，舞台下方一行大白话旁白，技术细节折叠在“细节”里。颜色含义全站固定：

- <span style="color:var(--cc-you);font-weight:700">蓝</span> = 你
- <span style="color:var(--cc-claude);font-weight:700">橙</span> = Claude（模型，会判断）
- <span style="color:var(--cc-harness);font-weight:700">灰</span> = Claude Code 程序（硬规则）
- <span style="color:var(--cc-pass);font-weight:700">绿</span> = 通过 / 放行
- <span style="color:var(--cc-block);font-weight:700">红</span> = 拦截 / 阻止
