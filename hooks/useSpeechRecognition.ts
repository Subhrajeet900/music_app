'use client';
import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = false;
        reco.interimResults = true;
        reco.lang = 'en-US';

        reco.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        reco.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setError(event.error);
          setIsListening(false);
        };

        reco.onend = () => {
          setIsListening(false);
        };

        setRecognition(reco);
      } else {
        setError('Speech recognition not supported in this browser.');
      }
    }
  }, []);

  const startListening = useCallback(() => {
    setError(null);
    setTranscript('');
    if (recognition && !isListening) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (err: any) {
        if (err.name === 'InvalidStateError') {
          // It's already started, ignore the error
          setIsListening(true);
        } else {
          console.error('Recognition start error', err);
        }
      }
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  return { isListening, transcript, setTranscript, startListening, stopListening, error };
}
