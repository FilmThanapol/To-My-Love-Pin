
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PopupLock from './PopupLock';
import { usePopupLock } from '../hooks/usePopupLock';

// Utility function to ensure proper emoji rendering across all platforms
const EmojiSpan = ({ children, className = "" }: { children: string; className?: string }) => (
  <span className={`emoji ${className}`} role="img" aria-label={children}>
    {children}
  </span>
);

const JigsawPuzzle = () => {
  const [pieces, setPieces] = useState<Array<{id: number, x: number, y: number, correctX: number, correctY: number, placed: boolean}>>([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  const [gridSize, setGridSize] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'difficult'>('easy');
  const [showMagicalReveal, setShowMagicalReveal] = useState(false);
  const [showSeamlessImage, setShowSeamlessImage] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Throttling for mobile performance
  const lastMoveTime = useRef(0);

  // Cheerful completion sound
  const playCompletionSound = useCallback(() => {
    try {
      // Create a simple cheerful melody using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

      notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1 + index * 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5 + index * 0.2);

        oscillator.start(audioContext.currentTime + index * 0.2);
        oscillator.stop(audioContext.currentTime + 0.5 + index * 0.2);
      });
    } catch (error) {
      // Fallback: no sound if Web Audio API is not supported
      console.log('Audio not supported');
    }
  }, []);

  // Popup lock functionality
  const { isOpen: isHelpOpen, openPopup: openHelp, closePopup: closeHelp } = usePopupLock();
  
  const images = [
    '/img/film1.jpg',
    '/img/film2.jpg',
    '/img/film3.jpg',
    '/img/film4.jpg',
    '/img/pin6.jpg',
    '/img/pin4.jpg',
    '/img/pin7.jpg',
    '/img/pin8.jpg',
    '/img/pin9.jpg',
  ];

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Preload images for better performance
    images.forEach(imageSrc => {
      const img = new Image();
      img.src = imageSrc;
    });

    // Select random image
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setSelectedImage(randomImage);

    // Initialize with easy difficulty (3x3)
    setGridSize(3);
    setSelectedDifficulty('easy');

    // Initialize puzzle pieces with default grid size
    initializePuzzle(3);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const initializePuzzle = (size: number) => {
    const totalPieces = size * size;
    const pieceSize = isMobile ? 240 / size : 300 / size; // Responsive piece size
    const initialPieces = [];

    for (let i = 0; i < totalPieces; i++) {
      const row = Math.floor(i / size);
      const col = i % size;

      // Mobile-friendly positioning
      const scatterArea = isMobile ?
        { width: 300, height: 400, offsetX: 20, offsetY: 50 } :
        { width: 400, height: 300, offsetX: 450, offsetY: 50 };

      initialPieces.push({
        id: i,
        x: Math.random() * scatterArea.width + scatterArea.offsetX,
        y: Math.random() * scatterArea.height + scatterArea.offsetY,
        correctX: col * pieceSize,
        correctY: row * pieceSize,
        placed: false
      });
    }
    setPieces(initialPieces);
  };


  const handleStart = useCallback((pieceId: number) => {
    setDraggedPiece(pieceId);
  }, []);

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (draggedPiece !== null) {
      // Prevent scrolling during drag on mobile
      e.preventDefault();
      e.stopPropagation();

      // Prevent body scrolling on mobile
      if ('touches' in e) {
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
      }

      // Throttle updates for mobile performance
      const now = Date.now();
      if (isMobile && now - lastMoveTime.current < 16) { // ~60fps
        return;
      }
      lastMoveTime.current = now;

      const rect = e.currentTarget.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const pieceSize = isMobile ? 240 / gridSize : 300 / gridSize;

      setPieces(prev => prev.map(piece =>
        piece.id === draggedPiece
          ? { ...piece, x: x - pieceSize/2, y: y - pieceSize/2 }
          : piece
      ));
    }
  }, [draggedPiece, isMobile, gridSize]);

  const handleEnd = useCallback(() => {
    // Restore scrolling on mobile
    document.body.style.overflow = '';
    document.body.style.touchAction = '';

    if (draggedPiece !== null) {
      const frameSize = isMobile ? 240 : 300;
      const frameOffset = isMobile ? frameSize/2 : 150;

      setPieces(prev => prev.map(piece => {
        if (piece.id === draggedPiece) {
          // Check if piece is close to correct position within the frame
          const distance = Math.sqrt(
            Math.pow(piece.x - (piece.correctX + (isMobile ? 120 : 250) - frameOffset), 2) +
            Math.pow(piece.y - (piece.correctY + (isMobile ? 120 : 100) - frameOffset), 2)
          );

          if (distance < (isMobile ? 30 : 50)) {
            // Snap to exact position
            return {
              ...piece,
              x: piece.correctX + (isMobile ? 120 : 250) - frameOffset,
              y: piece.correctY + (isMobile ? 120 : 100) - frameOffset,
              placed: true
            };
          }
        }
        return piece;
      }));

      setDraggedPiece(null);
    }
  }, [draggedPiece, isMobile]);

  useEffect(() => {
    const totalPieces = gridSize * gridSize;

    // Check completion
    const allPiecesPlaced = pieces.every(piece => piece.placed);

    if (allPiecesPlaced && pieces.length === totalPieces && !isComplete && !showMagicalReveal) {

      // Step 1: Start magical reveal with sparkles
      setShowMagicalReveal(true);
      playCompletionSound();

      // Step 2: After 1 second, show seamless image
      setTimeout(() => {
        setShowSeamlessImage(true);
      }, 1000);

      // Step 3: After 2.5 seconds, show celebration popup
      setTimeout(() => {
        setShowCelebration(true);
        setIsComplete(true);
        setShowMagicalReveal(false);
      }, 2500);
    }
  }, [pieces, gridSize, isComplete, showMagicalReveal]);

  const resetPuzzle = useCallback(() => {
    setIsComplete(false);
    setShowMagicalReveal(false);
    setShowSeamlessImage(false);
    setShowCelebration(false);
    setDraggedPiece(null);
    initializePuzzle(gridSize);
  }, [gridSize, initializePuzzle]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Cleanup on unmount
    };
  }, []);

  const changeDifficulty = (difficulty: 'easy' | 'medium' | 'difficult') => {
    const gridSizeMap = { easy: 3, medium: 4, difficult: 6 };
    const newGridSize = gridSizeMap[difficulty];

    setSelectedDifficulty(difficulty);
    setGridSize(newGridSize);
    setIsComplete(false);
    setShowMagicalReveal(false);

    // Reinitialize puzzle with new grid size
    initializePuzzle(newGridSize);
  };

  const changeImage = () => {
    // Select a different random image
    let newImage: string;
    do {
      newImage = images[Math.floor(Math.random() * images.length)];
    } while (newImage === selectedImage && images.length > 1);

    setSelectedImage(newImage);
    setIsComplete(false);
    setShowMagicalReveal(false);

    // Keep current difficulty level
    initializePuzzle(gridSize);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-12 md:py-20 px-4 relative overflow-hidden">
      {/* Floating puzzle pieces background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-purple-200 opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              fontSize: `${14 + Math.random() * 10}px`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          >
            🧩
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 font-thai">
            เกมจิ๊กซอว์ความทรงจำ <span className="emoji">🧩</span>
          </h2>
          <div className="flex justify-center space-x-2 mb-4">
            {['🧩', '💕', '🌸', '💖', '🧩'].map((emoji, i) => (
              <span
                key={i}
                className="text-lg md:text-xl animate-bounce emoji"
                style={{animationDelay: `${i * 0.1}s`}}
              >
                {emoji}
              </span>
            ))}
          </div>
          <p className="text-base md:text-lg text-gray-600 font-thai px-4">
            ลากชิ้นส่วนเพื่อประกอบภาพความทรงจำของเรา
          </p>
        </div>

        {/* Difficulty Selection - Enhanced */}
        <div className="mb-8 md:mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-purple-100 mx-2 sm:mx-4">
            <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-4 font-thai"><span className="emoji">🎯</span> เลือกระดับความยาก:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <button
                onClick={() => changeDifficulty('easy')}
                className={`px-4 py-3 md:px-6 md:py-4 rounded-2xl font-semibold transition-all duration-300 font-thai text-sm md:text-base shadow-lg hover:shadow-xl ${
                  selectedDifficulty === 'easy'
                    ? 'bg-gradient-to-r from-green-400 to-green-500 text-white scale-105 ring-2 ring-green-300'
                    : 'bg-white text-green-600 border-2 border-green-400 hover:bg-green-50 hover:scale-105'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-2xl">😊</span>
                  <span>ง่าย</span>
                  <span className="text-xs opacity-80">(3×3 = 9 ชิ้น)</span>
                </div>
              </button>

              <button
                onClick={() => changeDifficulty('medium')}
                className={`px-4 py-3 md:px-6 md:py-4 rounded-2xl font-semibold transition-all duration-300 font-thai text-sm md:text-base shadow-lg hover:shadow-xl ${
                  selectedDifficulty === 'medium'
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white scale-105 ring-2 ring-orange-300'
                    : 'bg-white text-orange-600 border-2 border-orange-400 hover:bg-orange-50 hover:scale-105'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-2xl">🤔</span>
                  <span>ปานกลาง</span>
                  <span className="text-xs opacity-80">(4×4 = 16 ชิ้น)</span>
                </div>
              </button>

              <button
                onClick={() => changeDifficulty('difficult')}
                className={`px-4 py-3 md:px-6 md:py-4 rounded-2xl font-semibold transition-all duration-300 font-thai text-sm md:text-base shadow-lg hover:shadow-xl ${
                  selectedDifficulty === 'difficult'
                    ? 'bg-gradient-to-r from-red-400 to-red-500 text-white scale-105 ring-2 ring-red-300'
                    : 'bg-white text-red-600 border-2 border-red-400 hover:bg-red-50 hover:scale-105'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-2xl">😤</span>
                  <span>ยาก</span>
                  <span className="text-xs opacity-80">(6×6 = 36 ชิ้น)</span>
                </div>
              </button>
            </div>
          </div>
        </div>



        <div className={`relative w-full mx-auto ${isMobile ? 'max-w-sm' : 'max-w-6xl'}`}>
          {/* Magical Reveal Overlay */}
          {showMagicalReveal && (
            <div className="fixed inset-0 bg-gradient-to-br from-purple-900/90 via-pink-900/90 to-indigo-900/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
              {/* Twinkling Stars Background */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-twinkle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${2 + Math.random() * 2}s`
                    }}
                  >
                    ✨
                  </div>
                ))}
              </div>

              {/* Magical Sparkle Effects */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-sparkle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      fontSize: `${0.8 + Math.random() * 1.2}rem`
                    }}
                  >
                    💫
                  </div>
                ))}
              </div>

              {/* Main Reveal Container */}
              <div className="relative z-10 text-center">
                {/* Seamless Completed Image */}
                <div className="relative mb-8">
                  <div className="w-80 h-80 md:w-96 md:h-96 mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30 animate-magicalGrow">
                    <img
                      src={selectedImage}
                      alt="Completed Puzzle"
                      className="w-full h-full object-cover animate-gentleFadeIn"
                    />
                  </div>

                  {/* Magical Glow Effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-yellow-400/20 animate-pulse"></div>

                  {/* Floating Hearts */}
                  <div className="absolute -top-4 -left-4 text-4xl animate-float">💖</div>
                  <div className="absolute -top-4 -right-4 text-4xl animate-float" style={{animationDelay: '0.5s'}}>💝</div>
                  <div className="absolute -bottom-4 -left-4 text-4xl animate-float" style={{animationDelay: '1s'}}>🌟</div>
                  <div className="absolute -bottom-4 -right-4 text-4xl animate-float" style={{animationDelay: '1.5s'}}>✨</div>
                </div>

                {/* Magical Text */}
                <div className="text-white text-center animate-slideInUp" style={{animationDelay: '1s'}}>
                  <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-shimmer font-thai">
                    ✨ เสร็จสิ้นแล้ว! ✨
                  </h2>
                  <p className="text-xl md:text-2xl text-purple-100 font-thai animate-slideInUp" style={{animationDelay: '1.5s'}}>
                    ความทรงจำที่สวยงาม 💖
                  </p>
                </div>
              </div>
            </div>
          )}

          {showCelebration && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
              <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-3xl p-6 md:p-8 max-w-lg w-full mx-4 text-center shadow-2xl border-4 border-purple-200 animate-scaleIn relative overflow-hidden">

                {/* Close Button */}
                <button
                  onClick={() => {
                    setShowCelebration(false);
                    setShowSeamlessImage(false);
                    setShowMagicalReveal(false);
                  }}
                  className="absolute top-4 right-4 w-8 h-8 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg z-10"
                  aria-label="Close popup"
                >
                  <span className="text-sm font-bold">✕</span>
                </button>
                {/* Completed Image Display */}
                <div className="mb-6 relative">
                  <div className="w-full max-w-sm mx-auto aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-purple-100 animate-fadeInScale">
                    <img
                      src={selectedImage}
                      alt="Completed Puzzle"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-5 -right-2 text-4xl animate-bounce">🎉</div>
                  <div className="absolute -top-2 -left-2 text-4xl animate-bounce" style={{animationDelay: '0.2s'}}>✨</div>
                  <div className="absolute -bottom-2 -right-2 text-4xl animate-bounce" style={{animationDelay: '0.4s'}}>🎊</div>
                  <div className="absolute -bottom-2 -left-2 text-4xl animate-bounce" style={{animationDelay: '0.6s'}}>🧩</div>

                  {/* Extra floating decorations */}
                  <div className="absolute top-1/2 -left-8 text-2xl animate-float">💖</div>
                  <div className="absolute top-1/2 -right-8 text-2xl animate-float" style={{animationDelay: '0.8s'}}>💝</div>
                </div>

                {/* Floating sparkles */}
                <div className="absolute top-4 left-4 text-2xl animate-bounce">✨</div>
                <div className="absolute top-4 right-4 text-2xl animate-bounce" style={{animationDelay: '0.3s'}}>🎊</div>
                <div className="absolute bottom-4 left-4 text-2xl animate-bounce" style={{animationDelay: '0.6s'}}>💫</div>
                <div className="absolute bottom-4 right-4 text-2xl animate-bounce" style={{animationDelay: '0.9s'}}>🎉</div>

                <div className="text-6xl md:text-8xl mb-4 animate-pulse">🏆</div>
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4 animate-slideInUp font-thai">
                  🎉 เยี่ยมมาก! เสร็จแล้ว! 🎉
                </h2>
                <p className="text-gray-600 mb-6 text-sm md:text-base animate-slideInUp font-thai" style={{animationDelay: '0.2s'}}>
                  เก่งมากเลยนะคะ! 😸 ประกอบจิ๊กซอว์ {gridSize}×{gridSize} ชิ้นสำเร็จแล้ว! 🧩✨<br/>
                  <span className="text-purple-500 font-semibold">
                    ระดับความยาก: {selectedDifficulty === 'easy' ? '😊 ง่าย' : selectedDifficulty === 'medium' ? '🤔 ปานกลาง' : '😤 ยาก'}
                  </span><br/>
                  <span className="text-pink-500 text-xs md:text-sm">
                    ความทรงจำสวยงามของเราเสร็จสมบูรณ์แล้ว 💕
                  </span>
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slideInUp" style={{animationDelay: '0.4s'}}>
                  <button
                    onClick={resetPuzzle}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm md:text-base font-thai"
                  >
                    🔄 เล่นภาพนี้อีกครั้ง
                  </button>
                  <button
                    onClick={changeImage}
                    className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm md:text-base font-thai"
                  >
                    🎮 ความทรงจำใหม่
                  </button>
                </div>
              </div>
            </div>
          )}

          <div
            className={`puzzle-container relative w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-3xl shadow-inner overflow-visible border border-gray-200 ${
              isMobile ? 'h-[500px] sm:h-[600px]' : 'h-96 md:h-[500px]'
            }`}
            style={{ touchAction: 'none' }}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
          >
            {/* Puzzle frame - centered in the container */}
            <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-purple-100 ${
              isMobile ? 'w-60 h-60 sm:w-72 sm:h-72' : 'w-80 h-80 md:w-96 md:h-96'
            }`}>
              {/* Puzzle grid background */}
              <div
                className="absolute inset-0 gap-1 p-2"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                  gridTemplateRows: `repeat(${gridSize}, 1fr)`
                }}
              >
                {[...Array(gridSize * gridSize)].map((_, i) => (
                  <div key={i} className="border-2 border-dashed border-purple-200 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 opacity-50"></div>
                ))}
              </div>

              {/* Frame decoration */}
              <div className="absolute -top-2 -left-2 text-purple-400 text-xl">🧩</div>
              <div className="absolute -top-2 -right-2 text-pink-400 text-xl">💕</div>
              <div className="absolute -bottom-2 -left-2 text-pink-400 text-xl">💖</div>
              <div className="absolute -bottom-2 -right-2 text-purple-400 text-xl">🧩</div>
            </div>

            {/* Seamless Image Reveal - appears when puzzle is completed */}
            {showSeamlessImage && (
              <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-3xl overflow-hidden shadow-2xl transition-all duration-1000 ease-out ${
                showSeamlessImage ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
              } ${isMobile ? 'w-60 h-60 sm:w-72 sm:h-72' : 'w-80 h-80 md:w-96 md:h-96'}`}>
                <img
                  src={selectedImage}
                  alt="Completed puzzle"
                  className="w-full h-full object-cover animate-pulse"
                  style={{
                    animation: 'fadeInScale 1s ease-out forwards'
                  }}
                />
                {/* Magical glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20 animate-pulse"></div>
              </div>
            )}

            {/* Puzzle pieces - Optimized for mobile performance */}
            {useMemo(() => {
              const frameSize = isMobile ? 240 : 300;
              const pieceSize = frameSize / gridSize;
              const frameOffset = isMobile ? frameSize/2 : 150;

              return pieces.map((piece) => (
                <div
                  key={piece.id}
                  className={`jigsaw-piece absolute cursor-move ${
                    piece.placed ? 'cursor-default' : 'hover:scale-105 active:scale-110'
                  }`}
                  style={{
                    width: `${pieceSize}px`,
                    height: `${pieceSize}px`,
                    left: piece.placed ? `calc(50% - ${frameOffset}px + ${piece.correctX}px)` : piece.x,
                    top: piece.placed ? `calc(50% - ${frameOffset}px + ${piece.correctY}px)` : piece.y,
                    backgroundImage: `url(${selectedImage})`,
                    backgroundSize: `${frameSize}px ${frameSize}px`,
                    backgroundPosition: `-${(piece.id % gridSize) * pieceSize}px -${Math.floor(piece.id / gridSize) * pieceSize}px`,
                    zIndex: draggedPiece === piece.id ? 10 : piece.placed ? 5 : 1,
                    transform: draggedPiece === piece.id ? 'scale(1.05)' : 'scale(1)',
                    willChange: draggedPiece === piece.id ? 'transform' : 'auto',
                    transition: draggedPiece === piece.id ? 'none' : 'transform 0.2s ease'
                  }}
                  onMouseDown={() => {
                    if (!piece.placed) {
                      handleStart(piece.id);
                    }
                  }}
                  onTouchStart={(e) => {
                    if (!piece.placed) {
                      e.preventDefault(); // Only prevent on touch to stop scroll-to-top
                      handleStart(piece.id);
                    }
                  }}
                >
                  <div className="w-full h-full border-2 border-white rounded-lg shadow-lg"></div>
                </div>
              ));
            }, [pieces, isMobile, gridSize, selectedImage, draggedPiece, handleStart])}
          </div>
        </div>

        <div className="mt-8 md:mt-12 flex flex-col items-center space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-purple-100 text-center max-w-md mx-4">
            <div className="mb-3">
              <p className="text-sm md:text-base text-gray-700 font-thai mb-2">
                🎯 ระดับปัจจุบัน: <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {selectedDifficulty === 'easy' ? '😊 ง่าย' : selectedDifficulty === 'medium' ? '🤔 ปานกลาง' : '😤 ยาก'}
                </span>
              </p>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-2 border border-purple-100">
                <p className="text-xs md:text-sm text-gray-600 font-thai">
                  {gridSize}×{gridSize} = {gridSize * gridSize} ชิ้น
                </p>
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-500 font-thai">
              {isMobile ? '👆 แตะและลากชิ้นส่วนเข้าที่' : '🖱️ คลิกและลากชิ้นส่วนเข้าที่'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <button
              onClick={changeImage}
              className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-thai text-sm md:text-base"
            >
              เปลี่ยนภาพใหม่ 🔄
            </button>

            <button
              onClick={openHelp}
              className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-thai text-sm md:text-base"
            >
              ช่วยเหลือ ❓
            </button>

            <div className="flex space-x-2">
              {['🧩', '💕', '🌸'].map((emoji, i) => (
                <span
                  key={i}
                  className="text-lg animate-pulse opacity-60"
                  style={{animationDelay: `${i * 0.3}s`}}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Helper Buttons - Centered and Responsive */}
        <div className="mt-8 mb-8 flex justify-center px-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-xl border border-purple-200 max-w-2xl w-full">
            <div className="text-center mb-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-700 font-thai flex items-center justify-center gap-2">
                <span className="text-xl emoji">🎮</span>
                ตัวช่วยเล่นเกม
                <span className="text-xl emoji">✨</span>
              </h3>
              <p className="text-xs md:text-sm text-gray-500 mt-1 font-thai">
                <span className="emoji">💡</span> ใช้เมื่อต้องการความช่วยเหลือหรือดูตัวอย่าง
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <button
                onClick={() => {
                  setShowMagicalReveal(true);
                  playCompletionSound();
                  setTimeout(() => setShowSeamlessImage(true), 1000);
                  setTimeout(() => {
                    setShowCelebration(true);
                    setIsComplete(true);
                    setShowMagicalReveal(false);
                  }, 2500);
                }}
                className="group bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 text-white px-4 md:px-6 py-3 md:py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-thai text-sm md:text-base relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <span className="text-lg emoji">✨</span>
                  <span>ดูตัวอย่างเมื่อเสร็จ</span>
                  <span className="text-lg emoji">🎉</span>
                </div>
              </button>

              <button
                onClick={() => {
                  const frameSize = isMobile ? 240 : 300;
                  const frameOffset = isMobile ? frameSize/2 : 150;

                  setPieces(prev => prev.map(piece => ({
                    ...piece,
                    x: piece.correctX + (isMobile ? 120 : 250) - frameOffset,
                    y: piece.correctY + (isMobile ? 120 : 100) - frameOffset,
                    placed: true
                  })));
                }}
                className="group bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 text-white px-4 md:px-6 py-3 md:py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-thai text-sm md:text-base relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <span className="text-lg emoji">🧩</span>
                  <span>เฉลยให้หน่อย</span>
                  <span className="text-lg emoji">💡</span>
                </div>
              </button>
            </div>

            <div className="mt-4 text-center">
              <div className="flex justify-center items-center gap-2 text-xs md:text-sm text-gray-400 font-thai">
                <span className="emoji">🌟</span>
                <span>สนุกกับการเล่นจิ๊กซอว์ความทรงจำ</span>
                <span className="emoji">💖</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Popup Lock */}
      <PopupLock
        isOpen={isHelpOpen}
        onClose={closeHelp}
        title="🧩 วิธีเล่นจิ๊กซอว์"
        allowBackgroundClick={true}
      >
        <div className="space-y-4 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3 font-thai">📱 วิธีเล่นบนมือถือ</h3>
            <ul className="text-sm text-gray-600 space-y-2 font-thai text-left">
              <li>• <strong>แตะและลาก</strong> ชิ้นส่วนจิ๊กซอว์เข้าที่</li>
              <li>• <strong>ลากชิ้นส่วน</strong> ไปใกล้ตำแหน่งที่ถูกต้อง</li>
              <li>• <strong>ชิ้นส่วนจะติด</strong> เมื่ออยู่ใกล้ตำแหน่งที่ถูกต้อง</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3 font-thai">🎯 ระดับความยาก</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="bg-green-100 rounded-lg p-3 border border-green-200">
                <div className="text-2xl mb-1">😊</div>
                <div className="font-bold text-green-700 font-thai">ง่าย</div>
                <div className="text-green-600 font-thai">3×3 = 9 ชิ้น</div>
              </div>
              <div className="bg-orange-100 rounded-lg p-3 border border-orange-200">
                <div className="text-2xl mb-1">🤔</div>
                <div className="font-bold text-orange-700 font-thai">ปานกลาง</div>
                <div className="text-orange-600 font-thai">4×4 = 16 ชิ้น</div>
              </div>
              <div className="bg-red-100 rounded-lg p-3 border border-red-200">
                <div className="text-2xl mb-1">😤</div>
                <div className="font-bold text-red-700 font-thai">ยาก</div>
                <div className="text-red-600 font-thai">6×6 = 36 ชิ้น</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3 font-thai">💡 เคล็ดลับ</h3>
            <ul className="text-sm text-gray-600 space-y-2 font-thai text-left">
              <li>• เริ่มจากชิ้นส่วนมุมและขอบก่อน</li>
              <li>• ดูสีและลวดลายให้ดี</li>
              <li>• อดทนและสนุกกับการเล่น! 🎉</li>
            </ul>
          </div>
        </div>
      </PopupLock>

      {/* CSS Animations for magical reveal */}
      <style>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes sparkleFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.7;
          }
        }

        .animate-fadeInScale {
          animation: fadeInScale 1s ease-out forwards;
        }

        .animate-sparkleFloat {
          animation: sparkleFloat 2s ease-in-out infinite;
        }
      `}</style>

    </section>
  );
};

export default JigsawPuzzle;
