
import React, { useEffect, useState } from 'react';
import { OwnedPet, PetConfig } from '../types';
import { Heart, Sparkles, Crown, Baby } from 'lucide-react';

interface PetDisplayProps {
  pet: OwnedPet;
  config: PetConfig;
  isAnimating: boolean;
  message: string | null;
}

export const PetDisplay: React.FC<PetDisplayProps> = ({ pet, config, isAnimating, message }) => {
  const [localMessage, setLocalMessage] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (message) {
      setLocalMessage(message);
      const timer = setTimeout(() => setLocalMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Reset error state when pet changes
  useEffect(() => {
    setImgError(false);
  }, [config.type]);

  // Evolution Logic
  const isYouth = pet.affection >= 200;
  const currentImage = isYouth ? config.images.youth : config.images.baby;
  const currentLevel = isYouth ? 2 : 1;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4 relative">
      
      {/* Status Bars */}
      <div className="w-full grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/60 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-white/60 flex flex-col items-center justify-center transition-transform hover:scale-105">
            <div className="flex items-center gap-2 mb-1 text-sm font-bold text-gray-500 uppercase tracking-wider">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> 好感度
            </div>
            <div className="text-3xl font-black text-rose-600">
                {pet.affection}
            </div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-white/60 flex flex-col items-center justify-center transition-transform hover:scale-105">
             <div className="flex items-center gap-2 mb-1 text-sm font-bold text-gray-500 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500" /> 等级
            </div>
            <div className="text-3xl font-black text-yellow-600 flex items-center gap-2">
                {currentLevel}
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold uppercase">
                   {isYouth ? '青年' : '幼年'}
                </span>
            </div>
        </div>
      </div>

      {/* Main Pet Area */}
      <div className={`relative group ${isAnimating ? 'animate-bounce-short' : 'animate-float'}`}>
        
        {/* Background Blob/Glow */}
        <div className={`absolute inset-0 rounded-full blur-3xl opacity-40 transform scale-110 transition-colors duration-500 ${config.color.replace('text-', 'bg-').split(' ')[0]}`}></div>
        
        {/* Pet Image Container */}
        <div className="relative w-72 h-72 flex items-center justify-center z-10">
            {!imgError ? (
                <img 
                    key={currentImage} // Force re-render on image change for animation
                    src={currentImage} 
                    alt={config.displayName}
                    className={`w-full h-full object-contain drop-shadow-2xl transition-all duration-500 hover:scale-110 ${isYouth ? 'scale-110' : 'scale-95'}`}
                    onError={() => setImgError(true)}
                />
            ) : (
                <div className="text-[150px] leading-none select-none filter drop-shadow-xl">
                    {config.emoji}
                </div>
            )}
            
            {/* Evolution Badge Effect */}
            {isYouth && (
                <div className="absolute -bottom-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse flex items-center gap-1">
                    <Crown className="w-3 h-3" /> 
                    Lv.2
                </div>
            )}
             {!isYouth && (
                <div className="absolute -bottom-4 right-4 bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                    <Baby className="w-3 h-3" /> 
                    Lv.1
                </div>
            )}
        </div>
        
        {/* Speech Bubble */}
        {localMessage && (
             <div className="absolute -top-6 -right-4 bg-white px-6 py-4 rounded-3xl rounded-bl-none shadow-xl border border-indigo-50 animate-fade-in z-20 max-w-[220px]">
                <p className="text-base text-gray-800 font-bold leading-snug text-center">
                    {localMessage}
                </p>
            </div>
        )}
      </div>

      <div className="text-center mt-10">
        <h2 className="text-4xl font-black text-gray-800 tracking-tight mb-2 drop-shadow-sm">
            {pet.name}
        </h2>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${config.color}`}>
            {config.displayName}
        </div>
      </div>

    </div>
  );
};
