import React from 'react';
import { DropHistoryItem } from '../types';
import { RARITY_CONFIG } from '../data/foodData';
import { History, Sparkles } from 'lucide-react';

interface RecentDropsHistoryProps {
  history: DropHistoryItem[];
  onSelectDrop: (item: DropHistoryItem) => void;
}

export const RecentDropsHistory: React.FC<RecentDropsHistoryProps> = ({
  history,
  onSelectDrop,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-5xl mx-auto my-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-amber-400" />
          <h3 className="font-game text-xs sm:text-sm font-bold tracking-wider text-slate-300 uppercase">
            Nhật Ký Mở Hòm Vừa Rơi (Live Unbox Feed)
          </h3>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">
          {history.length} lần mở gần nhất
        </span>
      </div>

      {/* Horizontal scrolling strip */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
        {history.map((drop) => {
          const conf = RARITY_CONFIG[drop.food.rarity];
          const timeFormatted = new Date(drop.timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <button
              key={drop.id}
              onClick={() => onSelectDrop(drop)}
              className="flex-shrink-0 w-44 p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-left transition flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Colored top rarity bar */}
              <div
                className="absolute top-0 inset-x-0 h-1"
                style={{ backgroundColor: conf.borderHex }}
              />

              <div className="flex items-center gap-2 mt-1">
                <img
                  src={drop.food.image}
                  alt={drop.food.name}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 object-cover rounded-md border border-slate-700 flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-slate-200 truncate group-hover:text-amber-300 transition">
                    {drop.food.name}
                  </p>
                  <p className="text-[10px] font-mono text-amber-400">
                    {drop.food.priceVnd.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/80 text-[9px] text-slate-500">
                <span className="truncate max-w-[80px]" style={{ color: conf.borderHex }}>
                  {drop.userName}
                </span>
                <span>{timeFormatted}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
