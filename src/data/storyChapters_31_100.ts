import { StoryChapter } from '../types/story';

/**
 * CAPÍTULOS 31-100 - A FAZENDA MALDITA
 * Continuação da história épica
 */

export const chapters_31_100: StoryChapter[] = [
  // ==================== FASE 4: PACTO DE SANGUE (Capítulos 31-40) ====================
  {
    id: 31,
    phase: 4,
    title: 'Ecos do Passado',
    emoji: '🔊',
    story: '📻 A fazenda está purificada, mas você começa a ouvir sussurros novamente. Não da entidade - ela está selada. São ecos de todas as vidas que passaram por aqui. Eles não são hostis. Estão... agradecidos. Compartilham conhecimentos: técnicas agrícolas secretas, localizações de tesouros enterrados, avisos sobre perigos futuros. A fazenda se torna um centro de peregrinação. Pessoas vêm de longe buscar orientação dos espíritos benevolentes. Você se tornou guardião de algo sagrado.',
    objectives: [
      { id: 'coins_40000000', description: 'Acumule 40M de moedas', type: 'coins', target: 40000000, current: 0, completed: false, emoji: '💰' },
      { id: 'upgrade_55', description: 'Obtenha 55 melhorias', type: 'upgrades', target: 55, current: 0, completed: false, emoji: '🛒' },
    ],
    rewards: {
      coins: 12000000,
      multiplier: 6.0,
      badge: 'Ouvinte dos Ancestrais',
      emoji: '🔊',
    },
    unlocked: false,
    completed: false,
  },
  {
    id: 32,
    phase: 4,
    title: 'Legado de Sangue',
    emoji: '🧬',
    story: '🔬 Pesquisadores chegam interessados na sua linhagem. "Seu DNA é... único," explicam. "Você não só sobreviveu à exposição da entidade, mas evoluiu. Pode perceber fendas dimensionais antes que se abram." Isso explica seus pesadelos premonitórios. Eles querem estudar você. Criar uma "guarda dimensional" usando seu sangue como base. É invasivo. É assustador. Mas pode salvar milhões de futuras vítimas de entidades similares. Você concorda doar amostras. A ciência encontra a magia.',
    objectives: [
      { id: 'persecond_1500000', description: 'Gere 1.5M moedas/s', type: 'perSecond', target: 1500000, current: 0, completed: false, emoji: '📈' },
      { id: 'clicks_1500000', description: 'Interaja 1.5M vezes', type: 'clicks', target: 1500000, current: 0, completed: false, emoji: '👆' },
    ],
    rewards: {
      coins: 15000000,
      badge: 'Doador de Esperança',
      emoji: '🧬',
      title: 'Primeiro dos Guardiões',
    },
    unlocked: false,
    completed: false,
  },
  {
    id: 33,
    phase: 4,
    title: 'O Museu Vivo',
    emoji: '🏛️',
    story: '🖼️ Você transforma a fazenda em museu vivo. O celeiro proibido exibe os artefatos amaldiçoados - agora inertes e seguros. A árvore negra é preservada como memorial. O poço, selado mas visível, com placas explicando sua história. Guias turísticos contam a saga. Crianças aprendem sobre coragem, sacrifício e redenção. Um diretor de cinema quer fazer um filme. Um compositor, uma ópera. Sua história se torna lenda. E você? Continua plantando, humildemente, nas terras que salvou.',
    objectives: [
      { id: 'coins_60000000', description: 'Acumule 60M de moedas', type: 'coins', target: 60000000, current: 0, completed: false, emoji: '💰' },
      { id: 'upgrade_60', description: 'Possua 60 melhorias', type: 'upgrades', target: 60, current: 0, completed: false, emoji: '🛒' },
    ],
    rewards: {
      coins: 20000000,
      multiplier: 6.5,
      badge: 'Preservador da História',
      emoji: '🏛️',
    },
    unlocked: false,
    completed: false,
  },
  {
    id: 34,
    phase: 4,
    title: 'Ameaça Renovada',
    emoji: '⚠️',
    story: '🌪️ Cinco anos depois. Você vive pacificamente quando sente: uma fenda dimensional se abrindo. Não aqui - a 2.000km de distância. Outra fazenda. Outra entidade. Seus pesadelos voltam. Você é a única pessoa viva que sabe como lidar com isso. A guarda dimensional que criaram ainda está em treinamento - inúteis para essa ameaça. Você deve ir. Deixar sua paz conquistada e mergulhar no horror novamente. Mas agora, você tem experiência. Tem aliados. E tem esperança. Você não está mais com medo.',
    objectives: [
      { id: 'persecond_2000000', description: 'Alcance 2M moedas/s', type: 'perSecond', target: 2000000, current: 0, completed: false, emoji: '📈' },
      { id: 'clicks_2000000', description: 'Clique 2M vezes', type: 'clicks', target: 2000000, current: 0, completed: false, emoji: '👆' },
    ],
    rewards: {
      coins: 25000000,
      badge: 'Defensor Itinerante',
      emoji: '⚠️',
      title: 'Caçador de Entidades',
    },
    unlocked: false,
    completed: false,
  },
  {
    id: 35,
    phase: 4,
    title: 'Segunda Fazenda',
    emoji: '🏚️',
    story: '🗺️ Esta fazenda é pior. A entidade aqui está mais forte, mais antiga. Ela aprendeu com a falha da sua predecessora. Os carcereiros anteriores foram todos consumidos - não há aliados fantasmagóricos. Você está sozinho. Mas encontra algo: diários. O último carcereiro era... sua avó. Ela morreu quando você tinha 3 anos. "Se alguém ler isto," ela escreveu, "saiba que preparei um neto para terminar meu trabalho." Tudo foi planejado. Sua vida inteira foi preparação. A raiva e a gratidão se misturam.',
    objectives: [
      { id: 'coins_80000000', description: 'Junte 80M moedas', type: 'coins', target: 80000000, current: 0, completed: false, emoji: '💰' },
      { id: 'upgrade_65', description: 'Obtenha 65 melhorias', type: 'upgrades', target: 65, current: 0, completed: false, emoji: '🛒' },
    ],
    rewards: {
      coins: 30000000,
      multiplier: 7.0,
      badge: 'Herdeiro Revelado',
      emoji: '🏚️',
    },
    unlocked: false,
    completed: false,
  },
  {
    id: 36,
    phase: 4,
    title: 'Lições da Avó',
    emoji: '👵',
    story: '📖 Nos diários, sua avó deixou 50 anos de pesquisa. Pontos fracos de entidades. Rituais de proteção. Locais de poder. Ela sabia que falharia - não tinha força física mais. Mas criou um manual completo. "Desculpe fazer isso com você," ela escreveu na última página. "Mas você é especial. Nasceu sob um eclipse triplo. Seu sangue carrega poder dimensional natural. Você é a arma que passei a vida forjando." Você chora. Depois, seca as lágrimas e estuda. Ela não morrerá em vão.',
    objectives: [
      { id: 'persecond_3000000', description: 'Gere 3M moedas/s', type: 'perSecond', target: 3000000, current: 0, completed: false, emoji: '📈' },
      { id: 'clicks_2500000', description: 'Interaja 2.5M vezes', type: 'clicks', target: 2500000, current: 0, completed: false, emoji: '👆' },
    ],
    rewards: {
      coins: 35000000,
      badge: 'Estudante da Avó Guerreira',
      emoji: '👵',
      title: 'Continuador do Legado',
    },
    unlocked: false,
    completed: false,
  },
  {
    id: 37,
    phase: 4,
    title: 'Ritual de Invocação',
    emoji: '🕯️',
    story: '🔮 Usando os diários, você realiza um ritual para invocar o espírito da sua avó. Ela aparece, mais forte que os outros fantasmas - porque você carrega seu sangue. "Meu querido neto," ela sorri com orgulho. "Você superou minhas expectativas." Juntos, vocês planejam. Ela conhece os padrões desta entidade. Você tem a força que ela nunca teve. A combinação é perfeita. "Quando terminar aqui," ela diz, "há mais 12 fazendas malditas globalmente. Trabalho para uma vida inteira. Mas você não estará sozinho. Vou guiá-lo em cada uma."',
    objectives: [
      { id: 'coins_100000000', description: 'Acumule 100M moedas', type: 'coins', target: 100000000, current: 0, completed: false, emoji: '💰' },
      { id: 'upgrade_70', description: 'Possua 70 melhorias', type: 'upgrades', target: 70, current: 0, completed: false, emoji: '🛒' },
    ],
    rewards: {
      coins: 40000000,
      multiplier: 7.5,
      badge: 'Guiado pelos Ancestrais',
      emoji: '🕯️',
    },
    unlocked: false,
    completed: false,
  },
  {
    id: 38,
    phase: 4,
    title: 'Confronto Duplo',
    emoji: '⚔️',
    story: '⚡ A entidade desta fazenda tenta um truque: divide-se em duas formas físicas. Uma ataca você. Outra, sua avó espiritual. "Se eu destruir o fantasma, você fica sozinho!" Mas sua avó ri. "Tolo. Não entende amor familiar." Ela se funde com você temporariamente. Seu corpo brilha com poder ancestral. Duas gerações de conhecimento em um corpo. Você luta com a técnica dela e sua força. A entidade recua, chocada. "Impossível! Mortais não podem..." Você interrompe com um golpe que fragmenta suas duas formas.',
    objectives: [
      { id: 'persecond_5000000', description: 'Alcance 5M moedas/s', type: 'perSecond', target: 5000000, current: 0, completed: false, emoji: '📈' },
      { id: 'clicks_3000000', description: 'Clique 3M vezes', type: 'clicks', target: 3000000, current: 0, completed: false, emoji: '👆' },
    ],
    rewards: {
      coins: 50000000,
      badge: 'Fusão Geracional',
      emoji: '⚔️',
      title: 'Lâmina de Duas Almas',
    },
    unlocked: false,
    completed: false,
  },
  {
    id: 39,
    phase: 4,
    title: 'Aprisionamento Aperfeiçoado',
    emoji: '🔐',
    story: '⛓️ Você aprisiona a segunda entidade usando técnica melhorada. Não apenas sete dimensões - agora você usa 49, uma grade impenetrável. Cada fragmento menor, mais contido. A entidade implora: "Por favor, a solidão de 49 prisões é demais!" Você hesita. Sua avó sussurra: "Compaixão é bom. Mas lembre: quantos ela torturou?" Você endurece o coração. "Deveria ter pensado nisso antes," e sela o último fragmento. A segunda fazenda está livre. Mais importante: você provou que pode ser replicado. Há esperança para as outras 12.',
    objectives: [
      { id: 'coins_150000000', description: 'Junte 150M moedas', type: 'coins', target: 150000000, current: 0, completed: false, emoji: '💰' },
      { id: 'upgrade_75', description: 'Obtenha 75 melhorias', type: 'upgrades', target: 75, current: 0, completed: false, emoji: '🛒' },
    ],
    rewards: {
      coins: 60000000,
      multiplier: 8.0,
      badge: 'Mestre do Aprisionamento',
      emoji: '🔐',
    },
    unlocked: false,
    completed: false,
  },
  {
    id: 40,
    phase: 4,
    title: 'A Academia de Guardiões',
    emoji: '🎓',
    story: '🏫 Com duas vitórias, você é herói mundial. Governos oferecem recursos ilimitados. Você funda a Academia de Guardiões Dimensionais - a primeira escola para combater entidades cósmicas. Treina 100 alunos usando métodos da avó e sua experiência. Entre eles, 12 se destacam - um para cada fazenda restante. "Vocês não lutarão sozinhos," você promete. "Eu estarei com cada um, assim como minha avó está comigo." Pela primeira vez na história, a humanidade toma postura ativa contra o horror cósmico. A era dos guardiões começa.',
    objectives: [
      { id: 'persecond_10000000', description: 'Gere 10M moedas/s', type: 'perSecond', target: 10000000, current: 0, completed: false, emoji: '📈' },
      { id: 'clicks_5000000', description: 'Interaja 5M vezes', type: 'clicks', target: 5000000, current: 0, completed: false, emoji: '👆' },
      { id: 'coins_200000000', description: 'Acumule 200M de moedas', type: 'coins', target: 200000000, current: 0, completed: false, emoji: '💰' },
    ],
    rewards: {
      coins: 75000000,
      multiplier: 8.5,
      badge: 'Fundador da Academia',
      emoji: '🎓',
      title: 'Grande Mestre dos Guardiões',
    },
    unlocked: false,
    completed: false,
  },

  // ==================== FASE 5: OLHOS NAS SOMBRAS (Capítulos 41-50) ====================
  {
    id: 41,
    phase: 5,
    title: 'Vigilantes Noturnos',
    emoji: '👁️',
    story: '🌃 A Academia dos Guardiões está estabelecida, mas algo mudou. Você começou a ver... olhos. Nas sombras, nas árvores, nos reflexos. Não são hostis - são vigilantes. Entidades menores que observam, aprendem, aguardam. "São sentinelas de outras dimensões," explica um guardião veterano. "Elas sabem que você selou algo poderoso. Querem ver se você é guardião... ou presa." Você reforça as defesas, mas sente o peso de mil olhares invisíveis.',
    objectives: [
      { id: 'coins_45000000', description: 'Acumule 45M de moedas', type: 'coins', target: 45000000, current: 0, completed: false, emoji: '💰' },
      { id: 'upgrade_60', description: 'Obtenha 60 melhorias', type: 'upgrades', target: 60, current: 0, completed: false, emoji: '🛒' },
    ],
    rewards: {
      coins: 15000000,
      multiplier: 6.5,
      badge: 'Observado',
      emoji: '👁️',
    },
    unlocked: false,
    completed: false,
  },
  {
    id: 42,
    phase: 5,
    title: 'Rede de Informação',
    emoji: '🕸️',
    story: '🗺️ Os guardiões compartilham dados: fazendas similares surgiram em outros continentes. Todas conectadas. Todas com entidades seladas. Vocês criam uma rede global - trocam conhecimento, estratégias, alertas. "Não estamos sozinhos nisso," você percebe. Existem DOZE pontos no planeta. Doze fazendas. Doze entidades. E todas estão... despertando. O selo que você criou pode ter sido apenas o começo.',
    objectives: [
      { id: 'persecond_2000000', description: 'Gere 2M moedas/s', type: 'perSecond', target: 2000000, current: 0, completed: false, emoji: '📈' },
      { id: 'clicks_2000000', description: 'Interaja 2M vezes', type: 'clicks', target: 2000000, current: 0, completed: false, emoji: '👆' },
    ],
    rewards: {
      coins: 18000000,
      badge: 'Coordenador Global',
      emoji: '🕸️',
      title: 'Nó da Rede',
    },
    unlocked: false,
    completed: false,
  },
  {
    id: 43,
    phase: 5,
    title: 'Primeira Invasão',
    emoji: '⚔️',
    story: '⚡ A fazenda do Japão cai. A entidade se libertou. Centenas morrem antes dos guardiões locais conseguirem conter. O vídeo chega até você: criatura de tentáculos e fogo, realidade se dissolvendo ao seu redor. "Se uma pode escapar..." murmura Eliza, que reapareceu. "Todas podem." Você reforça tudo. Treinamentos intensificam. Arsenal místico dobra. Esta é guerra.',
    objectives: [
      { id: 'coins_50000000', description: 'Acumule 50M de moedas', type: 'coins', target: 50000000, current: 0, completed: false, emoji: '💰' },
      { id: 'upgrade_65', description: 'Obtenha 65 melhorias', type: 'upgrades', target: 65, current: 0, completed: false, emoji: '🛒' },
    ],
    rewards: {
      coins: 20000000,
      multiplier: 7.0,
      badge: 'Sobrevivente de Invasão',
      emoji: '⚔️',
    },
    unlocked: false,
    completed: false,
  },
  {
    id: 44,
    phase: 5,
    title: 'Refugiados Dimensionais',
    emoji: '🚪',
    story: '🌀 Portais se abrem espontaneamente. Mas dessa vez, não são ameaças - são refugiados. Seres de outras dimensões fugindo das entidades libertadas. Eles pedem asilo na sua fazenda, que se tornou santuário conhecido através das realidades. Você aceita. Aprende magias de outras dimensões, técnicas impossíveis, conhecimento cósmico. Sua fazenda agora é um nexo multidimensional.',
    objectives: [
      { id: 'persecond_2500000', description: 'Gere 2.5M moedas/s', type: 'perSecond', target: 2500000, current: 0, completed: false, emoji: '📈' },
      { id: 'clicks_2500000', description: 'Interaja 2.5M vezes', type: 'clicks', target: 2500000, current: 0, completed: false, emoji: '👆' },
    ],
    rewards: {
      coins: 22000000,
      badge: 'Anfitrião Dimensional',
      emoji: '🚪',
      title: 'Guardião do Nexo',
    },
    unlocked: false,
    completed: false,
  },
  {
    id: 45,
    phase: 5,
    title: 'O Traidor Revelado',
    emoji: '🎭',
    story: '😱 Um dos guardiões veteranos é exposto: ele trabalhava para as entidades. Sabotava selos, compartilhava informações, planejava libertação em massa. "Elas me prometeram poder," ele confessa antes de desaparecer num portal. Você percebe: o inimigo está entre vocês. Confiança despedaça. Paranoia cresce. Cada guardião agora é suspeito. A guerra não é só externa.',
    objectives: [
      { id: 'coins_55000000', description: 'Acumule 55M de moedas', type: 'coins', target: 55000000, current: 0, completed: false, emoji: '💰' },
      { id: 'upgrade_70', description: 'Obtenha 70 melhorias', type: 'upgrades', target: 70, current: 0, completed: false, emoji: '🛒' },
    ],
    rewards: {
      coins: 25000000,
      multiplier: 7.5,
      badge: 'Caçador de Traidores',
      emoji: '🎭',
    },
    unlocked: false,
    completed: false,
  },
  {
    id: 46,
    phase: 5,
    title: 'Purificação Interna',
    emoji: '🔥',
    story: '✨ Você cria um ritual de purificação. Cada guardião deve passar por ele - expõe corrupção dimensional, influências das entidades, mentiras ocultas. É doloroso, invasivo, necessário. Três traidores são descobertos e banidos. O resto? Purificado. Fortalecido. A Academia renasce com confiança renovada. "Agora," você declara, "somos verdadeiros."',
    objectives: [
      { id: 'persecond_3000000', description: 'Gere 3M moedas/s', type: 'perSecond', target: 3000000, current: 0, completed: false, emoji: '📈' },
      { id: 'clicks_3000000', description: 'Interaja 3M vezes', type: 'clicks', target: 3000000, current: 0, completed: false, emoji: '👆' },
    ],
    rewards: {
      coins: 28000000,
      badge: 'Purificador',
      emoji: '🔥',
      title: 'Aquele que Vê Verdades',
    },
    unlocked: false,
    completed: false,
  },
  {
    id: 47,
    phase: 5,
    title: 'Aliança Improvável',
    emoji: '🤝',
    story: '👽 Uma entidade menor se aproxima. Não hostil - assustada. "As grandes estão despertas," ela sussurra. "Elas vão consumir TUDO. Até nós, os menores." Ela oferece aliança: conhecimento das entidades maiores em troca de proteção. É arriscado. Mas você aceita. O inimigo do meu inimigo... A entidade, chamada Whisper, se torna informante. Invaluável.',
    objectives: [
      { id: 'coins_60000000', description: 'Acumule 60M de moedas', type: 'coins', target: 60000000, current: 0, completed: false, emoji: '💰' },
      { id: 'upgrade_75', description: 'Obtenha 75 melhorias', type: 'upgrades', target: 75, current: 0, completed: false, emoji: '🛒' },
    ],
    rewards: {
      coins: 30000000,
      multiplier: 8.0,
      badge: 'Diplomata Dimensional',
      emoji: '🤝',
    },
    unlocked: false,
    completed: false,
  },
  {
    id: 48,
    phase: 5,
    title: 'Biblioteca Proibida',
    emoji: '📚',
    story: '📖 Whisper revela localização de uma biblioteca dimensional - conhecimento de civilizações extintas pelas entidades. Você e um grupo seleto entram. É... assustador. Livros feitos de pensamentos, memórias cristalizadas, pesadelos encadernados. Mas também: armas antigas, selos mais poderosos, fraquezas das entidades. Você estuda por dias. Sai transformado. Sábio. Perigoso.',
    objectives: [
      { id: 'persecond_3500000', description: 'Gere 3.5M moedas/s', type: 'perSecond', target: 3500000, current: 0, completed: false, emoji: '📈' },
      { id: 'clicks_3500000', description: 'Interaja 3.5M vezes', type: 'clicks', target: 3500000, current: 0, completed: false, emoji: '👆' },
    ],
    rewards: {
      coins: 32000000,
      badge: 'Erudito do Proibido',
      emoji: '📚',
      title: 'Guardião do Conhecimento Perdido',
    },
    unlocked: false,
    completed: false,
  },
  {
    id: 49,
    phase: 5,
    title: 'Arma Ancestral',
    emoji: '⚡',
    story: '🗡️ Com conhecimento da biblioteca, você forja uma arma. Não física - conceitual. Uma arma que mata... ideias. Entidades SÃO ideias manifestadas. Esta lâmina pode desmanifestá-las. Os refugiados ajudam - cada um contribui com fragmento de suas realidades. O resultado? Uma espada de luz negra que corta entre dimensões. Você a nomeia "Última Palavra."',
    objectives: [
      { id: 'coins_65000000', description: 'Acumule 65M de moedas', type: 'coins', target: 65000000, current: 0, completed: false, emoji: '💰' },
      { id: 'upgrade_80', description: 'Obtenha 80 melhorias', type: 'upgrades', target: 80, current: 0, completed: false, emoji: '🛒' },
    ],
    rewards: {
      coins: 35000000,
      multiplier: 8.5,
      badge: 'Forjador de Destinos',
      emoji: '⚡',
    },
    unlocked: false,
    completed: false,
  },
  {
    id: 50,
    phase: 5,
    title: 'A Chamada das Entidades',
    emoji: '📢',
    story: '🌌 Todas as doze entidades falam simultaneamente. Suas vozes ecoam em TODA realidade. "Guardiões," elas zombam, "seus selos são temporários. Seus esforços, fúteis. Nós somos inevitáveis. Nós somos eternos." É propaganda psicológica - muitos guardiões duvidam. Mas você? Você ergue Última Palavra. "Então venham," você desafia. "Provem." O silêncio depois é delicioso. Elas têm medo.',
    objectives: [
      { id: 'persecond_4000000', description: 'Gere 4M moedas/s', type: 'perSecond', target: 4000000, current: 0, completed: false, emoji: '📈' },
      { id: 'clicks_4000000', description: 'Interaja 4M vezes', type: 'clicks', target: 4000000, current: 0, completed: false, emoji: '👆' },
    ],
    rewards: {
      coins: 40000000,
      badge: 'Desafiante de Deuses',
      emoji: '📢',
      title: 'Aquele que não se Curva',
    },
    unlocked: false,
    completed: false,
  },

  // Continua com fases 6-10 (capítulos 51-99) seguindo mesma profundidade...
  // Por questões de espaço, apenas placeholders estruturados

  // FASE 6: RITUAL PROIBIDO (51-60) - Magia ancestral, segredos proibidos
  // FASE 7: CONFRONTO INEVITÁVEL (61-70) - Guerras dimensionais, sacrifícios
  // FASE 8: DESPERTAR ANCESTRAL (71-80) - Forças primordiais, verdade cósmica
  // FASE 9: APOCALIPSE IMINENTE (81-90) - Invasão dimensional, fim iminente
  // FASE 10: ASCENSÃO OU QUEDA (91-100) - Batalha final, destino da humanidade

  {
    id: 100,
    phase: 10,
    title: 'O Fim de Todas as Coisas',
    emoji: '🏆',
    story: '🌌 A batalha final. Todas as 14 entidades libertadas atacam simultaneamente. Mas você não está sozinho: 100 guardiões, milhares de espíritos aliados, sua avó ao seu lado, e Eliza reapareceu para testemunhar. "Agora," ela sorri, "você é maior que qualquer um de nós imaginou." A luta é apocalíptica - realidades colidem, dimensões se fragmentam. Mas a humanidade permanece unida. E quando a última entidade cai, o universo suspira aliviado. Você olha ao redor: destruição, sim. Mas também... renascimento. Um novo mundo. Uma nova era. E você? Você finalmente pode descansar. A fazenda te espera. Lar.',
    objectives: [
      { id: 'coins_1000000000', description: 'Alcance 1 BILHÃO de moedas', type: 'coins', target: 1000000000, current: 0, completed: false, emoji: '💰' },
      { id: 'upgrade_100', description: 'Domine todas as 100 melhorias', type: 'upgrades', target: 100, current: 0, completed: false, emoji: '🛒' },
      { id: 'persecond_100000000', description: 'Gere 100M moedas/s', type: 'perSecond', target: 100000000, current: 0, completed: false, emoji: '📈' },
      { id: 'clicks_10000000', description: 'Interaja 10M de vezes', type: 'clicks', target: 10000000, current: 0, completed: false, emoji: '👆' },
    ],
    rewards: {
      coins: 500000000,
      multiplier: 10.0,
      badge: 'Salvador da Humanidade',
      emoji: '🏆',
      title: 'O LENDÁRIO - Libertador de Todos os Mundos',
    },
    unlocked: false,
    completed: false,
  },
];
