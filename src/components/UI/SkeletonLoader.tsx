/**
 * 🎨 Skeleton Loader Component
 * Mostra placeholder animado enquanto o conteúdo carrega
 */

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width = '100%',
  height = '1rem',
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-gray-700/30';
  
  const variantClasses = {
    text: 'rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

/**
 * Skeleton para card de upgrade
 */
export const UpgradeCardSkeleton: React.FC = () => (
  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md rounded-2xl p-4 border border-gray-700/30 space-y-3">
    {/* Header */}
    <div className="flex items-center gap-3">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1 space-y-2">
        <Skeleton width="60%" height={16} />
        <Skeleton width="40%" height={12} />
      </div>
    </div>
    
    {/* Stats */}
    <div className="space-y-2">
      <Skeleton width="80%" height={14} />
      <Skeleton width="70%" height={14} />
    </div>
    
    {/* Button */}
    <Skeleton height={40} className="rounded-xl" />
  </div>
);

/**
 * Grid de skeleton cards
 */
interface UpgradeGridSkeletonProps {
  count?: number;
}

export const UpgradeGridSkeleton: React.FC<UpgradeGridSkeletonProps> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 pb-32">
    {Array.from({ length: count }).map((_, i) => (
      <UpgradeCardSkeleton key={i} />
    ))}
  </div>
);

/**
 * Skeleton para header do jogo
 */
export const GameHeaderSkeleton: React.FC = () => (
  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md rounded-2xl p-6 space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton width={120} height={24} />
      <Skeleton variant="circular" width={32} height={32} />
    </div>
    <Skeleton width="100%" height={48} className="rounded-xl" />
    <div className="flex gap-2">
      <Skeleton width="50%" height={20} />
      <Skeleton width="50%" height={20} />
    </div>
  </div>
);
