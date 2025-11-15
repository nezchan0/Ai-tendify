import React, { useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

const About: React.FC = () => {
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (aboutRef.current) observer.observe(aboutRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-32 bg-[#121212]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div 
            ref={aboutRef}
            className="opacity-0 transition-opacity duration-1000"
          >
            <div className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-full text-xl font-medium mb-8">
              About Ai-tendify
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
              Transform Your Institution with Smart Attendance Management
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Ai-tendify revolutionizes the traditional attendance system by leveraging cutting-edge facial recognition technology. Our platform streamlines the entire process, making it effortless for educators and administrators while providing valuable insights for better institutional management.
            </p>
            <p className="text-gray-300 text-lg mb-12 leading-relaxed">
              Experience the future of attendance tracking with our comprehensive solution that adapts to your institution's unique needs. From seamless integration to powerful analytics, Ai-tendify is designed to enhance educational excellence.
            </p>
            
            <ul className="space-y-6 mb-12">
              {[
                "Advanced facial recognition for instant attendance", 
                "Real-time tracking and comprehensive reporting", 
                "Customizable dashboards for different roles"
               
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="bg-indigo-500/10 p-2 rounded-full mr-4 mt-1">
                    <ChevronRight className="h-5 w-5 text-indigo-500" />
                  </div>
                  <span className="text-gray-300 text-lg">{item}</span>
                </li>
              ))}
            </ul>
            
            
          </div>
          
          <div className="relative h-[600px] rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 to-indigo-900/40 z-10"></div>
            <img 
              src="https://images.pexels.com/photos/5212703/pexels-photo-5212703.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Modern classroom environment" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-10000 hover:scale-110"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;