---
name: feature-spec
description: 新功能开工前，通过提问把需求写成规格文件 docs/specs/<名字>.md，只写文档不改代码
disable-model-invocation: true
argument-hint: "[功能名，例如 streak]"
allowed-tools: Read Grep Glob
---
目标：产出 `docs/specs/$ARGUMENTS.md`，**本次不修改任何源码**。

1. 先读与该功能相关的现有代码和 docs/，避免重复造轮子。
2. 用多选题的方式逐个问清楚我没想到的点：范围内/范围外、数据怎么存、错误和空状态、移动端交互、是否需要后端改动、是否涉及样式（涉及就要先走 /ui-prototype）。
3. 问到能写规格为止，然后写入规格文件，固定包含这些小节：
   - 目标（一句话）
   - 范围内 / 范围外（明确列出“不做什么”）
   - 用户故事与验收标准（每条可测试）
   - 影响的文件/模块（预估）
   - 完成标准：必须通过的命令（npm run lint、npm test 等）
   - 风险与待定问题
4. 写完后提示我：审阅规格，然后**开一个新会话**（最好是 `claude --worktree $ARGUMENTS`）按规格实现。
