import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc,
  serverTimestamp,
  increment,
  query,
  where,
  getDocs,
  orderBy,
  limit as firestoreLimit
} from 'firebase/firestore';
import { db } from './config';
import { 
  GuildTreasury, 
  TreasuryTransaction, 
  GuildUpgrades,
  GuildAttack,
  PlayerWeapons,
  PvPAttack
} from '../types';

// ========================
// SISTEMA DE TESOURARIA
// ========================

/**
 * Obtém o cofre da guilda (cria se não existir)
 */
export async function getGuildTreasury(guildId: string): Promise<GuildTreasury> {
  try {
    const treasuryRef = doc(db, 'guildTreasuries', guildId);
    const treasuryDoc = await getDoc(treasuryRef);
    
    if (!treasuryDoc.exists()) {
      // Criar cofre inicial
      const initialTreasury: Omit<GuildTreasury, 'transactions'> & { transactions: any[] } = {
        guildId,
        balance: 0,
        transactions: [],
        totalDeposited: 0,
        totalSpent: 0,
        totalEarned: 0
      };
      
      await setDoc(treasuryRef, initialTreasury);
      
      return {
        ...initialTreasury,
        transactions: []
      };
    }
    
    const data = treasuryDoc.data();
    return {
      guildId: data.guildId,
      balance: data.balance,
      transactions: (data.transactions || []).map((t: any) => ({
        ...t,
        timestamp: t.timestamp?.toDate() || new Date()
      })),
      totalDeposited: data.totalDeposited || 0,
      totalSpent: data.totalSpent || 0,
      totalEarned: data.totalEarned || 0
    };
  } catch (error: any) {
    throw new Error(`Erro ao buscar tesouraria: ${error.message}`);
  }
}

/**
 * Deposita moedas no cofre da guilda
 */
export async function depositToTreasury(
  guildId: string,
  userId: string,
  username: string,
  amount: number
): Promise<void> {
  try {
    if (amount <= 0) {
      throw new Error('Valor deve ser maior que zero');
    }
    
    // Verificar se usuário tem moedas suficientes
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('Usuário não encontrado');
    }
    
    const userData = userDoc.data();
    const userCoins = userData.coins || 0;
    
    if (userCoins < amount) {
      throw new Error('Moedas insuficientes');
    }
    
    // Criar transação
    const transaction: Omit<TreasuryTransaction, 'id'> = {
      type: 'deposit',
      userId,
      username,
      amount,
      description: `${username} depositou ${amount.toLocaleString()} moedas`,
      timestamp: new Date()
    };
    
    const treasuryRef = doc(db, 'guildTreasuries', guildId);
    const treasuryDoc = await getDoc(treasuryRef);
    
    if (!treasuryDoc.exists()) {
      // Criar cofre se não existir
      await setDoc(treasuryRef, {
        guildId,
        balance: amount,
        transactions: [{
          ...transaction,
          id: Date.now().toString()
        }],
        totalDeposited: amount,
        totalSpent: 0,
        totalEarned: 0
      });
    } else {
      // Atualizar cofre existente
      const currentTransactions = treasuryDoc.data().transactions || [];
      await updateDoc(treasuryRef, {
        balance: increment(amount),
        totalDeposited: increment(amount),
        transactions: [
          ...currentTransactions,
          {
            ...transaction,
            id: Date.now().toString()
          }
        ].slice(-50) // Manter apenas últimas 50 transações
      });
    }
    
    // Deduzir moedas do usuário
    await updateDoc(userRef, {
      coins: increment(-amount)
    });
    
    console.log(`✅ ${username} depositou ${amount} moedas na guilda`);
  } catch (error: any) {
    throw new Error(`Erro ao depositar: ${error.message}`);
  }
}

// ========================
// SISTEMA DE UPGRADES (ARMAS E DEFESA)
// ========================

/**
 * Calcula o custo do próximo nível de arma/defesa
 */
function calculateUpgradeCost(currentLevel: number): number {
  // Custo exponencial: 10000 * (2 ^ nível atual)
  return 10000 * Math.pow(2, currentLevel);
}

/**
 * Obtém os upgrades da guilda (cria se não existir)
 */
export async function getGuildUpgrades(guildId: string): Promise<GuildUpgrades> {
  try {
    const upgradesRef = doc(db, 'guildUpgrades', guildId);
    const upgradesDoc = await getDoc(upgradesRef);
    
    if (!upgradesDoc.exists()) {
      const initialUpgrades: GuildUpgrades = {
        guildId,
        weaponLevel: 0,
        defenseLevel: 0
      };
      
      await setDoc(upgradesRef, initialUpgrades);
      return initialUpgrades;
    }
    
    const data = upgradesDoc.data();
    return {
      guildId: data.guildId,
      weaponLevel: data.weaponLevel || 0,
      defenseLevel: data.defenseLevel || 0,
      lastUpgradeAt: data.lastUpgradeAt?.toDate()
    };
  } catch (error: any) {
    throw new Error(`Erro ao buscar upgrades: ${error.message}`);
  }
}

/**
 * Compra upgrade de arma ou defesa para a guilda
 */
export async function buyGuildUpgrade(
  guildId: string,
  userId: string,
  upgradeType: 'weapon' | 'defense'
): Promise<void> {
  try {
    // Verificar se usuário é dono da guilda
    const guildRef = doc(db, 'guilds', guildId);
    const guildDoc = await getDoc(guildRef);
    
    if (!guildDoc.exists()) {
      throw new Error('Guilda não encontrada');
    }
    
    const guildData = guildDoc.data();
    if (guildData.ownerId !== userId) {
      throw new Error('Apenas o dono pode comprar upgrades');
    }
    
    // Buscar upgrades atuais
    const upgrades = await getGuildUpgrades(guildId);
    const currentLevel = upgradeType === 'weapon' ? upgrades.weaponLevel : upgrades.defenseLevel;
    const cost = calculateUpgradeCost(currentLevel);
    
    // Verificar se cofre tem moedas suficientes
    const treasury = await getGuildTreasury(guildId);
    if (treasury.balance < cost) {
      throw new Error(`Cofre insuficiente. Necessário: ${cost.toLocaleString()} moedas`);
    }
    
    // Atualizar upgrade
    const upgradesRef = doc(db, 'guildUpgrades', guildId);
    const updateField = upgradeType === 'weapon' ? 'weaponLevel' : 'defenseLevel';
    
    await updateDoc(upgradesRef, {
      [updateField]: increment(1),
      lastUpgradeAt: serverTimestamp()
    });
    
    // Deduzir do cofre
    const treasuryRef = doc(db, 'guildTreasuries', guildId);
    const transaction: Omit<TreasuryTransaction, 'id'> = {
      type: 'upgrade',
      userId,
      username: guildData.ownerUsername,
      amount: -cost,
      description: `Upgrade de ${upgradeType === 'weapon' ? 'Arma' : 'Defesa'} nível ${currentLevel + 1}`,
      timestamp: new Date()
    };
    
    const treasuryDoc = await getDoc(treasuryRef);
    const currentTransactions = treasuryDoc.data()?.transactions || [];
    
    await updateDoc(treasuryRef, {
      balance: increment(-cost),
      totalSpent: increment(cost),
      transactions: [
        ...currentTransactions,
        {
          ...transaction,
          id: Date.now().toString()
        }
      ].slice(-50)
    });
    
    console.log(`✅ ${upgradeType === 'weapon' ? 'Arma' : 'Defesa'} da guilda atualizada para nível ${currentLevel + 1}`);
  } catch (error: any) {
    throw new Error(`Erro ao comprar upgrade: ${error.message}`);
  }
}

// ========================
// SISTEMA DE ATAQUES ENTRE GUILDAS
// ========================

/**
 * Ataca outra guilda
 */
