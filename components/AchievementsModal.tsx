
import React from 'react';
import { Achievement } from '../types';
import { Trophy, X, Lock } from 'lucide-react';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose, achievements }) => {
  if (!isOpen) return null;

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black">成就系统</h2>
              <p className="text-yellow-100 text-xs mt-0.5 font-bold">
                已解锁 {unlockedCount} / {achievements.length}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-3 bg-slate-50">
            {achievements.map((achievement) => (
                <div 
                    key={achievement.id} 
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        achievement.isUnlocked 
                        ? 'bg-white border-yellow-400 shadow-md' 
                        : 'bg-gray-100 border-gray-200 grayscale opacity-70'
                    }`}
                >
                    <div className={`w-14 h-14 flex items-center justify-center text-3xl rounded-full shrink-0 ${
                        achievement.isUnlocked ? 'bg-yellow-100' : 'bg-gray-200'
                    }`}>
                        {achievement.isUnlocked ? achievement.icon : <Lock className="w-6 h-6 text-gray-400" />}
                    </div>
                    <div className="flex-1">
                        <h3 className={`font-bold text-base ${achievement.isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                            {achievement.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                            {achievement.description}
                        </p>
                        {achievement.isUnlocked && achievement.unlockedAt && (
                            <p className="text-[10px] text-orange-500 font-bold mt-1">
                                于 {new Date(achievement.unlockedAt).toLocaleDateString()} 解锁
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
};
