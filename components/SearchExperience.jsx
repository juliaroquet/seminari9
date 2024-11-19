import React, { useState } from 'react';

const SearchExperience = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <div style={{ padding: '10px', display: 'flex', gap: '10px' }}>
      <input
        type="text"
        placeholder="Buscar por nombre de usuario"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ padding: '8px', flex: 1 }}
      />
      <button onClick={handleSearch} style={{ padding: '8px' }}>
        Buscar
      </button>
    </div>
  );
};

export default SearchExperience;
