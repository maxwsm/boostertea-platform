"use client";
import type { ComicSeries, Ambassador, Trainee, EasterEgg } from '@myth/types';

export const comicSeries: ComicSeries[] = [
  // SEASON 1: ORIGINS
  {
    id: 1,
    title: 'Series 1',
    subtitle: 'Tea is for Grandmas',
    myth: 'Tea = boredom, old age',
    color: '#FF6B35',
    glowClass: 'glow-orange',
    coverImage: '/comic-series-1.jpg',
    pages: 6,
    status: 'available',
    season: 1,
    hasEasterEgg: false
  },
  {
    id: 2,
    title: 'Series 2',
    subtitle: 'Tea Doesn\'t Energize',
    myth: 'Only coffee gives energy',
    color: '#4A90E2',
    glowClass: 'glow-blue',
    coverImage: '/comic-series-2.jpg',
    pages: 6,
    status: 'available',
    season: 1,
    hasEasterEgg: false
  },
  {
    id: 3,
    title: 'Series 3',
    subtitle: 'Tea is Boring',
    myth: 'Tea = monotony',
    color: '#9B59B6',
    glowClass: 'glow-purple',
    coverImage: '/comic-series-3.jpg',
    pages: 6,
    status: 'available',
    season: 1,
    hasEasterEgg: false
  },
  {
    id: 4,
    title: 'Series 4',
    subtitle: 'Premium Tea is Unaffordable',
    myth: 'Quality = expensive',
    color: '#C9A227',
    glowClass: 'glow-gold',
    coverImage: '/comic-series-4.jpg',
    pages: 6,
    status: 'available',
    season: 1,
    hasEasterEgg: false
  },
  {
    id: 5,
    title: 'Series 5',
    subtitle: 'Tea Can\'t Replace Coffee',
    myth: 'Coffee is irreplaceable',
    color: '#E74C3C',
    glowClass: 'glow-red',
    coverImage: '/comic-series-5.jpg',
    pages: 6,
    status: 'available',
    season: 1,
    hasEasterEgg: true
  },
  {
    id: 6,
    title: 'Series 6',
    subtitle: 'Green Tea = Bitter',
    myth: 'All green tea is bitter',
    color: '#27AE60',
    glowClass: 'glow-green',
    coverImage: '/comic-series-6.jpg',
    pages: 6,
    status: 'available',
    season: 1,
    hasEasterEgg: false
  },
  // SEASON 2: THE SHADOW AWAKENS — COMING SOON
  {
    id: 7,
    title: 'Series 7',
    subtitle: 'Join the MythBusters',
    myth: 'You need to be an expert',
    color: '#00D9C0',
    glowClass: 'glow-teal',
    coverImage: '/comic-series-recruitment.jpg',
    pages: 6,
    status: 'coming-soon',
    season: 2,
    hasEasterEgg: true
  },
  {
    id: 8,
    title: 'Series 8',
    subtitle: 'Tea Dehydrates You',
    myth: 'Tea causes dehydration',
    color: '#3498DB',
    glowClass: 'glow-blue',
    coverImage: '/comic-series-8.jpg',
    pages: 6,
    status: 'coming-soon',
    season: 2,
    hasEasterEgg: false
  },
  {
    id: 9,
    title: 'Series 9',
    subtitle: 'Tea Stains Teeth',
    myth: 'Tea ruins your smile',
    color: '#E91E63',
    glowClass: 'glow-pink',
    coverImage: '/comic-series-9.jpg',
    pages: 6,
    status: 'coming-soon',
    season: 2,
    hasEasterEgg: false
  }
];

