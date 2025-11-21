
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, OwnedPet, FoodType, PetType, Achievement } from './types';
import { AFFECTION_VALUES, UNLOCK_THRESHOLD, PET_CONFIGS, ACHIEVEMENTS_LIST } from './constants';
import { generatePetReaction } from './services/geminiService';
import { PetDisplay } from './components/PetDisplay';
import { Actions } from './components/Actions';
import { PetSelectorModal } from './components/PetSelectorModal';
import { Sidebar } from './components/Sidebar';
import { NewPetCelebration } from './components/NewPetCelebration';
import { AchievementsModal } from './components/AchievementsModal';
import { AchievementToast } from './components/AchievementToast';
import { Sparkles, Plus } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('wonderpets_state');
    if (saved) {
        const parsed = JSON.parse(saved);
        // Migration logic for existing saves without achievements
        if (!parsed.achievements) {
            parsed.achievements = ACHIEVEMENTS_LIST;
        } else {
            // Merge in case we added new achievements to constants that aren't in local storage
            const existingIds = new Set(parsed.achievements.map((a: Achievement) => a.id));
            const newAchievements = ACHIEVEMENTS_LIST.filter(a => !existingIds.has(a.id));
            parsed.achievements = [...parsed.achievements, ...newAchievements];
        }
        return parsed;
    }
    return {
      ownedPets: [],
      activePetId: null,
      unlockProgress: 0,
      totalInteractions: 0,
      achievements: ACHIEVEMENTS_LIST,
    };
  });

  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [activePetReaction, setActivePetReaction] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [newlyAdoptedPet, setNewlyAdoptedPet] = useState<OwnedPet | null>(null);
  const [justUnlockedAchievement, setJustUnlockedAchievement] = useState<Achievement | null>(null);

  // Music State
  const [isMusicEnabled, setIsMusicEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('wonderpets_music');
    return saved ? JSON.parse(saved) : false; // Default to false for better UX (opt-in)
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicEnabledRef = useRef(isMusicEnabled);

  // Keep ref in sync for event listeners
  useEffect(() => {
    musicEnabledRef.current = isMusicEnabled;
  }, [isMusicEnabled]);

  // --- Audio Initialization & Autoplay Handling ---
  useEffect(() => {
    // NOTE: The user provided an HTML link which cannot be played directly.
    // Switched to a "Ukulele" style track which is very popular for cute/kids themes.
    // Source: Bensound via CodePen Assets (Reliable CDN)
    const audio = new Audio('https://assets.codepen.io/21542/bensound-ukulele.mp3');
    audio.loop = true;
    audio.volume = 0.3; // Lower volume for background comfort
    audioRef.current = audio;

    // Function to attempt playback
    const tryPlay = () => {
        if (musicEnabledRef.current && audio.paused) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Autoplay prevented. Waiting for interaction.", error);
                });
            }
        }
    };

    // Attempt initial play
    tryPlay();

    // Fallback: unlock audio on first user interaction if it failed
    const handleInteraction = () => {
        if (audio.paused && musicEnabledRef.current) {
            audio.play().catch(() => {});
        }
        // We can remove these listeners once the user has interacted once
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('keydown', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
        audio.pause();
        audioRef.current = null;
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  // --- Audio Toggle Control ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMusicEnabled) {
        // If enabling, try to play. If it fails (e.g. no interaction yet), 
        // the global click listener from the mount effect or a new click will handle it.
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => console.log("Playback failed:", e));
        }
    } else {
        audio.pause();
    }
    
    localStorage.setItem('wonderpets_music', JSON.stringify(isMusicEnabled));
  }, [isMusicEnabled]);


  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('wonderpets_state', JSON.stringify(gameState));
  }, [gameState]);

  // --- Initial Setup ---
  useEffect(() => {
    if (gameState.ownedPets.length === 0) {
      setIsSelectorOpen(true);
    }
  }, [gameState.ownedPets.length]);

  // --- Derived State ---
  const activePet = gameState.ownedPets.find(p => p.id === gameState.activePetId);
  const activeConfig = activePet ? PET_CONFIGS[activePet.type] : null;

  // --- Achievement Logic ---
  const checkAchievements = (currentPets: OwnedPet[], totalInteractions: number) => {
     setGameState(prev => {
        let hasUpdates = false;
        const updatedAchievements = prev.achievements.map(ach => {
            if (ach.isUnlocked) return ach;

            let unlocked = false;
            
            if (ach.id === 'first_meet' && currentPets.length >= 1) unlocked = true;
            if (ach.id === 'care_novice' && totalInteractions >= 50) unlocked = true;
            if (ach.id === 'psychologist' && currentPets.some(p => p.affection >= 250)) unlocked = true;
            if (ach.id === 'collector') {
                const uniqueTypes = new Set(currentPets.map(p => p.type));
                if (uniqueTypes.size >= Object.keys(PET_CONFIGS).length) unlocked = true;
            }

            if (unlocked) {
                hasUpdates = true;
                const newAch = { ...ach, isUnlocked: true, unlockedAt: Date.now() };
                // Trigger toast
                setJustUnlockedAchievement(newAch);
                return newAch;
            }
            return ach;
        });

        if (hasUpdates) {
            return { ...prev, achievements: updatedAchievements };
        }
        return prev;
     });
  };

  // --- Helpers ---
  const updatePet = useCallback((petId: string, updates: Partial<OwnedPet>) => {
    setGameState(prev => {
        const nextPets = prev.ownedPets.map(p => p.id === petId ? { ...p, ...updates } : p);
        return {
            ...prev,
            ownedPets: nextPets
        };
    });
  }, []);

  // Effect to check achievements whenever pets or interactions change
  useEffect(() => {
    checkAchievements(gameState.ownedPets, gameState.totalInteractions);
  }, [gameState.ownedPets, gameState.totalInteractions]);


  const handleAffectionGain = (amount: number) => {
     setGameState(prev => {
         const newProgress = prev.unlockProgress + amount;
         let shouldOpenModal = false;
         let adjustedProgress = newProgress;

         if (newProgress >= UNLOCK_THRESHOLD) {
            shouldOpenModal = true;
            adjustedProgress = newProgress - UNLOCK_THRESHOLD; 
         }

         if (shouldOpenModal) {
             setTimeout(() => setIsSelectorOpen(true), 500); 
         }

         return {
             ...prev,
             unlockProgress: adjustedProgress
         };
     });
  };

  // --- Actions ---
  const handleAction = async (type: 'feed' | 'bathe' | 'pet', foodType?: FoodType) => {
    if (!activePet || !activeConfig || isLoadingAI) return;

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);

    let affectionChange = 0;
    let reactionContext = '';

    // 1. Logic Calculation
    if (type === 'feed') {
      if (foodType === activeConfig.diet) {
        affectionChange = AFFECTION_VALUES.FEED;
        reactionContext = `吃了美味的 ${foodType === 'carnivore' ? '肉类' : '植物'}。`;
      } else {
        affectionChange = 1; 
        reactionContext = `有些失望。吃了 ${foodType === 'carnivore' ? '肉类' : '植物'} 但它其实想吃 ${activeConfig.diet === 'carnivore' ? '肉类' : '植物'}。`;
      }
    } else if (type === 'bathe') {
      affectionChange = AFFECTION_VALUES.BATHE;
      reactionContext = '洗了个舒服的澡。';
    } else if (type === 'pet') {
      affectionChange = AFFECTION_VALUES.PET;
      reactionContext = '享受了主人的抚摸。';
    }

    // 2. Update State
    setGameState(prev => ({ ...prev, totalInteractions: prev.totalInteractions + 1 }));

    updatePet(activePet.id, {
        affection: activePet.affection + affectionChange,
        lastInteraction: Date.now()
    });
    handleAffectionGain(affectionChange);

    // 3. AI Reaction
    setIsLoadingAI(true);
    const reaction = await generatePetReaction(
        activeConfig, 
        type, 
        activePet.affection + affectionChange, 
        reactionContext
    );
    setActivePetReaction(reaction);
    setIsLoadingAI(false);
  };

  // --- Pet Adoption ---
  const handleAdopt = (type: PetType, name: string) => {
    const newPet: OwnedPet = {
      id: Date.now().toString(),
      type,
      name,
      affection: 0,
      hunger: 50,
      cleanliness: 50,
      lastInteraction: Date.now(),
    };

    setGameState(prev => ({
      ...prev,
      ownedPets: [...prev.ownedPets, newPet],
      activePetId: newPet.id,
    }));
    
    setIsSelectorOpen(false);
    setNewlyAdoptedPet(newPet);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 text-gray-800 font-sans overflow-hidden">
      
      {/* Sidebar / Navigation */}
      <Sidebar 
        pets={gameState.ownedPets} 
        activePetId={gameState.activePetId} 
        onSelectPet={(id) => setGameState(prev => ({...prev, activePetId: id}))}
        unlockProgress={gameState.unlockProgress}
        unlockThreshold={UNLOCK_THRESHOLD}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        isMusicEnabled={isMusicEnabled}
        onToggleMusic={() => setIsMusicEnabled(!isMusicEnabled)}
      />

      {/* Main Game Area */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-6 overflow-hidden">
        
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full opacity-50 pointer-events-none z-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200 rounded-full blur-3xl mix-blend-multiply animate-pulse" />
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-200 rounded-full blur-3xl mix-blend-multiply animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {activePet && activeConfig ? (
          <div className="z-10 w-full max-w-2xl flex flex-col items-center justify-between h-full max-h-[800px]">
             
             {/* Header Info */}
             <div className="w-full flex justify-between items-center mb-4">
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                    WonderPets
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                    <span className="text-xs font-bold text-gray-500">解锁进度:</span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                            style={{ width: `${(gameState.unlockProgress / UNLOCK_THRESHOLD) * 100}%`}}
                        />
                    </div>
                    <span className="text-xs font-bold text-green-600">{gameState.unlockProgress}/{UNLOCK_THRESHOLD}</span>
                </div>
             </div>

            <div className="flex-1 flex flex-col justify-center w-full">
                <PetDisplay 
                    pet={activePet} 
                    config={activeConfig} 
                    isAnimating={isAnimating}
                    message={activePetReaction}
                />
            </div>

            <div className="w-full pb-8">
                <Actions 
                    onFeed={(food) => handleAction('feed', food)}
                    onBathe={() => handleAction('bathe')}
                    onPet={() => handleAction('pet')}
                    petConfig={activeConfig}
                    disabled={isAnimating || isLoadingAI}
                />
            </div>

          </div>
        ) : (
           <div className="text-center">
              <Sparkles className="w-12 h-12 text-indigo-300 mx-auto mb-4 animate-spin-slow" />
              <p className="text-gray-400 font-medium">正在准备你的乐园...</p>
           </div>
        )}

        {!isSelectorOpen && gameState.unlockProgress >= UNLOCK_THRESHOLD && (
            <button 
                onClick={() => setIsSelectorOpen(true)}
                className="absolute top-6 right-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-pink-500/30 transition-all animate-bounce flex items-center gap-2 font-bold z-20"
            >
                <Plus className="w-5 h-5" />
                领取新宠物!
            </button>
        )}

      </main>

      {/* Modals */}
      <PetSelectorModal 
        isOpen={isSelectorOpen} 
        onSelect={handleAdopt} 
        onClose={() => setIsSelectorOpen(false)}
        isInitial={gameState.ownedPets.length === 0}
      />

      <AchievementsModal 
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        achievements={gameState.achievements}
      />

      {/* Overlays/Toasts */}
      {newlyAdoptedPet && (
        <NewPetCelebration 
            pet={newlyAdoptedPet}
            onClose={() => setNewlyAdoptedPet(null)}
        />
      )}

      {justUnlockedAchievement && (
        <AchievementToast 
            achievement={justUnlockedAchievement} 
            onClose={() => setJustUnlockedAchievement(null)} 
        />
      )}

    </div>
  );
};

export default App;
