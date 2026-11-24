<script setup lang="ts">
/** 自测题：数据来自仓库根目录 quizzes/*.json（与“知行快刷”导入用的是同一份文件）。answer 为 0 起始的选项下标。 */
import { reactive } from 'vue'

interface Q { id?: string; question: string; options: string[]; answer: number; explanation: string; source_url: string }
const props = defineProps<{ data: Q[] }>()
const picked = reactive<Record<number, number | undefined>>({})
const letters = 'ABCDEFGH'
function pick(qi: number, oi: number) { if (picked[qi] === undefined) picked[qi] = oi }
function reset() { Object.keys(picked).forEach((k) => delete picked[Number(k)]) }
const score = () => props.data.filter((q, i) => picked[i] === q.answer).length
const answered = () => Object.keys(picked).length
</script>

<template>
  <div class="qz">
    <div v-for="(q, qi) in data" :key="qi" class="qz-q">
      <p class="qz-stem"><b>{{ qi + 1 }}.</b> {{ q.question }}</p>
      <ul class="qz-opts">
        <li v-for="(o, oi) in q.options" :key="oi">
          <button class="qz-opt" :disabled="picked[qi] !== undefined"
            :class="{ right: picked[qi] !== undefined && oi === q.answer, wrong: picked[qi] === oi && oi !== q.answer }"
            @click="pick(qi, oi)"><span class="qz-l">{{ letters[oi] }}</span>{{ o }}</button>
        </li>
      </ul>
      <div v-if="picked[qi] !== undefined" class="qz-exp">
        <b>{{ picked[qi] === q.answer ? '✓ 正确' : '✕ 正确答案是 ' + letters[q.answer] }}</b> · {{ q.explanation }}
        <a :href="q.source_url" target="_blank" rel="noreferrer">原文</a>
      </div>
    </div>
    <div class="qz-foot">已答 {{ answered() }} / {{ data.length }}，答对 {{ score() }} 题 <button class="qz-reset" @click="reset">重做</button></div>
  </div>
</template>

<style scoped>
.qz { margin: 16px 0; }
.qz-q { padding: 14px 0; border-bottom: 1px solid var(--vp-c-divider); }
.qz-stem { margin: 0 0 8px; font-weight: 500; }
.qz-opts { list-style: none; padding: 0; margin: 0; display: grid; gap: 6px; }
.qz-opts li { margin: 0; }
.qz-opt { width: 100%; text-align: left; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); color: var(--vp-c-text-1); cursor: pointer; font-size: 14.5px; line-height: 1.55; }
.qz-opt:hover:not(:disabled) { border-color: var(--cc-claude); }
.qz-opt:disabled { cursor: default; }
.qz-opt.right { border-color: var(--cc-pass); background: color-mix(in srgb, var(--cc-pass) 10%, var(--vp-c-bg)); }
.qz-opt.wrong { border-color: var(--cc-block); background: color-mix(in srgb, var(--cc-block) 10%, var(--vp-c-bg)); }
.qz-l { display: inline-block; width: 22px; font-weight: 600; color: var(--vp-c-text-2); }
.qz-exp { margin-top: 8px; font-size: 14px; color: var(--vp-c-text-2); line-height: 1.7; }
.qz-foot { margin-top: 12px; font-size: 14px; color: var(--vp-c-text-2); }
.qz-reset { margin-left: 8px; padding: 2px 10px; border-radius: 6px; border: 1px solid var(--vp-c-divider); background: transparent; color: var(--vp-c-text-2); cursor: pointer; }
</style>
