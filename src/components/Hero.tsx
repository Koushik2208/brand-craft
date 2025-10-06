import { Sparkles } from 'lucide-react';
import { Button } from './ui/button';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E90FF]/10 via-transparent to-[#FF2D95]/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,144,255,0.1),transparent_50%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E90FF]/10 border border-[#1E90FF]/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Sparkles className="w-4 h-4 text-[#1E90FF]" />
            <span className="text-sm text-gray-300">AI-Powered Content Generation</span>
          </div>

          <h1 className="font-['Bebas_Neue',sans-serif] text-6xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
            <span className="bg-gradient-to-r from-white via-[#1E90FF] to-[#FF2D95] bg-clip-text text-transparent">
              BUILD YOUR BRAND
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-4 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            Your AI-powered content assistant that turns your profession into daily post ideas and captions
          </p>

          <p className="text-lg text-gray-500 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            Show up consistently, grow your audience, and establish authority
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#1E90FF] to-[#FF2D95] hover:opacity-90 text-white text-lg px-8 py-6 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(30,144,255,0.3)]"
              onClick={() => window.location.href = '/auth'}
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-[#1E90FF]/30 hover:bg-[#1E90FF]/20 hover:border-[#1E90FF]/60 text-white bg-transparent text-lg px-8 py-6 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(30,144,255,0.2)]"
            >
              See How It Works
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#121212] to-transparent" />
    </section>
  );
}
