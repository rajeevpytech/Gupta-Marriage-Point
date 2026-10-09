import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  Send, 
  Check, 
  FileText, 
  ShieldCheck, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  MessageCircle,
  Phone,
  ChevronLeft,
  ChevronRight,
  Film
} from 'lucide-react';
import { MatrimonyProfile } from '../types/matrimony';
import { Language, TRANSLATIONS } from '../data/translations';

interface ProfileCardProps {
  profile: MatrimonyProfile;
  lang: Language;
  isShortlisted: boolean;
  onToggleShortlist: (id: string) => void;
  isInterestSent: boolean;
  onSendInterest: (id: string) => void;
  onOpenKundaliMatch: (profile: MatrimonyProfile) => void;
  onOpenBiodata: (profile: MatrimonyProfile) => void;
  onOpenDetail: (profile: MatrimonyProfile) => void;
  onOpenMessenger: (profile: MatrimonyProfile) => void;
  onOpenVideo: (profile: MatrimonyProfile) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  lang,
  isShortlisted,
  onToggleShortlist,
  isInterestSent,
  onSendInterest,
  onOpenKundaliMatch,
  onOpenBiodata,
  onOpenDetail,
  onOpenMessenger,
  onOpenVideo
}) => {
  const t = TRANSLATIONS[lang];
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev + 1) % profile.photos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev - 1 + profile.photos.length) % profile.photos.length);
  };

  return (
    <div className="bg-white rounded-3xl border border-amber-200/90 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group relative">
      {/* Top Banner Tags */}
      <div className="relative">
        <div 
          className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-900 cursor-pointer"
          onClick={() => onOpenDetail(profile)}
        >
          <img
            src={profile.photos[activePhotoIndex]}
            alt={profile.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* Photo Navigation if multiple */}
          {profile.photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Verification Badge */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            <span className="flex items-center gap-1 bg-emerald-600/95 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md backdrop-blur-xs">
              <ShieldCheck className="w-3 h-3" />
              <span>100% आधार सत्यापित</span>
            </span>
            <span className="bg-amber-900/90 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md backdrop-blur-xs">
              {profile.subcasteHindi} समाज
            </span>
            <span className="bg-white/95 text-stone-900 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md backdrop-blur-xs flex items-center gap-1 border border-stone-200">
              <span className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </span>
              <span>Google Gemini AI Match</span>
            </span>
          </div>

          {/* Shortlist Heart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleShortlist(profile.id);
            }}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition transform active:scale-90 z-10 ${
              isShortlisted
                ? 'bg-rose-600 text-white'
                : 'bg-white/80 hover:bg-white text-stone-700 hover:text-rose-600'
            }`}
            title="शॉर्टलिस्ट करें"
          >
            <Heart className={`w-5 h-5 ${isShortlisted ? 'fill-white' : ''}`} />
          </button>

          {/* Video Profile & Download Floating Badge */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenVideo(profile);
            }}
            className="absolute bottom-16 right-3 bg-red-900/90 hover:bg-red-800 text-amber-200 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-lg backdrop-blur-xs transition transform hover:scale-105 border border-amber-400/40 z-10"
            title="वीडियो परिचय देखें व डाउनलोड करें"
          >
            <Film className="w-3.5 h-3.5 text-amber-300" />
            <span>वीडियो परिचय</span>
          </button>

          {/* Bottom Card Image Overlay Stats */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <div className="flex items-baseline justify-between">
              <div>
                <h3 className="font-bold text-lg sm:text-xl font-royal text-amber-100 flex items-center gap-1.5">
                  <span>{lang === 'hi' ? profile.nameHindi : profile.name}</span>
                  <span className="text-xs bg-emerald-500/80 text-white px-1.5 py-0.2 rounded font-sans">
                    ✓
                  </span>
                </h3>
                <p className="text-xs text-stone-200 font-medium">
                  {profile.age} वर्ष, {profile.height} | {profile.maritalStatusHindi}
                </p>
              </div>

              {/* Guna Milan Quick Badge */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenKundaliMatch(profile);
                }}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black text-xs px-2.5 py-1 rounded-xl shadow-md cursor-pointer hover:brightness-110 flex items-center gap-1"
                title="क्लिक करके 36 गुण मिलान देखें"
              >
                <Sparkles className="w-3.5 h-3.5 text-red-950" />
                <span>{profile.defaultMatchGunaScore}/36 गुण</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-gradient-to-b from-white to-amber-50/20">
        <div className="space-y-2 text-xs text-stone-700">
          {/* Profession & Company */}
          <div className="flex items-start gap-2">
            <Briefcase className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-stone-900">{profile.profession}</span>
              <span className="text-stone-500"> ({profile.company})</span>
            </div>
          </div>

          {/* Education */}
          <div className="flex items-start gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
            <div className="line-clamp-1 font-medium text-stone-800">
              {profile.education}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="text-stone-800 font-medium">
              {profile.city}, {profile.state} (मूल: {profile.nativePlace})
            </span>
          </div>

          {/* Gotra & Manglik Status Pill Grid */}
          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
            <div className="bg-stone-50 border border-stone-200 px-2 py-1 rounded-lg">
              <span className="text-stone-500">गोत्र: </span>
              <strong className="text-stone-900">{profile.gotra}</strong>
            </div>
            <div className="bg-stone-50 border border-stone-200 px-2 py-1 rounded-lg">
              <span className="text-stone-500">वार्षिक आय: </span>
              <strong className="text-amber-800">{profile.income}</strong>
            </div>
            <div className="bg-stone-50 border border-stone-200 px-2 py-1 rounded-lg">
              <span className="text-stone-500">राशि: </span>
              <strong className="text-stone-900">{profile.rashi}</strong>
            </div>
            <div className="bg-stone-50 border border-stone-200 px-2 py-1 rounded-lg">
              <span className="text-stone-500">मांगलिक: </span>
              <strong className={profile.manglik === 'Non-Manglik' ? 'text-emerald-700' : 'text-rose-700'}>
                {profile.manglikHindi}
              </strong>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="pt-2 border-t border-amber-200/60 space-y-2">
          {/* Primary Connect Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSendInterest(profile.id)}
              disabled={isInterestSent}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition shadow-xs ${
                isInterestSent
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-gradient-to-r from-red-800 to-rose-800 hover:from-red-900 hover:to-rose-900 text-white'
              }`}
            >
              {isInterestSent ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t.interestSent}</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t.sendInterest}</span>
                </>
              )}
            </button>

            <button
              onClick={() => onOpenKundaliMatch(profile)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 transition"
              title="एआई 36 गुण मिलान देखें"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>36 गुण मिलान</span>
            </button>
          </div>

          {/* Secondary Actions: Biodata, Video, Chat & Details */}
          <div className="grid grid-cols-4 gap-1.5 text-[11px] font-semibold text-stone-700">
            <button
              onClick={() => onOpenBiodata(profile)}
              className="flex items-center justify-center gap-1 py-1.5 px-1 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 transition"
              title="विवाह बायोडाटा देखें"
            >
              <FileText className="w-3 h-3 text-amber-700" />
              <span>बायोडाटा</span>
            </button>

            <button
              onClick={() => onOpenVideo(profile)}
              className="flex items-center justify-center gap-1 py-1.5 px-1 bg-red-50 hover:bg-red-100 text-red-900 rounded-lg border border-red-200 transition font-bold"
              title="वीडियो परिचय देखें व डाउनलोड करें"
            >
              <Film className="w-3 h-3 text-red-700" />
              <span>वीडियो</span>
            </button>

            <button
              onClick={() => onOpenMessenger(profile)}
              className="flex items-center justify-center gap-1 py-1.5 px-1 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 transition"
              title="परिवार से चैट करें"
            >
              <MessageCircle className="w-3 h-3 text-emerald-600" />
              <span>चैट करें</span>
            </button>

            <button
              onClick={() => onOpenDetail(profile)}
              className="flex items-center justify-center gap-1 py-1.5 px-1 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 transition text-red-900"
            >
              <span>विवरण</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
