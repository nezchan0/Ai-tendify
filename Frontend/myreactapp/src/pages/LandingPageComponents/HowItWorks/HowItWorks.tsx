import React, { useRef, useEffect } from 'react';
import { Camera, CheckCircle, BarChart, Users } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    itemsRef.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      icon: <Camera className="h-8 w-8" />,
      title: "Capture Classroom",
      description: "Teacher can capture 2-3 images of the classroom using our application",
      color: "from-indigo-600 to-blue-600"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "AI Recognition",
      description: "Our advanced AI identifies each student automatically from the image",
      color: "from-purple-600 to-indigo-600"
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Mark Attendance",
      description: "System marks attendance for all identified students instantly",
      color: "from-blue-600 to-cyan-600"
    },
    {
      icon: <BarChart className="h-8 w-8" />,
      title: "Generate Reports",
      description: "Comprehensive attendance reports available for all stakeholders",
      color: "from-cyan-600 to-teal-600"
    }
  ];

  return (
    <section 
      id="how-it-works" 
      ref={sectionRef}
      className="py-24 bg-[#0A0A0A] relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[100px] opacity-30"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 opacity-0 transition-opacity duration-1000" ref={(el) => itemsRef.current[0] = el}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How Ai-tendify Works</h2>
          <p className="text-gray-400 text-lg">
            Our simple four-step process revolutionizes attendance tracking from manual recording to automated efficiency.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-24 left-1/2 w-0.5 h-[calc(100%-120px)] bg-gradient-to-b from-indigo-500 to-teal-500 hidden md:block"></div>
          
          <div className="space-y-12 md:space-y-24 relative">
            {steps.map((step, index) => (
              <div 
                key={index}
                ref={(el) => itemsRef.current[index + 1] = el}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 opacity-0 transition-opacity duration-1000 delay-300`}
              >
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${step.color} mb-4 p-4 text-white`}>
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 max-w-md">{step.description}</p>
                </div>
                
                <div className="hidden md:block w-8 h-8 rounded-full bg-[#1A1A1A] border-4 border-indigo-500 z-10"></div>
                
                <div className="md:w-1/2">
                  <div className="bg-[#1A1A1A] border border-white/10 rounded-xl overflow-hidden h-64">
                    <div className="h-full w-full bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] flex items-center justify-center">
                      <img 
                        src={`https://images.pexels.com/photos/${2000000 + index * 100}/pexels-photo-${2000000 + index * 100}.jpeg?auto=compress&cs=tinysrgb&w=500`} 
                        alt={step.title}
                        className="w-full h-full object-cover opacity-60 hover:opacity-80 transition-opacity"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.pexels.com/photos/5212647/pexels-photo-5212647.jpeg?auto=compress&cs=tinysrgb&w=500";
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;