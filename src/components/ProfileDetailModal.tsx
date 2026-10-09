import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Heart, 
  Send, 
  Check, 
  Sparkles, 
  FileText, 
  MessageCircle, 
  Phone, 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Users, 
  Compass, 
  CheckCircle2, 
  Share2,
  Film
} from 'lucide-react';
import { MatrimonyProfile } from '../types/matrimony';
import { Language, TRANSLATIONS } from '../data/translations';

interface ProfileDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: MatrimonyProfile | null;
  lang: Language;
  isShortlisted: boolean;
  onToggleShortlist: (id: string) => void;
  isInterestSent: boolean;
  onSendInterest: (id: string) => void;
  onOpenKundaliMatch: (profile: MatrimonyProfile) => void;
  onOpenBiodata: (profile: MatrimonyProfile) => void;
  onOpenMessenger: (profile: MatrimonyProfile) => void;
  onOpenVideo?: (profile: MatrimonyProfile) => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  isOpen,
  onClose,
  profile,
  lang,
  isShortlisted,
  onToggleShortlist,
  isInterestSent,
  onSendInterest,
  onOpenKundaliMatch,
  onOpenBiodata,
  onOpenMessenger,
  onOpenVideo
}) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<'about' | 'family' | 'horoscope' | 'partner'>('about');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [showPhoneContact, setShowPhoneContact] = useState(false);

  if (!isOpen || !profile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-2 border-amber-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-red-900 via-rose-950 to-amber-900 p-4 sm:p-5 text-white flex items-center justify-between border-b border-amber-400/40">
          <div className="flex items-center gap-3">
            <span className="font-royal font-bold text-lg sm:text-xl text-amber-200">
              {profile.nameHindi} ({profile.id})
            </span>
            <span className="bg-emerald-500/80 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% सत्यापित</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleShortlist(profile.id)}
              className={`p-2 rounded-xl transition ${
                isShortlisted ? 'bg-rose-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title="शॉर्टलिस्ट करें"
            >
              <Heart className={`w-5 h-5 ${isShortlisted ? 'fill-white' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6 bg-gradient-to-b from-amber-50/20 to-white">
          {/* Top Quick Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-sm">
            {/* Photos Column */}
            <div className="md:col-span-4 space-y-3">
              <img
                src={profile.photos[selectedPhotoIndex]}
                alt={profile.name}
                className="w-full h-72 sm:h-80 object-cover rounded-2xl border-2 border-amber-300 shadow-md"
              />
              {profile.photos.length > 1 && (
                <div className="flex gap-2 justify-center">
                  {profile.photos.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition ${
                        selectedPhotoIndex === idx ? 'border-amber-600 ring-2 ring-amber-300' : 'border-stone-200 opacity-70'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Summary Column */}
            <div className="md:col-span-8 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-2xl font-black font-royal text-red-950">
                    {profile.nameHindi}
                  </h2>
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black text-xs px-3 py-1 rounded-xl shadow flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-red-950" />
                    <span>36 गुण मिलान: {profile.defaultMatchGunaScore} गुण</span>
                  </div>
                </div>

                <p className="text-sm text-stone-600 font-medium">
                  {profile.age} वर्ष | {profile.height} | {profile.subcasteHindi} वैश्य
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-xs">
                  <div className="bg-amber-50/70 border border-amber-200 p-2 rounded-xl">
                    <span className="text-stone-500 block">गोत्र:</span>
                    <strong className="text-stone-900">{profile.gotra}</strong>
                  </div>
                  <div className="bg-amber-50/70 border border-amber-200 p-2 rounded-xl">
                    <span className="text-stone-500 block">राशि:</span>
                    <strong className="text-stone-900">{profile.rashi}</strong>
                  </div>
                  <div className="bg-amber-50/70 border border-amber-200 p-2 rounded-xl">
                    <span className="text-stone-500 block">मांगलिक:</span>
                    <strong className={profile.manglik === 'Non-Manglik' ? 'text-emerald-700' : 'text-rose-700'}>
                      {profile.manglikHindi}
                    </strong>
                  </div>
                  <div className="bg-amber-50/70 border border-amber-200 p-2 rounded-xl">
                    <span className="text-stone-500 block">पेशा:</span>
                    <strong className="text-stone-900">{profile.profession}</strong>
                  </div>
                  <div className="bg-amber-50/70 border border-amber-200 p-2 rounded-xl">
                    <span className="text-stone-500 block">वार्षिक आय:</span>
                    <strong className="text-amber-800 font-bold">{profile.income}</strong>
                  </div>
                  <div className="bg-amber-50/70 border border-amber-200 p-2 rounded-xl">
                    <span className="text-stone-500 block">शहर:</span>
                    <strong className="text-stone-900">{profile.city}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="space-y-2 pt-4 border-t border-stone-200">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => onSendInterest(profile.id)}
                    disabled={isInterestSent}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition shadow-md ${
                      isInterestSent
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-gradient-to-r from-red-800 to-rose-900 text-amber-200 hover:brightness-110'
                    }`}
                  >
                    {isInterestSent ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>{t.interestSent}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-amber-300" />
                        <span>{t.sendInterest}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onOpenKundaliMatch(profile)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 transition shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>36 गुण मिलान</span>
                  </button>

                  <button
                    onClick={() => onOpenBiodata(profile)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 transition"
                  >
                    <FileText className="w-4 h-4 text-amber-700" />
                    <span>बायोडाटा</span>
                  </button>

                  {onOpenVideo && (
                    <button
                      onClick={() => onOpenVideo(profile)}
                      className="col-span-2 sm:col-span-3 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-red-800 to-rose-900 text-amber-200 hover:brightness-110 transition shadow-md border border-amber-400/40"
                    >
                      <Film className="w-4 h-4 text-amber-300" />
                      <span>वीडियो परिचय देखें व MP4 डाउनलोड करें (Watch & Download Video)</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => onOpenMessenger(profile)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>मैसेंजर पर संदेश भेजें</span>
                  </button>

                  <button
                    onClick={() => setShowPhoneContact(!showPhoneContact)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-stone-900 text-amber-200 hover:bg-black transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>{showPhoneContact ? '+91 98765-43210 (सत्यापित)' : 'परिवार का नंबर देखें'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-stone-200 gap-2 sm:gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-2.5 px-2 text-xs sm:text-sm font-bold transition border-b-2 whitespace-nowrap ${
                activeTab === 'about'
                  ? 'border-red-900 text-red-950'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              परिचय एवं जीवनशैली
            </button>
            <button
              onClick={() => setActiveTab('family')}
              className={`pb-2.5 px-2 text-xs sm:text-sm font-bold transition border-b-2 whitespace-nowrap ${
                activeTab === 'family'
                  ? 'border-red-900 text-red-950'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              पारिवारिक पृष्ठभूमि
            </button>
            <button
              onClick={() => setActiveTab('horoscope')}
              className={`pb-2.5 px-2 text-xs sm:text-sm font-bold transition border-b-2 whitespace-nowrap ${
                activeTab === 'horoscope'
                  ? 'border-red-900 text-red-950'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              कुंडली एवं पंचांग विवरण
            </button>
            <button
              onClick={() => setActiveTab('partner')}
              className={`pb-2.5 px-2 text-xs sm:text-sm font-bold transition border-b-2 whitespace-nowrap ${
                activeTab === 'partner'
                  ? 'border-red-900 text-red-950'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              अपेक्षित जीवनसाथी
            </button>
          </div>

          {/* Tab Contents */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            {activeTab === 'about' && (
              <div className="space-y-4 text-xs sm:text-sm text-stone-800 leading-relaxed">
                <div>
                  <h4 className="font-bold text-red-950 mb-1.5 font-royal">मेरे बारे में (About):</h4>
                  <p className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/80">
                    {profile.aboutMeHindi}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <h5 className="font-bold text-stone-900 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-amber-700" />
                      <span>शिक्षा (Education):</span>
                    </h5>
                    <p className="text-stone-700 font-medium pl-6">{profile.education}</p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-bold text-stone-900 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-amber-700" />
                      <span>कार्यक्षेत्र (Career):</span>
                    </h5>
                    <p className="text-stone-700 font-medium pl-6">
                      {profile.profession} at {profile.company} (आय: {profile.income})
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'family' && (
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block">पिताजी का पेशा:</span>
                    <strong className="text-stone-900">{profile.family.fatherProfession}</strong>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block">माताजी का पेशा:</span>
                    <strong className="text-stone-900">{profile.family.motherProfession}</strong>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block">भाई (Brothers):</span>
                    <strong className="text-stone-900">{profile.family.brothers}</strong>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block">बहनें (Sisters):</span>
                    <strong className="text-stone-900">{profile.family.sisters}</strong>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block">पारिवारिक स्थिति:</span>
                    <strong className="text-stone-900">{profile.family.familyStatus}</strong>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block">मूल निवास स्थान:</span>
                    <strong className="text-stone-900">{profile.family.familyOrigin}</strong>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'horoscope' && (
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block">गोत्र:</span>
                    <strong className="text-stone-900">{profile.gotra}</strong>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block">मातृगोत्र:</span>
                    <strong className="text-stone-900">{profile.motherGotra}</strong>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block">राशि:</span>
                    <strong className="text-stone-900">{profile.rashi}</strong>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block">नक्षत्र:</span>
                    <strong className="text-stone-900">{profile.nakshatra}</strong>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-amber-950 block">एआई कुंडली मिलान स्कोर:</span>
                    <span className="text-xs text-amber-800">
                      सामान्य प्रोफाइल के साथ औसत गुण मिलान {profile.defaultMatchGunaScore} / 36 है।
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenKundaliMatch(profile)}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow transition"
                  >
                    विस्तृत मिलान देखें
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'partner' && (
              <div className="space-y-3 text-xs sm:text-sm">
                <h4 className="font-bold text-red-950 font-royal">अपेक्षित जीवनसाथी विवरण:</h4>
                <p className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 text-stone-800 leading-relaxed font-medium">
                  {profile.partnerExpectationsHindi}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
