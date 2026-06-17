// SSR - Server Component
// ✅ No "use client" → este archivo se ejecuta SOLO en el servidor
// ✅ No useState, no useEffect
// ✅ El HTML llega completamente renderizado al navegador
// ✅ Ideal para SEO y primer paint rápido

import conectionDB from "@/lib/database";
import Post from "@/database/models/blog";
import Link from "next/link";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  coverImage: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
}

export const metadata = {
  title: "Thompson Blog de Noticias — SSR Demo ",
  description: "Artículos renderizados en el servidor con Next.js Server Components",
};

export default async function BlogPage() {
  // Esta petición ocurre en el servidor, no en el navegador
  await conectionDB();
  const posts: BlogPost[] = await Post.find({}).sort({ publishedAt: -1 }).lean();

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <span className="inline-block bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            SSR · Server Side Rendering
          </span>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
            Blog de Noticias
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-base">
            Datos traídos del servidor antes de llegar al navegador — sin spinner, sin loading state.
          </p>
        </div>
      </header>

      {/* SSR info banner */}
      <div className="bg-blue-50 dark:bg-blue-950 border-b border-blue-100 dark:border-blue-900">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-3 text-sm text-blue-700 dark:text-blue-300">
          <span className="font-mono bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded text-xs">
            async page()
          </span>
          <span>
            Este componente es <strong>async</strong> y se ejecuta en el servidor en cada request. El HTML ya tiene los{" "}
            <strong>{posts.length} artículos</strong> cuando llega al cliente.
          </span>
        </div>
      </div>

      {/* Articles grid */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        {posts.length === 0 ? (
          <p className="text-center text-zinc-400 py-20">No hay artículos aún.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post._id.toString()}
                href={`/blog/${post.slug}`}
                className="group bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                {/* Cover image */}
                <div className="relative h-44 bg-zinc-100 dark:bg-zinc-700 overflow-hidden">
                  {post.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300 text-4xl">
                      📰
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 text-xs font-semibold px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500 border-t border-zinc-100 dark:border-zinc-700 pt-3">
                    <span className="font-medium text-zinc-600 dark:text-zinc-300">
                      {post.author}
                    </span>
                    <div className="flex items-center gap-2">
                      <span>{post.readTime} min</span>
                      <span>·</span>
                      <span>{post.publishedAt}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
