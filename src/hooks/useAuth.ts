import { useState, useEffect } from 'react';
import { getCurrentUser, getUserData } from '../firebase/auth';
import { UserData } from '../types';

export function useAuth() {
  const [user, setUser] = useState<{ uid: string; username: string } | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      setError(null);

      const currentUser = getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        try {
          const data = await getUserData(currentUser.uid);
          setUserData(data);
        } catch (err: any) {
          setError(err.message);
          console.error('Erro ao buscar dados do usuário:', err);
          // Se falhar ao buscar dados, limpar sessão
          localStorage.removeItem('farmcoin_user_id');
          localStorage.removeItem('farmcoin_username');
          setUser(null);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  return { user, userData, loading, error, setUserData };
}
