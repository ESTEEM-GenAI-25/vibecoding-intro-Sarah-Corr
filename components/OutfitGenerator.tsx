import React, { useState, useCallback } from 'react';
import { WardrobeItem, Outfit } from '../types';
import { generateOutfitsWithGemini } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import OutfitCard from './OutfitCard';

interface OutfitGeneratorProps {
  wardrobe: WardrobeItem[];
  mood: string;
  occasion: string;
  weather: string;
}

const OutfitGenerator: React.FC<OutfitGeneratorProps> = ({ wardrobe, mood, occasion, weather }) => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (wardrobe.length === 0) {
      setError('Add some items to your wardrobe first so I can create outfits for you.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutfits([]);
    setSelectedOutfit(null);

    try {
      const result = await generateOutfitsWithGemini(wardrobe, mood, occasion, weather, 2);
      if (!result || result.outfits.length === 0) {
        throw new Error('Gemini did not return any outfits.');
      }
      setOutfits(result.outfits);
    } catch (err) {
      console.error(err);
      setError('We couldn’t generate outfits. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [wardrobe, mood, occasion, weather]);

  const handleReplaceOutfit = useCallback(async (indexToReplace: number) => {
    setReplacingIndex(indexToReplace);
    setError(null);
    
    try {
        const result = await generateOutfitsWithGemini(wardrobe, mood, occasion, weather, 1, outfits);
        if (!result || result.outfits.length === 0) {
            throw new Error('Could not generate a replacement.');
        }
        const newOutfit = result.outfits[0];
        setOutfits(currentOutfits => {
            const newOutfits = [...currentOutfits];
            newOutfits[indexToReplace] = newOutfit;
            return newOutfits;
        });
    } catch (err) {
        console.error(err);
        setError('Could not get a replacement outfit. Please try again.');
    } finally {
        setReplacingIndex(null);
    }
  }, [wardrobe, mood, occasion, weather, outfits]);

  const handleSelectOutfit = (outfitToSelect: Outfit) => {
    setSelectedOutfit(outfitToSelect);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner message="Generating outfits..." />;
    }
    if (error && outfits.length === 0 && !selectedOutfit) {
      return <p className="text-center text-red-500">{error}</p>;
    }
    if (selectedOutfit) {
      return (
        <div className="w-full max-w-md mx-auto space-y-4">
            <h3 className="text-xl font-bold text-center text-gray-700">Today's Outfit</h3>
            <OutfitCard
                outfit={selectedOutfit}
                wardrobe={wardrobe}
            />
        </div>
      );
    }
    if (outfits.length > 0) {
      return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {outfits.map((outfit, index) => (
            <OutfitCard
              key={index}
              outfit={outfit}
              wardrobe={wardrobe}
              isReplacing={replacingIndex === index}
              onReplace={() => handleReplaceOutfit(index)}
              onSelect={() => handleSelectOutfit(outfit)}
            />
          ))}
          {error && <p className="md:col-span-2 text-center text-red-500 mt-4">{error}</p>}
        </div>
      );
    }
    return (
        <p className="text-center text-gray-500">
            Click "Generate Outfits" to see AI suggestions here.
        </p>
    );
  };

  return (
    <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">AI Outfit Feed</h2>
        <button
          onClick={handleGenerate}
          disabled={isLoading || replacingIndex !== null}
          className="bg-gradient-to-r from-rose-500 to-orange-400 text-white font-bold py-2.5 px-6 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading ? 'Generating...' : 'Generate Outfits'}
        </button>
      </div>

      <div className="min-h-[20rem] flex flex-col items-center justify-center">
        {renderContent()}
      </div>
    </section>
  );
};

export default OutfitGenerator;
