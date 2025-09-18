import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-4xl font-bold text-black font-poppins">réz</span>
                <span className="text-4xl font-bold text-cinnabar font-poppins">me</span>
                <span className="text-cinnabar text-4xl font-bold">.</span>
              </div>
              <span className="text-xs font-medium text-black font-poppins mt-1 leading-none tracking-tighter">
                Tax Credit Management
              </span>
            </div>
            <p className="text-gray35 text-sm leading-relaxed font-poppins mt-4">
              Automating Fair Chance<br />
              Hiring compliance for<br />
              modern HR teams.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-black font-medium font-poppins">Navigation</h3>
            <nav className="space-y-3">
              <a 
                href="#" 
                className="block text-gray35 text-sm hover:text-black transition-colors duration-200 font-poppins"
              >
                Home
              </a>
              <a 
                href="#" 
                className="block text-gray35 text-sm hover:text-black transition-colors duration-200 font-poppins"
              >
                About
              </a>
              <a 
                href="#" 
                className="block text-gray35 text-sm hover:text-black transition-colors duration-200 font-poppins"
              >
                Product
              </a>
              <a 
                href="#" 
                className="block text-gray35 text-sm hover:text-black transition-colors duration-200 font-poppins"
              >
                Resources
              </a>
              <a 
                href="#" 
                className="block text-gray35 text-sm hover:text-black transition-colors duration-200 font-poppins"
              >
                Sign In
              </a>
            </nav>
          </div>

          {/* Legal & Policies */}
          <div className="space-y-4">
            <h3 className="text-black font-medium font-poppins">Legal & Policies</h3>
            <nav className="space-y-3">
              <a 
                href="#" 
                className="block text-gray35 text-sm hover:text-black transition-colors duration-200 font-poppins"
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                className="block text-gray35 text-sm hover:text-black transition-colors duration-200 font-poppins"
              >
                Cookie Policy
              </a>
              <a 
                href="#" 
                className="block text-gray35 text-sm hover:text-black transition-colors duration-200 font-poppins"
              >
                Terms & Conditions
              </a>
              <a 
                href="#" 
                className="block text-gray35 text-sm hover:text-black transition-colors duration-200 font-poppins"
              >
                Disclaimer
              </a>
              <a 
                href="#" 
                className="block text-gray35 text-sm hover:text-black transition-colors duration-200 font-poppins"
              >
                Branding Guidelines
              </a>
              <a 
                href="#" 
                className="block text-gray35 text-sm hover:text-black transition-colors duration-200 font-poppins"
              >
                Open AI Data Processing Agreement
              </a>
              <a 
                href="#" 
                className="block text-gray35 text-sm hover:text-black transition-colors duration-200 font-poppins"
              >
                Trust Center
              </a>
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray35 text-sm font-poppins text-center">
            © 2025 Rézme, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}; 