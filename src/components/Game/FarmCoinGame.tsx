// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Coins, TrendingUp, ShoppingCart, Search, Lock, Package, Shield, AlertTriangle } from 'lucide-react';
import { upgrades as upgradesData, categories } from '../../data/upgrades';
import { GameState, Upgrade, UpgradeTier } from '../../types';
import { saveGameState, createMarketplaceListing } from '../../firebase/firestore';
import { getTierColor, getTierName, getTierGlow, canUnlockCompositeUpgrade, getMissingRequirements } from '../../utils/tierSystem';
import { antiBot } from '../../utils/antiBot';
import { uniqueItems, UniqueItem } from '../../utils/uniqueItems';
import Marketplace from './Marketplace';
import Ranking from './Ranking';
import Guild from './Guild';

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
  console.log('🎮 FarmCoinGame iniciado com:', {
    uid,
    initialCoins: initialGameState.coins,
    initialUpgrades: initialUpgrades?.length || 0,
    initialPerSecond: initialGameState.perSecond
  });
  
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [upgrades, setUpgrades] = useState<Upgrade[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [lastSave, setLastSave] = useState(Date.now());
  const [floatingCoins, setFloatingCoins] = useState<FloatingCoin[]>([]);
  const [clickEffect, setClickEffect] = useState(false);
  const [isMining, setIsMining] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [activeTab, setActiveTab] = useState<'melhorias' | 'inventario' | 'marketplace' | 'ranking' | 'guild'>('melhorias');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [itemQuantities, setItemQuantities] = useState<Map<string, number>>(new Map());
  const [showBulkSellModal, setShowBulkSellModal] = useState(false);
  const [bulkSellPrice, setBulkSellPrice] = useState<'floor' | 'custom'>('floor');
  const [customPrice, setCustomPrice] = useState(0);
  const [showAllIncomeItems, setShowAllIncomeItems] = useState(false);
  const [botWarning, setBotWarning] = useState<string>('');
  const [uniqueItemsOwned, setUniqueItemsOwned] = useState<UniqueItem[]>([]);
  const [showUniqueItemNotification, setShowUniqueItemNotification] = useState<UniqueItem | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const coinIdRef = useRef(0);

  // Inicializar upgrades
  useEffect(() => {
    console.log('🔧 Inicializando upgrades com dados salvos:', initialUpgrades?.length || 0);
    
    const initializedUpgrades = upgradesData.map(upgrade => {
      // Buscar dados salvos do usuário primeiro
      const savedUpgrade = initialUpgrades?.find(u => u.id === upgrade.id);
      const count = savedUpgrade?.count || 0;
      
      if (count > 0) {
        console.log(`  ✅ ${upgrade.name}: ${count} unidades`);
      }
      
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
    
    console.log('✨ Upgrades inicializados:', initializedUpgrades.filter(u => u.count > 0).length, 'itens possuídos');
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
      // Usar uma função para pegar os valores mais recentes
      setGameState(currentState => {
        setUpgrades(currentUpgrades => {
          // Salvar com os valores atuais
          saveGameState(uid, currentState, currentUpgrades).catch(console.error);
          return currentUpgrades;
        });
        return currentState;
      });
    }, 3000); // Salva a cada 3 segundos

    return () => clearInterval(saveInterval);
  }, [uid]); // Apenas uid como dependência

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

  // Click manual com efeitos visuais e proteção anti-bot
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 🛡️ PROTEÇÃO ANTI-BOT
    const validation = antiBot.validateClick(uid);
    
    if (!validation.allowed) {
      // Bloquear click
      setBotWarning(validation.reason || 'Click bloqueado');
      setTimeout(() => setBotWarning(''), 5000);
      return;
    }

    // Mostrar aviso se houver
    if (validation.warning) {
      setBotWarning(validation.warning);
      setTimeout(() => setBotWarning(''), 3000);
    }

    // Efeito de click no botão
    setClickEffect(true);
    setTimeout(() => setClickEffect(false), 150);

    // Animação de mineração
    setIsMining(true);
    setTimeout(() => setIsMining(false), 600);

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

      let updatedUpgrades: Upgrade[] = [];

      // 🎁 TENTAR GERAR ITEM ÚNICO (apenas para upgrades de produção em cadeia)
      if (upgrade.isComposite) {
        const uniqueItem = uniqueItems.generateUniqueItem(
          uid,
          upgrade.id,
          upgrade.name,
          upgrade.baseCost
        );

        if (uniqueItem) {
          // Mostrar notificação de item único gerado!
          setShowUniqueItemNotification(uniqueItem);
          setTimeout(() => setShowUniqueItemNotification(null), 10000);

          // Atualizar lista de itens únicos
          setUniqueItemsOwned(prev => [...prev, uniqueItem]);
          
          console.log(`🎉 ITEM ÚNICO GERADO! ${uniqueItem.name} #${uniqueItem.serialNumber}`);
        }
      }

      // Atualizar upgrades e recalcular desbloqueios
      setUpgrades(prev => {
        const updated = prev.map(u =>
          u.id === upgradeId
            ? { ...u, count: newCount, cost: newCost, income: newIncome }
            : u
        );

        // Recalcular quais upgrades compostos estão desbloqueados
        const userUpgradesForCheck = updated.map(u => ({ id: u.id, count: u.count || 0 }));
        updatedUpgrades = updated.map(u => {
          if (u.isComposite && u.requirements) {
            const unlocked = canUnlockCompositeUpgrade(u.requirements, userUpgradesForCheck);
            return { ...u, unlocked };
          }
          return u;
        });
        return updatedUpgrades;
      });

      // Atualizar estado e salvar COM os upgrades atualizados
      setGameState(prev => {
        const newState = {
          ...prev,
          coins: prev.coins - upgrade.cost!,
          totalPurchases: prev.totalPurchases + 1
        };
        
        // Salvar após cada compra com os upgrades atualizados
        setTimeout(() => saveGameState(uid, newState, updatedUpgrades), 0);
        
        return newState;
      });
    }
  };

  // Lidar com compra do marketplace
  const handleMarketplacePurchase = (sellerId: string, totalPrice: number, upgradeId: string, quantity: number) => {
    let updatedUpgrades: Upgrade[] = [];

    // Adicionar upgrades comprados
    setUpgrades(prev => {
      updatedUpgrades = prev.map(u => {
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
      return updatedUpgrades;
    });

    // Deduzir moedas e salvar COM os upgrades atualizados
    setGameState(prev => {
      const newState = {
        ...prev,
        coins: prev.coins - totalPrice,
      };
      // Salvar com os upgrades atualizados
      setTimeout(() => saveGameState(uid, newState, updatedUpgrades), 0);
      return newState;
    });
  };

  // Toggles de seleção
  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
        // Remove quantidade quando desmarcar
        setItemQuantities(prevQty => {
          const newQty = new Map(prevQty);
          newQty.delete(itemId);
          return newQty;
        });
      } else {
        newSet.add(itemId);
        // Inicializa quantidade como 1 quando marcar
        const item = inventoryItems.find(i => i.id === itemId);
        setItemQuantities(prevQty => {
          const newQty = new Map(prevQty);
          newQty.set(itemId, 1);
          return newQty;
        });
      }
      return newSet;
    });
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    const item = inventoryItems.find(i => i.id === itemId);
    if (!item) return;
    
    // Limita quantidade entre 1 e o total disponível
    const validQuantity = Math.max(1, Math.min(quantity, item.count || 1));
    
    setItemQuantities(prev => {
      const newMap = new Map(prev);
      newMap.set(itemId, validQuantity);
      return newMap;
    });
  };

  const selectAll = () => {
    const allIds = new Set(inventoryItems.map(item => item.id));
    setSelectedItems(allIds);
    // Inicializa quantidades como 1 para cada item
    const quantities = new Map(inventoryItems.map(item => [item.id, 1]));
    setItemQuantities(quantities);
  };

  const deselectAll = () => {
    setSelectedItems(new Set());
    setItemQuantities(new Map());
  };

  const selectByCategory = (category: string) => {
    const filteredItems = inventoryItems.filter(item => item.category === category);
    const categoryIds = new Set(filteredItems.map(item => item.id));
    setSelectedItems(categoryIds);
    // Inicializa quantidades como 1 para cada item da categoria
    const quantities = new Map(filteredItems.map(item => [item.id, 1]));
    setItemQuantities(quantities);
  };

  const selectByTier = (tier: UpgradeTier) => {
    const filteredItems = inventoryItems.filter(item => item.tier === tier);
    const tierIds = new Set(filteredItems.map(item => item.id));
    setSelectedItems(tierIds);
    // Inicializa quantidades como 1 para cada item do tier
    const quantities = new Map(filteredItems.map(item => [item.id, 1]));
    setItemQuantities(quantities);
  };

  // Calcular floor price (90% do custo base médio)
  const calculateFloorPrice = (upgrade: Upgrade) => {
    return Math.floor(upgrade.baseCost * 0.9);
  };

  // Calcular preço sugerido baseado em eficiência
  const calculateSuggestedPrice = (upgrade: Upgrade) => {
    const efficiency = upgrade.baseIncome / upgrade.baseCost;
    return Math.floor(upgrade.baseCost * (0.8 + efficiency * 0.1));
  };

  // Listar itens selecionados
  const handleBulkSell = async () => {
    if (selectedItems.size === 0) {
      alert('Selecione pelo menos um item para vender!');
      return;
    }

    const itemsToList = inventoryItems.filter(item => selectedItems.has(item.id));
    
    for (const item of itemsToList) {
      const pricePerUnit = bulkSellPrice === 'floor' 
        ? calculateFloorPrice(item)
        : customPrice;

      if (pricePerUnit <= 0) {
        continue;
      }

      // Pega a quantidade selecionada do Map, ou 1 como padrão
      const quantityToSell = itemQuantities.get(item.id) || 1;

      try {
        await createMarketplaceListing({
          sellerId: uid,
          sellerUsername: gameState.username || 'Jogador',
          upgradeId: item.id,
          upgradeName: item.name,
          upgradeIcon: item.icon,
          upgradeTier: item.tier,
          quantity: quantityToSell,
          pricePerUnit,
          totalPrice: pricePerUnit * quantityToSell,
          incomePerUnit: item.baseIncome,
          totalIncome: item.baseIncome * quantityToSell,
          originalCost: item.baseCost,
          acceptOffers: false,
          status: 'active',
        });
      } catch (error) {
        console.error('Erro ao listar item:', error);
      }
    }

    alert(`${itemsToList.length} itens listados com sucesso!`);
    setShowBulkSellModal(false);
    setSelectedItems(new Set());
    setItemQuantities(new Map());
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

  // Itens que geram moedas (com income > 0 e count > 0)
  const incomeGeneratingItems = upgrades
    .filter(u => (u.count || 0) > 0 && (u.income || 0) > 0)
    .sort((a, b) => {
      // Ordenar por total de income gerado (income * count)
      const totalIncomeA = (a.income || 0) * (a.count || 0);
      const totalIncomeB = (b.income || 0) * (b.count || 0);
      return totalIncomeB - totalIncomeA;
    });

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

  // Obter emoji para categoria
  const getCategoryEmoji = (category: string): string => {
    const emojiMap: { [key: string]: string } = {
      'Todos': '🌟',
      'Terrenos': '🗺️',
      'Plantação Básica': '🌱',
      'Criação de Gado': '🐄',
      'Pomar': '🍎',
      'Apicultura': '🐝',
      'Piscicultura': '🐟',
      'Vinicultura': '🍇',
      'Laticínios': '🥛',
      'Agricultura Industrial': '🏭',
      'Processamento': '⚙️',
      'Tecnologia Futurista': '🚀',
      'Upgrades Compostos': '⭐',
      'Produção em Cadeia': '⚙️'
    };
    return emojiMap[category] || '📦';
  };

  // Formatar número (mostra número completo sem abreviação)
  const formatNumber = (num: number): string => {
    return num.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  console.log('🎨 FarmCoinGame: Pronto para renderizar UI');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 p-mobile sm:p-4 pb-safe">
      {/* 🎁 Notificação de Item Único */}
      {showUniqueItemNotification && (
        <div className="fixed top-20 right-4 z-50 animate-bounce">
          <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 text-white p-6 rounded-2xl shadow-2xl border-4 border-yellow-300 max-w-sm">
            <div className="flex items-start gap-4">
              <div className="text-6xl">{showUniqueItemNotification.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold">🎉 ITEM ÚNICO!</span>
                </div>
                <h3 className="text-xl font-bold mb-1">{showUniqueItemNotification.name}</h3>
                <p className="text-sm opacity-90 mb-2">{showUniqueItemNotification.description}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-white/20 px-2 py-1 rounded-full">
                    #{showUniqueItemNotification.serialNumber}
                  </span>
                  <span className="bg-white/20 px-2 py-1 rounded-full">
                    Raridade: {showUniqueItemNotification.rarity.toFixed(1)}
                  </span>
                  <span className="bg-white/20 px-2 py-1 rounded-full">
                    Bônus: +{((showUniqueItemNotification.bonusMultiplier - 1) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowUniqueItemNotification(null)}
              className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header Stats */}
      <div className="max-w-7xl mx-auto mb-mobile">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-mobile">
          {/* Moedas Atuais */}
          <div className="glass-vibrant rounded-2xl p-mobile sm:p-6 shadow-2xl achievement-glow dopamine-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-mobile-xs sm:text-sm text-gray-900/90 mb-1 font-semibold">💰 Moedas</p>
                <p className="text-mobile-lg sm:text-4xl font-black bg-gradient-to-r from-yellow-500 via-amber-600 to-orange-600 bg-clip-text text-transparent gradient-text-readable">
                  {formatNumber(gameState.coins)}
                </p>
              </div>
              <div className="text-4xl sm:text-5xl animate-float filter drop-shadow-2xl">
                💎
              </div>
            </div>
          </div>

          {/* Renda Passiva */}
          <div className="glass-vibrant rounded-2xl p-mobile sm:p-6 shadow-2xl achievement-glow dopamine-hover">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-mobile-xs sm:text-sm text-gray-900/90 mb-1 font-semibold">📈 Por Segundo</p>
                <p className="text-mobile-lg sm:text-4xl font-black bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 bg-clip-text text-transparent gradient-text-readable">
                  {formatNumber(gameState.perSecond)}
                </p>
                
                {/* Display de itens geradores de moeda */}
                {incomeGeneratingItems.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center flex-wrap gap-1">
                      {/* Mostrar até 20 itens ou todos se expandido */}
                      {(showAllIncomeItems ? incomeGeneratingItems : incomeGeneratingItems.slice(0, 20)).map((item, index) => (
                        <div
                          key={item.id}
                          className="relative group cursor-pointer transition-transform hover:scale-110 hover:z-10"
                          style={{
                            marginLeft: index > 0 ? '-12px' : '0',
                            zIndex: incomeGeneratingItems.length - index
                          }}
                          title={`${item.name} - ${item.count}x (+${formatNumber((item.income || 0) * (item.count || 0))}/s)`}
                        >
                          <div className="text-2xl bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md border-2 border-green-200 group-hover:border-green-400 transition-all">
                            {item.icon}
                          </div>
                          
                          {/* Tooltip no hover */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                            {item.name} x{item.count}
                            <br />
                            +{formatNumber((item.income || 0) * (item.count || 0))}/s
                          </div>
                        </div>
                      ))}
                      
                      {/* Botão de expandir se houver mais de 20 itens */}
                      {incomeGeneratingItems.length > 20 && (
                        <button
                          onClick={() => setShowAllIncomeItems(!showAllIncomeItems)}
                          className="relative group cursor-pointer transition-all hover:scale-110 hover:z-10 ml-1"
                          style={{ zIndex: 0 }}
                        >
                          <div className="text-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md border-2 border-purple-300 hover:border-purple-400 font-bold transition-all">
                            {showAllIncomeItems ? '−' : `+${incomeGeneratingItems.length - 20}`}
                          </div>
                          
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                            {showAllIncomeItems ? 'Mostrar menos' : `Ver todos (${incomeGeneratingItems.length})`}
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <TrendingUp className="w-12 h-12 text-green-500" />
            </div>
          </div>

          {/* Upgrades Info */}
          <div className="glass-vibrant rounded-2xl p-6 shadow-2xl achievement-glow dopamine-hover">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-900/90 mb-1 font-semibold">🎁 Upgrades</p>
                <p className="text-4xl font-black bg-gradient-to-r from-blue-500 via-cyan-600 to-purple-600 bg-clip-text text-transparent gradient-text-readable">
                  {upgradeStats.owned}/{upgradeStats.total}
                </p>
              </div>
              <div className="text-5xl animate-float filter drop-shadow-2xl">
                🎮
              </div>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-full font-bold shadow-lg">
                ✅ {upgradeStats.available}
              </span>
              {upgradeStats.locked > 0 && (
                <span className="px-3 py-1 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-full font-bold shadow-lg">
                  🔒 {upgradeStats.locked}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Área de Click */}
        <div className="lg:col-span-1">
          <div className="glass-vibrant rounded-3xl p-8 shadow-2xl achievement-glow">
            <h2 className="text-3xl font-black text-center mb-6 bg-gradient-to-r from-yellow-500 via-amber-600 to-orange-600 bg-clip-text text-transparent gradient-text-readable">
              ⛏️ Fazenda
            </h2>
            
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={handleClick}
                className={`
                  w-full max-w-xs mx-auto aspect-square relative overflow-hidden
                  bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400
                  rounded-3xl
                  transition-all duration-200
                  flex items-center justify-center
                  border-4 border-yellow-300/60
                  cursor-pointer select-none
                  ${isMining ? 'btn-mine-active' : 'btn-mine-idle'}
                `}
              >
                {/* Shimmer de fundo */}
                <div className="absolute inset-0 shimmer"></div>
                
                {/* Onda de choque ao clicar */}
                {isMining && (
                  <div className="absolute inset-0 shockwave bg-white/30 rounded-3xl pointer-events-none"></div>
                )}
                
                {/* Partículas de fundo animadas */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-[15%] left-[20%] w-3 h-3 bg-white/40 rounded-full float-particle-1"></div>
                  <div className="absolute top-[60%] right-[15%] w-4 h-4 bg-yellow-200/50 rounded-full float-particle-2"></div>
                  <div className="absolute bottom-[25%] left-[35%] w-2.5 h-2.5 bg-amber-200/40 rounded-full float-particle-3"></div>
                  <div className="absolute top-[40%] right-[30%] w-3 h-3 bg-white/30 rounded-full float-particle-1" style={{animationDelay: '1s'}}></div>
                  <div className="absolute bottom-[45%] left-[15%] w-2 h-2 bg-yellow-300/40 rounded-full float-particle-2" style={{animationDelay: '1.5s'}}></div>
                </div>
                
                {/* Estrelas de recompensa ao clicar */}
                {isMining && (
                  <>
                    <div className="absolute top-1/4 left-1/4 text-3xl reward-star pointer-events-none">⭐</div>
                    <div className="absolute top-1/4 right-1/4 text-3xl reward-star pointer-events-none" style={{animationDelay: '0.1s'}}>✨</div>
                    <div className="absolute bottom-1/4 left-1/3 text-3xl reward-star pointer-events-none" style={{animationDelay: '0.05s'}}>💫</div>
                  </>
                )}
                
                {/* Ícone da picareta */}
                <div className={`relative z-10 text-7xl filter drop-shadow-2xl ${
                  isMining ? 'pickaxe-mining' : 'pickaxe-idle'
                }`}>
                  ⛏️
                </div>
                
                {/* Moedas flutuantes aprimoradas */}
                {floatingCoins.map(coin => (
                  <div
                    key={coin.id}
                    className="absolute text-4xl font-black text-yellow-300 pointer-events-none coin-float-up"
                    style={{
                      left: coin.x,
                      top: coin.y,
                      textShadow: '0 0 10px rgba(251, 191, 36, 0.8), 2px 2px 4px rgba(0,0,0,0.5)',
                      filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))'
                    }}
                  >
                    +0.1 💰
                  </div>
                ))}
                
                {/* Partículas de ouro ao clicar */}
                {isMining && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute particle-burst text-2xl"
                        style={{
                          left: `${50 + Math.cos(i * Math.PI / 4) * 30}%`,
                          top: `${50 + Math.sin(i * Math.PI / 4) * 30}%`,
                          animationDelay: `${i * 0.05}s`
                        }}
                      >
                        ✨
                      </div>
                    ))}
                  </div>
                )}
              </button>
            </div>

            <p className="text-center mt-6 text-gray-600 text-base font-semibold">
              Clique para ganhar <span className="font-bold text-yellow-600 text-xl animate-pulse">+0.1</span> moedas
            </p>

            {/* 🛡️ Aviso Anti-Bot */}
            {botWarning && (
              <div className={`mt-4 p-3 rounded-lg text-center font-semibold text-sm ${
                botWarning.includes('🤖') || botWarning.includes('🚫') 
                  ? 'bg-red-100 text-red-700 border-2 border-red-300'
                  : 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
              }`}>
                <div className="flex items-center justify-center gap-2">
                  {botWarning.includes('🤖') || botWarning.includes('🚫') ? (
                    <Shield className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                  <span>{botWarning}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Inventário, Marketplace, Ranking ou Lista de Upgrades */}
        <div className="lg:col-span-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
            {/* Sistema de Abas */}
            <div className="flex border-b-2 border-gray-200">
              <button
                onClick={() => setActiveTab('melhorias')}
                className={`flex-1 px-6 py-4 font-bold text-lg transition-all ${
                  activeTab === 'melhorias'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-b-4 border-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🛒 Melhorias
              </button>
              
              <button
                onClick={() => setActiveTab('inventario')}
                className={`flex-1 px-6 py-4 font-bold text-lg transition-all ${
                  activeTab === 'inventario'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-b-4 border-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                📦 Ver Inventário
              </button>
              
              <button
                onClick={() => setActiveTab('guild')}
                className={`flex-1 px-6 py-4 font-bold text-lg transition-all ${
                  activeTab === 'guild'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-b-4 border-purple-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🏰 Guildas
              </button>
              
              <button
                onClick={() => setActiveTab('marketplace')}
                className={`flex-1 px-6 py-4 font-bold text-lg transition-all ${
                  activeTab === 'marketplace'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-b-4 border-orange-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🏪 Marketplace
              </button>
              
              <button
                onClick={() => setActiveTab('ranking')}
                className={`flex-1 px-6 py-4 font-bold text-lg transition-all ${
                  activeTab === 'ranking'
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-b-4 border-yellow-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🏆 Ranking
              </button>
            </div>

            {/* Conteúdo das Abas */}
            <div className="p-6">
              {activeTab === 'inventario' && (
              /* ========== INVENTÁRIO ========== */
              <>
                {/* Controles de Seleção e Venda em Massa */}
                {inventoryItems.length > 0 && (
                  <div className="mb-6 p-5 glass-vibrant rounded-2xl border-2 border-white/30 shadow-xl">
                    <div className="flex flex-wrap gap-3 mb-4">
                      <button
                        onClick={selectAll}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] text-white rounded-xl text-sm font-black transition-all shadow-lg dopamine-hover"
                      >
                        ✅ Selecionar Todos
                      </button>
                      <button
                        onClick={deselectAll}
                        className="px-5 py-2.5 glass-vibrant hover:bg-white/20 text-gray-900 rounded-xl text-sm font-black transition-all shadow-lg dopamine-hover border border-white/30"
                      >
                        ❌ Desmarcar Todos
                      </button>
                      
                      {/* Seleção por Tier */}
                      <select
                        onChange={(e) => e.target.value && selectByTier(e.target.value as UpgradeTier)}
                        className="px-4 py-2.5 glass-vibrant backdrop-blur-md border-2 border-white/30 rounded-xl text-sm font-black text-gray-900 cursor-pointer shadow-lg hover:border-purple-300 transition-all"
                        defaultValue=""
                      >
                        <option value="" className="bg-gray-800 text-white">🎨 Por Raridade</option>
                        <option value={UpgradeTier.COMUM} className="bg-gray-800 text-white">⚪ Comum</option>
                        <option value={UpgradeTier.INCOMUM} className="bg-gray-800 text-white">🟢 Incomum</option>
                        <option value={UpgradeTier.RARO} className="bg-gray-800 text-white">🔵 Raro</option>
                        <option value={UpgradeTier.EPICO} className="bg-gray-800 text-white">🟣 Épico</option>
                        <option value={UpgradeTier.LENDARIO} className="bg-gray-800 text-white">🔴 Lendário</option>
                        <option value={UpgradeTier.MITICO} className="bg-gray-800 text-white">⭐ Mítico</option>
                      </select>

                      {/* Seleção por Categoria */}
                      <select
                        onChange={(e) => e.target.value && selectByCategory(e.target.value)}
                        className="px-4 py-2.5 glass-vibrant backdrop-blur-md border-2 border-white/30 rounded-xl text-sm font-black text-gray-900 cursor-pointer shadow-lg hover:border-purple-300 transition-all"
                        defaultValue=""
                      >
                        <option value="" className="bg-gray-800 text-white">📁 Por Categoria</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id} className="bg-gray-800 text-white">
                            {cat.icon} {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between glass-vibrant p-4 rounded-2xl border border-white/30">
                      <span className="text-lg font-black bg-gradient-to-r from-purple-500 via-pink-600 to-purple-600 bg-clip-text text-transparent gradient-text-readable">
                        ✨ {selectedItems.size} item(ns) selecionado(s)
                      </span>
                      <button
                        onClick={() => setShowBulkSellModal(true)}
                        disabled={selectedItems.size === 0}
                        className={`px-6 py-3 rounded-2xl font-black transition-all shadow-lg ${
                          selectedItems.size > 0
                            ? 'bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 text-white hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:scale-105 active:scale-95'
                            : 'bg-gray-400/50 text-gray-300 cursor-not-allowed backdrop-blur-sm'
                        }`}
                      >
                        🏷️ Listar Selecionados
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {inventoryItems.length === 0 ? (
                  <div className="text-center py-16 glass-vibrant rounded-3xl">
                    <Package className="w-24 h-24 mx-auto mb-6 text-gray-400 animate-bounce" />
                    <p className="text-3xl font-black text-gray-900">Inventário Vazio</p>
                    <p className="text-lg text-gray-800/90 mt-3 font-semibold">Compre upgrades para vê-los aqui! 🛒✨</p>
                  </div>
                ) : (
                  inventoryItems.map(item => {
                    const tierColors = item.tier ? getTierColor(item.tier) : null;
                    const tierGlow = item.tier ? getTierGlow(item.tier) : '';
                    const totalIncome = (item.income || 0) * (item.count || 0);
                    const isSelected = selectedItems.has(item.id);

                    return (
                      <div
                        key={item.id}
                        className={`glass-vibrant p-5 rounded-2xl border-2 transition-all duration-300 ${
                          isSelected 
                            ? 'border-purple-300 shadow-[0_0_30px_rgba(168,85,247,0.6)] scale-[1.02] achievement-glow' 
                            : `border-white/30 ${tierGlow} dopamine-hover hover:scale-[1.01]`
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Checkbox de seleção */}
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleItemSelection(item.id)}
                            className="w-6 h-6 cursor-pointer accent-purple-500 scale-125"
                          />
                          
                          {/* Input de quantidade (só aparece quando selecionado) */}
                          {isSelected && (
                            <div className="flex flex-col items-center glass-vibrant p-3 rounded-xl border border-purple-300">
                              <label className="text-xs text-gray-900 font-bold mb-1">
                                Qtd:
                              </label>
                              <input
                                type="number"
                                min="1"
                                max={item.count || 1}
                                value={itemQuantities.get(item.id) || 1}
                                onChange={(e) => updateItemQuantity(item.id, Number(e.target.value))}
                                onClick={(e) => e.stopPropagation()}
                                className="w-20 px-3 py-2 border-2 border-purple-300 rounded-lg text-center font-black bg-white/20 backdrop-blur-sm text-gray-900 focus:ring-4 focus:ring-purple-400/50 outline-none"
                              />
                              <span className="text-xs text-gray-700 mt-1 font-semibold">
                                de {item.count}
                              </span>
                            </div>
                          )}
                          
                          <div className="text-5xl animate-float drop-shadow-2xl">{item.icon}</div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-black text-xl text-gray-900">
                                {item.name}
                              </h3>
                              {item.tier && tierColors && (
                                <span className={`px-3 py-1 rounded-full text-xs font-black ${tierColors.bg} ${tierColors.text} shadow-lg animate-pulse`}>
                                  ✨ {getTierName(item.tier)}
                                </span>
                              )}
                              <span className="px-4 py-1.5 bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-full text-sm font-black shadow-lg">
                                x{item.count}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800 font-medium mt-1">
                              {item.description}
                            </p>
                            <div className="flex gap-4 mt-2 text-sm">
                              <span className="font-black bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 bg-clip-text text-transparent gradient-text-readable">
                                📈 +{formatNumber(item.income || 0)}/s cada
                              </span>
                              <span className="font-black text-lg bg-gradient-to-r from-green-600 via-emerald-700 to-teal-700 bg-clip-text text-transparent gradient-text-readable">
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
              </>
              )}

              {activeTab === 'melhorias' && (
              /* ========== LOJA DE UPGRADES ========== */
              <>
                {/* Filtros */}
                <div className="mb-6 space-y-4">
                  {/* Busca */}
                  <div className="relative glass-vibrant rounded-2xl p-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 w-6 h-6" />
                    <input
                      type="text"
                      placeholder="🔎 Buscar melhorias mágicas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-14 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/30 text-gray-900 placeholder-gray-600 font-semibold focus:border-yellow-300 focus:ring-4 focus:ring-yellow-400/50 outline-none transition-all"
                    />
                  </div>

                  {/* Categorias */}
                  <div className="flex flex-wrap gap-3">
                    {categories.map(category => {
                      const availableCount = getCategoryCount(category);
                      const emoji = getCategoryEmoji(category);
                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-5 py-3 rounded-2xl font-black text-sm transition-all duration-200 flex items-center gap-2 shadow-lg ${
                            selectedCategory === category
                              ? 'bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 text-white scale-110 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                              : 'glass-vibrant text-gray-900 hover:scale-105 dopamine-hover'
                          }`}
                        >
                          <span className="text-xl">{emoji}</span>
                          <span>{category}</span>
                          {availableCount > 0 && (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-black shadow-lg animate-pulse ${
                              selectedCategory === category
                                ? 'bg-white/30 text-gray-900'
                                : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
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
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredUpgrades.map(upgrade => {
                const canBuy = gameState.coins >= (upgrade.cost || 0);
                const isLocked = upgrade.isComposite && !upgrade.unlocked;
                const tierColors = upgrade.tier ? getTierColor(upgrade.tier) : null;
                const tierGlow = upgrade.tier ? getTierGlow(upgrade.tier) : '';
                const userUpgrades = upgrades.map(u => ({ id: u.id, count: u.count || 0 }));
                const missingReqs = isLocked && upgrade.requirements 
                  ? getMissingRequirements(upgrade.requirements, userUpgrades, upgradesData)
                  : [];
                
                // Pegar os upgrades que faltam (objetos completos)
                const missingUpgrades = isLocked && upgrade.requirements
                  ? upgrade.requirements
                      .map(req => {
                        const reqUpgrade = upgradesData.find(u => u.id === req.upgradeId);
                        const userUpgrade = userUpgrades.find(u => u.id === req.upgradeId);
                        const hasEnough = (userUpgrade?.count || 0) >= req.minCount;
                        
                        if (!hasEnough && reqUpgrade) {
                          return {
                            ...reqUpgrade,
                            requiredCount: req.minCount,
                            currentCount: userUpgrade?.count || 0,
                            needToBuy: req.minCount - (userUpgrade?.count || 0)
                          };
                        }
                        return null;
                      })
                      .filter(Boolean)
                  : [];
                
                return (
                  <div
                    key={upgrade.id}
                    className={`glass-vibrant p-5 rounded-2xl border-2 transition-all duration-300 ${
                      isLocked
                        ? 'border-red-300/50'
                        : canBuy
                        ? 'achievement-glow dopamine-hover border-yellow-300/50 hover:scale-[1.02] hover:-translate-y-1'
                        : 'opacity-70 border-white/20'
                    } ${tierGlow}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-6xl relative animate-float drop-shadow-2xl">
                        {upgrade.icon}
                        {isLocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl backdrop-blur-sm">
                            <Lock className="w-8 h-8 text-white animate-pulse" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-black text-xl text-gray-900">
                            {upgrade.name}
                            {upgrade.count ? ` (${upgrade.count})` : ''}
                          </h3>
                          {upgrade.tier && tierColors && (
                            <span className={`px-3 py-1 rounded-full text-xs font-black ${tierColors.bg} ${tierColors.text} shadow-lg animate-pulse`}>
                              ✨ {getTierName(upgrade.tier)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-800 font-medium mt-1">
                          {upgrade.description}
                        </p>
                        
                        {isLocked && missingUpgrades.length > 0 ? (
                          <div className="mt-3 space-y-2">
                            <div className="text-sm font-bold text-red-700 flex items-center gap-2">
                              <Lock className="w-4 h-4" />
                              <span>🔒 Requisitos Faltantes:</span>
                            </div>
                            
                            {/* Lista de itens faltantes com botões de compra */}
                            <div className="space-y-2">
                              {missingUpgrades.map((missingUpg: any) => {
                                const canBuyReq = gameState.coins >= (missingUpg.baseCost || 0);
                                const totalCost = (missingUpg.baseCost || 0) * missingUpg.needToBuy;
                                
                                return (
                                  <div 
                                    key={missingUpg.id}
                                    className="glass-vibrant p-3 rounded-xl border border-orange-300 flex items-center justify-between gap-3"
                                  >
                                    <div className="flex items-center gap-2 flex-1">
                                      <span className="text-2xl">{missingUpg.icon}</span>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-black text-sm text-gray-900">
                                          {missingUpg.name}
                                        </p>
                                        <p className="text-xs text-gray-700">
                                          Tem: {missingUpg.currentCount} | Precisa: {missingUpg.requiredCount}
                                          {missingUpg.needToBuy > 1 && ` (Comprar ${missingUpg.needToBuy}x)`}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <button
                                      onClick={() => {
                                        // Comprar múltiplas unidades se necessário
                                        for (let i = 0; i < missingUpg.needToBuy; i++) {
                                          handleBuyUpgrade(missingUpg.id);
                                        }
                                      }}
                                      disabled={gameState.coins < totalCost}
                                      className={`px-4 py-2 rounded-xl font-black text-xs transition-all shadow-lg whitespace-nowrap ${
                                        gameState.coins >= totalCost
                                          ? 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95'
                                          : 'bg-gray-400/50 text-gray-300 cursor-not-allowed'
                                      }`}
                                    >
                                      {gameState.coins >= totalCost 
                                        ? `🛒 ${formatNumber(totalCost)}` 
                                        : '💰 Sem Moedas'
                                      }
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-4 mt-2 text-sm">
                            <span className="font-black text-lg bg-gradient-to-r from-yellow-500 via-amber-600 to-orange-600 bg-clip-text text-transparent gradient-text-readable">
                              💰 {formatNumber(upgrade.cost || 0)}
                            </span>
                            <span className="font-black text-lg bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 bg-clip-text text-transparent gradient-text-readable">
                              📈 +{formatNumber(upgrade.income || 0)}/s
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleBuyUpgrade(upgrade.id)}
                        disabled={!canBuy || isLocked}
                        className={`px-8 py-4 rounded-2xl font-black text-lg transition-all duration-200 shadow-2xl ${
                          isLocked
                            ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed backdrop-blur-sm'
                            : canBuy
                            ? 'bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 text-white hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:scale-110 active:scale-95 animate-pulse'
                            : 'bg-gray-400/50 text-gray-200 cursor-not-allowed backdrop-blur-sm'
                        }`}
                      >
                        {isLocked ? '🔒 Bloqueado' : canBuy ? '🛒 Comprar!' : 'Sem Moedas'}
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredUpgrades.length === 0 && (
                <div className="text-center py-16 glass-vibrant rounded-2xl">
                  <div className="text-8xl mb-4 animate-bounce">🔍</div>
                  <p className="text-2xl font-black text-gray-900">Nenhuma melhoria encontrada</p>
                  <p className="text-lg text-gray-800 mt-2 font-semibold">Tente ajustar os filtros</p>
                </div>
              )}
            </div>
          </>
              )}

              {activeTab === 'marketplace' && (
                <>
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
                </>
              )}
              
              {activeTab === 'guild' && (
                <>
                  <Guild
                    user={{ uid } as any}
                    username={gameState.username || 'Jogador'}
                    userUpgrades={upgrades}
                  />
                </>
              )}

              {activeTab === 'ranking' && (
                <>
                  <Ranking
                    currentUserId={uid}
                    currentUsername={gameState.username || 'Jogador'}
                    currentCoins={gameState.coins}
                    currentPerSecond={gameState.perSecond}
                    currentUpgradesOwned={upgradeStats.owned}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Venda em Massa */}
      {showBulkSellModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              � Listagem em Massa
            </h2>

            <div className="bg-purple-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                Você está listando <span className="font-bold text-purple-600">{selectedItems.size}</span> tipo(s) de item.
              </p>
              <div className="text-xs text-gray-600 space-y-1">
                {inventoryItems
                  .filter(item => selectedItems.has(item.id))
                  .map(item => {
                    const quantity = itemQuantities.get(item.id) || 1;
                    return (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.icon} {item.name}</span>
                        <span className="font-semibold">
                          x{quantity} <span className="text-gray-400">(de {item.count})</span>
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Tipo de Preço:
              </label>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
                  <input
                    type="radio"
                    name="priceType"
                    value="floor"
                    checked={bulkSellPrice === 'floor'}
                    onChange={() => setBulkSellPrice('floor')}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">
                      📊 Floor Price (Preço de Piso)
                    </div>
                    <div className="text-xs text-gray-600">
                      90% do custo base - Venda rápida garantida
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
                  <input
                    type="radio"
                    name="priceType"
                    value="custom"
                    checked={bulkSellPrice === 'custom'}
                    onChange={() => setBulkSellPrice('custom')}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">
                      ✏️ Preço Personalizado
                    </div>
                    <div className="text-xs text-gray-600">
                      Defina seu próprio preço por unidade
                    </div>
                  </div>
                </label>
              </div>

              {bulkSellPrice === 'custom' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preço por Unidade:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(Number(e.target.value))}
                    placeholder="Digite o preço..."
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                  />
                </div>
              )}

              {bulkSellPrice === 'floor' && (
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-3">
                  <p className="text-sm font-semibold text-green-800 mb-2">
                    💡 Previsão de Ganhos:
                  </p>
                  <div className="text-xs text-green-700 space-y-1">
                    {inventoryItems
                      .filter(item => selectedItems.has(item.id))
                      .map(item => {
                        const floorPrice = calculateFloorPrice(item);
                        const quantity = itemQuantities.get(item.id) || 1;
                        const totalValue = floorPrice * quantity;
                        return (
                          <div key={item.id} className="flex justify-between">
                            <span>{item.icon} {item.name} x{quantity}</span>
                            <span className="font-bold">{formatNumber(totalValue)} 🪙</span>
                          </div>
                        );
                      })}
                    <div className="border-t-2 border-green-400 pt-1 mt-1 flex justify-between font-bold">
                      <span>TOTAL:</span>
                      <span className="text-green-600">
                        {formatNumber(
                          inventoryItems
                            .filter(item => selectedItems.has(item.id))
                            .reduce((sum, item) => {
                              const quantity = itemQuantities.get(item.id) || 1;
                              return sum + (calculateFloorPrice(item) * quantity);
                            }, 0)
                        )} 🪙
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => {
                  setShowBulkSellModal(false);
                  setBulkSellPrice('floor');
                  setCustomPrice(0);
                }}
                className="flex-1 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-bold transition-all"
              >
                ❌ Cancelar
              </button>
              <button
                onClick={handleBulkSell}
                disabled={bulkSellPrice === 'custom' && customPrice <= 0}
                className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                  bulkSellPrice === 'custom' && customPrice <= 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105'
                }`}
              >
                ✅ Confirmar Venda
              </button>
            </div>
          </div>
        </div>
      )}

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

        @keyframes mining {
          0% {
            transform: rotate(-15deg) translateY(0);
          }
          15% {
            transform: rotate(-25deg) translateY(-10px);
          }
          30% {
            transform: rotate(-15deg) translateY(0);
          }
          45% {
            transform: rotate(-25deg) translateY(-10px);
          }
          60% {
            transform: rotate(-15deg) translateY(0);
          }
          75% {
            transform: rotate(-25deg) translateY(-10px);
          }
          100% {
            transform: rotate(-15deg) translateY(0);
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

        .animate-mining {
          animation: mining 0.6s ease-in-out;
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
