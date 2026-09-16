import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FoodItem, CrateTheme, DropHistoryItem, BudgetPreset, Rarity } from './types';
import { INITIAL_FOOD_ITEMS, BUDGET_PRESETS, CRATE_THEMES } from './data/foodData';
import { HeaderBar } from './components/HeaderBar';
import { CSGOCaseWheel } from './components/CSGOCaseWheel';
import { Crate3D } from './components/Crate3D';
import { BudgetFilter } from './components/BudgetFilter';
import { CrateThemeSelector } from './components/CrateThemeSelector';
import { FoodResultModal } from './components/FoodResultModal';
import { FoodPoolManager } from './components/FoodPoolManager';
import { RecentDropsHistory } from './components/RecentDropsHistory';
import { playCaseUnlockSound, setSoundEnabled } from './utils/soundEffects';
import { Info, Sparkles, ChefHat } from 'lucide-react';

const STORAGE_CUSTOM_FOODS = 'csgo_lunch_custom_foods';
const STORAGE_EXCLUDED_FOODS = 'csgo_lunch_excluded_foods';
const STORAGE_SPIN_COUNT = 'csgo_lunch_spin_count';
const STORAGE_SOUND_PREF = 'csgo_lunch_sound_pref';

export default function App() {
  // All available food pool
  const [foodPool, setFoodPool] = useState<FoodItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_FOODS);
      if (saved) {
        const customItems: FoodItem[] = JSON.parse(saved);
        return [...INITIAL_FOOD_ITEMS, ...customItems];
      }
    } catch {
      // fallback
    }
    return INITIAL_FOOD_ITEMS;
  });

  // Excluded food item IDs
  const [excludedIds, setExcludedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_EXCLUDED_FOODS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Spin count
  const [spinCount, setSpinCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SPIN_COUNT);
      if (saved) return Number(saved) || 0;
    } catch {
      // fallback
    }
    return 12; // Initial decorative baseline count
  });

  // Sound preference
  const [soundOn, setSoundOn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SOUND_PREF);
      if (saved !== null) return saved === 'true';
    } catch {
      // fallback
    }
    return true;
  });

  // Detect URL theme parameter (e.g., ?theme=ket-hoi-tho-lun)
  const initialTheme = useMemo(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const themeParam = params.get('theme');
      if (themeParam === 'ket-hoi-tho-lun') {
        return CRATE_THEMES.find((t) => t.id === 'crate_ket_hoi_tho_lun') || CRATE_THEMES[1];
      }
    }
    return CRATE_THEMES[0];
  }, []);

  // Active Crate Theme
  const [selectedTheme, setSelectedTheme] = useState<CrateTheme>(initialTheme);

  // Budget Filters
  const [minBudget, setMinBudget] = useState<number>(initialTheme.minPrice);
  const [maxBudget, setMaxBudget] = useState<number>(initialTheme.maxPrice);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    initialTheme.id === 'crate_ket_hoi_tho_lun' ? 'preset_student' : 'preset_all'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [selectedRarity, setSelectedRarity] = useState<Rarity | 'all'>('all');

  // Spinning & Unboxing State
  const [isSpinning, setIsSpinning] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [spinningStrip, setSpinningStrip] = useState<FoodItem[]>([]);
  const [targetPrize, setTargetPrize] = useState<FoodItem | null>(null);
  const [unboxedResult, setUnboxedResult] = useState<FoodItem | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showPoolManager, setShowPoolManager] = useState(false);

  // Recent drops history
  const [dropHistory, setDropHistory] = useState<DropHistoryItem[]>([
    {
      id: 'drop_seed_1',
      food: INITIAL_FOOD_ITEMS.find((f) => f.id === 'food_com_tam_suon_trung') || INITIAL_FOOD_ITEMS[0],
      timestamp: Date.now() - 1000 * 60 * 3,
      userName: 'Player #102',
    },
    {
      id: 'drop_seed_2',
      food: INITIAL_FOOD_ITEMS.find((f) => f.id === 'food_bun_dau_mam_tom') || INITIAL_FOOD_ITEMS[1],
      timestamp: Date.now() - 1000 * 60 * 8,
      userName: 'OfficeGamer_HN',
    },
    {
      id: 'drop_seed_3',
      food: INITIAL_FOOD_ITEMS.find((f) => f.id === 'food_pho_bo_tai_nam') || INITIAL_FOOD_ITEMS[2],
      timestamp: Date.now() - 1000 * 60 * 15,
      userName: 'LunchHunter',
    },
  ]);

  // Sync sound settings
  useEffect(() => {
    setSoundEnabled(soundOn);
    try {
      localStorage.setItem(STORAGE_SOUND_PREF, String(soundOn));
    } catch {
      // ignore
    }
  }, [soundOn]);

  // Sync exclusions to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_EXCLUDED_FOODS, JSON.stringify(excludedIds));
    } catch {
      // ignore
    }
  }, [excludedIds]);

  // Filtered food list matching user's budget and criteria
  const matchingFoods = useMemo(() => {
    return foodPool.filter((item) => {
      // Excluded check
      if (excludedIds.includes(item.id)) return false;

      // Budget check
      if (item.priceVnd < minBudget || item.priceVnd > maxBudget) return false;

      // Category check
      if (selectedCategory !== 'Tất cả' && item.category !== selectedCategory) {
        return false;
      }

      // Rarity check
      if (selectedRarity !== 'all' && item.rarity !== selectedRarity) {
        return false;
      }

      return true;
    });
  }, [foodPool, excludedIds, minBudget, maxBudget, selectedCategory, selectedRarity]);

  // Initialize initial roulette strip preview with items
  useEffect(() => {
    if (!isSpinning && spinningStrip.length === 0 && matchingFoods.length > 0) {
      const initialStrip: FoodItem[] = [];
      for (let i = 0; i < 55; i++) {
        const item = matchingFoods[i % matchingFoods.length];
        initialStrip.push(item);
      }
      setSpinningStrip(initialStrip);
    }
  }, [matchingFoods, isSpinning, spinningStrip.length]);

  // Handle Preset Budget Change
  const handleSelectPreset = (preset: BudgetPreset) => {
    setSelectedPresetId(preset.id);
    setMinBudget(preset.min);
    setMaxBudget(preset.max);
  };

  // Handle Theme Selection
  const handleSelectTheme = (theme: CrateTheme) => {
    setSelectedTheme(theme);
    setMinBudget(theme.minPrice);
    setMaxBudget(theme.maxPrice);

    // Update preset if matching
    if (theme.id === 'crate_ket_hoi_tho_lun') {
      setSelectedPresetId('preset_student');
    } else if (theme.id === 'crate_cong_so') {
      setSelectedPresetId('preset_office');
    } else if (theme.id === 'crate_dai_gia') {
      setSelectedPresetId('preset_rich');
    } else {
      setSelectedPresetId('preset_all');
    }
  };

  // Start Spin Execution
  const handleStartSpin = useCallback(() => {
    if (isSpinning || matchingFoods.length === 0) return;

    playCaseUnlockSound();
    setIsSpinning(true);
    setIsOpening(false);
    setShowResultModal(false);

    // Select winning prize (weighted random)
    const winningIdx = Math.floor(Math.random() * matchingFoods.length);
    const prize = matchingFoods[winningIdx];
    setTargetPrize(prize);

    // Build realistic 55-item CS:GO roulette sequence
    const strip: FoodItem[] = [];
    const pool = matchingFoods.length > 0 ? matchingFoods : foodPool;

    for (let i = 0; i < 55; i++) {
      if (i === 42) {
        // Winning slot exactly at target index 42
        strip.push(prize);
      } else {
        const randomItem = pool[Math.floor(Math.random() * pool.length)];
        strip.push(randomItem);
      }
    }

    setSpinningStrip(strip);
  }, [isSpinning, matchingFoods, foodPool]);

  // On Roulette Stop & Unboxing Completion
  const handleSpinComplete = useCallback((item: FoodItem) => {
    setIsSpinning(false);
    setIsOpening(true);
    setUnboxedResult(item);

    // Increment count & save
    setSpinCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem(STORAGE_SPIN_COUNT, String(next));
      } catch {
        // ignore
      }
      return next;
    });

    // Add to drop history
    const newDrop: DropHistoryItem = {
      id: `drop_${Date.now()}`,
      food: item,
      timestamp: Date.now(),
      userName: 'Bạn (Lucky Winner)',
    };
    setDropHistory((prev) => [newDrop, ...prev.slice(0, 14)]);

    // Open detailed result modal after brief suspense
    setTimeout(() => {
      setShowResultModal(true);
    }, 600);
  }, []);

  // Toggle item exclusion
  const handleToggleExclude = (id: string) => {
    setExcludedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Add custom food item
  const handleAddCustomItem = (newItem: FoodItem) => {
    const updated = [newItem, ...foodPool];
    setFoodPool(updated);

    try {
      const customOnly = updated.filter((f) => f.isCustom);
      localStorage.setItem(STORAGE_CUSTOM_FOODS, JSON.stringify(customOnly));
    } catch {
      // ignore
    }
  };

  // Reset to default foods
  const handleResetDefaults = () => {
    setFoodPool(INITIAL_FOOD_ITEMS);
    setExcludedIds([]);
    try {
      localStorage.removeItem(STORAGE_CUSTOM_FOODS);
      localStorage.removeItem(STORAGE_EXCLUDED_FOODS);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#090c10] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header Navigation */}
      <HeaderBar
        spinCount={spinCount}
        isSpinning={isSpinning}
        activeThemeName={selectedTheme.name}
        onOpenPoolManager={() => setShowPoolManager(true)}
        soundOn={soundOn}
        setSoundOn={setSoundOn}
      />

      {/* Main Experience Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 flex flex-col">
        {/* Intro notice if theme is 'ket-hoi-tho-lun' */}
        {selectedTheme.id === 'crate_ket_hoi_tho_lun' && (
          <div className="w-full max-w-5xl mx-auto mb-3 p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/60 flex items-center justify-between text-xs text-blue-300">
            <div className="flex items-center gap-2">
              <span className="text-base">🧯</span>
              <span>
                <strong>Chế độ Kẹt Hơi Thở Lùn:</strong> Đang tối ưu danh sách món ăn tiết kiệm (&lt; 35.000đ) cho ngày cuối tháng!
              </span>
            </div>
            <button
              onClick={() => handleSelectTheme(CRATE_THEMES[0])}
              className="text-[11px] underline hover:text-white font-medium ml-2"
            >
              Mở khóa tất cả món
            </button>
          </div>
        )}

        {/* 1. CS:GO Roulette Reel (At the top as requested: "ở trên là quay hòm như game CSGO") */}
        <CSGOCaseWheel
          isSpinning={isSpinning}
          spinningItems={spinningStrip.length > 0 ? spinningStrip : matchingFoods}
          targetItem={targetPrize}
          onSpinComplete={handleSpinComplete}
        />

        {/* 2. Interactive 3D Weapon Crate & Unlock Button */}
        <Crate3D
          currentTheme={selectedTheme}
          isSpinning={isSpinning}
          isOpening={isOpening}
          unboxedItem={unboxedResult}
          onStartSpin={handleStartSpin}
          filteredCount={matchingFoods.length}
        />

        {/* 3. Weapon Case Themed Selectors */}
        <CrateThemeSelector
          selectedThemeId={selectedTheme.id}
          onSelectTheme={handleSelectTheme}
          isSpinning={isSpinning}
        />

        {/* 4. Budget & Price Filter Controls ("món ăn sẽ lọc theo giá tiền budget người dùng nhập vào") */}
        <BudgetFilter
          minBudget={minBudget}
          maxBudget={maxBudget}
          onBudgetChange={(min, max) => {
            setMinBudget(min);
            setMaxBudget(max);
            setSelectedPresetId('custom');
          }}
          selectedPresetId={selectedPresetId}
          onSelectPreset={handleSelectPreset}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedRarity={selectedRarity}
          onSelectRarity={setSelectedRarity}
          matchingCount={matchingFoods.length}
          totalCount={foodPool.length - excludedIds.length}
          isSpinning={isSpinning}
          matchingFoods={matchingFoods}
          onSelectItem={(food) => {
            setUnboxedResult(food);
            setShowResultModal(true);
          }}
        />

        {/* 5. Live Recent Drops Unbox History */}
        <RecentDropsHistory
          history={dropHistory}
          onSelectDrop={(drop) => {
            setUnboxedResult(drop.food);
            setShowResultModal(true);
          }}
        />

        {/* Informational Footer Note */}
        <footer className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <ChefHat className="w-4 h-4 text-amber-500" />
            <span>
              Trưa Nay Ăn Gì — Trợ lý chọn món ăn trưa chuẩn phong cách CS:GO Case Opening 3D.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>Âm thanh giả lập Web Audio CS:GO</span>
            <span>•</span>
            <button
              onClick={() => setShowPoolManager(true)}
              className="text-amber-500 hover:underline"
            >
              Thêm món ăn của riêng bạn
            </button>
          </div>
        </footer>
      </main>

      {/* Result Inspection Modal */}
      <FoodResultModal
        item={unboxedResult}
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        onSpinAgain={handleStartSpin}
        onExcludeItem={(item) => handleToggleExclude(item.id)}
      />

      {/* Custom Dishes & Pool Manager Modal */}
      <FoodPoolManager
        isOpen={showPoolManager}
        onClose={() => setShowPoolManager(false)}
        foodItems={foodPool}
        excludedIds={excludedIds}
        onToggleExclude={handleToggleExclude}
        onAddCustomItem={handleAddCustomItem}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
