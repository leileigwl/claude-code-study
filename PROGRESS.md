# PROGRESS

最后更新：2026-11-24（北京时间）。官方文档快照：2026-11-24（`data/llms-snapshot.txt`、`data/llms-zh-cn-snapshot.txt`；逐页原文下载于工作区 `web/downloads/cc-docs/`，未提交到本仓库）。

## A 路线（落地实战）

| 章 | 状态 | 动画 | 自测题 | 原文核对 |
| :- | :- | :- | -: | :- |
| 1. Agent 循环与上下文窗口 | ✅ 完成 | AgentLoopAnim、ContextWindowAnim | 7 | ✅ |
| 2. CLAUDE.md / 记忆 / .claude 目录 | ✅ 完成 | ClaudeMdLayersAnim | 8 | ✅（2026-11-24 补：示例骨架≠知行快刷真实结构，指向第 10 章） |
| 3. settings、权限模式与沙箱 | ✅ 完成 | PermissionFlowAnim | 8 | ✅（补：`.githooks/` 不在受保护路径） |
| 4. Plan mode、会话、checkpoint、worktree | ✅ 完成 | — | 7 | ✅ |
| 5. Hooks：硬性门禁 | ✅ 完成 | HookLifecycleAnim | 8 | ✅（SessionStart 注册改为 `compact-reminder.mjs`，与 template 一致） |
| 6. Skills 与 slash commands | ✅ 完成 | — | 7 | ✅ |
| 7. Subagents | ✅ 完成 | SubagentFanoutAnim | 7 | ✅ |
| 8. MCP 接入 | ✅ 完成 | — | 7 | ✅ |
| 9. Claude Ship 与 /ship | ✅ 完成 | ClaudeShipFlowAnim、ShipWatchAnim | 8 | ✅（删去无官方出处的“2026-11-23 上线”） |
| 10. 防乱跑仓库模板 + 知行快刷实战 | ✅ 完成 | RepoGatesAnim | 10 | ✅ |

核对方法（2026-11-24）：逐章抽出行内代码（命令、设置键、hook 事件、参数、路径）与官方页面全文比对；对版本号（v2.1.xxx）、数值上限（Stop 8 次、auto 3/20 次、超时）、套餐限制、默认值逐条回到原文确认；题目解析里的英文原句与原文比对。

## B 路线（官方文档精读）

- `scripts/gen-track-b.mjs` 生成 8 个分区页 + 总览：221 页，其中 46 页“已精读”（某章「原文链接」列出），4 页“提及”。
- 下一步：优先把 features-overview、headless、github-actions、costs、troubleshooting 升为“已精读”（需要新增或扩展 A 章）。

## 模板 `template/`

- 完成：`.claude/settings.json`（第 3/5/8 章合并）、4 个 hook（worktree / 多包 / Windows 安全）、4 个 skill、3 个子代理、`CLAUDE.md`、`compact-reminder.md`、`.mcp.json`、`.worktreeinclude`、`.gitignore`、`REVIEW.md`、`.claude/approvals.yml`（observe）、`examples/zhixing-quiz/`。
- hook 脚本已用模拟输入测试（受保护文件 exit 2、样式改动 ask、Stop 失败 exit 2、无改动 exit 0）；**尚未在真实 Claude Code 会话里跑过**。

## 工具与自动化

- `scripts/sync-docs.mjs`：已对线上索引运行，结果“无变化”；用篡改过的快照测试过新增 / 改动检测。`--deep` 未在 CI 中启用（首次需 `--deep --update` 建基线）。
- `scripts/build-quizzes.mjs`：77 题，校验通过。
- `.github/workflows/deploy.yml`、`sync-docs.yml`：见下方“部署记录”。

## 待核实

1. **`/ship`、`/steward` 在个人 Pro / Max 套餐上是否可用**：ship-command 页只写了版本与工具前置条件、“counts against your usage”，feature-availability 表里没有这一行。以本机 `/` 菜单为准；缺失时按 ship-command-troubleshooting 排查。
2. **题库导入格式**：`quizzes/*.json` 与 `all.json` 假定 `answer` 是 **0 起始**下标（本站 Quiz 组件按此判分）。知行快刷的导入接口是否同样 0 起始、字段名是否一致，尚未确认。
3. **私有仓库的分支保护 / required checks 需要付费 GitHub 套餐**：官方 Approvals setup 原文写“A private repository also needs a paid GitHub plan”（针对要求 Claude Approvals 检查）；对普通 CI required check 的套餐要求以 GitHub 文档为准。知行快刷目前是公开仓库，不受影响。
4. **窄 deny 规则是否影响 `/ship`**：官方只说 deny `Bash(git push *)` 时不启动 watch。模板 deny 的是 `Bash(git push --force *)`、`Bash(git push -f *)`、`Bash(git * --no-verify*)`，按匹配规则不会命中 watch 的 `git -c core.hooksPath=/dev/null push` 形式，但 `/ship` 如何判定“push 被 deny”没有写明，需在真实会话里确认 watch 能启动。
5. **Taro H5 的本地预览地址**：第 10 章只写 `pnpm --dir frontend dev:h5`，未写端口（Taro 配置决定）。
6. **Claude Ship 上线日期**：之前写的“2026-11-23 上线”没有在官方页面或 changelog 找到出处，已删除。

## 部署记录

- 2026-11-24：推送到 `main`；GitHub Pages 来源设为 **GitHub Actions**（API 创建因 token 缺少 Pages/Administration 权限返回 403，改在仓库 Settings → Pages 网页里设置）。
- 首次 `deploy.yml` 运行在 `configure-pages` 失败（当时 Pages 尚未启用），启用后重跑成功；之后每次推送自动部署。
- 线上：<https://leileigwl.github.io/claude-code-study/> 返回 200；首页、第 10 章动画（8 步）、B 路线表格经浏览器目视检查。
- `sync-docs.yml` 尚未实际触发过（每周一 01:00 UTC 或手动 workflow_dispatch）。