export async function attackGuild(
  attackerGuildId: string,
  defenderGuildId: string,
  attackerId: string
): Promise<{ success: boolean; message: string; coinsStolen?: number; coinsLost?: number }> {
  try {
    if (attackerGuildId === defenderGuildId) {
      throw new Error('Não pode atacar a própria guilda');
    }
    
    // Buscar dados das guildas
    const attackerGuildRef = doc(db, 'guilds', attackerGuildId);
    const defenderGuildRef = doc(db, 'guilds', defenderGuildId);
    
    const [attackerGuildDoc, defenderGuildDoc] = await Promise.all([
      getDoc(attackerGuildRef),
      getDoc(defenderGuildRef)
    ]);
    
    if (!attackerGuildDoc.exists() || !defenderGuildDoc.exists()) {
      throw new Error('Uma das guildas não foi encontrada');
    }
    
    const attackerGuildData = attackerGuildDoc.data();
    const defenderGuildData = defenderGuildDoc.data();
    
    // Verificar se atacante é dono da guilda
    if (attackerGuildData.ownerId !== attackerId) {
      throw new Error('Apenas o dono pode atacar');
    }
    
    // Buscar upgrades
    const [attackerUpgrades, defenderUpgrades] = await Promise.all([
      getGuildUpgrades(attackerGuildId),
      getGuildUpgrades(defenderGuildId)
    ]);
    
    // Calcular custo do ataque (baseado no nível da arma)
    const attackCost = calculateUpgradeCost(attackerUpgrades.weaponLevel) * 0.5; // 50% do custo do upgrade
    
    // Verificar se atacante tem moedas no cofre
    const attackerTreasury = await getGuildTreasury(attackerGuildId);
    if (attackerTreasury.balance < attackCost) {
      throw new Error(`Cofre insuficiente para atacar. Necessário: ${attackCost.toLocaleString()} moedas`);
    }
    
    // Determinar sucesso: arma > defesa
    const success = attackerUpgrades.weaponLevel > defenderUpgrades.defenseLevel;
    
    let coinsStolen = 0;
    let result: { success: boolean; message: string; coinsStolen?: number; coinsLost?: number };
    
    if (success) {
      // SUCESSO: Recupera investimento + 20% do cofre inimigo
      const defenderTreasury = await getGuildTreasury(defenderGuildId);
      coinsStolen = Math.floor(defenderTreasury.balance * 0.20);
      const totalReward = attackCost + coinsStolen;
      
      // Atualizar cofres
      const attackerTreasuryRef = doc(db, 'guildTreasuries', attackerGuildId);
      const defenderTreasuryRef = doc(db, 'guildTreasuries', defenderGuildId);
      
      // Adicionar recompensa ao atacante
      const attackerTransaction: Omit<TreasuryTransaction, 'id'> = {
        type: 'reward',
        userId: attackerId,
        username: attackerGuildData.ownerUsername,
        amount: totalReward,
        description: `Ataque bem-sucedido contra ${defenderGuildData.name}! Recuperou ${attackCost.toLocaleString()} + roubou ${coinsStolen.toLocaleString()}`,
        timestamp: new Date()
      };
      
      const attackerTreasuryDoc = await getDoc(attackerTreasuryRef);
      const attackerTransactions = attackerTreasuryDoc.data()?.transactions || [];
      
      await updateDoc(attackerTreasuryRef, {
        balance: increment(totalReward - attackCost), // Soma recompensa - custo do ataque
        totalEarned: increment(coinsStolen),
        transactions: [
          ...attackerTransactions,
          {
            ...attackerTransaction,
            id: Date.now().toString()
          }
        ].slice(-50)
      });
      
      // Remover moedas roubadas do defensor
      const defenderTransaction: Omit<TreasuryTransaction, 'id'> = {
        type: 'attack',
        userId: attackerId,
        username: attackerGuildData.name,
        amount: -coinsStolen,
        description: `Atacado por ${attackerGuildData.name}! Perdeu ${coinsStolen.toLocaleString()} moedas`,
        timestamp: new Date()
      };
      
      const defenderTreasuryDoc = await getDoc(defenderTreasuryRef);
      const defenderTransactions = defenderTreasuryDoc.data()?.transactions || [];
      
      await updateDoc(defenderTreasuryRef, {
        balance: increment(-coinsStolen),
        transactions: [
          ...defenderTransactions,
          {
            ...defenderTransaction,
            id: Date.now().toString()
          }
        ].slice(-50)
      });
      
      result = {
        success: true,
        message: `✅ Vitória! Você recuperou ${attackCost.toLocaleString()} moedas e roubou ${coinsStolen.toLocaleString()} do inimigo!`,
        coinsStolen
      };
    } else {
      // FRACASSO: Perde todo o investimento
      const attackerTreasuryRef = doc(db, 'guildTreasuries', attackerGuildId);
      
      const transaction: Omit<TreasuryTransaction, 'id'> = {
        type: 'attack',
        userId: attackerId,
        username: attackerGuildData.ownerUsername,
        amount: -attackCost,
        description: `Ataque fracassado contra ${defenderGuildData.name}. Perdeu ${attackCost.toLocaleString()} moedas`,
        timestamp: new Date()
      };
      
      const attackerTreasuryDoc = await getDoc(attackerTreasuryRef);
      const attackerTransactions = attackerTreasuryDoc.data()?.transactions || [];
      
      await updateDoc(attackerTreasuryRef, {
        balance: increment(-attackCost),
        totalSpent: increment(attackCost),
        transactions: [
          ...attackerTransactions,
          {
            ...transaction,
            id: Date.now().toString()
          }
        ].slice(-50)
      });
      
      result = {
        success: false,
        message: `❌ Derrota! A defesa inimiga era muito forte. Você perdeu ${attackCost.toLocaleString()} moedas.`,
        coinsLost: attackCost
      };
    }
    
    // Registrar ataque no histórico
    const attackRecord: Omit<GuildAttack, 'id'> = {
      attackerGuildId,
      attackerGuildName: attackerGuildData.name,
      defenderGuildId,
      defenderGuildName: defenderGuildData.name,
      attackerWeaponLevel: attackerUpgrades.weaponLevel,
      defenderDefenseLevel: defenderUpgrades.defenseLevel,
      attackCost,
      success,
      coinsStolen: success ? coinsStolen : undefined,
      timestamp: new Date()
    };
    
    await addDoc(collection(db, 'guildAttacks'), attackRecord);
    
    return result;
  } catch (error: any) {
    throw new Error(`Erro ao atacar: ${error.message}`);
  }
}

