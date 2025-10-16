# 💎 Sistema de Preços dos Terrenos - FarmCoin

## 📊 Visão Geral

Os **terrenos são os itens mais caros do jogo FarmCoin**, representando o maior investimento que um jogador pode fazer. Eles oferecem bônus permanentes de renda e são essenciais para maximizar a produção.

## 💰 Tabela de Preços Base por Raridade

| Raridade | Preço Base | Probabilidade | Descrição |
|----------|------------|---------------|-----------|
| **COMUM** | 5.000.000,00 | 65% | Planície, Floresta |
| **INCOMUM** | 25.000.000,00 | 23% | Colinas, Deserto |
| **RARO** | 100.000.000,00 | 7% | Pântano, Praia |
| **ÉPICO** | 500.000.000,00 | 3.5% | Montanhas, Vulcão |
| **LENDÁRIO** | 2.500.000.000,00 | 0.8% | Geleira |
| **MÍTICO** | 10.000.000.000,00 | 0.2% | Paraíso |

## 🧮 Cálculo do Preço Final

O preço final de um terreno é calculado usando a seguinte fórmula:

```javascript
preçoFinal = preçoBase × (1 + bônusRenda/100) × (tamanho/100)
```

### Fatores que Influenciam o Preço:

1. **Raridade do Terreno**: Define o preço base
2. **Bônus de Renda**: Terrenos com maior bônus custam mais
3. **Tamanho**: Terrenos maiores custam proporcionalmente mais

### Exemplo de Cálculo:

**Terreno: Paraíso (MÍTICO)**
- Preço Base: 10.000.000.000,00
- Bônus de Renda: +20%
- Tamanho: 100 unidades

```
Preço Final = 10.000.000.000 × (1 + 20/100) × (100/100)
Preço Final = 10.000.000.000 × 1.20 × 1.0
Preço Final = 12.000.000.000,00 moedas
```

## 🌟 Bônus Especiais por Tipo de Terreno

### COMUM (5 Milhões)

**Planície**
- 🌾 Plantações: +10%
- 🐄 Animais: +5%

**Floresta**
- 🌾 Plantações: +15%
- 🏭 Indústria: +10%

### INCOMUM (25 Milhões)

**Colinas**
- 🐄 Animais: +20%
- 🚜 Maquinário: +10%

**Deserto**
- ⭐ Especiais: +25%

### RARO (100 Milhões)

**Pântano**
- 🌾 Plantações: +30%
- ⭐ Especiais: +15%

**Praia**
- 💼 Comércio: +35%
- 🐄 Animais: +20%

### ÉPICO (500 Milhões)

**Montanhas**
- 🚜 Maquinário: +40%
- 🏭 Indústria: +30%

**Vulcão**
- 🏭 Indústria: +50%
- ⭐ Especiais: +35%

### LENDÁRIO (2.5 Bilhões)

**Geleira**
- 💼 Comércio: +60%
- ⭐ Especiais: +40%

### MÍTICO (10 Bilhões)

**Paraíso** (TODOS OS BÔNUS!)
- 🌾 Plantações: +100%
- 🐄 Animais: +80%
- 🏭 Indústria: +60%
- 🚜 Maquinário: +50%
- 💼 Comércio: +70%
- ⭐ Especiais: +100%

## 📈 Progressão Recomendada

### Fase 1: Iniciante (0 - 10M moedas)
- **Objetivo**: Acumular moedas através de upgrades básicos
- **Terrenos**: Ainda inacessível - foque em upgrades

### Fase 2: Intermediário (10M - 100M moedas)
- **Objetivo**: Comprar primeiro terreno COMUM
- **Terrenos Acessíveis**: 
  - ✅ Planície (5M)
  - ✅ Floresta (5M base)
  - ⏳ Colinas (25M)

### Fase 3: Avançado (100M - 1B moedas)
- **Objetivo**: Adquirir terrenos INCOMUM e RARO
- **Terrenos Acessíveis**:
  - ✅ Deserto (25M base)
  - ✅ Pântano (100M base)
  - ✅ Praia (100M base)

### Fase 4: Expert (1B - 10B moedas)
- **Objetivo**: Colecionar terrenos ÉPICO e LENDÁRIO
- **Terrenos Acessíveis**:
  - ✅ Montanhas (500M base)
  - ✅ Vulcão (500M base)
  - ✅ Geleira (2.5B base)

### Fase 5: Lendário (10B+ moedas)
- **Objetivo**: O sonho definitivo - PARAÍSO
- **Terreno Final**:
  - 🌟 Paraíso (10B base) - O terreno mais raro e poderoso!

## 🎯 Comparação com Outros Itens

### Item Mais Caro de Cada Categoria (antes dos terrenos):

- **Plantação**: Fazenda Automatizada - 1.250.000,00 (1.25M)
- **Gado**: Granja Industrial - 17.500.000,00 (17.5M)
- **Especiais**: Nave Espacial - ~500.000.000,00 (500M)

### Terreno Mais Barato:
- **Planície COMUM**: 5.000.000,00 (5M base)
  - **4x mais caro** que a Fazenda Automatizada
  - Mesmo assim, oferece bônus permanentes!

### Terreno Mais Caro:
- **Paraíso MÍTICO**: 10.000.000.000,00 (10B base)
  - **20x mais caro** que o item especial mais caro
  - **570x mais caro** que a Granja Industrial
  - **Verdadeiro endgame do FarmCoin**

## 💡 Estratégias de Compra

### 1. Foco em ROI (Retorno sobre Investimento)
- Compre terrenos que beneficiem suas categorias principais
- Ex: Se tem muitas plantações, priorize Floresta ou Pântano

### 2. Diversificação
- Compre diferentes tipos para maximizar todos os bônus
- Terrenos múltiplos = bônus acumulados

### 3. Planejamento de Longo Prazo
- Terrenos MÍTICOS requerem meses de jogo dedicado
- Estabeleça metas realistas (ex: 1 terreno COMUM por semana)

### 4. Marketplace
- Terrenos podem ser revendidos
- Potencial de lucro com especulação
- Compre barato, venda caro!

## 🏆 Benefícios de Possuir Terrenos

1. **Bônus Permanentes**: Multiplicadores aplicados automaticamente
2. **Status**: Terrenos raros são símbolo de prestígio
3. **Renda Passiva**: Terrenos geram valor continuamente
4. **Investimento**: Podem ser vendidos no marketplace
5. **Moradores**: Até 10 jogadores podem morar em seu terreno
6. **Personalização**: Nomeie e customize seu terreno

## 📝 Como Comprar um Terreno

1. **Acesse o Mapa Mundial** 🗺️
2. **Clique em um terreno sem dono** (sem coroa 👑)
3. **Veja os detalhes**: Raridade, bônus, preço
4. **Confirme a compra** se tiver moedas suficientes
5. **Aproveite os bônus!** 🎉

## ⚠️ Avisos Importantes

- ❌ **Terrenos NÃO podem ser deletados** - Compre com cuidado!
- ✅ **Terrenos PODEM ser vendidos** no marketplace
- 💰 **Preços são FINAIS** - Não há reembolso
- 🌍 **Apenas 2500 terrenos** existem no mapa total (50x50)
- 🏆 **Terrenos raros são limitados** - Aja rápido!

## 🎮 Conclusão

Os terrenos representam o **investimento supremo** no FarmCoin. Com preços que vão de 5 milhões a 10 bilhões de moedas, eles são dezenas a centenas de vezes mais caros que qualquer outro item do jogo.

**Comprar um terreno é uma declaração de compromisso com o jogo e um símbolo de status na comunidade FarmCoin!** 🌟

---

*Documento criado em: 16/10/2025*
*Versão: 1.0*
