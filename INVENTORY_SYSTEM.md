# 📦 Sistema de Inventário - FarmCoin

## 📋 Visão Geral

Implementamos um **sistema de inventário completo** que permite aos jogadores visualizar todos os upgrades que possuem e acompanhar estatísticas detalhadas!

---

## ✨ Recursos Implementados

### 🎯 Botão de Alternância Inventário/Loja

Um botão dinâmico que permite alternar entre duas visualizações:

- **📦 Ver Inventário** - Mostra todos os upgrades que você possui
- **🛒 Ver Loja** - Mostra todos os upgrades disponíveis para compra

**Localização:** Logo abaixo do botão de clique principal

**Badge:** Mostra quantidade de upgrades únicos possuídos

---

## 📊 Estatísticas de Upgrades (Card Superior Direito)

O card de "Upgrades" agora mostra informações detalhadas:

### Informações Exibidas

1. **Total Possuídos/Total Disponível**
   - Formato: `X/121` (X upgrades possuídos de 121 totais)
   - Número grande em azul destacado

2. **Upgrades Disponíveis** ✅
   - Badge verde mostrando quantos upgrades você pode comprar agora
   - Critérios:
     * Você tem moedas suficientes
     * Upgrade não está bloqueado (requisitos atendidos)

3. **Upgrades Bloqueados** 🔒
   - Badge vermelho mostrando quantos upgrades compostos estão bloqueados
   - Só aparece se houver upgrades bloqueados

### Exemplo Visual

```
Upgrades
  25/121       [🛒 ícone]

[✅ 8 disponíveis] [🔒 3 bloqueados]
```

---

## 📦 Tela de Inventário

### Características

**Ordenação:** Upgrades ordenados por quantidade (maior primeiro)

**Layout do Item:**
- Ícone grande do upgrade
- Nome do upgrade
- Badge do tier (Comum, Raro, Épico, etc.)
- **Badge de quantidade** destacado em azul (x5, x10, etc.)
- Descrição
- Estatísticas:
  * 📈 Renda por segundo de cada unidade
  * 💰 **Renda total** de todas as unidades somadas

### Cores e Efeitos Visuais

- **Fundo:** Gradiente azul-roxo suave
- **Borda:** Cor do tier do upgrade
- **Animações:** Glow/Pulse para tiers épicos e superiores
- **Badge de quantidade:** Fundo azul sólido com texto branco

### Estado Vazio

Quando não há itens no inventário:
```
    [📦 ícone grande]
    Inventário Vazio
    Compre upgrades para vê-los aqui!
```

---

## 🛒 Tela de Loja (Melhorias)

Mantém todas as funcionalidades originais:

- Filtros por categoria
- Busca por nome/descrição
- Tiers coloridos
- Upgrades compostos bloqueados
- Indicadores de requisitos faltantes
- Botões de compra com estados visuais

---

## 🎮 Fluxo de Uso

### Modo Loja (Padrão)
1. Visualize todos os upgrades disponíveis
2. Filtre por categoria ou busque
3. Veja **quantos estão disponíveis** no card superior
4. Compre upgrades

### Modo Inventário
1. Clique em "📦 Ver Inventário"
2. Veja todos os upgrades que você possui
3. Verifique renda total de cada tipo
4. Acompanhe quantidades
5. Clique em "🛒 Ver Loja" para voltar

---

## 📈 Cálculos Automáticos

### Upgrades Disponíveis
```typescript
available = upgrades.filter(u => {
  const canAfford = gameState.coins >= u.cost
  const isUnlocked = !u.isComposite || u.unlocked
  return canAfford && isUnlocked
}).length
```

### Upgrades Bloqueados
```typescript
locked = upgrades.filter(u => 
  u.isComposite && !u.unlocked
).length
```

### Renda Total por Item
```typescript
totalIncome = (item.income * item.count)
```

---

## 🎨 Código de Cores

### Estatísticas do Card Superior
- **Verde claro** (bg-green-100/text-green-700): Upgrades disponíveis
- **Vermelho claro** (bg-red-100/text-red-700): Upgrades bloqueados

### Inventário
- **Azul** (bg-blue-500): Badge de quantidade
- **Gradiente azul-roxo**: Fundo dos cards
- **Cores do Tier**: Bordas e badges dos tiers

---

## 💡 Benefícios para o Jogador

1. **Visão Clara:** Saiba exatamente quantos upgrades você possui
2. **Planejamento:** Veja upgrades disponíveis para comprar agora
3. **Progresso:** Acompanhe quanto falta para desbloquear compostos
4. **Estatísticas:** Veja contribuição individual de cada upgrade
5. **Organização:** Inventário ordenado por quantidade facilita gestão

---

## 🔄 Integração com Sistema Existente

O inventário se integra perfeitamente com:

- ✅ Sistema de Tiers (cores e badges)
- ✅ Upgrades Compostos (só mostra desbloqueados)
- ✅ Auto-save (sincroniza automaticamente)
- ✅ Renda passiva (cálculos em tempo real)
- ✅ Animações visuais (glow/pulse mantidos)

---

## 📁 Arquivos Modificados

- `src/components/Game/FarmCoinGame.tsx`
  * Adicionado estado `showInventory`
  * Criadas funções `upgradeStats` e `inventoryItems`
  * Renderização condicional Inventário/Loja
  * Botão de alternância
  * Card de estatísticas atualizado

---

## 🚀 Testes Recomendados

1. ✅ Compre alguns upgrades diferentes
2. ✅ Clique em "Ver Inventário"
3. ✅ Verifique ordenação por quantidade
4. ✅ Confira cálculo de renda total
5. ✅ Observe badges de tier e quantidade
6. ✅ Volte para loja e veja contador de disponíveis
7. ✅ Compre mais e veja inventário atualizar

---

## 📊 Exemplo Prático

**Cenário:** Você possui:
- 10x Semente de Trigo (0.1/s cada) = 1.0/s total
- 5x Vaca Leiteira (2.5/s cada) = 12.5/s total
- 2x Fazenda Vertical (20/s cada) = 40/s total

**No Inventário:**
```
[🌱] Semente de Trigo [Comum] [x10]
     Planta trigo básico para ganhar moedas
     📈 +0.10/s cada | 💰 Total: +1.00/s

[🐄] Vaca Leiteira [Incomum] [x5]
     Produz leite de qualidade
     📈 +2.50/s cada | 💰 Total: +12.50/s

[🏢] Fazenda Vertical [Raro] [x2]
     Cultivo em várias camadas
     📈 +20.00/s cada | 💰 Total: +40.00/s
```

**No Card Superior:**
```
Upgrades: 3/121
[✅ 15 disponíveis] [🔒 8 bloqueados]
```

---

**Aproveite seu novo inventário! 📦💰**
