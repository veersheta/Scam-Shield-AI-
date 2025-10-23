import React from 'react';
import { AnalysisResult } from '../types';
import { LinkIcon } from './icons/Icons';

interface AnalysisResultDisplayProps {
  result: AnalysisResult;
}

const ConfidenceMeter: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  const score = result.confidenceScore * 100;
  const isHighRisk = result.riskLevel === 'High';
  const isMediumRisk = result.riskLevel === 'Medium';

  const determineConfig = () => {
    if (result.isScam) {
      if (isHighRisk) {
        return {
          color: 'text-warm-amber',
          trackColor: 'text-warm-amber/20',
          title: 'High Risk Detected',
          label: `Confident it's a scam`,
        };
      }
      if (isMediumRisk) {
        return {
            color: 'text-warm-amber',
            trackColor: 'text-warm-amber/20',
            title: 'Medium Risk Detected',
            label: `Confident it's a scam`,
        };
      }
      return {
        color: 'text-electric-purple',
        trackColor: 'text-electric-purple/20',
        title: 'Caution Advised',
        label: `Potentially a scam`,
      };
    }
    return {
      color: 'text-soft-mint',
      trackColor: 'text-soft-mint/20',
      title: 'Low Risk',
      label: `Confident it's safe`,
    };
  };

  const config = determineConfig();
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
      <div className="relative w-40 h-40 flex-shrink-0">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle
            className={config.trackColor}
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
          <circle
            className={`${config.color} transition-all duration-1000 ease-out`}
            strokeWidth="10"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`text-4xl font-bold ${config.color}`}>{score.toFixed(0)}%</span>
            <span className="text-sm text-text-secondary font-semibold mt-1">{config.label}</span>
        </div>
      </div>
      <div className="text-center md:text-left">
        <h3 className="text-2xl font-bold text-text-primary">{config.title}</h3>
        <p className="text-text-secondary mt-2">{result.explanation}</p>
      </div>
    </div>
  );
};


const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ result }) => {
  return (
    <div className="mt-6 p-6 rounded-2xl bg-neutral-dark border border-neutral-light shadow-card">
      <ConfidenceMeter result={result} />
      {result.sources && result.sources.length > 0 && (
        <div className="mt-6 pt-4 border-t border-neutral-light">
          <h4 className="font-semibold text-text-secondary mb-2 flex items-center">
            <LinkIcon className="h-4 w-4 mr-2"/>
            Referenced Sources
          </h4>
          <ul className="space-y-2">
            {result.sources.map((source, index) => (
              <li key={index}>
                <a 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-electric-purple hover:underline break-all transition-colors"
                >
                  {source.title || source.uri}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AnalysisResultDisplay;