
import React from 'react';
import { AnalysisResult } from '../types';
import { AlertTriangleIcon, CheckCircleIcon, ShieldAlertIcon, LinkIcon } from './icons/Icons';

interface AnalysisResultDisplayProps {
  result: AnalysisResult;
}

const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ result }) => {
  const riskConfig = {
    Low: {
      icon: <CheckCircleIcon className="h-10 w-10 text-status-green" />,
      title: 'Low Risk Detected',
      glassClass: 'bg-status-green/10',
      borderClass: 'border-status-green/30',
      textClass: 'text-status-green',
    },
    Medium: {
      icon: <AlertTriangleIcon className="h-10 w-10 text-status-yellow" />,
      title: 'Medium Risk Detected',
      glassClass: 'bg-status-yellow/10',
      borderClass: 'border-status-yellow/30',
      textClass: 'text-status-yellow',
    },
    High: {
      icon: <ShieldAlertIcon className="h-10 w-10 text-status-red" />,
      title: 'High Risk Detected',
      glassClass: 'bg-status-red/10',
      borderClass: 'border-status-red/30',
      textClass: 'text-status-red',
    },
    Unknown: {
      icon: <AlertTriangleIcon className="h-10 w-10 text-light-text-secondary dark:text-dark-text-secondary" />,
      title: 'Analysis Complete',
      glassClass: 'bg-gray-500/10',
      borderClass: 'border-gray-500/30',
      textClass: 'text-light-text-secondary dark:text-dark-text-secondary',
    },
  };

  const config = riskConfig[result.riskLevel] || riskConfig.Unknown;

  return (
    <div className={`mt-6 p-6 rounded-xl border ${config.glassClass} ${config.borderClass} backdrop-blur-xl`}>
      <div className="flex items-start space-x-4">
        <div>{config.icon}</div>
        <div>
          <h3 className={`text-2xl font-bold text-light-text-primary dark:text-dark-text-primary`}>{config.title}</h3>
          <p className={`mt-1 ${config.textClass}`}>
            Confidence: <span className="font-semibold">{Math.round(result.confidenceScore * 100)}%</span>
          </p>
        </div>
      </div>
      <div className="mt-4 pl-0 md:pl-14">
        <p className="text-light-text-secondary dark:text-dark-text-secondary">{result.explanation}</p>
      </div>
      {result.sources && result.sources.length > 0 && (
        <div className="mt-6 pt-4 border-t border-light-border dark:border-dark-border md:pl-14">
          <h4 className="font-semibold text-light-text-secondary dark:text-dark-text-secondary mb-2 flex items-center">
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
                  className="text-sm text-light-accent dark:text-dark-accent hover:underline break-all transition-colors"
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