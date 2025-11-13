
import React from 'react';

interface ContextSelectorProps {
  mood: string;
  setMood: (value: string) => void;
  occasion: string;
  setOccasion: (value: string) => void;
  weather: string;
  setWeather: (value: string) => void;
}

const ContextSelector: React.FC<ContextSelectorProps> = ({
  mood,
  setMood,
  occasion,
  setOccasion,
  weather,
  setWeather,
}) => {
  return (
    <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Today's Context</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="mood" className="block text-sm font-medium text-gray-700">Mood</label>
          <select
            id="mood"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500"
          >
            <option>Relaxed</option>
            <option>Energetic</option>
            <option>Tired</option>
            <option>Bloated</option>
            <option>Confident</option>
          </select>
        </div>
        <div>
          <label htmlFor="occasion" className="block text-sm font-medium text-gray-700">Occasion</label>
          <select
            id="occasion"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500"
          >
            <option>Casual Outing</option>
            <option>Work</option>
            <option>Meeting</option>
            <option>Night Out</option>
            <option>At Home</option>
          </select>
        </div>
        <div>
          <label htmlFor="weather" className="block text-sm font-medium text-gray-700">Weather</label>
          <input
            id="weather"
            type="text"
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            placeholder="e.g., 20°C, light rain"
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500"
          />
        </div>
      </div>
    </section>
  );
};

export default ContextSelector;
