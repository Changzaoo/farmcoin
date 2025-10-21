export interface StoryChapter {
  id: number;
  phase: number;
  title: string;
  emoji: string;
  story: string;
  objectives: StoryObjective[];
  rewards: StoryReward;
  unlocked: boolean;
  completed: boolean;
  completedAt?: Date;
}

export interface StoryObjective {
  id: string;
  description: string;
  type: 'coins' | 'upgrades' | 'perSecond' | 'clicks' | 'specific' | 'time';
  target: number;
  current: number;
  completed: boolean;
  emoji: string;
}

export interface StoryReward {
  coins?: number;
  multiplier?: number;
  uniqueUpgrade?: string;
  badge?: string;
  title?: string;
  emoji?: string;
}

export interface StoryProgress {
  currentChapter: number;
  currentPhase: number;
  chaptersCompleted: number;
  totalScore: number;
  badges: string[];
  titles: string[];
  uniqueUpgrades: string[];
  startedAt: Date;
  lastPlayedAt: Date;
}

export interface StoryRanking {
  userId: string;
  username: string;
  currentChapter: number;
  currentPhase: number;
  chaptersCompleted: number;
  totalScore: number;
  completionPercentage: number;
  lastUpdated: Date;
}
