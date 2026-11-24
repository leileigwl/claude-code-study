#!/usr/bin/env node
// SessionStart（matcher: compact）：上下文被压缩后，把 .claude/compact-reminder.md 原样打印到 stdout。
// SessionStart 的纯文本 stdout 会作为上下文加给 Claude（hooks.md「SessionStart」）。
// 用 Node 而不是 `cat`：Windows/macOS/Linux 行为一致；文件不存在时静默退出，不报错。
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const file = process.argv[2] || resolve(process.env.CLAUDE_PROJECT_DIR || process.cwd(), '.claude/compact-reminder.md')
if (existsSync(file)) process.stdout.write(readFileSync(file, 'utf8'))
process.exit(0)
