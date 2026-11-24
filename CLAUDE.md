<!-- 本仓库是 Claude Code 中文学习站（VitePress）。只写读代码推不出来的东西。 -->
# 项目一句话
Claude Code 官方文档的中文学习站：A 路线（落地实战 10 章）+ B 路线（官方文档全量索引，脚本生成）+ template/（可复制的防乱跑配置）。

# Commands
- 安装：npm ci（Node 22）
- 预览：npm run docs:dev
- 构建（必须零死链，config 里 ignoreDeadLinks: false）：npm run docs:build
- 重新生成 B 路线：npm run gen:track-b（不要手改 docs/track-b/*.md）
- 校验并合并题库：npm run gen:quizzes（生成 quizzes/all.json）
- 比对官方文档：npm run sync:docs（-- --update 更新 data/ 快照）

# 内容规则（准确性第一）
- 每条事实（命令、设置键、hook 事件、权限模式、CLI 参数、版本号、套餐限制）都必须能在 https://code.claude.com/docs/en/<page>.md 里找到；写之前先读原文。引用原文用英文原句。
- 官方没写清楚的，用 <span class="verify">待核实：…</span> 标出，并登记到 PROGRESS.md 的“待核实”。不要猜。
- A 路线每章固定结构：一句话讲明白（.one-liner）→ 为什么需要（对应哪种“乱跑”）→ 详细原理（全部选项）→ 动画（可选）→ 落地到自己的仓库（真实文件，和 template/ 一致）→ 常见坑与排错 → 自测题（<Quiz :data="quiz" />，题目在 quizzes/NN-*.json）→ 原文链接。
- “原文链接”一节决定 B 路线的“已精读”状态：只列真正逐条核对过的页面。改完章节后运行 npm run gen:track-b。
- 章节里的配置片段必须和 template/ 里的文件一致；改一边就改另一边。
- 不写空话、不凑字数；用表格讲选项，用代码块给可复制的命令。

# 题库格式
- quizzes/NN-<slug>.json：[{ id, chapter, question, options[], answer, explanation, source_url }]；answer 是 0 起始下标；explanation 尽量含官方英文原句；source_url 指向 .md 原文。

# 动画规则（StepPlayer + FlowStage）
- 一个动画只讲一件事；每步最多 3–4 个节点、只高亮一个；一行大白话旁白；技术细节放 detail（可含 <code>）。
- 颜色语义固定：蓝=你、橙=Claude、灰=Claude Code 程序、绿=通过、红=拦截。
- detail 字符串用单引号，内容里的英文撇号用 ’ 而不是 '。
- 新动画在 docs/.vitepress/theme/index.ts 注册。

# Gotchas
- Markdown 正文里出现 {{ 会被 Vue 当插值导致构建失败：用 <code v-pre>…</code> 或 ::: v-pre 容器。
- base 是 /claude-code-study/；站内链接写 /track-a/... 或相对路径，不要写完整域名。
- 推送用 GitHub fine-grained token；改 .github/workflows/ 需要 token 有 Workflows 写权限。
