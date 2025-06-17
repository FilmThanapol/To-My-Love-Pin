
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Heart, VolumeX, Volume1, Volume2, SkipBack, SkipForward, Star, Sparkles } from 'lucide-react';
import './MessagePlayer.css';

const MessagePlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);
  const [isLoved, setIsLoved] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const messages = [
    {
      title: "ข้อความแรก",
      text: "วันแรกที่เราเจอกัน ฉันรู้เลยว่าเธอคือคนพิเศษ หัวใจฉันเต้นแรงมาก และตอนนี้ครบรอบ 1 ปีแล้ว ฉันยังคิดแบบเดิม",
      audio: "/audio/m1.mp3",
      image: "/img/1.jpg"
    },
    {
      title: "ความทรงจำดีๆ",
      text: "ทุกวันที่ผ่านมากับเธอเป็นความสุขที่ไม่มีวันลืม ขอบคุณที่เป็นคนพิเศษในชีวิตฉัน",
      audio: "/audio/m2.mp3",
      image: "/img/2.jpg"
    },
    {
      title: "สัญญาในอนาคต",
      text: "ฉันสัญญาว่าจะรักเธอตลอดไป และจะสร้างความทรงจำดีๆ ให้กับเราต่อไปเรื่อยๆ",
      audio: "/audio/m3.mp3",
      image: "/img/2.jpg"
    }
  ];

  // Audio management effects
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;

      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
      };
    }
  }, [volume, currentTrack]);

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

  const selectTrack = (index: number) => {
    setCurrentTrack(index);
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const nextTrack = () => {
    const next = (currentTrack + 1) % messages.length;
    selectTrack(next);
  };

  const prevTrack = () => {
    const prev = currentTrack === 0 ? messages.length - 1 : currentTrack - 1;
    selectTrack(prev);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) return VolumeX;
    if (volume < 0.5) return Volume1;
    return Volume2;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Generate sparkles when playing
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const newSparkle = {
          id: Date.now() + Math.random(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 2
        };
        setSparkles(prev => [...prev.slice(-10), newSparkle]);
      }, 800);

      return () => clearInterval(interval);
    } else {
      setSparkles([]);
    }
  }, [isPlaying]);

  const handleLoveClick = () => {
    setIsLoved(!isLoved);
    // Generate burst of hearts
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const newSparkle = {
          id: Date.now() + Math.random() + i,
          x: 50 + (Math.random() - 0.5) * 30,
          y: 50 + (Math.random() - 0.5) * 30,
          delay: i * 0.1
        };
        setSparkles(prev => [...prev, newSparkle]);
      }, i * 100);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-20 px-4 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {/* Gentle floating shapes */}
        <div className="absolute top-20 left-10 w-6 h-6 bg-rose-200 rounded-full animate-pulse opacity-40" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-40 right-20 w-4 h-4 bg-pink-200 rounded-full animate-pulse opacity-40" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 left-20 w-5 h-5 bg-purple-200 rounded-full animate-pulse opacity-40" style={{animationDelay: '4s'}}></div>

        {/* Subtle sparkles only when playing */}
        {isPlaying && sparkles.slice(0, 3).map((sparkle) => (
          <Sparkles
            key={sparkle.id}
            className="absolute text-rose-300 animate-pulse opacity-50"
            size={12}
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              animationDelay: `${sparkle.delay}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-4 font-thai">
            ข้อความจากใจ 💕
          </h2>
          <p className="text-lg text-gray-600 font-thai">เสียงแห่งความรักที่มีให้เธอ</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Elegant Message Content */}
          <div className="space-y-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-rose-100 relative">
              {/* Subtle love indicator */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={handleLoveClick}
                  className="group transition-all duration-300 hover:scale-110"
                >
                  <Heart
                    className={`transition-all duration-300 ${
                      isLoved ? 'text-rose-500 fill-rose-500' : 'text-rose-300 hover:text-rose-500'
                    }`}
                    size={20}
                  />
                </button>
              </div>

              <div className="relative">
                <img
                  src={messages[currentTrack].image}
                  alt="Memory"
                  className={`w-full h-48 object-cover rounded-2xl mb-6 shadow-lg transition-all duration-300 ${
                    isPlaying ? 'shadow-xl ring-2 ring-rose-200' : ''
                  }`}
                />
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 font-thai">
                  {messages[currentTrack].title}
                </h3>

                <p className="text-gray-600 leading-relaxed text-lg font-thai">
                  {messages[currentTrack].text}
                </p>
              </div>

              {/* Elegant Floating Hearts Animation */}
              <div className="relative mt-6 h-12 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`absolute transition-all duration-1000 ${
                      isPlaying
                        ? 'heart-float text-rose-400 fill-rose-300'
                        : 'animate-pulse text-rose-300'
                    }`}
                    size={isPlaying ? 20 : 16}
                    style={{
                      left: `${i * 20 + 10}%`,
                      animationDelay: `${i * 0.4}s`,
                      opacity: isPlaying ? 0.8 : 0.5
                    }}
                  />
                ))}

                {/* Subtle sparkle when loved */}
                {isLoved && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="text-rose-400 animate-pulse" size={16} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Elegant Audio Player */}
          <div className="space-y-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100 relative">
              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold text-gray-800 mb-2 font-thai">
                  เสียงจากใจ 🎵
                </h4>
                <div className="w-16 h-1 bg-gradient-to-r from-rose-400 to-purple-400 rounded-full mx-auto"></div>
              </div>

              {/* Elegant Current Track Display */}
              <div className="bg-gradient-to-r from-rose-50 to-purple-50 rounded-2xl p-6 mb-6 border border-rose-200">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm text-gray-600 font-thai font-medium">กำลังเล่น:</p>
                  <div className="text-xs text-gray-500 font-mono bg-white/70 px-3 py-1 rounded-full">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                <div className="text-center mb-4">
                  <p className="text-xl font-bold text-gray-800 font-thai">
                    {messages[currentTrack].title}
                  </p>
                  {isPlaying && (
                    <div className="flex justify-center space-x-1 mt-2">
                      <span className="text-rose-500 animate-pulse">🎵</span>
                      <span className="text-purple-500 animate-pulse" style={{animationDelay: '0.5s'}}>�</span>
                    </div>
                  )}
                </div>

                {/* Elegant Progress Bar */}
                <div className="relative">
                  <div className="w-full bg-white/80 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className={`bg-gradient-to-r from-rose-400 to-purple-400 h-3 rounded-full transition-all duration-300 ${
                        isPlaying ? 'progress-pulse' : ''
                      }`}
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Magical Play Controls */}
              <div className="flex items-center justify-center space-x-8 mb-8">
                <button
                  onClick={prevTrack}
                  className="bg-gradient-to-r from-pink-200 to-purple-200 hover:from-pink-300 hover:to-purple-300 text-gray-700 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-125 group relative overflow-hidden"
                >
                  <SkipBack size={24} className="relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                </button>

                <div className="relative">
                  <button
                    onClick={togglePlay}
                    className={`bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white p-6 rounded-full shadow-2xl transition-all duration-500 relative overflow-hidden group ${
                      isPlaying
                        ? 'animate-pulse scale-125 glow-pink shadow-pink-500/50'
                        : 'hover:scale-125 hover:shadow-purple-500/50'
                    }`}
                  >
                    {isPlaying ? <Pause size={32} /> : <Play size={32} />}

                    {/* Magical ring effect */}
                    <div className={`absolute inset-0 rounded-full border-4 border-white/30 ${
                      isPlaying ? 'animate-ping' : ''
                    }`}></div>

                    {/* Sparkle effect when playing */}
                    {isPlaying && (
                      <>
                        <Sparkles className="absolute -top-2 -left-2 text-yellow-300 animate-ping" size={16} />
                        <Sparkles className="absolute -top-2 -right-2 text-yellow-300 animate-ping" size={16} style={{animationDelay: '0.5s'}} />
                        <Sparkles className="absolute -bottom-2 -left-2 text-yellow-300 animate-ping" size={16} style={{animationDelay: '1s'}} />
                        <Sparkles className="absolute -bottom-2 -right-2 text-yellow-300 animate-ping" size={16} style={{animationDelay: '1.5s'}} />
                      </>
                    )}
                  </button>

                  {/* Cute floating hearts around play button when playing */}
                  {isPlaying && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(6)].map((_, i) => (
                        <Heart
                          key={i}
                          className="absolute text-pink-400 fill-pink-300 animate-bounce"
                          size={12}
                          style={{
                            left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 60}px`,
                            top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 60}px`,
                            animationDelay: `${i * 0.2}s`
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={nextTrack}
                  className="bg-gradient-to-r from-purple-200 to-cyan-200 hover:from-purple-300 hover:to-cyan-300 text-gray-700 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-125 group relative overflow-hidden"
                >
                  <SkipForward size={24} className="relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-cyan-400/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                </button>
              </div>

              {/* Cute Volume Controls */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                <button
                  onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                  className="bg-gradient-to-r from-cyan-100 to-blue-100 hover:from-cyan-200 hover:to-blue-200 text-gray-700 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
                >
                  {React.createElement(getVolumeIcon(), {
                    size: 20,
                    className: `transition-all duration-300 ${showVolumeSlider ? 'text-blue-600' : 'group-hover:text-blue-600'}`
                  })}
                </button>

                {showVolumeSlider && (
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-white to-cyan-50 rounded-full px-6 py-3 shadow-xl animate-fadeIn border border-cyan-200">
                    <Heart className="text-cyan-400" size={16} />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-24 h-2 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-600 font-mono font-bold bg-cyan-100 px-2 py-1 rounded-full">
                        {Math.round(volume * 100)}%
                      </span>
                      <Sparkles className="text-cyan-400" size={12} />
                    </div>
                  </div>
                )}
              </div>

              {/* Magical Track List */}
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-thai">เลือกข้อความ:</p>
                  <div className="flex justify-center space-x-1 mt-1">
                    {[...Array(3)].map((_, i) => (
                      <Star key={i} className="text-yellow-400 animate-pulse" size={12} style={{animationDelay: `${i * 0.3}s`}} />
                    ))}
                  </div>
                </div>

                {messages.map((message, index) => (
                  <button
                    key={index}
                    onClick={() => selectTrack(index)}
                    className={`w-full text-left p-5 rounded-2xl transition-all duration-500 font-thai relative overflow-hidden group transform ${
                      currentTrack === index
                        ? 'bg-gradient-to-r from-pink-200 via-purple-200 to-cyan-200 shadow-2xl scale-105 border-2 border-pink-300 glow-pink'
                        : 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-pink-50 hover:to-purple-50 hover:scale-102 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          currentTrack === index
                            ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          <span className="font-bold text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800">{message.title}</span>
                          {currentTrack === index && (
                            <div className="flex items-center space-x-1 mt-1">
                              <Heart className="text-pink-500 fill-pink-400" size={12} />
                              <span className="text-xs text-gray-600">กำลังเล่น</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {currentTrack === index && isPlaying && (
                        <div className="flex space-x-1 items-end">
                          <div className="w-1 bg-pink-500 rounded-full equalizer-bar"></div>
                          <div className="w-1 bg-purple-500 rounded-full equalizer-bar"></div>
                          <div className="w-1 bg-cyan-500 rounded-full equalizer-bar"></div>
                        </div>
                      )}
                    </div>

                    {/* Magical hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl"></div>

                    {/* Sparkle effects for active track */}
                    {currentTrack === index && (
                      <>
                        <Sparkles className="absolute top-2 right-2 text-yellow-400 animate-ping" size={12} />
                        <Sparkles className="absolute bottom-2 left-2 text-yellow-400 animate-ping" size={12} style={{animationDelay: '0.5s'}} />
                      </>
                    )}
                  </button>
                ))}
              </div>

              {/* Hidden Audio Element */}
              <audio
                ref={audioRef}
                src={messages[currentTrack].audio}
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MessagePlayer;
