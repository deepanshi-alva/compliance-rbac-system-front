'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../utils/api';

export default function AddMemberForm({ onMemberAdded, onCancel }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [brokers, setBrokers] = useState([]);
  const [segments, setSegments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    broker: '',
    segments: [],
    memberDetails: {
      experience: '',
      specialization: '',
      targetAmount: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: ''
      }
    }
  });

  // Fetch brokers and segments on component mount
  useEffect(() => {
    fetchBrokers();
    fetchSegments();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        memberDetails: {
          ...prev.memberDetails,
          address: {
            ...prev.memberDetails.address,
            [addressField]: value
          }
        }
      }));
    } else if (name.startsWith('memberDetails.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        memberDetails: {
          ...prev.memberDetails,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSegmentChange = (segmentId) => {
    setFormData(prev => ({
      ...prev,
      segments: prev.segments.includes(segmentId)
        ? prev.segments.filter(id => id !== segmentId)
        : [...prev.segments, segmentId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/users/members', formData);
      
      setSuccess('Member added successfully!');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        broker: '',
        segments: [],
        memberDetails: {
          experience: '',
          specialization: '',
          targetAmount: '',
          phone: '',
          address: {
            street: '',
            city: '',
            state: '',
            pincode: ''
          }
        }
      });

      // Notify parent component
      if (onMemberAdded) {
        onMemberAdded(response.data.member);
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Add New Team Member</h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Broker Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Broker</label>
          <select
            name="broker"
            required
            value={formData.broker}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a broker</option>
            {brokers.map(broker => (
              <option key={broker._id} value={broker._id}>
                {broker.name} ({broker.code})
              </option>
            ))}
          </select>
        </div>

        {/* Segment Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trading Segments (Select multiple)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {segments.map(segment => (
              <label key={segment._id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.segments.includes(segment._id)}
                  onChange={() => handleSegmentChange(segment._id)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {segment.name} ({segment.code})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Professional Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
            <input
              type="number"
              name="memberDetails.experience"
              min="0"
              value={formData.memberDetails.experience}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Specialization</label>
            <select
              name="memberDetails.specialization"
              value={formData.memberDetails.specialization}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select specialization</option>
              <option value="EQUITY_TRADER">Equity Trader</option>
              <option value="COMMODITY_TRADER">Commodity Trader</option>
              <option value="CURRENCY_TRADER">Currency Trader</option>
              <option value="DERIVATIVES_TRADER">Derivatives Trader</option>
              <option value="ANALYST">Analyst</option>
              <option value="SUPPORT">Support</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Target Amount</label>
            <input
              type="number"
              name="memberDetails.targetAmount"
              min="0"
              value={formData.memberDetails.targetAmount}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="memberDetails.phone"
              value={formData.memberDetails.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Address</h4>
          
          <div>
            <input
              type="text"
              name="address.street"
              placeholder="Street Address"
              value={formData.memberDetails.address.street}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="address.city"
              placeholder="City"
              value={formData.memberDetails.address.city}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            
            <input
              type="text"
              name="address.state"
              placeholder="State"
              value={formData.memberDetails.address.state}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            
            <input
              type="text"
              name="address.pincode"
              placeholder="Pincode"
              value={formData.memberDetails.address.pincode}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Member'}
          </button>
        </div>
      </form>
    </div>
  );
}