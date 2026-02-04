import React from 'react';
import { GameView, GameState } from '../types';
import {
  BuildingStorefrontIcon,
  ShoppingBagIcon,
  AcademicCapIcon,
  UserCircleIcon,
  CurrencyYenIcon,
  StarIcon,
  BoltIcon
} from '@heroicons/react/24/solid';

interface LayoutProps {
  children: React.ReactNode;
  currentView: GameView;
  onChangeView: (view: GameView) => void;
  gameState: GameState;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView, gameState }) => {

  const navItems = [
    { view: GameView.CLINIC, label: '接诊大厅', icon: BuildingStorefrontIcon, color: 'text-cyan-600', bgActive: 'bg-cyan-50', borderActive: 'border-cyan-200' },
    { view: GameView.MANAGEMENT, label: '采购设备', icon: ShoppingBagIcon, color: 'text-amber-500', bgActive: 'bg-amber-50', borderActive: 'border-amber-200' },
    { view: GameView.ACADEMY, label: '研修学院', icon: AcademicCapIcon, color: 'text-blue-600', bgActive: 'bg-blue-50', borderActive: 'border-blue-200' },
    { view: GameView.PROFILE, label: '我的档案', icon: UserCircleIcon, color: 'text-violet-600', bgActive: 'bg-violet-50', borderActive: 'border-violet-200' },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden relative">

      {/* Enhanced HUD Header */}
      <header className="px-4 py-3 shrink-0 flex items-center justify-center relative z-20 mt-2">
        <div className="glass rounded-2xl shadow-lg border border-white/40 flex items-center gap-2 p-2 pr-5 mx-auto max-w-2xl w-full justify-between">

          {/* Rank Badge - Enhanced */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 border border-slate-600">
            <span className="text-amber-400 text-lg">★</span>
            <span className="tracking-wide">{gameState.rank}</span>
          </div>

          {/* Stats - Enhanced with better icons and colors */}
          <div className="flex gap-3 md:gap-6">
            <StatPill
              icon={CurrencyYenIcon}
              value={gameState.money}
              color="text-amber-500"
              bgColor="bg-amber-50"
              label="资金"
            />
            <StatPill
              icon={BoltIcon}
              value={gameState.energy}
              color="text-cyan-500"
              bgColor="bg-cyan-50"
              label="精力"
            />
            <div className="hidden md:flex">
              <StatPill
                icon={StarIcon}
                value={gameState.reputation}
                color="text-violet-500"
                bgColor="bg-violet-50"
                label="声望"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 overflow-hidden relative p-4 pb-28 md:pb-4 md:p-6 max-w-5xl mx-auto w-full">
        <div className="w-full h-full relative">
          {children}
        </div>
      </main>

      {/* Enhanced Floating Game Menu (Bottom) */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 glass shadow-xl rounded-2xl p-1.5 flex gap-1 border border-white/50 z-50">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onChangeView(item.view)}
              className={`
                relative flex flex-col items-center justify-center w-[4.5rem] h-[4.5rem] rounded-xl transition-all duration-300 group cursor-pointer
                ${isActive
                  ? `${item.bgActive} -translate-y-3 shadow-lg border ${item.borderActive}`
                  : 'hover:bg-slate-50/80 hover:-translate-y-1'
                }
              `}
            >
              <div className={`p-1.5 rounded-lg mb-0.5 transition-all duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                <item.icon className={`w-7 h-7 ${item.color} drop-shadow-sm`} />
              </div>
              <span className={`text-[10px] font-bold transition-colors ${isActive ? 'text-slate-800' : 'text-slate-400 group-hover:text-slate-600'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-8 h-1 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full shadow-sm"></div>
              )}
            </button>
          );
        })}
      </nav>

    </div>
  );
};

interface StatPillProps {
  icon: any;
  value: number;
  color: string;
  bgColor: string;
  label: string;
}

const StatPill: React.FC<StatPillProps> = ({ icon: Icon, value, color, bgColor, label }) => (
  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${bgColor} transition-all hover:scale-105`}>
    <Icon className={`w-5 h-5 ${color} drop-shadow-sm`} />
    <div className="flex flex-col">
      <span className="font-bold text-slate-800 text-sm leading-none">{value.toLocaleString()}</span>
      <span className="text-[9px] text-slate-400 font-medium hidden md:block">{label}</span>
    </div>
  </div>
);

export default Layout;