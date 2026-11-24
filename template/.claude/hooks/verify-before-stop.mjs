#!/usr/bin/env node
// Stop：Claude 想结束本轮时，若工作区有改动，就跑 lint + test；失败则 exit 2 把它“拽回去”继续修。
// 防死循环：Claude Code 自带“连续 8 次被 Stop hook 拽回（中间无工具调用）即强制结束”的上限。
// 依据：hooks.md「Stop」「Exit code 2 behavior per event」；best-practices.md「Enforce the check with a Stop hook」
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

JSON.parse(readFileSync(0, 'utf8') || '{}')
const sh = (cmd) => spawnSync(cmd, { shell: true, encoding: 'utf8' })

// 纯问答、没改文件时不跑检查
const changed = sh('git status --porcelain').stdout.trim()
if (!changed) process.exit(0)

for (const cmd of ['npm run lint --silent', 'npm test --silent']) {
  const r = sh(cmd)
  if (r.status !== 0) {
    process.stderr.write(`“${cmd}” 未通过，修好再结束：\n${(r.stdout + r.stderr).slice(-4000)}`)
    process.exit(2)
  }
}
process.exit(0)
