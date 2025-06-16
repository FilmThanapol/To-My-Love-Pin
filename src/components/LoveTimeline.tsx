
import React from 'react';
import { Calendar, Heart, Gift, Airplane, Cake, Star } from 'lucide-react';

const LoveTimeline = () => {
  const timelineEvents = [
    {
      month: 'January',
      title: 'First Hello',
      description: 'The day we met and everything changed',
      icon: Heart,
      color: 'from-pink-400 to-rose-400'
    },
    {
      month: 'February',
      title: 'First Date',
      description: 'Coffee, laughter, and the beginning of us',
      icon: Calendar,
      color: 'from-purple-400 to-pink-400'
    },
    {
      month: 'March',
      title: 'Made it Official',
      description: 'You asked me to be yours',
      icon: Star,
      color: 'from-indigo-400 to-purple-400'
    },
    {
      month: 'April',
      title: 'Spring Adventures',
      description: 'Cherry blossoms and picnics in the park',
      icon: Gift,
      color: 'from-green-400 to-emerald-400'
    },
    {
      month: 'May',
      title: 'First Trip',
      description: 'Our weekend getaway to the mountains',
      icon: Airplane,
      color: 'from-blue-400 to-cyan-400'
    },
    {
      month: 'June',
      title: 'Your Birthday',
      description: 'Celebrating you and how lucky I am',
      icon: Cake,
      color: 'from-yellow-400 to-orange-400'
    }
  ];

  return (
    <section className="min-h-screen py-20 px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16" data-aos="fade-up">
          Our Love Story Timeline 💕
        </h2>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-pink-300 to-purple-300 rounded-full" />
          
          {timelineEvents.map((event, index) => (
            <div
              key={index}
              className={`relative flex items-center mb-16 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
              data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
              data-aos-delay={index * 100}
            >
              {/* Content */}
              <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{event.month}</h3>
                  <h4 className="text-xl font-semibold text-purple-600 mb-3">{event.title}</h4>
                  <p className="text-gray-600">{event.description}</p>
                </div>
              </div>
              
              {/* Icon */}
              <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                <div className={`w-16 h-16 bg-gradient-to-br ${event.color} rounded-full flex items-center justify-center shadow-lg`}>
                  <event.icon className="text-white" size={24} />
                </div>
              </div>
              
              {/* Empty space for alternating layout */}
              <div className="hidden md:block w-5/12" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoveTimeline;
