import React from 'react';

interface HeaderProps {
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={onLogoClick}
              className="flex flex-col hover:opacity-80 transition-opacity duration-200 cursor-pointer"
              aria-label="Return to home page"
            >
              <div className="flex items-center">
                <span className="text-4xl font-bold text-black font-poppins">réz</span>
                <span className="text-4xl font-bold text-cinnabar font-poppins">me</span>
                <span className="text-cinnabar text-4xl font-bold">.</span>
              </div>
              <span className="text-xs font-medium text-black font-poppins mt-1 leading-none tracking-tighter text-center block">
                Tax Credit Management
              </span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#" 
              className="text-black font-medium hover:text-gray35 transition-colors duration-200 font-poppins"
            >
              Home
            </a>
            <a 
              href="#" 
              className="text-black font-medium hover:text-gray35 transition-colors duration-200 font-poppins"
            >
              About
            </a>
            <a 
              href="#" 
              className="text-black font-medium hover:text-gray35 transition-colors duration-200 font-poppins"
            >
              Product
            </a>
            <a 
              href="#" 
              className="text-black font-medium hover:text-gray35 transition-colors duration-200 font-poppins"
            >
              Resources
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button className="text-black font-medium hover:text-gray35 transition-colors duration-200 font-poppins">
              Sign In
            </button>
            <button className="bg-cinnabar text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200 font-poppins shadow-sm">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}; 