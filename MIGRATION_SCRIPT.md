# 🔧 Script de Migração - EXECUTAR MANUALMENTE

## ⚠️ IMPORTANTE
O arquivo `FarmCoinGame.tsx` tem 1794 linhas. É muito grande para refatorar automaticamente.
Siga este guia PASSO A PASSO para migrar corretamente.

---

## 📝 PARTE 1: LIMPAR useEffect ANTIGOS

### 1.1 DELETAR useEffect de inicialização de upgrades (linhas ~72-122)

❌ **DELETAR TODO ESTE BLOCO:**
```typescript
useEffect(() => {
  console.log('🔧 ========== INICIALIZANDO UPGRADES ==========');
  // ... todo o conteúdo ...
  setUpgrades(initializedUpgrades);
}, [initialUpgrades]);
```

✅ **MOTIVO:** Upgrades agora vêm do Context, já inicializados

---

### 1.2 DELETAR useEffect de renda passiva (linhas ~135-150)

❌ **DELETAR TODO ESTE BLOCO:**
```typescript
useEffect(() => {
  const perSecond = calculatePassiveIncome();
  
  if (perSecond > 0) {
    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        coins: prev.coins + (perSecond / 10),
        totalCoins: prev.totalCoins + (perSecond / 10),
        perSecond
      }));
    }, 100);

    return () => clearInterval(interval);
  }
}, [calculatePassiveIncome]);
```

✅ **MOTIVO:** Substituído por `useGameLoop` (já adicionado no topo)

---

### 1.3 DELETAR useEffect de auto-save (linhas ~152-167)

❌ **DELETAR TODO ESTE BLOCO:**
```typescript
useEffect(() => {
  const saveInterval = setInterval(() => {
    setGameState(currentState => {
      setUpgrades(currentUpgrades => {
        saveGameState(uid, currentState, currentUpgrades).catch(console.error);
        return currentUpgrades;
      });
      return currentState;
    });
  }, 3000);

  return () => clearInterval(saveInterval);
}, [uid]);
```

✅ **MOTIVO:** Substituído por `useAutoSave` (já adicionado no topo)

---

### 1.4 DELETAR função calculatePassiveIncome (linhas ~125-133)

❌ **DELETAR TODO ESTE BLOCO:**
```typescript
const calculatePassiveIncome = useCallback(() => {
  return upgrades.reduce((total, upgrade) => {
    if (upgrade.count && upgrade.count > 0) {
      return total + (upgrade.income || 0) * upgrade.count;
    }
    return total;
  }, 0);
}, [upgrades]);
```

✅ **MOTIVO:** Cálculo agora é feito pelo Context automaticamente

---

### 1.5 DELETAR função saveGame (linhas ~169-177)

❌ **DELETAR TODO ESTE BLOCO:**
```typescript
const saveGame = async (stateToSave?: GameState) => {
  try {
    const currentState = stateToSave || gameState;
    await saveGameState(uid, currentState, upgrades);
    setLastSave(Date.now());
  } catch (error) {
    console.error('Erro ao salvar jogo:', error);
  }
};
```

✅ **MOTIVO:** Auto-save agora é automático via hook

---

## 📝 PARTE 2: ATUALIZAR handleClick

### 2.1 LOCALIZAR handleClick (procure por "const handleClick")

❌ **ANTES:**
```typescript
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  // ... validação anti-bot ...
  
  setGameState(prev => {
    const newState = {
      ...prev,
      coins: prev.coins + clickAmount,
      totalCoins: prev.totalCoins + clickAmount,
      totalClicks: prev.totalClicks + 1,
    };
    // ... save ...
    return newState;
  });
};
```

