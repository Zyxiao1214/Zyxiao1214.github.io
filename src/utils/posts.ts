import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** 开发环境显示草稿，生产构建过滤掉 */
export function isPublished(post: Post): boolean {
  return !post.data.draft || import.meta.env.DEV;
}

/** 按发布时间倒序 */
export function sortByDate(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/** 所有已发布文章（倒序） */
export async function getAllPosts(): Promise<Post[]> {
  const posts = await getCollection('posts');
  return sortByDate(posts.filter(isPublished));
}

/** 日期格式化：2026年11月18日 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/** 机器可读日期，用于 <time datetime> */
export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * 粗略估算阅读时长：中文按 300 字/分钟，英文按 200 词/分钟。
 * 目的是给读者一个量级感，不追求精确。
 */
export function readingTime(body = ''): number {
  const cjk = (body.match(/[\u4e00-\u9fa5]/g) ?? []).length;
  const words = body
    .replace(/[\u4e00-\u9fa5]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(cjk / 300 + words / 200));
}
