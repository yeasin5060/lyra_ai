export interface RecognitionCallbacks {
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: (finalTranscript: string) => void;
  onStart?: () => void;
}

interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export class SpeechRecognizer {
  private recognition: any = null;
  private isListening = false;
  private isAutoListening = false;
  private selectedLanguage = "bn-BD";
  private currentTranscript = "";
  private silenceTimer: any = null;
  private callbacks: RecognitionCallbacks = {};

  constructor() {
    if (typeof window !== "undefined") {
      const win = window as unknown as IWindow;
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
        this.recognition.lang = "bn-BD";
      }
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  /**
   * Request microphone permission explicitly via getUserMedia
   * to ensure Chrome/Edge shows the Allow Microphone prompt on localhost.
   */
  public async requestMicPermission(): Promise<boolean> {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      return false;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (err) {
      console.warn("Microphone permission request error:", err);
      return false;
    }
  }

  public setLanguage(lang: "bn" | "en" | "auto"): void {
    if (lang === "bn") {
      this.selectedLanguage = "bn-BD";
    } else if (lang === "en") {
      this.selectedLanguage = "en-US";
    } else {
      this.selectedLanguage = "bn-BD";
    }

    if (this.recognition) {
      this.recognition.lang = this.selectedLanguage;
    }
  }

  public start(callbacks: RecognitionCallbacks = {}, autoLoop = true): boolean {
    if (!this.recognition) {
      callbacks.onError?.("Speech recognition not supported in this browser. Please use Chrome or Edge.");
      return false;
    }

    this.callbacks = callbacks;
    this.isAutoListening = autoLoop;
    this.currentTranscript = "";
    this.recognition.lang = this.selectedLanguage;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.callbacks.onStart?.();
    };

    this.recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          final += item[0].transcript;
        } else {
          interim += item[0].transcript;
        }
      }

      const text = (final || interim).trim();
      if (text) {
        this.currentTranscript = text;
        this.callbacks.onResult?.(text, Boolean(final));

        // Auto debounce silence: 1.2s after silence, trigger end of sentence
        if (this.silenceTimer) clearTimeout(this.silenceTimer);
        this.silenceTimer = setTimeout(() => {
          if (this.currentTranscript) {
            const captured = this.currentTranscript;
            this.currentTranscript = "";
            this.callbacks.onEnd?.(captured);
          }
        }, 1200);
      }
    };

    this.recognition.onerror = (event: any) => {
      if (event.error !== "no-speech" && event.error !== "aborted") {
        console.warn("Speech recognition warning:", event.error);
        if (event.error === "not-allowed") {
          this.callbacks.onError?.("Microphone access denied. Please click the lock icon in the address bar and allow microphone.");
          this.isAutoListening = false;
        }
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.silenceTimer) clearTimeout(this.silenceTimer);

      if (this.currentTranscript) {
        const captured = this.currentTranscript;
        this.currentTranscript = "";
        this.callbacks.onEnd?.(captured);
      }

      // Auto reconnect continuous loop if active
      if (this.isAutoListening) {
        setTimeout(() => {
          if (this.isAutoListening && !this.isListening) {
            try {
              this.recognition.start();
            } catch {}
          }
        }, 300);
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
    this.isAutoListening = false;
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {}
      this.isListening = false;
    }
  }

  public pauseTemporarily(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {}
    }
  }

  public resumeListening(): void {
    if (this.isAutoListening && this.recognition && !this.isListening) {
      try {
        this.recognition.start();
      } catch {}
    }
  }

  public getStatus(): boolean {
    return this.isListening;
  }
}

export const speechRecognizer = new SpeechRecognizer();
