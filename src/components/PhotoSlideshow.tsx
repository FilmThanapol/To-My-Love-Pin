
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';

const PhotoSlideshow = () => {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  
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

  const nextPhoto = () => {
    setCurrentPhoto((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhoto((prev) => (prev - 1 + photos.length) % photos.length);
  };

  useEffect(() => {
    const timer = setInterval(nextPhoto, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 py-20 px-4 relative overflow-hidden">
      {/* Floating Hearts */}
      {[...Array(10)].map((_, i) => (
        <Heart
          key={i}
          className="absolute text-pink-200 opacity-30 animate-bounce"
          size={Math.random() * 20 + 15}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${4 + Math.random() * 2}s`
          }}
        />
      ))}

      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 font-thai">
          ครบรอบ 1 ปี 💕
        </h2>
        <p className="text-xl text-gray-600 mb-12 font-thai">
          365 วันแห่งความรักและความทรงจำดีๆ กับแมวจ๋อง 🐱
        </p>

        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
          <div className="relative">
            <img
              src={photos[currentPhoto].img}
              alt={photos[currentPhoto].caption}
              className="w-full h-96 object-cover rounded-2xl shadow-lg transition-all duration-500"
            />
            
            {/* Navigation Buttons */}
            <button
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="text-gray-700" size={24} />
            </button>
            
            <button
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="text-gray-700" size={24} />
            </button>
          </div>

          {/* Photo Info */}
          <div className="mt-6 space-y-2">
            <h3 className="text-2xl font-bold text-gray-800 font-thai">
              {photos[currentPhoto].caption}
            </h3>
            {/* <p className="text-gray-500 font-thai">
              {photos[currentPhoto].date}
            </p> */}
          </div>

          {/* Photo Indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPhoto(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentPhoto 
                    ? 'bg-pink-400 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoSlideshow;
