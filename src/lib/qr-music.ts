export interface MusicPreset {
  id: string;
  name: string;
  nameSo: string;
  icon: string;
  url: string;
  isPremium?: boolean;
  startTime?: number;
}

export const MUSIC_PRESETS: MusicPreset[] = [
  {
    id: 'none',
    name: 'No Music',
    nameSo: 'Muusig la\'aan',
    icon: '🔇',
    url: '',
  },
  {
    id: 'calm-piano',
    name: 'Calm Piano',
    nameSo: 'Piano deggan',
    icon: '🎹',
    url: 'https://cdn.pixabay.com/audio/2024/11/28/audio_3a4e323fa2.mp3',
  },
  {
    id: 'emotional-strings',
    name: 'Emotional Strings',
    nameSo: 'Muusig dareenka leh',
    icon: '🎻',
    url: 'https://cdn.pixabay.com/audio/2025/03/28/audio_9e7a31d6b1.mp3',
  },
  {
    id: 'soft-ambient',
    name: 'Soft Ambient',
    nameSo: 'Cod deggan',
    icon: '🌊',
    url: 'https://cdn.pixabay.com/audio/2024/09/09/audio_e7f9fd0348.mp3',
  },
  {
    id: 'gentle-guitar',
    name: 'Gentle Guitar',
    nameSo: 'Gitaar fudud',
    icon: '🎸',
    url: 'https://cdn.pixabay.com/audio/2025/01/10/audio_4aaea1dbfb.mp3',
  },
  {
    id: 'nature',
    name: 'Nature Sounds',
    nameSo: 'Codka dabiiciga',
    icon: '🌿',
    url: 'https://cdn.pixabay.com/audio/2024/08/02/audio_dc39af6189.mp3',
    isPremium: true,
  },
  {
    id: 'iris',
    name: 'Iris - Goo Goo Dolls',
    nameSo: 'Iris (Aaway Jacaylkii)',
    icon: '✨',
    url: 'https://ia801309.us.archive.org/28/items/GooGooDollsIris/Goo%20Goo%20Dolls%20-%20Iris.mp3',
    isPremium: false,
    startTime: 163, // Starts at "When everything feels like the movies..."
  },
  {
    id: 'everything',
    name: 'Everything - Michael Bublé',
    nameSo: 'Everything (Adaa Wax Waal)',
    icon: '💖',
    url: 'https://archive.org/download/MichaelBubleEverything/Michael%20Buble%20-%20Everything.mp3',
    isPremium: true,
  },
];
