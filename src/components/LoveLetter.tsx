
import React, { useState } from 'react';
import { Heart, Envelope } from 'lucide-react';

const LoveLetter = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-2xl w-full" data-aos="zoom-in">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12">
          A Letter From My Heart 💌
        </h2>
        
        <div className="relative flex justify-center">
          {/* Sparkles */}
          {isOpen && (
            <>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-ping"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                >
                  ✨
                </div>
              ))}
            </>
          )}
          
          <div
            className={`relative cursor-pointer transition-all duration-700 transform ${
              isOpen ? 'scale-110' : 'hover:scale-105'
            }`}
            onClick={handleOpen}
          >
            {/* Envelope */}
            <div className={`bg-gradient-to-br from-red-200 to-pink-200 rounded-lg p-8 shadow-2xl transition-all duration-700 ${
              isOpen ? 'opacity-20' : 'opacity-100'
            }`}>
              <Envelope size={80} className="text-red-400 mx-auto" />
              <p className="text-center mt-4 font-medium text-gray-700">Click to open</p>
            </div>
            
            {/* Letter content */}
            <div className={`absolute inset-0 bg-white rounded-lg p-6 shadow-2xl transition-all duration-700 ${
              isOpen ? 'opacity-100 transform rotate-3' : 'opacity-0 transform rotate-0'
            }`}>
              <div className="text-center">
                <Heart className="text-red-500 mx-auto mb-4" size={32} />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">My Dearest Love,</h3>
                <div className="text-left space-y-3 text-gray-700">
                  <p>This past year has been the most incredible journey of my life. Every day with you feels like a beautiful dream that I never want to wake up from.</p>
                  <p>You've brought so much joy, laughter, and love into my world. Your smile lights up my darkest days, and your laugh is my favorite sound in the universe.</p>
                  <p>Thank you for being my partner, my best friend, and my greatest love. Here's to many more years of adventures, cuddles, and making beautiful memories together.</p>
                  <p className="text-center font-semibold text-red-600 mt-6">
                    Forever yours,<br />
                    With all my love 💕
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoveLetter;
