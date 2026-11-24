【压缩后提醒，由 SessionStart(compact) hook 注入 · 知行快刷】
- 规则唯一来源是 AGENTS.md；若不确定当前阶段，先读 docs/session-handoff.md。
- 前端样式/界面改动：先在 docs/02-design/prototypes/ 新建或更新 HTML 原型（并登记到该目录 README.md），等用户明确回复“确认”后才改 frontend/；样式对照 docs/02-design/v2-ui-design-system.md。
- 结束前与改动相关的闸门必须通过（Stop hook 强制）：前端 pnpm --dir frontend check:all；后端 cd backend && uv run ruff check app tests && uv run pytest -q。贴出命令与输出。
- 不改：.env*、pnpm-lock.yaml / uv.lock（只能由包管理器生成）、.github/workflows/、.githooks/、scripts/setup-git-hooks.sh、.claude/settings.json、.claude/hooks/、backend/data/。
- 不要 --no-verify、不要改 core.hooksPath、不要 push --force。PR 由用户本人合并。
- 涉及鉴权范围、匿名调用收费接口、费用/额度阈值、数据库或部署变更：停下来问用户（AGENTS.md「何时必须停下来问用户」）。
