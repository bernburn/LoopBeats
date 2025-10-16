export type InstrumentType = 'bass' | 'lead' | 'pad' | 'kick' | 'snare' | 'hihat' | 'acoustic-guitar' | 'vintage-synth';

export interface Note {
  frequency: number;
  duration: number;
  velocity: number;
}

export interface Track {
  id: string;
  name: string;
  instrument: InstrumentType;
  pattern: boolean[];
  volume: number;
  pan: number;
  muted: boolean;
  solo: boolean;
  notes: number[];
  color: string;
}

export interface InstrumentConfig {
  type: InstrumentType;
  name: string;
  color: string;
  icon: string;
}
