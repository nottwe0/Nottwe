export interface VideoScene {
  id: number;
  phase: 'Hook' | 'Explain' | 'Close';
  timeRange: [number, number]; // in seconds e.g. [0, 5]
  durationSec: number;
  imageSrc: string;
  imageAlt: string;
  subtitles: {
    line1: string;
    line2?: string;
  };
  voiceOverText: string;
  wordCount: number;
  cameraMovement: string;
  visualAction: string;
  sfxNotes: string;
  culturalNote?: string;
}

export interface CultureItem {
  id: string;
  koreanText: string;
  romanization: string;
  meaning: string;
  explanation: string;
  tag: string;
}

export interface PhotoBoothPose {
  id: string;
  name: string;
  koreanName: string;
  description: string;
  funFact: string;
  iconName: string;
}

export interface PhotoStripFrame {
  id: string;
  name: string;
  bgColor: string;
  textColor: string;
  accentBorder: string;
}
