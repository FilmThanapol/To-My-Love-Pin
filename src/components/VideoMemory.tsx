import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Heart, Sparkles, RotateCcw } from 'lucide-react';

const VideoMemory = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoved, setIsLoved] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hearts, setHearts] = useState<Array<{id: number, x: number, y: number}>>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const handleLove = () => {
    setIsLoved(!isLoved);
    
    // Generate floating hearts
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const newHeart = {
          id: Date.now() + Math.random(),
          x: Math.random() * 100,
          y: Math.random() * 100
        };
        setHearts(prev => [...prev, newHeart]);
        
        // Remove heart after animation
        setTimeout(() => {
          setHearts(prev => prev.filter(heart => heart.id !== newHeart.id));
        }, 3000);
      }, i * 100);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const restartVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      video.play();
      setIsPlaying(true);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 py-12 px-4 relative overflow-hidden">
      {/* Floating background hearts */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-pink-200 animate-pulse opacity-40"
            size={Math.random() * 25 + 12}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}

        {/* Video-themed floating elements */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`video-${i}`}
            className="absolute text-purple-200 opacity-30 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              fontSize: `${12 + Math.random() * 8}px`
            }}
          >
            🎬
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-thai flex flex-wrap items-center justify-center gap-2">
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              วิดีโอพิเศษของมะหมาให้แมวจ๋อง
            </span>
            <span className="text-4xl">🐱💖🎬</span>
          </h2>
          <p className="text-lg text-gray-600 font-thai">
            มุฮิฮิฮิ
          </p>
          <div className="flex justify-center mt-4">
            {[...Array(5)].map((_, i) => (
              <Sparkles key={i} className="text-pink-400 mx-1 animate-pulse" size={16} style={{animationDelay: `${i * 0.2}s`}} />
            ))}
          </div>
        </div>

        {/* Video Container - Enhanced */}
        <div className="relative bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-pink-100 mx-2 sm:mx-4">
          {/* Love Button */}
          <button
            onClick={handleLove}
            className="absolute top-4 right-4 z-20 group"
          >
            <Heart 
              className={`transition-all duration-300 ${
                isLoved ? 'text-red-500 fill-red-500 animate-bounce' : 'text-pink-300 hover:text-pink-500'
              }`}
              size={24}
            />
          </button>

          {/* Floating Hearts Animation */}
          {hearts.map(heart => (
            <Heart
              key={heart.id}
              className="absolute text-red-400 fill-red-400 animate-ping pointer-events-none z-10"
              size={20}
              style={{
                left: `${heart.x}%`,
                top: `${heart.y}%`,
                animation: 'float-up 3s ease-out forwards'
              }}
            />
          ))}

          {/* Video Player - Responsive */}
          <div
            className="relative rounded-2xl overflow-hidden shadow-lg group"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <video
              ref={videoRef}
              className="w-full h-auto max-h-[60vh] sm:max-h-[70vh] md:max-h-[75vh] object-contain bg-black"
              onClick={togglePlay}
            >
              <source src="/vdo/eiei.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Video Controls Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}>
              {/* Play/Pause Button Center - Responsive */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={togglePlay}
                  className="bg-white/20 backdrop-blur-sm rounded-full p-3 sm:p-4 hover:bg-white/30 transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="text-white" size={window.innerWidth < 640 ? 28 : 32} />
                  ) : (
                    <Play className="text-white ml-1" size={window.innerWidth < 640 ? 28 : 32} />
                  )}
                </button>
              </div>

              {/* Bottom Controls - Responsive */}
              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
                {/* Progress Bar */}
                <div className="mb-3 sm:mb-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={duration ? (currentTime / duration) * 100 : 0}
                    onChange={handleSeek}
                    className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Control Buttons - Responsive Layout */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <button
                      onClick={togglePlay}
                      className="text-white hover:text-pink-300 transition-colors duration-300 p-1"
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </button>

                    <button
                      onClick={restartVideo}
                      className="text-white hover:text-pink-300 transition-colors duration-300 p-1"
                    >
                      <RotateCcw size={18} />
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={toggleMute}
                        className="text-white hover:text-pink-300 transition-colors duration-300 p-1"
                      >
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={isMuted ? 0 : volume * 100}
                        onChange={handleVolumeChange}
                        className="w-16 sm:w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>

                  <div className="text-white text-xs sm:text-sm font-mono bg-black/20 px-2 py-1 rounded">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Info - Responsive */}
          <div className="mt-4 sm:mt-6 text-center">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 sm:p-6 border border-pink-100">
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2 font-thai">
                ช่วงเวลาแห่งความสุข
              </h3>
              <div className="flex justify-center space-x-2 mb-3">
                {['🎬', '💕', '🌸', '💖', '🎬'].map((emoji, i) => (
                  <span
                    key={i}
                    className="text-lg animate-pulse opacity-70"
                    style={{animationDelay: `${i * 0.2}s`}}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
              <p className="text-sm sm:text-base text-gray-600 font-thai leading-relaxed">
                หวังว่าจะถูกใจนะคะที่รัก 💕
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ec4899;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(236, 72, 153, 0.4);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ec4899;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(236, 72, 153, 0.4);
        }

        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) scale(0.5);
          }
        }
      `}</style>
    </section>
  );
};

export default VideoMemory;