/**
 * Busca histórico de ataques de uma guilda
 */
export async function getGuildAttackHistory(guildId: string, limitCount: number = 10): Promise<GuildAttack[]> {
  try {
    const attacksQuery = query(
      collection(db, 'guildAttacks'),
      where('attackerGuildId', '==', guildId),
      orderBy('timestamp', 'desc'),
      firestoreLimit(limitCount)
    );
    
    const defenseQuery = query(
      collection(db, 'guildAttacks'),
      where('defenderGuildId', '==', guildId),
      orderBy('timestamp', 'desc'),
      firestoreLimit(limitCount)
    );
    
    const [attacksSnapshot, defenseSnapshot] = await Promise.all([
      getDocs(attacksQuery),
      getDocs(defenseQuery)
    ]);
    
    const attacks = attacksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    })) as GuildAttack[];
    
    const defenses = defenseSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    })) as GuildAttack[];
    
    // Combinar e ordenar por timestamp
    return [...attacks, ...defenses]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limitCount);
  } catch (error: any) {
    throw new Error(`Erro ao buscar histórico: ${error.message}`);
  }
}

// ========================
// SISTEMA PVP (JOGADORES SEM GUILDA)
// ========================

/**
 * Obtém armas/defesa de jogador solo
 */
export async function getPlayerWeapons(userId: string): Promise<PlayerWeapons> {
  try {
    const weaponsRef = doc(db, 'playerWeapons', userId);
    const weaponsDoc = await getDoc(weaponsRef);
    
    if (!weaponsDoc.exists()) {
      const initialWeapons: PlayerWeapons = {
        userId,
        weaponLevel: 0,
        defenseLevel: 0
      };
      
      await setDoc(weaponsRef, initialWeapons);
      return initialWeapons;
    }
    
    const data = weaponsDoc.data();
    return {
      userId: data.userId,
      weaponLevel: data.weaponLevel || 0,
      defenseLevel: data.defenseLevel || 0,
      lastUpgradeAt: data.lastUpgradeAt?.toDate()
    };
  } catch (error: any) {
    throw new Error(`Erro ao buscar armas: ${error.message}`);
  }
}

/**
 * Compra upgrade de arma/defesa para jogador solo
 * Custo: 3x mais caro que guilda
 * Efetividade: 50% maior
 */
export async function buyPlayerWeapon(
  userId: string,
  upgradeType: 'weapon' | 'defense'
): Promise<void> {
  try {
    const weapons = await getPlayerWeapons(userId);
    const currentLevel = upgradeType === 'weapon' ? weapons.weaponLevel : weapons.defenseLevel;
    const baseCost = calculateUpgradeCost(currentLevel);
    const cost = baseCost * 3; // 3x mais caro para jogadores solo
    
    // Verificar moedas do jogador
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('Usuário não encontrado');
    }
    
    const userData = userDoc.data();
    const userCoins = userData.coins || 0;
    
    if (userCoins < cost) {
      throw new Error(`Moedas insuficientes. Necessário: ${cost.toLocaleString()}`);
    }
    
    // Atualizar arma/defesa
    const weaponsRef = doc(db, 'playerWeapons', userId);
    const updateField = upgradeType === 'weapon' ? 'weaponLevel' : 'defenseLevel';
    
    await updateDoc(weaponsRef, {
      [updateField]: increment(1),
      lastUpgradeAt: serverTimestamp()
    });
    
    // Deduzir moedas
    await updateDoc(userRef, {
      coins: increment(-cost)
    });
    
    console.log(`✅ ${upgradeType === 'weapon' ? 'Arma' : 'Defesa'} do jogador atualizada para nível ${currentLevel + 1}`);
  } catch (error: any) {
    throw new Error(`Erro ao comprar arma: ${error.message}`);
  }
}

/**
 * Ataque PvP entre jogadores sem guilda
 * Efetividade: 50% maior (nível 2 de solo = nível 3 de guilda)
 */
