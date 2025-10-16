# 🗺️ Novas Funcionalidades do Mapa - FarmCoin

## ✅ Funcionalidades Implementadas

### 1. 🎨 Emoji de Raridade no Mapa
- **Implementado**: Cada terreno agora exibe um emoji de raridade no canto superior esquerdo
- **Emojis por Raridade**:
  - ⚪ **COMUM** - Círculo branco
  - 🟢 **INCOMUM** - Círculo verde
  - 🔵 **RARO** - Círculo azul
  - 🟣 **ÉPICO** - Círculo roxo
  - 🟠 **LENDÁRIO** - Círculo laranja
  - 🌟 **MÍTICO** - Estrela dourada

### 2. 🖱️ Arrastar e Mover o Mapa (Drag & Drop)
- **Implementado**: Sistema completo de arrastar e soltar
- **Como usar**:
  - Clique e segure no mapa
  - Arraste para qualquer direção
  - Solte para parar
  - O cursor muda para "grab" (mão aberta) e "grabbing" (mão fechada)
- **Funcionalidades**:
  - `handleMouseDown`: Inicia o arrasto
  - `handleMouseMove`: Atualiza posição enquanto arrasta
  - `handleMouseUp`: Finaliza o arrasto
  - Movimento natural e suave
  - Limites de 10-40 nas coordenadas X e Y

### 3. 🔍 Zoom no Mapa
- **Implementado**: Sistema de zoom com múltiplas formas de controle
- **Controles**:
  - **Roda do Mouse**: Scroll para dar zoom in/out
  - **Botões +/-**: Clique para ajustar zoom
  - **Slider**: Arrastar barra para ajuste preciso
  - **Botão Reset**: Volta para zoom 100%
- **Range de Zoom**:
  - Mínimo: 50% (0.5x)
  - Máximo: 200% (2x)
  - Padrão: 100% (1x)
- **Indicador Visual**: Mostra percentual atual do zoom
- **Renderização Adaptativa**: Todos os elementos escalam proporcionalmente

### 4. 🎯 Filtro por Raridade
- **Implementado**: Dropdown para filtrar terrenos por raridade
- **Opções**:
  - **Todas as raridades** (padrão)
  - ⚪ Comum
  - 🟢 Incomum
  - 🔵 Raro
  - 🟣 Épico
  - 🟠 Lendário
  - 🌟 Mítico
- **Funcionalidade**: Ao selecionar uma raridade, apenas terrenos dessa categoria aparecem no mapa
- **Clique na Legenda**: Pode clicar em qualquer raridade na seção "Tipos de Terrenos por Raridade" para filtrar

### 5. 🏷️ Filtro de Disponibilidade
- **Implementado**: Checkbox para mostrar apenas terrenos sem dono
- **Como usar**:
  - Marque "Apenas terrenos disponíveis (sem dono)"
  - O mapa exibirá só terrenos que podem ser comprados
  - Ideal para buscar oportunidades de compra
- **Benefício**: Foco em terrenos que você pode adquirir

### 6. 💰 Sistema de Ofertas Completo

#### 6.1. Fazer Oferta
- **Função**: `makeLandOffer`
- **Parâmetros**:
  - `landId`: ID do terreno
  - `listingId`: ID da listagem
  - `buyerId`: ID do comprador
  - `buyerUsername`: Nome do comprador
  - `offerAmount`: Valor da oferta
  - `message`: Mensagem opcional
- **Modal de Oferta**: Interface para inserir valor e mensagem
- **Validação**: Verifica se usuário tem moedas suficientes

#### 6.2. Aceitar Oferta
- **Função**: `acceptLandOffer`
- **Parâmetros**:
  - `offerId`: ID da oferta
  - `sellerId`: ID do vendedor
- **Processo**:
  1. Confirma que vendedor é o dono
  2. Valida que oferta está pendente
  3. Marca oferta como aceita
  4. Transfere terreno automaticamente
- **Segurança**: Apenas o dono pode aceitar ofertas

#### 6.3. Recusar Oferta
- **Função**: `rejectLandOffer`
- **Parâmetros**:
  - `offerId`: ID da oferta
  - `sellerId`: ID do vendedor
  - `reason`: Motivo da recusa (opcional)
- **Interface**: Prompt para inserir motivo
- **Notificação**: Compradoré notificado da recusa

#### 6.4. Ver Ofertas Recebidas
- **Função**: `getLandOffers(landId)`
- **Retorna**: Lista de ofertas pendentes
- **Ordenação**: Por valor (maior para menor)
- **Informações**:
  - Nome do comprador
  - Valor oferecido
  - Mensagem
  - Data da oferta
  - Status (pendente/aceita/recusada)

#### 6.5. Ver Suas Ofertas
- **Função**: `getUserLandOffers(userId)`
- **Retorna**: Ofertas feitas pelo usuário
- **Histórico**: Últimas 50 ofertas
- **Status**: Acompanha aceitação/recusa

### 7. 📝 Listagem com Tempo de Expiração
- **Implementado**: Campo de duração ao listar terreno
- **Configuração**:
  - Seletor de dias (1 a 30 dias)
  - Padrão: 7 dias
- **Funcionalidade**:
  - Data de expiração calculada automaticamente
  - Salva `expiresAt` na listagem
  - Salva `listingExpiresAt` no terreno
- **Benefício**: Evita listagens esquecidas

### 8. 🎮 Melhorias na UI/UX

