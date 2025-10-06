import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/80 backdrop-blur-xl border-b border-[#2a2a2a]">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-12">
            <h1 className="font-['Bebas_Neue',sans-serif] text-3xl bg-gradient-to-r from-[#1E90FF] to-[#FF2D95] bg-clip-text text-transparent cursor-pointer">
              BRANDCRAFT
            </h1>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors duration-300">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors duration-300">
                How It Works
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors duration-300">
                Pricing
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button
              className="bg-gradient-to-r from-[#1E90FF] to-[#FF2D95] hover:opacity-90 text-white rounded-full px-6"
              onClick={() => window.location.href = '/auth'}
            >
              Get Started
            </Button>

            <button
              className="md:hidden text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-[#1a1a1a] border-t border-[#2a2a2a]">
          <nav className="container mx-auto px-6 py-4 flex flex-col gap-4">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
