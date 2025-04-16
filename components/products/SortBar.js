import React from 'react';

const SortBar = ({ totalProducts, sortOption, onSortChange }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-3 rounded-lg shadow-sm mb-4">
      <div className="mb-2 sm:mb-0 text-sm">
        <span className="text-gray-600">Showing</span>
        <span className="font-semibold mx-1">{totalProducts}</span>
        <span className="text-gray-600">results</span>
      </div>
      
      <div className="flex items-center">
        <label htmlFor="sort-by" className="text-gray-600 text-sm mr-2">Sort by:</label>
        <select
          id="sort-by"
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
          className="border border-gray-300 rounded p-1 text-sm bg-white text-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="relevance">Relevance</option>
          <option value="price-low">Price (Low to High)</option>
          <option value="price-high">Price (High to Low)</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="newest">Newest First</option>
        </select>
      </div>
    </div>
  );
};

export default SortBar; 