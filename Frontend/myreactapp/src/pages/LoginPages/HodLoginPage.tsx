import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';

const HodLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // TODO: Implement actual login API call here
      const response = await fetch('http://127.0.0.1:8000/api/hod/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        // Store the token in localStorage
        localStorage.setItem('token', JSON.stringify(data.token));

        // Redirect to HOD dashboard
        navigate('/hod/dashboard');
      } else {
        const data = await response.json();
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-[#1A1A1A] border-b border-white/10 py-4">
        <div className="container mx-auto px-4 flex justify-center space-x-6">
          <Link to="/login/student" className="text-gray-400 hover:text-white transition-colors">Student Login</Link>
          <Link to="/login/teacher" className="text-gray-400 hover:text-white transition-colors">Teacher Login</Link>
          <Link to="/login/hod" className="text-indigo-500 font-medium">HOD Login</Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full space-y-8 bg-[#1A1A1A] p-8 rounded-2xl border border-white/10">
          <div className="text-center">
            <div className="flex justify-center">
              <BookOpen className="h-12 w-12 text-indigo-500" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-white">HOD Login</h2>
            <p className="mt-2 text-sm text-gray-400">
              Welcome back! 
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  HOD ID
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 bg-[#252525] border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your HOD ID"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 bg-[#252525] border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Go Back Button */}
      <div className="container mx-auto px-4 pb-8 flex justify-center">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
};

export default HodLoginPage;
  