import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  PhoneCall, 
  MessageCircle,
  CheckCircle2
} from 'lucide-react';
import { MEMBERSHIP_PLANS } from '../data/profiles';
import { Language } from '../data/translations';

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const MembershipModal: React.FC<MembershipModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  if (!isOpen) return null;

  const [selectedPlanId, setSelectedPlanId] = useState<string>('gold');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSelectPlan = (id: string) => {
    setSelectedPlanId(id);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-2 border-amber-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-rose-950 to-amber-900 p-4 sm:p-6 text-white flex items-center justify-between border-b border-amber-400/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-stone-950 flex items-center justify-center shadow font-bold">
              <Crown className="w-5 h-5 text-red-950" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-royal text-amber-200">
                गुप्ता मैरिज पॉइंट - प्रीमियम सदस्यता योजनाएं
              </h3>
              <p className="text-xs text-amber-100/80">
                सत्यापित परिवारों से सीधा संपर्क एवं एआई सुविधाओं का असीमित लाभ उठाएं
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-gradient-to-b from-amber-50/20 to-white">
          {isSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="font-bold">प्लान सफलतापूर्वक सक्रिय किया गया! आपकी प्रोफाइल अब वीआईपी स्टेटस पर है।</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MEMBERSHIP_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl p-5 border-2 flex flex-col justify-between transition-all ${
                  plan.popular
                    ? 'border-amber-400 bg-gradient-to-b from-amber-50/80 to-white shadow-lg ring-2 ring-amber-300 scale-102'
                    : 'border-stone-200 bg-white hover:border-amber-300 shadow-sm'
                }`}
              >
                <div className="space-y-4">
                  {plan.popular && (
                    <span className="inline-block bg-gradient-to-r from-red-800 to-rose-800 text-amber-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      ★ सर्वाधिक लोकप्रिय
                    </span>
                  )}

                  <div>
                    <h4 className="font-royal font-bold text-base sm:text-lg text-stone-900">
                      {plan.nameHindi}
                    </h4>
                    <p className="text-xs text-stone-500 font-medium">
                      अवधि: {plan.duration}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-red-950 font-royal">
                      {plan.price}
                    </span>
                    <span className="text-xs text-stone-500">/ अवधि</span>
                  </div>

                  <ul className="space-y-2 text-xs text-stone-700">
                    {plan.featuresHindi.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-md transition ${
                      plan.popular
                        ? 'bg-gradient-to-r from-red-800 to-rose-900 text-amber-200 hover:brightness-110'
                        : 'bg-stone-900 hover:bg-black text-white'
                    }`}
                  >
                    यह प्लान चुनें
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Dedicated Concierge Helpline Banner */}
          <div className="p-4 bg-gradient-to-r from-amber-100 via-rose-50 to-amber-100 rounded-2xl border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-red-900" />
              <div>
                <strong className="text-red-950 block">व्यक्तिगत सहायता चाहिए?</strong>
                <span className="text-stone-600">हमारे वरिष्ठ विवाह सलाहकार से अभी निःशुल्क परामर्श प्राप्त करें:</span>
              </div>
            </div>
            <a
              href="tel:18002084878"
              className="bg-red-900 hover:bg-red-800 text-amber-200 font-bold px-4 py-2 rounded-xl text-xs shadow transition whitespace-nowrap"
            >
              कॉल करें: 1800-208-GUPTA
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
