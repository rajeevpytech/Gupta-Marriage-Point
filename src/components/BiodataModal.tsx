import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Sparkles, 
  Download, 
  Share2, 
  CheckCircle2, 
  Award,
  Phone,
  Mail,
  Film
} from 'lucide-react';
import { MatrimonyProfile } from '../types/matrimony';
import { Language } from '../data/translations';

interface BiodataModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: MatrimonyProfile | null;
  lang: Language;
  onOpenVideo?: (profile: MatrimonyProfile) => void;
}

export const BiodataModal: React.FC<BiodataModalProps> = ({
  isOpen,
  onClose,
  profile,
  lang,
  onOpenVideo
}) => {
  const [isAiEnhancing, setIsAiEnhancing] = useState(false);
  const [aiEnhancedSummary, setAiEnhancedSummary] = useState<string | null>(null);

  if (!isOpen || !profile) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleEnhanceBioWithAi = async () => {
    setIsAiEnhancing(true);
    try {
      const res = await fetch('/api/ai/enhance-biodata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.nameHindi,
          education: profile.education,
          profession: profile.profession,
          familyDetails: `${profile.family.familyStatus}, ${profile.family.familyOrigin}`
        })
      });
      const data = await res.json();
      setAiEnhancedSummary(data.summaryHindi || data.summaryEnglish);
    } catch (e) {
      console.error(e);
      setAiEnhancedSummary('आधुनिक विचारों और पारंपरिक पारिवारिक संस्कारों का सुंदर मेल। परिवार के प्रति समर्पित एवं सुसंस्कृत व्यक्तित्व।');
    } finally {
      setIsAiEnhancing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Control Bar (Hidden in Print) */}
        <div className="no-print bg-stone-900 text-amber-200 px-5 py-3 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-royal font-bold text-sm sm:text-base">
              डिजिटल विवाह बायोडाटा (Marriage Bio-Data)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenVideo && (
              <button
                onClick={() => onOpenVideo(profile)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-red-700 to-rose-700 hover:brightness-110 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow transition border border-amber-300"
                title="वीडियो परिचय व वीडियो बायोडाटा डाउनलोड करें"
              >
                <Film className="w-3.5 h-3.5 text-amber-300" />
                <span>वीडियो डाउनलोड (MP4)</span>
              </button>
            )}

            <button
              onClick={handleEnhanceBioWithAi}
              disabled={isAiEnhancing}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold px-3 py-1.5 rounded-xl text-xs shadow transition"
              title="एआई द्वारा बायोडाटा परिष्कृत करें"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAiEnhancing ? 'animate-spin' : ''}`} />
              <span>{isAiEnhancing ? 'एआई जनरेट कर रहा...' : 'AI बायो संवारें'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1 bg-red-800 hover:bg-red-700 text-white font-semibold px-3 py-1.5 rounded-xl text-xs shadow transition"
            >
              <Printer className="w-3.5 h-3.5" />
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

        {/* Traditional Auspicious Biodata Sheet (Printable Canvas) */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-[#FFFDF9] space-y-6 text-stone-900 font-sans border-8 border-double border-amber-600/30 m-2 sm:m-4 rounded-2xl relative shadow-inner">
          {/* Traditional Ganesh Vandana Shloka */}
          <div className="text-center space-y-1.5 border-b-2 border-amber-500/30 pb-4">
            <div className="text-red-900 font-royal font-bold text-lg sm:text-2xl tracking-widest">
              ॥ श्री गणेशाय नमः ॥
            </div>
            <p className="text-xs text-amber-800 italic font-serif">
              वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
            </p>
            <div className="inline-block bg-amber-100/80 text-red-900 border border-amber-400/50 px-4 py-1 rounded-full text-xs font-bold font-royal uppercase tracking-wider mt-1">
              वैवाहिक बायोडाटा | गुप्ता मैरिज पॉइंट
            </div>
          </div>

          {/* Profile Photo & Primary Stats Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 p-4 sm:p-6 rounded-2xl border border-amber-200">
            <img
              src={profile.photos[0]}
              alt={profile.name}
              className="w-28 h-36 sm:w-36 sm:h-44 object-cover rounded-xl border-4 border-amber-400 shadow-md"
            />
            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <h2 className="text-xl sm:text-2xl font-black font-royal text-red-950">
                {profile.nameHindi}
              </h2>
              <p className="text-sm font-semibold text-stone-700">
                {profile.name}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs">
                <span className="bg-amber-200 text-amber-950 font-bold px-2 py-0.5 rounded">
                  उपजाति: {profile.subcasteHindi}
                </span>
                <span className="bg-white border border-stone-300 px-2 py-0.5 rounded font-medium">
                  उम्र: {profile.age} वर्ष
                </span>
                <span className="bg-white border border-stone-300 px-2 py-0.5 rounded font-medium">
                  कद: {profile.height}
                </span>
                <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded border border-emerald-300">
                  100% सत्यापित
                </span>
              </div>
              <p className="text-xs text-stone-600 font-medium pt-1">
                मूल निवास: {profile.nativePlace} | वर्तमान निवास: {profile.city}, {profile.state}
              </p>
            </div>
          </div>

          {/* AI Enhanced Profile Summary */}
          {aiEnhancedSummary && (
            <div className="bg-amber-50 p-4 rounded-xl border-l-4 border-amber-500 text-xs sm:text-sm text-stone-800 space-y-1">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>एआई परिष्कृत परिचय (AI Enhanced Bio):</span>
              </div>
              <p className="italic leading-relaxed">{aiEnhancedSummary}</p>
            </div>
          )}

          {/* Section: Astrological & Kundali Details */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold font-royal text-red-900 border-b border-amber-300 pb-1 flex items-center gap-1.5">
              <span>१. जन्म कुंडली एवं धार्मिक विवरण (Horoscope Details)</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white p-3 rounded-xl border border-stone-200">
              <div>
                <span className="text-stone-500 block">गोत्र (Gotra):</span>
                <strong className="text-stone-900">{profile.gotra}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">ननिहाल गोत्र:</span>
                <strong className="text-stone-900">{profile.motherGotra}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">राशि (Rashi):</span>
                <strong className="text-stone-900">{profile.rashi}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">नक्षत्र:</span>
                <strong className="text-stone-900">{profile.nakshatra}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">मांगलिक स्थिति:</span>
                <strong className={profile.manglik === 'Non-Manglik' ? 'text-emerald-700' : 'text-rose-700'}>
                  {profile.manglikHindi}
                </strong>
              </div>
              <div>
                <span className="text-stone-500 block">वैवाहिक स्थिति:</span>
                <strong className="text-stone-900">{profile.maritalStatusHindi}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">खानपान:</span>
                <strong className="text-stone-900">{profile.diet}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">धर्म / समुदाय:</span>
                <strong className="text-stone-900">सनातन हिंदू (वैश्य समाज)</strong>
              </div>
            </div>
          </div>

          {/* Section: Education & Career */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold font-royal text-red-900 border-b border-amber-300 pb-1 flex items-center gap-1.5">
              <span>२. शैक्षणिक एवं व्यावसायिक विवरण (Education & Career)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-stone-200">
              <div>
                <span className="text-stone-500 block">उच्चतम शैक्षणिक योग्यता:</span>
                <strong className="text-stone-900">{profile.education}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">पद एवं पेशा (Profession):</span>
                <strong className="text-stone-900">{profile.profession}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">कंपनी / कार्यस्थल:</span>
                <strong className="text-stone-900">{profile.company}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">वार्षिक आय (Annual Income):</span>
                <strong className="text-amber-800 font-bold">{profile.income}</strong>
              </div>
            </div>
          </div>

          {/* Section: Family Background */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold font-royal text-red-900 border-b border-amber-300 pb-1 flex items-center gap-1.5">
              <span>३. पारिवारिक विवरण (Family Background)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-stone-200">
              <div>
                <span className="text-stone-500 block">पिताजी का विवरण:</span>
                <strong className="text-stone-900">{profile.family.fatherProfession}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">माताजी का विवरण:</span>
                <strong className="text-stone-900">{profile.family.motherProfession}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">भाई (Brothers):</span>
                <strong className="text-stone-900">{profile.family.brothers}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">बहनें (Sisters):</span>
                <strong className="text-stone-900">{profile.family.sisters}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">पारिवारिक प्रतिष्ठा:</span>
                <strong className="text-stone-900">{profile.family.familyStatus}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">पारिवारिक स्वरूप:</span>
                <strong className="text-stone-900">{profile.family.familyType}</strong>
              </div>
            </div>
          </div>

          {/* Section: Partner Expectations */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold font-royal text-red-900 border-b border-amber-300 pb-1 flex items-center gap-1.5">
              <span>४. अपेक्षित जीवनसाथी (Partner Expectations)</span>
            </h3>
            <p className="text-xs bg-white p-3 rounded-xl border border-stone-200 text-stone-700 leading-relaxed font-medium">
              {profile.partnerExpectationsHindi}
            </p>
          </div>

          {/* Official Verification Watermark Footer */}
          <div className="pt-4 border-t-2 border-amber-500/30 flex flex-col sm:flex-row items-center justify-between text-stone-500 text-[11px] gap-2">
            <div className="flex items-center gap-1 text-emerald-800 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>गुप्ता मैरिज पॉइंट द्वारा आधार एवं परिवार सत्यापित रिकॉर्ड</span>
            </div>
            <div className="font-mono text-stone-600">
              रजिस्ट्रेशन आईडी: {profile.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