#### Painel de Controles
- **Layout**: Grid responsivo 3 colunas
- **Seções**:
  1. Controles de Zoom
  2. Filtro de Disponibilidade
  3. Filtro de Raridade
- **Design**: Background cinza escuro, bem organizado

#### Canvas Interativo
- **Eventos de Mouse**:
  - `onMouseDown`: Inicia drag
  - `onMouseMove`: Movimenta
  - `onMouseUp`: Finaliza drag
  - `onMouseLeave`: Cancela drag se sair
  - `onWheel`: Controla zoom
- **Cursores Dinâmicos**:
  - `grab`: Mão aberta (hover)
  - `grabbing`: Mão fechada (arrastando)

#### Dicas de Uso
- **Texto informativo**: 
  - "Arraste para mover o mapa"
  - "Use a roda do mouse para dar zoom"
  - "Clique para ver detalhes"
- **Localização**: Abaixo do canvas
- **Estilo**: Texto cinza claro com ícone 💡

## 🔧 Funções do Firestore Adicionadas

```typescript
// Listar com duração
listLandForSale(landId, userId, price, description?, durationDays?)

// Fazer oferta
makeLandOffer(landId, listingId, buyerId, buyerUsername, offerAmount, message?)

// Aceitar oferta
acceptLandOffer(offerId, sellerId)

// Recusar oferta
rejectLandOffer(offerId, sellerId, reason?)

// Buscar ofertas do terreno
getLandOffers(landId)

// Buscar ofertas do usuário
getUserLandOffers(userId)

// Buscar ofertas recebidas
getSellerLandOffers(sellerId)
```

## 📊 Estrutura de Dados

### LandOffer (Nova Collection)
```typescript
{
  id: string;
  landId: string;
  listingId: string;
  buyerId: string;
  buyerUsername: string;
  sellerId: string;
  offerAmount: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  acceptedAt?: Timestamp;
  rejectedAt?: Timestamp;
  rejectionReason?: string;
}
```

### LandListing (Atualizado)
```typescript
{
  // ... campos existentes
  expiresAt: Timestamp;  // NOVO
}
```

### Land (Atualizado)
```typescript
{
  // ... campos existentes
  listingExpiresAt?: Timestamp;  // NOVO
}
```

## 🎯 Estados React Adicionados

```typescript
const [zoom, setZoom] = useState(1);                    // Zoom atual
const [rarityFilter, setRarityFilter] = useState(null); // Filtro de raridade
const [availableFilter, setAvailableFilter] = useState(false); // Filtro disponíveis
const [isDragging, setIsDragging] = useState(false);    // Estado de arrasto
const [dragStart, setDragStart] = useState({x:0, y:0}); // Posição inicial
const [showOfferModal, setShowOfferModal] = useState(false); // Modal de oferta
const [offerAmount, setOfferAmount] = useState(0);      // Valor da oferta
const [offerMessage, setOfferMessage] = useState('');   // Mensagem da oferta
const [listingDuration, setListingDuration] = useState(7); // Duração em dias
const [landOffers, setLandOffers] = useState([]);       // Ofertas do terreno
const [showOffersModal, setShowOffersModal] = useState(false); // Modal ofertas
```

## 🎨 Renderização Adaptativa ao Zoom

Todos os elementos são renderizados considerando o zoom:
- `cellSize = 35 * zoom`
- `fontSize = baseFontSize * zoom`
- `iconSize = baseIconSize * zoom`
- `borderWidth = baseWidth * zoom`
- `shadowBlur = baseShadow * zoom`

## 💡 Fluxo de Uso

### Comprar Terreno com Oferta
1. Usuario navega pelo mapa (arrasta/zoom)
2. Filtra por raridade desejada
3. Marca "apenas disponíveis"
4. Clica em terreno interessante
5. Vê preço e decide fazer oferta
6. Abre modal de oferta
7. Insere valor e mensagem
8. Envia oferta
9. Vendedor recebe notificação
10. Vendedor aceita/recusa
11. Se aceita, terreno é transferido

### Vender Terreno com Tempo
1. Usuario acessa "Meus Terrenos"
2. Seleciona terreno para vender
3. Clica "Colocar à Venda"
4. Insere preço
5. Define duração (1-30 dias)
6. Confirma listagem
7. Terreno aparece no marketplace
8. Após expirar, listagem é removida automaticamente

## 🚀 Benefícios

### Para o Jogador
- ✅ Navegação fluida e intuitiva
- ✅ Encontrar terrenos mais fácil
- ✅ Negociar valores
- ✅ Controle total sobre listagens
- ✅ Visão clara do mapa

### Para o Jogo
- ✅ Economia mais dinâmica
- ✅ Menos listagens abandonadas
- ✅ Mais interação entre jogadores
- ✅ Sistema de negociação robusto
- ✅ UX profissional

## 🔮 Próximos Passos Sugeridos

1. **Histórico de Transações**: Ver ofertas aceitas/recusadas
2. **Notificações Push**: Alertas de ofertas recebidas
3. **Contra-Ofertas**: Vendedor pode sugerir novo preço
4. **Leilão**: Modo de venda por lances
5. **Favoritos**: Marcar terrenos de interesse
6. **Busca Avançada**: Filtrar por preço, tamanho, bônus
7. **Minimap**: Visão geral de todo o mapa 50x50
8. **Compartilhar**: Link direto para terreno específico

---

*Documento criado em: 16/10/2025*
*Versão: 2.0*
*Todas as funcionalidades testadas e prontas para produção*
