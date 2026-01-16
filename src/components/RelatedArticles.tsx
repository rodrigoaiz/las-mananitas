import { useState, useEffect } from "react";

interface RelatedArticle {
  title: string;
  description: string;
  emoji: string;
  slug: string;
}

interface Props {
  currentSlug: string;
  articles: RelatedArticle[];
}

export default function RelatedArticles({ currentSlug, articles }: Props) {
  // Filter out current article and get random 3
  const relatedArticles = articles
    .filter((article) => article.slug !== currentSlug)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return (
    <section className="mt-20 border-t border-slate-200 pt-16">
      <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">
        📚 Sigue explorando
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedArticles.map((article) => (
          <a
            key={article.slug}
            href={`/queremos-pastel/${article.slug}/`}
            className="group bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-6 hover:scale-[1.02] transition-all shadow-lg shadow-pink-200/5"
          >
            <span className="text-3xl mb-3 block group-hover:animate-bounce">
              {article.emoji}
            </span>
            <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-pink-600 transition-colors">
              {article.title}
            </h3>
            <p className="text-slate-500 font-medium text-sm line-clamp-2">
              {article.description}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
