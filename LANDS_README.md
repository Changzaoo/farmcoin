# 🗺️ Sistema de Terrenos - FarmCoin

## 📋 Visão Geral

O Sistema de Terrenos adiciona uma nova dimensão ao FarmCoin, permitindo que jogadores comprem, vendam e gerenciem terrenos em um mapa interativo de 50x50 (2500 terrenos totais).

## 🎯 Características Principais

### 1. **Mapa Interativo**
- Grid de 50x50 terrenos (2500 total)
- Visualização em canvas com zoom e navegação
- Cores diferentes para cada tipo de terreno
- Indicadores visuais para terrenos possuídos

### 2. **Tipos de Terrenos**
- 🌱 **Planície** - Terreno básico, bom para agricultura
- 🌲 **Floresta** - Mais rentável, ideal para produção de madeira
- ⛰️ **Montanha** - Alto valor, grande renda
- 🏜️ **Deserto** - Menor custo, menor renda
- 💧 **Água** - Terreno aquático, bom para pesca
- ✨ **Especial** - Raro, maior valor e renda

### 3. **Raridades**
- ⚪ **Comum** (60%) - Multiplicador x1
- 🟢 **Incomum** (25%) - Multiplicador x1.5-2
- 🔵 **Raro** (10%) - Multiplicador x2.5-5
- 🟣 **Épico** (4%) - Multiplicador x5-10
- 🟠 **Lendário** (1%) - Multiplicador x10-25

### 4. **Sistema de Propriedade**
- ✅ Cada terreno pode ter **apenas 1 dono**
- ✅ Dono pode adicionar até **100 moradores**
- ✅ Personalização: nome e descrição customizados
- ✅ Venda no marketplace

### 5. **Sistema de Moradores**
- Até 100 moradores por terreno
- Permissões configuráveis (futuro):
  - Construir
  - Convidar outros
  - Remover moradores
- Gestão completa pelo dono

## 🚀 Como Usar

### Primeira Vez (Setup Inicial)

**⚠️ IMPORTANTE: Execute APENAS UMA VEZ**

1. Abra o arquivo `src/App.tsx` ou `src/components/Game/FarmCoinGame.tsx`

2. Adicione o import temporário:
```typescript
import { setupLandMap } from './utils/setupLandMap';
```

3. Adicione dentro do componente:
```typescript
useEffect(() => {
  setupLandMap(); // EXECUTE APENAS UMA VEZ!
}, []);
```

4. Recarregue a página e aguarde (3-5 minutos)

5. Verifique o console do navegador para confirmar:
```
✅ MAPA CRIADO COM SUCESSO!
✅ 2500 terrenos foram adicionados ao Firestore
```

6. **REMOVA** o código adicionado nos passos 2-3

7. Pronto! O mapa está inicializado e pronto para uso

### Acessando o Mapa

1. No jogo, clique no botão **"🗺️ Mapa"** (abaixo do Ranking)
2. O mapa será carregado automaticamente
3. Use os controles de navegação para explorar
4. Clique em um terreno para ver detalhes

### Comprando Terrenos

1. Navegue pelo mapa
2. Clique em um terreno **sem dono** (sem borda)
3. Veja os detalhes no painel lateral
4. Clique em **"Comprar Terreno"**
5. Suas moedas serão descontadas e você ganha renda passiva!

### Gerenciando Terrenos

#### Personalização
1. Clique em um terreno que você possui
2. Clique no ícone de edição (✏️)
3. Digite um nome e descrição personalizados
4. Clique em **"Salvar"**

#### Adicionar Moradores
1. Clique em um terreno que você possui
2. Clique em **"Gerenciar Moradores"**
3. Digite o username do jogador
4. Clique em **"Adicionar"**

#### Vender Terreno
1. Clique em um terreno que você possui
2. Clique em **"Listar para Venda"**
3. Digite o preço desejado
4. Confirme
5. O terreno aparecerá no marketplace para outros jogadores

## 💰 Economia de Terrenos

### Preços Base (antes dos multiplicadores de raridade)

| Tipo | Preço Base | Renda/s Base |
|------|------------|--------------|
| Planície | 1,000 🪙 | 1.0 🪙/s |
| Floresta | 1,500 🪙 | 1.5 🪙/s |
| Montanha | 2,000 🪙 | 2.0 🪙/s |
| Deserto | 800 🪙 | 0.8 🪙/s |
| Água | 1,200 🪙 | 1.2 🪙/s |
| Especial | 5,000 🪙 | 5.0 🪙/s |

### Exemplo de Cálculos

**Floresta Rara:**
- Preço: 1,500 × 5 = 7,500 🪙
- Renda: 1.5 × 2.5 = 3.75 🪙/s

