import { useParams, Navigate } from "react-router-dom";
import { slugify } from "@/utils/slug";

type Article = { id: number|string; title: string; content?: string; slug?: string };

// TODO: brancher sur ta vraie source (API/store)
const mockArticles: Article[] = [
  { id: 1, title: "Premier article", content: "<p>Contenu...</p>" },
  { id: 2, title: "Deuxième article", content: "<p>Autre contenu...</p>" }
];

export function ArticleDetail() {
  const { id, slug } = useParams();
  const article = mockArticles.find(a => String(a.id) === String(id));

  if (!article) return <Navigate to="/" replace />;

  const currentSlug = article.slug ?? slugify(article.title);
  if (slug !== currentSlug) {
    return <Navigate to={`/article/${article.id}/${currentSlug}`} replace />;
  }

  return (
    <main className="prose mx-auto p-4">
      <h1>{article.title}</h1>
      <article dangerouslySetInnerHTML={{ __html: article.content || "" }} />
    </main>
  );
}


export default ArticleDetail;
