'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Loader2, Play } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { searchYouTube } from '@/lib/youtubeApi';
import { Track } from '@/lib/tracks';
import { usePlayerStore } from '@/store/playerStore';

interface ListenerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ListenerModal({ isOpen, onClose }: ListenerModalProps) {
  const { isListening, transcript, setTranscript, startListening, stopListening, error } = useSpeechRecognition();
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<Track[]>([]);
  const playTrackFromList = usePlayerStore((state) => state.playTrackFromList);

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setResults([]);
      setProcessing(false);
      startListening();
    } else {
      stopListening();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isListening && transcript && !processing && results.length === 0) {
      const fetchResults = async () => {
        setProcessing(true);
        try {
          const songs = await searchYouTube(transcript, 10);
          setResults(songs);
        } catch (err) {
          console.error(err);
        } finally {
          setProcessing(false);
        }
      };
      
      const timer = setTimeout(() => {
        fetchResults();
      }, 500); // Debounce just to let UI settle
      
      return () => clearTimeout(timer);
    }
  }, [isListening, transcript, processing, results.length]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 z-[600] bg-[#050508]/80 backdrop-blur-2xl flex flex-col pt-16 pb-safe safe-area-pt safe-area-pb"
        >
          {/* Header */}
          <div className="absolute top-6 right-6 lg:top-10 lg:right-10 flex gap-4 w-full justify-end px-6">
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-all backdrop-blur-md"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-10 flex flex-col scrollbar-hide">
            <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
              
              {/* Mic Status Area */}
              <div className="flex flex-col items-center justify-center min-h-[300px] mb-8 relative">
                <motion.div
                  animate={{
                    scale: isListening ? [1, 1.2, 1] : 1,
                    opacity: isListening ? [0.3, 0.6, 0.3] : 0,
                  }}
                  transition={{ duration: 1.5, repeat: isListening ? Infinity : 0, ease: 'easeInOut' }}
                  className="absolute w-48 h-48 bg-[var(--acc)] rounded-full blur-3xl"
                />
                
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
                    isListening ? 'bg-white text-[var(--acc)] scale-110 shadow-[0_0_40px_rgba(255,255,255,0.3)]' : 'bg-white/10 text-white/50 border border-white/20'
                  }`}
                >
                  <Mic size={40} className={isListening ? 'animate-pulse' : ''} />
                </button>

                <div className="mt-8 text-center min-h-[80px]">
                  <h2 className="text-3xl font-black text-white px-4">
                    {isListening ? (transcript || 'Listening...') : (transcript ? `"${transcript}"` : 'Tap to Listen')}
                  </h2>
                  {(processing || isListening) && (
                     <p className="text-[var(--acc-light)] font-medium mt-2 animate-pulse">
                        {processing ? 'Finding your song...' : 'Sing or hum a melody...'}
                     </p>
                  )}
                  {error && <p className="text-red-400 mt-2">{error}</p>}
                </div>
              </div>

              {/* Results Area */}
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 flex flex-col pb-20"
                >
                  <h3 className="text-xl font-bold text-white mb-6 px-2">Matches Found</h3>
                  <div className="flex flex-col gap-3">
                    {results.map((track, idx) => (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={track.id + idx}
                        onClick={() => {
                          playTrackFromList(track, results);
                          onClose();
                        }}
                        className="flex items-center gap-4 bg-white/[0.04] p-3 rounded-2xl cursor-pointer hover:bg-white/10 transition-all group border border-white/[0.02]"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden relative shadow-lg">
                          <img src={track.cover} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-[2px]">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black">
                              <Play size={14} fill="currentColor" className="ml-0.5" />
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-bold truncate group-hover:text-[var(--acc)] transition-colors text-base">{track.title}</h4>
                          <p className="text-white/60 text-sm truncate">{track.artist}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
