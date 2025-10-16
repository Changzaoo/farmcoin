import React, { useState, useEffect, useCallback } from 'react';
import { Coins, TrendingUp, ShoppingCart, Search } from 'lucide-react';
import { upgrades as upgradesData, categories } from '../../data/upgrades';
import { GameState, Upgrade } from '../../types';
import { saveGameState } from '../../firebase/firestore';

interface FarmCoinGameProps {
  uid: string;
  initialGameState: GameState;
}

export const FarmCoinGame: React.FC<FarmCoinGameProps> = ({ uid, initialGameState }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [upgrades, setUpgrades] = useState<Upgrade[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [lastSave, setLastSave] = useState(Date.now());

  // Inicializar upgrades
  useEffect(() => {
    const initializedUpgrades = upgradesData.map(upgrade => {
      const existingUpgrade = initialGameState.upgrades?.find(u => u.id === upgrade.id);
      const count = existingUpgrade?.count || 0;
      
      return {
        ...upgrade,
        count,
        cost: upgrade.baseCost * Math.pow(upgrade.costMultiplier, count),
        income: upgrade.baseIncome * Math.pow(upgrade.incomeMultiplier, count)
      };
    });
    
    setUpgrades(initializedUpgrades);
  }, [initialGameState]);

  // Calcular renda passiva total
  const calculatePassiveIncome = useCallback(() => {
    return upgrades.reduce((total, upgrade) => {
      if (upgrade.count && upgrade.count > 0) {
        return total + (upgrade.income || 0) * upgrade.count;
      }
      return total;
    }, 0);
  }, [upgrades]);

  // Atualizar moedas passivamente
  useEffect(() => {
    const interval = setInterval(() => {
      const perSecond = calculatePassiveIncome();
      
      setGameState(prev => ({
        ...prev,
        coins: prev.coins + perSecond,
        totalCoins: prev.totalCoins + perSecond,
        perSecond
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [calculatePassiveIncome]);

  // Auto-save a cada 10 segundos
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      const now = Date.now();
      if (now - lastSave >= 10000) {
        saveGame();
        setLastSave(now);
      }
    }, 10000);

    return () => clearInterval(autoSaveInterval);
  }, [gameState, lastSave]);

  // Salvar jogo
  const saveGame = async () => {
    try {
      await saveGameState(uid, gameState, upgrades);
    } catch (error) {
      console.error('Erro ao salvar jogo:', error);
    }
  };

  // Click manual
  const handleClick = () => {
    setGameState(prev => ({
      ...prev,
      coins: prev.coins + 0.1,
      totalCoins: prev.totalCoins + 0.1,
      totalClicks: prev.totalClicks + 1
    }));
  };

  // Comprar upgrade
  const handleBuyUpgrade = (upgradeId: string) => {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade || !upgrade.cost) return;

    if (gameState.coins >= upgrade.cost) {
      const newCount = (upgrade.count || 0) + 1;
      const newCost = upgrade.baseCost * Math.pow(upgrade.costMultiplier, newCount);
      const newIncome = upgrade.baseIncome * Math.pow(upgrade.incomeMultiplier, newCount);

      setUpgrades(prev =>
        prev.map(u =>
          u.id === upgradeId
            ? { ...u, count: newCount, cost: newCost, income: newIncome }
            : u
        )
      );

      setGameState(prev => ({
        ...prev,
        coins: prev.coins - upgrade.cost!,
        totalPurchases: prev.totalPurchases + 1
      }));
    }
  };

  // Filtrar upgrades
  const filteredUpgrades = upgrades.filter(upgrade => {
    const matchesCategory = selectedCategory === 'Todos' || upgrade.category === selectedCategory;
    const matchesSearch = upgrade.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         upgrade.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Formatar número
  const formatNumber = (num: number): string => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 p-4">
      {/* Header Stats */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Moedas Atuais */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-yellow-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Moedas</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {formatNumber(gameState.coins)}
                </p>
              </div>
              <Coins className="w-12 h-12 text-yellow-500" />
            </div>
          </div>

          {/* Renda Passiva */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-green-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Por Segundo</p>
                <p className="text-3xl font-bold text-green-600">
                  {formatNumber(gameState.perSecond)}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500" />
            </div>
          </div>

          {/* Total de Compras */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-blue-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Upgrades</p>
                <p className="text-3xl font-bold text-blue-600">
                  {gameState.totalPurchases}
                </p>
              </div>
              <ShoppingCart className="w-12 h-12 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Área de Click */}
        <div className="lg:col-span-1">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-2 border-yellow-400">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Fazenda
            </h2>
            
            <button
              onClick={handleClick}
              className="w-full aspect-square bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center text-8xl animate-bounce-slow"
            >
              🌾
            </button>

            <p className="text-center mt-6 text-gray-600 text-sm">
              Clique para ganhar <span className="font-bold text-yellow-600">+0.1</span> moedas
            </p>

            <div className="mt-6 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Total de Moedas:</span>
                <span className="font-bold">{formatNumber(gameState.totalCoins)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total de Clicks:</span>
                <span className="font-bold">{gameState.totalClicks}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Upgrades */}
        <div className="lg:col-span-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-green-400">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Melhorias
            </h2>

            {/* Filtros */}
            <div className="mb-6 space-y-4">
              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar melhorias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                />
              </div>

              {/* Categorias */}
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de Upgrades */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredUpgrades.map(upgrade => {
                const canBuy = gameState.coins >= (upgrade.cost || 0);
                
                return (
                  <div
                    key={upgrade.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      canBuy
                        ? 'bg-gradient-to-r from-green-50 to-yellow-50 border-green-300 hover:shadow-lg'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{upgrade.icon}</div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 truncate">
                          {upgrade.name}
                          {upgrade.count ? ` (${upgrade.count})` : ''}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          {upgrade.description}
                        </p>
                        <div className="flex gap-4 mt-1 text-sm">
                          <span className="text-yellow-600 font-semibold">
                            💰 {formatNumber(upgrade.cost || 0)}
                          </span>
                          <span className="text-green-600 font-semibold">
                            📈 +{formatNumber(upgrade.income || 0)}/s
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBuyUpgrade(upgrade.id)}
                        disabled={!canBuy}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${
                          canBuy
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:scale-105 active:scale-95'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredUpgrades.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">Nenhuma melhoria encontrada</p>
                  <p className="text-sm mt-2">Tente ajustar os filtros</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }
      `}</style>
    </div>
  );
};
