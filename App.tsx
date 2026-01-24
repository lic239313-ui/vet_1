import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Clinic from './views/Clinic';
import Management from './views/Management';
import Academy from './views/Academy';
import Profile from './views/Profile';
import { GameView, GameState, INITIAL_GAME_STATE, INITIAL_EQUIPMENT } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<GameView>(GameView.CLINIC);

  // Initial State with robust LocalStorage loading
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem('vet-tycoon-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Robust validation and migration logic
        if (parsed && typeof parsed.money === 'number' && Array.isArray(parsed.inventory)) {
          // MIGRATION: Ensure all new items in INITIAL_EQUIPMENT are present in the loaded inventory
          // This allows us to add new equipment updates without breaking old saves
          const loadedInvMap = new Map(parsed.inventory.map((i: any) => [i.id, i]));
          const mergedInventory = INITIAL_EQUIPMENT.map(defaultItem => {
            const loadedItem = loadedInvMap.get(defaultItem.id);
            // If item existed in save, keep its 'owned' status, but update definition (cost/stats)
            if (loadedItem) {
              return { ...defaultItem, owned: (loadedItem as any).owned };
            }
            // If item is new in this update, return the default item
            return defaultItem;
          });

          // MIGRATION: Ensure caseHistory exists
          const safeHistory = Array.isArray((parsed as any).caseHistory) ? (parsed as any).caseHistory : [];

          return { ...parsed, inventory: mergedInventory, caseHistory: safeHistory };
        }
      }
    } catch (e) {
      console.error("Failed to load save file:", e);
    }
    return INITIAL_GAME_STATE;
  });

  // Save to local storage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('vet-tycoon-state', JSON.stringify(gameState));
    } catch (e) {
      console.error("Failed to save game:", e);
    }
  }, [gameState]);

  // Energy regeneration tick
  useEffect(() => {
    const timer = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        energy: Math.min(prev.maxEnergy, prev.energy + 1)
      }));
    }, 10000); // Regenerate 1 energy every 10 seconds

    return () => clearInterval(timer);
  }, []);

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const renderView = () => {
    switch (currentView) {
      case GameView.CLINIC:
        return <Clinic gameState={gameState} updateState={updateGameState} onChangeView={setCurrentView} />;
      case GameView.MANAGEMENT:
        return <Management gameState={gameState} updateState={updateGameState} />;
      case GameView.ACADEMY:
        return <Academy gameState={gameState} updateState={updateGameState} />;
      case GameView.PROFILE:
        return <Profile gameState={gameState} updateState={updateGameState} />;
      default:
        return <Clinic gameState={gameState} updateState={updateGameState} onChangeView={setCurrentView} />;
    }
  };

  return (
    <Layout currentView={currentView} onChangeView={setCurrentView} gameState={gameState}>
      {renderView()}
    </Layout>
  );
};

export default App;