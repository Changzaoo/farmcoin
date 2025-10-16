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
  setDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from './config';
import { Land, LandListing, LandResident, LandType, LandRarity } from '../types';

/**
 * Gera o mapa inicial de terrenos (2000+ terrenos em grid 50x50)
 * Deve ser chamado apenas uma vez para inicializar o mapa
 */
export async function initializeLandMap(): Promise<void> {
  try {
    const GRID_SIZE = 50; // 50x50 = 2500 terrenos
    const lands: Land[] = [];

    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        const rarity = generateLandRarity();
        const type = generateLandType(x, y, GRID_SIZE);
        const basePrice = calculateLandPrice(type, rarity);
        const baseIncome = calculateLandIncome(type, rarity);

        const land: Land = {
          id: `land_${x}_${y}`,
          x,
          y,
          type,
          rarity,
          residents: [],
          price: basePrice,
          baseIncome,
          listedForSale: false,
        };

        lands.push(land);
      }
    }

    // Salvar todos os terrenos no Firestore
    console.log(`🗺️ Iniciando criação de ${lands.length} terrenos...`);
    
    const batch = [];
    for (const land of lands) {
      batch.push(
        setDoc(doc(db, 'lands', land.id), {
          ...land,
          createdAt: serverTimestamp(),
        })
      );

      // Processar em lotes de 100 para não sobrecarregar
      if (batch.length >= 100) {
        await Promise.all(batch);
        batch.length = 0;
        console.log(`  ✅ ${lands.indexOf(land) + 1}/${lands.length} terrenos criados`);
      }
    }

    // Processar terrenos restantes
    if (batch.length > 0) {
      await Promise.all(batch);
    }

    console.log(`✨ Mapa inicializado com sucesso! ${lands.length} terrenos criados.`);
  } catch (error: any) {
    throw new Error(`Erro ao inicializar mapa: ${error.message}`);
  }
}

/**
 * Gera a raridade do terreno baseado em probabilidade
 */
function generateLandRarity(): LandRarity {
  const rand = Math.random() * 100;
  
  if (rand < 60) return LandRarity.COMUM;       // 60%
  if (rand < 85) return LandRarity.INCOMUM;     // 25%
  if (rand < 95) return LandRarity.RARO;        // 10%
  if (rand < 99) return LandRarity.EPICO;       // 4%
  return LandRarity.LENDARIO;                   // 1%
}

/**
 * Gera o tipo do terreno baseado na posição
 */
function generateLandType(x: number, y: number, gridSize: number): LandType {
  const centerX = gridSize / 2;
  const centerY = gridSize / 2;
  const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
  const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
  const normalizedDistance = distanceFromCenter / maxDistance;

  // Centro = Planícies, Bordas = Montanhas/Deserto
  const rand = Math.random();

  if (normalizedDistance < 0.3) {
    // Centro: mais planícies e florestas
    if (rand < 0.6) return LandType.PLAINS;
    if (rand < 0.9) return LandType.FOREST;
    return LandType.WATER;
  } else if (normalizedDistance < 0.6) {
    // Meio: mix variado
    if (rand < 0.3) return LandType.PLAINS;
    if (rand < 0.5) return LandType.FOREST;
    if (rand < 0.7) return LandType.MOUNTAIN;
    if (rand < 0.9) return LandType.WATER;
    return LandType.DESERT;
  } else {
    // Bordas: mais montanhas e deserto
    if (rand < 0.4) return LandType.MOUNTAIN;
    if (rand < 0.7) return LandType.DESERT;
    if (rand < 0.85) return LandType.FOREST;
    if (rand < 0.98) return LandType.WATER;
    return LandType.SPECIAL;
  }
}

/**
 * Calcula o preço base do terreno
 */
function calculateLandPrice(type: LandType, rarity: LandRarity): number {
  const basePrice = {
    [LandType.PLAINS]: 1000,
    [LandType.FOREST]: 1500,
    [LandType.MOUNTAIN]: 2000,
    [LandType.DESERT]: 800,
    [LandType.WATER]: 1200,
    [LandType.SPECIAL]: 5000,
  };

  const rarityMultiplier = {
    [LandRarity.COMUM]: 1,
    [LandRarity.INCOMUM]: 2,
    [LandRarity.RARO]: 5,
    [LandRarity.EPICO]: 10,
    [LandRarity.LENDARIO]: 25,
  };

  return basePrice[type] * rarityMultiplier[rarity];
}

/**
 * Calcula a renda base do terreno por segundo
 */
function calculateLandIncome(type: LandType, rarity: LandRarity): number {
  const baseIncome = {
    [LandType.PLAINS]: 1,
    [LandType.FOREST]: 1.5,
    [LandType.MOUNTAIN]: 2,
    [LandType.DESERT]: 0.8,
    [LandType.WATER]: 1.2,
    [LandType.SPECIAL]: 5,
  };

  const rarityMultiplier = {
    [LandRarity.COMUM]: 1,
    [LandRarity.INCOMUM]: 1.5,
    [LandRarity.RARO]: 2.5,
    [LandRarity.EPICO]: 5,
    [LandRarity.LENDARIO]: 10,
  };

  return baseIncome[type] * rarityMultiplier[rarity];
}

/**
 * Busca todos os terrenos (com paginação)
 */
export async function getLands(limitCount: number = 100, startX: number = 0, startY: number = 0): Promise<Land[]> {
  try {
    const landsQuery = query(
      collection(db, 'lands'),
      orderBy('x'),
      orderBy('y'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(landsQuery);
    const lands: Land[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      lands.push({
        id: doc.id,
        x: data.x,
        y: data.y,
        type: data.type,
        rarity: data.rarity,
        ownerId: data.ownerId,
        ownerUsername: data.ownerUsername,
        residents: data.residents || [],
        price: data.price,
        baseIncome: data.baseIncome,
        customName: data.customName,
        customDescription: data.customDescription,
        purchasedAt: data.purchasedAt?.toDate(),
        listedForSale: data.listedForSale || false,
        salePrice: data.salePrice,
      });
    });

    return lands;
  } catch (error: any) {
    throw new Error(`Erro ao buscar terrenos: ${error.message}`);
  }
}

/**
 * Busca terrenos em uma área específica
 */
export async function getLandsInArea(
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
): Promise<Land[]> {
  try {
    const landsQuery = query(
      collection(db, 'lands'),
      where('x', '>=', minX),
      where('x', '<=', maxX)
    );

    const querySnapshot = await getDocs(landsQuery);
    const lands: Land[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Filtrar por Y manualmente (Firestore limita range queries)
      if (data.y >= minY && data.y <= maxY) {
        lands.push({
          id: doc.id,
          x: data.x,
          y: data.y,
          type: data.type,
          rarity: data.rarity,
          ownerId: data.ownerId,
          ownerUsername: data.ownerUsername,
          residents: data.residents || [],
          price: data.price,
          baseIncome: data.baseIncome,
          customName: data.customName,
          customDescription: data.customDescription,
          purchasedAt: data.purchasedAt?.toDate(),
          listedForSale: data.listedForSale || false,
          salePrice: data.salePrice,
        });
      }
    });

    return lands;
  } catch (error: any) {
    throw new Error(`Erro ao buscar terrenos na área: ${error.message}`);
  }
}

/**
 * Compra um terreno
 */
export async function purchaseLand(
  landId: string,
  buyerId: string,
  buyerUsername: string
): Promise<void> {
  try {
    const landRef = doc(db, 'lands', landId);
    const landDoc = await getDoc(landRef);

    if (!landDoc.exists()) {
      throw new Error('Terreno não encontrado');
    }

    const landData = landDoc.data();

    if (landData.ownerId) {
      throw new Error('Este terreno já tem um dono');
    }

    await updateDoc(landRef, {
      ownerId: buyerId,
      ownerUsername: buyerUsername,
      purchasedAt: serverTimestamp(),
      listedForSale: false,
    });
  } catch (error: any) {
    throw new Error(`Erro ao comprar terreno: ${error.message}`);
  }
}

/**
 * Adiciona um morador ao terreno
 */
export async function addLandResident(
  landId: string,
  resident: LandResident
): Promise<void> {
  try {
    const landRef = doc(db, 'lands', landId);
    const landDoc = await getDoc(landRef);

    if (!landDoc.exists()) {
      throw new Error('Terreno não encontrado');
    }

    const landData = landDoc.data();
    const currentResidents = landData.residents || [];

    if (currentResidents.length >= 100) {
      throw new Error('Terreno já atingiu o limite de 100 moradores');
    }

    if (currentResidents.some((r: LandResident) => r.uid === resident.uid)) {
      throw new Error('Este usuário já é morador deste terreno');
    }

    await updateDoc(landRef, {
      residents: arrayUnion({
        ...resident,
        addedAt: serverTimestamp(),
      }),
    });
  } catch (error: any) {
    throw new Error(`Erro ao adicionar morador: ${error.message}`);
  }
}

