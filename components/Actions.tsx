import React, { useState } from 'react';
import { FoodType, PetConfig } from '../types';
import { Hand, ShowerHead, Utensils, Drumstick, Leaf } from 'lucide-react';

interface ActionsProps {
  onFeed: (type: FoodType) => void;
  onBathe: () => void;
  onPet: () => void;
  petConfig: PetConfig;
  disabled: boolean;
}

export const Actions: React.FC<ActionsProps> = ({ onFeed, onBathe, onPet, petConfig, disabled }) => {
  const [showFoodMenu, setShowFoodMenu] = useState(false);

  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-md mx-auto mt-8 px-4">
      
      {/* Feed Action */}
      <div className="relative">
        <button
            onClick={() => setShowFoodMenu(!showFoodMenu)}
            disabled={disabled}
            className="w-full aspect-square flex flex-col items-center justify-center bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-2xl transition-all shadow-sm border-b-4 border-orange-200 active:border-b-0 active:translate-y-1 disabled:opacity-50"
        >
            <Utensils className="w-8 h-8 mb-2" />
            <span className="font-bold">喂食</span>
        </button>

        {showFoodMenu && (
            <div className="absolute bottom-full mb-2 left-0 w-full bg-white rounded-xl shadow-lg border border-gray-100 p-2 flex flex-col gap-2 z-20 animate-fade-in-up">
                <button 
                    onClick={() => { onFeed('carnivore'); setShowFoodMenu(false); }}
                    className="flex items-center gap-2 p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors text-left"
                >
                    <Drumstick className="w-5 h-5" />
                    <span className="text-sm font-bold">肉食饲料</span>
                </button>
                <button 
                    onClick={() => { onFeed('herbivore'); setShowFoodMenu(false); }}
                    className="flex items-center gap-2 p-2 hover:bg-green-50 rounded-lg text-green-600 transition-colors text-left"
                >
                    <Leaf className="w-5 h-5" />
                    <span className="text-sm font-bold">草食饲料</span>
                </button>
            </div>
        )}
      </div>

      {/* Bathe Action */}
      <button
        onClick={onBathe}
        disabled={disabled}
        className="w-full aspect-square flex flex-col items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-2xl transition-all shadow-sm border-b-4 border-blue-200 active:border-b-0 active:translate-y-1 disabled:opacity-50"
      >
        <ShowerHead className="w-8 h-8 mb-2" />
        <span className="font-bold">洗澡</span>
      </button>

      {/* Pet Action */}
      <button
        onClick={onPet}
        disabled={disabled}
        className="w-full aspect-square flex flex-col items-center justify-center bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-2xl transition-all shadow-sm border-b-4 border-rose-200 active:border-b-0 active:translate-y-1 disabled:opacity-50"
      >
        <Hand className="w-8 h-8 mb-2" />
        <span className="font-bold">抚摸</span>
      </button>
    </div>
  );
};