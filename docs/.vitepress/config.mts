import { defineConfig } from 'vitepress'

const trackA = [
  { text: '总览：为什么 AI 会"乱跑"', link: '/track-a/' },
  { text: '1. Agent 循环与上下文窗口', link: '/track-a/01-agent-loop-context' },
  { text: '2. CLAUDE.md / 记忆 / .claude 目录', link: '/track-a/02-claude-md-memory' },
  { text: '3. settings、权限模式与沙箱', link: '/track-a/03-settings-permissions-sandbox' },
  { text: '4. Plan mode、会话、checkpoint、worktree', link: '/track-a/04-plan-sessions-worktrees' },
  { text: '5. Hooks：硬性门禁', link: '/track-a/05-hooks-gates' },
  { text: '6. Skills 与 slash commands', link: '/track-a/06-skills-commands' },
  { text: '7. Subagents 分工与边界', link: '/track-a/07-subagents' },
  { text: '8. MCP 接入', link: '/track-a/08-mcp' },
  { text: '9. Claude Ship 与 /ship', link: '/track-a/09-claude-ship' },
  { text: '10. 防乱跑仓库模板 + 知行快刷实战', link: '/track-a/10-repo-template' }
]

const trackB = [
  { text: '总览与精读状态', link: '/track-b/' },
  { text: 'Getting started 快速入门', link: '/track-b/getting-started' },
  { text: 'Build with Claude Code 构建', link: '/track-b/build' },
  { text: 'Plugins 插件', link: '/track-b/plugins' },
  { text: 'Administration 管理', link: '/track-b/administration' },
  { text: 'Configuration 配置', link: '/track-b/configuration' },
  { text: 'Reference 参考', link: '/track-b/reference' },
  { text: 'Agent SDK', link: '/track-b/agent-sdk' },
  { text: 'Resources 资源', link: '/track-b/resources' }
]

export default defineConfig({
  lang: 'zh-CN',
  title: 'Claude Code 中文学习站',
  description: '把 Claude Code 落地到自己的仓库：管住 AI，不让项目失控。基于官方文档逐条核对。',
  base: '/claude-code-study/',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: false,
  head: [['meta', { name: 'theme-color', content: '#ea580c' }]],
  markdown: {
    lineNumbers: false
  },
  themeConfig: {
    nav: [
      { text: '学习路线', link: '/roadmap' },
      { text: 'A · 落地实战', link: '/track-a/' },
      { text: 'B · 官方文档精读', link: '/track-b/' },
      { text: '更新日志', link: '/changelog' },
      { text: '官方文档', link: 'https://code.claude.com/docs' }
    ],
    sidebar: {
      '/track-a/': [{ text: 'A · 落地实战：管住 AI', items: trackA }],
      '/track-b/': [{ text: 'B · 官方文档精读', items: trackB }],
      '/': [
        { text: '开始', items: [
          { text: '首页', link: '/' },
          { text: '学习路线', link: '/roadmap' },
          { text: '更新日志', link: '/changelog' }
        ] },
        { text: 'A · 落地实战', collapsed: false, items: trackA },
        { text: 'B · 官方文档精读', collapsed: true, items: trackB }
      ]
    },
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一页', next: '下一页' },
    lastUpdatedText: '最后更新',
    darkModeSwitchLabel: '外观',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '回到顶部',
    search: { provider: 'local' },
    footer: {
      message: '非官方学习笔记。所有事实以 code.claude.com/docs 为准；文档核对日期见每章“原文链接”。',
      copyright: 'Claude Code 是 Anthropic 的产品'
    }
  }
})
