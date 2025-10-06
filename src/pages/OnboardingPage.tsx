import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ArrowRight, ArrowLeft, Sparkles, Target, Users, MessageSquare, BookOpen, Calendar, CircleCheck as CheckCircle2 } from 'lucide-react';

interface OnboardingData {
  fullName: string;
  companyName: string;
  role: string;
  industry: string;
  contentGoals: string[];
  targetAudience: string;
  contentTone: string;
  topicsOfInterest: string[];
  contentFrequency: string;
}

const CONTENT_GOALS = [
  'Marketing & Brand Awareness',
  'Educational Content',
  'Product Documentation',
  'Social Media Posts',
  'Blog Articles',
  'Technical Writing',
  'Creative Writing',
  'Business Reports'
];

const CONTENT_TONES = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-focused' },
  { value: 'casual', label: 'Casual', description: 'Relaxed and conversational' },
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
  { value: 'authoritative', label: 'Authoritative', description: 'Expert and commanding' },
  { value: 'creative', label: 'Creative', description: 'Innovative and imaginative' }
];

const CONTENT_FREQUENCIES = [
  { value: 'daily', label: 'Daily', icon: Calendar },
  { value: 'weekly', label: 'Weekly', icon: Calendar },
  { value: 'monthly', label: 'Monthly', icon: Calendar },
  { value: 'occasional', label: 'Occasional', icon: Calendar }
];

