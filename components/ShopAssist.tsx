
import React, { useState, useCallback } from 'react';
import { WardrobeItem, ShopSuggestion } from '../types';
import { generateShopSuggestionsWithGemini } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface ShopAssistProps {
  wardrobe: WardrobeItem[];
  shoppingGoal: string;
  setShoppingGoal: (goal: string) => void;
}

const ShopAssist: React.FC<ShopAssistProps> = ({ wardrobe, shoppingGoal, setShoppingGoal }) => {
  const [suggestions, setSuggestions] = useState<ShopSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (wardrobe.length === 0) {
      setError('Add items to your wardrobe first for better shopping suggestions.');
      return;
    }
    if (!shoppingGoal.trim()) {
      setError('Please enter a shopping goal.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const result = await generateShopSuggestionsWithGemini(wardrobe, shoppingGoal);
      if (!result || result.suggestions.length === 0) {
        throw new Error('Gemini did not return any suggestions.');
      }
      setSuggestions(result.suggestions);
    } catch (err) {
      console.error(err);
      setError('We couldn’t find suggestions. Try again in a moment.');
    } finally {
      setIsLoading(false);
    }
  }, [wardrobe, shoppingGoal]);

  return (
    <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Shop Assist</h2>
      <div className="space-y-2">
        <label htmlFor="shopping-goal" className="block text-sm font-medium text-gray-700">Shopping Goal</label>
        <input
          id="shopping-goal"
          type="text"
          value={shoppingGoal}
          onChange={(e) => setShoppingGoal(e.target.value)}
          placeholder="e.g., I need more professional clothes"
          className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500"
        />
      </div>
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-teal-400 to-sky-500 text-white font-bold py-2.5 px-6 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      >
        {isLoading ? 'Finding...' : 'Find New Items'}
      </button>

      <div className="min-h-[10rem] pt-4">
        {isLoading && <LoadingSpinner message="Finding suggestions..." />}
        {error && !isLoading && <p className="text-center text-red-500">{error}</p>}
        {!isLoading && !error && suggestions.length === 0 && (
          <p className="text-center text-gray-500">
            Shopping suggestions will appear here.
          </p>
        )}
        {!isLoading && suggestions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((item, index) => (
              <div key={index} className="bg-white/80 p-4 rounded-xl shadow-md transition transform hover:scale-105 hover:shadow-xl">
                <h4 className="font-bold text-gray-800">{item.name}</h4>
                <p className="text-sm text-gray-600 my-2">{item.reason}</p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-rose-600 hover:text-rose-800"
                >
                  Shop Now &rarr;
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopAssist;
