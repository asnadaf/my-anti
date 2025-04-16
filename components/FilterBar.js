import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const FilterBar = () => {
  const router = useRouter();
  const { query } = router;
  
  // Filter states
  const [filters, setFilters] = useState({
    security: query.security ? query.security.split(',') : [],
    brand: query.brand ? query.brand.split(',') : [],
    duration: query.duration ? query.duration.split(',') : [],
    minPrice: query.minPrice || '',
    maxPrice: query.maxPrice || '',
  });
  
  const [expandedSections, setExpandedSections] = useState({
    security: true,
    brand: true,
    duration: true,
    price: true
  });
  
  // Duration options - these should come from API but hardcoded for now
  const durationOptions = [
    { id: '1pc-1year', label: '1PC / 1Year' },
    { id: '1pc-2year', label: '1PC / 2Year' },
    { id: '1pc-3year', label: '1PC / 3Year' },
    { id: '3pc-1year', label: '3PC / 1Year' },
    { id: '3pc-2year', label: '3PC / 2Year' },
    { id: '5pc-1year', label: '5PC / 1Year' },
  ];

  // Security feature options - from Product model
  const securityOptions = [
    { id: 'antivirus', label: 'Antivirus' },
    { id: 'total-protection', label: 'Total Protection' },
    { id: 'internet-security', label: 'Internet Security' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'server-security', label: 'Server Security' },
  ];

  // Brand options - from Product model
  const brandOptions = [
    { id: 'kaspersky', label: 'Kaspersky' },
    { id: 'norton', label: 'Norton' },
    { id: 'mcafee', label: 'McAfee' },
    { id: 'bitdefender', label: 'Bitdefender' },
    { id: 'avast', label: 'AVAST' },
    { id: 'avg', label: 'AVG' },
    { id: 'eset', label: 'ESET' },
  ];

  // Update URL when filters change
  useEffect(() => {
    // Don't update on initial load
    if (Object.keys(query).length === 0 && 
        filters.security.length === 0 && 
        filters.brand.length === 0 && 
        filters.duration.length === 0 && 
        filters.minPrice === '' && 
        filters.maxPrice === '') {
      return;
    }
    
    // Build query parameters
    const queryParams = { ...query };
    
    // Add or remove filter params
    if (filters.security.length > 0) {
      queryParams.security = filters.security.join(',');
    } else {
      delete queryParams.security;
    }
    
    if (filters.brand.length > 0) {
      queryParams.brand = filters.brand.join(',');
    } else {
      delete queryParams.brand;
    }
    
    if (filters.duration.length > 0) {
      queryParams.duration = filters.duration.join(',');
    } else {
      delete queryParams.duration;
    }
    
    if (filters.minPrice) {
      queryParams.minPrice = filters.minPrice;
    } else {
      delete queryParams.minPrice;
    }
    
    if (filters.maxPrice) {
      queryParams.maxPrice = filters.maxPrice;
    } else {
      delete queryParams.maxPrice;
    }
    
    // Update URL without refreshing page
    router.push({
      pathname: router.pathname,
      query: queryParams,
    }, undefined, { shallow: true });
    
  }, [filters]);

  // Toggle section expand/collapse
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Handle checkbox change
  const handleCheckboxChange = (filterType, value) => {
    setFilters(prevFilters => {
      // Check if the value is already in the array
      const isValueSelected = prevFilters[filterType].includes(value);
      
      // Create a new array based on whether we're adding or removing
      const newValues = isValueSelected
        ? prevFilters[filterType].filter(item => item !== value)
        : [...prevFilters[filterType], value];
      
      // Return the updated state
      return {
        ...prevFilters,
        [filterType]: newValues
      };
    });
  };

  // Handle price input changes
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply price filter
  const applyPriceFilter = () => {
    // Price filter is already applied through the useEffect
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      security: [],
      brand: [],
      duration: [],
      minPrice: '',
      maxPrice: '',
    });
  };

  return (
    <div className="w-full md:w-64 border-r border-gray-200 bg-white p-4 shadow-sm rounded-lg">
      <h2 className="text-xl font-bold border-b pb-2 mb-4">Filters</h2>
      
      {/* Security Type Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => toggleSection('security')}>
          <h3 className="font-semibold text-lg">Security</h3>
          <svg className={`w-5 h-5 transition-transform ${expandedSections.security ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {expandedSections.security && (
          <div className="space-y-2 pl-2">
            {securityOptions.map((option) => (
              <div key={option.id} className="flex items-center">
                <input 
                  type="checkbox" 
                  id={option.id} 
                  className="mr-2" 
                  checked={filters.security.includes(option.id)}
                  onChange={() => handleCheckboxChange('security', option.id)}
                />
                <label htmlFor={option.id} className="text-gray-700 cursor-pointer">{option.label}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Brand Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => toggleSection('brand')}>
          <h3 className="font-semibold text-lg">Brand</h3>
          <svg className={`w-5 h-5 transition-transform ${expandedSections.brand ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {expandedSections.brand && (
          <div className="space-y-2 pl-2">
            {brandOptions.map((option) => (
              <div key={option.id} className="flex items-center">
                <input 
                  type="checkbox" 
                  id={option.id} 
                  className="mr-2" 
                  checked={filters.brand.includes(option.id)}
                  onChange={() => handleCheckboxChange('brand', option.id)}
                />
                <label htmlFor={option.id} className="text-gray-700 cursor-pointer">{option.label}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Duration/License Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => toggleSection('duration')}>
          <h3 className="font-semibold text-lg">License Term</h3>
          <svg className={`w-5 h-5 transition-transform ${expandedSections.duration ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {expandedSections.duration && (
          <div className="space-y-2 pl-2">
            {durationOptions.map((option) => (
              <div key={option.id} className="flex items-center">
                <input 
                  type="checkbox" 
                  id={option.id} 
                  className="mr-2" 
                  checked={filters.duration.includes(option.id)}
                  onChange={() => handleCheckboxChange('duration', option.id)}
                />
                <label htmlFor={option.id} className="text-gray-700 cursor-pointer">{option.label}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Price Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => toggleSection('price')}>
          <h3 className="font-semibold text-lg">Price Range</h3>
          <svg className={`w-5 h-5 transition-transform ${expandedSections.price ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {expandedSections.price && (
          <div className="pl-2">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label htmlFor="minPrice" className="text-sm text-gray-600">Min ($)</label>
                <input 
                  type="number" 
                  id="minPrice" 
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handlePriceChange}
                  className="w-full p-1 border border-gray-300 rounded" 
                  placeholder="0" 
                />
              </div>
              <div>
                <label htmlFor="maxPrice" className="text-sm text-gray-600">Max ($)</label>
                <input 
                  type="number" 
                  id="maxPrice" 
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handlePriceChange}
                  className="w-full p-1 border border-gray-300 rounded" 
                  placeholder="500" 
                />
              </div>
            </div>
            <button 
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              onClick={applyPriceFilter}
            >
              Apply
            </button>
          </div>
        )}
      </div>
      
      {/* Reset Filters Button */}
      <button 
        className="w-full border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100 transition"
        onClick={resetFilters}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default FilterBar; 