import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  CheckCircle, 
  Heart, 
  Flame, 
  Compass, 
  BookOpen, 
  Printer, 
  Share2, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { MatrimonyProfile, AiMatchAnalysisResult } from '../types/matrimony';
import { Language, TRANSLATIONS } from '../data/translations';

interface AiMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  profiles: MatrimonyProfile[];
  initialProfileA?: MatrimonyProfile;
  initialProfileB?: MatrimonyProfile;
}

export const AiMatchModal: React.FC<AiMatchModalProps> = ({
  isOpen,
  onClose,
  lang,
  profiles,
  initialProfileA,
  initialProfileB
}) => {
  const t = TRANSLATIONS[lang];

  // Candidates selection
  const grooms = profiles.filter(p => p.gender === 'male');
  const brides = profiles.filter(p => p.gender === 'female');

  const [selectedGroom, setSelectedGroom] = useState<MatrimonyProfile>(
    (initialProfileA?.gender === 'male' ? initialProfileA : initialProfileB?.gender === 'male' ? initialProfileB : grooms[0]) || grooms[0]
  );
  const [selectedBride, setSelectedBride] = useState<MatrimonyProfile>(
    (initialProfileA?.gender === 'female' ? initialProfileA : initialProfileB?.gender === 'female' ? initialProfileB : brides[0]) || brides[0]
  );

  const [isLoading, setIsLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<AiMatchAnalysisResult | null>(null);

  if (!isOpen) return null;

  const runMatchAnalysis = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/match-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileA: selectedGroom,
          profileB: selectedBride
        })
      });

      const data = await res.json();
      setMatchResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger analysis when modal opens or candidates change
  useEffect(() => {
    if (isOpen && !matchResult && !isLoading) {
      runMatchAnalysis();
    }
  }, [isOpen]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-2 border-amber-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-red-900 via-rose-950 to-amber-900 p-4 sm:p-5 text-white flex items-center justify-between border-b border-amber-400/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-stone-950 flex items-center justify-center shadow-lg font-bold">
              <Sparkles className="w-5 h-5 text-red-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold font-royal text-amber-200">
                  {t.gunaMatchTitle}
                </h3>
                <span className="bg-gradient-to-r from-blue-900/60 to-amber-900/60 text-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-400/40 flex items-center gap-1">
                  <span className="flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  </span>
                  <span>Google Gemini 3.8 Flash Engine</span>
                </span>
              </div>
              <p className="text-xs text-amber-100/80">
                अष्टकूट 36 गुण मिलान, मांगलिक विचार एवं आधुनिक जीवनशैली कम्पैटिबिलिटी
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1 bg-white/10 hover:bg-white/20 text-amber-200 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
              title="प्रिंट या पीडीएफ सेव करें"
            >
              <Printer className="w-4 h-4" />
              <span>प्रिंट / PDF</span>
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
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-gradient-to-b from-amber-50/30 via-white to-amber-50/20">
          {/* Profiles Comparison Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-amber-200 shadow-sm relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex w-10 h-10 rounded-full bg-red-900 text-amber-300 border-2 border-amber-400 items-center justify-center font-bold z-10 shadow-md">
              <Heart className="w-5 h-5 fill-amber-300" />
            </div>

            {/* Groom Selection */}
            <div className="space-y-3 bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded">
                  वर (Groom)
                </span>
                <select
                  value={selectedGroom.id}
                  onChange={(e) => {
                    const p = grooms.find(g => g.id === e.target.value);
                    if (p) setSelectedGroom(p);
                  }}
                  className="text-xs bg-white border border-stone-300 rounded-lg px-2 py-1 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {grooms.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.nameHindi} ({g.subcasteHindi})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={selectedGroom.photos[0]}
                  alt={selectedGroom.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-300 shadow"
                />
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">{selectedGroom.nameHindi}</h4>
                  <p className="text-xs text-stone-600">{selectedGroom.age} वर्ष | {selectedGroom.height}</p>
                  <p className="text-xs font-medium text-amber-800">{selectedGroom.profession}</p>
                  <p className="text-[11px] text-stone-500">गोत्र: {selectedGroom.gotra} | राशि: {selectedGroom.rashi}</p>
                </div>
              </div>
            </div>

            {/* Bride Selection */}
            <div className="space-y-3 bg-rose-50/50 p-3.5 rounded-xl border border-rose-200/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-900 bg-rose-200/60 px-2 py-0.5 rounded">
                  कन्या / वधू (Bride)
                </span>
                <select
                  value={selectedBride.id}
                  onChange={(e) => {
                    const p = brides.find(b => b.id === e.target.value);
                    if (p) setSelectedBride(p);
                  }}
                  className="text-xs bg-white border border-stone-300 rounded-lg px-2 py-1 text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  {brides.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.nameHindi} ({b.subcasteHindi})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={selectedBride.photos[0]}
                  alt={selectedBride.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-300 shadow"
                />
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">{selectedBride.nameHindi}</h4>
                  <p className="text-xs text-stone-600">{selectedBride.age} वर्ष | {selectedBride.height}</p>
                  <p className="text-xs font-medium text-rose-800">{selectedBride.profession}</p>
                  <p className="text-[11px] text-stone-500">गोत्र: {selectedBride.gotra} | राशि: {selectedBride.rashi}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recalculate Button */}
          <div className="flex justify-center">
            <button
              onClick={runMatchAnalysis}
              disabled={isLoading}
              className="bg-gradient-to-r from-red-800 to-rose-800 hover:from-red-900 hover:to-black text-amber-200 font-bold px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 text-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>एआई मिलान पुनः विश्लेषण करें</span>
            </button>
          </div>

          {/* Loading Shimmer */}
          {isLoading && (
            <div className="p-8 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-3 gold-shimmer">
              <Sparkles className="w-8 h-8 text-amber-700 mx-auto animate-spin" />
              <h4 className="font-royal font-bold text-amber-950 text-base">
                कुंडली चक्र, अष्टकूट 36 गुण एवं नक्षत्र मैत्री का विश्लेषण जारी है...
              </h4>
              <p className="text-xs text-amber-800">
                वैदिक ज्योतिष शास्त्र एवं आधुनिक व्यक्तित्व सामंजस्य का समग्र मूल्यांकन
              </p>
            </div>
          )}

          {/* Match Analysis Results */}
          {matchResult && !isLoading && (
            <div className="space-y-6">
              {/* Grand Score Display */}
              <div className="bg-gradient-to-br from-red-950 via-rose-900 to-amber-900 rounded-3xl p-6 text-white text-center shadow-xl border-2 border-amber-400 relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                  <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-amber-300" />
                    <span>वैदिक अष्टकूट मिलान परिणाम</span>
                  </div>

                  <div className="flex items-center justify-center gap-3 my-2">
                    <span className="font-royal text-5xl sm:text-6xl font-black text-amber-300 drop-shadow-md">
                      {matchResult.totalGunaScore}
                    </span>
                    <span className="text-2xl text-amber-100/70 font-light">
                      / 36 गुण
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-royal text-amber-200">
                    {matchResult.verdictHindi}
                  </h3>

                  <div className="flex flex-wrap justify-center gap-4 pt-3 text-xs">
                    <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10">
                      आधुनिक कम्पैटिबिलिटी: <strong className="text-amber-300">{matchResult.modernCompatibilityScore}%</strong>
                    </span>
                    <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10">
                      मांगलिक स्थिति: <strong className="text-emerald-300">{matchResult.manglikCompatibility.status}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* 36 Guna Milan Table */}
              <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
                <div className="bg-amber-100/70 px-4 py-3 border-b border-amber-200 flex items-center justify-between">
                  <h4 className="font-bold text-amber-950 text-sm flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-800" />
                    <span>अष्टकूट 36 गुण विवरण (Ashtakoot Breakdown)</span>
                  </h4>
                  <span className="text-xs font-semibold text-amber-800">
                    न्यूनतम 18 गुण शुभ माने जाते हैं
                  </span>
                </div>

                <div className="divide-y divide-stone-100 text-xs sm:text-sm">
                  <div className="grid grid-cols-12 bg-stone-50 p-2.5 font-bold text-stone-600">
                    <div className="col-span-4 sm:col-span-3">कूट (Guna Name)</div>
                    <div className="col-span-3 sm:col-span-2 text-center">प्राप्त / अधिकतम</div>
                    <div className="col-span-5 sm:col-span-7">महत्व एवं प्रभाव (Significance)</div>
                  </div>

                  {matchResult.gunaBreakdown?.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 p-3 items-center hover:bg-amber-50/40 transition">
                      <div className="col-span-4 sm:col-span-3 font-semibold text-stone-900">
                        {item.name}
                      </div>
                      <div className="col-span-3 sm:col-span-2 text-center font-bold">
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {item.points} / {item.max}
                        </span>
                      </div>
                      <div className="col-span-5 sm:col-span-7 text-stone-600 text-xs">
                        {item.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manglik & Astrological Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200 space-y-2">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                    <Flame className="w-4 h-4 text-rose-600" />
                    <span>मांगलिक विचार (Manglik Dosha Analysis)</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed font-medium">
                    {matchResult.manglikCompatibility.analysis}
                  </p>
                </div>

                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <Compass className="w-4 h-4 text-amber-700" />
                    <span>पंडित जी का शुभाशीष व मंत्र</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed italic font-medium">
                    "{matchResult.panditJiBlessing}"
                  </p>
                </div>
              </div>

              {/* Modern Compatibility Highlights */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>एआई द्वारा पहचाने गए मुख्य सामंजस्य बिंदु (Compatibility Highlights)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {matchResult.keyHighlights?.map((hl, i) => (
                    <div key={i} className="bg-emerald-50/60 border border-emerald-200 text-emerald-950 p-2.5 rounded-xl font-medium">
                      ✓ {hl}
                    </div>
                  ))}
                </div>
              </div>

              {/* Conversation Starters for First Family Meeting */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-2">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-600" />
                  <span>प्रथम पारिवारिक बैठक के लिए सुझाव (Discussion Starters)</span>
                </h4>
                <div className="space-y-1.5 text-xs text-stone-700">
                  {matchResult.conversationStarters?.map((cs, i) => (
                    <div key={i} className="flex items-center gap-2 bg-stone-50 p-2 rounded-lg border border-stone-200">
                      <span className="w-5 h-5 rounded-full bg-red-100 text-red-800 font-bold flex items-center justify-center text-[10px]">
                        {i + 1}
                      </span>
                      <span>{cs}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
