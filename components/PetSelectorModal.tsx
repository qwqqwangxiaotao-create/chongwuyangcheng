
import React from 'react';
import { PET_CONFIGS } from '../constants';
import { PetType } from '../types';
import { X, Check } from 'lucide-react';

interface PetSelectorModalProps {
  isOpen: boolean;
  onSelect: (type: PetType, name: string) => void;
  onClose: () => void;
  isInitial?: boolean;
}

export const PetSelectorModal: React.FC<PetSelectorModalProps> = ({ isOpen, onSelect, onClose, isInitial }) => {
  const [selectedType, setSelectedType] = React.useState<PetType | null>(null);
  const [name, setName] = React.useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedType && name.trim()) {
      onSelect(selectedType, name.trim());
      setSelectedType(null);
      setName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-black">
              {isInitial ? '欢迎来到 WonderPets!' : '领养新伙伴'}
            </h2>
            <p className="text-indigo-100 text-sm mt-1">
              {isInitial ? '选择你的第一只宠物开始旅程吧。' : '你已经积累了足够的好感度！'}
            </p>
          </div>
          {!isInitial && (
            <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          
          {/* Grid of Pets */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
            {(Object.keys(PET_CONFIGS) as PetType[]).map((type) => {
              const config = PET_CONFIGS[type];
              const isSelected = selectedType === type;
              
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`relative flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 ${
                    isSelected 
                      ? 'border-indigo-500 bg-indigo-50 scale-105 shadow-md' 
                      : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50'
                  }`}
                >
                  {/* Show Baby Image in Selector */}
                  <img src={config.images.baby} alt={config.displayName} className="w-16 h-16 object-contain mb-2" />
                  
                  <span className="font-bold text-sm text-gray-700">{config.displayName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full mt-1 font-semibold ${config.diet === 'carnivore' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {config.diet === 'carnivore' ? '肉食' : '草食'}
                  </span>
                  
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-indigo-500 text-white rounded-full p-1">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Name Input */}
          <div className="space-y-4">
             <label className="block text-sm font-bold text-gray-700">
                你要给这只{selectedType ? PET_CONFIGS[selectedType].displayName : '宠物'}起什么名字？
             </label>
             <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="输入名字..."
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-lg font-medium"
             />
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
             <button
                onClick={handleConfirm}
                disabled={!selectedType || !name.trim()}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
             >
                确认领养
             </button>
        </div>

      </div>
    </div>
  );
};
