import { StoryChapter } from '../types/story';
import { campaign1Chapters, STORY_PHASES } from './storyChapters';
import { campaign2Chapters, STORY_PHASES_CAMPAIGN_2 } from './storyCampaign2';

export interface StoryCampaign {
  id: string;
  name: string;
  description: string;
  emoji: string;
  theme: string;
  chapters: StoryChapter[];
  phases: Array<{ id: number; name: string; emoji: string; description: string }>;
}

export const CAMPAIGNS: StoryCampaign[] = [
  {
    id: 'cursed-farm',
    name: 'A Fazenda Maldita',
    description: 'Uma jornada sombria através de terras amaldiçoadas, onde cada escolha define seu destino.',
    emoji: '🌙',
    theme: 'Terror e Mistério',
    chapters: campaign1Chapters,
    phases: STORY_PHASES,
  },
  {
    id: 'rebirth',
    name: 'Renascimento',
    description: 'Reconstrua a civilização das cinzas, evoluindo de ferramentas primitivas até tecnologias espaciais.',
    emoji: '🌍',
    theme: 'Esperança e Progresso',
    chapters: campaign2Chapters,
    phases: STORY_PHASES_CAMPAIGN_2,
  },
];

export const getCampaignById = (id: string): StoryCampaign | undefined => {
  return CAMPAIGNS.find(c => c.id === id);
};

export const getDefaultCampaign = (): StoryCampaign => {
  return CAMPAIGNS[0];
};
