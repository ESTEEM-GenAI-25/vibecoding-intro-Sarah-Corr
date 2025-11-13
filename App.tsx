
import React, { useState } from 'react';
import { WardrobeItem } from './types';
import Header from './components/Header';
import Wardrobe from './components/Wardrobe';
import ContextSelector from './components/ContextSelector';
import OutfitGenerator from './components/OutfitGenerator';
import ShopAssist from './components/ShopAssist';

const App: React.FC = () => {
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  const [mood, setMood] = useState('relaxed');
  const [occasion, setOccasion] = useState('casual outing');
  const [weather, setWeather] = useState('20°C, sunny');
  const [shoppingGoal, setShoppingGoal] = useState('I need more professional clothes');

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-white to-teal-100 text-gray-800">
      <Header />
      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-8">
            <Wardrobe wardrobe={wardrobe} setWardrobe={setWardrobe} />
            <ContextSelector
              mood={mood}
              setMood={setMood}
              occasion={occasion}
              setOccasion={setOccasion}
              weather={weather}
              setWeather={setWeather}
            />
          </div>
          <div className="lg:col-span-8 space-y-8">
            <OutfitGenerator
              wardrobe={wardrobe}
              mood={mood}
              occasion={occasion}
              weather={weather}
            />
            <ShopAssist
              wardrobe={wardrobe}
              shoppingGoal={shoppingGoal}
              setShoppingGoal={setShoppingGoal}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
