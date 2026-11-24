<script setup lang="ts">
// 依据：memory.md「Choose where to put CLAUDE.md files」「How CLAUDE.md files load」「Organize rules with .claude/rules/」
const nodes = {
  managed: { label: '组织托管 CLAUDE.md', tag: '/etc/claude-code/CLAUDE.md 等', role: 'harness' },
  user: { label: '你的全局 CLAUDE.md + 用户 rules', tag: '~/.claude/CLAUDE.md · ~/.claude/rules/', role: 'you' },
  ancestor: { label: '上级目录的 CLAUDE.md', tag: '从文件系统根往下，直到启动目录', role: 'you' },
  project: { label: '项目 CLAUDE.md + 无 paths 的 rules', tag: './CLAUDE.md 或 ./.claude/CLAUDE.md', role: 'you' },
  local: { label: '同层的 CLAUDE.local.md（排最后）', tag: './CLAUDE.local.md', role: 'you' },
  lazy: { label: '子目录 CLAUDE.md / 带 paths 的 rules', tag: '按需：读到那里的文件才加载', role: 'claude' },
  ctx: { label: '全部拼接进上下文（不覆盖）', role: 'pass' }
} as const

const steps = [
  { show: ['managed'], focus: 'managed', narration: '最先读到的是组织托管的 CLAUDE.md（个人用户通常没有这一层）。',
    detail: '位置：macOS <code>/Library/Application Support/ClaudeCode/CLAUDE.md</code>，Linux/WSL <code>/etc/claude-code/CLAUDE.md</code>，Windows <code>C:\\Program Files\\ClaudeCode\\CLAUDE.md</code>。<code>claudeMdExcludes</code> 排除不了它。' },
  { show: ['managed', 'user'], focus: 'user', narration: '然后是你自己的全局说明：每个项目都会带上。',
    detail: '<code>~/.claude/CLAUDE.md</code> 与 <code>~/.claude/rules/</code>。官方：“Claude Code loads user-level rules before project rules”。用户规则与项目规则冲突时，Claude 可能任选其一。' },
  { show: ['managed', 'user', 'ancestor', 'project'], focus: 'project', narration: '接着从上级目录一路往下读到你启动的目录，项目 CLAUDE.md 在这里。',
    detail: '“Content is ordered from the filesystem root down to your working directory… instructions closer to where you launched Claude are read last.” 没有 <code>paths</code> 的 <code>.claude/rules/*.md</code> 与 <code>.claude/CLAUDE.md</code> 同优先级、启动即加载。' },
  { show: ['user', 'ancestor', 'project', 'local'], focus: 'local', narration: '每一层里，CLAUDE.local.md 排在 CLAUDE.md 后面，是那一层最后读到的。',
    detail: '“Within each directory, CLAUDE.local.md is appended after CLAUDE.md.” 它是你的私人说明，要加进 .gitignore。' },
  { show: ['ancestor', 'project', 'local', 'lazy'], focus: 'lazy', narration: '子目录里的 CLAUDE.md 和带 paths 的规则不在启动时加载，读到相关文件才进来。',
    detail: '加载时机：Claude 用 Read/Write/Edit（或 <code>cat</code>、<code>head</code> 这类算作“读”的命令）碰到该子目录或匹配文件。注意：按需加载的内容在压缩时会被摘要掉，要等再次匹配才重新加载。' },
  { show: ['project', 'local', 'lazy', 'ctx'], focus: 'ctx', narration: '所有找到的文件是“拼起来”，不是“谁覆盖谁”。互相矛盾时，Claude 可能随便挑一条。',
    detail: '“All discovered files are concatenated into context rather than overriding each other.” “If two instructions contradict each other, Claude may pick one arbitrarily.” 用 <code>/context all</code> 的 Memory files 列表核对实际加载了哪些。' }
]
</script>

<template>
  <StepPlayer title="CLAUDE.md 加载层级：谁先读、谁后读" :steps="steps" source="https://code.claude.com/docs/en/memory.md" :legend="['you','claude','harness','pass']">
    <template #default="{ step }">
      <FlowStage layout="stack" :nodes="nodes" :show="steps[step].show" :focus="steps[step].focus" />
    </template>
  </StepPlayer>
</template>
