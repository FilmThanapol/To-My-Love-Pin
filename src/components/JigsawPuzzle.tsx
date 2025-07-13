
import React, { useState, useEffect, useRef } from 'react';

const JigsawPuzzle = () => {
  const [pieces, setPieces] = useState<Array<{id: number, x: number, y: number, correctX: number, correctY: number, placed: boolean}>>([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  const [gridSize, setGridSize] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'difficult'>('easy');
  
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


  const handleStart = (pieceId: number) => {
    setDraggedPiece(pieceId);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (draggedPiece !== null) {
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
  };

  const handleEnd = () => {
    if (draggedPiece !== null) {
      const frameSize = isMobile ? 240 : 300;
      const pieceSize = frameSize / gridSize;
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
  };

  useEffect(() => {
    const totalPieces = gridSize * gridSize;
    const placedPieces = pieces.filter(piece => piece.placed).length;
    if (placedPieces === totalPieces && pieces.length === totalPieces) {
      setIsComplete(true);
    }
  }, [pieces, gridSize]);

  const changeDifficulty = (difficulty: 'easy' | 'medium' | 'difficult') => {
    const gridSizeMap = { easy: 3, medium: 4, difficult: 6 };
    const newGridSize = gridSizeMap[difficulty];

    setSelectedDifficulty(difficulty);
    setGridSize(newGridSize);
    setIsComplete(false);

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

    // Keep current difficulty level
    initializePuzzle(gridSize);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 font-thai">
          จิ๊กซอว์ความทรงจำ 🧩
        </h2>
        <p className="text-lg text-gray-600 mb-8 font-thai">
          ลากชิ้นส่วนเพื่อประกอบภาพความทรงจำของเรา
        </p>

        {/* Difficulty Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 font-thai">เลือกระดับความยาก:</h3>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <button
              onClick={() => changeDifficulty('easy')}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold transition-all duration-300 font-thai text-sm md:text-base ${
                selectedDifficulty === 'easy'
                  ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg scale-105'
                  : 'bg-white text-green-600 border-2 border-green-400 hover:bg-green-50 hover:scale-105'
              }`}
            >
              😊 ง่าย (3×3)
            </button>

            <button
              onClick={() => changeDifficulty('medium')}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold transition-all duration-300 font-thai text-sm md:text-base ${
                selectedDifficulty === 'medium'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg scale-105'
                  : 'bg-white text-orange-600 border-2 border-orange-400 hover:bg-orange-50 hover:scale-105'
              }`}
            >
              🤔 ปานกลาง (4×4)
            </button>

            <button
              onClick={() => changeDifficulty('difficult')}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold transition-all duration-300 font-thai text-sm md:text-base ${
                selectedDifficulty === 'difficult'
                  ? 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg scale-105'
                  : 'bg-white text-red-600 border-2 border-red-400 hover:bg-red-50 hover:scale-105'
              }`}
            >
              😤 ยาก (6×6)
            </button>
          </div>
        </div>

        <div className={`relative w-full mx-auto ${isMobile ? 'max-w-sm' : 'max-w-6xl'}`}>
          {isComplete && (
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-pink-500/20 rounded-2xl flex items-center justify-center z-20">
              <div className="bg-white rounded-2xl p-6 shadow-2xl text-center max-w-sm mx-4">
                <h3 className="text-xl md:text-2xl font-bold text-pink-600 mb-2 font-thai">เสร็จแล้ว! 🎉</h3>
                <p className="text-gray-600 font-thai mb-2">ความทรงจำที่สวยงาม</p>
                <p className="text-sm text-gray-500 font-thai mb-4">
                  ระดับ: {selectedDifficulty === 'easy' ? '😊 ง่าย' : selectedDifficulty === 'medium' ? '🤔 ปานกลาง' : '😤 ยาก'} ({gridSize}×{gridSize})
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    onClick={changeImage}
                    className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 font-thai text-sm"
                  >
                    ภาพใหม่ 🔄
                  </button>
                  <button
                    onClick={() => changeDifficulty(selectedDifficulty)}
                    className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 font-thai text-sm"
                  >
                    เล่นอีกครั้ง 🎮
                  </button>
                </div>
              </div>
            </div>
          )}

          <div
            className={`relative w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-inner overflow-visible ${
              isMobile ? 'h-[500px]' : 'h-96'
            }`}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
          >
            {/* Puzzle frame - centered in the container */}
            <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl overflow-hidden ${
              isMobile ? 'w-60 h-60' : 'w-80 h-80'
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
                  <div key={i} className="border-2 border-dashed border-gray-300 rounded-lg"></div>
                ))}
              </div>
            </div>

            {/* Puzzle pieces - positioned relative to the entire container */}
            {pieces.map((piece) => {
              const frameSize = isMobile ? 240 : 300;
              const pieceSize = frameSize / gridSize;
              const frameOffset = isMobile ? frameSize/2 : 150;

              return (
                <div
                  key={piece.id}
                  className={`absolute cursor-move transition-transform duration-200 ${
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
                    zIndex: draggedPiece === piece.id ? 10 : piece.placed ? 5 : 1
                  }}
                  onMouseDown={() => !piece.placed && handleStart(piece.id)}
                  onTouchStart={() => !piece.placed && handleStart(piece.id)}
                >
                  <div className="w-full h-full border-2 border-white rounded-lg shadow-lg"></div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 font-thai mb-2">
              ระดับปัจจุบัน: <span className="font-semibold">
                {selectedDifficulty === 'easy' ? '😊 ง่าย' : selectedDifficulty === 'medium' ? '🤔 ปานกลาง' : '😤 ยาก'}
              </span> ({gridSize}×{gridSize} = {gridSize * gridSize} ชิ้น)
            </p>
            <p className="text-xs text-gray-500 font-thai">
              {isMobile ? 'แตะและลากชิ้นส่วนเข้าที่' : 'คลิกและลากชิ้นส่วนเข้าที่'}
            </p>
          </div>

          <button
            onClick={changeImage}
            className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-thai text-sm md:text-base"
          >
            เปลี่ยนภาพใหม่ 🔄
          </button>
        </div>
      </div>
    </section>
  );
};

export default JigsawPuzzle;
