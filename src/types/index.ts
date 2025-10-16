// Tipos de permissão de usuário
export enum UserRole {
  ADMIN = 0,
  MODERATOR = 1,
  SUPPORT = 2,
  USER = 3
}

// Interface de usuário
export interface User {
  uid: string;
  username: string;
  role: UserRole;
  createdAt: Date;
  lastLogin: Date;
  passwordHash: string;
}

// Estado do jogo
export interface GameState {
  coins: number;
  totalCoins: number;
  perSecond: number;
  totalClicks: number;
  totalPurchases: number;
  username?: string;
  upgrades?: Array<{ id: string; count: number }>;
}

// Tier de upgrade (baseado no custo)
export enum UpgradeTier {
  COMUM = 'comum',           // 0 - 1K moedas
  INCOMUM = 'incomum',       // 1K - 100K moedas
  RARO = 'raro',             // 100K - 10M moedas
  EPICO = 'epico',           // 10M - 1B moedas
  LENDARIO = 'lendario',     // 1B - 100B moedas
  MITICO = 'mitico'          // 100B+ moedas
}

// Requisito para upgrade composto
export interface UpgradeRequirement {
  upgradeId: string;
  minCount: number;
}

// Upgrade
export interface Upgrade {
  id: string;
  name: string;
  description: string;
  category: string;
  baseCost: number;
  costMultiplier: number;
  baseIncome: number;
  incomeMultiplier: number;
  icon: string;
  tier?: UpgradeTier;
  isComposite?: boolean;           // Se é upgrade composto
  requirements?: UpgradeRequirement[];  // Requisitos para desbloquear
  unlocked?: boolean;              // Se está desbloqueado
  count?: number;
  cost?: number;
  income?: number;
}

// Pacote de moedas
export interface CoinPackage {
  id: string;
  amount: number;
  price: number;
  bonus: number;
}

// Tipo de log de ação
export enum LogType {
  CLICK = 'click',
  PURCHASE_UPGRADE = 'purchase_upgrade',
  PURCHASE_COINS = 'purchase_coins',
  PASSIVE_INCOME = 'passive_income',
  LOGIN = 'login',
  REGISTER = 'register'
}

// Log de ação do usuário
export interface UserLog {
  id: string;
  userId: string;
  type: LogType;
  amount: number;
  description: string;
  metadata?: {
    upgradeId?: string;
    upgradeName?: string;
    upgradeCount?: number;
    packageId?: string;
    balanceBefore?: number;
    balanceAfter?: number;
    [key: string]: any;
  };
  timestamp: Date;
}

// Dados do usuário no Firestore
export interface UserData {
  uid: string;
  username: string;
  role: UserRole;
  createdAt: Date;
  lastLogin: Date;
  gameState: GameState;
  upgrades?: Array<{ id: string; count: number }>;
}

// Estatísticas do usuário para admin
export interface UserStats {
  user: UserData;
  logs: UserLog[];
  totalLogs: number;
  totalClicks: number;
  totalPurchases: number;
  totalPassiveIncome: number;
}

// Tipo de oferta no Marketplace
export enum OfferStatus {
  PENDING = 'pending',     // Aguardando aprovação do vendedor
  ACCEPTED = 'accepted',   // Aceita pelo vendedor
  REJECTED = 'rejected',   // Rejeitada pelo vendedor
  EXPIRED = 'expired',     // Expirou o tempo
  CANCELLED = 'cancelled'  // Cancelada pelo comprador
}

// Oferta de compra no Marketplace
export interface MarketplaceOffer {
  id: string;
  listingId: string;
  buyerId: string;
  buyerUsername: string;
  offerPrice: number;
  message?: string;
  expiresAt?: Date;
  status: OfferStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Listagem no Marketplace
export interface MarketplaceListing {
  id: string;
  sellerId: string;
  sellerUsername: string;
  upgradeId: string;
  upgradeName: string;
  upgradeIcon: string;
  upgradeTier?: UpgradeTier;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  incomePerUnit: number;
  totalIncome: number;
  originalCost: number;
  description?: string;
  acceptOffers: boolean;
  minOfferPrice?: number;
  expiresAt?: Date;
  status: 'active' | 'sold' | 'cancelled' | 'expired';
  createdAt: Date;
  updatedAt: Date;
  offers?: MarketplaceOffer[];
}

// Filtros da loja
export interface ShopFilters {
  category: string;
  searchTerm: string;
  tier?: UpgradeTier;
  minPrice?: number;
  maxPrice?: number;
  minIncome?: number;
  maxIncome?: number;
  sortBy: 'name' | 'price' | 'income' | 'tier';
  sortOrder: 'asc' | 'desc';
}

// ============= SISTEMA DE TERRENOS =============

// Tipo de terreno
export enum LandType {
  PLAINS = 'plains',         // Planície - comum
  FOREST = 'forest',         // Floresta - incomum
  HILLS = 'hills',           // Colinas - incomum
  MOUNTAINS = 'mountains',   // Montanhas - raro
  DESERT = 'desert',         // Deserto - raro
  SWAMP = 'swamp',          // Pântano - raro
  BEACH = 'beach',          // Praia - épico
  VOLCANO = 'volcano',      // Vulcão - lendário
  GLACIER = 'glacier',      // Geleira - lendário
  PARADISE = 'paradise'     // Paraíso - mítico
}

// Morador de um terreno
export interface LandResident {
  userId: string;
  username: string;
  addedAt: Date;
  permissions: {
    canBuild: boolean;
    canInvite: boolean;
  };
}

// Coordenadas do terreno
export interface LandCoordinates {
  x: number;
  y: number;
  region: string; // Ex: "north", "south", "east", "west", "center"
}

// Terreno
export interface Land {
  id: string;
  coordinates: LandCoordinates;
  type: LandType;
  name?: string;
  description?: string;
  
  // Propriedade
  ownerId: string | null;
  ownerUsername: string | null;
  purchasedAt?: Date;
  purchasePrice?: number;
  
  // Moradores (máximo 100)
  residents: LandResident[];
  maxResidents: number; // Padrão: 100
  
  // Características do terreno
  size: number; // Tamanho em unidades (1-10)
  bonusIncome: number; // Bônus de renda passiva (%)
  
  // Marketplace
  forSale: boolean;
  salePrice?: number;
  listedAt?: Date;
  
  // Metadados
  createdAt: Date;
  updatedAt: Date;
}

// Listagem de terreno no Marketplace
export interface LandListing {
  id: string;
  landId: string;
  land: Land;
  sellerId: string;
  sellerUsername: string;
  price: number;
  description?: string;
  status: 'active' | 'sold' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Configuração do mapa
export interface MapConfig {
  width: number;  // Largura em terrenos
  height: number; // Altura em terrenos
  totalLands: number;
  regions: {
    name: string;
    bounds: { minX: number; maxX: number; minY: number; maxY: number };
    landTypes: LandType[];
  }[];
}

