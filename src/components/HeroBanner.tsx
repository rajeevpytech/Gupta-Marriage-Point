import React from 'react';
import { 
  Sparkles, 
  Mic, 
  Search, 
  RotateCcw, 
  ShieldCheck, 
  Heart, 
  Users, 
  Award,
  Crown
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import { MatchFilter, Gender } from '../types/matrimony';

interface HeroBannerProps {
  lang: Language;
  filters: MatchFilter;
  onChangeFilter: (key: keyof MatchFilter, val: any) => void;
  onResetFilters: () => void;
  onOpenVoiceAssistant: () => void;
  onOpenAiMatch: () => void;
  totalResultsCount: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  lang,
  filters,
  onChangeFilter,
  onResetFilters,
  onOpenVoiceAssistant,
  onOpenAiMatch,
  totalResultsCount
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="relative bg-gradient-to-br from-red-950 via-rose-900 to-amber-950 text-white overflow-hidden py-8 sm:py-14 px-4 sm:px-6 border-b-4 border-amber-500/40">
      {/* Decorative Traditional Indian Mandala Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        {/* Top Badges & Heading */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 text-amber-200 border border-amber-400/40 px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xs shadow-md">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </span>
            <span className="font-bold text-amber-300">Powered by Google Gemini AI 3.8 Flash</span>
            <span className="text-white/60">|</span>
            <span>{t.badgeAiPowered}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-royal tracking-tight text-amber-100 leading-tight">
            {lang === 'hi' ? (
              <>
                गुप्ता एवं वैश्य समाज का <span className="text-amber-400">नं. 1 एआई मैट्रिमोनी</span> मंच
              </>
            ) : (
              <>
                The Premier <span className="text-amber-400">AI Matrimony</span> for Gupta & Vaishya Community
              </>
            )}
          </h2>

          <p className="text-xs sm:text-base text-amber-100/80 font-medium">
            {t.searchHeading}
          </p>

          {/* Quick Dual AI Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenVoiceAssistant}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:brightness-110 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-xl transition transform active:scale-95 border border-amber-300"
            >
              <Mic className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>{t.aiVoiceSearchBtn}</span>
            </button>

            <button
              onClick={onOpenAiMatch}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-xl transition transform active:scale-95 border border-amber-500"
            >
              <Sparkles className="w-4 h-4 text-red-950" />
              <span>{t.aiMatchAssistantBtn}</span>
            </button>
          </div>
        </div>

        {/* Shaadi.com Style Interactive Search Box */}
        <div className="bg-white/95 text-stone-900 rounded-3xl p-4 sm:p-6 shadow-2xl border-2 border-amber-300 backdrop-blur-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
            {/* Looking for Bride / Groom */}
            <div className="space-y-1">
              <label className="font-bold text-stone-700 block text-xs">
                {t.iAmLookingFor}
              </label>
              <div className="grid grid-cols-2 gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => onChangeFilter('gender', 'female')}
                  className={`py-1.5 rounded-lg font-bold text-xs transition ${
                    filters.gender === 'female'
                      ? 'bg-red-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t.bride}
                </button>
                <button
                  type="button"
                  onClick={() => onChangeFilter('gender', 'male')}
                  className={`py-1.5 rounded-lg font-bold text-xs transition ${
                    filters.gender === 'male'
                      ? 'bg-red-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t.groom}
                </button>
              </div>
            </div>

            {/* Sub-caste filter */}
            <div className="space-y-1">
              <label className="font-bold text-stone-700 block text-xs">
                {t.subcaste}
              </label>
              <select
                value={filters.subcaste}
                onChange={(e) => onChangeFilter('subcaste', e.target.value)}
                className="w-full p-2 rounded-xl border border-stone-300 bg-white font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">{t.allSubcastes}</option>
                <option value="Gupta">गुप्ता (Gupta)</option>
                <option value="Aggarwal">अग्रवाल (Aggarwal)</option>
                <option value="Mittal">मित्तल (Mittal)</option>
                <option value="Khandelwal">खंडेलवाल (Khandelwal)</option>
                <option value="Rauniyar">रौनियार वैश्य (Rauniyar)</option>
                <option value="Mahajan">महाजन (Mahajan)</option>
                <option value="Vaishya">अन्य वैश्य (Vaishya)</option>
              </select>
            </div>

            {/* Profession filter */}
            <div className="space-y-1">
              <label className="font-bold text-stone-700 block text-xs">
                {t.profession}
              </label>
              <select
                value={filters.profession}
                onChange={(e) => onChangeFilter('profession', e.target.value)}
                className="w-full p-2 rounded-xl border border-stone-300 bg-white font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">{t.allProfessions}</option>
                <option value="Doctor">चिकित्सक / डॉक्टर (Doctor)</option>
                <option value="Software">सॉफ्टवेयर इंजीनियर (IT / Tech)</option>
                <option value="CA">चार्टर्ड एकाउंटेंट (CA / Finance)</option>
                <option value="Business">उद्योगपति / व्यवसायी (Business)</option>
                <option value="Civil">सिविल सेवा (IAS / Govt)</option>
                <option value="Architect">आर्किटेक्ट (Design / Real Estate)</option>
              </select>
            </div>

            {/* Location filter */}
            <div className="space-y-1">
              <label className="font-bold text-stone-700 block text-xs">
                {t.location}
              </label>
              <select
                value={filters.location}
                onChange={(e) => onChangeFilter('location', e.target.value)}
                className="w-full p-2 rounded-xl border border-stone-300 bg-white font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">{t.allLocations}</option>
                <option value="Delhi">दिल्ली एनसीआर (Delhi NCR)</option>
                <option value="Lucknow">लखनऊ (Lucknow, UP)</option>
                <option value="Mumbai">मुंबई (Mumbai, MH)</option>
                <option value="Jaipur">जयपुर (Jaipur, RJ)</option>
                <option value="Bengaluru">बेंगलुरु (Bengaluru, KA)</option>
                <option value="Varanasi">वाराणसी (Varanasi, UP)</option>
              </select>
            </div>
          </div>

          {/* Secondary Filter Line & Action Bar */}
          <div className="mt-4 pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              {/* Manglik Toggle */}
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-stone-600">कुंडली:</span>
                <select
                  value={filters.manglik}
                  onChange={(e) => onChangeFilter('manglik', e.target.value)}
                  className="p-1 rounded-lg border border-stone-300 bg-white font-medium text-xs"
                >
                  <option value="">सभी (मांगलिक/गैर-मांगलिक)</option>
                  <option value="Non-Manglik">मांगलिक नहीं (Non-Manglik)</option>
                  <option value="Manglik">मांगलिक (Manglik)</option>
                </select>
              </div>

              {/* Age Range Slider Info */}
              <div className="flex items-center gap-1.5 text-stone-600">
                <span>उम्र:</span>
                <span className="font-bold text-red-900 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                  {filters.minAge} से {filters.maxAge} वर्ष
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1 text-stone-500 hover:text-stone-800 px-2 py-1 rounded-lg transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.resetFilters}</span>
              </button>

              <div className="bg-red-900 text-amber-200 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-xs">
                <span>{totalResultsCount} सुयोग्य रिश्ते उपलब्ध</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs text-amber-100">
          <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-2xl border border-white/10 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% आधार व फोटो सत्यापित</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-2xl border border-white/10 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>36 गुण वैदिक एआई मिलान</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-2xl border border-white/10 flex items-center justify-center gap-2">
            <Mic className="w-4 h-4 text-rose-300" />
            <span>हिंदी वॉयस असिस्टेंट सर्च</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-2xl border border-white/10 flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-red-400" />
            <span>4,800+ सफल वैवाहिक रिश्ते</span>
          </div>
        </div>
      </div>
    </div>
  );
};
