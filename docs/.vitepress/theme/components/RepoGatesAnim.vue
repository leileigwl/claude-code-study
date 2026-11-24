<script setup lang="ts">
// 依据：best-practices.md「Enforce the rules that can't have exceptions」；hooks.md（PreToolUse / PostToolUse / Stop）；
//       ship-command.md「Permission rules and hooks that apply to /ship and /steward」（watch 用 core.hooksPath=/dev/null）
const nodes = {
  ask: { label: '你：把按钮改成圆角', role: 'you' },
  guide: { label: 'CLAUDE.md + /ui-prototype', tag: '引导：先做原型（会判断，可能漏）', role: 'claude' },
  pre: { label: 'PreToolUse hook', tag: 'protect-files.mjs → "ask" 弹窗', role: 'harness' },
  post: { label: 'PostToolUse hook', tag: 'lint-edited.mjs → eslint --fix', role: 'harness' },
  stop: { label: 'Stop hook', tag: 'verify-before-stop.mjs → check:all', role: 'harness' },
  git: { label: '本地 git hooks', tag: '.githooks pre-commit / pre-push', role: 'harness' },
  watch: { label: '/ship watch 推送', tag: 'git -c core.hooksPath=/dev/null push', role: 'claude' },
  ci: { label: 'CI = required check', tag: 'GitHub 分支保护', role: 'pass' },
  merge: { label: '你本人合并', role: 'you' }
} as const

const steps = [
  { show: ['ask', 'guide'], focus: 'guide', narration: '第 1 道：CLAUDE.md 和 /ui-prototype 告诉 Claude“样式改动先做 HTML 原型”。这是引导，不是强制。',
    detail: '官方：“Permission rules are enforced by Claude Code, not by the model. Instructions in your prompt or CLAUDE.md shape what Claude tries to do, but they don’t change these rules.” 模型大多数时候会照做，但规则越长、上下文越满，越可能漏。所以后面每一道都由程序执行。' },
  { show: ['ask', 'guide', 'pre'], focus: 'pre', narration: '第 2 道：Claude 真要改 .scss 或 className 时，PreToolUse hook 返回 "ask"，必须你点头。',
    detail: '<code>permissionDecision: "ask"</code> 会把这次调用送到权限提示，auto 模式下也不交给分类器。改 <code>.env</code>、lock 文件、<code>.github/workflows/</code>、<code>.githooks/</code> 则直接 exit 2 拦下。' },
  { show: ['guide', 'pre', 'post'], focus: 'post', narration: '第 3 道：每次编辑后，PostToolUse hook 就地跑 eslint --fix；修不好就把错误塞回给 Claude。',
    detail: 'PostToolUse 撤销不了已经发生的编辑；exit 2 的作用是把 stderr 交给 Claude，让它接着修。' },
  { show: ['pre', 'post', 'stop'], focus: 'stop', narration: '第 4 道：Claude 想说“完成了”时，Stop hook 跑相关检查；没过就把它拽回去继续修。',
    detail: '只跑与改动路径相关的命令（<code>.claude/hooks/checks.json</code>）。连续 8 次被拽回且中间没有工具调用时，Claude Code 强制结束本轮，不会死循环。' },
  { show: ['post', 'stop', 'git'], focus: 'git', narration: '第 5 道：提交和推送时，仓库自己的 git hooks 再跑一遍（pre-commit / pre-push）。',
    detail: '知行快刷用 <code>git config core.hooksPath .githooks</code>。注意 <code>.githooks/</code> 不在 Claude Code 内置受保护路径里（<code>.husky/</code> 才在），所以模板额外用 deny 规则和 hook 保护它。' },
  { show: ['stop', 'git', 'watch'], focus: 'watch', narration: '但是：/ship 的 watch 自主推送时，用的是 core.hooksPath=/dev/null——本地 git hooks 被跳过。',
    detail: '官方表格：仓库 hooks 目录里的 git hooks 在 watch 的自主轮次里“don’t run for Claude’s fetches, merges, commits, and pushes”。<code>--no-verify</code> 同理。所以本地 hooks 只是“快反馈”，不是最后一道门。' },
  { show: ['git', 'watch', 'ci'], focus: 'ci', narration: '最后一道：GitHub 上的 CI 设为 required status check。谁推的、怎么推的，都得过它。',
    detail: '分支保护：要求 PR、要求 CI 的 backend 与 frontend 两个 job 通过、禁止强推、不开 auto-merge。公开仓库在 GitHub 免费套餐就能设；私有仓库的部分规则需要付费 GitHub 套餐。' },
  { show: ['watch', 'ci', 'merge'], focus: 'merge', narration: '检查全绿、原型已确认，你自己在 GitHub 上点合并。AI 从头到尾没有合并权。',
    detail: '/ship watch 在 Claude 自主行动时被禁止合并、批准、开 auto-merge 和强推；但它用你的 gh 身份，所以“只有你一个人也能合并”的分支规则 + auto-merge 仍可能促成合并——别开 auto-merge。' }
]
</script>

<template>
  <StepPlayer title="一次样式改动要穿过的门（从“建议”到“强制”）" :steps="steps" source="https://code.claude.com/docs/en/ship-command.md">
    <template #default="{ step }">
      <FlowStage :nodes="nodes" :show="steps[step].show" :focus="steps[step].focus" />
    </template>
  </StepPlayer>
</template>
