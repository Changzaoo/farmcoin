import { createContext, useContext, useReducer, useMemo, useCallback, ReactNode } from 'react';
import { GameState, Upgrade } from '../types';

// Estado do contexto
interface GameContextState {
  gameState: GameState;
  upgrades: Upgrade[];
}

// Actions do reducer
type GameAction =
  | { type: 'ADD_COINS'; payload: number }
  | { type: 'SUBTRACT_COINS'; payload: number }
  | { type: 'ADD_CLICK' }
  | { type: 'BUY_UPGRADE'; payload: string }
  | { type: 'SET_PASSIVE_INCOME'; payload: number }
  | { type: 'SET_UPGRADES'; payload: Upgrade[] }
  | { type: 'UPDATE_UPGRADE'; payload: { id: string; upgrade: Partial<Upgrade> } }
  | { type: 'LOAD_GAME_STATE'; payload: { gameState: GameState; upgrades: Upgrade[] } }
  | { type: 'PRESTIGE'; payload: { prestigePoints: number; timestamp: number } }
  | { type: 'RESET_GAME' };

// Reducer
const gameReducer = (state: GameContextState, action: GameAction): GameContextState => {
  switch (action.type) {
    case 'ADD_COINS':
      return {
        ...state,
        gameState: {
          ...state.gameState,
          coins: state.gameState.coins + action.payload,
          totalCoins: state.gameState.totalCoins + action.payload,
        }
      };

    case 'SUBTRACT_COINS':
      return {
        ...state,
        gameState: {
          ...state.gameState,
          coins: Math.max(0, state.gameState.coins - action.payload),
        }
      };

    case 'ADD_CLICK':
      return {
        ...state,
        gameState: {
          ...state.gameState,
          totalClicks: state.gameState.totalClicks + 1,
        }
      };

    case 'BUY_UPGRADE': {
      const upgrade = state.upgrades.find(u => u.id === action.payload);
      if (!upgrade || state.gameState.coins < (upgrade.cost || 0)) return state;

      return {
        ...state,
        gameState: {
          ...state.gameState,
          coins: state.gameState.coins - (upgrade.cost || 0),
          totalPurchases: state.gameState.totalPurchases + 1,
        },
        upgrades: state.upgrades.map(u =>
          u.id === action.payload
            ? {
                ...u,
                count: (u.count || 0) + 1,
                cost: u.baseCost * Math.pow(u.costMultiplier, (u.count || 0) + 1),
                income: u.baseIncome * Math.pow(u.incomeMultiplier, (u.count || 0) + 1),
              }
            : u
        ),
      };
    }

    case 'SET_PASSIVE_INCOME':
      return {
        ...state,
        gameState: {
          ...state.gameState,
          perSecond: action.payload,
        }
      };

    case 'SET_UPGRADES':
      return {
        ...state,
        upgrades: action.payload,
      };

    case 'UPDATE_UPGRADE':
      return {
        ...state,
        upgrades: state.upgrades.map(u =>
          u.id === action.payload.id
            ? { ...u, ...action.payload.upgrade }
            : u
        ),
      };

    case 'LOAD_GAME_STATE':
      return {
        gameState: action.payload.gameState,
        upgrades: action.payload.upgrades,
      };

    case 'PRESTIGE':
      // Reset do jogo mantendo prestige points
      return {
        gameState: {
          coins: 0,
          totalCoins: state.gameState.totalCoins,
          perSecond: 0,
          totalClicks: 0,
          totalPurchases: 0,
          username: state.gameState.username,
        },
        upgrades: state.upgrades.map(u => ({
          ...u,
          count: 0,
          cost: u.baseCost,
          income: u.baseIncome,
        })),
      };

    case 'RESET_GAME':
      // Reset completo do jogo (para debug)
      return {
        gameState: {
          coins: 0,
          totalCoins: 0,
          perSecond: 0,
          totalClicks: 0,
          totalPurchases: 0,
          username: state.gameState.username,
        },
        upgrades: state.upgrades.map(u => ({
          ...u,
          count: 0,
          cost: u.baseCost,
          income: u.baseIncome,
        })),
      };

    default:
      return state;
  }
};

// Valor do contexto
interface GameContextValue {
  state: GameContextState;
  dispatch: React.Dispatch<GameAction>;
  // Computed values
  canAfford: (upgradeId: string) => boolean;
  passiveIncome: number;
  totalUpgrades: number;
  addCoins: (amount: number) => void;
  subtractCoins: (amount: number) => void;
  buyUpgrade: (upgradeId: string) => boolean;
  addClick: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

interface GameProviderProps {
  children: ReactNode;
  initialState: GameContextState;
}

export const GameProvider = ({ children, initialState }: GameProviderProps) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Computed: Renda passiva total
  const passiveIncome = useMemo(() =>
    state.upgrades.reduce((sum, u) => sum + ((u.income || 0) * (u.count || 0)), 0),
    [state.upgrades]
  );

  // Computed: Total de upgrades possuídos
  const totalUpgrades = useMemo(() =>
    state.upgrades.filter(u => (u.count || 0) > 0).length,
    [state.upgrades]
  );

  // Helper: Verificar se pode comprar
  const canAfford = useCallback((upgradeId: string) => {
    const upgrade = state.upgrades.find(u => u.id === upgradeId);
    return !!upgrade && state.gameState.coins >= (upgrade.cost || 0);
  }, [state.gameState.coins, state.upgrades]);

  // Helper: Adicionar moedas
  const addCoins = useCallback((amount: number) => {
    dispatch({ type: 'ADD_COINS', payload: amount });
  }, []);

  // Helper: Subtrair moedas
  const subtractCoins = useCallback((amount: number) => {
    dispatch({ type: 'SUBTRACT_COINS', payload: amount });
  }, []);

  // Helper: Comprar upgrade
  const buyUpgrade = useCallback((upgradeId: string): boolean => {
    if (!canAfford(upgradeId)) return false;
    dispatch({ type: 'BUY_UPGRADE', payload: upgradeId });
    return true;
  }, [canAfford]);

  // Helper: Adicionar click
  const addClick = useCallback(() => {
    dispatch({ type: 'ADD_CLICK' });
  }, []);

  // Atualizar renda passiva quando upgrades mudarem
  useMemo(() => {
    dispatch({ type: 'SET_PASSIVE_INCOME', payload: passiveIncome });
  }, [passiveIncome]);

  const value = useMemo(() => ({
    state,
    dispatch,
    canAfford,
    passiveIncome,
    totalUpgrades,
    addCoins,
    subtractCoins,
    buyUpgrade,
    addClick,
  }), [state, canAfford, passiveIncome, totalUpgrades, addCoins, subtractCoins, buyUpgrade, addClick]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
