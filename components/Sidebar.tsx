
import React from 'react';
import { OwnedPet } from '../types';
import { PET_CONFIGS } from '../constants';
import { Lock, Trophy, Volume2, VolumeX } from 'lucide-react';

interface SidebarProps {
  pets: OwnedPet[];
  activePetId: string | null;
  onSelectPet: (id: string) => void;
  unlockProgress: number;
  unlockThreshold: number;
  onOpenAchievements: () => void;
  hasPendingAchievements?: boolean;
  isMusicEnabled: boolean;
  onToggleMusic: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
    pets, 
    activePetId, 
    onSelectPet, 
    unlockProgress, 
    unlockThreshold,
    onOpenAchievements,
    isMusicEnabled,
    onToggleMusic
}) => {
  return (
    <div className="w-full md:w-24 md:h-screen bg-white border-r border-gray-100 flex md:flex-col items-center py-4 px-2 gap-4 md:overflow-y-auto overflow-x-auto shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 order-last md:order-first">
      
      {pets.map((pet) => {
        const config = PET_CONFIGS[pet.type];
        const isActive = activePetId === pet.id;
        
        return (
          <button
            key={pet.id}
            onClick={() => onSelectPet(pet.id)}
            className={`relative flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200 border-2 ${
              isActive 
                ? 'bg-indigo-100 border-indigo-500 shadow-inner' 
                : 'bg-gray-50 border-transparent hover:bg-gray-100'
            }`}
            title={pet.name}
          >
            {config.emoji}
            {isActive && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-indigo-500" />}
          </button>
        );
      })}

      {/* Unlock Progress Indicator */}
      <div className="relative w-16 h-16 flex-shrink-0 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center group">
        <div className="absolute inset-x-0 bottom-0 bg-green-100 rounded-b-xl transition-all duration-500" 
             style={{ height: `${Math.min(100, (unlockProgress / unlockThreshold) * 100)}%` }} />
        
        <div className="relative z-10 flex flex-col items-center">
            {unlockProgress >= unlockThreshold ? (
                <span className="animate-bounce text-xl">🎁</span>
            ) : (
                <Lock className="w-5 h-5 text-gray-400" />
            )}
            <span className="text-[10px] font-bold text-gray-500 mt-1">
                {unlockProgress}/{unlockThreshold}
            </span>
        </div>
      </div>
      
      <div className="md:mt-auto flex flex-col gap-4">
          
          {/* Achievement Button */}
          <button 
            onClick={onOpenAchievements}
            className="relative w-16 h-16 flex-shrink-0 rounded-2xl flex flex-col items-center justify-center bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-200 hover:border-yellow-400 text-yellow-600 transition-all group"
            title="成就"
          >
              <Trophy className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold mt-1">成就</span>
          </button>

          {/* Music Toggle Button */}
          <button 
            onClick={onToggleMusic}
            className={`relative w-16 h-16 flex-shrink-0 rounded-2xl flex flex-col items-center justify-center border-2 transition-all group ${
                isMusicEnabled 
                ? 'bg-rose-50 hover:bg-rose-100 border-rose-200 hover:border-rose-400 text-rose-600' 
                : 'bg-gray-100 border-gray-200 text-gray-400 hover:bg-gray-200'
            }`}
            title={isMusicEnabled ? "关闭音乐" : "开启音乐"}
          >
              {isMusicEnabled ? (
                  <Volume2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
              ) : (
                  <VolumeX className="w-6 h-6 group-hover:scale-110 transition-transform" />
              )}
              <span className="text-[10px] font-bold mt-1">{isMusicEnabled ? '音乐开' : '音乐关'}</span>
          </button>

      </div>

    </div>
  );
};
