import { CircleUser as UserCircle, Zap, PenTool, LayoutDashboard, Shield } from 'lucide-react';

const coreFeatures = [
  {
    number: '01',
    icon: UserCircle,
    title: 'Smart Onboarding',
    description: 'Capture user profession, niche focus, and personal branding goals to personalize content generation',
  },
  {
    number: '02',
    icon: Zap,
    title: 'AI Content Engine',
    description: 'Generate targeted post ideas based on industry trends and user expertise',
  },
  {
    number: '03',
    icon: PenTool,
    title: 'Caption Generator',
    description: 'Create engaging, platform-optimized captions with clear calls-to-action',
  },
  {
    number: '04',
    icon: LayoutDashboard,
    title: 'Content Dashboard',
    description: 'Simple interface to view, copy, and manage generated content ideas',
  },
  {
    number: '05',
    icon: Shield,
    title: 'Secure Authentication',
    description: 'User accounts with data privacy and content history tracking',
  },
];

export function CoreFeatures() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1E90FF]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF2D95]/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-['Bebas_Neue',sans-serif] text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              MVP CORE FEATURES
            </span>
          </h2>
          <p className="text-xl text-gray-400">Must Have</p>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          {coreFeatures.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d] border border-[#2a2a2a] hover:border-[#1E90FF]/50 transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                  <span className="text-5xl font-['Bebas_Neue',sans-serif] bg-gradient-to-br from-[#1E90FF] to-[#FF2D95] bg-clip-text text-transparent">
                    {feature.number}
                  </span>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E90FF]/20 to-[#FF2D95]/20 flex items-center justify-center border border-[#1E90FF]/30 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-7 h-7 text-[#1E90FF]" />
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-[#1E90FF]/0 via-[#1E90FF]/5 to-[#FF2D95]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
