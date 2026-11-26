export interface WakeWordCallbacks {
  onWakeDetected: (triggerWord: string, commandAfterWake?: string) => void;
  onListeningStatus: (isListening: boolean) => void;
  onError?: (err: string) => void;
}

interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export class WakeWordEngine {
  private recognition: any = null;
  private isRunning = false;
  private shouldKeepRunning = true;
  private callbacks: WakeWordCallbacks | null = null;
  private audioCtx: AudioContext | null = null;

  // Wake word variations in English and Bengali phonetics
  private wakePatterns = [
    /\b(hey|hi|hello|ok|okay|wake\s*up|hie|he|a|ei)?\s*(lyra|layra|lera|lira|laura|lyrah|lara|lyla|leera)\b/i,
    /(হে|হেই|এই|হাই|হ্যালো|ওকে)?\s*(লায়রা|লায়রা|লাইরা|লাযরা|লারা|লাইলা|লায়লা)/i,
    /(wake\s*up|জেগে\s*ওঠো|ওঠো|জেগে\s*যাও|উঠে\s*পড়ো|এক্টিভ\s*হও|active\s*now)/i
  ];

  constructor() {
    if (typeof window !== "undefined") {
      const win = window as unknown as IWindow;
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
        // Dual-compatible language mode
        this.recognition.lang = "bn-BD";
      }
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  /**
   * Play unmistakable futuristic sci-fi wake chirp sound
   */
  public playWakeChirp(): void {
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

      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(880, now + 0.08);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.22); // D6

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(now);
      osc2.start(now + 0.06);
      osc1.stop(now + 0.15);
      osc2.stop(now + 0.25);
    } catch (e) {
      // Audio fallback
    }
  }

  public start(callbacks: WakeWordCallbacks): boolean {
    if (!this.recognition) {
      callbacks.onError?.("Continuous speech recognition not supported in this browser. Please use Chrome or Edge.");
      return false;
    }

    this.callbacks = callbacks;
    this.shouldKeepRunning = true;

    this.recognition.onstart = () => {
      this.isRunning = true;
      this.callbacks?.onListeningStatus(true);
    };

    this.recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = (event.results[i][0].transcript || "").trim();
        if (!transcript) continue;

        // Check if transcript contains any wake word pattern
        for (const pattern of this.wakePatterns) {
          const match = transcript.match(pattern);
          if (match) {
            const matchedWord = match[0];
            const wakeIndex = match.index ?? 0;
            const textAfterWake = transcript.substring(wakeIndex + matchedWord.length).trim();

            this.playWakeChirp();
            this.callbacks?.onWakeDetected(matchedWord, textAfterWake || undefined);
            return;
          }
        }
      }
    };

    this.recognition.onerror = (event: any) => {
      if (event.error !== "no-speech" && event.error !== "aborted") {
        console.warn("Wake word recognition warning:", event.error);
        if (event.error === "not-allowed") {
          this.callbacks?.onError?.("Microphone permission denied. Please allow microphone in browser settings.");
        }
      }
    };

    this.recognition.onend = () => {
      this.isRunning = false;
      this.callbacks?.onListeningStatus(false);

      // Auto-reconnect continuous loop if enabled
      if (this.shouldKeepRunning) {
        setTimeout(() => {
          if (this.shouldKeepRunning && !this.isRunning) {
            try {
              this.recognition.start();
            } catch {}
          }
        }, 350);
      }
    };

    try {
      this.recognition.start();
      return true;
    } catch (err) {
      return false;
    }
  }

  public stop(): void {
    this.shouldKeepRunning = false;
    if (this.recognition && this.isRunning) {
      try {
        this.recognition.stop();
      } catch {}
      this.isRunning = false;
    }
  }

  public getStatus(): boolean {
    return this.isRunning;
  }
}

export const wakeWordEngine = new WakeWordEngine();
