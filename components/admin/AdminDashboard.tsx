import React from 'react';
import { MOCK_DASHBOARD_STATS } from '../../constants';
import StatCard from './StatCard';
import AnalyticsChart from './AnalyticsChart';
import { UsersIcon, ShieldCheckIcon, AlertTriangleIcon } from '../icons/Icons';
import DonutChart from './DonutChart';
import RecentReports from './RecentReports';

const AdminDashboard: React.FC = () => {
  const stats = MOCK_DASHBOARD_STATS;

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold text-light-text-primary dark:text-dark-text-primary mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard 
          icon={<UsersIcon className="h-8 w-8 text-status-blue" />}
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
        />
        <StatCard
          icon={<ShieldCheckIcon className="h-8 w-8 text-status-green" />}
          title="Total Scans"
          value={stats.totalScans.toLocaleString()}
        />
        <StatCard
          icon={<AlertTriangleIcon className="h-8 w-8 text-status-yellow" />}
          title="Scam Detection Rate"
          value={`${(stats.scamDetectionRate * 100).toFixed(1)}%`}
          progress={stats.scamDetectionRate * 100}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
            <DonutChart title="Scans by Type" data={stats.scansByType} />
        </div>
        <div className="lg:col-span-2">
            <RecentReports />
        </div>
        <div className="lg:col-span-5">
            <AnalyticsChart title="Top Reported Scams" data={stats.topReportedScams} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
