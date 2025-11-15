import React, { useState, useEffect } from 'react';
import { Menu, X, BookOpen, User, Award, BarChart3 } from 'lucide-react';
import NavLink from './NavLink';
import { useNavigate } from 'react-router-dom';
const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const navigate = useNavigate();
  const loginOptions = [
    { id: 'student', title: 'Student', icon: <User className="h-5 w-5" /> },
    { id: 'teacher', title: 'Teacher', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'hod', title: 'HOD', icon: <Award className="h-5 w-5" /> },
    { id: 'admin', title: 'Admin', icon: <BarChart3 className="h-5 w-5" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = (role: string) => {
    setShowLoginDropdown(false);
    console.log(`Logging in as ${role}`);
    navigate(`/login/${role}`); // Example: /login/student or /login/teacher
    
  };
  

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#121212]/90 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-indigo-500" />
            <span className="ml-2 text-xl font-bold text-white">Ai-tendify</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#how-it-works">How It Works</NavLink>
            <NavLink href="#about">About</NavLink>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {/* Login Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                className="bg-[#1A1A1A] text-white px-6 py-2 rounded-full hover:bg-[#252525] transition-all border border-white/10"
              >
                Login
              </button>
              
              {/* Animated Dropdown */}
              <div
                className={`absolute right-0 mt-2 w-64 rounded-xl bg-[#1A1A1A] border border-white/10 shadow-xl transition-all duration-300 transform origin-top ${
                  showLoginDropdown
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}
              >
                <div className="p-3">
                  {loginOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleLoginClick(option.id)}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                        {option.icon}
                      </div>
                      <span className="text-white">{option.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

           
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-[#121212] fixed inset-0 z-50 pt-20">
          <nav className="flex flex-col items-center space-y-8 p-8">
            <NavLink href="#features" onClick={() => setIsOpen(false)}>Features</NavLink>
            <NavLink href="#how-it-works" onClick={() => setIsOpen(false)}>How It Works</NavLink>
            <NavLink href="#about" onClick={() => setIsOpen(false)}>About</NavLink>
            
            {/* Mobile Login Options */}
            <div className="w-full space-y-3">
              {loginOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleLoginClick(option.id)}
                  className="w-full flex items-center justify-center space-x-3 p-4 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                    {option.icon}
                  </div>
                  <span className="text-white">{option.title}</span>
                </button>
              ))}
            </div>

            
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;