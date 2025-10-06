import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E90FF]/20 via-transparent to-[#FF2D95]/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,144,255,0.15),transparent_70%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-[3rem] bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#1E90FF]/30 shadow-[0_0_80px_rgba(30,144,255,0.2)]">
            <h2 className="font-['Bebas_Neue',sans-serif] text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#1E90FF] via-white to-[#FF2D95] bg-clip-text text-transparent">
                READY TO BUILD YOUR BRAND?
              </span>
            </h2>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform your professional expertise into compelling social media content that builds authority and drives opportunities
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#1E90FF] to-[#FF2D95] hover:opacity-90 text-white text-lg px-10 py-7 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(30,144,255,0.4)] group"
                onClick={() => window.location.href = '/auth'}
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              No credit card required • Start generating content in minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
