import React, { useState, useCallback } from 'react';
import { WardrobeItem } from '../types';

interface WardrobeProps {
  wardrobe: WardrobeItem[];
  setWardrobe: React.Dispatch<React.SetStateAction<WardrobeItem[]>>;
}

const Wardrobe: React.FC<WardrobeProps> = ({ wardrobe, setWardrobe }) => {
  const [displayName, setDisplayName] = useState('');
  const [category, setCategory] = useState<'top' | 'jacket' | 'pants' | 'shoes' | 'accessory'>('top');
  const [tags, setTags] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);

  const handleAddItems = useCallback(() => {
    if (!files || files.length === 0) {
      alert('Please select one or more image files.');
      return;
    }

    // Fix: Explicitly type `file` as `File` to resolve TypeScript inference issues.
    const newItems: WardrobeItem[] = Array.from(files).map((file: File, index) => ({
      id: `${Date.now()}-${index}`,
      filename: file.name,
      displayName: displayName || file.name.split('.')[0],
      category: category,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      imageUrl: URL.createObjectURL(file),
    }));

    setWardrobe(prev => [...prev, ...newItems]);

    // Reset form
    setDisplayName('');
    setTags('');
    setFiles(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }, [files, displayName, category, tags, setWardrobe]);

  return (
    <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">My Wardrobe</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">Clothing Images</label>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
          />
        </div>
        <div>
          <label htmlFor="display-name" className="block text-sm font-medium text-gray-700">Display Name (optional)</label>
          <input
            id="display-name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g., Blue Denim Jacket"
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500"
          >
            <option value="top">Top</option>
            <option value="jacket">Jacket</option>
            <option value="pants">Pants</option>
            <option value="shoes">Shoes</option>
            <option value="accessory">Accessory</option>
          </select>
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., cotton, relaxed, white"
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500"
          />
        </div>
        <button
          onClick={handleAddItems}
          className="w-full bg-gradient-to-r from-rose-500 to-orange-400 text-white font-bold py-2.5 px-6 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-100 transition-all duration-300"
        >
          Add to Wardrobe
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 pt-4">
        {wardrobe.map(item => (
          <div key={item.id} className="group relative">
            <img src={item.imageUrl} alt={item.displayName} className="aspect-square w-full h-full object-cover rounded-lg shadow-sm"/>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex flex-col justify-end p-2 text-white text-xs">
              <p className="font-bold truncate">{item.displayName}</p>
              <p className="capitalize">{item.category}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Wardrobe;