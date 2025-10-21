import React from 'react';
import { ScamReport } from '../types';
import { ArrowUpIcon, ArrowDownIcon, ShareIcon } from './icons/Icons';

interface ScamReportCardProps {
  report: ScamReport;
  onVote: (id: number, type: 'up' | 'down') => void;
  onShare: (id: number) => void;
  voteStatus?: 'up' | 'down' | null;
}

const ScamReportCard: React.FC<ScamReportCardProps> = ({ report, onVote, onShare, voteStatus }) => {
  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };
  
  const scamTypeColors: Record<ScamReport['scamType'], string> = {
    'Phishing': 'bg-blue-500/20 text-blue-400 dark:text-blue-300',
    'Impersonation': 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-300',
    'Investment': 'bg-green-500/20 text-green-600 dark:text-green-300',
    'Job Offer': 'bg-purple-500/20 text-purple-500 dark:text-purple-300',
    'Tech Support': 'bg-red-500/20 text-red-500 dark:text-red-300',
  };

  return (
    <div className="bg-light-bg dark:bg-dark-bg p-5 rounded-xl border border-light-border dark:border-dark-border transition-all duration-300 hover:border-light-accent dark:hover:border-dark-accent hover:shadow-soft-light dark:hover:shadow-soft-dark">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${scamTypeColors[report.scamType]} mb-2 sm:mb-0`}>
          {report.scamType}
        </span>
        <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
          Submitted by {report.submittedBy} &bull; {timeAgo(report.createdAt)}
        </div>
      </div>

      <h4 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary mb-2">{report.title}</h4>
      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">{report.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {report.tags.map(tag => (
          <span key={tag} className="text-xs bg-light-bg-secondary dark:bg-dark-bg-secondary px-2 py-1 rounded text-light-text-secondary dark:text-dark-text-secondary">#{tag}</span>
        ))}
      </div>

      <div className="flex items-center space-x-6 border-t border-light-border dark:border-dark-border pt-3 mt-4 text-light-text-secondary dark:text-dark-text-secondary">
        <div className="flex items-center space-x-1">
          <button onClick={() => onVote(report.id, 'up')} className={`p-1 rounded-full transition-colors ${voteStatus === 'up' ? 'text-status-green bg-green-500/10' : 'hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary'}`} aria-label="Upvote">
            <ArrowUpIcon className="h-5 w-5" />
          </button>
          <span className="font-semibold text-sm w-5 text-center">{report.upvotes - report.downvotes}</span>
          <button onClick={() => onVote(report.id, 'down')} className={`p-1 rounded-full transition-colors ${voteStatus === 'down' ? 'text-status-red bg-red-500/10' : 'hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary'}`} aria-label="Downvote">
            <ArrowDownIcon className="h-5 w-5" />
          </button>
        </div>
        <button onClick={() => onShare(report.id)} className="flex items-center space-x-2 hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors">
          <ShareIcon className="h-5 w-5" />
          <span className="text-sm font-semibold">{report.shares} Shares</span>
        </button>
      </div>
    </div>
  );
};

export default ScamReportCard;