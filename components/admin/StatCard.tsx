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
    if (title.toLowerCase().includes('rate')) {
        if (progress > 75) return 'bg-soft-mint';
        if (progress > 50) return 'bg-warm-amber';
        return 'bg-red-500'; // Using a distinct red for low rates
    }
    return 'bg-electric-purple';
  };

  return (
    <div className="bg-neutral-dark p-6 rounded-2xl border border-neutral-light flex flex-col justify-between shadow-card">
      <div className="flex items-center space-x-4">
        <div className="bg-charcoal-black p-3 rounded-full ring-1 ring-neutral-light">
          {icon}
        </div>
        <div>
          <p className="text-sm text-text-secondary font-medium">{title}</p>
          <p className="text-2xl font-bold text-text-primary">{value}</p>
        </div>
      </div>
      {progress !== undefined && (
        <div className="mt-4">
          <div className="w-full bg-charcoal-black rounded-full h-2.5 ring-1 ring-inset ring-neutral-light">
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