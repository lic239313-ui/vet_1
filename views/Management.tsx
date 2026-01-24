import React from 'react';
import { GameState, Equipment } from '../types';
import { ShoppingBagIcon, CheckBadgeIcon, LockClosedIcon } from '@heroicons/react/24/solid';

interface ManagementProps {
  gameState: GameState;
  updateState: (updates: Partial<GameState>) => void;
}

const Management: React.FC<ManagementProps> = ({ gameState, updateState }) => {
  
  const buyEquipment = (item: Equipment) => {
    if (gameState.money >= item.cost) {
      const updatedInventory = gameState.inventory.map(eq => 
        eq.id === item.id ? { ...eq, owned: true } : eq
      );
      updateState({
        money: gameState.money - item.cost,
        inventory: updatedInventory
      });
    } else {
      alert("资金不足！快去诊疗大厅赚钱吧。");
    }
  };

  return (
    <div className="h-full overflow-y-auto pb-20">
      <div className="flex items-center gap-3 mb-6">
         <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shadow-sm border border-orange-200">
            <ShoppingBagIcon className="w-7 h-7" />
         </div>
         <div>
            <h2 className="text-2xl font-black text-slate-800">医疗采购市场</h2>
            <p className="text-slate-500 font-bold text-sm">升级设备，赚取更多诊金！</p>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gameState.inventory.map((item) => (
          <div 
            key={item.id}
            className={`
              game-card relative overflow-hidden flex flex-col p-0 transition-all
              ${item.owned ? 'opacity-90 grayscale-[0.2]' : 'hover:-translate-y-1 hover:shadow-xl'}
            `}
          >
            {/* Header Image Area */}
            <div className={`h-32 flex items-center justify-center text-6xl ${item.owned ? 'bg-slate-100' : 'bg-gradient-to-br from-teal-50 to-blue-50'}`}>
               {item.icon}
            </div>

            <div className="p-5 flex flex-col flex-1">
               <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-extrabold text-slate-800">{item.name}</h3>
                  {item.owned ? (
                     <CheckBadgeIcon className="w-6 h-6 text-green-500" />
                  ) : (
                     <div className="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-1 rounded">
                       +{Math.round((item.incomeMultiplier - 1) * 100)}% 收入
                     </div>
                  )}
               </div>
               
               <p className="text-sm text-slate-500 font-medium mb-4 leading-relaxed">{item.description}</p>
               
               <div className="mt-auto">
                 {item.owned ? (
                    <button disabled className="w-full py-3 bg-slate-100 text-slate-400 font-bold rounded-xl border border-slate-200 cursor-default flex items-center justify-center gap-2">
                       <CheckBadgeIcon className="w-5 h-5" /> 已配置
                    </button>
                 ) : (
                    <button
                      onClick={() => buyEquipment(item)}
                      className="w-full btn-game btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                      <span>¥ {item.cost.toLocaleString()}</span>
                      <span className="opacity-80 text-xs font-normal">立即购买</span>
                    </button>
                 )}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Management;