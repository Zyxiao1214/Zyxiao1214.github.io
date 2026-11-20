// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // 部署到 GitHub Pages 后，把这里改成真实地址，例如 https://<用户名>.github.io
  site: 'https://zyxiao1214.github.io',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      // 双主题：浅色用 github-light，深色用 github-dark，由 CSS 变量切换
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
  devToolbar: {
    enabled: false,
  },
  build: {
    // 文章详情页用稳定的目录结构，便于长期维护 URL
    format: 'directory',
  },
  image: {
    // 不依赖线上图片服务，构建时本地优化
    responsiveStyles: true,
  },
});
