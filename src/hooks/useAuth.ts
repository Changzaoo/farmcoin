import { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase/config';
import { getUserData } from '../firebase/auth';
import { UserData } from '../types';

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(true);
      setError(null);

      if (firebaseUser) {
        try {
          const data = await getUserData(firebaseUser.uid);
          setUserData(data);
        } catch (err: any) {
          setError(err.message);
          console.error('Erro ao buscar dados do usuário:', err);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, userData, loading, error, setUserData };
}
