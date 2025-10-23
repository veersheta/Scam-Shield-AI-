import React from 'react';
import { SCAM_REPORTS_DATA } from '../../constants';
import { ScamReport } from '../../types';

const RecentReports: React.FC = () => {
    // Get the 4 most recent reports by sorting by date
    const recentReports = [...SCAM_REPORTS_DATA]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4);

    const scamTypeColors: Record<ScamReport['scamType'], string> = {
        'Phishing': 'bg-electric-purple/20 text-electric-purple',
        'Impersonation': 'bg-warm-amber/20 text-warm-amber',
        'Investment': 'bg-soft-mint/20 text-soft-mint',
        'Job Offer': 'bg-deep-violet/40 text-electric-purple',
        'Tech Support': 'bg-red-500/20 text-red-400',
    };

    return (
        <div className="bg-neutral-dark p-6 rounded-2xl border border-neutral-light h-full shadow-card">
            <h3 className="text-xl font-bold text-text-primary mb-4">Recent Community Reports</h3>
            <div className="space-y-4">
                {recentReports.map(report => (
                    <div key={report.id} className="p-3 bg-charcoal-black rounded-lg border border-neutral-light">
                        <p className="font-semibold text-sm text-text-primary truncate">{report.title}</p>
                        <div className="flex items-center justify-between mt-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${scamTypeColors[report.scamType] || ''}`}>
                                {report.scamType}
                            </span>
                            <span className="text-xs text-text-secondary">{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentReports;