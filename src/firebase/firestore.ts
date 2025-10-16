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
  deleteDoc,
} from 'firebase/firestore';
import { db } from './config';
import { UserData, UserLog, LogType, GameState, Upgrade, MarketplaceListing, MarketplaceOffer, OfferStatus } from '../types';

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

// ==================== MARKETPLACE ====================

/**
 * Cria uma listagem no Marketplace
 */
export async function createMarketplaceListing(listing: Omit<MarketplaceListing, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'marketplace'), {
      ...listing,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(`Erro ao criar listagem: ${error.message}`);
  }
}

/**
 * Busca listagens ativas do Marketplace
 */
export async function getMarketplaceListings(limitCount: number = 50): Promise<MarketplaceListing[]> {
  try {
    const q = query(
      collection(db, 'marketplace'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const listings: MarketplaceListing[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      listings.push({
        id: doc.id,
        sellerId: data.sellerId,
        sellerUsername: data.sellerUsername,
        upgradeId: data.upgradeId,
        upgradeName: data.upgradeName,
        upgradeIcon: data.upgradeIcon,
        upgradeTier: data.upgradeTier,
        quantity: data.quantity,
        pricePerUnit: data.pricePerUnit,
        totalPrice: data.totalPrice,
        incomePerUnit: data.incomePerUnit,
        totalIncome: data.totalIncome,
        originalCost: data.originalCost,
        description: data.description,
        acceptOffers: data.acceptOffers,
        minOfferPrice: data.minOfferPrice,
        expiresAt: data.expiresAt ? (data.expiresAt as Timestamp).toDate() : undefined,
        status: data.status,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
      });
    });

    return listings;
  } catch (error: any) {
    throw new Error(`Erro ao buscar listagens: ${error.message}`);
  }
}

/**
 * Compra uma listagem do Marketplace
 */
export async function purchaseMarketplaceListing(
  listingId: string,
  buyerId: string,
  buyerUsername: string,
  buyerCoins: number
): Promise<void> {
  try {
    const listingRef = doc(db, 'marketplace', listingId);
    const listingSnap = await getDoc(listingRef);

    if (!listingSnap.exists()) {
      throw new Error('Listagem não encontrada');
    }

    const listing = listingSnap.data() as MarketplaceListing;

    if (listing.status !== 'active') {
      throw new Error('Listagem não está mais ativa');
    }

    if (buyerCoins < listing.totalPrice) {
      throw new Error('Moedas insuficientes');
    }

    if (listing.sellerId === buyerId) {
      throw new Error('Você não pode comprar seu próprio item');
    }

    // Atualizar listagem
    await updateDoc(listingRef, {
      status: 'sold',
      updatedAt: serverTimestamp(),
    });

    // Registrar transação
    await addDoc(collection(db, 'transactions'), {
      listingId,
      sellerId: listing.sellerId,
      sellerUsername: listing.sellerUsername,
      buyerId,
      buyerUsername,
      upgradeId: listing.upgradeId,
      upgradeName: listing.upgradeName,
      quantity: listing.quantity,
      totalPrice: listing.totalPrice,
      timestamp: serverTimestamp(),
    });
  } catch (error: any) {
    throw new Error(`Erro ao comprar listagem: ${error.message}`);
  }
}

/**
 * Cria uma oferta para uma listagem
 */
export async function createMarketplaceOffer(offer: Omit<MarketplaceOffer, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'marketplace_offers'), {
      ...offer,
      status: OfferStatus.PENDING,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(`Erro ao criar oferta: ${error.message}`);
  }
}

/**
 * Busca ofertas de uma listagem
 */
export async function getListingOffers(listingId: string): Promise<MarketplaceOffer[]> {
  try {
    const q = query(
      collection(db, 'marketplace_offers'),
      where('listingId', '==', listingId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const offers: MarketplaceOffer[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      offers.push({
        id: doc.id,
        listingId: data.listingId,
        buyerId: data.buyerId,
        buyerUsername: data.buyerUsername,
        offerPrice: data.offerPrice,
        message: data.message,
        expiresAt: data.expiresAt ? (data.expiresAt as Timestamp).toDate() : undefined,
        status: data.status,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
      });
    });

    return offers;
  } catch (error: any) {
    throw new Error(`Erro ao buscar ofertas: ${error.message}`);
  }
}

/**
 * Aceita uma oferta
 */
export async function acceptMarketplaceOffer(offerId: string, listingId: string): Promise<void> {
  try {
    const offerRef = doc(db, 'marketplace_offers', offerId);
    await updateDoc(offerRef, {
      status: OfferStatus.ACCEPTED,
      updatedAt: serverTimestamp(),
    });

    const listingRef = doc(db, 'marketplace', listingId);
    await updateDoc(listingRef, {
      status: 'sold',
      updatedAt: serverTimestamp(),
    });
  } catch (error: any) {
    throw new Error(`Erro ao aceitar oferta: ${error.message}`);
  }
}

/**
 * Cancela uma listagem
 */
export async function cancelMarketplaceListing(listingId: string): Promise<void> {
  try {
    const listingRef = doc(db, 'marketplace', listingId);
    await updateDoc(listingRef, {
      status: 'cancelled',
      updatedAt: serverTimestamp(),
    });
  } catch (error: any) {
    throw new Error(`Erro ao cancelar listagem: ${error.message}`);
  }
}
