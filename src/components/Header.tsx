import React from 'react';
import { 
  Sparkles, 
  Mic, 
  Heart, 
  PhoneCall, 
  Smartphone, 
  Monitor, 
  UserPlus, 
  Languages,
  Crown
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  deviceView: 'desktop' | 'ios' | 'android';
  onChangeDeviceView: (view: 'desktop' | 'ios' | 'android') => void;
  onOpenVoiceAssistant: () => void;
  onOpenAiMatch: () => void;
  onOpenCreateProfile: () => void;
  shortlistedCount: number;
  onOpenShortlisted: () => void;
  onOpenMembership: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  deviceView,
  onChangeDeviceView,
  onOpenVoiceAssistant,
  onOpenAiMatch,
  onOpenCreateProfile,
  shortlistedCount,
  onOpenShortlisted,
  onOpenMembership
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-sm">
      {/* Top Auspicious Banner */}
      <div className="bg-gradient-to-r from-red-900 via-rose-950 to-amber-900 text-amber-100 text-xs py-1.5 px-4 font-medium flex flex-wrap justify-between items-center border-b border-amber-600/30">
        <div className="flex items-center gap-2 font-royal tracking-wider text-[11px] sm:text-xs">
          <span className="text-amber-400">॥ श्री गणेशाय नमः ॥</span>
          <span className="hidden md:inline text-amber-200/60">|</span>
          <span className="hidden md:inline text-amber-200">
            {lang === 'hi' ? 'वैश्य एवं गुप्ता समाज का गौरवशाली वैवाहिक मंच' : 'Premier Matrimony for Vaishya & Gupta Community'}
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
          <div className="flex items-center gap-1.5 text-amber-200 hover:text-white transition cursor-pointer">
            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline font-mono">1800-208-GUPTA</span>
            <span className="sm:hidden font-mono">हेल्पलाइन</span>
          </div>

          <button 
            onClick={onOpenMembership}
            className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold px-2 py-0.5 rounded text-[10px] sm:text-xs hover:brightness-110 shadow-sm transition"
          >
            <Crown className="w-3 h-3" />
            <span>VIP लाउंज</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 bg-red-950/70 border border-amber-400/40 text-amber-200 hover:text-white px-2 py-0.5 rounded text-[11px] transition"
            title="भाषा बदलें / Change Language"
          >
            <Languages className="w-3 h-3 text-amber-400" />
            <span className="font-semibold">{lang === 'hi' ? 'English' : 'हिंदी'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-red-800 via-rose-900 to-amber-700 text-amber-300 shadow-md border-2 border-amber-400/60">
            <span className="font-royal font-bold text-xl sm:text-2xl tracking-tighter">GM</span>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center text-[9px] text-stone-950 font-black">
              ★
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-royal text-lg sm:text-2xl font-bold bg-gradient-to-r from-red-900 via-rose-900 to-amber-800 bg-clip-text text-transparent leading-none">
                {t.siteTitle}
              </h1>
              <span className="text-[10px] bg-gradient-to-r from-blue-50 to-amber-50 text-stone-900 font-bold px-2 py-0.5 rounded-full border border-blue-200/80 shadow-2xs hidden md:inline-flex items-center gap-1">
                <span className="flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                </span>
                <span>Google Gemini AI</span>
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-500 font-medium tracking-tight">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Device Preview Toggle Bar (Client Demo Feature) */}
        <div className="hidden lg:flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 shadow-inner">
          <span className="text-[10px] font-semibold text-stone-500 px-2 uppercase tracking-wider">
            डेमो प्रीव्यू:
          </span>
          <button
            onClick={() => onChangeDeviceView('desktop')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              deviceView === 'desktop'
                ? 'bg-white text-red-900 shadow-sm border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>वेब (Web)</span>
          </button>

          <button
            onClick={() => onChangeDeviceView('ios')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              deviceView === 'ios'
                ? 'bg-white text-red-900 shadow-sm border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-600" />
            <span>Apple iOS</span>
          </button>

          <button
            onClick={() => onChangeDeviceView('android')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              deviceView === 'android'
                ? 'bg-white text-red-900 shadow-sm border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Android</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Voice Assistant Trigger */}
          <button
            onClick={onOpenVoiceAssistant}
            className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-semibold text-xs sm:text-sm px-3 py-2 rounded-xl shadow-md hover:shadow-lg transition transform active:scale-95 border border-red-400"
            title="वॉयस असिस्टेंट से बोलकर रिश्ता खोजें"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
            </span>
            <Mic className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline font-medium">वॉयस असिस्टेंट</span>
            <span className="sm:hidden font-medium">वॉयस AI</span>
          </button>

          {/* AI Kundali & Matchmaker Trigger */}
          <button
            onClick={onOpenAiMatch}
            className="hidden md:flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-semibold text-xs sm:text-sm px-3 py-2 rounded-xl shadow-sm transition transform active:scale-95"
            title="एआई 36 गुण कुंडली मिलान"
          >
            <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>AI मैचिंग असिस्टेंट</span>
          </button>

          {/* Shortlisted Matches */}
          <button
            onClick={onOpenShortlisted}
            className="relative p-2 rounded-xl text-stone-700 hover:text-red-700 hover:bg-rose-50 transition border border-stone-200"
            title="शॉर्टलिस्टेड प्रोफाइल"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />
            {shortlistedCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                {shortlistedCount}
              </span>
            )}
          </button>

          {/* Register Profile */}
          <button
            onClick={onOpenCreateProfile}
            className="flex items-center gap-1 bg-stone-900 hover:bg-black text-amber-200 text-xs sm:text-sm font-semibold px-3 py-2 rounded-xl shadow transition"
          >
            <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span className="hidden sm:inline">बायोडाटा जोड़ें</span>
            <span className="sm:hidden">रजिस्टर</span>
          </button>
        </div>
      </div>
    </header>
  );
};
