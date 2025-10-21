import { StoryChapter } from '../types/story';

/**
 * 🌑 A FAZENDA MALDITA - Sistema Completo com Loja
 * 
 * MECÂNICA:
 * - Cada capítulo tem LOJA com itens específicos
 * - Objetivos exigem COMPRA de itens (não automático)
 * - Recompensas: EXP + Item Especial + Badge + Moedas
 * - Sistema de níveis visível
 */

export const STORY_PHASES = [
  { id: 1, name: '🌑 A Chegada', emoji: '🌑', description: 'O início da jornada sombria' },
  { id: 2, name: '🕯️ Primeiros Sinais', emoji: '🕯️', description: 'Revelações perturbadoras' },
  { id: 3, name: '⚰️ Segredos Enterrados', emoji: '⚰️', description: 'O passado emerge das sombras' },
  { id: 4, name: '🩸 Pacto de Sangue', emoji: '🩸', description: 'Sacrifícios necessários' },
  { id: 5, name: '👁️ Olhos nas Sombras', emoji: '👁️', description: 'Vigilância constante' },
  { id: 6, name: '🔮 Ritual Proibido', emoji: '🔮', description: 'Poder além da compreensão' },
  { id: 7, name: '💀 Confronto Inevitável', emoji: '💀', description: 'Enfrentando os mortos' },
  { id: 8, name: '⚡ Despertar Ancestral', emoji: '⚡', description: 'Forças primordiais' },
  { id: 9, name: '🌋 Apocalipse Iminente', emoji: '🌋', description: 'O fim se aproxima' },
  { id: 10, name: '👑 Ascensão ou Queda', emoji: '👑', description: 'O destino final' },
];