const TOPICS = [
  'Technology',
  'Marketing',
  'Finance',
  'Healthcare',
  'Education',
  'E-commerce',
  'Entertainment',
  'Travel',
  'Food & Lifestyle',
  'Sports',
  'Science',
  'Art & Design'
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<OnboardingData>({
    fullName: '',
    companyName: '',
    role: '',
    industry: '',
    contentGoals: [],
    targetAudience: '',
    contentTone: 'professional',
    topicsOfInterest: [],
    contentFrequency: 'weekly'
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    }
    return [...array, item];
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          full_name: formData.fullName,
          company_name: formData.companyName,
          role: formData.role,
          industry: formData.industry,
          onboarding_completed: true
        });

      if (profileError) {
        console.warn('Database not ready, skipping profile save:', profileError);
      }

      const { error: responsesError } = await supabase
        .from('onboarding_responses')
        .upsert({
          user_id: user.id,
          content_goals: formData.contentGoals,
          target_audience: formData.targetAudience,
          content_tone: formData.contentTone,
          topics_of_interest: formData.topicsOfInterest,
          content_frequency: formData.contentFrequency
        });

      if (responsesError) {
        console.warn('Database not ready, skipping responses save:', responsesError);
      }

      toast.success('Onboarding completed! (Database will be set up later)');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      toast.success('Onboarding form completed! (Database will be set up later)');
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.fullName.trim() !== '';
      case 2:
        return formData.contentGoals.length > 0;
      case 3:
        return formData.targetAudience.trim() !== '' && formData.topicsOfInterest.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#1E90FF]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#FF2D95]/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-3xl relative z-10">
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Sparkles className="w-8 h-8 text-[#1E90FF]" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1E90FF] to-[#FF2D95] bg-clip-text text-transparent">Welcome! Let's Get Started</h1>
          </motion.div>
          <p className="text-gray-400">Help us personalize your experience in just a few steps</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-300">Step {step} of {totalSteps}</span>
            <span className="text-sm text-gray-400">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-xl border-2 border-[#2a2a2a] bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d]">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <Users className="w-12 h-12 text-[#1E90FF] mx-auto mb-3" />
                    <h2 className="text-2xl font-bold text-white mb-2">Tell us about yourself</h2>
                    <p className="text-gray-400">Let's start with some basic information</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName" className="text-gray-300">Full Name *</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="mt-1.5 bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-gray-600 focus:border-[#1E90FF] focus:ring-[#1E90FF]/20"
                      />
                    </div>

                    <div>
                      <Label htmlFor="companyName" className="text-gray-300">Company Name</Label>
                      <Input
                        id="companyName"
                        placeholder="Acme Inc."
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="mt-1.5 bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-gray-600 focus:border-[#1E90FF] focus:ring-[#1E90FF]/20"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="role" className="text-gray-300">Your Role</Label>
                        <Input
                          id="role"
                          placeholder="Marketing Manager"
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="mt-1.5 bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-gray-600 focus:border-[#1E90FF] focus:ring-[#1E90FF]/20"
                        />
                      </div>

                      <div>
                        <Label htmlFor="industry" className="text-gray-300">Industry</Label>
                        <Input
                          id="industry"
                          placeholder="Technology"
                          value={formData.industry}
                          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                          className="mt-1.5 bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-gray-600 focus:border-[#1E90FF] focus:ring-[#1E90FF]/20"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <Target className="w-12 h-12 text-[#1E90FF] mx-auto mb-3" />
                    <h2 className="text-2xl font-bold text-white mb-2">What are your content goals?</h2>
                    <p className="text-gray-400">Select all that apply</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {CONTENT_GOALS.map((goal) => (
                      <button
                        key={goal}
                        onClick={() => setFormData({
                          ...formData,
                          contentGoals: toggleArrayItem(formData.contentGoals, goal)
                        })}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          formData.contentGoals.includes(goal)
                            ? 'border-[#1E90FF] bg-[#1E90FF]/10 text-white'
                            : 'border-[#2a2a2a] hover:border-[#3a3a3a] text-gray-300 bg-[#1a1a1a]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{goal}</span>
                          {formData.contentGoals.includes(goal) && (
                            <CheckCircle2 className="w-5 h-5 text-[#1E90FF]" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <MessageSquare className="w-12 h-12 text-[#1E90FF] mx-auto mb-3" />
                    <h2 className="text-2xl font-bold text-white mb-2">Define your audience & style</h2>
                    <p className="text-gray-400">Help us tailor content to your needs</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="targetAudience" className="text-gray-300">Target Audience *</Label>
                      <Textarea
                        id="targetAudience"
                        placeholder="Describe your target audience (e.g., Small business owners, Tech enthusiasts, Students...)"
                        value={formData.targetAudience}
                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                        className="mt-1.5 min-h-[100px] bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-gray-600 focus:border-[#1E90FF] focus:ring-[#1E90FF]/20"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Content Tone</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {CONTENT_TONES.map((tone) => (
                          <button
                            key={tone.value}
                            onClick={() => setFormData({ ...formData, contentTone: tone.value })}
                            className={`p-3 rounded-lg border-2 transition-all text-left ${
                              formData.contentTone === tone.value
                                ? 'border-[#1E90FF] bg-[#1E90FF]/10'
                                : 'border-[#2a2a2a] hover:border-[#3a3a3a] bg-[#1a1a1a]/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-white">{tone.label}</div>
                                <div className="text-sm text-gray-400">{tone.description}</div>
                              </div>
                              {formData.contentTone === tone.value && (
                                <CheckCircle2 className="w-5 h-5 text-[#1E90FF]" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300">Topics of Interest *</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {TOPICS.map((topic) => (
                          <Badge
                            key={topic}
                            variant={formData.topicsOfInterest.includes(topic) ? 'default' : 'outline'}
                            className={`cursor-pointer px-4 py-2 transition-all ${
                              formData.topicsOfInterest.includes(topic)
                                ? 'bg-[#1E90FF] text-white border-[#1E90FF] hover:bg-[#1E90FF]/90'
                                : 'border-[#2a2a2a] text-gray-300 hover:border-[#3a3a3a] bg-[#1a1a1a]/50'
                            }`}
                            onClick={() => setFormData({
                              ...formData,
                              topicsOfInterest: toggleArrayItem(formData.topicsOfInterest, topic)
                            })}
                          >
                            {topic}
                            {formData.topicsOfInterest.includes(topic) && (
                              <CheckCircle2 className="w-3 h-3 ml-1" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <BookOpen className="w-12 h-12 text-[#1E90FF] mx-auto mb-3" />
                    <h2 className="text-2xl font-bold text-white mb-2">Almost there!</h2>
                    <p className="text-gray-400">Just one more thing...</p>
                  </div>

                  <div>
                    <Label className="text-gray-300">How often do you plan to create content?</Label>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {CONTENT_FREQUENCIES.map((freq) => (
                        <button
                          key={freq.value}
                          onClick={() => setFormData({ ...formData, contentFrequency: freq.value })}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            formData.contentFrequency === freq.value
                              ? 'border-[#1E90FF] bg-[#1E90FF]/10'
                              : 'border-[#2a2a2a] hover:border-[#3a3a3a] bg-[#1a1a1a]/50'
                          }`}
                        >
                          <freq.icon className={`w-6 h-6 mx-auto mb-2 ${
                            formData.contentFrequency === freq.value ? 'text-[#1E90FF]' : 'text-gray-500'
                          }`} />
                          <div className={`font-medium ${
                            formData.contentFrequency === freq.value ? 'text-white' : 'text-gray-300'
                          }`}>
                            {freq.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#1E90FF]/10 border border-[#1E90FF]/30 rounded-lg p-4 mt-6">
                    <h3 className="font-semibold text-white mb-3">Your Profile Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white font-medium">{formData.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Goals:</span>
                        <span className="text-white font-medium">{formData.contentGoals.length} selected</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Topics:</span>
                        <span className="text-white font-medium">{formData.topicsOfInterest.length} selected</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tone:</span>
                        <span className="text-white font-medium capitalize">{formData.contentTone}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-8 pt-6 border-t border-[#2a2a2a]">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className="gap-2 border-[#2a2a2a] text-gray-300 hover:bg-[#1a1a1a] hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              {step < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="gap-2 bg-gradient-to-r from-[#1E90FF] to-[#FF2D95] hover:opacity-90 text-white shadow-[0_0_30px_rgba(30,144,255,0.3)]"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="gap-2 bg-gradient-to-r from-[#1E90FF] to-[#FF2D95] hover:opacity-90 text-white shadow-[0_0_30px_rgba(30,144,255,0.3)]"
                >
                  {isSubmitting ? 'Saving...' : 'Complete Onboarding'}
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
