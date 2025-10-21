import { useState, useEffect } from 'react';
import { StoryChapter, StoryObjective, StoryProgress } from '../../types/story';
import { CAMPAIGNS, StoryCampaign } from '../../data/campaigns';
import { GameState } from '../../types';
import { CheckCircle, Lock, Star, Award, TrendingUp, Target, Trophy } from 'lucide-react';

interface StoryModeProps {
  gameState: GameState;
  onClaimReward: (chapterId: number, campaignId: string) => void;
}

export default function StoryMode({ gameState, onClaimReward }: StoryModeProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<StoryCampaign>(CAMPAIGNS[0]);
  const [selectedChapter, setSelectedChapter] = useState<StoryChapter | null>(null);
  const [activePhase, setActivePhase] = useState(1);
  const [showRewardsTab, setShowRewardsTab] = useState(false);
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(new Set());
  const [claimedRewards, setClaimedRewards] = useState<Set<string>>(new Set());

  // Carregar progresso do localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`story_progress_${selectedCampaign.id}`);
    if (savedProgress) {
      const { completed, claimed } = JSON.parse(savedProgress);
      setCompletedChapters(new Set(completed || []));
      setClaimedRewards(new Set(claimed || []));
    }
  }, [selectedCampaign.id]);

  // Salvar progresso
  const saveProgress = (completed: Set<string>, claimed: Set<string>) => {
    localStorage.setItem(`story_progress_${selectedCampaign.id}`, JSON.stringify({
      completed: Array.from(completed),
      claimed: Array.from(claimed),
    }));
  };

  // Calcular estatísticas de progresso
  const getTotalCompleted = () => {
    return Array.from(claimedRewards).filter(key => 
      key.startsWith(`${selectedCampaign.id}_`)
    ).length;
  };

  const getCurrentPhase = () => {
    const completed = getTotalCompleted();
    return Math.min(10, Math.floor(completed / 10) + 1);
  };

  const getAllBadges = () => {
    return storyChapters
      .filter(ch => {
        const key = `${selectedCampaign.id}_${ch.id}`;
        return claimedRewards.has(key) && ch.rewards.badge;
      })
      .map(ch => ({ id: ch.id, badge: ch.rewards.badge!, emoji: ch.rewards.emoji || ch.emoji }));
  };

  const getAllTitles = () => {
    return storyChapters
      .filter(ch => {
        const key = `${selectedCampaign.id}_${ch.id}`;
        return claimedRewards.has(key) && ch.rewards.title;
      })
      .map(ch => ({ id: ch.id, title: ch.rewards.title!, emoji: ch.rewards.emoji || ch.emoji }));
  };

  // Usar capítulos e fases da campanha selecionada
  const storyChapters = selectedCampaign.chapters;
  const STORY_PHASES = selectedCampaign.phases;

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

  // Verificar se capítulo está completo (TODOS objetivos cumpridos)
  const isChapterCompleted = (chapter: StoryChapter): boolean => {
    return chapter.objectives.every(obj => 
      checkObjectiveProgress(obj) >= obj.target
    );
  };

  // Verificar se recompensa foi reivindicada
  const isRewardClaimed = (chapter: StoryChapter): boolean => {
    const key = `${selectedCampaign.id}_${chapter.id}`;
    return claimedRewards.has(key);
  };

  // Verificar se capítulo está desbloqueado
  const isChapterUnlocked = (chapter: StoryChapter): boolean => {
    if (chapter.id === 1) return true;
    
    const previousChapter = storyChapters.find(ch => ch.id === chapter.id - 1);
    if (!previousChapter) return false;
    
    const previousKey = `${selectedCampaign.id}_${previousChapter.id}`;
    return claimedRewards.has(previousKey);
  };

  // Reivindicar recompensa
  const handleClaimReward = (chapter: StoryChapter) => {
    if (!isChapterCompleted(chapter)) {
      alert('Complete todos os objetivos primeiro!');
      return;
    }

    const key = `${selectedCampaign.id}_${chapter.id}`;
    const newClaimed = new Set(claimedRewards);
    newClaimed.add(key);
    setClaimedRewards(newClaimed);
    saveProgress(completedChapters, newClaimed);

    // Chamar callback do pai
    onClaimReward(chapter.id, selectedCampaign.id);
    
    setSelectedChapter(null);
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
    const isUnlocked = isChapterUnlocked(chapter);
    const isCompleted = isChapterCompleted(chapter);
    const hasClaimedReward = isRewardClaimed(chapter);
    const progress = getChapterProgress(chapter);
    const canClaim = isCompleted && !hasClaimedReward;

    return (
      <div
        key={chapter.id}
        onClick={() => isUnlocked && setSelectedChapter(chapter)}
        style={{
          animation: isUnlocked ? `fadeInUp 0.5s ease-out ${(chapter.id % 10) * 0.05}s backwards` : 'none'
        }}
        className={`group relative p-5 rounded-2xl border-3 transition-all duration-500 cursor-pointer transform ${
          !isUnlocked
            ? 'opacity-50 bg-gray-100 border-gray-300'
            : hasClaimedReward
            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 hover:shadow-2xl hover:shadow-green-200 hover:-translate-y-2'
            : canClaim
            ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-400 hover:shadow-2xl hover:shadow-yellow-200 hover:-translate-y-2 animate-pulse'
            : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300 hover:shadow-2xl hover:shadow-purple-200 hover:-translate-y-2 hover:scale-105'
        }`}
      >
        {/* Badge de Status */}
        <div className="absolute -top-3 -right-3 transition-transform duration-300 group-hover:scale-110">
          {!isUnlocked ? (
            <div className="bg-gray-500 text-white rounded-full p-2 shadow-lg">
              <Lock className="w-5 h-5" />
            </div>
          ) : hasClaimedReward ? (
            <div className="bg-green-500 text-white rounded-full p-2 shadow-lg animate-pulse">
              <CheckCircle className="w-5 h-5" />
            </div>
          ) : canClaim ? (
            <div className="bg-yellow-500 text-white rounded-full p-2 shadow-lg animate-bounce">
              <Star className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          ) : null}
        </div>

        {/* Conteúdo */}
        <div className="flex items-start gap-4">
          <div className="text-5xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">{chapter.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black text-purple-600">
                Cap. {chapter.id}
              </span>
                            {chapter.rewards.badge && hasClaimedReward && (
                <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full font-bold">
                  🏅 {chapter.rewards.badge}
                </span>
              )}
            </div>
            
            <h3 className="font-black text-lg text-gray-900 mb-2">
              {chapter.title}
            </h3>
            
            {/* Barra de Progresso do Capítulo */}
            {!hasClaimedReward && isUnlocked && (
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
              📖 MODO HISTÓRIA
            </h1>
            <p className="text-purple-100 text-sm">
              Escolha sua campanha e embarque em uma jornada épica através de 100 capítulos
            </p>
          </div>
          <button
            onClick={() => setShowRewardsTab(!showRewardsTab)}
            className="px-6 py-3 bg-white text-purple-600 rounded-xl font-black hover:scale-105 transition-all shadow-lg"
          >
            🏆 Conquistas
          </button>
        </div>

        {/* Seletor de Campanhas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {CAMPAIGNS.map(campaign => (
            <button
              key={campaign.id}
              onClick={() => {
                setSelectedCampaign(campaign);
                setActivePhase(1);
                setSelectedChapter(null);
              }}
              className={`p-4 rounded-xl text-left transition-all ${
                selectedCampaign.id === campaign.id
                  ? 'bg-white text-purple-600 shadow-xl scale-105'
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-4xl">{campaign.emoji}</div>
                <div className="flex-1">
                  <h3 className="font-black text-lg mb-1">{campaign.name}</h3>
                  <p className={`text-xs mb-2 ${
                    selectedCampaign.id === campaign.id ? 'text-purple-500' : 'text-white/80'
                  }`}>
                    {campaign.theme}
                  </p>
                  <p className={`text-sm ${
                    selectedCampaign.id === campaign.id ? 'text-gray-600' : 'text-white/90'
                  }`}>
                    {campaign.description}
                  </p>
                </div>
                {selectedCampaign.id === campaign.id && (
                  <div className="bg-green-500 text-white rounded-full p-1">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Estatísticas de Progresso */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4" />
              <p className="text-xs font-bold">Capítulo Atual</p>
            </div>
            <p className="text-2xl font-black">{getTotalCompleted()}/100</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4" />
              <p className="text-xs font-bold">Fase Atual</p>
            </div>
            <p className="text-2xl font-black">{getCurrentPhase()}/10</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4" />
              <p className="text-xs font-bold">Completados</p>
            </div>
            <p className="text-2xl font-black">{getTotalCompleted()}</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4" />
              <p className="text-xs font-bold">Progresso Total</p>
            </div>
            <p className="text-2xl font-black">
              {((getTotalCompleted() / 100) * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      {/* Navegação de Fases */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {STORY_PHASES.map((phase, index) => {
          const phaseChapters = getChaptersByPhase(phase.id);
          const completedInPhase = phaseChapters.filter(ch => {
            const key = `${selectedCampaign.id}_${ch.id}`;
            return claimedRewards.has(key);
          }).length;
          const isUnlocked = phase.id === 1 || STORY_PHASES[phase.id - 2];
          
          return (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              disabled={!isUnlocked}
              style={{
                animation: `slideInFromTop 0.6s ease-out ${index * 0.08}s backwards`
              }}
              className={`group flex-shrink-0 px-6 py-4 rounded-xl font-black text-sm transition-all duration-500 transform ${
                activePhase === phase.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl shadow-purple-300 scale-110 -translate-y-1'
                  : isUnlocked
                  ? 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg hover:-translate-y-1 hover:scale-105'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
              }`}
            >
              <div className={`text-2xl mb-1 transition-transform duration-300 ${
                activePhase === phase.id ? 'animate-bounce' : 'group-hover:scale-125'
              }`}>{phase.emoji}</div>
              <div className="transition-all duration-300">{phase.name}</div>
              <div className={`text-xs mt-1 transition-all duration-300 ${
                activePhase === phase.id ? 'opacity-100' : 'opacity-75 group-hover:opacity-100'
              }`}>
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
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
          style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full my-8 p-6 md:p-8 relative"
            style={{ animation: 'modalSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            {/* Botão Fechar Fixo */}
            <button
              onClick={() => setSelectedChapter(null)}
              className="sticky top-0 right-0 float-right z-10 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg transition-all hover:scale-110"
            >
              ×
            </button>

            {/* Header do Capítulo */}
            <div className="mb-6 clear-both">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-6xl">{selectedChapter.emoji}</div>
                <div className="flex-1">
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
              {isChapterCompleted(selectedChapter) && !isRewardClaimed(selectedChapter) && (
                <button
                  onClick={() => handleClaimReward(selectedChapter)}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-lg animate-pulse"
                >
                  ✅ REIVINDICAR RECOMPENSAS
                </button>
              )}
              {isRewardClaimed(selectedChapter) && (
                <div className="flex-1 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-black text-lg text-center">
                  ✅ RECOMPENSA REIVINDICADA
                </div>
              )}
              {!isChapterCompleted(selectedChapter) && (
                <div className="flex-1 px-8 py-4 bg-gray-300 text-gray-600 rounded-2xl font-black text-lg text-center">
                  ⏳ Complete todos os objetivos
                </div>
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

      {/* Modal de Conquistas e Recompensas */}
      {showRewardsTab && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
          style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full my-8 p-6 md:p-8 relative"
            style={{ animation: 'modalSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            {/* Botão Fechar */}
            <button
              onClick={() => setShowRewardsTab(false)}
              className="sticky top-0 right-0 float-right z-10 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg transition-all hover:scale-110"
            >
              ×
            </button>

            {/* Cabeçalho */}
            <div className="mb-6 clear-both">
              <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
                🏆 Conquistas & Recompensas
              </h1>
              <p className="text-gray-600 text-lg">
                Campanha: <span className="font-black text-purple-600">{selectedCampaign.name}</span>
              </p>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-200">
                <p className="text-sm text-purple-600 font-bold mb-1">Capítulos Completos</p>
                <p className="text-3xl font-black text-gray-900">{getTotalCompleted()}/100</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl border-2 border-yellow-200">
                <p className="text-sm text-yellow-600 font-bold mb-1">Badges Conquistadas</p>
                <p className="text-3xl font-black text-gray-900">{getAllBadges().length}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border-2 border-blue-200">
                <p className="text-sm text-blue-600 font-bold mb-1">Títulos Desbloqueados</p>
                <p className="text-3xl font-black text-gray-900">{getAllTitles().length}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                <p className="text-sm text-green-600 font-bold mb-1">Progresso</p>
                <p className="text-3xl font-black text-gray-900">{getTotalCompleted()}%</p>
              </div>
            </div>

            {/* Badges */}
            <div className="mb-6">
              <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-600" />
                Badges Conquistadas
              </h2>
              {getAllBadges().length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 font-bold">Complete capítulos para ganhar badges!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {getAllBadges().map((item) => (
                    <div
                      key={item.id}
                      className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl border-2 border-yellow-300 hover:scale-105 transition-all"
                    >
                      <div className="text-4xl mb-2">{item.emoji}</div>
                      <p className="font-black text-sm text-gray-900">{item.badge}</p>
                      <p className="text-xs text-gray-600">Cap. {item.id}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Títulos */}
            <div className="mb-6">
              <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                👑 Títulos Desbloqueados
              </h2>
              {getAllTitles().length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 font-bold">Complete capítulos especiais para ganhar títulos!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getAllTitles().map((item) => (
                    <div
                      key={item.id}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-300 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{item.emoji}</div>
                        <div className="flex-1">
                          <p className="font-black text-lg text-gray-900">{item.title}</p>
                          <p className="text-sm text-purple-600">Capítulo {item.id}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botão Fechar */}
            <button
              onClick={() => setShowRewardsTab(false)}
              className="w-full px-8 py-4 bg-gray-200 text-gray-700 rounded-2xl font-black hover:bg-gray-300 transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
