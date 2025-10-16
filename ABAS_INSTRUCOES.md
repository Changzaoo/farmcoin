# Sistema de Abas - Instruções de Implementação

## Objetivo
Criar abas de navegação (Melhorias, Ver Inventário, Marketplace, Ranking) no lugar do título "Melhorias" e mostrar conteúdo correspondente quando clicado.

## Mudanças Necessárias

### 1. Adicionar estado de aba ativa
Linha ~45, adicionar:
```tsx
const [activeTab, setActiveTab] = useState<'melhorias' | 'inventario' | 'marketplace' | 'ranking'>('melhorias');
```

### 2. Substituir a seção (linha ~850)

**Substituir DE:**
```tsx
          ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-green-400">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {showInventory ? '📦 Inventário' : '🛒 Melhorias'}
            </h2>

            {showInventory ? (
```

**Substituir PARA:**
```tsx
          ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
            {/* Sistema de Abas */}
            <div className="flex border-b-2 border-gray-200">
              <button
                onClick={() => setActiveTab('melhorias')}
                className={`flex-1 px-6 py-4 font-bold text-lg transition-all ${
                  activeTab === 'melhorias'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-b-4 border-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🛒 Melhorias
              </button>
              
              <button
                onClick={() => setActiveTab('inventario')}
                className={`flex-1 px-6 py-4 font-bold text-lg transition-all ${
                  activeTab === 'inventario'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-b-4 border-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                📦 Ver Inventário
              </button>
              
              <button
                onClick={() => setActiveTab('marketplace')}
                className={`flex-1 px-6 py-4 font-bold text-lg transition-all ${
                  activeTab === 'marketplace'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-b-4 border-orange-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🏪 Marketplace
              </button>
              
              <button
                onClick={() => setActiveTab('ranking')}
                className={`flex-1 px-6 py-4 font-bold text-lg transition-all ${
                  activeTab === 'ranking'
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-b-4 border-yellow-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🏆 Ranking
              </button>
            </div>

            {/* Conteúdo das Abas */}
            <div className="p-6">
              {activeTab === 'inventario' && (
```

### 3. Antes do fechamento do inventário (linha ~1209), trocar:

**DE:**
```tsx
            ) : (
```

**PARA:**
```tsx
              )}

              {activeTab === 'melhorias' && (
```

### 4. Antes do fechamento da loja (linha ~1348), adicionar:

**ANTES DE:**
```tsx
          </div>
          )}
        </div>
```

**ADICIONAR:**
```tsx
              )}

              {activeTab === 'marketplace' && (
                <Marketplace
                  userId={uid}
                  username={gameState.username || 'Jogador'}
                  coins={gameState.coins}
                  ownedUpgrades={inventoryItems.map(u => ({
                    id: u.id,
                    name: u.name,
                    icon: u.icon,
                    tier: u.tier || UpgradeTier.COMUM,
                    count: u.count || 0,
                    baseIncome: u.baseIncome,
                    baseCost: u.baseCost
                  }))}
                  onPurchaseComplete={handleMarketplacePurchase}
                />
              )}

              {activeTab === 'ranking' && (
                <Ranking
                  currentUserId={uid}
                  currentUsername={gameState.username || 'Jogador'}
                  currentCoins={gameState.coins}
                  currentPerSecond={gameState.perSecond}
                  currentUpgradesOwned={upgradeStats.owned}
                />
              )}
            </div>
```

## Resultado Esperado
- 4 abas clicáveis (verde, azul, laranja, amarelo)
- Cada aba mostra seu conteúdo correspondente
- Borda inferior colorida indica aba ativa
- Remover botões antigos de inventário/marketplace/ranking
