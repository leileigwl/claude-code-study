<script setup lang="ts">
// 依据：ship-command.md：Pull request → Review → Watch → Merge；“What Claude Code blocks during a watch”
const nodes = {
  you: { label: '你在本地会话输入', tag: '/ship', role: 'you' },
  pr: { label: '提交、推送、开 PR', tag: '每步前有 “Esc to cancel”', role: 'claude' },
  review: { label: '用 /code-review 审查', role: 'claude' },
  watch: { label: '盯着 PR 持续修', tag: 'watch：失败检查 · 冲突 · 评论', role: 'claude' },
  guard: { label: '自主行动时禁止合并 / 批准 / 强推', role: 'block' },
  merge: { label: '你自己合并', role: 'you' }
} as const

const steps = [
  { show: ['you'], focus: 'you', narration: '改完了，在同一个本地会话里输入 /ship。它跑在你自己的会话里，计入你自己的用量。',
    detail: '前置：Claude Code v2.1.330 或更高；GitHub CLI 2.63+ 且已 <code>gh auth login</code>；git 2.38+。只能在本地终端 CLI 运行，云端会话没有。原生 Windows 上不会启动 watch。' },
  { show: ['you', 'pr'], focus: 'pr', narration: '第 1 步：它可以替你提交、推送分支并开 PR——不弹确认框，只给几秒按 Esc 取消。',
    detail: '“/ship proceeds with no confirmation prompt.” 在默认分支上会新建分支提交。文件名像密钥（如 <code>.env</code>）时，私有仓库里它什么都不提交。要草稿 PR、别的 base 分支或 PR 模板，就先自己开 PR 再运行 /ship。' },
  { show: ['you', 'pr', 'review'], focus: 'review', narration: '第 2 步：Claude 用 /code-review 审查你的改动。',
    detail: '/code-review 在后台子代理里运行，有自己的上下文窗口；它遵循你的 CLAUDE.md，不读 REVIEW.md（那是托管 Code Review 用的）。' },
  { show: ['pr', 'review', 'watch'], focus: 'watch', narration: '第 3 步：进入 watch——处理失败检查、冲突、评论和自己的审查发现，并推送修复。',
    detail: 'auto 模式下不逐次询问：推提交、把 base 分支合并进来、重跑失败的检查、回复评论并 resolve。按 Esc 或 Ctrl+C、切分支、/clear、7 天到期等都会结束 watch；<code>/ship stop</code> 主动停止；<code>/tasks</code> 查看。' },
  { show: ['review', 'watch', 'guard'], focus: 'guard', narration: '硬限制：Claude 自己行动时，Claude Code 不让它合并、批准、开自动合并或强推。',
    detail: '但官方提醒：它用你的 <code>gh</code>/<code>git</code> 身份；你在它空闲时发消息，这些限制会暂时解除；若分支规则允许你一个人合并，watch 也可能促成合并。<code>/ship terms</code> 查看完整限制。' },
  { show: ['watch', 'guard', 'merge'], focus: 'merge', narration: '第 4 步：检查都过了、评论都答了，Claude 告诉你——由你自己点合并。',
    detail: '“Merge the pull request yourself.” 想让它先给你看审查发现再动手，就在审查进行中说明；但这只是对 Claude 的请求，Claude Code 不强制。要强制，用 deny 规则（例如 deny <code>Bash(git push *)</code> 会让 watch 根本不启动）。' }
]
</script>

<template>
  <StepPlayer title="/ship：个人也能用的“PR 托管”（本地会话）" :steps="steps" source="https://code.claude.com/docs/en/ship-command.md">
    <template #default="{ step }">
      <FlowStage :nodes="nodes" :show="steps[step].show" :focus="steps[step].focus" />
    </template>
  </StepPlayer>
</template>
