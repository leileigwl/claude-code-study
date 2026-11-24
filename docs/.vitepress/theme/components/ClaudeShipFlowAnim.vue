<script setup lang="ts">
// 依据：claude-ship.md（三个 agent 的分工与开启顺序）、code-review.md（Find/Verify/Rank/Post）、
// pr-steward.md（不批准不合并）、approvals.md（observe 模式、required check）
const nodes = {
  pr: { label: '有人开了一个 PR', role: 'you' },
  review: { label: 'Code Review 找问题', tag: '行内评论 + 检查项 Claude Code Review', role: 'claude' },
  steward: { label: 'PR Steward 推修复', tag: '失败检查 · 冲突 · 评论', role: 'claude' },
  approvals: { label: 'Claude Approvals 报告还缺谁批准', tag: '.claude/approvals.yml', role: 'claude' },
  rules: { label: 'GitHub 分支规则决定能否合并', tag: 'branch protection · required checks', role: 'harness' },
  human: { label: '人来合并', role: 'pass' }
} as const

const steps = [
  { show: ['pr'], focus: 'pr', narration: '团队仓库里有人开了一个 PR。Claude Ship 是三个在 GitHub 上协作的 agent。',
    detail: 'Claude Ship 仅限 <b>Team 和 Enterprise</b> 套餐，仓库需在 GitHub。Code Review 已正式可用；PR Steward 与 Claude Approvals 是 public beta。开启需要 Claude 组织的 Owner 角色。' },
  { show: ['pr', 'review'], focus: 'review', narration: '第一个：Code Review 读改动和周边代码，把问题按严重程度标在对应行上。',
    detail: '四个阶段：Find（多个 agent 并行看 diff）→ Verify（核对、过滤误报）→ Rank（去重、按严重度排序）→ Post。它只读仓库、不推提交；检查项不会以失败结束，单独不批准也不阻塞 PR。' },
  { show: ['pr', 'review', 'steward'], focus: 'steward', narration: '第二个：PR Steward 处理失败的检查、合并冲突和评论，直接推提交修复。',
    detail: '它会针对 Code Review 标为 Important 的问题动手；对人的评论做小而具体的修改。“Steward is designed not to approve or merge pull requests.” 官方建议启动方式先设为 <b>Manual (@claude steward)</b>，并自己设置花费上限（默认没有）。' },
  { show: ['review', 'steward', 'approvals'], focus: 'approvals', narration: '第三个：Claude Approvals 按你写的策略文件，报告这个 PR 还需要谁批准。',
    detail: '策略文件 <code>.claude/approvals.yml</code>，可按路径要求几个人批准（<code>seats</code>）、Claude 能否批准（<code>claude: approves / comments</code>）。先用 <code>mode: observe</code> 只展示判定结果；observe 模式也计费。' },
  { show: ['steward', 'approvals', 'rules'], focus: 'rules', narration: '真正能不能合并，由你在 GitHub 设的分支规则说了算。',
    detail: '“The check blocks a merge only where you make it a required check in GitHub, and normally not in observe mode.” 策略里的条件读不到 CI 结果，所以 CI 要作为独立的 required check。' },
  { show: ['approvals', 'rules', 'human'], focus: 'human', narration: '最后由人合并。要警惕：自动合并 + 不要求人批准的策略，可能没人看过就合进去了。',
    detail: '官方警告：“If you use GitHub auto-merge or a merge queue with a policy that doesn\'t require a person\'s approval, a change can merge without anyone acting.” 例如 <code>seats: 1</code> 时作者自己就能占满席位。' }
]
</script>

<template>
  <StepPlayer title="Claude Ship：一个 PR 从打开到合并（团队版）" :steps="steps" source="https://code.claude.com/docs/en/claude-ship.md">
    <template #default="{ step }">
      <FlowStage :nodes="nodes" :show="steps[step].show" :focus="steps[step].focus" />
    </template>
  </StepPlayer>
</template>