✅ **DEPOIS:**
```typescript
const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
  // 🛡️ PROTEÇÃO ANTI-BOT
  const validation = antiBot.validateClick(uid);
  
  if (!validation.allowed) {
    setBotWarning(validation.reason || 'Click bloqueado');
    setTimeout(() => setBotWarning(''), 5000);
    return;
  }

  if (validation.warning) {
    setBotWarning(validation.warning);
    setTimeout(() => setBotWarning(''), 3000);
  }

  // Efeito de click no botão
  setClickEffect(true);
  setTimeout(() => setClickEffect(false), 150);

  // Animação de mineração
  setIsMining(true);
  setTimeout(() => setIsMining(false), 600);

  const clickAmount = 0.005;
  
  // ✨ USAR CONTEXT
  addCoins(clickAmount);
  dispatch({ type: 'ADD_CLICK' });

  // Criar moeda flutuante (manter efeito visual)
  if (buttonRef.current) {
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newCoin: FloatingCoin = {
      id: coinIdRef.current++,
      x,
      y
    };
    
    setFloatingCoins(prev => [...prev, newCoin]);
    
    setTimeout(() => {
      setFloatingCoins(prev => prev.filter(coin => coin.id !== newCoin.id));
    }, 1000);
  }
}, [addCoins, dispatch, uid]);
```

---

## 📝 PARTE 3: ATUALIZAR buyUpgrade

### 3.1 LOCALIZAR handleBuyUpgrade ou buyUpgrade

❌ **ANTES:**
```typescript
const handleBuyUpgrade = (upgradeId: string) => {
  const upgrade = upgrades.find(u => u.id === upgradeId);
  if (!upgrade || gameState.coins < upgrade.cost) return;
  
  setGameState(prev => ({
    ...prev,
    coins: prev.coins - upgrade.cost,
    totalPurchases: prev.totalPurchases + 1,
  }));
  
  setUpgrades(prev => prev.map(u => 
    u.id === upgradeId 
      ? { ...u, count: (u.count || 0) + 1, ... }
      : u
  ));
};
```

✅ **DEPOIS:**
```typescript
const handleBuyUpgrade = useCallback((upgradeId: string) => {
  // ✨ USAR CONTEXT
  const success = contextBuyUpgrade(upgradeId);
  
  if (success) {
    // Efeitos visuais/sons podem continuar aqui
    console.log('✅ Upgrade comprado:', upgradeId);
  }
}, [contextBuyUpgrade]);
```

---

## 📝 PARTE 4: ATUALIZAR REFERÊNCIAS no JSX

### 4.1 Substituir todas as referências de variáveis

❌ **ANTES:**
- `gameState.coins` → ✅ `state.gameState.coins`
- `gameState.perSecond` → ✅ `state.gameState.perSecond`
- `gameState.totalCoins` → ✅ `state.gameState.totalCoins`
- `upgrades` → ✅ `state.upgrades` ou `filteredUpgrades`

### 4.2 PROCURAR E SUBSTITUIR (CTRL + H)

```
Procurar: gameState\.
Substituir: state.gameState.
```

```
Procurar: upgrades\.filter
Substituir: state.upgrades.filter
```

```
Procurar: upgrades\.map
Substituir: filteredUpgrades.map  (para listas no JSX)
```

---

## 📝 PARTE 5: ADICIONAR TAB DE ACHIEVEMENTS

### 5.1 NO JSX DAS TABS (procure por "melhorias" | "inventario")

✅ **ADICIONAR botão:**
```tsx
<button
  onClick={() => setActiveTab('achievements')}
  className={`px-6 py-3 rounded-lg font-bold transition-all ${
    activeTab === 'achievements'
      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg scale-105'
      : 'bg-white/10 text-white/70 hover:bg-white/20'
  }`}
>
  🏆 Conquistas
  {achievementStats.unlocked > 0 && (
    <span className="ml-2 bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full text-xs font-black">
      {achievementStats.unlocked}
    </span>
  )}
</button>
```

### 5.2 NO CONTEÚDO DAS TABS

✅ **ADICIONAR condicional:**
```tsx
{activeTab === 'achievements' && (
  <AchievementsPanel
    achievements={achievements}
    gameState={state.gameState}
  />
)}
```

---

## 📝 PARTE 6: ADICIONAR NOTIFICAÇÕES

### 6.1 NO FINAL DO RETURN (antes do último `</div>`)

