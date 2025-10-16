import { Upgrade } from '../types';
import { calculateTier } from '../utils/tierSystem';

export const upgrades: Upgrade[] = [
  // 🌱 Plantação Básica (10 upgrades)
  {
    id: 'plant_01',
    name: 'Enxada Manual',
    description: 'Uma enxada simples para cultivar a terra',
    category: 'Plantação Básica',
    baseCost: 15,
    costMultiplier: 1.15,
    baseIncome: 0.1,
    incomeMultiplier: 1.1,
    icon: '🌱',
    tier: calculateTier(15)
  },
  {
    id: 'plant_02',
    name: 'Sementes de Trigo',
    description: 'Sementes básicas de trigo',
    category: 'Plantação Básica',
    baseCost: 100,
    costMultiplier: 1.15,
    baseIncome: 1,
    incomeMultiplier: 1.1,
    icon: '🌾',
    tier: calculateTier(100)
  },
  {
    id: 'plant_03',
    name: 'Regador Automático',
    description: 'Sistema básico de irrigação',
    category: 'Plantação Básica',
    baseCost: 500,
    costMultiplier: 1.15,
    baseIncome: 5,
    incomeMultiplier: 1.1,
    icon: '💧',
    tier: calculateTier(500)
  },
  {
    id: 'plant_04',
    name: 'Estufa Pequena',
    description: 'Protege as plantas do clima',
    category: 'Plantação Básica',
    baseCost: 3000,
    costMultiplier: 1.15,
    baseIncome: 30,
    incomeMultiplier: 1.1,
    icon: '🏠',
    tier: calculateTier(3000)
  },
  {
    id: 'plant_05',
    name: 'Fertilizante Orgânico',
    description: 'Aumenta a produtividade',
    category: 'Plantação Básica',
    baseCost: 10000,
    costMultiplier: 1.15,
    baseIncome: 100,
    incomeMultiplier: 1.1,
    icon: '🌿',
    tier: calculateTier(10000)
  },
  {
    id: 'plant_06',
    name: 'Trator Pequeno',
    description: 'Acelera o cultivo',
    category: 'Plantação Básica',
    baseCost: 40000,
    costMultiplier: 1.15,
    baseIncome: 400,
    incomeMultiplier: 1.1,
    icon: '🚜',
    tier: calculateTier(40000)
  },
  {
    id: 'plant_07',
    name: 'Sistema de Drenagem',
    description: 'Evita alagamentos',
    category: 'Plantação Básica',
    baseCost: 200000,
    costMultiplier: 1.15,
    baseIncome: 2000,
    incomeMultiplier: 1.1,
    icon: '🌊',
    tier: calculateTier(200000)
  },
  {
    id: 'plant_08',
    name: 'Estufa Climatizada',
    description: 'Controle total do ambiente',
    category: 'Plantação Básica',
    baseCost: 1000000,
    costMultiplier: 1.15,
    baseIncome: 10000,
    incomeMultiplier: 1.1,
    icon: '🏭',
    tier: calculateTier(1000000)
  },
  {
    id: 'plant_09',
    name: 'Sementes Híbridas',
    description: 'Maior rendimento por hectare',
    category: 'Plantação Básica',
    baseCost: 5000000,
    costMultiplier: 1.15,
    baseIncome: 50000,
    incomeMultiplier: 1.1,
    icon: '🧬',
    tier: calculateTier(5000000)
  },
  {
    id: 'plant_10',
    name: 'Fazenda Automatizada',
    description: 'Produção em larga escala',
    category: 'Plantação Básica',
    baseCost: 25000000,
    costMultiplier: 1.15,
    baseIncome: 250000,
    incomeMultiplier: 1.1,
    icon: '🤖',
    tier: calculateTier(25000000)
  },

  // 🐄 Criação de Gado (11 upgrades)
  {
    id: 'cattle_01',
    name: 'Galinha Caipira',
    description: 'Põe ovos frescos',
    category: 'Criação de Gado',
    baseCost: 50,
    costMultiplier: 1.15,
    baseIncome: 0.5,
    incomeMultiplier: 1.1,
    icon: '🐔',
    tier: calculateTier(50)
  },
  {
    id: 'cattle_02',
    name: 'Porco',
    description: 'Fonte de carne',
    category: 'Criação de Gado',
    baseCost: 300,
    costMultiplier: 1.15,
    baseIncome: 3,
    incomeMultiplier: 1.1,
    icon: '🐷',
    tier: calculateTier(300)
  },
  {
    id: 'cattle_03',
    name: 'Vaca Leiteira',
    description: 'Produz leite diariamente',
    category: 'Criação de Gado',
    baseCost: 1500,
    costMultiplier: 1.15,
    baseIncome: 15,
    incomeMultiplier: 1.1,
    icon: '🐄',
    tier: calculateTier(1500)
  },
  {
    id: 'cattle_04',
    name: 'Ovelha',
    description: 'Fornece lã',
    category: 'Criação de Gado',
    baseCost: 8000,
    costMultiplier: 1.15,
    baseIncome: 80,
    incomeMultiplier: 1.1,
    icon: '🐑',
    tier: calculateTier(8000)
  },
  {
    id: 'cattle_05',
    name: 'Cabra',
    description: 'Leite de cabra premium',
    category: 'Criação de Gado',
    baseCost: 35000,
    costMultiplier: 1.15,
    baseIncome: 350,
    incomeMultiplier: 1.1,
    icon: '🐐',
    tier: calculateTier(35000)
  },
  {
    id: 'cattle_06',
    name: 'Pato',
    description: 'Ovos maiores',
    category: 'Criação de Gado',
    baseCost: 150000,
    costMultiplier: 1.15,
    baseIncome: 1500,
    incomeMultiplier: 1.1,
    icon: '🦆',
    tier: calculateTier(150000)
  },
  {
    id: 'cattle_07',
    name: 'Peru',
    description: 'Carne especial',
    category: 'Criação de Gado',
    baseCost: 700000,
    costMultiplier: 1.15,
    baseIncome: 7000,
    incomeMultiplier: 1.1,
    icon: '🦃',
    tier: calculateTier(700000)
  },
  {
    id: 'cattle_08',
    name: 'Cavalo',
    description: 'Ajuda no transporte',
    category: 'Criação de Gado',
    baseCost: 3500000,
    costMultiplier: 1.15,
    baseIncome: 35000,
    incomeMultiplier: 1.1,
    icon: '🐴',
    tier: calculateTier(3500000)
  },
  {
    id: 'cattle_09',
    name: 'Alpaca',
    description: 'Lã premium',
    category: 'Criação de Gado',
    baseCost: 15000000,
    costMultiplier: 1.15,
    baseIncome: 150000,
    incomeMultiplier: 1.1,
    icon: '🦙',
    tier: calculateTier(15000000)
  },
  {
    id: 'cattle_10',
    name: 'Búfalo',
    description: 'Leite e carne de búfalo',
    category: 'Criação de Gado',
    baseCost: 75000000,
    costMultiplier: 1.15,
    baseIncome: 750000,
    incomeMultiplier: 1.1,
    icon: '🐃',
    tier: calculateTier(75000000)
  },
  {
    id: 'cattle_11',
    name: 'Granja Industrial',
    description: 'Produção em massa',
    category: 'Criação de Gado',
    baseCost: 350000000,
    costMultiplier: 1.15,
    baseIncome: 3500000,
    incomeMultiplier: 1.1,
    icon: '🏭',
    tier: calculateTier(350000000)
  },

  // 🍎 Pomar (11 upgrades)
  {
    id: 'orchard_01',
    name: 'Pé de Maçã',
    description: 'Maçãs frescas',
    category: 'Pomar',
    baseCost: 200,
    costMultiplier: 1.15,
    baseIncome: 2,
    incomeMultiplier: 1.1,
    icon: '🍎',
    tier: calculateTier(200)
  },
  {
    id: 'orchard_02',
    name: 'Laranjeira',
    description: 'Laranjas suculentas',
    category: 'Pomar',
    baseCost: 1000,
    costMultiplier: 1.15,
    baseIncome: 10,
    incomeMultiplier: 1.1,
    icon: '🍊',
    tier: calculateTier(1000)
  },
  {
    id: 'orchard_03',
    name: 'Bananeira',
    description: 'Cachos de banana',
    category: 'Pomar',
    baseCost: 5000,
    costMultiplier: 1.15,
    baseIncome: 50,
    incomeMultiplier: 1.1,
    icon: '🍌',
    tier: calculateTier(5000)
  },
  {
    id: 'orchard_04',
    name: 'Mangueira',
    description: 'Mangas doces',
    category: 'Pomar',
    baseCost: 25000,
    costMultiplier: 1.15,
    baseIncome: 250,
    incomeMultiplier: 1.1,
    icon: '🥭',
    tier: calculateTier(25000)
  },
  {
    id: 'orchard_05',
    name: 'Abacateiro',
    description: 'Abacates cremosos',
    category: 'Pomar',
    baseCost: 120000,
    costMultiplier: 1.15,
    baseIncome: 1200,
    incomeMultiplier: 1.1,
    icon: '🥑',
    tier: calculateTier(120000)
  },
  {
    id: 'orchard_06',
    name: 'Pessegueiro',
    description: 'Pêssegos suaves',
    category: 'Pomar',
    baseCost: 600000,
    costMultiplier: 1.15,
    baseIncome: 6000,
    incomeMultiplier: 1.1,
    icon: '🍑',
    tier: calculateTier(600000)
  },
  {
    id: 'orchard_07',
    name: 'Cerejeira',
    description: 'Cerejas raras',
    category: 'Pomar',
    baseCost: 3000000,
    costMultiplier: 1.15,
    baseIncome: 30000,
    incomeMultiplier: 1.1,
    icon: '🍒',
    tier: calculateTier(3000000)
  },
  {
    id: 'orchard_08',
    name: 'Limoeiro',
    description: 'Limões azedos',
    category: 'Pomar',
    baseCost: 15000000,
    costMultiplier: 1.15,
    baseIncome: 150000,
    incomeMultiplier: 1.1,
    icon: '🍋',
    tier: calculateTier(15000000)
  },
  {
    id: 'orchard_09',
    name: 'Coqueiro',
    description: 'Cocos tropicais',
    category: 'Pomar',
    baseCost: 75000000,
    costMultiplier: 1.15,
    baseIncome: 750000,
    incomeMultiplier: 1.1,
    icon: '🥥',
    tier: calculateTier(75000000)
  },
  {
    id: 'orchard_10',
    name: 'Jabuticabeira',
    description: 'Jabuticabas exóticas',
    category: 'Pomar',
    baseCost: 400000000,
    costMultiplier: 1.15,
    baseIncome: 4000000,
    incomeMultiplier: 1.1,
    icon: '🍇',
    tier: calculateTier(400000000)
  },
  {
    id: 'orchard_11',
    name: 'Pomar Hidropônico',
    description: 'Frutas o ano todo',
    category: 'Pomar',
    baseCost: 2000000000,
    costMultiplier: 1.15,
    baseIncome: 20000000,
    incomeMultiplier: 1.1,
    icon: '🌳',
    tier: calculateTier(2000000000)
  },

  // 🐝 Apicultura (11 upgrades)
  {
    id: 'bee_01',
    name: 'Colmeia Simples',
    description: 'Primeira produção de mel',
    category: 'Apicultura',
    baseCost: 400,
    costMultiplier: 1.15,
    baseIncome: 4,
    incomeMultiplier: 1.1,
    icon: '🐝',
    tier: calculateTier(400)
  },
  {
    id: 'bee_02',
    name: 'Abelha Rainha',
    description: 'Aumenta a colônia',
    category: 'Apicultura',
    baseCost: 2000,
    costMultiplier: 1.15,
    baseIncome: 20,
    incomeMultiplier: 1.1,
    icon: '👑',
    tier: calculateTier(2000)
  },
  {
    id: 'bee_03',
    name: 'Extrator de Mel',
    description: 'Coleta eficiente',
    category: 'Apicultura',
    baseCost: 10000,
    costMultiplier: 1.15,
    baseIncome: 100,
    incomeMultiplier: 1.1,
    icon: '🍯',
    tier: calculateTier(10000)
  },
  {
    id: 'bee_04',
    name: 'Flores Silvestres',
    description: 'Néctar abundante',
    category: 'Apicultura',
    baseCost: 50000,
    costMultiplier: 1.15,
    baseIncome: 500,
    incomeMultiplier: 1.1,
    icon: '🌸',
    tier: calculateTier(50000)
  },
  {
    id: 'bee_05',
    name: 'Colmeia Profissional',
    description: 'Maior produção',
    category: 'Apicultura',
    baseCost: 250000,
    costMultiplier: 1.15,
    baseIncome: 2500,
    incomeMultiplier: 1.1,
    icon: '📦',
    tier: calculateTier(250000)
  },
  {
    id: 'bee_06',
    name: 'Mel Orgânico',
    description: 'Produto premium',
    category: 'Apicultura',
    baseCost: 1200000,
    costMultiplier: 1.15,
    baseIncome: 12000,
    incomeMultiplier: 1.1,
    icon: '✨',
    tier: calculateTier(1200000)
  },
  {
    id: 'bee_07',
    name: 'Própolis',
    description: 'Subproduto valioso',
    category: 'Apicultura',
    baseCost: 6000000,
    costMultiplier: 1.15,
    baseIncome: 60000,
    incomeMultiplier: 1.1,
    icon: '💊',
    tier: calculateTier(6000000)
  },
  {
    id: 'bee_08',
    name: 'Geleia Real',
    description: 'Produto raro',
    category: 'Apicultura',
    baseCost: 30000000,
    costMultiplier: 1.15,
    baseIncome: 300000,
    incomeMultiplier: 1.1,
    icon: '👑',
    tier: calculateTier(30000000)
  },
  {
    id: 'bee_09',
    name: 'Apiário Industrial',
    description: 'Centenas de colmeias',
    category: 'Apicultura',
    baseCost: 150000000,
    costMultiplier: 1.15,
    baseIncome: 1500000,
    incomeMultiplier: 1.1,
    icon: '🏭',
    tier: calculateTier(150000000)
  },
  {
    id: 'bee_10',
    name: 'Abelha Geneticamente Melhorada',
    description: 'Produção dobrada',
    category: 'Apicultura',
    baseCost: 750000000,
    costMultiplier: 1.15,
    baseIncome: 7500000,
    incomeMultiplier: 1.1,
    icon: '🧬',
    tier: calculateTier(750000000)
  },
  {
    id: 'bee_11',
    name: 'Império do Mel',
    description: 'Monopoliza o mercado',
    category: 'Apicultura',
    baseCost: 4000000000,
    costMultiplier: 1.15,
    baseIncome: 40000000,
    incomeMultiplier: 1.1,
    icon: '🏰',
    tier: calculateTier(4000000000)
  },

  // 🎣 Piscicultura (11 upgrades)
  {
    id: 'fish_01',
    name: 'Aquário Pequeno',
    description: 'Primeiros peixes',
    category: 'Piscicultura',
    baseCost: 800,
    costMultiplier: 1.15,
    baseIncome: 8,
    incomeMultiplier: 1.1,
    icon: '🐠',
    tier: calculateTier(800)
  },
  {
    id: 'fish_02',
    name: 'Tanque de Tilápia',
    description: 'Criação básica',
    category: 'Piscicultura',
    baseCost: 4000,
    costMultiplier: 1.15,
    baseIncome: 40,
    incomeMultiplier: 1.1,
    icon: '🐟',
    tier: calculateTier(4000)
  },
  {
    id: 'fish_03',
    name: 'Lagoa de Carpa',
    description: 'Peixes ornamentais',
    category: 'Piscicultura',
    baseCost: 20000,
    costMultiplier: 1.15,
    baseIncome: 200,
    incomeMultiplier: 1.1,
    icon: '🎏',
    tier: calculateTier(20000)
  },
  {
    id: 'fish_04',
    name: 'Viveiro de Camarões',
    description: 'Crustáceos premium',
    category: 'Piscicultura',
    baseCost: 100000,
    costMultiplier: 1.15,
    baseIncome: 1000,
    incomeMultiplier: 1.1,
    icon: '🦐',
    tier: calculateTier(100000)
  },
  {
    id: 'fish_05',
    name: 'Tanque de Salmão',
    description: 'Peixe nobre',
    category: 'Piscicultura',
    baseCost: 500000,
    costMultiplier: 1.15,
    baseIncome: 5000,
    incomeMultiplier: 1.1,
    icon: '🐡',
    tier: calculateTier(500000)
  },
  {
    id: 'fish_06',
    name: 'Criação de Trutas',
    description: 'Água fria',
    category: 'Piscicultura',
    baseCost: 2500000,
    costMultiplier: 1.15,
    baseIncome: 25000,
    incomeMultiplier: 1.1,
    icon: '🎣',
    tier: calculateTier(2500000)
  },
  {
    id: 'fish_07',
    name: 'Fazenda de Ostras',
    description: 'Pérolas ocasionais',
    category: 'Piscicultura',
    baseCost: 12000000,
    costMultiplier: 1.15,
    baseIncome: 120000,
    incomeMultiplier: 1.1,
    icon: '🦪',
    tier: calculateTier(12000000)
  },
  {
    id: 'fish_08',
    name: 'Lagosta Premium',
    description: 'Frutos do mar de luxo',
    category: 'Piscicultura',
    baseCost: 60000000,
    costMultiplier: 1.15,
    baseIncome: 600000,
    incomeMultiplier: 1.1,
    icon: '🦞',
    tier: calculateTier(60000000)
  },
  {
    id: 'fish_09',
    name: 'Aquicultura Marinha',
    description: 'Produção oceânica',
    category: 'Piscicultura',
    baseCost: 300000000,
    costMultiplier: 1.15,
    baseIncome: 3000000,
    incomeMultiplier: 1.1,
    icon: '🌊',
    tier: calculateTier(300000000)
  },
  {
    id: 'fish_10',
    name: 'Caviar de Esturjão',
    description: 'Iguaria rara',
    category: 'Piscicultura',
    baseCost: 1500000000,
    costMultiplier: 1.15,
    baseIncome: 15000000,
    incomeMultiplier: 1.1,
    icon: '⚫',
    tier: calculateTier(1500000000)
  },
  {
    id: 'fish_11',
    name: 'Império Aquático',
    description: 'Domínio dos mares',
    category: 'Piscicultura',
    baseCost: 8000000000,
    costMultiplier: 1.15,
    baseIncome: 80000000,
    incomeMultiplier: 1.1,
    icon: '🏛️',
    tier: calculateTier(8000000000)
  },

  // 🍷 Vinicultura (11 upgrades)
  {
    id: 'wine_01',
    name: 'Videira Jovem',
    description: 'Primeiras uvas',
    category: 'Vinicultura',
    baseCost: 1500,
    costMultiplier: 1.15,
    baseIncome: 15,
    incomeMultiplier: 1.1,
    icon: '🍇',
    tier: calculateTier(1500)
  },
  {
    id: 'wine_02',
    name: 'Barril de Carvalho',
    description: 'Envelhecimento básico',
    category: 'Vinicultura',
    baseCost: 7500,
    costMultiplier: 1.15,
    baseIncome: 75,
    incomeMultiplier: 1.1,
    icon: '🛢️',
    tier: calculateTier(7500)
  },
  {
    id: 'wine_03',
    name: 'Adega Pequena',
    description: 'Armazenamento adequado',
    category: 'Vinicultura',
    baseCost: 35000,
    costMultiplier: 1.15,
    baseIncome: 350,
    incomeMultiplier: 1.1,
    icon: '🏚️',
    tier: calculateTier(35000)
  },
  {
    id: 'wine_04',
    name: 'Vinho Tinto',
    description: 'Clássico atemporal',
    category: 'Vinicultura',
    baseCost: 175000,
    costMultiplier: 1.15,
    baseIncome: 1750,
    incomeMultiplier: 1.1,
    icon: '🍷',
    tier: calculateTier(175000)
  },
  {
    id: 'wine_05',
    name: 'Vinho Branco',
    description: 'Refrescante',
    category: 'Vinicultura',
    baseCost: 850000,
    costMultiplier: 1.15,
    baseIncome: 8500,
    incomeMultiplier: 1.1,
    icon: '🥂',
    tier: calculateTier(850000)
  },
  {
    id: 'wine_06',
    name: 'Champagne',
    description: 'Celebração em garrafa',
    category: 'Vinicultura',
    baseCost: 4000000,
    costMultiplier: 1.15,
    baseIncome: 40000,
    incomeMultiplier: 1.1,
    icon: '🍾',
    tier: calculateTier(4000000)
  },
  {
    id: 'wine_07',
    name: 'Vinho Rosé',
    description: 'Elegância sutil',
    category: 'Vinicultura',
    baseCost: 20000000,
    costMultiplier: 1.15,
    baseIncome: 200000,
    incomeMultiplier: 1.1,
    icon: '🌹',
    tier: calculateTier(20000000)
  },
  {
    id: 'wine_08',
    name: 'Safra Especial',
    description: 'Ano excepcional',
    category: 'Vinicultura',
    baseCost: 100000000,
    costMultiplier: 1.15,
    baseIncome: 1000000,
    incomeMultiplier: 1.1,
    icon: '⭐',
    tier: calculateTier(100000000)
  },
  {
    id: 'wine_09',
    name: 'Vinícola Premiada',
    description: 'Reconhecimento mundial',
    category: 'Vinicultura',
    baseCost: 500000000,
    costMultiplier: 1.15,
    baseIncome: 5000000,
    incomeMultiplier: 1.1,
    icon: '🏆',
    tier: calculateTier(500000000)
  },
  {
    id: 'wine_10',
    name: 'Vinho Centenário',
    description: 'Raridade absoluta',
    category: 'Vinicultura',
    baseCost: 2500000000,
    costMultiplier: 1.15,
    baseIncome: 25000000,
    incomeMultiplier: 1.1,
    icon: '💎',
    tier: calculateTier(2500000000)
  },
  {
    id: 'wine_11',
    name: 'Império Vinícola',
    description: 'Domínio global',
    category: 'Vinicultura',
    baseCost: 12000000000,
    costMultiplier: 1.15,
    baseIncome: 120000000,
    incomeMultiplier: 1.1,
    icon: '👑',
    tier: calculateTier(12000000000)
  },

  // 🧀 Laticínios (11 upgrades)
  {
    id: 'dairy_01',
    name: 'Balde de Leite',
    description: 'Coleta manual',
    category: 'Laticínios',
    baseCost: 600,
    costMultiplier: 1.15,
    baseIncome: 6,
    incomeMultiplier: 1.1,
    icon: '🥛',
    tier: calculateTier(600)
  },
  {
    id: 'dairy_02',
    name: 'Queijo Fresco',
    description: 'Primeira produção',
    category: 'Laticínios',
    baseCost: 3000,
    costMultiplier: 1.15,
    baseIncome: 30,
    incomeMultiplier: 1.1,
    icon: '🧀',
    tier: calculateTier(3000)
  },
  {
    id: 'dairy_03',
    name: 'Manteiga Caseira',
    description: 'Tradicional',
    category: 'Laticínios',
    baseCost: 15000,
    costMultiplier: 1.15,
    baseIncome: 150,
    incomeMultiplier: 1.1,
    icon: '🧈',
    tier: calculateTier(15000)
  },
  {
    id: 'dairy_04',
    name: 'Iogurte Natural',
    description: 'Probióticos',
    category: 'Laticínios',
    baseCost: 75000,
    costMultiplier: 1.15,
    baseIncome: 750,
    incomeMultiplier: 1.1,
    icon: '🥄',
    tier: calculateTier(75000)
  },
  {
    id: 'dairy_05',
    name: 'Queijo Maturado',
    description: 'Sabor intenso',
    category: 'Laticínios',
    baseCost: 375000,
    costMultiplier: 1.15,
    baseIncome: 3750,
    incomeMultiplier: 1.1,
    icon: '🧀',
    tier: calculateTier(375000)
  },
  {
    id: 'dairy_06',
    name: 'Creme de Leite',
    description: 'Consistência perfeita',
    category: 'Laticínios',
    baseCost: 1800000,
    costMultiplier: 1.15,
    baseIncome: 18000,
    incomeMultiplier: 1.1,
    icon: '🍨',
    tier: calculateTier(1800000)
  },
  {
    id: 'dairy_07',
    name: 'Requeijão Cremoso',
    description: 'Especialidade',
    category: 'Laticínios',
    baseCost: 9000000,
    costMultiplier: 1.15,
    baseIncome: 90000,
    incomeMultiplier: 1.1,
    icon: '🥣',
    tier: calculateTier(9000000)
  },
  {
    id: 'dairy_08',
    name: 'Queijo Gourmet',
    description: 'Alta gastronomia',
    category: 'Laticínios',
    baseCost: 45000000,
    costMultiplier: 1.15,
    baseIncome: 450000,
    incomeMultiplier: 1.1,
    icon: '✨',
    tier: calculateTier(45000000)
  },
  {
    id: 'dairy_09',
    name: 'Laticínio Industrial',
    description: 'Produção em massa',
    category: 'Laticínios',
    baseCost: 225000000,
    costMultiplier: 1.15,
    baseIncome: 2250000,
    incomeMultiplier: 1.1,
    icon: '🏭',
    tier: calculateTier(225000000)
  },
  {
    id: 'dairy_10',
    name: 'Queijo Trufado',
    description: 'Iguaria premium',
    category: 'Laticínios',
    baseCost: 1100000000,
    costMultiplier: 1.15,
    baseIncome: 11000000,
    incomeMultiplier: 1.1,
    icon: '💎',
    tier: calculateTier(1100000000)
  },
  {
    id: 'dairy_11',
    name: 'Império dos Laticínios',
    description: 'Marca mundial',
    category: 'Laticínios',
    baseCost: 5500000000,
    costMultiplier: 1.15,
    baseIncome: 55000000,
    incomeMultiplier: 1.1,
    icon: '🌍',
    tier: calculateTier(5500000000)
  },

  // 🌽 Agricultura Industrial (11 upgrades)
  {
    id: 'agro_01',
    name: 'Plantadeira Mecânica',
    description: 'Automatização inicial',
    category: 'Agricultura Industrial',
    baseCost: 5000,
    costMultiplier: 1.15,
    baseIncome: 50,
    incomeMultiplier: 1.1,
    icon: '🚜',
    tier: calculateTier(5000)
  },
  {
    id: 'agro_02',
    name: 'Colheitadeira',
    description: 'Colheita rápida',
    category: 'Agricultura Industrial',
    baseCost: 25000,
    costMultiplier: 1.15,
    baseIncome: 250,
    incomeMultiplier: 1.1,
    icon: '🌾',
    tier: calculateTier(25000)
  },
  {
    id: 'agro_03',
    name: 'Sistema de Irrigação',
    description: 'Água otimizada',
    category: 'Agricultura Industrial',
    baseCost: 125000,
    costMultiplier: 1.15,
    baseIncome: 1250,
    incomeMultiplier: 1.1,
    icon: '💧',
    tier: calculateTier(125000)
  },
  {
    id: 'agro_04',
    name: 'Drone Agrícola',
    description: 'Monitoramento aéreo',
    category: 'Agricultura Industrial',
    baseCost: 625000,
    costMultiplier: 1.15,
    baseIncome: 6250,
    incomeMultiplier: 1.1,
    icon: '🛸',
    tier: calculateTier(625000)
  },
  {
    id: 'agro_05',
    name: 'Sensor IoT',
    description: 'Dados em tempo real',
    category: 'Agricultura Industrial',
    baseCost: 3000000,
    costMultiplier: 1.15,
    baseIncome: 30000,
    incomeMultiplier: 1.1,
    icon: '📡',
    tier: calculateTier(3000000)
  },
  {
    id: 'agro_06',
    name: 'IA para Agricultura',
    description: 'Decisões inteligentes',
    category: 'Agricultura Industrial',
    baseCost: 15000000,
    costMultiplier: 1.15,
    baseIncome: 150000,
    incomeMultiplier: 1.1,
    icon: '🤖',
    tier: calculateTier(15000000)
  },
  {
    id: 'agro_07',
    name: 'Satélite de Observação',
    description: 'Visão global',
    category: 'Agricultura Industrial',
    baseCost: 75000000,
    costMultiplier: 1.15,
    baseIncome: 750000,
    incomeMultiplier: 1.1,
    icon: '🛰️',
    tier: calculateTier(75000000)
  },
  {
    id: 'agro_08',
    name: 'Fazenda Vertical',
    description: 'Espaço otimizado',
    category: 'Agricultura Industrial',
    baseCost: 375000000,
    costMultiplier: 1.15,
    baseIncome: 3750000,
    incomeMultiplier: 1.1,
    icon: '🏢',
    tier: calculateTier(375000000)
  },
  {
    id: 'agro_09',
    name: 'Biotecnologia Avançada',
    description: 'Modificação genética',
    category: 'Agricultura Industrial',
    baseCost: 1800000000,
    costMultiplier: 1.15,
    baseIncome: 18000000,
    incomeMultiplier: 1.1,
    icon: '🧬',
    tier: calculateTier(1800000000)
  },
  {
    id: 'agro_10',
    name: 'Agricultura Espacial',
    description: 'Além da Terra',
    category: 'Agricultura Industrial',
    baseCost: 9000000000,
    costMultiplier: 1.15,
    baseIncome: 90000000,
    incomeMultiplier: 1.1,
    icon: '🚀',
    tier: calculateTier(9000000000)
  },
  {
    id: 'agro_11',
    name: 'Terraformação',
    description: 'Novos mundos cultiváveis',
    category: 'Agricultura Industrial',
    baseCost: 45000000000,
    costMultiplier: 1.15,
    baseIncome: 450000000,
    incomeMultiplier: 1.1,
    icon: '🌍',
    tier: calculateTier(45000000000)
  },

  // 🏭 Processamento (11 upgrades)
  {
    id: 'process_01',
    name: 'Moinho de Grãos',
    description: 'Farinha fresca',
    category: 'Processamento',
    baseCost: 2500,
    costMultiplier: 1.15,
    baseIncome: 25,
    incomeMultiplier: 1.1,
    icon: '⚙️',
    tier: calculateTier(2500)
  },
  {
    id: 'process_02',
    name: 'Fábrica de Ração',
    description: 'Alimento animal',
    category: 'Processamento',
    baseCost: 12000,
    costMultiplier: 1.15,
    baseIncome: 120,
    incomeMultiplier: 1.1,
    icon: '🥫',
    tier: calculateTier(12000)
  },
  {
    id: 'process_03',
    name: 'Enlatadora',
    description: 'Conservação de alimentos',
    category: 'Processamento',
    baseCost: 60000,
    costMultiplier: 1.15,
    baseIncome: 600,
    incomeMultiplier: 1.1,
    icon: '🏭',
    tier: calculateTier(60000)
  },
  {
    id: 'process_04',
    name: 'Linha de Embalagem',
    description: 'Produtos prontos',
    category: 'Processamento',
    baseCost: 300000,
    costMultiplier: 1.15,
    baseIncome: 3000,
    incomeMultiplier: 1.1,
    icon: '📦',
    tier: calculateTier(300000)
  },
  {
    id: 'process_05',
    name: 'Câmara Fria',
    description: 'Preservação ideal',
    category: 'Processamento',
    baseCost: 1500000,
    costMultiplier: 1.15,
    baseIncome: 15000,
    incomeMultiplier: 1.1,
    icon: '❄️',
    tier: calculateTier(1500000)
  },
  {
    id: 'process_06',
    name: 'Fábrica de Suco',
    description: 'Bebidas naturais',
    category: 'Processamento',
    baseCost: 7500000,
    costMultiplier: 1.15,
    baseIncome: 75000,
    incomeMultiplier: 1.1,
    icon: '🧃',
    tier: calculateTier(7500000)
  },
  {
    id: 'process_07',
    name: 'Indústria de Sorvetes',
    description: 'Sobremesas geladas',
    category: 'Processamento',
    baseCost: 37500000,
    costMultiplier: 1.15,
    baseIncome: 375000,
    incomeMultiplier: 1.1,
    icon: '🍦',
    tier: calculateTier(37500000)
  },
  {
    id: 'process_08',
    name: 'Refino de Açúcar',
    description: 'Adoçante puro',
    category: 'Processamento',
    baseCost: 187500000,
    costMultiplier: 1.15,
    baseIncome: 1875000,
    incomeMultiplier: 1.1,
    icon: '🍬',
    tier: calculateTier(187500000)
  },
  {
    id: 'process_09',
    name: 'Complexo Industrial',
    description: 'Múltiplos produtos',
    category: 'Processamento',
    baseCost: 937500000,
    costMultiplier: 1.15,
    baseIncome: 9375000,
    incomeMultiplier: 1.1,
    icon: '🏗️',
    tier: calculateTier(937500000)
  },
  {
    id: 'process_10',
    name: 'Nanotecnologia Alimentar',
    description: 'Processamento molecular',
    category: 'Processamento',
    baseCost: 4687500000,
    costMultiplier: 1.15,
    baseIncome: 46875000,
    incomeMultiplier: 1.1,
    icon: '⚛️',
    tier: calculateTier(4687500000)
  },
  {
    id: 'process_11',
    name: 'Síntese de Alimentos',
    description: 'Comida do futuro',
    category: 'Processamento',
    baseCost: 23000000000,
    costMultiplier: 1.15,
    baseIncome: 230000000,
    incomeMultiplier: 1.1,
    icon: '🔬',
    tier: calculateTier(23000000000)
  },

  // 🌟 Tecnologia Futurista (11 upgrades)
  {
    id: 'future_01',
    name: 'Painel Solar',
    description: 'Energia limpa',
    category: 'Tecnologia Futurista',
    baseCost: 10000,
    costMultiplier: 1.15,
    baseIncome: 100,
    incomeMultiplier: 1.1,
    icon: '☀️',
    tier: calculateTier(10000)
  },
  {
    id: 'future_02',
    name: 'Turbina Eólica',
    description: 'Energia dos ventos',
    category: 'Tecnologia Futurista',
    baseCost: 50000,
    costMultiplier: 1.15,
    baseIncome: 500,
    incomeMultiplier: 1.1,
    icon: '💨',
    tier: calculateTier(50000)
  },
  {
    id: 'future_03',
    name: 'Estufa Inteligente',
    description: 'Clima controlado por IA',
    category: 'Tecnologia Futurista',
    baseCost: 250000,
    costMultiplier: 1.15,
    baseIncome: 2500,
    incomeMultiplier: 1.1,
    icon: '🏠',
    tier: calculateTier(250000)
  },
  {
    id: 'future_04',
    name: 'Robô Agricultor',
    description: 'Trabalho 24/7',
    category: 'Tecnologia Futurista',
    baseCost: 1250000,
    costMultiplier: 1.15,
    baseIncome: 12500,
    incomeMultiplier: 1.1,
    icon: '🤖',
    tier: calculateTier(1250000)
  },
  {
    id: 'future_05',
    name: 'Clonagem de Plantas',
    description: 'Reprodução perfeita',
    category: 'Tecnologia Futurista',
    baseCost: 6250000,
    costMultiplier: 1.15,
    baseIncome: 62500,
    incomeMultiplier: 1.1,
    icon: '🧬',
    tier: calculateTier(6250000)
  },
  {
    id: 'future_06',
    name: 'Impressora 3D de Alimentos',
    description: 'Criação instantânea',
    category: 'Tecnologia Futurista',
    baseCost: 31250000,
    costMultiplier: 1.15,
    baseIncome: 312500,
    incomeMultiplier: 1.1,
    icon: '🖨️',
    tier: calculateTier(31250000)
  },
  {
    id: 'future_07',
    name: 'Fazenda Submarina',
    description: 'Cultivo oceânico',
    category: 'Tecnologia Futurista',
    baseCost: 156250000,
    costMultiplier: 1.15,
    baseIncome: 1562500,
    incomeMultiplier: 1.1,
    icon: '🌊',
    tier: calculateTier(156250000)
  },
  {
    id: 'future_08',
    name: 'Estação Orbital',
    description: 'Agricultura no espaço',
    category: 'Tecnologia Futurista',
    baseCost: 781250000,
    costMultiplier: 1.15,
    baseIncome: 7812500,
    incomeMultiplier: 1.1,
    icon: '🛸',
    tier: calculateTier(781250000)
  },
  {
    id: 'future_09',
    name: 'Fusão Nuclear',
    description: 'Energia ilimitada',
    category: 'Tecnologia Futurista',
    baseCost: 3906250000,
    costMultiplier: 1.15,
    baseIncome: 39062500,
    incomeMultiplier: 1.1,
    icon: '⚛️',
    tier: calculateTier(3906250000)
  },
  {
    id: 'future_10',
    name: 'Teletransporte Quântico',
    description: 'Entrega instantânea',
    category: 'Tecnologia Futurista',
    baseCost: 19531250000,
    costMultiplier: 1.15,
    baseIncome: 195312500,
    incomeMultiplier: 1.1,
    icon: '✨',
    tier: calculateTier(19531250000)
  },
  {
    id: 'future_11',
    name: 'Multiverso Agrícola',
    description: 'Fazendas em realidades alternativas',
    category: 'Tecnologia Futurista',
    baseCost: 100000000000,
    costMultiplier: 1.15,
    baseIncome: 1000000000,
    incomeMultiplier: 1.1,
    icon: '🌌',
    tier: calculateTier(100000000000)
  },

  // 🏆 UPGRADES COMPOSTOS (Necessitam de requisitos)
  // Estes upgrades são muito poderosos mas exigem outros upgrades primeiro

  // Combo Plantação Avançada
  {
    id: 'composite_01',
    name: 'Fazenda Superintensiva',
    description: '🏆 COMPOSTO: Combina múltiplas tecnologias agrícolas para produção massiva',
    category: 'Upgrades Compostos',
    baseCost: 50000000,
    costMultiplier: 1.2,
    baseIncome: 500000,
    incomeMultiplier: 1.15,
    icon: '🌟',
    isComposite: true,
    requirements: [
      { upgradeId: 'plant_06', minCount: 5 },  // 5x Trator Pequeno
      { upgradeId: 'plant_08', minCount: 3 },  // 3x Estufa Climatizada
      { upgradeId: 'plant_09', minCount: 2 }   // 2x Sementes Híbridas
    ]
  },

  // Combo Criação Animal
  {
    id: 'composite_02',
    name: 'Complexo Pecuário Premium',
    description: '🏆 COMPOSTO: Criação de elite com genética superior',
    category: 'Upgrades Compostos',
    baseCost: 150000000,
    costMultiplier: 1.2,
    baseIncome: 1500000,
    incomeMultiplier: 1.15,
    icon: '🎖️',
    isComposite: true,
    requirements: [
      { upgradeId: 'cattle_03', minCount: 10 }, // 10x Vaca Leiteira
      { upgradeId: 'cattle_08', minCount: 5 },  // 5x Cavalo
      { upgradeId: 'cattle_11', minCount: 1 }   // 1x Granja Industrial
    ]
  },

  // Combo Frutas
  {
    id: 'composite_03',
    name: 'Pomar Celestial',
    description: '🏆 COMPOSTO: Pomar mágico que produz frutas perfeitas',
    category: 'Upgrades Compostos',
    baseCost: 300000000,
    costMultiplier: 1.2,
    baseIncome: 3000000,
    incomeMultiplier: 1.15,
    icon: '🍃',
    isComposite: true,
    requirements: [
      { upgradeId: 'orchard_03', minCount: 5 }, // 5x Bananeira
      { upgradeId: 'orchard_07', minCount: 3 }, // 3x Cerejeira
      { upgradeId: 'orchard_11', minCount: 1 }  // 1x Pomar Hidropônico
    ]
  },

  // Combo Mel + Frutas
  {
    id: 'composite_04',
    name: 'Simbiose Natural',
    description: '🏆 COMPOSTO: Abelhas polinizam o pomar criando sinergia perfeita',
    category: 'Upgrades Compostos',
    baseCost: 500000000,
    costMultiplier: 1.2,
    baseIncome: 5000000,
    incomeMultiplier: 1.15,
    icon: '🌺',
    isComposite: true,
    requirements: [
      { upgradeId: 'bee_09', minCount: 2 },     // 2x Apiário Industrial
      { upgradeId: 'orchard_08', minCount: 5 }, // 5x Limoeiro
      { upgradeId: 'bee_04', minCount: 10 }     // 10x Flores Silvestres
    ]
  },

  // Combo Aquático
  {
    id: 'composite_05',
    name: 'Império Aquático Total',
    description: '🏆 COMPOSTO: Domínio completo sobre os mares e rios',
    category: 'Upgrades Compostos',
    baseCost: 1000000000,
    costMultiplier: 1.2,
    baseIncome: 10000000,
    incomeMultiplier: 1.15,
    icon: '🔱',
    isComposite: true,
    requirements: [
      { upgradeId: 'fish_09', minCount: 2 },  // 2x Aquicultura Marinha
      { upgradeId: 'fish_10', minCount: 1 },  // 1x Caviar de Esturjão
      { upgradeId: 'fish_07', minCount: 5 }   // 5x Fazenda de Ostras
    ]
  },

  // Combo Vinhos + Queijos
  {
    id: 'composite_06',
    name: 'Gastronomia de Elite',
    description: '🏆 COMPOSTO: Combinação perfeita de vinhos e queijos gourmet',
    category: 'Upgrades Compostos',
    baseCost: 2000000000,
    costMultiplier: 1.2,
    baseIncome: 20000000,
    incomeMultiplier: 1.15,
    icon: '👑',
    isComposite: true,
    requirements: [
      { upgradeId: 'wine_08', minCount: 3 },  // 3x Safra Especial
      { upgradeId: 'dairy_10', minCount: 2 }, // 2x Queijo Trufado
      { upgradeId: 'wine_06', minCount: 10 }  // 10x Champagne
    ]
  },

  // Combo Tecnologia
  {
    id: 'composite_07',
    name: 'Singularidade Agrícola',
    description: '🏆 COMPOSTO: IA superinteligente controla toda a produção',
    category: 'Upgrades Compostos',
    baseCost: 5000000000,
    costMultiplier: 1.2,
    baseIncome: 50000000,
    incomeMultiplier: 1.15,
    icon: '🤖',
    isComposite: true,
    requirements: [
      { upgradeId: 'agro_06', minCount: 5 },    // 5x IA para Agricultura
      { upgradeId: 'agro_09', minCount: 2 },    // 2x Biotecnologia Avançada
      { upgradeId: 'future_04', minCount: 10 }  // 10x Robô Agricultor
    ]
  },

  // Combo Processamento
  {
    id: 'composite_08',
    name: 'Fábrica Quantum',
    description: '🏆 COMPOSTO: Processamento em nível molecular e quântico',
    category: 'Upgrades Compostos',
    baseCost: 10000000000,
    costMultiplier: 1.2,
    baseIncome: 100000000,
    incomeMultiplier: 1.15,
    icon: '⚛️',
    isComposite: true,
    requirements: [
      { upgradeId: 'process_10', minCount: 3 }, // 3x Nanotecnologia Alimentar
      { upgradeId: 'process_11', minCount: 2 }, // 2x Síntese de Alimentos
      { upgradeId: 'future_09', minCount: 1 }   // 1x Fusão Nuclear
    ]
  },

  // Combo Espacial
  {
    id: 'composite_09',
    name: 'Colônia Intergaláctica',
    description: '🏆 COMPOSTO: Fazendas em múltiplas galáxias',
    category: 'Upgrades Compostos',
    baseCost: 25000000000,
    costMultiplier: 1.2,
    baseIncome: 250000000,
    incomeMultiplier: 1.15,
    icon: '🌌',
    isComposite: true,
    requirements: [
      { upgradeId: 'agro_10', minCount: 2 },    // 2x Agricultura Espacial
      { upgradeId: 'future_08', minCount: 5 },  // 5x Estação Orbital
      { upgradeId: 'agro_11', minCount: 1 }     // 1x Terraformação
    ]
  },

  // Combo Final - Deus da Fazenda
  {
    id: 'composite_10',
    name: 'Deus da Agricultura',
    description: '🏆 LENDÁRIO: Controle divino sobre toda a produção universal',
    category: 'Upgrades Compostos',
    baseCost: 100000000000,
    costMultiplier: 1.3,
    baseIncome: 1000000000,
    incomeMultiplier: 1.2,
    icon: '✨',
    isComposite: true,
    requirements: [
      { upgradeId: 'composite_01', minCount: 1 },
      { upgradeId: 'composite_05', minCount: 1 },
      { upgradeId: 'composite_07', minCount: 1 },
      { upgradeId: 'composite_09', minCount: 1 },
      { upgradeId: 'future_11', minCount: 1 }   // 1x Multiverso Agrícola
    ]
  },
];

export const categories = [
  'Todos',
  'Plantação Básica',
  'Criação de Gado',
  'Pomar',
  'Apicultura',
  'Piscicultura',
  'Vinicultura',
  'Laticínios',
  'Agricultura Industrial',
  'Processamento',
  'Tecnologia Futurista',
  'Upgrades Compostos'
];
