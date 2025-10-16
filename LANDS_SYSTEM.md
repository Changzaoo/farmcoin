# 🗺️ Sistema de Terrenos - FarmCoin

## 📋 Visão Geral

Sistema completo de terrenos com:
- **Mapa interativo** 50x50 (2500 terrenos)
- **10 tipos diferentes** de terrenos com raridades
- **Propriedade única** - cada terreno tem apenas 1 dono
- **Sistema de moradores** - até 100 moradores por terreno
- **Marketplace integrado** - compra e venda de terrenos
- **Bônus de renda** - terrenos dão bônus de renda passiva

## 🎮 Funcionalidades

### 1. Mapa Mundial
- Visualização em canvas 20x20 (viewport)
- Navegação por direções (Norte, Sul, Leste, Oeste)
- Click em terrenos para ver detalhes
- Cores diferentes para cada tipo de terreno
- Indicador visual de propriedade (👑)

### 2. Meus Terrenos
- Lista de todos os terrenos do usuário
- Informações de bônus e moradores
- Gerenciamento de moradores
- Listagem para venda

### 3. Marketplace
- Browse de terrenos à venda
- Filtros por tipo, região, preço
- Compra direta de terrenos
- Sistema de listagem com descrição

### 4. Sistema de Moradores
- Adicionar até 100 moradores
- Remover moradores
- Permissões customizáveis
- Histórico de quando foram adicionados

## 🏞️ Tipos de Terrenos

| Tipo | Emoji | Bônus | Raridade |
|------|-------|-------|----------|
| Planície | 🌾 | +5% | Comum (40%) |
| Floresta | 🌲 | +10% | Incomum (20%) |
| Colinas | ⛰️ | +12% | Incomum (15%) |
| Deserto | 🏜️ | +15% | Raro (10%) |
| Montanhas | 🏔️ | +20% | Raro (7%) |
| Pântano | 🌿 | +18% | Raro (4%) |
| Praia | 🏖️ | +30% | Épico (2%) |
| Vulcão | 🌋 | +50% | Lendário (1%) |
| Geleira | 🧊 | +55% | Lendário (0.5%) |
| Paraíso | 🌴 | +100% | Mítico (0.5%) |

## 🚀 Instalação e Configuração

### Passo 1: Inicializar o Mapa

**IMPORTANTE:** Execute isso apenas **UMA VEZ** para criar os 2500 terrenos no Firestore.

```bash
# Ainda não implementado - Será necessário executar via console do Firebase
```

Por enquanto, você pode executar a função diretamente do console:

```typescript
import { initializeLands } from './firebase/firestore';

// Execute isso no console do navegador após fazer login
initializeLands();
```

### Passo 2: Acessar o Mapa

1. Faça login no FarmCoin
2. Clique no botão **🗺️ Mapa**
3. Explore o mapa usando os botões de direção

## 📖 Como Usar

### Comprar um Terreno

1. **Via Marketplace:**
   - Clique em **🗺️ Mapa** → **🏪 Marketplace**
   - Navegue pelos terrenos à venda
   - Clique em **Comprar**

2. **Via Mapa (futura funcionalidade):**
   - Click em um terreno sem dono
   - Verá opção de compra direta

### Vender um Terreno

1. Vá em **🗺️ Mapa** → **🏠 Meus Terrenos**
2. Click no terreno que deseja vender
3. Click em **🏷️ Colocar à Venda**
4. Digite o preço e descrição
5. Confirme a listagem

### Adicionar Moradores

1. Abra os detalhes do seu terreno
2. Click em **➕ Adicionar** na seção de moradores
3. Digite o nome de usuário
4. Confirme

### Remover Moradores

1. Abra os detalhes do seu terreno
2. Na lista de moradores, click no ícone de lixeira 🗑️
3. Confirme a remoção

## 🗺️ Navegação do Mapa

### Controles
- **⬆️ Norte** - Move viewport para cima
- **⬇️ Sul** - Move viewport para baixo
- **⬅️ Oeste** - Move viewport para esquerda
- **➡️ Leste** - Move viewport para direita
- **🎯 Centro** - Retorna ao centro do mapa (25, 25)

### Sistema de Coordenadas
- Mapa total: 50x50 (0-49 em X e Y)
- Viewport: 20x20 (área visível)
- Coordenadas mostradas no canto superior direito

### Regiões
- **Norte** - Y < 15
- **Sul** - Y > 35
- **Oeste** - X < 15
- **Leste** - X > 35
- **Centro** - Demais áreas

## 💡 Dicas

1. **Terrenos raros** são mais escassos - procure nas bordas do mapa
2. **Bônus de renda** é aplicado sobre toda sua renda passiva
3. **Moradores** podem ser úteis para criar comunidades
4. **Compre terrenos estratégicos** para revender mais caro
5. **Explore diferentes regiões** para encontrar os melhores terrenos

## 🔧 Estrutura de Dados

### Firestore Collections

```
lands/
  land_{x}_{y}/
    coordinates: { x, y, region }
    type: LandType
    ownerId: string | null
    ownerUsername: string | null
    residents: LandResident[]
    bonusIncome: number
    forSale: boolean
    salePrice: number
    ...

landListings/
  {listingId}/
    landId: string
    sellerId: string
    price: number
    status: 'active' | 'sold' | 'cancelled'
    ...
```

## 🛠️ Desenvolvimento

### Adicionar Novos Tipos de Terreno

1. Adicione em `types/index.ts`:
```typescript
export enum LandType {
  // ...
  NEW_TYPE = 'new_type'
}
```

2. Atualize `Map.tsx`:
```typescript
const landColors = {
  // ...
  [LandType.NEW_TYPE]: '#COLOR'
};

const landEmojis = {
  // ...
  [LandType.NEW_TYPE]: '🆕'
};
```

3. Atualize a distribuição em `firestore.ts` na função `initializeLands()`

## 📊 Estatísticas

- **Total de terrenos:** 2500
- **Máximo de moradores por terreno:** 100
- **Tipos de terrenos:** 10
- **Regiões:** 5
- **Tamanho do mapa:** 50x50

## 🚧 Futuras Melhorias

- [ ] Construções em terrenos
- [ ] Batalhas por territórios
- [ ] Alianças entre donos de terrenos
- [ ] Eventos especiais em regiões
- [ ] Sistema de taxas para moradores
- [ ] Decoração de terrenos
- [ ] Recursos naturais por tipo de terreno
- [ ] Minimapa com visão geral
- [ ] Busca de terrenos por filtros
- [ ] Histórico de transações

## ❓ FAQ

**P: Posso ter mais de um terreno?**
R: Sim! Não há limite de terrenos por jogador.

**P: Os moradores têm benefícios?**
R: Atualmente são decorativos, mas futuramente terão funções especiais.

**P: Como sei se um terreno está à venda?**
R: Terrenos à venda têm borda dourada no mapa e aparecem no marketplace.

**P: Posso perder meu terreno?**
R: Não, uma vez comprado, o terreno é seu até você vender.

**P: O bônus de renda é cumulativo?**
R: Sim! Se você tem múltiplos terrenos, os bônus somam.

## 📞 Suporte

Em caso de bugs ou dúvidas, reporte no repositório do projeto.

---

**Divirta-se explorando e conquistando terras em FarmCoin! 🌾🏆**
