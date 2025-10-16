/**
 * Sistema de Itens Únicos
 * Gera itens únicos e raros para upgrades de produção em cadeia
 */

import { UpgradeTier } from '../types';

export interface UniqueItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: UpgradeTier;
  rarity: number; // 0-100 (quanto maior, mais raro)
  serialNumber: number; // Número único do item
  createdAt: number;
  ownerId: string;
  sourceUpgrade: string; // ID do upgrade que gerou
  bonusMultiplier: number; // Bônus extra que o item dá
  attributes: {
    [key: string]: number;
  };
}

class UniqueItemSystem {
  private static instance: UniqueItemSystem;
  private itemCounter: number = 0;
  private generatedItems: Map<string, UniqueItem> = new Map();

  private constructor() {
    // Carregar contador do localStorage se existir
    const saved = localStorage.getItem('uniqueItemCounter');
    if (saved) {
      this.itemCounter = parseInt(saved, 10);
    }
  }

  static getInstance(): UniqueItemSystem {
    if (!UniqueItemSystem.instance) {
      UniqueItemSystem.instance = new UniqueItemSystem();
    }
    return UniqueItemSystem.instance;
  }

  /**
   * Gera um item único baseado no upgrade de produção em cadeia
   */
  generateUniqueItem(
    userId: string,
    upgradeId: string,
    upgradeName: string,
    baseValue: number
  ): UniqueItem | null {
    // Apenas upgrades compostos (produção em cadeia) geram itens únicos
    if (!upgradeId.includes('composite') && !upgradeId.includes('chain')) {
      return null;
    }

    // Chance de gerar item baseada no valor do upgrade
    const dropChance = this.calculateDropChance(baseValue);
    
    if (Math.random() > dropChance) {
      return null; // Não gerou item desta vez
    }

    // Incrementar contador global
    this.itemCounter++;
    localStorage.setItem('uniqueItemCounter', this.itemCounter.toString());

    // Determinar raridade (itens de upgrades mais caros são mais raros)
    const rarity = this.calculateRarity(baseValue);
    const tier = this.getTierFromRarity(rarity);

    // Gerar bônus baseado na raridade
    const bonusMultiplier = this.calculateBonus(rarity);

    // Criar item único
    const item: UniqueItem = {
      id: `unique_${upgradeId}_${this.itemCounter}_${Date.now()}`,
      name: this.generateUniqueName(upgradeName, rarity),
      description: this.generateDescription(upgradeName, bonusMultiplier, tier),
      icon: this.getIconForTier(tier),
      tier,
      rarity,
      serialNumber: this.itemCounter,
      createdAt: Date.now(),
      ownerId: userId,
      sourceUpgrade: upgradeId,
      bonusMultiplier,
      attributes: this.generateAttributes(rarity)
    };

    // Salvar item
    this.generatedItems.set(item.id, item);
    
    console.log(`✨ Item único gerado! #${item.serialNumber} - ${item.name} (Raridade: ${rarity})`);

    return item;
  }

  /**
   * Calcula chance de drop baseada no valor do upgrade
   */
  private calculateDropChance(baseValue: number): number {
    // Upgrades mais caros têm maior chance de drop
    if (baseValue >= 5000000000) return 0.5; // 50% - Mítico
    if (baseValue >= 750000000) return 0.4;  // 40% - Lendário
    if (baseValue >= 100000000) return 0.3;  // 30% - Épico
    if (baseValue >= 15000000) return 0.2;   // 20% - Raro
    if (baseValue >= 2500000) return 0.15;   // 15% - Incomum
    return 0.1; // 10% - Comum
  }

  /**
   * Calcula raridade do item (0-100)
   */
  private calculateRarity(baseValue: number): number {
    const base = Math.log10(baseValue) * 10;
    const random = Math.random() * 20; // Variação aleatória
    return Math.min(100, Math.max(1, base + random));
  }

  /**
   * Converte raridade numérica em tier
   */
  private getTierFromRarity(rarity: number): UpgradeTier {
    if (rarity >= 95) return UpgradeTier.MITICO;
    if (rarity >= 85) return UpgradeTier.LENDARIO;
    if (rarity >= 70) return UpgradeTier.EPICO;
    if (rarity >= 50) return UpgradeTier.RARO;
    if (rarity >= 30) return UpgradeTier.INCOMUM;
    return UpgradeTier.COMUM;
  }

  /**
   * Calcula bônus multiplicador
   */
  private calculateBonus(rarity: number): number {
    return 1 + (rarity / 100) * 5; // 1x até 6x
  }

