export class VoiceService {
  private synthesis: SpeechSynthesis;
  private recognition: SpeechRecognition | null;
  private isListening: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
    
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    } else {
      this.recognition = null;
      console.warn('Speech recognition not supported in this browser');
    }
  }

  async speak(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Stop any current speech
        this.stopSpeaking();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure speech parameters
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Set up event handlers
        utterance.onend = () => {
          this.currentUtterance = null;
          resolve();
        };
        
        utterance.onerror = (event) => {
          this.currentUtterance = null;
          
          // Handle different error types
          if (event.error === 'interrupted' || event.error === 'cancelled') {
            // Don't treat interruption as an error
            resolve();
          } else {
            reject(new Error(`Speech synthesis error: ${event.error}`));
          }
        };
        
        // Store reference for potential cancellation
        this.currentUtterance = utterance;
        
        // Start speaking
        speechSynthesis.speak(utterance);
        
      } catch (error) {
        reject(error);
      }
    });
  }

  startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void
  ): boolean {
    if (!this.recognition) {
      onError('Speech recognition not supported');
      return false;
    }

    if (this.isListening) {
      return true;
    }

    this.recognition.onresult = (event: any) => {
      const results = Array.from(event.results);
      const transcript = results
        .map((result: any) => result[0].transcript)
        .join('');
      
      const isFinal = results[results.length - 1].isFinal;
      onResult(transcript, isFinal);
    };

    this.recognition.onerror = (event: any) => {
      onError(`Speech recognition error: ${event.error}`);
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      onError('Failed to start speech recognition');
      return false;
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  stopSpeaking(): void {
    try {
      if (this.currentUtterance) {
        speechSynthesis.cancel();
        this.currentUtterance = null;
      }
    } catch (error) {
      console.warn('Error stopping speech synthesis:', error);
    }
  }

  getIsListening(): boolean {
    return this.isListening;
  }
}

// Add type declarations for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
