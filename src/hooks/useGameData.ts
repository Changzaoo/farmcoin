import { useState, useEffect, useCallback } from 'react';
import { GameState, Upgrade, LogType } from '../types';
import { saveGameState, logUserAction } from '../firebase/firestore';

export function useGameData(userId: string, initialGameState: GameState, initialUpgrades: Upgrade[]) {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [upgrades, setUpgrades] = useState<Upgrade[]>(initialUpgrades);
  const [lastSave, setLastSave] = useState<Date>(new Date());

  // Auto-save a cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      saveGameState(userId, gameState, upgrades);
      setLastSave(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, [userId, gameState, upgrades]);

  // Calcula renda passiva
  useEffect(() => {
    const totalIncome = upgrades.reduce((sum, upgrade) => {
      const income = upgrade.income || 0;
      const count = upgrade.count || 0;
      return sum + income * count;
    }, 0);
    
    setGameState((prev) => ({
      ...prev,
      perSecond: totalIncome,
    }));

    const interval = setInterval(() => {
      const income = totalIncome;
      if (income > 0) {
        setGameState((prev) => ({
          ...prev,
          coins: prev.coins + income,
          totalCoins: prev.totalCoins + income,
        }));

        // Log de renda passiva a cada minuto
        if (Math.random() < 0.016) { // ~1% de chance por segundo = ~1 vez por minuto
          logUserAction({
            userId,
            type: LogType.PASSIVE_INCOME,
            amount: income * 60,
            description: `Ganhou ${(income * 60).toFixed(2)} moedas de renda passiva (1 minuto)`,
            metadata: {
              incomePerSecond: income,
              balanceBefore: gameState.coins,
              balanceAfter: gameState.coins + income * 60,
            },
          });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [upgrades, userId, gameState.coins]);

  // Clique manual
  const handleClick = useCallback(() => {
    const clickAmount = 0.005; // Reduzido em 95% (0.1 * 0.05)
    setGameState((prev) => ({
      ...prev,
      coins: prev.coins + clickAmount,
      totalCoins: prev.totalCoins + clickAmount,
      totalClicks: prev.totalClicks + 1,
    }));

    // Log de clique ocasional (1 a cada 50 cliques)
    if (Math.random() < 0.02) {
      logUserAction({
        userId,
        type: LogType.CLICK,
        amount: clickAmount,
        description: 'Clique manual',
        metadata: {
          balanceBefore: gameState.coins,
          balanceAfter: gameState.coins + clickAmount,
        },
      });
    }
  }, [userId, gameState.coins]);

  // Comprar upgrade
  const buyUpgrade = useCallback((upgradeId: string) => {
    const upgrade = upgrades.find((u) => u.id === upgradeId);
    if (!upgrade) return;
    
    const upgradeCost = upgrade.cost || 0;
    const upgradeCount = upgrade.count || 0;
    
    if (gameState.coins < upgradeCost) return;

    const newCost = Math.ceil(upgradeCost * 1.15);
    
    setGameState((prev) => ({
      ...prev,
      coins: prev.coins - upgradeCost,
      totalPurchases: prev.totalPurchases + 1,
    }));

    setUpgrades((prev) =>
      prev.map((u) =>
        u.id === upgradeId
          ? { ...u, count: (u.count || 0) + 1, cost: newCost }
          : u
      )
    );

    // Log de compra
    logUserAction({
      userId,
      type: LogType.PURCHASE_UPGRADE,
      amount: -upgradeCost,
      description: `Comprou ${upgrade.name}`,
      metadata: {
        upgradeId: upgrade.id,
        upgradeName: upgrade.name,
        upgradeCount: upgradeCount + 1,
        upgradeCost: upgradeCost,
        newCost: newCost,
        balanceBefore: gameState.coins,
        balanceAfter: gameState.coins - upgradeCost,
      },
    });
  }, [upgrades, gameState.coins, userId]);

  // Comprar moedas
  const buyCoins = useCallback((amount: number, bonus: number, packageId: string, price: number) => {
    const totalCoins = amount + bonus;
    
    setGameState((prev) => ({
      ...prev,
      coins: prev.coins + totalCoins,
      totalCoins: prev.totalCoins + totalCoins,
    }));

    // Log de compra de moedas
    logUserAction({
      userId,
      type: LogType.PURCHASE_COINS,
      amount: totalCoins,
      description: `Comprou pacote de ${amount} moedas (+${bonus} bônus) por $${price}`,
      metadata: {
        packageId,
        baseAmount: amount,
        bonus,
        totalCoins,
        price,
        balanceBefore: gameState.coins,
        balanceAfter: gameState.coins + totalCoins,
      },
    });
  }, [userId, gameState.coins]);

  return {
    gameState,
    upgrades,
    lastSave,
    handleClick,
    buyUpgrade,
    buyCoins,
  };
}
