import React, { useState, useEffect } from 'react';
import { Settings } from '../types';
import { CloseIcon } from './icons';
import { supabase } from '../services/supabaseClient';

interface SettingsModalProps {
    settings: Settings;
    onSave: (settings: Settings) => Promise<void>;
    onClose: () => void;
}

type Tab = 'social' | 'contact' | 'security';

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
    const [activeTab, setActiveTab] = useState<Tab>('social');
    const [currentSettings, setCurrentSettings] = useState<Settings>(settings);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        setCurrentSettings(settings);
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setCurrentSettings(prev => ({ ...prev, [id]: value }));
    };

    const handlePasswordUpdate = async () => {
        if (!newPassword) return; // Don't update if empty
        if (newPassword.length < 6) {
             throw new Error("Le nouveau mot de passe doit contenir au moins 6 caractères.");
        }
        if (newPassword !== confirmPassword) {
            throw new Error("Les nouveaux mots de passe ne correspondent pas.");
        }
        
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
            throw new Error(error.message || "Erreur lors de la mise à jour du mot de passe.");
        }
    };

    const handleSave = async () => {
        setError('');
        setSuccessMessage('');
        setLoading(true);
        try {
            await handlePasswordUpdate();
            await onSave(currentSettings);
            setSuccessMessage("Paramètres enregistrés avec succès !");
            if (newPassword) {
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (err: any) {
            setError(err.message);
            setActiveTab('security');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl relative animate-fade-in-up">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <h3 className="font-serif text-2xl font-bold text-center text-primary-dark mb-6">Paramètres du site</h3>
                
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <button onClick={() => setActiveTab('social')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'social' ? 'border-primary-gold text-primary-dark' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            Réseaux Sociaux
                        </button>
                        <button onClick={() => setActiveTab('contact')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'contact' ? 'border-primary-gold text-primary-dark' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            Informations de Contact
                        </button>
                         <button onClick={() => setActiveTab('security')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'security' ? 'border-primary-gold text-primary-dark' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            Sécurité
                        </button>
                    </nav>
                </div>

                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
                {successMessage && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-sm">{successMessage}</p>}

                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                    {activeTab === 'social' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SettingsInput id="facebookUrl" label="Facebook URL" value={currentSettings.facebookUrl} onChange={handleChange} />
                            <SettingsInput id="whatsappUrl" label="WhatsApp URL" value={currentSettings.whatsappUrl} onChange={handleChange} />
                            <SettingsInput id="youtubeUrl" label="YouTube URL" value={currentSettings.youtubeUrl} onChange={handleChange} />
                            <SettingsInput id="twitterUrl" label="Twitter URL" value={currentSettings.twitterUrl} onChange={handleChange} />
                            <SettingsInput id="instagramUrl" label="Instagram URL" value={currentSettings.instagramUrl} onChange={handleChange} />
                            <SettingsInput id="linkedinUrl" label="LinkedIn URL" value={currentSettings.linkedinUrl} onChange={handleChange} />
                        </div>
                    )}

                    {activeTab === 'contact' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SettingsInput id="email" label="Email de contact" type="email" value={currentSettings.email} onChange={handleChange} />
                            <SettingsInput id="phone" label="Téléphone" type="tel" value={currentSettings.phone} onChange={handleChange} />
                            <SettingsInput id="address" label="Adresse" value={currentSettings.address} onChange={handleChange} />
                            <SettingsInput id="mapUrl" label="Google Maps URL" value={currentSettings.mapUrl} onChange={handleChange} />
                            <SettingsInput id="hours" label="Heures d'ouverture" value={currentSettings.hours} onChange={handleChange} />
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-4">
                            <h4 className="font-bold text-lg text-primary-dark">Changer le mot de passe</h4>
                            <p className="text-sm text-gray-600">Laissez les champs vides si vous ne souhaitez pas changer le mot de passe.</p>
                            <SettingsInput id="newPassword" label="Nouveau mot de passe (min. 6 caractères)" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            <SettingsInput id="confirmPassword" label="Confirmer le nouveau mot de passe" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                    <button onClick={handleSave} disabled={loading} className="bg-primary-gold text-primary-dark font-bold py-2 px-6 rounded-lg shadow-md hover:bg-[#c19d2d] transition disabled:opacity-50 disabled:cursor-wait">
                        {loading ? 'Sauvegarde...' : 'Enregistrer'}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface SettingsInputProps {
    id: keyof Settings | string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

const SettingsInput: React.FC<SettingsInputProps> = ({ id, label, value, onChange, type = 'text' }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
        <input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-gold focus:border-primary-gold"
        />
    </div>
);

export default SettingsModal;
