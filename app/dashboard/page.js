'use client';

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import Dashboard from '../../components/dashboard/Dashboard';
import TeamManagement from '../../components/tl/TeamManagement.js';

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');

  const getSections = () => {
    const sections = [
      { id: 'overview', label: 'Overview', icon: '📊' }
    ];

    if (user?.role === 'tl') {
      sections.push(
        { id: 'team', label: 'Team Management', icon: '👥' }
      );
    }

    if (['admin', 'super_admin'].includes(user?.role)) {
      sections.push(
        { id: 'admin', label: 'Admin Panel', icon: '⚙️' }
      );
    }

    return sections;
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'team':
        return <TeamManagement />;
      case 'admin':
        return <div>Admin Panel Content</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user?.firstName} {user?.lastName}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Role: {user?.role?.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-sm text-gray-500">
                  ID: {user?.employeeId}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="-mb-px flex space-x-8">
              {getSections().map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`${
                    activeSection === section.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {renderContent()}
        </div>
      </div>
    </ProtectedRoute>
  );
}