✅ **ADICIONAR:**
```tsx
{/* 🏆 Notificações de Achievements */}
{newAchievements.map(achievement => (
  <AchievementNotification
    key={achievement.id}
    achievement={achievement}
    onClose={() => {/* auto-remove após 5s */}}
  />
))}
```

---

## 📝 PARTE 7: ATUALIZAR CARDS DE UPGRADES

### 7.1 LOCALIZAR o .map de upgrades no JSX

❌ **ANTES (button inline grande):**
```tsx
{filteredUpgrades.map(upgrade => (
  <button
    key={upgrade.id}
    onClick={() => handleBuyUpgrade(upgrade.id)}
    disabled={state.gameState.coins < upgrade.cost}
    className="..."
  >
    {/* muitas linhas de JSX */}
  </button>
))}
```

✅ **DEPOIS (componente limpo):**
```tsx
{filteredUpgrades.map(upgrade => (
  <UpgradeCard
    key={upgrade.id}
    upgrade={upgrade}
    canAfford={canAfford(upgrade.id)}
    onBuy={handleBuyUpgrade}
    formatNumber={formatNumber}
  />
))}
```

---

## 📝 PARTE 8: ADICIONAR HELPER formatNumber

### 8.1 ADICIONAR função (se não existir)

```typescript
const formatNumber = useCallback((num: number): string => {
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
}, []);
```

---

## 📝 PARTE 9: ADICIONAR INDICADOR DE SAVE

### 9.1 NO HEADER (próximo às moedas)

✅ **ADICIONAR:**
```tsx
<div className="flex items-center gap-2 text-sm">
  <span className={`
    ${saveStatus === 'saving' ? 'text-yellow-400 animate-pulse' : ''}
    ${saveStatus === 'idle' ? 'text-green-400' : ''}
    ${saveStatus === 'pending' ? 'text-blue-400' : ''}
    ${saveStatus === 'error' ? 'text-red-400' : ''}
  `}>
    {saveStatus === 'saving' && '💾 Salvando...'}
    {saveStatus === 'idle' && '✅ Salvo'}
    {saveStatus === 'pending' && '⏳ Pendente'}
    {saveStatus === 'error' && '❌ Erro'}
  </span>
  <span className="text-gray-400 text-xs">
    {new Date(lastSaveTime).toLocaleTimeString()}
  </span>
</div>
```

---

## ✅ CHECKLIST FINAL

Antes de testar:

- [ ] Deletou todos os useEffect antigos
- [ ] Deletou calculatePassiveIncome
- [ ] Deletou saveGame
- [ ] Atualizou handleClick
- [ ] Atualizou handleBuyUpgrade
- [ ] Substituiu gameState por state.gameState
- [ ] Substituiu upgrades por filteredUpgrades (no JSX)
- [ ] Adicionou tab de achievements
- [ ] Adicionou notificações
- [ ] Substituiu cards inline por UpgradeCard
- [ ] Adicionou formatNumber
- [ ] Adicionou indicador de save

---

## 🧪 TESTAR

```bash
# 1. Type check
npx tsc --noEmit

# 2. Dev server
npm run dev

# 3. Abrir navegador e verificar:
- [ ] Moedas aumentando automaticamente
- [ ] Cliques funcionando
- [ ] Compras de upgrades funcionando
- [ ] Auto-save aparecendo
- [ ] Tab de achievements aparecendo
- [ ] Conquistas desbloqueando
```

---

## 🐛 TROUBLESHOOTING

### Erro: "useGame must be used within GameProvider"
✅ Verificar App.tsx tem `<GameProvider>` envolvendo tudo

### Erro: TypeScript sobre tipos
✅ Executar `npx tsc --noEmit` e corrigir

### Upgrades não aparecem
✅ Verificar `filteredUpgrades` está sendo usado no .map

### Achievements não desbloqueiam
✅ Verificar `useAchievements` está no topo do componente

---

**BOA SORTE!** 🚀

Este é um processo manual mas garante que tudo funcione perfeitamente.
Siga passo a passo e teste frequentemente!
