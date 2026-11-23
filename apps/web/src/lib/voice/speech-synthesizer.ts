export interface SynthesisOptions {
  pitch?: number;
  rate?: number;
  volume?: number;
  language?: "bn" | "en" | "auto";
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

export class SoftFemaleVoiceSynthesizer {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices(): void {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.voices.length && this.synth) {
      this.voices = this.synth.getVoices();
    }
    return this.voices;
  }

  /**
   * Intelligently finds the best soft female voice matching the language.
   */
  public findBestVoice(lang: "bn" | "en"): SpeechSynthesisVoice | null {
    const all = this.getAvailableVoices();
    if (!all.length) return null;

    if (lang === "bn") {
      // Look for Bengali female voices
      const bnVoice = all.find(
        (v) =>
          v.lang.startsWith("bn") &&
          (v.name.toLowerCase().includes("female") ||
            v.name.toLowerCase().includes("sayantani") ||
            v.name.toLowerCase().includes("google") ||
            v.name.toLowerCase().includes("bangla"))
      );
      if (bnVoice) return bnVoice;

      const anyBn = all.find((v) => v.lang.startsWith("bn"));
      if (anyBn) return anyBn;
    }

    // Default or English: Soft sweet female voice
    const preferredEnglishFemale = all.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Zira") ||
          v.name.includes("Samantha") ||
          v.name.includes("Victoria") ||
          v.name.includes("Natural") ||
          v.name.includes("Google UK English Female") ||
          v.name.includes("Google US English") ||
          v.name.toLowerCase().includes("female"))
    );
    if (preferredEnglishFemale) return preferredEnglishFemale;

    const anyEn = all.find((v) => v.lang.startsWith("en"));
    if (anyEn) return anyEn;

    return all[0] || null;
  }

  public speak(text: string, options: SynthesisOptions = {}): void {
    if (!this.synth) {
      console.warn("SpeechSynthesis not supported in this browser.");
      options.onEnd?.();
      return;
    }

    // Cancel ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const lang = options.language === "bn" ? "bn" : "en";
    const voice = this.findBestVoice(lang);

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = lang === "bn" ? "bn-BD" : "en-US";
    }

    // Soft & Sweet tuning
    utterance.pitch = options.pitch ?? (lang === "bn" ? 1.12 : 1.08);
    utterance.rate = options.rate ?? 0.95;
    utterance.volume = options.volume ?? 1.0;

    utterance.onstart = () => {
      options.onStart?.();
    };

    utterance.onend = () => {
      options.onEnd?.();
    };

    utterance.onerror = (e) => {
      console.error("Speech synthesis error:", e);
      options.onError?.(e);
      options.onEnd?.();
    };

    this.synth.speak(utterance);
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
}

export const softVoiceSynthesizer = new SoftFemaleVoiceSynthesizer();
