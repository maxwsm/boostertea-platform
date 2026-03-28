"use client";
export interface ComicSeries {
  id: number;
  title: string;
  subtitle: string;
  myth: string;
  color: string;
  glowClass: string;
  coverImage: string;
  pages: number;
  status: 'available' | 'coming-soon';
  season: number;
  hasEasterEgg?: boolean;
}

export interface Ambassador {
  id: string;
  name: string;
  role: string;
  codename: string;
  age: number;
  quote: string;
  description: string;
  image: string;
  stats: {
    energy: number;
    focus: number;
    charisma: number;
  };
  socialLinks: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
}

export interface Trainee {
  id: string;
  name: string;
  role: string;
  specialty: string;
  age: number;
  quote: string;
  description: string;
  image: string;
  mentor: string;
  progress: number;
  status: 'recruit' | 'in-training' | 'graduate';
}

export interface EasterEgg {
  id: string;
  title: string;
  description: string;
  seriesId: number;
  unlocked: boolean;
  type: 'qr-code' | 'hidden-object' | 'secret-message' | 'cameo';
  reward?: string;
}

export interface ComicPage {
  id: number;
  seriesId: number;
  pageNumber: number;
  panels: ComicPanel[];
}

export interface ComicPanel {
  id: string;
  type: 'splash' | 'medium' | 'closeup' | 'wide';
  image?: string;
  dialogue?: string;
  caption?: string;
  sfx?: string;
}

export interface VideoScript {
  id: string;
  title: string;
  platform: 'tiktok' | 'instagram' | 'youtube';
  duration: string;
  hook: string;
  description: string;
}

export interface UserProgress {
  seriesCompleted: number[];
  easterEggsFound: string[];
  mythsBusted: number;
  charactersUnlocked: string[];
  badges: string[];
}
