import React from 'react';
import { SCAM_REPORTS_DATA } from '../../constants';

const RecentReports: React.FC = () => {
    // Get the 4 most recent reports by sorting by date
    const recentReports = [...SCAM_REPORTS_DATA]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4);

    const scamTypeColors: { [key: string]: string } = {
        'Phishing': 'bg-blue-500/20 text-blue-400 dark:text-blue-300 border-blue-500/30',
        'Impersonation': 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-300 border-yellow-500/30',
        'Investment': 'bg-green-500/20 text-green-600 dark:text-green-300 border-green-500/30',
        'Job Offer': 'bg-purple-500/20 text-purple-500 dark:text-purple-300 border-purple-500/30',
        'Tech Support': 'bg-red-500/20 text-red-500 dark:text-red-300 border-red-500/30',
    };

    return (
        <div className="bg-light-glass dark:bg-dark-glass backdrop-blur-xl p-6 rounded-xl border border-white/20 h-full">
            <h3 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">Recent Community Reports</h3>
            <div className="space-y-4">
                {recentReports.map(report => (
                    <div key={report.id} className="p-3 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border">
                        <p className="font-semibold text-sm text-light-text-primary dark:text-dark-text-primary truncate">{report.title}</p>
                        <div className="flex items-center justify-between mt-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${scamTypeColors[report.scamType] || ''}`}>
                                {report.scamType}
                            </span>
                            <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentReports;
