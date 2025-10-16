import React from 'react';
import { useDeviceDetect } from '../../hooks/useDeviceDetect';

interface MobileHeaderProps {
  playerName: string;
  farmCoins: number;
  level: number;
  onMenuClick?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  playerName, 
  farmCoins, 
  level,
  onMenuClick 
}) => {
  const { isMobile } = useDeviceDetect();

  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toFixed(0);
  };

  if (!isMobile) return null;

  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-b from-gray-900 via-gray-800 to-transparent border-b border-green-500/30 shadow-lg z-40 safe-area-top">
      <div className="container-mobile py-3">
        <div className="flex items-center justify-between">
          {/* Player Info */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">
                {playerName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-semibold text-sm leading-tight">
                {playerName}
              </span>
              <span className="text-green-400 text-xs font-medium">
                Nível {level}
              </span>
            </div>
          </div>

          {/* Farm Coins */}
          <div className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm px-3 py-2 rounded-full border border-green-500/30 shadow-md">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            <span className="text-white font-bold text-sm">
              {formatNumber(farmCoins)}
            </span>
          </div>

          {/* Menu Button */}
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="btn-touch w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