export const ambassadors: Ambassador[] = [
  {
    id: 'mykyta',
    name: 'Mykyta',
    role: 'Entrepreneur & Veteran',
    codename: 'Agent of Rebirth',
    age: 28,
    quote: 'I\'ve been through hell and I know: energy saves lives',
    description: 'Founder of BoosterTea. 7 years of service, wounded, demobilized. Created tea that gives 6 hours of energy without the crash.',
    image: '/mykyta-hero.jpg',
    stats: {
      energy: 95,
      focus: 90,
      charisma: 88
    },
    socialLinks: {
      instagram: '@mykyta_boostertea',
      tiktok: '@mykyta_tea',
      youtube: 'MykytaTea'
    }
  },
  {
    id: 'nazar',
    name: 'Nazar',
    role: 'Tea Expert & Bartender',
    codename: 'Tea Mage',
    age: 32,
    quote: '10 years behind the bar taught me: people need an experience, not just a drink',
    description: 'Tea sommelier with 10 years of experience. Creates unique tea cocktails and tastings. Expert in Chinese teas.',
    image: '/nazar-hero.jpg',
    stats: {
      energy: 85,
      focus: 95,
      charisma: 92
    },
    socialLinks: {
      instagram: '@nazar_tea_mage',
      tiktok: '@nazar_bar',
      youtube: 'NazarTeaAlchemy'
    }
  }
];

export const trainees: Trainee[] = [
  {
    id: 'alex',
    name: 'Alex',
    role: 'Data Analyst',
    specialty: 'Science & Research',
    age: 22,
    quote: 'Show me the data, then I\'ll believe',
    description: 'Tech genius with a skeptical mind. Alex approaches every myth with data-driven analysis and scientific methodology.',
    image: '/trainee-alex.jpg',
    mentor: 'Mykyta',
    progress: 45,
    status: 'in-training'
  },
  {
    id: 'maya',
    name: 'Maya',
    role: 'Fitness Trainer',
    specialty: 'Energy & Performance',
    age: 24,
    quote: 'Your body is a machine — fuel it right!',
    description: 'Energetic fitness enthusiast who tests every myth through physical performance and endurance challenges.',
    image: '/trainee-maya.jpg',
    mentor: 'Nazar',
    progress: 62,
    status: 'in-training'
  },
  {
    id: 'leo',
    name: 'Leo',
    role: 'Mixologist',
    specialty: 'Flavor & Creativity',
    age: 26,
    quote: 'Every tea tells a story — I just add the plot twists',
    description: 'Creative bartender who transforms ordinary tea into extraordinary experiences through innovative flavor combinations.',
    image: '/trainee-leo.jpg',
    mentor: 'Nazar',
    progress: 38,
    status: 'in-training'
  }
];

export const easterEggs: EasterEgg[] = [
  {
    id: 'shadow-figure',
    title: 'The Shadow',
    description: 'A mysterious silhouette watching the team from the shadows...',
    seriesId: 5,
    unlocked: false,
    type: 'hidden-object',
    reward: 'Unlock Series 7 early access'
  },
  {
    id: 'qr-discount',
    title: 'Secret Discount',
    description: 'Hidden QR code leads to exclusive 15% off',
    seriesId: 1,
    unlocked: false,
    type: 'qr-code',
    reward: '15% off your first order'
  },
  {
    id: 'caffeine-molecule',
    title: 'Caffeine Formula',
    description: 'The molecular structure hidden in the background',
    seriesId: 2,
    unlocked: false,
    type: 'hidden-object',
    reward: 'Science badge unlocked'
  },
  {
    id: 'trainee-cameo',
    title: 'Future Heroes',
    description: 'Future trainees appear in the crowd scene',
    seriesId: 5,
    unlocked: false,
    type: 'cameo',
    reward: 'Character profile unlocked'
  }
];

export const storyArcs = [
  {
    season: 1,
    title: 'Origins',
    description: 'Mykyta and Nazar establish themselves as the MythBusters of Tea',
    episodes: 'Series 1-6',
    status: 'completed'
  },
  {
    season: 2,
    title: 'The Shadow Awakens',
    description: 'New trainees join the team as a mysterious organization watches',
    episodes: 'Series 7-12',
    status: 'coming-soon'
  },
  {
    season: 3,
    title: 'Syndicate Rising',
    description: 'The Tea Syndicate reveals itself with a shocking betrayal',
    episodes: 'Series 13-18',
    status: 'coming-soon'
  },
  {
    season: 4,
    title: 'Global Conspiracy',
    description: 'The team travels the world to uncover the truth',
    episodes: 'Series 19-24',
    status: 'coming-soon'
  },
  {
    season: 5,
    title: 'The Final Brew',
    description: 'The ultimate showdown between myth and truth',
    episodes: 'Series 25-30',
    status: 'coming-soon'
  }
];
