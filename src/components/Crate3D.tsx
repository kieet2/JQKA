import React, { useState, useRef, MouseEvent } from 'react';
import { CrateTheme, FoodItem } from '../types';
import { Lock, Unlock, Play, Sparkles, AlertTriangle, Flame } from 'lucide-react';
import { RARITY_CONFIG } from '../data/foodData';

interface Crate3DProps {
  currentTheme: CrateTheme;
  isSpinning: boolean;
  isOpening: boolean;
  unboxedItem: FoodItem | null;
  onStartSpin: () => void;
  filteredCount: number;
}

export const Crate3D: React.FC<Crate3DProps> = ({
  currentTheme,
  isSpinning,
  isOpening,
  unboxedItem,
  onStartSpin,
  filteredCount,
}) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D tilt tracking
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isSpinning) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Limit rotation to -12 to 12 degrees
    const rotateX = -(y / (rect.height / 2)) * 10;
    const rotateY = (x / (rect.width / 2)) * 12;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSpinning && filteredCount > 0) {
      onStartSpin();
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto my-6 flex flex-col items-center">
      {/* 3D Crate Perspective Wrapper */}
      <div
        id="crate-3d-wrapper"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative w-80 sm:w-96 h-72 sm:h-80 select-none perspective-1000 flex items-center justify-center transition-all duration-300 ${
          filteredCount > 0 && !isSpinning ? 'cursor-pointer group' : ''
        }`}
        onClick={() => {
          if (!isSpinning && filteredCount > 0) {
            onStartSpin();
          }
        }}
      >
        {/* 3D Holographic Loading Rings (appears when isSpinning / loading) */}
        {isSpinning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 preserve-3d">
            {/* Outer Hologram Ring */}
            <div className="absolute w-[340px] sm:w-[400px] h-[340px] sm:h-[400px] rounded-full border-2 border-dashed border-amber-400/80 animate-rotate-ring shadow-[0_0_30px_rgba(251,191,36,0.6)]" />
            {/* Inner Reverse Ring */}
            <div className="absolute w-[280px] sm:w-[320px] h-[280px] sm:h-[320px] rounded-full border border-amber-300/60 animate-rotate-ring-rev shadow-[0_0_20px_rgba(251,191,36,0.4)]" />
            {/* Upward Laser Particle Pillar */}
            <div className="absolute -top-12 inset-x-12 h-36 bg-gradient-to-t from-amber-500/25 via-amber-400/10 to-transparent blur-md pointer-events-none" />
          </div>
        )}

        {/* Glow halo behind crate */}
        <div
          className={`absolute -inset-6 rounded-3xl opacity-40 blur-2xl transition-all duration-700 pointer-events-none ${
            isOpening
              ? 'bg-amber-400 opacity-90 scale-115'
              : isSpinning
              ? 'bg-amber-500 opacity-70 scale-110 animate-pulse'
              : 'bg-amber-600/30 group-hover:opacity-60 group-hover:scale-105'
          }`}
          style={{
            background: isOpening && unboxedItem
              ? RARITY_CONFIG[unboxedItem.rarity].borderHex
              : undefined,
          }}
        />

        {/* 3D Box Body with Dynamic Rotation & Rumble during Loading */}
        <div
          className={`relative w-full h-full preserve-3d transition-transform duration-150 ease-out ${
            isSpinning ? 'animate-rumble' : ''
          }`}
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateZ(${isSpinning ? '20px' : '0px'})`,
          }}
        >
          {/* Main Crate Shell */}
          <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border-2 border-slate-700/80 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col justify-between overflow-hidden">
            {/* 3D Laser Scanline (active when isSpinning) */}
            {isSpinning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_15px_rgba(251,191,36,1)] z-30 animate-scanline pointer-events-none" />
            )}

            {/* Top Hazard Warning Strip */}
            <div className="h-7 w-full bg-amber-500 flex items-center justify-between px-3 text-slate-950 font-game font-bold text-xs shadow-md z-20">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>CS:GO FOOD CRATE</span>
              </span>
              <span className="tracking-widest text-[10px] hidden sm:inline">
                HIGH ENERGY MEAL // 2026
              </span>
              <Flame className="w-3.5 h-3.5" />
            </div>

            {/* Crate Center Core */}
            <div className="relative flex-1 flex flex-col items-center justify-between p-4">
              {/* Background military grid & stamp */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
              />

              {/* Steel Reinforced Corner Brackets */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400/80" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400/80" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400/80" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400/80" />

              {/* 3D Top Lid Opening Animation Indicator */}
              <div
                className={`absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-slate-700/95 to-slate-800/95 border-b-2 border-amber-500/80 shadow-lg transition-transform duration-700 origin-top flex items-center justify-center z-20 ${
                  isOpening ? '-translate-y-8 -rotate-x-45 opacity-60' : ''
                }`}
              >
                <div className="flex items-center gap-2 px-3 py-1 rounded bg-slate-950/80 border border-slate-700 text-[10px] font-mono text-slate-300">
                  <span className={`h-1.5 w-1.5 rounded-full ${isSpinning ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
                  <span>{isSpinning ? 'UNSEALING CONTAINER...' : 'SECURITY SEAL: ACTIVE'}</span>
                </div>
              </div>

              {/* Holographic Crate Badge / Icon */}
              <div className="relative my-auto flex flex-col items-center gap-2 z-10 pt-2">
                <div className="relative w-16 h-16 rounded-xl bg-slate-900/90 border-2 border-amber-500/60 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                  <span className="text-3xl filter drop-shadow">{currentTheme.icon}</span>
                  {/* Subtle spinning radar on icon when loading */}
                  {isSpinning && (
                    <div className="absolute inset-0 rounded-xl border border-amber-400/80 animate-ping" />
                  )}
                </div>

                <div className="text-center">
                  <h3 className="font-game text-base sm:text-lg font-bold text-slate-100 tracking-wide">
                    {currentTheme.name}
                  </h3>
                  <p className="text-xs text-amber-400 font-medium">
                    {currentTheme.subtitle}
                  </p>
                </div>
              </div>

              {/* Replaced Button Directly in Place of the Old Badge */}
              <div className="relative w-full flex items-center justify-center z-30 pb-1">
                {isOpening ? (
                  <div className="flex items-center gap-2 px-5 py-2 rounded-full border-2 border-emerald-400 bg-emerald-500/25 text-emerald-300 font-game font-bold text-xs shadow-lg shadow-emerald-500/30 animate-pulse">
                    <Unlock className="w-4 h-4 text-emerald-400 animate-bounce" />
                    <span>ĐÃ MỞ KHÓA HÒM!</span>
                  </div>
                ) : isSpinning ? (
                  /* 3D Loading Status Effect */
                  <div className="flex items-center gap-2.5 px-6 py-2.5 rounded-xl border-2 border-amber-400 bg-gradient-to-r from-amber-600/40 via-amber-500/40 to-amber-600/40 text-amber-200 font-game font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(251,191,36,0.5)]">
                    <div className="relative flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                      <div className="absolute inset-0 rounded-full bg-amber-400/30 animate-ping" />
                    </div>
                    <span className="tracking-wider">ĐANG QUAY HÒM 3D...</span>
                  </div>
                ) : filteredCount === 0 ? (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 bg-slate-900/90 text-slate-500 font-game font-bold text-xs cursor-not-allowed">
                    <Lock className="w-3.5 h-3.5 text-slate-600" />
                    <span>HẾT MÓN TRONG NGÂN SÁCH</span>
                  </div>
                ) : (
                  /* "Mở hòm ngay" Interactive Button inside Crate */
                  <button
                    id="btn-open-crate-inside"
                    onClick={handleActionClick}
                    className="relative group/btn px-6 sm:px-7 py-2.5 rounded-xl font-game text-xs sm:text-sm font-black tracking-wider uppercase transition-all duration-300 shadow-xl flex items-center gap-2 overflow-hidden bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 border-2 border-amber-200 hover:shadow-[0_0_25px_rgba(251,191,36,0.6)] hover:scale-105 active:scale-95"
                  >
                    {/* Animated Light Sweep */}
                    <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

                    <Play className="w-4 h-4 fill-current text-slate-950" />
                    <span>Mở Hòm Ngay ({filteredCount} Món)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Metallic Trim with Ventilation Slots */}
            <div className="h-6 w-full bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-1.5 px-4 z-20">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-2 w-4 rounded-sm bg-slate-800 border border-slate-900" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
