<script setup lang="ts">
/**
 * StepPlayer：所有动画共用的一个播放器。
 * 设计约束（见 PROGRESS.md / CLAUDE.md）：
 *  - 一个动画只讲一件事；每步最多 3–4 个节点；每步只高亮一个元素
 *  - 大号步骤指示“第 n / N 步”；舞台正下方只有一行旁白，与步骤同步
 *  - 技术细节放进折叠的“细节”
 *  - 颜色含义固定：蓝=你，橙=Claude，灰=Claude Code 程序，绿=通过，红=拦截
 *  - 尊重 prefers-reduced-motion
 */
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

export interface PlayerStep {
  /** 一行旁白：大白话 */
  narration: string
  /** 折叠“细节”里的技术说明（可含少量英文原文） */
  detail?: string
}

const props = withDefaults(defineProps<{
  title: string
  steps: PlayerStep[]
  /** 自动播放间隔（毫秒） */
  interval?: number
  /** 图例里要显示哪些颜色 */
  legend?: Array<'you' | 'claude' | 'harness' | 'pass' | 'block'>
  source?: string
}>(), {
  interval: 3600,
  legend: () => ['you', 'claude', 'harness', 'pass', 'block']
})

const legendText: Record<string, string> = {
  you: '你',
  claude: 'Claude（模型，会判断）',
  harness: 'Claude Code 程序（硬规则）',
  pass: '通过 / 放行',
  block: '拦截 / 阻止'
}

const current = ref(0)
const playing = ref(false)
const reduced = ref(false)
let timer: number | undefined

const total = computed(() => props.steps.length)
const step = computed(() => props.steps[current.value])

function go(i: number) {
  current.value = Math.max(0, Math.min(total.value - 1, i))
}
function next() {
  if (current.value < total.value - 1) current.value++
  else stop()
}
function prev() { go(current.value - 1) }
function stop() {
  playing.value = false
  if (timer) { window.clearInterval(timer); timer = undefined }
}
function toggle() {
  if (playing.value) return stop()
  if (current.value >= total.value - 1) current.value = 0
  playing.value = true
  timer = window.setInterval(next, reduced.value ? Math.max(props.interval, 5000) : props.interval)
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') { stop(); next(); e.preventDefault() }
  if (e.key === 'ArrowLeft') { stop(); prev(); e.preventDefault() }
  if (e.key === ' ') { toggle(); e.preventDefault() }
}

onMounted(() => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduced.value = mq.matches
  mq.addEventListener?.('change', (ev) => { reduced.value = ev.matches })
})
onUnmounted(stop)
watch(() => props.steps, () => go(0))
</script>

<template>
  <figure class="sp" :class="{ 'sp--reduced': reduced }" tabindex="0" @keydown="onKey" :aria-label="title + ' 分步动画'">
    <figcaption class="sp-head">
      <span class="sp-title">{{ title }}</span>
      <span class="sp-count" aria-live="polite">第 <b>{{ current + 1 }}</b> / {{ total }} 步</span>
    </figcaption>

    <div class="sp-dots" role="tablist" aria-label="跳到某一步">
      <button v-for="(_, i) in steps" :key="i" class="sp-dot"
        :class="{ on: i === current, done: i < current }"
        :aria-label="'第 ' + (i + 1) + ' 步'" :aria-selected="i === current" role="tab"
        @click="stop(); go(i)" />
    </div>

    <div class="sp-stage">
      <slot :step="current" />
    </div>

    <p class="sp-narration" aria-live="polite">{{ step.narration }}</p>

    <details v-if="step.detail" class="sp-detail" :key="current">
      <summary>细节</summary>
      <div class="sp-detail-body" v-html="step.detail" />
    </details>

    <div class="sp-controls">
      <button class="sp-btn" :disabled="current === 0" @click="stop(); prev()">← 上一步</button>
      <button class="sp-btn sp-btn--main" @click="toggle">{{ playing ? '⏸ 暂停' : '▶ 自动播放' }}</button>
      <button class="sp-btn" :disabled="current === total - 1" @click="stop(); next()">下一步 →</button>
    </div>

    <div class="sp-legend">
      <span v-for="k in legend" :key="k" class="sp-leg"><i :class="'c-' + k" />{{ legendText[k] }}</span>
    </div>
    <div v-if="source" class="sp-source">依据：<a :href="source" target="_blank" rel="noreferrer">{{ source.replace('https://code.claude.com/docs/en/', '') }}</a></div>
  </figure>
