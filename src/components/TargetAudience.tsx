import { Briefcase, Star, Users } from 'lucide-react';

const audiences = [
  {
    icon: Briefcase,
    title: 'Freelancers & Consultants',
    description: 'Showcase expertise and attract high-value clients through consistent thought leadership content',
  },
  {
    icon: Star,
    title: 'Solopreneurs & Early Creators',
    description: 'Build your personal brand from scratch and establish authority in your niche',
  },
  {
    icon: Users,
    title: 'Job Seekers (22-40)',
    description: 'Digital natives who understand the power of personal branding for career advancement',
  },
];

const painPoints = [
  '"I don\'t know what to post" - Blank page syndrome and lack of content ideas',
  '"My captions fall flat" - Struggle with engaging, professional copywriting',
  '"I\'m inconsistent" - Posting sporadically due to time constraints and creative blocks',
];

export function TargetAudience() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1E90FF]/5 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-['Bebas_Neue',sans-serif] text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              WHO NEEDS THIS MOST
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
          {audiences.map((audience, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-3xl bg-gradient-to-br from-[#1a1a1a]/50 to-[#0d0d0d]/50 border border-[#2a2a2a] hover:border-[#FF2D95]/30 transition-all duration-500"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#1E90FF]/20 to-[#FF2D95]/20 flex items-center justify-center border border-[#1E90FF]/30">
                <audience.icon className="w-8 h-8 text-[#1E90FF]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                {audience.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {audience.description}
              </p>
            </div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto">
          <h3 className="font-['Bebas_Neue',sans-serif] text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-[#FF2D95] to-[#1E90FF] bg-clip-text text-transparent">
              KEY PAIN POINTS WE'RE SOLVING
            </span>
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {painPoints.map((point, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#2a2a2a] hover:border-[#1E90FF]/50 transition-all duration-300"
              >
                <p className="text-gray-300 leading-relaxed">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
