import React, { useEffect, useRef, useState } from 'react';
import { FoodItem, Rarity } from '../types';
import { RARITY_CONFIG } from '../data/foodData';
import { playTickSound } from '../utils/soundEffects';

interface CSGOCaseWheelProps {
  isSpinning: boolean;
  spinningItems: FoodItem[];
  targetItem: FoodItem | null;
  onSpinComplete: (item: FoodItem) => void;
}

const CARD_WIDTH = 176; // px
const CARD_GAP = 12; // px
const ITEM_TOTAL_WIDTH = CARD_WIDTH + CARD_GAP; // 188px
const TARGET_INDEX = 42; // Index where the winning item is placed

export const CSGOCaseWheel: React.FC<CSGOCaseWheelProps> = ({
  isSpinning,
  spinningItems,
  targetItem,
  onSpinComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [transitionStyle, setTransitionStyle] = useState('none');
  const animationFrameRef = useRef<number | null>(null);
  const lastTickCardRef = useRef<number>(-1);

  // When spinning starts
  useEffect(() => {
    if (!isSpinning || !targetItem || spinningItems.length <= TARGET_INDEX) {
      return;
    }

    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const centerPoint = containerWidth / 2;

    // Reset to start position
    setTransitionStyle('none');
    setTranslateX(0);
    lastTickCardRef.current = -1;

    // Random offset within the target card (-45px to +45px) so it's realistically off-center
    const randomOffset = (Math.random() - 0.5) * 80;
    const targetCardCenter = TARGET_INDEX * ITEM_TOTAL_WIDTH + CARD_WIDTH / 2;
    const finalTranslate = -(targetCardCenter - centerPoint + randomOffset);

    const spinDurationMs = 5600;
    const startTime = performance.now();

    // Trigger transition on next frame
    const timer = requestAnimationFrame(() => {
      setTransitionStyle(`transform ${spinDurationMs}ms cubic-bezier(0.12, 0.85, 0.25, 1)`);
      setTranslateX(finalTranslate);
    });

    // Audio ticking tracker using requestAnimationFrame
    const trackTicks = (now: number) => {
      if (!trackRef.current || !containerRef.current) return;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / spinDurationMs, 1);

      // Compute current transform from matrix
      const style = window.getComputedStyle(trackRef.current);
      const matrix = new DOMMatrixReadOnly(style.transform);
      const currentX = matrix.m41;

      // Determine which card is currently aligned with the center needle
      const currentNeedleX = -currentX + centerPoint;
      const currentCardIdx = Math.floor(currentNeedleX / ITEM_TOTAL_WIDTH);

      if (currentCardIdx !== lastTickCardRef.current && currentCardIdx >= 0 && currentCardIdx <= TARGET_INDEX + 2) {
        lastTickCardRef.current = currentCardIdx;
        // Pitch shifts down slightly as it decelerates
        const pitchRatio = 1 - progress * 0.3;
        playTickSound(pitchRatio);
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(trackTicks);
      }
    };

    animationFrameRef.current = requestAnimationFrame(trackTicks);

    // Completion timeout
    const completeTimer = setTimeout(() => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      onSpinComplete(targetItem);
    }, spinDurationMs + 200);

    return () => {
      cancelAnimationFrame(timer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearTimeout(completeTimer);
    };
  }, [isSpinning, targetItem, spinningItems, onSpinComplete]);

  const getRarityGlow = (rarity: Rarity) => {
    switch (rarity) {
      case 'gold':
        return 'border-amber-400/90 shadow-[0_0_20px_rgba(251,191,36,0.5)]';
      case 'red':
        return 'border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.4)]';
      case 'pink':
        return 'border-pink-500/80 shadow-[0_0_15px_rgba(236,72,153,0.35)]';
      case 'purple':
        return 'border-purple-500/70 shadow-[0_0_12px_rgba(168,85,247,0.3)]';
      default:
        return 'border-blue-500/60 shadow-[0_0_10px_rgba(59,130,246,0.25)]';
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto my-4 overflow-hidden rounded-xl border border-slate-700/80 bg-slate-950/90 shadow-2xl p-2 sm:p-3">
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between px-3 py-1.5 mb-2 bg-slate-900/90 border border-slate-800 rounded-lg text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>
          <span className="font-game text-slate-300 uppercase tracking-wider font-semibold">
            CS:GO Lunch Carousel Reel
          </span>
        </div>
        <div className="text-slate-400 font-mono text-[11px]">
          {isSpinning ? (
            <span className="text-amber-400 font-bold animate-pulse">ĐANG QUAY HÒM...</span>
          ) : (
            <span>SẴN SÀNG QUAY</span>
          )}
        </div>
      </div>

      {/* Main Roulette Reel Container */}
      <div
        id="csgo-wheel-viewport"
        ref={containerRef}
        className="relative h-56 sm:h-64 w-full overflow-hidden rounded-lg bg-gradient-to-b from-slate-900 via-slate-950 to-black border-y-2 border-slate-700/80 select-none shadow-inner"
      >
        {/* Subtle background hazard lines */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #000, #000 12px, #fff 12px, #fff 24px)',
          }}
        />

        {/* Center Needle & Laser Line Indicator */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center justify-between">
          {/* Top Yellow Needle */}
          <div className="w-0 h-0 border-x-[11px] border-x-transparent border-t-[18px] border-t-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-pulse" />

          {/* Central Vertical Laser Beam */}
          <div className="w-[3px] h-full bg-gradient-to-b from-amber-400 via-amber-300 to-amber-400 opacity-90 shadow-[0_0_12px_rgba(251,191,36,1)]" />

          {/* Bottom Yellow Needle */}
          <div className="w-0 h-0 border-x-[11px] border-x-transparent border-b-[18px] border-b-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-pulse" />
        </div>

        {/* Left & Right Edge Vignette Fades */}
        <div className="absolute inset-y-0 left-0 w-20 sm:w-28 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 sm:w-28 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent z-20 pointer-events-none" />

        {/* Moving Items Strip */}
        <div
          ref={trackRef}
          id="csgo-wheel-strip"
          className="absolute left-0 top-3 bottom-3 flex items-center gap-3 transition-transform"
          style={{
            transform: `translateX(${translateX}px)`,
            transition: transitionStyle,
            willChange: 'transform',
          }}
        >
          {spinningItems.map((item, idx) => {
            const rarityConf = RARITY_CONFIG[item.rarity];
            const glowClass = getRarityGlow(item.rarity);

            return (
              <div
                key={`${item.id}-${idx}`}
                className={`relative flex-shrink-0 w-44 sm:w-48 h-full rounded-lg bg-slate-900/90 border-2 ${glowClass} flex flex-col justify-between overflow-hidden transition group`}
                style={{ width: `${CARD_WIDTH}px` }}
              >
                {/* Rarity Stripe Header */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: rarityConf.borderHex }}
                />

                {/* Top Badge: Category & Price */}
                <div className="p-2 flex items-center justify-between gap-1 z-10">
                  <span className="text-[10px] font-semibold text-slate-300 bg-slate-950/70 px-1.5 py-0.5 rounded backdrop-blur">
                    {item.category}
                  </span>
                  <span className="text-[11px] font-bold text-amber-400 font-mono">
                    {item.priceVnd.toLocaleString('vi-VN')}đ
                  </span>
                </div>

                {/* Center Food Image */}
                <div className="relative flex-1 flex items-center justify-center px-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-md shadow-md border border-slate-700/60 group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                  {/* Holographic light streak */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                      background: `radial-gradient(circle at center, ${rarityConf.borderHex} 0%, transparent 70%)`,
                    }}
                  />
                </div>

                {/* Bottom Food Name & Quality */}
                <div className="p-2 bg-gradient-to-t from-slate-950 to-slate-950/80 border-t border-slate-800 z-10">
                  <p className="text-xs font-bold text-slate-100 truncate text-center" title={item.name}>
                    {item.name}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                    <span
                      className="font-medium truncate max-w-[90px]"
                      style={{ color: rarityConf.borderHex }}
                    >
                      {rarityConf.name.split(' ')[0]}
                    </span>
                    <span className="font-mono text-slate-400">{item.condition}</span>
                  </div>
                </div>

                {/* Bottom Rarity Line */}
                <div
                  className="h-1 w-full"
                  style={{ backgroundColor: rarityConf.borderHex }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
