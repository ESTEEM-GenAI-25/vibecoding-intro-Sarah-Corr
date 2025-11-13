
export interface WardrobeItem {
  id: string;
  filename: string;
  displayName: string;
  category: 'top' | 'jacket' | 'pants' | 'shoes' | 'accessory';
  tags: string[];
  imageUrl: string;
}

export interface Outfit {
  items: string[];
  explanation: string;
}

export interface GeneratedOutfits {
    outfits: Outfit[];
}

export interface ShopSuggestion {
  name: string;
  reason: string;
  url: string;
}

export interface GeneratedShopSuggestions {
    suggestions: ShopSuggestion[];
}
