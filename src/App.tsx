import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Mic, 
  Heart, 
  Users, 
  ShieldCheck, 
  Filter, 
  Search, 
  CheckCircle2, 
  PhoneCall, 
  Award,
  Crown,
  ArrowRight,
  MessageCircle,
  Stethoscope,
  Laptop,
  Briefcase,
  Building
} from 'lucide-react';

import { PROFILES_DATA } from './data/profiles';
import { MatrimonyProfile, MatchFilter, Gender } from './types/matrimony';
import { Language, TRANSLATIONS } from './data/translations';

import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProfileCard } from './components/ProfileCard';
import { ProfileDetailModal } from './components/ProfileDetailModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { AiMatchModal } from './components/AiMatchModal';
import { BiodataModal } from './components/BiodataModal';
import { MessengerModal } from './components/MessengerModal';
import { CreateProfileModal } from './components/CreateProfileModal';
import { MembershipModal } from './components/MembershipModal';
import { VideoProfileModal } from './components/VideoProfileModal';
import { SuccessStories } from './components/SuccessStories';
import { Footer } from './components/Footer';
import { MobileDeviceFrame } from './components/MobileDeviceFrame';

export default function App() {
  const [lang, setLang] = useState<Language>('hi');
  const [deviceView, setDeviceView] = useState<'desktop' | 'ios' | 'android'>('desktop');
  const [profiles, setProfiles] = useState<MatrimonyProfile[]>(PROFILES_DATA);

  // Active Search Filters
  const [filters, setFilters] = useState<MatchFilter>({
    gender: 'female',
    minAge: 21,
    maxAge: 35,
    subcaste: '',
    profession: '',
    location: '',
    manglik: '',
    diet: '',
    minIncome: ''
  });

  // Category Tab
  const [categoryTab, setCategoryTab] = useState<'all' | 'featured' | 'doctor' | 'software' | 'ca' | 'business' | 'shortlisted'>('all');

  // Bookmarks & Interests
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(['GP-BR-101']);
  const [interestSentIds, setInterestSentIds] = useState<string[]>([]);

  // Modals
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isAiMatchOpen, setIsAiMatchOpen] = useState(false);
  const [matchCandidateA, setMatchCandidateA] = useState<MatrimonyProfile | undefined>(undefined);
  const [matchCandidateB, setMatchCandidateB] = useState<MatrimonyProfile | undefined>(undefined);

  const [activeProfileForDetail, setActiveProfileForDetail] = useState<MatrimonyProfile | null>(null);
  const [activeProfileForBiodata, setActiveProfileForBiodata] = useState<MatrimonyProfile | null>(null);
  const [activeProfileForMessenger, setActiveProfileForMessenger] = useState<MatrimonyProfile | null>(null);
  const [activeProfileForVideo, setActiveProfileForVideo] = useState<MatrimonyProfile | null>(null);

  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);

  const t = TRANSLATIONS[lang];

  // Filter Handler
  const handleFilterChange = (key: keyof MatchFilter, val: any) => {
    setFilters(prev => ({ ...prev, [key]: val }));
  };

  const handleResetFilters = () => {
    setFilters({
      gender: filters.gender,
      minAge: 21,
      maxAge: 35,
      subcaste: '',
      profession: '',
      location: '',
      manglik: '',
      diet: '',
      minIncome: ''
    });
    setCategoryTab('all');
  };

  // Toggle Shortlist
  const handleToggleShortlist = (id: string) => {
    setShortlistedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Send Express Interest
  const handleSendInterest = (id: string) => {
    if (!interestSentIds.includes(id)) {
      setInterestSentIds(prev => [...prev, id]);
    }
  };

  // Open AI Match for specific candidate
  const handleOpenKundaliMatchWith = (profile: MatrimonyProfile) => {
    if (profile.gender === 'female') {
      const groom = profiles.find(p => p.gender === 'male');
      setMatchCandidateA(groom);
      setMatchCandidateB(profile);
    } else {
      const bride = profiles.find(p => p.gender === 'female');
      setMatchCandidateA(profile);
      setMatchCandidateB(bride);
    }
    setIsAiMatchOpen(true);
  };

  // Dedicated Open Voice Assistant
  const handleOpenVoiceAssistant = () => {
    setIsVoiceAssistantOpen(true);
  };

  // Filtered Profiles Calculation
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      // Gender Filter
      if (p.gender !== filters.gender) return false;

      // Age Range Filter
      if (p.age < filters.minAge || p.age > filters.maxAge) return false;

      // Subcaste Filter
      if (filters.subcaste && !p.subcaste.toLowerCase().includes(filters.subcaste.toLowerCase())) {
        return false;
      }

      // Profession Filter
      if (filters.profession && !p.profession.toLowerCase().includes(filters.profession.toLowerCase()) && !p.professionCategory.toLowerCase().includes(filters.profession.toLowerCase())) {
        return false;
      }

      // Location Filter
      if (filters.location && !p.city.toLowerCase().includes(filters.location.toLowerCase()) && !p.state.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Manglik Filter
      if (filters.manglik && p.manglik !== filters.manglik) {
        return false;
      }

      // Category Pill Tabs
      if (categoryTab === 'featured' && !p.featured) return false;
      if (categoryTab === 'doctor' && p.professionCategory !== 'Doctor / Medical') return false;
      if (categoryTab === 'software' && p.professionCategory !== 'IT / Software') return false;
      if (categoryTab === 'ca' && p.professionCategory !== 'CA / Finance') return false;
      if (categoryTab === 'business' && p.professionCategory !== 'Business / Industrialist') return false;
      if (categoryTab === 'shortlisted' && !shortlistedIds.includes(p.id)) return false;

      return true;
    });
  }, [profiles, filters, categoryTab, shortlistedIds]);

  // Handle adding new profile
  const handleAddProfile = (newProfile: MatrimonyProfile) => {
    setProfiles(prev => [newProfile, ...prev]);
    // Switch filter gender to match the created profile's gender
    setFilters(prev => ({ ...prev, gender: newProfile.gender }));
  };

  return (
    <>
      <MobileDeviceFrame
        deviceView={deviceView}
        onResetToDesktop={() => setDeviceView('desktop')}
      >
      <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
        {/* Main Header */}
        <Header
          lang={lang}
          onToggleLang={() => setLang(lang === 'hi' ? 'en' : 'hi')}
          deviceView={deviceView}
          onChangeDeviceView={setDeviceView}
          onOpenVoiceAssistant={handleOpenVoiceAssistant}
          onOpenAiMatch={() => {
            setMatchCandidateA(profiles.find(p => p.gender === 'male'));
            setMatchCandidateB(profiles.find(p => p.gender === 'female'));
            setIsAiMatchOpen(true);
          }}
          onOpenCreateProfile={() => setIsCreateProfileOpen(true)}
          shortlistedCount={shortlistedIds.length}
          onOpenShortlisted={() => setCategoryTab('shortlisted')}
          onOpenMembership={() => setIsMembershipOpen(true)}
        />

        {/* Hero Banner with Search */}
        <HeroBanner
          lang={lang}
          filters={filters}
          onChangeFilter={handleFilterChange}
          onResetFilters={handleResetFilters}
          onOpenVoiceAssistant={handleOpenVoiceAssistant}
          onOpenAiMatch={() => {
            setMatchCandidateA(profiles.find(p => p.gender === 'male'));
            setMatchCandidateB(profiles.find(p => p.gender === 'female'));
            setIsAiMatchOpen(true);
          }}
          totalResultsCount={filteredProfiles.length}
        />

        {/* Profiles Section */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
          {/* Category Filter Pills Bar */}
          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 border-b border-amber-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCategoryTab('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  categoryTab === 'all'
                    ? 'bg-red-900 text-amber-200 shadow-sm'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {t.allProfiles} ({profiles.filter(p => p.gender === filters.gender).length})
              </button>

              <button
                onClick={() => setCategoryTab('featured')}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  categoryTab === 'featured'
                    ? 'bg-red-900 text-amber-200 shadow-sm'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span>प्रमुख रिश्ते (Featured)</span>
              </button>

              <button
                onClick={() => setCategoryTab('doctor')}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  categoryTab === 'doctor'
                    ? 'bg-red-900 text-amber-200 shadow-sm'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 text-rose-600" />
                <span>डॉक्टर (Doctors)</span>
              </button>

              <button
                onClick={() => setCategoryTab('software')}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  categoryTab === 'software'
                    ? 'bg-red-900 text-amber-200 shadow-sm'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <Laptop className="w-3.5 h-3.5 text-blue-600" />
                <span>सॉफ्टवेयर / टेक (IT)</span>
              </button>

              <button
                onClick={() => setCategoryTab('ca')}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  categoryTab === 'ca'
                    ? 'bg-red-900 text-amber-200 shadow-sm'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                <span>सीए व फाइनेंस (CA)</span>
              </button>

              <button
                onClick={() => setCategoryTab('shortlisted')}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  categoryTab === 'shortlisted'
                    ? 'bg-red-900 text-amber-200 shadow-sm'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>शॉर्टलिस्टेड ({shortlistedIds.length})</span>
              </button>
            </div>

            {/* Gender Switcher Button */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-xs text-stone-500 hidden sm:inline">वर्ग:</span>
              <button
                onClick={() => handleFilterChange('gender', filters.gender === 'female' ? 'male' : 'female')}
                className="bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold px-3 py-1.5 rounded-xl text-xs border border-amber-300 transition"
              >
                {filters.gender === 'female' ? 'दिखाएं: सुयोग्य वर (Grooms)' : 'दिखाएं: सुयोग्य वधू (Brides)'}
              </button>
            </div>
          </div>

          {/* Heading Info */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-royal font-bold text-xl sm:text-2xl text-stone-900">
                {filters.gender === 'female' ? 'सत्यापित वधू प्रोफाइल (Eligible Brides)' : 'सत्यापित वर प्रोफाइल (Eligible Grooms)'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-500">
                वैश्य समाज के 100% आधार व कुंडली सत्यापित रिश्ते
              </p>
            </div>

            <div className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1 rounded-xl">
              परिणाम: <strong className="text-red-900">{filteredProfiles.length}</strong> प्रोफाइल
            </div>
          </div>

          {/* Profiles Grid */}
          {filteredProfiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredProfiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  lang={lang}
                  isShortlisted={shortlistedIds.includes(profile.id)}
                  onToggleShortlist={handleToggleShortlist}
                  isInterestSent={interestSentIds.includes(profile.id)}
                  onSendInterest={handleSendInterest}
                  onOpenKundaliMatch={handleOpenKundaliMatchWith}
                  onOpenBiodata={(p) => setActiveProfileForBiodata(p)}
                  onOpenDetail={(p) => setActiveProfileForDetail(p)}
                  onOpenMessenger={(p) => setActiveProfileForMessenger(p)}
                  onOpenVideo={(p) => setActiveProfileForVideo(p)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200 space-y-4">
              <Users className="w-12 h-12 text-stone-400 mx-auto" />
              <h4 className="font-bold text-lg text-stone-800">
                इस फ़िल्टर के अनुसार कोई प्रोफाइल नहीं मिली
              </h4>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
                कृपया फ़िल्टर सीमा (जैसे उम्र या उपजाति) को थोड़ा शिथिल करें अथवा वॉयस असिस्टेंट से पुनः प्रयास करें।
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-red-900 text-amber-200 px-4 py-2 rounded-xl text-xs font-bold shadow hover:bg-black transition"
              >
                सभी फ़िल्टर रीसेट करें
              </button>
            </div>
          )}

          {/* AI Banner in Middle of Page */}
          <div className="bg-gradient-to-r from-red-900 via-rose-950 to-amber-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border-2 border-amber-400">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-xs px-3 py-0.5 rounded-full border border-amber-400/30 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>गुप्ता मैरिज पॉइंट एआई विशेष तकनीक</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-royal font-bold text-amber-200">
                क्या आप मनपसंद रिश्ता ढूंढने में समय नहीं गंवाना चाहते?
              </h3>
              <p className="text-xs sm:text-sm text-amber-100/80 max-w-xl">
                हमारे एआई वॉयस असिस्टेंट को अपनी प्राथमिकताएं बोलकर बताएं। यह कुछ ही सेकंड में 36 गुण मिलान और मांगलिक अनुकूलता के आधार पर सर्वश्रेष्ठ रिश्ते ढूंढ निकालेगा।
              </p>
            </div>

            <div className="flex flex-wrap gap-3 shrink-0">
              <button
                onClick={handleOpenVoiceAssistant}
                className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-5 py-3 rounded-2xl shadow-lg transition flex items-center gap-2 text-xs sm:text-sm"
              >
                <Mic className="w-4 h-4 text-red-950" />
                <span>वॉयस असिस्टेंट शुरू करें</span>
              </button>
              <button
                onClick={() => {
                  setMatchCandidateA(profiles.find(p => p.gender === 'male'));
                  setMatchCandidateB(profiles.find(p => p.gender === 'female'));
                  setIsAiMatchOpen(true);
                }}
                className="bg-white/10 hover:bg-white/20 text-amber-200 border border-amber-300/40 font-bold px-5 py-3 rounded-2xl transition flex items-center gap-2 text-xs sm:text-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>36 गुण कुंडली मिलान</span>
              </button>
            </div>
          </div>
        </main>

        {/* Success Stories Section */}
        <SuccessStories lang={lang} />

        {/* Footer */}
        <Footer
          lang={lang}
          onOpenVoiceAssistant={handleOpenVoiceAssistant}
          onOpenAiMatch={() => {
            setMatchCandidateA(profiles.find(p => p.gender === 'male'));
            setMatchCandidateB(profiles.find(p => p.gender === 'female'));
            setIsAiMatchOpen(true);
          }}
          onOpenMembership={() => setIsMembershipOpen(true)}
        />
      </div>
    </MobileDeviceFrame>

    {/* Floating Controls (Rendered on top of everything) */}
    <div className="fixed bottom-5 left-5 z-40 hidden sm:flex items-center bg-stone-900/90 backdrop-blur-md p-1.5 rounded-full border border-stone-700 shadow-2xl text-xs text-stone-200">
      <span className="text-[10px] font-bold text-amber-300 px-2.5">
        प्रीव्यू:
      </span>
      <button
        onClick={() => setDeviceView('desktop')}
        className={`px-3 py-1 rounded-full font-semibold transition ${
          deviceView === 'desktop' ? 'bg-amber-400 text-stone-950 shadow-xs' : 'text-stone-300 hover:text-white'
        }`}
      >
        वेब (Desktop)
      </button>
      <button
        onClick={() => setDeviceView('ios')}
        className={`px-3 py-1 rounded-full font-semibold transition ${
          deviceView === 'ios' ? 'bg-blue-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
        }`}
      >
        iPhone (iOS)
      </button>
      <button
        onClick={() => setDeviceView('android')}
        className={`px-3 py-1 rounded-full font-semibold transition ${
          deviceView === 'android' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
        }`}
      >
        Galaxy (Android)
      </button>
    </div>

    {/* Floating Quick Action Button */}
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
      {/* Quick AI Voice Matcher Floating Pill */}
      <button
        onClick={handleOpenVoiceAssistant}
        className="flex items-center gap-2 bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 hover:brightness-110 text-white px-4 py-3 rounded-full shadow-2xl border-2 border-amber-300 transition transform hover:scale-105 active:scale-95 group"
        title="बोलकर रिश्ता खोजें - Google AI Powered"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
        </span>
        <Mic className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
        <div className="text-left">
          <span className="font-bold text-xs sm:text-sm tracking-wide block leading-none">
            बोलकर खोजें (AI Voice)
          </span>
          <span className="text-[9px] text-amber-200/90 font-medium flex items-center gap-1 mt-0.5">
            <span className="flex items-center gap-0.5">
              <span className="w-1 h-1 rounded-full bg-blue-400"></span>
              <span className="w-1 h-1 rounded-full bg-red-400"></span>
              <span className="w-1 h-1 rounded-full bg-amber-300"></span>
              <span className="w-1 h-1 rounded-full bg-emerald-300"></span>
            </span>
            <span>Google Gemini AI</span>
          </span>
        </div>
      </button>
    </div>

    {/* Modals (Rendered at root level outside frame) */}
    <VoiceAssistantModal
      isOpen={isVoiceAssistantOpen}
      onClose={() => setIsVoiceAssistantOpen(false)}
      lang={lang}
      onApplyFilters={(extracted) => {
        setFilters(prev => ({ ...prev, ...extracted }));
      }}
      currentGender={filters.gender}
      availableProfiles={profiles}
      onOpenBiodata={(p) => setActiveProfileForBiodata(p)}
      onSendInterest={handleSendInterest}
    />

    <AiMatchModal
      isOpen={isAiMatchOpen}
      onClose={() => setIsAiMatchOpen(false)}
      lang={lang}
      profiles={profiles}
      initialProfileA={matchCandidateA}
      initialProfileB={matchCandidateB}
    />

    <BiodataModal
      isOpen={!!activeProfileForBiodata}
      onClose={() => setActiveProfileForBiodata(null)}
      profile={activeProfileForBiodata}
      lang={lang}
      onOpenVideo={(p) => setActiveProfileForVideo(p)}
    />

    <ProfileDetailModal
      isOpen={!!activeProfileForDetail}
      onClose={() => setActiveProfileForDetail(null)}
      profile={activeProfileForDetail}
      lang={lang}
      isShortlisted={activeProfileForDetail ? shortlistedIds.includes(activeProfileForDetail.id) : false}
      onToggleShortlist={handleToggleShortlist}
      isInterestSent={activeProfileForDetail ? interestSentIds.includes(activeProfileForDetail.id) : false}
      onSendInterest={handleSendInterest}
      onOpenKundaliMatch={handleOpenKundaliMatchWith}
      onOpenBiodata={(p) => setActiveProfileForBiodata(p)}
      onOpenMessenger={(p) => setActiveProfileForMessenger(p)}
      onOpenVideo={(p) => setActiveProfileForVideo(p)}
    />

    <VideoProfileModal
      isOpen={!!activeProfileForVideo}
      onClose={() => setActiveProfileForVideo(null)}
      profile={activeProfileForVideo}
      lang={lang}
    />

    <MessengerModal
      isOpen={!!activeProfileForMessenger}
      onClose={() => setActiveProfileForMessenger(null)}
      profile={activeProfileForMessenger}
      lang={lang}
    />

    <CreateProfileModal
      isOpen={isCreateProfileOpen}
      onClose={() => setIsCreateProfileOpen(false)}
      lang={lang}
      onAddProfile={handleAddProfile}
    />

    <MembershipModal
      isOpen={isMembershipOpen}
      onClose={() => setIsMembershipOpen(false)}
      lang={lang}
    />
  </>
  );
}
