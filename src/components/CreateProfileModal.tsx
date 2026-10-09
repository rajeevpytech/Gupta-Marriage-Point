import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Sparkles, 
  CheckCircle2, 
  Upload, 
  ShieldCheck 
} from 'lucide-react';
import { MatrimonyProfile, Gender } from '../types/matrimony';
import { Language } from '../data/translations';

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onAddProfile: (profile: MatrimonyProfile) => void;
}

export const CreateProfileModal: React.FC<CreateProfileModalProps> = ({
  isOpen,
  onClose,
  lang,
  onAddProfile
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    nameHindi: '',
    nameEnglish: '',
    gender: 'female' as Gender,
    age: 26,
    height: "5' 4\"",
    subcasteHindi: 'गुप्ता',
    gotra: 'कश्यप (Kashyap)',
    motherGotra: 'गर्ग (Garg)',
    rashi: 'कन्या (Kanya)',
    nakshatra: 'हस्त (Hasta)',
    manglikHindi: 'मांगलिक नहीं',
    education: '',
    profession: '',
    company: '',
    income: '₹15 - 20 Lakhs / yr',
    city: 'New Delhi',
    state: 'Delhi NCR',
    nativePlace: 'Mathura, UP',
    diet: 'शुद्ध शाकाहारी (Pure Veg)',
    fatherProfession: 'Established Businessman (व्यापारी)',
    motherProfession: 'Homemaker (गृहणी)',
    aboutMeHindi: '',
    partnerExpectationsHindi: '',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProfile: MatrimonyProfile = {
      id: `GP-NEW-${Date.now().toString().slice(-4)}`,
      name: formData.nameEnglish || formData.nameHindi,
      nameHindi: formData.nameHindi || formData.nameEnglish,
      age: Number(formData.age),
      gender: formData.gender,
      height: formData.height,
      subcaste: 'Gupta',
      subcasteHindi: formData.subcasteHindi,
      gotra: formData.gotra,
      motherGotra: formData.motherGotra,
      rashi: formData.rashi,
      nakshatra: formData.nakshatra,
      manglik: formData.manglikHindi === 'मांगलिक' ? 'Manglik' : 'Non-Manglik',
      manglikHindi: formData.manglikHindi as any,
      maritalStatus: 'Never Married',
      maritalStatusHindi: 'अविवाहित',
      education: formData.education || 'B.Tech / MBA Graduate',
      profession: formData.profession || 'Professional',
      professionCategory: 'IT / Software',
      company: formData.company || 'Leading MNC',
      income: formData.income,
      city: formData.city,
      state: formData.state,
      nativePlace: formData.nativePlace,
      diet: formData.diet as any,
      photos: [formData.photoUrl],
      aboutMeHindi: formData.aboutMeHindi || 'संस्कारवान एवं सुशिक्षित परिवार से संबंधित। भारतीय परंपराओं और पारिवारिक मूल्यों में अटूट विश्वास।',
      aboutMeEnglish: 'Cultured, grounded and progressive with traditional family roots.',
      family: {
        fatherProfession: formData.fatherProfession,
        motherProfession: formData.motherProfession,
        brothers: '1 भाई',
        sisters: '1 बहन',
        familyStatus: 'उच्च मध्यम वर्ग (Upper Middle Class)',
        familyType: 'संयुक्त परिवार (Joint Family)',
        familyValues: 'संस्कारवान एवं आधुनिक (Cultured & Modern)',
        familyOrigin: formData.nativePlace
      },
      partnerExpectationsHindi: formData.partnerExpectationsHindi || 'सुशिक्षित, संस्कारी एवं शाकाहारी जीवनसाथी जो पारिवारिक मान-मर्यादा का सम्मान करे।',
      verified: {
        aadhaar: true,
        photo: true,
        kundali: true,
        employment: true
      },
      trustScore: 98,
      featured: true,
      onlineStatus: 'online',
      defaultMatchGunaScore: 32
    };

    onAddProfile(newProfile);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-amber-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-rose-950 to-amber-900 p-4 sm:p-5 text-white flex items-center justify-between border-b border-amber-400/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center shadow font-bold">
              <UserPlus className="w-5 h-5 text-red-950" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-royal text-amber-200">
                नया वैवाहिक बायोडाटा दर्ज करें
              </h3>
              <p className="text-xs text-amber-100/80">
                100% निःशुल्क एवं सुरक्षित रजिस्ट्रेशन | गुप्ता मैरिज पॉइंट
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm">
          {isSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="font-bold">बायोडाटा सफलतापूर्वक पंजीकृत हुआ! प्रोफाइल लाइव कर दी गई है।</span>
            </div>
          )}

          {/* Gender & Profile Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 block mb-1">किसके लिए रिश्ता खोज रहे हैं?</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
              >
                <option value="female">कन्या / वधू (Bride)</option>
                <option value="male">वर (Groom)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">उम्र (Age in years)</label>
              <input
                type="number"
                min={21}
                max={45}
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-stone-300"
                required
              />
            </div>
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 block mb-1">पूरा नाम (हिंदी में)</label>
              <input
                type="text"
                placeholder="उदा. डॉ. राधिका गुप्ता"
                value={formData.nameHindi}
                onChange={(e) => setFormData({ ...formData, nameHindi: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300"
                required
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Full Name (in English)</label>
              <input
                type="text"
                placeholder="e.g. Radhika Gupta"
                value={formData.nameEnglish}
                onChange={(e) => setFormData({ ...formData, nameEnglish: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300"
                required
              />
            </div>
          </div>

          {/* Subcaste & Gotra */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-stone-700 block mb-1">उपजाति (Sub-caste)</label>
              <select
                value={formData.subcasteHindi}
                onChange={(e) => setFormData({ ...formData, subcasteHindi: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
              >
                <option value="गुप्ता">गुप्ता (Gupta)</option>
                <option value="अग्रवाल">अग्रवाल (Aggarwal)</option>
                <option value="मित्तल">मित्तल (Mittal)</option>
                <option value="खंडेलवाल">खंडेलवाल (Khandelwal)</option>
                <option value="रौनियार">रौनियार वैश्य (Rauniyar)</option>
                <option value="महाजन">महाजन (Mahajan)</option>
                <option value="वैश्य">वैश्य (Vaishya)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">गोत्र (Gotra)</label>
              <input
                type="text"
                value={formData.gotra}
                onChange={(e) => setFormData({ ...formData, gotra: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300"
                required
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">मांगलिक स्थिति</label>
              <select
                value={formData.manglikHindi}
                onChange={(e) => setFormData({ ...formData, manglikHindi: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
              >
                <option value="मांगलिक नहीं">मांगलिक नहीं (Non-Manglik)</option>
                <option value="मांगलिक">मांगलिक (Manglik)</option>
                <option value="आंशिक मांगलिक">आंशिक मांगलिक</option>
              </select>
            </div>
          </div>

          {/* Education & Profession */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 block mb-1">शिक्षा (Education degree)</label>
              <input
                type="text"
                placeholder="उदा. MBBS, MD / B.Tech (IIT Delhi)"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300"
                required
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">पेशा / पद (Profession)</label>
              <input
                type="text"
                placeholder="उदा. Senior Software Engineer / Doctor / CA"
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300"
                required
              />
            </div>
          </div>

          {/* Income & Location */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-stone-700 block mb-1">वार्षिक आय (Income)</label>
              <input
                type="text"
                value={formData.income}
                onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">वर्तमान शहर (City)</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">मूल स्थान (Native Place)</label>
              <input
                type="text"
                value={formData.nativePlace}
                onChange={(e) => setFormData({ ...formData, nativePlace: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>
          </div>

          {/* Family details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 block mb-1">पिताजी का विवरण (Father)</label>
              <input
                type="text"
                value={formData.fatherProfession}
                onChange={(e) => setFormData({ ...formData, fatherProfession: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">माताजी का विवरण (Mother)</label>
              <input
                type="text"
                value={formData.motherProfession}
                onChange={(e) => setFormData({ ...formData, motherProfession: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-800 via-rose-900 to-amber-900 hover:brightness-110 text-amber-200 font-bold py-3 px-6 rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>बायोडाटा सुरक्षित सहेजें एवं प्रोफाइल प्रकाशित करें</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
