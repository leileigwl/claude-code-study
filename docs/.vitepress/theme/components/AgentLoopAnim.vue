<script setup lang="ts">
// 依据：how-claude-code-works.md「The agentic loop」与“fix the failing tests”六步示例
const nodes = {
  you: { label: '你：修好失败的测试', role: 'you' },
  gather: { label: '收集上下文', tag: 'gather context', role: 'claude' },
  act: { label: '采取行动', tag: 'take action', role: 'claude' },
  verify: { label: '验证结果', tag: 'verify results', role: 'claude' },
  done: { label: '交回结果给你', role: 'pass' }
} as const

const steps = [
  { show: ['you'], focus: 'you', narration: '你给出一个任务。之后 Claude 会自己决定下一步做什么。',
    detail: '官方原文：“When you give Claude a task, it works through three phases: <b>gather context</b>, <b>take action</b>, and <b>verify results</b>.”' },
  { show: ['you', 'gather'], focus: 'gather', narration: '第一阶段：先看清现场——跑测试、读报错、搜相关文件。',
    detail: '对应官方示例前 4 步：Run the test suite → Read the error output → Search for the relevant source files → Read those files。这些读进来的内容全部进入上下文窗口。' },
  { show: ['you', 'gather', 'act'], focus: 'act', narration: '第二阶段：动手改代码。',
    detail: '官方示例第 5 步：Edit the files to fix the issue。改文件前 Claude Code 会先给文件拍快照（checkpoint），所以文件编辑可回退。' },
  { show: ['you', 'gather', 'act', 'verify'], focus: 'verify', narration: '第三阶段：再跑一次测试，确认真的修好了。',
    detail: '官方示例第 6 步：Run the tests again to verify。如果你没给它“可以跑的检查”，它只能凭“看起来完成了”就停下——这正是最佳实践里说的问题。' },
  { show: ['gather', 'act', 'verify'], focus: 'loop', loop: true, narration: '没通过？它会带着新信息回到第一阶段，再来一轮。',
    detail: '“Claude decides what each step requires based on what it learned from the previous step, chaining dozens of actions together and course-correcting along the way.” 三个阶段会交织在一起，不是严格顺序。' },
  { show: ['you', 'gather', 'act', 'verify'], focus: 'you', loop: true, narration: '你也在循环里：随时按 Esc 打断，或直接输入纠正。',
    detail: '按 <code>Esc</code>：立即停止，正在运行的工具调用被取消。直接输入并回车：消息排队，Claude 在当前工具调用结束后、同一轮内读到并调整。' },
  { show: ['gather', 'act', 'verify', 'done'], focus: 'done', narration: '检查通过，Claude 结束这一轮，把结果交回给你。',
    detail: '循环由两部分驱动：负责推理的模型（models）和负责行动的工具（tools）。Claude Code 是包在模型外面、提供工具并管理上下文的那一层，叫 agentic harness。' }
]
</script>

<template>
  <StepPlayer title="Agent 循环：一次“修复失败测试”是怎么跑的" :steps="steps" source="https://code.claude.com/docs/en/how-claude-code-works.md" :legend="['you','claude','pass']">
    <template #default="{ step }">
      <FlowStage :nodes="nodes" :show="steps[step].show" :focus="steps[step].focus"
        :loop="{ label: '没通过 → 回到“收集上下文”', visible: !!steps[step].loop }" />
    </template>
  </StepPlayer>
</template>
