import React, { useState } from 'react';
import { CloseIcon } from './icons';

interface LoginModalProps {
    onLogin: (email: string, password: string) => Promise<void>;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await onLogin(email, password);
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue.');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-sm relative animate-fade-in-up">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <h3 className="font-serif text-2xl font-bold text-center text-primary-dark mb-6">Connexion Admin</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-gold focus:border-primary-gold"
                            required
                            placeholder="admin@elikiamedia.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password"  className="block text-sm font-bold text-gray-700 mb-1">Mot de passe</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-gold focus:border-primary-gold"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full bg-primary-gold text-primary-dark font-bold py-3 px-4 rounded-lg shadow-md hover:bg-[#c19d2d] transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-wait">
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
