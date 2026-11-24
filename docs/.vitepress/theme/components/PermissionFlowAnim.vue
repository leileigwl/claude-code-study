<script setup lang="ts">
// 依据：permissions.md「Manage permissions」：Rules are evaluated in order: deny, then ask, then allow. The first match in that order determines the outcome.
// 以及 permission-modes.md：Modes set the baseline. Layer permission rules on top…
const nodes = {
  call1: { label: 'Claude 想运行', tag: 'aws s3 ls', role: 'claude' },
  call2: { label: 'Claude 想运行', tag: 'git push origin main', role: 'claude' },
  call3: { label: 'Claude 想运行', tag: 'npm run build', role: 'claude' },
  deny: { label: '① 先查 deny', tag: 'deny: Bash(aws *)', role: 'harness' },
  ask: { label: '② 再查 ask', tag: 'ask: Bash(git push *)', role: 'harness' },
  allow: { label: '③ 最后查 allow', tag: 'allow: Bash(npm run *) · Bash(aws s3 ls)', role: 'harness' },
  blocked: { label: '直接拦截', role: 'block' },
  askYou: { label: '弹窗问你', role: 'you' },
  mode: { label: '都没命中 → 交给权限模式', tag: 'default · acceptEdits · plan · auto · dontAsk · bypassPermissions', role: 'harness' }
} as const

const steps = [
  { show: ['call1'], focus: 'call1', narration: 'Claude 决定调用一个工具。放不放行由 Claude Code 程序按规则判断，不由模型决定。',
    detail: '“Permission rules are enforced by Claude Code, not by the model.” 规则格式：<code>Tool</code> 或 <code>Tool(specifier)</code>。本例的规则：deny <code>Bash(aws *)</code>；ask <code>Bash(git push *)</code>；allow <code>Bash(npm run *)</code>、<code>Bash(aws s3 ls)</code>。' },
  { show: ['call1', 'deny'], focus: 'deny', narration: '第一关永远是 deny：只要有一条 deny 命中，就到此为止。',
    detail: '“Rules are evaluated in order: deny, then ask, then allow. The first match in that order determines the outcome, and rule specificity doesn\'t change the order.”' },
  { show: ['call1', 'deny', 'blocked'], focus: 'blocked', marks: { deny: 'block' }, narration: '哪怕 allow 里写了更具体的 Bash(aws s3 ls)，也救不回来。',
    detail: '“A broad deny rule like <code>Bash(aws *)</code> blocks every matching call, including calls that also match a narrower allow rule like <code>Bash(aws s3 ls)</code>. An allow rule can\'t carve an exception out of a deny rule.”' },
  { show: ['call2', 'deny', 'ask', 'askYou'], focus: 'askYou', narration: '换成 git push：deny 没命中，ask 命中——一定弹窗问你，哪怕在 auto 模式。',
    detail: '“A matching ask rule prompts even when a more specific allow rule also matches.” 显式 ask 规则属于“任何模式都不会自动批准的动作”，包括 auto 和 bypassPermissions。' },
  { show: ['call3', 'deny', 'ask', 'allow'], focus: 'allow', marks: { allow: 'pass' }, narration: '换成 npm run build：前两关都没命中，allow 命中，不问你直接运行。',
    detail: '注意：项目 <code>.claude/settings.json</code> 里的 allow 规则，要等你接受该文件夹的“信任对话框”之后才生效；deny 规则立即生效。' },
  { show: ['deny', 'ask', 'allow', 'mode'], focus: 'mode', narration: '三类规则都没命中时，由当前权限模式决定：问你、自动放行、交给分类器，或直接拒绝。',
    detail: 'default（界面里叫 Manual）：大多数编辑与命令会问；acceptEdits：工作目录内的编辑和 mkdir/mv 等常见文件命令自动通过；plan：只读探索、不改源码；auto：后台分类器审查；dontAsk：凡是会弹窗的一律拒绝；bypassPermissions：跳过提示，仅限容器/虚拟机。“Deny rules block in every mode, including bypassPermissions.”' }
]
</script>

<template>
  <StepPlayer title="权限决策：deny → ask → allow，第一个命中的说了算" :steps="steps" source="https://code.claude.com/docs/en/permissions.md">
    <template #default="{ step }">
      <FlowStage :nodes="nodes" :show="steps[step].show" :focus="steps[step].focus" :marks="steps[step].marks || {}" />
    </template>
  </StepPlayer>
</template>
