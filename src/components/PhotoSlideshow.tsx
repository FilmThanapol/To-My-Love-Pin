
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

const PhotoSlideshow = () => {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  
  const photos = [
    {
      url: 'https://images.unsplash.com/photo-1518621012382-a90797b2d9b4?w=800&h=600&fit=crop',
      caption: 'Our first date at the coffee shop ☕'
    },
    {
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop',
      caption: 'Walking hand in hand through the park 🌸'
    },
    {
      url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&h=600&fit=crop',
      caption: 'The flowers you gave me on our 3rd month 💐'
    },
    {
      url: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&h=600&fit=crop',
      caption: 'Stargazing on that magical summer night ⭐'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % photos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 to-pink-100">
      <div className="max-w-4xl w-full" data-aos="fade-up">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12">
          Our Beautiful Journey 📸
        </h2>
        
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white">
          <div className="aspect-video relative">
            {photos.map((photo, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ${
                  index === currentPhoto 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-105'
                }`}
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white text-xl md:text-2xl font-medium">
                    {photo.caption}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Floating Hearts */}
            <div className="absolute top-4 right-4">
              <Heart className="text-white animate-pulse" size={32} />
            </div>
          </div>
          
          {/* Dot indicators */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPhoto(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentPhoto 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
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
