
import React from 'react';
import { Article } from '../types';
import ArticleCard from './ArticleCard';

interface ArticleGridProps {
    articles: Article[];
    onSelectArticle: (article: Article) => void;
    onEditArticle: (article: Article) => void;
    isAdmin: boolean;
}

const ArticleGrid: React.FC<ArticleGridProps> = ({ articles, onSelectArticle, onEditArticle, isAdmin }) => {
    if (articles.length === 0) {
        return (
            <div className="text-center py-16 text-gray-500">
                <h3 className="text-2xl font-serif mb-2">Aucun article trouvé</h3>
                <p>Essayez de changer vos filtres ou votre terme de recherche.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
                <ArticleCard 
                    key={article.id}
                    article={article}
                    onSelect={() => onSelectArticle(article)}
                    onEdit={() => onEditArticle(article)}
                    isAdmin={isAdmin}
                />
            ))}
        </div>
    );
};

export default ArticleGrid;