</template>

<style scoped>
.sp {
  margin: 28px 0;
  padding: 22px 22px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  outline: none;
}
.sp:focus-visible { box-shadow: 0 0 0 2px var(--vp-c-brand-1); }
.sp-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; }
.sp-title { font-weight: 600; font-size: 15px; color: var(--vp-c-text-2); }
.sp-count { font-size: 20px; font-weight: 600; color: var(--vp-c-text-1); letter-spacing: .5px; }
.sp-count b { color: var(--cc-claude); font-size: 26px; }
.sp-dots { display: flex; gap: 8px; margin: 12px 0 4px; }
.sp-dot { width: 10px; height: 10px; border-radius: 50%; border: 0; padding: 0; background: var(--vp-c-divider); cursor: pointer; transition: transform .2s, background .2s; }
.sp-dot.done { background: var(--vp-c-text-3); }
.sp-dot.on { background: var(--cc-claude); transform: scale(1.35); }
.sp-stage { min-height: 190px; display: flex; align-items: center; justify-content: center; padding: 26px 4px; }
.sp-narration {
  margin: 0; padding: 14px 4px 4px; border-top: 1px dashed var(--vp-c-divider);
  font-size: 17px; line-height: 1.7; color: var(--vp-c-text-1); text-align: center; min-height: 3.4em;
}
.sp-detail { margin: 10px auto 0; max-width: 680px; font-size: 14px; color: var(--vp-c-text-2); }
.sp-detail summary { cursor: pointer; color: var(--vp-c-brand-1); font-size: 13px; text-align: center; list-style: none; }
.sp-detail summary::-webkit-details-marker { display: none; }
.sp-detail summary::before { content: '▸ '; }
.sp-detail[open] summary::before { content: '▾ '; }
.sp-detail-body { margin-top: 8px; padding: 10px 14px; border-radius: 8px; background: var(--vp-c-bg); line-height: 1.7; }
.sp-detail-body :deep(code) { font-size: 12.5px; }
.sp-controls { display: flex; justify-content: center; gap: 10px; margin-top: 16px; flex-wrap: wrap; }
.sp-btn { padding: 7px 16px; border-radius: 8px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); color: var(--vp-c-text-1); font-size: 14px; cursor: pointer; }
.sp-btn:hover:not(:disabled) { border-color: var(--cc-claude); }
.sp-btn:disabled { opacity: .4; cursor: not-allowed; }
.sp-btn--main { background: var(--cc-claude); border-color: var(--cc-claude); color: #fff; }
.sp-legend { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 16px; margin-top: 14px; font-size: 12.5px; color: var(--vp-c-text-2); }
.sp-leg { display: inline-flex; align-items: center; gap: 6px; }
.sp-leg i { width: 12px; height: 12px; border-radius: 3px; display: inline-block; }
.c-you { background: var(--cc-you); } .c-claude { background: var(--cc-claude); } .c-harness { background: var(--cc-harness); }
.c-pass { background: var(--cc-pass); } .c-block { background: var(--cc-block); }
.sp-source { margin-top: 8px; text-align: center; font-size: 12px; color: var(--vp-c-text-3); }
@media (max-width: 640px) {
  .sp { padding: 16px 12px 12px; }
  .sp-count { font-size: 17px; } .sp-count b { font-size: 22px; }
  .sp-narration { font-size: 16px; }
  .sp-stage { padding: 18px 0; }
}
</style>
