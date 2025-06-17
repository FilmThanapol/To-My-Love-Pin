
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface PinScreenProps {
  onUnlock: () => void;
}

const PinScreen = ({ onUnlock }: PinScreenProps) => {
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [shake, setShake] = useState(false);
  const correctPin = '180724'; // January 1st, 2024 format
  
  const handleNumberClick = (num: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + num);
    }
  };

  const handleClear = () => {
    setPin('');
  };

  const handleSubmit = () => {
    if (pin === correctPin) {
      onUnlock();
    } else {
      setAttempts(prev => prev + 1);
      setShake(true);
      setPin('');
      setTimeout(() => setShake(false), 500);
    }
  };

  useEffect(() => {
    if (pin.length === 6) {
      handleSubmit();
    }
  }, [pin]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Hearts Background */}
      {[...Array(15)].map((_, i) => (
        <Heart
          key={i}
          className={`absolute text-pink-300 opacity-20 animate-bounce`}
          size={Math.random() * 30 + 20}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-sm w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">💕 ครบรอบ 1 ปี 💕</h1>
          <p className="text-gray-600">ใส่วันที่พิเศษของเรา</p>
          {attempts > 0 && (
            <p className="text-pink-500 mt-2 text-sm">
              {attempts >= 3 ? "คุณลืมวันพิเศษของเราหรือเปล่า? 😘" : `ลองอีกครั้ง... เหลือ ${3 - attempts} ครั้ง`}
            </p>
          )}
        </div>

        {/* PIN Display */}
        <div className={`flex justify-center mb-8 ${shake ? 'animate-bounce' : ''}`}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 mx-2 rounded-full border-2 transition-all duration-300 ${
                i < pin.length 
                  ? 'bg-pink-400 border-pink-400 scale-110' 
                  : 'bg-transparent border-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              className="aspect-square rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 transition-all duration-200 flex items-center justify-center text-xl font-semibold text-gray-700 shadow-lg hover:shadow-xl active:scale-95"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="aspect-square rounded-2xl bg-gradient-to-br from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 transition-all duration-200 flex items-center justify-center text-sm font-medium text-red-600 shadow-lg hover:shadow-xl active:scale-95"
          >
            ลบ
          </button>
          <button
            onClick={() => handleNumberClick('0')}
            className="aspect-square rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 transition-all duration-200 flex items-center justify-center text-xl font-semibold text-gray-700 shadow-lg hover:shadow-xl active:scale-95"
          >
            0
          </button>
        </div>

        <p className="text-center text-sm text-gray-500">
          คำใบ้: วันแรกที่เราเจอกัน! (DDMMYY)
        </p>
      </div>
    </div>
  );
};

export default PinScreen;
