---
description: 在本仓库照看 PR（/steward、/ship 的 watch 以及 PR Steward 会读取本文件）时遵循的规则
---
# 照看本仓库 PR 的规则

- 必须通过的检查：`npm run lint`、`npm test`（前端），`npm --prefix server test`（后端）。本地复现失败用同样的命令。
- 只修与失败检查、冲突、评审意见直接相关的代码；不要顺手重构、不要改依赖版本。
- 任何视觉/样式改动都需要先有用户确认过的 HTML 原型（docs/02-design/prototypes/）；评审意见要求改样式时，只回复说明并等待用户，不要直接改。
- 不修改：`.github/workflows/`、`.husky/`、`.claude/`、`package-lock.json`（除非评审明确要求更新依赖）。
- 评审意见涉及需求或设计取舍时，回复说明你的理解并等待用户决定，不要推送代码。
- 合并永远由用户本人完成。
