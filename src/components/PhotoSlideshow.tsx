
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';

const PhotoSlideshow = memo(() => {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const photos = [
    {
      img: "/img/pin1.jpg",
      caption: "ครั้งแรกที่เค้าถ่ายโพโต้บูธเลยนะ !!",
      // date: "15 มิถุนายน 2568"
    },
    {
      img: "/img/pin7.jpg",
      caption: "มีลาเต้ด้วย 🐶 เห็นม้ายย ",
      // date: "สิงหาคม 2567"
    },
    {
      img: "/img/pin5.jpg",
      caption: "เดทแรกของเราทำไมต้องน่ารักด้วยอยากจุ๊บแก้ม !! 💖",
      // date: "กันยายน 2567"
    },
    {
      img: "/img/pin4.jpg",
      caption: "เค้าชอบฟีลตอนนี้สุดๆ ได้นั่งคุยเล่นข้างๆ แมวจ๋องมะหมาแฮปปี้ 🐶",
      // date: "ตุลาคม 2567"
    }
  ];

  const nextPhoto = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentPhoto((prev) => (prev + 1) % photos.length);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning, photos.length]);

  const prevPhoto = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentPhoto((prev) => (prev - 1 + photos.length) % photos.length);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning, photos.length]);

  // Optimized touch handlers for mobile swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(0);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd || isTransitioning) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextPhoto();
    } else if (isRightSwipe) {
      prevPhoto();
    }

    // Reset touch values
    setTouchStart(0);
    setTouchEnd(0);
  }, [touchStart, touchEnd, isTransitioning, nextPhoto, prevPhoto]);

  // Preload images for better performance
  useEffect(() => {
    photos.forEach((photo) => {
      const img = new Image();
      img.src = photo.img;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(nextPhoto, 5000);
    return () => clearInterval(timer);
  }, [nextPhoto]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 py-12 md:py-20 px-4 relative overflow-hidden">
      {/* Memoized Floating Elements - Optimized for mobile performance */}
      {useMemo(() =>
        [...Array(8)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-pink-200 opacity-30 animate-pulse"
            size={16 + (i % 3) * 4}
            style={{
              left: `${(i * 12.5) % 100}%`,
              top: `${(i * 15) % 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + (i % 2)}s`
            }}
          />
        )), []
      )}

      {/* Memoized Sparkle Effects */}
      {useMemo(() =>
        [...Array(4)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute text-yellow-300 opacity-40 animate-ping"
            style={{
              left: `${25 + (i * 25)}%`,
              top: `${20 + (i * 20)}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `2s`,
              fontSize: '12px'
            }}
          >
            ✨
          </div>
        )), []
      )}

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4 font-thai">
            ครบรอบ 1 ปี 💕
          </h2>
          <div className="flex justify-center space-x-2 mb-4">
            {['🌸', '💖', '🌺', '💕', '🌸'].map((emoji, i) => (
              <span
                key={i}
                className="text-lg md:text-xl animate-bounce"
                style={{animationDelay: `${i * 0.1}s`}}
              >
                {emoji}
              </span>
            ))}
          </div>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 font-thai px-4">
            365 วันแห่งความรักและความทรงจำดีๆ กับแมวจ๋อง 🐱
          </p>
        </div>

        <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-pink-100 mx-2 sm:mx-4">
          <div className="relative group">
            <img
              src={photos[currentPhoto].img}
              alt={photos[currentPhoto].caption}
              className={`w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] object-cover rounded-2xl shadow-lg transition-opacity duration-300 hover:shadow-xl ${
                isTransitioning ? 'opacity-75' : 'opacity-100'
              }`}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              loading="lazy"
              decoding="async"
            />

            {/* Navigation Buttons - Optimized for mobile */}
            <button
              onClick={prevPhoto}
              disabled={isTransitioning}
              className={`absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200 opacity-80 group-hover:opacity-100 ${
                isTransitioning ? 'cursor-not-allowed opacity-50' : 'hover:shadow-xl hover:scale-110 active:scale-95'
              }`}
            >
              <ChevronLeft className="text-gray-700" size={20} />
            </button>

            <button
              onClick={nextPhoto}
              disabled={isTransitioning}
              className={`absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200 opacity-80 group-hover:opacity-100 ${
                isTransitioning ? 'cursor-not-allowed opacity-50' : 'hover:shadow-xl hover:scale-110 active:scale-95'
              }`}
            >
              <ChevronRight className="text-gray-700" size={20} />
            </button>

            {/* Mobile swipe indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs opacity-60 sm:hidden">
              👈 เลื่อนดูภาพ 👉
            </div>
          </div>

          {/* Photo Info */}
          <div className="mt-4 sm:mt-6 space-y-2 px-2">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-3 sm:p-4 border border-pink-100">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 font-thai leading-relaxed">
                {photos[currentPhoto].caption}
              </h3>
            </div>
          </div>

          {/* Photo Indicators - Optimized */}
          <div className="flex justify-center space-x-3 mt-4 sm:mt-6">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isTransitioning && index !== currentPhoto) {
                    setIsTransitioning(true);
                    setCurrentPhoto(index);
                    setTimeout(() => setIsTransitioning(false), 300);
                  }
                }}
                disabled={isTransitioning}
                className={`relative transition-all duration-200 ${
                  index === currentPhoto
                    ? 'scale-125'
                    : isTransitioning ? 'cursor-not-allowed' : 'hover:scale-110 active:scale-95'
                }`}
              >
                <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-200 ${
                  index === currentPhoto
                    ? 'bg-gradient-to-r from-pink-400 to-purple-400 shadow-lg'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`} />
                {index === currentPhoto && (
                  <div className="absolute inset-0 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white/30 animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Progress indicator */}
          <div className="mt-4 text-center">
            <span className="text-xs sm:text-sm text-gray-500 font-thai">
              {currentPhoto + 1} / {photos.length} 📸
            </span>
          </div>
        </div>
      </div>
    </section>
  );
});

export default PhotoSlideshow;
