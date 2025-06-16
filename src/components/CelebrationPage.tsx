
import React, { useEffect } from 'react';
import { Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CelebrationPageProps {
  onReplay: () => void;
}

const CelebrationPage = ({ onReplay }: CelebrationPageProps) => {
  useEffect(() => {
    // Fireworks effect
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB', '#DDA0DD']
      });
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB', '#DDA0DD']
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Hearts */}
      {[...Array(20)].map((_, i) => (
        <Heart
          key={i}
          className="absolute text-pink-400 opacity-60 animate-bounce"
          size={Math.random() * 40 + 20}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        />
      ))}

      <div className="text-center z-10">
        <div className="animate-pulse mb-8">
          <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Happy 1 Year Anniversary!
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 font-medium">
            365 days of love, laughter, and beautiful memories 💕
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-2xl mx-auto mb-8">
          <div className="text-lg text-gray-700 space-y-4">
            <p>Thank you for being my everything this past year.</p>
            <p>You've made every single day brighter, every moment more meaningful, and every dream feel possible.</p>
            <p className="text-pink-600 font-semibold text-xl">
              Here's to forever with you! 🥂✨
            </p>
          </div>
        </div>

        <button
          onClick={onReplay}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          🔄 Relive Our Journey
        </button>
      </div>
    </div>
  );
};

export default CelebrationPage;
