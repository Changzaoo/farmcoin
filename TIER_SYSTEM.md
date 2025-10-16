# 🏆 Sistema de Tiers e Upgrades Compostos

## 📋 Visão Geral

Implementamos um sistema completo de **tiers** (níveis) e **upgrades compostos** para adicionar profundidade estratégica ao FarmCoin!

---

## 🎨 Sistema de Tiers

Os upgrades agora são classificados em **6 tiers** baseados no custo base:

### Tiers e Cores

| Tier | Faixa de Custo | Cor | Efeito Visual |
|------|---------------|-----|---------------|
| 🔘 **Comum** | Menos de 1K | Cinza | Sem efeito especial |
| 🟢 **Incomum** | 1K - 100K | Verde | Sem efeito especial |
| 🔵 **Raro** | 100K - 10M | Azul | Sem efeito especial |
| 🟣 **Épico** | 10M - 1B | Roxo | ✨ Pulse suave |
| 🟠 **Lendário** | 1B - 100B | Laranja | ✨ Glow animado |
| 🔴 **Mítico** | Mais de 100B | Vermelho | ✨ Glow animado |

### Recursos Visuais

- **Badge colorido** ao lado do nome do upgrade
- **Borda colorida** no card do upgrade
- **Animações especiais** para tiers Épico e superiores:
  - Épico: Pulse suave (sombra pulsante roxa)
  - Lendário/Mítico: Glow animado (brilho laranja/vermelho)

---

## 🔐 Upgrades Compostos

### O que são?

Upgrades compostos são **upgrades especiais** que só podem ser comprados se você já possui **outros upgrades específicos** como requisito.

### Características

- 🏆 Marcados com emoji especial na descrição
- 🔒 Aparecem bloqueados até que você cumpra os requisitos
- 💪 Geralmente são mais poderosos que upgrades normais
- 📊 Exibem lista de requisitos faltantes quando bloqueados

### 10 Upgrades Compostos Criados

1. **Fazenda Superintensiva** 🌟
   - Custo: 50M
   - Requisitos: 5x Trator Pequeno, 3x Estufa Climatizada, 2x Sementes Híbridas

2. **Complexo Pecuário Premium** 🎖️
   - Custo: 150M
   - Requisitos: 10x Vaca Leiteira, 5x Cavalo, 1x Granja Industrial

3. **Pomar Celestial** 🍃
   - Custo: 300M
   - Requisitos: 5x Bananeira, 3x Cerejeira, 1x Pomar Hidropônico

4. **Simbiose Natural** 🌺
   - Custo: 500M
   - Requisitos: 2x Apiário Industrial, 5x Limoeiro, 10x Flores Silvestres

5. **Império Aquático Total** 🔱
   - Custo: 1B
   - Requisitos: 2x Aquicultura Marinha, 1x Caviar de Esturjão, 5x Fazenda de Ostras

6. **Gastronomia de Elite** 👑
   - Custo: 2B
   - Requisitos: 3x Safra Especial, 2x Queijo Trufado, 10x Champagne

7. **Singularidade Agrícola** 🤖
   - Custo: 5B
   - Requisitos: 5x IA para Agricultura, 2x Biotecnologia Avançada, 10x Robô Agricultor

8. **Fábrica Quantum** ⚛️
   - Custo: 10B
   - Requisitos: 3x Nanotecnologia Alimentar, 2x Síntese de Alimentos, 1x Fusão Nuclear

9. **Colônia Intergaláctica** 🌌
   - Custo: 25B
   - Requisitos: 2x Agricultura Espacial, 5x Estação Orbital, 1x Terraformação

10. **Deus da Agricultura** ✨ (LENDÁRIO)
    - Custo: 100B
    - Requisitos: 1x de cada upgrade composto principal + Multiverso Agrícola

---

## 🎯 Como Funciona

### Cálculo de Tier
```typescript
Custo < 1K → Comum
1K ≤ Custo < 100K → Incomum
100K ≤ Custo < 10M → Raro
10M ≤ Custo < 1B → Épico
1B ≤ Custo < 100B → Lendário
Custo ≥ 100B → Mítico
```

### Desbloqueio de Compostos

1. Sistema verifica automaticamente após cada compra
2. Compara quantidade de cada upgrade que você possui
3. Desbloqueia upgrade composto quando todos requisitos forem atendidos
4. Mostra tooltip com requisitos faltantes enquanto bloqueado

### Interface do Usuário

**Upgrade Normal:**
```
[Ícone] Nome do Upgrade (5) [Badge do Tier]
        Descrição
        💰 Custo | 📈 +Renda/s
        [Botão Comprar]
```

**Upgrade Bloqueado:**
```
[🔒 Ícone] Nome do Upgrade [Badge do Tier]
           Descrição 🏆 COMPOSTO
           🔒 Requisitos: [lista de faltantes]
           [🔒 Bloqueado]
```

---

## 📁 Arquivos Modificados

### Novos Arquivos
- `src/utils/tierSystem.ts` - Funções do sistema de tiers

### Arquivos Atualizados
- `src/types/index.ts` - Novos tipos e interfaces
- `src/data/upgrades.ts` - 111 upgrades com tiers + 10 compostos
- `src/components/Game/FarmCoinGame.tsx` - UI e lógica de desbloqueio

---

## 🚀 Próximos Passos Sugeridos

- ✅ Sistema de tiers funcionando
- ✅ Upgrades compostos implementados
- ✅ Animações visuais para tiers altos
- ✅ Auto-save após cada ação
- ⏳ Possível adição: Conquistas/Achievements
- ⏳ Possível adição: Sistema de prestígio
- ⏳ Possível adição: Eventos temporários

---

## 🎮 Como Testar

1. Acesse http://localhost:3001
2. Compre upgrades básicos
3. Observe as cores dos tiers mudando conforme o custo
4. Veja os upgrades compostos bloqueados no final da lista
5. Compre os requisitos e veja os compostos desbloquearem automaticamente!

---

**Divirta-se farmando! 🌾⛏️💰**
