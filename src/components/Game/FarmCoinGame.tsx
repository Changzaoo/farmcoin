// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Coins, TrendingUp, ShoppingCart, Search, Lock, Package } from 'lucide-react';
import { upgrades as upgradesData, categories } from '../../data/upgrades';
import { GameState, Upgrade, UpgradeTier } from '../../types';
import { saveGameState } from '../../firebase/firestore';
import { getTierColor, getTierName, getTierGlow, canUnlockCompositeUpgrade, getMissingRequirements } from '../../utils/tierSystem';
import Marketplace from './Marketplace';

interface FloatingCoin {
  id: number;
  x: number;
  y: number;
}

interface FarmCoinGameProps {
  uid: string;
  initialGameState: GameState;
  initialUpgrades?: Upgrade[];
}

export const FarmCoinGame: React.FC<FarmCoinGameProps> = ({ uid, initialGameState, initialUpgrades }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [upgrades, setUpgrades] = useState<Upgrade[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [lastSave, setLastSave] = useState(Date.now());
  const [floatingCoins, setFloatingCoins] = useState<FloatingCoin[]>([]);
  const [clickEffect, setClickEffect] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const coinIdRef = useRef(0);

  // Inicializar upgrades
  useEffect(() => {
    const initializedUpgrades = upgradesData.map(upgrade => {
      // Buscar dados salvos do usuário primeiro
      const savedUpgrade = initialUpgrades?.find(u => u.id === upgrade.id);
      const count = savedUpgrade?.count || 0;
      
      // Verificar se upgrade composto está desbloqueado
      let unlocked = true;
      if (upgrade.isComposite && upgrade.requirements) {
        const userUpgrades = upgradesData.map(u => {
          const saved = initialUpgrades?.find(s => s.id === u.id);
          return { ...u, count: saved?.count || 0 };
        });
        unlocked = canUnlockCompositeUpgrade(upgrade.requirements, userUpgrades);
      }
      
      return {
        ...upgrade,
        count,
        unlocked,
        cost: upgrade.baseCost * Math.pow(upgrade.costMultiplier, count),
        income: upgrade.baseIncome * Math.pow(upgrade.incomeMultiplier, count)
      };
    });
    
    setUpgrades(initializedUpgrades);
  }, [initialUpgrades]);

  // Calcular renda passiva total
  const calculatePassiveIncome = useCallback(() => {
    return upgrades.reduce((total, upgrade) => {
      if (upgrade.count && upgrade.count > 0) {
        return total + (upgrade.income || 0) * upgrade.count;
      }
      return total;
    }, 0);
  }, [upgrades]);

  // Atualizar moedas passivamente em tempo real (100ms para aspecto fluido)
  useEffect(() => {
    const perSecond = calculatePassiveIncome();
    
    if (perSecond > 0) {
      const interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          coins: prev.coins + (perSecond / 10), // Divide por 10 pois atualiza 10x por segundo
          totalCoins: prev.totalCoins + (perSecond / 10),
          perSecond
        }));
      }, 100); // Atualiza a cada 100ms (10x por segundo) para efeito fluido

      return () => clearInterval(interval);
    }
  }, [calculatePassiveIncome]);

  // Salvar no banco de dados periodicamente (a cada 3 segundos)
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (calculatePassiveIncome() > 0) {
        saveGame(gameState);
      }
    }, 3000); // Salva a cada 3 segundos

    return () => clearInterval(saveInterval);
  }, [gameState, calculatePassiveIncome]);

  // Salvar jogo (pode receber estado opcional)
  const saveGame = async (stateToSave?: GameState) => {
    try {
      const currentState = stateToSave || gameState;
      await saveGameState(uid, currentState, upgrades);
      setLastSave(Date.now());
    } catch (error) {
      console.error('Erro ao salvar jogo:', error);
    }
  };

  // Click manual com efeitos visuais
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Efeito de click no botão
    setClickEffect(true);
    setTimeout(() => setClickEffect(false), 150);

    // Criar moeda flutuante
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newCoin: FloatingCoin = {
        id: coinIdRef.current++,
        x,
        y
      };
      
      setFloatingCoins(prev => [...prev, newCoin]);
      
      // Remover moeda após animação
      setTimeout(() => {
        setFloatingCoins(prev => prev.filter(coin => coin.id !== newCoin.id));
      }, 1000);
    }

    // Atualizar estado e salvar
    setGameState(prev => {
      const newState = {
        ...prev,
        coins: prev.coins + 0.1,
        totalCoins: prev.totalCoins + 0.1,
        totalClicks: prev.totalClicks + 1
      };
      
      // Salvar após cada click
      saveGame(newState);
      
      return newState;
    });
  };

  // Comprar upgrade e salvar
  const handleBuyUpgrade = (upgradeId: string) => {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade || !upgrade.cost) return;

    // Verificar se upgrade composto está desbloqueado
    if (upgrade.isComposite && !upgrade.unlocked) return;

    if (gameState.coins >= upgrade.cost) {
      const newCount = (upgrade.count || 0) + 1;
      const newCost = upgrade.baseCost * Math.pow(upgrade.costMultiplier, newCount);
      const newIncome = upgrade.baseIncome * Math.pow(upgrade.incomeMultiplier, newCount);

      // Atualizar upgrades e recalcular desbloqueios
      setUpgrades(prev => {
        const updated = prev.map(u =>
          u.id === upgradeId
            ? { ...u, count: newCount, cost: newCost, income: newIncome }
            : u
        );

        // Recalcular quais upgrades compostos estão desbloqueados
        const userUpgradesForCheck = updated.map(u => ({ id: u.id, count: u.count || 0 }));
        return updated.map(u => {
          if (u.isComposite && u.requirements) {
            const unlocked = canUnlockCompositeUpgrade(u.requirements, userUpgradesForCheck);
            return { ...u, unlocked };
          }
          return u;
        });
      });

      setGameState(prev => {
        const newState = {
          ...prev,
          coins: prev.coins - upgrade.cost!,
          totalPurchases: prev.totalPurchases + 1
        };
        
        // Salvar após cada compra
        saveGame(newState);
        
        return newState;
      });
    }
  };

  // Lidar com compra do marketplace
  const handleMarketplacePurchase = (sellerId: string, totalPrice: number, upgradeId: string, quantity: number) => {
    // Deduzir moedas
    setGameState(prev => {
      const newState = {
        ...prev,
        coins: prev.coins - totalPrice,
      };
      saveGame(newState);
      return newState;
    });

    // Adicionar upgrades comprados
    setUpgrades(prev => {
      const updated = prev.map(u => {
        if (u.id === upgradeId) {
          const newCount = (u.count || 0) + quantity;
          return {
            ...u,
            count: newCount,
            cost: u.baseCost * Math.pow(u.costMultiplier, newCount),
            income: u.baseIncome * Math.pow(u.incomeMultiplier, newCount)
          };
        }
        return u;
      });
      return updated;
    });
  };

  // Calcular estatísticas de upgrades
  const upgradeStats = {
    total: upgrades.length,
    owned: upgrades.filter(u => (u.count || 0) > 0).length,
    available: upgrades.filter(u => {
      const canAfford = gameState.coins >= (u.cost || 0);
      const isUnlocked = !u.isComposite || u.unlocked;
      return canAfford && isUnlocked;
    }).length,
    locked: upgrades.filter(u => u.isComposite && !u.unlocked).length
  };

  // Filtrar upgrades
  const filteredUpgrades = upgrades.filter(upgrade => {
    const matchesCategory = selectedCategory === 'Todos' || upgrade.category === selectedCategory;
    const matchesSearch = upgrade.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         upgrade.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Itens do inventário (upgrades com count > 0)
  const inventoryItems = upgrades
    .filter(u => (u.count || 0) > 0)
    .sort((a, b) => (b.count || 0) - (a.count || 0));

  // Calcular quantidade de itens por categoria
  const getCategoryCount = (category: string) => {
    if (category === 'Todos') {
      return upgrades.filter(u => {
        const canAfford = gameState.coins >= (u.cost || 0);
        const isUnlocked = !u.isComposite || u.unlocked;
        return canAfford && isUnlocked;
      }).length;
    }
    return upgrades.filter(u => {
      const matchesCategory = u.category === category;
      const canAfford = gameState.coins >= (u.cost || 0);
      const isUnlocked = !u.isComposite || u.unlocked;
      return matchesCategory && canAfford && isUnlocked;
    }).length;
  };

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

          {/* Upgrades Info */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-blue-400">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Upgrades</p>
                <p className="text-3xl font-bold text-blue-600">
                  {upgradeStats.owned}/{upgradeStats.total}
                </p>
              </div>
              <ShoppingCart className="w-12 h-12 text-blue-500" />
            </div>
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                ✅ {upgradeStats.available} disponíveis
              </span>
              {upgradeStats.locked > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full font-semibold">
                  🔒 {upgradeStats.locked} bloqueados
                </span>
              )}
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
            
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={handleClick}
                className={`
                  w-full aspect-square relative overflow-hidden
                  bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500
                  rounded-3xl shadow-2xl
                  hover:shadow-amber-500/60 hover:shadow-3xl
                  transition-all duration-300 transform
                  hover:scale-105 active:scale-95
                  flex items-center justify-center
                  border-4 border-yellow-300/50
                  group
                  ${clickEffect ? 'animate-pulse-fast' : ''}
                `}
              >
                {/* Efeito de brilho */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Partículas de fundo */}
                <div className="absolute inset-0">
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-float-slow"></div>
                  <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-white/20 rounded-full animate-float-medium"></div>
                  <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-white/40 rounded-full animate-float-fast"></div>
                </div>
                
                {/* Ícone da picareta */}
                <div className="relative z-10 text-8xl drop-shadow-2xl transform group-hover:rotate-12 transition-transform duration-300">
                  ⛏️
                </div>
                
                {/* Moedas flutuantes */}
                {floatingCoins.map(coin => (
                  <div
                    key={coin.id}
                    className="absolute text-3xl font-bold text-yellow-300 pointer-events-none animate-float-up"
                    style={{
                      left: coin.x,
                      top: coin.y,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}
                  >
                    +0.1 💰
                  </div>
                ))}
              </button>
            </div>

            <p className="text-center mt-6 text-gray-600 text-base font-medium">
              Clique para ganhar <span className="font-bold text-yellow-600 text-lg">+0.1</span> moedas
            </p>

            {/* Botão de Inventário */}
            <button
              onClick={() => {
                setShowInventory(!showInventory);
                setShowMarketplace(false);
              }}
              className={`w-full mt-4 px-6 py-4 rounded-xl font-bold transition-all ${
                showInventory
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:scale-105'
              } active:scale-95`}
            >
              <div className="flex items-center justify-center gap-2">
                <Package className="w-6 h-6" />
                <span>{showInventory ? '🛒 Ver Loja' : '📦 Ver Inventário'}</span>
                <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-sm">
                  {upgradeStats.owned}
                </span>
              </div>
            </button>

            {/* Botão de Marketplace */}
            <button
              onClick={() => {
                setShowMarketplace(!showMarketplace);
                setShowInventory(false);
              }}
              className={`w-full mt-3 px-6 py-4 rounded-xl font-bold transition-all ${
                showMarketplace
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105'
              } active:scale-95`}
            >
              <div className="flex items-center justify-center gap-2">
                <ShoppingCart className="w-6 h-6" />
                <span>{showMarketplace ? '🎮 Voltar ao Jogo' : '🏪 Marketplace'}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Inventário, Marketplace ou Lista de Upgrades */}
        <div className="lg:col-span-2">
          {showMarketplace ? (
            /* ========== MARKETPLACE ========== */
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-orange-400">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                🏪 Marketplace
              </h2>
              <Marketplace
                userId={uid}
                username={gameState.username || 'Jogador'}
                coins={gameState.coins}
                ownedUpgrades={inventoryItems.map(u => ({
                  id: u.id,
                  name: u.name,
                  icon: u.icon,
                  tier: u.tier || UpgradeTier.COMUM,
                  count: u.count || 0,
                  baseIncome: u.baseIncome,
                  baseCost: u.baseCost
                }))}
                onPurchaseComplete={handleMarketplacePurchase}
              />
            </div>
          ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-green-400">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {showInventory ? '📦 Inventário' : '🛒 Melhorias'}
            </h2>

            {showInventory ? (
              /* ========== INVENTÁRIO ========== */
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {inventoryItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-semibold">Inventário Vazio</p>
                    <p className="text-sm mt-2">Compre upgrades para vê-los aqui!</p>
                  </div>
                ) : (
                  inventoryItems.map(item => {
                    const tierColors = item.tier ? getTierColor(item.tier) : null;
                    const tierGlow = item.tier ? getTierGlow(item.tier) : '';
                    const totalIncome = (item.income || 0) * (item.count || 0);

                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-xl border-2 bg-gradient-to-r from-blue-50 to-purple-50 transition-all ${tierGlow} ${
                          tierColors ? tierColors.border : 'border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">{item.icon}</div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-gray-800">
                                {item.name}
                              </h3>
                              {item.tier && tierColors && (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tierColors.bg} ${tierColors.text}`}>
                                  {getTierName(item.tier)}
                                </span>
                              )}
                              <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-bold">
                                x{item.count}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.description}
                            </p>
                            <div className="flex gap-4 mt-2 text-sm">
                              <span className="text-green-600 font-semibold">
                                📈 +{formatNumber(item.income || 0)}/s cada
                              </span>
                              <span className="text-green-700 font-bold">
                                💰 Total: +{formatNumber(totalIncome)}/s
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              /* ========== LOJA DE UPGRADES ========== */
              <>
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
                    {categories.map(category => {
                      const availableCount = getCategoryCount(category);
                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                            selectedCategory === category
                              ? 'bg-green-500 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <span>{category}</span>
                          {availableCount > 0 && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              selectedCategory === category
                                ? 'bg-white/30 text-white'
                                : 'bg-green-500 text-white'
                            }`}>
                              {availableCount}
                            </span>
                          )}
                        </button>
                      );
                    })}
              </div>
            </div>

            {/* Lista de Upgrades */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredUpgrades.map(upgrade => {
                const canBuy = gameState.coins >= (upgrade.cost || 0);
                const isLocked = upgrade.isComposite && !upgrade.unlocked;
                const tierColors = upgrade.tier ? getTierColor(upgrade.tier) : null;
                const tierGlow = upgrade.tier ? getTierGlow(upgrade.tier) : '';
                const userUpgrades = upgrades.map(u => ({ id: u.id, count: u.count || 0 }));
                const missingReqs = isLocked && upgrade.requirements 
                  ? getMissingRequirements(upgrade.requirements, userUpgrades, upgradesData)
                  : [];
                
                return (
                  <div
                    key={upgrade.id}
                    className={`p-4 rounded-xl border-2 transition-all ${tierGlow} ${
                      isLocked
                        ? 'bg-gray-100 border-gray-300 opacity-50'
                        : canBuy
                        ? 'bg-gradient-to-r from-green-50 to-yellow-50 border-green-300 hover:shadow-lg'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    } ${tierColors ? tierColors.border : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl relative">
                        {upgrade.icon}
                        {isLocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                            <Lock className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-800 truncate">
                            {upgrade.name}
                            {upgrade.count ? ` (${upgrade.count})` : ''}
                          </h3>
                          {upgrade.tier && tierColors && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tierColors.bg} ${tierColors.text}`}>
                              {getTierName(upgrade.tier)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {upgrade.description}
                        </p>
                        
                        {isLocked && missingReqs.length > 0 ? (
                          <div className="mt-1 text-xs text-red-600">
                            🔒 Requisitos: {missingReqs.join(', ')}
                          </div>
                        ) : (
                          <div className="flex gap-4 mt-1 text-sm">
                            <span className="text-yellow-600 font-semibold">
                              💰 {formatNumber(upgrade.cost || 0)}
                            </span>
                            <span className="text-green-600 font-semibold">
                              📈 +{formatNumber(upgrade.income || 0)}/s
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleBuyUpgrade(upgrade.id)}
                        disabled={!canBuy || isLocked}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${
                          isLocked
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : canBuy
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:scale-105 active:scale-95'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isLocked ? '🔒 Bloqueado' : 'Comprar'}
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
          </>
            )}
          </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-150px) scale(1.5);
            opacity: 0;
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-medium {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes float-fast {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-fast {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(0.95);
          }
        }

        .animate-float-up {
          animation: float-up 1s ease-out forwards;
        }

        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 3s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 2s ease-in-out infinite;
        }

        .animate-pulse-fast {
          animation: pulse-fast 0.15s ease-in-out;
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

        @keyframes pulse-slow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(147, 51, 234, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(147, 51, 234, 0.6);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 15px rgba(251, 146, 60, 0.4), 0 0 30px rgba(251, 146, 60, 0.2);
          }
          50% {
            box-shadow: 0 0 25px rgba(251, 146, 60, 0.6), 0 0 50px rgba(251, 146, 60, 0.3);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
