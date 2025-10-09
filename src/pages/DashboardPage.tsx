import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { LogOut, Sparkles, TrendingUp, Users, Zap, Loader2, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { generateContent, GeneratedContent } from '../services/contentGenerator';
import { toast } from 'sonner';

export function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [topicsOfInterest, setTopicsOfInterest] = useState<string[]>([]);
  const [contentCount, setContentCount] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      const { data: onboardingData } = await supabase
        .from('onboarding_responses')
        .select('topics_of_interest')
        .eq('user_id', user.id)
        .maybeSingle();

      if (onboardingData?.topics_of_interest) {
        setTopicsOfInterest(onboardingData.topics_of_interest);
      }

      const { data: contentData, count } = await supabase
        .from('generated_content')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (count !== null) {
        setContentCount(count);
      }

      if (contentData && contentData.length >= 3) {
        const instagramPost = contentData.find(c => c.platform === 'instagram');
        const xPost = contentData.find(c => c.platform === 'x');
        const linkedinPost = contentData.find(c => c.platform === 'linkedin');

        if (instagramPost && xPost && linkedinPost) {
          const reconstructedContent: GeneratedContent = {
            main_topic: instagramPost.topics[0] || 'Your Topic',
            generated_topic: instagramPost.title.replace(/ - (Instagram Carousel|X Tweet|LinkedIn Post)$/, ''),
            platforms: {
              instagram: {
                post_type: 'instagram_carousel',
                content: instagramPost.content.split('\n\n'),
                cta: '',
              },
              x: {
                post_type: 'x_tweet',
                content: xPost.content,
                cta: '',
              },
              linkedin: {
                post_type: 'linkedin_post',
                content: linkedinPost.content,
                cta: '',
              },
            },
          };
          setGeneratedContent(reconstructedContent);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleGenerateContent = async () => {
    if (!user) {
      toast.error('You must be logged in to generate content');
      return;
    }

    if (topicsOfInterest.length === 0) {
      toast.error('No topics found. Please complete onboarding first.');
      navigate('/onboarding');
      return;
    }

    setIsGenerating(true);
    try {
      const content = await generateContent(topicsOfInterest);
      setGeneratedContent(content);

      await Promise.all([
        supabase.from('generated_content').insert({
          user_id: user.id,
          title: `${content.generated_topic} - Instagram Carousel`,
          content: content.platforms.instagram.content.join('\n\n'),
          content_type: 'instagram_carousel',
          platform: 'instagram',
          tone: 'professional',
          topics: [content.main_topic],
          status: 'draft',
        }),
        supabase.from('generated_content').insert({
          user_id: user.id,
          title: `${content.generated_topic} - X Tweet`,
          content: content.platforms.x.content,
          content_type: 'x_tweet',
          platform: 'x',
          tone: 'professional',
          topics: [content.main_topic],
          status: 'draft',
        }),
        supabase.from('generated_content').insert({
          user_id: user.id,
          title: `${content.generated_topic} - LinkedIn Post`,
          content: content.platforms.linkedin.content,
          content_type: 'linkedin_post',
          platform: 'linkedin',
          tone: 'professional',
          topics: [content.main_topic],
          status: 'draft',
        }),
      ]);

      setContentCount((prev) => prev + 3);
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
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
                onClick={() => navigate('/profile')}
              >
                <UserCircle className="w-5 h-5" />
              </Button>
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
                  {contentCount}
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

            {!generatedContent && (
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
                  onClick={handleGenerateContent}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-[#1E90FF] to-[#FF2D95] hover:opacity-90 text-white text-lg px-10 py-6 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(30,144,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Content...
                    </>
                  ) : (
                    'Generate Content'
                  )}
                </Button>
              </div>
            )}

            {generatedContent && (
              <div className="mt-12 space-y-6">
                <div className="text-center mb-8">
                  <h3 className="font-['Bebas_Neue',sans-serif] text-4xl mb-2">
                    <span className="bg-gradient-to-r from-[#1E90FF] to-[#FF2D95] bg-clip-text text-transparent">
                      YOUR GENERATED CONTENT
                    </span>
                  </h3>
                  <p className="text-gray-400">
                    Topic: <span className="text-white font-semibold">{generatedContent.generated_topic}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a2a]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">IG</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-white">Instagram Carousel</h4>
                        <p className="text-xs text-gray-500">{generatedContent.platforms.instagram.content.length} slides</p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-4">
                      {generatedContent.platforms.instagram.content.map((slide, index) => (
                        <div key={index} className="p-3 rounded-lg bg-[#0d0d0d] border border-[#2a2a2a]">
                          <p className="text-xs text-[#1E90FF] font-semibold mb-1">Slide {index + 1}</p>
                          <p className="text-sm text-gray-300">{slide}</p>
                        </div>
                      ))}
                    </div>
                    {generatedContent.platforms.instagram.cta && (
                      <div className="p-3 rounded-lg bg-[#1E90FF]/10 border border-[#1E90FF]/30">
                        <p className="text-xs text-[#1E90FF] font-semibold mb-1">CTA</p>
                        <p className="text-sm text-gray-300">{generatedContent.platforms.instagram.cta}</p>
                      </div>
                    )}
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a2a]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
                        <span className="text-white font-bold text-sm">𝕏</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-white">X (Twitter)</h4>
                        <p className="text-xs text-gray-500">Tweet</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-[#0d0d0d] border border-[#2a2a2a] mb-4">
                      <p className="text-sm text-gray-300 leading-relaxed">{generatedContent.platforms.x.content}</p>
                    </div>
                    {generatedContent.platforms.x.cta && (
                      <div className="p-3 rounded-lg bg-[#1E90FF]/10 border border-[#1E90FF]/30">
                        <p className="text-xs text-[#1E90FF] font-semibold mb-1">CTA</p>
                        <p className="text-sm text-gray-300">{generatedContent.platforms.x.cta}</p>
                      </div>
                    )}
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a2a]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-[#0077B5] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">in</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-white">LinkedIn</h4>
                        <p className="text-xs text-gray-500">Professional Post</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-[#0d0d0d] border border-[#2a2a2a] mb-4">
                      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{generatedContent.platforms.linkedin.content}</p>
                    </div>
                    {generatedContent.platforms.linkedin.cta && (
                      <div className="p-3 rounded-lg bg-[#1E90FF]/10 border border-[#1E90FF]/30">
                        <p className="text-xs text-[#1E90FF] font-semibold mb-1">CTA</p>
                        <p className="text-sm text-gray-300">{generatedContent.platforms.linkedin.cta}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    size="lg"
                    onClick={handleGenerateContent}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-[#1E90FF] to-[#FF2D95] hover:opacity-90 text-white text-lg px-10 py-6 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(30,144,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating Content...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate More Content
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
