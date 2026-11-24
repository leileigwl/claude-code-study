#!/usr/bin/env node
/**
 * 比对线上官方文档索引与仓库快照，列出新增 / 删除 / 改动的页面。
 *
 *   线上：https://code.claude.com/docs/llms.txt          ↔ data/llms-snapshot.txt
 *         https://code.claude.com/docs/_llms/zh-cn.txt   ↔ data/llms-zh-cn-snapshot.txt
 *
 * “改动”指：标题、摘要或所在分组变了（索引层面的变化）。
 * 加 --deep 时，再逐页下载 https://code.claude.com/docs/en/<slug>.md，与 data/page-hashes.json 里的
 * sha256 比较，找出“索引没变但正文变了”的页面（首次运行只建立基线）。
 *
 * 输出：stdout 与 data/sync-report.md（已 gitignore）；在 GitHub Actions 里还写 $GITHUB_OUTPUT 的 changed=true/false。
 * 选项：--update  用线上版本覆盖快照（以及 --deep 时的 page-hashes.json），之后运行 npm run gen:track-b
 *       --en <file> / --zh <file>  用本地文件代替线上（测试用）
 * 退出码：0 = 正常（不论有无变化）；2 = 下载失败
 */
import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const flag = (n) => args.includes(n)
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null }

const SOURCES = [
  { key: 'en', label: '英文索引', url: 'https://code.claude.com/docs/llms.txt', snap: 'data/llms-snapshot.txt', sectionLevel: 2, local: opt('--en') },
  { key: 'zh', label: '简体中文索引', url: 'https://code.claude.com/docs/_llms/zh-cn.txt', snap: 'data/llms-zh-cn-snapshot.txt', sectionLevel: 3, local: opt('--zh') }
]
const ENTRY = /^- \[(.+?)\]\(https:\/\/code\.claude\.com\/docs\/(?:en|zh-CN)\/(.+?)\.md\)(?::\s*(.*))?$/

function parse(text, sectionLevel) {
  const map = new Map()
  const path = {}
  for (const line of text.split('\n')) {
    const h = /^(#{2,6}) (.+)$/.exec(line)
    if (h) {
      const lv = h[1].length
      path[lv] = h[2].trim()
      for (const k of Object.keys(path)) if (Number(k) > lv) delete path[k]
      continue
    }
    const m = ENTRY.exec(line)
    if (m) {
      const group = Object.keys(path).map(Number).filter((l) => l >= sectionLevel).sort().map((l) => path[l]).join(' › ')
      map.set(m[2], { title: m[1], desc: (m[3] || '').trim(), group })
    }
  }
  return map
}

async function get(url) {
  const r = await fetch(url, { headers: { 'user-agent': 'claude-code-study-sync/1.0 (+https://github.com/leileigwl/claude-code-study)' } })
  if (!r.ok) throw new Error(`${url} → HTTP ${r.status}`)
  return r.text()
}

function diff(oldMap, newMap) {
  const added = [], removed = [], changed = []
  for (const [slug, n] of newMap) {
    const o = oldMap.get(slug)
    if (!o) { added.push({ slug, ...n }); continue }
    const what = []
    if (o.title !== n.title) what.push(`标题：「${o.title}」→「${n.title}」`)
    if (o.desc !== n.desc) what.push(`摘要：「${o.desc || '（无）'}」→「${n.desc || '（无）'}」`)
    if (o.group !== n.group) what.push(`分组：${o.group} → ${n.group}`)
    if (what.length) changed.push({ slug, title: n.title, what })
  }
  for (const [slug, o] of oldMap) if (!newMap.has(slug)) removed.push({ slug, ...o })
  return { added, removed, changed }
}

const page = (slug) => `[\`${slug}\`](https://code.claude.com/docs/en/${slug})`
const out = []
let anyChange = false
const fresh = {}

out.push(`# 官方文档同步报告`, '', `生成时间：${new Date().toISOString()}（UTC）`, '')

for (const s of SOURCES) {
  let live
  try {
    live = s.local ? readFileSync(s.local, 'utf8') : await get(s.url)
  } catch (e) {
    console.error(`下载失败：${e.message}`)
    process.exit(2)
  }
  fresh[s.key] = live
  const snap = readFileSync(join(ROOT, s.snap), 'utf8')
  const d = diff(parse(snap, s.sectionLevel), parse(live, s.sectionLevel))
  const n = d.added.length + d.removed.length + d.changed.length
  if (n) anyChange = true
  out.push(`## ${s.label}（${s.url}）`, '', `新增 ${d.added.length} · 删除 ${d.removed.length} · 改动 ${d.changed.length}`, '')
  if (d.added.length) out.push('### 新增', '', ...d.added.map((e) => `- ${page(e.slug)} **${e.title}** — ${e.group}${e.desc ? `：${e.desc}` : ''}`), '')
  if (d.removed.length) out.push('### 删除', '', ...d.removed.map((e) => `- \`${e.slug}\` **${e.title}** — ${e.group}`), '')
  if (d.changed.length) out.push('### 改动', '', ...d.changed.map((e) => `- ${page(e.slug)} **${e.title}**\n${e.what.map((w) => `  - ${w}`).join('\n')}`), '')
}

if (flag('--deep')) {
  const hashFile = join(ROOT, 'data/page-hashes.json')
  const old = existsSync(hashFile) ? JSON.parse(readFileSync(hashFile, 'utf8')) : null
  const slugs = [...parse(fresh.en, 2).keys()]
  const hashes = {}
  const failed = []
  for (let i = 0; i < slugs.length; i += 8) {
    await Promise.all(slugs.slice(i, i + 8).map(async (slug) => {
      try { hashes[slug] = createHash('sha256').update(await get(`https://code.claude.com/docs/en/${slug}.md`)).digest('hex') }
      catch { failed.push(slug) }
    }))
  }
  out.push('## 正文变化（--deep）', '')
  if (!old) {
    out.push(`首次运行：已计算 ${Object.keys(hashes).length} 页的基线，运行 \`--deep --update\` 保存到 data/page-hashes.json。`, '')
  } else {
    const bodyChanged = Object.keys(hashes).filter((s) => old[s] && old[s] !== hashes[s]).sort()
    if (bodyChanged.length) anyChange = true
    out.push(bodyChanged.length ? `正文有变化的页面（${bodyChanged.length}）：` : '没有页面正文变化。', '', ...bodyChanged.map((s) => `- ${page(s)}`), '')
  }
  if (failed.length) out.push(`下载失败（未比较）：${failed.map((s) => `\`${s}\``).join('、')}`, '')
  if (flag('--update')) writeFileSync(hashFile, JSON.stringify(Object.fromEntries(Object.entries(hashes).sort()), null, 2) + '\n')
}

if (!anyChange) out.push('**没有变化。**', '')
else out.push('## 处理建议', '', '1. 对照上面的页面，检查 A 路线引用了它们的章节（B 路线各分区页的“A 路线”一栏）。', '2. 运行 `npm run sync:docs -- --update` 更新快照，再 `npm run gen:track-b` 重新生成 B 路线。', '3. 在 docs/changelog.md 记一笔，关闭本 issue。', '')

const report = out.join('\n')
writeFileSync(join(ROOT, 'data/sync-report.md'), report)
console.log(report)

if (flag('--update')) {
  for (const s of SOURCES) writeFileSync(join(ROOT, s.snap), fresh[s.key])
  console.log('已用线上版本更新快照。接着运行：npm run gen:track-b')
}
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `changed=${anyChange}\n`)
