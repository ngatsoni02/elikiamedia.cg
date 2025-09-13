import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Article, Settings } from './types';
import { INITIAL_ARTICLES, INITIAL_SETTINGS, CATEGORIES, ALL_CATEGORIES } from './constants';
import { supabase } from './services/supabaseClient';
import Header from './components/Header';
import Footer from './components/Footer';
import FeaturedCarousel from './components/FeaturedCarousel';
import ArticleGrid from './components/ArticleGrid';
import { ArticleDetail } from './components/ArticleDetail';
import AdminForm from './components/AdminForm';
import LoginModal from './components/LoginModal';
import SettingsModal from './components/SettingsModal';
import { ArrowLeftIcon, PlusIcon, CogIcon } from './components/icons';

type View = 'list' | 'detail' | 'form';

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('list');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);

  const fetchAllData = useCallback(async () => {
    try {
        const { data: articlesData, error: articlesError } = await supabase
            .from('articles')
            .select('*')
            .order('date', { ascending: false });
        if (articlesError) throw articlesError;

        let formattedArticles = articlesData.map(a => ({
            ...a,
            date: new Date(a.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
        }));

        if (formattedArticles.length === 0 && INITIAL_ARTICLES.length > 0) {
            const articlesToSeed = INITIAL_ARTICLES.map(a => ({ ...a, date: new Date().toISOString() }));
            const { data: seeded, error } = await supabase.from('articles').insert(articlesToSeed).select();
            if(error) throw error;
            formattedArticles = seeded.map(a => ({...a, date: new Date(a.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) }));
        }
        setArticles(formattedArticles);

        const { data: settingsData, error: settingsError } = await supabase.from('settings').select('*').limit(1).single();
        if (settingsError && settingsError.code !== 'PGRST116') throw settingsError; 

        if (settingsData) {
            setSettings(settingsData);
        } else {
            const { data: seeded, error } = await supabase.from('settings').insert(INITIAL_SETTINGS).select().single();
            if(error) throw error;
            setSettings(seeded || INITIAL_SETTINGS);
        }

    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAdmin(!!session);
    });

    return () => subscription.unsubscribe();
  }, [fetchAllData]);

  // Gère le routage basé sur le hash de l'URL et met à jour le titre de la page
  useEffect(() => {
    const handleRouting = () => {
        const defaultTitle = "ELIKIA MEDIA - L'information au cœur de l'Afrique";
        const hash = window.location.hash;
        if (hash.startsWith('#/article/')) {
            const articleSlug = hash.substring('#/article/'.length);
            if (articles.length > 0) {
                const article = articles.find(a => a.slug === articleSlug);
                if (article) {
                    setSelectedArticle(article);
                    setView('detail');
                    document.title = `${article.title} | ELIKIA MEDIA`;
                    window.scrollTo(0, 0);
                } else {
                    // Si l'article n'est pas trouvé, efface le hash et retourne à la liste
                    window.location.hash = ''; 
                    setView('list');
                    setSelectedArticle(null);
                    document.title = defaultTitle;
                }
            }
        } else {
            setView('list');
            setSelectedArticle(null);
            setEditingArticle(null);
            document.title = defaultTitle;
        }
    };

    // Vérification initiale au montage du composant ou au chargement des articles
    handleRouting();

    window.addEventListener('hashchange', handleRouting);
    return () => {
        window.removeEventListener('hashchange', handleRouting);
    };
  }, [articles]);
  
  const handleLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error("Email ou mot de passe incorrect.");
    setLoginModalOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleSelectArticle = (article: Article) => {
    window.location.hash = `#/article/${article.slug}`;
  };

  const handleBackToList = () => {
    window.location.hash = '';
  };

  const handleNewArticle = () => {
    setEditingArticle(null);
    setView('form');
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setView('form');
  };

  const handleSaveArticle = async (articleToSave: Article) => {
    const { id, date, ...articleData } = articleToSave;
    
    const dbRecord = {
        ...articleData,
        date: new Date().toISOString() // Met à jour la date à chaque sauvegarde
    };

    let error;
    if (editingArticle) {
        ({ error } = await supabase.from('articles').update(dbRecord).eq('id', id));
    } else {
        ({ error } = await supabase.from('articles').insert(dbRecord));
    }

    if(error) {
        console.error("Error saving article:", error);
        alert("Erreur lors de la sauvegarde.");
    } else {
        await fetchAllData();
        handleBackToList();
    }
  };
  
  const handleDeleteArticle = async (articleId: number | string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
        const { error } = await supabase.from('articles').delete().eq('id', articleId);
        if(error) {
            console.error("Error deleting article:", error);
            alert("Erreur lors de la suppression.");
        } else {
            await fetchAllData();
            handleBackToList();
        }
    }
  };

  const handleSaveSettings = async (newSettings: Settings) => {
    const { id, ...settingsData } = newSettings;
    const { error } = await supabase.from('settings').update(settingsData).eq('id', id);
    if(error) {
        console.error("Error saving settings:", error);
        alert("Erreur lors de la sauvegarde des paramètres.");
    } else {
        setSettings(newSettings);
        setSettingsModalOpen(false);
    }
  };

  const filteredArticles = useMemo(() => {
    return articles
      .filter(article => activeCategory === ALL_CATEGORIES || article.category === activeCategory)
      .filter(article => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
          article.title.toLowerCase().includes(lowerSearchTerm) ||
          article.content.toLowerCase().includes(lowerSearchTerm) ||
          article.author.toLowerCase().includes(lowerSearchTerm) ||
          article.category.toLowerCase().includes(lowerSearchTerm)
        );
      });
  }, [articles, activeCategory, searchTerm]);

  const featuredArticles = useMemo(() => articles.filter(a => a.featured), [articles]);

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
               <div className="font-serif font-bold text-5xl text-primary-dark animate-pulse mb-4 tracking-wider">
                  <span>ELIKIA</span> <span className="text-primary-gold">MEDIA</span>
              </div>
              <p className="text-primary-dark font-serif text-xl">Chargement des données...</p>
          </div>
      );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        onSearch={setSearchTerm}
        onLogout={handleLogout}
        isAdmin={isAdmin}
        onAdminClick={() => isAdmin ? setSettingsModalOpen(true) : setLoginModalOpen(true)}
      />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {view === 'list' && (
          <>
            <FeaturedCarousel articles={featuredArticles} onSelectArticle={handleSelectArticle} />
            <section className="text-center my-12 p-6 sm:p-10 bg-white rounded-lg shadow-lg">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary-dark mb-4">
                    Bienvenue sur <span className="text-primary-gold">ELIKIA MEDIA</span>
                </h2>
                <p className="text-base sm:text-lg max-w-3xl mx-auto text-gray-600 leading-relaxed">
                    Votre source d'information fiable et complète sur l'actualité africaine et internationale. Nous vous offrons une couverture approfondie de la politique, de l'économie, de la société et de la culture.
                </p>
            </section>

            <section className="my-12">
                <div className="text-center mb-8">
                    <h2 className="relative font-serif text-2xl sm:text-3xl font-bold text-primary-dark inline-block">
                        Dernières Actualités
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-primary-gold"></span>
                    </h2>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    <button onClick={() => setActiveCategory(ALL_CATEGORIES)} className={`px-4 py-2 text-sm font-semibold rounded-full transition ${activeCategory === ALL_CATEGORIES ? 'bg-primary-dark text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}>
                        {ALL_CATEGORIES}
                    </button>
                    {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 text-sm font-semibold rounded-full transition ${activeCategory === cat ? 'bg-primary-dark text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}>
                            {cat}
                        </button>
                    ))}
                </div>
                <ArticleGrid 
                    articles={filteredArticles} 
                    onSelectArticle={handleSelectArticle}
                    onEditArticle={handleEditArticle}
                    isAdmin={isAdmin}
                />
                {isAdmin && (
                    <div className="flex justify-center items-center gap-4 mt-12">
                        <button onClick={handleNewArticle} className="flex items-center gap-2 bg-primary-gold text-primary-dark font-bold py-3 px-6 rounded-lg shadow-md hover:bg-[#c19d2d] transition transform hover:-translate-y-1">
                            <PlusIcon className="w-5 h-5" />
                            Nouvel article
                        </button>
                        <button onClick={() => setSettingsModalOpen(true)} className="flex items-center gap-2 bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-300 transition transform hover:-translate-y-1">
                            <CogIcon className="w-5 h-5" />
                            Paramètres
                        </button>
                    </div>
                )}
            </section>
          </>
        )}
        
        {(view === 'detail' || view === 'form') && (
            <button onClick={handleBackToList} className="flex items-center gap-2 mb-6 bg-primary-dark text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition">
                <ArrowLeftIcon className="w-5 h-5" />
                Retour aux articles
            </button>
        )}

        {view === 'detail' && selectedArticle && (
            <ArticleDetail article={selectedArticle} />
        )}

        {view === 'form' && (
            <AdminForm 
                articleToEdit={editingArticle}
                onSave={handleSaveArticle}
                onCancel={handleBackToList}
                onDelete={handleDeleteArticle}
            />
        )}
      </main>

      <Footer settings={settings} onAdminClick={() => isAdmin ? setSettingsModalOpen(true) : setLoginModalOpen(true)} />

      {isLoginModalOpen && <LoginModal onLogin={handleLogin} onClose={() => setLoginModalOpen(false)} />}
      {isSettingsModalOpen && isAdmin && <SettingsModal settings={settings} onSave={handleSaveSettings} onClose={() => setSettingsModalOpen(false)} />}
    </div>
  );
}

export default App;
