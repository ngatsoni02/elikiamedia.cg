
import React from 'react';
import { Article } from '../types';
import { PlayIcon, PdfIcon, EditIcon } from './icons';

interface ArticleCardProps {
    article: Article;
    onSelect: () => void;
    onEdit: () => void;
    isAdmin: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onSelect, onEdit, isAdmin }) => {
    const excerpt = article.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...';

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit();
    };

    const getYouTubeThumbnail = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        const videoId = (match && match[2].length === 11) ? match[2] : null;
        return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : 'https://picsum.photos/400/225?grayscale';
    };

    const MediaDisplay = () => {
        const baseClasses = "h-48 w-full bg-cover bg-center flex items-center justify-center";
        switch (article.media.type) {
            case 'image':
                return <div className={baseClasses} style={{ backgroundImage: `url('${article.media.url}')` }}></div>;
            case 'video':
                return (
                    <div className={baseClasses} style={{ backgroundImage: `url('${getYouTubeThumbnail(article.media.url)}')` }}>
                        <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center">
                            <PlayIcon className="w-8 h-8 text-white" />
                        </div>
                    </div>
                );
            case 'pdf':
                return (
                    <div className={`${baseClasses} bg-gray-200`}>
                         <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                            <PdfIcon className="w-8 h-8 text-[#e74c3c]" />
                        </div>
                    </div>
                );
            default:
                return <div className="h-48 w-full bg-gray-300"></div>
        }
    };
    
    return (
        <article 
            onClick={onSelect} 
            className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col cursor-pointer"
        >
            <div className="relative">
                <MediaDisplay />
                {article.featured && (
                    <span className="absolute top-3 left-3 bg-primary-gold text-primary-dark px-3 py-1 rounded-full text-xs font-bold z-10">À la une</span>
                )}
                {isAdmin && (
                    <button
                        onClick={handleEditClick}
                        className="absolute top-3 right-3 w-9 h-9 bg-white/90 text-primary-dark rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        title="Modifier l'article"
                    >
                        <EditIcon className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <span className="inline-block bg-secondary-gold text-primary-dark px-3 py-1 rounded-full text-xs font-semibold mb-3 self-start">{article.category}</span>
                <h3 className="font-serif text-xl font-bold text-primary-dark mb-2 flex-grow">{article.title}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{excerpt}</p>
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                    <span>Par <strong>{article.author}</strong></span>
                    <span>{article.date}</span>
                </div>
            </div>
        </article>
    );
};

export default ArticleCard;
