#!/usr/bin/env node
// PostToolUse（matcher: Edit|Write）：对刚改过的文件就地自动修复 lint。
// PostToolUse 无法撤销已执行的工具；exit 2 只会把 stderr 显示给 Claude，让它接着修。
// 依据：hooks.md「PostToolUse」「Exit code 2 behavior per event」；hooks-guide.md「Auto-format code after edits」
// 单仓/多包都适用：在离文件最近的 package.json / pyproject.toml 所在目录运行工具。
// 按仓库调整：改 LINTERS（没有安装对应工具时静默跳过，不阻塞）。
import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const LINTERS = [
  { ext: /\.(js|mjs|cjs|ts|tsx|jsx|vue)$/, marker: 'package.json', bin: 'node_modules/.bin/eslint', cmd: ['npx', '--no-install', 'eslint', '--fix'] },
  { ext: /\.py$/, marker: 'pyproject.toml', bin: null, cmd: ['uv', 'run', '--frozen', 'ruff', 'check', '--fix'] }
]

const input = JSON.parse(readFileSync(0, 'utf8') || '{}')
const cwd = input.cwd || process.cwd()
const raw = input.tool_input?.file_path
if (!raw) process.exit(0)
const file = resolve(cwd, raw)
const linter = LINTERS.find((l) => l.ext.test(file))
if (!linter || !existsSync(file)) process.exit(0)

// 找最近的包目录
let dir = dirname(file)
while (!existsSync(resolve(dir, linter.marker))) {
  const up = dirname(dir)
  if (up === dir) process.exit(0)
  dir = up
}
if (linter.bin && !existsSync(resolve(dir, linter.bin))) process.exit(0) // 依赖没装：不拦

const [bin, ...args] = linter.cmd
// Windows 上 npx/uv 可能是 .cmd 垫片，需要 shell 才能启动
const r = spawnSync(bin, [...args, file], { cwd: dir, encoding: 'utf8', shell: process.platform === 'win32' })
if (r.error) process.exit(0) // 工具不存在：不拦
if (r.status !== 0) {
  process.stderr.write(`自动修复后仍有 lint 错误（${raw}）：\n${(r.stdout || '') + (r.stderr || '')}`.slice(0, 4000))
  process.exit(2)
}
process.exit(0)
