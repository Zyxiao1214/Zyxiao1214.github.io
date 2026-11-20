import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../config';
import { getAllPosts } from '../utils/posts';

export async function GET(context: APIContext) {
  const posts = await getAllPosts();

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? 'https://example.com',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/posts/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: `<language>${SITE.locale}</language>`,
  });
}