export const campaign1Chapters: StoryChapter[] = [
  // ==================== FASE 1: A CHEGADA (Capítulos 1-10) ====================
  {
    id: 1,
    phase: 1,
    title: 'A Herança Maldita',
    emoji: '🏚️',
    story: `📜 Uma carta amarelada chega sem remetente. Seu tio desaparecido há 20 anos deixou uma fazenda para você. 

Os vizinhos sussurram que ninguém deve pisar naquelas terras. Mas você está desesperado, sem dinheiro, sem opções. 

À noite, os pesadelos começam: uma voz antiga chama seu nome entre as névoas. Você acorda com terra sob as unhas, embora tenha dormido em casa. 

A fazenda espera. E ela tem fome.

💰 Você encontra algumas moedas antigas enterradas no jardim. Talvez possa comprar ferramentas básicas...`,
    
    shopItems: [
      {
        id: 'old_shovel',
        name: 'Pá Enferrujada',
        description: 'Uma pá antiga, mas ainda funcional',
        emoji: '🪓',
        price: 50,
        type: 'tool',
        effect: 'Permite cavar a terra'
      },
      {
        id: 'torn_gloves',
        name: 'Luvas Rasgadas',
        description: 'Protegem suas mãos do solo estranho',
        emoji: '🧤',
        price: 30,
        type: 'tool',
        effect: 'Coleta +5%'
      },
      {
        id: 'strange_seeds',
        name: 'Sementes Estranhas',
        description: 'Sementes que brilham levemente no escuro',
        emoji: '🌱',
        price: 80,
        type: 'material',
        effect: 'Primeiro cultivo'
      }
    ],
    
    objectives: [
      {
        id: 'collect_initial_coins',
        description: 'Colete 200 moedas explorando',
        type: 'collect_coins',
        target: 200,
        current: 0,
        completed: false,
        emoji: '💰'
      },
      {
        id: 'buy_shovel',
        description: 'Compre a Pá Enferrujada',
        type: 'buy_item',
        target: 'old_shovel',
        current: 0,
        completed: false,
        emoji: '🪓',
        requiredItemId: 'old_shovel'
      },
      {
        id: 'buy_gloves',
        description: 'Compre as Luvas Rasgadas',
        type: 'buy_item',
        target: 'torn_gloves',
        current: 0,
        completed: false,
        emoji: '🧤',
        requiredItemId: 'torn_gloves'
      }
    ],
    
    rewards: {
      coins: 100,
      exp: 50,
      item: {
        itemId: 'cursed_compass',
        name: 'Bússola Amaldiçoada',
        emoji: '🧭',
        quantity: 1,
        acquiredAt: new Date(),
        chapterId: 1
      },
      badge: 'Herdeiro Maldito',
      title: 'O Novo Proprietário'
    },
    
    unlocked: true,
    completed: false
  },

  {
    id: 2,
    phase: 1,
    title: 'O Primeiro Cultivo',
    emoji: '🌱',
    story: `🌾 O solo é mais escuro que carvão. Com sua pá em mãos, você cava o primeiro buraco.

Quando planta as sementes estranhas, elas germinam INSTANTANEAMENTE - mas as plantas têm um brilho doentio, púrpura.

O vento carrega sussurros em línguas mortas. Você encontra um diário enterrado: "Eles prometeram riquezas eternas. Não mencionaram o preço."

Uma sombra passa pela janela, mas não há nada lá fora. As plantas crescem à noite, alimentadas por algo que não é água.

🛒 Um vendedor ambulante misterioso oferece ferramentas "especiais"...`,

    shopItems: [
      {
        id: 'cursed_watering_can',
        name: 'Regador Amaldiçoado',
        description: 'Água escura jorra dele, mas as plantas adoram',
        emoji: '🚿',
        price: 150,
        type: 'tool',
        effect: 'Crescimento +20%'
      },
      {
        id: 'fertilizer_bag',
        name: 'Saco de Fertilizante',
        description: 'Cheira a enxofre, mas funciona',
        emoji: '💩',
        price: 200,
        type: 'material',
        effect: 'Produção +15%'
      },
      {
        id: 'ritual_knife',
        name: 'Faca Ritual',
        description: 'Para colheitas... especiais',
        emoji: '🔪',
        price: 300,
        type: 'tool',
        effect: 'Desbloqueia colheitas noturnas'
      }
    ],

    objectives: [
      {
        id: 'collect_500_coins',
        description: 'Acumule 650 moedas',
        type: 'collect_coins',
        target: 650,
        current: 0,
        completed: false,
        emoji: '💰'
      },
      {
        id: 'buy_watering_can',
        description: 'Compre o Regador Amaldiçoado',
        type: 'buy_item',
        target: 'cursed_watering_can',
        current: 0,
        completed: false,
        emoji: '🚿',
        requiredItemId: 'cursed_watering_can'
      },
      {
        id: 'buy_fertilizer',
        description: 'Compre o Saco de Fertilizante',
        type: 'buy_item',
        target: 'fertilizer_bag',
        current: 0,
        completed: false,
        emoji: '💩',
        requiredItemId: 'fertilizer_bag'
      }
    ],

    rewards: {
      coins: 300,
      exp: 75,
      item: {
        itemId: 'shadow_lantern',
        name: 'Lanterna de Sombras',
        emoji: '🏮',
        quantity: 1,
        acquiredAt: new Date(),
        chapterId: 2
      },
      badge: 'Agricultor das Sombras',
      title: 'Cultivador do Impossível'
    },

    unlocked: false,
    completed: false
  },

  {
    id: 3,
    phase: 1,
    title: 'Vozes na Noite',
    emoji: '🌙',
    story: `🦉 À meia-noite, você acorda com cantos. Não são humanos.

Pela janela, vê vultos dançando entre as plantações. No dia seguinte, círculos perfeitos aparecem no campo - de dentro para fora, como se algo tivesse nascido da terra.

Você encontra pegadas que começam do nada e terminam na sua porta. O espelho do celeiro mostra reflexos que se movem quando você está parado.

A fazenda está viva. E ela te reconhece.

🔮 Um altar antigo emerge do solo. Há marcas de velas e... oferendas necessárias.`,

    shopItems: [
      {
        id: 'silver_bell',
        name: 'Sino de Prata',
        description: 'Afasta espíritos menores',
        emoji: '🔔',
        price: 400,
        type: 'special',
        effect: 'Proteção básica'
      },
      {
        id: 'salt_circle',
        name: 'Círculo de Sal',
        description: 'Três quilos de sal consagrado',
        emoji: '⭕',
        price: 350,
        type: 'material',
        effect: 'Cria barreira protetora'
      },
      {
        id: 'moon_water',
        name: 'Água da Lua',
        description: 'Coletada durante eclipse',
        emoji: '🌙',
        price: 500,
        type: 'material',
        effect: 'Amplifica rituais'
      },
      {
        id: 'iron_chain',
        name: 'Corrente de Ferro',
        description: 'Forjada em noite sem lua',
        emoji: '⛓️',
        price: 600,
        type: 'tool',
        effect: 'Prende entidades'
      }
    ],

    objectives: [
      {
        id: 'collect_1250_coins',
        description: 'Acumule 1.850 moedas',
        type: 'collect_coins',
        target: 1850,
        current: 0,
        completed: false,
        emoji: '💰'
      },
      {
        id: 'buy_bell',
        description: 'Compre o Sino de Prata',
        type: 'buy_item',
        target: 'silver_bell',
        current: 0,
        completed: false,
        emoji: '🔔',
        requiredItemId: 'silver_bell'
      },
      {
        id: 'buy_salt',
        description: 'Compre o Círculo de Sal',
        type: 'buy_item',
        target: 'salt_circle',
        current: 0,
        completed: false,
        emoji: '⭕',
        requiredItemId: 'salt_circle'
      },
      {
        id: 'buy_moon_water',
        description: 'Compre a Água da Lua',
        type: 'buy_item',
        target: 'moon_water',
        current: 0,
        completed: false,
        emoji: '🌙',
        requiredItemId: 'moon_water'
      }
    ],

    rewards: {
      coins: 600,
      exp: 100,
      item: {
        itemId: 'spirit_detector',
        name: 'Detector de Espíritos',
        emoji: '📡',
        quantity: 1,
        acquiredAt: new Date(),
        chapterId: 3
      },
      badge: 'Ouvinte das Sombras',
      title: 'Aquele Que Escuta'
    },

    unlocked: false,
    completed: false
  },

  {
    id: 4,
    phase: 1,
    title: 'O Poço Selado',
    emoji: '🕳️',
    story: `⛏️ No centro da fazenda, você descobre um poço coberto por correntes enferrujadas.

Uma placa carcomida avisa: "NUNCA ABRA". Mas à noite, ouve-se batidas de dentro. Toc. Toc. Toc. Sempre três vezes.

As correntes tremem sozinhas. Você sonha que está lá dentro, olhando para cima, vendo a si mesmo olhar para baixo.

Quando acorda, há água do poço no seu travesseiro. A água é preta. E se move.

🔨 Você precisa de ferramentas pesadas para investigar... ou selar permanentemente.`,

    shopItems: [
      {
        id: 'heavy_hammer',
        name: 'Martelo Pesado',
        description: 'Pode quebrar as correntes',
        emoji: '🔨',
        price: 800,
        type: 'tool',
        effect: 'Força +30%'
      },
      {
        id: 'rope_100m',
        name: 'Corda de 100m',
        description: 'Para descer... ou escapar',
        emoji: '🪢',
        price: 600,
        type: 'tool',
        effect: 'Permite exploração'
      },
      {
        id: 'blessed_torch',
        name: 'Tocha Abençoada',
        description: 'Nunca se apaga, mesmo debaixo d\'água',
        emoji: '🔦',
        price: 900,
        type: 'special',
        effect: 'Ilumina trevas'
      },
      {
        id: 'protective_amulet',
        name: 'Amuleto Protetor',
        description: 'Pertenceu ao antigo dono',
        emoji: '🧿',
        price: 1200,
        type: 'special',
        effect: 'Proteção contra maldições'
      }
    ],

    objectives: [
      {
        id: 'collect_3500_coins',
        description: 'Acumule 3.500 moedas',
        type: 'collect_coins',
        target: 3500,
        current: 0,
        completed: false,
        emoji: '💰'
      },
      {
        id: 'buy_hammer',
        description: 'Compre o Martelo Pesado',
        type: 'buy_item',
        target: 'heavy_hammer',
        current: 0,
        completed: false,
        emoji: '🔨',
        requiredItemId: 'heavy_hammer'
      },
      {
        id: 'buy_rope',
        description: 'Compre a Corda de 100m',
        type: 'buy_item',
        target: 'rope_100m',
        current: 0,
        completed: false,
        emoji: '🪢',
        requiredItemId: 'rope_100m'
      },
      {
        id: 'buy_torch',
        description: 'Compre a Tocha Abençoada',
        type: 'buy_item',
        target: 'blessed_torch',
        current: 0,
        completed: false,
        emoji: '🔦',
        requiredItemId: 'blessed_torch'
      }
    ],

    rewards: {
      coins: 1000,
      exp: 150,
      item: {
        itemId: 'well_key',
        name: 'Chave do Poço',
        emoji: '🗝️',
        quantity: 1,
        acquiredAt: new Date(),
        chapterId: 4
      },
      badge: 'Explorador do Abismo',
      title: 'Mergulhador nas Trevas'
    },

    unlocked: false,
    completed: false
  },

  {
    id: 5,
    phase: 1,
    title: 'Segredos Subterrâneos',
    emoji: '🗝️',
    story: `🕯️ Com a Chave do Poço em mãos, você desce pelas correntes quebradas.

50 metros. 80 metros. 100 metros. A lanterna ilumina inscrições nas paredes: "SETE ESTÃO DORMINDO. NÃO OS ACORDE."

No fundo, uma câmara. Sete sarcófagos de pedra, cada um com um símbolo diferente. Um deles está... vazio.

Papéis antigos revelam: seu tio não desapareceu. Ele se OFERECEU. Para manter algo contido.

Agora você entende. A fazenda não é maldita. É uma PRISÃO. E você é o novo carcereiro.

⚒️ Você precisa de suprimentos para fortalecer os selos...`,

    shopItems: [
      {
        id: 'iron_bars',
        name: 'Barras de Ferro Benzido',
        description: 'Fortalece as correntes místicas',
        emoji: '🔩',
        price: 1500,
        type: 'material',
        effect: 'Reforço +25%'
      },
      {
        id: 'ancient_scroll',
        name: 'Pergaminho Ancestral',
        description: 'Contém rituais de aprisionamento',
        emoji: '📜',
        price: 2000,
        type: 'special',
        effect: 'Aprende 3 selos'
      },
      {
        id: 'crystal_powder',
        name: 'Pó de Cristal',
        description: 'Amplifica barreiras mágicas',
        emoji: '💎',
        price: 1800,
        type: 'material',
        effect: 'Poder +40%'
      },
      {
        id: 'binding_runes',
        name: 'Runas de Aprisionamento',
        description: 'Set completo de 12 runas',
        emoji: '🔣',
        price: 2500,
        type: 'special',
        effect: 'Sela entidades'
      }
    ],

    objectives: [
      {
        id: 'collect_7800_coins',
        description: 'Acumule 7.800 moedas',
        type: 'collect_coins',
        target: 7800,
        current: 0,
        completed: false,
        emoji: '💰'
      },
      {
        id: 'buy_iron_bars',
        description: 'Compre Barras de Ferro Benzido',
        type: 'buy_item',
        target: 'iron_bars',
        current: 0,
        completed: false,
        emoji: '🔩',
        requiredItemId: 'iron_bars'
      },
      {
        id: 'buy_scroll',
        description: 'Compre o Pergaminho Ancestral',
        type: 'buy_item',
        target: 'ancient_scroll',
        current: 0,
        completed: false,
        emoji: '📜',
        requiredItemId: 'ancient_scroll'
      },
      {
        id: 'buy_crystal',
        description: 'Compre o Pó de Cristal',
        type: 'buy_item',
        target: 'crystal_powder',
        current: 0,
        completed: false,
        emoji: '💎',
        requiredItemId: 'crystal_powder'
      }
    ],

    rewards: {
      coins: 2000,
      exp: 200,
      item: {
        itemId: 'warden_seal',
        name: 'Selo do Guardião',
        emoji: '🛡️',
        quantity: 1,
        acquiredAt: new Date(),
        chapterId: 5
      },
      badge: 'Guardião da Prisão',
      title: 'Carcereiro Herdado'
    },

    unlocked: false,
    completed: false
  },

  // Continuo criando os capítulos 6-10 da Fase 1...
  {
    id: 6,
    phase: 1,
    title: 'Primeira Fuga',
    emoji: '👻',
    story: `⚠️ RACHADURA no sarcófago número 3. 

Névoa negra escapa. Forma uma criatura: metade humano, metade sombra. Olhos vermelhos te encaram. "Obrigado," ela sibila, "por me libertar após 300 anos."

Ela ataca! Seu sino repele, mas não mata. Você precisa de armas espirituais.

O pergaminho ancestral menciona: "Para destruir sombras, use luz aprisionada. Para aprisionar novamente, use correntes do vazio."

A criatura foge pela fazenda. Cada noite, ela fica mais forte. Você tem uma semana.

⚔️ Chegou a hora de se armar adequadamente...`,

    shopItems: [
      {
        id: 'light_crystal',
        name: 'Cristal de Luz Aprisionada',
        description: 'Luz solar condensada por 100 anos',
        emoji: '💡',
        price: 3000,
        type: 'special',
        effect: 'Dano +50% vs sombras'
      },
      {
        id: 'void_chains',
        name: 'Correntes do Vazio',
        description: 'Forjadas no não-espaço',
        emoji: '⛓️',
        price: 3500,
        type: 'tool',
        effect: 'Prende entidades Rank C'
      },
      {
        id: 'spirit_blade',
        name: 'Lâmina Espiritual',
        description: 'Corta o tecido entre mundos',
        emoji: '⚔️',
        price: 4000,
        type: 'tool',
        effect: 'Ataque espiritual'
      },
      {
        id: 'banishment_ritual',
        name: 'Ritual de Banimento',
        description: 'Livro com 5 rituais de expulsão',
        emoji: '📕',
        price: 4500,
        type: 'special',
        effect: 'Remove entidades'
      }
    ],

    objectives: [
      {
        id: 'collect_15000_coins',
        description: 'Acumule 15.000 moedas',
        type: 'collect_coins',
        target: 15000,
        current: 0,
        completed: false,
        emoji: '💰'
      },
      {
        id: 'buy_light_crystal',
        description: 'Compre o Cristal de Luz',
        type: 'buy_item',
        target: 'light_crystal',
        current: 0,
        completed: false,
        emoji: '💡',
        requiredItemId: 'light_crystal'
      },
      {
        id: 'buy_void_chains',
        description: 'Compre Correntes do Vazio',
        type: 'buy_item',
        target: 'void_chains',
        current: 0,
        completed: false,
        emoji: '⛓️',
        requiredItemId: 'void_chains'
      },
      {
        id: 'buy_spirit_blade',
        description: 'Compre a Lâmina Espiritual',
        type: 'buy_item',
        target: 'spirit_blade',
        current: 0,
        completed: false,
        emoji: '⚔️',
        requiredItemId: 'spirit_blade'
      }
    ],

    rewards: {
      coins: 3500,
      exp: 300,
      item: {
        itemId: 'shadow_binder',
        name: 'Aprisionador de Sombras',
        emoji: '🌑',
        quantity: 1,
        acquiredAt: new Date(),
        chapterId: 6
      },
      badge: 'Caçador de Sombras',
      title: 'Aquele Que Domou a Primeira'
    },

    unlocked: false,
    completed: false
  },

  {
    id: 7,
    phase: 1,
    title: 'A Aldeã Sábia',
    emoji: '👵',
    story: `🏡 Uma senhora antiga aparece na entrada. "Eu sabia que você viria," ela diz.

Ela é Eliza - 97 anos, morou aqui a vida toda. Conheceu seu tio. "Ele era bom demais para esse mundo. Por isso o escolheram."

Eliza te ensina segredos: como ouvir sussurros sem enlouquecer, como ler símbolos de advertência, como saber quando está sendo observado.

"A fazenda não é sua inimiga," ela explica. "É um campo de batalha. E você está no meio."

Ela oferece seu próprio arsenal - acumulado em 70 anos de vida aqui.

🛍️ "Leve o que precisar, criança. Mas lembre-se: nada aqui é de graça. A fazenda sempre cobra."`,

    shopItems: [
      {
        id: 'eliza_grimoire',
        name: 'Grimório de Eliza',
        description: '70 anos de conhecimento místico',
        emoji: '📔',
        price: 5000,
        type: 'special',
        effect: 'Aprende todos os selos básicos'
      },
      {
        id: 'protection_herbs',
        name: 'Ervas de Proteção',
        description: 'Cultivadas em solo consagrado',
        emoji: '🌿',
        price: 4000,
        type: 'material',
        effect: 'Resistência +30%'
      },
      {
        id: 'seeing_stone',
        name: 'Pedra da Visão',
        description: 'Revela o que está oculto',
        emoji: '🔮',
        price: 6000,
        type: 'special',
        effect: 'Detecta entidades invisíveis'
      },
      {
        id: 'spirit_trap',
        name: 'Armadilha Espiritual',
        description: 'Captura automaticamente',
        emoji: '🪤',
        price: 5500,
        type: 'tool',
        effect: 'Captura passiva'
      }
    ],

    objectives: [
      {
        id: 'collect_20500_coins',
        description: 'Acumule 20.500 moedas',
        type: 'collect_coins',
        target: 20500,
        current: 0,
        completed: false,
        emoji: '💰'
      },
      {
        id: 'buy_grimoire',
        description: 'Compre o Grimório de Eliza',
        type: 'buy_item',
        target: 'eliza_grimoire',
        current: 0,
        completed: false,
        emoji: '📔',
        requiredItemId: 'eliza_grimoire'
      },
      {
        id: 'buy_herbs',
        description: 'Compre Ervas de Proteção',
        type: 'buy_item',
        target: 'protection_herbs',
        current: 0,
        completed: false,
        emoji: '🌿',
        requiredItemId: 'protection_herbs'
      },
      {
        id: 'buy_seeing_stone',
        description: 'Compre a Pedra da Visão',
        type: 'buy_item',
        target: 'seeing_stone',
        current: 0,
        completed: false,
        emoji: '🔮',
        requiredItemId: 'seeing_stone'
      }
    ],

    rewards: {
      coins: 5000,
      exp: 400,
      item: {
        itemId: 'eliza_blessing',
        name: 'Bênção de Eliza',
        emoji: '✨',
        quantity: 1,
        acquiredAt: new Date(),
        chapterId: 7
      },
      badge: 'Pupilo da Sábia',
      title: 'Aprendiz de Eliza'
    },

    unlocked: false,
    completed: false
  },

  {
    id: 8,
    phase: 1,
    title: 'Mapa dos Selos',
    emoji: '🗺️',
    story: `🧭 Usando a Pedra da Visão, você vê TODA a fazenda de uma vez.

Não são 7 sarcófagos. São 14. Sete no poço. Sete espalhados pela propriedade.

Um está sob o celeiro. Outro no pomar. Um terceiro... debaixo da sua CAMA.

O mapa antigo mostra que a fazenda foi construída em camadas: cada geração de guardiões adicionou um selo novo.

Seu tio selou o 14º. Você é o 15º guardião da linhagem.

E de acordo com o grimório... o 15º é especial. "Aquele que fecha o ciclo. Ou quebra tudo."

🏗️ Você precisa reforçar TODOS os 14 selos antes da lua nova. 3 dias restantes.`,

    shopItems: [
      {
        id: 'reinforcement_kit',
        name: 'Kit de Reforço Místico',
        description: 'Materiais para 14 selos',
        emoji: '🧰',
        price: 8000,
        type: 'material',
        effect: 'Reforça todos os selos'
      },
      {
        id: 'time_crystal',
        name: 'Cristal do Tempo',
        description: 'Estende o prazo por 24h',
        emoji: '⏰',
        price: 10000,
        type: 'special',
        effect: '+1 dia de tempo'
      },
      {
        id: 'master_seal',
        name: 'Selo Mestre',
        description: 'Conecta todos os selos secundários',
        emoji: '🔐',
        price: 12000,
        type: 'special',
        effect: 'Sincroniza proteções'
      },
      {
        id: 'guardian_armor',
        name: 'Armadura do Guardião',
        description: 'Usada por todos os 14 anteriores',
        emoji: '🛡️',
        price: 9000,
        type: 'tool',
        effect: 'Defesa +100%'
      }
    ],

    objectives: [
      {
        id: 'collect_39000_coins',
        description: 'Acumule 39.000 moedas',
        type: 'collect_coins',
        target: 39000,
        current: 0,
        completed: false,
        emoji: '💰'
      },
      {
        id: 'buy_reinforcement',
        description: 'Compre o Kit de Reforço',
        type: 'buy_item',
        target: 'reinforcement_kit',
        current: 0,
        completed: false,
        emoji: '🧰',
        requiredItemId: 'reinforcement_kit'
      },
      {
        id: 'buy_master_seal',
        description: 'Compre o Selo Mestre',
        type: 'buy_item',
        target: 'master_seal',
        current: 0,
        completed: false,
        emoji: '🔐',
        requiredItemId: 'master_seal'
      },
      {
        id: 'buy_armor',
        description: 'Compre a Armadura do Guardião',
        type: 'buy_item',
        target: 'guardian_armor',
        current: 0,
        completed: false,
        emoji: '🛡️',
        requiredItemId: 'guardian_armor'
      }
    ],

    rewards: {
      coins: 8000,
      exp: 500,
      item: {
        itemId: 'guardian_legacy',
        name: 'Legado dos Guardiões',
        emoji: '👑',
        quantity: 1,
        acquiredAt: new Date(),
        chapterId: 8
      },
      badge: '15º Guardião',
      title: 'Herdeiro da Linhagem Sagrada'
    },

    unlocked: false,
    completed: false
  },

  {
    id: 9,
    phase: 1,
    title: 'Lua Nova',
    emoji: '🌑',
    story: `🌑 A noite sem lua chega.

TODOS os 14 sarcófagos tremem simultaneamente. Você corre pela fazenda, reforçando cada selo. Suor escorre. Mãos sangram.

O grimório explica: "Na lua nova, o véu entre mundos se rompe. As entidades empurram de dentro. O guardião empurra de fora."

É uma batalha de VONTADES. Você contra 14 entidades antigas.

Uma por uma, elas testam seu resolve. Mostram visões: sua família morta, seu futuro destruído, suas maiores vergonhas.

Mas você SEGURA. Com sangue, suor e lágrimas.

Quando o sol nasce, você desmorona. Mas os selos... estão intactos.

Eliza sorri de longe. "Você passou no primeiro teste."

PRIMEIRO?!

🎁 Ela deixa presentes na porta. "Para a próxima lua nova..."`,

    shopItems: [
      {
        id: 'mental_fortitude',
        name: 'Elixir de Fortaleza Mental',
        description: 'Protege contra ilusões',
        emoji: '🧪',
        price: 15000,
        type: 'special',
        effect: 'Imune a visões'
      },
      {
        id: 'energy_reservoir',
        name: 'Reservatório de Energia',
        description: 'Armazena força vital',
        emoji: '🔋',
        price: 12000,
        type: 'tool',
        effect: 'Recuperação +200%'
      },
      {
        id: 'ancestor_memories',
        name: 'Memórias Ancestrais',
        description: 'Experiência dos 14 guardiões',
        emoji: '🧠',
        price: 18000,
        type: 'special',
        effect: 'Habilidade +50%'
      },
      {
        id: 'final_seal',
        name: 'Selo Definitivo',
        description: 'Usado apenas uma vez',
        emoji: '🚫',
        price: 20000,
        type: 'special',
        effect: 'Sela permanentemente'
      }
    ],

    objectives: [
      {
        id: 'collect_65000_coins',
        description: 'Acumule 65.000 moedas',
        type: 'collect_coins',
        target: 65000,
        current: 0,
        completed: false,
        emoji: '💰'
      },
      {
        id: 'buy_elixir',
        description: 'Compre o Elixir de Fortaleza',
        type: 'buy_item',
        target: 'mental_fortitude',
        current: 0,
        completed: false,
        emoji: '🧪',
        requiredItemId: 'mental_fortitude'
      },
      {
        id: 'buy_reservoir',
        description: 'Compre o Reservatório de Energia',
        type: 'buy_item',
        target: 'energy_reservoir',
        current: 0,
        completed: false,
        emoji: '🔋',
        requiredItemId: 'energy_reservoir'
      },
      {
        id: 'buy_memories',
        description: 'Compre Memórias Ancestrais',
        type: 'buy_item',
        target: 'ancestor_memories',
        current: 0,
        completed: false,
        emoji: '🧠',
        requiredItemId: 'ancestor_memories'
      }
    ],

    rewards: {
      coins: 15000,
      exp: 750,
      item: {
        itemId: 'moonless_crown',
        name: 'Coroa da Lua Nova',
        emoji: '👑',
        quantity: 1,
        acquiredAt: new Date(),
        chapterId: 9
      },
      badge: 'Sobrevivente da Lua Nova',
      title: 'Guardião que Não Quebrou'
    },

    unlocked: false,
    completed: false
  },

  {
    id: 10,
    phase: 1,
    title: 'Revelação',
    emoji: '📖',
    story: `📚 Eliza te chama para sua casa. Pela primeira vez, ela parece... velha. Cansada.

"Preciso te contar a verdade," ela sussurra. "Sobre seu tio. Sobre esta fazenda. Sobre VOCÊ."

Ela revela: a linhagem de guardiões não é aleatória. É SANGUE. Todos vocês descendem do PRIMEIRO guardião - um bruxo que aprisionou as 14 entidades há 1.000 anos.

Ele dividiu sua alma em 15 fragmentos. Cada guardião carrega um.

Seu tio tinha o 14º fragmento. Quando ele se sacrificou, o fragmento passou para o herdeiro de sangue mais próximo: VOCÊ.

"Você não é apenas o 15º guardião," Eliza revela. "Você É o guardião original. Reencarnado. Fragmentado. Mas completo."

As memórias começam a voltar. Mil anos de vidas. Batalhas. Sacrifícios.

Você se lembra de tudo. E entende: esta é sua última vida. A 15ª. A que decidirá tudo.

"Prepare-se," Eliza adverte. "Porque agora que você sabe... ELES também sabem."

🎯 FASE 1 COMPLETA. A verdadeira jornada está apenas começando...`,

    shopItems: [
      {
        id: 'soul_fragments_map',
        name: 'Mapa dos Fragmentos',
        description: 'Localiza seus 14 eus anteriores',
        emoji: '🗺️',
        price: 25000,
        type: 'special',
        effect: 'Revela locais secretos'
      },
      {
        id: 'reincarnation_book',
        name: 'Livro da Reencarnação',
        description: 'História completa de 1.000 anos',
        emoji: '📖',
        price: 30000,
        type: 'special',
        effect: 'Desbloqueia memórias'
      },
      {
        id: 'original_staff',
        name: 'Cajado Original',
        description: 'Usado pelo primeiro guardião',
        emoji: '🪄',
        price: 35000,
        type: 'tool',
        effect: 'Poder +300%'
      },
      {
        id: 'unity_ritual',
        name: 'Ritual de Unificação',
        description: 'Reúne todos os fragmentos',
        emoji: '🔯',
        price: 40000,
        type: 'special',
        effect: 'Transforma você'
      }
    ],

    objectives: [
      {
        id: 'collect_130000_coins',
        description: 'Acumule 130.000 moedas',
        type: 'collect_coins',
        target: 130000,
        current: 0,
        completed: false,
        emoji: '💰'
      },
      {
        id: 'buy_map',
        description: 'Compre o Mapa dos Fragmentos',
        type: 'buy_item',
        target: 'soul_fragments_map',
        current: 0,
        completed: false,
        emoji: '🗺️',
        requiredItemId: 'soul_fragments_map'
      },
      {
        id: 'buy_book',
        description: 'Compre o Livro da Reencarnação',
        type: 'buy_item',
        target: 'reincarnation_book',
        current: 0,
        completed: false,
        emoji: '📖',
        requiredItemId: 'reincarnation_book'
      },
      {
        id: 'buy_staff',
        description: 'Compre o Cajado Original',
        type: 'buy_item',
        target: 'original_staff',
        current: 0,
        completed: false,
        emoji: '🪄',
        requiredItemId: 'original_staff'
      },
      {
        id: 'buy_ritual',
        description: 'Compre o Ritual de Unificação',
        type: 'buy_item',
        target: 'unity_ritual',
        current: 0,
        completed: false,
        emoji: '🔯',
        requiredItemId: 'unity_ritual'
      }
    ],

    rewards: {
      coins: 30000,
      exp: 1000,
      item: {
        itemId: 'awakened_soul',
        name: 'Alma Desperta',
        emoji: '⭐',
        quantity: 1,
        acquiredAt: new Date(),
        chapterId: 10
      },
      badge: 'Guardião Renascido',
      title: 'O Original - Aquele que Retorna'
    },

    unlocked: false,
    completed: false
  }
];

// TODO: Criar fases 2-10 (capítulos 11-100) seguindo o mesmo padrão
// Cada fase terá tema próprio e progressão de dificuldade
