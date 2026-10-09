import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  CheckCheck, 
  PhoneCall, 
  Calendar, 
  FileText,
  UserCheck
} from 'lucide-react';
import { MatrimonyProfile, MessageItem } from '../types/matrimony';
import { Language } from '../data/translations';

interface MessengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: MatrimonyProfile | null;
  lang: Language;
}

export const MessengerModal: React.FC<MessengerModalProps> = ({
  isOpen,
  onClose,
  profile,
  lang
}) => {
  if (!isOpen || !profile) return null;

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'm1',
      senderId: profile.id,
      receiverId: 'user',
      text: `नमस्ते जी! हमने गुप्ता मैरिज पॉइंट पर आपकी पारिवारिक प्रोफाइल देखी। क्या हम आगे बातचीत कर सकते हैं?`,
      timestamp: '10:30 AM',
      isSender: false
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const quickStarters = [
    'नमस्ते, हमें आपकी प्रोफाइल बहुत सुसंस्कृत लगी।',
    'क्या हम बच्चों की जन्म कुंडली का मिलान कर सकते हैं?',
    'सप्ताहांत में पारिवारिक फोन वार्तालाप के लिए उत्तम समय क्या रहेगा?',
    'कृपया विस्तृत बायोडाटा साझा करें।'
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      senderId: 'user',
      receiverId: profile.id,
      text,
      timestamp: 'अभी (Now)',
      isSender: true
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Simulate polite reply after 1.5 seconds
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyMsg: MessageItem = {
        id: `reply-${Date.now()}`,
        senderId: profile.id,
        receiverId: 'user',
        text: `जी बहुत धन्यवाद! हमने पंडित जी से जन्म पत्रिका मिलान के लिए समय लिया है। हमारे पिताजी आज शाम 7 बजे आपसे फोन पर चर्चा करेंगे। सादर।`,
        timestamp: 'अभी (Now)',
        isSender: false
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-amber-300 overflow-hidden flex flex-col h-[600px] max-h-[92vh]">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-red-900 via-rose-950 to-amber-900 p-4 text-white flex items-center justify-between border-b border-amber-400/40">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={profile.photos[0]}
                alt={profile.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-amber-300 shadow"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base font-royal text-amber-100 flex items-center gap-1.5">
                <span>{profile.nameHindi}</span>
                <span className="text-[10px] bg-emerald-500/80 px-1 rounded text-white">सत्यापित</span>
              </h3>
              <p className="text-[11px] text-amber-200/80">
                {profile.profession} | {profile.city}
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

        {/* Auspicious Trust Note */}
        <div className="bg-amber-50 px-4 py-1.5 text-center text-[11px] text-amber-900 border-b border-amber-200 flex items-center justify-center gap-1 font-medium">
          <UserCheck className="w-3.5 h-3.5 text-amber-700" />
          <span>सुरक्षित पारिवारिक चैट - केवल 100% सत्यापित सदस्यों के बीच</span>
        </div>

        {/* Message Thread */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-[#FAF8F5]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.isSender ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[82%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                  m.isSender
                    ? 'bg-gradient-to-r from-red-800 to-rose-900 text-white rounded-br-none'
                    : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-sm'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-stone-400 mt-1 flex items-center gap-1 px-1">
                {m.timestamp}
                {m.isSender && <CheckCheck className="w-3 h-3 text-red-600" />}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-stone-500 italic bg-white px-3 py-1.5 rounded-full w-fit border border-stone-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>{profile.nameHindi} का परिवार टाइप कर रहा है...</span>
            </div>
          )}
        </div>

        {/* Quick Conversation Starters */}
        <div className="p-2 bg-stone-50 border-t border-stone-200 overflow-x-auto flex gap-1.5 whitespace-nowrap text-xs">
          {quickStarters.map((starter, i) => (
            <button
              key={i}
              onClick={() => handleSend(starter)}
              className="bg-white border border-stone-200 hover:border-amber-400 text-stone-700 px-2.5 py-1 rounded-full text-[11px] shadow-2xs hover:bg-amber-50 transition"
            >
              {starter}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-white border-t border-stone-200 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="परिवार के लिए सम्मानपूर्वक संदेश लिखें..."
            className="flex-1 px-4 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="bg-red-800 hover:bg-red-900 disabled:opacity-50 text-white px-4 py-2 rounded-xl font-bold text-xs sm:text-sm shadow transition flex items-center gap-1"
          >
            <Send className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">भेजें</span>
          </button>
        </div>
      </div>
    </div>
  );
};
