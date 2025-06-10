'use client';

import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function MemberFilters({ onFilterChange, currentFilters }) {
  const [brokers, setBrokers] = useState([]);
  const [segments, setSegments] = useState([]);
  const [filters, setFilters] = useState(currentFilters);

  useEffect(() => {
    fetchBrokers();
    fetchSegments();
  }, []);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const fetchBrokers = async () => {
    try {
      const response = await api.get('/brokers');
      setBrokers(response.data.brokers);
    } catch (error) {
      console.error('Error fetching brokers:', error);
    }
  };

  const fetchSegments = async () => {
    try {
      const response = await api.get('/segments');
      setSegments(response.data.segments);
    } catch (error) {
      console.error('Error fetching segments:', error);
    }
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = {
      ...filters,
      [filterName]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      broker: '',
      segment: '',
      specialization: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters.broker || filters.segment || filters.specialization;

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Filter Team Members</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-900"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Broker Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Broker
            </label>
            <select
              value={filters.broker}
              onChange={(e) => handleFilterChange('broker', e.target.value)}
              className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Brokers</option>
              {brokers.map(broker => (
                <option key={broker._id} value={broker._id}>
                  {broker.name} ({broker.code})
                </option>
              ))}
            </select>
          </div>

          {/* Segment Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Segment
            </label>
            <select
              value={filters.segment}
              onChange={(e) => handleFilterChange('segment', e.target.value)}
              className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Segments</option>
              {segments.map(segment => (
                <option key={segment._id} value={segment._id}>
                  {segment.name} ({segment.code})
                </option>
              ))}
            </select>
          </div>

          {/* Specialization Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Specialization
            </label>
            <select
              value={filters.specialization}
              onChange={(e) => handleFilterChange('specialization', e.target.value)}
              className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Specializations</option>
              <option value="EQUITY_TRADER">Equity Trader</option>
              <option value="COMMODITY_TRADER">Commodity Trader</option>
              <option value="CURRENCY_TRADER">Currency Trader</option>
              <option value="DERIVATIVES_TRADER">Derivatives Trader</option>
              <option value="ANALYST">Analyst</option>
              <option value="SUPPORT">Support</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">Active filters:</span>
              
              {filters.broker && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                  Broker: {brokers.find(b => b._id === filters.broker)?.name}
                  <button
                    onClick={() => handleFilterChange('broker', '')}
                    className="ml-2 hover:text-indigo-600"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.segment && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Segment: {segments.find(s => s._id === filters.segment)?.name}
                  <button
                    onClick={() => handleFilterChange('segment', '')}
                    className="ml-2 hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.specialization && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Specialization: {filters.specialization.replace(/_/g, ' ')}
                  <button
                    onClick={() => handleFilterChange('specialization', '')}
                    className="ml-2 hover:text-green-600"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}