'use client';
import { useState } from 'react';
import { usePlayerStore } from '@/store/playerStore';

export const PLAYLIST_COLORS = [
  'linear-gradient(45deg, #7c3aed, #3b82f6)',
  'linear-gradient(45deg, #ec4899, #f43f5e)',
  'linear-gradient(45deg, #10b981, #3b82f6)',
  'linear-gradient(45deg, #f59e0b, #ef4444)',
  'linear-gradient(45deg, #6366f1, #a855f7)',
  'linear-gradient(45deg, #14b8a6, #06b6d4)',
  'linear-gradient(45deg, #f43f5e, #8b5cf6)',
  'linear-gradient(45deg, #334155, #0f172a)'
];

interface Props {
  onClose: () => void;
}

export function PlaylistModal({ onClose }: Props) {
  const { createPlaylist } = usePlayerStore();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [color, setColor] = useState(PLAYLIST_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createPlaylist(name, desc, color);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <div className="relative bg-[#121417] border border-white/[0.08] rounded-2xl p-7 w-full max-w-[380px] animate-modal-enter shadow-2xl">
        <h2 className="text-[18px] font-bold text-[#f0f2f4] mb-5 font-sans">Create Playlist</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Playlist name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#1b1e22] text-[#f0f2f4] border border-[#262a2f] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c8cdd4] transition-colors"
            autoFocus
          />
          
          <input
            type="text"
            placeholder="Description (optional)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full bg-[#1b1e22] text-[#f0f2f4] border border-[#262a2f] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c8cdd4] transition-colors"
          />
          
          <div className="mt-2">
            <span className="text-xs text-[#9098a0] font-medium mb-2 block">Cover Gradient</span>
            <div className="flex flex-wrap gap-2">
              {PLAYLIST_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`w-8 h-8 rounded-full transition-transform ${color === c ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#121417]' : 'hover:scale-105'}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-4">
            <button
              type="button"
              className="flex-1 py-3 text-sm font-semibold text-[#9098a0] hover:text-[#f0f2f4] transition-colors button-active-anim"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 bg-[#c8cdd4] text-[#07090b] py-3 rounded-xl text-sm font-semibold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed button-active-anim"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
