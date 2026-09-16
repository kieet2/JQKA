import React from 'react';
import { BUDGET_PRESETS, RARITY_CONFIG } from '../data/foodData';
import { BudgetPreset, Rarity, FoodItem } from '../types';
import { DollarSign, SlidersHorizontal, Filter, CheckCircle2, Utensils, Search, ExternalLink, Sparkles } from 'lucide-react';

interface BudgetFilterProps {
  minBudget: number;
  maxBudget: number;
  onBudgetChange: (min: number, max: number) => void;
  selectedPresetId: string;
  onSelectPreset: (preset: BudgetPreset) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedRarity: Rarity | 'all';
  onSelectRarity: (rarity: Rarity | 'all') => void;
  matchingCount: number;
  totalCount: number;
  isSpinning: boolean;
  matchingFoods: FoodItem[];
  onSelectItem: (item: FoodItem) => void;
}

const CATEGORIES = [
  'Tất cả',
  'Cơm',
  'Bún / Phở',
  'Mì / Hủ Tiếu',
  'Bánh Mì / Cuốn',
  'Món Nước',
  'Ăn Nhanh / Fastfood',
  'Lẩu / Nướng & Ăn Sang',
];

export const BudgetFilter: React.FC<BudgetFilterProps> = ({
  minBudget,
  maxBudget,
  onBudgetChange,
  selectedPresetId,
  onSelectPreset,
  selectedCategory,
  onSelectCategory,
  selectedRarity,
  onSelectRarity,
  matchingCount,
  totalCount,
  isSpinning,
  matchingFoods,
  onSelectItem,
}) => {
  const handleQuickAddMax = (amount: number) => {
    onBudgetChange(minBudget, Math.max(minBudget + 5000, maxBudget + amount));
  };

  return (
    <div
      id="budget-filter-section"
      className="w-full max-w-5xl mx-auto my-6 rounded-2xl bg-slate-900/80 border border-slate-800 p-4 sm:p-6 shadow-xl backdrop-blur-sm"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-game text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              BỘ LỌC NGÂN SÁCH & SỞ THÍCH
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-sans font-medium border border-emerald-500/40">
                {matchingCount} / {totalCount} món phù hợp
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Chỉ các món ăn nằm trong khoảng giá này mới xuất hiện trong vòng quay hòm CS:GO
            </p>
          </div>
        </div>
      </div>

      {/* Preset Budget Chips */}
      <div className="mt-4">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 font-game">
          Gợi ý ngân sách nhanh:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {BUDGET_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                id={`preset-${preset.id}`}
                onClick={() => onSelectPreset(preset)}
                disabled={isSpinning}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/80 text-amber-300 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-950'
                } disabled:opacity-50`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">{preset.icon}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <div className="mt-1">
                  <p className="text-xs font-bold font-game tracking-wide">{preset.label}</p>
                  <p className="text-[10px] text-slate-400 truncate">{preset.subLabel}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Budget Sliders & Manual Inputs */}
      <div className="mt-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Min & Max Inputs */}
          <div className="flex-1 flex items-center gap-3">
            <div className="flex-1">
              <span className="text-[11px] text-slate-400 font-medium block mb-1">
                Tối thiểu (VND):
              </span>
              <div className="relative">
                <input
                  type="number"
                  step="5000"
                  min="0"
                  max={maxBudget - 5000}
                  value={minBudget}
                  disabled={isSpinning}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    onBudgetChange(val, Math.max(val + 5000, maxBudget));
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-500 disabled:opacity-50"
                />
                <span className="absolute right-2.5 top-2 text-xs text-slate-500 font-medium pointer-events-none">
                  đ
                </span>
              </div>
            </div>

            <span className="text-slate-600 font-bold self-end pb-2.5">—</span>

            <div className="flex-1">
              <span className="text-[11px] text-slate-400 font-medium block mb-1">
                Tối đa (VND):
              </span>
              <div className="relative">
                <input
                  type="number"
                  step="5000"
                  min={minBudget + 5000}
                  max="500000"
                  value={maxBudget}
                  disabled={isSpinning}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 50000;
                    onBudgetChange(minBudget, Math.max(minBudget + 5000, val));
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-500 disabled:opacity-50"
                />
                <span className="absolute right-2.5 top-2 text-xs text-slate-500 font-medium pointer-events-none">
                  đ
                </span>
              </div>
            </div>
          </div>

          {/* Quick Increment Buttons */}
          <div className="flex items-center gap-1.5 self-end pb-0.5">
            <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Cộng nhanh:</span>
            <button
              onClick={() => handleQuickAddMax(10000)}
              disabled={isSpinning}
              className="px-2 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
            >
              +10k
            </button>
            <button
              onClick={() => handleQuickAddMax(20000)}
              disabled={isSpinning}
              className="px-2 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
            >
              +20k
            </button>
            <button
              onClick={() => handleQuickAddMax(50000)}
              disabled={isSpinning}
              className="px-2 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
            >
              +50k
            </button>
          </div>
        </div>

        {/* Range Slider for Max Budget */}
        <div className="mt-3">
          <input
            type="range"
            min="15000"
            max="300000"
            step="5000"
            value={maxBudget}
            disabled={isSpinning}
            onChange={(e) => {
              const val = Number(e.target.value);
              onBudgetChange(minBudget, Math.max(minBudget + 5000, val));
            }}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>15.000đ (Bình dân)</span>
            <span>70.000đ (Cơm niêu / Bún đậu)</span>
            <span>150.000đ (Bít tết / Lẩu)</span>
            <span>300.000đ+ (Dao Vàng)</span>
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="mt-4">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 font-game">
          Lọc theo thể loại món:
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const isCatActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                disabled={isSpinning}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
                  isCatActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-950/70 border border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                } disabled:opacity-50`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* CS:GO Rarity Filter Pills */}
      <div className="mt-3">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 font-game">
          Lọc theo độ hiếm CS:GO:
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onSelectRarity('all')}
            disabled={isSpinning}
            className={`px-2.5 py-1 text-[11px] rounded-md font-semibold transition ${
              selectedRarity === 'all'
                ? 'bg-slate-200 text-slate-950'
                : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Tất cả phẩm cấp
          </button>

          {(['blue', 'purple', 'pink', 'red', 'gold'] as Rarity[]).map((r) => {
            const conf = RARITY_CONFIG[r];
            const isRarityActive = selectedRarity === r;
            return (
              <button
                key={r}
                onClick={() => onSelectRarity(r)}
                disabled={isSpinning}
                className={`px-2.5 py-1 text-[11px] rounded-md font-semibold transition border ${
                  isRarityActive
                    ? `${conf.bgBadge} font-bold ring-1`
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
                style={{
                  color: isRarityActive ? conf.borderHex : undefined,
                  borderColor: isRarityActive ? conf.borderHex : undefined,
                }}
              >
                {conf.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Matching Foods List according to Active Filters */}
      <div className="mt-6 pt-5 border-t border-slate-800/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-amber-400" />
            <h4 className="font-game text-xs sm:text-sm font-bold tracking-wider text-slate-200 uppercase">
              DANH SÁCH MÓN ĂN TRONG HÒM ({matchingFoods.length} MÓN)
            </h4>
          </div>
          <span className="text-[11px] text-slate-400 font-sans">
            Nhấp vào bất kỳ món nào để xem thông tin chi tiết & gợi ý quán
          </span>
        </div>

        {matchingFoods.length === 0 ? (
          <div className="p-8 rounded-xl bg-slate-950/70 border border-slate-800 text-center flex flex-col items-center justify-center">
            <p className="text-sm font-semibold text-slate-400 mb-1">
              Không tìm thấy món ăn nào phù hợp với bộ lọc hiện tại
            </p>
            <p className="text-xs text-slate-500 mb-4">
              Hãy thử nới rộng ngân sách hoặc chuyển thể loại món về "Tất cả"
            </p>
            <button
              onClick={() => {
                onSelectCategory('Tất cả');
                onSelectRarity('all');
                onBudgetChange(0, 200000);
              }}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-400 transition"
            >
              Đặt lại bộ lọc về mặc định
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
            {matchingFoods.map((food) => {
              const conf = RARITY_CONFIG[food.rarity];
              return (
                <button
                  key={food.id}
                  onClick={() => onSelectItem(food)}
                  className="group relative rounded-xl bg-slate-950/90 border border-slate-800/90 hover:border-slate-600 p-2 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between overflow-hidden"
                  style={{
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  {/* Top Colored Rarity Bar */}
                  <div
                    className="absolute top-0 inset-x-0 h-1 transition-all group-hover:h-1.5"
                    style={{ backgroundColor: conf.borderHex }}
                  />

                  {/* Food Image Container */}
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-slate-900 border border-slate-800/80 mb-2 mt-1">
                    <img
                      src={food.image}
                      alt={food.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    {/* StatTrak / Condition Badge */}
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-slate-950/80 backdrop-blur-sm border border-slate-700/80 text-[9px] font-mono font-bold text-amber-400">
                      {food.isStatTrak ? 'ST™' : 'FN'}
                    </div>

                    {/* Quick Inspect icon overlay on hover */}
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="px-2 py-0.5 rounded bg-slate-900/90 border border-amber-400/80 text-[9px] font-game font-bold text-amber-300">
                        XEM CHI TIẾT
                      </span>
                    </div>
                  </div>

                  {/* Dish Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p
                        className="text-[10px] font-mono font-bold uppercase truncate"
                        style={{ color: conf.borderHex }}
                      >
                        {conf.name.split(' ')[0]}
                      </p>
                      <h5 className="font-sans font-bold text-xs text-slate-100 line-clamp-1 group-hover:text-amber-300 transition-colors">
                        {food.name}
                      </h5>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs font-mono font-black text-amber-400">
                        {food.priceVnd.toLocaleString('vi-VN')}đ
                      </span>
                      <span className="text-[9px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 truncate max-w-[65px]">
                        {food.category}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
