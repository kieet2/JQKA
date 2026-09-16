import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { FoodItem } from '../types';
import { RARITY_CONFIG } from '../data/foodData';
import { playDropSound } from '../utils/soundEffects';
import {
  ExternalLink,
  RotateCcw,
  Share2,
  Check,
  Flame,
  Zap,
  MapPin,
  ShoppingBag,
  Sparkles,
  Ban,
  X,
} from 'lucide-react';

interface FoodResultModalProps {
  item: FoodItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSpinAgain: () => void;
  onExcludeItem: (item: FoodItem) => void;
}

export const FoodResultModal: React.FC<FoodResultModalProps> = ({
  item,
  isOpen,
  onClose,
  onSpinAgain,
  onExcludeItem,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !item) return;

    // Trigger audio fanfare
    playDropSound(item.rarity);

    // Trigger celebratory confetti
    const count = item.rarity === 'gold' ? 120 : item.rarity === 'red' ? 80 : 40;
    const colors =
      item.rarity === 'gold'
        ? ['#ffd700', '#f59e0b', '#fbbf24', '#ffffff']
        : item.rarity === 'red'
        ? ['#ef4444', '#dc2626', '#fca5a5', '#ffd700']
        : item.rarity === 'pink'
        ? ['#ec4899', '#db2777', '#f472b6']
        : ['#3b82f6', '#60a5fa', '#93c5fd'];

    try {
      confetti({
        particleCount: count,
        spread: 70,
        origin: { y: 0.6 },
        colors,
      });
    } catch {
      // Confetti fallback
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const rarityConf = RARITY_CONFIG[item.rarity];

  const handleShare = async () => {
    const text = `🎯 Trưa nay hòm CS:GO rơi ra món: "${item.name}" (${item.priceDisplay})! Đi ăn cùng tôi không?`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenGoogleMaps = () => {
    const query = encodeURIComponent(`${item.name} gần đây`);
    window.open(`https://www.google.com/maps/search/${query}`, '_blank', 'noopener,noreferrer');
  };

  const handleOpenShopeeFood = () => {
    const query = encodeURIComponent(item.name);
    window.open(`https://shopeefood.vn/tim-kiem?q=${query}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id="food-result-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="food-result-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-300 transform scale-100"
        style={{ borderColor: rarityConf.borderHex }}
      >
        {/* Top Header Strip with Rarity Accent */}
        <div
          className="h-2 w-full"
          style={{ backgroundColor: rarityConf.borderHex }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 sm:p-7">
          {/* CS:GO Unboxed Weapon / Dish Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-game uppercase tracking-wider mb-2 border shadow-lg"
              style={{
                color: rarityConf.borderHex,
                backgroundColor: `${rarityConf.borderHex}18`,
                borderColor: `${rarityConf.borderHex}50`,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ĐÃ MỞ HÒM THÀNH CÔNG: {rarityConf.name}</span>
            </div>

            <h2 className="font-game text-xl sm:text-2xl font-black text-slate-100 tracking-wide mt-1">
              {item.name}
            </h2>

            <div className="flex items-center justify-center gap-3 mt-1 text-xs text-slate-400">
              <span className="font-mono text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/30">
                StatTrak™ {item.condition}
              </span>
              <span>•</span>
              <span className="text-slate-300 font-medium">{item.category}</span>
            </div>
          </div>

          {/* 3D Holographic Image Showcase */}
          <div className="relative my-4 flex items-center justify-center">
            {/* Ambient Radial Glow */}
            <div
              className="absolute inset-0 rounded-2xl opacity-40 blur-2xl pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${rarityConf.borderHex} 0%, transparent 70%)`,
              }}
            />

            <div className="relative z-10 w-full h-56 sm:h-64 rounded-xl overflow-hidden border border-slate-700 shadow-2xl group">
              <img
                src={item.image}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Price Tag Overlay */}
              <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 shadow-lg flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-game">Giá:</span>
                <span className="text-sm font-bold text-amber-400 font-mono">
                  {item.priceDisplay}
                </span>
              </div>

              {/* Calories & Spicy Level */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <div className="bg-slate-950/85 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-700 shadow-lg flex items-center gap-1 text-[11px] text-amber-300 font-mono font-semibold">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>{item.calories} kcal</span>
                </div>
              </div>

              {/* Flavor tags strip at bottom */}
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex flex-wrap gap-1.5">
                {item.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold bg-slate-900/90 text-slate-300 px-2 py-0.5 rounded border border-slate-700/80"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Description narrative */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>{item.description}</p>
          </div>

          {/* Action Buttons Grid */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Google Maps Button */}
            <button
              id="btn-maps-search"
              onClick={handleOpenGoogleMaps}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition"
            >
              <MapPin className="w-4 h-4" />
              <span>Tìm Quán Gần Đây (Maps)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* Delivery App Button */}
            <button
              id="btn-delivery-order"
              onClick={handleOpenShopeeFood}
              className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Đặt Món ShopeeFood</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </button>
          </div>

          {/* Secondary Controls */}
          <div className="mt-3 flex items-center justify-between gap-2 pt-3 border-t border-slate-800 text-xs">
            {/* Spin Again */}
            <button
              id="btn-spin-again"
              onClick={() => {
                onClose();
                onSpinAgain();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-400 font-bold transition font-game"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Quay Lại (Mở Tiếp)</span>
            </button>

            {/* Share link/text */}
            <button
              id="btn-share-dish"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép!' : 'Chia sẻ món này'}</span>
            </button>

            {/* Exclude today */}
            <button
              id="btn-exclude-dish"
              onClick={() => {
                onExcludeItem(item);
                onClose();
              }}
              className="flex items-center gap-1 px-2.5 py-2 rounded-lg bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-900/50 transition text-[11px]"
              title="Không muốn ăn món này hôm nay"
            >
              <Ban className="w-3 h-3" />
              <span className="hidden sm:inline">Ẩn hôm nay</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
