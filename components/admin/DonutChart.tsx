import React from 'react';

interface ChartData {
  name: string;
  value: number;
}

interface DonutChartProps {
  title: string;
  data: ChartData[];
}

const DonutChart: React.FC<DonutChartProps> = ({ title, data }) => {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  const colors = ['#9B59B6', '#A3E4D7', '#F39C12', '#6A1B9A', '#3B0A57']; // electric-purple, soft-mint, warm-amber, etc.
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  let accumulatedOffset = 0;

  return (
    <div className="bg-neutral-dark p-6 rounded-2xl border border-neutral-light h-full shadow-card">
      <h3 className="text-xl font-bold text-text-primary mb-6">{title}</h3>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative flex-shrink-0">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="20"
              className="text-neutral-light"
            />
            {data.map((item, index) => {
              const percentage = (item.value / totalValue) * 100;
              const offset = (accumulatedOffset / 100) * circumference;
              const dasharray = `${(percentage / 100) * circumference} ${circumference}`;
              accumulatedOffset += percentage;
              return (
                <circle
                  key={item.name}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="transparent"
                  stroke={colors[index % colors.length]}
                  strokeWidth="20"
                  strokeDasharray={dasharray}
                  strokeDashoffset={-offset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-text-primary">
              {totalValue.toLocaleString()}
            </span>
            <span className="text-sm text-text-secondary">Total</span>
          </div>
        </div>
        <div className="w-full">
          <ul className="space-y-2">
            {data.map((item, index) => {
               const percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
              return (
                <li key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <span
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    ></span>
                    <span className="text-text-secondary">{item.name}</span>
                  </div>
                  <span className="font-semibold text-text-primary">{percentage.toFixed(1)}%</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DonutChart;