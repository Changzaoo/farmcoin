import { StoryChapter } from '../types/story';

// FASE 1: A HERANÇA MALDITA (Capítulos 1-10)
export const chapters_1_10: StoryChapter[] = [
  {
    id: 1,
    phase: 1,
    title: 'A Herança Maldita',
    emoji: '🏚️',
    story: `Você herda uma fazenda abandonada de um tio distante que nunca conheceu. As cartas do advogado mencionam apenas: "Cuide bem da terra, ela tem seus segredos".

Ao chegar, você encontra o solo árido, mas algo brilha quando pisca os olhos. Moedas antigas emergem da terra quando você caminha. A fazenda parece... viva.`,
    shopItems: [
      {
        id: 'old_shovel',
        name: 'Pá Enferrujada',
        description: 'Uma ferramenta antiga encontrada no celeiro',
        emoji: '⛏️',
        price: 50,
        type: 'tool',
        effect: 'Permite cavar mais profundamente'
      },
      {
        id: 'lantern',
        name: 'Lanterna de Óleo',
        description: 'Ilumina os cantos escuros da fazenda',
        emoji: '🏮',
        price: 30,
        type: 'tool',
        effect: 'Revela áreas ocultas'
      },
      {
        id: 'old_map',
        name: 'Mapa Rasgado',
        description: 'Marcações estranhas indicam algo enterrado',
        emoji: '🗺️',
        price: 80,
        type: 'document',
        effect: 'Mostra localização de tesouros'
      }
    ],
    objectives: [
      {
        id: 'buy_shovel',
        description: 'Compre a Pá Enferrujada para começar a explorar',
        type: 'buy_item',
        target: 1,
        requiredItemId: 'old_shovel',
        current: 0,
        completed: false,
        emoji: '⛏️'
      },
      {
        id: 'buy_lantern',
        description: 'Adquira a Lanterna para iluminar a noite',
        type: 'buy_item',
        target: 1,
        requiredItemId: 'lantern',
        current: 0,
        completed: false,
        emoji: '🏮'
      }
    ],
    rewards: {
      exp: 50,
      coins: 100,
      badge: 'Herdeiro Maldito',
      item: {
        itemId: 'cursed_compass',
        name: 'Bússola Amaldiçoada',
        emoji: '🧭',
        description: 'Aponta sempre para o norte... ou será para algo mais?',
        quantity: 1,
        acquiredAt: new Date(),
        chapterId: 1
      },
      emoji: '🏚️'
    }
  },
  {
    id: 2,
    phase: 1,
    title: 'Ecos do Passado',
    emoji: '👻',
    story: `Durante a noite, você ouve sussurros vindos do porão. Vozes antigas falam em uma língua que você não reconhece, mas de alguma forma... compreende.

"Liberte-nos... complete o ritual... a terra recompensará..."

Você precisa de ferramentas para investigar o porão escuro.`,
    shopItems: [
      {
        id: 'rope',
        name: 'Corda Resistente',
        description: 'Necessária para descer ao porão',
        emoji: '🪢',
        price: 120,
        type: 'tool',
        effect: 'Permite acessar áreas profundas'
      },
      {
        id: 'holy_water',
        name: 'Água Benta',
        description: 'Protege contra entidades malignas',
        emoji: '💧',
        price: 150,
        type: 'consumable',
        effect: 'Proteção espiritual'
      },
      {
        id: 'ancient_key',
        name: 'Chave Antiga',
        description: 'Encontrada no mapa, abre portas trancadas',
        emoji: '🔑',
        price: 200,
        type: 'key',
        effect: 'Abre salas secretas'
      }
    ],
    objectives: [
      {
        id: 'buy_rope',
        description: 'Compre a Corda para descer ao porão',
        type: 'buy_item',
        target: 1,
        requiredItemId: 'rope',
        current: 0,
        completed: false,
        emoji: '🪢'
      },
      {
        id: 'buy_holy_water',
        description: 'Adquira Água Benta para proteção',
        type: 'buy_item',
        target: 1,
        requiredItemId: 'holy_water',
        current: 0,
        completed: false,
        emoji: '💧'
      },
      {
        id: 'own_3_items',
        description: 'Tenha pelo menos 3 itens no inventário',
        type: 'own_items',
        target: 3,
        current: 0,
        completed: false,
        emoji: '📦'
      }
    ],
    rewards: {
      exp: 75,
      coins: 150,
      badge: 'Explorador das Sombras',
      item: {
        itemId: 'spirit_detector',
        name: 'Detector de Espíritos',
        emoji: '📡',
        description: 'Vibre quando entidades estão próximas',
        quantity: 1,
        acquiredAt: new Date(),
        chapterId: 2
      },
      emoji: '👻'
    }
  },
  {
    id: 3,
    phase: 1,
    title: 'O Diário Perdido',
    emoji: '📖',
    story: `No porão, você encontra o diário do seu tio. As páginas falam de um pacto feito décadas atrás. Ele prometeu sua alma em troca de prosperidade para a fazenda.

"O solo bebe sangue e cospe ouro. Cada moeda é uma lágrima da terra. Perdoe-me..."

As últimas páginas estão em branco, exceto por um desenho: um círculo de pedras no campo oeste.`,
    shopItems: [
      {
        id: 'magnifying_glass',
        name: 'Lupa de Investigador',
        description: 'Revela detalhes ocultos nos documentos',
        emoji: '🔍',
        price: 250,
        type: 'tool',
        effect: 'Decodifica símbolos antigos'
      },
      {
        id: 'leather_journal',
        name: 'Diário de Couro',
        description: 'Para registrar suas descobertas',
        emoji: '📓',
        price: 180,
        type: 'document',
        effect: 'Organiza informações'
      },
      {
        id: 'silver_cross',
        name: 'Cruz de Prata',
        description: 'Símbolo de proteção divina',
        emoji: '✝️',
        price: 320,
        type: 'protection',
        effect: 'Repele forças obscuras'
      },
      {
        id: 'ritual_candle',
        name: 'Vela Ritualística',
        description: 'Feita de cera negra, nunca apaga',
        emoji: '🕯️',
        price: 200,
        type: 'consumable',
        effect: 'Ilumina rituais'
      }
    ],
    objectives: [
      {
        id: 'buy_magnifying',
        description: 'Compre a Lupa para investigar o diário',
        type: 'buy_item',
        target: 1,
        requiredItemId: 'magnifying_glass',
        current: 0,
        completed: false,
        emoji: '🔍'
      },
      {
        id: 'buy_journal',
        description: 'Adquira o Diário de Couro',
        type: 'buy_item',
        target: 1,
        requiredItemId: 'leather_journal',
        current: 0,
        completed: false,
        emoji: '📓'
      },
      {
        id: 'collect_500',
        description: 'Acumule 500 moedas',
        type: 'collect_coins',
        target: 500,
        current: 0,
        completed: false,
        emoji: '💰'
      }
    ],
    rewards: {
      exp: 100,
      coins: 200,
      badge: 'Guardião de Segredos',
      item: {
        itemId: 'uncle_pendant',
        name: 'Pingente do Tio',
        emoji: '📿',
        description: 'Contém uma foto desbotada e um cristal escuro',
        quantity: 1,
        acquiredAt: new Date(),
        chapterId: 3
      },
      title: 'Investigador',
      emoji: '📖'
    }
  },
  {
    id: 4,
    phase: 1,
    title: 'Círculo de Pedras',
    emoji: '🗿',
    story: `Você encontra o círculo de pedras mencionado no diário. Cada pedra tem símbolos gravados que brilham sob a luz da lua.

No centro, há uma depressão na terra, como se algo tivesse sido enterrado e depois removido. O detector de espíritos vibra violentamente.

Você precisa de ferramentas especiais para ativar o círculo.`,
    shopItems: [
      {
        id: 'chisel',
        name: 'Cinzel de Pedra',
        description: 'Para gravar símbolos nas rochas',
        emoji: '🔨',
        price: 400,
        type: 'tool',
        effect: 'Modifica inscrições antigas'
      },
      {
        id: 'moon_crystal',
        name: 'Cristal Lunar',
        description: 'Absorve luz da lua cheia',
        emoji: '🔮',
        price: 500,
        type: 'magical',
        effect: 'Ativa círculos de poder'
      },
      {
        id: 'salt_circle',
        name: 'Sal Ritualístico',
        description: 'Cria barreiras de proteção',
        emoji: '⚪',
        price: 280,
        type: 'consumable',
        effect: 'Proteção contra invocações'
      }
    ],
    objectives: [
      {
        id: 'buy_chisel',
        description: 'Compre o Cinzel de Pedra',
        type: 'buy_item',
        target: 1,
        requiredItemId: 'chisel',
        current: 0,
        completed: false,
        emoji: '🔨'
      },
      {
        id: 'buy_crystal',
        description: 'Adquira o Cristal Lunar',
        type: 'buy_item',
        target: 1,
        requiredItemId: 'moon_crystal',
        current: 0,
        completed: false,
        emoji: '🔮'
      },
      {
        id: 'own_6_items',
        description: 'Possua 6 itens diferentes',
        type: 'own_items',
        target: 6,
        current: 0,
        completed: false,
        emoji: '🎒'
      }
    ],
    rewards: {
      exp: 150,
      coins: 300,
      badge: 'Ativador de Runas',
      item: {
        itemId: 'stone_fragment',
        name: 'Fragmento de Pedra Rúnica',
        emoji: '💎',
        description: 'Pulsa com energia antiga',
        quantity: 1,
        acquiredAt: new Date(),
        chapterId: 4
      },
      emoji: '🗿'
    }
  },
  {
    id: 5,
    phase: 1,
    title: 'Invocação Acidental',
    emoji: '👁️',
    story: `Ao ativar o círculo, uma fenda se abre no ar. Olhos vermelhos brilham na escuridão além. Uma voz ecoa:

"FINALMENTE... TANTO TEMPO APRISIONADO... QUEM OUSA ME LIBERTAR?"

O círculo de sal que você preparou é a única coisa mantendo a entidade contida. Você precisa de itens específicos para selar a fenda antes que seja tarde demais.`,
    shopItems: [
      {
        id: 'sealing_wax',
        name: 'Cera de Selamento',
        description: 'Infundida com orações antigas',
        emoji: '🕯️',
        price: 600,
        type: 'magical',
        effect: 'Sela portais dimensionais'
      },
      {
        id: 'sage_bundle',
        name: 'Feixe de Sálvia',
        description: 'Purifica energias negativas',
        emoji: '🌿',
        price: 350,
        type: 'consumable',
        effect: 'Limpa aura maligna'
      },
      {
        id: 'iron_chain',
        name: 'Corrente de Ferro',
        description: 'Ferro frio repele o sobrenatural',
        emoji: '⛓️',
        price: 450,
        type: 'tool',
        effect: 'Prende entidades'
      },
      {
        id: 'banishment_scroll',
        name: 'Pergaminho de Banimento',
        description: 'Palavras de poder escritas em sangue',
        emoji: '📜',
        price: 700,
        type: 'consumable',
        effect: 'Expulsa demônios'
      }
    ],
    objectives: [
      {
        id: 'buy_wax',
        description: 'Compre a Cera de Selamento',
        type: 'buy_item',
        target: 1,
        requiredItemId: 'sealing_wax',
        current: 0,
        completed: false,
        emoji: '🕯️'
      },
      {
        id: 'buy_scroll',
        description: 'Adquira o Pergaminho de Banimento',
        type: 'buy_item',
        target: 1,
        requiredItemId: 'banishment_scroll',
        current: 0,
        completed: false,
        emoji: '📜'
      },
      {
        id: 'collect_1000',
        description: 'Junte 1.000 moedas',
        type: 'collect_coins',
        target: 1000,
        current: 0,
        completed: false,
        emoji: '💰'
      }
    ],
    rewards: {
      exp: 200,
      coins: 400,
      badge: 'Domador de Demônios',
      title: 'Selador',
      item: {
        itemId: 'demon_eye',
        name: 'Olho Demoníaco',
        emoji: '👁️',
        description: 'Arrancado da entidade antes do selamento',
        quantity: 1,
        acquiredAt: new Date(),
        chapterId: 5
      },
      emoji: '👁️'
    }
  },
  {
    id: 6,
    phase: 1,
    title: 'A Primeira Colheita',
    emoji: '🌾',
    story: `Com a entidade selada, a terra se acalma. Pela primeira vez desde sua chegada, você vê brotos verdes emergindo do solo.

Mas há algo errado. As plantas crescem rápido demais, de forma antinatural. Em questão de horas, você tem uma colheita completa de trigo... trigo negro, que brilha levemente no escuro.

Você precisa de ferramentas para processar esta colheita estranha.`,
    shopItems: [
      {
        id: 'scythe',
        name: 'Foice Afiada',
        description: 'Lâmina curva para colher',
        emoji: '🗡️',
        price: 800,
        type: 'tool',
        effect: 'Colhe plantas especiais'
      },
      {
        id: 'mill',
        name: 'Moinho Portátil',
        description: 'Transforma grãos em farinha',
        emoji: '⚙️',
        price: 1200,
        type: 'equipment',
        effect: 'Processa colheitas'
      },
      {
        id: 'glass_vials',
        name: 'Frascos de Vidro',
        description: 'Para armazenar essências',
        emoji: '⚗️',
        price: 500,
        type: 'tool',
        effect: 'Preserva propriedades mágicas'
      }
    ],
    objectives: [
      {
        id: 'buy_scythe',
        description: 'Compre a Foice Afiada',
        type: 'buy_item',
        target: 1,
        requiredItemId: 'scythe',
        current: 0,
        completed: false,
        emoji: '🗡️'
      },
      {
        id: 'buy_mill',
        description: 'Adquira o Moinho Portátil',
        type: 'buy_item',
        target: 1,
        requiredItemId: 'mill',
        current: 0,
        completed: false,
        emoji: '⚙️'
      },
      {
        id: 'own_10_items',
        description: 'Tenha 10 itens no inventário',
        type: 'own_items',
        target: 10,
        current: 0,
        completed: false,
        emoji: '🎒'
      }
    ],
    rewards: {
      exp: 250,
      coins: 600,
      badge: 'Fazendeiro das Trevas',
      item: {
        itemId: 'dark_wheat',
        name: 'Trigo das Sombras',
        emoji: '🌾',
        description: 'Grãos negros que brilham com luz própria',
        quantity: 1,
        acquiredAt: new Date(),
        chapterId: 6
      },
      emoji: '🌾'
    }
  },
  {
    id: 7,
    phase: 1,
    title: 'Visitantes Noturnos',
    emoji: '🦇',
    story: `Três figuras encapuzadas aparecem à sua porta ao anoitecer. Eles sabem sobre a colheita. Sabem sobre o círculo. Sabem sobre o pacto.

"Somos a Ordem dos Guardiões. Seu tio nos procurou antes de desaparecer. Você tem a marca agora... você está ligado à terra assim como ele estava."

Eles oferecem ajuda... por um preço.`,
    shopItems: [
      {
        id: 'guardian_cloak',
        name: 'Manto dos Guardiões',
        description: 'Oferecido pela Ordem, protege contra olhares',
        emoji: '🧥',
        price: 1500,
        type: 'equipment',
        effect: 'Invisibilidade parcial'
      },
      {
        id: 'ward_stone',
        name: 'Pedra de Proteção',
        description: 'Mantém entidades afastadas da fazenda',
        emoji: '🛡️',
        price: 1000,
        type: 'protection',
        effect: 'Barreira de proteção'
      },
      {
        id: 'knowledge_tome',
        name: 'Tomo do Conhecimento',
        description: 'Contém rituais e feitiços básicos',
        emoji: '📚',
        price: 2000,
        type: 'document',
        effect: 'Ensina magias'
      },
      {
        id: 'blood_ink',
        name: 'Tinta de Sangue',
        description: 'Necessária para escrever contratos',
        emoji: '🩸',
        price: 800,
        type: 'consumable',
        effect: 'Liga contratos mágicos'
      }
    ],
    objectives: [
      {
        id: 'buy_cloak',
        description: 'Compre o Manto dos Guardiões',
        type: 'buy_item',
        target: 1,
        requiredItemId: 'guardian_cloak',
        current: 0,
        completed: false,
        emoji: '🧥'
      },
      {
        id: 'buy_tome',
        description: 'Adquira o Tomo do Conhecimento',
        type: 'buy_item',
        target: 1,
        requiredItemId: 'knowledge_tome',
        current: 0,
        completed: false,
        emoji: '📚'
      },
      {
        id: 'collect_2500',
        description: 'Acumule 2.500 moedas',
        type: 'collect_coins',
        target: 2500,
        current: 0,
        completed: false,
        emoji: '💰'
      }
    ],
    rewards: {
      exp: 300,
      coins: 800,
      badge: 'Iniciado da Ordem',
      title: 'Guardião Aprendiz',
      item: {
        itemId: 'order_seal',
        name: 'Selo da Ordem',
        emoji: '🔱',
        description: 'Marca você como membro da Ordem dos Guardiões',
        quantity: 1,
        acquiredAt: new Date(),
        chapterId: 7
      },
      emoji: '🦇'
    }
  },
  {
    id: 8,
    phase: 1,
    title: 'O Preço do Poder',
    emoji: '⚡',
    story: `A Ordem ensina seu primeiro ritual: como canalizar a energia da terra para aumentar sua força. Mas cada uso tem um custo.

Suas mãos começam a desenvolver marcas negras. Seus olhos ocasionalmente brilham vermelhos. Você está se tornando algo... diferente.

"O poder sempre cobra seu preço", diz o líder da Ordem. "Seu tio aprendeu isso tarde demais."`,
    shopItems: [
      {
        id: 'power_gloves',
        name: 'Luvas de Canalização',
        description: 'Reduzem o custo de usar poder',
        emoji: '🧤',
        price: 2500,
        type: 'equipment',
        effect: 'Menos efeitos colaterais'
      },
      {
        id: 'soul_gem',
        name: 'Gema da Alma',
        description: 'Armazena energia mágica',
        emoji: '💠',
        price: 3000,
        type: 'magical',
        effect: 'Reserva de poder'
      },
      {
        id: 'meditation_mat',
        name: 'Tapete de Meditação',
        description: 'Ajuda a controlar o poder interior',
        emoji: '🧘',
        price: 1500,
        type: 'equipment',
        effect: 'Aumenta controle'
      },
      {
        id: 'cleansing_herbs',
        name: 'Ervas Purificadoras',
        description: 'Removem corrupção temporariamente',
        emoji: '🌿',
        price: 1200,
        type: 'consumable',
        effect: 'Purifica corpo'
      }
    ],
    objectives: [
      {
        id: 'buy_gloves',
        description: 'Compre as Luvas de Canalização',
        type: 'buy_item',
        target: 1,
        requiredItemId: 'power_gloves',
        current: 0,
        completed: false,
        emoji: '🧤'
      },
      {
        id: 'buy_gem',
        description: 'Adquira a Gema da Alma',
        type: 'buy_item',
        target: 1,
        requiredItemId: 'soul_gem',
        current: 0,
        completed: false,
        emoji: '💠'
      },
      {
        id: 'own_15_items',
        description: 'Possua 15 itens diferentes',
        type: 'own_items',
        target: 15,
        current: 0,
        completed: false,
        emoji: '🎒'
      }
    ],
    rewards: {
      exp: 400,
      coins: 1000,
      badge: 'Portador do Poder',
      item: {
        itemId: 'corruption_mark',
        name: 'Marca da Corrupção',
        emoji: '🖤',
        description: 'Símbolo do poder que flui em suas veias',
        quantity: 1,
        acquiredAt: new Date(),
        chapterId: 8
      },
      emoji: '⚡'
    }
  },
  {
    id: 9,
    phase: 1,
    title: 'Ecos de Arrependimento',
    emoji: '💔',
    story: `Você encontra mais páginas do diário do seu tio, escondidas em uma caixa falsa no sótão:

"Eu pensei que poderia controlar. Pensei que o poder valeria a pena. Agora as marcas se espalharam até meu coração. Posso ouvi-lo batendo em sintonia com a terra amaldiçoada.

Se alguém ler isso... fuja. Queime esta fazenda. Não cometa meu erro..."

Mas você já foi longe demais para voltar atrás.`,
    shopItems: [
      {
        id: 'antique_mirror',
        name: 'Espelho Antigo',
        description: 'Mostra seu verdadeiro eu',
        emoji: '🪞',
        price: 3500,
        type: 'magical',
        effect: 'Revela transformações'
      },
      {
        id: 'binding_chains',
        name: 'Correntes de Contenção',
        description: 'Para quando perder o controle',
        emoji: '⛓️',
        price: 2800,
        type: 'protection',
        effect: 'Auto-contenção'
      },
      {
        id: 'memory_crystal',
        name: 'Cristal de Memória',
        description: 'Registra suas últimas vontades',
        emoji: '💎',
        price: 4000,
        type: 'magical',
        effect: 'Preserva consciência'
      },
      {
        id: 'hope_locket',
        name: 'Relicário da Esperança',
        description: 'Último elo com sua humanidade',
        emoji: '💝',
        price: 5000,
        type: 'protection',
        effect: 'Âncora moral'
      }
    ],
    objectives: [
      {
        id: 'buy_mirror',
        description: 'Compre o Espelho Antigo',
        type: 'buy_item',
        target: 1,
        requiredItemId: 'antique_mirror',
        current: 0,
        completed: false,
        emoji: '🪞'
      },
      {
        id: 'buy_locket',
        description: 'Adquira o Relicário da Esperança',
        type: 'buy_item',
        target: 1,
        requiredItemId: 'hope_locket',
        current: 0,
        completed: false,
        emoji: '💝'
      },
      {
        id: 'collect_5000',
        description: 'Junte 5.000 moedas',
        type: 'collect_coins',
        target: 5000,
        current: 0,
        completed: false,
        emoji: '💰'
      }
    ],
    rewards: {
      exp: 500,
      coins: 1500,
      badge: 'Coração Dividido',
      title: 'Atormentado',
      item: {
        itemId: 'uncle_last_letter',
        name: 'Última Carta do Tio',
        emoji: '✉️',
        description: 'Palavras finais escritas com mão trêmula',
        quantity: 1,
        acquiredAt: new Date(),
        chapterId: 9
      },
      emoji: '💔'
    }
  },
  {
    id: 10,
    phase: 1,
    title: 'A Escolha',
    emoji: '⚖️',
    story: `A Ordem dos Guardiões retorna com uma proposta:

"Você tem duas opções. Primeira: deixe-nos selar a fazenda e sua ligação com ela. Você perderá tudo, mas ficará livre.

Segunda: complete o ritual de seu tio. Aceite totalmente o poder da terra. Torne-se o Guardião definitivo deste lugar amaldiçoado.

Escolha sabiamente. Esta é a única vez que oferecemos essa escolha."

Mas você sabe que já decidiu. O poder... é viciante.`,
    shopItems: [
      {
        id: 'ritual_chalice',
        name: 'Cálice Ritualístico',
        description: 'Para completar o ritual de ligação',
        emoji: '🏆',
        price: 6000,
        type: 'magical',
        effect: 'Completa rituais'
      },
      {
        id: 'sacrifice_dagger',
        name: 'Adaga do Sacrifício',
        description: 'Todo poder exige sangue',
        emoji: '🗡️',
        price: 5500,
        type: 'tool',
        effect: 'Catalisa rituais'
      },
      {
        id: 'ancient_crown',
        name: 'Coroa Ancestral',
        description: 'Símbolo do Guardião supremo',
        emoji: '👑',
        price: 8000,
        type: 'equipment',
        effect: 'Autoridade absoluta'
      },
      {
        id: 'soul_contract',
        name: 'Contrato da Alma',
        description: 'Acordo final com a terra',
        emoji: '📄',
        price: 7000,
        type: 'document',
        effect: 'Liga eternamente'
      }
    ],
    objectives: [
      {
        id: 'buy_chalice',
        description: 'Compre o Cálice Ritualístico',
        type: 'buy_item',
        target: 1,
        requiredItemId: 'ritual_chalice',
        current: 0,
        completed: false,
        emoji: '🏆'
      },
      {
        id: 'buy_crown',
        description: 'Adquira a Coroa Ancestral',
        type: 'buy_item',
        target: 1,
        requiredItemId: 'ancient_crown',
        current: 0,
        completed: false,
        emoji: '👑'
      },
      {
        id: 'buy_contract',
        description: 'Obtenha o Contrato da Alma',
        type: 'buy_item',
        target: 1,
        requiredItemId: 'soul_contract',
        current: 0,
        completed: false,
        emoji: '📄'
      },
      {
        id: 'own_20_items',
        description: 'Possua 20 itens no inventário',
        type: 'own_items',
        target: 20,
        current: 0,
        completed: false,
        emoji: '🎒'
      }
    ],
    rewards: {
      exp: 600,
      coins: 2000,
      badge: 'Guardião Ascendente',
      title: 'Senhor da Fazenda Maldita',
      item: {
        itemId: 'guardian_seal',
        name: 'Selo do Guardião Supremo',
        emoji: '🔮',
        description: 'Marca de sua ligação eterna com a terra',
        quantity: 1,
        acquiredAt: new Date(),
        chapterId: 10
      },
      emoji: '⚖️'
    }
  }
];

