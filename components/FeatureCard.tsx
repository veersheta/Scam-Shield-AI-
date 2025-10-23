import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-neutral-dark p-6 rounded-2xl border border-neutral-light transform transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-purple hover:border-electric-purple/50">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
};

export default FeatureCard;