export async function attackPlayer(
  attackerId: string,
  defenderId: string
): Promise<{ success: boolean; message: string; coinsStolen?: number; coinsLost?: number }> {
  try {
    if (attackerId === defenderId) {
      throw new Error('Não pode atacar a si mesmo');
    }
    
    // Buscar dados dos jogadores
    const attackerRef = doc(db, 'users', attackerId);
    const defenderRef = doc(db, 'users', defenderId);
    
    const [attackerDoc, defenderDoc] = await Promise.all([
      getDoc(attackerRef),
      getDoc(defenderRef)
    ]);
    
    if (!attackerDoc.exists() || !defenderDoc.exists()) {
      throw new Error('Jogador não encontrado');
    }
    
    const attackerData = attackerDoc.data();
    const defenderData = defenderDoc.data();
    
    // Buscar armas
    const [attackerWeapons, defenderWeapons] = await Promise.all([
      getPlayerWeapons(attackerId),
      getPlayerWeapons(defenderId)
    ]);
    
    // Aplicar bônus de 50% de efetividade
    const effectiveAttackLevel = attackerWeapons.weaponLevel * 1.5;
    const effectiveDefenseLevel = defenderWeapons.defenseLevel * 1.5;
    
    // Calcular custo do ataque
    const attackCost = calculateUpgradeCost(attackerWeapons.weaponLevel) * 1.5; // 1.5x do custo base
    
    if (attackerData.coins < attackCost) {
      throw new Error(`Moedas insuficientes para atacar. Necessário: ${attackCost.toLocaleString()}`);
    }
    
    // Determinar sucesso
    const success = effectiveAttackLevel > effectiveDefenseLevel;
    
    let coinsStolen = 0;
    let result: { success: boolean; message: string; coinsStolen?: number; coinsLost?: number };
    
    if (success) {
      // SUCESSO: Recupera investimento + 20% das moedas do inimigo
      coinsStolen = Math.floor(defenderData.coins * 0.20);
      const totalReward = attackCost + coinsStolen;
      
      // Atualizar moedas
      await updateDoc(attackerRef, {
        coins: increment(totalReward - attackCost)
      });
      
      await updateDoc(defenderRef, {
        coins: increment(-coinsStolen)
      });
      
      result = {
        success: true,
        message: `✅ Vitória! Você recuperou ${attackCost.toLocaleString()} moedas e roubou ${coinsStolen.toLocaleString()} do inimigo!`,
        coinsStolen
      };
    } else {
      // FRACASSO: Perde todo o investimento
      await updateDoc(attackerRef, {
        coins: increment(-attackCost)
      });
      
      result = {
        success: false,
        message: `❌ Derrota! A defesa inimiga era muito forte. Você perdeu ${attackCost.toLocaleString()} moedas.`,
        coinsLost: attackCost
      };
    }
    
    // Registrar ataque
    const attackRecord: Omit<PvPAttack, 'id'> = {
      attackerId,
      attackerName: attackerData.username || 'Jogador',
      defenderId,
      defenderName: defenderData.username || 'Jogador',
      attackerWeaponLevel: attackerWeapons.weaponLevel,
      defenderDefenseLevel: defenderWeapons.defenseLevel,
      attackCost,
      success,
      coinsStolen: success ? coinsStolen : undefined,
      timestamp: new Date()
    };
    
    await addDoc(collection(db, 'pvpAttacks'), attackRecord);
    
    return result;
  } catch (error: any) {
    throw new Error(`Erro ao atacar jogador: ${error.message}`);
  }
}

/**
 * Busca histórico PvP de um jogador
 */
export async function getPvPHistory(userId: string, limitCount: number = 10): Promise<PvPAttack[]> {
  try {
    const attacksQuery = query(
      collection(db, 'pvpAttacks'),
      where('attackerId', '==', userId),
      orderBy('timestamp', 'desc'),
      firestoreLimit(limitCount)
    );
    
    const defenseQuery = query(
      collection(db, 'pvpAttacks'),
      where('defenderId', '==', userId),
      orderBy('timestamp', 'desc'),
      firestoreLimit(limitCount)
    );
    
    const [attacksSnapshot, defenseSnapshot] = await Promise.all([
      getDocs(attacksQuery),
      getDocs(defenseQuery)
    ]);
    
    const attacks = attacksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    })) as PvPAttack[];
    
    const defenses = defenseSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    })) as PvPAttack[];
    
    return [...attacks, ...defenses]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limitCount);
  } catch (error: any) {
    throw new Error(`Erro ao buscar histórico PvP: ${error.message}`);
  }
}
