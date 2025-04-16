import React, { memo } from 'react';

const SortBar = ({ totalProducts, sortOption, onSortChange }) => {
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'newest', label: 'Newest' },
  ];
  
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm flex flex-col xs:flex-row justify-between items-start xs:items-center mb-3 text-sm">
      <div className="mb-2 xs:mb-0">
        <span className="text-gray-600">
          {totalProducts} {totalProducts === 1 ? 'product' : 'products'} found
        </span>
      </div>
      
      <div className="flex items-center">
        <label htmlFor="sort-select" className="mr-2 text-gray-600">Sort by:</label>
        <select
          id="sort-select"
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default memo(SortBar); 