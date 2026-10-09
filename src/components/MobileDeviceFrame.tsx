import React from 'react';
import { Wifi, Battery, Signal, ArrowLeft, RefreshCw } from 'lucide-react';

interface MobileDeviceFrameProps {
  deviceView: 'desktop' | 'ios' | 'android';
  children: React.ReactNode;
  onResetToDesktop: () => void;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({
  deviceView,
  children,
  onResetToDesktop
}) => {
  if (deviceView === 'desktop') {
    return <>{children}</>;
  }

  const isIos = deviceView === 'ios';

  return (
    <div className="min-h-screen bg-stone-950/95 py-4 px-2 sm:px-4 flex flex-col items-center justify-start overflow-y-auto">
      {/* Device Switcher / Toolbar on Top of Preview */}
      <div className="sticky top-2 z-40 mb-3 flex items-center justify-between w-full max-w-[420px] bg-stone-900/90 backdrop-blur-md text-stone-200 px-4 py-2 rounded-2xl border border-stone-700 text-xs shadow-xl">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-amber-300">
            {isIos ? 'Apple iOS (iPhone 16 Pro)' : 'Google Android (Galaxy S24 Ultra)'}
          </span>
        </div>
        <button
          onClick={onResetToDesktop}
          className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-3 py-1 rounded-xl text-[11px] transition shadow flex items-center gap-1"
        >
          <span>वेब मोड</span>
          <ArrowLeft className="w-3 h-3 rotate-180" />
        </button>
      </div>

      {/* Phone Hardware Mockup Outer Shell */}
      <div
        className={`relative w-full max-w-[400px] h-[min(800px,calc(100vh-90px))] bg-black shadow-2xl overflow-hidden transition-all duration-300 flex flex-col border-[8px] sm:border-[10px] ${
          isIos
            ? 'rounded-[44px] sm:rounded-[52px] border-stone-800 ring-2 ring-stone-700 shadow-amber-500/10'
            : 'rounded-[36px] sm:rounded-[42px] border-stone-800 ring-2 ring-stone-700 shadow-emerald-500/10'
        }`}
      >
        {/* Device Top Status Bar */}
        <div className="bg-white/95 px-6 pt-2.5 pb-1 flex items-center justify-between text-stone-900 text-xs font-semibold z-30 select-none border-b border-stone-100 shrink-0">
          <span className="font-mono text-[11px] font-bold">09:41</span>

          {/* Dynamic Island for iOS or Punch-hole for Android */}
          {isIos ? (
            <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-stone-900"></span>
            </div>
          ) : (
            <div className="w-3.5 h-3.5 rounded-full bg-black"></div>
          )}

          <div className="flex items-center gap-1.5 text-[11px]">
            <Signal className="w-3 h-3 text-stone-700" />
            <Wifi className="w-3 h-3 text-stone-700" />
            <Battery className="w-4 h-4 text-emerald-600" />
          </div>
        </div>

        {/* Scrollable App Viewport */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#FFFDF9] relative scroll-smooth">
          {children}
        </div>

        {/* Bottom Home Indicator */}
        <div className="bg-white/95 py-2 flex items-center justify-center z-30 border-t border-stone-100 shrink-0">
          {isIos ? (
            <div className="w-32 h-1 bg-stone-400 rounded-full"></div>
          ) : (
            <div className="flex items-center gap-10 py-0.5 text-stone-500 text-xs">
              <span className="w-3 h-3 border-l-2 border-b-2 border-stone-500 transform rotate-45"></span>
              <span className="w-3 h-3 border-2 border-stone-500 rounded-sm"></span>
              <span className="w-3 h-3 border-2 border-stone-500 rounded-full"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
