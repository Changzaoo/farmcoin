import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { UserRole, UserData, GameState, Upgrade } from '../types';
import { createPasswordHash } from '../utils/crypto';

// Upgrades iniciais
const initialUpgrades: Upgrade[] = [
  // Plantações
  { id: 'semente', name: 'Semente', cost: 3, income: 0.03, count: 0, icon: '🌱', category: 'plantacoes' },
  { id: 'trigo', name: 'Trigo', cost: 5, income: 0.05, count: 0, icon: '🌾', category: 'plantacoes' },
  { id: 'milho', name: 'Milho', cost: 15, income: 0.15, count: 0, icon: '🌽', category: 'plantacoes' },
  { id: 'tomate', name: 'Tomate', cost: 40, income: 0.4, count: 0, icon: '🍅', category: 'plantacoes' },
  { id: 'melancia', name: 'Melancia', cost: 100, income: 1, count: 0, icon: '🍉', category: 'plantacoes' },
  { id: 'abobora', name: 'Abóbora', cost: 300, income: 3, count: 0, icon: '🎃', category: 'plantacoes' },
  { id: 'morango', name: 'Morango', cost: 80, income: 0.8, count: 0, icon: '🍓', category: 'plantacoes' },
  { id: 'uva', name: 'Uva', cost: 120, income: 1.2, count: 0, icon: '🍇', category: 'plantacoes' },
  { id: 'maca', name: 'Maçã', cost: 150, income: 1.5, count: 0, icon: '🍎', category: 'plantacoes' },
  { id: 'banana', name: 'Banana', cost: 200, income: 2, count: 0, icon: '🍌', category: 'plantacoes' },
  { id: 'abacaxi', name: 'Abacaxi', cost: 250, income: 2.5, count: 0, icon: '🍍', category: 'plantacoes' },
  { id: 'coco', name: 'Coco', cost: 180, income: 1.8, count: 0, icon: '🥥', category: 'plantacoes' },

  // Animais (continuando com todos os outros...)
  { id: 'passaro', name: 'Pássaro', cost: 8, income: 0.08, count: 0, icon: '🦜', category: 'animais' },
  { id: 'galinha', name: 'Galinha', cost: 20, income: 0.2, count: 0, icon: '🐔', category: 'animais' },
  { id: 'vaca', name: 'Vaca', cost: 75, income: 0.75, count: 0, icon: '🐄', category: 'animais' },
  // ... adicionar todos os outros upgrades aqui
];

/**
 * Registra um novo usuário
 */
export async function registerUser(
  email: string,
  password: string,
  username: string
): Promise<UserData> {
  try {
    // Criar usuário no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

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
      uid: user.uid,
      email: user.email!,
      username,
      role: UserRole.USER,
      createdAt: new Date(),
      lastLogin: new Date(),
      gameState: initialGameState,
      upgrades: initialUpgrades,
    };

    // Salvar no Firestore
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      passwordHash,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });

    return userData;
  } catch (error: any) {
    throw new Error(`Erro ao registrar usuário: ${error.message}`);
  }
}

/**
 * Faz login do usuário
 */
export async function loginUser(
  email: string,
  password: string
): Promise<UserData> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Atualizar último login
    await updateDoc(doc(db, 'users', user.uid), {
      lastLogin: serverTimestamp(),
    });

    // Buscar dados do usuário
    const userData = await getUserData(user.uid);
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
    await firebaseSignOut(auth);
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
      return {
        uid: data.uid,
        email: data.email,
        username: data.username,
        role: data.role,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastLogin: data.lastLogin?.toDate() || new Date(),
        gameState: data.gameState,
        upgrades: data.upgrades,
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
export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}
