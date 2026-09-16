import React from 'react';
import { CRATE_THEMES } from '../data/foodData';
import { CrateTheme } from '../types';
import { Package, ShieldCheck } from 'lucide-react';

interface CrateThemeSelectorProps {
  selectedThemeId: string;
  onSelectTheme: (theme: CrateTheme) => void;
  isSpinning: boolean;
}

export const CrateThemeSelector: React.FC<CrateThemeSelectorProps> = ({
  selectedThemeId,
  onSelectTheme,
  isSpinning,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto my-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-amber-400" />
          <h3 className="font-game text-xs sm:text-sm font-bold tracking-wider text-slate-300 uppercase">
            Chọn Hòm Vũ Khí Ẩm Thực (Weapon Cases):
          </h3>
        </div>
        <span className="text-[11px] text-slate-500 hidden sm:inline">
          5 loại hòm theo phong cách & mức giá
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        {CRATE_THEMES.map((theme) => {
          const isSelected = selectedThemeId === theme.id;
          return (
            <button
              key={theme.id}
              id={`theme-${theme.id}`}
              onClick={() => onSelectTheme(theme)}
              disabled={isSpinning}
              className={`relative p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between overflow-hidden group ${
                isSelected
                  ? 'bg-slate-900 border-amber-500/90 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50 scale-[1.02]'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              } disabled:opacity-50`}
            >
              {/* Subtle accent bar at top */}
              <div
                className="absolute top-0 inset-x-0 h-1"
                style={{ backgroundColor: isSelected ? theme.borderColor : 'transparent' }}
              />

              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl filter drop-shadow group-hover:scale-110 transition-transform">
                  {theme.icon}
                </span>
                {isSelected && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold font-game bg-amber-500 text-slate-950">
                    ĐANG CHỌN
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-game text-xs font-bold text-slate-100 line-clamp-1">
                  {theme.name}
                </h4>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-tight">
                  {theme.subtitle}
                </p>
              </div>

              {/* Price badge */}
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-amber-400">
                <span>Giá:</span>
                <span>
                  {theme.maxPrice < 500000
                    ? theme.minPrice > 0
                      ? `${(theme.minPrice / 1000)}k - ${(theme.maxPrice / 1000)}k`
                      : `< ${(theme.maxPrice / 1000)}k`
                    : 'Tất cả'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
