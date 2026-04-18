import React, { useRef, useState, useEffect } from "react";
import { useSong } from "../hooks/useSong";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
} from "lucide-react";

const Player = () => {
  const { song } = useSong();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // Play/Pause toggle
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Skip forward 5 seconds
  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 5,
        duration,
      );
    }
  };

  // Skip backward 5 seconds
  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 5,
        0,
      );
    }
  };

  // Handle speed change
  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  // Update current time
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handle metadata loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Handle progress bar change
  const handleProgressChange = (e) => {
    if (audioRef.current) {
      audioRef.current.currentTime = parseFloat(e.target.value);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Format time
  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Handle song end
  const handleSongEnd = () => {
    setIsPlaying(false);
  };

  // Auto-play when song changes
  useEffect(() => {
    if (audioRef.current && song?.songUrl) {
      audioRef.current.play().catch((error) => {
        console.log("Auto-play failed:", error);
        setIsPlaying(false);
      });
    }
  }, [song?.songUrl]);

  return (
    <div className="w-full bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 rounded-xl p-2 shadow-2xl border border-gray-700">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={song?.songUrl}
        autoPlay
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleSongEnd}
      />

      {/* Main Container - Horizontal Layout */}
      <div className="flex items-start gap-3">
        {/* Album Art - Left Side */}
        <div className="shrink-0 pt-1">
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden shadow-lg shrink-0">
            <img
              src={song?.posterUrl}
              alt={song?.songTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
          </div>
        </div>

        {/* Right Content Section */}
        <div className="flex-1 min-w-0">
          {/* Song Info */}
          <div className="mb-2">
            <h2 className="text-base md:text-lg font-bold text-white truncate leading-tight">
              {song?.songTitle}
            </h2>
            <p className="text-xs text-gray-400 capitalize leading-tight">
              {song?.mood}
            </p>
          </div>

          {/* Progress Bar and Buttons Row */}
          <div className="mb-2">
            <div className="flex items-center gap-1.5 mb-1">
              {/* Skip Backward */}
              <button
                onClick={skipBackward}
                className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors text-white shrink-0"
                title="Skip backward 5 seconds"
              >
                <SkipBack size={16} />
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="p-2 rounded-full bg-purple-600 hover:bg-purple-500 transition-colors text-white shadow-lg shrink-0"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>

              {/* Skip Forward */}
              <button
                onClick={skipForward}
                className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors text-white shrink-0"
                title="Skip forward 5 seconds"
              >
                <SkipForward size={16} />
              </button>

              {/* Progress Bar - Narrower Width */}
              <div className="w-40">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleProgressChange}
                  className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>

            {/* Time Display */}
            <div className="flex justify-between text-xs text-gray-400 pl-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume and Speed Controls - Single Row */}
          <div className="flex items-center gap-2">
            {/* Volume Control */}
            <div className="flex items-center gap-1">
              <Volume1 size={13} className="text-gray-400 shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-10 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <span className="text-xs text-gray-400 w-4 text-right shrink-0">
                {Math.round(volume * 100)}%
              </span>
            </div>

            {/* Divider */}
            <div className="h-4 w-px bg-gray-600"></div>

            {/* Speed Control */}
            <div className="flex items-center gap-1">
              <label className="text-xs font-semibold text-gray-300 shrink-0">
                Speed:
              </label>
              <div className="flex gap-0.5">
                {speedOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSpeedChange(opt)}
                    className={`px-1.5 py-0.5 rounded text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                      speed === opt
                        ? "bg-purple-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {opt}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
