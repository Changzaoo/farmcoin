import React from 'react';
import { useDeviceDetect } from '../../hooks/useDeviceDetect';

interface MobileBottomNavProps {
  currentTab: 'game' | 'marketplace' | 'ranking';
  onTabChange: (tab: 'game' | 'marketplace' | 'ranking') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentTab, onTabChange }) => {
  const { isMobile } = useDeviceDetect();

  if (!isMobile) return null;

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-gray-800 border-t border-green-500/30 shadow-lg z-50">
      <div className="flex justify-around items-center h-full px-2">
        {/* Game Tab */}
        <button
          onClick={() => onTabChange('game')}
          className={`btn-touch flex flex-col items-center justify-center flex-1 transition-all duration-200 ${
            currentTab === 'game' 
              ? 'text-green-400' 
              : 'text-gray-400 hover:text-green-300'
          }`}
        >
          <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="text-xs font-medium">Fazenda</span>
        </button>

        {/* Marketplace Tab */}
        <button
          onClick={() => onTabChange('marketplace')}
          className={`btn-touch flex flex-col items-center justify-center flex-1 transition-all duration-200 ${
            currentTab === 'marketplace' 
              ? 'text-green-400' 
              : 'text-gray-400 hover:text-green-300'
          }`}
        >
          <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          <span className="text-xs font-medium">Loja</span>
        </button>

        {/* Ranking Tab */}
        <button
          onClick={() => onTabChange('ranking')}
          className={`btn-touch flex flex-col items-center justify-center flex-1 transition-all duration-200 ${
            currentTab === 'ranking' 
              ? 'text-green-400' 
              : 'text-gray-400 hover:text-green-300'
          }`}
        >
          <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          <span className="text-xs font-medium">Ranking</span>
        </button>
      </div>
    </nav>
  );
};
