import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { LogOut, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#1E90FF]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-[#FF2D95]/5 rounded-full blur-[120px]" />

      <header className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/80 backdrop-blur-xl border-b border-[#2a2a2a]">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <h1 className="font-['Bebas_Neue',sans-serif] text-3xl bg-gradient-to-r from-[#1E90FF] to-[#FF2D95] bg-clip-text text-transparent">
              BRANDCRAFT
            </h1>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-400">Welcome back,</p>
                <p className="text-white font-semibold">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                </p>
              </div>
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-transparent"
                onClick={handleSignOut}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-16 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="font-['Bebas_Neue',sans-serif] text-6xl md:text-7xl mb-4">
                <span className="bg-gradient-to-r from-[#1E90FF] via-white to-[#FF2D95] bg-clip-text text-transparent">
                  YOUR BRAND DASHBOARD
                </span>
              </h2>
              <p className="text-xl text-gray-400">
                Start building your personal brand with AI-powered content
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a2a] hover:border-[#1E90FF]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(30,144,255,0.2)]">
                <div className="w-12 h-12 rounded-full bg-[#1E90FF]/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-[#1E90FF]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Content Generated</h3>
                <p className="text-4xl font-bold bg-gradient-to-r from-[#1E90FF] to-[#FF2D95] bg-clip-text text-transparent">
                  0
                </p>
                <p className="text-gray-500 text-sm mt-2">AI-powered posts</p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a2a] hover:border-[#1E90FF]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(30,144,255,0.2)]">
                <div className="w-12 h-12 rounded-full bg-[#FF2D95]/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-[#FF2D95]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Growth Rate</h3>
                <p className="text-4xl font-bold bg-gradient-to-r from-[#1E90FF] to-[#FF2D95] bg-clip-text text-transparent">
                  0%
                </p>
                <p className="text-gray-500 text-sm mt-2">Last 30 days</p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a2a] hover:border-[#1E90FF]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(30,144,255,0.2)]">
                <div className="w-12 h-12 rounded-full bg-[#1E90FF]/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-[#1E90FF]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Audience Reach</h3>
                <p className="text-4xl font-bold bg-gradient-to-r from-[#1E90FF] to-[#FF2D95] bg-clip-text text-transparent">
                  0
                </p>
                <p className="text-gray-500 text-sm mt-2">Total impressions</p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#1E90FF]/30 shadow-[0_0_60px_rgba(30,144,255,0.15)] text-center">
              <Zap className="w-16 h-16 mx-auto mb-6 text-[#1E90FF]" />
              <h3 className="font-['Bebas_Neue',sans-serif] text-4xl mb-4">
                <span className="bg-gradient-to-r from-[#1E90FF] to-[#FF2D95] bg-clip-text text-transparent">
                  READY TO CREATE?
                </span>
              </h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Start generating engaging content for your social media profiles. Our AI will help you maintain consistency and build your personal brand.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#1E90FF] to-[#FF2D95] hover:opacity-90 text-white text-lg px-10 py-6 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(30,144,255,0.3)]"
              >
                Generate Content
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
