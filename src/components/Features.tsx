import { Lightbulb, MessageSquare, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';

const features = [
  {
    icon: Lightbulb,
    title: 'AI-Powered Content Ideas',
    description: 'Generate tailored content suggestions based on your profession and expertise',
    gradient: 'from-[#1E90FF] to-[#00BFFF]',
  },
  {
    icon: MessageSquare,
    title: 'Ready-to-Use Captions',
    description: 'Get engaging, professional captions that match your brand voice and style',
    gradient: 'from-[#FF2D95] to-[#FF69B4]',
  },
  {
    icon: TrendingUp,
    title: 'Consistent Growth',
    description: 'Build authority and attract opportunities through regular, strategic posting',
    gradient: 'from-[#1E90FF] to-[#FF2D95]',
  },
];

export function Features() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-['Bebas_Neue',sans-serif] text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              THE PERFECT SOLUTION
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            For Modern Professionals
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="relative p-8 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-[#2a2a2a] hover:border-[#1E90FF]/50 transition-all duration-500 hover:scale-105 group overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-2xl font-bold mb-4 text-white">
                {feature.title}
              </h3>

              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
