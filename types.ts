
export type PetType = 'cat' | 'dog' | 'rabbit' | 'dino' | 'bird' | 'hamster' | 'panda';

export type FoodType = 'herbivore' | 'carnivore';

export interface PetConfig {
  type: PetType;
  displayName: string;
  emoji: string;
  diet: FoodType;
  images: {
    baby: string;
    youth: string;
  };
  description: string;
  color: string;
}

export interface OwnedPet {
  id: string;
  type: PetType;
  name: string;
  affection: number;
  hunger: number; // 0-100
  cleanliness: number; // 0-100
  lastInteraction: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: number;
}

export interface GameState {
  ownedPets: OwnedPet[];
  activePetId: string | null;
  unlockProgress: number; // Accumulates up to 40
  totalInteractions: number;
  achievements: Achievement[];
}

export interface LogEntry {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
