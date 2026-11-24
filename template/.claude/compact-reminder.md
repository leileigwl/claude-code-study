【压缩后提醒，由 SessionStart(compact) hook 注入】
- 前端样式/界面改动：先在 docs/02-design/prototypes/ 做 HTML 原型，等用户明确回复“确认”后才改前端代码。
- 结束本轮前必须通过与改动相关的检查（Stop hook 会强制）；贴出命令和输出作为证据。
- 不改：.env*、lock 文件、.github/workflows/、.githooks/ 或 .husky/、.claude/settings.json、.claude/hooks/。
- 不要 push --force、--no-verify、改 core.hooksPath；PR 由用户本人合并。
- 如果不记得当前任务的完成标准，先问用户，不要猜。
