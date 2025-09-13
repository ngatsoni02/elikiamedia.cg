
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Article } from '../types';
import { UserIcon, CalendarIcon, DownloadIcon } from './icons';

interface ArticleDetailProps {
    article: Article;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article }) => {
    const MediaDisplay = () => {
        switch (article.media.type) {
            case 'image':
                return <img src={article.media.url} alt={article.title} className="w-full h-auto max-h-[500px] object-cover rounded-lg mb-6 shadow-lg" />;
            case 'video':
                const videoUrl = article.media.url.replace("watch?v=", "embed/");
                return (<>
        <Helmet>
          <title>{article.title} – Elikia Media</title>
          <meta property="og:title" content={article.title} />
          <meta property="og:description" content={(article.content.replace(/<[^>]*>/g, '').slice(0, 150) + '...')} />
          <meta property="og:image" content={article.media?.url} />
          <meta property="og:url" content={`https://elikiamedia-cg.vercel.app/article/${article.slug}`} />
          <meta name="twitter:card" content="summary_large_image" />
        </Helmet>

                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe 
                            src={videoUrl} 
                            title={article.title} 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            className="absolute top-0 left-0 w-full h-full rounded-lg mb-6 shadow-lg"
                        ></iframe>
                    </div>
                );
            case 'pdf':
                return (
                    <div className="mb-6">
                        <div className="w-full h-[600px] border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                           <iframe src={article.media.url} title={article.title} width="100%" height="100%"></iframe>
                        </div>
                        <a href={article.media.url} download={article.media.filename} className="mt-4 inline-flex items-center gap-2 bg-primary-dark text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition">
                           <DownloadIcon className="w-5 h-5" />
                           Télécharger le PDF
                        </a>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <article className="bg-white p-6 sm:p-10 rounded-lg shadow-xl animate-fade-in">
            <header className="mb-8 border-b border-gray-200 pb-6">
                <span className="inline-block bg-secondary-gold text-primary-dark px-3 py-1 rounded-full text-sm font-semibold mb-4">{article.category}</span>
                <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary-dark mb-4">{article.title}</h1>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500">
                    <div className="flex items-center gap-2">
                        <UserIcon className="w-5 h-5" />
                        <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5" />
                        <span>{article.date}</span>
                    </div>
                </div>
            </header>
            
            <MediaDisplay />

            <div 
                className="prose prose-lg max-w-none text-gray-700 leading-loose"
                dangerouslySetInnerHTML={{ __html: article.content }}
            />
        </article>
        </>);
};

export default ArticleDetail;
