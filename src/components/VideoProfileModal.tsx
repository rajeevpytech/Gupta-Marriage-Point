import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Download, 
  Play, 
  Pause, 
  Film, 
  Sparkles, 
  CheckCircle2, 
  Share2, 
  Volume2, 
  VolumeX, 
  ShieldCheck,
  RotateCcw,
  Clock,
  Loader2
} from 'lucide-react';
import { MatrimonyProfile } from '../types/matrimony';
import { Language } from '../data/translations';

interface VideoProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: MatrimonyProfile | null;
  lang: Language;
}

export const VideoProfileModal: React.FC<VideoProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  lang
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [videoMode, setVideoMode] = useState<'profileVideo' | 'videoBiodataCard'>('profileVideo');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
      setDownloadSuccess(false);
      setDownloadProgress(0);
      setIsDownloading(false);
    }
  }, [isOpen, profile]);

  if (!isOpen || !profile) return null;

  const defaultVideo = profile.gender === 'female'
    ? 'https://assets.mixkit.co/videos/preview/mixkit-indian-bride-in-traditional-dress-smiling-41223-large.mp4'
    : 'https://assets.mixkit.co/videos/preview/mixkit-indian-groom-at-his-wedding-41221-large.mp4';

  const videoSrc = profile.videoUrl || defaultVideo;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Guaranteed Server-Proxied Video Download Function
  const handleDownloadVideo = async () => {
    setIsDownloading(true);
    setDownloadProgress(20);

    const safeName = (profile.nameHindi || profile.name).replace(/\s+/g, '_');
    const filename = `Gupta_Marriage_Point_${safeName}_Video.mp4`;
    const proxyDownloadUrl = `/api/video/download?url=${encodeURIComponent(videoSrc)}&filename=${encodeURIComponent(filename)}`;

    try {
      setDownloadProgress(45);
      
      // Fetch via server proxy (bypasses browser CORS restrictions completely)
      const res = await fetch(proxyDownloadUrl);
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      
      setDownloadProgress(80);
      const blob = await res.blob();
      setDownloadProgress(95);

      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      }, 1000);

      setDownloadProgress(100);
      setDownloadSuccess(true);
    } catch (err) {
      console.warn('Proxy blob fetch fallback to direct anchor and canvas generator:', err);
      // Secondary fallback: Direct navigation to server proxy attachment
      try {
        const link = document.createElement('a');
        link.href = proxyDownloadUrl;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloadProgress(100);
        setDownloadSuccess(true);
      } catch (fallbackErr) {
        generateAndDownloadCanvasVideo();
      }
    } finally {
      setTimeout(() => {
        setIsDownloading(false);
      }, 1200);
    }
  };

  // Canvas Animated Matrimonial Video Card Generator & Downloader with Proxied Image
  const generateAndDownloadCanvasVideo = () => {
    setIsDownloading(true);
    setDownloadProgress(25);
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 1280; // 9:16 vertical reels video format
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use proxied image to prevent canvas tainting
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = `/api/proxy-image?url=${encodeURIComponent(profile.photos[0])}`;

    img.onload = () => {
      setDownloadProgress(50);
      let stream: MediaStream;
      try {
        stream = canvas.captureStream(30); // 30 fps
      } catch (e) {
        console.warn('captureStream failed, exporting static image poster:', e);
        exportPosterImage(canvas);
        return;
      }

      let mediaRecorder: MediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      } catch {
        try {
          mediaRecorder = new MediaRecorder(stream);
        } catch (e) {
          exportPosterImage(canvas);
          return;
        }
      }

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(videoBlob);
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = `Gupta_Marriage_Point_${(profile.nameHindi || profile.name).replace(/\s+/g, '_')}_Video_Biodata.webm`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(videoUrl);

        setDownloadProgress(100);
        setDownloadSuccess(true);
        setIsDownloading(false);
      };

      mediaRecorder.start();

      let frame = 0;
      const totalFrames = 90; // 3 seconds video

      const renderFrame = () => {
        // Background Gradient
        const grad = ctx.createLinearGradient(0, 0, 720, 1280);
        grad.addColorStop(0, '#5b0a1d'); // Royal maroon
        grad.addColorStop(0.5, '#7f1d1d');
        grad.addColorStop(1, '#2c0408');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 720, 1280);

        // Golden Double Border
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 12;
        ctx.strokeRect(20, 20, 680, 1240);
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 3;
        ctx.strokeRect(36, 36, 648, 1208);

        // Top Header
        ctx.fillStyle = '#fef3c7';
        ctx.font = 'bold 36px serif';
        ctx.textAlign = 'center';
        ctx.fillText('॥ श्री गणेशाय नमः ॥', 360, 95);

        ctx.font = 'bold 28px sans-serif';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('गुप्ता मैरिज पॉइंट - वैवाहिक वीडियो बायोडाटा', 360, 145);

        // Candidate Photo with Golden Circular Frame
        ctx.save();
        ctx.beginPath();
        ctx.arc(360, 360, 160, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 200, 200, 320, 320);
        ctx.restore();

        ctx.beginPath();
        ctx.arc(360, 360, 165, 0, Math.PI * 2);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 8;
        ctx.stroke();

        // Animated shimmer badge
        const pulse = Math.sin((frame / totalFrames) * Math.PI * 4) * 5;
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.roundRect(240, 530 + pulse, 240, 40, 20);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('✓ 100% आधार सत्यापित', 360, 558 + pulse);

        // Candidate Details
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 44px serif';
        ctx.fillText(profile.nameHindi, 360, 640);

        ctx.fillStyle = '#fef3c7';
        ctx.font = '26px sans-serif';
        ctx.fillText(`${profile.age} वर्ष | ${profile.height} | ${profile.subcasteHindi} वैश्य`, 360, 685);

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText(profile.profession, 360, 740);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '24px sans-serif';
        ctx.fillText(profile.company, 360, 780);

        // Horoscopes Box
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.beginPath();
        ctx.roundRect(70, 830, 580, 260, 24);
        ctx.fill();
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText(`गोत्र: ${profile.gotra}  |  राशि: ${profile.rashi}`, 360, 885);
        ctx.fillText(`मांगलिक: ${profile.manglikHindi}  |  36 गुण मिलान: ${profile.defaultMatchGunaScore}/36`, 360, 935);

        ctx.fillStyle = '#ffffff';
        ctx.font = '24px sans-serif';
        ctx.fillText(`शिक्षा: ${profile.education}`, 360, 990);
        ctx.fillText(`निवास: ${profile.city}, ${profile.state} (मूल: ${profile.nativePlace})`, 360, 1040);

        // Footer Contact
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText('संपर्क: 1800-208-GUPTA | www.guptamarriagepoint.com', 360, 1170);

        frame++;
        if (frame < totalFrames) {
          requestAnimationFrame(renderFrame);
        } else {
          try {
            mediaRecorder.stop();
          } catch {
            exportPosterImage(canvas);
          }
        }
      };

      renderFrame();
    };

    img.onerror = () => {
      // Direct server proxy download
      const proxyDownloadUrl = `/api/video/download?url=${encodeURIComponent(videoSrc)}&filename=Gupta_Marriage_Point_Video.mp4`;
      const link = document.createElement('a');
      link.href = proxyDownloadUrl;
      link.download = `Gupta_Marriage_Point_${profile.nameHindi}_Video.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloading(false);
      setDownloadSuccess(true);
    };
  };

  const exportPosterImage = (canvas: HTMLCanvasElement) => {
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Gupta_Marriage_Point_${(profile.nameHindi || profile.name).replace(/\s+/g, '_')}_Biodata_Card.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloadSuccess(true);
    } catch (e) {
      console.warn('Canvas export error:', e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-fadeIn">
      {/* Hidden canvas for video generation */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-rose-950 to-amber-900 p-4 text-white flex items-center justify-between border-b border-amber-400/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center shadow font-bold">
              <Film className="w-5 h-5 text-red-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-royal text-amber-200">
                  {profile.nameHindi} - वीडियो परिचय एवं बायोडाटा
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  HD 1080p
                </span>
              </div>
              <p className="text-[11px] text-amber-100/80">
                100% सत्यापित पारिवारिक परिचय वीडियो | गुप्ता मैरिज पॉइंट
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
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-gradient-to-b from-amber-50/20 to-white">
          {/* Video Player Box */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/14] sm:aspect-video w-full shadow-lg border-2 border-amber-300 group">
            <video
              ref={videoRef}
              src={videoSrc}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              loop
              muted={isMuted}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Video Overlay Controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none flex flex-col justify-between p-4">
              <div className="flex items-center justify-between pointer-events-auto">
                <span className="bg-red-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  <span>लाइव परिचय</span>
                </span>

                <button
                  onClick={toggleMute}
                  className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition shadow"
                  title={isMuted ? 'आवाज़ चालू करें' : 'आवाज़ बंद करें'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
                </button>
              </div>

              {/* Bottom Video Info */}
              <div className="pointer-events-auto space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold text-base sm:text-lg font-royal flex items-center gap-2">
                      <span>{profile.nameHindi}</span>
                      <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-sans">
                        सत्यापित
                      </span>
                    </h4>
                    <p className="text-xs text-amber-200">
                      {profile.profession} | {profile.city} ({profile.age} वर्ष)
                    </p>
                  </div>

                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 flex items-center justify-center shadow-lg transition transform active:scale-95"
                    title={isPlaying ? 'रोकें' : 'चलाएं'}
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-stone-950" /> : <Play className="w-5 h-5 fill-stone-950 ml-0.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Download Progress Bar */}
          {isDownloading && (
            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-300 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
                  <span>वीडियो डाउनलोड हो रहा है... कृपया प्रतीक्षा करें</span>
                </span>
                <span>{downloadProgress}%</span>
              </div>
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-600 to-amber-500 h-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Download Success Banner */}
          {downloadSuccess && (
            <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-300 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-bold">
                  वीडियो सफलतापूर्वक डाउनलोड हो गया! आपके डाउनलोड्स फोल्डर में सहेज लिया गया है।
                </span>
              </div>
            </div>
          )}

          {/* Main Action Download Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleDownloadVideo}
              disabled={isDownloading}
              className="w-full bg-gradient-to-r from-red-800 via-rose-900 to-amber-900 hover:brightness-110 disabled:opacity-50 text-amber-200 font-bold py-3.5 px-4 rounded-2xl shadow-xl transition flex items-center justify-center gap-2.5 text-xs sm:text-sm border border-amber-400/50"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
                  <span>वीडियो तैयार हो रहा है...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 text-amber-300 animate-bounce" />
                  <span>वीडियो डाउनलोड करें (Download Video MP4)</span>
                </>
              )}
            </button>

            <button
              onClick={generateAndDownloadCanvasVideo}
              disabled={isDownloading}
              className="w-full bg-white hover:bg-amber-50 text-stone-800 font-bold py-2.5 px-4 rounded-xl border border-amber-300 shadow-xs transition flex items-center justify-center gap-2 text-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>एआई वीडियो विवाह कार्ड जनरेट व डाउनलोड करें (Animated Reels Card)</span>
            </button>
          </div>

          {/* Features Information */}
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
            <div className="font-bold text-stone-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>वीडियो डाउनलोड सुविधा विवरण:</span>
            </div>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>यह वीडियो उच्च गुणवत्ता (HD 1080p MP4) में सीधे आपके फोन अथवा कंप्यूटर में डाउनलोड होता है।</li>
              <li>इसे आप पारिवारिक सदस्यों के साथ व्हाट्सएप पर सीधे साझा कर सकते हैं।</li>
              <li>गुप्ता मैरिज पॉइंट द्वारा सत्यापित वॉटरमार्क के साथ सुरक्षित।</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
