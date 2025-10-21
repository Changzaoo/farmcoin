import React, { useState, useEffect } from 'react';
import { StoryRanking } from '../../types/story';
import { Trophy, Medal, Award, TrendingUp, Clock } from 'lucide-react';

export default function StoryRanking() {
  const [rankings, setRankings] = useState<StoryRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Buscar rankings do Firebase
    // Por enquanto, dados de exemplo
    const mockRankings: StoryRanking[] = [
      {
        userId: '1',
        username: 'LendárioFazendeiro',
        currentChapter: 100,
        currentPhase: 10,
        chaptersCompleted: 100,
        totalScore: 1500000,
        completionPercentage: 100,
        lastUpdated: new Date(),
      },
      {
        userId: '2',
        username: 'CaçadorDeSombras',
        currentChapter: 87,
        currentPhase: 9,
        chaptersCompleted: 86,
        totalScore: 980000,
        completionPercentage: 86,
        lastUpdated: new Date(),
      },
      {
        userId: '3',
        username: 'GuardiãoMaldito',
        currentChapter: 75,
        currentPhase: 8,
        chaptersCompleted: 74,
        totalScore: 720000,
        completionPercentage: 74,
        lastUpdated: new Date(),
      },
    ];
    setRankings(mockRankings);
    setLoading(false);
  }, []);

  const getMedalEmoji = (position: number) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return `#${position}`;
  };

  const getPhaseEmoji = (phase: number) => {
    const emojis = ['🌑', '🕯️', '⚰️', '🩸', '👁️', '🔮', '💀', '⚡', '🌋', '👑'];
    return emojis[phase - 1] || '📖';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white p-6 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <Trophy className="w-12 h-12" />
          <div>
            <h1 className="text-3xl font-black">RANKING DO MODO HISTÓRIA</h1>
            <p className="text-yellow-100 text-sm">
              Os maiores desbravadores da Fazenda Maldita
            </p>
          </div>
        </div>

        {/* Estatísticas Globais */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <p className="text-xs font-bold mb-1">Total de Jogadores</p>
            <p className="text-2xl font-black">{rankings.length}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <p className="text-xs font-bold mb-1">Líderes (100%)</p>
            <p className="text-2xl font-black">
              {rankings.filter(r => r.completionPercentage === 100).length}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <p className="text-xs font-bold mb-1">Fase Média</p>
            <p className="text-2xl font-black">
              {(rankings.reduce((sum, r) => sum + r.currentPhase, 0) / rankings.length).toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Rankings */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin text-6xl mb-4">⚙️</div>
          <p className="text-gray-600 font-bold">Carregando rankings...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rankings.map((rank, index) => {
            const position = index + 1;
            const isTop3 = position <= 3;
            const isComplete = rank.completionPercentage === 100;

            return (
              <div
                key={rank.userId}
                className={`p-6 rounded-2xl border-3 transition-all hover:scale-[1.02] ${
                  isTop3
                    ? 'bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 border-yellow-400 shadow-lg'
                    : 'bg-white border-gray-200 shadow'
                }`}
              >
                <div className="flex items-center gap-6">
                  {/* Posição */}
                  <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black ${
                    position === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white'
                    : position === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white'
                    : position === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                  }`}>
                    {getMedalEmoji(position)}
                  </div>

                  {/* Informações do Jogador */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-black text-gray-900 truncate">
                        {rank.username}
                      </h3>
                      {isComplete && (
                        <span className="flex-shrink-0 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-black">
                          👑 LENDÁRIO
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {/* Capítulo Atual */}
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">📖</span>
                        <div>
                          <p className="text-xs text-gray-600">Capítulo</p>
                          <p className="font-black text-lg">
                            {rank.currentChapter}/100
                          </p>
                        </div>
                      </div>

                      {/* Fase Atual */}
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getPhaseEmoji(rank.currentPhase)}</span>
                        <div>
                          <p className="text-xs text-gray-600">Fase</p>
                          <p className="font-black text-lg">
                            {rank.currentPhase}/10
                          </p>
                        </div>
                      </div>

                      {/* Progresso */}
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-600">Progresso</p>
                          <p className="font-black text-lg text-blue-600">
                            {rank.completionPercentage}%
                          </p>
                        </div>
                      </div>

                      {/* Pontuação */}
                      <div className="flex items-center gap-2">
                        <Award className="w-6 h-6 text-purple-600" />
                        <div>
                          <p className="text-xs text-gray-600">Pontuação</p>
                          <p className="font-black text-lg text-purple-600">
                            {rank.totalScore.toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isComplete
                              ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500'
                              : 'bg-gradient-to-r from-blue-500 to-purple-500'
                          }`}
                          style={{ width: `${rank.completionPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emblema Especial para Top 3 */}
                  {isTop3 && (
                    <div className="flex-shrink-0 hidden md:block">
                      {position === 1 && (
                        <div className="text-center">
                          <div className="text-6xl mb-2">👑</div>
                          <p className="text-xs font-black text-yellow-700">REI</p>
                        </div>
                      )}
                      {position === 2 && (
                        <div className="text-center">
                          <div className="text-5xl mb-2">🛡️</div>
                          <p className="text-xs font-black text-gray-600">CAVALEIRO</p>
                        </div>
                      )}
                      {position === 3 && (
                        <div className="text-center">
                          <div className="text-5xl mb-2">⚔️</div>
                          <p className="text-xs font-black text-orange-700">GUERREIRO</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-200 text-center">
        <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">
          Rankings atualizados em tempo real
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Complete capítulos para subir no ranking
        </p>
      </div>
    </div>
  );
}
