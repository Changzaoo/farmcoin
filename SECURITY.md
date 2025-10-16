# 🛡️ Sistema de Segurança e Anti-Fraude - FarmCoin

## 📋 Visão Geral

O FarmCoin possui um sistema robusto de proteção contra bots, auto-clickers, ataques DDoS e fraudes, garantindo uma experiência justa para todos os jogadores.

---

## 🤖 Proteção Anti-Bot

### **Limite de Clicks**
- **Máximo**: 14 clicks por segundo
- **Janela de análise**: 1 segundo (1000ms)
- **Ação**: Bloqueio temporário após violação

### **Detecção de Padrões Mecânicos**

O sistema analisa os últimos 10 clicks e detecta:

1. **Intervalos Regulares Demais**
   - Desvio padrão < 10ms = auto-clicker
   - Intervalos idênticos = macro detectado

2. **Variância Baixa**
   - Clicks com timing perfeito (< 100ms) = bot

3. **Sequências Repetitivas**
   - Apenas 1 ou 2 intervalos únicos = padrão não-humano

### **Sistema de Suspeição**

```
Nível 1: ⚠️ Aviso amarelo (click bloqueado)
Nível 2: ⚠️ Aviso laranja (suspeição aumentada)
Nível 3: 🚫 BLOQUEIO (1 minuto)
```

**Recuperação Gradual:**
- A cada click normal (> 200ms), reduz 0.1 no nível de suspeição
- Sistema perdoa clicks ocasionais rápidos

---

## 🛡️ Proteção DDoS

### **Limites de Requisição**
- **Threshold**: 100 requests em 1 segundo
- **Ação**: Bloqueio de 5 minutos
- **Monitoramento**: Contínuo por endpoint

### **Proteção Multi-Camada**

1. **Rate Limiting por Usuário**
   - Cada usuário tem quota individual
   - Histórico de requests por janela de tempo

2. **Análise de Comportamento**
   - Padrões de acesso suspeitos
   - Explosão súbita de requests

3. **Cleanup Automático**
   - Dados antigos limpos a cada 5 minutos
   - Memória otimizada para alta performance

---

## 💎 Sistema de Itens Únicos

### **Geração de Itens**

Apenas **upgrades de produção em cadeia** (compostos) geram itens únicos:

#### **Chances de Drop:**

| Valor do Upgrade | Chance de Drop | Tier Esperado |
|-----------------|---------------|---------------|
| ≥ 5B | 50% | Mítico ⭐ |
| ≥ 750M | 40% | Lendário 🔴 |
| ≥ 100M | 30% | Épico 🟣 |
| ≥ 15M | 20% | Raro 🔵 |
| ≥ 2.5M | 15% | Incomum 🟢 |
| < 2.5M | 10% | Comum ⚪ |

### **Raridade e Bônus**

```typescript
Raridade 0-100:
- 95-100: Mítico (5x-6x bônus)
- 85-94:  Lendário (4.5x-5.5x bônus)
- 70-84:  Épico (3.5x-4.7x bônus)
- 50-69:  Raro (2.5x-3.7x bônus)
- 30-49:  Incomum (1.5x-2.7x bônus)
- 0-29:   Comum (1x-1.5x bônus)
```

### **Atributos Especiais**

**Mítico (raridade ≥ 90):**
- 🎯 Chance Crítica: 0-20%
- 💰 Ouro Extra: 0-50%
- ⭐ Boost de XP: 0-30%

**Épico (raridade ≥ 70):**
- ⚡ Velocidade de Produção: 0-40%
- 🔧 Bônus de Eficiência: 0-25%

**Raro (raridade ≥ 50):**
- 🛡️ Durabilidade: 100-200
- ✨ Bônus de Qualidade: 0-15%

### **Características Únicas**

1. **Numeração Serial**
   - Cada item tem número único global
   - Contador nunca reseta
   - Prova de autenticidade

2. **Nomes Gerados**
   - Prefixos baseados na raridade:
     - Mítico: "Celestial", "Divino", "Eterno"
     - Lendário: "Lendário", "Ancestral"
     - Épico: "Glorioso", "Radiante"

