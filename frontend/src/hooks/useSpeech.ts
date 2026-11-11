import { useState, useEffect, useCallback, useRef } from 'react';

interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export type SupportedLanguage = 'en-IN' | 'hi-IN' | 'te-IN';

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(false);
  const [voiceLang, setVoiceLang] = useState<SupportedLanguage>('te-IN'); // Default to Telugu
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSupported(true);
      // Pre-warm voices list for browsers that load them asynchronously
      if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  const speakWithBrowser = useCallback((text: string, lang: SupportedLanguage) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(
      (v) => v.lang === lang || v.lang.toLowerCase().startsWith(lang.split('-')[0].toLowerCase())
    );
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const speakIntro = useCallback(
    (lang: SupportedLanguage, onEnd?: () => void) => {
      stop();
      const langKey = lang === 'te-IN' ? 'te' : lang === 'hi-IN' ? 'hi' : 'en';
      const audioUrl = `/audio/intro_${langKey}.mp3`;
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;
      audio.playbackRate = 1.1; // Active, brisk, natural pacing

      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => {
        setIsSpeaking(false);
        currentAudioRef.current = null;
        if (onEnd) onEnd();
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        currentAudioRef.current = null;
        if (onEnd) onEnd();
      };

      audio.play().catch((err) => {
        console.warn('Intro audio playback error:', err);
        setIsSpeaking(false);
        if (onEnd) onEnd();
      });
    },
    [stop]
  );

  const speak = useCallback(
    (text: string, lang: SupportedLanguage = voiceLang) => {
      stop(); // Stop any active speech/audio

      // Check if client browser has a local TTS voice for this language
      const voices = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : [];
      const hasNativeVoice = voices.some((v) =>
        v.lang.toLowerCase().startsWith(lang.split('-')[0].toLowerCase())
      );

      // Windows/Chrome usually lacks native Telugu TTS (and sometimes Hindi).
      // If language is Telugu or client OS has no native voice, use high-fidelity Cloud TTS endpoint!
      const langPrefix = lang.split('-')[0];
      if (langPrefix === 'te' || !hasNativeVoice) {
        try {
          const audioUrl = `/api/tts?text=${encodeURIComponent(text)}&lang=${langPrefix}`;
          const audio = new Audio(audioUrl);
          currentAudioRef.current = audio;
          audio.playbackRate = 1.1; // Active, brisk cadence

          audio.onplay = () => setIsSpeaking(true);
          audio.onended = () => {
            setIsSpeaking(false);
            currentAudioRef.current = null;
          };
          audio.onerror = (e) => {
            console.warn('Backend Cloud TTS playback failed, falling back to Web Speech API', e);
            setIsSpeaking(false);
            currentAudioRef.current = null;
            speakWithBrowser(text, lang);
          };

          audio.play().catch((err) => {
            console.warn('Audio play was prevented or failed:', err);
            speakWithBrowser(text, lang);
          });
          return;
        } catch (err) {
          console.error('Audio initialization error:', err);
        }
      }

      // Default fallback to browser speech synthesis
      speakWithBrowser(text, lang);
    },
    [stop, voiceLang, speakWithBrowser]
  );

  const startListening = useCallback((onResultCallback?: (text: string) => void) => {
    const win = window as unknown as IWindow;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = voiceLang;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript;
      setTranscript(text);
      if (onResultCallback) onResultCallback(text);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [voiceLang]);

  return {
    supported,
    isSpeaking,
    isListening,
    transcript,
    voiceLang,
    setVoiceLang,
    speak,
    speakIntro,
    stop,
    startListening,
  };
}
