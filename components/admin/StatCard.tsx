import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  progress?: number; // 0-100
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, progress }) => {
  const getProgressColor = () => {
    if (progress === undefined) return '';
    if (title.toLowerCase().includes('users')) return 'bg-status-blue';
    if (title.toLowerCase().includes('scans')) return 'bg-status-green';
    if (title.toLowerCase().includes('rate')) {
        if (progress > 75) return 'bg-status-green';
        if (progress > 50) return 'bg-status-yellow';
        return 'bg-status-red';
    }
    return 'bg-light-accent dark:bg-dark-accent';
  };

  return (
    <div className="bg-light-glass dark:bg-dark-glass backdrop-blur-xl p-6 rounded-xl border border-white/20 flex flex-col justify-between">
      <div className="flex items-center space-x-4">
        <div className="bg-light-bg dark:bg-dark-bg p-3 rounded-full ring-1 ring-light-border dark:ring-dark-border">
          {icon}
        </div>
        <div>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary font-medium">{title}</p>
          <p className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">{value}</p>
        </div>
      </div>
      {progress !== undefined && (
        <div className="mt-4">
          <div className="w-full bg-light-bg dark:bg-dark-bg rounded-full h-2.5 ring-1 ring-inset ring-light-border dark:ring-dark-border">
            <div
              className={`${getProgressColor()} h-2.5 rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
