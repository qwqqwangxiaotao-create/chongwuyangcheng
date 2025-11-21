import React, { useEffect, useState } from 'react';
import { OwnedPet } from '../types';
import { PET_CONFIGS } from '../constants';
import { Sparkles, Award, Calendar, Fingerprint, Check } from 'lucide-react';

interface NewPetCelebrationProps {
  pet: OwnedPet;
  onClose: () => void;
}

export const NewPetCelebration: React.FC<NewPetCelebrationProps> = ({ pet, onClose }) => {
  const config = PET_CONFIGS[pet.type];
  const date = new Date(parseInt(pet.id)).toLocaleDateString('zh-CN');
  
  // Generate random confetti particles
  const [particles, setParticles] = useState<{id: number, x: number, y: number, color: string, delay: string, duration: string}[]>([]);

  useEffect(() => {
    const colors = ['#F87171', '#60A5FA', '#34D399', '#FBBF24', '#A78BFA'];
    const newParticles = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -20 - Math.random() * 50, // Start above screen
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: `${Math.random() * 2}s`,
      duration: `${3 + Math.random() * 2}s`
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
       
       {/* Confetti Layer */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p) => (
             <div
               key={p.id}
               className="absolute w-2.5 h-2.5 rounded-sm"
               style={{
                 left: `${p.x}%`,
                 top: `${p.y}%`,
                 backgroundColor: p.color,
                 animation: `confetti-fall ${p.duration} linear infinite`,
                 animationDelay: p.delay
               }}
             />
          ))}
       </div>
       
       {/* Identity Card */}
       <div className="bg-white relative w-full max-w-[360px] rounded-[32px] shadow-2xl overflow-hidden animate-pop-up transform transition-all border-4 border-white ring-4 ring-indigo-500/20">
          
          {/* Card Header / Decoration */}
          <div className={`absolute top-0 left-0 w-full h-36 bg-gradient-to-br ${config.color.replace('text-', 'from-').replace('border-', 'to-').replace('bg-', '').split(' ')[0]} to-white opacity-90`}></div>
          
          {/* Holographic/Shine Effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-30 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center pt-8 px-6 pb-8">
             
             {/* Title Tag */}
             <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm flex items-center gap-2 text-indigo-900 font-black tracking-wider uppercase text-xs mb-6 border border-indigo-50">
                <Award className="w-3 h-3 text-indigo-500" /> 宠物身份证
             </div>

             {/* Pet Avatar Circle */}
             <div className="relative mb-4 group">
                {/* Glowing background behind pet */}
                <div className={`absolute inset-0 rounded-full blur-xl opacity-60 transform scale-110 animate-pulse ${config.color.replace('text-', 'bg-').split(' ')[0]}`}></div>
                
                <div className="relative w-32 h-32 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-[6px] border-white flex items-center justify-center overflow-visible">
                    <img src={config.images.baby} alt={config.displayName} className="w-24 h-24 object-contain animate-float drop-shadow-lg" />
                </div>

                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 p-1.5 rounded-full shadow-lg border-2 border-white animate-bounce">
                    <Sparkles className="w-5 h-5 fill-white text-white" />
                </div>
             </div>

             {/* Pet Info */}
             <h2 className="text-3xl font-black text-gray-800 mb-1 tracking-tight">{pet.name}</h2>
             <div className={`px-3 py-1 rounded-full text-xs font-bold ${config.color} mb-6`}>
                {config.displayName}
             </div>

             {/* Details Table */}
             <div className="w-full bg-slate-50 rounded-2xl p-4 flex flex-col gap-3 border border-slate-100 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Fingerprint className="w-24 h-24" />
                </div>

                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> 领养日期
                    </span>
                    <span className="font-bold text-slate-700 text-sm">{date}</span>
                </div>
                
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                        <Fingerprint className="w-3 h-3" /> 性格特征
                    </span>
                    <p className="font-medium text-slate-600 text-sm leading-relaxed">
                        {config.description}
                    </p>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between items-end">
                     <div className="text-[10px] text-slate-400 font-mono">ID: {pet.id.slice(-8).toUpperCase()}</div>
                     <div className="text-indigo-300 font-handwriting italic text-sm transform -rotate-6">Authorized</div>
                </div>
             </div>

             {/* Action Button */}
             <button 
                onClick={onClose}
                className="w-full py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-lg shadow-xl shadow-gray-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
             >
                <span className="group-hover:translate-x-1 transition-transform">带{pet.name}回家</span>
                <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
             </button>

          </div>
       </div>
    </div>
  );
};