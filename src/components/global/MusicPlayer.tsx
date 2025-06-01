import React, { useState, useEffect } from 'react';

interface MusicPlayerProps {
  user?: { id: string; name: string };
}

export default function MusicPlayer({ user }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState('No Song Playing');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('[MusicPlayer] Component mounted');
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-between w-full p-4 bg-gray-700 rounded-lg">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full p-4 bg-gray-700 rounded-lg">
      {/* Track Info */}
      <div className="flex items-center">
        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
          🎵
        </div>
        <div>
          <p className="text-white font-bold text-sm">{currentSong}</p>
          <p className="text-gray-300 text-xs">Artist Name</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
      </div>

      {/* Volume */}
      <div className="hidden sm:flex items-center">
        <span className="text-white text-sm mr-2">🔊</span>
        <input
          type="range"
          min="0"
          max="100"
          className="w-20 h-2 bg-gray-600 rounded-lg appearance-none"
        />
      </div>
    </div>
  );
}
