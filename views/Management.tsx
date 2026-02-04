import React, { useState } from 'react';
import { GameState, Equipment } from '../types';
import {
  ShoppingBagIcon,
  CurrencyYenIcon,
  CheckBadgeIcon,
  SparklesIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/solid';

interface ManagementProps {
  gameState: GameState;
  updateState: (updates: Partial<GameState>) => void;
}

const Management: React.FC<ManagementProps> = ({ gameState, updateState }) => {
  const [purchasingItemId, setPurchasingItemId] = useState<string | null>(null);
  const [justPurchasedId, setJustPurchasedId] = useState<string | null>(null);

  const buyEquipment = (item: Equipment) => {
    if (gameState.money >= item.cost && !item.owned) {
      setPurchasingItemId(item.id);

      // Simulate purchase animation
      setTimeout(() => {
        const updatedInventory = gameState.inventory.map(i =>
          i.id === item.id ? { ...i, owned: true } : i
        );
        updateState({
          money: gameState.money - item.cost,
          inventory: updatedInventory
        });
        setPurchasingItemId(null);
        setJustPurchasedId(item.id);

        // Clear success state after animation
        setTimeout(() => setJustPurchasedId(null), 2000);
      }, 500);
    }
  };

  const getEquipmentIcon = (id: string) => {
    const icons: Record<string, string> = {
      'microscope': '🔬',
      'xray': '📡',
      'ultrasound': '🩺',
      'bloodAnalyzer': '🩸',
      'biochemistry': '⚗️',
      'dermatoscope': '🔍',
      'woodsLamp': '💡',
      'ecg': '📈',
      'ophthalmoscope': '👁️',
      'tonometer': '🎯'
    };
    return icons[id] || '🔧';
  };

  const getEquipmentColor = (id: string) => {
    const colors: Record<string, { gradient: string; light: string; border: string }> = {
      'microscope': { gradient: 'from-cyan-500 to-blue-600', light: 'bg-cyan-50', border: 'border-cyan-200' },
      'xray': { gradient: 'from-violet-500 to-purple-600', light: 'bg-violet-50', border: 'border-violet-200' },
      'ultrasound': { gradient: 'from-teal-500 to-emerald-600', light: 'bg-teal-50', border: 'border-teal-200' },
      'bloodAnalyzer': { gradient: 'from-red-500 to-rose-600', light: 'bg-red-50', border: 'border-red-200' },
      'biochemistry': { gradient: 'from-amber-500 to-orange-600', light: 'bg-amber-50', border: 'border-amber-200' },
      'dermatoscope': { gradient: 'from-pink-500 to-rose-600', light: 'bg-pink-50', border: 'border-pink-200' },
      'woodsLamp': { gradient: 'from-indigo-500 to-violet-600', light: 'bg-indigo-50', border: 'border-indigo-200' },
      'ecg': { gradient: 'from-green-500 to-emerald-600', light: 'bg-green-50', border: 'border-green-200' },
      'ophthalmoscope': { gradient: 'from-blue-500 to-cyan-600', light: 'bg-blue-50', border: 'border-blue-200' },
      'tonometer': { gradient: 'from-slate-500 to-slate-700', light: 'bg-slate-50', border: 'border-slate-200' }
    };
    return colors[id] || { gradient: 'from-slate-500 to-slate-600', light: 'bg-slate-50', border: 'border-slate-200' };
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 animate-fade-in">
      <div className="max-w-5xl mx-auto">

        {/* Header - Enhanced */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingBagIcon className="w-7 h-7 text-white" />
              </div>
              医疗采购市场
            </h2>
            <p className="text-slate-500 mt-2 font-medium">升级你的诊所设备，解锁更多诊疗能力</p>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 px-5 py-3 rounded-xl border border-amber-200">
            <CurrencyYenIcon className="w-6 h-6 text-amber-500" />
            <span className="font-bold text-slate-800 text-xl">{gameState.money.toLocaleString()}</span>
            <span className="text-slate-500 text-sm">可用资金</span>
          </div>
        </div>

        {/* Equipment Grid - Enhanced */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {gameState.inventory.map((item) => {
            const colors = getEquipmentColor(item.id);
            const isPurchasing = purchasingItemId === item.id;
            const justPurchased = justPurchasedId === item.id;
            const canAfford = gameState.money >= item.cost;

            return (
              <div
                key={item.id}
                className={`
                  game-card p-5 transition-all duration-300 relative overflow-hidden
                  ${item.owned
                    ? `${colors.light} ${colors.border} border-2`
                    : 'hover:-translate-y-2 hover:shadow-xl'
                  }
                  ${isPurchasing ? 'scale-95 opacity-70' : ''}
                  ${justPurchased ? 'animate-pop ring-4 ring-green-400 ring-offset-2' : ''}
                `}
              >
                {/* Owned Badge */}
                {item.owned && (
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-md">
                      <CheckBadgeIcon className="w-4 h-4" />
                      已拥有
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-4`}>
                  {getEquipmentIcon(item.id)}
                </div>

                {/* Content */}
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                </div>

                {/* Multiplier Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm font-bold">
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                    收入 x{item.incomeMultiplier}
                  </div>
                </div>

                {/* Buy Button */}
                {!item.owned && (
                  <button
                    onClick={() => buyEquipment(item)}
                    disabled={!canAfford || isPurchasing}
                    className={`
                      w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer
                      ${canAfford
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200 hover:shadow-xl hover:shadow-amber-300 hover:-translate-y-0.5'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }
                      ${isPurchasing ? 'animate-pulse' : ''}
                    `}
                  >
                    {isPurchasing ? (
                      <>
                        <SparklesIcon className="w-5 h-5 animate-spin" />
                        购买中...
                      </>
                    ) : (
                      <>
                        <CurrencyYenIcon className="w-5 h-5" />
                        {canAfford ? `¥${item.cost.toLocaleString()}` : '资金不足'}
                      </>
                    )}
                  </button>
                )}

                {/* Already Owned State */}
                {item.owned && (
                  <div className="w-full py-3 bg-green-100 text-green-700 rounded-xl font-bold text-center flex items-center justify-center gap-2">
                    <CheckBadgeIcon className="w-5 h-5" />
                    已装备使用中
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Management;