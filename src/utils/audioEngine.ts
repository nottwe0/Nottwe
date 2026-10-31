/**
 * High-fidelity, 100% royalty-free procedural Web Audio synthesizer
 * and Natural Influencer Voice controller for Koralina's 17-second Seoul vlog.
 */

class VlogAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;
  private bgmIntervalId: number | null = null;
  private voiceEnabled: boolean = true;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private isSpeaking: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoice();
      };
      this.initVoice();
    }
  }

  public initVoice() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    // Prioritize warm, highly-rated natural female voices that sound like a friendly vlogger
    const naturalVoice =
      voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Jenny') ||
            v.name.includes('Samantha') ||
            v.name.includes('Victoria') ||
            v.name.includes('Google US English') ||
            v.name.includes('Karen') ||
            v.name.includes('Zira') ||
            v.name.includes('Serena'))
      ) ||
      voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Female') || !v.name.includes('Male'))) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0];

    this.selectedVoice = naturalVoice;
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    return window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith('en'));
  }

  public setVoice(voice: SpeechSynthesisVoice) {
    this.selectedVoice = voice;
  }

  public getSelectedVoice(): SpeechSynthesisVoice | null {
    return this.selectedVoice;
  }

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.ctx) {
      if (this.bgmGain) {
        this.bgmGain.gain.setValueAtTime(muted ? 0 : 0.20, this.ctx.currentTime);
      }
      if (this.sfxGain) {
        this.sfxGain.gain.setValueAtTime(muted ? 0 : 0.35, this.ctx.currentTime);
      }
    }
    if (muted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  public setVoiceEnabled(enabled: boolean) {
    this.voiceEnabled = enabled;
    if (!enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  /**
   * Speak vlog voiceover segment with warm, conversational influencer inflection
   */
  public speakSceneScript(text: string, onStart?: () => void, onEnd?: () => void) {
    if (this.isMuted || !this.voiceEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    if (!this.selectedVoice) {
      this.initVoice();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    // Warm, friendly influencer delivery parameters:
    // Slightly elevated pitch for enthusiastic vlog feel, natural conversational rate
    utterance.pitch = 1.06;
    utterance.rate = 0.98;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
    };

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  /**
   * Procedural Lofi Vlog Background Music:
   * Warm chillhop / Hongdae street vibe with Rhodes electric piano and soft acoustic bass
   */
  public startBGM() {
    if (this.isBgmPlaying) return;
    const ctx = this.ensureContext();
    this.isBgmPlaying = true;

    // Master gains
    this.bgmGain = ctx.createGain();
    this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : 0.18, ctx.currentTime);
    this.bgmGain.connect(ctx.destination);

    this.sfxGain = ctx.createGain();
    this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, ctx.currentTime);
    this.sfxGain.connect(ctx.destination);

    // Warm jazz chord progression: Dmaj7 -> Bm7 -> Em7 -> A7sus4
    const chords = [
      [146.83, 220.0, 277.18, 369.99], // Dmaj7 (D3, A3, C#4, F#4)
      [123.47, 185.0, 246.94, 293.66], // Bm7 (B2, F#3, B3, D4)
      [164.81, 196.0, 246.94, 329.63], // Em7 (E3, G3, B3, E4)
      [110.0, 220.0, 293.66, 329.63],  // A7sus4 (A2, A3, D4, E4)
    ];

    let chordIdx = 0;
    const playChord = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
      const notes = chords[chordIdx % chords.length];
      chordIdx++;
      const now = this.ctx.currentTime;
      const chordDuration = 2.0;

      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const filter = this.ctx!.createBiquadFilter();

        osc.type = i === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800 + i * 150, now);
        filter.frequency.exponentialRampToValueAtTime(350, now + chordDuration);

        const noteVolume = 0.07 / notes.length;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(noteVolume, now + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + chordDuration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmGain!);

        osc.start(now);
        osc.stop(now + chordDuration);
      });

      // Mellow bass note
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(notes[0], now);

      bassGain.gain.setValueAtTime(0.001, now);
      bassGain.gain.linearRampToValueAtTime(0.07, now + 0.05);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + chordDuration * 0.9);

      bassOsc.connect(bassGain);
      bassGain.connect(this.bgmGain);
      bassOsc.start(now);
      bassOsc.stop(now + chordDuration);
    };

    playChord();
    this.bgmIntervalId = window.setInterval(playChord, 2050);
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmIntervalId !== null) {
      window.clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
    }
  }

  /**
   * Sound effect: Camera shutter click with mechanical release
   */
  public playCameraShutter() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 0.07;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1600, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.24, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGain || ctx.destination);

    whiteNoise.start(now);

    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'square';
    clickOsc.frequency.setValueAtTime(350, now);
    clickOsc.frequency.exponentialRampToValueAtTime(70, now + 0.035);

    clickGain.gain.setValueAtTime(0.18, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    clickOsc.connect(clickGain);
    clickGain.connect(this.sfxGain || ctx.destination);

    clickOsc.start(now);
    clickOsc.stop(now + 0.04);
  }

  /**
   * Sound effect: Photobooth countdown beep (3-2-1)
   */
  public playCountdownBeep(isFinal: boolean = false) {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const freq = isFinal ? 1760 : 880;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain || ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  /**
   * Sound effect: Photo print mechanical sliding feed
   */
  public playPrintSound() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(190, now + 0.35);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain || ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }
}

export const vlogAudio = new VlogAudioEngine();