  /**
   * Gera nome único com prefixo baseado na raridade
   */
  private generateUniqueName(baseName: string, rarity: number): string {
    const prefixes = {
      [UpgradeTier.MITICO]: ['Celestial', 'Divino', 'Eterno', 'Supremo', 'Absoluto'],
      [UpgradeTier.LENDARIO]: ['Lendário', 'Mítico', 'Ancestral', 'Primordial'],
      [UpgradeTier.EPICO]: ['Épico', 'Glorioso', 'Magnífico', 'Radiante'],
      [UpgradeTier.RARO]: ['Raro', 'Valioso', 'Precioso', 'Nobre'],
      [UpgradeTier.INCOMUM]: ['Incomum', 'Refinado', 'Aprimorado'],
      [UpgradeTier.COMUM]: ['', 'Básico', 'Simples']
    };

    const tier = this.getTierFromRarity(rarity);
    const prefixList = prefixes[tier];
    const prefix = prefixList[Math.floor(Math.random() * prefixList.length)];

    return prefix ? `${prefix} ${baseName}` : baseName;
  }

  /**
   * Gera descrição do item
   */
  private generateDescription(baseName: string, bonus: number, tier: UpgradeTier): string {
    const tierEmoji = {
      [UpgradeTier.MITICO]: '⭐',
      [UpgradeTier.LENDARIO]: '🔴',
      [UpgradeTier.EPICO]: '🟣',
      [UpgradeTier.RARO]: '🔵',
      [UpgradeTier.INCOMUM]: '🟢',
      [UpgradeTier.COMUM]: '⚪'
    };

    const bonusPercent = ((bonus - 1) * 100).toFixed(0);

    return `${tierEmoji[tier]} Item Único gerado por ${baseName}. Bônus: +${bonusPercent}% de produção. Edição limitada!`;
  }

  /**
   * Ícone baseado no tier
   */
  private getIconForTier(tier: UpgradeTier): string {
    const icons = {
      [UpgradeTier.MITICO]: '💎',
      [UpgradeTier.LENDARIO]: '👑',
      [UpgradeTier.EPICO]: '🏆',
      [UpgradeTier.RARO]: '💍',
      [UpgradeTier.INCOMUM]: '🎁',
      [UpgradeTier.COMUM]: '📦'
    };

    return icons[tier];
  }

  /**
   * Gera atributos especiais do item
   */
  private generateAttributes(rarity: number): { [key: string]: number } {
    const attributes: { [key: string]: number } = {};

    // Atributos baseados na raridade
    if (rarity >= 90) {
      attributes.criticalChance = Math.random() * 0.2; // 0-20% chance crítico
      attributes.extraGold = Math.random() * 0.5; // 0-50% ouro extra
      attributes.experienceBoost = Math.random() * 0.3; // 0-30% XP extra
    }

    if (rarity >= 70) {
      attributes.productionSpeed = Math.random() * 0.4; // 0-40% velocidade
      attributes.efficiencyBonus = Math.random() * 0.25; // 0-25% eficiência
    }

    if (rarity >= 50) {
      attributes.durability = 100 + Math.random() * 100; // 100-200 durabilidade
      attributes.qualityBonus = Math.random() * 0.15; // 0-15% qualidade
    }

    return attributes;
  }

  /**
   * Obter item por ID
   */
  getItem(itemId: string): UniqueItem | undefined {
    return this.generatedItems.get(itemId);
  }

  /**
   * Obter todos os itens de um usuário
   */
  getUserItems(userId: string): UniqueItem[] {
    return Array.from(this.generatedItems.values())
      .filter(item => item.ownerId === userId)
      .sort((a, b) => b.rarity - a.rarity);
  }

  /**
   * Transferir propriedade de item (para marketplace)
   */
  transferItem(itemId: string, newOwnerId: string): boolean {
    const item = this.generatedItems.get(itemId);
    
    if (!item) return false;

    item.ownerId = newOwnerId;
    console.log(`📦 Item #${item.serialNumber} transferido para ${newOwnerId}`);
    
    return true;
  }

  /**
   * Estatísticas globais
   */
  getGlobalStats() {
    const items = Array.from(this.generatedItems.values());
    
    return {
      totalItems: items.length,
      totalUnique: this.itemCounter,
      byTier: {
        [UpgradeTier.MITICO]: items.filter(i => i.tier === UpgradeTier.MITICO).length,
        [UpgradeTier.LENDARIO]: items.filter(i => i.tier === UpgradeTier.LENDARIO).length,
        [UpgradeTier.EPICO]: items.filter(i => i.tier === UpgradeTier.EPICO).length,
        [UpgradeTier.RARO]: items.filter(i => i.tier === UpgradeTier.RARO).length,
        [UpgradeTier.INCOMUM]: items.filter(i => i.tier === UpgradeTier.INCOMUM).length,
        [UpgradeTier.COMUM]: items.filter(i => i.tier === UpgradeTier.COMUM).length,
      },
      averageRarity: items.reduce((sum, i) => sum + i.rarity, 0) / items.length || 0
    };
  }
}

export const uniqueItems = UniqueItemSystem.getInstance();
