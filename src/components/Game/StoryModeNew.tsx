import { useState, useEffect } from 'react';
import { StoryChapter, StoryShopItem, StoryInventoryItem, StoryProgress } from '../../types/story';
import { CAMPAIGNS, StoryCampaign } from '../../data/campaigns';
import { GameState } from '../../types';
import { 
  CheckCircle, Lock, Star, Award, Target, Trophy, 
  ShoppingCart, Package, X 
} from 'lucide-react';
import { showSuccessToast, showErrorToast, showWarningToast, showInfoToast } from '../UI/Toast';

interface StoryModeProps {
  gameState: GameState;
  onSpendCoins: (amount: number) => void;
  onClaimReward: (chapterId: number, campaignId: string, exp: number) => void;
}

export default function StoryModeNew({ gameState, onSpendCoins, onClaimReward }: StoryModeProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<StoryCampaign>(CAMPAIGNS[0]);
  const [selectedChapter, setSelectedChapter] = useState<StoryChapter | null>(null);
  const [activePhase, setActivePhase] = useState(1);
  const [showRewardsTab, setShowRewardsTab] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  
  // Progresso do jogador
  const [progress, setProgress] = useState<StoryProgress>({
    currentChapter: 1,
    currentPhase: 1,
    chaptersCompleted: 0,
    totalScore: 0,
    level: 1,
    currentExp: 0,
    expToNextLevel: 100,
    badges: [],
    titles: [],
    inventory: [],
    startedAt: new Date(),
    lastPlayedAt: new Date()
  });
  
  // Itens comprados por capítulo
  const [purchasedItems, setPurchasedItems] = useState<Map<number, Set<string>>>(new Map());
  
  // Capítulos completos
  const [completedChapters, setCompletedChapters] = useState<Set<number>>(new Set());

  // Carregar progresso do localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`story_progress_v2_${selectedCampaign.id}`);
    if (savedProgress) {
      const loaded = JSON.parse(savedProgress);
      setProgress({
        ...loaded,
        startedAt: new Date(loaded.startedAt),
        lastPlayedAt: new Date(loaded.lastPlayedAt),
        inventory: loaded.inventory.map((item: any) => ({
          ...item,
          acquiredAt: new Date(item.acquiredAt)
        }))
      });
      
      // Carregar itens comprados
      const purchasedMap = new Map<number, Set<string>>();
      Object.entries(loaded.purchasedItems || {}).forEach(([chapterId, items]) => {
        purchasedMap.set(Number(chapterId), new Set(items as string[]));
      });
      setPurchasedItems(purchasedMap);
      
      // Carregar capítulos completos
      setCompletedChapters(new Set(loaded.completedChapters || []));
    }
  }, [selectedCampaign.id]);

  // Salvar progresso
  const saveProgress = (newProgress: StoryProgress) => {
    const toSave = {
      ...newProgress,
      purchasedItems: Object.fromEntries(
        Array.from(purchasedItems.entries()).map(([k, v]) => [k, Array.from(v)])
      ),
      completedChapters: Array.from(completedChapters)
    };
    localStorage.setItem(`story_progress_v2_${selectedCampaign.id}`, JSON.stringify(toSave));
  };

  // Calcular EXP para próximo nível
  const calculateExpToNext = (level: number): number => {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  };

  // Adicionar EXP e verificar level up
  const addExp = (amount: number) => {
    let newExp = progress.currentExp + amount;
    let newLevel = progress.level;
    let expToNext = progress.expToNextLevel;

    while (newExp >= expToNext) {
      newExp -= expToNext;
      newLevel++;
      expToNext = calculateExpToNext(newLevel);
    }

    const updated = {
      ...progress,
      currentExp: newExp,
      level: newLevel,
      expToNextLevel: expToNext,
      lastPlayedAt: new Date()
    };
    
    setProgress(updated);
    saveProgress(updated);

    // Feedback visual de level up
    if (newLevel > progress.level) {
      showSuccessToast('🎉 LEVEL UP!', `Você agora é nível ${newLevel}!`);
    }
  };

  // Comprar item da loja
  const buyItem = (item: StoryShopItem, chapter: StoryChapter) => {
    if (gameState.coins < item.price) {
      showErrorToast('💰 Moedas insuficientes!', `Você precisa de ${item.price} moedas`);
      return;
    }

    // Verificar se já comprou
    const chapterPurchases = purchasedItems.get(chapter.id) || new Set();
    if (chapterPurchases.has(item.id)) {
      showInfoToast('✅ Item já adquirido', 'Você já possui este item!');
      return;
    }

    // Gastar moedas
    onSpendCoins(item.price);

    // Adicionar ao inventário
    const newItem: StoryInventoryItem = {
      itemId: item.id,
      name: item.name,
      emoji: item.emoji,
      quantity: 1,
      acquiredAt: new Date(),
      chapterId: chapter.id
    };

    const updatedProgress = {
      ...progress,
      inventory: [...progress.inventory, newItem]
    };
    setProgress(updatedProgress);

    // Marcar como comprado
    chapterPurchases.add(item.id);
    const newPurchased = new Map(purchasedItems);
    newPurchased.set(chapter.id, chapterPurchases);
    setPurchasedItems(newPurchased);

    saveProgress(updatedProgress);
    
    showSuccessToast(`${item.emoji} Item adquirido!`, `${item.name} foi adicionado ao inventário`);
  };

  // Verificar se objetivo está completo
  const checkObjective = (obj: any, chapter: StoryChapter): boolean => {
    switch (obj.type) {
      // Novos tipos (sistema de loja)
      case 'collect_coins':
        return gameState.coins >= (typeof obj.target === 'number' ? obj.target : parseInt(obj.target));
      case 'buy_item':
        const chapterPurchases = purchasedItems.get(chapter.id) || new Set();
        return chapterPurchases.has(obj.requiredItemId);
      case 'own_items':
        return progress.inventory.filter(i => i.chapterId === chapter.id).length >= obj.target;
      
      // Tipos antigos (compatibilidade)
      case 'coins':
        return gameState.coins >= (typeof obj.target === 'number' ? obj.target : parseInt(obj.target));
      case 'upgrades':
        return (gameState.upgrades?.length || 0) >= obj.target;
      case 'perSecond':
        return gameState.perSecond >= obj.target;
      case 'clicks':
        return (gameState.totalClicks || 0) >= obj.target;
      
      default:
        return false;
    }
  };

  // Verificar se capítulo está completo
  const isChapterCompleted = (chapter: StoryChapter): boolean => {
    return chapter.objectives.every(obj => checkObjective(obj, chapter));
  };

  // Verificar se capítulo foi reivindicado
  const isChapterClaimed = (chapterId: number): boolean => {
    return completedChapters.has(chapterId);
  };

  // Verificar se capítulo está desbloqueado
  const isChapterUnlocked = (chapter: StoryChapter): boolean => {
    if (chapter.id === 1) return true;
    return completedChapters.has(chapter.id - 1);
  };

  // Reivindicar recompensas
  const claimRewards = (chapter: StoryChapter) => {
    if (!isChapterCompleted(chapter)) {
      showWarningToast('⚠️ Objetivos incompletos', 'Complete todos os objetivos primeiro!');
      return;
    }

    if (isChapterClaimed(chapter.id)) {
      showInfoToast('✅ Já reivindicado', 'Você já reivindicou este capítulo!');
      return;
    }

    // Verificar se tem formato novo (com exp e item)
    const hasNewFormat = typeof chapter.rewards.exp === 'number' && !!chapter.rewards.item;

    // Adicionar EXP (novo formato ou padrão)
    const expGained: number = hasNewFormat ? (chapter.rewards.exp as number) : 50;
    addExp(expGained);

    // Adicionar badge e item (se existir)
    const newInventory = hasNewFormat && chapter.rewards.item
      ? [...progress.inventory, chapter.rewards.item]
      : progress.inventory;

    const updatedProgress = {
      ...progress,
      badges: [...progress.badges, chapter.rewards.badge],
      titles: chapter.rewards.title ? [...progress.titles, chapter.rewards.title] : progress.titles,
      inventory: newInventory,
      chaptersCompleted: progress.chaptersCompleted + 1,
      currentChapter: Math.max(progress.currentChapter, chapter.id + 1),
      currentPhase: Math.max(progress.currentPhase, chapter.phase)
    };
    
    setProgress(updatedProgress);

    // Marcar como completo
    const newCompleted = new Set(completedChapters);
    newCompleted.add(chapter.id);
    setCompletedChapters(newCompleted);

    saveProgress(updatedProgress);

    // Callback para adicionar moedas
    if (chapter.rewards.coins) {
      onClaimReward(chapter.id, selectedCampaign.id, expGained);
    }

    setSelectedChapter(null);
    
    // Mensagem adaptada ao formato
    if (hasNewFormat && chapter.rewards.item) {
      showSuccessToast(
        '🎉 Capítulo Completo!',
        `${chapter.rewards.item.emoji} ${chapter.rewards.item.name} • 🏅 ${chapter.rewards.badge} • ⚡ +${expGained} EXP`
      );
    } else {
      showSuccessToast(
        '🎉 Capítulo Completo!',
        `🏅 ${chapter.rewards.badge} • ⚡ +${expGained} EXP • 💰 +${chapter.rewards.coins || 0} moedas`
      );
    }
  };

  // Usar capítulos da campanha selecionada
  const storyChapters = selectedCampaign.chapters;
  const STORY_PHASES = selectedCampaign.phases;

  // Filtrar capítulos por fase
  const getChaptersByPhase = (phase: number) => {
    return storyChapters.filter(ch => ch.phase === phase);
  };

  return (
    <div className="space-y-6">
      {/* Header do Modo História com Nível e EXP */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white p-6 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
              📖 MODO HISTÓRIA
              <span className="text-2xl bg-yellow-400 text-purple-900 px-4 py-1 rounded-full">
                ⚡ Nível {progress.level}
              </span>
            </h1>
            
            {/* Barra de EXP */}
            <div className="bg-white/20 rounded-full h-6 overflow-hidden mb-2">
              <div 
                className="bg-gradient-to-r from-yellow-300 to-yellow-500 h-full transition-all duration-500 flex items-center justify-center"
                style={{ width: `${(progress.currentExp / progress.expToNextLevel) * 100}%` }}
              >
                <span className="text-xs font-black text-purple-900 px-2">
                  {progress.currentExp} / {progress.expToNextLevel} EXP
                </span>
              </div>
            </div>
            
            <p className="text-purple-100 text-sm">
              {selectedCampaign.description}
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowInventory(!showInventory)}
              className="px-4 py-3 bg-white text-purple-600 rounded-xl font-black hover:scale-105 transition-all shadow-lg flex items-center gap-2"
            >
              <Package className="w-5 h-5" />
              <span className="hidden sm:inline">Inventário</span>
              <span className="bg-purple-600 text-white rounded-full px-2 py-0.5 text-xs">
                {progress.inventory.length}
              </span>
            </button>
            <button
              onClick={() => setShowRewardsTab(!showRewardsTab)}
              className="px-4 py-3 bg-white text-purple-600 rounded-xl font-black hover:scale-105 transition-all shadow-lg flex items-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              <span className="hidden sm:inline">Conquistas</span>
            </button>
          </div>
        </div>

        {/* Seletor de Campanhas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {CAMPAIGNS.map((campaign, index) => {
            // Verificar se campanha anterior foi completa (capítulo 100)
            const isPreviousCampaignCompleted = index === 0 || (() => {
              const previousCampaignId = CAMPAIGNS[index - 1].id;
              const savedProgress = localStorage.getItem(`story_progress_v2_${previousCampaignId}`);
              if (!savedProgress) return false;
              const progress = JSON.parse(savedProgress);
              return (progress.completedChapters || []).includes(100);
            })();

            const isLocked = !isPreviousCampaignCompleted;

            return (
              <button
                key={campaign.id}
                onClick={() => {
                  if (isLocked) {
                    showWarningToast('🔒 Campanha Bloqueada', 'Complete o capítulo 100 da campanha anterior primeiro!');
                    return;
                  }
                  setSelectedCampaign(campaign);
                  setActivePhase(1);
                  setSelectedChapter(null);
                }}
                disabled={isLocked}
                className={`p-4 rounded-xl text-left transition-all relative ${
                  isLocked
                    ? 'bg-gray-800/50 backdrop-blur-sm text-gray-500 cursor-not-allowed opacity-60'
                    : selectedCampaign.id === campaign.id
                    ? 'bg-white text-purple-600 shadow-xl scale-105'
                    : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-4xl relative">
                    {campaign.emoji}
                    {isLocked && (
                      <Lock className="w-6 h-6 text-gray-400 absolute -top-1 -right-1" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-lg mb-1 flex items-center gap-2">
                      {campaign.name}
                      {isLocked && <span className="text-xs font-normal">🔒 Bloqueado</span>}
                    </h3>
                    <p className={`text-xs ${
                      isLocked
                        ? 'text-gray-500'
                        : selectedCampaign.id === campaign.id 
                        ? 'text-purple-500' 
                        : 'text-white/80'
                    }`}>
                      {campaign.theme}
                    </p>
                  </div>
                  {selectedCampaign.id === campaign.id && !isLocked && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Estatísticas */}
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
              <p className="text-xs font-bold">Completados</p>
            </div>
            <p className="text-2xl font-black">{progress.chaptersCompleted}</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4" />
              <p className="text-xs font-bold">Badges</p>
            </div>
            <p className="text-2xl font-black">{progress.badges.length}</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4" />
              <p className="text-xs font-bold">Itens</p>
            </div>
            <p className="text-2xl font-black">{progress.inventory.length}</p>
          </div>
        </div>
      </div>

      {/* Navegação de Fases */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {STORY_PHASES.map((phase, index) => {
          const phaseChapters = getChaptersByPhase(phase.id);
          const completedInPhase = phaseChapters.filter(ch => 
            completedChapters.has(ch.id)
          ).length;
          
          return (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              style={{
                animation: `slideInFromTop 0.6s ease-out ${index * 0.08}s backwards`
              }}
              className={`flex-shrink-0 px-6 py-4 rounded-xl font-black text-sm transition-all duration-500 transform ${
                activePhase === phase.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl scale-110'
                  : 'bg-white text-gray-700 hover:shadow-lg hover:scale-105 border-2 border-gray-200'
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

      {/* Lista de Capítulos ou Modal de Detalhes */}
      {!selectedChapter ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getChaptersByPhase(activePhase).map(chapter => {
            const isUnlocked = isChapterUnlocked(chapter);
            const isCompleted = isChapterCompleted(chapter);
            const isClaimed = isChapterClaimed(chapter.id);

            return (
              <div
                key={chapter.id}
                onClick={() => isUnlocked && setSelectedChapter(chapter)}
                className={`p-5 rounded-2xl border-3 transition-all cursor-pointer ${
                  !isUnlocked
                    ? 'opacity-50 bg-gray-100 border-gray-300'
                    : isClaimed
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 hover:shadow-xl'
                    : isCompleted
                    ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-400 hover:shadow-xl animate-pulse'
                    : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300 hover:shadow-xl hover:scale-105'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{chapter.emoji}</div>
                  <div className="flex-1">
                    <span className="text-xs font-black text-purple-600">
                      Cap. {chapter.id}
                    </span>
                    <h3 className="font-black text-lg text-gray-900 mb-2">
                      {chapter.title}
                    </h3>
                    
                    {!isClaimed && isUnlocked && (
                      <div className="flex gap-1 flex-wrap">
                        {chapter.objectives.map((obj, idx) => (
                          <div
                            key={idx}
                            className={`text-lg ${checkObjective(obj, chapter) ? 'opacity-100' : 'opacity-40'}`}
                            title={obj.description}
                          >
                            {obj.emoji}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {isClaimed && (
                      <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                        <CheckCircle className="w-4 h-4" />
                        COMPLETO
                      </div>
                    )}
                  </div>
                  
                  {!isUnlocked && (
                    <Lock className="w-6 h-6 text-gray-400" />
                  )}
                  {isClaimed && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                  {isCompleted && !isClaimed && (
                    <Star className="w-6 h-6 text-yellow-500 animate-spin" style={{ animationDuration: '3s' }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Modal de Capítulo Detalhado com LOJA
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full my-8 p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedChapter(null)}
              className="sticky top-0 right-0 float-right z-10 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="mb-6 clear-both">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-6xl">{selectedChapter.emoji}</div>
                <div className="flex-1">
                  <span className="text-sm font-black text-purple-600">
                    CAPÍTULO {selectedChapter.id} - FASE {selectedChapter.phase}
                  </span>
                  <h2 className="text-3xl font-black text-gray-900">
                    {selectedChapter.title}
                  </h2>
                </div>
              </div>

              {/* História */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200 mb-6">
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                  {selectedChapter.story}
                </p>
              </div>
            </div>

            {/* LOJA DO CAPÍTULO */}
            {selectedChapter.shopItems && selectedChapter.shopItems.length > 0 && (
              <div className="mb-6">
                <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                  Loja do Capítulo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedChapter.shopItems.map(item => {
                  const chapterPurchases = purchasedItems.get(selectedChapter.id) || new Set();
                  const owned = chapterPurchases.has(item.id);
                  const canAfford = gameState.coins >= item.price;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border-2 ${
                        owned 
                          ? 'bg-green-50 border-green-300' 
                          : canAfford
                          ? 'bg-white border-blue-300 hover:shadow-lg'
                          : 'bg-gray-50 border-gray-300 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <span className="text-3xl">{item.emoji}</span>
                        <div className="flex-1">
                          <h4 className="font-black text-gray-900">{item.name}</h4>
                          <p className="text-xs text-gray-600">{item.description}</p>
                          {item.effect && (
                            <p className="text-xs text-blue-600 font-bold mt-1">
                              ⚡ {item.effect}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-black text-yellow-600">
                          💰 {item.price.toLocaleString('pt-BR')}
                        </span>
                        {owned ? (
                          <span className="text-green-600 font-bold text-sm flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            POSSUI
                          </span>
                        ) : (
                          <button
                            onClick={() => buyItem(item, selectedChapter)}
                            disabled={!canAfford}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                              canAfford
                                ? 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            COMPRAR
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            )}

            {/* Objetivos */}
            <div className="mb-6">
              <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-600" />
                Objetivos da Missão
              </h3>
              <div className="space-y-3">
                {selectedChapter.objectives.map(obj => {
                  const isCompleted = checkObjective(obj, selectedChapter);

                  return (
                    <div
                      key={obj.id}
                      className={`p-4 rounded-xl border-2 ${
                        isCompleted
                          ? 'bg-green-50 border-green-300'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{obj.emoji}</span>
                        <div className="flex-1">
                          <p className="font-bold text-gray-800">{obj.description}</p>
                        </div>
                        {isCompleted && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recompensas */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-2xl border-2 border-yellow-300 mb-6">
              <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-600" />
                Recompensas
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="text-xs text-gray-600">EXP</p>
                    <p className="font-black text-lg">{selectedChapter.rewards.exp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  <div>
                    <p className="text-xs text-gray-600">Moedas</p>
                    <p className="font-black text-lg">{selectedChapter.rewards.coins?.toLocaleString('pt-BR') || 0}</p>
                  </div>
                </div>
                {selectedChapter.rewards.item ? (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedChapter.rewards.item.emoji}</span>
                    <div>
                      <p className="text-xs text-gray-600">Item Especial</p>
                      <p className="font-black text-sm">{selectedChapter.rewards.item.name}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 opacity-60">
                    <span className="text-2xl">—</span>
                    <div>
                      <p className="text-xs text-gray-600">Item Especial</p>
                      <p className="font-black text-sm">Nenhum item</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏅</span>
                  <div>
                    <p className="text-xs text-gray-600">Badge</p>
                    <p className="font-black text-sm">{selectedChapter.rewards.badge}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botão de Ação */}
            <div className="flex gap-3">
              {isChapterCompleted(selectedChapter) && !isChapterClaimed(selectedChapter.id) && (
                <button
                  onClick={() => claimRewards(selectedChapter)}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-lg animate-pulse"
                >
                  ✅ REIVINDICAR RECOMPENSAS
                </button>
              )}
              {isChapterClaimed(selectedChapter.id) && (
                <div className="flex-1 px-8 py-4 bg-green-500 text-white rounded-2xl font-black text-lg text-center">
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

      {/* Modal de Inventário */}
      {showInventory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 md:p-8 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                <Package className="w-8 h-8 text-purple-600" />
                Inventário do Modo História
              </h2>
              <button
                onClick={() => setShowInventory(false)}
                className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {progress.inventory.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="font-bold">Seu inventário está vazio</p>
                <p className="text-sm">Complete capítulos para ganhar itens!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {progress.inventory.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-200 hover:shadow-lg transition-all"
                  >
                    <div className="text-4xl mb-2">{item.emoji}</div>
                    <p className="font-black text-gray-900 text-sm mb-1">{item.name}</p>
                    <p className="text-xs text-purple-600">Cap. {item.chapterId}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      x{item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Conquistas */}
      {showRewardsTab && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full my-8 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-600" />
                Conquistas & Badges
              </h2>
              <button
                onClick={() => setShowRewardsTab(false)}
                className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Badges */}
            <div className="mb-6">
              <h3 className="text-xl font-black text-gray-900 mb-4">🏅 Badges Conquistadas</h3>
              {progress.badges.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 font-bold">Complete capítulos para ganhar badges!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {progress.badges.map((badge, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl border-2 border-yellow-300"
                    >
                      <div className="text-3xl mb-2">🏅</div>
                      <p className="font-black text-sm">{badge}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Títulos */}
            <div>
              <h3 className="text-xl font-black text-gray-900 mb-4">👑 Títulos Desbloqueados</h3>
              {progress.titles.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 font-bold">Complete capítulos especiais para ganhar títulos!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {progress.titles.map((title, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-300"
                    >
                      <p className="font-black text-lg text-gray-900">👑 {title}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
