import React, { useState } from 'react';

const FilterBar = () => {
  const [expandedSections, setExpandedSections] = useState({
    security: true,
    brand: true,
    year: true,
    price: true
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
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
            <div className="flex items-center">
              <input type="checkbox" id="antivirus" className="mr-2" />
              <label htmlFor="antivirus" className="text-gray-700 cursor-pointer">Antivirus</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="total-protection" className="mr-2" />
              <label htmlFor="total-protection" className="text-gray-700 cursor-pointer">Total Protection</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="internet-security" className="mr-2" />
              <label htmlFor="internet-security" className="text-gray-700 cursor-pointer">Internet Security</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="mobile" className="mr-2" />
              <label htmlFor="mobile" className="text-gray-700 cursor-pointer">Mobile</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="server-security" className="mr-2" />
              <label htmlFor="server-security" className="text-gray-700 cursor-pointer">Server Security</label>
            </div>
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
            <div className="flex items-center">
              <input type="checkbox" id="kaspersky" className="mr-2" />
              <label htmlFor="kaspersky" className="text-gray-700 cursor-pointer">Kaspersky</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="norton" className="mr-2" />
              <label htmlFor="norton" className="text-gray-700 cursor-pointer">Norton</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="mcafee" className="mr-2" />
              <label htmlFor="mcafee" className="text-gray-700 cursor-pointer">McAfee</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="bitdefender" className="mr-2" />
              <label htmlFor="bitdefender" className="text-gray-700 cursor-pointer">Bitdefender</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="avast" className="mr-2" />
              <label htmlFor="avast" className="text-gray-700 cursor-pointer">AVAST</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="avg" className="mr-2" />
              <label htmlFor="avg" className="text-gray-700 cursor-pointer">AVG</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="eset" className="mr-2" />
              <label htmlFor="eset" className="text-gray-700 cursor-pointer">ESET</label>
            </div>
          </div>
        )}
      </div>
      
      {/* Year/License Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => toggleSection('year')}>
          <h3 className="font-semibold text-lg">License Term</h3>
          <svg className={`w-5 h-5 transition-transform ${expandedSections.year ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {expandedSections.year && (
          <div className="space-y-2 pl-2">
            <div className="flex items-center">
              <input type="checkbox" id="1pc-1year" className="mr-2" />
              <label htmlFor="1pc-1year" className="text-gray-700 cursor-pointer">1PC / 1Year</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="1pc-2year" className="mr-2" />
              <label htmlFor="1pc-2year" className="text-gray-700 cursor-pointer">1PC / 2Year</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="3pc-1year" className="mr-2" />
              <label htmlFor="3pc-1year" className="text-gray-700 cursor-pointer">3PC / 1Year</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="3pc-2year" className="mr-2" />
              <label htmlFor="3pc-2year" className="text-gray-700 cursor-pointer">3PC / 2Year</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="5pc-1year" className="mr-2" />
              <label htmlFor="5pc-1year" className="text-gray-700 cursor-pointer">5PC / 1Year</label>
            </div>
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
                <label htmlFor="min-price" className="text-sm text-gray-600">Min ($)</label>
                <input type="number" id="min-price" className="w-full p-1 border border-gray-300 rounded" placeholder="0" />
              </div>
              <div>
                <label htmlFor="max-price" className="text-sm text-gray-600">Max ($)</label>
                <input type="number" id="max-price" className="w-full p-1 border border-gray-300 rounded" placeholder="500" />
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
              Apply
            </button>
          </div>
        )}
      </div>
      
      {/* Reset Filters Button */}
      <button className="w-full border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100 transition">
        Reset Filters
      </button>
    </div>
  );
};

export default FilterBar; 