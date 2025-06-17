
import React, { useState, useEffect } from 'react';
import PinScreen from '../components/PinScreen';
import PhotoSlideshow from '../components/PhotoSlideshow';
import JigsawPuzzle from '../components/JigsawPuzzle';
import MessagePlayer from '../components/MessagePlayer';

const Index = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  if (!isUnlocked) {
    return <PinScreen onUnlock={handleUnlock} />;
  }

  return (
    <div className="font-thai">
      <PhotoSlideshow />
      <JigsawPuzzle />
      <MessagePlayer />
      
      {/* Final Section */}
      <section className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-4">
        <div className="text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-800 font-thai">
            รักเธอมากๆ นะ 💕
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-thai">
            ขอบคุณสำหรับ 365 วันที่ยอดเยี่ยม และขอให้เรามีความสุขไปด้วยกันตลอดไป
          </p>
          <div className="flex justify-center space-x-4">
            <div className="animate-bounce">💕</div>
            <div className="animate-bounce" style={{ animationDelay: '0.1s' }}>💖</div>
            <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>💗</div>
            <div className="animate-bounce" style={{ animationDelay: '0.3s' }}>💓</div>
            <div className="animate-bounce" style={{ animationDelay: '0.4s' }}>💕</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
