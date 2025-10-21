import { useState } from 'react';
import { StoryChapter, StoryObjective, StoryProgress } from '../../types/story';
import { storyChapters, STORY_PHASES } from '../../data/storyChapters';
import { GameState } from '../../types';
import { CheckCircle, Lock, Star, Award, TrendingUp, Target } from 'lucide-react';

interface StoryModeProps {
  gameState: GameState;
  onClaimReward: (chapterId: number) => void;
}

export default function StoryMode({ gameState, onClaimReward }: StoryModeProps) {
  const [selectedChapter, setSelectedChapter] = useState<StoryChapter | null>(null);
  const [activePhase, setActivePhase] = useState(1);
  const [showRanking, setShowRanking] = useState(false);
  const [progress, setProgress] = useState<StoryProgress>({
    currentChapter: 1,
    currentPhase: 1,
    chaptersCompleted: 0,
    totalScore: 0,
    badges: [],
    titles: [],
    uniqueUpgrades: [],
    startedAt: new Date(),
    lastPlayedAt: new Date(),
  });

  // Verificar progresso dos objetivos
  const checkObjectiveProgress = (objective: StoryObjective): number => {
    switch (objective.type) {
      case 'coins':
        return Math.min(gameState.coins, objective.target);
      case 'upgrades':
        return Math.min(gameState.upgrades?.length || 0, objective.target);
      case 'perSecond':
        return Math.min(gameState.perSecond, objective.target);
      case 'clicks':
        return Math.min(gameState.totalClicks || 0, objective.target);
      default:
        return 0;
    }
  };

  // Verificar se capítulo está completo
  const isChapterCompleted = (chapter: StoryChapter): boolean => {
    return chapter.objectives.every(obj => 
      checkObjectiveProgress(obj) >= obj.target
    );
  };

  // Calcular porcentagem de progresso
  const getChapterProgress = (chapter: StoryChapter): number => {
    const total = chapter.objectives.reduce((sum, obj) => sum + obj.target, 0);
    const current = chapter.objectives.reduce((sum, obj) => 
      sum + checkObjectiveProgress(obj), 0
    );
    return Math.min(100, (current / total) * 100);
  };

  // Filtrar capítulos por fase
  const getChaptersByPhase = (phase: number) => {
    return storyChapters.filter(ch => ch.phase === phase);
  };

  // Renderizar objetivo individual
  const renderObjective = (objective: StoryObjective) => {
    const current = checkObjectiveProgress(objective);
    const progress = Math.min(100, (current / objective.target) * 100);
    const isCompleted = current >= objective.target;

    return (
      <div
        key={objective.id}
        className={`p-3 rounded-xl border-2 transition-all ${
          isCompleted
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
            : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">{objective.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-bold text-sm text-gray-800">
                {objective.description}
              </p>
              {isCompleted && (
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              )}
            </div>
            
            {/* Barra de Progresso */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  isCompleted
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                    : 'bg-gradient-to-r from-blue-400 to-purple-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className={`font-black ${isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                {current.toLocaleString('pt-BR')} / {objective.target.toLocaleString('pt-BR')}
              </span>
              <span className={`font-bold ${isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
                {progress.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar card de capítulo
  const renderChapterCard = (chapter: StoryChapter) => {
    const isUnlocked = chapter.id === 1 || storyChapters[chapter.id - 2]?.completed;
    const isCompleted = chapter.completed;
    const progress = getChapterProgress(chapter);
    const canClaim = isChapterCompleted(chapter) && !isCompleted;

    return (
      <div
        key={chapter.id}
        onClick={() => isUnlocked && setSelectedChapter(chapter)}
        className={`relative p-5 rounded-2xl border-3 transition-all duration-300 cursor-pointer ${
          !isUnlocked
            ? 'opacity-50 bg-gray-100 border-gray-300'
            : isCompleted
            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 hover:shadow-xl'
            : canClaim
            ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-400 hover:shadow-xl animate-pulse'
            : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300 hover:shadow-lg hover:scale-[1.02]'
        }`}
      >
        {/* Badge de Status */}
        <div className="absolute -top-3 -right-3">
          {!isUnlocked ? (
            <div className="bg-gray-500 text-white rounded-full p-2">
              <Lock className="w-5 h-5" />
            </div>
          ) : isCompleted ? (
            <div className="bg-green-500 text-white rounded-full p-2">
              <CheckCircle className="w-5 h-5" />
            </div>
          ) : canClaim ? (
            <div className="bg-yellow-500 text-white rounded-full p-2 animate-bounce">
              <Star className="w-5 h-5" />
            </div>
          ) : null}
        </div>

        {/* Conteúdo */}
        <div className="flex items-start gap-4">
          <div className="text-5xl">{chapter.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black text-purple-600">
                Cap. {chapter.id}
              </span>
              {chapter.rewards.badge && isCompleted && (
                <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full font-bold">
                  🏅 {chapter.rewards.badge}
                </span>
              )}
            </div>
            
            <h3 className="font-black text-lg text-gray-900 mb-2">
              {chapter.title}
            </h3>
            
            {/* Barra de Progresso do Capítulo */}
            {!isCompleted && isUnlocked && (
              <div className="mb-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs font-bold text-purple-600 mt-1">
                  {progress.toFixed(0)}% Completo
                </p>
              </div>
            )}

            {/* Objetivos Resumidos */}
            <div className="flex gap-1 flex-wrap">
              {chapter.objectives.map(obj => {
                const objProgress = checkObjectiveProgress(obj);
                const isObjCompleted = objProgress >= obj.target;
                return (
                  <div
                    key={obj.id}
                    className={`text-lg ${isObjCompleted ? 'opacity-100' : 'opacity-40'}`}
                    title={obj.description}
                  >
                    {obj.emoji}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header do Modo História */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white p-6 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-black mb-2">
              📖 A FAZENDA MALDITA
            </h1>
            <p className="text-purple-100 text-sm">
              Uma jornada épica de terror, ambição e superação através de 100 capítulos
            </p>
          </div>
          <button
            onClick={() => setShowRanking(!showRanking)}
            className="px-6 py-3 bg-white text-purple-600 rounded-xl font-black hover:scale-105 transition-all shadow-lg"
          >
            🏆 Ranking
          </button>
        </div>

        {/* Estatísticas de Progresso */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4" />
              <p className="text-xs font-bold">Capítulo Atual</p>
            </div>
            <p className="text-2xl font-black">{progress.currentChapter}/100</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4" />
              <p className="text-xs font-bold">Fase Atual</p>
            </div>
            <p className="text-2xl font-black">{progress.currentPhase}/10</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4" />
              <p className="text-xs font-bold">Completados</p>
            </div>
            <p className="text-2xl font-black">{progress.chaptersCompleted}</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4" />
              <p className="text-xs font-bold">Progresso Total</p>
            </div>
            <p className="text-2xl font-black">
              {((progress.chaptersCompleted / 100) * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      {/* Navegação de Fases */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {STORY_PHASES.map(phase => {
          const phaseChapters = getChaptersByPhase(phase.id);
          const completedInPhase = phaseChapters.filter(ch => ch.completed).length;
          const isUnlocked = phase.id === 1 || STORY_PHASES[phase.id - 2];
          
          return (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              disabled={!isUnlocked}
              className={`flex-shrink-0 px-6 py-4 rounded-xl font-black text-sm transition-all ${
                activePhase === phase.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                  : isUnlocked
                  ? 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <div className="text-2xl mb-1">{phase.emoji}</div>
              <div>{phase.name}</div>
              <div className="text-xs mt-1 opacity-75">
                {completedInPhase}/{phaseChapters.length}
              </div>
            </button>
          );
        })}
      </div>

      {/* Lista de Capítulos */}
      {!selectedChapter ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getChaptersByPhase(activePhase).map(renderChapterCard)}
        </div>
      ) : (
        /* Modal de Capítulo Detalhado */
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
            {/* Header do Capítulo */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-6xl">{selectedChapter.emoji}</div>
                  <div>
                    <span className="text-sm font-black text-purple-600">
                      CAPÍTULO {selectedChapter.id} - FASE {selectedChapter.phase}
                    </span>
                    <h2 className="text-3xl font-black text-gray-900 mb-1">
                      {selectedChapter.title}
                    </h2>
                    {selectedChapter.rewards.title && (
                      <p className="text-sm text-purple-600 font-bold">
                        🏆 Título: {selectedChapter.rewards.title}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedChapter(null)}
                  className="text-4xl text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>

              {/* História */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200 mb-6">
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                  {selectedChapter.story}
                </p>
              </div>
            </div>

            {/* Objetivos */}
            <div className="mb-6">
              <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-600" />
                Objetivos da Missão
              </h3>
              <div className="space-y-3">
                {selectedChapter.objectives.map(obj => renderObjective(obj))}
              </div>
            </div>

            {/* Recompensas */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-2xl border-2 border-yellow-300 mb-6">
              <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-600" />
                Recompensas
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {selectedChapter.rewards.coins && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💰</span>
                    <div>
                      <p className="text-xs text-gray-600">Moedas</p>
                      <p className="font-black text-lg">
                        {selectedChapter.rewards.coins.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                )}
                {selectedChapter.rewards.multiplier && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <p className="text-xs text-gray-600">Multiplicador</p>
                      <p className="font-black text-lg">
                        {selectedChapter.rewards.multiplier}x
                      </p>
                    </div>
                  </div>
                )}
                {selectedChapter.rewards.badge && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏅</span>
                    <div>
                      <p className="text-xs text-gray-600">Conquista</p>
                      <p className="font-black text-sm">
                        {selectedChapter.rewards.badge}
                      </p>
                    </div>
                  </div>
                )}
                {selectedChapter.rewards.title && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👑</span>
                    <div>
                      <p className="text-xs text-gray-600">Título</p>
                      <p className="font-black text-sm">
                        {selectedChapter.rewards.title}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Botão de Ação */}
            <div className="flex gap-3">
              {isChapterCompleted(selectedChapter) && !selectedChapter.completed && (
                <button
                  onClick={() => {
                    onClaimReward(selectedChapter.id);
                    setSelectedChapter(null);
                  }}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-lg animate-pulse"
                >
                  ✅ REIVINDICAR RECOMPENSAS
                </button>
              )}
              <button
                onClick={() => setSelectedChapter(null)}
                className="px-8 py-4 bg-gray-200 text-gray-700 rounded-2xl font-black hover:bg-gray-300 transition-all"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
