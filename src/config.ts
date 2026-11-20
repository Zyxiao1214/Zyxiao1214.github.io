/**
 * 站点级配置：改这里就能改整站的标题、作者、导航。
 * 部署地址在 astro.config.mjs 的 site 字段里配置。
 */
export const SITE = {
  title: 'Zyxiao 的博客',
  author: 'Zyxiao',
  description: '技术笔记与生活随笔，记录正在发生的学习和思考。',
  locale: 'zh-CN',
  email: 'hello@example.com',
  github: 'https://github.com/',
};

/** 顶部导航，末尾斜杠与 build.format: 'directory' 保持一致 */
export const NAV = [
  { label: '首页', href: '/' },
  { label: '标签', href: '/tags/' },
  { label: '关于', href: '/about/' },
];

/** 文章分类：key 与 frontmatter 中 category 的值一致 */
export const CATEGORY_LABEL = {
  tech: '技术',
  life: '随笔',
} as const;

export type Category = keyof typeof CATEGORY_LABEL;
