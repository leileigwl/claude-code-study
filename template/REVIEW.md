# Review instructions

<!--
只给托管的 Code Review 服务读（Claude Ship，Team/Enterprise）。本地 /code-review 不读本文件，它读 CLAUDE.md。
Code Review 从 base/默认分支读取本文件，永远不从 PR 自己的改动里读，所以要保护默认分支。
-->

## What Important means here

只有会导致行为错误、数据泄露、越权或无法回滚的问题才标 Important：逻辑错误、
未按用户隔离的查询、日志或错误信息里的个人信息/密钥、不向后兼容的数据迁移。
命名、风格、重构建议最多算 Nit。违反 CLAUDE.md / AGENTS.md 里的规则一律算 Important。

## Cap the nits

每次审查最多报告 5 个 Nit。

## Do not report

- CI 已经强制的东西：lint、格式、类型错误
- docs/02-design/prototypes/ 下的 HTML 原型
- 任何 lock 文件（pnpm-lock.yaml、uv.lock、package-lock.json）

## Always check

- 前端样式/界面改动：PR 描述里必须链接 docs/02-design/prototypes/ 下已确认的原型，没有就标 Important
- 生产 API 地址必须来自环境变量，缺失时直接报错，不能回退到默认值
- 新增或修改的后端接口有输入校验和测试
- 涉及登录、验证码、配额的改动：检查越权和重放
- 行为相关的结论要给出 file:line 证据，不能只凭命名推断
