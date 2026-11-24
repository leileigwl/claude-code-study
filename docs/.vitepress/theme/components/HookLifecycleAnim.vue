<script setup lang="ts">
// 依据：hooks.md「Hook lifecycle」事件表、「Exit code 2 behavior per event」、Stop 输入（8 次连续继续上限）；
// permissions.md：PreToolUse hooks run before the permission prompt。
const nodes = {
  decide: { label: 'Claude 决定改文件', tag: 'Edit src/api.ts', role: 'claude' },
  pre: { label: '工具执行之前', tag: 'PreToolUse', role: 'harness' },
  perm: { label: '需要问你时', tag: 'PermissionRequest', role: 'harness' },
  run: { label: '工具真正执行', role: 'claude' },
  post: { label: '执行成功之后', tag: 'PostToolUse（失败则 PostToolUseFailure）', role: 'harness' },
  batch: { label: '这一批调用全部结束', tag: 'PostToolBatch', role: 'harness' },
  stop: { label: 'Claude 想结束这一轮', tag: 'Stop', role: 'harness' }
} as const

const steps = [
  { show: ['decide'], focus: 'decide', narration: 'Claude 决定调用一个工具，比如编辑一个文件。',
    detail: '工具类事件 <code>PreToolUse</code>/<code>PostToolUse</code> 在 agentic loop 里每一次工具调用都会触发（<code>EndConversation</code> 例外）。' },
  { show: ['decide', 'pre'], focus: 'pre', narration: '工具执行前，PreToolUse 先跑：这是唯一能在“动手之前”拦下它的地方。',
    detail: 'PreToolUse 可返回 <code>allow</code>/<code>deny</code>/<code>ask</code>/<code>defer</code>，或用 <code>exit 2</code> 拦截（stderr 作为原因给 Claude）。它在权限提示之前运行；但它返回 allow 也绕不过 deny/ask 规则。' },
  { show: ['decide', 'pre', 'perm'], focus: 'perm', narration: '如果这次调用需要你批准，PermissionRequest 在弹窗前触发。',
    detail: '“When a tool call needs a permission decision.” 注意：PermissionRequest 的 <code>exit 2</code> 不算决定，要用 JSON 的 <code>decision</code> 对象来拒绝。' },
  { show: ['pre', 'perm', 'run', 'post'], focus: 'post', narration: '工具执行完，PostToolUse 触发：适合自动格式化、跑 lint，但已经改了，撤不回。',
    detail: 'PostToolUse 的 <code>exit 2</code> 只会把 stderr 显示给 Claude（“the tool already ran”）。执行失败时触发的是 <code>PostToolUseFailure</code>。' },
  { show: ['run', 'post', 'batch'], focus: 'batch', narration: '同一批并行的工具调用全部结束后、下一次请求模型之前，PostToolBatch 触发。',
    detail: '“After a full batch of parallel tool calls resolves, before the next model call.” 它的 <code>exit 2</code> 会停止 agentic loop。' },
  { show: ['post', 'batch', 'stop'], focus: 'stop', narration: 'Claude 想结束回复时，Stop 触发：用 exit 2 可以把它“拽回来继续干”，比如测试没过。',
    detail: '用户按 Esc 打断时不触发 Stop；API 报错触发 <code>StopFailure</code>。连续 8 次被 Stop hook 拽回（中间没有工具调用）后，Claude Code 会强制结束本轮；脚本应检查 <code>stop_hook_active</code>。' }
]
</script>

<template>
  <StepPlayer title="Hook 生命周期：一次工具调用里，事件按什么顺序触发" :steps="steps" source="https://code.claude.com/docs/en/hooks.md" :legend="['claude','harness']">
    <template #default="{ step }">
      <FlowStage :nodes="nodes" :show="steps[step].show" :focus="steps[step].focus" />
    </template>
  </StepPlayer>
</template>
