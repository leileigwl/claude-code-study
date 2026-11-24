<script setup lang="ts">
// 依据：sub-agents.md「Run parallel research」「What loads at startup」「Concurrent subagent limit」「Let subagents spawn their own subagents」
const steps = [
  { phase: 0, focus: 'main', narration: '你在主对话里说：“用三个子代理并行调研认证、数据库和 API 模块”。',
    detail: '官方示例原句：“Research the authentication, database, and API modules in parallel using separate subagents”。' },
  { phase: 1, focus: 'kids', narration: '主对话派出三个子代理。每个都从一个全新的、独立的上下文窗口开始。',
    detail: '非 fork 子代理的初始上下文：它自己的系统提示 + Claude 写的任务说明 + CLAUDE.md 各层 + git status 快照 + 预加载的 skills。它看不到你的对话历史、已读过的文件，也不加载主对话的 auto memory。' },
  { phase: 2, focus: 'kids', narration: '三个子代理同时干活，大量读取和日志都留在它们各自的窗口里。',
    detail: '子代理默认在后台运行，你可以继续在主对话里工作。它们也各自消耗 tokens，计入同一份用量。' },
  { phase: 3, focus: 'summaries', narration: '每个子代理干完，只把一份摘要交回主对话。',
    detail: '“the subagent does that work in its own context and returns only the summary.” 官方提醒：很多子代理都返回很长的结果，同样会塞满主窗口——要求它们“只回简短摘要”。' },
  { phase: 4, focus: 'merge', narration: '主对话把三份摘要合起来，再回答你。',
    detail: '“Each subagent explores its area independently, then Claude synthesizes the findings.”' },
  { phase: 4, focus: 'limits', narration: '边界：同时最多 20 个子代理；子代理还能再派子代理，默认最多往下 3 层。',
    detail: '并发上限 20（<code>CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS</code> 可改）；嵌套深度默认 3 层（<code>CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH</code>，设 1 关闭嵌套）。Explore 与 Plan 两个内置子代理启动时不加载 CLAUDE.md 和 git status。' }
]
const kids = [
  { name: '子代理 A', area: '认证模块' },
  { name: '子代理 B', area: '数据库模块' },
  { name: '子代理 C', area: 'API 模块' }
]
</script>

<template>
  <StepPlayer title="子代理：并行干活，只把摘要带回来" :steps="steps" source="https://code.claude.com/docs/en/sub-agents.md" :legend="['you','claude','pass']">
    <template #default="{ step }">
      <div class="sa" :class="'ph-' + steps[step].phase">
        <div class="sa-main" :class="{ focus: ['main','merge'].includes(steps[step].focus), dim: !['main','merge'].includes(steps[step].focus) && steps[step].focus !== 'limits' }">
          <span class="sa-l">{{ steps[step].phase >= 4 ? '主对话：汇总三份摘要' : '主对话（你 + Claude）' }}</span>
        </div>
        <div v-if="steps[step].phase >= 1" class="sa-kids">
          <div v-for="(k, i) in kids" :key="k.name" class="sa-col">
            <div class="sa-arrow" :class="{ up: steps[step].phase >= 3, active: ['kids','summaries'].includes(steps[step].focus) }"><span /></div>
            <div class="sa-kid" :class="{ focus: steps[step].focus === 'kids', dim: !['kids','limits'].includes(steps[step].focus) }">
              <b>{{ k.name }}</b><small>{{ k.area }}</small>
              <div v-if="steps[step].phase === 2" class="sa-work" aria-hidden="true"><i /><i /><i /></div>
              <div v-if="steps[step].phase >= 3" class="sa-sum" :class="{ focus: steps[step].focus === 'summaries' }">摘要 ✓</div>
            </div>
          </div>
        </div>
        <div v-if="steps[step].focus === 'limits'" class="sa-limits">
          <span>并发上限 <b>20</b></span><span>嵌套深度 <b>3</b> 层</span>
        </div>
      </div>
    </template>
  </StepPlayer>
</template>

<style scoped>
.sa { width: 100%; max-width: 640px; display: flex; flex-direction: column; align-items: center; gap: 0; }
.sa-main, .sa-kid { border: 2.5px solid var(--cc-claude); border-radius: 12px; background: var(--vp-c-bg); text-align: center; transition: opacity .35s, transform .35s, box-shadow .35s; }
.sa-main { padding: 14px 22px; border-color: var(--cc-you); }
.sa-l { font-weight: 600; font-size: 16px; }
.focus { transform: scale(1.04); box-shadow: 0 6px 20px -8px var(--cc-claude); }
.dim { opacity: .32; }
.sa-kids { display: flex; gap: 16px; justify-content: center; width: 100%; }
.sa-col { display: flex; flex-direction: column; align-items: center; flex: 1; max-width: 180px; }
.sa-arrow { height: 36px; display: flex; justify-content: center; }
.sa-arrow span { width: 5px; height: 100%; border-radius: 3px; background: var(--vp-c-text-3); position: relative; }
.sa-arrow span::after { content: ''; position: absolute; left: 50%; transform: translateX(-50%); bottom: -4px; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 11px solid var(--vp-c-text-3); }
.sa-arrow.up span::after { bottom: auto; top: -4px; border-top: 0; border-bottom: 11px solid var(--vp-c-text-3); }
.sa-arrow.active span { background: var(--cc-claude); }
.sa-arrow.active span::after { border-top-color: var(--cc-claude); }
.sa-arrow.active.up span::after { border-top-color: transparent; border-bottom-color: var(--cc-pass); }
.sa-arrow.active.up span { background: var(--cc-pass); }
.sa-kid { width: 100%; padding: 12px 8px; display: flex; flex-direction: column; gap: 4px; }
.sa-kid small { color: var(--vp-c-text-2); }
.sa-work { display: flex; gap: 4px; justify-content: center; margin-top: 4px; }
.sa-work i { width: 7px; height: 7px; border-radius: 50%; background: var(--cc-claude); animation: sa-b 1s infinite ease-in-out; }
.sa-work i:nth-child(2) { animation-delay: .15s; } .sa-work i:nth-child(3) { animation-delay: .3s; }
@keyframes sa-b { 0%, 100% { opacity: .25; } 50% { opacity: 1; } }
.sa-sum { margin-top: 4px; font-size: 13px; font-weight: 600; color: var(--cc-pass); }
.sa-sum.focus { transform: none; box-shadow: none; }
.sa-limits { display: flex; gap: 18px; margin-top: 16px; font-size: 15px; padding: 8px 16px; border-radius: 10px; border: 2px solid var(--cc-harness); }
.sa-limits b { color: var(--cc-claude); font-size: 18px; }
@media (max-width: 640px) { .sa-kids { gap: 8px; } .sa-kid b { font-size: 14px; } }
@media (prefers-reduced-motion: reduce) { .sa-main, .sa-kid { transition: none; } .focus { transform: none; } .sa-work i { animation: none; opacity: 1; } }
</style>
