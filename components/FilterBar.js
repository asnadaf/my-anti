import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

const FilterBar = () => {
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    security: [],
    brand: [],
    duration: [],
    minPrice: '',
    maxPrice: '',
  });
  
  const [expandedSections, setExpandedSections] = useState({
    security: true,
    brand: true,
    duration: true,
    price: true
  });
  
  // Duration options - these should come from API but hardcoded for now
  const durationOptions = [
    { id: '1pc-1year', label: '1 PC / 1 Year' },
    { id: '1pc-2year', label: '1 PC / 2 Years' },
    { id: '1pc-3year', label: '1 PC / 3 Years' },
    { id: '3pc-1year', label: '3 PCs / 1 Year' },
    { id: '3pc-2year', label: '3 PCs / 2 Years' },
    { id: '5pc-1year', label: '5 PCs / 1 Year' },
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

  // Initialize filters from URL params when component mounts or router is ready
  useEffect(() => {
    if (!router.isReady) return;
    
    // Only initialize once when router is ready
    if (!initialized) {
      const { security, brand, duration, minPrice, maxPrice } = router.query;
      
      setFilters({
        security: security ? security.split(',') : [],
        brand: brand ? brand.split(',') : [],
        duration: duration ? duration.split(',') : [],
        minPrice: minPrice || '',
        maxPrice: maxPrice || '',
      });
      
      setInitialized(true);
    }
  }, [router.isReady, initialized, router.query]);

  // Update URL with debouncing to prevent rapid re-renders
  const updateURL = useCallback(() => {
    if (!initialized) return;
    
    // Build query parameters starting with current ones
    const queryParams = { ...router.query };
    
    // Update filter params
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
  }, [filters, router, initialized]);
  
  // Use effect to update URL when filters change, with debounce
  useEffect(() => {
    if (!initialized) return;
    
    const timer = setTimeout(() => {
      updateURL();
    }, 500); // 500ms debounce
    
    return () => clearTimeout(timer);
  }, [filters, updateURL, initialized]);

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
    // Intentionally empty, as price filter is applied through the useEffect
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
    <div className="w-full md:w-64 bg-white p-4 shadow-sm rounded-lg">
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <h2 className="text-xl font-bold">Filters</h2>
        {Object.values(filters).some(val => 
          Array.isArray(val) ? val.length > 0 : val !== ''
        ) && (
          <button 
            onClick={resetFilters}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Reset all
          </button>
        )}
      </div>
      
      {/* Security Type Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => toggleSection('security')}>
          <h3 className="font-semibold text-lg">Security Type</h3>
          <div className="flex items-center">
            {filters.security.length > 0 && (
              <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 mr-2">
                {filters.security.length}
              </span>
            )}
            <svg className={`w-5 h-5 transition-transform ${expandedSections.security ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {expandedSections.security && (
          <div className="space-y-2 pl-2">
            {securityOptions.map((option) => (
              <div key={option.id} className="flex items-center">
                <input 
                  type="checkbox" 
                  id={`security-${option.id}`}
                  className="mr-2 h-4 w-4 text-blue-600 rounded" 
                  checked={filters.security.includes(option.id)}
                  onChange={() => handleCheckboxChange('security', option.id)}
                />
                <label htmlFor={`security-${option.id}`} className="text-gray-700 text-sm cursor-pointer">{option.label}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Brand Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => toggleSection('brand')}>
          <h3 className="font-semibold text-lg">Brand</h3>
          <div className="flex items-center">
            {filters.brand.length > 0 && (
              <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 mr-2">
                {filters.brand.length}
              </span>
            )}
            <svg className={`w-5 h-5 transition-transform ${expandedSections.brand ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {expandedSections.brand && (
          <div className="space-y-2 pl-2">
            {brandOptions.map((option) => (
              <div key={option.id} className="flex items-center">
                <input 
                  type="checkbox" 
                  id={`brand-${option.id}`}
                  className="mr-2 h-4 w-4 text-blue-600 rounded" 
                  checked={filters.brand.includes(option.id)}
                  onChange={() => handleCheckboxChange('brand', option.id)}
                />
                <label htmlFor={`brand-${option.id}`} className="text-gray-700 text-sm cursor-pointer">{option.label}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Duration/License Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => toggleSection('duration')}>
          <h3 className="font-semibold text-lg">License Term</h3>
          <div className="flex items-center">
            {filters.duration.length > 0 && (
              <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 mr-2">
                {filters.duration.length}
              </span>
            )}
            <svg className={`w-5 h-5 transition-transform ${expandedSections.duration ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {expandedSections.duration && (
          <div className="space-y-2 pl-2">
            {durationOptions.map((option) => (
              <div key={option.id} className="flex items-center">
                <input 
                  type="checkbox" 
                  id={`duration-${option.id}`}
                  className="mr-2 h-4 w-4 text-blue-600 rounded" 
                  checked={filters.duration.includes(option.id)}
                  onChange={() => handleCheckboxChange('duration', option.id)}
                />
                <label htmlFor={`duration-${option.id}`} className="text-gray-700 text-sm cursor-pointer">{option.label}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Price Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => toggleSection('price')}>
          <h3 className="font-semibold text-lg">Price Range</h3>
          <div className="flex items-center">
            {(filters.minPrice || filters.maxPrice) && (
              <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 mr-2">
                Active
              </span>
            )}
            <svg className={`w-5 h-5 transition-transform ${expandedSections.price ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
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
                  className="w-full p-1 border border-gray-300 rounded text-sm" 
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
                  className="w-full p-1 border border-gray-300 rounded text-sm" 
                  placeholder="500" 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar; 