import React, { useState } from 'react';
import { FoodItem, Rarity } from '../types';
import { RARITY_CONFIG } from '../data/foodData';
import { X, Plus, Trash2, Check, RefreshCw, Eye, EyeOff, Search } from 'lucide-react';

interface FoodPoolManagerProps {
  isOpen: boolean;
  onClose: () => void;
  foodItems: FoodItem[];
  excludedIds: string[];
  onToggleExclude: (id: string) => void;
  onAddCustomItem: (item: FoodItem) => void;
  onResetDefaults: () => void;
}

export const FoodPoolManager: React.FC<FoodPoolManagerProps> = ({
  isOpen,
  onClose,
  foodItems,
  excludedIds,
  onToggleExclude,
  onAddCustomItem,
  onResetDefaults,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // New item form state
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('35000');
  const [newCategory, setNewCategory] = useState<FoodItem['category']>('Cơm');
  const [newRarity, setNewRarity] = useState<Rarity>('purple');
  const [newDescription, setNewDescription] = useState('');

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const priceNum = Number(newPrice) || 35000;
    const newItem: FoodItem = {
      id: `custom_${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      priceVnd: priceNum,
      priceDisplay: `${priceNum.toLocaleString('vi-VN')}đ`,
      rarity: newRarity,
      condition: 'StatTrak™',
      calories: 550,
      description: newDescription.trim() || 'Món ăn tự thêm vào hòm may mắn của bạn.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      tags: ['Món riêng', 'Tùy chỉnh'],
      spicyLevel: 1,
      isCustom: true,
    };

    onAddCustomItem(newItem);
    setNewName('');
    setNewPrice('35000');
    setNewDescription('');
    setShowAddForm(false);
  };

  const filteredList = foodItems.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      id="pool-manager-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-game text-lg font-bold text-slate-100 flex items-center gap-2">
              QUẢN LÝ KHO MÓN ĂN TRONG HÒM
            </h3>
            <p className="text-xs text-slate-400">
              Bật/tắt món ăn xuất hiện khi quay hoặc tự thêm món ruột của bạn
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search, Add, Reset */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          {/* Search box */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm kiếm món ăn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition font-game"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddForm ? 'Đóng Thêm Món' : 'Thêm Món Riêng'}</span>
            </button>

            <button
              onClick={onResetDefaults}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
              title="Khôi phục danh sách món ban đầu"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Khôi phục</span>
            </button>
          </div>
        </div>

        {/* Add custom item form collapsible */}
        {showAddForm && (
          <form
            onSubmit={handleAddSubmit}
            className="p-4 bg-slate-950 border-b border-slate-800 flex flex-col gap-3 text-xs animate-fadeIn"
          >
            <h4 className="font-game font-bold text-amber-400 uppercase">
              Thêm Món Ăn Mới Vào Hòm:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Tên món ăn:</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Cơm Chiên Dương Châu..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Giá tham khảo (VND):</label>
                <input
                  type="number"
                  required
                  step="1000"
                  min="5000"
                  max="1000000"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-amber-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Thể loại:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as FoodItem['category'])}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-amber-500 outline-none"
                >
                  <option value="Cơm">Cơm</option>
                  <option value="Bún / Phở">Bún / Phở</option>
                  <option value="Mì / Hủ Tiếu">Mì / Hủ Tiếu</option>
                  <option value="Bánh Mì / Cuốn">Bánh Mì / Cuốn</option>
                  <option value="Món Nước">Món Nước</option>
                  <option value="Ăn Nhanh / Fastfood">Ăn Nhanh / Fastfood</option>
                  <option value="Lẩu / Nướng & Ăn Sang">Lẩu / Nướng & Ăn Sang</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Độ hiếm CS:GO:</label>
                <select
                  value={newRarity}
                  onChange={(e) => setNewRarity(e.target.value as Rarity)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-amber-500 outline-none"
                >
                  <option value="blue">Mil-Spec (Xanh Dương)</option>
                  <option value="purple">Restricted (Tím Quý Tộc)</option>
                  <option value="pink">Classified (Hồng Thần Thoại)</option>
                  <option value="red">Covert (Đỏ Tuyệt Mật)</option>
                  <option value="gold">★ Special Rare (Dao Vàng) ★</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Mô tả món ăn:</label>
              <input
                type="text"
                placeholder="Gợi ý quán ngon, vị chua cay hay nhiều hành..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:border-amber-500 outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 mt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
              >
                Lưu Vào Hòm
              </button>
            </div>
          </form>
        )}

        {/* List of items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredList.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              Không tìm thấy món ăn nào phù hợp với từ khóa tìm kiếm.
            </div>
          ) : (
            filteredList.map((item) => {
              const isExcluded = excludedIds.includes(item.id);
              const rarityConf = RARITY_CONFIG[item.rarity];

              return (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 transition ${
                    isExcluded
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-50'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Small preview image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded-lg border border-slate-700"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: rarityConf.borderHex }}
                        />
                        <h4 className={`text-xs sm:text-sm font-bold ${isExcluded ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                          {item.name}
                        </h4>
                        {item.isCustom && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                            Tự thêm
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                        <span className="font-mono text-amber-400">
                          {item.priceVnd.toLocaleString('vi-VN')}đ
                        </span>
                        <span>•</span>
                        <span>{item.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle button */}
                  <button
                    onClick={() => onToggleExclude(item.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      isExcluded
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                        : 'bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300'
                    }`}
                  >
                    {isExcluded ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Đã ẩn</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Đang bật</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            Đang bật <strong className="text-slate-200">{foodItems.length - excludedIds.length}</strong> / {foodItems.length} món
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
