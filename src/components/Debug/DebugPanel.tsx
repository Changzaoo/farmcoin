/**
 * 🐛 Debug Panel Component
 * Painel de debug para desenvolvedores testarem o jogo
 */

import React, { useState } from 'react';
import { Bug, ChevronDown, ChevronUp, Coins, TrendingUp, Award } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

interface DebugPanelProps {
  visible?: boolean;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ visible = false }) => {
  const { state, dispatch, addCoins } = useGame();
  const [isOpen, setIsOpen] = useState(visible);
  const [customAmount, setCustomAmount] = useState('1000');

  // Só mostra em desenvolvimento
  if (import.meta.env.PROD) return null;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all"
        title="Abrir Debug Panel"
      >
        <Bug size={20} />
      </button>
    );
  }

  const handleAddCoins = (amount: number) => {
    addCoins(amount);
  };

  const handleCustomAmount = () => {
    const amount = parseFloat(customAmount);
    if (!isNaN(amount) && amount > 0) {
      addCoins(amount);
    }
  };

  const handleResetProgress = () => {
    if (confirm('⚠️ Tem certeza que quer resetar TODO o progresso?')) {
      dispatch({ type: 'RESET_GAME' });
    }
  };

  const handleUnlockAllUpgrades = () => {
    // Adiciona muito dinheiro para comprar tudo
    addCoins(1e12);
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 w-80 bg-gradient-to-br from-gray-900 to-purple-900 border-2 border-purple-500 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-purple-600 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bug size={18} />
          <span className="font-bold text-sm">Debug Panel</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-purple-700 p-1 rounded transition-colors"
        >
          <ChevronDown size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {/* Stats */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-yellow-400">
              <Coins size={14} />
              Moedas:
            </span>
            <span className="font-mono font-bold">{state.gameState.coins.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-green-400">
              <TrendingUp size={14} />
              Por Segundo:
            </span>
            <span className="font-mono font-bold">{state.gameState.perSecond.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-blue-400">
              <Award size={14} />
              Total Cliques:
            </span>
            <span className="font-mono font-bold">{state.gameState.totalClicks}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-purple-400">Upgrades:</span>
            <span className="font-mono font-bold">
              {state.upgrades.filter(u => u.count > 0).length} / {state.upgrades.length}
            </span>
          </div>
        </div>

        <div className="h-px bg-purple-500/30" />

        {/* Ações Rápidas */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-purple-300 uppercase tracking-wide">Ações Rápidas</p>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleAddCoins(1000)}
              className="bg-green-600 hover:bg-green-700 text-white text-xs py-2 px-3 rounded-lg transition-colors"
            >
              +1K Moedas
            </button>
            <button
              onClick={() => handleAddCoins(10000)}
              className="bg-green-600 hover:bg-green-700 text-white text-xs py-2 px-3 rounded-lg transition-colors"
            >
              +10K Moedas
            </button>
            <button
              onClick={() => handleAddCoins(100000)}
              className="bg-green-600 hover:bg-green-700 text-white text-xs py-2 px-3 rounded-lg transition-colors"
            >
              +100K Moedas
            </button>
            <button
              onClick={() => handleAddCoins(1000000)}
              className="bg-green-600 hover:bg-green-700 text-white text-xs py-2 px-3 rounded-lg transition-colors"
            >
              +1M Moedas
            </button>
          </div>

          {/* Custom Amount */}
          <div className="flex gap-2">
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Valor customizado"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleCustomAmount}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-4 rounded-lg transition-colors whitespace-nowrap"
            >
              Adicionar
            </button>
          </div>
        </div>

        <div className="h-px bg-purple-500/30" />

        {/* Ações Perigosas */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-red-300 uppercase tracking-wide">⚠️ Zona Perigosa</p>
          
          <button
            onClick={handleUnlockAllUpgrades}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-xs py-2 px-3 rounded-lg transition-colors"
          >
            💰 Desbloquear Tudo
          </button>
          
          <button
            onClick={handleResetProgress}
            className="w-full bg-red-600 hover:bg-red-700 text-white text-xs py-2 px-3 rounded-lg transition-colors"
          >
            🔄 Resetar Progresso
          </button>
        </div>

        {/* Nota */}
        <div className="bg-purple-900/50 border border-purple-500/30 rounded-lg p-2">
          <p className="text-[10px] text-purple-300">
            💡 Este painel só aparece em modo de desenvolvimento
          </p>
        </div>
      </div>
    </div>
  );
};
