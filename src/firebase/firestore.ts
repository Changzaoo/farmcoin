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
  writeBatch,
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from './config';
import { 
  UserData, 
  UserLog, 
  LogType, 
  GameState, 
  Upgrade, 
  MarketplaceListing, 
  MarketplaceOffer, 
  OfferStatus,
  Land,
  LandType,
  LandListing,
  LandResident,
  Guild,
  GuildMember,
  UpgradeTier
} from '../types';

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
    
    // Calcular quantidade de upgrades possuídos
    const upgradesOwned = upgrades.filter(u => (u.count || 0) > 0).length;
    
    // 🐛 DEBUG: Filtrar apenas os dados essenciais para salvar (remover funções e objetos complexos)
    const upgradesClean = upgrades.map(u => ({
      id: u.id,
      count: u.count || 0,
      cost: u.cost,
      income: u.income,
      unlocked: u.unlocked
    }));
    
    const compositeCount = upgradesClean.filter(u => u.count > 0 && u.id.includes('composite')).length;
    const chainCount = upgradesClean.filter(u => u.count > 0 && u.id.includes('chain')).length;
    const landCount = upgradesClean.filter(u => u.count > 0 && u.id.includes('land')).length;
    
    console.log('💾 Salvando no Firestore:', {
      userId,
      coins: gameState.coins,
      perSecond: gameState.perSecond,
      upgradesOwned,
      upgradesTotal: upgrades.length,
      compositeUpgrades: compositeCount,
      chainUpgrades: chainCount,
      landUpgrades: landCount
    });
    
    await updateDoc(userRef, {
      gameState,
      upgrades: upgradesClean,
      coins: gameState.coins,
      perSecond: gameState.perSecond,
      upgradesOwned,
      username: gameState.username,
      lastUpdated: serverTimestamp(),
    });
    
    console.log('✅ Dados salvos com sucesso!');
  } catch (error: any) {
    console.error('❌ Erro ao salvar:', error);
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

// ============= FUNÇÕES DE TERRENOS =============

/**
 * Inicializa o mapa com terrenos (executar apenas uma vez)
 */
export async function initializeLands(): Promise<void> {
  try {
    const batch = writeBatch(db);
    const mapWidth = 50; // 50x50 = 2500 terrenos
    const mapHeight = 50;
    
    for (let x = 0; x < mapWidth; x++) {
      for (let y = 0; y < mapHeight; y++) {
        const landId = `land_${x}_${y}`;
        const landRef = doc(db, 'lands', landId);
        
        // Determinar região
        let region = 'center';
        if (y < 15) region = 'north';
        else if (y > 35) region = 'south';
        else if (x < 15) region = 'west';
        else if (x > 35) region = 'east';
        
        // Determinar tipo de terreno baseado em posição
        let type: LandType;
        const random = (x * y) % 100;
        if (random < 40) type = LandType.PLAINS;
        else if (random < 60) type = LandType.FOREST;
        else if (random < 75) type = LandType.HILLS;
        else if (random < 85) type = LandType.DESERT;
        else if (random < 92) type = LandType.MOUNTAINS;
        else if (random < 96) type = LandType.SWAMP;
        else if (random < 98) type = LandType.BEACH;
        else if (random < 99) type = LandType.VOLCANO;
        else if (random < 99.5) type = LandType.GLACIER;
        else type = LandType.PARADISE;
        
        // Bônus de renda baseado no tipo
        const bonuses: Record<LandType, number> = {
          [LandType.PLAINS]: 5,
          [LandType.FOREST]: 10,
          [LandType.HILLS]: 12,
          [LandType.MOUNTAINS]: 20,
          [LandType.DESERT]: 15,
          [LandType.SWAMP]: 18,
          [LandType.BEACH]: 30,
          [LandType.VOLCANO]: 50,
          [LandType.GLACIER]: 55,
          [LandType.PARADISE]: 100
        };
        
        const land: Omit<Land, 'id'> = {
          coordinates: { x, y, region },
          type,
          ownerId: null,
          ownerUsername: null,
          residents: [],
          maxResidents: 100,
          size: Math.floor(random % 5) + 1,
          bonusIncome: bonuses[type],
          forSale: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        batch.set(landRef, {
          ...land,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    }
    
    await batch.commit();
    console.log('✅ Mapa inicializado com 2500 terrenos!');
  } catch (error: any) {
    throw new Error(`Erro ao inicializar terrenos: ${error.message}`);
  }
}

/**
 * Busca todos os terrenos (com paginação)
 */
export async function getLands(limitCount: number = 100): Promise<Land[]> {
  try {
    const landsQuery = query(
      collection(db, 'lands'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(landsQuery);
    const lands: Land[] = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      lands.push({
        id: doc.id,
        coordinates: data.coordinates,
        type: data.type,
        name: data.name,
        description: data.description,
        ownerId: data.ownerId,
        ownerUsername: data.ownerUsername,
        purchasedAt: data.purchasedAt?.toDate(),
        purchasePrice: data.purchasePrice,
        residents: data.residents || [],
        maxResidents: data.maxResidents || 100,
        size: data.size,
        bonusIncome: data.bonusIncome,
        forSale: data.forSale,
        salePrice: data.salePrice,
        listedAt: data.listedAt?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      });
    });
    
    return lands;
  } catch (error: any) {
    throw new Error(`Erro ao buscar terrenos: ${error.message}`);
  }
}

// ==================== LAND OFFERS ====================

/**
 * Fazer oferta em um terreno listado
 */
export async function makeLandOffer(
  landId: string,
  listingId: string,
  buyerId: string,
  buyerUsername: string,
  offerAmount: number,
  message?: string
): Promise<string> {
  try {
    // Verificar se listing existe e está ativa
    const listingDoc = await getDoc(doc(db, 'landListings', listingId));
    if (!listingDoc.exists()) {
      throw new Error('Listagem não encontrada');
    }
    
    const listing = listingDoc.data();
    if (listing.status !== 'active') {
      throw new Error('Esta listagem não está mais ativa');
    }
    
    // Criar oferta
    const offerRef = await addDoc(collection(db, 'landOffers'), {
      landId,
      listingId,
      buyerId,
      buyerUsername,
      sellerId: listing.sellerId,
      offerAmount,
      message: message || '',
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return offerRef.id;
  } catch (error: any) {
    throw new Error(`Erro ao fazer oferta: ${error.message}`);
  }
}

/**
 * Aceitar oferta em terreno
 */
export async function acceptLandOffer(
  offerId: string,
  sellerId: string
): Promise<void> {
  try {
    const offerDoc = await getDoc(doc(db, 'landOffers', offerId));
    if (!offerDoc.exists()) {
      throw new Error('Oferta não encontrada');
    }
    
    const offer = offerDoc.data();
    if (offer.sellerId !== sellerId) {
      throw new Error('Apenas o vendedor pode aceitar ofertas');
    }
    
    if (offer.status !== 'pending') {
      throw new Error('Esta oferta não está mais pendente');
    }
    
    // Atualizar oferta
    await updateDoc(doc(db, 'landOffers', offerId), {
      status: 'accepted',
      acceptedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Transferir terreno (similar a buyLandFromMarketplace)
    await buyLandFromMarketplace(offer.listingId, offer.buyerId, offer.buyerUsername);
  } catch (error: any) {
    throw new Error(`Erro ao aceitar oferta: ${error.message}`);
  }
}

/**
 * Recusar oferta em terreno
 */
export async function rejectLandOffer(
  offerId: string,
  sellerId: string,
  reason?: string
): Promise<void> {
  try {
    const offerDoc = await getDoc(doc(db, 'landOffers', offerId));
    if (!offerDoc.exists()) {
      throw new Error('Oferta não encontrada');
    }
    
    const offer = offerDoc.data();
    if (offer.sellerId !== sellerId) {
      throw new Error('Apenas o vendedor pode recusar ofertas');
    }
    
    if (offer.status !== 'pending') {
      throw new Error('Esta oferta não está mais pendente');
    }
    
    // Atualizar oferta
    await updateDoc(doc(db, 'landOffers', offerId), {
      status: 'rejected',
      rejectedAt: serverTimestamp(),
      rejectionReason: reason || '',
      updatedAt: serverTimestamp()
    });
  } catch (error: any) {
    throw new Error(`Erro ao recusar oferta: ${error.message}`);
  }
}

/**
 * Buscar ofertas feitas em um terreno
 */
export async function getLandOffers(landId: string): Promise<any[]> {
  try {
    const offersQuery = query(
      collection(db, 'landOffers'),
      where('landId', '==', landId),
      where('status', '==', 'pending'),
      orderBy('offerAmount', 'desc')
    );
    
    const snapshot = await getDocs(offersQuery);
    const offers: any[] = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      offers.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      });
    });
    
    return offers;
  } catch (error: any) {
    throw new Error(`Erro ao buscar ofertas: ${error.message}`);
  }
}

/**
 * Buscar ofertas feitas POR um usuário
 */
export async function getUserLandOffers(userId: string): Promise<any[]> {
  try {
    const offersQuery = query(
      collection(db, 'landOffers'),
      where('buyerId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    const snapshot = await getDocs(offersQuery);
    const offers: any[] = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      offers.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      });
    });
    
    return offers;
  } catch (error: any) {
    throw new Error(`Erro ao buscar suas ofertas: ${error.message}`);
  }
}

/**
 * Buscar ofertas RECEBIDAS por um vendedor
 */
export async function getSellerLandOffers(sellerId: string): Promise<any[]> {
  try {
    const offersQuery = query(
      collection(db, 'landOffers'),
      where('sellerId', '==', sellerId),
      where('status', '==', 'pending'),
      orderBy('offerAmount', 'desc')
    );
    
    const snapshot = await getDocs(offersQuery);
    const offers: any[] = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      offers.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      });
    });
    
    return offers;
  } catch (error: any) {
    throw new Error(`Erro ao buscar ofertas recebidas: ${error.message}`);
  }
}

/**
 * Busca terrenos por região
 */
export async function getLandsByRegion(
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
): Promise<Land[]> {
  try {
    const lands: Land[] = [];
    
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const landId = `land_${x}_${y}`;
        const landDoc = await getDoc(doc(db, 'lands', landId));
        
        if (landDoc.exists()) {
          const data = landDoc.data();
          lands.push({
            id: landDoc.id,
            coordinates: data.coordinates,
            type: data.type,
            name: data.name,
            description: data.description,
            ownerId: data.ownerId,
            ownerUsername: data.ownerUsername,
            purchasedAt: data.purchasedAt?.toDate(),
            purchasePrice: data.purchasePrice,
            residents: data.residents || [],
            maxResidents: data.maxResidents || 100,
            size: data.size,
            bonusIncome: data.bonusIncome,
            forSale: data.forSale,
            salePrice: data.salePrice,
            listedAt: data.listedAt?.toDate(),
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
          });
        }
      }
    }
    
    return lands;
  } catch (error: any) {
    throw new Error(`Erro ao buscar terrenos por região: ${error.message}`);
  }
}

/**
 * Busca um terreno específico
 */
export async function getLand(landId: string): Promise<Land | null> {
  try {
    const landDoc = await getDoc(doc(db, 'lands', landId));
    
    if (!landDoc.exists()) {
      return null;
    }
    
    const data = landDoc.data();
    return {
      id: landDoc.id,
      coordinates: data.coordinates,
      type: data.type,
      name: data.name,
      description: data.description,
      ownerId: data.ownerId,
      ownerUsername: data.ownerUsername,
      purchasedAt: data.purchasedAt?.toDate(),
      purchasePrice: data.purchasePrice,
      residents: data.residents || [],
      maxResidents: data.maxResidents || 100,
      size: data.size,
      bonusIncome: data.bonusIncome,
      forSale: data.forSale,
      salePrice: data.salePrice,
      listedAt: data.listedAt?.toDate(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    };
  } catch (error: any) {
    throw new Error(`Erro ao buscar terreno: ${error.message}`);
  }
}

/**
 * Compra um terreno diretamente (não listado)
 */
export async function purchaseLand(
  landId: string,
  userId: string,
  username: string,
  price: number
): Promise<void> {
  try {
    const landRef = doc(db, 'lands', landId);
    const userRef = doc(db, 'users', userId);
    
    // Buscar terreno
    const landDoc = await getDoc(landRef);
    if (!landDoc.exists()) {
      throw new Error('Terreno não encontrado');
    }
    
    const land = landDoc.data();
    if (land.ownerId) {
      throw new Error('Terreno já possui dono');
    }
    
    // Buscar usuário
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error('Usuário não encontrado');
    }
    
    const userData = userDoc.data();
    if (userData.gameState.coins < price) {
      throw new Error('Moedas insuficientes');
    }
    
    // Atualizar terreno
    await updateDoc(landRef, {
      ownerId: userId,
      ownerUsername: username,
      purchasedAt: serverTimestamp(),
      purchasePrice: price,
      updatedAt: serverTimestamp()
    });
    
    // Deduzir moedas
    await updateDoc(userRef, {
      'gameState.coins': userData.gameState.coins - price,
      lastUpdated: serverTimestamp()
    });
  } catch (error: any) {
    throw new Error(`Erro ao comprar terreno: ${error.message}`);
  }
}

/**
 * Lista terreno para venda no marketplace
 */
export async function listLandForSale(
  landId: string,
  userId: string,
  price: number,
  description?: string,
  durationDays?: number
): Promise<string> {
  try {
    const landRef = doc(db, 'lands', landId);
    const landDoc = await getDoc(landRef);
    
    if (!landDoc.exists()) {
      throw new Error('Terreno não encontrado');
    }
    
    const land = landDoc.data();
    if (land.ownerId !== userId) {
      throw new Error('Você não é dono deste terreno');
    }
    
    // Calcular data de expiração (padrão: 7 dias)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (durationDays || 7));
    
    // Criar listagem
    const listingRef = await addDoc(collection(db, 'landListings'), {
      landId,
      sellerId: userId,
      sellerUsername: land.ownerUsername,
      price,
      description: description || '',
      status: 'active',
      expiresAt: Timestamp.fromDate(expiresAt),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Marcar terreno como à venda
    await updateDoc(landRef, {
      forSale: true,
      salePrice: price,
      listedAt: serverTimestamp(),
      listingExpiresAt: Timestamp.fromDate(expiresAt),
      updatedAt: serverTimestamp()
    });
    
    return listingRef.id;
  } catch (error: any) {
    throw new Error(`Erro ao listar terreno: ${error.message}`);
  }
}

/**
 * Compra terreno do marketplace
 */
export async function buyLandFromMarketplace(
  listingId: string,
  buyerId: string,
  buyerUsername: string
): Promise<void> {
  try {
    const listingRef = doc(db, 'landListings', listingId);
    const listingDoc = await getDoc(listingRef);
    
    if (!listingDoc.exists()) {
      throw new Error('Listagem não encontrada');
    }
    
    const listing = listingDoc.data();
    if (listing.status !== 'active') {
      throw new Error('Listagem não está ativa');
    }
    
    const landRef = doc(db, 'lands', listing.landId);
    const buyerRef = doc(db, 'users', buyerId);
    const sellerRef = doc(db, 'users', listing.sellerId);
    
    // Buscar dados
    const [, buyerDoc, sellerDoc] = await Promise.all([
      getDoc(landRef),
      getDoc(buyerRef),
      getDoc(sellerRef)
    ]);
    
    if (!buyerDoc.exists() || !sellerDoc.exists()) {
      throw new Error('Usuário não encontrado');
    }
    
    const buyerData = buyerDoc.data();
    const sellerData = sellerDoc.data();
    
    if (buyerData.gameState.coins < listing.price) {
      throw new Error('Moedas insuficientes');
    }
    
    // Transferir propriedade
    await updateDoc(landRef, {
      ownerId: buyerId,
      ownerUsername: buyerUsername,
      purchasedAt: serverTimestamp(),
      purchasePrice: listing.price,
      forSale: false,
      salePrice: null,
      listedAt: null,
      residents: [], // Limpar moradores na transferência
      updatedAt: serverTimestamp()
    });
    
    // Atualizar moedas
    await Promise.all([
      updateDoc(buyerRef, {
        'gameState.coins': buyerData.gameState.coins - listing.price,
        lastUpdated: serverTimestamp()
      }),
      updateDoc(sellerRef, {
        'gameState.coins': sellerData.gameState.coins + listing.price,
        lastUpdated: serverTimestamp()
      })
    ]);
    
    // Marcar listagem como vendida
    await updateDoc(listingRef, {
      status: 'sold',
      updatedAt: serverTimestamp()
    });
  } catch (error: any) {
    throw new Error(`Erro ao comprar terreno: ${error.message}`);
  }
}

/**
 * Busca listagens ativas de terrenos
 */
export async function getActiveLandListings(limitCount: number = 50): Promise<LandListing[]> {
  try {
    const listingsQuery = query(
      collection(db, 'landListings'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(listingsQuery);
    const listings: LandListing[] = [];
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const land = await getLand(data.landId);
      
      if (land) {
        listings.push({
          id: doc.id,
          landId: data.landId,
          land,
          sellerId: data.sellerId,
          sellerUsername: data.sellerUsername,
          price: data.price,
          description: data.description,
          status: data.status,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        });
      }
    }
    
    return listings;
  } catch (error: any) {
    throw new Error(`Erro ao buscar listagens: ${error.message}`);
  }
}

/**
 * Adiciona morador a um terreno
 */
export async function addLandResident(
  landId: string,
  ownerId: string,
  residentUserId: string,
  residentUsername: string,
  permissions: { canBuild: boolean; canInvite: boolean }
): Promise<void> {
  try {
    const landRef = doc(db, 'lands', landId);
    const landDoc = await getDoc(landRef);
    
    if (!landDoc.exists()) {
      throw new Error('Terreno não encontrado');
    }
    
    const land = landDoc.data();
    if (land.ownerId !== ownerId) {
      throw new Error('Apenas o dono pode adicionar moradores');
    }
    
    const residents: LandResident[] = land.residents || [];
    if (residents.length >= land.maxResidents) {
      throw new Error('Número máximo de moradores atingido');
    }
    
    if (residents.some(r => r.userId === residentUserId)) {
      throw new Error('Usuário já é morador');
    }
    
    const newResident: LandResident = {
      userId: residentUserId,
      username: residentUsername,
      addedAt: new Date(),
      permissions
    };
    
    await updateDoc(landRef, {
      residents: [...residents, {
        ...newResident,
        addedAt: serverTimestamp()
      }],
      updatedAt: serverTimestamp()
    });
  } catch (error: any) {
    throw new Error(`Erro ao adicionar morador: ${error.message}`);
  }
}

/**
 * Remove morador de um terreno
 */
export async function removeLandResident(
  landId: string,
  ownerId: string,
  residentUserId: string
): Promise<void> {
  try {
    const landRef = doc(db, 'lands', landId);
    const landDoc = await getDoc(landRef);
    
    if (!landDoc.exists()) {
      throw new Error('Terreno não encontrado');
    }
    
    const land = landDoc.data();
    if (land.ownerId !== ownerId) {
      throw new Error('Apenas o dono pode remover moradores');
    }
    
    const residents: LandResident[] = land.residents || [];
    const updatedResidents = residents.filter(r => r.userId !== residentUserId);
    
    await updateDoc(landRef, {
      residents: updatedResidents,
      updatedAt: serverTimestamp()
    });
  } catch (error: any) {
    throw new Error(`Erro ao remover morador: ${error.message}`);
  }
}

/**
 * Busca terrenos de um usuário
 */
export async function getUserLands(userId: string): Promise<Land[]> {
  try {
    const landsQuery = query(
      collection(db, 'lands'),
      where('ownerId', '==', userId)
    );
    
    const snapshot = await getDocs(landsQuery);
    const lands: Land[] = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      lands.push({
        id: doc.id,
        coordinates: data.coordinates,
        type: data.type,
        name: data.name,
        description: data.description,
        ownerId: data.ownerId,
        ownerUsername: data.ownerUsername,
        purchasedAt: data.purchasedAt?.toDate(),
        purchasePrice: data.purchasePrice,
        residents: data.residents || [],
        maxResidents: data.maxResidents || 100,
        size: data.size,
        bonusIncome: data.bonusIncome,
        forSale: data.forSale,
        salePrice: data.salePrice,
        listedAt: data.listedAt?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      });
    });
    
    return lands;
  } catch (error: any) {
    throw new Error(`Erro ao buscar terrenos do usuário: ${error.message}`);
  }
}

// ============================================
// FUNÇÕES DE GUILDA
// ============================================

/**
 * Calcula o limite de membros baseado no tier do terreno
 */
function calculateGuildMaxMembers(tier: UpgradeTier): number {
  const limits: Record<UpgradeTier, number> = {
    [UpgradeTier.COMUM]: 5,
    [UpgradeTier.INCOMUM]: 10,
    [UpgradeTier.RARO]: 20,
    [UpgradeTier.EPICO]: 35,
    [UpgradeTier.LENDARIO]: 50,
    [UpgradeTier.MITICO]: 100
  };
  
  return limits[tier] || 5;
}

/**
 * Cria uma nova guilda
 * Requer que o usuário tenha um terreno
 */
export async function createGuild(
  ownerId: string,
  ownerUsername: string,
  landId: string,
  name: string,
  description: string,
  emoji: string
): Promise<string> {
  try {
    // Verificar se o terreno existe na lista de upgrades
    const upgrades: Upgrade[] = await import('../data/upgrades').then(m => m.upgrades);
    const land = upgrades.find(u => u.id === landId && u.category === 'Terrenos');
    
    if (!land) {
      throw new Error('Terreno não encontrado');
    }
    
    if (!land.tier) {
      throw new Error('Tier do terreno não definido');
    }
    
    // ✅ VALIDAÇÃO CRÍTICA: Verificar se o usuário POSSUI o terreno
    const userRef = doc(db, 'users', ownerId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('Usuário não encontrado');
    }
    
    const userData = userDoc.data();
    const userUpgrades = userData.upgrades || [];
    const ownedLand = userUpgrades.find((u: any) => u.id === landId);
    
    if (!ownedLand || (ownedLand.count || 0) <= 0) {
      throw new Error('Você não possui este terreno no inventário');
    }
    
    // Verificar se o usuário já possui uma guilda
    const existingGuildsQuery = query(
      collection(db, 'guilds'),
      where('ownerId', '==', ownerId)
    );
    const existingGuilds = await getDocs(existingGuildsQuery);
    
    if (!existingGuilds.empty) {
      throw new Error('Você já possui uma guilda');
    }
    
    // Calcular limite de membros baseado no tier do terreno
    const maxMembers = calculateGuildMaxMembers(land.tier);
    
    const ownerMember: GuildMember = {
      uid: ownerId,
      username: ownerUsername,
      joinedAt: new Date(),
      role: 'owner'
    };
    
    const guildData = {
      name,
      description,
      emoji,
      ownerId,
      ownerUsername,
      landId,
      landTier: land.tier,
      members: [ownerMember],
      maxMembers,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'guilds'), guildData);
    
    console.log('✅ Guilda criada:', docRef.id);
    return docRef.id;
  } catch (error: any) {
    throw new Error(`Erro ao criar guilda: ${error.message}`);
  }
}

