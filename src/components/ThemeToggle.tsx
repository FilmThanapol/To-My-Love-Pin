
import React from 'react';
import { Star } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeToggle = ({ isDark, onToggle }: ThemeToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="fixed top-6 right-6 z-50 bg-white/80 backdrop-blur-sm rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      aria-label="Toggle theme"
    >
      <div className="relative w-12 h-6">
        <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
          isDark 
            ? 'bg-gradient-to-r from-indigo-900 to-purple-900' 
            : 'bg-gradient-to-r from-yellow-200 to-orange-200'
        }`}>
          {isDark && (
            <>
              <Star className="absolute top-0.5 left-1 text-yellow-300" size={8} />
              <Star className="absolute top-1 right-2 text-white" size={6} />
              <Star className="absolute bottom-0.5 left-3 text-yellow-200" size={4} />
            </>
          )}
        </div>
        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-500 transform ${
          isDark ? 'translate-x-6' : 'translate-x-0.5'
        }`}>
          <div className="text-center text-xs leading-5">
            {isDark ? '🌙' : '☀️'}
          </div>
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
