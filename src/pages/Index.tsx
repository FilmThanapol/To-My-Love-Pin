
import React, { useState, useEffect } from 'react';
import PinScreen from '../components/PinScreen';
import PhotoSlideshow from '../components/PhotoSlideshow';
import JigsawPuzzle from '../components/JigsawPuzzle';
import MessagePlayer from '../components/MessagePlayer';
import VideoMemory from '../components/VideoMemory';

const Index = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  if (!isUnlocked) {
    return <PinScreen onUnlock={handleUnlock} />;
  }

  return (
    <div className="font-thai scroll-smooth">
      <PhotoSlideshow />
      <JigsawPuzzle />
      <MessagePlayer />
      <VideoMemory />

      {/* Final Section - Enhanced */}
      <section className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Floating hearts background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute text-pink-300 opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                fontSize: `${12 + Math.random() * 12}px`
              }}
            >
              {['💕', '💖', '💗', '💓', '🌸', '🌺', '✨'][Math.floor(Math.random() * 7)]}
            </div>
          ))}
        </div>

        <div className="text-center space-y-6 md:space-y-8 relative z-10 max-w-4xl mx-auto px-4">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl border border-pink-200">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent font-thai mb-6">
              รักแมวจ๋องมากๆ นะ 💕
            </h2>

            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 md:p-6 border border-pink-100 mb-6">
              <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed font-thai">
                ขอบคุณสำหรับทุกอย่างที่ผ่านมาเลยนะคับ ขอให้เรามีความสุขไปด้วยกันนานๆเลยน้าาา เค้ารักปิ่นนะคับ 😺💖
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-6">
              {['💕', '💖', '💗', '💓', '💕', '🌸', '💖', '💗', '💓'].map((emoji, i) => (
                <div
                  key={i}
                  className="text-2xl md:text-3xl animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {emoji}
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm md:text-base text-gray-500 font-thai mb-4">
                🎉 ครบรอบ 1 ปี แห่งความรักและความสุข 🎉
              </p>
              <div className="flex justify-center space-x-2">
                {['🎊', '🎈', '🎁', '🎈', '🎊'].map((emoji, i) => (
                  <span
                    key={i}
                    className="text-lg animate-pulse opacity-70"
                    style={{animationDelay: `${i * 0.3}s`}}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
