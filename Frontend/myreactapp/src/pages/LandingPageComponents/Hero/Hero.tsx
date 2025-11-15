import React, { useEffect, useRef } from 'react';
import { ArrowRight, Camera, CheckCircle } from 'lucide-react';
import HeroCanvas from './HeroCanvas';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-b from-[#080808] to-[#121212] overflow-hidden">
      {/* Background particles/3D effect */}
      <div className="absolute inset-0 z-0">
        <HeroCanvas />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 pt-32 pb-20 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div ref={textRef} className="text-content opacity-0 transition-opacity duration-1000">
            <div className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full text-xl font-medium mb-8 animate-gradient">
              Welcome to Ai-tendify
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8">
              The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 animate-gradient">Attendance</span> is Here
            </h1>
            <p className="text-gray-300 text-xl md:text-2xl mb-12 leading-relaxed max-w-2xl">
              Transform your institution with AI-powered facial recognition. Streamline attendance tracking and focus on what truly matters - education.
            </p>
            
            <div className="mb-16">
            <button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-4 rounded-full font-medium transition-all flex items-center justify-center text-lg animate-gradient"
                onClick={() => navigate('/login/student')}
              >
                Get Started <ArrowRight className="ml-2 h-6 w-6" />
              </button>

            </div>
          </div>
          
          <div className="hidden lg:block relative">
            <div className="relative w-full h-[600px] perspective-camera">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 floating-animation">
                <div className="bg-[#1A1A1A]/80 backdrop-blur-lg p-8 rounded-xl border border-white/10 shadow-xl w-96">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-white text-xl font-semibold">Live Attendance</h3>
                      <p className="text-gray-400">Computer Science - Room 301</p>
                    </div>
                    <div className="bg-indigo-500/20 p-3 rounded-full pulse">
                      <Camera className="h-6 w-6 text-indigo-500" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 mr-3 animate-gradient"></div>
                        <span className="text-white text-lg">Abhijnan S</span>
                      </div>
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 mr-3 animate-gradient"></div>
                        <span className="text-white text-lg">Akrity Kumari</span>
                      </div>
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 mr-3 animate-gradient"></div>
                        <span className="text-white text-lg">Alok Maurya</span>
                      </div>
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-300 to-indigo-600 mr-3 animate-gradient"></div>
                        <span className="text-white text-lg">Anand SP</span>
                      </div>
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-14 right-0 z-30 floating-animation-delay">
                <div className="bg-[#1A1A1A]/80 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full flex items-center justify-center animate-gradient">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-white text-lg font-medium">Attendance Updated</p>
                      <p className="text-gray-400">Session recorded successfully</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#121212] to-transparent"></div>
    </section>
  );
};

export default Hero;