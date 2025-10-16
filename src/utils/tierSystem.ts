import { UpgradeTier } from '../types';

/**
 * Calcula o tier de um upgrade baseado no custo base
 */
export function calculateTier(baseCost: number): UpgradeTier {
  if (baseCost >= 100000000000) return UpgradeTier.MITICO;      // 100B+
  if (baseCost >= 1000000000) return UpgradeTier.LENDARIO;      // 1B+
  if (baseCost >= 10000000) return UpgradeTier.EPICO;           // 10M+
  if (baseCost >= 100000) return UpgradeTier.RARO;              // 100K+
  if (baseCost >= 1000) return UpgradeTier.INCOMUM;             // 1K+
  return UpgradeTier.COMUM;                                     // < 1K
}

/**
 * Retorna as classes do Tailwind para colorir o tier
 */
export function getTierColor(tier: UpgradeTier): { text: string; border: string; bg: string } {
  const colors = {
    [UpgradeTier.COMUM]: { text: 'text-gray-600', border: 'border-gray-300', bg: 'bg-gray-50' },
    [UpgradeTier.INCOMUM]: { text: 'text-green-600', border: 'border-green-300', bg: 'bg-green-50' },
    [UpgradeTier.RARO]: { text: 'text-blue-600', border: 'border-blue-300', bg: 'bg-blue-50' },
    [UpgradeTier.EPICO]: { text: 'text-purple-600', border: 'border-purple-300', bg: 'bg-purple-50' },
    [UpgradeTier.LENDARIO]: { text: 'text-orange-600', border: 'border-orange-300', bg: 'bg-orange-50' },
    [UpgradeTier.MITICO]: { text: 'text-red-600', border: 'border-red-300', bg: 'bg-red-50' }
  };
  return colors[tier] || colors[UpgradeTier.COMUM];
}

/**
 * Retorna o nome traduzido do tier
 */
export function getTierName(tier: UpgradeTier): string {
  const names = {
    [UpgradeTier.COMUM]: 'Comum',
    [UpgradeTier.INCOMUM]: 'Incomum',
    [UpgradeTier.RARO]: 'Raro',
    [UpgradeTier.EPICO]: 'Épico',
    [UpgradeTier.LENDARIO]: 'Lendário',
    [UpgradeTier.MITICO]: 'Mítico'
  };
  return names[tier] || 'Comum';
}

/**
 * Retorna o brilho do tier para animações
 */
export function getTierGlow(tier: UpgradeTier): string {
  const glows = {
    [UpgradeTier.COMUM]: '',
    [UpgradeTier.INCOMUM]: 'shadow-green-200',
    [UpgradeTier.RARO]: 'shadow-blue-200',
    [UpgradeTier.EPICO]: 'shadow-purple-300 animate-pulse-slow',
    [UpgradeTier.LENDARIO]: 'shadow-orange-300 animate-pulse-slow',
    [UpgradeTier.MITICO]: 'shadow-red-400 animate-glow'
  };
  return glows[tier] || '';
}

/**
 * Verifica se um upgrade composto pode ser desbloqueado
 */
export function canUnlockCompositeUpgrade(
  upgradeRequirements: Array<{ upgradeId: string; minCount: number }>,
  userUpgrades: Array<{ id: string; count: number }>
): boolean {
  return upgradeRequirements.every(req => {
    const userUpgrade = userUpgrades.find(u => u.id === req.upgradeId);
    return userUpgrade && userUpgrade.count >= req.minCount;
  });
}

/**
 * Retorna mensagem de requisitos não atendidos
 */
export function getMissingRequirements(
  upgradeRequirements: Array<{ upgradeId: string; minCount: number }>,
  userUpgrades: Array<{ id: string; count: number }>,
  allUpgrades: Array<{ id: string; name: string }>
): string[] {
  const missing: string[] = [];
  
  upgradeRequirements.forEach(req => {
    const userUpgrade = userUpgrades.find(u => u.id === req.upgradeId);
    const upgrade = allUpgrades.find(u => u.id === req.upgradeId);
    const currentCount = userUpgrade?.count || 0;
    
    if (currentCount < req.minCount) {
      const needed = req.minCount - currentCount;
      missing.push(`${upgrade?.name || req.upgradeId}: ${needed} faltando (${currentCount}/${req.minCount})`);
    }
  });
  
  return missing;
}
