'use client';

import { useState, useEffect } from 'react';
import AddMemberForm from './AddMemberForm';
import MemberList from './MemberList';
import MemberFilters from './MemberFilters';
import api from '../../utils/api';

export default function TeamManagement() {
  const [activeTab, setActiveTab] = useState('list');
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    broker: '',
    segment: '',
    specialization: ''
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [members, filters]);

  const fetchTeamMembers = async () => {
    try {
      const response = await api.get('/users/my-team');
      setMembers(response.data.members);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = members;

    if (filters.broker) {
      filtered = filtered.filter(member => member.broker._id === filters.broker);
    }

    if (filters.segment) {
      filtered = filtered.filter(member => 
        member.segments.some(segment => segment._id === filters.segment)
      );
    }

    if (filters.specialization) {
      filtered = filtered.filter(member => 
        member.memberDetails?.specialization === filters.specialization
      );
    }

    setFilteredMembers(filtered);
  };

  const handleMemberAdded = (newMember) => {
    setMembers(prev => [newMember, ...prev]);
    setActiveTab('list');
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const tabs = [
    { id: 'list', label: 'Team Members', count: members.length },
    { id: 'add', label: 'Add Member' }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          <MemberFilters 
            onFilterChange={handleFilterChange}
            currentFilters={filters}
          />
          <MemberList 
            members={filteredMembers}
            loading={loading}
            onRefresh={fetchTeamMembers}
          />
        </div>
      )}

      {activeTab === 'add' && (
        <AddMemberForm
          onMemberAdded={handleMemberAdded}
          onCancel={() => setActiveTab('list')}
        />
      )}
    </div>
  );
}