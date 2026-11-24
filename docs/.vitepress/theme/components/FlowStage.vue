<script setup lang="ts">
/**
 * FlowStage：StepPlayer 的标准舞台。
 * - chain：横向一条链（手机上自动变竖向），节点之间是粗实线箭头
 * - stack：竖向分层堆叠（用于“加载层级”这类题材）
 * 每步传入 show（≤4 个节点 id，按顺序）和 focus（唯一高亮的节点 id，或 'loop'）。
 */
import { computed } from 'vue'

export type Role = 'you' | 'claude' | 'harness' | 'pass' | 'block'
export interface FlowNode { label: string; tag?: string; role: Role }

const props = withDefaults(defineProps<{
  nodes: Record<string, FlowNode>
  show: string[]
  focus?: string
  layout?: 'chain' | 'stack'
  /** 回环箭头（例如 Agent 循环“没通过就再来一轮”） */
  loop?: { label: string; visible: boolean }
  /** 给某个节点打上结果标记 */
  marks?: Record<string, 'pass' | 'block'>
}>(), { layout: 'chain', marks: () => ({}) })

const items = computed(() => props.show.slice(0, 4).map((id) => ({ id, ...props.nodes[id] })))
// 节点与箭头拍平成一个序列；指向高亮节点的那根箭头是“活动”的
const seq = computed(() => {
  const out: any[] = []
  items.value.forEach((n, i) => {
    if (i > 0) out.push({ kind: 'arrow', key: items.value[i - 1].id + '>' + n.id, active: n.id === props.focus })
    out.push({ kind: 'node', key: n.id, ...n })
  })
  return out
})
</script>

