
import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => {
  return (
    <div className="bg-light-glass dark:bg-dark-glass backdrop-blur-xl p-6 rounded-xl border border-white/20 flex items-center space-x-4">
      <div className="bg-light-bg dark:bg-dark-bg p-3 rounded-full ring-1 ring-light-border dark:ring-dark-border">
        {icon}
      </div>
      <div>
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary font-medium">{title}</p>
        <p className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;