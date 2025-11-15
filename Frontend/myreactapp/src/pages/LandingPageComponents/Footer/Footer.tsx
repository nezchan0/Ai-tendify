import React from 'react';
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import NavLink from '../Header/NavLink';
const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A0A0A] pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <BookOpen className="h-8 w-8 text-indigo-500" />
              <span className="ml-2 text-xl font-bold text-white">Ai-tendify</span>
            </div>
            <p className="text-gray-400 mb-6">
              Revolutionizing classroom management with AI-powered attendance tracking solution.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-[#1A1A1A] p-2 rounded-full text-gray-400 hover:text-white hover:bg-indigo-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-[#1A1A1A] p-2 rounded-full text-gray-400 hover:text-white hover:bg-indigo-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-[#1A1A1A] p-2 rounded-full text-gray-400 hover:text-white hover:bg-indigo-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-[#1A1A1A] p-2 rounded-full text-gray-400 hover:text-white hover:bg-indigo-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
            <li ><a href="#" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
            <li><NavLink href="#features" >Features</NavLink></li>
            <li><NavLink href="#how-it-works" >How It Works</NavLink></li>
            <li><NavLink href="#about" >About</NavLink></li>
            
              {['Contact', 'Privacy Policy', 'Terms of Service'].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-indigo-500 mr-3 mt-1" />
                <span className="text-gray-400">
                JSS Academy of Technical Education, Dr.Vishnuvardhan Road, Uttarahalli - Kengeri Main Road, Bengaluru – 560 060
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-indigo-500 mr-3" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-indigo-500 mr-3" />
                <span className="text-gray-400">nezchan05@gmail.com</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Newsletter <span className='text-gray-400 text-sm'> (Coming Soon)</span></h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and features.
            </p>
            <form className="space-y-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Ai-tendify. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;