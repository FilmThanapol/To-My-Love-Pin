
import React, { useState, useRef } from 'react';
import { Play, Pause, Heart } from 'lucide-react';

const MessagePlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const messages = [
    {
      title: "ข้อความแรก",
      text: "วันแรกที่เราเจอกัน ฉันรู้เลยว่าเธอคือคนพิเศษ หัวใจฉันเต้นแรงมาก และตอนนี้ครบรอบ 1 ปีแล้ว ฉันยังคิดแบบเดิม",
      audio: "/audio/message1.mp3",
      image: "/api/placeholder/300/200"
    },
    {
      title: "ความทรงจำดีๆ",
      text: "ทุกวันที่ผ่านมากับเธอเป็นความสุขที่ไม่มีวันลืม ขอบคุณที่เป็นคนพิเศษในชีวิตฉัน",
      audio: "/audio/message2.mp3",
      image: "/api/placeholder/300/200"
    },
    {
      title: "สัญญาในอนาคต",
      text: "ฉันสัญญาว่าจะรักเธอตลอดไป และจะสร้างความทรงจำดีๆ ให้กับเราต่อไปเรื่อยๆ",
      audio: "/audio/message3.mp3",
      image: "/api/placeholder/300/200"
    }
  ];

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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12 text-center font-thai">
          ข้อความจากใจ 💕
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Message Content */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
              <img 
                src={messages[currentTrack].image}
                alt="Memory"
                className="w-full h-48 object-cover rounded-2xl mb-6 shadow-lg"
              />
              
              <h3 className="text-2xl font-bold text-gray-800 mb-4 font-thai">
                {messages[currentTrack].title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed text-lg font-thai">
                {messages[currentTrack].text}
              </p>

              {/* Floating Hearts Animation */}
              <div className="relative mt-6">
                {[...Array(5)].map((_, i) => (
                  <Heart
                    key={i}
                    className="absolute text-pink-300 animate-pulse"
                    size={16}
                    style={{
                      left: `${i * 20 + 10}%`,
                      animationDelay: `${i * 0.5}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Audio Player */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
              <h4 className="text-xl font-bold text-gray-800 mb-6 font-thai">
                เสียงจากใจ 🎵
              </h4>

              {/* Current Track Display */}
              <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 mb-6">
                <p className="text-sm text-gray-600 mb-2 font-thai">กำลังเล่น:</p>
                <p className="text-lg font-semibold text-gray-800 font-thai">
                  {messages[currentTrack].title}
                </p>
              </div>

              {/* Play Controls */}
              <div className="flex items-center justify-center space-x-4 mb-6">
                <button
                  onClick={togglePlay}
                  className="bg-gradient-to-r from-pink-400 to-purple-400 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
              </div>

              {/* Track List */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700 mb-3 font-thai">เลือกข้อความ:</p>
                {messages.map((message, index) => (
                  <button
                    key={index}
                    onClick={() => selectTrack(index)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 font-thai ${
                      currentTrack === index
                        ? 'bg-gradient-to-r from-pink-200 to-purple-200 shadow-lg'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <span className="font-medium">{index + 1}. {message.title}</span>
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
