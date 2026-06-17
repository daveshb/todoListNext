// SSR - Server Component con params dinámicos
// ✅ Next.js genera esta página en el servidor para CADA slug
// ✅ Si el artículo no existe → 404 automático

import conectionDB from "@/lib/database";
import Post from "@/database/models/blog";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  coverImage: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  await conectionDB();
  const post: BlogPost | null = await Post.findOne({ slug }).lean();
  if (!post) return { title: "Artículo no encontrado" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  await conectionDB();
  const post: BlogPost | null = await Post.findOne({ slug }).lean();

  if (!post) notFound();

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Cover */}
      {post.coverImage && (
        <div className="relative h-72 md:h-96 bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {post.category}
            </span>
            <h1 className="text-white text-2xl md:text-4xl font-bold leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      )}

      <article className="max-w-3xl mx-auto px-6 py-10">
        {/* No cover fallback */}
        {!post.coverImage && (
          <>
            <span className="inline-block bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
              {post.title}
            </h1>
          </>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400 mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-700">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            {post.author}
          </span>
          <span>·</span>
          <span>{post.publishedAt}</span>
          <span>·</span>
          <span>{post.readTime} min de lectura</span>
        </div>

        {/* Excerpt */}
        <p className="text-lg text-zinc-600 dark:text-zinc-300 italic mb-8 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Content */}
        <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-700">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-medium px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Back */}
        <div className="mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            ← Volver al blog
          </Link>
        </div>
      </article>
    </main>
  );
}
