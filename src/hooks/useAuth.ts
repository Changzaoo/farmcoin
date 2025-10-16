import { useState, useEffect } from 'react';
import { getCurrentUser, getUserData } from '../firebase/auth';
import { UserData } from '../types';

export function useAuth() {
  const [user, setUser] = useState<{ uid: string; username: string } | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey(prev => prev + 1);

  useEffect(() => {
    const loadUser = async () => {
      console.log('🔍 useAuth: Iniciando loadUser...');
      setLoading(true);
      setError(null);

      const currentUser = getCurrentUser();
      console.log('🔍 useAuth: currentUser =', currentUser);
      setUser(currentUser);

      if (currentUser) {
        try {
          console.log('🔍 useAuth: Buscando userData para uid:', currentUser.uid);
          const data = await getUserData(currentUser.uid);
          console.log('🔍 useAuth: userData recebido:', data);
          setUserData(data);
        } catch (err: any) {
          console.error('❌ useAuth: Erro ao buscar dados:', err);
          setError(err.message);
          console.error('Erro ao buscar dados do usuário:', err);
          // Se falhar ao buscar dados, limpar sessão
          localStorage.removeItem('farmcoin_user_id');
          localStorage.removeItem('farmcoin_username');
          setUser(null);
        }
      } else {
        console.log('🔍 useAuth: Nenhum usuário logado');
        setUserData(null);
      }

      setLoading(false);
      console.log('🔍 useAuth: loadUser finalizado');
    };

    loadUser();
  }, [refreshKey]);

  return { user, userData, loading, error, setUserData, refresh };
}
