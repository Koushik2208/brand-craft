import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, Camera, Edit2, Save, X, Loader2, User } from 'lucide-react';

interface UserProfile {
  full_name: string;
  company_name: string;
  role: string;
  industry: string;
  avatar_url: string;
}

interface OnboardingPreferences {
  content_goals: string[];
  target_audience: string;
  content_tone: string;
  topics_of_interest: string[];
  content_frequency: string;
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

const CONTENT_TONES = ['professional', 'casual', 'friendly', 'authoritative', 'creative'];
const CONTENT_FREQUENCIES = ['daily', 'weekly', 'monthly', 'occasional'];
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

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    company_name: '',
    role: '',
    industry: '',
    avatar_url: '',
  });

  const [preferences, setPreferences] = useState<OnboardingPreferences>({
    content_goals: [],
    target_audience: '',
    content_tone: 'professional',
    topics_of_interest: [],
    content_frequency: 'weekly',
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const [editedPreferences, setEditedPreferences] = useState<OnboardingPreferences>(preferences);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchUserData();
  }, [user, navigate]);

  const fetchUserData = async () => {
    if (!user) return;

    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profileData) {
      const profileInfo = {
        full_name: profileData.full_name || '',
        company_name: profileData.company_name || '',
        role: profileData.role || '',
        industry: profileData.industry || '',
        avatar_url: profileData.avatar_url || '',
      };
      setProfile(profileInfo);
      setEditedProfile(profileInfo);
    }

    const { data: preferencesData } = await supabase
      .from('onboarding_responses')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (preferencesData) {
      const prefs = {
        content_goals: preferencesData.content_goals || [],
        target_audience: preferencesData.target_audience || '',
        content_tone: preferencesData.content_tone || 'professional',
        topics_of_interest: preferencesData.topics_of_interest || [],
        content_frequency: preferencesData.content_frequency || 'weekly',
      };
      setPreferences(prefs);
      setEditedPreferences(prefs);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      setEditedProfile({ ...editedProfile, avatar_url: publicUrl });
      toast.success('Avatar updated successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: editedProfile.full_name,
          company_name: editedProfile.company_name,
          role: editedProfile.role,
          industry: editedProfile.industry,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(editedProfile);
      setIsEditingProfile(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('onboarding_responses')
        .update({
          content_goals: editedPreferences.content_goals,
          target_audience: editedPreferences.target_audience,
          content_tone: editedPreferences.content_tone,
          topics_of_interest: editedPreferences.topics_of_interest,
          content_frequency: editedPreferences.content_frequency,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setPreferences(editedPreferences);
      setIsEditingPreferences(false);
      toast.success('Preferences updated successfully!');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    }
    return [...array, item];
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#1E90FF]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-[#FF2D95]/5 rounded-full blur-[120px]" />

      <header className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/80 backdrop-blur-xl border-b border-[#2a2a2a]">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-transparent"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="font-['Bebas_Neue',sans-serif] text-3xl bg-gradient-to-r from-[#1E90FF] to-[#FF2D95] bg-clip-text text-transparent">
              PROFILE
            </h1>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-16 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a2a]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-bold text-white">Personal Information</CardTitle>
                {!isEditingProfile ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingProfile(true)}
                    className="border-[#2a2a2a] text-gray-300 hover:bg-[#1a1a1a] hover:text-white"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setEditedProfile(profile);
                      }}
                      className="border-[#2a2a2a] text-gray-300 hover:bg-[#1a1a1a] hover:text-white"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-2 border-[#1E90FF]">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-[#1E90FF] to-[#FF2D95] text-white text-2xl">
                        {profile.full_name ? getInitials(profile.full_name) : <User className="w-12 h-12" />}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      className="absolute bottom-0 right-0 p-2 rounded-full bg-[#1E90FF] text-white hover:bg-[#1E90FF]/90 transition-colors disabled:opacity-50"
                    >
                      {isUploadingAvatar ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{profile.full_name || 'User'}</h3>
                    <p className="text-gray-400">{user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Full Name</Label>
                    <Input
                      value={isEditingProfile ? editedProfile.full_name : profile.full_name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, full_name: e.target.value })}
                      disabled={!isEditingProfile}
                      className="mt-1.5 bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-gray-600 disabled:opacity-100"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Company Name</Label>
                    <Input
                      value={isEditingProfile ? editedProfile.company_name : profile.company_name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, company_name: e.target.value })}
                      disabled={!isEditingProfile}
                      placeholder="Optional"
                      className="mt-1.5 bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-gray-600 disabled:opacity-100"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Role</Label>
                    <Input
                      value={isEditingProfile ? editedProfile.role : profile.role}
                      onChange={(e) => setEditedProfile({ ...editedProfile, role: e.target.value })}
                      disabled={!isEditingProfile}
                      placeholder="Optional"
                      className="mt-1.5 bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-gray-600 disabled:opacity-100"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Industry</Label>
                    <Input
                      value={isEditingProfile ? editedProfile.industry : profile.industry}
                      onChange={(e) => setEditedProfile({ ...editedProfile, industry: e.target.value })}
                      disabled={!isEditingProfile}
                      placeholder="Optional"
                      className="mt-1.5 bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-gray-600 disabled:opacity-100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a2a]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-bold text-white">Content Preferences</CardTitle>
                {!isEditingPreferences ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingPreferences(true)}
                    className="border-[#2a2a2a] text-gray-300 hover:bg-[#1a1a1a] hover:text-white"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditingPreferences(false);
                        setEditedPreferences(preferences);
                      }}
                      className="border-[#2a2a2a] text-gray-300 hover:bg-[#1a1a1a] hover:text-white"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSavePreferences}
                      disabled={isSaving}
                      className="bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-gray-300 mb-3 block">Content Goals</Label>
                  <div className="flex flex-wrap gap-2">
                    {CONTENT_GOALS.map((goal) => {
                      const isSelected = isEditingPreferences
                        ? editedPreferences.content_goals.includes(goal)
                        : preferences.content_goals.includes(goal);
                      return (
                        <Badge
                          key={goal}
                          variant={isSelected ? 'default' : 'outline'}
                          className={`cursor-pointer px-3 py-1.5 transition-all ${
                            isSelected
                              ? 'bg-[#1E90FF] text-white border-[#1E90FF]'
                              : 'border-[#2a2a2a] text-gray-300 bg-[#1a1a1a]/50'
                          } ${!isEditingPreferences ? 'cursor-default' : 'hover:border-[#1E90FF]'}`}
                          onClick={() => {
                            if (isEditingPreferences) {
                              setEditedPreferences({
                                ...editedPreferences,
                                content_goals: toggleArrayItem(editedPreferences.content_goals, goal)
                              });
                            }
                          }}
                        >
                          {goal}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">Target Audience</Label>
                  <Textarea
                    value={isEditingPreferences ? editedPreferences.target_audience : preferences.target_audience}
                    onChange={(e) => setEditedPreferences({ ...editedPreferences, target_audience: e.target.value })}
                    disabled={!isEditingPreferences}
                    className="mt-1.5 min-h-[100px] bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-gray-600 disabled:opacity-100"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Content Tone</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {CONTENT_TONES.map((tone) => {
                        const isSelected = isEditingPreferences
                          ? editedPreferences.content_tone === tone
                          : preferences.content_tone === tone;
                        return (
                          <Badge
                            key={tone}
                            variant={isSelected ? 'default' : 'outline'}
                            className={`cursor-pointer px-3 py-1.5 transition-all capitalize ${
                              isSelected
                                ? 'bg-[#1E90FF] text-white border-[#1E90FF]'
                                : 'border-[#2a2a2a] text-gray-300 bg-[#1a1a1a]/50'
                            } ${!isEditingPreferences ? 'cursor-default' : 'hover:border-[#1E90FF]'}`}
                            onClick={() => {
                              if (isEditingPreferences) {
                                setEditedPreferences({ ...editedPreferences, content_tone: tone });
                              }
                            }}
                          >
                            {tone}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-300">Content Frequency</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {CONTENT_FREQUENCIES.map((freq) => {
                        const isSelected = isEditingPreferences
                          ? editedPreferences.content_frequency === freq
                          : preferences.content_frequency === freq;
                        return (
                          <Badge
                            key={freq}
                            variant={isSelected ? 'default' : 'outline'}
                            className={`cursor-pointer px-3 py-1.5 transition-all capitalize ${
                              isSelected
                                ? 'bg-[#1E90FF] text-white border-[#1E90FF]'
                                : 'border-[#2a2a2a] text-gray-300 bg-[#1a1a1a]/50'
                            } ${!isEditingPreferences ? 'cursor-default' : 'hover:border-[#1E90FF]'}`}
                            onClick={() => {
                              if (isEditingPreferences) {
                                setEditedPreferences({ ...editedPreferences, content_frequency: freq });
                              }
                            }}
                          >
                            {freq}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300 mb-3 block">Topics of Interest</Label>
                  <div className="flex flex-wrap gap-2">
                    {TOPICS.map((topic) => {
                      const isSelected = isEditingPreferences
                        ? editedPreferences.topics_of_interest.includes(topic)
                        : preferences.topics_of_interest.includes(topic);
                      return (
                        <Badge
                          key={topic}
                          variant={isSelected ? 'default' : 'outline'}
                          className={`cursor-pointer px-3 py-1.5 transition-all ${
                            isSelected
                              ? 'bg-[#1E90FF] text-white border-[#1E90FF]'
                              : 'border-[#2a2a2a] text-gray-300 bg-[#1a1a1a]/50'
                          } ${!isEditingPreferences ? 'cursor-default' : 'hover:border-[#1E90FF]'}`}
                          onClick={() => {
                            if (isEditingPreferences) {
                              setEditedPreferences({
                                ...editedPreferences,
                                topics_of_interest: toggleArrayItem(editedPreferences.topics_of_interest, topic)
                              });
                            }
                          }}
                        >
                          {topic}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
