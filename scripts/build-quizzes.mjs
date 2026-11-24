#!/usr/bin/env node
/**
 * 合并 quizzes/NN-*.json → quizzes/all.json，并做格式校验。
 *
 * 每道题的格式（与各章 <Quiz> 组件读取的一致）：
 *   { id, chapter, question, options: string[], answer: number, explanation, source_url }
 *   answer 是 **0 起始** 的选项下标。
 *
 * all.json 是按章节顺序拼接的扁平数组，方便直接导入刷题应用。
 * 用法：npm run gen:quizzes        （校验失败时退出码为 1，不写文件）
 *       node scripts/build-quizzes.mjs --check   （只校验）
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'quizzes')
const files = readdirSync(DIR).filter((f) => /^\d\d-.+\.json$/.test(f)).sort()

const errors = []
const ids = new Set()
const all = []

for (const f of files) {
  let list
  try { list = JSON.parse(readFileSync(join(DIR, f), 'utf8')) } catch (e) { errors.push(`${f}: JSON 解析失败：${e.message}`); continue }
  if (!Array.isArray(list)) { errors.push(`${f}: 顶层必须是数组`); continue }
  list.forEach((q, i) => {
    const at = `${f}#${i + 1}${q?.id ? ` (${q.id})` : ''}`
    for (const k of ['id', 'chapter', 'question', 'explanation', 'source_url']) {
      if (typeof q[k] !== 'string' || !q[k].trim()) errors.push(`${at}: 缺少或为空：${k}`)
    }
    if (!Array.isArray(q.options) || q.options.length < 2 || q.options.some((o) => typeof o !== 'string' || !o.trim())) {
      errors.push(`${at}: options 至少 2 个非空字符串`)
    } else {
      if (new Set(q.options).size !== q.options.length) errors.push(`${at}: options 有重复`)
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) errors.push(`${at}: answer 必须是 0..${q.options.length - 1} 的整数`)
    }
    if (q.source_url && !/^https:\/\//.test(q.source_url)) errors.push(`${at}: source_url 必须是 https 链接`)
    if (q.id) { if (ids.has(q.id)) errors.push(`${at}: id 重复`); ids.add(q.id) }
    all.push(q)
  })
}

if (errors.length) {
  console.error(`题库校验失败（${errors.length} 处）：\n- ${errors.join('\n- ')}`)
  process.exit(1)
}

if (!process.argv.includes('--check')) {
  writeFileSync(join(DIR, 'all.json'), JSON.stringify(all, null, 2) + '\n')
}
const perChapter = files.map((f) => `${f.slice(0, 2)}:${JSON.parse(readFileSync(join(DIR, f), 'utf8')).length}`).join(' ')
console.log(`quizzes: ${all.length} 题，${files.length} 章（${perChapter}）${process.argv.includes('--check') ? '，校验通过' : ' → quizzes/all.json'}`)
