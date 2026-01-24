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
    { view: GameView.CLINIC, label: '接诊大厅', icon: BuildingStorefrontIcon, color: 'text-teal-600' },
    { view: GameView.MANAGEMENT, label: '采购设备', icon: ShoppingBagIcon, color: 'text-orange-500' },
    { view: GameView.ACADEMY, label: '研修学院', icon: AcademicCapIcon, color: 'text-blue-600' },
    { view: GameView.PROFILE, label: '我的档案', icon: UserCircleIcon, color: 'text-purple-600' },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden relative">

      {/* HUD Header */}
      <header className="px-4 py-3 shrink-0 flex items-center justify-center relative z-20 mt-2">
        <div className="bg-white/90 backdrop-blur-md rounded-full shadow-lg border-2 border-slate-100 flex items-center gap-1 p-1.5 pr-6 mx-auto max-w-2xl w-full justify-between">

          {/* Rank Badge */}
          <div className="bg-slate-800 text-white px-4 py-2 rounded-full font-black text-sm shadow-md flex items-center gap-2">
            <span className="text-amber-400">★</span> {gameState.rank}
          </div>

          {/* Stats */}
          <div className="flex gap-4 md:gap-8">
            <StatPill icon={CurrencyYenIcon} value={gameState.money} color="text-amber-500" />
            <StatPill icon={BoltIcon} value={gameState.energy} color="text-blue-500" />
            <div className="hidden md:flex">
              <StatPill icon={StarIcon} value={gameState.reputation} color="text-purple-500" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 overflow-hidden relative p-4 pb-24 md:pb-4 md:p-6 max-w-5xl mx-auto w-full">
        <div className="w-full h-full relative">
          {children}
        </div>
      </main>

      {/* Floating Game Menu (Bottom) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur shadow-2xl rounded-3xl p-2 flex gap-2 border-2 border-slate-100 z-50">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onChangeView(item.view)}
              className={`
                 relative flex flex - col items - center justify - center w - 20 h - 20 rounded - 2xl transition - all duration - 200 group
                 ${isActive
                  ? 'bg-teal-50 -translate-y-4 shadow-xl border-2 border-teal-100'
                  : 'hover:bg-slate-50 hover:-translate-y-1'
                }
`}
            >
              <div className={`p - 2 rounded - xl mb - 1 transition - transform ${isActive ? 'scale-110' : 'group-hover:scale-110'} `}>
                <item.icon className={`w - 8 h - 8 ${item.color} `} />
              </div>
              <span className={`text - [10px] font - bold ${isActive ? 'text-teal-800' : 'text-slate-400'} `}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-2 w-12 h-1 bg-teal-400 rounded-full"></div>
              )}
            </button>
          );
        })}
      </nav>

    </div>
  );
};

const StatPill = ({ icon: Icon, value, color }: { icon: any, value: number, color: string }) => (
  <div className="flex items-center gap-1 font-bold text-slate-700">
    <Icon className={`w - 5 h - 5 ${color} drop - shadow - sm`} />
    <span className="font-mono text-lg">{value.toLocaleString()}</span>
  </div>
);

export default Layout;