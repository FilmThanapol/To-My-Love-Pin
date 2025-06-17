
import React, { useState, useEffect, useRef } from 'react';

const JigsawPuzzle = () => {
  const [pieces, setPieces] = useState<Array<{id: number, x: number, y: number, correctX: number, correctY: number, placed: boolean}>>([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  
  const images = [
    '/api/placeholder/400/300',
    '/api/placeholder/400/300',
    '/api/placeholder/400/300',
    '/api/placeholder/400/300',
    '/api/placeholder/400/300'
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
        x: Math.random() * 200 + 50, // Random initial position
        y: Math.random() * 200 + 50,
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
          // Check if piece is close to correct position
          const distance = Math.sqrt(
            Math.pow(piece.x - piece.correctX, 2) + 
            Math.pow(piece.y - piece.correctY, 2)
          );
          
          if (distance < 30) {
            return { ...piece, x: piece.correctX, y: piece.correctY, placed: true };
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

  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 font-thai">
          จิ๊กซอว์ความทรงจำ 🧩
        </h2>
        <p className="text-lg text-gray-600 mb-12 font-thai">
          ลากชิ้นส่วนเพื่อประกอบภาพความทรงจำของเรา
        </p>

        <div className="relative">
          {isComplete && (
            <div className="absolute inset-0 bg-pink-500/20 rounded-2xl flex items-center justify-center z-10">
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-pink-600 mb-4 font-thai">เสร็จแล้ว! 🎉</h3>
                <p className="text-gray-600 font-thai">ความทรงจำที่สวยงาม</p>
              </div>
            </div>
          )}

          <div 
            className="relative w-80 h-80 mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Puzzle grid background */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 p-2">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="border-2 border-dashed border-gray-300 rounded-lg"></div>
              ))}
            </div>

            {/* Puzzle pieces */}
            {pieces.map((piece) => (
              <div
                key={piece.id}
                className={`absolute w-[100px] h-[100px] cursor-move transition-transform duration-200 ${
                  piece.placed ? 'cursor-default' : 'hover:scale-105'
                }`}
                style={{
                  left: piece.x,
                  top: piece.y,
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
          onClick={() => window.location.reload()}
          className="mt-8 bg-gradient-to-r from-pink-400 to-purple-400 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-thai"
        >
          เปลี่ยนภาพใหม่ 🔄
        </button>
      </div>
    </section>
  );
};

export default JigsawPuzzle;