/**
 * Remove um morador do terreno
 */
export async function removeLandResident(
  landId: string,
  residentUid: string
): Promise<void> {
  try {
    const landRef = doc(db, 'lands', landId);
    const landDoc = await getDoc(landRef);

    if (!landDoc.exists()) {
      throw new Error('Terreno não encontrado');
    }

    const landData = landDoc.data();
    const currentResidents = landData.residents || [];
    const residentToRemove = currentResidents.find((r: LandResident) => r.uid === residentUid);

    if (!residentToRemove) {
      throw new Error('Morador não encontrado');
    }

    await updateDoc(landRef, {
      residents: arrayRemove(residentToRemove),
    });
  } catch (error: any) {
    throw new Error(`Erro ao remover morador: ${error.message}`);
  }
}

/**
 * Lista um terreno para venda
 */
export async function listLandForSale(
  landId: string,
  salePrice: number
): Promise<void> {
  try {
    const landRef = doc(db, 'lands', landId);
    await updateDoc(landRef, {
      listedForSale: true,
      salePrice,
      listedAt: serverTimestamp(),
    });
  } catch (error: any) {
    throw new Error(`Erro ao listar terreno para venda: ${error.message}`);
  }
}

/**
 * Remove terreno da venda
 */
export async function unlistLandFromSale(landId: string): Promise<void> {
  try {
    const landRef = doc(db, 'lands', landId);
    await updateDoc(landRef, {
      listedForSale: false,
      salePrice: null,
      listedAt: null,
    });
  } catch (error: any) {
    throw new Error(`Erro ao remover terreno da venda: ${error.message}`);
  }
}

/**
 * Busca terrenos à venda
 */
export async function getLandsForSale(limitCount: number = 50): Promise<Land[]> {
  try {
    const landsQuery = query(
      collection(db, 'lands'),
      where('listedForSale', '==', true),
      orderBy('salePrice'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(landsQuery);
    const lands: Land[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      lands.push({
        id: doc.id,
        x: data.x,
        y: data.y,
        type: data.type,
        rarity: data.rarity,
        ownerId: data.ownerId,
        ownerUsername: data.ownerUsername,
        residents: data.residents || [],
        price: data.price,
        baseIncome: data.baseIncome,
        customName: data.customName,
        customDescription: data.customDescription,
        purchasedAt: data.purchasedAt?.toDate(),
        listedForSale: data.listedForSale,
        salePrice: data.salePrice,
      });
    });

    return lands;
  } catch (error: any) {
    throw new Error(`Erro ao buscar terrenos à venda: ${error.message}`);
  }
}

/**
 * Busca terrenos do usuário
 */
export async function getUserLands(userId: string): Promise<Land[]> {
  try {
    const landsQuery = query(
      collection(db, 'lands'),
      where('ownerId', '==', userId),
      orderBy('purchasedAt', 'desc')
    );

    const querySnapshot = await getDocs(landsQuery);
    const lands: Land[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      lands.push({
        id: doc.id,
        x: data.x,
        y: data.y,
        type: data.type,
        rarity: data.rarity,
        ownerId: data.ownerId,
        ownerUsername: data.ownerUsername,
        residents: data.residents || [],
        price: data.price,
        baseIncome: data.baseIncome,
        customName: data.customName,
        customDescription: data.customDescription,
        purchasedAt: data.purchasedAt?.toDate(),
        listedForSale: data.listedForSale || false,
        salePrice: data.salePrice,
      });
    });

    return lands;
  } catch (error: any) {
    throw new Error(`Erro ao buscar terrenos do usuário: ${error.message}`);
  }
}

/**
 * Atualiza nome e descrição personalizados do terreno
 */
export async function updateLandCustomization(
  landId: string,
  customName?: string,
  customDescription?: string
): Promise<void> {
  try {
    const landRef = doc(db, 'lands', landId);
    await updateDoc(landRef, {
      customName: customName || null,
      customDescription: customDescription || null,
      updatedAt: serverTimestamp(),
    });
  } catch (error: any) {
    throw new Error(`Erro ao atualizar personalização do terreno: ${error.message}`);
  }
}
