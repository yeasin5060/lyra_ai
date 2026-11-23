export interface SynthesisOptions {
  pitch?: number;
  rate?: number;
  volume?: number;
  language?: "bn" | "en" | "auto";
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

// Global reference to prevent V8 Chromium garbage collection bug
let activeUtterance: SpeechSynthesisUtterance | null = null;

export class SoftFemaleVoiceSynthesizer {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private audioCtx: AudioContext | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      if ("speechSynthesis" in window) {
        this.synth = window.speechSynthesis;
        this.loadVoices();

        if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = () => this.loadVoices();
        }
      }
    }
  }

  private loadVoices(): void {
    if (!this.synth) return;
    const list = this.synth.getVoices();
    if (list && list.length > 0) {
      this.voices = list;
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if ((!this.voices || this.voices.length === 0) && this.synth) {
      this.loadVoices();
    }
    return this.voices || [];
  }

  /**
   * Play a soft futuristic chime using Web Audio API to alert user and unblock audio context
   */
  public playChime(freq = 520, duration = 0.15): void {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx.state === "suspended") {
        void this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // AudioContext fallback
    }
  }

  /**
   * Intelligently selects the best soft female voice.
   * If Bengali voice is not installed in the Windows OS, it falls back to a sweet female voice
   * rather than failing silently.
   */
  public findBestVoice(lang: "bn" | "en"): { voice: SpeechSynthesisVoice | null; isNativeLang: boolean } {
    const all = this.getAvailableVoices();
    if (!all.length) return { voice: null, isNativeLang: false };

    if (lang === "bn") {
      // Look for Bengali voices
      const bnFemale = all.find(
        (v) =>
          v.lang.toLowerCase().startsWith("bn") &&
          (v.name.toLowerCase().includes("female") ||
            v.name.toLowerCase().includes("sayantani") ||
            v.name.toLowerCase().includes("google") ||
            v.name.toLowerCase().includes("bangla"))
      );
      if (bnFemale) return { voice: bnFemale, isNativeLang: true };

      const anyBn = all.find((v) => v.lang.toLowerCase().startsWith("bn"));
      if (anyBn) return { voice: anyBn, isNativeLang: true };

      // Look for Indian English female voice (good phonetic pronunciation of South Asian syllables)
      const inEnglish = all.find(
        (v) =>
          v.lang.toLowerCase().includes("en-in") ||
          v.name.toLowerCase().includes("india") ||
          v.name.toLowerCase().includes("heera") ||
          v.name.toLowerCase().includes("ravi")
      );
      if (inEnglish) return { voice: inEnglish, isNativeLang: false };
    }

    // Default/English soft sweet female voice
    const preferredEnglishFemale = all.find(
      (v) =>
        v.lang.toLowerCase().startsWith("en") &&
        (v.name.includes("Zira") ||
          v.name.includes("Samantha") ||
          v.name.includes("Victoria") ||
          v.name.includes("Natural") ||
          v.name.includes("Google UK English Female") ||
          v.name.includes("Google US English") ||
          v.name.toLowerCase().includes("female"))
    );
    if (preferredEnglishFemale) return { voice: preferredEnglishFemale, isNativeLang: lang === "en" };

    const anyEn = all.find((v) => v.lang.toLowerCase().startsWith("en"));
    if (anyEn) return { voice: anyEn, isNativeLang: lang === "en" };

    return { voice: all[0] || null, isNativeLang: false };
  }

  public speak(text: string, options: SynthesisOptions = {}): void {
    if (!text || !text.trim()) {
      options.onEnd?.();
      return;
    }

    if (!this.synth && typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
    }

    if (!this.synth) {
      console.warn("SpeechSynthesis is not supported on this device/browser.");
      options.onEnd?.();
      return;
    }

    try {
      // Cancel previous utterance and resume if paused
      this.synth.cancel();
      if (this.synth.paused) {
        this.synth.resume();
      }
    } catch {}

    // Play subtle soft chime to wake audio hardware
    this.playChime(640, 0.12);

    const lang = options.language === "bn" ? "bn" : "en";
    const { voice, isNativeLang } = this.findBestVoice(lang);

    const utterance = new SpeechSynthesisUtterance(text);
    activeUtterance = utterance;
    if (typeof window !== "undefined") {
      (window as any).__lyraUtterance = utterance;
    }

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      // Fallback
      utterance.lang = lang === "bn" ? "bn-BD" : "en-US";
    }

    // Soft & Sweet tuning
    utterance.pitch = options.pitch ?? (lang === "bn" ? 1.15 : 1.08);
    utterance.rate = options.rate ?? 0.94;
    utterance.volume = options.volume ?? 1.0;

    let hasEnded = false;
    const finish = () => {
      if (!hasEnded) {
        hasEnded = true;
        activeUtterance = null;
        options.onEnd?.();
      }
    };

    utterance.onstart = () => {
      options.onStart?.();
    };

    utterance.onend = () => {
      finish();
    };

    utterance.onerror = (e) => {
      console.warn("LYRA Speech utterance error:", e);
      finish();
    };

    // Chrome failsafe timeout: if utterance doesn't finish after expected reading time
    const words = text.split(/\s+/).length;
    const maxDurationMs = Math.max(4000, words * 600);
    setTimeout(() => {
      if (!hasEnded && this.synth && !this.synth.speaking) {
        finish();
      }
    }, maxDurationMs);

    try {
      this.synth.speak(utterance);

      // Force resume in Chrome if synthesis stays queued
      setTimeout(() => {
        if (this.synth && this.synth.paused) {
          this.synth.resume();
        }
      }, 50);
    } catch (err) {
      console.error("LYRA synth.speak failed:", err);
      finish();
    }
  }

  public stop(): void {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {}
    }
    activeUtterance = null;
  }

  public isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
}

export const softVoiceSynthesizer = new SoftFemaleVoiceSynthesizer();
