
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
  const colors = ['bg-electric-purple', 'bg-soft-mint', 'bg-warm-amber', 'bg-deep-violet', 'bg-pink-500'];

  return (
    <div className="bg-neutral-dark p-6 rounded-2xl border border-neutral-light shadow-card">
      <h3 className="text-xl font-bold text-text-primary mb-6">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={item.name}>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span className="font-medium text-text-secondary">{item.name}</span>
              <span className="font-semibold text-text-primary">{item.value.toLocaleString()}</span>
            </div>
            <div className="w-full bg-charcoal-black rounded-full h-3 ring-1 ring-inset ring-neutral-light">
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