/**
 * Busca uma guilda pelo ID
 */
export async function getGuild(guildId: string): Promise<Guild | null> {
  try {
    const guildRef = doc(db, 'guilds', guildId);
    const guildDoc = await getDoc(guildRef);
    
    if (!guildDoc.exists()) {
      return null;
    }
    
    const data = guildDoc.data();
    return {
      id: guildDoc.id,
      name: data.name,
      description: data.description,
      emoji: data.emoji,
      ownerId: data.ownerId,
      ownerUsername: data.ownerUsername,
      landId: data.landId,
      landTier: data.landTier,
      members: data.members.map((m: any) => ({
        ...m,
        joinedAt: m.joinedAt?.toDate() || new Date()
      })),
      maxMembers: data.maxMembers,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    };
  } catch (error: any) {
    throw new Error(`Erro ao buscar guilda: ${error.message}`);
  }
}

/**
 * Busca todas as guildas (com paginação opcional)
 */
export async function getAllGuilds(limitCount: number = 100): Promise<Guild[]> {
  try {
    const guildsQuery = query(
      collection(db, 'guilds'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(guildsQuery);
    const guilds: Guild[] = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      guilds.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        emoji: data.emoji,
        ownerId: data.ownerId,
        ownerUsername: data.ownerUsername,
        landId: data.landId,
        landTier: data.landTier,
        members: data.members.map((m: any) => ({
          ...m,
          joinedAt: m.joinedAt?.toDate() || new Date()
        })),
        maxMembers: data.maxMembers,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      });
    });
    
    return guilds;
  } catch (error: any) {
    throw new Error(`Erro ao buscar guildas: ${error.message}`);
  }
}

