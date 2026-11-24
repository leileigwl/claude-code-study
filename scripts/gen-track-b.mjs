#!/usr/bin/env node
/**
 * 生成 B 路线（官方文档精读）页面：docs/track-b/*.md
 *
 * 输入
 *   data/llms-snapshot.txt        官方英文索引 https://code.claude.com/docs/llms.txt 的快照（导航结构 + 英文摘要）
 *   data/llms-zh-cn-snapshot.txt  官方简体中文索引 https://code.claude.com/docs/_llms/zh-cn.txt 的快照（中文标题 + 中文摘要）
 *   docs/track-a/*.md             A 路线各章：「## 原文链接」里列出的页面 = 已精读；正文里提到的 = 相关
 *
 * 输出
 *   docs/track-b/index.md 与每个官方分区一页（slug 见 SECTIONS）。文件是生成的，不要手改：改脚本或快照后重跑
 *   `npm run gen:track-b`。
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const EN = readFileSync(join(ROOT, 'data/llms-snapshot.txt'), 'utf8')
const ZH = readFileSync(join(ROOT, 'data/llms-zh-cn-snapshot.txt'), 'utf8')
const OUT = join(ROOT, 'docs/track-b')

// 官方顶层分区（英文 llms.txt 的 “## ” 标题）→ 页面 slug 与中文名（中文名取官方简体中文导航）
const label = (zh, en) => (zh === en ? en : `${zh} · ${en}`)
const SECTIONS = {
  'Getting started': { slug: 'getting-started', zh: '快速入门' },
  'Build with Claude Code': { slug: 'build', zh: '使用 Claude Code 构建' },
  Plugins: { slug: 'plugins', zh: '插件' },
  Administration: { slug: 'administration', zh: '管理' },
  Configuration: { slug: 'configuration', zh: '配置' },
  Reference: { slug: 'reference', zh: '参考' },
  'Agent SDK': { slug: 'agent-sdk', zh: 'Agent SDK' },
  Resources: { slug: 'resources', zh: '资源' }
}

const ENTRY = /^- \[(.+?)\]\(https:\/\/code\.claude\.com\/docs\/(?:en|zh-CN)\/(.+?)\.md\)(?::\s*(.*))?$/

/** 解析一个 llms 索引：返回按出现顺序的条目，每条带标题路径 */
function parse(text, { sectionLevel }) {
  const items = []
  const path = {}
  let section = null
  for (const line of text.split('\n')) {
    const h = /^(#{2,6}) (.+)$/.exec(line)
    if (h) {
      const level = h[1].length
      if (level === sectionLevel) section = h[2].trim()
      path[level] = h[2].trim()
      for (const k of Object.keys(path)) if (Number(k) > level) delete path[k]
      continue
    }
    const m = ENTRY.exec(line)
    if (m) items.push({ title: m[1], slug: m[2], desc: (m[3] || '').trim(), section, path: { ...path } })
  }
  return items
}

const en = parse(EN, { sectionLevel: 2 }).filter((i) => SECTIONS[i.section])
const zh = new Map(parse(ZH, { sectionLevel: 3 }).map((i) => [i.slug, i]))

// 英文分组标题（#### / #####）→ 中文分组标题（#### / #####，中文索引少一层 “### tab”）
const groupZh = {}
for (const e of en) {
  const z = zh.get(e.slug)
  if (!z) continue
  if (e.path[4] && z.path[4]) groupZh[`${e.section}|4|${e.path[4]}`] ??= z.path[4]
  if (e.path[5] && z.path[5]) groupZh[`${e.section}|5|${e.path[5]}`] ??= z.path[5]
}

// A 路线覆盖情况
const chapters = readdirSync(join(ROOT, 'docs/track-a'))
  .filter((f) => /^\d\d-.+\.md$/.test(f))
  .sort()
  .map((f) => {
    const text = readFileSync(join(ROOT, 'docs/track-a', f), 'utf8')
    const num = Number(f.slice(0, 2))
    const title = (/^title:\s*(.+)$/m.exec(text) || [])[1] || f
    const cut = text.indexOf('## 原文链接')
    const slugsIn = (s) => new Set([...s.matchAll(/code\.claude\.com\/docs\/en\/([a-z0-9/_-]+?)(?:\.md)?(?=[#)>\s>、，]|$)/g)].map((m) => m[1]))
    return {
      num, title, link: `/track-a/${f.replace(/\.md$/, '')}`,
      deep: cut >= 0 ? slugsIn(text.slice(cut)) : new Set(),
      mentioned: slugsIn(cut >= 0 ? text.slice(0, cut) : text)
    }
  })

function coverage(slug) {
  const deep = chapters.filter((c) => c.deep.has(slug))
  const related = chapters.filter((c) => !c.deep.has(slug) && c.mentioned.has(slug))
  return { deep, related }
}

// Markdown 表格单元格转义（摘要里可能有 | < > {{ }}；整页另外包在 ::: v-pre 里）
const cell = (s) => String(s || '').replace(/\|/g, '\\|').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, ' ')

const stats = { total: 0, deep: 0, related: 0, zhMissing: 0 }
const perSection = {}

function renderSection(name) {
  const meta = SECTIONS[name]
  const items = en.filter((e) => e.section === name)
  const lines = []
  let lastG4 = null, lastG5 = null
  let counts = { total: 0, deep: 0 }
  const table = () => { lines.push('', '| 页面 | 中文概要 | A 路线 | 状态 |', '| :- | :- | :- | :- |') }
  for (const e of items) {
    const g4 = e.path[4] || e.path[3] || name
    const g5 = e.path[5] || null
    if (g4 !== lastG4) {
      const z = groupZh[`${name}|4|${g4}`] || (!e.path[4] && zh.get(e.slug)?.path[4]) || null
      lines.push('', `## ${z && z !== g4 ? `${z} · ${g4}` : g4}`)
      lastG4 = g4; lastG5 = null
      if (!g5) table()
    }
    if (g5 !== lastG5) {
      if (g5) {
        const z = groupZh[`${name}|5|${g5}`]
        lines.push('', `### ${z && z !== g5 ? `${z} · ${g5}` : g5}`)
        table()
      } else table()
      lastG5 = g5
    }
    const z = zh.get(e.slug)
    if (!z) stats.zhMissing++
    const summary = z?.desc ? cell(z.desc) : e.desc ? `${cell(e.desc)}（官方暂无中文摘要，此为英文原文）` : '—'
    const { deep, related } = coverage(e.slug)
    const chap = [
      ...deep.map((c) => `[A${c.num}](${c.link})`),
      ...related.map((c) => `[A${c.num}](${c.link})（提及）`)
    ].join(' ') || '—'
    const status = deep.length ? '<span class="status-tag st-deep">已精读</span>' : '<span class="status-tag st-brief">概要</span>'
    const name2 = z?.title && z.title !== e.title ? `**${cell(z.title)}**<br>${cell(e.title)}` : `**${cell(e.title)}**`
    const links = `${name2}<br>[原文](https://code.claude.com/docs/en/${e.slug})${z ? ` · [中文版](https://code.claude.com/docs/zh-CN/${e.slug})` : ''}`
    lines.push(`| ${links} | ${summary} | ${chap} | ${status} |`)
    counts.total++; stats.total++
    if (deep.length) { counts.deep++; stats.deep++ } else if (related.length) stats.related++
  }
  perSection[name] = counts
  const head = [
    '---',
    `title: ${label(meta.zh, name)}`,
    'outline: [2, 3]',
    'editLink: false',
    'pageClass: track-b-page',
    '---',
    '',
    '<!-- 本页由 scripts/gen-track-b.mjs 根据 data/llms-snapshot.txt 与 data/llms-zh-cn-snapshot.txt 生成，请勿手改。 -->',
    '',
    `# ${label(meta.zh, name)}`,
    '',
    `官方文档“${name}”分区，共 **${counts.total}** 页，其中 **${counts.deep}** 页在 A 路线里对照原文精读过。顺序与分组跟随官方导航；中文概要取自官方简体中文索引。`,
    '',
    '- <span class="status-tag st-deep">已精读</span>：A 路线某一章把它列为“原文链接”，逐条核对过',
    '- <span class="status-tag st-brief">概要</span>：只有官方摘要；“A 路线”一栏写“（提及）”表示章节正文引用过它',
    '',
    '::: v-pre'
  ]
  return [...head, ...lines, '', ':::', ''].join('\n')
}

mkdirSync(OUT, { recursive: true })
for (const name of Object.keys(SECTIONS)) {
  writeFileSync(join(OUT, `${SECTIONS[name].slug}.md`), renderSection(name))
}

// 总览页
const snapLine = (EN.match(/^# .+$/m) || [''])[0]
const rows = Object.keys(SECTIONS).map((n) => {
  const c = perSection[n]
  return `| [${label(SECTIONS[n].zh, n)}](./${SECTIONS[n].slug}) | ${c.total} | ${c.deep} |`
})
const chapRows = chapters.map((c) => `| [${c.title}](${c.link}) | ${[...c.deep].filter((s) => en.some((e) => e.slug === s)).map((s) => `\`${s}\``).join(' ')} |`)
const index = `---
title: B · 官方文档精读
outline: [2, 3]
editLink: false
---

<!-- 本页由 scripts/gen-track-b.mjs 生成，请勿手改。 -->

# B · 官方文档精读：按官方导航的全量索引

<div class="one-liner">

**一句话讲明白**：这里按官方导航列出 Claude Code 文档的**全部 ${stats.total} 页**。每页给出官方中文概要、原文与中文版链接、A 路线哪一章讲过它，以及精读状态。要找某个设置键、hook 事件或命令的出处，从这里点进官方原文。

</div>

## 精读进度

| 分区 | 页数 | 已精读 |
| :- | -: | -: |
${rows.join('\n')}
| **合计** | **${stats.total}** | **${stats.deep}** |

另有 ${stats.related} 页在 A 路线正文中被引用（标“提及”）。${stats.zhMissing ? `${stats.zhMissing} 页在官方中文索引里没有对应条目，概要用英文原文。` : '每一页在官方中文索引里都有对应条目。'}

## A 路线各章精读了哪些官方页

| 章 | 官方页面（slug） |
| :- | :- |
${chapRows.join('\n')}

## 数据来源与更新

- 结构与英文摘要：[\`llms.txt\`](https://code.claude.com/docs/llms.txt)（快照 \`data/llms-snapshot.txt\`，${snapLine.replace(/^# /, '')}）
- 中文标题与概要：官方简体中文索引 [\`_llms/zh-cn.txt\`](https://code.claude.com/docs/_llms/zh-cn.txt)（快照 \`data/llms-zh-cn-snapshot.txt\`）
- 每周一由 GitHub Actions 运行 \`scripts/sync-docs.mjs\` 比对线上索引；有新增、删除或摘要改动时自动开 issue。更新快照后运行 \`npm run gen:track-b\` 重新生成本目录。
- 状态的判定是机械的：某章「原文链接」一节列出了该页 → 已精读。
`
writeFileSync(join(OUT, 'index.md'), index)
console.log(`track-b: ${stats.total} pages, ${stats.deep} deep-read, ${stats.related} mentioned, ${stats.zhMissing} without zh entry`)
