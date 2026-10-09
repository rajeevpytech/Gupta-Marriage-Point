import React from 'react';
import { 
  PhoneCall, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Clock, 
  Mail 
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';

interface FooterProps {
  lang: Language;
  onOpenVoiceAssistant: () => void;
  onOpenAiMatch: () => void;
  onOpenMembership: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onOpenVoiceAssistant,
  onOpenAiMatch,
  onOpenMembership
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <footer className="bg-gradient-to-b from-stone-950 to-black text-amber-100/90 pt-12 pb-8 px-4 sm:px-6 border-t-4 border-amber-600/40">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs sm:text-sm">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-800 to-amber-700 text-amber-300 flex items-center justify-center font-bold font-royal border border-amber-400">
                GM
              </div>
              <span className="font-royal font-bold text-lg text-amber-200">
                {t.siteTitle}
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              वैश्य, गुप्ता, अग्रवाल, मित्तल, खंडेलवाल एवं समाज के सभी कुलीन परिवारों के लिए समर्पित भारत का सर्वोत्तम एआई मैट्रिमोनी मंच।
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% डेटा गोपनीयता एवं सुरक्षा</span>
            </div>
          </div>

          {/* Quick AI Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-amber-300 font-royal uppercase tracking-wider text-xs">
              एआई मैट्रिमोनी फीचर्स
            </h4>
            <ul className="space-y-1.5 text-stone-300 text-xs">
              <li>
                <button onClick={onOpenVoiceAssistant} className="hover:text-amber-300 transition flex items-center gap-1">
                  <span>• गुप्ता जी वॉयस असिस्टेंट</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenAiMatch} className="hover:text-amber-300 transition flex items-center gap-1">
                  <span>• 36 गुण एआई कुंडली मिलान</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenMembership} className="hover:text-amber-300 transition flex items-center gap-1">
                  <span>• रॉयल वीआईपी सदस्यता</span>
                </button>
              </li>
              <li className="hover:text-amber-300 cursor-pointer">
                • डिजिटल विवाह बायोडाटा जनरेटर
              </li>
              <li className="hover:text-amber-300 cursor-pointer">
                • मांगलिक दोष विचार एवं उपाय
              </li>
            </ul>
          </div>

          {/* Community Subcastes */}
          <div className="space-y-2">
            <h4 className="font-bold text-amber-300 font-royal uppercase tracking-wider text-xs">
              समाज वैवाहिक वर्ग
            </h4>
            <div className="grid grid-cols-2 gap-1 text-stone-300 text-xs">
              <span className="hover:text-amber-300 cursor-pointer">• गुप्ता समाज रिश्ते</span>
              <span className="hover:text-amber-300 cursor-pointer">• अग्रवाल रिश्ते</span>
              <span className="hover:text-amber-300 cursor-pointer">• मित्तल रिश्ते</span>
              <span className="hover:text-amber-300 cursor-pointer">• खंडेलवाल रिश्ते</span>
              <span className="hover:text-amber-300 cursor-pointer">• रौनियार वैश्य</span>
              <span className="hover:text-amber-300 cursor-pointer">• महाजन समाज</span>
              <span className="hover:text-amber-300 cursor-pointer">• कंसल एवं गोयल</span>
              <span className="hover:text-amber-300 cursor-pointer">• जिंदल एवं बंसल</span>
            </div>
          </div>

          {/* Helpline & Office */}
          <div className="space-y-2">
            <h4 className="font-bold text-amber-300 font-royal uppercase tracking-wider text-xs">
              हेल्पलाइन व प्रधान कार्यालय
            </h4>
            <div className="space-y-2 text-stone-300 text-xs">
              <div className="flex items-start gap-2">
                <PhoneCall className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">1800-208-GUPTA (टोल फ्री)</span>
                  <span className="text-stone-400">+91 98765-43210 (व्हाट्सएप)</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>प्रातः 09:00 से रात्रि 08:00 (सातों दिन)</span>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>गुप्ता टावर, कनाट प्लेस, नई दिल्ली - 110001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
          <p>© 2026 गुप्ता मैरिज पॉइंट (Gupta Marriage Point). सर्वाधिकार सुरक्षित।</p>
          <p className="flex items-center gap-1 text-stone-400">
            <span>निष्ठा एवं संस्कार से समर्पित</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>वैश्य समाज मैट्रिमोनी</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
