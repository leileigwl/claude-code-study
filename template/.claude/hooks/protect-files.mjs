#!/usr/bin/env node
// PreToolUse（matcher: Edit|Write）：
//   1) 受保护文件 → exit 2 直接拦（stderr 作为原因交给 Claude）
//   2) 门禁/审查配置文件 → permissionDecision "ask"，强制弹窗由你决定（auto 模式也不交给分类器）
//   3) 前端样式改动 → "ask"，提醒“先有经你确认的 HTML 原型”
// 依据：hooks.md「PreToolUse decision control」「Exit code 2」；hooks-guide.md「Block edits to protected files」；
//       worktrees.md「Hook paths don't follow the worktree」（${CLAUDE_PROJECT_DIR} 不跟随 worktree，所以按文件所在仓库算相对路径）
// 输入：stdin 上的 JSON；Edit 有 file_path/old_string/new_string，Write 有 file_path/content。
// 按仓库调整：只需改下面三个列表。
import { readFileSync, existsSync } from 'node:fs'
import { dirname, relative, sep, resolve } from 'node:path'

// ① 绝对禁止 AI 改（你本人改）
const DENY = [
  /(^|\/)\.env(\..+)?$/,               // .env、.env.local …（.env.example 见下方例外）
  /(^|\/)(package-lock\.json|pnpm-lock\.yaml|yarn\.lock|uv\.lock)$/, // 只能由包管理器生成
  /^\.github\/workflows\//,             // CI 是最后一道门
  /^\.husky\//,                          // husky 管的 git hooks
  /^\.githooks\//,                       // core.hooksPath 管的 git hooks（不在 Claude Code 内置受保护路径里！）
  /^scripts\/setup-git-hooks\.sh$/,
  /^\.claude\/settings\.json$/,          // 门禁本身
  /^\.claude\/hooks\//
]
const DENY_EXCEPT = [/(^|\/)\.env\.example$/]

// ② 可以改，但每次都必须你点头（审查规则、记忆、MCP 配置）
const ASK = [
  /^CLAUDE\.md$/, /^AGENTS\.md$/, /^REVIEW\.md$/, /^\.mcp\.json$/,
  /^\.claude\/approvals\.yml$/, /^\.claude\/classifiers\//,
  /^\.claude\/(skills|agents|rules)\//, /^\.claude\/compact-reminder\.md$/,
  /(^|\/)CODEOWNERS$/
]

// ③ 样式改动：先原型后代码（原型目录本身不受限）
const PROTOTYPE_DIR = 'docs/02-design/prototypes/'
const STYLE_FILE = /\.(css|scss|sass|less|styl)$/
const STYLE_IN_CODE = [
  { file: /\.vue$/, text: /<style|:style=|\bclass=/ },
  { file: /\.(tsx|jsx)$/, text: /\bclassName=|\bstyle=\{|styled\.|css`/ }
]

const input = JSON.parse(readFileSync(0, 'utf8') || '{}')
const ti = input.tool_input || {}
const filePath = ti.file_path || ''
if (!filePath) process.exit(0)

// 找文件所在的仓库根（有 .git 文件或目录的最近祖先）；worktree 里 .git 是文件，同样适用
function repoRoot(p) {
  let d = resolve(input.cwd || process.cwd(), dirname(p))
  while (true) {
    if (existsSync(resolve(d, '.git'))) return d
    const up = dirname(d)
    if (up === d) return process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd()
    d = up
  }
}
const abs = resolve(input.cwd || process.cwd(), filePath)
const rel = relative(repoRoot(abs), abs).split(sep).join('/')

const ask = (reason) => {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'ask', permissionDecisionReason: reason }
  }))
  process.exit(0)
}

if (DENY.some((re) => re.test(rel)) && !DENY_EXCEPT.some((re) => re.test(rel))) {
  process.stderr.write(`Blocked: ${rel} 是受保护文件，AI 不能修改。请停下来，说明你想怎么改，让用户本人修改。\n`)
  process.exit(2)
}

if (ASK.some((re) => re.test(rel))) {
  ask(`${rel} 是规则/审查配置文件：改它会改变以后所有会话或审查的行为，需要你逐次确认。`)
}

if (!rel.startsWith(PROTOTYPE_DIR)) {
  const text = [ti.old_string, ti.new_string, ti.content].filter(Boolean).join('\n')
  const styleChange = STYLE_FILE.test(rel) || STYLE_IN_CODE.some((r) => r.file.test(rel) && r.text.test(text))
  if (styleChange) {
    ask(`样式改动（${rel}）：仓库规则要求先在 ${PROTOTYPE_DIR} 做 HTML 原型并经你确认。原型已确认才批准。`)
  }
}

process.exit(0) // 无决定：走正常权限流程
