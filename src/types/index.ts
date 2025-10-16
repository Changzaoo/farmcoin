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
}

// Upgrade
export interface Upgrade {
  id: string;
  name: string;
  cost: number;
  income: number;
  count: number;
  icon: string;
  category: string;
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
  upgrades: Upgrade[];
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
