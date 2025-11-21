
import React, { useEffect } from 'react';
import { Achievement } from '../types';
import { Trophy } from 'lucide-react';

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose }) => {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[60] animate-pop-up">
        <div className="bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-2 border-yellow-400 relative overflow-hidden">
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
            
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center text-2xl shrink-0 shadow-lg border-2 border-white">
                {achievement.icon}
            </div>
            
            <div className="min-w-[180px]">
                <div className="flex items-center gap-2 text-yellow-400 text-xs font-black uppercase tracking-wider mb-1">
                    <Trophy className="w-3 h-3" />
                    解锁新成就
                </div>
                <div className="font-bold text-lg leading-tight">
                    {achievement.title}
                </div>
                <div className="text-gray-400 text-xs mt-0.5">
                    {achievement.description}
                </div>
            </div>
        </div>
    </div>
  );
};
