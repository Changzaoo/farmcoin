// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

interface RankingEntry {
  uid: string;
  username: string;
  coins: number;
  perSecond: number;
  upgradesOwned: number;
  lastUpdated: number;
}

interface RankingProps {
  currentUserId: string;
  currentUsername: string;
  currentCoins: number;
  currentPerSecond: number;
  currentUpgradesOwned: number;
}

type RankingTab = 'coins' | 'perSecond' | 'upgrades';

export default function Ranking({
  currentUserId,
  currentUsername,
  currentCoins,
  currentPerSecond,
  currentUpgradesOwned,
}: RankingProps) {
  const [activeTab, setActiveTab] = useState<RankingTab>('coins');
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);

  useEffect(() => {
    loadRankings();
  }, [activeTab]);

  const loadRankings = async () => {
    setLoading(true);
    try {
      const usersRef = collection(db, 'users');
      
      // Define ordenação baseada na aba ativa
      let orderByField = 'coins';
      if (activeTab === 'perSecond') orderByField = 'perSecond';
      if (activeTab === 'upgrades') orderByField = 'upgradesOwned';

      const q = query(
        usersRef,
        orderBy(orderByField, 'desc'),
        limit(100)
      );

      const querySnapshot = await getDocs(q);
      const data: RankingEntry[] = [];
      
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        data.push({
          uid: doc.id,
          username: docData.username || 'Jogador',
          coins: docData.coins || 0,
          perSecond: docData.perSecond || 0,
          upgradesOwned: docData.upgradesOwned || 0,
          lastUpdated: docData.lastUpdated || 0,
        });
      });

      setRankings(data);

      // Encontrar posição do usuário atual
      const userIndex = data.findIndex(entry => entry.uid === currentUserId);
      setCurrentUserRank(userIndex !== -1 ? userIndex + 1 : null);
    } catch (error) {
      console.error('Erro ao carregar ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const getMedalEmoji = (position: number): string => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return `#${position}`;
  };

  const getPositionColor = (position: number): string => {
    if (position === 1) return 'text-yellow-500';
    if (position === 2) return 'text-gray-400';
    if (position === 3) return 'text-orange-600';
    return 'text-gray-600';
  };

  const getTabInfo = () => {
    switch (activeTab) {
      case 'coins':
        return { label: 'Moedas', icon: '💰', value: currentCoins };
      case 'perSecond':
        return { label: 'Moedas/s', icon: '📈', value: currentPerSecond };
      case 'upgrades':
        return { label: 'Upgrades', icon: '⭐', value: currentUpgradesOwned };
    }
  };

  const tabInfo = getTabInfo();

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab('coins')}
          className={`flex-1 px-6 py-3 rounded-2xl font-black text-sm transition-all duration-200 shadow-lg ${
            activeTab === 'coins'
              ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-white scale-110 shadow-[0_0_20px_rgba(251,191,36,0.5)]'
              : 'glass-vibrant text-white/90 hover:scale-105 dopamine-hover border border-white/30'
          }`}
        >
          💰 Moedas
        </button>
        <button
          onClick={() => setActiveTab('perSecond')}
          className={`flex-1 px-6 py-3 rounded-2xl font-black text-sm transition-all duration-200 shadow-lg ${
            activeTab === 'perSecond'
              ? 'bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 text-white scale-110 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
              : 'glass-vibrant text-white/90 hover:scale-105 dopamine-hover border border-white/30'
          }`}
        >
          📈 Renda
        </button>
        <button
          onClick={() => setActiveTab('upgrades')}
          className={`flex-1 px-6 py-3 rounded-2xl font-black text-sm transition-all duration-200 shadow-lg ${
            activeTab === 'upgrades'
              ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-white scale-110 shadow-[0_0_20px_rgba(168,85,247,0.5)]'
              : 'glass-vibrant text-white/90 hover:scale-105 dopamine-hover border border-white/30'
          }`}
        >
          ⭐ Upgrades
        </button>
      </div>

      {/* Sua Posição */}
      {currentUserRank && (
        <div className="glass-vibrant rounded-2xl p-6 text-white border-2 border-white/30 shadow-xl achievement-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80 font-semibold mb-1">✨ Sua Posição</p>
              <p className="text-3xl font-black drop-shadow-lg">
                {getMedalEmoji(currentUserRank)} {currentUsername}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80 font-semibold mb-1">{tabInfo.label}</p>
              <p className="text-3xl font-black bg-gradient-to-r from-yellow-200 via-amber-200 to-orange-200 bg-clip-text text-transparent drop-shadow-lg">
                {tabInfo.icon} {formatNumber(tabInfo.value)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Ranking */}
      {loading ? (
        <div className="text-center py-16 glass-vibrant rounded-3xl">
          <div className="text-8xl mb-4 animate-spin">⏳</div>
          <p className="text-2xl font-black text-white drop-shadow-lg">Carregando ranking...</p>
        </div>
      ) : rankings.length === 0 ? (
        <div className="text-center py-16 glass-vibrant rounded-3xl">
          <div className="text-8xl mb-4 animate-bounce">🏆</div>
          <p className="text-2xl font-black text-white drop-shadow-lg">Nenhum jogador no ranking ainda</p>
          <p className="text-lg text-white/80 mt-2 font-semibold">Seja o primeiro! 🚀</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {rankings.map((entry, index) => {
            const position = index + 1;
            const isCurrentUser = entry.uid === currentUserId;
            const isTopThree = position <= 3;
            
            let displayValue = 0;
            if (activeTab === 'coins') displayValue = entry.coins;
            if (activeTab === 'perSecond') displayValue = entry.perSecond;
            if (activeTab === 'upgrades') displayValue = entry.upgradesOwned;

            return (
              <div
                key={entry.uid}
                className={`glass-vibrant p-5 rounded-2xl border-2 transition-all duration-300 shadow-lg ${
                  isCurrentUser
                    ? 'border-blue-300 achievement-glow scale-[1.02]'
                    : isTopThree
                    ? 'border-yellow-300/50 hover:scale-[1.01] dopamine-hover'
                    : 'border-white/20 hover:scale-[1.01] dopamine-hover'
                } ${isTopThree && 'shadow-[0_0_30px_rgba(251,191,36,0.3)]'}`}
              >
                <div className="flex items-center gap-5">
                  {/* Posição */}
                  <div className={`text-4xl font-black min-w-[80px] text-center drop-shadow-lg ${
                    position === 1 ? 'animate-pulse' : ''
                  }`}>
                    {getMedalEmoji(position)}
                  </div>

                  {/* Informações do Jogador */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-black text-xl drop-shadow-lg ${
                        isCurrentUser ? 'text-blue-200' : 'text-white'
                      }`}>
                        {entry.username}
                        {isCurrentUser && <span className="ml-2 text-xs bg-gradient-to-r from-blue-400 to-cyan-400 text-white px-3 py-1 rounded-full font-black shadow-lg animate-pulse">VOCÊ</span>}
                      </h3>
                    </div>
                    <p className="font-black text-lg mt-1 bg-gradient-to-r from-yellow-200 via-amber-200 to-orange-200 bg-clip-text text-transparent drop-shadow-lg">
                      {tabInfo.icon} {formatNumber(displayValue)} {activeTab === 'perSecond' && '/s'}
                    </p>
                  </div>

                  {/* Badge de Top 3 */}
                  {position <= 3 && (
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                      position === 1 ? 'bg-yellow-100 text-yellow-700' :
                      position === 2 ? 'bg-gray-100 text-gray-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      TOP {position}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Botão de Atualizar */}
      <button
        onClick={loadRankings}
        disabled={loading}
        className={`w-full py-3 rounded-lg font-bold transition-all ${
          loading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105'
        }`}
      >
        {loading ? '🔄 Carregando...' : '🔄 Atualizar Ranking'}
      </button>
    </div>
  );
}
