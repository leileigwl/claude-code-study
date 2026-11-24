---
layout: home
title: Claude Code 中文学习站
titleTemplate: 管住 AI，不让项目失控

hero:
  name: Claude Code
  text: 让 AI 写代码，<br>但不让它乱跑
  tagline: 一条“落地实战”路线，把官方文档里真正管用的东西装进你的仓库；一份“官方文档精读”索引，逐页标注读到哪了。每条结论都对照 code.claude.com/docs 核对过。
  actions:
    - theme: brand
      text: 从第 1 章开始
      link: /track-a/01-agent-loop-context
    - theme: alt
      text: 看学习路线
      link: /roadmap
    - theme: alt
      text: 直接拿模板
      link: /track-a/10-repo-template
---

<div class="home-wrap">

<p class="home-kicker">两条路线，按你的目标选</p>

<div class="track-grid">
  <a class="track-card track-a" href="./track-a/">
    <span class="track-badge">A · 落地实战</span>
    <h3>管住 AI：10 章，从原理到一个真实仓库</h3>
    <p>每章固定结构：一句话讲明白 → 为什么会“乱跑” → 原理与全部选项 → 分步动画 → 落地到仓库（真实文件）→ 坑 → 自测题 → 原文链接。</p>
    <ul>
      <li>Agent 循环、上下文、CLAUDE.md 与记忆</li>
      <li>settings 权限、沙箱、plan mode、worktree</li>
      <li>hooks 门禁、skills、子代理、MCP</li>
      <li>Claude Ship 与 <code>/ship</code>，以及一套可复制的防乱跑模板</li>
    </ul>
    <span class="track-go">开始学 →</span>
  </a>
  <a class="track-card track-b" href="./track-b/">
    <span class="track-badge">B · 官方文档精读</span>
    <h3>按官方导航，逐页标注“读到哪了”</h3>
    <p>官方 llms.txt 列出的每一页：中文概要（取自官方简体中文版）、原文链接、对应 A 路线哪一章、状态 <span class="status-tag st-deep">已精读</span> 或 <span class="status-tag st-brief">概要</span>。</p>
    <ul>
      <li>快速入门、构建、插件、管理、配置、参考、Agent SDK、资源</li>
      <li>每周自动比对官方文档，有新增/删除/改动就开 issue</li>
    </ul>
    <span class="track-go">查索引 →</span>
  </a>
</div>

<div class="home-points">
  <div>
    <strong>“建议”和“强制”分清楚</strong>
    <p>CLAUDE.md 是写给模型读的；权限规则和 hooks 由程序执行。“绝不能做”的事，放对地方才算数。</p>
  </div>
  <div>
    <strong>一步一个画面的动画</strong>
    <p>权限判定、hook 生命周期、子代理分派、<code>/ship</code> 流程……每一步只讲一件事，可暂停、可逐步看细节。</p>
  </div>
  <div>
    <strong>自测题能导出</strong>
    <p>每章都有选择题，题目、答案、解析和原文出处都在 <code>quizzes/*.json</code>，可直接导入刷题应用。</p>
  </div>
</div>

<p class="home-note">非官方学习笔记。Claude Code 是 Anthropic 的产品；一切以 <a href="https://code.claude.com/docs">code.claude.com/docs</a> 为准。</p>

</div>
