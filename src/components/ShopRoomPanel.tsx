import React, { useState } from 'react';
import { PlacedItem, RoomTheme, CatHat } from '../types/cat';
import { SHOP_ITEMS, ROOM_THEMES } from '../constants/shopCatalog';
import { Package, Home, X, Check } from 'lucide-react';

interface ShopRoomPanelProps {
  inventory: string[];
  placedItems: PlacedItem[];
  currentRoom: RoomTheme;
  currentHat: CatHat;
  onEquipItem: (itemId: string) => void;
  onPlaceItem: (itemId: string) => void;
  onRemoveItem: (placedId: string) => void;
  onSelectHat: (hat: CatHat) => void;
  onChangeRoom: (room: RoomTheme) => void;
  onClose: () => void;
  catName: string;
}

export const ShopRoomPanel: React.FC<ShopRoomPanelProps> = ({
  inventory,
  placedItems,
  currentRoom,
  currentHat,
  onEquipItem,
  onPlaceItem,
  onRemoveItem,
  onSelectHat,
  onChangeRoom,
  onClose,
  catName,
}) => {
  const [activeTab, setActiveTab] = useState<'accessories' | 'rooms'>('accessories');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredItems = SHOP_ITEMS.filter(
    (i) => categoryFilter === 'all' || i.category === categoryFilter
  );

  return (
    <div className="absolute inset-x-2 top-11 bottom-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-3 flex flex-col z-50 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <div className="flex items-center gap-1.5">
          <Home size={16} className="text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-100">{catName}'s Accessories & Room</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl mb-2">
        <button
          onClick={() => setActiveTab('accessories')}
          className={`flex-1 py-1 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'accessories'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Package size={12} /> Accessories
        </button>

        <button
          onClick={() => setActiveTab('rooms')}
          className={`flex-1 py-1 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'rooms'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Home size={12} /> Rooms
        </button>
      </div>

      {/* ACCESSORIES TAB — all items freely accessible */}
      {activeTab === 'accessories' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Category Filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1.5 mb-1.5 text-[10px]">
            {['all', 'toy', 'bed', 'plant', 'furniture', 'hat'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2 py-0.5 rounded-full capitalize font-medium transition-colors shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-700 text-slate-200 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 gap-1.5">
            {filteredItems.map((item) => {
              const isOwned = inventory.includes(item.id);
              const isWornHat = item.category === 'hat' && currentHat === (item.id.replace('_hat', '') as CatHat);
              const isPlaced = placedItems.some((p) => p.itemId === item.id);

              return (
                <div
                  key={item.id}
                  className="p-2 rounded-xl border flex flex-col justify-between bg-slate-800 border-slate-600 hover:border-emerald-500/70 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-2xl">{item.icon}</span>
                    {(isWornHat || isPlaced) && (
                      <span className="text-[9px] bg-emerald-500/30 text-emerald-200 px-1 py-0.5 rounded font-semibold flex items-center gap-0.5">
                        <Check size={10} /> Active
                      </span>
                    )}
                  </div>

                  <div className="mt-1">
                    <div className="text-xs font-bold leading-tight text-white">{item.name}</div>
                    <p className="text-[9px] text-slate-300 leading-snug line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {item.category === 'hat' ? (
                    <button
                      onClick={() =>
                        onSelectHat(isWornHat ? 'none' : (item.id.replace('_hat', '') as CatHat))
                      }
                      className={`mt-1.5 w-full py-1 rounded-lg text-[10px] font-bold transition-all ${
                        isWornHat
                          ? 'bg-purple-600 hover:bg-purple-500 text-white'
                          : 'bg-slate-600 hover:bg-emerald-600 text-white active:scale-95'
                      }`}
                    >
                      {isWornHat ? 'Remove Hat' : 'Wear Hat'}
                    </button>
                  ) : (
                    <div className="flex gap-1 mt-1.5">
                      {!isOwned && (
                        <button
                          onClick={() => onEquipItem(item.id)}
                          className="flex-1 py-1 rounded-lg text-[10px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 transition-all"
                        >
                          Add to Inventory
                        </button>
                      )}
                      {isOwned && (
                        <button
                          onClick={() => {
                            if (isPlaced) {
                              const placed = placedItems.find((p) => p.itemId === item.id);
                              if (placed) onRemoveItem(placed.id);
                            } else {
                              onPlaceItem(item.id);
                            }
                          }}
                          className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            isPlaced
                              ? 'bg-rose-600/90 hover:bg-rose-600 text-white'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          }`}
                        >
                          {isPlaced ? 'Remove' : 'Place'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ROOMS TAB — all rooms freely accessible */}
      {activeTab === 'rooms' && (
        <div className="flex-1 overflow-y-auto pr-1 space-y-1.5">
          {Object.values(ROOM_THEMES).map((room) => {
            const isSelected = currentRoom === room.id;

            return (
              <div
                key={room.id}
                onClick={() => onChangeRoom(room.id)}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-950/50 border-emerald-500 text-white ring-1 ring-emerald-500'
                    : 'bg-slate-800 border-slate-600 hover:border-slate-400 text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{room.icon}</span>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1">
                      {room.name}
                      {isSelected && (
                        <span className="text-[9px] bg-emerald-500 text-slate-950 px-1 rounded font-bold">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-[9px] text-slate-300">{room.description}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
