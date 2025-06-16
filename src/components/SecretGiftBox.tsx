
import React, { useState } from 'react';
import { Gift, Heart, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

const SecretGiftBox = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [foundHearts, setFoundHearts] = useState<number[]>([]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB']
    });
  };

  const handleHeartClick = (index: number) => {
    if (!foundHearts.includes(index)) {
      setFoundHearts([...foundHearts, index]);
      triggerConfetti();
      
      if (foundHearts.length + 1 === 3) {
        setTimeout(() => {
          setIsOpened(true);
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB', '#DDA0DD']
          });
        }, 500);
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 relative overflow-hidden">
      <div className="max-w-4xl w-full text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8" data-aos="fade-up">
          Find the Hidden Hearts 💖
        </h2>
        <p className="text-xl text-gray-600 mb-12" data-aos="fade-up" data-aos-delay="200">
          Find all 3 hidden hearts to unlock your special surprise!
        </p>
        
        {/* Hidden Hearts */}
        <div className="relative min-h-96 mb-8">
          {[0, 1, 2].map((index) => (
            <Heart
              key={index}
              className={`absolute cursor-pointer transition-all duration-300 ${
                foundHearts.includes(index) 
                  ? 'text-pink-500 scale-125 animate-pulse' 
                  : 'text-gray-300 hover:text-pink-300 hover:scale-110'
              }`}
              size={40}
              style={{
                left: `${20 + index * 30}%`,
                top: `${30 + (index % 2) * 40}%`
              }}
              onClick={() => handleHeartClick(index)}
            />
          ))}
          
          {/* Decorative elements */}
          {[...Array(10)].map((_, i) => (
            <Star
              key={i}
              className="absolute text-yellow-200 opacity-60"
              size={Math.random() * 20 + 10}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center space-x-2 mb-8">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                foundHearts.includes(index) 
                  ? 'bg-pink-500 scale-125' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Gift Box */}
        <div className={`transition-all duration-1000 ${isOpened ? 'scale-110' : ''}`}>
          {!isOpened ? (
            <div className="bg-gradient-to-br from-purple-200 to-pink-200 rounded-3xl p-12 shadow-2xl inline-block">
              <Gift size={80} className="text-purple-600 mx-auto animate-bounce" />
              <p className="mt-4 text-lg font-medium text-gray-700">
                {foundHearts.length}/3 hearts found
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 shadow-2xl inline-block border-4 border-pink-300" data-aos="zoom-in">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-pink-600 mb-6">🎉 Surprise! 🎉</h3>
                <div className="text-lg text-gray-700 space-y-3">
                  <p>🎟️ A weekend getaway to your favorite place</p>
                  <p>💝 A custom photo album of our memories</p>
                  <p>🌹 A year's worth of surprise date nights</p>
                  <p className="text-pink-600 font-semibold mt-6">
                    Thank you for the most amazing year of my life! 💕
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SecretGiftBox;
