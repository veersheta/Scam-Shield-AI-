
import React, { useState, useContext } from 'react';
import { SCAM_REPORTS_DATA } from '../constants';
import { ScamReport } from '../types';
import ScamReportCard from './ScamReportCard';
import { AuthContext } from '../contexts/AuthContext';

const CommunityHub: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState<ScamReport[]>(SCAM_REPORTS_DATA.sort((a,b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)));
  const [voted, setVoted] = useState<Record<number, 'up' | 'down' | null>>({});
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const handleVote = (id: number, voteType: 'up' | 'down') => {
    if (!user) {
      alert("Please log in to vote on scam reports.");
      return;
    }

    setReports(prevReports => {
      return prevReports.map(report => {
        if (report.id === id) {
          const newReport = { ...report };
          const currentVote = voted[id];

          // Reverting previous vote if it exists
          if (currentVote === 'up') newReport.upvotes--;
          if (currentVote === 'down') newReport.downvotes--;

          // Applying new vote
          if (voteType === currentVote) {
            // User is undoing their vote
            setVoted(prev => ({ ...prev, [id]: null }));
          } else {
            if (voteType === 'up') newReport.upvotes++;
            if (voteType === 'down') newReport.downvotes++;
            setVoted(prev => ({ ...prev, [id]: voteType }));
          }
          return newReport;
        }
        return report;
      });
    });
  };
  
  const handleShare = async (id: number) => {
    const report = reports.find(r => r.id === id);
    if (!report) return;

    const shareData = {
      title: `Scam Alert on ScamShield AI: "${report.title}"`,
      text: `A new scam has been reported on ScamShield AI. Description: "${report.description}". Stay safe!`,
      url: window.location.href, // Shares the main app URL
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        // Share was successful (not cancelled by user)
        setReports(prevReports => prevReports.map(r =>
          r.id === id ? { ...r, shares: r.shares + 1 } : r
        ));
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\nLearn more at: ${shareData.url}`);
        setShareFeedback('Report details copied to clipboard!');
        setReports(prevReports => prevReports.map(r =>
            r.id === id ? { ...r, shares: r.shares + 1 } : r
        ));
        setTimeout(() => setShareFeedback(null), 3000);
      }
    } catch (error) {
      // This block will be entered if the user cancels the share dialog or an error occurs.
      // We don't increment the share count in this case.
      console.log('Share action was cancelled or failed:', error);
    }
  };

  const handleReportScamClick = () => {
    if (user) {
      // Logic for logged-in user to report a scam (e.g., open a modal)
      alert('Feature to report a scam is coming soon!');
    } else {
      alert('Please log in or sign up to report a scam and help the community.');
    }
  };

  return (
    <div className="bg-neutral-dark p-6 md:p-8 rounded-2xl border border-neutral-light">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
            <h3 className="text-2xl font-bold text-text-primary mb-2">Community Knowledge Base</h3>
            <p className="text-text-secondary">Learn from real-world examples of scams reported by the community. Upvote to help others see the most prevalent threats.</p>
        </div>
        <button onClick={handleReportScamClick} className="mt-4 md:mt-0 flex-shrink-0 bg-gradient-to-r from-brand-gradient-from to-brand-gradient-to bg-[size:200%_auto] animate-gradient-x hover:shadow-glow-purple transition-all duration-300 text-white font-bold py-2 px-4 rounded-lg">
          Report a Scam
        </button>
      </div>
      
      {shareFeedback && (
        <div className="mb-4 p-3 bg-soft-mint/10 border border-soft-mint/30 text-soft-mint rounded-lg text-sm text-center transition-opacity duration-300" role="alert">
          {shareFeedback}
        </div>
      )}

      <div className="space-y-6 max-h-[40rem] overflow-y-auto pr-2">
        {reports.map(report => (
          <ScamReportCard
            key={report.id}
            report={report}
            onVote={handleVote}
            onShare={handleShare}
            voteStatus={voted[report.id]}
          />
        ))}
      </div>
    </div>
  );
};

export default CommunityHub;