export type MediaType = 'image' | 'video' | 'pdf';

export interface Media {
  type: MediaType;
  url: string;
  filename?: string;
}

export interface Article {
  id: number | string;
  title: string;
  slug: string;
  category: string;
  author: string;
  media: Media;
  content: string; // HTML content
  date: string;
  featured: boolean;
}

export interface Settings {
  id?: number;
  facebookUrl: string;
  whatsappUrl: string;

  youtubeUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  email: string;
  phone: string;
  address: string;
  mapUrl: string;
  hours: string;
}