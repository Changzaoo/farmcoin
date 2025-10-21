import { useMemo } from 'react';
import { Upgrade } from '../types';

/**
 * Hook para gerenciar filtros e busca de upgrades
 */
export const useUpgradeFilters = (
  upgrades: Upgrade[],
  selectedCategory: string,
  searchTerm: string
) => {
  // Memoizar upgrades filtrados
  const filteredUpgrades = useMemo(() => {
    let result = upgrades;

    // Filtrar por categoria
    if (selectedCategory && selectedCategory !== 'Todos') {
      result = result.filter(u => u.category === selectedCategory);
    }

    // Filtrar por busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(u =>
        u.name.toLowerCase().includes(term) ||
        u.description.toLowerCase().includes(term)
      );
    }

    return result;
  }, [upgrades, selectedCategory, searchTerm]);

  // Memoizar estatísticas
  const stats = useMemo(() => {
    const owned = upgrades.filter(u => (u.count || 0) > 0);
    
    return {
      total: upgrades.length,
      owned: owned.length,
      totalValue: owned.reduce((sum, u) => 
        sum + (u.baseCost * (u.count || 0)), 0
      ),
      totalIncome: owned.reduce((sum, u) => 
        sum + ((u.income || 0) * (u.count || 0)), 0
      ),
      categories: new Set(upgrades.map(u => u.category)).size,
    };
  }, [upgrades]);

  return {
    filteredUpgrades,
    stats,
  };
};
