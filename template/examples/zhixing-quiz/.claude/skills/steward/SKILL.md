---
description: 在知行快刷照看 PR（/steward、/ship 的 watch 以及 PR Steward 会读取本文件）时遵循的规则
---
# 照看本仓库 PR 的规则

- 必须通过的检查就是 CI 的两个 job：`frontend (lint + typecheck + test + build)` 和 `backend (ruff + pytest)`。本地复现：前端 `pnpm --dir frontend check:all`，后端 `cd backend && uv run ruff check app tests && uv run pytest -q`。
- 注意：watch 自主推送时本地 .githooks 不运行，所以推送前自己先跑上面的命令。
- 只修与失败检查、冲突、评审意见直接相关的代码；不顺手重构，不升级依赖，不改 pnpm-lock.yaml / uv.lock（除非评审明确要求改依赖）。
- 不降低覆盖率阈值（frontend/vitest.config.ts）、不关 lint 规则、不跳过测试。
- 任何视觉/样式改动都需要用户确认过的 HTML 原型（docs/02-design/prototypes/）；评审意见要求改样式时，只回复说明并等待用户，不要直接改。
- 不修改：`.github/workflows/`、`.githooks/`、`scripts/setup-git-hooks.sh`、`.claude/`、`AGENTS.md`、`CLAUDE.md`。
- 涉及鉴权范围、匿名调用收费接口、费用/额度阈值、数据库或部署的评审意见：回复你的理解并等待用户决定，不推送代码。
- 合并永远由用户本人完成。
