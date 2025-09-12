
import React from 'react';
import { Settings } from '../types';

interface SocialIconProps {
  href: string;
  title: string;
  children: React.ReactNode;
}
const SocialLink: React.FC<SocialIconProps> = ({ href, title, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    title={title}
    className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center text-white text-xl transition duration-300 hover:bg-primary-gold hover:text-primary-dark hover:-translate-y-1"
  >
    {children}
  </a>
);

interface FooterProps {
    settings: Settings;
    onAdminClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ settings, onAdminClick }) => {
    return (
        <footer className="bg-primary-dark text-white pt-12 pb-6 mt-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    {/* Logo and Slogan */}
                    <div className="flex flex-col items-center md:items-start">
                        <div className="font-serif font-bold text-3xl tracking-wider mb-2">
                            <span className="text-white">ELIKIA</span> <span className="text-primary-gold">MEDIA</span>
                        </div>
                        <p className="text-gray-400">L'information au cœur de l'Afrique.</p>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold text-lg mb-4 text-primary-gold">Contactez-nous</h4>
                        <ul className="space-y-2 text-gray-300">
                            <li><p>{settings.address}</p></li>
                            <li><a href={`tel:${settings.phone}`} className="hover:text-primary-gold">{settings.phone}</a></li>
                            <li><a href={`mailto:${settings.email}`} className="hover:text-primary-gold">{settings.email}</a></li>
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-4 text-primary-gold">Suivez-nous</h4>
                        <div className="flex justify-center md:justify-start gap-4">
                           <SocialLink href={settings.facebookUrl} title="Facebook">f</SocialLink>
                           <SocialLink href={settings.whatsappUrl} title="WhatsApp">w</SocialLink>
                           <SocialLink href={settings.youtubeUrl} title="YouTube">y</SocialLink>
                           <SocialLink href={settings.twitterUrl} title="Twitter">t</SocialLink>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-8 pt-6 text-center text-gray-400 text-sm">
                    <p>
                        <span onClick={onAdminClick} className="cursor-pointer hover:text-primary-gold transition" title="Admin Access">
                            &copy;
                        </span> {new Date().getFullYear()} ELIKIA MEDIA. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
