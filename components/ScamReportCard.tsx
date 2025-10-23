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
    'Phishing': 'bg-electric-purple/20 text-electric-purple',
    'Impersonation': 'bg-warm-amber/20 text-warm-amber',
    'Investment': 'bg-soft-mint/20 text-text-mint font-bold',
    'Job Offer': 'bg-deep-violet/40 text-electric-purple',
    'Tech Support': 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="bg-charcoal-black p-5 rounded-xl border border-neutral-light transition-all duration-300 hover:border-electric-purple/50 hover:shadow-glow-purple">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${scamTypeColors[report.scamType]} mb-2 sm:mb-0`}>
          {report.scamType}
        </span>
        <div className="text-xs text-text-secondary">
          Submitted by {report.submittedBy} &bull; {timeAgo(report.createdAt)}
        </div>
      </div>

      <h4 className="text-lg font-bold text-text-primary mb-2">{report.title}</h4>
      <p className="text-sm text-text-secondary mb-4">{report.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {report.tags.map(tag => (
          <span key={tag} className="text-xs bg-neutral-dark px-2 py-1 rounded text-text-secondary">#{tag}</span>
        ))}
      </div>

      <div className="flex items-center space-x-6 border-t border-neutral-light pt-3 mt-4 text-text-secondary">
        <div className="flex items-center space-x-1">
          <button onClick={() => onVote(report.id, 'up')} className={`p-1 rounded-full transition-colors ${voteStatus === 'up' ? 'text-soft-mint bg-soft-mint/10' : 'hover:bg-neutral-dark'}`} aria-label="Upvote">
            <ArrowUpIcon className="h-5 w-5" />
          </button>
          <span className="font-semibold text-sm w-5 text-center">{report.upvotes - report.downvotes}</span>
          <button onClick={() => onVote(report.id, 'down')} className={`p-1 rounded-full transition-colors ${voteStatus === 'down' ? 'text-warm-amber bg-warm-amber/10' : 'hover:bg-neutral-dark'}`} aria-label="Downvote">
            <ArrowDownIcon className="h-5 w-5" />
          </button>
        </div>
        <button onClick={() => onShare(report.id)} className="flex items-center space-x-2 hover:text-text-primary transition-colors">
          <ShareIcon className="h-5 w-5" />
          <span className="text-sm font-semibold">{report.shares} Shares</span>
        </button>
      </div>
    </div>
  );
};

export default ScamReportCard;