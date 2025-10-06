import { Twitter, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-[#2a2a2a] relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="font-['Bebas_Neue',sans-serif] text-3xl bg-gradient-to-r from-[#1E90FF] to-[#FF2D95] bg-clip-text text-transparent">
              BRANDCRAFT
            </h3>
            <p className="text-gray-500 text-sm mt-2">
              AI-Powered Personal Branding
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center hover:border-[#1E90FF] hover:bg-[#1E90FF]/10 transition-all duration-300"
            >
              <Twitter className="w-5 h-5 text-gray-400" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center hover:border-[#1E90FF] hover:bg-[#1E90FF]/10 transition-all duration-300"
            >
              <Linkedin className="w-5 h-5 text-gray-400" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center hover:border-[#FF2D95] hover:bg-[#FF2D95]/10 transition-all duration-300"
            >
              <Instagram className="w-5 h-5 text-gray-400" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#2a2a2a] text-center text-gray-500 text-sm">
          <p>© {currentYear} BrandCraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
