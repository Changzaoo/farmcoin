// Item na loja do capítulo
export interface StoryShopItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  price: number;
  type: 'tool' | 'material' | 'upgrade' | 'special' | 'document' | 'consumable' | 'key' | 'protection' | 'magical' | 'equipment';
  effect?: string; // Ex: "+10% coleta", "Desbloqueia área X"
}

// Inventário do modo história
export interface StoryInventoryItem {
  itemId: string;
  name: string;
  emoji: string;
  quantity: number;
  acquiredAt: Date;
  chapterId: number;
  description?: string; // Descrição opcional do item
}

export interface StoryChapter {
  id: number;
  phase: number;
  title: string;
  emoji: string;
  story: string;
  shopItems?: StoryShopItem[]; // Loja do capítulo (opcional para compatibilidade)
  objectives: StoryObjective[];
  rewards: StoryReward;
  unlocked?: boolean; // Opcional - será definido em runtime
  completed?: boolean; // Opcional - será definido em runtime
  completedAt?: Date;
}

export interface StoryObjective {
  id: string;
  description: string;
  type: 'buy_item' | 'collect_coins' | 'own_items' | 'coins' | 'upgrades' | 'perSecond' | 'clicks'; // Suporta também formatos antigos
  target: number; // Sempre número
  current: number;
  completed: boolean;
  emoji: string;
  requiredItemId?: string; // ID do item necessário
}

export interface StoryReward {
  coins?: number;
  exp?: number; // EXP opcional para compatibilidade com formato antigo
  item?: StoryInventoryItem; // Item opcional (antigo não tinha)
  badge: string; // Badge obrigatório
  multiplier?: number;
  title?: string; // Título opcional
  emoji?: string;
}

export interface StoryProgress {
  currentChapter: number;
  currentPhase: number;
  chaptersCompleted: number;
  totalScore: number;
  
  // Sistema de Níveis
  level: number;
  currentExp: number;
  expToNextLevel: number;
  
  // Coleções
  badges: string[];
  titles: string[];
  inventory: StoryInventoryItem[]; // Inventário exclusivo do modo história
  
  // Datas
  startedAt: Date;
  lastPlayedAt: Date;
}

export interface StoryRanking {
  userId: string;
  username: string;
  currentChapter: number;
  currentPhase: number;
  chaptersCompleted: number;
  totalScore: number;
  completionPercentage: number;
  lastUpdated: Date;
}
