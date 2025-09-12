
import React, { useState } from 'react';
import { BarsIcon, SearchIcon, SignOutIcon, CloseIcon } from './icons';

interface HeaderProps {
    onSearch: (term: string) => void;
    onLogout: () => void;
    isAdmin: boolean;
    onAdminClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onLogout, isAdmin }) => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm);
    };
    
    return (
        <header className="bg-gradient-to-r from-primary-dark to-[#1a3d6d] text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Site branding */}
                    <div className="flex-shrink-0 mr-4">
                        <a href="#" className="flex items-center">
                             <span className="font-serif font-bold text-2xl tracking-wider">
                                <span className="text-white">ELIKIA</span> <span className="text-primary-gold">MEDIA</span>
                            </span>
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex md:grow">
                        {/* Search form */}
                        <form onSubmit={handleSearch} className="flex grow max-w-md mx-auto">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white bg-opacity-20 text-white placeholder-gray-300 px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-gold"
                                placeholder="Rechercher des articles..."
                            />
                            <button type="submit" className="bg-primary-gold text-primary-dark px-4 rounded-r-md hover:bg-[#c19d2d] transition">
                                <SearchIcon className="w-5 h-5" />
                            </button>
                        </form>
                    </nav>

                    <div className="flex items-center gap-4">
                        {isAdmin && (
                            <button onClick={onLogout} className="hidden md:flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition">
                                <SignOutIcon className="w-5 h-5" />
                                <span>Déconnexion</span>
                            </button>
                        )}
                        
                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button onClick={() => setMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                {isMenuOpen ? <CloseIcon className="h-6 w-6" /> : <BarsIcon className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                         <form onSubmit={handleSearch} className="flex p-2">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white bg-opacity-20 text-white placeholder-gray-300 px-4 py-2 rounded-l-md focus:outline-none"
                                placeholder="Rechercher..."
                            />
                            <button type="submit" className="bg-primary-gold text-primary-dark px-4 rounded-r-md">
                                <SearchIcon className="w-5 h-5" />
                            </button>
                        </form>
                        {isAdmin && (
                            <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-3 py-2 rounded-md font-medium hover:bg-red-700 transition mt-2">
                                <SignOutIcon className="w-5 h-5" />
                                Déconnexion
                            </button>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
