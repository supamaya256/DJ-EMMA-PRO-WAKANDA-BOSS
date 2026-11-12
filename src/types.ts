export interface LiveMix {
  id: string;
  title: string;
  description: string;
  genre: string;
  duration: string;
  audioUrl: string;
  coverUrl: string;
  isPublished: boolean;
  playsCount: number;
  likesCount: number;
  createdAt: string;
}

export interface NonstopMix {
  id: string;
  title: string;
  description: string;
  genre: string;
  duration: string;
  audioUrl: string;
  coverUrl: string;
  tracklist: string[];
  isPublished: boolean;
  playsCount: number;
  likesCount: number;
  createdAt: string;
}

export interface NewsPost {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  isPublished: boolean;
  likesCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreativeService {
  id: string;
  title: string;
  desc: string;
}

export interface ArtistInfo {
  id: string;
  stageName: string;
  alias: string;
  tagline: string;
  bio: string;
  origin: string;
  baseLocation: string;
  phone: string;
  email: string;
  bookingWhatsapp: string;
  avatarUrl: string;
  heroPortraitUrl: string;
  socialLinks: {
    tiktok: string;
    instagram: string;
    youtube: string;
    facebook: string;
  };
  services: CreativeService[];
}

export interface HomepageConfig {
  heroTitle: string;
  heroSubtitle: string;
  tagline: string;
  featuredMixId: string;
}

export interface SupabaseStatus {
  configured: boolean;
  connected: boolean;
  storageMode: 'supabase-cloud' | 'server-persistent';
  message: string;
  error?: string;
  projectUrl?: string;
  allTablesCreated?: boolean;
  tables?: {
    news_posts: boolean;
    live_mixes: boolean;
    nonstop_mixes: boolean;
    artist_info: boolean;
  };
  config?: {
    url: string;
    anonKey: string;
    serviceRoleKey?: string;
  };
}

export type ActiveTab = 'home' | 'live-mixes' | 'nonstops' | 'about-me' | 'admin' | 'privacy-policy' | 'terms-conditions';

export interface Comment {
  id: string;
  targetId: string;
  targetType: 'news' | 'live' | 'nonstop';
  authorName: string;
  content: string;
  createdAt: string;
}
