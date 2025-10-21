import { useState, useEffect, useCallback } from 'react';
import { Achievement, achievements as allAchievements } from './achievements';
import { GameState } from '../../types';

/**
 * Hook para gerenciar sistema de achievements
 */
export const useAchievements = (gameState: GameState) => {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [achievementsList] = useState<Achievement[]>(allAchievements);

  // Verificar achievements
  useEffect(() => {
    const newUnlocked: Achievement[] = [];

    achievementsList.forEach(achievement => {
      if (!achievement.unlocked && achievement.condition(gameState)) {
        // Marcar como desbloqueado
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        
        newUnlocked.push(achievement);
      }
    });

    if (newUnlocked.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newUnlocked]);
      setNewAchievements(newUnlocked);
      
      // Limpar notificação após 5 segundos
      setTimeout(() => {
        setNewAchievements([]);
      }, 5000);
    }
  }, [gameState, achievementsList]);

  // Calcular multiplicador total dos achievements
  const totalMultiplier = useCallback(() => {
    return unlockedAchievements.reduce((total, achievement) => {
      return total * (achievement.reward.multiplier || 1);
    }, 1);
  }, [unlockedAchievements]);

  // Calcular recompensa total em moedas
  const totalCoinsReward = useCallback(() => {
    return unlockedAchievements.reduce((total, achievement) => {
      return total + (achievement.reward.coins || 0);
    }, 0);
  }, [unlockedAchievements]);

  const stats = {
    total: achievementsList.length,
    unlocked: unlockedAchievements.length,
    percentage: (unlockedAchievements.length / achievementsList.length) * 100,
    multiplier: totalMultiplier(),
    coinsEarned: totalCoinsReward(),
  };

  return {
    achievements: achievementsList,
    unlockedAchievements,
    newAchievements,
    stats,
  };
};
