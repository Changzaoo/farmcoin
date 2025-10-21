import { GameState } from '../../types';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (state: GameState) => boolean;
  reward: {
    coins?: number;
    multiplier?: number;
    prestigePoints?: number;
  };
  unlocked: boolean;
  unlockedAt?: Date;
  category: 'clicks' | 'coins' | 'upgrades' | 'special';
}

export const achievements: Achievement[] = [
  // === CLICKS ===
  {
    id: 'first_click',
    name: 'Primeiro Passo 👆',
    description: 'Faça seu primeiro clique',
    icon: '👆',
    category: 'clicks',
    condition: (state) => state.totalClicks >= 1,
    reward: { coins: 10 },
    unlocked: false,
  },
  {
    id: 'hundred_clicks',
    name: 'Clicador Iniciante 👍',
    description: 'Faça 100 cliques',
    icon: '👍',
    category: 'clicks',
    condition: (state) => state.totalClicks >= 100,
    reward: { coins: 100 },
    unlocked: false,
  },
  {
    id: 'thousand_clicks',
    name: 'Clicador Experiente 💪',
    description: 'Faça 1.000 cliques',
    icon: '💪',
    category: 'clicks',
    condition: (state) => state.totalClicks >= 1000,
    reward: { coins: 1000, multiplier: 1.05 },
    unlocked: false,
  },
  {
    id: 'ten_thousand_clicks',
    name: 'Mestre do Clique 🏆',
    description: 'Faça 10.000 cliques',
    icon: '🏆',
    category: 'clicks',
    condition: (state) => state.totalClicks >= 10000,
    reward: { coins: 10000, multiplier: 1.1 },
    unlocked: false,
  },

  // === MOEDAS ===
  {
    id: 'hundred_coins',
    name: 'Primeiras Moedas 💰',
    description: 'Acumule 100 moedas',
    icon: '💰',
    category: 'coins',
    condition: (state) => state.totalCoins >= 100,
    reward: { coins: 50 },
    unlocked: false,
  },
  {
    id: 'thousand_coins',
    name: 'Milhar 💵',
    description: 'Acumule 1.000 moedas',
    icon: '💵',
    category: 'coins',
    condition: (state) => state.totalCoins >= 1000,
    reward: { coins: 500 },
    unlocked: false,
  },
  {
    id: 'millionaire',
    name: 'Milionário 💎',
    description: 'Acumule 1 milhão de moedas',
    icon: '💎',
    category: 'coins',
    condition: (state) => state.totalCoins >= 1000000,
    reward: { coins: 50000, multiplier: 1.1 },
    unlocked: false,
  },
  {
    id: 'billionaire',
    name: 'Bilionário 👑',
    description: 'Acumule 1 bilhão de moedas',
    icon: '👑',
    category: 'coins',
    condition: (state) => state.totalCoins >= 1000000000,
    reward: { coins: 1000000, multiplier: 1.25 },
    unlocked: false,
  },

  // === UPGRADES ===
  {
    id: 'first_upgrade',
    name: 'Primeiro Upgrade 🌱',
    description: 'Compre seu primeiro upgrade',
    icon: '🌱',
    category: 'upgrades',
    condition: (state) => state.totalPurchases >= 1,
    reward: { coins: 25 },
    unlocked: false,
  },
  {
    id: 'ten_upgrades',
    name: 'Colecionador 📦',
    description: 'Compre 10 upgrades',
    icon: '📦',
    category: 'upgrades',
    condition: (state) => state.totalPurchases >= 10,
    reward: { coins: 250 },
    unlocked: false,
  },
  {
    id: 'hundred_upgrades',
    name: 'Acumulador 🏪',
    description: 'Compre 100 upgrades',
    icon: '🏪',
    category: 'upgrades',
    condition: (state) => state.totalPurchases >= 100,
    reward: { coins: 5000, multiplier: 1.05 },
    unlocked: false,
  },
  {
    id: 'thousand_upgrades',
    name: 'Magnata 🏭',
    description: 'Compre 1.000 upgrades',
    icon: '🏭',
    category: 'upgrades',
    condition: (state) => state.totalPurchases >= 1000,
    reward: { coins: 100000, multiplier: 1.15 },
    unlocked: false,
  },

  // === ESPECIAIS ===
  {
    id: 'passive_millionaire',
    name: 'Império Passivo 🌟',
    description: 'Alcance 1 milhão de moedas/segundo',
    icon: '🌟',
    category: 'special',
    condition: (state) => state.perSecond >= 1000000,
    reward: { multiplier: 1.2 },
    unlocked: false,
  },
  {
    id: 'speedrunner',
    name: 'Speedrunner ⚡',
    description: 'Alcance 1 milhão em menos de 1 hora',
    icon: '⚡',
    category: 'special',
    condition: (state) => state.totalCoins >= 1000000,
    reward: { coins: 100000, prestigePoints: 1 },
    unlocked: false,
  },
];

// Obter achievement por ID
export const getAchievementById = (id: string): Achievement | undefined => {
  return achievements.find(a => a.id === id);
};

// Obter achievements por categoria
export const getAchievementsByCategory = (category: Achievement['category']): Achievement[] => {
  return achievements.filter(a => a.category === category);
};

// Calcular progresso de um achievement
export const getAchievementProgress = (achievement: Achievement, state: GameState): number => {
  if (achievement.unlocked) return 100;
  
  // Tentar extrair valores numéricos da condição
  switch (achievement.category) {
    case 'clicks':
      if (achievement.id === 'first_click') return Math.min(100, state.totalClicks * 100);
      if (achievement.id === 'hundred_clicks') return Math.min(100, (state.totalClicks / 100) * 100);
      if (achievement.id === 'thousand_clicks') return Math.min(100, (state.totalClicks / 1000) * 100);
      if (achievement.id === 'ten_thousand_clicks') return Math.min(100, (state.totalClicks / 10000) * 100);
      break;
    case 'coins':
      if (achievement.id === 'hundred_coins') return Math.min(100, (state.totalCoins / 100) * 100);
      if (achievement.id === 'thousand_coins') return Math.min(100, (state.totalCoins / 1000) * 100);
      if (achievement.id === 'millionaire') return Math.min(100, (state.totalCoins / 1000000) * 100);
      if (achievement.id === 'billionaire') return Math.min(100, (state.totalCoins / 1000000000) * 100);
      break;
    case 'upgrades':
      if (achievement.id === 'first_upgrade') return Math.min(100, state.totalPurchases * 100);
      if (achievement.id === 'ten_upgrades') return Math.min(100, (state.totalPurchases / 10) * 100);
      if (achievement.id === 'hundred_upgrades') return Math.min(100, (state.totalPurchases / 100) * 100);
      if (achievement.id === 'thousand_upgrades') return Math.min(100, (state.totalPurchases / 1000) * 100);
      break;
  }
  
  return 0;
};
