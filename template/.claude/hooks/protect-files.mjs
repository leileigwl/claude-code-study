#!/usr/bin/env node
// PreToolUse（matcher: Edit|Write）：禁止改受保护文件；碰到样式改动时改为“问你”。
// 依据：hooks.md「PreToolUse decision control」「Exit code 2」；hooks-guide.md「Block edits to protected files」
// 输入：stdin 上的 JSON，Edit 有 file_path/old_string/new_string，Write 有 file_path/content。
import { readFileSync } from 'node:fs'
import { relative, sep } from 'node:path'

const input = JSON.parse(readFileSync(0, 'utf8'))
const ti = input.tool_input || {}
const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd()
const rel = relative(root, ti.file_path || '').split(sep).join('/')

// 1) 绝对禁止：直接 exit 2，stderr 会作为原因交给 Claude
const DENY = [
  /(^|\/)\.env(\..*)?$/,          // .env、.env.local …
  /(^|\/)package-lock\.json$/,    // 只能由 npm 生成，不手改
  /^\.github\/workflows\//,        // CI 由你本人改
  /^\.husky\//,                    // git hooks 由你本人改
  /^\.claude\/settings\.json$/,    // 门禁本身不许 AI 改
  /^\.claude\/hooks\//
]
for (const re of DENY) {
  if (re.test(rel)) {
    process.stderr.write(`Blocked: ${rel} 是受保护文件（规则 ${re}）。如确需修改，请停下来让用户本人修改。\n`)
    process.exit(2)
  }
}

// 2) 样式改动：不直接拒绝，而是强制弹窗由你决定（permissionDecision: "ask"）
const text = [ti.old_string, ti.new_string, ti.content].filter(Boolean).join('\n')
const isStyleFile = /\.(css|scss|sass|less)$/.test(rel)
const touchesVueStyle = /\.vue$/.test(rel) && /<style|:style=|\bclass=/.test(text)
if (isStyleFile || touchesVueStyle) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'ask',
      permissionDecisionReason: `样式改动（${rel}）：仓库规则要求先在 docs/02-design/prototypes/ 做 HTML 原型并经你确认。已确认才批准。`
    }
  }))
  process.exit(0)
}

process.exit(0) // 无决定：走正常权限流程
