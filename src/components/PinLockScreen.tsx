
import React, { useState, useEffect } from 'react';
import { Heart, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PinLockScreenProps {
  onUnlock: () => void;
}

const PinLockScreen = ({ onUnlock }: PinLockScreenProps) => {
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const errorMessages = [
    "Oops! Have you forgotten our special date? 💕",
    "That's not quite right, my love! 💖",
    "Hmm... think about our first anniversary! 🌹"
  ];

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPin(value);
    setError('');
  };

  const validatePin = async () => {
    if (pin.length !== 6) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pin_lock')
        .select('pin_code')
        .single();

      if (error) {
        console.error('Error fetching PIN:', error);
        setError('Something went wrong. Try again! 💔');
        return;
      }

      if (data.pin_code === pin) {
        // Successful unlock
        onUnlock();
      } else {
        // Wrong PIN
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          setError("Too many attempts! But I still love you... 😘 Try refreshing!");
        } else {
          setError(errorMessages[newAttempts - 1] || errorMessages[0]);
        }
        
        setShake(true);
        setPin('');
        setTimeout(() => setShake(false), 500);
      }
    } catch (err) {
      console.error('Validation error:', err);
      setError('Connection error. Try again! 💝');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (pin.length === 6) {
      validatePin();
    }
  }, [pin]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Hearts Background */}
      {[...Array(20)].map((_, i) => (
        <Heart
          key={i}
          className="absolute text-pink-300 opacity-30 animate-bounce"
          size={Math.random() * 40 + 15}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}

      {/* Sparkles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className="absolute text-yellow-300 opacity-40 animate-pulse text-lg"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        >
          ✨
        </div>
      ))}

      <div className={`bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl max-w-md w-full transform transition-all duration-500 ${
        shake ? 'animate-bounce' : 'hover:scale-105'
      }`}>
        {/* Lock Icon */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 font-serif">💕 Our Love Story 💕</h1>
          <p className="text-gray-600 text-lg">Enter our special anniversary date</p>
          <p className="text-sm text-gray-500 mt-1">6 digits: MMDDYY</p>
        </div>

        {/* PIN Input */}
        <div className="mb-6">
          <input
            type="password"
            value={pin}
            onChange={handlePinChange}
            placeholder="••••••"
            className="w-full text-center text-3xl font-bold py-4 px-6 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all duration-300 bg-pink-50/50 text-gray-800 tracking-widest"
            maxLength={6}
            disabled={isLoading || attempts >= 3}
          />
        </div>

        {/* PIN Dots Indicator */}
        <div className="flex justify-center mb-6 space-x-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                i < pin.length 
                  ? 'bg-gradient-to-r from-pink-400 to-purple-400 scale-110 shadow-lg' 
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex justify-center mb-4">
            <div className="animate-spin">
              <Heart className="text-pink-500" size={24} />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-center mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Attempts Counter */}
        {attempts > 0 && attempts < 3 && (
          <div className="text-center mb-4">
            <p className="text-pink-600 text-sm">
              {3 - attempts} attempts remaining
            </p>
          </div>
        )}

        {/* Hint */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            💡 Hint: The day we first said "I love you"
          </p>
        </div>

        {/* Refresh Button for locked state */}
        {attempts >= 3 && (
          <div className="text-center mt-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full hover:from-pink-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Try Again 💕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PinLockScreen;
