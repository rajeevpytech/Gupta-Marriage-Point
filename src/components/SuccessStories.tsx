import React from 'react';
import { Heart, Sparkles, Calendar, MapPin } from 'lucide-react';
import { SUCCESS_STORIES } from '../data/profiles';
import { Language, TRANSLATIONS } from '../data/translations';

interface SuccessStoriesProps {
  lang: Language;
}

export const SuccessStories: React.FC<SuccessStoriesProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <section className="py-12 px-4 sm:px-6 bg-gradient-to-b from-amber-50/40 via-rose-50/20 to-white border-t border-amber-200">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-red-100 text-red-900 px-3 py-0.5 rounded-full text-xs font-bold font-royal">
            <Heart className="w-3.5 h-3.5 fill-red-800" />
            <span>सफल शादियां</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-royal text-red-950">
            {t.successStoriesTitle}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
            {t.successStoriesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUCCESS_STORIES.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-3xl border border-amber-200/80 shadow-md hover:shadow-xl transition overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={story.image}
                  alt={story.coupleName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-royal font-bold text-base sm:text-lg text-amber-200">
                    {lang === 'hi' ? story.coupleNameHindi : story.coupleName}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-stone-300">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      {story.weddingDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      {story.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-white to-amber-50/20">
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  "{lang === 'hi' ? story.storyHindi : story.storyEnglish}"
                </p>

                <div className="pt-3 border-t border-amber-200/50 mt-3 flex items-center justify-between text-[11px] text-amber-900 font-bold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>गुप्ता मैरिज पॉइंट से परिणय सूत्र</span>
                  </span>
                  <span className="text-emerald-700">सत्यापित शादी ✓</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