/**
 * Busca a guilda de um usuário (como dono ou membro)
 */
export async function getUserGuild(userId: string): Promise<Guild | null> {
  try {
    // Buscar como dono
    const ownerQuery = query(
      collection(db, 'guilds'),
      where('ownerId', '==', userId)
    );
    const ownerSnapshot = await getDocs(ownerQuery);
    
    if (!ownerSnapshot.empty) {
      const doc = ownerSnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        emoji: data.emoji,
        ownerId: data.ownerId,
        ownerUsername: data.ownerUsername,
        landId: data.landId,
        landTier: data.landTier,
        members: data.members.map((m: any) => ({
          ...m,
          joinedAt: m.joinedAt?.toDate() || new Date()
        })),
        maxMembers: data.maxMembers,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      };
    }
    
    // Buscar como membro
    const allGuilds = await getAllGuilds(1000);
    const memberGuild = allGuilds.find(g => 
      g.members.some(m => m.uid === userId)
    );
    
    return memberGuild || null;
  } catch (error: any) {
    throw new Error(`Erro ao buscar guilda do usuário: ${error.message}`);
  }
}

/**
 * Adiciona um membro à guilda
 */
export async function joinGuild(guildId: string, userId: string, username: string): Promise<void> {
  try {
    const guild = await getGuild(guildId);
    
    if (!guild) {
      throw new Error('Guilda não encontrada');
    }
    
    // Verificar se já é membro
    if (guild.members.some(m => m.uid === userId)) {
      throw new Error('Você já é membro desta guilda');
    }
    
    // Verificar limite de membros
    if (guild.members.length >= guild.maxMembers) {
      throw new Error('Guilda está cheia');
    }
    
    // Verificar se o usuário já está em outra guilda
    const userCurrentGuild = await getUserGuild(userId);
    if (userCurrentGuild) {
      throw new Error('Você já está em uma guilda. Saia dela primeiro.');
    }
    
    const newMember: GuildMember = {
      uid: userId,
      username,
      joinedAt: new Date(),
      role: 'member'
    };
    
    const guildRef = doc(db, 'guilds', guildId);
    await updateDoc(guildRef, {
      members: arrayUnion(newMember),
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Membro adicionado à guilda');
  } catch (error: any) {
    throw new Error(`Erro ao entrar na guilda: ${error.message}`);
  }
}

/**
 * Remove um membro da guilda
 */
export async function leaveGuild(guildId: string, userId: string): Promise<void> {
  try {
    const guild = await getGuild(guildId);
    
    if (!guild) {
      throw new Error('Guilda não encontrada');
    }
    
    // Dono não pode sair, apenas deletar a guilda
    if (guild.ownerId === userId) {
      throw new Error('O dono não pode sair da guilda. Delete a guilda se desejar.');
    }
    
    const member = guild.members.find(m => m.uid === userId);
    if (!member) {
      throw new Error('Você não é membro desta guilda');
    }
    
    const guildRef = doc(db, 'guilds', guildId);
    await updateDoc(guildRef, {
      members: arrayRemove(member),
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Saiu da guilda');
  } catch (error: any) {
    throw new Error(`Erro ao sair da guilda: ${error.message}`);
  }
}

/**
 * Deleta uma guilda (apenas o dono pode)
 */
export async function deleteGuild(guildId: string, userId: string): Promise<void> {
  try {
    const guild = await getGuild(guildId);
    
    if (!guild) {
      throw new Error('Guilda não encontrada');
    }
    
    if (guild.ownerId !== userId) {
      throw new Error('Apenas o dono pode deletar a guilda');
    }
    
    await deleteDoc(doc(db, 'guilds', guildId));
    console.log('✅ Guilda deletada');
  } catch (error: any) {
    throw new Error(`Erro ao deletar guilda: ${error.message}`);
  }
}

/**
 * Atualiza informações da guilda (apenas o dono pode)
 */
export async function updateGuild(
  guildId: string,
  userId: string,
  updates: Partial<Pick<Guild, 'name' | 'description' | 'emoji'>>
): Promise<void> {
  try {
    const guild = await getGuild(guildId);
    
    if (!guild) {
      throw new Error('Guilda não encontrada');
    }
    
    if (guild.ownerId !== userId) {
      throw new Error('Apenas o dono pode atualizar a guilda');
    }
    
    const guildRef = doc(db, 'guilds', guildId);
    await updateDoc(guildRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Guilda atualizada');
  } catch (error: any) {
    throw new Error(`Erro ao atualizar guilda: ${error.message}`);
  }
}
