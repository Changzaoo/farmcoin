import { memo, useCallback } from 'react';
import { Upgrade, UpgradeTier } from '../../types';
import { Lock } from 'lucide-react';
import { getTierColor, getTierGlow } from '../../utils/tierSystem';

interface UpgradeCardProps {
  upgrade: Upgrade;
  canAfford: boolean;
  onBuy: (id: string) => void;
  formatNumber: (num: number) => string;
}

const UpgradeCard = memo<UpgradeCardProps>(({ upgrade, canAfford, onBuy, formatNumber }) => {
  const handleBuy = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (canAfford && upgrade.unlocked) {
      onBuy(upgrade.id);
    }
  }, [canAfford, onBuy, upgrade.id, upgrade.unlocked]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && canAfford && upgrade.unlocked) {
      e.preventDefault();
      onBuy(upgrade.id);
    }
  }, [canAfford, onBuy, upgrade.id, upgrade.unlocked]);

  const tierColor = getTierColor(upgrade.tier || 'comum' as any);
  const tierGlow = getTierGlow(upgrade.tier || 'comum' as any);
  const isDisabled = !canAfford || !upgrade.unlocked;

  return (
    <button
      onClick={handleBuy}
      onKeyDown={handleKeyDown}
      disabled={isDisabled}
      className={`
        relative w-full p-4 rounded-lg border-2 transition-all duration-200
        ${tierColor}
        ${tierGlow}
        ${isDisabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:scale-105 hover:shadow-xl cursor-pointer transform active:scale-95'
        }
        ${upgrade.count && upgrade.count > 0 ? 'ring-2 ring-green-400' : ''}
      `}
      aria-label={`
        ${upgrade.name}. 
        ${upgrade.description}. 
        Custo: ${formatNumber(upgrade.cost || 0)} moedas. 
        Renda: ${formatNumber(upgrade.income || 0)} moedas por segundo. 
        ${upgrade.count ? `Você possui ${upgrade.count}` : 'Você não possui este item'}.
        ${canAfford ? 'Disponível para compra' : 'Moedas insuficientes'}
      `}
      aria-disabled={isDisabled}
      tabIndex={0}
    >
      {/* Badge de quantidade */}
      {upgrade.count && upgrade.count > 0 && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
          {upgrade.count}
        </div>
      )}

      {/* Ícone do upgrade */}
      <div className="text-5xl mb-3 text-center animate-float-slow">
        {upgrade.icon}
      </div>

      {/* Nome */}
      <h3 className="font-black text-lg mb-2 text-gray-900 line-clamp-1">
        {upgrade.name}
      </h3>

      {/* Descrição */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[40px]">
        {upgrade.description}
      </p>

      {/* Estatísticas */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">💰</span>
          <span className="font-bold text-sm">{formatNumber(upgrade.cost || 0)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-green-500">📈</span>
          <span className="font-bold text-sm">+{formatNumber(upgrade.income || 0)}/s</span>
        </div>
      </div>

      {/* Badge de bloqueado */}
      {!upgrade.unlocked && (
        <div className="absolute inset-0 bg-black/70 rounded-lg flex flex-col items-center justify-center">
          <Lock className="w-8 h-8 text-gray-300 mb-2" />
          <span className="text-white text-sm font-bold">Bloqueado</span>
        </div>
      )}

      {/* Indicador visual de "pode comprar" */}
      {canAfford && upgrade.unlocked && (
        <div className="absolute inset-0 border-2 border-green-400 rounded-lg pointer-events-none animate-pulse" />
      )}
    </button>
  );
}, (prev, next) => {
  // Otimização: só re-renderizar se algo relevante mudou
  return (
    prev.upgrade.id === next.upgrade.id &&
    prev.upgrade.count === next.upgrade.count &&
    prev.upgrade.cost === next.upgrade.cost &&
    prev.upgrade.unlocked === next.upgrade.unlocked &&
    prev.canAfford === next.canAfford
  );
});

UpgradeCard.displayName = 'UpgradeCard';

export default UpgradeCard;