<template>
  <div class="fs" :class="'fs--' + layout">
    <TransitionGroup name="fs" tag="div" class="fs-row">
      <div v-for="it in seq" :key="it.key"
        :class="it.kind === 'node'
          ? ['fs-node', 'r-' + it.role, { focus: it.id === focus, dim: focus && it.id !== focus }]
          : ['fs-arrow', { active: it.active, dim: focus && !it.active }]"
        :aria-hidden="it.kind === 'arrow' ? 'true' : undefined">
        <template v-if="it.kind === 'node'">
          <span class="fs-label">{{ it.label }}</span>
          <code v-if="it.tag" class="fs-tag">{{ it.tag }}</code>
          <span v-if="marks[it.id]" class="fs-mark" :class="'m-' + marks[it.id]">{{ marks[it.id] === 'pass' ? '✓' : '✕' }}</span>
        </template>
        <template v-else><span class="fs-shaft" /><span class="fs-head" /></template>
      </div>
    </TransitionGroup>
    <div v-if="loop && loop.visible" class="fs-loop" :class="{ focus: focus === 'loop', dim: focus && focus !== 'loop' }">
      <span class="fs-loop-line" /><span class="fs-loop-text">↺ {{ loop.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.fs { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 18px; }
.fs-row { display: flex; align-items: center; justify-content: center; gap: 0; flex-wrap: nowrap; width: 100%; }
.fs--stack .fs-row { flex-direction: column; }
.fs-node {
  position: relative; flex: 1 1 0; min-width: 0; max-width: 175px; padding: 14px 10px; border-radius: 12px;
  border: 2.5px solid var(--role); background: var(--vp-c-bg); text-align: center;
  display: flex; flex-direction: column; gap: 6px; align-items: center;
  transition: opacity .35s ease, transform .35s ease, box-shadow .35s ease;
}
.fs--stack .fs-node { flex: none; width: min(440px, 94%); max-width: 460px; }
.fs-node.focus { transform: scale(1.06); box-shadow: 0 6px 22px -6px var(--role); background: color-mix(in srgb, var(--role) 10%, var(--vp-c-bg)); }
.fs-node.dim { opacity: .32; }
.fs-label { font-size: 15.5px; word-break: break-word; font-weight: 600; line-height: 1.35; color: var(--vp-c-text-1); }
.fs-tag { font-size: 11.5px; word-break: break-word; line-height: 1.4; color: var(--vp-c-text-2); background: transparent; }
.fs-mark { position: absolute; top: -12px; right: -12px; width: 26px; height: 26px; border-radius: 50%; color: #fff; font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: 15px; }
.m-pass { background: var(--cc-pass); } .m-block { background: var(--cc-block); }
.r-you { --role: var(--cc-you); } .r-claude { --role: var(--cc-claude); } .r-harness { --role: var(--cc-harness); }
.r-pass { --role: var(--cc-pass); } .r-block { --role: var(--cc-block); }

.fs-arrow { position: relative; display: flex; align-items: center; width: 40px; height: 24px; flex: none; transition: opacity .35s; }
.fs-arrow.dim { opacity: .3; }
.fs-shaft { flex: 1; height: 5px; border-radius: 3px; background: var(--vp-c-text-3); position: relative; overflow: hidden; }
.fs-head { width: 0; height: 0; border-top: 9px solid transparent; border-bottom: 9px solid transparent; border-left: 13px solid var(--vp-c-text-3); }
.fs-arrow.active .fs-shaft { background: var(--cc-claude); }
.fs-arrow.active .fs-head { border-left-color: var(--cc-claude); }
.fs-arrow.active .fs-shaft::after {
  content: ''; position: absolute; inset: 0; width: 40%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.85), transparent);
  animation: fs-flow 1.1s linear infinite;
}
@keyframes fs-flow { from { transform: translateX(-100%); } to { transform: translateX(260%); } }

.fs--stack .fs-arrow, .fs-row .fs-arrow { }
.fs--stack .fs-arrow { width: 24px; height: 34px; flex-direction: column; }
.fs--stack .fs-shaft { width: 5px; height: auto; flex: 1; }
.fs--stack .fs-head { border-left: 9px solid transparent; border-right: 9px solid transparent; border-top: 13px solid var(--vp-c-text-3); border-bottom: 0; }
.fs--stack .fs-arrow.active .fs-head { border-top-color: var(--cc-claude); border-left-color: transparent; }

.fs-loop { display: flex; flex-direction: column; align-items: center; gap: 6px; transition: opacity .35s; }
.fs-loop.dim { opacity: .3; }
.fs-loop-line { width: min(460px, 80%); height: 5px; border-radius: 3px; background: var(--vp-c-text-3); }
.fs-loop.focus .fs-loop-line { background: var(--cc-claude); }
.fs-loop-text { font-size: 14px; font-weight: 600; color: var(--vp-c-text-2); }
.fs-loop.focus .fs-loop-text { color: var(--cc-claude); }

.fs-enter-active, .fs-leave-active { transition: opacity .35s ease, transform .35s ease; }
.fs-enter-from, .fs-leave-to { opacity: 0; transform: translateY(10px); }
.fs-leave-active { position: absolute; }

@media (max-width: 640px) {
  .fs--chain .fs-row { flex-direction: column; }
  .fs--chain .fs-node { flex: none; width: min(300px, 90%); max-width: 300px; }
  .fs--chain .fs-arrow { width: 24px; height: 30px; flex-direction: column; }
  .fs--chain .fs-shaft { width: 5px; height: auto; flex: 1; }
  .fs--chain .fs-head { border-left: 9px solid transparent; border-right: 9px solid transparent; border-top: 13px solid var(--vp-c-text-3); border-bottom: 0; }
  .fs--chain .fs-arrow.active .fs-head { border-top-color: var(--cc-claude); border-left-color: transparent; }
}
@media (prefers-reduced-motion: reduce) {
  .fs-node, .fs-arrow, .fs-loop { transition: none; }
  .fs-node.focus { transform: none; }
  .fs-arrow.active .fs-shaft::after { animation: none; display: none; }
  .fs-enter-active, .fs-leave-active { transition: none; }
}
</style>
