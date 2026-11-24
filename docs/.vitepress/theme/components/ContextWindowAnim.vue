<script setup lang="ts">
// 依据：context-window.md「Token counts for each step」示例表（官方说明：数字是示意值）
// 每一段都是官方表格中对应行的求和，见下方注释。
import { computed } from 'vue'

interface Seg { key: string; label: string; tokens: number; role: string }
const SCALE = 25000 // 示意刻度：0–25K（官方示例会话总量约 22K）

// 开机自动加载：4200+680+280+120+450+320+1800 = 7850
const startup: Seg = { key: 'startup', label: '开机自动加载', tokens: 7850, role: 'harness' }
const prompt: Seg = { key: 'prompt', label: '你的提示', tokens: 45, role: 'you' }
// 工作中：读 4 个文件 6900 + 规则 670 + 搜索 600 + 分析 800 + 编辑 1000 + hook 输出 220 + npm test 1200 + 总结 400 = 11790
const work: Seg = { key: 'work', label: '读文件 / 跑命令 / 编辑', tokens: 11790, role: 'claude' }
// 追问 + 子代理：40 + 80 + 420 + 1200 = 1740
const follow: Seg = { key: 'follow', label: '追问（子代理只回摘要）', tokens: 1740, role: 'claude' }
// 收尾：!git status 180 + /commit-push skill 620 = 800
const tail: Seg = { key: 'tail', label: 'git status + skill', tokens: 800, role: 'claude' }
// 压缩后：开机 7850 + 摘要 1725 + 重读 4 个文件 6900 + skill 正文 620 = 17095
const summary: Seg = { key: 'summary', label: '对话摘要', tokens: 1725, role: 'pass' }
const reread: Seg = { key: 'reread', label: '重新读回的文件', tokens: 6900, role: 'claude' }
const skillBody: Seg = { key: 'skill', label: 'skill 正文', tokens: 620, role: 'claude' }

const steps = [
  { segs: [startup], focus: 'startup', narration: '你还没打字，窗口里已经有东西了：系统提示、CLAUDE.md、记忆、工具名、skill 描述。',
    detail: '官方示例：System prompt 4,200 · Auto memory 680 · Environment info 280 · MCP tool names 120 · Skill descriptions 450 · ~/.claude/CLAUDE.md 320 · Project CLAUDE.md 1,800，合计 7,850。' },
  { segs: [startup, prompt], focus: 'prompt', narration: '你的提示本身很小。',
    detail: '官方示例中第一条提示只有 45 tokens。真正占地方的是 Claude 为了完成它读进来的东西。' },
  { segs: [startup, prompt, work], focus: 'work', narration: '干活最占空间：每读一个文件、每次命令输出、每次 hook 输出都留在窗口里。',
    detail: '读 4 个文件 6,900 + 按路径触发的 rules 670 + 搜索 600 + 分析 800 + 两次编辑 1,000 + Prettier hook 输出 220 + <code>npm test</code> 输出 1,200 + 总结 400 = 11,790。' },
  { segs: [startup, prompt, work, follow], focus: 'follow', sub: 9890, narration: '把调研交给子代理：大量读取留在它自己的窗口里，只有摘要回来。',
    detail: '子代理在自己的窗口里用了 9,890 tokens；主窗口只增加了 40（追问）+ 80（派活）+ 420（摘要）+ 1,200（Claude 回复）= 1,740。' },
  { segs: [startup, prompt, work, follow, tail], focus: 'tail', narration: '会话越长越满。这时早期在对话里说过的细节最容易被“挤掉”。',
    detail: '官方示例：<code>/compact</code> 前共 22,225 tokens。官方提醒：压缩时“detailed instructions from early in the conversation may be lost”。' },
  { segs: [startup, summary, reread, skillBody], focus: 'summary', narration: '压缩（/compact）：对话变成一份摘要，CLAUDE.md 等开机内容从磁盘重新注入。',
    detail: '压缩后 17,095 = 开机内容 7,850 + 摘要 1,725 + 重新读回的 4 个文件 6,900 + skill 正文 620。只在对话里说过、没写进 CLAUDE.md 的规则，此时只剩摘要里的转述。' }
]

const pct = (t: number) => (t / SCALE) * 100
function total(segs: Seg[]) { return segs.reduce((a, s) => a + s.tokens, 0) }
</script>

<template>
  <StepPlayer title="上下文窗口：一次会话如何被填满、再被压缩" :steps="steps" source="https://code.claude.com/docs/en/context-window.md" :legend="['you','claude','harness','pass']">
    <template #default="{ step }">
      <div class="cw">
        <div class="cw-bar" role="img" :aria-label="'已用 ' + total(steps[step].segs) + ' tokens'">
          <div v-for="s in steps[step].segs" :key="s.key" class="cw-seg"
            :class="['r-' + s.role, { focus: s.key === steps[step].focus, dim: s.key !== steps[step].focus }]"
            :style="{ width: pct(s.tokens) + '%' }" :title="s.label + ' ' + s.tokens" />
        </div>
        <div class="cw-meta">
          <span class="cw-focus">{{ steps[step].segs.find(s => s.key === steps[step].focus)?.label }}：+{{ steps[step].segs.find(s => s.key === steps[step].focus)?.tokens.toLocaleString() }}</span>
          <span class="cw-total">合计 <b>{{ total(steps[step].segs).toLocaleString() }}</b> tokens</span>
        </div>
        <div v-if="steps[step].sub" class="cw-sub">
          <span>子代理自己的窗口</span>
          <div class="cw-bar cw-bar--sub"><div class="cw-seg r-claude" :style="{ width: pct(steps[step].sub) + '%' }" /></div>
          <span>{{ steps[step].sub.toLocaleString() }}（不进主窗口）</span>
        </div>
        <p class="cw-scale">示意刻度 0–25K；数字取自官方示例会话，你自己的会话用 <code>/context</code> 查看真实值</p>
      </div>
    </template>
  </StepPlayer>
</template>

<style scoped>
.cw { width: 100%; max-width: 680px; }
.cw-bar { height: 44px; border-radius: 10px; background: var(--vp-c-bg); border: 2px solid var(--vp-c-divider); display: flex; overflow: hidden; }
.cw-bar--sub { height: 18px; flex: 1; }
.cw-seg { height: 100%; background: var(--role); transition: width .5s ease, opacity .35s; border-right: 2px solid var(--vp-c-bg); }
.cw-seg.dim { opacity: .3; }
.r-you { --role: var(--cc-you); } .r-claude { --role: var(--cc-claude); } .r-harness { --role: var(--cc-harness); } .r-pass { --role: var(--cc-pass); }
.cw-meta { display: flex; justify-content: space-between; margin-top: 10px; font-size: 15px; gap: 10px; flex-wrap: wrap; }
.cw-focus { font-weight: 600; }
.cw-total b { font-size: 18px; }
.cw-sub { display: flex; align-items: center; gap: 10px; margin-top: 14px; font-size: 13px; color: var(--vp-c-text-2); }
.cw-scale { margin: 12px 0 0; font-size: 12px; color: var(--vp-c-text-3); text-align: center; }
@media (prefers-reduced-motion: reduce) { .cw-seg { transition: none; } }
</style>
