
import React, { useState, useEffect, useRef } from 'react';

const JigsawPuzzle = () => {
  const [pieces, setPieces] = useState<Array<{id: number, x: number, y: number, correctX: number, correctY: number, placed: boolean}>>([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  
  const images = [
    '/img/1.jpg',
    '/img/2.jpg'
  ];

  useEffect(() => {
    // Select random image
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setSelectedImage(randomImage);
    
    // Initialize puzzle pieces (3x3 grid)
    const initialPieces = [];
    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      initialPieces.push({
        id: i,
        x: Math.random() * 400 + 450, // Position pieces to the right of the frame
        y: Math.random() * 300 + 50,  // Spread them vertically
        correctX: col * 100,
        correctY: row * 100,
        placed: false
      });
    }
    setPieces(initialPieces);
  }, []);


  const handleMouseDown = (pieceId: number) => {
    setDraggedPiece(pieceId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedPiece !== null) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setPieces(prev => prev.map(piece => 
        piece.id === draggedPiece 
          ? { ...piece, x: x - 50, y: y - 50 }
          : piece
      ));
    }
  };

  const handleMouseUp = () => {
    if (draggedPiece !== null) {
      setPieces(prev => prev.map(piece => {
        if (piece.id === draggedPiece) {
          // Check if piece is close to correct position within the frame
          // The correct position is relative to the puzzle frame center
          const distance = Math.sqrt(
            Math.pow(piece.x - (piece.correctX + 250), 2) + // 250px offset for frame center
            Math.pow(piece.y - (piece.correctY + 100), 2)   // 100px offset for frame center
          );

          if (distance < 50) {
            // Snap to exact position
            return {
              ...piece,
              x: piece.correctX + 250,
              y: piece.correctY + 100,
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
    const placedPieces = pieces.filter(piece => piece.placed).length;
    if (placedPieces === 9 && pieces.length === 9) {
      setIsComplete(true);
    }
  }, [pieces]);

  const changeImage = () => {
    // Select a different random image
    let newImage: string;
    do {
      newImage = images[Math.floor(Math.random() * images.length)];
    } while (newImage === selectedImage && images.length > 1);

    setSelectedImage(newImage);
    setIsComplete(false);

    // Reset all pieces to unplaced and scatter them again
    setPieces(prev => prev.map(piece => ({
      ...piece,
      x: Math.random() * 400 + 450,
      y: Math.random() * 300 + 50,
      placed: false
    })));
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 font-thai">
          จิ๊กซอว์ความทรงจำ 🧩
        </h2>
        <p className="text-lg text-gray-600 mb-12 font-thai">
          ลากชิ้นส่วนเพื่อประกอบภาพความทรงจำของเรา
        </p>

        <div className="relative w-full max-w-6xl mx-auto">
          {isComplete && (
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-pink-500/20 rounded-2xl flex items-center justify-center z-10 w-80 h-80">
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-pink-600 mb-4 font-thai">เสร็จแล้ว! 🎉</h3>
                <p className="text-gray-600 font-thai">ความทรงจำที่สวยงาม</p>
              </div>
            </div>
          )}

          <div
            className="relative w-full h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-inner overflow-visible"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Puzzle frame - centered in the container */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Puzzle grid background */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 p-2">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border-2 border-dashed border-gray-300 rounded-lg"></div>
                ))}
              </div>
            </div>

            {/* Puzzle pieces - positioned relative to the entire container */}
            {pieces.map((piece) => (
              <div
                key={piece.id}
                className={`absolute w-[100px] h-[100px] cursor-move transition-transform duration-200 ${
                  piece.placed ? 'cursor-default' : 'hover:scale-105'
                }`}
                style={{
                  left: piece.placed ? `calc(50% - 150px + ${piece.correctX}px)` : piece.x,
                  top: piece.placed ? `calc(50% - 150px + ${piece.correctY}px)` : piece.y,
                  backgroundImage: `url(${selectedImage})`,
                  backgroundSize: '300px 300px',
                  backgroundPosition: `-${(piece.id % 3) * 100}px -${Math.floor(piece.id / 3) * 100}px`,
                  zIndex: draggedPiece === piece.id ? 10 : piece.placed ? 5 : 1
                }}
                onMouseDown={() => !piece.placed && handleMouseDown(piece.id)}
              >
                <div className="w-full h-full border-2 border-white rounded-lg shadow-lg"></div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={changeImage}
          className="mt-8 bg-gradient-to-r from-pink-400 to-purple-400 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-thai"
        >
          เปลี่ยนภาพใหม่ 🔄
        </button>
      </div>
    </section>
  );
};

export default JigsawPuzzle;