3. **Transferível**
   - Itens podem ser vendidos no Marketplace
   - Propriedade rastreada por ownerId
   - Histórico mantido

---

## 📊 Estatísticas e Monitoramento

### **Estatísticas do Usuário**

```typescript
antiBot.getUserStats(userId) retorna:
{
  clicksPerSecond: number,
  suspicionLevel: number,
  blocked: boolean,
  blockedUntil?: timestamp
}
```

### **Estatísticas Globais de Itens**

```typescript
uniqueItems.getGlobalStats() retorna:
{
  totalItems: number,
  totalUnique: number,
  byTier: {
    MITICO: number,
    LENDARIO: number,
    // ...
  },
  averageRarity: number
}
```

---

## 🔧 Administração

### **Desbloquear Usuário**

```typescript
antiBot.resetUser(userId);
// Remove bloqueio e reseta suspeição
```

### **Transferir Item**

```typescript
uniqueItems.transferItem(itemId, newOwnerId);
// Para transações do marketplace
```

---

## ⚡ Performance

### **Otimizações**

1. **Cleanup Automático**
   - Usuários inativos > 10 minutos são removidos
   - Executa a cada 5 minutos

2. **Armazenamento Eficiente**
   - Map() para acesso O(1)
   - Apenas dados necessários em memória

3. **Singleton Pattern**
   - Uma única instância global
   - Compartilhada em toda aplicação

---

## 🎮 UX / Feedback Visual

### **Avisos ao Jogador**

#### **Amarelo (Warning):**
```
⚠️ Muitos clicks! Limite: 14/segundo
⚠️ Padrão de clicks suspeito detectado!
```

#### **Vermelho (Bloqueio):**
```
🤖 Bot detectado! Você foi bloqueado por 1 minuto.
🤖 Auto-clicker detectado! Bloqueado por 1 minuto.
🛡️ Proteção DDoS ativada. Muitas requisições detectadas.
```

#### **Notificação de Item Único:**
```
🎉 ITEM ÚNICO!
[Ícone] Nome do Item
Descrição
#Serial | Raridade | Bônus
```

---

## 🔐 Segurança

### **Proteções Implementadas**

✅ Rate limiting por usuário
✅ Detecção de padrões mecânicos
✅ Análise estatística de comportamento
✅ Bloqueios temporários escalonados
✅ Proteção DDoS multi-camada
✅ Itens com ID único e rastreável
✅ Numeração serial anti-falsificação

### **Próximas Melhorias**

- [ ] Integração com Firebase Security Rules
- [ ] Captcha para usuários suspeitos
- [ ] Machine Learning para detecção avançada
- [ ] Blacklist de IPs
- [ ] Honeypot para bots
- [ ] Análise de fingerprinting do navegador

---

## 📝 Logs

### **Console Logs**

```javascript
// Bot detection
console.warn('🚨 Usuário ${userId} bloqueado por bot detection')

// Item gerado
console.log('✨ Item único gerado! #${serial} - ${name} (Raridade: ${rarity})')

// Cleanup
console.log('🧹 Cleanup: ${count} usuários ativos')
```

---

## 🧪 Testes

### **Testar Proteção Anti-Bot**

1. Click 15+ vezes em 1 segundo → Deve bloquear
2. Click em intervalos regulares (50ms) → Detecta auto-clicker
3. Aguardar 1 minuto → Desbloqueio automático

### **Testar Geração de Itens**

1. Comprar upgrade composto caro (≥100M)
2. 30% de chance de gerar item
3. Verificar notificação popup
4. Item aparece no inventário

---

## 📚 Referências Técnicas

- **AntiBot**: `/src/utils/antiBot.ts`
- **Unique Items**: `/src/utils/uniqueItems.ts`
- **Integração**: `/src/components/Game/FarmCoinGame.tsx`

---

**Versão**: 2.0.0  
**Última Atualização**: 16/10/2025  
**Desenvolvedor**: Vinicius  
**Status**: ✅ Produção
