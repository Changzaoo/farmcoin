// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Users, TrendingUp, X, Plus, Trash2, DollarSign, Home, Star } from 'lucide-react';
import { 
  Land, 
  LandType, 
  LandListing,
  LandResident 
} from '../../types';
import {
  getLandsByRegion,
  getLand,
  listLandForSale,
  addLandResident,
  removeLandResident,
  getUserLands,
  getActiveLandListings,
  buyLandFromMarketplace,
  purchaseLand,
  makeLandOffer,
  acceptLandOffer,
  rejectLandOffer,
  getLandOffers,
  getSellerLandOffers
} from '../../firebase/firestore';

interface MapProps {
  uid: string;
  username: string;
  userCoins: number;
  onPurchase: (price: number) => void;
}

// Sistema de raridade dos terrenos
enum LandRarity {
  COMUM = 'COMUM',
  INCOMUM = 'INCOMUM',
  RARO = 'RARO',
  EPICO = 'EPICO',
  LENDARIO = 'LENDARIO',
  MITICO = 'MITICO'
}

// Preços base dos terrenos por raridade (valores MUITO altos - item mais caro do jogo)
const landBasePrices: Record<LandRarity, number> = {
  [LandRarity.COMUM]: 5000000,        // 5 milhões (5.000.000,00)
  [LandRarity.INCOMUM]: 25000000,     // 25 milhões (25.000.000,00)
  [LandRarity.RARO]: 100000000,       // 100 milhões (100.000.000,00)
  [LandRarity.EPICO]: 500000000,      // 500 milhões (500.000.000,00)
  [LandRarity.LENDARIO]: 2500000000,  // 2.5 bilhões (2.500.000.000,00)
  [LandRarity.MITICO]: 10000000000    // 10 bilhões (10.000.000.000,00)
};

// Configuração de raridade por tipo de terreno
const landRarityConfig: Record<LandType, { rarity: LandRarity; probability: number; bonuses: { category: string; multiplier: number }[] }> = {
  [LandType.PLAINS]: {
    rarity: LandRarity.COMUM,
    probability: 40,
    bonuses: [
      { category: 'plantacoes', multiplier: 1.1 },
      { category: 'animais', multiplier: 1.05 }
    ]
  },
  [LandType.FOREST]: {
    rarity: LandRarity.COMUM,
    probability: 25,
    bonuses: [
      { category: 'plantacoes', multiplier: 1.15 },
      { category: 'industria', multiplier: 1.1 }
    ]
  },
  [LandType.HILLS]: {
    rarity: LandRarity.INCOMUM,
    probability: 15,
    bonuses: [
      { category: 'animais', multiplier: 1.2 },
      { category: 'maquinario', multiplier: 1.1 }
    ]
  },
  [LandType.DESERT]: {
    rarity: LandRarity.INCOMUM,
    probability: 8,
    bonuses: [
      { category: 'especiais', multiplier: 1.25 }
    ]
  },
  [LandType.SWAMP]: {
    rarity: LandRarity.RARO,
    probability: 4,
    bonuses: [
      { category: 'plantacoes', multiplier: 1.3 },
      { category: 'especiais', multiplier: 1.15 }
    ]
  },
  [LandType.BEACH]: {
    rarity: LandRarity.RARO,
    probability: 3,
    bonuses: [
      { category: 'comercio', multiplier: 1.35 },
      { category: 'animais', multiplier: 1.2 }
    ]
  },
  [LandType.MOUNTAINS]: {
    rarity: LandRarity.EPICO,
    probability: 2,
    bonuses: [
      { category: 'maquinario', multiplier: 1.4 },
      { category: 'industria', multiplier: 1.3 }
    ]
  },
  [LandType.VOLCANO]: {
    rarity: LandRarity.EPICO,
    probability: 1.5,
    bonuses: [
      { category: 'industria', multiplier: 1.5 },
      { category: 'especiais', multiplier: 1.35 }
    ]
  },
  [LandType.GLACIER]: {
    rarity: LandRarity.LENDARIO,
    probability: 0.8,
    bonuses: [
      { category: 'comercio', multiplier: 1.6 },
      { category: 'especiais', multiplier: 1.4 }
    ]
  },
  [LandType.PARADISE]: {
    rarity: LandRarity.MITICO,
    probability: 0.2,
    bonuses: [
      { category: 'plantacoes', multiplier: 2.0 },
      { category: 'animais', multiplier: 1.8 },
      { category: 'industria', multiplier: 1.6 },
      { category: 'maquinario', multiplier: 1.5 },
      { category: 'comercio', multiplier: 1.7 },
      { category: 'especiais', multiplier: 2.0 }
    ]
  }
};

const rarityColors: Record<LandRarity, string> = {
  [LandRarity.COMUM]: '#9CA3AF',
  [LandRarity.INCOMUM]: '#10B981',
  [LandRarity.RARO]: '#3B82F6',
  [LandRarity.EPICO]: '#8B5CF6',
  [LandRarity.LENDARIO]: '#F59E0B',
  [LandRarity.MITICO]: '#EC4899'
};

