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
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('coins')}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'coins'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          💰 Moedas
        </button>
        <button
          onClick={() => setActiveTab('perSecond')}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'perSecond'
              ? 'bg-green-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          📈 Renda
        </button>
        <button
          onClick={() => setActiveTab('upgrades')}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'upgrades'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          ⭐ Upgrades
        </button>
      </div>

      {/* Sua Posição */}
      {currentUserRank && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Sua Posição</p>
              <p className="text-2xl font-bold">
                {getMedalEmoji(currentUserRank)} {currentUsername}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">{tabInfo.label}</p>
              <p className="text-2xl font-bold">
                {tabInfo.icon} {formatNumber(tabInfo.value)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Ranking */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Carregando ranking...</div>
      ) : rankings.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg font-semibold">Nenhum jogador no ranking ainda</p>
          <p className="text-sm mt-2">Seja o primeiro!</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {rankings.map((entry, index) => {
            const position = index + 1;
            const isCurrentUser = entry.uid === currentUserId;
            
            let displayValue = 0;
            if (activeTab === 'coins') displayValue = entry.coins;
            if (activeTab === 'perSecond') displayValue = entry.perSecond;
            if (activeTab === 'upgrades') displayValue = entry.upgradesOwned;

            return (
              <div
                key={entry.uid}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isCurrentUser
                    ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-blue-500 shadow-lg'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Posição */}
                  <div className={`text-2xl font-bold ${getPositionColor(position)} min-w-[60px] text-center`}>
                    {getMedalEmoji(position)}
                  </div>

                  {/* Informações do Jogador */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-bold text-gray-800 ${isCurrentUser ? 'text-blue-600' : ''}`}>
                        {entry.username}
                        {isCurrentUser && <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">VOCÊ</span>}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
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
