import React from 'react';
import { Volume2, VolumeX, Sparkles, UtensilsCrossed, ShieldAlert } from 'lucide-react';
import { getSoundEnabled, setSoundEnabled } from '../utils/soundEffects';

interface HeaderBarProps {
  spinCount: number;
  isSpinning: boolean;
  activeThemeName: string;
  onOpenPoolManager: () => void;
  soundOn: boolean;
  setSoundOn: (val: boolean) => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  spinCount,
  isSpinning,
  activeThemeName,
  onOpenPoolManager,
  soundOn,
  setSoundOn,
}) => {
  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/40">
            <UtensilsCrossed className="w-5 h-5 text-slate-950 font-bold" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-game text-lg sm:text-xl font-bold tracking-wider text-slate-100 flex items-center gap-2">
                TRƯA NAY ĂN GÌ <span className="text-amber-500 text-xs sm:text-sm px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">CS:GO CASE OPENING</span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 hidden sm:flex">
              <span>Chế độ:</span>
              <span className="text-amber-400 font-medium">{activeThemeName}</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400">Quay hòm ngẫu nhiên chọn món</span>
            </p>
          </div>
        </div>

        {/* Tactical HUD Stats & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* StatTrak Counter */}
          <div
            id="stattrak-counter"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-orange-500/30 shadow-inner"
            title="Số lần quay hòm hôm nay"
          >
            <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider font-game">StatTrak™</span>
            <span className="font-game font-mono font-bold text-orange-400 text-sm tracking-widest">
              {String(spinCount).padStart(4, '0')}
            </span>
          </div>

          {/* Manage Food Pool Button */}
          <button
            id="open-pool-manager-btn"
            onClick={onOpenPoolManager}
            disabled={isSpinning}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition disabled:opacity-50"
            title="Tùy chỉnh danh sách món ăn & thêm món riêng"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Kho Món Ăn</span>
            <span className="sm:hidden">Kho Món</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={toggleSound}
            className={`p-2 rounded-lg border transition ${
              soundOn
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20'
                : 'bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800'
            }`}
            title={soundOn ? 'Tắt âm thanh hiệu ứng' : 'Bật âm thanh hiệu ứng'}
            aria-label={soundOn ? 'Mute' : 'Unmute'}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
