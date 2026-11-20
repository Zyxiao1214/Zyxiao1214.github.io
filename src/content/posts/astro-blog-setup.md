---
title: '用 Astro 从零搭一个可以长期维护的博客'
description: '不套模板，从目录结构、内容 schema 到构建部署，一步步说明为什么这样设计，以及每个决定背后的取舍。'
pubDate: 2026-11-18
category: tech
tags: ['Astro', '建站', '前端']
---

写博客这件事，最容易半途而废的环节不是写作，而是"还没开始写就被技术选型耗光了热情"。
这篇文章记录我从零搭这个站的过程，重点不在代码，而在**为什么这样组织代码**。

## 先想清楚：博客到底需要什么

一个个人博客，核心其实只有三件事：

1. 能写文章，写起来不别扭
2. 能被人读到（加载快、手机上能看）
3. 能长期加功能，而不是推倒重来

基于这三点，我排除了需要数据库和服务器的方案。静态站点生成器一次构建、
全网分发，几乎零运维成本，是个人博客的最优解。

## 为什么是 Astro

我把 Astro 和几个常见方案对比了一下：

| 方案 | 默认 JS | 内容管理 | 适合场景 |
| --- | --- | --- | --- |
| Astro | 0 KB | Content Collections | 内容为主，偶尔加交互 |
| Next.js | 较大 | 需自行搭建 | 应用型站点 |
| Hugo | 0 KB | 目录约定 | 只要写 Markdown |

Astro 的关键优势是**孤岛架构**：页面默认是纯 HTML，只有需要交互的组件才会加载 JS。
对博客来说，这意味着首屏几乎不需要等待脚本执行。

> 静态不等于无交互。搜索、评论、主题切换这些功能，都可以在客户端按需加载。

## 目录结构就是架构

我把职责拆成四层，每层只依赖下一层：

```text
src/
├── config.ts          # 站点级配置：标题、导航、分类
├── content.config.ts  # 文章 schema：frontmatter 的合同
├── content/posts/     # 只放 Markdown
├── layouts/           # 页面骨架
├── components/        # 可复用的 UI 片段
├── pages/             # 路由，尽量只做组装
├── styles/            # 设计令牌与正文排版
└── utils/             # 纯函数：排序、格式化、阅读时长
```

这个划分的好处是：想改视觉只动 `components` 和 `styles`，
想加页面只动 `pages`，两者不会互相牵连。

### 让 schema 帮你挑错

`content.config.ts` 用 Zod 定义了每篇文章必须有哪些字段：

```ts title="src/content.config.ts"
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.enum(['tech', 'life']).default('tech'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});
```

一旦某篇文章写错字段名，构建会直接失败并指出文件位置。
**把约定变成机器可校验的规则**，是减少维护成本最划算的一笔投入。

## 前端的两处小心思

主题切换用 `html.dark` 类控制，并在 `<head>` 里同步执行一段内联脚本，
在首次绘制前就决定好主题，避免深色用户看到白屏闪烁：

```html
<script is:inline>
  const saved = localStorage.getItem('theme');
  const dark = saved
    ? saved === 'dark'
    : matchMedia('(prefers-color-scheme: dark)').matches;
  if (dark) document.documentElement.classList.add('dark');
</script>
```

颜色没有散落在各个组件里，而是集中在设计令牌中：

```css
@theme {
  --color-page: #f5f6f8;
  --color-ink: #14161b;
  --color-accent: #5b4bf5;
}

.dark {
  --color-page: #0a0c10;
  --color-ink: #e9ebf1;
  --color-accent: #a79cff;
}
```

组件只写 `bg-page`、`text-ink` 这样的语义类名，改配色时只改一处。

## 下一步

原型跑起来只是起点。后面我打算按这个顺序迭代：

- 全文搜索（Pagefind，纯静态方案）
- 评论（giscus，复用 GitHub Discussions）
- 系列文章与归档页

每加一个功能都保持"能构建、能回滚"，比一次性做完更踏实。
