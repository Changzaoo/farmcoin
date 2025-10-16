# 🧠 Tema de Dopamina - FarmCoin

## 🎯 Objetivo
Criar um site **extremamente viciante** usando princípios de design que ativam os centros de recompensa do cérebro humano.

---

## ✅ FASE 1 - CONCLUÍDA

### 🌈 **Fundo Animado Global**
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
animation: gradient-shift 15s ease infinite;
```
- Roxo → Rosa → Azul → Cyan
- Movimento suave e hipnótico
- Nunca para de se mover

### ✨ **Glassmorphism Vibrante**
- `glass-vibrant`: Fundo rgba(255,255,255,0.15)
- Blur de 20px
- Bordas brancas semi-transparentes
- Sombras profundas
- **Usado em**: Cards principais, área de click, abas

### 💎 **Cards Principais**
1. **Moedas** 💰💎
   - Gradiente: yellow-200 → amber-200 → orange-200
   - Font: font-black (900)
   - Drop-shadow em texto e emoji
   - Achievement glow permanente

2. **Por Segundo** 📈
   - Gradiente: green-200 → emerald-200 → teal-200
   - Mesmo tratamento visual

3. **Upgrades** 🎁🎮
   - Gradiente: blue-200 → cyan-200 → purple-200
   - Badges com gradientes coloridos

### 🎨 **Animações Globais Criadas**

#### `dopamine-hover`
```css
hover: translateY(-2px) scale(1.02) + sombra dourada
active: scale(0.98)
```

#### `satisfaction-pulse`
```css
6 estágios de vibração e rotação
Escala 0.95 → 1.05 → 1.05 → 1.05
```

#### `achievement-glow`
```css
Brilho dourado pulsante infinito
Sombras: 10px → 20px → 10px
```

#### `number-pop`
```css
Escala 1 → 1.2 → 1
Cor muda para amarelo no meio
```

#### `card-gradient-animated`
```css
Gradiente fluindo 0% → 100% → 0%
3 segundos de ciclo
```

#### `confetti-pop`
```css
Rotação 360° + translação -100px
Escala 0 → 1.5 → 1
```

### 🔘 **Botões Redesenhados**

**btn-primary (amarelo)**
```css
from-yellow-400 via-amber-400 to-orange-400
box-shadow: 0 10px 25px rgba(251,191,36,0.5)
hover: intensifica para 35px e brilho 0.7
```

**btn-success (verde)**
```css
from-green-400 via-emerald-400 to-teal-400
Mesma lógica de sombras
```

**btn-danger (vermelho)**
```css
from-red-400 via-pink-400 to-rose-400
Mesma lógica de sombras
```

### 📜 **Scrollbar Personalizada**
- Track: gradiente purple-100 → pink-100
- Thumb: gradiente purple-500 → pink-500
- Sombra: 0 0 10px rgba(168,85,247,0.5)
- Hover: intensifica para 15px
- Largura: 8px (mais visível)

---

## 🚧 PRÓXIMAS FASES

### ✅ FASE 2 - Upgrades e Loja (COMPLETA!)

#### Cards de Upgrade
- ✅ Glassmorphism em cada card
- ✅ Hover com lift e brilho
- ✅ Ícone grande animado (text-6xl)
- ✅ Gradiente baseado no tier
- ✅ Pulso ao poder comprar (animate-pulse)
- ⏳ Explosão de confetti ao comprar (próxima)

#### Filtros e Busca
- ✅ Busca com glassmorphism
- ✅ Categorias com gradientes vibrantes
- ✅ Badges de contagem pulsantes
- ✅ Estado vazio com emoji bounce

### ✅ FASE 3 - Inventário (COMPLETA!)

- ✅ Grid com cards glassmorphism
- ✅ Hover 3D (dopamine-hover)
- ✅ Badges flutuantes de quantidade
- ✅ Filtros com animação
- ✅ Seleção com checkbox animado
- ✅ Controles de seleção vibrantes
- ✅ Gradientes triplos em números

### 📋 FASE 4 - Marketplace

- [ ] Listings com glassmorphism
- [ ] Animação de "novo item"
- [ ] Countdown pulsante
- [ ] Badges de "melhor preço"
- [ ] Transação com celebração
- [ ] Histórico animado

### 📋 FASE 5 - Ranking

- [ ] Pódio 3D (1º 2º 3º)
- [ ] Coroas e medalhas animadas
- [ ] Brilho no top 3
- [ ] Avatar com border gradiente
- [ ] Setas de subida/descida
- [ ] Confetti para top 1

### 📋 FASE 6 - Micro-Animações

- [ ] Moedas voando ao clicar
- [ ] Partículas de fundo constantes
- [ ] Brilhos aleatórios
- [ ] Estrelas cadentes
- [ ] Pulse em todos números
- [ ] Hover em TUDO

### 📋 FASE 7 - Sons Visuais

- [ ] Flash de luz ao ganhar moedas
- [ ] Onda de choque ao level up
- [ ] Explosão ao unlock
- [ ] Brilho ao achievement
- [ ] Vibração visual ao erro

---

## 🧠 PRINCÍPIOS DE DOPAMINA

### 1. **Feedback Instantâneo** (<200ms)
- Toda ação tem resposta visual imediata
- Hover muda estado instantaneamente
- Click causa explosão de efeitos

### 2. **Recompensa em Camadas**
- Múltiplos efeitos simultâneos
- Visual + animação + som visual
- Cada layer reforça a recompensa

### 3. **Variação Imprevisível**
- Partículas em posições aleatórias
- Delays diferentes
- Nunca exatamente igual

### 4. **Cores Vibrantes**
- Gradientes multicoloridos
- Saturação alta
- Contraste forte
- Brilhos e sombras

### 5. **Movimento Constante**
- Nada é 100% estático
- Pulsos sutis em idle
- Partículas sempre flutuando
- Gradientes sempre fluindo

### 6. **Antecipação**
- Idle animado "convida" ao clique
- Hover mostra o que vai acontecer
- Pulso indica disponibilidade

### 7. **Celebração**
- Confetti ao comprar
- Números aumentando
- Brilhos e flashes
- Sensação de conquista

### 8. **Progresso Visível**
- Números grandes e animados
- Badges coloridos
- Barra de nível (futuro)
- Contadores em tempo real

---

## 📊 MÉTRICAS DE SUCESSO

### Tempo Médio de Sessão
- **Meta**: >15 minutos
- **Como**: Animações prendem atenção

### Taxa de Retorno
- **Meta**: >70% em 24h
- **Como**: Memória visual forte

### Clicks por Sessão
- **Meta**: >500 clicks
- **Como**: Botão viciante

### Conversão de Upgrades
- **Meta**: >80% compram algo
- **Como**: Visual irresistível

---

## 🎨 PALETA DE CORES

### Principais
```
Amarelo:   #FBBF24 (moedas)
Verde:     #10B981 (produção)
Azul:      #3B82F6 (upgrades)
Roxo:      #8B5CF6 (especial)
Rosa:      #EC4899 (destaque)
```

### Gradientes
```
Warm:    yellow → amber → orange
Cool:    blue → cyan → purple
Nature:  green → emerald → teal
Danger:  red → pink → rose
Magic:   purple → pink → fuchsia
```

---

## 🚀 PRÓXIMOS COMMITS

1. **Fase 2**: Upgrades com glassmorphism e animações de compra
2. **Fase 3**: Inventário com grid 3D e hover effects
3. **Fase 4**: Marketplace com listings animados
4. **Fase 5**: Ranking com pódio 3D
5. **Fase 6**: Micro-animações em tudo
6. **Fase 7**: Sons visuais e efeitos especiais

---

**Status Atual**: ✅ Fases 1, 2 e 3 Completas!  
**Próximo Passo**: 🚧 Fase 4 - Marketplace  
**Progresso**: 🧠 60% do tema completo  
**Vício Garantido**: 🧠💯%
