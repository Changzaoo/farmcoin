import { useEffect, useRef, useState, useCallback } from 'react';
import { GameState, Upgrade } from '../types';
import { saveGameState } from '../firebase/firestore';

export type SaveStatus = 'idle' | 'pending' | 'saving' | 'error';

/**
 * Hook inteligente de auto-save com debounce
 * Só salva se houver mudanças significativas
 */
export const useAutoSave = (
  uid: string,
  gameState: GameState,
  upgrades: Upgrade[],
  interval: number = 5000 // 5 segundos de debounce
) => {
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSaveDataRef = useRef<string>('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaveTime, setLastSaveTime] = useState<number>(Date.now());

  // Função para salvar imediatamente (força save)
  const forceSave = useCallback(async () => {
    try {
      setSaveStatus('saving');
      await saveGameState(uid, gameState, upgrades);
      
      // Atualizar referência do último save
      lastSaveDataRef.current = JSON.stringify({
        coins: Math.floor(gameState.coins),
        perSecond: gameState.perSecond,
        upgrades: upgrades.map(u => ({ id: u.id, count: u.count })),
      });
      
      setLastSaveTime(Date.now());
      setSaveStatus('idle');
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
      setSaveStatus('error');
    }
  }, [uid, gameState, upgrades]);

  useEffect(() => {
    // Serializar dados para comparação
    const currentData = JSON.stringify({
      coins: Math.floor(gameState.coins), // Arredondar para evitar saves por centavos
      perSecond: gameState.perSecond,
      upgrades: upgrades.filter(u => (u.count || 0) > 0).map(u => ({ id: u.id, count: u.count })),
    });

    // Só salvar se houve mudanças significativas
    if (currentData === lastSaveDataRef.current) {
      return;
    }

    setSaveStatus('pending');

    // Limpar timeout anterior
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Agendar novo save
    saveTimeoutRef.current = setTimeout(async () => {
      await forceSave();
    }, interval);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [gameState.coins, gameState.perSecond, upgrades, interval, forceSave]);

  // Force save ao desmontar (usuário saindo do jogo)
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      // Save síncrono na desmontagem
      saveGameState(uid, gameState, upgrades).catch(console.error);
    };
  }, []); // Apenas na desmontagem

  return { 
    saveStatus, 
    lastSaveTime, 
    forceSave 
  };
};
