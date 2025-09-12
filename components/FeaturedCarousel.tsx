
import React, { useState, useEffect, useCallback } from 'react';
import { Article } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface FeaturedCarouselProps {
    articles: Article[];
    onSelectArticle: (article: Article) => void;
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ articles, onSelectArticle }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNext = useCallback(() => {
        const isLastSlide = currentIndex === articles.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, articles.length]);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? articles.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };
    
    useEffect(() => {
        if (articles.length > 1) {
            const timer = setTimeout(goToNext, 5000);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, articles.length, goToNext]);


    if (!articles || articles.length === 0) {
        return null;
    }

    const getYouTubeThumbnail = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        const videoId = (match && match[2].length === 11) ? match[2] : null;
        return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : 'https://picsum.photos/1200/500?grayscale';
    };

    const getBackgroundImage = (article: Article) => {
        switch (article.media.type) {
            case 'image':
                return article.media.url;
            case 'video':
                return getYouTubeThumbnail(article.media.url);
            case 'pdf':
                return 'https://picsum.photos/1200/500?blur=2';
            default:
                return 'https://picsum.photos/1200/500';
        }
    };

    return (
        <section className="relative w-full h-80 md:h-[450px] rounded-lg overflow-hidden shadow-2xl mb-12">
            {articles.map((article, index) => (
                <div
                    key={article.id}
                    className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0'}`}
                    style={{ backgroundImage: `url(${getBackgroundImage(article)})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white z-20 w-full md:w-3/4">
                        <span className="inline-block bg-primary-gold text-primary-dark px-3 py-1 rounded-full text-sm font-bold mb-2">{article.category}</span>
                        <h3 className="font-serif text-2xl md:text-4xl font-bold mb-4">{article.title}</h3>
                        <p className="hidden md:block mb-4 text-gray-200">
                            {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                        </p>
                        <button onClick={() => onSelectArticle(article)} className="bg-primary-gold text-primary-dark font-bold py-2 px-6 rounded-md shadow-md hover:bg-[#c19d2d] transition transform hover:-translate-y-0.5">
                            Lire l'article
                        </button>
                    </div>
                </div>
            ))}

            {articles.length > 1 && (
                <>
                    <button onClick={goToPrevious} className="absolute top-1/2 left-4 -translate-y-1/2 z-30 bg-black/40 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/60 transition">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <button onClick={goToNext} className="absolute top-1/2 right-4 -translate-y-1/2 z-30 bg-black/40 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/60 transition">
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                        {articles.map((_, index) => (
                            <div
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full cursor-pointer transition-all ${currentIndex === index ? 'bg-primary-gold scale-125' : 'bg-white/50'}`}
                            ></div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default FeaturedCarousel;
