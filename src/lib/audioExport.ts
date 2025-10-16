import type { Track, InstrumentType } from '@/types/audio';
import { getNoteFrequency } from './instruments';

const SAMPLE_RATE = 44100;
const STEPS = 16;

export class AudioExporter {
  private static createOfflineContext(durationInSeconds: number): OfflineAudioContext {
    const samples = Math.ceil(SAMPLE_RATE * durationInSeconds);
    return new OfflineAudioContext(2, samples, SAMPLE_RATE);
  }

  private static async renderKick(
    ctx: OfflineAudioContext,
    startTime: number,
    volume: number,
    pan: number
  ): Promise<void> {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panNode = ctx.createStereoPanner();

    osc.frequency.setValueAtTime(150, startTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, startTime + 0.5);

    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

    panNode.pan.value = pan;

    osc.connect(gain);
    gain.connect(panNode);
    panNode.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.5);
  }

  private static async renderSnare(
    ctx: OfflineAudioContext,
    startTime: number,
    volume: number,
    pan: number
  ): Promise<void> {
    const bufferSize = ctx.sampleRate * 0.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    const noiseFilter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    const panNode = ctx.createStereoPanner();

    noise.buffer = buffer;
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;

    gain.gain.setValueAtTime(volume * 0.7, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

    panNode.pan.value = pan;

    noise.connect(noiseFilter);
    noiseFilter.connect(gain);
    gain.connect(panNode);
    panNode.connect(ctx.destination);

    noise.start(startTime);
    noise.stop(startTime + 0.2);
  }

  private static async renderHihat(
    ctx: OfflineAudioContext,
    startTime: number,
    volume: number,
    pan: number
  ): Promise<void> {
    const bufferSize = ctx.sampleRate * 0.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    const noiseFilter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    const panNode = ctx.createStereoPanner();

    noise.buffer = buffer;
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 7000;

    gain.gain.setValueAtTime(volume * 0.3, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

    panNode.pan.value = pan;

    noise.connect(noiseFilter);
    noiseFilter.connect(gain);
    gain.connect(panNode);
    panNode.connect(ctx.destination);

    noise.start(startTime);
    noise.stop(startTime + 0.1);
  }

  private static async renderBass(
    ctx: OfflineAudioContext,
    startTime: number,
    noteIndex: number,
    duration: number,
    volume: number,
    pan: number
  ): Promise<void> {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const panNode = ctx.createStereoPanner();

    const frequency = getNoteFrequency(noteIndex, 110);
    osc.frequency.value = frequency;
    osc.type = 'sawtooth';

    filter.type = 'lowpass';
    filter.frequency.value = 800;

    gain.gain.setValueAtTime(volume * 0.6, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    panNode.pan.value = pan;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(panNode);
    panNode.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private static async renderLead(
    ctx: OfflineAudioContext,
    startTime: number,
    noteIndex: number,
    duration: number,
    volume: number,
    pan: number
  ): Promise<void> {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panNode = ctx.createStereoPanner();

    const frequency = getNoteFrequency(noteIndex, 440);
    osc.frequency.value = frequency;
    osc.type = 'square';

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume * 0.3, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    panNode.pan.value = pan;

    osc.connect(gain);
    gain.connect(panNode);
    panNode.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private static async renderPad(
    ctx: OfflineAudioContext,
    startTime: number,
    noteIndex: number,
    duration: number,
    volume: number,
    pan: number
  ): Promise<void> {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const panNode = ctx.createStereoPanner();

    const frequency = getNoteFrequency(noteIndex, 220);
    osc1.frequency.value = frequency;
    osc2.frequency.value = frequency * 1.01;
    osc1.type = 'sine';
    osc2.type = 'sine';

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume * 0.2, startTime + 0.1);
    gain.gain.setValueAtTime(volume * 0.2, startTime + duration - 0.1);
    gain.gain.linearRampToValueAtTime(0.01, startTime + duration);

    panNode.pan.value = pan;

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(panNode);
    panNode.connect(ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
  }

  private static async renderTrack(
    ctx: OfflineAudioContext,
    track: Track,
    bpm: number
  ): Promise<void> {
    const stepDuration = 60 / bpm / 4;

    for (let i = 0; i < track.pattern.length; i++) {
      if (track.pattern[i] && !track.muted) {
        const startTime = i * stepDuration;
        const noteIndex = 0;
        const duration = stepDuration * 0.8;

        switch (track.instrument) {
          case 'kick':
            await this.renderKick(ctx, startTime, track.volume, track.pan);
            break;
          case 'snare':
            await this.renderSnare(ctx, startTime, track.volume, track.pan);
            break;
          case 'hihat':
            await this.renderHihat(ctx, startTime, track.volume, track.pan);
            break;
          case 'bass':
            await this.renderBass(ctx, startTime, noteIndex, duration, track.volume, track.pan);
            break;
          case 'lead':
            await this.renderLead(ctx, startTime, noteIndex, duration, track.volume, track.pan);
            break;
          case 'pad':
            await this.renderPad(ctx, startTime, noteIndex, duration, track.volume, track.pan);
            break;
          case 'acoustic-guitar':
            await this.renderAcousticGuitar(ctx, startTime, noteIndex, duration, track.volume, track.pan);
            break;
          case 'vintage-synth':
            await this.renderVintageSynth(ctx, startTime, noteIndex, duration, track.volume, track.pan);
            break;
        }
      }
    }
  }

  private static async renderAcousticGuitar(
    ctx: OfflineAudioContext,
    startTime: number,
    noteIndex: number,
    duration: number,
    volume: number,
    pan: number
  ): Promise<void> {
    const frequency = getNoteFrequency(noteIndex, 330);
    
    const osc1 = ctx.createOscillator();
    osc1.frequency.value = frequency;
    osc1.type = 'triangle';
    
    const osc2 = ctx.createOscillator();
    osc2.frequency.value = frequency * 2;
    osc2.type = 'sine';
    
    const osc3 = ctx.createOscillator();
    osc3.frequency.value = frequency * 3;
    osc3.type = 'sine';
    
    const osc4 = ctx.createOscillator();
    osc4.frequency.value = frequency * 1.005;
    osc4.type = 'triangle';

    const bodyFilter = ctx.createBiquadFilter();
    bodyFilter.type = 'bandpass';
    bodyFilter.frequency.value = 200;
    bodyFilter.Q.value = 1;

    const brightnessFilter = ctx.createBiquadFilter();
    brightnessFilter.type = 'lowpass';
    brightnessFilter.frequency.value = 3500;
    brightnessFilter.Q.value = 1;

    const gain = ctx.createGain();
    const panNode = ctx.createStereoPanner();
    panNode.pan.value = pan;
    
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume * 0.5, startTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(volume * 0.3, startTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    const osc1Gain = ctx.createGain();
    osc1Gain.gain.value = 0.4;
    const osc2Gain = ctx.createGain();
    osc2Gain.gain.value = 0.15;
    const osc3Gain = ctx.createGain();
    osc3Gain.gain.value = 0.08;
    const osc4Gain = ctx.createGain();
    osc4Gain.gain.value = 0.2;

    osc1.connect(osc1Gain);
    osc2.connect(osc2Gain);
    osc3.connect(osc3Gain);
    osc4.connect(osc4Gain);
    
    osc1Gain.connect(bodyFilter);
    osc2Gain.connect(bodyFilter);
    osc3Gain.connect(bodyFilter);
    osc4Gain.connect(bodyFilter);
    
    bodyFilter.connect(brightnessFilter);
    brightnessFilter.connect(gain);
    gain.connect(panNode);
    panNode.connect(ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);
    osc3.start(startTime);
    osc4.start(startTime);
    
    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
    osc3.stop(startTime + duration);
    osc4.stop(startTime + duration);
  }

  private static async renderVintageSynth(
    ctx: OfflineAudioContext,
    startTime: number,
    noteIndex: number,
    duration: number,
    volume: number,
    pan: number
  ): Promise<void> {
    const frequency = getNoteFrequency(noteIndex, 220);
    
    const osc1 = ctx.createOscillator();
    osc1.frequency.value = frequency;
    osc1.type = 'sawtooth';
    
    const osc2 = ctx.createOscillator();
    osc2.frequency.value = frequency * 1.007;
    osc2.type = 'square';

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 5;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 10;
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;
    filter.Q.value = 5;
    
    filter.frequency.setValueAtTime(400, startTime);
    filter.frequency.linearRampToValueAtTime(1200, startTime + 0.15);
    filter.frequency.exponentialRampToValueAtTime(600, startTime + duration);

    const chorus = ctx.createDelay();
    chorus.delayTime.value = 0.02;
    const chorusLfo = ctx.createOscillator();
    chorusLfo.frequency.value = 2;
    const chorusDepth = ctx.createGain();
    chorusDepth.gain.value = 0.005;
    chorusLfo.connect(chorusDepth);
    chorusDepth.connect(chorus.delayTime);

    const gain = ctx.createGain();
    const panNode = ctx.createStereoPanner();
    panNode.pan.value = pan;
    
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume * 0.4, startTime + 0.05);
    gain.gain.linearRampToValueAtTime(volume * 0.3, startTime + 0.15);
    gain.gain.setValueAtTime(volume * 0.3, startTime + duration - 0.1);
    gain.gain.linearRampToValueAtTime(0.01, startTime + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(chorus);
    filter.connect(gain);
    chorus.connect(gain);
    gain.connect(panNode);
    panNode.connect(ctx.destination);

    lfo.start(startTime);
    chorusLfo.start(startTime);
    osc1.start(startTime);
    osc2.start(startTime);
    
    lfo.stop(startTime + duration);
    chorusLfo.stop(startTime + duration);
    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
  }

  private static async mixTracks(
    tracks: Track[], 
    bpm: number, 
    beatLength: number, 
    loopDuration: number
  ): Promise<AudioBuffer> {
    const patternDuration = STEPS * (60 / bpm / 4);
    const totalDuration = loopDuration > 0 ? loopDuration : beatLength;
    const iterations = Math.ceil(totalDuration / patternDuration);
    
    const ctx = this.createOfflineContext(totalDuration);

    // Render the pattern multiple times to fill the loop duration
    for (let iteration = 0; iteration < iterations; iteration++) {
      const iterationStartTime = iteration * patternDuration;
      
      for (const track of tracks) {
        await this.renderTrackAtOffset(ctx, track, bpm, iterationStartTime);
      }
    }

    return await ctx.startRendering();
  }

  private static async renderTrackAtOffset(
    ctx: OfflineAudioContext,
    track: Track,
    bpm: number,
    offset: number
  ): Promise<void> {
    const stepDuration = 60 / bpm / 4;

    for (let i = 0; i < track.pattern.length; i++) {
      if (track.pattern[i] && !track.muted) {
        const startTime = offset + (i * stepDuration);
        const noteIndex = 0;
        const duration = stepDuration * 0.8;

        switch (track.instrument) {
          case 'kick':
            await this.renderKick(ctx, startTime, track.volume, track.pan);
            break;
          case 'snare':
            await this.renderSnare(ctx, startTime, track.volume, track.pan);
            break;
          case 'hihat':
            await this.renderHihat(ctx, startTime, track.volume, track.pan);
            break;
          case 'bass':
            await this.renderBass(ctx, startTime, noteIndex, duration, track.volume, track.pan);
            break;
          case 'lead':
            await this.renderLead(ctx, startTime, noteIndex, duration, track.volume, track.pan);
            break;
          case 'pad':
            await this.renderPad(ctx, startTime, noteIndex, duration, track.volume, track.pan);
            break;
          case 'acoustic-guitar':
            await this.renderAcousticGuitar(ctx, startTime, noteIndex, duration, track.volume, track.pan);
            break;
          case 'vintage-synth':
            await this.renderVintageSynth(ctx, startTime, noteIndex, duration, track.volume, track.pan);
            break;
        }
      }
    }
  }

  private static createWavBlob(audioBuffer: AudioBuffer): Blob {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length * numberOfChannels * 2;
    const wavBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(wavBuffer);

    const writeString = (offset: number, string: string): void => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, audioBuffer.sampleRate, true);
    view.setUint32(28, audioBuffer.sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length, true);

    const channels: Float32Array[] = [];
    for (let i = 0; i < numberOfChannels; i++) {
      channels.push(audioBuffer.getChannelData(i));
    }

    let offset = 44;
    for (let i = 0; i < audioBuffer.length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channels[channel][i]));
        view.setInt16(offset, sample * 0x7fff, true);
        offset += 2;
      }
    }

    return new Blob([wavBuffer], { type: 'audio/wav' });
  }

  static async exportAsWAV(
    tracks: Track[], 
    bpm: number, 
    filename: string, 
    beatLength: number = 4, 
    loopDuration: number = 0
  ): Promise<void> {
    const audioBuffer = await this.mixTracks(tracks, bpm, beatLength, loopDuration);
    const wavBlob = this.createWavBlob(audioBuffer);
    
    const url = URL.createObjectURL(wavBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static async exportAsMP3(
    tracks: Track[], 
    bpm: number, 
    filename: string, 
    beatLength: number = 4, 
    loopDuration: number = 0
  ): Promise<void> {
    const audioBuffer = await this.mixTracks(tracks, bpm, beatLength, loopDuration);
    const wavBlob = this.createWavBlob(audioBuffer);
    
    const url = URL.createObjectURL(wavBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static exportProject(tracks: Track[], bpm: number, filename: string): void {
    const projectData = {
      version: '1.0.0',
      bpm,
      tracks: tracks.map((track) => ({
        id: track.id,
        name: track.name,
        instrument: track.instrument,
        pattern: track.pattern,
        volume: track.volume,
        pan: track.pan,
        muted: track.muted,
        solo: track.solo,
        color: track.color,
      })),
      createdAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.beatit.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
