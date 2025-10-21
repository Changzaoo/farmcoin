import { StoryChapter } from '../types/story';
import { chapters_1_10 } from './storyChapters_1_10_new';

/**
 *  A FAZENDA MALDITA - História Épica de Terror e Superação
 * 
 * Uma narrativa sombria sobre ambição, mistérios ancestrais e a luta pela sobrevivência
 * em uma fazenda que guarda segredos terríveis. Cada capítulo revela mais sobre a
 * maldição que assombra estas terras e o preço que deve ser pago pela ganância.
 */

export const STORY_PHASES = [
  { id: 1, name: ' A Chegada', emoji: '', description: 'O início da jornada sombria' },
];

// APENAS CAPÍTULOS 1-10 COM SISTEMA NOVO DE LOJA
export const storyChapters: StoryChapter[] = [
  ...chapters_1_10,
];

// Exportar para compatibilidade com campaigns.ts
export const campaign1Chapters = storyChapters;
