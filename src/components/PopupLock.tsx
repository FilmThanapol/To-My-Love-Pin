import React, { useState, useEffect } from 'react';
import { X, Lock, Heart, Sparkles } from 'lucide-react';

interface PopupLockProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  allowBackgroundClick?: boolean;
}

const PopupLock: React.FC<PopupLockProps> = ({
  isOpen,
  onClose,
  title = "🔒 ป๊อปอัพพิเศษ",
  children,
  showCloseButton = true,
  allowBackgroundClick = false
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;

      // Lock the screen - prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      setShouldRender(true);
      setIsAnimating(true);
    } else if (shouldRender) {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        // Restore scroll position and unlock screen
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';

        // Restore scroll position
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }

        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  // Cleanup effect to ensure scroll is restored on unmount
  useEffect(() => {
    return () => {
      // Restore scroll if component unmounts while popup is open
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, []);

  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Prevent any scrolling or default behavior
    e.preventDefault();
    e.stopPropagation();

    if (allowBackgroundClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent touch scrolling on the overlay
    e.preventDefault();
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`popup-lock-overlay ${isAnimating ? 'entering' : 'exiting'}`}
      onClick={handleBackgroundClick}
      onTouchMove={handleTouchMove}
      onTouchStart={(e) => e.preventDefault()}
      onWheel={(e) => e.preventDefault()}
      style={{ touchAction: 'none' }}
    >
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-pink-300 opacity-20 animate-pulse"
            size={12 + (i % 3) * 4}
            style={{
              left: `${(i * 8) % 100}%`,
              top: `${(i * 12) % 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + (i % 2)}s`
            }}
          />
        ))}
        
        {[...Array(6)].map((_, i) => (
          <Sparkles
            key={`sparkle-${i}`}
            className="absolute text-yellow-300 opacity-30 animate-ping"
            size={10}
            style={{
              left: `${15 + (i * 15)}%`,
              top: `${20 + (i * 15)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>

      <div className="popup-lock-content relative">
        {/* Close button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 z-10"
          >
            <X className="text-gray-600" size={20} />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center space-x-2 mb-3">
            <Lock className="text-purple-500" size={24} />
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-thai">
              {title}
            </h2>
            <Lock className="text-pink-500" size={24} />
          </div>
          
          <div className="flex justify-center space-x-2 mb-4">
            {['💕', '🔒', '✨', '🔒', '💕'].map((emoji, i) => (
              <span 
                key={i} 
                className="text-lg animate-bounce" 
                style={{animationDelay: `${i * 0.1}s`}}
              >
                {emoji}
              </span>
            ))}
          </div>
          
          <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Footer decoration */}
        <div className="mt-6 text-center">
          <div className="flex justify-center space-x-2">
            {['🌸', '💖', '🌺', '💕', '🌸'].map((emoji, i) => (
              <span 
                key={i} 
                className="text-sm animate-pulse opacity-60" 
                style={{animationDelay: `${i * 0.2}s`}}
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupLock;
