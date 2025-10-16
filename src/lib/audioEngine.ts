import type { InstrumentType } from "@/types/audio";
import { getNoteFrequency } from "./instruments";

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  initialize(): void {
    if (typeof window === "undefined") return;

    this.audioContext = new AudioContext();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);
    this.masterGain.gain.value = 0.5;
  }

  getContext(): AudioContext | null {
    return this.audioContext;
  }

  playNote(
    instrument: InstrumentType,
    noteIndex: number,
    duration: number,
    volume: number,
    pan: number
  ): void {
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    const gainNode = this.audioContext.createGain();
    const panNode = this.audioContext.createStereoPanner();

    panNode.pan.value = pan;
    gainNode.connect(panNode);
    panNode.connect(this.masterGain);

    switch (instrument) {
      case "kick":
        this.playKick(gainNode, now, volume);
        break;
      case "snare":
        this.playSnare(gainNode, now, volume);
        break;
      case "hihat":
        this.playHihat(gainNode, now, volume);
        break;
      case "bass":
        this.playBass(gainNode, now, noteIndex, duration, volume);
        break;
      case "lead":
        this.playLead(gainNode, now, noteIndex, duration, volume);
        break;
      case "pad":
        this.playPad(gainNode, now, noteIndex, duration, volume);
        break;
      case "acoustic-guitar":
        this.playAcousticGuitar(gainNode, now, noteIndex, duration, volume);
        break;
      case "vintage-synth":
        this.playVintageSynth(gainNode, now, noteIndex, duration, volume);
        break;
    }
  }

  private playKick(
    gainNode: GainNode,
    startTime: number,
    volume: number
  ): void {
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.frequency.setValueAtTime(150, startTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, startTime + 0.5);

    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

    osc.connect(gain);
    gain.connect(gainNode);

    osc.start(startTime);
    osc.stop(startTime + 0.5);
  }

  private playSnare(
    gainNode: GainNode,
    startTime: number,
    volume: number
  ): void {
    if (!this.audioContext) return;

    const noiseBuffer = this.createNoiseBuffer();
    const noise = this.audioContext.createBufferSource();
    const noiseFilter = this.audioContext.createBiquadFilter();
    const gain = this.audioContext.createGain();

    noise.buffer = noiseBuffer;
    noiseFilter.type = "highpass";
    noiseFilter.frequency.value = 1000;

    gain.gain.setValueAtTime(volume * 0.7, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

    noise.connect(noiseFilter);
    noiseFilter.connect(gain);
    gain.connect(gainNode);

    noise.start(startTime);
    noise.stop(startTime + 0.2);
  }

  private playHihat(
    gainNode: GainNode,
    startTime: number,
    volume: number
  ): void {
    if (!this.audioContext) return;

    const noiseBuffer = this.createNoiseBuffer();
    const noise = this.audioContext.createBufferSource();
    const noiseFilter = this.audioContext.createBiquadFilter();
    const gain = this.audioContext.createGain();

    noise.buffer = noiseBuffer;
    noiseFilter.type = "highpass";
    noiseFilter.frequency.value = 7000;

    gain.gain.setValueAtTime(volume * 0.3, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

    noise.connect(noiseFilter);
    noiseFilter.connect(gain);
    gain.connect(gainNode);

    noise.start(startTime);
    noise.stop(startTime + 0.1);
  }

  private playBass(
    gainNode: GainNode,
    startTime: number,
    noteIndex: number,
    duration: number,
    volume: number
  ): void {
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    const frequency = getNoteFrequency(noteIndex, 110);
    osc.frequency.value = frequency;
    osc.type = "sawtooth";

    filter.type = "lowpass";
    filter.frequency.value = 800;

    gain.gain.setValueAtTime(volume * 0.6, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(gainNode);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private playLead(
    gainNode: GainNode,
    startTime: number,
    noteIndex: number,
    duration: number,
    volume: number
  ): void {
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    const frequency = getNoteFrequency(noteIndex, 440);
    osc.frequency.value = frequency;
    osc.type = "square";

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume * 0.3, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    osc.connect(gain);
    gain.connect(gainNode);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private playPad(
    gainNode: GainNode,
    startTime: number,
    noteIndex: number,
    duration: number,
    volume: number
  ): void {
    if (!this.audioContext) return;

    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    const frequency = getNoteFrequency(noteIndex, 220);
    osc1.frequency.value = frequency;
    osc2.frequency.value = frequency * 1.01;
    osc1.type = "sine";
    osc2.type = "sine";

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume * 0.2, startTime + 0.1);
    gain.gain.setValueAtTime(volume * 0.2, startTime + duration - 0.1);
    gain.gain.linearRampToValueAtTime(0.01, startTime + duration);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(gainNode);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
  }

  private playAcousticGuitar(
    gainNode: GainNode,
    startTime: number,
    noteIndex: number,
    duration: number,
    volume: number
  ): void {
    if (!this.audioContext) return;

    // Create 6 oscillators to simulate guitar strings with harmonics
    const frequency = getNoteFrequency(noteIndex, 330);

    // Main string fundamental
    const osc1 = this.audioContext.createOscillator();
    osc1.frequency.value = frequency;
    osc1.type = "triangle";

    // Harmonics (overtones)
    const osc2 = this.audioContext.createOscillator();
    osc2.frequency.value = frequency * 2; // 2nd harmonic
    osc2.type = "sine";

    const osc3 = this.audioContext.createOscillator();
    osc3.frequency.value = frequency * 3; // 3rd harmonic
    osc3.type = "sine";

    // Slight detuning for richness
    const osc4 = this.audioContext.createOscillator();
    osc4.frequency.value = frequency * 1.005;
    osc4.type = "triangle";

    // Body resonance filter
    const bodyFilter = this.audioContext.createBiquadFilter();
    bodyFilter.type = "bandpass";
    bodyFilter.frequency.value = 200;
    bodyFilter.Q.value = 1;

    // String brightness filter
    const brightnessFilter = this.audioContext.createBiquadFilter();
    brightnessFilter.type = "lowpass";
    brightnessFilter.frequency.value = 3500;
    brightnessFilter.Q.value = 1;

    const gain = this.audioContext.createGain();

    // Plucked envelope - sharp attack, gradual decay
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume * 0.5, startTime + 0.005); // Fast attack
    gain.gain.exponentialRampToValueAtTime(volume * 0.3, startTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    // Connect all oscillators with different gain levels
    const osc1Gain = this.audioContext.createGain();
    osc1Gain.gain.value = 0.4; // Fundamental
    const osc2Gain = this.audioContext.createGain();
    osc2Gain.gain.value = 0.15; // 2nd harmonic
    const osc3Gain = this.audioContext.createGain();
    osc3Gain.gain.value = 0.08; // 3rd harmonic
    const osc4Gain = this.audioContext.createGain();
    osc4Gain.gain.value = 0.2; // Detuned

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
    gain.connect(gainNode);

    osc1.start(startTime);
    osc2.start(startTime);
    osc3.start(startTime);
    osc4.start(startTime);

    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
    osc3.stop(startTime + duration);
    osc4.stop(startTime + duration);
  }

  private playVintageSynth(
    gainNode: GainNode,
    startTime: number,
    noteIndex: number,
    duration: number,
    volume: number
  ): void {
    if (!this.audioContext) return;

    const frequency = getNoteFrequency(noteIndex, 220);

    // Dual oscillators (classic analog sound)
    const osc1 = this.audioContext.createOscillator();
    osc1.frequency.value = frequency;
    osc1.type = "sawtooth";

    const osc2 = this.audioContext.createOscillator();
    osc2.frequency.value = frequency * 1.007; // Slight detune
    osc2.type = "square";

    // LFO for vibrato
    const lfo = this.audioContext.createOscillator();
    lfo.frequency.value = 5; // 5Hz vibrato
    const lfoGain = this.audioContext.createGain();
    lfoGain.gain.value = 10; // Vibrato depth
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);

    // Classic lowpass filter with resonance
    const filter = this.audioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1200;
    filter.Q.value = 5; // Resonance

    // Filter envelope - opens over time
    filter.frequency.setValueAtTime(400, startTime);
    filter.frequency.linearRampToValueAtTime(1200, startTime + 0.15);
    filter.frequency.exponentialRampToValueAtTime(600, startTime + duration);

    // Chorus effect (slight modulation)
    const chorus = this.audioContext.createDelay();
    chorus.delayTime.value = 0.02;
    const chorusLfo = this.audioContext.createOscillator();
    chorusLfo.frequency.value = 2;
    const chorusDepth = this.audioContext.createGain();
    chorusDepth.gain.value = 0.005;
    chorusLfo.connect(chorusDepth);
    chorusDepth.connect(chorus.delayTime);

    // ADSR envelope
    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume * 0.4, startTime + 0.05); // Attack
    gain.gain.linearRampToValueAtTime(volume * 0.3, startTime + 0.15); // Decay
    gain.gain.setValueAtTime(volume * 0.3, startTime + duration - 0.1); // Sustain
    gain.gain.linearRampToValueAtTime(0.01, startTime + duration); // Release

    // Connect signal path
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(chorus);
    filter.connect(gain); // Dry signal
    chorus.connect(gain); // Wet signal (chorus)
    gain.connect(gainNode);

    // Start all components
    lfo.start(startTime);
    chorusLfo.start(startTime);
    osc1.start(startTime);
    osc2.start(startTime);

    lfo.stop(startTime + duration);
    chorusLfo.stop(startTime + duration);
    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
  }

  private createNoiseBuffer(): AudioBuffer {
    if (!this.audioContext) throw new Error("Audio context not initialized");

    const bufferSize = this.audioContext.sampleRate * 0.5;
    const buffer = this.audioContext.createBuffer(
      1,
      bufferSize,
      this.audioContext.sampleRate
    );
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    return buffer;
  }

  stop(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.masterGain = null;
    }
  }
}

// Export a singleton instance so imports like `import { audioEngine } from '@/lib/audioEngine'` work
export const audioEngine = new AudioEngine();
