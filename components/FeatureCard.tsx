
import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-light-glass dark:bg-dark-glass backdrop-blur-xl p-6 rounded-xl border border-light-border/50 dark:border-dark-border/50 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-light dark:hover:shadow-soft-dark hover:border-light-border dark:hover:border-dark-border">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">{title}</h3>
      <p className="text-light-text-secondary dark:text-dark-text-secondary">{description}</p>
    </div>
  );
};

export default FeatureCard;