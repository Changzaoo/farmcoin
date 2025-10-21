import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { FarmCoinGame } from './components/Game/FarmCoinGame';
import { GameProvider } from './contexts/GameContext';
import { UserRole } from './types';
import { upgrades as upgradesData } from './data/upgrades';
// import './utils/devToolsProtection'; // Desabilitado temporariamente para debug

// Placeholder components - precisam ser implementados
const AdminPanel = () => <div>Admin Panel - To be implemented</div>;

function App() {
  console.log('🚀 App: Componente iniciando...');
  const { user, userData, loading, refresh } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  console.log('🚀 App: Estado atual -', { user, userData, loading, showLogin });

  // Aplicar proteções adicionais ao montar
  useEffect(() => {
    // Desabilitar console em produção
    if (process.env.NODE_ENV === 'production') {
      console.log = () => {};
      console.debug = () => {};
      console.info = () => {};
      console.warn = () => {};
    }
  }, []);

  if (loading) {
    console.log('⏳ App: Mostrando tela de carregamento...');
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mb-4"></div>
          <p className="text-white text-xl font-semibold">Carregando FarmCoin...</p>
        </div>
      </div>
    );
  }

  if (!user || !userData) {
    console.log('🔐 App: Mostrando tela de', showLogin ? 'login' : 'registro');
    return showLogin ? (
      <Login
        onSuccess={refresh}
        onSwitchToRegister={() => setShowLogin(false)}
      />
    ) : (
      <Register
        onSuccess={refresh}
        onSwitchToLogin={() => setShowLogin(true)}
      />
    );
  }

  const isAdmin = userData.role === UserRole.ADMIN;
  const isModerator = userData.role === UserRole.MODERATOR;
  const isSupport = userData.role === UserRole.SUPPORT;

  const canAccessAdmin = isAdmin || isModerator || isSupport;

  // Adicionar username ao gameState se não existir
  const gameStateWithUsername = {
    ...userData.gameState,
    username: userData.username
  };

  console.log('🎮 App: Renderizando FarmCoinGame com:', {
    uid: user.uid,
    username: userData.username,
    coins: gameStateWithUsername.coins,
    upgrades: userData.upgrades?.length
  });

  // Inicializar upgrades corretamente mesclando dados salvos com estrutura completa
  const initializedUpgrades = upgradesData.map(upgrade => {
    const savedUpgrade = userData.upgrades?.find((u: any) => u.id === upgrade.id);
    const count = savedUpgrade?.count || 0;
    
    return {
      ...upgrade,
      count,
      unlocked: true, // TODO: verificar requisitos para compostos
      cost: upgrade.baseCost * Math.pow(upgrade.costMultiplier, count),
      income: upgrade.baseIncome * Math.pow(upgrade.incomeMultiplier, count),
    };
  });

  // Preparar estado inicial para o GameProvider
  const initialState = {
    gameState: gameStateWithUsername,
    upgrades: initializedUpgrades,
  };

  return (
    <BrowserRouter>
      <GameProvider initialState={initialState}>
        <Routes>
          <Route path="/" element={<FarmCoinGame uid={user.uid} />} />
          {canAccessAdmin && (
            <Route path="/admin" element={<AdminPanel />} />
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </GameProvider>
    </BrowserRouter>
  );
}

export default App;
