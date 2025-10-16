import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { UserData, UserLog, LogType, GameState, Upgrade } from '../types';

/**
 * Salva o estado do jogo do usuário
 */
export async function saveGameState(
  userId: string,
  gameState: GameState,
  upgrades: Upgrade[]
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      gameState,
      upgrades,
      lastUpdated: serverTimestamp(),
    });
  } catch (error: any) {
    throw new Error(`Erro ao salvar estado do jogo: ${error.message}`);
  }
}

/**
 * Registra uma ação do usuário
 */
export async function logUserAction(log: Omit<UserLog, 'id' | 'timestamp'>): Promise<void> {
  try {
    await addDoc(collection(db, 'logs'), {
      ...log,
      timestamp: serverTimestamp(),
    });
  } catch (error: any) {
    console.error('Erro ao registrar log:', error);
  }
}

/**
 * Busca logs de um usuário
 */
export async function getUserLogs(
  userId: string,
  limitCount: number = 100
): Promise<UserLog[]> {
  try {
    const logsQuery = query(
      collection(db, 'logs'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(logsQuery);
    const logs: UserLog[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      logs.push({
        id: doc.id,
        userId: data.userId,
        type: data.type,
        amount: data.amount,
        description: data.description,
        metadata: data.metadata,
        timestamp: (data.timestamp as Timestamp)?.toDate() || new Date(),
      });
    });

    return logs;
  } catch (error: any) {
    throw new Error(`Erro ao buscar logs: ${error.message}`);
  }
}

/**
 * Busca todos os usuários (apenas para admin/moderador/suporte)
 */
export async function getAllUsers(): Promise<UserData[]> {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users: UserData[] = [];

    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        uid: data.uid,
        username: data.username,
        role: data.role,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        lastLogin: (data.lastLogin as Timestamp)?.toDate() || new Date(),
        gameState: data.gameState,
        upgrades: data.upgrades,
      });
    });

    return users;
  } catch (error: any) {
    throw new Error(`Erro ao buscar usuários: ${error.message}`);
  }
}

/**
 * Busca estatísticas de um usuário (para admin/moderador/suporte)
 */
export async function getUserStats(userId: string) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('Usuário não encontrado');
    }

    const userData = userDoc.data() as UserData;
    const logs = await getUserLogs(userId, 1000);

    const totalClicks = logs.filter(log => log.type === LogType.CLICK).length;
    const totalPurchases = logs.filter(log => log.type === LogType.PURCHASE_UPGRADE).length;
    const totalPassiveIncome = logs
      .filter(log => log.type === LogType.PASSIVE_INCOME)
      .reduce((sum, log) => sum + log.amount, 0);

    return {
      user: userData,
      logs,
      totalLogs: logs.length,
      totalClicks,
      totalPurchases,
      totalPassiveIncome,
    };
  } catch (error: any) {
    throw new Error(`Erro ao buscar estatísticas: ${error.message}`);
  }
}

/**
 * Atualiza a role de um usuário (apenas para admin)
 */
export async function updateUserRole(userId: string, newRole: number): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: newRole,
    });
  } catch (error: any) {
    throw new Error(`Erro ao atualizar role: ${error.message}`);
  }
}
