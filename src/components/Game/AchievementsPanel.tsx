import { memo, useState, useMemo } from 'react';
import { Achievement, getAchievementProgress } from '../../features/achievements/achievements';
import { GameState } from '../../types';
import { Trophy, Lock } from 'lucide-react';

interface AchievementsPanelProps {
  achievements: Achievement[];
  gameState: GameState;
}

const AchievementsPanel = memo<AchievementsPanelProps>(({ achievements, gameState }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'clicks' | 'coins' | 'upgrades' | 'special'>('all');

  // Filtrar achievements por categoria
  const filteredAchievements = useMemo(() => {
    if (selectedCategory === 'all') return achievements;
    return achievements.filter(a => a.category === selectedCategory);
  }, [achievements, selectedCategory]);

  // Estatísticas
  const stats = useMemo(() => {
    const unlocked = achievements.filter(a => a.unlocked).length;
    return {
      unlocked,
      total: achievements.length,
      percentage: (unlocked / achievements.length) * 100,
    };
  }, [achievements]);

  const categories = [
    { id: 'all', name: 'Todas', icon: '🏆' },
    { id: 'clicks', name: 'Cliques', icon: '👆' },
    { id: 'coins', name: 'Moedas', icon: '💰' },
    { id: 'upgrades', name: 'Upgrades', icon: '📦' },
    { id: 'special', name: 'Especiais', icon: '⭐' },
  ] as const;

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-black text-gray-900 mb-2 flex items-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Conquistas
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all duration-500 flex items-center justify-center"
              style={{ width: `${stats.percentage}%` }}
            >
              <span className="text-white text-xs font-bold">
                {Math.round(stats.percentage)}%
              </span>
            </div>
          </div>
          <span className="text-sm font-bold text-gray-700">
            {stats.unlocked} / {stats.total}
          </span>
        </div>
      </div>

      {/* Filtros de Categoria */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`
              px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap
              ${selectedCategory === cat.id
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Grid de Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map(achievement => {
          const progress = getAchievementProgress(achievement, gameState);
          const isUnlocked = achievement.unlocked;

          return (
            <div
              key={achievement.id}
              className={`
                relative p-4 rounded-lg border-2 transition-all
                ${isUnlocked
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-400 shadow-lg'
                  : 'bg-gray-50 border-gray-300'
                }
              `}
            >
              {/* Ícone */}
              <div className={`text-5xl mb-3 text-center ${isUnlocked ? 'animate-bounce' : 'grayscale opacity-50'}`}>
                {achievement.icon}
              </div>

              {/* Nome */}
              <h3 className={`font-bold text-lg mb-2 text-center ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                {achievement.name}
              </h3>

              {/* Descrição */}
              <p className={`text-sm mb-3 text-center ${isUnlocked ? 'text-gray-700' : 'text-gray-400'}`}>
                {achievement.description}
              </p>

              {/* Barra de Progresso (apenas se não desbloqueado) */}
              {!isUnlocked && progress > 0 && (
                <div className="mb-3">
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block text-center">
                    {Math.round(progress)}%
                  </span>
                </div>
              )}

              {/* Recompensas */}
              <div className="flex flex-wrap gap-2 justify-center">
                {achievement.reward.coins && (
                  <span className={`text-xs font-bold px-2 py-1 rounded ${isUnlocked ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-500'}`}>
                    💰 +{achievement.reward.coins}
                  </span>
                )}
                {achievement.reward.multiplier && achievement.reward.multiplier > 1 && (
                  <span className={`text-xs font-bold px-2 py-1 rounded ${isUnlocked ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-500'}`}>
                    ⚡ x{achievement.reward.multiplier}
                  </span>
                )}
              </div>

              {/* Badge de bloqueado */}
              {!isUnlocked && (
                <div className="absolute top-2 right-2">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
              )}

              {/* Badge de desbloqueado */}
              {isUnlocked && achievement.unlockedAt && (
                <div className="mt-3 text-xs text-gray-500 text-center">
                  Desbloqueado em {new Date(achievement.unlockedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mensagem se não houver achievements */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nenhuma conquista nesta categoria</p>
        </div>
      )}
    </div>
  );
});

AchievementsPanel.displayName = 'AchievementsPanel';

export default AchievementsPanel;
