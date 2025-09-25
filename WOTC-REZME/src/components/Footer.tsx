import React from 'react';

interface FooterProps {
  onLogoClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onLogoClick }) => {
  return (
    <footer className="bg-white-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
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
              <span className="text-xs font-medium text-black font-poppins mt-1 leading-none tracking-tighter">
                Tax Credit Management
              </span>
            </button>
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
                href="https://app.termly.io/policy-viewer/policy.html?policyUUID=e05577fe-11ce-47d5-9a97-c994b0ee6acf" 
                className="block text-gray35 text-sm hover:text-black transition-colors duration-200 font-poppins"
              >
                Privacy Policy
              </a>
              <a 
                href="https://app.termly.io/policy-viewer/policy.html?policyUUID=6947f494-a92e-419a-82df-ddc2ec5a1743" 
                className="block text-gray35 text-sm hover:text-black transition-colors duration-200 font-poppins"
              >
                Cookie Policy
              </a>
              <a 
                href="https://app.termly.io/policy-viewer/policy.html?policyUUID=40404d5f-9640-47ad-bab0-8f2bb32aabc8" 
                className="block text-gray35 text-sm hover:text-black transition-colors duration-200 font-poppins"
              >
                Terms & Conditions
              </a>
              <a 
                href="https://app.termly.io/policy-viewer/policy.html?policyUUID=2dee6321-2901-4da4-a2e6-d31333c344620" 
                className="block text-gray35 text-sm hover:text-black transition-colors duration-200 font-poppins"
              >
                Disclaimer
              </a>
              <a 
                href="https://www.canva.com/design/DAGbAYTxAqQ/7VXnGimgiKAWzBXfJBfbVQ/edit" 
                className="block text-gray35 text-sm hover:text-black transition-colors duration-200 font-poppins"
              >
                Branding Guidelines
              </a>
              <a 
                href="#https://app.pactsafe.com/sign?r=656335a17c5752be211f42bb&s=656335a17c5752be211f42bd&signature=mmgK3G~HAApM5Xp-bZmWlgO~3DQka7e6OqzsCyEpDIs8Zu8uJzmbCAbS7-89E~L0ZHCSQ6kytTBr7FSbyyX7o4AHaqssthcwwdXE7Njy1jo~w9z3bFUHh5ThLRfplS~VaSSCygyKw2cQ-dOm23rVhjJHS2Twn4JH9K4i5uo-Ihawo8NnVls~s~wzitNBCfJL5hBzarsxGYbgW-nN8pVMFKfslOzJWQrnNoogynAaEToOjkaraNcyPgmVaY8l4iYvZJxzmVR1rxwDDJH8gghYZmYjk0Oqn-r4glbTauhuqiwo391PrnsXA6KTZdZ2ovSo8o-egdfyXtOuGIHqIJqVSQ__" 
                className="block text-gray35 text-sm hover:text-black transition-colors duration-200 font-poppins"
              >
                Open AI Data Processing Agreement
              </a>
              <a 
                href="https://app.vanta.com/rezme.app/trust/kbynv6xr5c2g82tzmhq3qz/controls" 
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