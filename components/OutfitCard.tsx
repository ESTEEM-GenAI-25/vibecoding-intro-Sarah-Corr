import React, { useMemo } from 'react';
import { Outfit, WardrobeItem } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface OutfitCardProps {
  outfit: Outfit;
  wardrobe: WardrobeItem[];
  onSelect?: () => void;
  onReplace?: () => void;
  isReplacing?: boolean;
}

const OutfitCard: React.FC<OutfitCardProps> = ({ outfit, wardrobe, onSelect, onReplace, isReplacing = false }) => {
  const outfitItems = useMemo(() => {
    return outfit.items
      .map(itemId => wardrobe.find(item => item.id === itemId))
      .filter((item): item is WardrobeItem => !!item);
  }, [outfit, wardrobe]);


  return (
    <div className={'relative bg-white/80 p-4 rounded-xl shadow-md transition-all duration-300 ease-in-out transform hover:shadow-xl hover:scale-105'}>
      {isReplacing && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
            <LoadingSpinner message="Replacing..." />
        </div>
      )}
      <div className={`transition-opacity duration-300 ${isReplacing ? 'opacity-20' : 'opacity-100'}`}>
        <div className="flex space-x-2 mb-3">
            {outfitItems.map(item => (
            <img
                key={item.id}
                src={item.imageUrl}
                alt={item.displayName}
                className="w-16 h-16 object-cover rounded-md shadow-sm"
            />
            ))}
        </div>
        <p className="text-gray-700 text-sm mb-4 min-h-[2.5rem]">{outfit.explanation}</p>
        {(onSelect || onReplace) && (
            <div className="flex justify-end space-x-2">
                {onReplace && (
                    <button
                        onClick={onReplace}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
                        aria-label="Dislike and replace"
                        disabled={isReplacing}
                    >
                    ✖
                    </button>
                )}
                {onSelect && (
                    <button
                        onClick={onSelect}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-500 hover:bg-green-200 transition-colors"
                        aria-label="Like this outfit"
                        disabled={isReplacing}
                    >
                    ✔
                    </button>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default OutfitCard;
