
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 md:px-8 text-center bg-white/30 backdrop-blur-sm">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400">
        StyleSync
      </h1>
      <p className="mt-2 text-gray-600">
        AI-powered outfit assistant based on your real wardrobe
      </p>
    </header>
  );
};

export default Header;
