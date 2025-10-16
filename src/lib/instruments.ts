import type { InstrumentType, InstrumentConfig } from '@/types/audio';

export const INSTRUMENTS: Record<InstrumentType, InstrumentConfig> = {
  bass: {
    type: 'bass',
    name: 'Bass Synth',
    color: '#3b82f6',
    icon: '🎸',
  },
  lead: {
    type: 'lead',
    name: 'Lead Synth',
    color: '#8b5cf6',
    icon: '🎹',
  },
  pad: {
    type: 'pad',
    name: 'Pad Synth',
    color: '#ec4899',
    icon: '🎵',
  },
  kick: {
    type: 'kick',
    name: 'Kick Drum',
    color: '#ef4444',
    icon: '🥁',
  },
  snare: {
    type: 'snare',
    name: 'Snare Drum',
    color: '#f97316',
    icon: '🥁',
  },
  hihat: {
    type: 'hihat',
    name: 'Hi-Hat',
    color: '#eab308',
    icon: '🎶',
  },
  'acoustic-guitar': {
    type: 'acoustic-guitar',
    name: 'Acoustic Guitar',
    color: '#d97706',
    icon: '🎸',
  },
  'vintage-synth': {
    type: 'vintage-synth',
    name: 'Vintage Synth',
    color: '#06b6d4',
    icon: '🎛️',
  },
};

export const SCALES = {
  minor: [0, 2, 3, 5, 7, 8, 10, 12],
  major: [0, 2, 4, 5, 7, 9, 11, 12],
  pentatonic: [0, 2, 4, 7, 9, 12],
};

export function getNoteFrequency(noteIndex: number, baseFrequency: number = 220): number {
  const semitones = SCALES.minor[noteIndex % SCALES.minor.length];
  const octaveShift = Math.floor(noteIndex / SCALES.minor.length);
  return baseFrequency * Math.pow(2, (semitones + octaveShift * 12) / 12);
}
