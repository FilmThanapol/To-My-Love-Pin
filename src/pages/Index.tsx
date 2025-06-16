
import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import PinLockScreen from '../components/PinLockScreen';
import PhotoSlideshow from '../components/PhotoSlideshow';
import LoveTimeline from '../components/LoveTimeline';
import LoveLetter from '../components/LoveLetter';
import SecretGiftBox from '../components/SecretGiftBox';
import CelebrationPage from '../components/CelebrationPage';
import ThemeToggle from '../components/ThemeToggle';

const Index = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic'
    });
  }, []);

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkTheme]);

  useEffect(() => {
    if (isUnlocked) {
      // Show celebration after user has scrolled through all sections
      const timer = setTimeout(() => {
        setShowCelebration(true);
      }, 30000); // Show after 30 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isUnlocked]);

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  const handleReplay = () => {
    setIsUnlocked(false);
    setShowCelebration(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  if (!isUnlocked) {
    return <PinLockScreen onUnlock={handleUnlock} />;
  }

  if (showCelebration) {
    return <CelebrationPage onReplay={handleReplay} />;
  }

  return (
    <div className={`transition-all duration-500 ${
      isDarkTheme 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-pink-50 to-purple-50'
    }`}>
      <ThemeToggle isDark={isDarkTheme} onToggle={toggleTheme} />
      
      <main className="relative">
        <PhotoSlideshow />
        <LoveTimeline />
        <LoveLetter />
        <SecretGiftBox />
        
        {/* Final celebration trigger */}
        <section className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
              Ready for the Grand Finale? 🎊
            </h2>
            <button
              onClick={() => setShowCelebration(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              🎉 Let's Celebrate! 🎉
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