**Montanha Lendária:**
- Preço: 2,000 × 25 = 50,000 🪙
- Renda: 2.0 × 10 = 20 🪙/s

**Terreno Especial Épico:**
- Preço: 5,000 × 10 = 50,000 🪙
- Renda: 5.0 × 5 = 25 🪙/s

## 🎨 Interface

### Controles do Mapa
- **Zoom +/-**: Aumentar/diminuir zoom
- **Setas Direcionais**: Navegar pelo mapa
- **Centro**: Voltar para o centro (25, 25)
- **Click no Terreno**: Ver detalhes

### Legenda de Cores
- 🟩 Verde Claro = Planície
- 🟢 Verde Escuro = Floresta
- ⬜ Cinza = Montanha
- 🟨 Amarelo = Deserto
- 🟦 Azul = Água
- 🟪 Roxo = Especial

### Indicadores Visuais
- **Borda Dourada** = Seu terreno
- **Borda Cinza** = Terreno de outro jogador
- **Círculo Dourado** = Marcador dos seus terrenos

## 📊 Funcionalidades Firestore

### Coleções Criadas
- `lands` - Todos os terrenos do mapa

### Queries Otimizadas
- Busca por área (viewport)
- Busca por dono
- Busca de terrenos à venda
- Filtros por tipo e raridade (futuro)

### Índices Recomendados no Firestore

Crie os seguintes índices compostos:

1. **Área de Visualização:**
   - Coleção: `lands`
   - Campos: `x` (Ascending), `y` (Ascending)

2. **Terrenos do Usuário:**
   - Coleção: `lands`
   - Campos: `ownerId` (Ascending), `purchasedAt` (Descending)

3. **Marketplace:**
   - Coleção: `lands`
   - Campos: `listedForSale` (Ascending), `salePrice` (Ascending)

## 🔧 Arquivos Modificados/Criados

### Novos Arquivos
- `src/types/index.ts` - Adicionados tipos: Land, LandType, LandRarity, LandResident, LandListing
- `src/firebase/lands.ts` - Funções de gerenciamento de terrenos
- `src/components/Game/LandMap.tsx` - Componente do mapa
- `src/utils/setupLandMap.ts` - Script de inicialização
- `LANDS_README.md` - Este arquivo

### Arquivos Modificados
- `src/components/Game/FarmCoinGame.tsx` - Integração do mapa
- `src/firebase/firestore.ts` - Imports atualizados

## 🎮 Fluxo do Jogador

1. **Exploração**
   - Jogador abre o mapa
   - Navega para encontrar terrenos interessantes
   - Compara tipos e raridades

2. **Aquisição**
   - Decide comprar um terreno
   - Verifica se tem moedas suficientes
   - Compra e recebe renda passiva

3. **Gestão**
   - Personaliza nome/descrição
   - Adiciona amigos como moradores
   - Decide se vende ou mantém

4. **Expansão**
   - Compra mais terrenos adjacentes
   - Cria "império" de terras
   - Maximiza renda passiva

## 🔮 Funcionalidades Futuras

- [ ] Sistema de construções nos terrenos
- [ ] Batalhas por territórios
- [ ] Alianças entre donos de terrenos adjacentes
- [ ] Recursos naturais (minérios, árvores, etc.)
- [ ] Eventos especiais em terrenos
- [ ] Taxas e impostos
- [ ] Sistema de clima afetando renda
- [ ] Mini-games nos terrenos
- [ ] Decorações e melhorias visuais
- [ ] Histórico de transações

## ⚠️ Notas Importantes

1. **Inicialização**: Só execute `setupLandMap()` UMA VEZ
2. **Performance**: O canvas renderiza apenas terrenos visíveis
3. **Custos**: Terrenos são permanentes e geram renda infinita
4. **Moradores**: Sistema atual é básico, permissões virão futuramente
5. **Vendas**: Terrenos vendidos perdem todos os moradores

## 🐛 Resolução de Problemas

### Mapa não carrega
- Verifique se `setupLandMap()` foi executado
- Confira o console para erros
- Verifique regras do Firestore

### Terrenos não aparecem
- Navegue pelo mapa (pode estar em área vazia)
- Use o botão "Centro" para voltar ao meio

### Não consigo comprar
- Verifique se tem moedas suficientes
- Confirme que o terreno não tem dono
- Veja o console para erros

### Erro ao adicionar morador
- Verifique se o username existe
- Confirme que não atingiu 100 moradores
- Certifique-se de ser o dono

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique este README
2. Confira o console do navegador
3. Revise o código em `src/firebase/lands.ts`
4. Teste em ambiente de desenvolvimento primeiro

---

**Desenvolvido para FarmCoin v2.0**  
Sistema de Terrenos - Expansão e Conquista! 🗺️🏆
