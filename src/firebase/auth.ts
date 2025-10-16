import { doc, setDoc, getDoc, updateDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './config';
import { UserRole, UserData, GameState } from '../types';
import { createPasswordHash, generateSecureId } from '../utils/crypto';
import { upgrades as upgradesData } from '../data/upgrades';

// Upgrades iniciais - Todos começam com count 0
const initialUpgrades = upgradesData.map(u => ({
  id: u.id,
  count: 0
}));

/**
 * Verifica se um nome de usuário já existe
 */
async function usernameExists(username: string): Promise<boolean> {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('username', '==', username));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

/**
 * Registra um novo usuário (apenas com username e senha)
 */
export async function registerUser(
  username: string,
  password: string
): Promise<UserData> {
  try {
    // Validar nome de usuário
    if (username.length < 3) {
      throw new Error('Nome de usuário deve ter pelo menos 3 caracteres');
    }

    // Verificar se username já existe
    const exists = await usernameExists(username);
    if (exists) {
      throw new Error('Nome de usuário já está em uso');
    }

    // Gerar UID único para o usuário
    const uid = generateSecureId() + Date.now().toString();

    // Criar hash da senha com SHA-512
    const passwordHash = await createPasswordHash(password);

    // Estado inicial do jogo
    const initialGameState: GameState = {
      coins: 0,
      totalCoins: 0,
      perSecond: 0,
      totalClicks: 0,
      totalPurchases: 0,
    };

    // Dados do usuário
    const userData: UserData = {
      uid,
      username,
      role: UserRole.USER,
      createdAt: new Date(),
      lastLogin: new Date(),
      gameState: initialGameState,
      upgrades: initialUpgrades,
    };

    // Salvar no Firestore
    await setDoc(doc(db, 'users', uid), {
      ...userData,
      passwordHash,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });

    // Salvar sessão no localStorage
    localStorage.setItem('farmcoin_user_id', uid);
    localStorage.setItem('farmcoin_username', username);

    return userData;
  } catch (error: any) {
    throw new Error(`Erro ao registrar usuário: ${error.message}`);
  }
}

/**
 * Busca usuário por username e verifica senha
 */
async function findUserByUsername(username: string): Promise<{ uid: string; passwordHash: string } | null> {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('username', '==', username));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  const userDoc = querySnapshot.docs[0];
  const data = userDoc.data();
  return {
    uid: userDoc.id,
    passwordHash: data.passwordHash
  };
}

/**
 * Faz login do usuário (apenas com username e senha)
 */
export async function loginUser(
  username: string,
  password: string
): Promise<UserData> {
  try {
    // Buscar usuário pelo username
    const userInfo = await findUserByUsername(username);
    
    if (!userInfo) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar senha
    const { verifyPasswordHash } = await import('../utils/crypto');
    const isValid = await verifyPasswordHash(password, userInfo.passwordHash);
    
    if (!isValid) {
      throw new Error('Senha incorreta');
    }

    // Atualizar último login
    await updateDoc(doc(db, 'users', userInfo.uid), {
      lastLogin: serverTimestamp(),
    });

    // Salvar sessão no localStorage
    localStorage.setItem('farmcoin_user_id', userInfo.uid);
    localStorage.setItem('farmcoin_username', username);

    // Buscar dados do usuário
    const userData = await getUserData(userInfo.uid);
    return userData;
  } catch (error: any) {
    throw new Error(`Erro ao fazer login: ${error.message}`);
  }
}

/**
 * Faz logout do usuário
 */
export async function signOut(): Promise<void> {
  try {
    // Limpar sessão do localStorage
    localStorage.removeItem('farmcoin_user_id');
    localStorage.removeItem('farmcoin_username');
  } catch (error: any) {
    throw new Error(`Erro ao fazer logout: ${error.message}`);
  }
}

/**
 * Obtém dados do usuário do Firestore
 */
export async function getUserData(uid: string): Promise<UserData> {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Garantir que gameState sempre tenha valores válidos
      const gameState = data.gameState || {
        coins: 0,
        totalCoins: 0,
        perSecond: 0,
        totalClicks: 0,
        totalPurchases: 0,
      };
      
      // Garantir que upgrades sempre exista
      const upgrades = data.upgrades || [];
      
      const compositeCount = upgrades.filter((u: any) => u.count > 0 && u.id.includes('composite')).length;
      const chainCount = upgrades.filter((u: any) => u.count > 0 && u.id.includes('chain')).length;
      const landCount = upgrades.filter((u: any) => u.count > 0 && u.id.includes('land')).length;
      
      console.log('📥 Dados carregados do Firestore:', {
        uid: data.uid,
        username: data.username,
        coins: gameState.coins,
        upgradesCount: upgrades.length,
        upgradesWithCount: upgrades.filter((u: any) => u.count > 0).length,
        compositeUpgrades: compositeCount,
        chainUpgrades: chainCount,
        landUpgrades: landCount
      });
      
      return {
        uid: data.uid,
        username: data.username,
        role: data.role,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastLogin: data.lastLogin?.toDate() || new Date(),
        gameState: gameState,
        upgrades: upgrades,
      };
    } else {
      throw new Error('Usuário não encontrado');
    }
  } catch (error: any) {
    throw new Error(`Erro ao buscar dados do usuário: ${error.message}`);
  }
}

/**
 * Obtém o usuário atual autenticado
 */
export function getCurrentUser(): { uid: string; username: string } | null {
  const uid = localStorage.getItem('farmcoin_user_id');
  const username = localStorage.getItem('farmcoin_username');
  
  if (uid && username) {
    return { uid, username };
  }
  
  return null;
}

/**
 * Verifica se há um usuário logado
 */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
