#!/usr/bin/env node
// PostToolUse（matcher: Edit|Write）：对刚改过的 JS/TS/Vue 文件跑 eslint --fix。
// PostToolUse 无法撤销已执行的工具；exit 2 只会把 stderr 显示给 Claude，让它接着修。
import { readFileSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const input = JSON.parse(readFileSync(0, 'utf8'))
const file = input.tool_input?.file_path
if (!file || !/\.(js|mjs|cjs|ts|tsx|vue)$/.test(file) || !existsSync(file)) process.exit(0)

const r = spawnSync('npx', ['--no-install', 'eslint', '--fix', file], { encoding: 'utf8' })
if (r.status !== 0) {
  process.stderr.write(`ESLint 仍报错（${file}）：\n${(r.stdout || '') + (r.stderr || '')}`.slice(0, 4000))
  process.exit(2)
}
process.exit(0)
