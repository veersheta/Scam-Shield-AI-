
import React from 'react';

interface ChartData {
  name: string;
  value: number;
}

interface AnalyticsChartProps {
  title: string;
  data: ChartData[];
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ title, data }) => {
  const maxValue = Math.max(...data.map(item => item.value), 0);
  const colors = ['bg-status-blue', 'bg-status-green', 'bg-status-yellow', 'bg-purple-500', 'bg-status-red'];

  return (
    <div className="bg-light-glass dark:bg-dark-glass backdrop-blur-xl p-6 rounded-xl border border-white/20">
      <h3 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary mb-6">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={item.name}>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span className="font-medium text-light-text-secondary dark:text-dark-text-secondary">{item.name}</span>
              <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">{item.value.toLocaleString()}</span>
            </div>
            <div className="w-full bg-light-bg dark:bg-dark-bg rounded-full h-3 ring-1 ring-inset ring-light-border dark:ring-dark-border">
              <div
                className={`${colors[index % colors.length]} h-3 rounded-full transition-all duration-500`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsChart;