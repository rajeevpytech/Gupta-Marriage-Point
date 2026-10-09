import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  X, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Send,
  Heart,
  FileText,
  RotateCcw,
  Check,
  Loader2
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import { MatchFilter, MatrimonyProfile } from '../types/matrimony';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onApplyFilters: (filters: Partial<MatchFilter>) => void;
  currentGender: 'female' | 'male';
  availableProfiles: MatrimonyProfile[];
  onOpenBiodata?: (profile: MatrimonyProfile) => void;
  onSendInterest?: (profileId: string) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  lang,
  onApplyFilters,
  currentGender,
  availableProfiles,
  onOpenBiodata,
  onSendInterest
}) => {
  const t = TRANSLATIONS[lang];
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [spokenResponse, setSpokenResponse] = useState('');
  const [extractedFilters, setExtractedFilters] = useState<any>(null);
  const [matchedProfiles, setMatchedProfiles] = useState<MatrimonyProfile[]>([]);
  const [panditJiAdvice, setPanditJiAdvice] = useState('');
  const [isSpeakingTts, setIsSpeakingTts] = useState(false);
  const [micStatus, setMicStatus] = useState<'idle' | 'listening' | 'transcribing' | 'processing' | 'unsupported' | 'denied'>('idle');
  const [assistantPersona, setAssistantPersona] = useState<'male' | 'female'>('male');
  const [greetingPlayed, setGreetingPlayed] = useState(false);
  const [audioVolumeLevel, setAudioVolumeLevel] = useState(0);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const latestTranscriptRef = useRef<string>('');

  // Play a soft pleasant tone using Web Audio API
  const playSoundChime = (type: 'start' | 'success') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'start') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } else {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      // AudioContext optional
    }
  };

  const stopTts = () => {
    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
      setIsSpeakingTts(false);
    }
  };

  const cleanupAudioStream = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setAudioVolumeLevel(0);
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      } catch {}
      mediaStreamRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
  };

  const cleanupRecognition = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
  };

  const cancelListening = () => {
    cleanupRecognition();
    cleanupAudioStream();
    setIsListening(false);
    if (micStatus === 'listening') {
      setMicStatus('idle');
    }
  };

  const startListening = async () => {
    stopTts();
    cleanupRecognition();
    cleanupAudioStream();

    setTranscript('');
    setInterimText('');
    latestTranscriptRef.current = '';
    audioChunksRef.current = [];
    setMicStatus('idle');

    let stream: MediaStream | null = null;
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        mediaStreamRef.current = stream;
      }
    } catch (permErr: any) {
      console.warn('Microphone permission error:', permErr);
      if (permErr?.name === 'NotAllowedError' || permErr?.name === 'PermissionDeniedError') {
        setMicStatus('denied');
        return;
      }
    }

    if (!stream) {
      setMicStatus('denied');
      return;
    }

    // Set up real-time audio volume visualizer
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
        audioContextRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.5;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateVolume = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          const normalized = Math.min(100, Math.round((average / 128) * 100));
          setAudioVolumeLevel(normalized);
          animationFrameRef.current = requestAnimationFrame(updateVolume);
        };
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      }
    } catch (e) {
      console.warn('Audio visualizer note:', e);
    }

    // Set up MediaRecorder backup for high-accuracy Gemini AI voice transcription
    try {
      let mimeType = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (!MediaRecorder.isTypeSupported('audio/webm')) {
          if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
          else if (MediaRecorder.isTypeSupported('audio/ogg')) mimeType = 'audio/ogg';
          else mimeType = '';
        }
        const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };
        recorder.start(100);
        mediaRecorderRef.current = recorder;
      }
    } catch (recErr) {
      console.warn('MediaRecorder note:', recErr);
    }

    // Initialize Web Speech Recognition if available (non-blocking)
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'hi-IN';

        recognition.onstart = () => {
          // Speech recognition running
        };

        recognition.onresult = (event: any) => {
          let fullFinal = '';
          let currentInterim = '';

          for (let i = 0; i < event.results.length; i++) {
            const item = event.results[i];
            if (item.isFinal) {
              fullFinal += item[0].transcript + ' ';
            } else {
              currentInterim += item[0].transcript;
            }
          }

          const combined = (fullFinal + currentInterim).trim();
          if (combined) {
            latestTranscriptRef.current = combined;
            setTranscript(combined);
            setInterimText(currentInterim);

            // Auto-submit after 2.5 seconds of silence
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = setTimeout(() => {
              stopListeningAndSubmit(combined);
            }, 2500);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('SpeechRecognition warning:', event?.error);
          // Do NOT set micStatus = 'denied' here because media stream is active!
        };

        recognition.onend = () => {
          // Let media recorder continue
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('SpeechRecognition start error:', err);
      }
    }

    playSoundChime('start');
    setIsListening(true);
    setMicStatus('listening');
  };

  const stopListeningAndSubmit = async (overrideText?: string) => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    const textToProcess = (overrideText || latestTranscriptRef.current || transcript).trim();

    // Safely stop speech recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

    // Stop visualizer animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setAudioVolumeLevel(0);

    // Case 1: Speech recognition captured text directly
    if (textToProcess) {
      cleanupAudioStream();
      setIsListening(false);
      setInterimText('');
      processQuery(textToProcess);
      return;
    }

    // Case 2: Speech recognition returned empty or failed, fallback to Gemini AI Audio transcription
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      setMicStatus('transcribing');
      setIsListening(false);

      // Await recorder.stop() to flush final audio chunks reliably
      const audioBlob = await new Promise<Blob | null>((resolve) => {
        const timeout = setTimeout(() => {
          if (audioChunksRef.current.length > 0) {
            resolve(new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' }));
          } else {
            resolve(null);
          }
        }, 1500);

        recorder.onstop = () => {
          clearTimeout(timeout);
          try {
            const mimeType = recorder.mimeType || 'audio/webm';
            if (audioChunksRef.current.length > 0) {
              resolve(new Blob(audioChunksRef.current, { type: mimeType }));
            } else {
              resolve(null);
            }
          } catch {
            resolve(null);
          }
        };

        try {
          recorder.stop();
        } catch {
          clearTimeout(timeout);
          resolve(null);
        }
      });

      cleanupAudioStream();

      if (!audioBlob || audioBlob.size < 200) {
        setMicStatus('idle');
        const feedback = 'आवाज़ स्पष्ट सुनाई नहीं दी। कृपया माइक बटन दबाकर दोबारा बोलें, अथवा नीचे दिए विकल्पों में से चुनें।';
        setSpokenResponse(feedback);
        playVoiceResponse(feedback);
        return;
      }

      try {
        const reader = new FileReader();
        const base64data = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(audioBlob);
        });

        const res = await fetch('/api/ai/transcribe-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64data,
            mimeType: audioBlob.type || 'audio/webm'
          })
        });

        const data = await res.json();
        const transcribedText = (data.text || '').trim();

        if (transcribedText) {
          setTranscript(transcribedText);
          latestTranscriptRef.current = transcribedText;
          processQuery(transcribedText);
        } else {
          setMicStatus('idle');
          const feedback = 'आवाज़ स्पष्ट सुनाई नहीं दी। कृपया माइक बटन दबाकर दोबारा बोलें, अथवा नीचे दिए विकल्पों में से चुनें।';
          setSpokenResponse(feedback);
          playVoiceResponse(feedback);
        }
      } catch (err) {
        console.error('Audio transcription request error:', err);
        setMicStatus('idle');
        const feedback = 'माइक से आवाज़ नहीं मिल सकी। कृपया नीचे दिए विकल्पों में से चुनें अथवा टाइप करें।';
        setSpokenResponse(feedback);
        playVoiceResponse(feedback);
      }
    } else {
      cleanupAudioStream();
      setIsListening(false);
      setMicStatus('idle');
      const feedback = 'कृपया माइक बटन दबाकर बोलें।';
      setSpokenResponse(feedback);
      playVoiceResponse(feedback);
    }
  };

  const playVoiceResponse = (text: string) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN'));
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    utterance.onstart = () => setIsSpeakingTts(true);
    utterance.onend = () => setIsSpeakingTts(false);
    utterance.onerror = () => setIsSpeakingTts(false);

    window.speechSynthesis.speak(utterance);
  };

  const processQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    setIsLoading(true);
    setMicStatus('processing');
    setSpokenResponse('');
    setExtractedFilters(null);
    setMatchedProfiles([]);

    try {
      const res = await fetch('/api/ai/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          activeGender: currentGender,
          availableProfiles: availableProfiles
        })
      });

      const data = await res.json();
      playSoundChime('success');

      setSpokenResponse(data.spokenResponse || 'आपकी पसंद के अनुसार श्रेष्ठ वैवाहिक रिश्ते चुन लिए गए हैं।');
      setExtractedFilters(data.filters || {});
      setPanditJiAdvice(data.panditJiAdvice || '');

      // Identify matching profile objects
      let matched: MatrimonyProfile[] = [];
      if (Array.isArray(data.matchedProfileIds) && data.matchedProfileIds.length > 0) {
        matched = availableProfiles.filter(p => data.matchedProfileIds.includes(p.id));
      }

      // Fallback matching if needed
      if (matched.length === 0) {
        const targetGender = data.filters?.gender || currentGender;
        matched = availableProfiles.filter(p => {
          if (p.gender !== targetGender) return false;
          if (data.filters?.profession && !p.profession.toLowerCase().includes(data.filters.profession.toLowerCase()) && !p.professionCategory.toLowerCase().includes(data.filters.profession.toLowerCase())) {
            return false;
          }
          if (data.filters?.location && !p.city.toLowerCase().includes(data.filters.location.toLowerCase())) {
            return false;
          }
          return true;
        });
      }

      // If still empty, show best 3 of the gender
      if (matched.length === 0) {
        const targetGender = data.filters?.gender || currentGender;
        matched = availableProfiles.filter(p => p.gender === targetGender).slice(0, 3);
      }

      setMatchedProfiles(matched);

      // Playback voice
      if (data.spokenResponse) {
        playVoiceResponse(data.spokenResponse);
      }
    } catch (err) {
      console.error(err);
      setSpokenResponse('जी नमस्ते! आपकी पसंद के अनुसार श्रेष्ठ रिश्ते प्रस्तुत हैं।');
      const fallbackList = availableProfiles.filter(p => p.gender === currentGender).slice(0, 2);
      setMatchedProfiles(fallbackList);
    } finally {
      setIsLoading(false);
      setMicStatus('idle');
    }
  };

  const getGreetingText = (persona: 'male' | 'female') => {
    return persona === 'female'
      ? "ओके! मैं आपकी कैसे सहायता कर सकती हूँ? आप किस प्रकार का रिश्ता ढूंढ रहे हैं?"
      : "ओके! मैं आपकी कैसे सहायता कर सकता हूँ? आप किस प्रकार का रिश्ता ढूंढ रहे हैं?";
  };

  // Play greeting when modal opens
  const speakGreeting = (personaOverride?: 'male' | 'female') => {
    const activePersona = personaOverride || assistantPersona;
    const greetingText = getGreetingText(activePersona);

    playSoundChime('start');

    if (!window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(greetingText);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.96;
      utterance.pitch = activePersona === 'female' ? 1.2 : 0.95;

      const voices = window.speechSynthesis.getVoices();
      const hindiVoices = voices.filter(v => v.lang.includes('hi') || v.lang.includes('IN'));
      if (hindiVoices.length > 0) {
        if (activePersona === 'female') {
          const female = hindiVoices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('lekha') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('kalpana') || v.name.toLowerCase().includes('swara'));
          utterance.voice = female || hindiVoices[0];
        } else {
          const male = hindiVoices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('rishi') || v.name.toLowerCase().includes('hemant') || v.name.toLowerCase().includes('madhav'));
          utterance.voice = male || hindiVoices[hindiVoices.length - 1];
        }
      }

      utterance.onstart = () => {
        setIsSpeakingTts(true);
        setGreetingPlayed(true);
      };

      utterance.onend = () => {
        setIsSpeakingTts(false);
      };

      utterance.onerror = () => {
        setIsSpeakingTts(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      // Ignore
    }
  };

  // Trigger greeting when modal opens
  useEffect(() => {
    if (isOpen) {
      setGreetingPlayed(false);
      setTranscript('');
      setInterimText('');
      setSpokenResponse('');
      setMatchedProfiles([]);
      setMicStatus('idle');
      const timer = setTimeout(() => {
        speakGreeting();
      }, 250);
      return () => clearTimeout(timer);
    } else {
      cancelListening();
      stopTts();
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelListening();
      stopTts();
    };
  }, []);

  const handleApply = () => {
    if (extractedFilters) {
      const filtersToApply: Partial<MatchFilter> = {};

      if (extractedFilters.gender) {
        filtersToApply.gender = extractedFilters.gender;
      }
      if (extractedFilters.minAge) {
        filtersToApply.minAge = Number(extractedFilters.minAge);
      }
      if (extractedFilters.maxAge) {
        filtersToApply.maxAge = Number(extractedFilters.maxAge);
      }
      if (extractedFilters.profession) {
        filtersToApply.profession = extractedFilters.profession;
      }
      if (extractedFilters.location) {
        filtersToApply.location = extractedFilters.location;
      }
      if (extractedFilters.subcaste) {
        filtersToApply.subcaste = extractedFilters.subcaste;
      }
      if (extractedFilters.manglik) {
        filtersToApply.manglik = extractedFilters.manglik;
      }

      onApplyFilters(filtersToApply);
      stopTts();
      onClose();
    }
  };

  const sampleVoicePrompts = [
    { text: '24 से 28 वर्ष की डॉक्टर या सीए वधू दिखाएं', icon: '🩺' },
    { text: 'दिल्ली-एनसीआर में सॉफ्टवेयर इंजीनियर वर ढूंढें', icon: '💻' },
    { text: 'मांगलिक कुंडली अनुकूल 30+ गुण मिलान वाले रिश्ते', icon: '✨' },
    { text: 'संपन्न बिज़नेस फैमिली के संस्कारी लड़के बताएं', icon: '🏢' },
    { text: 'लखनऊ या वाराणसी के वैश्य समाज रिश्ते', icon: '📍' },
    { text: 'आईएएस या सिविल सेवा वर दिखाएं', icon: '🏛️' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-red-900 via-rose-950 to-amber-900 p-4 sm:p-5 text-white flex items-center justify-between border-b border-amber-400/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-stone-950 flex items-center justify-center shadow-lg font-bold">
              <Sparkles className="w-6 h-6 text-red-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold font-royal text-amber-200">
                  गुप्ता जी एआई वॉयस मैचमेकर
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>100% एक्टिव AI</span>
                </span>
              </div>
              <p className="text-xs text-amber-100/80">
                माइक पर बोलें — एआई समझकर तुरंत सर्वश्रेष्ठ रिश्ते और 36 गुण स्कोर दिखाएगा
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              cancelListening();
              stopTts();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20">
          {/* Google Gemini AI Power Badge */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 via-amber-50 to-rose-50 px-3.5 py-1.5 rounded-2xl border border-blue-200/80 text-[11px] shadow-xs">
            <div className="flex items-center gap-1.5 font-bold text-stone-800">
              <span className="flex items-center gap-0.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </span>
              <span>Google Gemini 3.8 Flash AI Engine</span>
            </div>
            <span className="text-stone-500 font-medium hidden sm:inline">
              Vedic Kundali & Natural Hindi Speech
            </span>
          </div>

          {/* Assistant Greeting Card */}
          <div className="bg-gradient-to-r from-amber-100/90 via-white to-rose-100/80 p-4 rounded-3xl border-2 border-amber-300 shadow-sm flex flex-col sm:flex-row items-start gap-3 relative">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-900 to-rose-950 text-amber-300 flex items-center justify-center font-bold text-sm shrink-0 font-royal shadow border border-amber-400/50">
                  {assistantPersona === 'female' ? 'नेहा' : 'गुप्ता'}
                </div>
                <div className="sm:hidden">
                  <span className="font-bold text-red-950 font-royal text-sm block">
                    {assistantPersona === 'female' ? 'नेहा जी (एआई असिस्टेंट)' : 'गुप्ता जी (एआई मैचमेकर)'}
                  </span>
                </div>
              </div>

              {/* Persona Voice Selector Toggle */}
              <div className="flex items-center bg-white/90 p-0.5 rounded-xl border border-amber-300 shadow-2xs sm:hidden">
                <button
                  onClick={() => {
                    setAssistantPersona('male');
                    speakGreeting('male');
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                    assistantPersona === 'male' ? 'bg-red-800 text-white shadow-xs' : 'text-stone-600'
                  }`}
                >
                  कर सकता हूँ
                </button>
                <button
                  onClick={() => {
                    setAssistantPersona('female');
                    speakGreeting('female');
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                    assistantPersona === 'female' ? 'bg-rose-800 text-white shadow-xs' : 'text-stone-600'
                  }`}
                >
                  कर सकती हूँ
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-1.5 w-full">
              <div className="hidden sm:flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-red-950 font-royal text-sm">
                    {assistantPersona === 'female' ? 'नेहा जी (एआई वॉयस असिस्टेंट):' : 'गुप्ता जी (एआई वॉयस मैचमेकर):'}
                  </span>
                  {/* Desktop Persona Switcher */}
                  <div className="flex items-center bg-white/90 p-0.5 rounded-xl border border-amber-300 text-xs">
                    <button
                      onClick={() => {
                        setAssistantPersona('male');
                        speakGreeting('male');
                      }}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                        assistantPersona === 'male' ? 'bg-red-800 text-white' : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      👨‍💼 कर सकता हूँ
                    </button>
                    <button
                      onClick={() => {
                        setAssistantPersona('female');
                        speakGreeting('female');
                      }}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                        assistantPersona === 'female' ? 'bg-rose-800 text-white' : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      👩‍💼 कर सकती हूँ
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => speakGreeting(assistantPersona)}
                  className="text-[11px] font-bold text-amber-900 bg-white hover:bg-amber-100 px-3 py-1 rounded-xl border border-amber-300 flex items-center gap-1.5 transition shadow-2xs"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isSpeakingTts && !spokenResponse ? 'बोल रहे हैं...' : '🔊 आवाज़ सुनें'}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-stone-900 leading-relaxed font-semibold bg-white/80 p-2.5 rounded-2xl border border-amber-200">
                "{getGreetingText(assistantPersona)}"
              </p>
            </div>
          </div>

          {/* Main Voice Interactive Studio */}
          <div className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Ambient Pulse Background */}
            {isListening && (
              <div className="absolute inset-0 bg-red-500/5 pointer-events-none animate-pulse"></div>
            )}

            {/* Equalizer Waveform Bars with REAL Microphone Audio Input Level */}
            <div className="h-10 flex items-end justify-center gap-1.5 mb-3">
              {[35, 70, 95, 60, 85, 45, 75].map((baseHeight, i) => {
                const dynamicHeight = isListening
                  ? Math.min(100, Math.max(16, (audioVolumeLevel * 1.5) + ((i % 3) * 12)))
                  : isSpeakingTts
                  ? baseHeight
                  : 12;
                return (
                  <span
                    key={i}
                    className={`w-2 rounded-full transition-all duration-100 ${
                      isListening
                        ? 'bg-gradient-to-t from-red-600 via-rose-500 to-amber-400 shadow-xs'
                        : isSpeakingTts
                        ? 'bg-gradient-to-t from-amber-500 to-amber-300 animate-pulse'
                        : 'bg-stone-200'
                    }`}
                    style={{
                      height: `${dynamicHeight}%`,
                      transition: isListening ? 'height 0.08s ease' : 'height 0.25s ease'
                    }}
                  />
                );
              })}
            </div>

            {/* Large Interactive Mic Button */}
            <div className="relative flex items-center justify-center">
              {isListening && (
                <>
                  <div className="absolute w-32 h-32 rounded-full bg-red-500/25 animate-ping"></div>
                  <div className="absolute w-28 h-28 rounded-full bg-amber-500/30 animate-pulse"></div>
                </>
              )}

              {isSpeakingTts && (
                <div className="absolute w-28 h-28 rounded-full bg-emerald-500/25 animate-pulse"></div>
              )}

              <button
                onClick={isListening ? () => stopListeningAndSubmit() : startListening}
                disabled={isLoading || micStatus === 'transcribing' || micStatus === 'processing'}
                className={`relative z-10 w-22 h-22 rounded-full flex items-center justify-center shadow-2xl transition transform active:scale-95 ${
                  isListening
                    ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white ring-4 ring-red-300 scale-105'
                    : micStatus === 'transcribing' || micStatus === 'processing'
                    ? 'bg-amber-600 text-white ring-4 ring-amber-300'
                    : 'bg-gradient-to-r from-red-800 via-rose-800 to-amber-600 text-white hover:brightness-110 ring-4 ring-amber-200'
                }`}
                title={isListening ? 'बोलना पूरा हुआ — खोजें' : 'माइक दबाकर बोलें'}
              >
                {micStatus === 'transcribing' || micStatus === 'processing' ? (
                  <Loader2 className="w-10 h-10 animate-spin text-amber-200" />
                ) : isListening ? (
                  <MicOff className="w-10 h-10 animate-pulse text-white" />
                ) : (
                  <Mic className="w-10 h-10 text-amber-300" />
                )}
              </button>
            </div>

            {/* Status indicator */}
            <div className="mt-4">
              {isListening ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-red-700 font-bold text-sm sm:text-base animate-pulse">
                    <span className="w-3 h-3 rounded-full bg-red-600"></span>
                    <span>माइक चालू है — कृपया बोलिए...</span>
                  </div>
                  {audioVolumeLevel > 6 && (
                    <p className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block border border-emerald-200">
                      🔊 आवाज़ मिल रही है...
                    </p>
                  )}
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      onClick={() => stopListeningAndSubmit()}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>बोलना पूरा हुआ — खोजें</span>
                    </button>
                    <button
                      onClick={cancelListening}
                      className="bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs px-3 py-2 rounded-xl transition"
                    >
                      रद्द करें
                    </button>
                  </div>
                </div>
              ) : micStatus === 'transcribing' ? (
                <div className="flex items-center justify-center gap-2 text-amber-900 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
                  <span>आपकी आवाज़ का विश्लेषण किया जा रहा है...</span>
                </div>
              ) : micStatus === 'processing' ? (
                <div className="flex items-center justify-center gap-2 text-amber-900 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
                  <span>गुप्ता जी आपकी पसंद के रिश्ते खोज रहे हैं...</span>
                </div>
              ) : isSpeakingTts ? (
                <div className="flex items-center justify-center gap-2 text-amber-900 font-bold text-sm">
                  <Volume2 className="w-4 h-4 text-amber-600 animate-bounce" />
                  <span>गुप्ता जी उत्तर बोल रहे हैं...</span>
                </div>
              ) : micStatus === 'denied' ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 font-medium space-y-2 max-w-md mx-auto">
                  <p className="font-bold flex items-center justify-center gap-1.5 text-sm text-red-900">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    माइक्रोफ़ोन एक्सेस जांचें
                  </p>
                  <p className="text-[11px] text-stone-600">
                    यदि आपने ब्राउज़र एड्रेस बार में माइक्रोफ़ोन अनुमति दे दी है, तो कृपया नीचे दिए बटन पर क्लिक करें:
                  </p>
                  <button
                    onClick={startListening}
                    className="w-full bg-gradient-to-r from-red-800 to-rose-700 hover:brightness-110 text-white font-bold py-2 px-3 rounded-xl shadow transition flex items-center justify-center gap-2 text-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                    <span>अनुमति पुनः जांचें और माइक शुरू करें (Start Mic)</span>
                  </button>
                </div>
              ) : (
                <div className="text-stone-700 font-semibold text-xs sm:text-sm">
                  माइक दबाकर बोलें (उदा. "मुझे 25-28 साल की डॉक्टर बहू चाहिए")
                </div>
              )}
            </div>

            {/* Realtime Live Speech Transcript Box */}
            <div className="w-full mt-4">
              <div className="relative">
                <input
                  type="text"
                  value={transcript || interimText}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="यहाँ आपकी आवाज़ के शब्द दिखाई देंगे अथवा टाइप करें..."
                  className="w-full px-4 py-3 pr-24 rounded-2xl border-2 border-stone-200 focus:outline-none focus:border-amber-500 text-stone-900 text-xs sm:text-sm shadow-inner bg-[#FFFDF9]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') processQuery(transcript);
                  }}
                />
                <button
                  onClick={() => processQuery(transcript)}
                  disabled={isLoading || !transcript.trim()}
                  className="absolute right-1.5 top-1.5 bottom-1.5 bg-red-800 hover:bg-red-900 disabled:opacity-40 text-white px-3.5 rounded-xl font-bold text-xs shadow transition flex items-center gap-1.5"
                >
                  {isLoading ? (
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-300" />
                  ) : (
                    <Send className="w-3.5 h-3.5 text-amber-300" />
                  )}
                  <span>खोजें</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Voice Prompt Shortcuts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-600 font-bold">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>त्वरित आवाज़ विकल्प (1-क्लिक में टेस्ट करें):</span>
              </span>
              <span className="text-[11px] text-stone-400">क्लिक करते ही बोलेगा</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sampleVoicePrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setTranscript(p.text);
                    processQuery(p.text);
                  }}
                  className="text-left text-xs bg-white hover:bg-amber-100/70 border border-stone-200 hover:border-amber-400 p-2.5 rounded-xl transition flex items-center gap-2 group shadow-2xs"
                >
                  <span className="text-sm shrink-0">{p.icon}</span>
                  <span className="text-stone-800 group-hover:text-red-950 font-medium line-clamp-1">
                    "{p.text}"
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-rose-50 border-2 border-amber-300 text-center space-y-2 gold-shimmer">
              <Sparkles className="w-7 h-7 text-amber-700 mx-auto animate-spin" />
              <h4 className="font-bold text-amber-950 text-sm">
                गुप्ता जी एआई आपकी प्राथमिकता का विश्लेषण कर श्रेष्ठ रिश्ते खोज रहे हैं...
              </h4>
              <p className="text-xs text-stone-600">
                Vedic Horoscope, Gotra & Sub-caste Matching in Progress
              </p>
            </div>
          )}

          {/* Spoken Response & Matches Container */}
          {spokenResponse && !isLoading && (
            <div className="space-y-5 animate-fadeIn">
              {/* Pandit Ji AI Speech Bubble */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-rose-50 border-2 border-amber-300 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-900 text-amber-300 flex items-center justify-center font-bold text-xs font-royal shadow">
                      पंडित
                    </div>
                    <div>
                      <span className="font-bold font-royal text-red-950 text-sm block">
                        गुप्ता जी (मुख्य एआई मैचमेकर)
                      </span>
                      <span className="text-[10px] text-stone-500">
                        सम्मानपूर्वक मौखिक उत्तर
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={isSpeakingTts ? stopTts : () => playVoiceResponse(spokenResponse)}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-950 hover:bg-amber-100 transition shadow-xs"
                  >
                    {isSpeakingTts ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                        <span>आवाज़ रोकें</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>पुनः सुनें</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-stone-900 text-sm leading-relaxed font-medium bg-white/80 p-3.5 rounded-2xl border border-amber-200/80">
                  "{spokenResponse}"
                </p>

                {panditJiAdvice && (
                  <div className="text-xs bg-amber-100/70 text-amber-950 p-2.5 rounded-xl border border-amber-300 flex items-center gap-2">
                    <span className="font-bold text-amber-900 shrink-0">सुझाव:</span>
                    <span>{panditJiAdvice}</span>
                  </div>
                )}
              </div>

              {/* LIVE MATCHED PROFILES DIRECT PREVIEW */}
              {matchedProfiles.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>आपकी आवाज़ के अनुसार मिले रिश्ते ({matchedProfiles.length} प्रोफाइल):</span>
                    </div>
                    <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      100% अनुकूल
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {matchedProfiles.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-sm flex items-center gap-3 hover:border-amber-400 transition"
                      >
                        <img
                          src={p.photos[0]}
                          alt={p.name}
                          className="w-16 h-16 rounded-xl object-cover border-2 border-amber-300 shadow shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-stone-900 text-sm truncate">
                              {p.nameHindi}
                            </h5>
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                              {p.defaultMatchGunaScore}/36 गुण
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-600 truncate">
                            {p.age} वर्ष | {p.subcasteHindi} | {p.city}
                          </p>
                          <p className="text-[11px] font-semibold text-rose-800 truncate">
                            {p.profession}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {onOpenBiodata && (
                              <button
                                onClick={() => {
                                  stopTts();
                                  onOpenBiodata(p);
                                }}
                                className="text-[10px] font-bold text-amber-900 underline hover:text-black"
                              >
                                बायोडाटा देखें
                              </button>
                            )}
                            {onSendInterest && (
                              <button
                                onClick={() => onSendInterest(p.id)}
                                className="text-[10px] font-bold text-red-800 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded border border-red-200"
                              >
                                रुचि भेजें
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Apply Action Button to Main Directory */}
              <button
                onClick={handleApply}
                className="w-full bg-gradient-to-r from-red-800 via-rose-900 to-amber-900 hover:brightness-110 text-amber-200 font-bold py-3 px-4 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>ये फ़िल्टर मुख्य पेज पर लागू करें और सभी प्रोफाइल देखें</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