const rarityGlow: Record<LandRarity, string> = {
  [LandRarity.COMUM]: 'none',
  [LandRarity.INCOMUM]: '0 0 10px rgba(16, 185, 129, 0.5)',
  [LandRarity.RARO]: '0 0 15px rgba(59, 130, 246, 0.6)',
  [LandRarity.EPICO]: '0 0 20px rgba(139, 92, 246, 0.7)',
  [LandRarity.LENDARIO]: '0 0 25px rgba(245, 158, 11, 0.8)',
  [LandRarity.MITICO]: '0 0 30px rgba(236, 72, 153, 0.9)'
};

// Emojis para representar raridades
const rarityEmojis: Record<LandRarity, string> = {
  [LandRarity.COMUM]: '⚪',
  [LandRarity.INCOMUM]: '🟢',
  [LandRarity.RARO]: '🔵',
  [LandRarity.EPICO]: '🟣',
  [LandRarity.LENDARIO]: '🟠',
  [LandRarity.MITICO]: '🌟'
};

const Map: React.FC<MapProps> = ({ uid, username, userCoins, onPurchase }) => {
  const [viewX, setViewX] = useState(25); // Centro do mapa (25, 25)
  const [viewY, setViewY] = useState(25); // Centro do mapa (25, 25)
  const [viewSize] = useState(20); // Tamanho da viewport (20x20 terrenos)
  const [zoom, setZoom] = useState(1); // Zoom do mapa (0.5x a 2x)
  const [lands, setLands] = useState<Land[]>([]);
  const [selectedLand, setSelectedLand] = useState<Land | null>(null);
  const [showLandDetail, setShowLandDetail] = useState(false);
  const [showResidentModal, setShowResidentModal] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState(0);
  const [offerMessage, setOfferMessage] = useState('');
  const [newResidentUsername, setNewResidentUsername] = useState('');
  const [listingPrice, setListingPrice] = useState(0);
  const [listingDescription, setListingDescription] = useState('');
  const [listingDuration, setListingDuration] = useState(7); // Duração em dias
  const [userLands, setUserLands] = useState<Land[]>([]);
  const [marketListings, setMarketListings] = useState<LandListing[]>([]);
  const [activeTab, setActiveTab] = useState<'map' | 'mylands' | 'marketplace'>('map');
  const [loading, setLoading] = useState(false);
  const [rarityFilter, setRarityFilter] = useState<LandRarity | null>(null);
  const [availableFilter, setAvailableFilter] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const [landOffers, setLandOffers] = useState<any[]>([]);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Emojis dos tipos de terreno
  const landEmojis: Record<LandType, string> = {
    [LandType.PLAINS]: '🌾',
    [LandType.FOREST]: '🌲',
    [LandType.HILLS]: '⛰️',
    [LandType.MOUNTAINS]: '🏔️',
    [LandType.DESERT]: '🏜️',
    [LandType.SWAMP]: '🌿',
    [LandType.BEACH]: '🏖️',
    [LandType.VOLCANO]: '🌋',
    [LandType.GLACIER]: '🧊',
    [LandType.PARADISE]: '🌴'
  };

  const landNames: Record<LandType, string> = {
    [LandType.PLAINS]: 'Planície',
    [LandType.FOREST]: 'Floresta',
    [LandType.HILLS]: 'Colinas',
    [LandType.MOUNTAINS]: 'Montanhas',
    [LandType.DESERT]: 'Deserto',
    [LandType.SWAMP]: 'Pântano',
    [LandType.BEACH]: 'Praia',
    [LandType.VOLCANO]: 'Vulcão',
    [LandType.GLACIER]: 'Geleira',
    [LandType.PARADISE]: 'Paraíso'
  };

  // Obter raridade do terreno
  const getLandRarity = (landType: LandType): LandRarity => {
    return landRarityConfig[landType].rarity;
  };

  // Obter bônus do terreno
  const getLandBonuses = (landType: LandType) => {
    return landRarityConfig[landType].bonuses;
  };

  // Calcular preço de um terreno
  const calculateLandPrice = (land: Land): number => {
    const rarity = getLandRarity(land.type);
    const basePrice = landBasePrices[rarity];
    
    // Multiplicador baseado no bônus de renda
    const bonusMultiplier = 1 + (land.bonusIncome / 100);
    
    // Multiplicador baseado no tamanho
    const sizeMultiplier = land.size / 100;
    
    return Math.floor(basePrice * bonusMultiplier * sizeMultiplier);
  };

  // Comprar terreno diretamente (sem dono)
  const handlePurchaseLand = async () => {
    if (!selectedLand) return;
    
    if (selectedLand.ownerId) {
      alert('Este terreno já possui dono!');
      return;
    }
    
    const price = calculateLandPrice(selectedLand);
    
    if (userCoins < price) {
      alert(`Você precisa de ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} moedas para comprar este terreno!`);
      return;
    }
    
    const confirm = window.confirm(
      `Você tem certeza que deseja comprar este terreno por ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} moedas?\n\n` +
      `Tipo: ${landNames[selectedLand.type]}\n` +
      `Raridade: ${getLandRarity(selectedLand.type)}\n` +
      `Bônus de Renda: +${selectedLand.bonusIncome}%`
    );
    
    if (!confirm) return;
    
    try {
      setLoading(true);
      await purchaseLand(selectedLand.id, uid, username, price);
      onPurchase(price); // Deduz as moedas do estado global
      alert('Terreno comprado com sucesso! 🎉');
      setShowLandDetail(false);
      setSelectedLand(null);
      loadVisibleLands();
      loadUserLands();
    } catch (error: any) {
      alert(`Erro ao comprar terreno: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Carregar terrenos visíveis
  useEffect(() => {
    loadVisibleLands();
  }, [viewX, viewY]); // Recarregar quando a visão mudar

  // Carregar terrenos do usuário
  useEffect(() => {
    loadUserLands();
  }, [uid]);

  // Carregar marketplace
  useEffect(() => {
    if (activeTab === 'marketplace') {
      loadMarketplace();
    }
  }, [activeTab]);

  const loadVisibleLands = async () => {
    try {
      setLoading(true);
      const minX = Math.max(0, viewX - Math.floor(viewSize / 2));
      const maxX = Math.min(49, viewX + Math.floor(viewSize / 2));
      const minY = Math.max(0, viewY - Math.floor(viewSize / 2));
      const maxY = Math.min(49, viewY + Math.floor(viewSize / 2));
      
      // Tentar carregar do Firestore
      let loadedLands = await getLandsByRegion(minX, maxX, minY, maxY);
      
      // Se não houver terrenos no Firestore, gerar localmente para demonstração
      if (loadedLands.length === 0) {
        console.log('Gerando terrenos localmente para demonstração...');
        loadedLands = generateDemoLands(minX, maxX, minY, maxY);
      }
      
      setLands(loadedLands);
    } catch (error) {
      console.error('Erro ao carregar terrenos:', error);
      // Em caso de erro, gerar terrenos localmente
      const minX = Math.max(0, viewX - Math.floor(viewSize / 2));
      const maxX = Math.min(49, viewX + Math.floor(viewSize / 2));
      const minY = Math.max(0, viewY - Math.floor(viewSize / 2));
      const maxY = Math.min(49, viewY + Math.floor(viewSize / 2));
      setLands(generateDemoLands(minX, maxX, minY, maxY));
    } finally {
      setLoading(false);
    }
  };

  // Função para gerar terrenos de demonstração localmente
  const generateDemoLands = (minX: number, maxX: number, minY: number, maxY: number): Land[] => {
    const demoLands: Land[] = [];
    const landTypes = Object.values(LandType);
    
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        // Gerar tipo baseado em probabilidade
        const rand = Math.random() * 100;
        let selectedType: LandType;
        
        if (rand < 40) selectedType = LandType.PLAINS;
        else if (rand < 65) selectedType = LandType.FOREST;
        else if (rand < 80) selectedType = LandType.HILLS;
        else if (rand < 88) selectedType = LandType.DESERT;
        else if (rand < 92) selectedType = LandType.SWAMP;
        else if (rand < 95) selectedType = LandType.BEACH;
        else if (rand < 97) selectedType = LandType.MOUNTAINS;
        else if (rand < 98.5) selectedType = LandType.VOLCANO;
        else if (rand < 99.3) selectedType = LandType.GLACIER;
        else selectedType = LandType.PARADISE;
        
        const rarity = getLandRarity(selectedType);
        const bonusIncome = rarity === LandRarity.COMUM ? 10 : 
                           rarity === LandRarity.INCOMUM ? 15 :
                           rarity === LandRarity.RARO ? 25 :
                           rarity === LandRarity.EPICO ? 40 :
                           rarity === LandRarity.LENDARIO ? 60 : 100;
        
        demoLands.push({
          id: `land_${x}_${y}`,
          coordinates: { x, y, region: 'demo' },
          type: selectedType,
          ownerId: Math.random() > 0.7 ? 'demo_owner' : undefined,
          ownerUsername: Math.random() > 0.7 ? 'Jogador' : undefined,
          residents: [],
          maxResidents: 10,
          size: 100,
          bonusIncome,
          forSale: Math.random() > 0.85,
          salePrice: Math.random() > 0.85 ? 1000000 : undefined,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    
    return demoLands;
  };

  const loadUserLands = async () => {
    try {
      const myLands = await getUserLands(uid);
      setUserLands(myLands);
    } catch (error) {
      console.error('Erro ao carregar meus terrenos:', error);
    }
  };

  const loadMarketplace = async () => {
    try {
      setLoading(true);
      const listings = await getActiveLandListings(50);
      setMarketListings(listings);
    } catch (error) {
      console.error('Erro ao carregar marketplace:', error);
    } finally {
      setLoading(false);
    }
  };

  // Renderizar mapa no canvas com emojis em alta definição
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = 35 * zoom; // Tamanho com zoom aplicado
    canvas.width = viewSize * cellSize;
    canvas.height = viewSize * cellSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Habilitar suavização para melhor qualidade
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Desenhar fundo com padrÃ£o de emoji de mapa 🗺️
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Criar padrÃ£o de fundo com emoji de mapa
    ctx.font = `bold ${80 * zoom}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = 0.05; // Muito transparente para não interferir
    
    const patternSize = 100 * zoom;
    for (let i = 0; i < Math.ceil(canvas.width / patternSize); i++) {
      for (let j = 0; j < Math.ceil(canvas.height / patternSize); j++) {
        ctx.fillText('🗺️', i * patternSize + patternSize / 2, j * patternSize + patternSize / 2);
      }
    }
    
    ctx.globalAlpha = 1.0; // Voltar opacidade normal

    // Filtrar terrenos
    const filteredLands = lands.filter(land => {
      if (availableFilter && land.ownerId) return false;
      if (rarityFilter && getLandRarity(land.type) !== rarityFilter) return false;
      return true;
    });

    filteredLands.forEach(land => {
      const x = (land.coordinates.x - (viewX - Math.floor(viewSize / 2))) * cellSize;
      const y = (land.coordinates.y - (viewY - Math.floor(viewSize / 2))) * cellSize;

      const rarity = getLandRarity(land.type);
      
      // Fundo com gradiente baseado na raridade
      const gradient = ctx.createLinearGradient(x, y, x + cellSize, y + cellSize);
      const baseColor = rarityColors[rarity];
      gradient.addColorStop(0, baseColor + '20');
      gradient.addColorStop(1, baseColor + '40');
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, cellSize, cellSize);

      // Borda com efeito de brilho para raridades altas
      ctx.strokeStyle = rarityColors[rarity];
      ctx.lineWidth = (rarity === LandRarity.COMUM ? 1 : 2) * zoom;
      
      if (rarityGlow[rarity] !== 'none') {
        ctx.shadowColor = rarityColors[rarity];
        ctx.shadowBlur = (rarity === LandRarity.MITICO ? 15 : rarity === LandRarity.LENDARIO ? 10 : 5) * zoom;
      }
      
      ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
      ctx.shadowBlur = 0;

      // Emoji de RARIDADE no canto superior esquerdo
      ctx.font = `bold ${12 * zoom}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(rarityEmojis[rarity], x + 2, y + 2);

      // Emoji do terreno em ALTA DEFINIÇÃO (maior e centralizado)
      ctx.font = `bold ${22 * zoom}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Sombra para o emoji (destaque)
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4 * zoom;
      ctx.shadowOffsetX = 2 * zoom;
      ctx.shadowOffsetY = 2 * zoom;
      
      ctx.fillText(landEmojis[land.type], x + cellSize / 2, y + cellSize / 2);
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // ALFINETE VERDE para terrenos à venda
      if (land.forSale) {
        ctx.font = `bold ${14 * zoom}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        
        // Fundo branco para destaque do alfinete
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(x + cellSize - 9 * zoom, y + 9 * zoom, 7 * zoom, 0, Math.PI * 2);
        ctx.fill();
        
        // Alfinete verde 📍
        ctx.fillText('📍', x + cellSize - 15 * zoom, y + 2 * zoom);
      }

      // Ícone do proprietário (coroa dourada)
      if (land.ownerId && land.ownerId === uid) {
        ctx.font = `bold ${12 * zoom}px "Segoe UI Emoji"`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText('👑', x + cellSize - 2 * zoom, y + cellSize - 2 * zoom);
      }

      // Indicador de raridade (estrelas no canto superior esquerdo)
      const stars = rarity === LandRarity.MITICO ? '⭐⭐⭐' : 
                    rarity === LandRarity.LENDARIO ? '⭐⭐' : 
                    rarity === LandRarity.EPICO ? '⭐' : '';
      
      if (stars) {
        ctx.font = `bold ${7 * zoom}px "Segoe UI Emoji"`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        
        // Fundo escuro para as estrelas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(x + 1, y + 1, stars.length * 4.5 * zoom, 9 * zoom);
        
        ctx.fillText(stars, x + 2 * zoom, y + 2 * zoom);
      }
    });
  }, [lands, viewX, viewY, viewSize, uid, zoom, availableFilter, rarityFilter]);

  // Handlers de mouse para drag
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    // Mover o viewport (inverter direção para movimento natural)
    if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
      const cellSize = 35 * zoom;
      const moveX = Math.round(-deltaX / cellSize);
      const moveY = Math.round(-deltaY / cellSize);
      
      if (moveX !== 0 || moveY !== 0) {
        setViewX(prev => Math.max(10, Math.min(40, prev + moveX)));
        setViewY(prev => Math.max(10, Math.min(40, prev + moveY)));
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
  };

  // Handlers de touch para mobile (pinça para zoom e arrasto)
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      // Um dedo - arrastar
      setIsDragging(true);
      setDragStart({ 
        x: e.touches[0].clientX, 
        y: e.touches[0].clientY 
      });
    } else if (e.touches.length === 2) {
      // Dois dedos - pinça para zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      setLastTouchDistance(distance);
      setIsDragging(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    if (e.touches.length === 1 && isDragging) {
      // Arrastar com um dedo
      const deltaX = e.touches[0].clientX - dragStart.x;
      const deltaY = e.touches[0].clientY - dragStart.y;
      
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        const cellSize = 35 * zoom;
        const moveX = Math.round(-deltaX / cellSize);
        const moveY = Math.round(-deltaY / cellSize);
        
        if (moveX !== 0 || moveY !== 0) {
          setViewX(prev => Math.max(10, Math.min(40, prev + moveX)));
          setViewY(prev => Math.max(10, Math.min(40, prev + moveY)));
          setDragStart({ 
            x: e.touches[0].clientX, 
            y: e.touches[0].clientY 
          });
        }
      }
    } else if (e.touches.length === 2) {
      // Pinça para zoom com dois dedos
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      if (lastTouchDistance > 0) {
        const delta = (distance - lastTouchDistance) / 100;
        setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
      }
      
      setLastTouchDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setLastTouchDistance(0);
  };

  const handleCanvasClick = async (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) return; // NÃ£o abrir modal se estava arrastando
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cellSize = 35 * zoom; // Usar zoom no cálculo
    const landX = Math.floor(x / cellSize) + (viewX - Math.floor(viewSize / 2));
    const landY = Math.floor(y / cellSize) + (viewY - Math.floor(viewSize / 2));

    // Primeiro tentar encontrar nos terrenos carregados
    const landId = `land_${landX}_${landY}`;
    let land = lands.find(l => l.id === landId);
    
    // Se não encontrar, tentar buscar do Firestore
    if (!land) {
      try {
        land = await getLand(landId);
      } catch (error) {
        console.log('Terreno não encontrado no Firestore, usando dados locais');
      }
    }
    
    if (land) {
      setSelectedLand(land);
      setShowLandDetail(true);
    }
  };

  // Handler para touch/tap no canvas
  const handleCanvasTouchEnd = async (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isDragging || e.touches.length > 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.changedTouches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const cellSize = 35 * zoom;
    const landX = Math.floor(x / cellSize) + (viewX - Math.floor(viewSize / 2));
    const landY = Math.floor(y / cellSize) + (viewY - Math.floor(viewSize / 2));

    const landId = `land_${landX}_${landY}`;
    let land = lands.find(l => l.id === landId);
    
    if (!land) {
      try {
        land = await getLand(landId);
      } catch (error) {
        console.log('Terreno não encontrado');
      }
    }
    
    if (land) {
      setSelectedLand(land);
      setShowLandDetail(true);
    }
  };

  const handleMove = (dx: number, dy: number) => {
    setViewX(prev => Math.max(10, Math.min(40, prev + dx)));
    setViewY(prev => Math.max(10, Math.min(40, prev + dy)));
  };

  const handleListLand = async () => {
    if (!selectedLand || listingPrice <= 0) return;
    
    try {
      setLoading(true);
      await listLandForSale(selectedLand.id, uid, listingPrice, listingDescription, listingDuration);
      alert(`Terreno listado com sucesso! A listagem expira em ${listingDuration} dias.`);
      setShowListingModal(false);
      setListingPrice(0);
      setListingDescription('');
      setListingDuration(7);
      loadUserLands();
      loadVisibleLands();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddResident = async () => {
    if (!selectedLand || !newResidentUsername.trim()) return;
    
    try {
      setLoading(true);
      await addLandResident(
        selectedLand.id,
        uid,
        newResidentUsername, // Em produção, buscar userId real
        newResidentUsername,
        { canBuild: false, canInvite: false }
      );
      alert('Morador adicionado com sucesso!');
      setNewResidentUsername('');
      setShowResidentModal(false);
      const updatedLand = await getLand(selectedLand.id);
      if (updatedLand) setSelectedLand(updatedLand);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveResident = async (residentId: string) => {
    if (!selectedLand) return;
    
    try {
      setLoading(true);
      await removeLandResident(selectedLand.id, uid, residentId);
      const updatedLand = await getLand(selectedLand.id);
      if (updatedLand) setSelectedLand(updatedLand);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyLand = async (listingId: string, price: number) => {
    if (userCoins < price) {
      alert('Moedas insuficientes!');
      return;
    }

    try {
      setLoading(true);
      await buyLandFromMarketplace(listingId, uid, username);
      onPurchase(price);
      alert('Terreno comprado com sucesso!');
      loadMarketplace();
      loadUserLands();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeOffer = async () => {
    if (!selectedLand || offerAmount <= 0) {
      alert('Valor da oferta inválido!');
      return;
    }

    if (userCoins < offerAmount) {
      alert('Você não tem moedas suficientes para fazer esta oferta!');
      return;
    }

    try {
      setLoading(true);
      // Buscar listingId
      const listings = await getActiveLandListings(1000);
      const listing = listings.find(l => l.land.id === selectedLand.id);
      
      if (!listing) {
        alert('Terreno não está listado no marketplace!');
        return;
      }

      await makeLandOffer(selectedLand.id, listing.id, uid, username, offerAmount, offerMessage);
      alert('Oferta enviada com sucesso!');
      setShowOfferModal(false);
      setOfferAmount(0);
      setOfferMessage('');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOffer = async (offerId: string) => {
    if (!confirm('Deseja aceitar esta oferta? O terreno serÃ¡ transferido imediatamente.')) {
      return;
    }

    try {
      setLoading(true);
      await acceptLandOffer(offerId, uid);
      alert('Oferta aceita! Terreno transferido com sucesso.');
      setShowOffersModal(false);
      loadUserLands();
      loadMarketplace();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    const reason = prompt('Motivo da recusa (opcional):');
    
    try {
      setLoading(true);
      await rejectLandOffer(offerId, uid, reason || undefined);
      alert('Oferta recusada.');
      loadLandOffers();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadLandOffers = async () => {
    if (!selectedLand) return;
    
    try {
      const offers = await getLandOffers(selectedLand.id);
      setLandOffers(offers);
    } catch (error) {
      console.error('Erro ao carregar ofertas:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('map')}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === 'map'
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          🗺️ Mapa Mundial
        </button>
        <button
          onClick={() => setActiveTab('mylands')}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === 'mylands'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          🏠 Meus Terrenos ({userLands.length})
        </button>
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === 'marketplace'
              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          🏪 Marketplace ({marketListings.length})
        </button>
      </div>

      {/* Conteúdo */}
      {activeTab === 'map' && (
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex justify-center items-center mb-6">
            <h2 className="text-3xl font-bold text-white">
              🗺️ Mapa Mundial de FarmCoin
            </h2>
          </div>

          {/* Canvas do mapa */}
          <div className="flex justify-center mb-6">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="border-4 border-gray-600 rounded-lg cursor-pointer shadow-2xl max-w-full h-auto"
              style={{ maxHeight: '70vh' }}
            />
          </div>

          {/* Legenda */}
          <div className="mt-4">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              ï¿½ Legenda dos Alfinetes
              <span className="text-sm text-gray-400 font-normal">(clique nos alfinetes para ver detalhes)</span>
            </h3>
            
            {/* Legenda de alfinetes */}
            <div className="bg-gray-700 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-lg"></div>
                  <span className="text-white font-semibold">🔴 Terreno à Venda</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-400 border-2 border-white shadow-lg"></div>
                  <span className="text-white font-semibold">🟡 Seus Terrenos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-pink-500 border-2 border-white shadow-lg"></div>
                  <span className="text-white font-semibold">🌟 Mítico (Paraíso)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-400 border-2 border-white shadow-lg"></div>
                  <span className="text-white font-semibold">⭐ LendÃ¡rio (Geleira)</span>
                </div>
              </div>
            </div>

            <h3 className="text-white font-bold mb-3">🗺️ Tipos de Terrenos por Raridade</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
              {Object.entries(landEmojis).map(([type, emoji]) => {
                const rarity = getLandRarity(type as LandType);
                const bonuses = getLandBonuses(type as LandType);
                return (
                  <div 
                    key={type} 
                    className="bg-gray-700 px-3 py-2 rounded-lg border-2"
                    style={{ borderColor: rarityColors[rarity] }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{emoji}</span>
                      <div className="text-sm flex-1">
                        <div className="text-white font-semibold">{landNames[type as LandType]}</div>
                        <div 
                          className="text-xs font-bold"
                          style={{ color: rarityColors[rarity] }}
                        >
                          {rarity}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {bonuses.length > 0 && (
                        <div>
                          Bônus: {bonuses.map(b => `+${((b.multiplier - 1) * 100).toFixed(0)}%`).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tabela de Preços por Raridade */}
            <div className="bg-gradient-to-r from-yellow-900 to-orange-900 p-4 rounded-lg mt-4">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                💎 Preços Base dos Terrenos por Raridade
              </h3>
              <div className="text-gray-200 text-sm mb-3">
                Os terrenos são os itens mais valiosos do FarmCoin! O preço final varia de acordo com o bônus de renda e tamanho.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {Object.entries(landBasePrices).map(([rarity, price]) => (
                  <div 
                    key={rarity}
                    className="bg-black bg-opacity-40 p-3 rounded-lg border-2"
                    style={{ 
                      borderColor: rarityColors[rarity as LandRarity],
                      boxShadow: rarityGlow[rarity as LandRarity]
                    }}
                  >
                    <div 
                      className="font-bold mb-1"
                      style={{ color: rarityColors[rarity as LandRarity] }}
                    >
                      {rarity}
                    </div>
                    <div className="text-yellow-400 font-bold text-lg">
                      {price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-gray-400 text-xs">moedas (preço base)</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-gray-300 text-sm bg-black bg-opacity-30 p-2 rounded">
                💡 <strong>Dica:</strong> Terrenos com maior raridade têm bônus mais altos e geram mais renda passiva!
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mylands' && (
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            🏠 Meus Terrenos ({userLands.length})
          </h2>
          
          {userLands.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Você ainda não possui terrenos</p>
              <p className="text-sm">Explore o mapa ou visite o marketplace!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userLands.map(land => (
                <div
                  key={land.id}
                  className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 cursor-pointer transition-all"
                  onClick={() => { setSelectedLand(land); setShowLandDetail(true); }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl">{landEmojis[land.type]}</span>
                    <div>
                      <div className="text-white font-bold">
                        {land.name || `${landNames[land.type]} (${land.coordinates.x}, ${land.coordinates.y})`}
                      </div>
                      <div className="text-sm text-gray-400">
                        RegiÃ£o: {land.coordinates.region}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-green-400">
                      <TrendingUp className="w-4 h-4 inline mr-1" />
                      +{land.bonusIncome}%
                    </div>
                    <div className="text-blue-400">
                      <Users className="w-4 h-4 inline mr-1" />
                      {land.residents.length}/{land.maxResidents}
                    </div>
                  </div>
                  {land.forSale && (
                    <div className="mt-2 text-yellow-400 text-sm font-bold">
                      🏷️ À venda: {land.salePrice?.toLocaleString()} moedas
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'marketplace' && (
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            🏪 Marketplace de Terrenos ({marketListings.length})
          </h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-400"></div>
            </div>
          ) : marketListings.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Nenhum terreno à venda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketListings.map(listing => (
                <div key={listing.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl">{landEmojis[listing.land.type]}</span>
                    <div>
                      <div className="text-white font-bold">
                        {landNames[listing.land.type]}
                      </div>
                      <div className="text-sm text-gray-400">
                        ({listing.land.coordinates.x}, {listing.land.coordinates.y})
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-300 mb-2">
                    Vendedor: {listing.sellerUsername}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm mb-3">
                    <div className="text-green-400">
                      <TrendingUp className="w-4 h-4 inline mr-1" />
                      +{listing.land.bonusIncome}%
                    </div>
                    <div className="text-blue-400">
                      Tamanho: {listing.land.size}
                    </div>
                  </div>
                  
                  {listing.description && (
                    <p className="text-sm text-gray-400 mb-3">{listing.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="text-yellow-400 font-bold text-lg">
                      💰 {listing.price.toLocaleString()}
                    </div>
                    <button
                      onClick={() => handleBuyLand(listing.id, listing.price)}
                      disabled={loading || userCoins < listing.price}
                      className={`px-4 py-2 rounded-lg font-bold transition-all ${
                        userCoins >= listing.price
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal de detalhes do terreno */}
      {showLandDetail && selectedLand && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className="text-5xl">{landEmojis[selectedLand.type]}</span>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedLand.name || landNames[selectedLand.type]}
                  </h3>
                  <p className="text-gray-400">
                    Coordenadas: ({selectedLand.coordinates.x}, {selectedLand.coordinates.y})
                  </p>
                  {/* Badge de Raridade */}
                  <div className="mt-2 flex items-center gap-2">
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-bold"
                      style={{ 
                        backgroundColor: rarityColors[getLandRarity(selectedLand.type)] + '40',
                        color: rarityColors[getLandRarity(selectedLand.type)],
                        boxShadow: rarityGlow[getLandRarity(selectedLand.type)]
                      }}
                    >
                      <Star className="w-4 h-4 inline mr-1" />
                      {getLandRarity(selectedLand.type)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowLandDetail(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="text-gray-400 text-sm">Tipo</div>
                <div className="text-white font-bold">{landNames[selectedLand.type]}</div>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="text-gray-400 text-sm">RegiÃ£o</div>
                <div className="text-white font-bold capitalize">{selectedLand.coordinates.region}</div>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="text-gray-400 text-sm">Bônus de Renda</div>
                <div className="text-green-400 font-bold">+{selectedLand.bonusIncome}%</div>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="text-gray-400 text-sm">Tamanho</div>
                <div className="text-white font-bold">{selectedLand.size} unidades</div>
              </div>
            </div>

            {/* Bônus Especiais do Terreno */}
            <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-4 rounded-lg mb-4">
              <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Bônus Especiais ({getLandRarity(selectedLand.type)})
              </h4>
              <div className="space-y-2">
                {getLandBonuses(selectedLand.type).map((bonus, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-black bg-opacity-30 p-2 rounded">
                    <span className="text-gray-200 capitalize">
                      {bonus.category === 'plantacoes' && '🌾 PlantaÃ§Ãµes'}
                      {bonus.category === 'animais' && '🐄 Animais'}
                      {bonus.category === 'industria' && '🏭 Indústria'}
                      {bonus.category === 'maquinario' && '🚜 Maquinário'}
                      {bonus.category === 'comercio' && '💼 Comércio'}
                      {bonus.category === 'especiais' && '⭐ Especiais'}
                    </span>
                    <span className="text-green-400 font-bold">
                      +{((bonus.multiplier - 1) * 100).toFixed(0)}% de renda
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-gray-300 text-sm">
                💡 Estes bônus são aplicados automaticamente aos itens produzidos neste terreno!
              </div>
            </div>

            {selectedLand.ownerId && (
              <div className="bg-gray-700 p-4 rounded-lg mb-4">
                <div className="text-gray-400 text-sm mb-1">ProprietÃ¡rio</div>
                <div className="text-white font-bold">
                  👑 {selectedLand.ownerUsername}
                  {selectedLand.ownerId === uid && (
                    <span className="ml-2 text-yellow-400">(Você)</span>
                  )}
                </div>
                {selectedLand.purchasePrice && (
                  <div className="text-gray-400 text-sm mt-1">
                    Comprado por: {selectedLand.purchasePrice.toLocaleString()} moedas
                  </div>
                )}
              </div>
            )}

            {/* Moradores */}
            {selectedLand.ownerId === uid && (
              <div className="bg-gray-700 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-white font-bold">
                    👥 Moradores ({selectedLand.residents.length}/{selectedLand.maxResidents})
                  </h4>
                  <button
                    onClick={() => setShowResidentModal(true)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <Plus className="w-4 h-4 inline mr-1" />
                    Adicionar
                  </button>
                </div>
                
                {selectedLand.residents.length === 0 ? (
                  <p className="text-gray-400 text-sm">Nenhum morador ainda</p>
                ) : (
                  <div className="space-y-2">
                    {selectedLand.residents.map((resident, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-600 p-2 rounded">
                        <span className="text-white">{resident.username}</span>
                        <button
                          onClick={() => handleRemoveResident(resident.userId)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* AÃ§Ãµes */}
            <div className="space-y-3">
              {/* Se o terreno não tem dono - mostrar botÃ£o de compra */}
              {!selectedLand.ownerId && (
                <div className="bg-gradient-to-r from-yellow-900 to-orange-900 p-4 rounded-lg">
                  <div className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                    💰 Terreno Disponível para Compra
                  </div>
                  <div className="text-gray-200 text-sm mb-3">
                    Este terreno está disponível e pode ser seu! Os terrenos são os itens mais valiosos do FarmCoin.
                  </div>
                  <div className="bg-black bg-opacity-40 p-3 rounded-lg mb-3">
                    <div className="text-gray-300 text-sm mb-1">Preço:</div>
                    <div className="text-yellow-400 font-bold text-2xl">
                      💎 {calculateLandPrice(selectedLand).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} moedas
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      Raridade: {getLandRarity(selectedLand.type)} | Bônus: +{selectedLand.bonusIncome}%
                    </div>
                  </div>
                  <button
                    onClick={handlePurchaseLand}
                    disabled={loading || userCoins < calculateLandPrice(selectedLand)}
                    className={`w-full px-6 py-4 rounded-lg font-bold text-lg transition-all ${
                      userCoins >= calculateLandPrice(selectedLand)
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-2xl hover:scale-105'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {loading ? '⏳ Processando...' : userCoins >= calculateLandPrice(selectedLand) ? '✅ Comprar Terreno' : '❌ Moedas Insuficientes'}
                  </button>
                  {userCoins < calculateLandPrice(selectedLand) && (
                    <div className="text-red-400 text-sm mt-2 text-center">
                      Você precisa de mais {(calculateLandPrice(selectedLand) - userCoins).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} moedas
                    </div>
                  )}
                </div>
              )}
              
              {/* Se você é o dono - mostrar opÃ§Ã£o de vender */}
              {selectedLand.ownerId === uid && !selectedLand.forSale && (
                <button
                  onClick={() => setShowListingModal(true)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg"
                >
                  🏷️ Colocar à Venda
                </button>
              )}
              
              {/* Se o terreno está à venda e você não é o dono */}
              {selectedLand.forSale && selectedLand.ownerId !== uid && (
                <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-4 rounded-lg">
                  <div className="text-white font-bold text-lg mb-2">
                    🏷️ À Venda no Marketplace
                  </div>
                  <div className="text-gray-200 text-sm mb-3">
                    Este terreno está listado no marketplace. Visite a aba Marketplace para mais detalhes e ofertas.
                  </div>
                  <button
                    onClick={() => setActiveTab('marketplace')}
                    className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700"
                  >
                    Ver no Marketplace
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal adicionar morador */}
      {showResidentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Adicionar Morador</h3>
            <input
              type="text"
              value={newResidentUsername}
              onChange={(e) => setNewResidentUsername(e.target.value)}
              placeholder="Nome de usuário"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddResident}
                disabled={loading || !newResidentUsername.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600"
              >
                Adicionar
              </button>
              <button
                onClick={() => { setShowResidentModal(false); setNewResidentUsername(''); }}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal listar para venda */}
      {showListingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Listar Terreno para Venda</h3>
            <div className="mb-4">
              <label className="block text-white mb-2">Preço</label>
              <input
                type="number"
                value={listingPrice || ''}
                onChange={(e) => setListingPrice(Number(e.target.value))}
                placeholder="0"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">Descrição (opcional)</label>
              <textarea
                value={listingDescription}
                onChange={(e) => setListingDescription(e.target.value)}
                placeholder="Descreva seu terreno..."
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg h-24"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleListLand}
                disabled={loading || listingPrice <= 0}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-600"
              >
                Listar
              </button>
              <button
                onClick={() => { setShowListingModal(false); setListingPrice(0); setListingDescription(''); }}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;

