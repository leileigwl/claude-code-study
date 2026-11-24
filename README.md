# Claude Code 中文学习站

**在线阅读：<https://leileigwl.github.io/claude-code-study/>**

把 Claude Code 落地到自己的仓库：**管住 AI，不让项目失控**。所有结论都对照官方文档 <https://code.claude.com/docs> 逐条核对，每章末尾给出原文链接。非官方学习笔记；Claude Code 是 Anthropic 的产品。

## 这是什么

| 部分 | 内容 |
| :- | :- |
| **A · 落地实战**（`docs/track-a/`） | 10 章。每章固定结构：一句话讲明白 → 为什么会“乱跑” → 原理与全部选项 → 分步动画 → 落地到仓库（真实文件）→ 常见坑 → 自测题 → 原文链接 |
| **B · 官方文档精读**（`docs/track-b/`） | 按官方导航列出全部官方页面：中文概要（取自官方简体中文索引）、原文与中文版链接、对应 A 章、状态（已精读 / 概要）。由脚本生成 |
| **防乱跑模板**（`template/`） | 可直接复制进仓库的 `.claude/`（settings、4 个 hook、4 个 skill、3 个子代理）、`CLAUDE.md`、`REVIEW.md`、`.mcp.json`、`.worktreeinclude`、Claude Approvals 策略（observe），以及知行快刷的覆盖文件 |
| **题库**（`quizzes/`） | 每章一个 JSON，`all.json` 为合并版；`answer` 为 0 起始的选项下标 |

## 怎么用

**只读**：打开在线站点，按[学习路线](https://leileigwl.github.io/claude-code-study/roadmap)走；想直接装护栏就看[第 10 章](https://leileigwl.github.io/claude-code-study/track-a/10-repo-template)。

**用模板**：

```bash
git clone https://github.com/leileigwl/claude-code-study.git
cd your-repo
S=../claude-code-study/template
mkdir -p .claude
cp -r $S/.claude/hooks $S/.claude/skills $S/.claude/agents .claude/
cp $S/.claude/settings.json $S/.claude/compact-reminder.md .claude/
cp $S/.mcp.json $S/.worktreeinclude .
cat $S/.gitignore >> .gitignore
```

然后按第 10 章第 9 步的清单验证（`/status`、`/permissions`、`/hooks`、`/context all`）。

**本地运行站点**（Node 22）：

```bash
npm ci
npm run docs:dev        # 本地预览
npm run docs:build      # 构建；死链会让构建失败
```

**脚本**：

| 命令 | 作用 |
| :- | :- |
| `npm run gen:track-b` | 由 `data/llms-snapshot.txt` + `data/llms-zh-cn-snapshot.txt` 重新生成 `docs/track-b/` |
| `npm run gen:quizzes` | 校验各章题目并生成 `quizzes/all.json` |
| `npm run sync:docs` | 比对线上官方索引与快照，列出新增 / 删除 / 改动；`-- --update` 更新快照 |
| `npm run sync:docs:deep` | 额外逐页比对正文哈希（`data/page-hashes.json`） |

**自动化**（`.github/workflows/`）：`deploy.yml` 在推送到 `main` 时构建并发布到 GitHub Pages；`sync-docs.yml` 每周一 09:00（北京时间）比对官方文档，有变化就开 issue。

## 路线图

- [x] A 路线第 1–10 章 + 9 个分步动画 + 77 道自测题
- [x] 防乱跑模板与知行快刷覆盖文件
- [x] B 路线全量索引（221 页）+ 每周同步
- [ ] B 路线：把“概要”页逐步升级为“已精读”（优先：features-overview、headless、github-actions、costs、troubleshooting）
- [ ] 第 10 章在知行快刷真实落地后，补“实际踩坑记录”
- [ ] 题库导入知行快刷（确认导入格式，见 `PROGRESS.md` 待核实）
- [ ] 跟进官方变化：每次 sync issue 处理完记入更新日志

进度与待核实事项见 [`PROGRESS.md`](./PROGRESS.md)。

## 贡献约定

见 [`CLAUDE.md`](./CLAUDE.md)（本仓库给 Claude Code 的工作说明，人也适用）。
