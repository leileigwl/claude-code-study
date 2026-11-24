#!/usr/bin/env node
// Stop：Claude 想结束本轮时，若工作区有改动，就跑与改动相关的检查；失败则 exit 2 把它“拽回去”继续修。
// 防死循环：Claude Code 自带“连续 8 次被 Stop hook 拽回（中间无工具调用）即强制结束”的上限
//           （CLAUDE_CODE_STOP_HOOK_BLOCK_CAP 可调）。
// 依据：hooks.md「Stop」「Exit code 2 behavior per event」；best-practices.md「Enforce the check with a Stop hook」
// 在 worktree 里也对：用输入 JSON 的 cwd（跟随 Claude），而不是 ${CLAUDE_PROJECT_DIR}（不跟随 worktree）。
// 按仓库调整：改 CHECKS。when 匹配“改动文件的仓库相对路径”，命中才跑对应命令。
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const CHECKS = [
  { when: /\.(js|mjs|cjs|ts|tsx|jsx|vue|css|scss|json)$/, cmd: 'npm run lint --silent' },
  { when: /\.(js|mjs|cjs|ts|tsx|jsx|vue)$/, cmd: 'npm test --silent' }
  // 知行快刷（pnpm + uv 的前后端分目录仓库）换成：
  // { when: /^frontend\//, cmd: 'pnpm --dir frontend check:all' },
  // { when: /^backend\//,  cmd: 'cd backend && uv run ruff check app tests && uv run pytest -q' }
]

const input = JSON.parse(readFileSync(0, 'utf8') || '{}')
const sh = (cmd, cwd) => spawnSync(cmd, { shell: true, encoding: 'utf8', cwd })

const top = sh('git rev-parse --show-toplevel', input.cwd).stdout.trim()
if (!top) process.exit(0) // 不在 git 仓库里

// 已修改 + 已暂存 + 未跟踪的文件（相对仓库根）
const changed = sh('git status --porcelain --untracked-files=all', top).stdout
  .split('\n').filter(Boolean).map((l) => l.slice(3).replace(/^.* -> /, '').replace(/^"|"$/g, ''))
if (changed.length === 0) process.exit(0) // 纯问答、没改文件：不检查

for (const { when, cmd } of CHECKS) {
  if (!changed.some((f) => when.test(f))) continue
  const r = sh(cmd, top)
  if (r.status !== 0) {
    process.stderr.write(`“${cmd}” 未通过，修好再结束（若确实无法修复，说明原因并停下来问用户）：\n${((r.stdout || '') + (r.stderr || '')).slice(-4000)}`)
    process.exit(2)
  }
}
process.exit(0)
