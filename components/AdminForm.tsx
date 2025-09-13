import React, { useState, useEffect, useRef } from 'react';
import { Article, Media, MediaType } from '../types';
import { CATEGORIES } from '../constants';
import { supabase } from '../services/supabaseClient';
import { CloseIcon, ImageIcon, VideoIcon, FilePdfIcon, CloudUploadIcon } from './icons';

interface AdminFormProps {
    articleToEdit: Article | null;
    onSave: (article: Article) => Promise<void>;
    onCancel: () => void;
    onDelete: (id: string | number) => Promise<void>;
}

const slugify = (text: string): string => {
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')

    return text.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
}

const AdminForm: React.FC<AdminFormProps> = ({ articleToEdit, onSave, onCancel, onDelete }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [author, setAuthor] = useState('');
    const [featured, setFeatured] = useState(false);
    const [mediaType, setMediaType] = useState<MediaType>('image');
    const [mediaUrl, setMediaUrl] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (articleToEdit) {
            setTitle(articleToEdit.title);
            setCategory(articleToEdit.category);
            setAuthor(articleToEdit.author);
            setFeatured(articleToEdit.featured);
            setMediaType(articleToEdit.media.type);
            setMediaUrl(articleToEdit.media.url);
            if(articleToEdit.media.type === 'image') {
                setImagePreview(articleToEdit.media.url);
            }
            if (contentRef.current) {
                contentRef.current.innerHTML = articleToEdit.content;
            }
        } else {
            setTitle('');
            setCategory('');
            setAuthor('');
            setFeatured(false);
            setMediaType('image');
            setMediaUrl('');
            setImagePreview(null);
            if (contentRef.current) contentRef.current.innerHTML = '';
        }
    }, [articleToEdit]);

    const handleImageUpload = async (file: File) => {
        if (!file || !file.type.startsWith('image/')) return;
        
        setIsUploading(true);
        const localPreviewUrl = URL.createObjectURL(file);
        setImagePreview(localPreviewUrl);

        try {
            const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
            const { error: uploadError } = await supabase.storage.from('media').upload(fileName, file);
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('media').getPublicUrl(fileName);
            setMediaUrl(data.publicUrl);
            setImagePreview(data.publicUrl);
            URL.revokeObjectURL(localPreviewUrl); // Clean up local URL
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Erreur lors du téléversement de l'image.");
            setImagePreview(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const content = contentRef.current?.innerHTML || '';
        if (!title || !category || !author || !content) {
            alert("Veuillez remplir tous les champs obligatoires.");
            return;
        }
        
        setIsSaving(true);
        const media: Media = {
            type: mediaType,
            url: mediaUrl || 'https://picsum.photos/800/600',
        };

        const finalArticle: Article = {
            id: articleToEdit ? articleToEdit.id : Date.now(), // ID handled by parent/DB
            title,
            slug: slugify(title),
            category,
            author,
            content,
            media,
            featured,
            date: '', // Date handled by parent/DB
        };

        await onSave(finalArticle);
        setIsSaving(false);
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl relative max-w-4xl mx-auto">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-primary-dark mb-6 text-center">
                {articleToEdit ? "Modifier l'article" : "Publier un nouvel article"}
            </h3>
            <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <CloseIcon className="w-6 h-6" />
            </button>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-1">Titre</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="form-input" required />
                    </div>
                     <div>
                        <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-1">Catégorie</label>
                        <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="form-input" required>
                            <option value="" disabled>Sélectionnez...</option>
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="author" className="block text-sm font-bold text-gray-700 mb-1">Auteur</label>
                    <input type="text" id="author" value={author} onChange={e => setAuthor(e.target.value)} className="form-input" required />
                </div>
                
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Type de Média</label>
                    <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
                        {(['image', 'video', 'pdf'] as MediaType[]).map(type => (
                            <button key={type} type="button" onClick={() => setMediaType(type)} className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition flex items-center justify-center gap-2 ${mediaType === type ? 'bg-primary-gold text-primary-dark shadow' : 'text-gray-600 hover:bg-gray-200'}`}>
                                {type === 'image' && <ImageIcon className="w-5 h-5"/>}
                                {type === 'video' && <VideoIcon className="w-5 h-5"/>}
                                {type === 'pdf' && <FilePdfIcon className="w-5 h-5"/>}
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {mediaType === 'image' && (
                    <div onDrop={handleFileDrop} onDragOver={e => e.preventDefault()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">
                         {isUploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10"><p className="text-primary-dark font-semibold">Téléversement...</p></div>}
                        <input type="file" id="imageUpload" accept="image/*" className="hidden" onChange={e => e.target.files && handleImageUpload(e.target.files[0])} />
                        <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center">
                            <CloudUploadIcon className="w-12 h-12 text-gray-400 mb-2" />
                            <span className="text-gray-600">Glissez-déposez ou cliquez pour choisir une image</span>
                        </label>
                        {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 max-h-48 mx-auto rounded-md" />}
                    </div>
                )}
                {mediaType === 'video' && (
                    <div>
                        <label htmlFor="videoUrl" className="block text-sm font-bold text-gray-700 mb-1">URL Vidéo (YouTube)</label>
                        <input type="url" id="videoUrl" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} className="form-input" placeholder="https://www.youtube.com/watch?v=..." />
                    </div>
                )}
                {mediaType === 'pdf' && (
                     <div>
                        <label htmlFor="pdfUrl" className="block text-sm font-bold text-gray-700 mb-1">URL du PDF</label>
                        <input type="url" id="pdfUrl" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} className="form-input" placeholder="https://example.com/document.pdf" />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Contenu</label>
                    <div ref={contentRef} contentEditable="true" className="w-full min-h-[200px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-gold focus:border-primary-gold" />
                </div>
                
                <div className="flex items-center">
                    <input type="checkbox" id="featured" checked={featured} onChange={e => setFeatured(e.target.checked)} className="h-4 w-4 text-primary-gold rounded border-gray-300 focus:ring-primary-gold" />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">Mettre à la une</label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                    <button type="submit" disabled={isUploading || isSaving} className="flex-1 btn-primary">{isSaving ? 'Sauvegarde...' : (articleToEdit ? "Mettre à jour" : "Publier")}</button>
                    <button type="button" onClick={onCancel} className="flex-1 btn-secondary">Annuler</button>
                    {articleToEdit && <button type="button" onClick={() => onDelete(articleToEdit.id)} className="flex-1 btn-danger">Supprimer</button>}
                </div>
            </form>
        </div>
    );
};

export default AdminForm;

const globalStyles = `
.form-input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-gold focus:border-primary-gold;
}
.btn-primary {
    @apply bg-primary-gold text-primary-dark font-bold py-2 px-4 rounded-lg shadow-md hover:bg-[#c19d2d] transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-wait;
}
.btn-secondary {
    @apply bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-300 transition transform hover:-translate-y-0.5;
}
.btn-danger {
    @apply bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition transform hover:-translate-y-0.5;
}
`;
if (!document.getElementById('app-dynamic-styles')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'app-dynamic-styles';
    styleSheet.innerText = globalStyles;
    document.head.appendChild(styleSheet);
}